import { useState } from 'react'
import { Button, Checkbox, Group, Paper, SegmentedControl, Text, ThemeIcon, Tabs, Textarea, Select, type MantineColor } from '@mantine/core'
import { IconMail, IconMessage, IconNote, IconPhone, IconPlus, IconUsers, IconArrowsRightLeft, IconChecklist, IconCalendarEvent } from '@tabler/icons-react'
import { Link } from 'react-router'
import { activities, companyById, contactById, dealById, fullName, owners, type Activity, type ActivityType } from '../data/mock'
import { ContactAvatar, OwnerAvatar, PageHeader, dateTime, shortDate } from '../components/ui'

const meta: Record<ActivityType, { icon: typeof IconMail; color: MantineColor; label: string }> = {
  note: { icon: IconNote, color: 'gray', label: 'Note' },
  call: { icon: IconPhone, color: 'blue', label: 'Call' },
  email: { icon: IconMail, color: 'indigo', label: 'Email' },
  meeting: { icon: IconUsers, color: 'spruce', label: 'Meeting' },
  task: { icon: IconChecklist, color: 'amber', label: 'Task' },
  stage: { icon: IconArrowsRightLeft, color: 'teal', label: 'Stage change' },
}

export function ActivityIcon({ type, size = 26 }: { type: ActivityType; size?: number }) {
  const m = meta[type]
  const Icon = m.icon
  return (
    <ThemeIcon size={size} radius="xl" variant="light" color={m.color}>
      <Icon size={size * 0.55} stroke={1.75} />
    </ThemeIcon>
  )
}

