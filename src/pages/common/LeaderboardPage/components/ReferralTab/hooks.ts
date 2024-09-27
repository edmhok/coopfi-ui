import { user } from '@coopfi/api/common'
import { useWallet } from '@solana/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'

export const useRefPersonalData = () => {
  const wallet = useWallet()

  const walletPubkeyString = wallet?.publicKey?.toBase58() || ''

  const { data, isLoading } = useQuery(
    ['refPersonalData', walletPubkeyString],
    () => user.fetchRefPersonalData({ walletPubkey: walletPubkeyString }),
    {
      staleTime: 5000,
      refetchOnWindowFocus: false,
      enabled: !!walletPubkeyString,
    },
  )

  return { data, isLoading }
}
