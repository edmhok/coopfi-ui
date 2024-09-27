import { core } from '@coopfi/api/nft'
import { NftWithLoanValue } from '@coopfi/utils'

export type TableNftData = NftWithLoanValue & {
  mint: string
  selected: boolean
  interest: number //? 1 week interest
}

export interface OfferWithLoanValue {
  offer: core.Offer
  loanValue: number
}
