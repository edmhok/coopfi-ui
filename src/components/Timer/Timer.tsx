import { FC } from 'react'

import { useCountdown } from '@coopfi/hooks'
import { CountdownUnits, formatCountdownUnits } from '@coopfi/utils'

import styles from './Timer.module.less'

interface TimerProps {
  expiredAt: number //? unix timestamp
  formatCountdownUnits?: (countdownUnits: CountdownUnits) => string
}

const defaultFormatCountdownUnits = (countdownUnits: CountdownUnits): string => {
  const { days, hours } = countdownUnits

  if (!days && !hours) {
    return formatCountdownUnits(countdownUnits, 'm:s')
  }
  if (!days) {
    return formatCountdownUnits(countdownUnits, 'h:m:s')
  }
  return formatCountdownUnits(countdownUnits, 'd:h:m')
}

const Timer: FC<TimerProps> = ({
  expiredAt,
  formatCountdownUnits = defaultFormatCountdownUnits,
}) => {
  const countdownUnits = useCountdown(expiredAt)

  return <span className={styles.timer}>{formatCountdownUnits(countdownUnits)}</span>
}

export default Timer
