import { useState } from 'react'
import { Badge, Button, Group, Paper, Select, Table, Text, Tabs, Tooltip, RingProgress, TextInput, type MantineColor } from '@mantine/core'
import { IconArrowDownRight, IconArrowUpRight, IconMinus, IconPlus, IconSearch } from '@tabler/icons-react'
import { useNavigate } from 'react-router'
import { companyById, customers, daysSince, daysUntil, money, moneyShort, nextOrderDue, owners, referrals, type Customer } from '../data/mock'
import { PartnerChip } from './Partners'
import { OwnerAvatar, PageHeader, Stat, longDate, shortDate } from '../components/ui'
import { CompanyMark } from './Companies'

export const stageColor: Record<Customer['stage'], MantineColor> = {
  'New account': 'blue',
  'Repeat buyer': 'spruce',
  Growing: 'spruce',
  Dormant: 'gray',
  'At risk': 'red',
}

export function HealthRing({ value, size = 34 }: { value: number; size?: number }) {
  const color = value >= 70 ? 'spruce.6' : value >= 40 ? 'amber.6' : 'red.6'
  return (
    <Tooltip label={`Health ${value} of 100 · order recency, revenue trend, payment behaviour and engagement`}>
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
  if (trend === 'up') return <IconArrowUpRight size={14} className="text-spruce-600" aria-label="Growing" />
  if (trend === 'down') return <IconArrowDownRight size={14} className="text-red-600" aria-label="Declining" />
  return <IconMinus size={14} className="text-muted" aria-label="Flat" />
}

export function Delta({ now, before }: { now: number; before: number }) {
  if (!before) return <span className="text-[12px] whitespace-nowrap text-muted">new this year</span>
  const pct = Math.round(((now - before) / before) * 100)
  const tone = pct > 3 ? 'text-spruce-600' : pct < -3 ? 'text-red-600' : 'text-muted'
  return (
    <span className={`tabular text-[12px] whitespace-nowrap ${tone}`}>
      {pct > 0 ? '+' : ''}
      {pct}% vs prior year
    </span>
  )
}

export default function Customers() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<string | null>('all')
  const [q, setQ] = useState('')
  const [am, setAm] = useState<string | null>(null)

  const revenue = customers.reduce((s, c) => s + c.revenue12m, 0)
  const prev = customers.reduce((s, c) => s + c.revenuePrev12m, 0)
  const outstanding = customers.reduce((s, c) => s + c.outstanding, 0)
  const overdue = customers.reduce((s, c) => s + c.overdue, 0)
  const reorderDue = customers.filter((c) => {
    const d = nextOrderDue(c)
    return d && daysUntil(d) <= 14
  })
  const atRisk = customers.filter((c) => c.stage === 'At risk' || c.stage === 'Dormant')

  const base = customers.filter((c) => {
    const co = companyById(c.companyId)
    if (q && !co?.name.toLowerCase().includes(q.toLowerCase())) return false
    if (am && c.accountManagerId !== am) return false
    return true
  })
  const rows =
    tab === 'reorder' ? base.filter((c) => reorderDue.includes(c)) : tab === 'risk' ? base.filter((c) => atRisk.includes(c)) : tab === 'overdue' ? base.filter((c) => c.overdue > 0) : tab === 'key' ? base.filter((c) => c.tier === 'Key account') : base
  const sorted = [...rows].sort((a, b) => (tab === 'reorder' ? (nextOrderDue(a) ?? '').localeCompare(nextOrderDue(b) ?? '') : b.revenue12m - a.revenue12m))

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="Companies that have ordered. Keep them ordering, get invoices paid, and grow your share of each."
        actions={
          <>
            <Select placeholder="Any account manager" data={owners.map((o) => ({ value: o.id, label: o.name }))} value={am} onChange={setAm} clearable w={190} />
            <Button leftSection={<IconPlus size={16} />}>New order</Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Revenue, last 12 months" value={money(revenue)} hint={`${Math.round(((revenue - prev) / prev) * 100) > 0 ? '+' : ''}${Math.round(((revenue - prev) / prev) * 100)}% vs prior year · ${customers.length} accounts`} tone="good" />
        <Stat label="Due to reorder soon" value={String(reorderDue.length)} hint={reorderDue.length ? `Worth about ${moneyShort(reorderDue.reduce((s, c) => s + c.revenue12m / Math.max(1, Math.round(365 / c.orderEveryDays)), 0))} at their usual order size` : 'Nobody due in the next 2 weeks'} tone="warn" />
        <Stat label="Outstanding invoices" value={money(outstanding)} hint={overdue ? `${money(overdue)} overdue` : 'Nothing overdue'} tone={overdue ? 'bad' : undefined} />
        <Stat label="At risk or dormant" value={String(atRisk.length)} hint={`${money(atRisk.reduce((s, c) => s + c.revenuePrev12m, 0))} bought last year`} tone="bad" />
      </div>

      <Paper>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pr-3">
          <Tabs value={tab} onChange={setTab} styles={{ list: { borderBottom: 'none' } }}>
            <Tabs.List px="sm" pt={4}>
              <Tabs.Tab value="all">All · {customers.length}</Tabs.Tab>
              <Tabs.Tab value="key">Key accounts · {customers.filter((c) => c.tier === 'Key account').length}</Tabs.Tab>
              <Tabs.Tab value="reorder">Reorder due · {reorderDue.length}</Tabs.Tab>
              <Tabs.Tab value="overdue" rightSection={overdue ? <span className="ml-1 inline-block size-1.5 rounded-full bg-red-500" /> : null}>
                Overdue payments · {customers.filter((c) => c.overdue > 0).length}
              </Tabs.Tab>
              <Tabs.Tab value="risk">At risk · {atRisk.length}</Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <TextInput placeholder="Search customers" leftSection={<IconSearch size={15} />} value={q} onChange={(e) => setQ(e.currentTarget.value)} w={220} size="xs" />
        </div>

        <Table.ScrollContainer minWidth={1040}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Health</Table.Th>
                <Table.Th>Stage</Table.Th>
                <Table.Th ta="right">Revenue 12m</Table.Th>
                <Table.Th>Last order</Table.Th>
                <Table.Th>Next order expected</Table.Th>
                <Table.Th ta="right">Outstanding</Table.Th>
                <Table.Th>Terms</Table.Th>
                <Table.Th>Manager</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sorted.map((c) => {
                const co = companyById(c.companyId)!
                const next = nextOrderDue(c)
                const nextDays = next ? daysUntil(next) : null
                return (
                  <Table.Tr key={c.id} className="cursor-pointer" onClick={() => navigate(`/customers/${c.id}`)}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <CompanyMark name={co.name} />
                        <div>
                          <Group gap={6}>
                            <Text size="sm" fw={500}>
                              {co.name}
                            </Text>
                            {c.tier === 'Key account' && (
                              <Badge color="spruce" variant="outline" size="xs" styles={{ root: { borderColor: '#a8d1c4' } }}>
                                Key
                              </Badge>
                            )}
                            {referrals[c.companyId] && <PartnerChip partnerId={referrals[c.companyId]} size="xs" />}
                          </Group>
                          <Text size="xs" c="dimmed">
                            Since {longDate(c.firstOrderAt)} · {money(c.lifetimeRevenue)} lifetime
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
                    <Table.Td ta="right">
                      <Text size="sm" fw={500} className="tabular">
                        {money(c.revenue12m)}
                      </Text>
                      <Delta now={c.revenue12m} before={c.revenuePrev12m} />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{shortDate(c.lastOrderAt)}</Text>
                      <Text size="xs" c="dimmed" className="whitespace-nowrap">
                        {daysSince(c.lastOrderAt)} days ago
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      {next && nextDays !== null ? (
                        <>
                          <Text size="sm" c={nextDays < 0 ? 'red' : nextDays <= 14 ? 'amber.8' : undefined} fw={nextDays <= 14 ? 500 : 400}>
                            {shortDate(next)}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {nextDays < 0 ? `${-nextDays} days late · usually every ${c.orderEveryDays}` : `in ${nextDays} days · usually every ${c.orderEveryDays}`}
                          </Text>
                        </>
                      ) : (
                        <Text size="xs" c="dimmed">
                          First order, no pattern yet
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" className="tabular" c={c.outstanding ? undefined : 'dimmed'}>
                        {c.outstanding ? money(c.outstanding) : '—'}
                      </Text>
                      {c.overdue > 0 && (
                        <Text size="xs" c="red" className="tabular">
                          {money(c.overdue)} overdue
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{c.paymentTerms}</Text>
                      <Text size="xs" c="dimmed" className="tabular">
                        Limit {moneyShort(c.creditLimit)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <OwnerAvatar id={c.accountManagerId} />
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
