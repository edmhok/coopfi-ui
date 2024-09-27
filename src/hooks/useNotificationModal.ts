import { useEffect } from 'react'

import { notifications } from '@coopfi/api/common'
import { NotificationModal } from '@coopfi/components/modals'
import { useModal } from '@coopfi/store/common'
import { useQuery } from '@tanstack/react-query'

import { useLocalStorage } from './useLocalStorage'

export const useNotificationModal = () => {
  const { open, close } = useModal()

  //? Store in localstorage prev notification
  const [prevModalHtmlContent, setPrevModalHtmlContent] = useLocalStorage<string | null>(
    '@coopfi.modalHtmlContent',
    null,
  )

  const { data: modalHtmlContent } = useQuery(
    ['modalNotification'],
    notifications.fetchModalNotification,
    {
      staleTime: 30 * 60 * 1000, // 30 mins
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    if (!modalHtmlContent) {
      return
    }

    if (modalHtmlContent === prevModalHtmlContent) {
      return
    }

    open(NotificationModal, {
      htmlContent: modalHtmlContent,
      onCancel: () => {
        setPrevModalHtmlContent(modalHtmlContent ?? null)
        close()
      },
    })
  }, [close, modalHtmlContent, open, prevModalHtmlContent, setPrevModalHtmlContent])
}
