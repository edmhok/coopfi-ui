import { ErrorBoundary } from '@coopfi/components/ErrorBoundary'

import { DialectProvider, QueryProvider, SolanaConnectionWalletProvider } from '@coopfi/providers'
import { Router } from '@coopfi/router'
import { purgeIdb } from '@coopfi/store'
import { initSentry } from '@coopfi/utils'

initSentry()
purgeIdb()

const App = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <SolanaConnectionWalletProvider>
          <DialectProvider>
            <Router />
          </DialectProvider>
        </SolanaConnectionWalletProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}

export default App
