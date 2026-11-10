import { Badge, Button, Group, Paper, Table, Text, Tooltip, type MantineColor } from '@mantine/core'
import { IconAffiliate, IconPlus } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router'
import { companyById, customerByCompany, money, partnerStats, partners, type Partner } from '../data/mock'
import { OwnerAvatar, PageHeader, Stat, longDate } from '../components/ui'
import { CompanyMark } from './Companies'

export const tierColor: Record<Partner['tier'], MantineColor> = { Gold: 'amber', Silver: 'gray', Bronze: 'orange' }
export const partnerStatusColor: Record<Partner['status'], MantineColor> = { Active: 'spruce', Onboarding: 'blue', Inactive: 'gray' }

export function PartnerChip({ partnerId, size = 'sm' }: { partnerId: string | undefined; size?: 'xs' | 'sm' }) {
  const p = partners.find((x) => x.id === partnerId)
  if (!p) return null
  const co = companyById(p.companyId)
  return (
    <Tooltip label={`Referred by ${co?.name} · ${p.kind} partner, ${p.commissionRate}% commission`}>
      <Link to={`/partners/${p.id}`} onClick={(e) => e.stopPropagation()}>
        <Badge size={size} color="grape" variant="light" leftSection={<IconAffiliate size={11} />} styles={{ root: { cursor: 'pointer' } }}>
          {co?.name}
        </Badge>
      </Link>
    </Tooltip>
  )
}

export default function Partners() {
  const navigate = useNavigate()
  const rows = partners.map((p) => ({ p, s: partnerStats(p) })).sort((a, b) => b.s.sourcedRevenue12m + b.s.wonValue - (a.s.sourcedRevenue12m + a.s.wonValue))
  const totals = rows.reduce(
    (t, { p, s }) => ({ leads: t.leads + s.leads, open: t.open + s.openValue, won: t.won + s.wonValue, sourced: t.sourced + s.sourcedRevenue12m, owed: t.owed + p.commissionOwed }),
    { leads: 0, open: 0, won: 0, sourced: 0, owed: 0 },
  )

  return (
    <>
      <PageHeader
        title="Partners"
        subtitle="Companies that bring you leads: referral partners, resellers and consultants. They may never buy themselves, but the accounts they introduce do."
        actions={<Button leftSection={<IconPlus size={16} />}>New partner</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Leads from partners" value={String(totals.leads)} hint={`${Math.round((totals.leads / 8) * 100)}% of all leads this month`} />
        <Stat label="Partner-sourced pipeline" value={money(totals.open)} hint="Open opportunities referred by a partner" />
        <Stat label="Partner-sourced revenue" value={money(totals.sourced)} hint="Last 12 months, from customers a partner introduced" tone="good" />
        <Stat label="Commission owed" value={money(totals.owed)} hint="Pay out after invoices are settled" tone={totals.owed ? 'warn' : undefined} />
      </div>

      <Paper>
        <Table.ScrollContainer minWidth={980}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Partner</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th ta="right">Leads</Table.Th>
                <Table.Th ta="right">Open pipeline</Table.Th>
                <Table.Th ta="right">Won</Table.Th>
                <Table.Th ta="right">Sourced revenue 12m</Table.Th>
                <Table.Th ta="right">Commission owed</Table.Th>
                <Table.Th>Manager</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map(({ p, s }) => {
                const co = companyById(p.companyId)!
                const alsoCustomer = customerByCompany(p.companyId)
                return (
                  <Table.Tr key={p.id} className="cursor-pointer" onClick={() => navigate(`/partners/${p.id}`)}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <CompanyMark name={co.name} />
                        <div>
                          <Group gap={6}>
                            <Text size="sm" fw={500}>
                              {co.name}
                            </Text>
                            <Badge size="xs" color={tierColor[p.tier]} variant="light">
                              {p.tier}
                            </Badge>
                            {alsoCustomer && (
                              <Tooltip label="This partner is also a customer">
                                <Badge size="xs" color="spruce" variant="outline" styles={{ root: { borderColor: '#a8d1c4' } }}>
                                  Customer too
                                </Badge>
                              </Tooltip>
                            )}
                          </Group>
                          <Text size="xs" c="dimmed">
                            Partner since {longDate(p.since)} · {p.commissionRate}% commission
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{p.kind}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={partnerStatusColor[p.status]}>{p.status}</Badge>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" className="tabular">
                        {s.leads}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" className="tabular">
                        {s.openValue ? money(s.openValue) : <span className="text-muted">—</span>}
                      </Text>
                      {s.openDeals > 0 && (
                        <Text size="xs" c="dimmed">
                          {s.openDeals} deals
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" className="tabular">
                        {s.wonValue ? money(s.wonValue) : <span className="text-muted">—</span>}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" fw={500} className="tabular">
                        {s.sourcedRevenue12m ? money(s.sourcedRevenue12m) : <span className="font-normal text-muted">—</span>}
                      </Text>
                      {s.customers > 0 && (
                        <Text size="xs" c="dimmed">
                          {s.customers} {s.customers === 1 ? 'customer' : 'customers'}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" className="tabular" c={p.commissionOwed ? 'amber.8' : 'dimmed'} fw={p.commissionOwed ? 500 : 400}>
                        {p.commissionOwed ? money(p.commissionOwed) : '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <OwnerAvatar id={p.managerId} />
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </>
  )
}
