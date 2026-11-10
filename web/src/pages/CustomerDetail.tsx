import { Anchor, Badge, Breadcrumbs, Button, Checkbox, DataList, Group, Menu, Paper, Tabs, Text, Title, ActionIcon, Alert, Progress, Divider, Table, Tooltip } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import { IconAlertTriangle, IconCalendarEvent, IconDots, IconFileDollar, IconPlus, IconTrendingUp, IconMessage, IconCheck, IconShoppingCart } from '@tabler/icons-react'
import { Link, useParams } from 'react-router'
import { notifications } from '@mantine/notifications'
import { activities, agreements, companyById, contacts, customerById, daysSince, daysUntil, deals, fullName, invoices, money, moneyShort, nextOrderDue, orders, owners, productLines, revenueByMonth, stageById, successSteps } from '../data/mock'
import { ContactAvatar, Field, LifecycleBadge, OwnerAvatar, Stat, longDate, shortDate } from '../components/ui'
import { Timeline } from './Activities'
import { NewInquiryDrawer } from '../components/NewInquiry'
import { useState } from 'react'
import { CompanyMark } from './Companies'
import { Delta, HealthRing, stageColor, Trend } from './Customers'

const orderColor = { Quoted: 'gray', Confirmed: 'blue', Delivered: 'indigo', Invoiced: 'amber', Paid: 'spruce' } as const
const invoiceColor = { Paid: 'spruce', Open: 'gray', Overdue: 'red' } as const

