import { stats } from '@coopfi/api/nft'
import { useQuery } from '@tanstack/react-query'

export const useAllUsdcTotalStats = () => {
  const { data, isLoading } = useQuery(
    ['allUsdcTotalStats'],
    () => stats.fetchAllTotalStats('allInUsdc'),
    {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  )

  return { data, isLoading }
}
