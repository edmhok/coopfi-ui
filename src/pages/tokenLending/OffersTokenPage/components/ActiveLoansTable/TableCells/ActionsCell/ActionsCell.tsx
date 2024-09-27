import { FC } from 'react'

import { Button } from '@coopfi/components/Buttons'

import { core } from '@coopfi/api/tokens'
import { useModal } from '@coopfi/store/common'
import { isTokenLoanLiquidated, isTokenLoanTerminating } from '@coopfi/utils'

import ManageModal from '../../ManageModal'
import { useTokenLenderLoansTransactions } from '../../hooks'

import styles from './ActionsCell.module.less'

interface ActionsCellProps {
  loan: core.TokenLoan
  isCardView?: boolean
}

export const ActionsCell: FC<ActionsCellProps> = ({ loan, isCardView = false }) => {
  const { claimTokenLoan } = useTokenLenderLoansTransactions()
  const { open } = useModal()

  const isLoanTerminating = isTokenLoanTerminating(loan)
  const isLoanLiquidated = isTokenLoanLiquidated(loan)

  const canClaim = isLoanLiquidated && isLoanTerminating

  const showModal = () => {
    open(ManageModal, { loan })
  }

  const buttonSize = isCardView ? 'large' : 'medium'

  return (
    <div className={styles.actionsButtons}>
      {canClaim && (
        <Button
          onClick={() => claimTokenLoan(loan)}
          className={styles.actionButton}
          size={buttonSize}
        >
          Claim
        </Button>
      )}

      {!canClaim && (
        <Button
          className={styles.actionButton}
          onClick={(event) => {
            showModal()
            event.stopPropagation()
          }}
          disabled={isLoanTerminating}
          variant="secondary"
          size={buttonSize}
        >
          Manage
        </Button>
      )}
    </div>
  )
}
