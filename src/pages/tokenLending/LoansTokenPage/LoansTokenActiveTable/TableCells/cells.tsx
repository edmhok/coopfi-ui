import { FC } from 'react'

import { calcBorrowerTokenAPR } from 'fbonds-core/lib/fbond-protocol/helpers'
import { LendingTokenType } from 'fbonds-core/lib/fbond-protocol/types'
import { capitalize } from 'lodash'
import moment from 'moment'

import { Button } from '@coopfi/components/Buttons'
import {
  DisplayValue,
  HorizontalCell,
  createPercentValueJSX,
} from '@coopfi/components/TableComponents'
import Timer from '@coopfi/components/Timer'

import { core } from '@coopfi/api/tokens'
import { SECONDS_IN_72_HOURS } from '@coopfi/constants'
import { useModal } from '@coopfi/store/common'
import {
  HealthColorIncreasing,
  STATUS_LOANS_COLOR_MAP,
  STATUS_LOANS_MAP,
  caclulateBorrowTokenLoanValue,
  calcTokenWeeklyFeeWithRepayFee,
  calculateTimeFromNow,
  calculateTokenLoanLtvByLoanValue,
  getColorByPercent,
  getTokenDecimals,
  isTokenLoanActive,
  isTokenLoanTerminating,
} from '@coopfi/utils'

import { calcAccruedInterest } from '../helpers'
import RefinanceTokenModal from './RefinanceTokenModal'
import RepayTokenModal from './RepayTokenModal'

import styles from '../LoansTokenActiveTable.module.less'

interface TooltipRowProps {
  label: string
  value: number
  isSubscriptFormat?: boolean
}
const TooltipRow: FC<TooltipRowProps> = ({ label, value, isSubscriptFormat = false }) => (
  <div className={styles.tooltipRow}>
    <span className={styles.tooltipRowLabel}>{label}</span>
    <span className={styles.tooltipRowValue}>
      <DisplayValue value={value} isSubscriptFormat={isSubscriptFormat} />
    </span>
  </div>
)

export const DebtCell: FC<{ loan: core.TokenLoan }> = ({ loan }) => {
  const { bondTradeTransaction, fraktBond } = loan

  const debtValue = caclulateBorrowTokenLoanValue(loan).toNumber()
  const borrowedValue = fraktBond.borrowedAmount

  const totalAccruedInterest = calcAccruedInterest(loan)

  const upfrontFee = bondTradeTransaction.borrowerOriginalLent / 100

  const weeklyFee = calcTokenWeeklyFeeWithRepayFee(loan)

  const tooltipContent = (
    <div className={styles.tooltipContent}>
      <TooltipRow label="Principal" value={borrowedValue} />
      <TooltipRow label="Repaid" value={bondTradeTransaction.borrowerFullRepaidAmount} />
      <TooltipRow label="Accrued interest" value={totalAccruedInterest} />
      <TooltipRow label="Upfront fee" value={upfrontFee} />
      <TooltipRow label="Est. weekly interest" value={weeklyFee} />
    </div>
  )

  return (
    <HorizontalCell tooltipContent={tooltipContent} value={<DisplayValue value={debtValue} />} />
  )
}

interface LTVCellProps {
  loan: core.TokenLoan
  tokenType: LendingTokenType
}

export const LTVCell: FC<LTVCellProps> = ({ loan, tokenType }) => {
  const debtValue = caclulateBorrowTokenLoanValue(loan).toNumber()
  const ltvPercent = calculateTokenLoanLtvByLoanValue(loan, debtValue)

  const marketTokenDecimals = getTokenDecimals(tokenType) //? 1e9, 1e6

  const tooltipContent = (
    <div className={styles.tooltipContent}>
      <TooltipRow
        label="Price"
        value={loan.collateralPrice / marketTokenDecimals}
        isSubscriptFormat
      />
      <TooltipRow label="Debt" value={debtValue} />
    </div>
  )

  return (
    <HorizontalCell
      value={createPercentValueJSX(ltvPercent)}
      tooltipContent={tooltipContent}
      textColor={getColorByPercent(ltvPercent, HealthColorIncreasing)}
    />
  )
}

export const APRCell: FC<{ loan: core.TokenLoan }> = ({ loan }) => {
  const apr = calcBorrowerTokenAPR(loan.bondTradeTransaction.amountOfBonds) / 100

  return <HorizontalCell value={createPercentValueJSX(apr)} isHighlighted />
}

interface StatusCellProps {
  loan: core.TokenLoan
  isCardView?: boolean
}

export const StatusCell: FC<StatusCellProps> = ({ loan, isCardView = false }) => {
  const loanStatus = STATUS_LOANS_MAP[loan.bondTradeTransaction.bondTradeTransactionState]
  const loanStatusColor = STATUS_LOANS_COLOR_MAP[loanStatus]

  const timeContent = getTimeContent(loan)

  const statusInfoTitle = (
    <span style={{ color: loanStatusColor }} className={styles.columnCellTitle}>
      {capitalize(loanStatus)}
    </span>
  )
  const statusInfoSubtitle = <span className={styles.columnCellSubtitle}>{timeContent}</span>

  return !isCardView ? (
    <div className={styles.columnCell}>
      {statusInfoSubtitle}
      {statusInfoTitle}
    </div>
  ) : (
    <span>
      {statusInfoSubtitle} ({statusInfoTitle})
    </span>
  )
}

const getTimeContent = (loan: core.TokenLoan) => {
  const { fraktBond } = loan

  if (isTokenLoanActive(loan)) {
    const currentTimeInSeconds = moment().unix()
    const timeSinceActivationInSeconds = currentTimeInSeconds - fraktBond.activatedAt
    return calculateTimeFromNow(timeSinceActivationInSeconds)
  }

  if (isTokenLoanTerminating(loan)) {
    const expiredAt = fraktBond.refinanceAuctionStartedAt + SECONDS_IN_72_HOURS
    return <Timer expiredAt={expiredAt} />
  }

  return ''
}

interface ActionsCellProps {
  loan: core.TokenLoan
  isCardView: boolean
  disableActions: boolean
}

export const ActionsCell: FC<ActionsCellProps> = ({ loan, isCardView, disableActions }) => {
  const { open } = useModal()

  const isLoanTerminating = isTokenLoanTerminating(loan)
  const buttonSize = isCardView ? 'large' : 'medium'

  return (
    <div className={styles.actionsButtons}>
      <Button
        size={buttonSize}
        variant="secondary"
        onClick={(event) => {
          open(RefinanceTokenModal, { loan })
          event.stopPropagation()
        }}
      >
        {isLoanTerminating ? 'Extend' : 'Rollover'}
      </Button>
      <Button
        size={buttonSize}
        disabled={disableActions}
        onClick={(event) => {
          open(RepayTokenModal, { loan })
          event.stopPropagation()
        }}
      >
        Repay
      </Button>
    </div>
  )
}
