import { FC, useMemo } from 'react'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { BondOfferV3 } from 'fbonds-core/lib/fbond-protocol/types'
import { uniqueId } from 'lodash'
import moment from 'moment'
import { TxnExecutor } from 'solana-transactions-executor'

import { Button } from '@coopfi/components/Buttons'
import { EpochProgressBar } from '@coopfi/components/EpochProgressBar'
import { StatInfo } from '@coopfi/components/StatInfo'
import { DisplayValue } from '@coopfi/components/TableComponents'
import { getLenderVaultInfo } from '@coopfi/components/WalletModal'
import { BanxSolYieldWarningModal } from '@coopfi/components/modals'

import { convertBondOfferV3ToCore } from '@coopfi/api/nft/core'
import { useClusterStats } from '@coopfi/hooks'
import { BanxSOL } from '@coopfi/icons'
import { useModal, useTokenType } from '@coopfi/store/common'
import {
  TXN_EXECUTOR_DEFAULT_OPTIONS,
  createExecutorWalletAndConnection,
  defaultTxnErrorHandler,
} from '@coopfi/transactions'
import {
  CreateClaimLenderVaultTxnDataParams,
  createClaimLenderVaultTxnData,
  parseClaimTokenLenderVaultSimulatedAccounts,
} from '@coopfi/transactions/nftLending'
import {
  destroySnackbar,
  enqueueConfirmationError,
  enqueueSnackbar,
  enqueueTransactionsSent,
  enqueueWaitingConfirmation,
  formatValueByTokenType,
  isBanxSolTokenType,
} from '@coopfi/utils'

import styles from './Summary.module.less'

interface SummaryProps {
  offers: BondOfferV3[]
  updateOrAddOffer: (offers: BondOfferV3[]) => void
}

const Summary: FC<SummaryProps> = ({ offers, updateOrAddOffer }) => {
  const wallet = useWallet()
  const { connection } = useConnection()

  const { tokenType } = useTokenType()
  const { open, close } = useModal()

  const { data: clusterStats } = useClusterStats()

  const claimVault = async () => {
    if (!offers.length) return

    const loadingSnackbarId = uniqueId()

    try {
      const walletAndConnection = createExecutorWalletAndConnection({ wallet, connection })

      const txnsData = await Promise.all(
        offers.map((offer) =>
          createClaimLenderVaultTxnData(
            { offer: convertBondOfferV3ToCore(offer), tokenType, clusterStats },
            walletAndConnection,
          ),
        ),
      )

      await new TxnExecutor<CreateClaimLenderVaultTxnDataParams>(
        walletAndConnection,
        TXN_EXECUTOR_DEFAULT_OPTIONS,
      )
        .addTxnsData(txnsData)
        .on('sentAll', () => {
          enqueueTransactionsSent()
          enqueueWaitingConfirmation(loadingSnackbarId)
        })
        .on('confirmedAll', (results) => {
          const { confirmed, failed } = results

          destroySnackbar(loadingSnackbarId)

          if (confirmed.length) {
            enqueueSnackbar({ message: 'Successfully claimed', type: 'success' })
            confirmed.forEach(({ accountInfoByPubkey }) => {
              if (!accountInfoByPubkey) return
              const offer = parseClaimTokenLenderVaultSimulatedAccounts(accountInfoByPubkey)
              updateOrAddOffer([offer])
            })
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
        additionalData: offers,
        walletPubkey: wallet?.publicKey?.toBase58(),
        transactionName: 'ClaimLenderVault',
      })
    }
  }

  const convertedBondOffersV3ToCore = useMemo(() => {
    return offers.map((offer) => convertBondOfferV3ToCore(offer))
  }, [offers])

  const {
    totalAccruedInterest,
    totalRepaymets,
    totalLstYield,
    totalLiquidityValue,
    totalClosedOffersValue,
    totalClaimableValue,
    totalFundsInCurrentEpoch,
    totalFundsInNextEpoch,
  } = getLenderVaultInfo(convertedBondOffersV3ToCore, clusterStats)

  const tooltipContent = (
    <div className={styles.tooltipContent}>
      <TooltipRow label="Repayments" value={totalRepaymets} />
      <TooltipRow label="Closed offers" value={totalClosedOffersValue} />
      <TooltipRow label="Accrued interest" value={totalAccruedInterest} />
    </div>
  )

  const formattedTotalFundsInCurrentEpoch = totalFundsInCurrentEpoch
    ? formatValueByTokenType(totalFundsInCurrentEpoch, tokenType)
    : 0

  const formattedTotalFundsInNextEpoch = totalFundsInNextEpoch
    ? formatValueByTokenType(totalFundsInNextEpoch, tokenType)
    : 0

  const currentTimeInUnix = moment().unix()
  const currentEpochEndsAt = currentTimeInUnix + (clusterStats?.epochApproxTimeRemaining || 0)
  const nextEpochEndsAt = currentEpochEndsAt + (clusterStats?.epochDuration || 0)

  const openModal = () => {
    open(BanxSolYieldWarningModal, {
      onConfirm: claimVault,
      onCancel: close,
      currentEpochInfo: {
        value: formattedTotalFundsInCurrentEpoch,
        endsAt: currentEpochEndsAt,
      },
      nextEpochInfo: {
        value: formattedTotalFundsInNextEpoch,
        endsAt: nextEpochEndsAt,
      },
    })
  }

  const onClickClaimButton = () => {
    if (isBanxSolTokenType(tokenType) && totalLstYield > 0 && totalLiquidityValue > 0) {
      return openModal()
    }

    return claimVault()
  }

  return (
    <div className={styles.container}>
      {isBanxSolTokenType(tokenType) && (
        <div className={styles.epochContainer}>
          <EpochProgressBar />
          <div className={styles.epochStats}>
            <StatInfo
              label="Yield for this epoch"
              tooltipText="Liquid staking profit, awarded as 6% APR, based on the $SOL you hold in Banx for the entire epoch (excluding taken loans)"
              value={formattedTotalFundsInCurrentEpoch}
              icon={BanxSOL}
              flexType="row"
            />
            <StatInfo
              label="Yield for next epoch"
              tooltipText="Projected liquid staking profit, awarded as 6% APR, based on the $SOL you hold in Banx throughout the next epoch (excluding taken loans)"
              value={formattedTotalFundsInNextEpoch}
              icon={BanxSOL}
              flexType="row"
            />
          </div>
        </div>
      )}

      <div className={styles.statsContainer}>
        <div className={styles.stats}>
          {isBanxSolTokenType(tokenType) && (
            <StatInfo
              label="LST yield"
              tooltipText="Yield generated from the BanxSOL integrated Liquid Staking Token, based on the $SOL you hold in Banx throughout a whole epoch, excluding $SOL in taken loans"
              value={<DisplayValue value={totalLstYield} />}
            />
          )}
          <StatInfo
            label="Liquidity"
            tooltipText={tooltipContent}
            value={<DisplayValue value={totalLiquidityValue} />}
          />
        </div>

        <Button
          className={styles.claimButton}
          onClick={onClickClaimButton}
          disabled={!totalClaimableValue}
        >
          Claim
        </Button>
      </div>
    </div>
  )
}

export default Summary

interface TooltipRowProps {
  label: string
  value: number
}

const TooltipRow: FC<TooltipRowProps> = ({ label, value }) => (
  <div className={styles.tooltipRow}>
    <span className={styles.tooltipRowLabel}>{label}</span>
    <span className={styles.tooltipRowValue}>
      <DisplayValue value={value} />
    </span>
  </div>
)