export default function CustomerDetail() {
  const { id } = useParams()
  const cu = customerById(id)
  if (!cu) return <Text>Customer not found.</Text>
  const co = companyById(cu.companyId)!
  const people = contacts.filter((c) => c.companyId === co.id)
  const sponsor = people.find((p) => p.tags.includes('Decision maker')) ?? people[0]
  const steps = successSteps.filter((s) => s.customerId === cu.id).sort((a, b) => Number(a.done) - Number(b.done) || a.dueAt.localeCompare(b.dueAt))
  const myOrders = orders.filter((o) => o.customerId === cu.id).sort((a, b) => b.date.localeCompare(a.date))
  const myInvoices = invoices.filter((i) => i.customerId === cu.id).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
  const myAgreements = agreements.filter((a) => a.customerId === cu.id)
  const expansions = deals.filter((d) => d.companyId === co.id && stageById(d.stageId).kind === 'open')
  const items = activities.filter((a) => a.companyId === co.id)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const manager = owners.find((o) => o.id === cu.accountManagerId)
  const next = nextOrderDue(cu)
  const nextDays = next ? daysUntil(next) : null
  const notBuying = productLines.filter((p) => !cu.productLines.includes(p))
  const avgOrder = Math.round(myOrders.reduce((s, o) => s + o.amount, 0) / Math.max(1, myOrders.length))
  const creditUsed = Math.round((cu.outstanding / cu.creditLimit) * 100)
  const overdueInvoice = myInvoices.find((i) => i.status === 'Overdue')

  return (
    <>
      <NewInquiryDrawer key={co.id} opened={inquiryOpen} onClose={() => setInquiryOpen(false)} companyId={co.id} />
      <Breadcrumbs mb="md" separatorMargin={6}>
        <Anchor component={Link} to="/customers" size="sm">
          Customers
        </Anchor>
        <Text size="sm">{co.name}</Text>
      </Breadcrumbs>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <Group gap="md" align="flex-start">
          <CompanyMark name={co.name} size={56} />
          <div>
            <Group gap="sm">
              <Title order={1}>{co.name}</Title>
              <Badge color={stageColor[cu.stage]} size="md">
                {cu.stage}
              </Badge>
              {cu.tier === 'Key account' && (
                <Badge color="spruce" variant="outline" size="md" styles={{ root: { borderColor: '#a8d1c4' } }}>
                  Key account
                </Badge>
              )}
            </Group>
            <Text c="dimmed" size="sm" mt={2}>
              Customer since {longDate(cu.firstOrderAt)} · {myOrders.length} orders · {money(cu.lifetimeRevenue)} lifetime ·{' '}
              <Anchor component={Link} to={`/companies/${co.id}`} size="sm">
                company record
              </Anchor>
            </Text>
          </div>
        </Group>
        <Group gap="xs">
          <Button variant="default" leftSection={<IconCalendarEvent size={16} />}>
            Schedule review
          </Button>
          <Button variant="default" leftSection={<IconFileDollar size={16} />} component={Link} to="/quotes">
            New quote
          </Button>
          <Button leftSection={<IconMessage size={16} />} onClick={() => notifications.show({ message: 'Check-in logged on the timeline', color: 'spruce' })}>
            Log check-in
          </Button>
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="default" size={34} aria-label="More">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Change account manager</Menu.Item>
              <Menu.Item>Change terms or credit limit</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red">Mark as lost</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>

      {cu.stage === 'At risk' && (
        <Alert color="red" variant="light" icon={<IconAlertTriangle size={18} />} title="This account needs attention" mb="md">
          No order for {daysSince(cu.lastOrderAt)} days against a usual gap of {cu.orderEveryDays}, revenue is down {Math.round((1 - cu.revenue12m / cu.revenuePrev12m) * 100)}% on last year, and {money(cu.overdue)} is{' '}
          {overdueInvoice ? daysSince(overdueInvoice.dueAt) : 0} days past due. Call the buyer before the next order is lost.
        </Alert>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-lg border border-line bg-white px-4 py-3">
          <HealthRing value={cu.health} size={56} />
          <div>
            <Text size="sm" c="dimmed">
              Health
            </Text>
            <Group gap={4}>
              <Text fw={600}>{cu.health >= 70 ? 'Healthy' : cu.health >= 40 ? 'Watch' : 'At risk'}</Text>
              <Trend trend={cu.trend} />
            </Group>
            <Text size="xs" c="dimmed">
              Orders, revenue, payments, contact
            </Text>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-white px-4 py-3.5">
          <Text size="sm" c="dimmed">
            Revenue, last 12 months
          </Text>
          <div className="tabular mt-1 text-[24px] leading-none font-semibold">{money(cu.revenue12m)}</div>
          <div className="mt-2">
            <Delta now={cu.revenue12m} before={cu.revenuePrev12m} />
          </div>
        </div>
        <Stat
          label="Next order expected"
          value={next ? shortDate(next) : 'Unknown'}
          hint={nextDays === null ? 'First order only, no pattern yet' : nextDays < 0 ? `${-nextDays} days late · usually every ${cu.orderEveryDays} days` : `in ${nextDays} days · average order ${moneyShort(avgOrder)}`}
          tone={nextDays === null ? undefined : nextDays < 0 ? 'bad' : nextDays <= 14 ? 'warn' : undefined}
        />
        <Stat
          label="Outstanding"
          value={money(cu.outstanding)}
          hint={cu.overdue ? `${money(cu.overdue)} overdue · ${creditUsed}% of credit limit used` : cu.outstanding ? `All within terms · ${creditUsed}% of credit limit used` : `Nothing open · ${cu.paymentTerms}`}
          tone={cu.overdue ? 'bad' : undefined}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <Paper p="lg">
            <Group justify="space-between" mb="xs">
              <div>
                <Title order={3}>Orders by month</Title>
                <Text size="sm" c="dimmed">
                  Order value booked each month, last 12 months.
                </Text>
              </div>
              <Text size="sm" c="dimmed" className="tabular">
                Average order {money(avgOrder)}
              </Text>
            </Group>
            <BarChart h={170} data={revenueByMonth[cu.id]} dataKey="month" series={[{ name: 'revenue', label: 'Orders', color: cu.stage === 'At risk' ? 'red.5' : 'spruce.6' }]} valueFormatter={(v) => moneyShort(v)} gridAxis="y" barProps={{ radius: 3 }} />
          </Paper>

          <Tabs defaultValue="orders">
            <Tabs.List mb="md">
              <Tabs.Tab value="orders">Orders · {myOrders.length}</Tabs.Tab>
              <Tabs.Tab value="invoices" rightSection={cu.overdue ? <span className="ml-1 inline-block size-1.5 rounded-full bg-red-500" /> : null}>
                Invoices · {myInvoices.length}
              </Tabs.Tab>
              <Tabs.Tab value="agreements">Agreements · {myAgreements.length}</Tabs.Tab>
              <Tabs.Tab value="expansion">Opportunities · {expansions.length}</Tabs.Tab>
              <Tabs.Tab value="timeline">Timeline · {items.length}</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="orders">
              <Paper>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Order</Table.Th>
                      <Table.Th>Items</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th ta="right">Amount</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {myOrders.map((o) => (
                      <Table.Tr key={o.id}>
                        <Table.Td>
                          <Text size="sm" fw={500} className="tabular">
                            {o.number}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{o.items}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">
                            {shortDate(o.date)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={orderColor[o.status]}>{o.status}</Badge>
                        </Table.Td>
                        <Table.Td ta="right">
                          <Text size="sm" fw={500} className="tabular">
                            {money(o.amount)}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                <div className="flex items-center justify-between border-t border-line px-4 py-3">
                  <Text size="sm" c="dimmed">
                    {next && nextDays !== null && nextDays <= 14 ? `Usually reorders every ${cu.orderEveryDays} days. A reorder is ${nextDays < 0 ? 'late' : 'due soon'}.` : 'Orders sync from your order system or are entered here.'}
                  </Text>
                  <Button variant="light" size="xs" leftSection={<IconShoppingCart size={14} />}>
                    New order
                  </Button>
                </div>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="invoices">
              <Paper>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Invoice</Table.Th>
                      <Table.Th>Issued</Table.Th>
                      <Table.Th>Due</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th ta="right">Amount</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {myInvoices.map((i) => (
                      <Table.Tr key={i.id}>
                        <Table.Td>
                          <Text size="sm" fw={500} className="tabular">
                            {i.number}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {orders.find((o) => o.id === i.orderId)?.number}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">
                            {shortDate(i.issuedAt)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c={i.status === 'Overdue' ? 'red' : undefined} fw={i.status === 'Overdue' ? 500 : 400}>
                            {shortDate(i.dueAt)}
                          </Text>
                          {i.status === 'Overdue' && (
                            <Text size="xs" c="red">
                              {daysSince(i.dueAt)} days late
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Badge color={invoiceColor[i.status]}>{i.status}</Badge>
                        </Table.Td>
                        <Table.Td ta="right">
                          <Text size="sm" fw={500} className="tabular">
                            {money(i.amount)}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                    {myInvoices.length === 0 && (
                      <Table.Tr>
                        <Table.Td colSpan={5}>
                          <Text size="sm" c="dimmed" ta="center" py="md">
                            No invoices yet.
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
                {cu.overdue > 0 && (
                  <div className="flex items-center justify-between border-t border-line px-4 py-3">
                    <Text size="sm" c="red">
                      {money(cu.overdue)} overdue. New orders are on hold until this is settled.
                    </Text>
                    <Button variant="light" color="red" size="xs">
                      Send reminder
                    </Button>
                  </div>
                )}
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="agreements">
              <Paper>
                {myAgreements.map((a) => {
                  const d = daysUntil(a.validUntil)
                  return (
                    <div key={a.id} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0">
                      <div className="min-w-0 flex-1">
                        <Text size="sm" fw={500}>
                          {a.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {a.terms}
                        </Text>
                      </div>
                      <div className="text-right">
                        <Text size="sm" c={d <= 60 ? 'amber.8' : undefined} fw={d <= 60 ? 500 : 400}>
                          Valid until {longDate(a.validUntil)}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {d <= 60 ? `Renew within ${d} days` : `${d} days left`}
                        </Text>
                      </div>
                    </div>
                  )
                })}
                <div className="flex items-center justify-between px-4 py-3">
                  <Text size="sm" c="dimmed">
                    {myAgreements.length ? 'Pricing and service terms that quotes for this customer follow.' : 'No special terms. Quotes use list price.'}
                  </Text>
                  <Button variant="light" size="xs" leftSection={<IconPlus size={14} />}>
                    Add agreement
                  </Button>
                </div>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="expansion">
              <Paper>
                {expansions.map((d) => (
                  <Link key={d.id} to={`/pipeline?deal=${d.id}`} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0 hover:bg-paper">
                    <IconTrendingUp size={16} className="text-spruce-600" />
                    <div className="min-w-0 flex-1">
                      <Text size="sm" fw={500}>
                        {d.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {stageById(d.stageId).name} · closes {shortDate(d.closeDate)}
                      </Text>
                    </div>
                    <Text size="sm" fw={500} className="tabular">
                      {money(d.amount)}
                    </Text>
                    <OwnerAvatar id={d.ownerId} size={22} />
                  </Link>
                ))}
                <div className="flex items-center justify-between px-4 py-3">
                  <Text size="sm" c="dimmed">
                    {expansions.length ? 'Open opportunities on this account, from the shared pipeline.' : 'No open opportunities on this account.'}
                  </Text>
                  <Button variant="light" size="xs" leftSection={<IconPlus size={14} />} onClick={() => setInquiryOpen(true)}>
                    New inquiry
                  </Button>
                </div>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="timeline">
              {items.length ? (
                <Timeline items={items} />
              ) : (
                <Paper p="xl" ta="center">
                  <Text fw={500}>No activity logged yet</Text>
                  <Text size="sm" c="dimmed">
                    Check-ins, calls and emails with this customer will show here.
                  </Text>
                </Paper>
              )}
            </Tabs.Panel>
          </Tabs>
        </div>

        <div className="flex flex-col gap-4">
          <Paper p="md">
            <Group justify="space-between" mb="sm">
              <Text fw={600} size="sm">
                Account plan
              </Text>
              <Button variant="subtle" size="compact-xs" leftSection={<IconPlus size={12} />}>
                Add step
              </Button>
            </Group>
            <Progress value={(steps.filter((s) => s.done).length / Math.max(steps.length, 1)) * 100} size={4} color="spruce.6" mb="sm" />
            <div className="flex flex-col">
              {steps.map((s) => {
                const overdue = !s.done && s.dueAt < '2026-11-09'
                return (
                  <label key={s.id} className="-mx-2 flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-paper">
                    <Checkbox size="xs" mt={3} defaultChecked={s.done} />
                    <div className="min-w-0 flex-1">
                      <Text size="sm" td={s.done ? 'line-through' : undefined} c={s.done ? 'dimmed' : undefined}>
                        {s.title}
                      </Text>
                      <Text size="xs" c={overdue ? 'red' : 'dimmed'}>
                        {overdue ? 'Overdue · ' : ''}
                        {shortDate(s.dueAt)}
                      </Text>
                    </div>
                  </label>
                )
              })}
            </div>
          </Paper>

          <Paper p="md">
            <Text fw={600} size="sm" mb={2}>
              What they buy
            </Text>
            <Text size="xs" c="dimmed" mb="sm">
              {cu.productLines.length} of {productLines.length} product lines. Grey ones are room to grow.
            </Text>
            <div className="flex flex-wrap gap-1.5">
              {productLines.map((p) => {
                const has = cu.productLines.includes(p)
                return (
                  <Tooltip key={p} label={has ? 'Buying today' : 'Not bought yet'}>
                    <Badge color={has ? 'spruce' : 'gray'} variant={has ? 'light' : 'outline'} leftSection={has ? <IconCheck size={11} /> : undefined} styles={{ root: { borderColor: has ? undefined : '#e3e8e6', fontWeight: 500 } }}>
                      {p}
                    </Badge>
                  </Tooltip>
                )
              })}
            </div>
            {notBuying.length > 0 && (
              <Text size="xs" c="dimmed" mt="sm">
                Next to propose: {notBuying[0]}.
              </Text>
            )}
          </Paper>

          <Paper p="md">
            <Text fw={600} size="sm" mb="sm">
              Terms and credit
            </Text>
            <DataList size="sm" labelWidth={110} gap={10}>
              <Field label="Payment terms">{cu.paymentTerms}</Field>
              <Field label="Credit limit">
                <span className="tabular">{money(cu.creditLimit)}</span>
              </Field>
              <Field label="In use">
                <Group gap={8}>
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-line">
                    <div className={`h-full rounded-full ${creditUsed > 80 ? 'bg-red-500' : creditUsed > 50 ? 'bg-amber-signal' : 'bg-spruce-600'}`} style={{ width: `${Math.min(creditUsed, 100)}%` }} />
                  </div>
                  <span className="tabular text-[13px]">{creditUsed}%</span>
                </Group>
              </Field>
              <Field label="Typical order">
                <span className="tabular">
                  {money(avgOrder)}
                  {cu.orderEveryDays ? ` every ${cu.orderEveryDays} days` : ''}
                </span>
              </Field>
            </DataList>
          </Paper>

          <Paper p="md">
            <Text fw={600} size="sm" mb="sm">
              People
            </Text>
            <DataList size="sm" labelWidth={110} gap={10}>
              <Field label="Account manager">
                <Group gap={6}>
                  <OwnerAvatar id={cu.accountManagerId} size={20} />
                  <Text size="sm">{manager?.name}</Text>
                </Group>
              </Field>
            </DataList>
            <Divider my="sm" />
            <Text size="xs" c="dimmed" mb={6}>
              At the customer
            </Text>
            <div className="flex flex-col gap-1">
              {people.map((p) => (
                <Link key={p.id} to={`/contacts/${p.id}`} className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-paper">
                  <ContactAvatar name={fullName(p)} size={26} />
                  <div className="min-w-0 flex-1">
                    <Text size="sm" fw={500} truncate component="div">
                      {fullName(p)}
                      {p.id === sponsor?.id && (
                        <Badge ml={6} color="spruce" variant="light" size="xs">
                          Buyer
                        </Badge>
                      )}
                    </Text>
                    <Text size="xs" c="dimmed" truncate>
                      {p.title}
                    </Text>
                  </div>
                  <LifecycleBadge stage={p.lifecycle} />
                </Link>
              ))}
            </div>
          </Paper>
        </div>
      </div>
    </>
  )
}
