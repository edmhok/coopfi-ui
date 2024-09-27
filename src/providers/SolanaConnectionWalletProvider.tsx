import { FC, PropsWithChildren } from 'react'

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'

import { RPC_ENDPOINTS, WALLETS } from '@coopfi/constants'
import { useBestWorkingRPC } from '@coopfi/hooks'

export const SolanaConnectionWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { endpoint, isLoading } = useBestWorkingRPC({
    endpoints: RPC_ENDPOINTS,
    logErrors: true,
  })

  if (isLoading || !endpoint) return <></>

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={WALLETS} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}
