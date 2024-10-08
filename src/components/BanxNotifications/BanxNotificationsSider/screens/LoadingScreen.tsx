import classNames from 'classnames'

import { Loader } from '@coopfi/components/Loader'

import styles from '../BanxNotificationsSider.module.less'

export const LoadingScreen = () => {
  return (
    <div className={classNames(styles.content, styles.contentCentered)}>
      <Loader />
    </div>
  )
}
