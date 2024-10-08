import { Tab, Tabs, useTabs } from '@coopfi/components/Tabs'

import { ActiveTabContent } from './components/ActiveTabContent'
import { HistoryOffersTable } from './components/HistoryOffersTable'
import OffersHeader from './components/OffersHeader'
import OffersTabContent from './components/OffersTabContent'

import styles from './OffersPage.module.less'

export const OffersPage = () => {
  const { value: currentTabValue, ...tabsProps } = useTabs({
    tabs: OFFERS_TABS,
    defaultValue: OFFERS_TABS[0].value,
  })

  return (
    <div className={styles.pageWrapper}>
      <OffersHeader />
      <Tabs value={currentTabValue} {...tabsProps} />
      {currentTabValue === OffersTabName.PENDING && <OffersTabContent />}
      {currentTabValue === OffersTabName.ACTIVE && <ActiveTabContent />}
      {currentTabValue === OffersTabName.HISTORY && <HistoryOffersTable />}
    </div>
  )
}

enum OffersTabName {
  PENDING = 'pending',
  ACTIVE = 'active',
  HISTORY = 'history',
}

const OFFERS_TABS: Tab[] = [
  {
    label: 'Pending',
    value: OffersTabName.PENDING,
  },
  {
    label: 'Active',
    value: OffersTabName.ACTIVE,
  },
  {
    label: 'History',
    value: OffersTabName.HISTORY,
  },
]
