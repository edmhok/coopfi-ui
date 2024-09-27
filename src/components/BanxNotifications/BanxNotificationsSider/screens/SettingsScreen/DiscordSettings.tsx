import { useWallet } from '@solana/wallet-adapter-react'

import { Button } from '@coopfi/components/Buttons'
import UserAvatar from '@coopfi/components/UserAvatar'

import { user } from '@coopfi/api/common'
import { DISCORD } from '@coopfi/constants'
import { useDiscordUser } from '@coopfi/hooks'
import { Alert } from '@coopfi/icons'
import { shortenAddress } from '@coopfi/utils'

import styles from './SettingsScreen.module.less'

export const DiscordSettings = () => {
  const { publicKey } = useWallet()
  const { data, isDiscordConnected, removeUserInfo } = useDiscordUser()

  const linkButtonHanlder = async () => {
    if (!publicKey) return

    if (isDiscordConnected) {
      await removeUserInfo()
      return
    }

    window.location.href = user.getDiscordUri(publicKey?.toBase58() || '')
  }

  return (
    <div className={styles.discordSettings}>
      <p className={styles.settingsLabel}>Discord</p>
      <div className={styles.discordSettingsWrapper}>
        <UserAvatar
          className={styles.discordSettingsAvatar}
          imageUrl={data?.avatarUrl ?? undefined}
        />
        <div className={styles.discordSettingsUserInfo}>
          <p className={styles.discordSettingsUserName}>
            {data ? shortenAddress(publicKey?.toBase58() || '') : 'Username'}
          </p>
          <Button onClick={linkButtonHanlder} variant="secondary" size="medium">
            {isDiscordConnected ? 'Unlink' : 'Link'}
          </Button>
        </div>
      </div>
      <div className={styles.discordAlert}>
        <Alert />
        <p>
          Please note that you should be a member of our{' '}
          <a href={DISCORD.SERVER_URL} target="_blank" rel="noopener noreferrer">
            server
          </a>{' '}
          to receive notifications
        </p>
      </div>
    </div>
  )
}
