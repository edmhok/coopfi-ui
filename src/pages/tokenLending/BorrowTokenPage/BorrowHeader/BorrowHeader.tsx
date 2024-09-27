import { OnboardButton } from '@coopfi/components/Buttons'
import { PageHeaderBackdrop } from '@coopfi/components/PageHeader'
import { TokenSwitcher } from '@coopfi/components/TokenSwitcher'

const BorrowHeader = () => {
  return (
    <PageHeaderBackdrop
      title="Borrow"
      titleBtn={<OnboardButton contentType="borrow" />}
      tokenSwitcher={<TokenSwitcher title="Borrow" />}
    ></PageHeaderBackdrop>
  )
}

export default BorrowHeader
