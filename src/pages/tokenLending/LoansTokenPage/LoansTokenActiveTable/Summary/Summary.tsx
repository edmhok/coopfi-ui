import { FC, useMemo } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'
import { calcBorrowerTokenAPR } from 'fbonds-core/lib/fbond-protocol/helpers'
import { every, map, sumBy } from 'lodash'

import { Button } from '@coopfi/components/Buttons'
import { CounterSlider } from '@coopfi/components/Slider'
import { StatInfo, VALUES_TYPES } from '@coopfi/components/StatInfo'
import { DisplayValue, createPercentValueJSX } from '@coopfi/components/TableComponents'

import { core } from '@coopfi/api/tokens'
import {
  caclulateBorrowTokenLoanValue,
  calcTokenWeeklyFeeWithRepayFee,
  calcWeightedAverage,
  isTokenLoanRepaymentCallActive,
} from '@coopfi/utils'

import { calcTokenTotalValueToPay } from '../helpers'
import { useTokenLoansTransactions } from '../hooks'
import { TokenLoanOptimistic } from '../loansState'

import styles from './Summary.module.less'

interface SummaryProps {
  loans: core.TokenLoan[]
  selectedLoans: TokenLoanOptimistic[]
  setSelection: (loans: core.TokenLoan[], walletPublicKey: string) => void
}

const Summary: FC<SummaryProps> = ({ loans, selectedLoans: rawSelectedLoans, setSelection }) => {
  const { publicKey: walletPublicKey } = useWallet()
  const { repayAllLoans, repayUnpaidLoansInterest } = useTokenLoansTransactions()

  const selectedLoans = useMemo(() => {
    return rawSelectedLoans.map(({ loan }) => loan)
  }, [rawSelectedLoans])

  const totalSelectedLoans = selectedLoans.length
  const totalDebt = sumBy(selectedLoans, (loan) => caclulateBorrowTokenLoanValue(loan).toNumber())
  const totalWeeklyFee = sumBy(selectedLoans, calcTokenWeeklyFeeWithRepayFee)
  const totalValueToPay = sumBy(selectedLoans, calcTokenTotalValueToPay)

  const handleLoanSelection = (value = 0) => {
    setSelection(loans.slice(0, value), walletPublicKey?.toBase58() || '')
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainStat}>
        <p>{createPercentValueJSX(calcWeightedApr(selectedLoans), '0%')}</p>
        <p>Weighted apr</p>
      </div>
      <div className={styles.additionalStats}>
        <StatInfo
          label="Debt"
          value={<DisplayValue value={totalDebt} />}
          classNamesProps={{ container: styles.debtInterestStat }}
        />
        <StatInfo
          label={getLoansStatusActionText(selectedLoans)}
          value={<DisplayValue value={totalValueToPay} />}
          classNamesProps={{ container: styles.accruedInterestStat }}
        />
        <StatInfo label="Weekly interest" value={<DisplayValue value={totalWeeklyFee} />} />
        <StatInfo
          label="Weighted apr"
          value={calcWeightedApr(selectedLoans)}
          valueType={VALUES_TYPES.PERCENT}
          classNamesProps={{ container: styles.weightedAprStat }}
        />
      </div>
      <div className={styles.summaryControls}>
        <CounterSlider
          label="# Loans"
          value={totalSelectedLoans}
          onChange={(value) => handleLoanSelection(value)}
          rootClassName={styles.slider}
          className={styles.sliderContainer}
          max={loans.length}
        />
        <Button
          className={styles.payButton}
          variant="secondary"
          onClick={repayUnpaidLoansInterest}
          disabled={!totalValueToPay}
        >
          {getLoansStatusActionText(selectedLoans)}
          {<DisplayValue value={totalValueToPay} />}
        </Button>
        <Button
          className={styles.repayButton}
          onClick={repayAllLoans}
          disabled={!totalSelectedLoans}
        >
          Repay <DisplayValue value={totalDebt} />
        </Button>
      </div>
    </div>
  )
}

export default Summary

const getLoansStatusActionText = (selectedLoans: core.TokenLoan[]) => {
  const hasSelectedLoans = selectedLoans.length > 0

  const allLoansAreRepaymentCall =
    hasSelectedLoans && every(selectedLoans, isTokenLoanRepaymentCallActive)

  const allLoansAreWithoutRepaymentCall =
    hasSelectedLoans && every(selectedLoans, (loan) => !isTokenLoanRepaymentCallActive(loan))

  if (allLoansAreRepaymentCall) return 'Repayment call'
  if (allLoansAreWithoutRepaymentCall) return 'Pay interest'

  return 'Pay'
}

const calcWeightedApr = (loans: core.TokenLoan[]) => {
  const totalAprValues = map(
    loans,
    (loan) => calcBorrowerTokenAPR(loan.bondTradeTransaction.amountOfBonds) / 100,
  )

  const totalRepayValues = map(loans, (loan) => caclulateBorrowTokenLoanValue(loan).toNumber())
  return calcWeightedAverage(totalAprValues, totalRepayValues)
}
