import { useMemo, useState } from 'react'
import {
  ActionBar,
  Badge,
  Button,
  Checkbox,
  Divider,
  Drawer,
  Group,
  Menu,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Tooltip,
  type MantineColor,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  IconArrowRight,
  IconArrowsRightLeft,
  IconCalendarEvent,
  IconCheck,
  IconChecklist,
  IconClock,
  IconDots,
  IconMail,
  IconMapPin,
  IconNote,
  IconPhone,
  IconPlus,
  IconSearch,
  IconUserPlus,
  IconUsers,
} from '@tabler/icons-react'
import { Link } from 'react-router'
import { NOW, TODAY, activities, companyById, contactById, deals, dealById, fullName, owners, stageById, type Activity, type ActivityType, type TaskPriority } from '../data/mock'
import { ContactAvatar, Field, OwnerAvatar, PageHeader, Stat, dateTime, shortDate } from '../components/ui'
import { DataList } from '@mantine/core'

const meta: Record<ActivityType, { icon: typeof IconMail; color: MantineColor; label: string }> = {
  note: { icon: IconNote, color: 'gray', label: 'Note' },
  call: { icon: IconPhone, color: 'blue', label: 'Call' },
  email: { icon: IconMail, color: 'indigo', label: 'Email' },
  meeting: { icon: IconUsers, color: 'spruce', label: 'Meeting' },
  task: { icon: IconChecklist, color: 'amber', label: 'Task' },
  stage: { icon: IconArrowsRightLeft, color: 'teal', label: 'Stage change' },
}

const priorityColor: Record<TaskPriority, MantineColor> = { High: 'red', Normal: 'gray', Low: 'gray' }
const outcomeColor: Record<NonNullable<Activity['outcome']>, MantineColor> = { Connected: 'spruce', 'No answer': 'gray', Voicemail: 'gray', Rescheduled: 'amber' }
const emailColor: Record<NonNullable<Activity['emailStatus']>, MantineColor> = { Sent: 'gray', Opened: 'blue', Replied: 'spruce', Bounced: 'red' }

