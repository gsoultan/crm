import { useState } from 'react'
import { Badge, Button, Group, Paper, Select, Table, Text, Tabs, Tooltip, RingProgress, type MantineColor } from '@mantine/core'
import { IconArrowDownRight, IconArrowUpRight, IconMinus, IconPlus, IconSearch } from '@tabler/icons-react'
import { TextInput } from '@mantine/core'
import { useNavigate } from 'react-router'
import { companyById, customers, money, owners, type Customer } from '../data/mock'
import { OwnerAvatar, PageHeader, Stat, longDate } from '../components/ui'
import { CompanyMark } from './Companies'

export const stageColor: Record<Customer['stage'], MantineColor> = {
  Onboarding: 'blue',
  Adopting: 'indigo',
  Established: 'spruce',
  'Renewal due': 'amber',
  'At risk': 'red',
}

export function HealthRing({ value, size = 34 }: { value: number; size?: number }) {
  const color = value >= 70 ? 'spruce.6' : value >= 40 ? 'amber.6' : 'red.6'
  return (
    <Tooltip label={`Health ${value} of 100 · usage, support load, NPS and engagement`}>
      <RingProgress
        size={size}
        thickness={3}
        roundCaps
        sections={[{ value, color }]}
        label={
          <Text size="xs" ta="center" fw={600} className="tabular" style={{ fontSize: size * 0.32 }}>
            {value}
          </Text>
        }
      />
    </Tooltip>
  )
}

export function Trend({ trend }: { trend: Customer['trend'] }) {
  if (trend === 'up') return <IconArrowUpRight size={14} className="text-spruce-600" aria-label="Improving" />
  if (trend === 'down') return <IconArrowDownRight size={14} className="text-red-600" aria-label="Declining" />
  return <IconMinus size={14} className="text-muted" aria-label="Flat" />
}

const daysUntil = (iso: string) => Math.round((new Date(iso).getTime() - new Date('2026-11-09').getTime()) / 86400000)

export default function Customers() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<string | null>('all')
  const [q, setQ] = useState('')
  const [csm, setCsm] = useState<string | null>(null)

  const arr = customers.reduce((s, c) => s + c.arr, 0)
  const atRisk = customers.filter((c) => c.health < 40)
  const renewing = customers.filter((c) => daysUntil(c.renewalAt) <= 90 && daysUntil(c.renewalAt) >= -30).sort((a, b) => a.renewalAt.localeCompare(b.renewalAt))
  const renewingArr = renewing.reduce((s, c) => s + c.arr, 0)

  const base = customers.filter((c) => {
    const co = companyById(c.companyId)
    if (q && !co?.name.toLowerCase().includes(q.toLowerCase())) return false
    if (csm && c.csmId !== csm) return false
    return true
  })
  const rows = tab === 'risk' ? base.filter((c) => c.health < 40 || c.stage === 'At risk') : tab === 'renewals' ? base.filter((c) => renewing.includes(c)) : tab === 'onboarding' ? base.filter((c) => c.stage === 'Onboarding' || c.stage === 'Adopting') : base
  const sorted = [...rows].sort((a, b) => (tab === 'renewals' ? a.renewalAt.localeCompare(b.renewalAt) : a.health - b.health))

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Everyone who already bought. Keep them healthy, renew them on time, and spot room to grow."
        actions={
          <>
            <Select placeholder="Any success manager" data={owners.map((o) => ({ value: o.id, label: o.name }))} value={csm} onChange={setCsm} clearable w={190} />
            <Button leftSection={<IconPlus size={16} />}>Log check-in</Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Annual recurring revenue" value={money(arr)} hint={`${customers.length} customer accounts`} />
        <Stat label="Renewing in 90 days" value={money(renewingArr)} hint={`${renewing.length} accounts · first on ${longDate(renewing[0].renewalAt)}`} tone="warn" />
        <Stat label="At risk" value={money(atRisk.reduce((s, c) => s + c.arr, 0))} hint={`${atRisk.length} account with health under 40`} tone="bad" />
        <Stat label="Average health" value={String(Math.round(customers.reduce((s, c) => s + c.health, 0) / customers.length))} hint="Usage, support load, NPS and engagement" tone="good" />
      </div>

      <Paper>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pr-3">
          <Tabs value={tab} onChange={setTab} styles={{ list: { borderBottom: 'none' } }}>
            <Tabs.List px="sm" pt={4}>
              <Tabs.Tab value="all">All · {customers.length}</Tabs.Tab>
              <Tabs.Tab value="renewals">Renewals · {renewing.length}</Tabs.Tab>
              <Tabs.Tab value="risk" rightSection={atRisk.length ? <span className="ml-1 inline-block size-1.5 rounded-full bg-red-500" /> : null}>
                At risk · {atRisk.length}
              </Tabs.Tab>
              <Tabs.Tab value="onboarding">Onboarding · {customers.filter((c) => c.stage === 'Onboarding' || c.stage === 'Adopting').length}</Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <TextInput placeholder="Search customers" leftSection={<IconSearch size={15} />} value={q} onChange={(e) => setQ(e.currentTarget.value)} w={220} size="xs" />
        </div>

        <Table.ScrollContainer minWidth={960}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Health</Table.Th>
                <Table.Th>Stage</Table.Th>
                <Table.Th>Plan</Table.Th>
                <Table.Th ta="right">ARR</Table.Th>
                <Table.Th>Usage</Table.Th>
                <Table.Th>Renewal</Table.Th>
                <Table.Th ta="right">Tickets</Table.Th>
                <Table.Th>CSM</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sorted.map((c) => {
                const co = companyById(c.companyId)!
                const days = daysUntil(c.renewalAt)
                return (
                  <Table.Tr key={c.id} className="cursor-pointer" onClick={() => navigate(`/customers/${c.id}`)}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <CompanyMark name={co.name} />
                        <div>
                          <Text size="sm" fw={500}>
                            {co.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Customer since {longDate(c.startedAt)}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6} wrap="nowrap">
                        <HealthRing value={c.health} />
                        <Trend trend={c.trend} />
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={stageColor[c.stage]}>{c.stage}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{c.plan}</Text>
                      <Text size="xs" c="dimmed" className="tabular">
                        {c.seats} seats
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" fw={500} className="tabular">
                        {money(c.arr)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={8} wrap="nowrap">
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-line">
                          <div className={`h-full rounded-full ${c.usage >= 70 ? 'bg-spruce-600' : c.usage >= 40 ? 'bg-amber-signal' : 'bg-red-500'}`} style={{ width: `${c.usage}%` }} />
                        </div>
                        <Text size="xs" c="dimmed" className="tabular">
                          {c.usage}%
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c={days < 0 ? 'red' : days <= 30 ? 'amber.8' : undefined} fw={days <= 30 ? 500 : 400}>
                        {longDate(c.renewalAt)}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {days < 0 ? `${-days} days overdue` : `in ${days} days`}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" className="tabular" c={c.openTickets ? undefined : 'dimmed'}>
                        {c.openTickets || '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <OwnerAvatar id={c.csmId} />
                    </Table.Td>
                  </Table.Tr>
                )
              })}
              {sorted.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={9}>
                    <div className="py-12 text-center">
                      <Text fw={500}>No customers here</Text>
                      <Text size="sm" c="dimmed">
                        Try another tab or clear the search.
                      </Text>
                    </div>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </>
  )
}
