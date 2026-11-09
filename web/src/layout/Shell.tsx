import { AppShell, Burger, Group, Kbd, Text, UnstyledButton, Tooltip, Menu, Avatar, ActionIcon, Indicator, Badge } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Spotlight, spotlight, type SpotlightActionData } from '@mantine/spotlight'
import {
  IconBell,
  IconBuilding,
  IconChartBar,
  IconChevronDown,
  IconFileDollar,
  IconFilter,
  IconLayoutDashboard,
  IconListCheck,
  IconSearch,
  IconSettings,
  IconTargetArrow,
  IconUsers,
  IconColumns3,
  IconHelp,
} from '@tabler/icons-react'
import { NavLink as RouterNavLink, Outlet, useNavigate } from 'react-router'
import { companies, contacts, deals, fullName } from '../data/mock'

type NavItem = { label: string; to: string; icon: typeof IconUsers; badge?: number }
type NavGroup = { label: string; items: NavItem[] }

const nav: NavGroup[] = [
  {
    label: 'Core',
    items: [
      { label: 'Home', to: '/', icon: IconLayoutDashboard },
      { label: 'Contacts', to: '/contacts', icon: IconUsers },
      { label: 'Companies', to: '/companies', icon: IconBuilding },
      { label: 'Activities', to: '/activities', icon: IconListCheck, badge: 4 },
    ],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Leads', to: '/leads', icon: IconTargetArrow, badge: 3 },
      { label: 'Pipeline', to: '/pipeline', icon: IconColumns3 },
      { label: 'Quotes', to: '/quotes', icon: IconFileDollar },
      { label: 'Forecast', to: '/forecast', icon: IconChartBar },
    ],
  },
  {
    label: 'Marketing',
    items: [{ label: 'Segments', to: '/segments', icon: IconFilter }],
  },
]

function NavButton({ item, onClick }: { item: NavItem; onClick: () => void }) {
  const Icon = item.icon
  return (
    <RouterNavLink to={item.to} end={item.to === '/'} onClick={onClick} className="block">
      {({ isActive }) => (
        <UnstyledButton
          component="span"
          className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[14px] transition-colors ${
            isActive ? 'bg-spruce-100/70 font-medium text-spruce-900' : 'text-ink/80 hover:bg-black/[0.04]'
          }`}
        >
          <Icon size={18} stroke={1.75} className={isActive ? 'text-spruce-700' : 'text-muted'} />
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="tabular rounded-full bg-amber-signal/15 px-1.5 text-[11.5px] font-medium text-amber-700">{item.badge}</span>
          )}
        </UnstyledButton>
      )}
    </RouterNavLink>
  )
}

export default function Shell() {
  const [opened, { toggle, close }] = useDisclosure()
  const navigate = useNavigate()

  const actions: SpotlightActionData[] = [
    ...contacts.map((c) => ({
      id: c.id,
      label: fullName(c),
      description: `${c.title} · ${c.email}`,
      group: 'Contacts',
      leftSection: <IconUsers size={18} stroke={1.5} />,
      onClick: () => navigate(`/contacts/${c.id}`),
    })),
    ...companies.map((c) => ({
      id: c.id,
      label: c.name,
      description: `${c.industry} · ${c.city}`,
      group: 'Companies',
      leftSection: <IconBuilding size={18} stroke={1.5} />,
      onClick: () => navigate(`/companies/${c.id}`),
    })),
    ...deals.map((d) => ({
      id: d.id,
      label: d.name,
      description: companies.find((c) => c.id === d.companyId)?.name,
      group: 'Deals',
      leftSection: <IconColumns3 size={18} stroke={1.5} />,
      onClick: () => navigate(`/pipeline?deal=${d.id}`),
    })),
  ]

  return (
    <AppShell
      header={{ height: 52 }}
      navbar={{ width: 232, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding={0}
      styles={{
        header: { borderColor: '#e3e8e6', background: '#fff' },
        navbar: { borderColor: '#e3e8e6', background: '#f5f7f6' },
        main: { background: '#f5f7f6' },
      }}
    >
      <AppShell.Header>
        <div className="flex h-full items-center gap-3 px-3 sm:px-4">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group gap={8} className="mr-2">
            <span className="grid size-7 place-items-center rounded-md bg-spruce-700 text-white">
              <svg viewBox="0 0 32 32" width="16" height="16" aria-hidden>
                <path d="M16 6l7 10h-4l5 8H8l5-8H9z" fill="currentColor" />
              </svg>
            </span>
            <Text fw={600} size="md">
              Spruce
            </Text>
          </Group>

          <UnstyledButton
            onClick={spotlight.open}
            className="hidden h-8 w-full max-w-[420px] items-center gap-2 rounded-md border border-line bg-paper px-2.5 text-[13.5px] text-muted hover:border-gray-300 sm:flex"
          >
            <IconSearch size={16} stroke={1.75} />
            <span className="flex-1 text-left">Search contacts, companies, deals</span>
            <Kbd size="xs">⌘K</Kbd>
          </UnstyledButton>

          <div className="flex-1" />

          <ActionIcon variant="subtle" color="gray" aria-label="Search" hiddenFrom="sm" onClick={spotlight.open}>
            <IconSearch size={18} />
          </ActionIcon>
          <Tooltip label="Notifications">
            <Indicator color="amber" size={7} offset={5}>
              <ActionIcon variant="subtle" color="gray" aria-label="Notifications">
                <IconBell size={18} stroke={1.75} />
              </ActionIcon>
            </Indicator>
          </Tooltip>
          <Tooltip label="Help">
            <ActionIcon variant="subtle" color="gray" aria-label="Help">
              <IconHelp size={18} stroke={1.75} />
            </ActionIcon>
          </Tooltip>
          <Menu position="bottom-end" width={200}>
            <Menu.Target>
              <UnstyledButton className="ml-1 flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-black/[0.04]">
                <Avatar size={26} radius="xl" color="spruce" variant="filled" styles={{ placeholder: { fontSize: 11, fontWeight: 600 } }}>
                  GS
                </Avatar>
                <IconChevronDown size={14} className="text-muted" />
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Gembit S. · Admin</Menu.Label>
              <Menu.Item leftSection={<IconSettings size={16} />}>Settings</Menu.Item>
              <Menu.Item>Sign out</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <div className="flex h-full flex-col gap-5 pt-1">
          {nav.map((g) => (
            <div key={g.label}>
              <Text size="xs" c="dimmed" fw={500} px={10} mb={4}>
                {g.label}
              </Text>
              <div className="flex flex-col gap-px">
                {g.items.map((it) => (
                  <NavButton key={it.to} item={it} onClick={close} />
                ))}
              </div>
            </div>
          ))}
          <div className="mt-auto rounded-md border border-line bg-white p-3">
            <Group justify="space-between" mb={6}>
              <Text size="sm" fw={500}>
                This week
              </Text>
              <Badge color="spruce" variant="light">
                On pace
              </Badge>
            </Group>
            <Text size="xs" c="dimmed">
              4 tasks due · 2 deals closing · 3 new leads waiting
            </Text>
          </div>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </AppShell.Main>

      <Spotlight
        actions={actions}
        nothingFound="Nothing matches. Try a name, company or deal."
        highlightQuery
        limit={8}
        searchProps={{ leftSection: <IconSearch size={18} stroke={1.5} />, placeholder: 'Search contacts, companies, deals' }}
      />
    </AppShell>
  )
}
