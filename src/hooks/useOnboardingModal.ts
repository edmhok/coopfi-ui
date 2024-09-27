import { useEffect } from 'react'

import { OnboardingModal, OnboardingModalContentType } from '@coopfi/components/modals'
import { useModal } from '@coopfi/store/common'
import { chain } from 'lodash'

import { useLocalStorage } from './useLocalStorage'

const ONBOARDING_VIEW_STATE_DEFAULT_VALUE = chain(OnboardingModalContentType)
  .values()
  .map((value) => [value, false])
  .fromPairs()
  .value()

export const useOnboardingModal = (contentType: `${OnboardingModalContentType}`) => {
  const { open, close } = useModal()

  const [onboardingViewedState, setOnboardingViewedState] = useLocalStorage<{
    [key: string]: boolean
  }>('@coopfi.onboardingViewed', ONBOARDING_VIEW_STATE_DEFAULT_VALUE)

  useEffect(() => {
    if (!onboardingViewedState[contentType]) {
      open(OnboardingModal, {
        contentType,
        onCancel: () => {
          setOnboardingViewedState((prevState) => ({
            ...prevState,
            [contentType]: true,
          }))
          close()
        },
      })
    }
  }, [open, close, contentType, setOnboardingViewedState, onboardingViewedState])
}
