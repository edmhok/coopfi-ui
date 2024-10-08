import { FC } from 'react'

import classNames from 'classnames'
import { LendingTokenType } from 'fbonds-core/lib/fbond-protocol/types'

import { TABLET_WIDTH } from '@coopfi/constants'
import { useWindowSize } from '@coopfi/hooks'
import { useTokenType } from '@coopfi/store/common'
import { isBanxSolTokenType } from '@coopfi/utils'

import { TokenDropdown } from './TokenDropdown'
import { TOKEN_OPTIONS } from './constants'

import styles from './TokenSwitcher.module.less'

interface TokenSwitcherProps {
  title: string
}

export const TokenSwitcher: FC<TokenSwitcherProps> = ({ title }) => {
  const { tokenType, setTokenType } = useTokenType()

  const { width } = useWindowSize()
  const isTable = width < TABLET_WIDTH

  const toggleTokenType = () => {
    const nextValue = isBanxSolTokenType(tokenType)
      ? LendingTokenType.Usdc
      : LendingTokenType.BanxSol

    return setTokenType(nextValue)
  }

  if (isTable)
    return (
      <TokenDropdown
        title={title}
        options={TOKEN_OPTIONS}
        option={TOKEN_OPTIONS.find((option) => option.key === tokenType) ?? TOKEN_OPTIONS[0]}
        onChangeToken={setTokenType}
      />
    )

  return (
    <div className={styles.switcher}>
      {TOKEN_OPTIONS.map((option) => (
        <div
          key={option.key}
          onClick={toggleTokenType}
          className={classNames(styles.switcherOption, {
            [styles.active]: option.key === tokenType,
          })}
        >
          <p className={styles.switcherOptionValue}>
            <span className={styles.switcherOptionIcon}>{option.icon}</span>
            <span className={styles.switcherOptionLabel}>{option.label}</span>
          </p>
        </div>
      ))}
    </div>
  )
}
