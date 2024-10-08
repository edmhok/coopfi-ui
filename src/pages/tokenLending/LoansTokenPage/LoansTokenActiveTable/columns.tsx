import { LendingTokenType } from 'fbonds-core/lib/fbond-protocol/types'

import Checkbox from '@coopfi/components/Checkbox'
import { ColumnType } from '@coopfi/components/Table'
import { CollateralTokenCell, HeaderCell } from '@coopfi/components/TableComponents'

import { core } from '@coopfi/api/tokens'
import { formatCollateralTokenValue, getTokenLoanSupply } from '@coopfi/utils'

import { APRCell, ActionsCell, DebtCell, LTVCell, StatusCell } from './TableCells'
import { TokenLoanOptimistic } from './loansState'

import styles from './LoansTokenActiveTable.module.less'

interface GetTableColumnsProps {
  toggleLoanInSelection: (loan: core.TokenLoan) => void
  findLoanInSelection: (loanPubkey: string) => TokenLoanOptimistic | null
  onSelectAll: () => void
  hasSelectedLoans: boolean
  isCardView: boolean
  tokenType: LendingTokenType
}

export const getTableColumns = ({
  onSelectAll,
  findLoanInSelection,
  toggleLoanInSelection,
  hasSelectedLoans,
  isCardView,
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
      render: (loan) => {
        return (
          <CollateralTokenCell
            key={loan.publicKey}
            selected={!!findLoanInSelection(loan.publicKey)}
            onCheckboxClick={() => toggleLoanInSelection(loan)}
            collateralTokenAmount={formatCollateralTokenValue(getTokenLoanSupply(loan))}
            collateralImageUrl={loan.collateral.logoUrl}
            collateralTokenTicker={loan.collateral.ticker}
          />
        )
      },
    },
    {
      key: 'debt',
      title: (
        <HeaderCell
          label="Debt"
          tooltipText="Hover over the debt balance of your loans below to view a breakdown of your principal, interest and repayments (if any) to date"
        />
      ),
      render: (loan) => <DebtCell loan={loan} />,
    },
    {
      key: 'ltv',
      title: <HeaderCell label="LTV" />,
      render: (loan) => <LTVCell loan={loan} tokenType={tokenType} />,
    },
    {
      key: 'apr',
      title: <HeaderCell label="APR" />,
      render: (loan) => <APRCell loan={loan} />,
    },
    {
      key: 'status',
      title: (
        <HeaderCell
          label="Status"
          tooltipText="Current status and duration of the loan that has been passed"
        />
      ),
      render: (loan) => <StatusCell loan={loan} isCardView={isCardView} />,
    },
    {
      key: 'actionsCell',
      title: <HeaderCell label="" />,
      render: (loan) => (
        <ActionsCell
          loan={loan}
          isCardView={isCardView}
          disableActions={!!findLoanInSelection(loan.publicKey)}
        />
      ),
    },
  ]

  return columns
}
