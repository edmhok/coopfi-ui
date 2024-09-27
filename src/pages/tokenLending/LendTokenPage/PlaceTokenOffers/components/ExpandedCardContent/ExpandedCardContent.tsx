import { FC } from 'react'

import { Button } from '@coopfi/components/Buttons'
import { LendTokenActivityTable } from '@coopfi/components/CommonTables'
import PlaceTokenOfferSection, { OrderBook } from '@coopfi/components/PlaceTokenOfferSection'
import { Tabs, useTabs } from '@coopfi/components/Tabs'
import { Modal } from '@coopfi/components/modals/BaseModal'

import { TokenMarketPreview } from '@coopfi/api/tokens'
import { useModal } from '@coopfi/store/common'

import styles from './ExpandedCardContent.module.less'

const ExpandedCardContent: FC<{ market: TokenMarketPreview }> = ({ market }) => {
  const { open: openModal } = useModal()

  const showModal = () => {
    openModal(OffersModal, { market })
  }

  return (
    <div className={styles.container}>
      <div className={styles.placeOfferContainer}>
        <Button
          className={styles.showOffersMobileButton}
          onClick={showModal}
          type="circle"
          variant="tertiary"
        >
          See offers
        </Button>

        <PlaceTokenOfferSection marketPubkey={market.marketPubkey} />
      </div>

      <div className={styles.tabsContent}>
        <TabsContent market={market} />
      </div>
    </div>
  )
}

export default ExpandedCardContent

const TabsContent: FC<{ market: TokenMarketPreview }> = ({ market }) => {
  const { value: currentTabValue, ...tabsProps } = useTabs({
    tabs: TABS,
    defaultValue: TabName.OFFERS,
  })

  return (
    <>
      <Tabs value={currentTabValue} {...tabsProps} />
      {currentTabValue === TabName.OFFERS && <OrderBook market={market} />}
      {currentTabValue === TabName.ACTIVITY && (
        <LendTokenActivityTable marketPubkey={market.marketPubkey} />
      )}
    </>
  )
}

const OffersModal: FC<{ market: TokenMarketPreview }> = ({ market }) => {
  const { close } = useModal()

  return (
    <Modal className={styles.modal} open onCancel={close}>
      <TabsContent market={market} />
    </Modal>
  )
}

export enum TabName {
  OFFERS = 'offers',
  ACTIVITY = 'activity',
}

export const TABS = [
  {
    label: 'Offers',
    value: TabName.OFFERS,
  },
  {
    label: 'Activity',
    value: TabName.ACTIVITY,
  },
]
