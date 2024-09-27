import { useMemo } from 'react'

import { sumBy } from 'lodash'

import { OnboardButton } from '@coopfi/components/Buttons'
import { AdditionalStat, PageHeaderBackdrop } from '@coopfi/components/PageHeader'
import { DisplayValue } from '@coopfi/components/TableComponents'
import { TokenSwitcher } from '@coopfi/components/TokenSwitcher'

import { formatNumbersWithCommas } from '@coopfi/utils'

import { useTokenMarketsPreview } from '../hooks'

import styles from './LendHeader.module.less'

const LendHeader = () => {
  const { marketsPreview } = useTokenMarketsPreview()

  const { loansTvl, offersTvl, totalLoans } = useMemo(() => {
    return {
      loansTvl: sumBy(marketsPreview, (market) => market.loansTvl),
      offersTvl: sumBy(marketsPreview, (market) => market.offersTvl),
      totalLoans: sumBy(marketsPreview, (market) => market.activeLoansAmount),
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
            <DisplayValue value={loansTvl} />
            <span className={styles.value}>in {formatNumbersWithCommas(totalLoans)} loans</span>
          </>
        }
      />

      <AdditionalStat label="Offer TVL" value={<DisplayValue value={offersTvl} />} />
    </PageHeaderBackdrop>
  )
}

export default LendHeader
