import { useMemo } from 'react'

import { sumBy } from 'lodash'

import { OnboardButton } from '@coopfi/components/Buttons'
import { AdditionalStat, PageHeaderBackdrop } from '@coopfi/components/PageHeader'
import { DisplayValue } from '@coopfi/components/TableComponents'
import { TokenSwitcher } from '@coopfi/components/TokenSwitcher'

import { core } from '@coopfi/api/nft'
import { formatNumbersWithCommas } from '@coopfi/utils'

import { useMarketsPreview } from '../../../hooks'

import styles from './LendHeader.module.less'

const Header = () => {
  const { marketsPreview } = useMarketsPreview()

  const { loansTVL, offersTVL, totalLoans } = useMemo(() => {
    const sumByKey = (key: keyof core.MarketPreview) => sumBy(marketsPreview, key)

    return {
      loansTVL: sumByKey('loansTvl'),
      offersTVL: sumByKey('offerTvl'),
      totalLoans: sumByKey('activeBondsAmount'),
    }
  }, [marketsPreview])

  return (
    <PageHeaderBackdrop
      title="Lend"
      titleBtn={<OnboardButton contentType="lend" />}
      tokenSwitcher={<TokenSwitcher title="Lend" />}
    >
      <AdditionalStat
        label="Loan TVL"
        value={
          <>
            <DisplayValue value={loansTVL} />
            <span className={styles.value}>in {formatNumbersWithCommas(totalLoans)} loans</span>
          </>
        }
      />

      <AdditionalStat label="Offer TVL" value={<DisplayValue value={offersTVL} />} />
    </PageHeaderBackdrop>
  )
}

export default Header