const WEEK_END = '2026-11-15'
const time = (iso: string) => iso.slice(11, 16)
const endTime = (a: Activity) => {
  const d = new Date(a.at)
  d.setMinutes(d.getMinutes() + (a.durationMin ?? 30))
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
const dayLabel = (day: string) => (day === TODAY ? 'Today' : day === '2026-11-08' ? 'Yesterday' : day === '2026-11-10' ? 'Tomorrow' : shortDate(day))
const dueTone = (due: string): MantineColor | undefined => (due < TODAY ? 'red' : due === TODAY ? 'amber.8' : undefined)
const dueLabel = (due: string) => (due < TODAY ? `${Math.round((new Date(TODAY).getTime() - new Date(due).getTime()) / 86400000)}d overdue` : due === TODAY ? 'Today' : due === '2026-11-10' ? 'Tomorrow' : shortDate(due))

export function ActivityIcon({ type, size = 26 }: { type: ActivityType; size?: number }) {
  const m = meta[type]
  const Icon = m.icon
  return (
    <ThemeIcon size={size} radius="xl" variant="light" color={m.color}>
      <Icon size={size * 0.55} stroke={1.75} />
    </ThemeIcon>
  )
}

function Related({ a, showWho, showDeal }: { a: Activity; showWho: boolean; showDeal: boolean }) {
  const c = contactById(a.contactId ?? null)
  const co = companyById(a.companyId ?? null)
  const d = dealById(a.dealId ?? null)
  if (!showWho && !(d && showDeal)) return null
  return (
    <Group gap={6} mt={6} wrap="nowrap" className="min-w-0">
      {showWho && c && (
        <Link to={`/contacts/${c.id}`} className="flex shrink-0 items-center gap-1.5 text-[12.5px] text-spruce-700 hover:underline" onClick={(e) => e.stopPropagation()}>
          <ContactAvatar name={fullName(c)} size={16} />
          {fullName(c)}
        </Link>
      )}
      {showWho && !c && co && (
        <Link to={`/companies/${co.id}`} className="text-[12.5px] text-spruce-700 hover:underline" onClick={(e) => e.stopPropagation()}>
          {co.name}
        </Link>
      )}
      {showWho && c && co && (
        <Text size="xs" c="dimmed" className="truncate">
          · {co.name}
        </Text>
      )}
      {d && showDeal && (
        <Link to={`/pipeline?deal=${d.id}`} className="truncate text-[12.5px] text-muted hover:underline" onClick={(e) => e.stopPropagation()}>
          · {d.name}
        </Link>
      )}
    </Group>
  )
}

function Detail({ a }: { a: Activity }) {
  return (
    <Group gap={6} mt={a.body ? 8 : 6} wrap="wrap">
      {a.outcome && (
        <Badge size="xs" color={outcomeColor[a.outcome]} variant="light">
          {a.outcome}
        </Badge>
      )}
      {a.emailStatus && (
        <Badge size="xs" color={emailColor[a.emailStatus]} variant="light">
          {a.emailStatus}
        </Badge>
      )}
      {a.durationMin && (
        <Text size="xs" c="dimmed" className="flex items-center gap-1">
          <IconClock size={12} /> {a.durationMin} min
        </Text>
      )}
      {a.location && (
        <Text size="xs" c="dimmed" className="flex items-center gap-1">
          <IconMapPin size={12} /> {a.location}
        </Text>
      )}
      {a.attendees && (
        <Text size="xs" c="dimmed">
          with {a.attendees.join(', ')}
        </Text>
      )}
      {a.type === 'stage' && a.fromStage && (
        <Text size="xs" c="dimmed" className="flex items-center gap-1">
          {a.fromStage} <IconArrowRight size={12} /> <span className="font-medium text-ink">{a.toStage}</span>
        </Text>
      )}
    </Group>
  )
}

export function Timeline({ items, showWho = true, showDeal = true, onSelect }: { items: Activity[]; showWho?: boolean; showDeal?: boolean; onSelect?: (a: Activity) => void }) {
  const sorted = [...items].sort((a, b) => b.at.localeCompare(a.at))
  const byDay = sorted.reduce<Record<string, Activity[]>>((acc, a) => {
    const day = a.at.slice(0, 10)
    ;(acc[day] ||= []).push(a)
    return acc
  }, {})
  if (!sorted.length)
    return (
      <Text size="sm" c="dimmed" ta="center" py="xl">
        Nothing logged yet.
      </Text>
    )
  return (
    <div className="flex flex-col gap-5">
      {Object.entries(byDay).map(([day, list]) => (
        <div key={day}>
          <Text size="xs" c="dimmed" fw={500} mb={8}>
            {dayLabel(day)}
          </Text>
          <div className="relative ml-3 border-l border-line pl-5">
            {list.map((a) => (
              <div key={a.id} className="relative pb-4 last:pb-0">
                <div className="absolute -left-[33px] top-0 bg-paper">
                  <ActivityIcon type={a.type} />
                </div>
                <div
                  className={`rounded-md border border-line bg-white px-3.5 py-2.5 ${onSelect ? 'cursor-pointer hover:border-spruce-300' : ''}`}
                  onClick={onSelect ? () => onSelect(a) : undefined}
                  role={onSelect ? 'button' : undefined}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Text size="sm" fw={500} component="div">
                        {a.type === 'task' && <Checkbox size="xs" display="inline-block" mr={8} style={{ verticalAlign: 'middle' }} defaultChecked={a.done} onClick={(e) => e.stopPropagation()} />}
                        {a.subject}
                      </Text>
                      {a.body && (
                        <Text size="sm" c="dimmed" mt={4}>
                          {a.body}
                        </Text>
                      )}
                      <Detail a={a} />
                      <Related a={a} showWho={showWho} showDeal={showDeal} />
                      {a.nextStep && (
                        <Text size="xs" mt={8} className="flex items-center gap-1.5 text-spruce-700">
                          <IconArrowRight size={12} /> Next: {a.nextStep}
                        </Text>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Text size="xs" c="dimmed" className="whitespace-nowrap">
                        {a.type === 'task' && a.dueAt ? `Due ${shortDate(a.dueAt)}` : dateTime(a.at)}
                      </Text>
                      <OwnerAvatar id={a.ownerId} size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AgendaRow({ a, onSelect }: { a: Activity; onSelect: (a: Activity) => void }) {
  const c = contactById(a.contactId ?? null)
  const co = companyById(a.companyId ?? null)
  const isTask = a.type === 'task'
  return (
    <div className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-paper" onClick={() => onSelect(a)}>
      <div className="tabular w-[92px] shrink-0 text-[12.5px] text-muted">
        {isTask ? (
          <Checkbox size="sm" defaultChecked={a.done} onClick={(e) => e.stopPropagation()} label={<span className="text-muted">Task</span>} styles={{ label: { paddingLeft: 8, fontSize: 12.5 } }} />
        ) : (
          <span>
            {time(a.at)}–{endTime(a)}
          </span>
        )}
      </div>
      <ActivityIcon type={a.type} size={24} />
      <div className="min-w-0 flex-1">
        <Text size="sm" fw={500} truncate>
          {a.subject}
        </Text>
        <Text size="xs" c="dimmed" truncate>
          {c ? fullName(c) : co?.name ?? 'No contact'}
          {c && co ? ` · ${co.name}` : ''}
          {a.location ? ` · ${a.location}` : ''}
          {a.attendees ? ` · ${a.attendees.length} attending` : ''}
        </Text>
      </div>
      {isTask && a.priority === 'High' && (
        <Badge size="xs" color="red" variant="light">
          High
        </Badge>
      )}
      {isTask && a.dueAt && a.dueAt < TODAY && (
        <Text size="xs" c="red" className="whitespace-nowrap">
          {dueLabel(a.dueAt)}
        </Text>
      )}
      <OwnerAvatar id={a.ownerId} size={22} />
    </div>
  )
}

function AgendaSection({ title, items, tone, onSelect, empty }: { title: string; items: Activity[]; tone?: MantineColor; onSelect: (a: Activity) => void; empty?: string }) {
  return (
    <div className="border-b border-line last:border-0">
      <Text size="xs" fw={500} c={tone ?? 'dimmed'} px="md" pt="sm" pb={4}>
        {title} · {items.length}
      </Text>
      {items.map((a) => (
        <AgendaRow key={a.id} a={a} onSelect={onSelect} />
      ))}
      {!items.length && empty && (
        <Text size="sm" c="dimmed" px="md" pb="sm" className="flex items-center gap-1.5">
          <IconCheck size={14} className="text-spruce-600" /> {empty}
        </Text>
      )}
    </div>
  )
}

export default function Activities() {
  const [tab, setTab] = useState<string | null>('today')
  const [filter, setFilter] = useState('all')
  const [who, setWho] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [active, setActive] = useState<Activity | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [logOpen, log] = useDisclosure(false)
  const [logType, setLogType] = useState('call')
  const [followUp, setFollowUp] = useState(true)

  const tasks = activities.filter((a) => a.type === 'task')
  const openTasks = tasks.filter((t) => !t.done)
  const overdue = openTasks.filter((t) => (t.dueAt ?? '') < TODAY)
  const dueToday = openTasks.filter((t) => t.dueAt === TODAY)
  const meetingsAhead = activities.filter((a) => a.type === 'meeting' && a.at > NOW && a.at.slice(0, 10) <= WEEK_END).sort((a, b) => a.at.localeCompare(b.at))
  const todayItems = [...dueToday, ...activities.filter((a) => a.type === 'meeting' && a.at.slice(0, 10) === TODAY)].sort((a, b) => (a.type === 'task' ? -1 : 1) || a.at.localeCompare(b.at))
  const laterItems = [...openTasks.filter((t) => (t.dueAt ?? '') > TODAY && (t.dueAt ?? '') <= WEEK_END), ...meetingsAhead.filter((m) => m.at.slice(0, 10) > TODAY)].sort((a, b) => (a.type === 'task' ? a.dueAt! : a.at.slice(0, 10)).localeCompare(b.type === 'task' ? b.dueAt! : b.at.slice(0, 10)))
  const logged = activities.filter((a) => a.type !== 'task' && a.at <= NOW && a.at >= '2026-11-09T00:00:00')
  const loggedWeek = activities.filter((a) => a.type !== 'task' && a.at <= NOW && a.at >= '2026-11-03T00:00:00')
  const count = (list: Activity[], t: ActivityType) => list.filter((a) => a.type === t).length
  const n = (list: Activity[], t: ActivityType, word: string) => { const k = count(list, t); return `${k} ${word}${k === 1 ? '' : 's'}` }

  const openDeals = deals.filter((d) => stageById(d.stageId).kind === 'open')
  const noNextStep = openDeals.filter((d) => !activities.some((a) => a.dealId === d.id && ((a.type === 'task' && !a.done) || (a.type === 'meeting' && a.at > NOW))))

  const timelineItems = useMemo(
    () =>
      activities.filter((a) => {
        if (a.type === 'task' || a.at > NOW) return false
        if (filter !== 'all' && a.type !== filter) return false
        if (who && a.ownerId !== who) return false
        if (q) {
          const hay = `${a.subject} ${a.body ?? ''} ${(() => { const cc = contactById(a.contactId ?? null); return cc ? fullName(cc) : '' })()} ${companyById(a.companyId ?? null)?.name ?? ''}`.toLowerCase()
          if (!hay.includes(q.toLowerCase())) return false
        }
        return true
      }),
    [filter, who, q],
  )

  const taskGroups: { title: string; tone?: MantineColor; rows: Activity[] }[] = [
    { title: 'Overdue', tone: 'red', rows: overdue },
    { title: 'Today', tone: 'amber.8', rows: dueToday },
    { title: 'This week', rows: openTasks.filter((t) => (t.dueAt ?? '') > TODAY && (t.dueAt ?? '') <= WEEK_END) },
    { title: 'Later', rows: openTasks.filter((t) => (t.dueAt ?? '') > WEEK_END) },
    { title: 'Done', rows: tasks.filter((t) => t.done) },
  ].filter((g) => g.rows.length)
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const activeContact = contactById(active?.contactId ?? null)
  const activeCompany = companyById(active?.companyId ?? null)
  const activeDeal = dealById(active?.dealId ?? null)

  return (
    <>
      <PageHeader
        title="Activities"
        subtitle="Every call, email, meeting and note your team logs, and the tasks that come out of them. Each one should leave a next step."
        actions={
          <>
            <Button variant="default" leftSection={<IconChecklist size={16} />} onClick={() => { setLogType('task'); log.open() }}>
              New task
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={() => { setLogType('call'); log.open() }}>
              Log activity
            </Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Tasks due today" value={String(dueToday.length + overdue.length)} hint={overdue.length ? `${overdue.length} overdue from earlier` : 'Nothing overdue'} tone={overdue.length ? 'bad' : 'good'} />
        <Stat label="Logged today" value={String(logged.length)} hint={`${n(logged, 'call', 'call')} · ${n(logged, 'meeting', 'meeting')} · ${n(logged, 'email', 'email')}`} />
        <Stat label="Meetings ahead this week" value={String(meetingsAhead.length)} hint={meetingsAhead[0] ? `Next: ${meetingsAhead[0].subject}, ${dayLabel(meetingsAhead[0].at.slice(0, 10)).toLowerCase()} ${time(meetingsAhead[0].at)}` : 'Calendar is clear'} />
        <Stat label="Deals with no next step" value={String(noNextStep.length)} hint={`of ${openDeals.length} open deals · nothing scheduled`} tone={noNextStep.length ? 'warn' : 'good'} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <Tabs value={tab} onChange={setTab} keepMounted={false}>
            <Tabs.List mb="md">
              <Tabs.Tab value="today">Today</Tabs.Tab>
              <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
              <Tabs.Tab value="tasks" rightSection={<span className="tabular ml-1 rounded-full bg-amber-signal/15 px-1.5 text-[11px] text-amber-700">{openTasks.length}</span>}>
                Tasks
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="today">
              <Paper>
                <AgendaSection title="Overdue" tone="red" items={overdue} onSelect={setActive} empty="Nothing overdue" />
                <AgendaSection title="Today, Monday 9 Nov" items={todayItems} onSelect={setActive} empty="Nothing planned today" />
                <AgendaSection title="Later this week" items={laterItems} onSelect={setActive} empty="Nothing planned this week" />
              </Paper>
              <Text size="xs" c="dimmed" mt="sm">
                Tasks and meetings assigned to anyone on the team. Pick an owner in Tasks to narrow it down.
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="timeline">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <SegmentedControl
                  size="xs"
                  value={filter}
                  onChange={setFilter}
                  data={[
                    { label: 'All', value: 'all' },
                    { label: 'Calls', value: 'call' },
                    { label: 'Emails', value: 'email' },
                    { label: 'Meetings', value: 'meeting' },
                    { label: 'Notes', value: 'note' },
                    { label: 'Stage changes', value: 'stage' },
                  ]}
                />
                <Select size="xs" placeholder="Anyone" data={owners.map((o) => ({ value: o.id, label: o.name }))} value={who} onChange={setWho} clearable w={150} />
                <TextInput size="xs" placeholder="Search activities" leftSection={<IconSearch size={14} />} value={q} onChange={(e) => setQ(e.currentTarget.value)} className="ml-auto" w={200} />
              </div>
              <Timeline items={timelineItems} onSelect={setActive} />
            </Tabs.Panel>

            <Tabs.Panel value="tasks">
              <Paper>
                <Table.ScrollContainer minWidth={700}>
                <Table layout="fixed">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th w={44} />
                      <Table.Th>Task</Table.Th>
                      <Table.Th w={220}>Related to</Table.Th>
                      <Table.Th w={90}>Priority</Table.Th>
                      <Table.Th w={110}>Due</Table.Th>
                      <Table.Th w={64}>Owner</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {taskGroups.map((g) => (
                      <TaskGroup key={g.title} g={g} selected={selected} toggle={toggle} onSelect={setActive} />
                    ))}
                  </Table.Tbody>
                </Table>
                </Table.ScrollContainer>
              </Paper>
            </Tabs.Panel>
          </Tabs>
        </div>

        <div className="flex flex-col gap-4">
          <Paper p="md">
            <Text fw={600} size="sm" mb="sm">
              Quick log
            </Text>
            <SegmentedControl
              fullWidth
              size="xs"
              value={logType}
              onChange={setLogType}
              data={[
                { value: 'call', label: 'Call' },
                { value: 'email', label: 'Email' },
                { value: 'meeting', label: 'Meeting' },
                { value: 'note', label: 'Note' },
              ]}
              mb="sm"
            />
            <Select placeholder="Who was it with?" data={['Anindya Putri · Kinara Health', 'Sofie de Vries · Northwind', 'Rotterdam hub rollout (deal)']} searchable mb="sm" size="sm" />
            {logType === 'call' && (
              <Group grow mb="sm">
                <Select placeholder="Outcome" data={['Connected', 'No answer', 'Voicemail', 'Rescheduled']} size="sm" />
                <TextInput placeholder="Minutes" size="sm" className="tabular" />
              </Group>
            )}
            <Textarea placeholder={logType === 'note' ? 'What did you learn?' : 'What happened?'} minRows={3} autosize mb="sm" />
            <TextInput placeholder="Next step (becomes a task)" leftSection={<IconArrowRight size={14} />} size="sm" mb="sm" />
            <Group justify="space-between">
              <Switch size="xs" label="Follow-up in 3 days" checked={followUp} onChange={(e) => setFollowUp(e.currentTarget.checked)} />
              <Button size="xs" onClick={() => notifications.show({ message: `${meta[logType as ActivityType].label} logged${followUp ? ' with a follow-up task' : ''}`, color: 'spruce' })}>
                Save
              </Button>
            </Group>
          </Paper>

          <Paper p="md">
            <Group justify="space-between" mb="sm">
              <Text fw={600} size="sm">
                Deals with no next step
              </Text>
              <Badge color={noNextStep.length ? 'amber' : 'spruce'} size="sm">
                {noNextStep.length}
              </Badge>
            </Group>
            <div className="flex flex-col gap-1">
              {noNextStep.slice(0, 5).map((d) => (
                <div key={d.id} className="-mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-paper">
                  <div className="min-w-0 flex-1">
                    <Link to={`/pipeline?deal=${d.id}`} className="block truncate text-[13.5px] font-medium hover:underline">
                      {d.name}
                    </Link>
                    <Text size="xs" c="dimmed" truncate>
                      {companyById(d.companyId)?.name} · {stageById(d.stageId).name} · {d.daysInStage}d in stage
                    </Text>
                  </div>
                  <Button size="compact-xs" variant="light" onClick={() => { setLogType('task'); log.open() }}>
                    Plan
                  </Button>
                </div>
              ))}
            </div>
            <Text size="xs" c="dimmed" mt="sm">
              Open deals without a task or meeting scheduled. These are the ones that quietly stall.
            </Text>
          </Paper>

          <Paper p="md">
            <Text fw={600} size="sm" mb="sm">
              Team this week
            </Text>
            <div className="flex flex-col gap-2">
              {owners.map((o) => {
                const mine = loggedWeek.filter((a) => a.ownerId === o.id)
                const max = Math.max(...owners.map((x) => loggedWeek.filter((a) => a.ownerId === x.id).length), 1)
                return (
                  <div key={o.id} className="flex items-center gap-2">
                    <OwnerAvatar id={o.id} size={24} />
                    <Text size="sm" className="flex-1">
                      {o.name}
                    </Text>
                    <Tooltip label={`${n(mine, 'call', 'call')} · ${n(mine, 'meeting', 'meeting')} · ${n(mine, 'email', 'email')} · ${n(mine, 'note', 'note')}`}>
                      <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-line">
                        {(['call', 'meeting', 'email', 'note', 'stage'] as ActivityType[]).map((t) => (
                          <div key={t} className="h-full" style={{ width: `${(count(mine, t) / max) * 100}%`, background: `var(--mantine-color-${meta[t].color}-5)` }} />
                        ))}
                      </div>
                    </Tooltip>
                    <Text size="xs" c="dimmed" className="tabular w-6 text-right">
                      {mine.length}
                    </Text>
                  </div>
                )
              })}
            </div>
          </Paper>
        </div>
      </div>

      <ActionBar opened={selected.length > 0} onClose={() => setSelected([])}>
        <Text size="sm" fw={500} className="tabular">
          {selected.length} selected
        </Text>
        <ActionBar.Divider />
        <Button size="xs" variant="subtle" color="gray" leftSection={<IconCheck size={14} />} onClick={() => { notifications.show({ message: `${selected.length} tasks completed`, color: 'spruce' }); setSelected([]) }}>
          Complete
        </Button>
        <Button size="xs" variant="subtle" color="gray" leftSection={<IconCalendarEvent size={14} />}>
          Reschedule
        </Button>
        <Button size="xs" variant="subtle" color="gray" leftSection={<IconUserPlus size={14} />}>
          Reassign
        </Button>
        <ActionBar.CloseButton />
      </ActionBar>

      <Drawer opened={!!active} onClose={() => setActive(null)} position="right" size="md" title={active ? meta[active.type].label : ''}>
        {active && (
          <Stack gap="md">
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <ActivityIcon type={active.type} size={36} />
              <div className="min-w-0 flex-1">
                <Text fw={600} size="lg" component="div">
                  {active.type === 'task' && <Checkbox size="sm" display="inline-block" mr={8} style={{ verticalAlign: 'middle' }} defaultChecked={active.done} />}
                  {active.subject}
                </Text>
                <Text size="sm" c="dimmed">
                  {active.type === 'task' && active.dueAt ? `Due ${dueLabel(active.dueAt).toLowerCase()} · created ${shortDate(active.at)}` : active.at > NOW ? `Scheduled ${dateTime(active.at)}` : dateTime(active.at)}
                </Text>
              </div>
            </Group>
            {active.body && (
              <Paper p="sm" bg="paper" withBorder={false}>
                <Text size="sm">{active.body}</Text>
              </Paper>
            )}
            <DataList size="sm" labelWidth={100} gap={10}>
              <Field label="Owner">
                <Group gap={6}>
                  <OwnerAvatar id={active.ownerId} size={20} />
                  <Text size="sm">{owners.find((o) => o.id === active.ownerId)?.name}</Text>
                </Group>
              </Field>
              {active.outcome && (
                <Field label="Outcome">
                  <Badge size="sm" color={outcomeColor[active.outcome]}>
                    {active.outcome}
                  </Badge>
                </Field>
              )}
              {active.emailStatus && (
                <Field label="Status">
                  <Badge size="sm" color={emailColor[active.emailStatus]}>
                    {active.emailStatus}
                  </Badge>
                </Field>
              )}
              {active.durationMin && <Field label="Duration">{active.durationMin} min</Field>}
              {active.location && <Field label="Where">{active.location}</Field>}
              {active.attendees && <Field label="Attendees">{active.attendees.join(', ')}</Field>}
              {active.priority && (
                <Field label="Priority">
                  <Badge size="sm" color={priorityColor[active.priority]} variant={active.priority === 'High' ? 'light' : 'outline'} styles={{ root: { borderColor: '#e3e8e6' } }}>
                    {active.priority}
                  </Badge>
                </Field>
              )}
              {active.type === 'stage' && (
                <Field label="Stage">
                  {active.fromStage} → {active.toStage}
                </Field>
              )}
              {activeContact && (
                <Field label="Contact">
                  <Link to={`/contacts/${activeContact.id}`} className="flex items-center gap-1.5 text-spruce-700 hover:underline">
                    <ContactAvatar name={fullName(activeContact)} size={18} /> {fullName(activeContact)}
                  </Link>
                </Field>
              )}
              {activeCompany && (
                <Field label="Company">
                  <Link to={`/companies/${activeCompany.id}`} className="text-spruce-700 hover:underline">
                    {activeCompany.name}
                  </Link>
                </Field>
              )}
              {activeDeal && (
                <Field label="Deal">
                  <Link to={`/pipeline?deal=${activeDeal.id}`} className="text-spruce-700 hover:underline">
                    {activeDeal.name}
                  </Link>
                  <Text size="xs" c="dimmed">
                    {stageById(activeDeal.stageId).name} · closes {shortDate(activeDeal.closeDate)}
                  </Text>
                </Field>
              )}
            </DataList>
            <Divider />
            <div>
              <Text size="sm" fw={600} mb={6}>
                Next step
              </Text>
              {active.nextStep ? (
                <Group justify="space-between" wrap="nowrap">
                  <Text size="sm" className="flex items-center gap-1.5">
                    <IconArrowRight size={14} className="text-spruce-600" /> {active.nextStep}
                  </Text>
                  <Button size="compact-xs" variant="light" onClick={() => notifications.show({ message: 'Task created', color: 'spruce' })}>
                    Make it a task
                  </Button>
                </Group>
              ) : (
                <TextInput size="sm" placeholder="What happens next?" rightSection={<IconPlus size={14} />} />
              )}
            </div>
            <Group justify="space-between" mt="xs">
              <Menu position="top-start">
                <Menu.Target>
                  <Button variant="subtle" color="gray" size="xs" leftSection={<IconDots size={14} />}>
                    More
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>Change owner</Menu.Item>
                  <Menu.Item>Move to another deal</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red">Delete</Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Group gap="xs">
                <Button variant="default" size="xs">
                  Edit
                </Button>
                {active.type === 'task' && !active.done && (
                  <Button size="xs" leftSection={<IconCheck size={14} />} onClick={() => { notifications.show({ message: 'Task completed', color: 'spruce' }); setActive(null) }}>
                    Complete
                  </Button>
                )}
                {active.type === 'meeting' && active.at > NOW && (
                  <Button size="xs" leftSection={<IconCalendarEvent size={14} />}>
                    Join
                  </Button>
                )}
              </Group>
            </Group>
          </Stack>
        )}
      </Drawer>

      <Drawer opened={logOpen} onClose={log.close} position="right" size="md" title={logType === 'task' ? 'New task' : 'Log activity'}>
        <Stack gap="sm">
          <SegmentedControl
            fullWidth
            size="xs"
            value={logType}
            onChange={setLogType}
            data={[
              { value: 'call', label: 'Call' },
              { value: 'email', label: 'Email' },
              { value: 'meeting', label: 'Meeting' },
              { value: 'note', label: 'Note' },
              { value: 'task', label: 'Task' },
            ]}
          />
          <TextInput label={logType === 'task' ? 'Task' : 'Subject'} placeholder={logType === 'task' ? 'Call Wei about the pilot' : 'Discovery call with Tom'} data-autofocus />
          <Select label="Related to" placeholder="Contact, company or deal" data={['Anindya Putri · Kinara Health', 'Sofie de Vries · Northwind', 'Rotterdam hub rollout (deal)', 'Bluefin Marine']} searchable />
          {logType === 'call' && (
            <Group grow>
              <Select label="Outcome" data={['Connected', 'No answer', 'Voicemail', 'Rescheduled']} defaultValue="Connected" />
              <TextInput label="Duration (min)" placeholder="15" />
            </Group>
          )}
          {logType === 'meeting' && (
            <>
              <Group grow>
                <TextInput label="When" defaultValue="9 Nov 2026, 14:00" />
                <TextInput label="Duration (min)" defaultValue="45" />
              </Group>
              <TextInput label="Where" placeholder="Google Meet or an address" />
              <Select label="Attendees" placeholder="Add people" data={['Anindya Putri', 'Dewi Lestari', 'Dion Pratama']} searchable />
            </>
          )}
          {logType === 'task' && (
            <Group grow>
              <TextInput label="Due" defaultValue="12 Nov 2026" />
              <Select label="Priority" data={['High', 'Normal', 'Low']} defaultValue="Normal" />
            </Group>
          )}
          <Textarea label="Notes" placeholder={logType === 'task' ? 'Anything the owner needs to know' : 'What happened and what you learned'} minRows={4} autosize />
          <Select label="Owner" data={owners.map((o) => ({ value: o.id, label: o.name }))} defaultValue="u1" />
          {logType !== 'task' && (
            <>
              <Divider label="Next step" labelPosition="left" />
              <TextInput placeholder="e.g. Send pricing by Thursday" leftSection={<IconArrowRight size={14} />} />
              <Switch size="sm" label="Create a follow-up task from the next step" checked={followUp} onChange={(e) => setFollowUp(e.currentTarget.checked)} />
            </>
          )}
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={log.close}>
              Cancel
            </Button>
            <Button onClick={() => { notifications.show({ message: logType === 'task' ? 'Task created' : `${meta[logType as ActivityType].label} logged`, color: 'spruce' }); log.close() }}>
              {logType === 'task' ? 'Create task' : 'Save'}
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  )
}

function TaskGroup({ g, selected, toggle, onSelect }: { g: { title: string; tone?: MantineColor; rows: Activity[] }; selected: string[]; toggle: (id: string) => void; onSelect: (a: Activity) => void }) {
  return (
    <>
      <Table.Tr>
        <Table.Td colSpan={6} bg="paper" py={6}>
          <Text size="xs" fw={500} c={g.tone ?? 'dimmed'}>
            {g.title} · {g.rows.length}
          </Text>
        </Table.Td>
      </Table.Tr>
      {g.rows.map((t) => {
        const c = contactById(t.contactId ?? null)
        const co = companyById(t.companyId ?? null)
        const d = dealById(t.dealId ?? null)
        return (
          <Table.Tr key={t.id} className="cursor-pointer" onClick={() => onSelect(t)} bg={selected.includes(t.id) ? 'spruce.0' : undefined}>
            <Table.Td onClick={(e) => e.stopPropagation()}>
              <Checkbox size="sm" checked={selected.includes(t.id) || !!t.done} onChange={() => !t.done && toggle(t.id)} disabled={t.done} />
            </Table.Td>
            <Table.Td>
              <Text size="sm" fw={500} td={t.done ? 'line-through' : undefined} c={t.done ? 'dimmed' : undefined}>
                {t.subject}
              </Text>
              {t.body && (
                <Text size="xs" c="dimmed" truncate>
                  {t.body}
                </Text>
              )}
            </Table.Td>
            <Table.Td>
              {c || co ? (
                <>
                  <Text size="sm">{c ? fullName(c) : co?.name}</Text>
                  <Text size="xs" c="dimmed" truncate>
                    {c && co ? co.name : ''}
                    {d ? `${c && co ? ' · ' : ''}${d.name}` : ''}
                  </Text>
                </>
              ) : (
                <Text size="sm" c="dimmed">
                  —
                </Text>
              )}
            </Table.Td>
            <Table.Td>
              {t.priority && (
                <Badge size="sm" color={priorityColor[t.priority]} variant={t.priority === 'High' ? 'light' : 'outline'} styles={{ root: { borderColor: '#e3e8e6', color: t.priority === 'High' ? undefined : '#5d6b72' } }}>
                  {t.priority}
                </Badge>
              )}
            </Table.Td>
            <Table.Td>
              {t.dueAt && (
                <Text size="sm" c={t.done ? 'dimmed' : dueTone(t.dueAt)} fw={!t.done && t.dueAt <= TODAY ? 500 : 400} className="whitespace-nowrap">
                  {dueLabel(t.dueAt)}
                </Text>
              )}
            </Table.Td>
            <Table.Td>
              <OwnerAvatar id={t.ownerId} size={24} />
            </Table.Td>
          </Table.Tr>
        )
      })}
    </>
  )
}
