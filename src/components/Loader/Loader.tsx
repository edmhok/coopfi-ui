import { FC } from 'react'

import classNames from 'classnames'

import { LoaderCircle } from '@coopfi/icons'

import styles from './styles.module.less'

interface LoaderProps {
  size?: 'large' | 'default' | 'small'
  className?: string
}

export const Loader: FC<LoaderProps> = ({ size = 'default', className }) => {
  return (
    <LoaderCircle
      className={classNames([
        styles.loader,
        { [styles.small]: size === 'small' },
        { [styles.large]: size === 'large' },
        className,
      ])}
    />
  )
}

export const ModalLoader: FC<LoaderProps> = ({ className }) => {
  return <div className={classNames(styles.load, className)}></div>
}
