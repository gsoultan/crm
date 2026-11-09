import { useState } from 'react'
import { ActionIcon, Badge, Button, Group, Paper, SegmentedControl, Select, Table, Text, TextInput, Textarea, Title, Divider, Anchor, Tabs } from '@mantine/core'
import { IconArrowLeft, IconPlus, IconTrash, IconUsers, IconRefresh, IconMail, IconDownload } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { contacts, fullName, segments as seed, type Rule, type Segment } from '../data/mock'
import { ContactAvatar, LifecycleBadge, PageHeader, longDate } from '../components/ui'

const fields = ['Lifecycle stage', 'Lead score', 'Tag', 'Email consent', 'Email status', 'Company industry', 'Company size', 'Country', 'Owner', 'Created', 'Last activity', 'Last email reply', 'Renewal date', 'Open deal amount']
const ops = ['is', 'is not', 'contains', 'is at least', 'is at most', 'is before', 'is after', 'is within', 'is empty']

export default function Segments() {
  const [editing, setEditing] = useState<Segment | null>(null)
  const [tab, setTab] = useState<string | null>('all')
  if (editing) return <SegmentEditor segment={editing} onBack={() => setEditing(null)} />
  const rows = seed.filter((s) => tab === 'all' || (tab === 'dynamic' ? s.type === 'Dynamic' : s.type === 'Static'))

  return (
    <>
      <PageHeader
        title="Segments"
        subtitle="Groups of contacts for campaigns and reports. Dynamic segments update themselves as contacts change."
        actions={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setEditing({ id: 'new', name: '', description: '', type: 'Dynamic', count: 0, match: 'all', rules: [{ field: 'Lifecycle stage', op: 'is', value: '' }], updatedAt: '2026-11-09', usedIn: 0 })}
          >
            New segment
          </Button>
        }
      />

      <Paper>
        <Tabs value={tab} onChange={setTab}>
          <Tabs.List px="sm" pt={4}>
            <Tabs.Tab value="all">All · {seed.length}</Tabs.Tab>
            <Tabs.Tab value="dynamic">Dynamic · {seed.filter((s) => s.type === 'Dynamic').length}</Tabs.Tab>
            <Tabs.Tab value="static">Static · {seed.filter((s) => s.type === 'Static').length}</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Table.ScrollContainer minWidth={780}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Segment</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th ta="right">Contacts</Table.Th>
                <Table.Th>Rules</Table.Th>
                <Table.Th ta="right">Used in</Table.Th>
                <Table.Th>Updated</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((s) => (
                <Table.Tr key={s.id} className="cursor-pointer" onClick={() => setEditing(s)}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {s.name}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {s.description}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={s.type === 'Dynamic' ? 'spruce' : 'gray'} style={{ overflow: 'visible' }}>
                      {s.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" fw={500} className="tabular">
                      {s.count}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {s.rules.slice(0, 2).map((r, i) => (
                        <Badge key={i} color="gray" variant="outline" styles={{ root: { borderColor: '#e3e8e6', fontWeight: 400 } }}>
                          {r.field} {r.op} {r.value}
                        </Badge>
                      ))}
                      {s.rules.length > 2 && (
                        <Text size="xs" c="dimmed">
                          +{s.rules.length - 2}
                        </Text>
                      )}
                      {s.rules.length === 0 && (
                        <Text size="xs" c="dimmed">
                          Imported list
                        </Text>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" c="dimmed" className="tabular whitespace-nowrap">
                      {s.usedIn} {s.usedIn === 1 ? 'campaign' : 'campaigns'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" className="whitespace-nowrap">
                      {longDate(s.updatedAt)}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </>
  )
}

function SegmentEditor({ segment, onBack }: { segment: Segment; onBack: () => void }) {
  const [name, setName] = useState(segment.name)
  const [match, setMatch] = useState<string>(segment.match)
  const [rules, setRules] = useState<Rule[]>(segment.rules)
  const update = (i: number, patch: Partial<Rule>) => setRules((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const estimate = segment.id === 'new' ? Math.max(0, rules.filter((r) => r.value).length * 23) : segment.count
  const preview = contacts.slice(0, 5)

  return (
    <>
      <Button variant="subtle" color="gray" size="xs" leftSection={<IconArrowLeft size={14} />} onClick={onBack} mb="sm" px={4}>
        All segments
      </Button>
      <PageHeader
        title={segment.id === 'new' ? 'New segment' : segment.name}
        subtitle={segment.id === 'new' ? 'Describe who belongs, and the list keeps itself up to date.' : `${segment.type} · updated ${longDate(segment.updatedAt)}`}
        actions={
          <>
            <Button variant="default" leftSection={<IconDownload size={16} />}>
              Export CSV
            </Button>
            <Button variant="default" leftSection={<IconMail size={16} />}>
              Send campaign
            </Button>
            <Button onClick={() => { onBack(); notifications.show({ title: 'Segment saved', message: `${name || 'Untitled segment'} · ${estimate} contacts`, color: 'spruce' }) }}>
              Save segment
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <Paper p="lg">
            <TextInput label="Name" placeholder="Customers up for renewal in Q1" value={name} onChange={(e) => setName(e.currentTarget.value)} mb="sm" />
            <Textarea label="Description" placeholder="What is this group for?" defaultValue={segment.description} autosize minRows={2} />
          </Paper>

          <Paper p="lg">
            <Group justify="space-between" mb="md">
              <Group gap="sm">
                <Title order={3}>Rules</Title>
                <Text size="sm" c="dimmed">
                  Include contacts that match
                </Text>
                <SegmentedControl
                  size="xs"
                  value={match}
                  onChange={setMatch}
                  data={[
                    { value: 'all', label: 'all rules' },
                    { value: 'any', label: 'any rule' },
                  ]}
                />
              </Group>
            </Group>

            <div className="flex flex-col gap-2">
              {rules.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Text size="xs" c="dimmed" w={36} ta="right" className="shrink-0">
                    {i === 0 ? 'Where' : match === 'all' ? 'and' : 'or'}
                  </Text>
                  <Select data={fields} value={r.field} onChange={(v) => update(i, { field: v ?? r.field })} w={190} searchable />
                  <Select data={ops} value={r.op} onChange={(v) => update(i, { op: v ?? r.op })} w={130} />
                  <TextInput placeholder="Value" value={r.value} onChange={(e) => update(i, { value: e.currentTarget.value })} className="flex-1" disabled={r.op === 'is empty'} />
                  <ActionIcon variant="subtle" color="gray" aria-label="Remove rule" onClick={() => setRules((rs) => rs.filter((_, j) => j !== i))} disabled={rules.length === 1}>
                    <IconTrash size={15} />
                  </ActionIcon>
                </div>
              ))}
            </div>
            <Button variant="subtle" size="xs" mt="sm" leftSection={<IconPlus size={14} />} onClick={() => setRules((rs) => [...rs, { field: 'Tag', op: 'contains', value: '' }])}>
              Add rule
            </Button>

            <Divider my="md" />
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Always exclude
              </Text>
              <Badge color="red" variant="light">
                Do not email · 341
              </Badge>
              <Anchor size="xs">Change</Anchor>
            </Group>
          </Paper>
        </div>

        <div className="flex flex-col gap-4">
          <Paper p="lg">
            <Group justify="space-between" mb={4}>
              <Text size="sm" c="dimmed">
                Matching contacts
              </Text>
              <ActionIcon variant="subtle" color="gray" size="sm" aria-label="Recount">
                <IconRefresh size={14} />
              </ActionIcon>
            </Group>
            <div className="tabular text-[32px] leading-none font-semibold">{estimate}</div>
            <Text size="xs" c="dimmed" mt={6}>
              of {contacts.length * 41} contacts · counted just now
            </Text>
          </Paper>

          <Paper p="md">
            <Group gap={6} mb="sm">
              <IconUsers size={16} className="text-muted" />
              <Text size="sm" fw={600}>
                Preview
              </Text>
            </Group>
            <div className="flex flex-col gap-1">
              {preview.map((c) => (
                <div key={c.id} className="flex items-center gap-2.5 py-1">
                  <ContactAvatar name={fullName(c)} size={26} />
                  <div className="min-w-0 flex-1">
                    <Text size="sm" truncate>
                      {fullName(c)}
                    </Text>
                  </div>
                  <LifecycleBadge stage={c.lifecycle} />
                </div>
              ))}
            </div>
            <Text size="xs" c="dimmed" mt="sm">
              Showing 5 of {estimate}.
            </Text>
          </Paper>
        </div>
      </div>
    </>
  )
}
