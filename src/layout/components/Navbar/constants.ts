import { DISCORD, DOCS_URL, GITHUB_URL, X_URL } from '@coopfi/constants'
import { Borrow, Dashboard, Discord, Docs, Github, Lend, Rewards, Twitter } from '@coopfi/icons'
import { StakeFilled } from '@coopfi/icons/Stake'
import { PATHS } from '@coopfi/router'

export const NAVIGATION_LINKS = [
  {
    label: 'Dashboard',
    pathname: PATHS.DASHBOARD,
    icon: Dashboard,
    primary: true,
  },
  {
    label: 'Borrow',
    pathname: PATHS.BORROW,
    icon: Borrow,
    primary: true,
  },
  {
    label: 'My loans',
    pathname: PATHS.LOANS,
  },
  {
    label: 'Lend',
    pathname: PATHS.LEND,
    icon: Lend,
    primary: true,
  },
  {
    label: 'My offers',
    pathname: PATHS.OFFERS,
  },
]

export const SECONDARY_NAVIGATION_LINKS = [
  {
    label: 'Rewards',
    pathname: PATHS.LEADERBOARD,
    icon: Rewards,
  },
  {
    label: 'Stake',
    pathname: PATHS.ADVENTURES,
    icon: StakeFilled,
  },
]

export const EXTERNAL_LINKS = [
  {
    label: 'X',
    href: X_URL,
    icon: Twitter,
  },
  {
    label: 'Discord',
    href: DISCORD.SERVER_URL,
    icon: Discord,
  },
  {
    label: 'Docs',
    href: DOCS_URL,
    icon: Docs,
  },
  {
    label: 'Github',
    href: GITHUB_URL,
    icon: Github,
  },
]
