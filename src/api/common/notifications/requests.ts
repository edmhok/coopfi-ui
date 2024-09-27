import { BACKEND_BASE_URL } from '@coopfi/constants'
import axios from 'axios'

interface NotificationContent {
  html: string
}

type FetchModalNotification = () => Promise<string>
export const fetchModalNotification: FetchModalNotification = async () => {
  const { data } = await axios.get<NotificationContent>(`${BACKEND_BASE_URL}/web/modal`)

  return data?.html || ''
}

type FetchTopBarNotification = () => Promise<string>
export const fetchTopBarNotification: FetchTopBarNotification = async () => {
  const { data } = await axios.get<NotificationContent>(`${BACKEND_BASE_URL}/web/topbar`)

  return data?.html || ''
}
