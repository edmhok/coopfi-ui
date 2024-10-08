import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

import { Button } from '@coopfi/components/Buttons'
import { PriorityFeesModal } from '@coopfi/components/modals'

import { Cup, Settings } from '@coopfi/icons'
import { PATHS } from '@coopfi/router'
import { getHumanReadablePriorityLevel, useModal, usePriorityFees } from '@coopfi/store/common'

import { isActivePath } from '../Navbar/helpers'

import styles from './Header.module.less'

export const PriorityFeesButton = () => {
  const { priorityLevel } = usePriorityFees()
  const { open, close } = useModal()

  const onClickHandler = () => {
    open(PriorityFeesModal, { onCancel: close })
  }

  return (
    <Button
      type="circle"
      variant="tertiary"
      onClick={onClickHandler}
      className={styles.priorityFeeButton}
    >
      <Settings />
      <span className={styles.priorityFeeLevel}>
        {getHumanReadablePriorityLevel(priorityLevel)}
      </span>
    </Button>
  )
}

export const RewardsButton = () => {
  return (
    <div className={styles.rewardsButtonWrapper}>
      <NavLink to={PATHS.LEADERBOARD}>
        <Button
          type="circle"
          variant="tertiary"
          className={classNames(styles.rewardsButton, {
            [styles.active]: isActivePath(PATHS.LEADERBOARD),
          })}
        >
          <Cup />
          <div className={styles.rewardsButtonText}>Farm $BANX</div>
        </Button>
      </NavLink>
    </div>
  )
}
