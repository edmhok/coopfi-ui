import { solana } from '@coopfi/api/common'
import { useConnection } from '@solana/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'

export const useClusterStats = () => {
  const { connection } = useConnection()

  const { data, isLoading } = useQuery(
    ['clusterStats'],
    () => solana.getClusterStats({ connection }),
    {
      staleTime: 60_000,
      refetchInterval: 60_000,
      refetchOnWindowFocus: false,
    },
  )

  return { data, isLoading }
}
