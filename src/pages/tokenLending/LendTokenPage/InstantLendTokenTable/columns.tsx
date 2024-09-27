import { SECONDS_IN_DAY } from 'fbonds-core/lib/fbond-protocol/constants'
import { LendingTokenType } from 'fbonds-core/lib/fbond-protocol/types'

import Checkbox from '@coopfi/components/Checkbox'
import { ColumnType } from '@coopfi/components/Table'
import { CollateralTokenCell, HeaderCell, HorizontalCell } from '@coopfi/components/TableComponents'
import Timer from '@coopfi/components/Timer'
import Tooltip from '@coopfi/components/Tooltip'

import { core } from '@coopfi/api/tokens'
import { SECONDS_IN_72_HOURS } from '@coopfi/constants'
import { Hourglass, Snowflake } from '@coopfi/icons'
import {
  formatCollateralTokenValue,
  getTokenLoanSupply,
  isTokenLoanFrozen,
  isTokenLoanListed,
} from '@coopfi/utils'

import { APRCell, ActionsCell, DebtCell, LTVCell } from './TableCells'

import styles from './InstantLendTokenTable.module.less'

interface GetTableColumnsProps {
  toggleLoanInSelection: (loan: core.TokenLoan) => void
  findLoanInSelection: (loanPubkey: string) => core.TokenLoan | null
  onSelectAll: () => void
  isCardView: boolean
  hasSelectedLoans: boolean
  tokenType: LendingTokenType
}

export const getTableColumns = ({
  isCardView,
  findLoanInSelection,
  onSelectAll,
  hasSelectedLoans,
  toggleLoanInSelection,
  tokenType,
}: GetTableColumnsProps) => {
  const columns: ColumnType<core.TokenLoan>[] = [
    {
      key: 'collateral',
      title: (
        <div className={styles.headerTitleRow}>
          <Checkbox className={styles.checkbox} onChange={onSelectAll} checked={hasSelectedLoans} />
          <HeaderCell label="Collateral" />
        </div>
      ),
      render: (loan) => (
        <CollateralTokenCell
          key={loan.publicKey}
          selected={!!findLoanInSelection(loan.publicKey)}
          onCheckboxClick={() => toggleLoanInSelection(loan)}
          collateralTokenAmount={formatCollateralTokenValue(getTokenLoanSupply(loan))}
          collateralTokenTicker={loan.collateral.ticker}
          collateralImageUrl={loan.collateral.logoUrl}
          rightContentJSX={createRightContentJSX(loan)}
        />
      ),
    },
    {
      key: 'repayValue',
      title: <HeaderCell label="Debt" />,
      render: (loan) => <DebtCell loan={loan} tokenType={tokenType} />,
    },
    {
      key: 'ltv',
      title: <HeaderCell label="LTV" />,
      render: (loan) => <LTVCell loan={loan} />,
    },
    {
      key: 'freeze',
      title: <HeaderCell label="Freeze" />,
      render: (loan) => {
        const terminationFreezeInDays = loan.bondTradeTransaction.terminationFreeze / SECONDS_IN_DAY
        const freezeValue = isTokenLoanFrozen(loan) ? `${terminationFreezeInDays} days` : '--'
        return <HorizontalCell value={freezeValue} />
      },
    },
    {
      key: 'duration',
      title: <HeaderCell label="Ends in" />,
      render: (loan) => {
        const expiredAt = loan.fraktBond.refinanceAuctionStartedAt + SECONDS_IN_72_HOURS
        return !isTokenLoanListed(loan) ? <Timer expiredAt={expiredAt} /> : '--'
      },
    },
    {
      key: 'apr',
      title: <HeaderCell label="APR" />,
      render: (loan) => <APRCell loan={loan} />,
    },
    {
      key: 'actionsCell',
      title: <HeaderCell label="" />,
      render: (loan) => (
        <ActionsCell
          loan={loan}
          isCardView={isCardView}
          disabledAction={!!findLoanInSelection(loan.publicKey)}
        />
      ),
    },
  ]

  return columns
}

const createRightContentJSX = (loan: core.TokenLoan) => {
  if (isTokenLoanListed(loan) && !isTokenLoanFrozen(loan)) {
    return null
  }

  const tooltipText = isTokenLoanFrozen(loan)
    ? `This loan has a freeze period during which it can't be terminated`
    : 'This loan is available for a limited amount of time'

  return (
    <Tooltip title={tooltipText}>
      {isTokenLoanFrozen(loan) ? (
        <Snowflake className={styles.snowflakeIcon} />
      ) : (
        <Hourglass className={styles.hourglassIcon} />
      )}
    </Tooltip>
  )
}
