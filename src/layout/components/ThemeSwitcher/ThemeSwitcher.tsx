import { FC } from 'react'

import { Button } from '@coopfi/components/Buttons'

import { Theme, useTheme } from '@coopfi/hooks'
import { Moon, Sun } from '@coopfi/icons'

interface ThemeSwitcherProps {
  className?: string
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme()

  const Icon = theme === Theme.LIGHT ? Sun : Moon

  return (
    <Button className={className} type="circle" variant="secondary" onClick={toggleTheme}>
      <Icon />
    </Button>
  )
}

export default ThemeSwitcher
