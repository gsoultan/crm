import { Anchor, Badge, Breadcrumbs, Button, Checkbox, DataList, Group, Menu, Paper, Tabs, Text, Title, ActionIcon, Alert, Progress, Divider } from '@mantine/core'
import { AreaChart } from '@mantine/charts'
import { IconAlertTriangle, IconCalendarEvent, IconDots, IconFileDollar, IconPlus, IconTrendingUp, IconArrowRight, IconMessage } from '@tabler/icons-react'
import { Link, useParams } from 'react-router'
import { notifications } from '@mantine/notifications'
import { activities, companyById, contacts, customerById, deals, fullName, money, owners, stageById, successSteps, tickets, usageTrend } from '../data/mock'
import { ContactAvatar, Field, LifecycleBadge, OwnerAvatar, Stat, longDate, shortDate } from '../components/ui'
import { Timeline } from './Activities'
import { CompanyMark } from './Companies'
import { HealthRing, stageColor, Trend } from './Customers'

const daysUntil = (iso: string) => Math.round((new Date(iso).getTime() - new Date('2026-11-09').getTime()) / 86400000)

export default function CustomerDetail() {
  const { id } = useParams()
  const cu = customerById(id)
  if (!cu) return <Text>Customer not found.</Text>
  const co = companyById(cu.companyId)!
  const people = contacts.filter((c) => c.companyId === co.id)
  const champion = people.find((p) => p.tags.includes('Decision maker')) ?? people[0]
  const steps = successSteps.filter((s) => s.customerId === cu.id).sort((a, b) => Number(a.done) - Number(b.done) || a.dueAt.localeCompare(b.dueAt))
  const myTickets = tickets.filter((t) => t.customerId === cu.id).filter((t) => t.status !== 'Resolved')
  const expansions = deals.filter((d) => d.companyId === co.id && stageById(d.stageId).kind === 'open')
  const items = activities.filter((a) => a.companyId === co.id)
  const days = daysUntil(cu.renewalAt)
  const csm = owners.find((o) => o.id === cu.csmId)
  const lifetime = Math.round((new Date('2026-11-09').getTime() - new Date(cu.startedAt).getTime()) / (86400000 * 30))

  return (
    <>
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
            </Group>
            <Text c="dimmed" size="sm" mt={2}>
              {cu.plan} plan · {cu.seats} seats · customer for {lifetime} months ·{' '}
              <Anchor component={Link} to={`/companies/${co.id}`} size="sm">
                company record
              </Anchor>
            </Text>
          </div>
        </Group>
        <Group gap="xs">
          <Button variant="default" leftSection={<IconCalendarEvent size={16} />}>
            Schedule QBR
          </Button>
          <Button variant="default" leftSection={<IconFileDollar size={16} />} component={Link} to="/quotes">
            Renewal quote
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
              <Menu.Item>Change success manager</Menu.Item>
              <Menu.Item>Change plan or seats</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red">Mark as churned</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>

      {cu.health < 40 && (
        <Alert color="red" variant="light" icon={<IconAlertTriangle size={18} />} title="This account is at risk" mb="md">
          Active users dropped from {usageTrend[cu.id][0].active}% to {cu.usage}% in six weeks, there are {myTickets.length} open tickets and the renewal was {-days} days ago. Reach the
          sponsor this week.
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
              <Text fw={600} className="tabular">
                {cu.health >= 70 ? 'Healthy' : cu.health >= 40 ? 'Watch' : 'At risk'}
              </Text>
              <Trend trend={cu.trend} />
            </Group>
            <Text size="xs" c="dimmed">
              {cu.trend === 'up' ? 'Improving' : cu.trend === 'down' ? 'Declining' : 'Steady'} over 6 weeks
            </Text>
          </div>
        </div>
        <Stat label="Annual recurring revenue" value={money(cu.arr)} hint={`${money(cu.arr / cu.seats)} per seat per year`} />
        <Stat
          label="Renewal"
          value={shortDate(cu.renewalAt)}
          hint={days < 0 ? `${-days} days overdue` : `in ${days} days${days <= 30 ? ' · start the conversation' : ''}`}
          tone={days < 0 ? 'bad' : days <= 30 ? 'warn' : undefined}
        />
        <Stat label="Expansion open" value={money(expansions.reduce((s, d) => s + d.amount, 0))} hint={expansions.length ? `${expansions.length} upsell ${expansions.length === 1 ? 'deal' : 'deals'} in pipeline` : 'No open deals'} tone={expansions.length ? 'good' : undefined} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <Paper p="lg">
            <Group justify="space-between" mb="xs">
              <div>
                <Title order={3}>Seat usage</Title>
                <Text size="sm" c="dimmed">
                  Share of {cu.seats} seats active each week.
                </Text>
              </div>
              <Text size="sm" fw={600} className="tabular">
                {cu.usage}% now
              </Text>
            </Group>
            <AreaChart
              h={160}
              data={usageTrend[cu.id]}
              dataKey="week"
              series={[{ name: 'active', label: 'Active seats', color: cu.health < 40 ? 'red.6' : 'spruce.6' }]}
              yAxisProps={{ domain: [0, 100] }}
              unit="%"
              gridAxis="y"
              curveType="monotone"
              withDots={false}
              fillOpacity={0.15}
            />
          </Paper>

          <Paper p="lg">
            <Group justify="space-between" mb="sm">
              <div>
                <Title order={3}>Success plan</Title>
                <Text size="sm" c="dimmed">
                  {steps.filter((s) => s.done).length} of {steps.length} steps done
                </Text>
              </div>
              <Button variant="subtle" size="compact-xs" leftSection={<IconPlus size={12} />}>
                Add step
              </Button>
            </Group>
            <Progress value={(steps.filter((s) => s.done).length / Math.max(steps.length, 1)) * 100} size={4} color="spruce.6" mb="sm" />
            <div className="flex flex-col">
              {steps.map((s) => {
                const overdue = !s.done && s.dueAt < '2026-11-09'
                return (
                  <label key={s.id} className="-mx-2 flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-paper">
                    <Checkbox size="sm" defaultChecked={s.done} />
                    <Text size="sm" className="flex-1" td={s.done ? 'line-through' : undefined} c={s.done ? 'dimmed' : undefined}>
                      {s.title}
                    </Text>
                    <Text size="xs" c={overdue ? 'red' : 'dimmed'}>
                      {overdue ? 'Overdue · ' : ''}
                      {shortDate(s.dueAt)}
                    </Text>
                    <OwnerAvatar id={s.ownerId} size={20} />
                  </label>
                )
              })}
            </div>
          </Paper>

          <Tabs defaultValue="timeline">
            <Tabs.List mb="md">
              <Tabs.Tab value="timeline">Timeline · {items.length}</Tabs.Tab>
              <Tabs.Tab value="tickets">Support · {myTickets.length}</Tabs.Tab>
              <Tabs.Tab value="expansion">Expansion · {expansions.length}</Tabs.Tab>
            </Tabs.List>
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
            <Tabs.Panel value="tickets">
              <Paper>
                {myTickets.length ? (
                  myTickets.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0">
                      <Badge color={t.priority === 'High' ? 'red' : t.priority === 'Normal' ? 'gray' : 'gray'} variant={t.priority === 'High' ? 'light' : 'outline'} styles={{ root: { borderColor: '#e3e8e6' } }}>
                        {t.priority}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <Text size="sm" fw={500}>
                          {t.subject}
                        </Text>
                        <Text size="xs" c="dimmed">
                          Opened {longDate(t.openedAt)} · {t.status}
                        </Text>
                      </div>
                      <Button variant="subtle" size="compact-xs" rightSection={<IconArrowRight size={12} />}>
                        Open
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <Text fw={500}>No open tickets</Text>
                    <Text size="sm" c="dimmed">
                      Support requests from this customer will appear here.
                    </Text>
                  </div>
                )}
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
                    {expansions.length ? 'Upsell and cross-sell deals for this account.' : 'No expansion deals yet.'}
                  </Text>
                  <Button variant="light" size="xs" leftSection={<IconPlus size={14} />}>
                    New expansion deal
                  </Button>
                </div>
              </Paper>
            </Tabs.Panel>
          </Tabs>
        </div>

        <div className="flex flex-col gap-4">
          <Paper p="md">
            <Text fw={600} size="sm" mb="sm">
              Subscription
            </Text>
            <DataList size="sm" labelWidth={110} gap={10}>
              <Field label="Plan">{cu.plan}</Field>
              <Field label="Seats">
                <span className="tabular">
                  {cu.seats} · {Math.round((cu.usage / 100) * cu.seats)} active
                </span>
              </Field>
              <Field label="ARR">
                <span className="tabular">{money(cu.arr)}</span>
              </Field>
              <Field label="Started">{longDate(cu.startedAt)}</Field>
              <Field label="Renews">{longDate(cu.renewalAt)}</Field>
              <Field label="Billing">Annual, invoice</Field>
              <Field label="NPS">{cu.nps === null ? <span className="text-muted">Not surveyed yet</span> : <span className="tabular">{cu.nps} of 10</span>}</Field>
            </DataList>
          </Paper>

          <Paper p="md">
            <Text fw={600} size="sm" mb="sm">
              Team on this account
            </Text>
            <DataList size="sm" labelWidth={110} gap={10}>
              <Field label="Success manager">
                <Group gap={6}>
                  <OwnerAvatar id={cu.csmId} size={20} />
                  <Text size="sm">{csm?.name}</Text>
                </Group>
              </Field>
              <Field label="Account owner">
                <Group gap={6}>
                  <OwnerAvatar id={co.ownerId} size={20} />
                  <Text size="sm">{owners.find((o) => o.id === co.ownerId)?.name}</Text>
                </Group>
              </Field>
            </DataList>
            <Divider my="sm" />
            <Text size="xs" c="dimmed" mb={6}>
              Customer contacts
            </Text>
            <div className="flex flex-col gap-1">
              {people.map((p) => (
                <Link key={p.id} to={`/contacts/${p.id}`} className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-paper">
                  <ContactAvatar name={fullName(p)} size={26} />
                  <div className="min-w-0 flex-1">
                    <Text size="sm" fw={500} truncate component="div">
                      {fullName(p)}
                      {p.id === champion?.id && (
                        <Badge ml={6} color="spruce" variant="light" size="xs">
                          Sponsor
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
