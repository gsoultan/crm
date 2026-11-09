import { Anchor, Badge, Breadcrumbs, Button, DataList, Group, Menu, Paper, Tabs, Text, Title, Textarea, SegmentedControl, ActionIcon } from '@mantine/core'
import { IconDots, IconMail, IconPhone, IconPlus, IconCalendarPlus, IconPencil } from '@tabler/icons-react'
import { Link, useParams } from 'react-router'
import { activities, companyById, contactById, customerByCompany, deals, fullName, money, stageById } from '../data/mock'
import { ContactAvatar, HealthDot, LifecycleBadge, OwnerAvatar, ScoreBar, longDate, relative, shortDate, Field } from '../components/ui'
import { Timeline } from './Activities'

export default function ContactDetail() {
  const { id } = useParams()
  const c = contactById(id)
  if (!c) return <Text>Contact not found.</Text>
  const co = companyById(c.companyId)
  const items = activities.filter((a) => a.contactId === c.id)
  const myDeals = deals.filter((d) => d.contactId === c.id)
  const cu = customerByCompany(c.companyId)

  return (
    <>
      <Breadcrumbs mb="md" separatorMargin={6} styles={{ breadcrumb: { fontSize: 13 } }}>
        <Anchor component={Link} to="/contacts" size="sm">
          Contacts
        </Anchor>
        <Text size="sm">{fullName(c)}</Text>
      </Breadcrumbs>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <Group gap="md" align="flex-start">
          <ContactAvatar name={fullName(c)} size={56} />
          <div>
            <Group gap="sm">
              <Title order={1}>{fullName(c)}</Title>
              <LifecycleBadge stage={c.lifecycle} />
            </Group>
            <Text c="dimmed" size="sm" mt={2}>
              {c.title}
              {co && (
                <>
                  {' at '}
                  <Anchor component={Link} to={`/companies/${co.id}`} size="sm">
                    {co.name}
                  </Anchor>
                </>
              )}
            </Text>
            <Group gap="xs" mt={8}>
              {c.tags.map((t) => (
                <Badge key={t} color="gray" variant="outline" styles={{ root: { borderColor: '#e3e8e6' } }}>
                  {t}
                </Badge>
              ))}
              <Button variant="subtle" size="compact-xs" color="gray" leftSection={<IconPlus size={12} />}>
                Tag
              </Button>
            </Group>
          </div>
        </Group>
        <Group gap="xs">
          <Button variant="default" leftSection={<IconMail size={16} />}>
            Email
          </Button>
          <Button variant="default" leftSection={<IconPhone size={16} />}>
            Call
          </Button>
          <Button leftSection={<IconCalendarPlus size={16} />}>Schedule</Button>
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="default" size={34} aria-label="More">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Merge duplicate</Menu.Item>
              <Menu.Item>Change owner</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red">Delete contact</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4">
          <Paper p="md">
            <Group justify="space-between" mb="sm">
              <Text fw={600} size="sm">
                Details
              </Text>
              <ActionIcon variant="subtle" color="gray" size="sm" aria-label="Edit">
                <IconPencil size={14} />
              </ActionIcon>
            </Group>
            <DataList size="sm" labelWidth={110} gap={10}>
              <Field label="Email">
                <Anchor href={`mailto:${c.email}`} size="sm">
                  {c.email}
                </Anchor>
              </Field>
              <Field label="Phone">{c.phone}</Field>
              <Field label="Owner">
                <Group gap={6}>
                  <OwnerAvatar id={c.ownerId} size={20} />
                  <Text size="sm">{c.ownerId === 'u1' ? 'You' : 'Teammate'}</Text>
                </Group>
              </Field>
              <Field label="Lead score">
                <ScoreBar score={c.score} />
              </Field>
              <Field label="Email consent">
                <Badge color={c.consent === 'Opted in' ? 'spruce' : c.consent === 'Opted out' ? 'red' : 'gray'}>{c.consent}</Badge>
              </Field>
              <Field label="Last activity">{relative(c.lastActivity)}</Field>
              <Field label="Created">{longDate('2026-03-14')}</Field>
            </DataList>
          </Paper>

          {cu && (
            <Link to={`/customers/${cu.id}`} className="block rounded-lg border border-spruce-100 bg-spruce-50 px-4 py-3 hover:border-spruce-500">
              <Group justify="space-between">
                <Text size="sm" fw={600}>
                  Customer account
                </Text>
                <Badge color={cu.health >= 70 ? 'spruce' : cu.health >= 40 ? 'amber' : 'red'}>Health {cu.health}</Badge>
              </Group>
              <Text size="xs" c="dimmed" mt={2}>
                {cu.plan} · {cu.seats} seats · {money(cu.arr)} ARR · renews {shortDate(cu.renewalAt)}
              </Text>
            </Link>
          )}

          <Paper p="md">
            <Group justify="space-between" mb="sm">
              <Text fw={600} size="sm">
                Deals · {myDeals.length}
              </Text>
              <Button variant="subtle" size="compact-xs" leftSection={<IconPlus size={12} />}>
                New
              </Button>
            </Group>
            <div className="flex flex-col gap-2">
              {myDeals.map((d) => (
                <Link key={d.id} to={`/pipeline?deal=${d.id}`} className="rounded-md border border-line px-3 py-2 hover:border-spruce-500">
                  <Group justify="space-between" wrap="nowrap">
                    <Text size="sm" fw={500} truncate>
                      {d.name}
                    </Text>
                    <HealthDot health={d.health} />
                  </Group>
                  <Text size="xs" c="dimmed">
                    {stageById(d.stageId).name} · {money(d.amount)} · closes {shortDate(d.closeDate)}
                  </Text>
                </Link>
              ))}
              {myDeals.length === 0 && (
                <Text size="sm" c="dimmed">
                  No deals yet. Start one when there is something to sell.
                </Text>
              )}
            </div>
          </Paper>
        </div>

        <div>
          <Paper p="md" mb="md">
            <SegmentedControl
              size="xs"
              data={[
                { value: 'note', label: 'Note' },
                { value: 'call', label: 'Call' },
                { value: 'email', label: 'Email' },
                { value: 'meeting', label: 'Meeting' },
                { value: 'task', label: 'Task' },
              ]}
              mb="sm"
            />
            <Textarea placeholder={`Add a note about ${c.firstName}…`} autosize minRows={2} mb="sm" />
            <Group justify="flex-end">
              <Button size="xs">Save note</Button>
            </Group>
          </Paper>

          <Tabs defaultValue="timeline">
            <Tabs.List mb="md">
              <Tabs.Tab value="timeline">Timeline · {items.length}</Tabs.Tab>
              <Tabs.Tab value="emails">Emails</Tabs.Tab>
              <Tabs.Tab value="files">Files</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="timeline">
              {items.length ? (
                <Timeline items={items} showWho={false} />
              ) : (
                <Paper p="xl" ta="center">
                  <Text fw={500}>Nothing logged yet</Text>
                  <Text size="sm" c="dimmed">
                    Calls, emails and notes about {c.firstName} will show up here.
                  </Text>
                </Paper>
              )}
            </Tabs.Panel>
            <Tabs.Panel value="emails">
              <Paper p="xl" ta="center">
                <Text fw={500}>Connect your inbox</Text>
                <Text size="sm" c="dimmed" mb="md">
                  Link Gmail or Outlook to see every email with {c.firstName} here.
                </Text>
                <Button variant="light" size="xs">
                  Connect email
                </Button>
              </Paper>
            </Tabs.Panel>
            <Tabs.Panel value="files">
              <Paper p="xl" ta="center">
                <Text fw={500}>No files</Text>
                <Text size="sm" c="dimmed">
                  Quotes and attachments shared with {c.firstName} will be listed here.
                </Text>
              </Paper>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </>
  )
}
