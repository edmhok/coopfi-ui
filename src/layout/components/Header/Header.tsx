import { useWallet } from '@solana/wallet-adapter-react'
import { NavLink } from 'react-router-dom'

import { BanxNotificationsButton } from '@coopfi/components/BanxNotifications'
import { WalletConnectButton } from '@coopfi/components/Buttons'
import ModeSwitcher from '@coopfi/components/ModeSwitcher'

import { Logo, LogoFull } from '@coopfi/icons'
import { PATHS } from '@coopfi/router'

import { BurgerIcon } from '../BurgerMenu'
import ThemeSwitcher from '../ThemeSwitcher'
import { PriorityFeesButton, RewardsButton } from './components'

import styles from './Header.module.less'

export const Header = () => {
  const { connected } = useWallet()

  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <NavLink to={PATHS.ROOT} className={styles.logoWrapper}>
          <LogoFull className={styles.logo} />
          <Logo className={styles.logoMobile} />
        </NavLink>
        <ModeSwitcher className={styles.tokenSwitcher} />
      </div>

      <div className={styles.widgetContainer}>
        <RewardsButton />
        {connected && <BanxNotificationsButton />}
        {connected && <PriorityFeesButton />}
        <ThemeSwitcher className={styles.hiddenThemeSwitcher} />
        <WalletConnectButton />
      </div>
      <BurgerIcon />
    </div>
  )
}
