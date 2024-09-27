import { FC } from 'react'

import { Button } from '@coopfi/components/Buttons'
import { ActivityTable } from '@coopfi/components/CommonTables'
import { Tabs, useTabs } from '@coopfi/components/Tabs'
import { Modal } from '@coopfi/components/modals/BaseModal'

import { useModal } from '@coopfi/store/common'

import OrderBook from '../OrderBook'

import styles from './ExpandableCardContent.module.less'

interface MarketParams {
  marketPubkey: string
  offerPubkey: string
  setOfferPubkey: (offerPubkey: string) => void
}

export const TabsContent: FC<MarketParams> = ({ marketPubkey, offerPubkey, setOfferPubkey }) => {
  const { value: currentTabValue, ...tabsProps } = useTabs({
    tabs: BONDS_TABS,
    defaultValue: BONDS_TABS[0].value,
  })

  return (
    <>
      <Tabs value={currentTabValue} {...tabsProps} />
      {currentTabValue === TabName.OFFERS && (
        <OrderBook
          marketPubkey={marketPubkey}
          offerPubkey={offerPubkey}
          setOfferPubkey={setOfferPubkey}
        />
      )}
      {currentTabValue === TabName.ACTIVITY && <ActivityTable marketPubkey={marketPubkey} />}
    </>
  )
}

interface OfferHeaderProps {
  isEditMode: boolean
  exitEditMode: () => void
  showModal: () => void
}

export const OfferHeader: FC<OfferHeaderProps> = ({ isEditMode, exitEditMode, showModal }) => {
  const title = isEditMode ? 'Offer editing' : 'Offer creation'

  return (
    <div className={styles.offerHeaderContent}>
      <h4 className={styles.offerHeaderTitle}>{title}</h4>
      {isEditMode && (
        <Button
          className={styles.editButton}
          type="circle"
          variant="tertiary"
          onClick={exitEditMode}
        >
          Close
        </Button>
      )}
      <Button className={styles.offersButton} type="circle" variant="tertiary" onClick={showModal}>
        Offers
      </Button>
    </div>
  )
}

export const OffersModal: FC<MarketParams> = (props) => {
  const { close } = useModal()

  return (
    <Modal className={styles.modal} open onCancel={close}>
      <TabsContent {...props} />
    </Modal>
  )
}

enum TabName {
  OFFERS = 'offers',
  ACTIVITY = 'activity',
}

const BONDS_TABS = [
  {
    label: 'Offers',
    value: TabName.OFFERS,
  },
  {
    label: 'Activity',
    value: TabName.ACTIVITY,
  },
]
