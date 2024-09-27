import { FC } from 'react'

import classNames from 'classnames'

import { Button } from '@coopfi/components/Buttons'

import { Bell } from '@coopfi/icons'
import { useBurgerMenu } from '@coopfi/layout/components/BurgerMenu/hooks'

import { useBanxNotificationsSider } from '../BanxNotificationsSider'
import { BUTTON_ID } from '../constants'

import styles from './BanxNotificationsButton.module.less'

export const BanxNotificationsButton: FC = () => {
  const { isVisible, toggleVisibility } = useBanxNotificationsSider()
  const { setVisibility: setBurgerMenuVisibility } = useBurgerMenu()

  const onIconClick = () => {
    toggleVisibility()
    if (!isVisible) {
      setBurgerMenuVisibility(false)
    }
  }

  return (
    <Button
      type="circle"
      variant="tertiary"
      id={BUTTON_ID}
      className={classNames(styles.button, { [styles.buttonActive]: isVisible })}
      onClick={onIconClick}
    >
      <Bell />
      <span className={styles.buttonText}>Notifications</span>
    </Button>
  )
}
