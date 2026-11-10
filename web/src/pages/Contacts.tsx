import { useMemo, useState } from 'react'
import { ActionBar, ActionIcon, Button, Checkbox, Group, Menu, Pagination, Paper, Select, Table, Text, TextInput, Badge, Drawer, Stack, Textarea } from '@mantine/core'
import { IconDots, IconDownload, IconFilter, IconMail, IconPlus, IconSearch, IconTag, IconUpload, IconUserPlus, IconX } from '@tabler/icons-react'
import { useNavigate } from 'react-router'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { companies, companyById, contacts, fullName, owners, type Lifecycle } from '../data/mock'
import { ContactAvatar, LifecycleBadge, OwnerAvatar, PageHeader, ScoreBar, relative } from '../components/ui'

const views = [
  { value: 'all', label: 'All contacts' },
  { value: 'mine', label: 'My contacts' },
  { value: 'customers', label: 'Customers' },
  { value: 'leads', label: 'Leads and qualified' },
  { value: 'stale', label: 'No activity in 14 days' },
]

export default function Contacts() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [view, setView] = useState<string | null>('all')
  const [lifecycle, setLifecycle] = useState<string | null>(null)
  const [owner, setOwner] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [opened, { open, close }] = useDisclosure(false)

  const rows = useMemo(() => {
    return contacts.filter((c) => {
      const text = `${fullName(c)} ${c.email} ${c.title} ${companyById(c.companyId)?.name ?? ''}`.toLowerCase()
      if (q && !text.includes(q.toLowerCase())) return false
      if (lifecycle && c.lifecycle !== lifecycle) return false
      if (owner && c.ownerId !== owner) return false
      if (view === 'mine' && c.ownerId !== 'u1') return false
      if (view === 'customers' && c.lifecycle !== 'Customer') return false
      if (view === 'leads' && !['Lead', 'Qualified'].includes(c.lifecycle)) return false
      if (view === 'stale' && c.lastActivity > '2026-10-26') return false
      return true
    })
  }, [q, view, lifecycle, owner])

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id))
  const toggleAll = () => setSelected(allSelected ? [] : rows.map((r) => r.id))
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <>
      <PageHeader
        title="Contacts"
        subtitle={`${contacts.length} people · ${contacts.filter((c) => c.lifecycle === 'Customer').length} customers`}
        actions={
          <>
            <Menu position="bottom-end">
              <Menu.Target>
                <Button variant="default" leftSection={<IconUpload size={16} />}>
                  Import
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>From CSV file</Menu.Item>
                <Menu.Item>From Google Contacts</Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Button leftSection={<IconPlus size={16} />} onClick={open}>
              New contact
            </Button>
          </>
        }
      />

      <Paper>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2.5">
          <Select data={views} value={view} onChange={setView} w={200} variant="unstyled" fw={500} allowDeselect={false} comboboxProps={{ width: 240, position: 'bottom-start' }} />
          <TextInput
            placeholder="Search name, email, company"
            leftSection={<IconSearch size={15} />}
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            w={260}
            rightSection={q && <IconX size={14} className="cursor-pointer" onClick={() => setQ('')} />}
          />
          <Select placeholder="Lifecycle" data={['Lead', 'Qualified', 'Customer', 'Churned']} value={lifecycle} onChange={setLifecycle} clearable w={140} leftSection={<IconFilter size={14} />} />
          <Select placeholder="Owner" data={owners.map((o) => ({ value: o.id, label: o.name }))} value={owner} onChange={setOwner} clearable w={160} />
          <div className="flex-1" />
          <Text size="sm" c="dimmed">
            {rows.length} of {contacts.length}
          </Text>
          <ActionIcon variant="subtle" color="gray" aria-label="Export">
            <IconDownload size={16} />
          </ActionIcon>
        </div>

        <Table.ScrollContainer minWidth={900}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={40}>
                  <Checkbox size="xs" checked={allSelected} indeterminate={!allSelected && selected.length > 0} onChange={toggleAll} aria-label="Select all" />
                </Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Company</Table.Th>
                <Table.Th>Lifecycle</Table.Th>
                <Table.Th>Score</Table.Th>
                <Table.Th>Tags</Table.Th>
                <Table.Th>Owner</Table.Th>
                <Table.Th>Last activity</Table.Th>
                <Table.Th w={40} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((c) => {
                const co = companyById(c.companyId)
                return (
                  <Table.Tr key={c.id} className="cursor-pointer" onClick={() => navigate(`/contacts/${c.id}`)} bg={selected.includes(c.id) ? 'spruce.0' : undefined}>
                    <Table.Td onClick={(e) => e.stopPropagation()}>
                      <Checkbox size="xs" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} aria-label={`Select ${fullName(c)}`} />
                    </Table.Td>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <ContactAvatar name={fullName(c)} />
                        <div className="min-w-0">
                          <Text size="sm" fw={500}>
                            {fullName(c)}
                          </Text>
                          <Text size="xs" c="dimmed" truncate>
                            {c.title}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{co?.name ?? <span className="text-muted">No company</span>}</Text>
                    </Table.Td>
                    <Table.Td>
                      <LifecycleBadge stage={c.lifecycle as Lifecycle} />
                    </Table.Td>
                    <Table.Td>
                      <ScoreBar score={c.score} />
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        {c.tags.slice(0, 2).map((t) => (
                          <Badge key={t} color="gray" variant="outline" styles={{ root: { borderColor: '#e3e8e6' } }}>
                            {t}
                          </Badge>
                        ))}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <OwnerAvatar id={c.ownerId} />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {relative(c.lastActivity)}
                      </Text>
                    </Table.Td>
                    <Table.Td onClick={(e) => e.stopPropagation()}>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray" aria-label="More">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconMail size={14} />}>Send email</Menu.Item>
                          <Menu.Item leftSection={<IconTag size={14} />}>Add tag</Menu.Item>
                          <Menu.Item>Change owner</Menu.Item>
                          <Menu.Divider />
                          <Menu.Item color="red">Delete</Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
              {rows.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={9}>
                    <div className="py-12 text-center">
                      <Text fw={500}>No contacts match these filters</Text>
                      <Text size="sm" c="dimmed" mt={4}>
                        Clear a filter, or add the person you are looking for.
                      </Text>
                      <Button variant="light" size="xs" mt="md" onClick={() => { setQ(''); setLifecycle(null); setOwner(null); setView('all') }}>
                        Clear filters
                      </Button>
                    </div>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
          <Text size="xs" c="dimmed">
            Showing {rows.length} contacts
          </Text>
          <Pagination total={1} size="sm" />
        </div>
      </Paper>

      <ActionBar opened={selected.length > 0} onClose={() => setSelected([])}>
        <Text size="sm" fw={500} className="tabular">
          {selected.length} selected
        </Text>
        <ActionBar.Divider />
        <Button size="xs" variant="subtle" color="gray" leftSection={<IconMail size={14} />}>
          Email
        </Button>
        <Button size="xs" variant="subtle" color="gray" leftSection={<IconTag size={14} />}>
          Add tag
        </Button>
        <Button size="xs" variant="subtle" color="gray" leftSection={<IconUserPlus size={14} />}>
          Assign owner
        </Button>
        <Button size="xs" variant="subtle" color="gray" onClick={() => { notifications.show({ title: 'Added to segment', message: `${selected.length} contacts added to "Trade show list"`, color: 'spruce' }); setSelected([]) }}>
          Add to segment
        </Button>
        <ActionBar.CloseButton />
      </ActionBar>

      <Drawer opened={opened} onClose={close} title="New contact" position="right" size="md">
        <Stack gap="sm">
          <Group grow>
            <TextInput label="First name" placeholder="Sofie" data-autofocus />
            <TextInput label="Last name" placeholder="de Vries" />
          </Group>
          <TextInput label="Email" placeholder="name@company.com" leftSection={<IconMail size={15} />} />
          <TextInput label="Phone" placeholder="+31 ..." />
          <Select label="Company" placeholder="Search or create" data={companies.map((c) => c.name)} searchable nothingFoundMessage="Press enter to create" />
          <TextInput label="Job title" placeholder="Head of Operations" />
          <Group grow>
            <Select label="Lifecycle" data={['Lead', 'Qualified', 'Customer']} defaultValue="Lead" />
            <Select label="Owner" data={owners.map((o) => ({ value: o.id, label: o.name }))} defaultValue="u1" />
          </Group>
          <Textarea label="Note" placeholder="How did you meet?" autosize minRows={2} />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button onClick={() => { close(); notifications.show({ title: 'Contact saved', message: 'You can find them under Contacts.', color: 'spruce' }) }}>
              Save contact
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  )
}
