import { useWallet } from '@solana/wallet-adapter-react'
import { sumBy } from 'lodash'

import { OnboardButton } from '@coopfi/components/Buttons'
import {
  AdditionalStat,
  MainStat,
  PageHeaderBackdrop,
  SeparateStatsLine,
} from '@coopfi/components/PageHeader'
import { DisplayValue } from '@coopfi/components/TableComponents'
import { TokenSwitcher } from '@coopfi/components/TokenSwitcher'

import { Snowflake } from '@coopfi/icons'
import { useMarketsPreview } from '@coopfi/pages/nftLending/LendPage/hooks'

import { useBorrowNfts } from '../hooks'

const Header = () => {
  const { connected } = useWallet()

  const { nfts, maxBorrow } = useBorrowNfts()
  const { marketsPreview } = useMarketsPreview()

  const nftsAmount = nfts.length
  const totalLiquidity = sumBy(marketsPreview, (offer) => offer.offerTvl)

  return (
    <PageHeaderBackdrop
      title="Borrow"
      titleBtn={<OnboardButton contentType="borrow" />}
      tokenSwitcher={<TokenSwitcher title="Borrow" />}
    >
      {connected && <AdditionalStat label="Your NFTs" value={nftsAmount} />}

      <AdditionalStat
        label="Duration"
        value="Perpetual, 72h"
        tooltipText="As long as the borrower and lender are happy, the loan has no expiration. New loans benefit from a 72hr safety duration"
        icon={Snowflake}
      />

      <SeparateStatsLine />

      {connected ? (
        <MainStat label="Max borrow" value={<DisplayValue value={maxBorrow} />} />
      ) : (
        <MainStat label="Total liquidity" value={<DisplayValue value={totalLiquidity} />} />
      )}
    </PageHeaderBackdrop>
  )
}

export default Header
