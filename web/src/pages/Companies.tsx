import { useState } from 'react'
import { Button, Paper, Table, Text, TextInput, Group, Select, SegmentedControl, SimpleGrid, Avatar } from '@mantine/core'
import { IconBuilding, IconLayoutGrid, IconList, IconPlus, IconSearch } from '@tabler/icons-react'
import { useNavigate, Link } from 'react-router'
import { companies, contacts, money } from '../data/mock'
import { OwnerAvatar, PageHeader, relative } from '../components/ui'

export function CompanyMark({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <Avatar size={size} radius="md" color="gray" variant="light" styles={{ placeholder: { fontSize: size * 0.4, fontWeight: 600, background: '#eef1f0', color: '#5d6b72' } }}>
      {name[0]}
    </Avatar>
  )
}

export default function Companies() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [industry, setIndustry] = useState<string | null>(null)
  const [mode, setMode] = useState('list')
  const rows = companies.filter((c) => (!q || c.name.toLowerCase().includes(q.toLowerCase())) && (!industry || c.industry === industry))
  const industries = [...new Set(companies.map((c) => c.industry))]

  return (
    <>
      <PageHeader
        title="Companies"
        subtitle={`${companies.length} accounts · ${money(companies.reduce((s, c) => s + c.pipelineValue, 0))} in open pipeline`}
        actions={<Button leftSection={<IconPlus size={16} />}>New company</Button>}
      />

      <Paper>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2.5">
          <TextInput placeholder="Search companies" leftSection={<IconSearch size={15} />} value={q} onChange={(e) => setQ(e.currentTarget.value)} w={240} />
          <Select placeholder="Industry" data={industries} value={industry} onChange={setIndustry} clearable w={190} />
          <div className="flex-1" />
          <SegmentedControl
            size="xs"
            value={mode}
            onChange={setMode}
            data={[
              { value: 'list', label: <IconList size={14} /> },
              { value: 'grid', label: <IconLayoutGrid size={14} /> },
            ]}
          />
        </div>

        {mode === 'list' ? (
          <Table.ScrollContainer minWidth={820}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Company</Table.Th>
                  <Table.Th>Industry</Table.Th>
                  <Table.Th>Size</Table.Th>
                  <Table.Th>Contacts</Table.Th>
                  <Table.Th ta="right">Open deals</Table.Th>
                  <Table.Th ta="right">Pipeline</Table.Th>
                  <Table.Th>Owner</Table.Th>
                  <Table.Th>Last activity</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((c) => (
                  <Table.Tr key={c.id} className="cursor-pointer" onClick={() => navigate(`/companies/${c.id}`)}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <CompanyMark name={c.name} />
                        <div>
                          <Text size="sm" fw={500}>
                            {c.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {c.domain} · {c.city}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{c.industry}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {c.size}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" className="tabular">
                        {contacts.filter((p) => p.companyId === c.id).length}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" className="tabular">
                        {c.openDeals}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" fw={500} className="tabular">
                        {c.pipelineValue ? money(c.pipelineValue) : <span className="font-normal text-muted">—</span>}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <OwnerAvatar id={c.ownerId} />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {relative(c.lastActivity)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} p="md" spacing="sm">
            {rows.map((c) => (
              <Link key={c.id} to={`/companies/${c.id}`} className="rounded-lg border border-line p-4 hover:border-spruce-500">
                <Group gap="sm" mb="sm">
                  <CompanyMark name={c.name} size={40} />
                  <div className="min-w-0">
                    <Text fw={500} truncate>
                      {c.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {c.industry} · {c.city}
                    </Text>
                  </div>
                </Group>
                <div className="grid grid-cols-3 gap-2 text-[12.5px]">
                  <div>
                    <div className="text-muted">Contacts</div>
                    <div className="tabular font-medium">{contacts.filter((p) => p.companyId === c.id).length}</div>
                  </div>
                  <div>
                    <div className="text-muted">Deals</div>
                    <div className="tabular font-medium">{c.openDeals}</div>
                  </div>
                  <div>
                    <div className="text-muted">Pipeline</div>
                    <div className="tabular font-medium">{c.pipelineValue ? money(c.pipelineValue) : '—'}</div>
                  </div>
                </div>
              </Link>
            ))}
          </SimpleGrid>
        )}
        {rows.length === 0 && (
          <div className="py-12 text-center">
            <IconBuilding size={28} stroke={1.25} className="mx-auto mb-2 text-muted" />
            <Text fw={500}>No companies match</Text>
            <Text size="sm" c="dimmed">
              Try a different name or clear the industry filter.
            </Text>
          </div>
        )}
      </Paper>
    </>
  )
}
