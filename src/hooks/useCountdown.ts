import { useEffect, useRef, useState } from 'react'

import { CountdownUnits, getTimeDifference, splitTimeDifferenceToUnits } from '@coopfi/utils'
import { Duration } from 'moment'

export const useCountdown = (endTimeUnix: number): CountdownUnits => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [timeDifference, setTimeDifference] = useState<Duration>(getTimeDifference(endTimeUnix))

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeDifference(getTimeDifference(endTimeUnix))
    }, 1000)

    return () => clearInterval(intervalRef.current!)
  }, [endTimeUnix])

  return splitTimeDifferenceToUnits(timeDifference)
}
