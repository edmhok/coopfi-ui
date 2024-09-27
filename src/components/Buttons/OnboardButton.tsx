import { FC } from 'react'

import { OnboardingModal, OnboardingModalContentType } from '@coopfi/components/modals'

import { Info } from '@coopfi/icons'
import { useModal } from '@coopfi/store/common'

import { Button } from './Button'

import styles from './Buttons.module.less'

interface OnboardButtonProps {
  contentType: `${OnboardingModalContentType}`
  title?: string
}

export const OnboardButton: FC<OnboardButtonProps> = ({ title, contentType }) => {
  const { open, close } = useModal()

  const openModal = () => {
    open(OnboardingModal, { contentType, onCancel: close })
  }

  return (
    <Button type="circle" variant="tertiary" className={styles.onboardBtn} onClick={openModal}>
      <Info />
      <span className={styles.instructionsLabel}>How it works?</span>
      {title && <span className={styles.pageTitle}>{title}</span>}
    </Button>
  )
}
