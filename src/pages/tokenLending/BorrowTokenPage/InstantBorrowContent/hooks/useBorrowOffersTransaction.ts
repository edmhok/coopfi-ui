import { useMemo, useState } from 'react'

import { CollateralToken, core } from '@coopfi/api/tokens'
import { useBanxNotificationsSider } from '@coopfi/components/BanxNotifications'
import {
  SubscribeNotificationsModal,
  createLoanSubscribeNotificationsContent,
  createLoanSubscribeNotificationsTitle,
} from '@coopfi/components/modals'
import { useTokenMarketOffers } from '@coopfi/pages/tokenLending/LendTokenPage'
import { getDialectAccessToken } from '@coopfi/providers'
import { PATHS } from '@coopfi/router'
import { buildUrlWithModeAndToken } from '@coopfi/store'
import { AssetMode, useIsLedger, useModal, useTokenType } from '@coopfi/store/common'
import { useTokenLoansOptimistic } from '@coopfi/store/token'
import {
  TXN_EXECUTOR_DEFAULT_OPTIONS,
  createExecutorWalletAndConnection,
  defaultTxnErrorHandler,
} from '@coopfi/transactions'
import {
  CreateBorrowTokenTxnDataParams,
  createBorrowSplTokenTxnData,
  parseTokenBorrowSimulatedAccounts,
} from '@coopfi/transactions/tokenLending'
import {
  destroySnackbar,
  enqueueConfirmationError,
  enqueueSnackbar,
  enqueueTransactionsSent,
  enqueueWaitingConfirmation,
} from '@coopfi/utils'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { BN } from 'fbonds-core'
import { BondOfferV3 } from 'fbonds-core/lib/fbond-protocol/types'
import { chain, find, uniqueId } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { TxnExecutor } from 'solana-transactions-executor'

import { useSelectedOffers } from './useSelectedOffers'

type TransactionParams = {
  offer: BondOfferV3
  loanValue: BN
  collateral: CollateralToken
  aprRate: BN
}

export const useBorrowOffersTransaction = (collateral: CollateralToken | undefined) => {
  const { selection: borrowOffers } = useSelectedOffers()

  const wallet = useWallet()
  const { connection } = useConnection()
  const navigate = useNavigate()
  const { open, close } = useModal()

  const { isLedger } = useIsLedger()
  const { tokenType } = useTokenType()

  const [isBorrowing, setIsBorrowing] = useState(false)

  const { add: addLoansOptimistic } = useTokenLoansOptimistic()

  const { offers: marketOffers, updateOrAddOffer } = useTokenMarketOffers(
    collateral?.marketPubkey || '',
  )

  const { setVisibility: setBanxNotificationsSiderVisibility } = useBanxNotificationsSider()

  const goToLoansPage = () => {
    navigate(buildUrlWithModeAndToken(PATHS.LOANS, AssetMode.Token, tokenType))
  }

  const onBorrowSuccess = (loansAmount = 1) => {
    //? Show notification with an offer to subscribe (if user not subscribed)
    const isUserSubscribedToNotifications = !!getDialectAccessToken(wallet.publicKey?.toBase58())
    if (!isUserSubscribedToNotifications) {
      open(SubscribeNotificationsModal, {
        title: createLoanSubscribeNotificationsTitle(loansAmount),
        message: createLoanSubscribeNotificationsContent(!isUserSubscribedToNotifications),
        onActionClick: !isUserSubscribedToNotifications
          ? () => {
              close()
              setBanxNotificationsSiderVisibility(true)
            }
          : undefined,
        onCancel: close,
      })
    }
  }

  const transactionsData = useMemo(() => {
    if (!marketOffers.length) return []

    return borrowOffers.reduce<TransactionParams[]>((acc, offer) => {
      const offerData = find(
        marketOffers,
        ({ publicKey }) => publicKey.toBase58() === offer.publicKey,
      )

      if (!collateral) return acc

      if (offerData) {
        //? Subtract 0.0001% from maxTokenToGet to prevent rounding issues
        const adjustedLoanValue = new BN(offer.maxTokenToGet).sub(
          new BN(offer.maxTokenToGet).div(new BN(1000000)),
        )

        acc.push({
          offer: offerData,
          loanValue: adjustedLoanValue,
          collateral,
          aprRate: new BN(offer.apr),
        })
      }

      return acc
    }, [])
  }, [marketOffers, borrowOffers, collateral])

  const borrow = async () => {
    const loadingSnackbarId = uniqueId()

    if (!transactionsData.length) return

    try {
      setIsBorrowing(true)

      const walletAndConnection = createExecutorWalletAndConnection({ wallet, connection })

      const txnsData = await Promise.all(
        transactionsData.map((params) =>
          createBorrowSplTokenTxnData({ ...params, tokenType }, walletAndConnection),
        ),
      )

      await new TxnExecutor<CreateBorrowTokenTxnDataParams>(walletAndConnection, {
        ...TXN_EXECUTOR_DEFAULT_OPTIONS,
        chunkSize: isLedger ? 1 : 40,
      })
        .addTxnsData(txnsData)
        .on('sentSome', () => {
          enqueueTransactionsSent()
          enqueueWaitingConfirmation(loadingSnackbarId)
        })
        .on('confirmedAll', (results) => {
          const { confirmed, failed } = results

          destroySnackbar(loadingSnackbarId)

          if (confirmed.length) {
            enqueueSnackbar({ message: 'Borrowed successfully', type: 'success' })

            const loanAndOfferArray = confirmed.map((txnResult) => {
              const { accountInfoByPubkey, params } = txnResult

              if (!accountInfoByPubkey) return

              const { bondOffer, bondTradeTransaction, fraktBond } =
                parseTokenBorrowSimulatedAccounts(accountInfoByPubkey)

              const loanAndOffer: { loan: core.TokenLoan; offer: BondOfferV3 } = {
                loan: {
                  publicKey: fraktBond.publicKey,
                  fraktBond: {
                    ...fraktBond,
                    hadoMarket: params.collateral.marketPubkey,
                  },
                  bondTradeTransaction,
                  collateral: params.collateral.collateral,
                  collateralPrice: params.collateral.collateralPrice,
                },
                offer: bondOffer,
              }

              return loanAndOffer
            })

            //? Add optimistic loans
            if (wallet.publicKey) {
              addLoansOptimistic(
                chain(loanAndOfferArray)
                  .compact()
                  .map(({ loan }) => loan)
                  .value(),
                wallet.publicKey.toBase58(),
              )
            }

            loanAndOfferArray.forEach((loanAndOffer) => {
              if (loanAndOffer) {
                updateOrAddOffer(loanAndOffer.offer)
              }
            })

            goToLoansPage()
            onBorrowSuccess?.(loanAndOfferArray.length)
          }

          if (failed.length) {
            return failed.forEach(({ signature, reason }) =>
              enqueueConfirmationError(signature, reason),
            )
          }
        })
        .on('error', (error) => {
          throw error
        })
        .execute()
    } catch (error) {
      destroySnackbar(loadingSnackbarId)
      defaultTxnErrorHandler(error, {
        walletPubkey: wallet?.publicKey?.toBase58(),
        transactionName: 'BorrowSplToken',
      })
    } finally {
      setIsBorrowing(false)
    }
  }

  return { borrow, isBorrowing }
}
