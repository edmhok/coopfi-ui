import { FC } from 'react'

import classNames from 'classnames'

import { Button } from '@coopfi/components/Buttons'

import { core } from '@coopfi/api/nft'
import { ChevronDown } from '@coopfi/icons'

import ExpandableCardContent from '../ExpandableCardContent'
import { MarketAdditionalInfo, MarketMainInfo } from '../MarketOverviewInfo'

import styles from './LendCard.module.less'

interface LendCardProps {
  market: core.MarketPreview
  isCardOpen: boolean
  onCardClick: () => void
}

const LendCard: FC<LendCardProps> = ({ isCardOpen, onCardClick, market }) => {
  return (
    <div className={styles.card}>
      <div
        className={classNames(styles.cardBody, { [styles.active]: isCardOpen })}
        onClick={onCardClick}
      >
        <MarketMainInfo market={market} />
        <div className={styles.row}>
          <MarketAdditionalInfo market={market} isCardOpen={isCardOpen} />
          <Button
            type="circle"
            className={classNames(styles.chevronButton, { [styles.active]: isCardOpen })}
          >
            <ChevronDown />
          </Button>
        </div>
      </div>
      {isCardOpen && <ExpandableCardContent marketPubkey={market.marketPubkey} />}
    </div>
  )
}

export default LendCard