export function Timeline({ items, showWho = true, showDeal = true }: { items: Activity[]; showWho?: boolean; showDeal?: boolean }) {
  const sorted = [...items].sort((a, b) => b.at.localeCompare(a.at))
  const byDay = sorted.reduce<Record<string, Activity[]>>((acc, a) => {
    const day = a.at.slice(0, 10)
    ;(acc[day] ||= []).push(a)
    return acc
  }, {})
  return (
    <div className="flex flex-col gap-5">
      {Object.entries(byDay).map(([day, list]) => (
        <div key={day}>
          <Text size="xs" c="dimmed" fw={500} mb={8}>
            {day === '2026-11-09' ? 'Today' : day === '2026-11-08' ? 'Yesterday' : shortDate(day)}
          </Text>
          <div className="relative ml-3 border-l border-line pl-5">
            {list.map((a) => {
              const c = contactById(a.contactId)
              const d = dealById(a.dealId)
              return (
                <div key={a.id} className="relative pb-4 last:pb-0">
                  <div className="absolute -left-[33px] top-0 bg-paper">
                    <ActivityIcon type={a.type} />
                  </div>
                  <div className="rounded-md border border-line bg-white px-3.5 py-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Text size="sm" fw={500} component="div">
                          {a.type === 'task' && (
                            <Checkbox size="xs" display="inline-block" mr={8} style={{ verticalAlign: 'middle' }} defaultChecked={a.done} />
                          )}
                          {a.subject}
                        </Text>
                        {a.body && (
                          <Text size="sm" c="dimmed" mt={4}>
                            {a.body}
                          </Text>
                        )}
                        {showWho && (c || d) && (
                          <Group gap={6} mt={6}>
                            {c && (
                              <Link to={`/contacts/${c.id}`} className="flex items-center gap-1.5 text-[12.5px] text-spruce-700 hover:underline">
                                <ContactAvatar name={fullName(c)} size={16} />
                                {fullName(c)}
                              </Link>
                            )}
                            {d && showDeal && (
                              <Link to={`/pipeline?deal=${d.id}`} className="text-[12.5px] text-muted hover:underline">
                                {c ? '· ' : ''}
                                {d.name}
                              </Link>
                            )}
                          </Group>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Text size="xs" c="dimmed">
                          {a.type === 'task' && a.dueAt ? `Due ${shortDate(a.dueAt)}` : dateTime(a.at)}
                        </Text>
                        <OwnerAvatar id={a.ownerId} size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Activities() {
  const [filter, setFilter] = useState('all')
  const [tab, setTab] = useState<string | null>('timeline')
  const tasks = activities.filter((a) => a.type === 'task')
  const list = activities.filter((a) => (filter === 'all' ? a.type !== 'task' : a.type === filter))

  return (
    <>
      <PageHeader
        title="Activities"
        subtitle="Everything your team logged, in one timeline. Tasks live in their own tab."
        actions={<Button leftSection={<IconPlus size={16} />}>Log activity</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={tab} onChange={setTab} keepMounted={false}>
            <Tabs.List mb="md">
              <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
              <Tabs.Tab value="tasks" rightSection={<span className="tabular ml-1 rounded-full bg-amber-signal/15 px-1.5 text-[11px] text-amber-700">{tasks.filter((t) => !t.done).length}</span>}>
                Tasks
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="timeline">
              <SegmentedControl
                size="xs"
                mb="md"
                value={filter}
                onChange={setFilter}
                data={[
                  { label: 'All', value: 'all' },
                  { label: 'Calls', value: 'call' },
                  { label: 'Emails', value: 'email' },
                  { label: 'Meetings', value: 'meeting' },
                  { label: 'Notes', value: 'note' },
                ]}
              />
              <Timeline items={list} />
            </Tabs.Panel>

            <Tabs.Panel value="tasks">
              <Paper>
                {['Overdue', 'Today and this week', 'Done'].map((group) => {
                  const rows = tasks.filter((t) => {
                    if (group === 'Done') return t.done
                    if (t.done) return false
                    return group === 'Overdue' ? (t.dueAt ?? '') < '2026-11-09' : (t.dueAt ?? '') >= '2026-11-09'
                  })
                  if (!rows.length) return null
                  return (
                    <div key={group} className="border-b border-line last:border-0">
                      <Text size="xs" fw={500} c={group === 'Overdue' ? 'red' : 'dimmed'} px="md" pt="sm" pb={4}>
                        {group} · {rows.length}
                      </Text>
                      {rows.map((t) => {
                        const c = contactById(t.contactId)
                        return (
                          <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-paper">
                            <Checkbox size="sm" defaultChecked={t.done} />
                            <div className="min-w-0 flex-1">
                              <Text size="sm" fw={500} td={t.done ? 'line-through' : undefined} c={t.done ? 'dimmed' : undefined}>
                                {t.subject}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {c ? fullName(c) : 'No contact'}
                                {t.companyId && ` · ${companyById(t.companyId)?.name}`}
                              </Text>
                            </div>
                            <Text size="xs" c="dimmed" className="flex items-center gap-1">
                              <IconCalendarEvent size={14} /> {shortDate(t.dueAt!)}
                            </Text>
                            <OwnerAvatar id={t.ownerId} size={22} />
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
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
              data={[
                { value: 'note', label: 'Note' },
                { value: 'call', label: 'Call' },
                { value: 'meeting', label: 'Meeting' },
                { value: 'task', label: 'Task' },
              ]}
              mb="sm"
            />
            <Select placeholder="Link to a contact or deal" data={['Anindya Putri', 'Sofie de Vries', 'Rotterdam hub rollout']} searchable mb="sm" />
            <Textarea placeholder="What happened?" minRows={3} autosize mb="sm" />
            <Group justify="flex-end">
              <Button size="xs" leftSection={<IconMessage size={14} />}>
                Save
              </Button>
            </Group>
          </Paper>

          <Paper p="md">
            <Text fw={600} size="sm" mb="sm">
              Team this week
            </Text>
            <div className="flex flex-col gap-2">
              {owners.map((o) => {
                const n = activities.filter((a) => a.ownerId === o.id).length
                return (
                  <div key={o.id} className="flex items-center gap-2">
                    <OwnerAvatar id={o.id} size={24} />
                    <Text size="sm" className="flex-1">
                      {o.name}
                    </Text>
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-line">
                      <div className="h-full rounded-full bg-spruce-600" style={{ width: `${(n / 5) * 100}%` }} />
                    </div>
                    <Text size="xs" c="dimmed" className="tabular w-6 text-right">
                      {n}
                    </Text>
                  </div>
                )
              })}
            </div>
          </Paper>
        </div>
      </div>
    </>
  )
}
