import { OnboardButton } from '@coopfi/components/Buttons'
import {
  AdditionalStat,
  MainStat,
  PageHeaderBackdrop,
  SeparateStatsLine,
} from '@coopfi/components/PageHeader'
import { DisplayValue } from '@coopfi/components/TableComponents'
import { TokenSwitcher } from '@coopfi/components/TokenSwitcher'

import { formatNumbersWithCommas } from '@coopfi/utils'

import { useAllTotalStats } from '../hooks'

const Header = () => {
  const { data } = useAllTotalStats()

  const { activeLoans = 0, totalValueLocked = 0, loansVolumeAllTime = 0 } = data || {}

  return (
    <PageHeaderBackdrop
      title="Dashboard"
      titleBtn={<OnboardButton contentType="dashboard" />}
      tokenSwitcher={<TokenSwitcher title="Dashboard" />}
    >
      <AdditionalStat label="Active loans" value={formatNumbersWithCommas(activeLoans)} />
      <AdditionalStat
        label="Total value locked"
        value={<DisplayValue value={totalValueLocked} />}
      />

      <SeparateStatsLine />

      <MainStat label="All time volume" value={<DisplayValue value={loansVolumeAllTime} />} />
    </PageHeaderBackdrop>
  )
}

export default Header
