import { FC } from 'react'

import { Button } from '@coopfi/components/Buttons'

import { CardView, TableView } from '@coopfi/icons'
import { ViewState } from '@coopfi/store/common'

interface SwitchModeButtonProps {
  viewState: ViewState
  onChange: (value: ViewState) => void
}

export const SwitchModeButton: FC<SwitchModeButtonProps> = ({ viewState, onChange }) => {
  const Icon = viewState === ViewState.CARD ? <CardView /> : <TableView />

  const onToggleViewMode = () =>
    onChange(viewState === ViewState.CARD ? ViewState.TABLE : ViewState.CARD)

  return (
    <Button type="circle" variant="secondary" onClick={onToggleViewMode}>
      {Icon}
    </Button>
  )
}
