import { FC } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'
import classNames from 'classnames'
import { PUBKEY_PLACEHOLDER } from 'fbonds-core/lib/fbond-protocol/constants'

import { DisplayValue, createPercentValueJSX } from '@coopfi/components/TableComponents'

import { TokenMeta } from '@coopfi/api/tokens'
import { Pencil } from '@coopfi/icons'
import { SyntheticTokenOffer } from '@coopfi/store/token'
import { calculateTokensPerCollateral, formatTokensPerCollateralToStr } from '@coopfi/utils'

import styles from './OrderBook.module.less'

interface OfferProps {
  offer: SyntheticTokenOffer
  collateral: TokenMeta | undefined
}

const Offer: FC<OfferProps> = ({ offer, collateral }) => {
  const { publicKey: offerPubkey, collateralsPerToken, offerSize, isEdit, apr } = offer
  const { decimals: collateralTokenDecimals = 0 } = collateral || {}

  const { connected } = useWallet()

  const isNewOffer = connected && offerPubkey.toBase58() === PUBKEY_PLACEHOLDER

  const commonHighlightClassNames = {
    [styles.creating]: isNewOffer,
    [styles.editing]: isEdit,
    [styles.hidden]: !isEdit && !isNewOffer,
  }

  const tokensPerCollateralBN = calculateTokensPerCollateral(
    collateralsPerToken,
    collateralTokenDecimals,
  )

  const offerValue = formatTokensPerCollateralToStr(tokensPerCollateralBN)

  return (
    <li className={classNames(styles.listItem, commonHighlightClassNames)}>
      <div className={classNames(styles.highlightItem, commonHighlightClassNames)}>
        <Pencil />
      </div>

      <div className={styles.values}>
        <p className={styles.displayOfferValue}>{offerValue}</p>
        <p className={styles.value}>{createPercentValueJSX(apr)}</p>
        <p className={styles.value}>
          <DisplayValue value={offerSize} />
        </p>
      </div>
    </li>
  )
}

export default Offer
