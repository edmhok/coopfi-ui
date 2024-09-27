import { FC, PropsWithChildren } from 'react'

import { BanxNotificationsSider } from '@coopfi/components/BanxNotifications'
import { WalletModal, useWalletModal } from '@coopfi/components/WalletModal'
import { ModalPortal } from '@coopfi/components/modals'

import BurgerMenu from './components/BurgerMenu'
import { Header } from './components/Header'
import { Navbar } from './components/Navbar'
import TopNotification from './components/TopNotification'

import styles from './Layout.module.less'

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const { visible } = useWalletModal()

  return (
    <div className={styles.layout}>
      <TopNotification />
      <Header />
      <div className={styles.container}>
        {visible && <WalletModal />}
        <Navbar />
        <BurgerMenu />
        <ModalPortal />
        <div className={styles.content}>
          {children}
          <BanxNotificationsSider className={styles.notificationsSider} />
        </div>
      </div>
    </div>
  )
}
