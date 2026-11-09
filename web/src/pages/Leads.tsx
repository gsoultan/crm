import { useState } from 'react'
import { Badge, Button, Group, Paper, Table, Text, Tabs, Drawer, DataList, Select, Stack, Divider, Progress, Tooltip, type MantineColor } from '@mantine/core'
import { IconArrowRight, IconPlus, IconSparkles, IconUpload } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { leads, owners, type Lead } from '../data/mock'
import { ContactAvatar, OwnerAvatar, PageHeader, ScoreBar, relative, Field } from '../components/ui'

const statusColor: Record<Lead['status'], MantineColor> = { New: 'amber', Contacted: 'blue', Qualified: 'spruce', Unqualified: 'gray' }

export default function Leads() {
  const [tab, setTab] = useState<string | null>('inbox')
  const [active, setActive] = useState<Lead | null>(null)
  const inbox = leads.filter((l) => l.status === 'New')
  const working = leads.filter((l) => l.status === 'Contacted')
  const qualified = leads.filter((l) => l.status === 'Qualified')
  const closed = leads.filter((l) => l.status === 'Unqualified')
  const rows = { inbox, working, qualified, closed }[tab ?? 'inbox'] ?? inbox

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle="New leads land in the inbox. Qualify them, or convert them into a contact, company and deal in one step."
        actions={
          <>
            <Button variant="default" leftSection={<IconUpload size={16} />}>
              Import list
            </Button>
            <Button leftSection={<IconPlus size={16} />}>New lead</Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Waiting in inbox', value: inbox.length, hint: 'Reply within 1 business day', tone: 'text-amber-signal' },
          { label: 'Being worked', value: working.length, hint: 'Avg 2.1 days to first contact', tone: 'text-muted' },
          { label: 'Qualified this month', value: qualified.length, hint: '+2 vs last month', tone: 'text-spruce-600' },
          { label: 'Conversion rate', value: '31%', hint: 'Leads to deals, last 90 days', tone: 'text-muted' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-white px-4 py-3.5">
            <Text size="sm" c="dimmed">
              {s.label}
            </Text>
            <div className="tabular mt-1 text-[24px] leading-none font-semibold">{s.value}</div>
            <div className={`mt-2 text-[12.5px] ${s.tone}`}>{s.hint}</div>
          </div>
        ))}
      </div>

      <Paper>
        <Tabs value={tab} onChange={setTab}>
          <Tabs.List px="sm" pt={4}>
            <Tabs.Tab value="inbox">Inbox · {inbox.length}</Tabs.Tab>
            <Tabs.Tab value="working">Contacted · {working.length}</Tabs.Tab>
            <Tabs.Tab value="qualified">Qualified · {qualified.length}</Tabs.Tab>
            <Tabs.Tab value="closed">Unqualified · {closed.length}</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Table.ScrollContainer minWidth={860}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Lead</Table.Th>
                <Table.Th>Source</Table.Th>
                <Table.Th>Score</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Owner</Table.Th>
                <Table.Th>Arrived</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((l) => (
                <Table.Tr key={l.id} className="cursor-pointer" onClick={() => setActive(l)}>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <ContactAvatar name={l.name} color="gray" />
                      <div>
                        <Text size="sm" fw={500}>
                          {l.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {l.company} · {l.email}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{l.source}</Text>
                  </Table.Td>
                  <Table.Td>
                    <ScoreBar score={l.score} />
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColor[l.status]}>{l.status}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <OwnerAvatar id={l.ownerId} />
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {relative(l.createdAt)}
                    </Text>
                  </Table.Td>
                  <Table.Td onClick={(e) => e.stopPropagation()}>
                    {l.status === 'Qualified' ? (
                      <Button size="compact-xs" rightSection={<IconArrowRight size={12} />} onClick={() => setActive(l)}>
                        Convert
                      </Button>
                    ) : l.status === 'New' ? (
                      <Button size="compact-xs" variant="default" onClick={() => notifications.show({ message: `${l.name} assigned to you`, color: 'spruce' })}>
                        Take
                      </Button>
                    ) : null}
                  </Table.Td>
                </Table.Tr>
              ))}
              {rows.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <div className="py-12 text-center">
                      <Text fw={500}>Inbox is clear</Text>
                      <Text size="sm" c="dimmed">
                        New leads from forms, imports and referrals will appear here.
                      </Text>
                    </div>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>

      <Drawer opened={!!active} onClose={() => setActive(null)} position="right" size="md" title={active ? active.name : ''}>
        {active && (
          <Stack gap="md">
            <Group gap="sm">
              <ContactAvatar name={active.name} size={44} color="gray" />
              <div>
                <Text fw={600}>{active.company}</Text>
                <Text size="sm" c="dimmed">
                  {active.email}
                </Text>
              </div>
              <Badge ml="auto" color={statusColor[active.status]}>
                {active.status}
              </Badge>
            </Group>

            <Paper p="md" bg="spruce.0" style={{ borderColor: '#d3e8e1' }}>
              <Group gap={6} mb={6}>
                <IconSparkles size={15} className="text-spruce-700" />
                <Text size="sm" fw={600}>
                  Score {active.score} of 100
                </Text>
              </Group>
              <Text size="xs" c="dimmed" mb={8}>
                Fit comes from company size and industry. Engagement comes from email opens, page visits and form fills.
              </Text>
              <Tooltip label={`Fit ${active.fit} · Engagement ${active.engagement}`}>
                <Progress.Root size={10} radius="xl">
                  <Progress.Section value={active.fit} color="spruce.7" />
                  <Progress.Section value={active.engagement} color="spruce.3" />
                </Progress.Root>
              </Tooltip>
              <Group justify="space-between" mt={6}>
                <Text size="xs">
                  <span className="mr-1 inline-block size-2 rounded-full bg-spruce-700" /> Fit {active.fit}
                </Text>
                <Text size="xs">
                  <span className="mr-1 inline-block size-2 rounded-full bg-spruce-100" /> Engagement {active.engagement}
                </Text>
              </Group>
            </Paper>

            <DataList size="sm" labelWidth={90}>
              <Field label="Source">{active.source}</Field>
              <Field label="Arrived">{relative(active.createdAt)}</Field>
              <Field label="Owner">
                <Select size="xs" w={180} data={owners.map((o) => ({ value: o.id, label: o.name }))} defaultValue={active.ownerId} placeholder="Unassigned" />
              </Field>
            </DataList>

            <Divider label="Convert" labelPosition="left" />
            <Text size="sm" c="dimmed">
              Converting creates a contact, a company if one does not exist, and a deal in the Qualified stage.
            </Text>
            <Select label="Company" data={[active.company, 'Match to an existing company']} defaultValue={active.company} />
            <Select label="Pipeline" data={['Sales pipeline']} defaultValue="Sales pipeline" />
            <Group justify="space-between" mt="xs">
              <Button variant="subtle" color="gray" onClick={() => { setActive(null); notifications.show({ message: `${active.name} marked unqualified`, color: 'gray' }) }}>
                Mark unqualified
              </Button>
              <Button rightSection={<IconArrowRight size={14} />} onClick={() => { setActive(null); notifications.show({ title: 'Lead converted', message: `${active.name} is now a contact with a deal in Qualified.`, color: 'spruce' }) }}>
                Convert to deal
              </Button>
            </Group>
          </Stack>
        )}
      </Drawer>
    </>
  )
}
