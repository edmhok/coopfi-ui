import { OnboardButton } from '@coopfi/components/Buttons'
import { AdditionalStat, PageHeaderBackdrop } from '@coopfi/components/PageHeader'
import { DisplayValue } from '@coopfi/components/TableComponents'
import { TokenSwitcher } from '@coopfi/components/TokenSwitcher'

import { useUserTokenOffersStats } from '../../hooks'

const OffersHeader = () => {
  const { data } = useUserTokenOffersStats()

  const { loansVolume = 0, offersVolume = 0 } = data || {}

  return (
    <PageHeaderBackdrop
      title="My offers"
      titleBtn={<OnboardButton contentType="offers" />}
      tokenSwitcher={<TokenSwitcher title="My offers" />}
    >
      <AdditionalStat label="Loan TVL" value={<DisplayValue value={loansVolume} />} />
      <AdditionalStat label="Offer TVL" value={<DisplayValue value={offersVolume} />} />
    </PageHeaderBackdrop>
  )
}

export default OffersHeader
