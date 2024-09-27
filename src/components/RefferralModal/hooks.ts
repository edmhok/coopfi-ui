import { user } from '@coopfi/api/common'
import { useQuery } from '@tanstack/react-query'

export const useGetUserWalletByRefCode = (refCode: string) => {
  const { data, isLoading } = useQuery(
    ['refPersonalData', refCode],
    () => user.fetchUserWalletByRefCode({ refCode }),
    {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  )

  return { data: data ?? '', isLoading }
}
