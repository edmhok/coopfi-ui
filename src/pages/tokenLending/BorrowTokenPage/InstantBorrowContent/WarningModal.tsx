import { FC } from 'react'

import { Button } from '@coopfi/components/Buttons'
import { createDisplayValueJSX } from '@coopfi/components/TableComponents'
import { Modal } from '@coopfi/components/modals/BaseModal'

import { BorrowOffer, CollateralToken } from '@coopfi/api/tokens'
import { useTokenType } from '@coopfi/store/common'
import { formatValueByTokenType, getTokenDecimals, getTokenUnit } from '@coopfi/utils'

import { getSummaryInfo } from './helpers'

import styles from './InstantBorrowContent.module.less'

interface WarningModalProps {
  offers: BorrowOffer[]
  collateral: CollateralToken | undefined
  onSubmit: () => void
  onCancel: () => void
}

const WarningModal: FC<WarningModalProps> = ({ offers, onSubmit, onCancel, collateral }) => {
  const { weightedApr, weeklyFee, totalAmountToGet, totalCollateralsAmount } =
    getSummaryInfo(offers)

  const { tokenType } = useTokenType()

  const marketTokenDecimals = getTokenDecimals(tokenType) //? 1e6, 1e9
  const tokenUnit = getTokenUnit(tokenType)

  const formattedTotalAmountToGet = formatValueByTokenType(totalAmountToGet, tokenType)
  const formattedWeeklyFee = formatValueByTokenType(weeklyFee, tokenType)

  const formattedCollateralsValue = formatNumber(totalCollateralsAmount / marketTokenDecimals)
  const formattedAprValue = (weightedApr / 100).toFixed(0)

  return (
    <Modal
      className={styles.warningModal}
      open
      onCancel={onCancel}
      footer={false}
      width={496}
      centered
    >
      <div className={styles.warningModalBody}>
        <h3 className={styles.warningModalTitle}>Please pay attention!</h3>

        <div className={styles.warningModalText}>
          Lenders can only provide{' '}
          <span className={styles.warningModalTokenValue}>
            {createDisplayValueJSX(formattedTotalAmountToGet, tokenUnit)}
          </span>{' '}
          collateralized by{' '}
          <span className={styles.warningModalTokenRow}>
            {formattedCollateralsValue} {collateral?.collateral.ticker}
          </span>{' '}
          with {formattedAprValue}% APR (est weekly fee is{' '}
          <span className={styles.warningModalTokenValue}>
            {createDisplayValueJSX(formattedWeeklyFee, tokenUnit)}
          </span>
          )
        </div>
      </div>

      <div className={styles.warningModalFooter}>
        <Button onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </Button>
        <Button onClick={onSubmit} className={styles.confirmButton}>
          Confirm
        </Button>
      </div>
    </Modal>
  )
}

export default WarningModal

const formatNumber = (value = 0) => {
  if (!value) return '--'

  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}
