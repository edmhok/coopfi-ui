import { parseResponseSafe } from '@coopfi/api/shared'
import { BACKEND_BASE_URL, BANX_TOKEN_DECIMALS } from '@coopfi/constants'
import { ZERO_BN } from '@coopfi/utils'
import axios from 'axios'
import { BN } from 'fbonds-core'

import { BanxStakingInfoSchema, BanxStakingSettingsSchema } from './schemas'
import { BanxStakingInfo, BanxStakingSettings } from './types'

type FetchBanxStakeInfo = (props: { userPubkey?: string }) => Promise<BanxStakingInfo | undefined>
export const fetchBanxStakeInfo: FetchBanxStakeInfo = async ({ userPubkey }) => {
  const queryParams = new URLSearchParams({
    walletPubkey: userPubkey ?? '',
  })

  const { data } = await axios.get<{ data: BanxStakingInfo }>(
    `${BACKEND_BASE_URL}/staking/v2/info?${queryParams.toString()}`,
  )

  return await parseResponseSafe<BanxStakingInfo>(data.data, BanxStakingInfoSchema)
}

type FetchBanxStakeSettings = () => Promise<BanxStakingSettings | undefined>
export const fetchBanxStakeSettings: FetchBanxStakeSettings = async () => {
  const { data } = await axios.get<{ data: BanxStakingSettings }>(
    `${BACKEND_BASE_URL}/staking/v2/settings`,
  )

  return await parseResponseSafe<BanxStakingSettings>(data.data, BanxStakingSettingsSchema)
}

export const fetchBanxTokenCirculatingAmount = async () => {
  const { data } = await axios.get<number>(`${BACKEND_BASE_URL}/tokenStake/token/circulating`)

  if (!data || isNaN(data)) return ZERO_BN

  return new BN(data).mul(new BN(10 ** BANX_TOKEN_DECIMALS))
}
