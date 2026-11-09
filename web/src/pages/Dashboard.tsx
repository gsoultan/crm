import { Button, Checkbox, Group, Paper, Text, Title, Anchor } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import { IconPlus, IconArrowRight } from '@tabler/icons-react'
import { Link } from 'react-router'
import { activities, companyById, contactById, customers, daysUntil, deals, fullName, leads, money, nextOrderDue, pipelineTrend, stageById, stages } from '../data/mock'
import { ContactAvatar, HealthDot, OwnerAvatar, PageHeader, Stat, relative, shortDate } from '../components/ui'
import { ActivityIcon } from './Activities'

export default function Dashboard() {
  const open = deals.filter((d) => stageById(d.stageId).kind === 'open')
  const openValue = open.reduce((s, d) => s + d.amount, 0)
  const weighted = open.reduce((s, d) => s + d.amount * (stageById(d.stageId).probability / 100), 0)
  const wonThisMonth = deals.filter((d) => d.stageId === 's5' && d.closeDate.startsWith('2026-11')).reduce((s, d) => s + d.amount, 0)
  const closingSoon = open.filter((d) => d.closeDate <= '2026-11-30').sort((a, b) => a.closeDate.localeCompare(b.closeDate))
  const tasks = activities.filter((a) => a.type === 'task' && !a.done).sort((a, b) => (a.dueAt ?? '').localeCompare(b.dueAt ?? ''))
  const recent = activities.filter((a) => a.type !== 'task').sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6)
  const newLeads = leads.filter((l) => l.status === 'New').length

  return (
    <>
      <PageHeader
        title="Good morning, Gembit"
        subtitle="Sunday 9 November · here is what needs attention this week."
        actions={
          <>
            <Button variant="default" component={Link} to="/leads">
              Review {newLeads} new leads
            </Button>
            <Button leftSection={<IconPlus size={16} />}>New deal</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Open pipeline" value={money(openValue)} hint={`${open.length} deals · ${money(weighted)} weighted`} />
        <Stat label="Won this month" value={money(wonThisMonth)} hint="Quota $170k · 47% there" tone="warn" />
        <Stat label="Closing this month" value={String(closingSoon.length)} hint={`${money(closingSoon.reduce((s, d) => s + d.amount, 0))} across them`} />
        <Stat label="Leads waiting" value={String(newLeads)} hint="Oldest has waited 2 days" tone="bad" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Paper p="lg" className="lg:col-span-2">
          <Group justify="space-between" mb="md">
            <div>
              <Title order={3}>Deals closing this month</Title>
              <Text size="sm" c="dimmed">
                Sorted by close date. Dot shows deal health.
              </Text>
            </div>
            <Anchor component={Link} to="/pipeline" size="sm">
              Open pipeline
            </Anchor>
          </Group>
          <div className="divide-y divide-line">
            {closingSoon.map((d) => (
              <Link key={d.id} to={`/pipeline?deal=${d.id}`} className="flex items-center gap-3 py-2.5 hover:bg-paper -mx-2 px-2 rounded-md">
                <HealthDot health={d.health} />
                <div className="min-w-0 flex-1">
                  <Text size="sm" fw={500} truncate>
                    {d.name}
                  </Text>
                  <Text size="xs" c="dimmed" truncate>
                    {companyById(d.companyId)?.name} · {stageById(d.stageId).name}
                  </Text>
                </div>
                <Text size="xs" c="dimmed" className="hidden sm:block">
                  {shortDate(d.closeDate)}
                </Text>
                <Text size="sm" fw={500} className="tabular w-20 text-right">
                  {money(d.amount)}
                </Text>
                <OwnerAvatar id={d.ownerId} size={24} />
              </Link>
            ))}
          </div>
        </Paper>

        <Paper p="lg">
          <Group justify="space-between" mb="md">
            <Title order={3}>My tasks</Title>
            <Anchor component={Link} to="/activities" size="sm">
              All tasks
            </Anchor>
          </Group>
          <div className="flex flex-col gap-1">
            {tasks.map((t) => {
              const overdue = (t.dueAt ?? '') < '2026-11-09'
              const c = contactById(t.contactId)
              return (
                <label key={t.id} className="flex cursor-pointer items-start gap-2.5 rounded-md px-1.5 py-2 hover:bg-paper">
                  <Checkbox size="sm" mt={2} />
                  <div className="min-w-0 flex-1">
                    <Text size="sm" fw={500} lineClamp={1}>
                      {t.subject}
                    </Text>
                    <Text size="xs" c={overdue ? 'red' : 'dimmed'}>
                      {overdue ? 'Overdue · ' : 'Due '}
                      {shortDate(t.dueAt!)}
                      {c && ` · ${fullName(c)}`}
                    </Text>
                  </div>
                </label>
              )
            })}
          </div>
        </Paper>

        <Paper p="lg" className="lg:col-span-2">
          <Group justify="space-between" mb="md">
            <div>
              <Title order={3}>Pipeline movement</Title>
              <Text size="sm" c="dimmed">
                Deals created, won and lost per week.
              </Text>
            </div>
          </Group>
          <BarChart
            h={200}
            data={pipelineTrend}
            dataKey="week"
            series={[
              { name: 'created', label: 'Created', color: 'spruce.3' },
              { name: 'won', label: 'Won', color: 'spruce.7' },
              { name: 'lost', label: 'Lost', color: 'gray.4' },
            ]}
            withLegend
            legendProps={{ verticalAlign: 'bottom', height: 28 }}
            gridAxis="y"
            barProps={{ radius: 3 }}
          />
        </Paper>

        <Paper p="lg">
          <Group justify="space-between" mb="md">
            <Title order={3}>Recent activity</Title>
          </Group>
          <div className="flex flex-col gap-3">
            {recent.map((a) => {
              const c = contactById(a.contactId)
              return (
                <div key={a.id} className="flex gap-2.5">
                  <ActivityIcon type={a.type} />
                  <div className="min-w-0 flex-1">
                    <Text size="sm" lineClamp={1}>
                      <span className="font-medium">{a.subject}</span>
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {c ? fullName(c) : companyById(a.companyId ?? null)?.name} · {relative(a.at)}
                    </Text>
                  </div>
                  {c && <ContactAvatar name={fullName(c)} size={22} />}
                </div>
              )
            })}
          </div>
          <Button variant="subtle" size="xs" mt="sm" rightSection={<IconArrowRight size={14} />} component={Link} to="/activities">
            View timeline
          </Button>
        </Paper>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {stages
          .filter((s) => s.kind === 'open')
          .map((s) => {
            const inStage = open.filter((d) => d.stageId === s.id)
            return (
              <Link key={s.id} to="/pipeline" className="rounded-lg border border-line bg-white px-4 py-3 hover:border-spruce-500">
                <Text size="xs" c="dimmed">
                  {s.name}
                </Text>
                <div className="tabular mt-0.5 text-lg font-semibold">{money(inStage.reduce((x, d) => x + d.amount, 0))}</div>
                <Text size="xs" c="dimmed">
                  {inStage.length} deals · {s.probability}% likely
                </Text>
              </Link>
            )
          })}
        <Link to="/customers" className="rounded-lg border border-amber-signal/40 bg-amber-signal/5 px-4 py-3 hover:border-amber-signal">
          <Text size="xs" c="dimmed">
            Customers due to reorder
          </Text>
          <div className="tabular mt-0.5 text-lg font-semibold">{customers.filter((c) => { const d = nextOrderDue(c); return d && daysUntil(d) <= 14 }).length}</div>
          <Text size="xs" c="dimmed">
            {money(customers.reduce((x, c) => x + c.overdue, 0))} in overdue invoices
          </Text>
        </Link>
      </div>
    </>
  )
}
