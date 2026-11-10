import { Anchor, Badge, Breadcrumbs, Button, DataList, Group, Paper, Tabs, Text, Title, Table } from '@mantine/core'
import { IconAffiliate, IconHeartHandshake, IconPlus, IconWorld } from '@tabler/icons-react'
import { Link, useParams } from 'react-router'
import { activities, companyById, contacts, customerByCompany, deals, fullName, money, partners, referrals, stageById } from '../data/mock'
import { PartnerChip } from './Partners'
import { ContactAvatar, HealthDot, LifecycleBadge, OwnerAvatar, Stat, shortDate, Field } from '../components/ui'
import { Timeline } from './Activities'
import { NextStep } from '../components/NextStep'
import { NewInquiryDrawer } from '../components/NewInquiry'
import { useState } from 'react'
import { CompanyMark } from './Companies'

export default function CompanyDetail() {
  const { id } = useParams()
  const co = companyById(id ?? null)
  if (!co) return <Text>Company not found.</Text>
  const people = contacts.filter((c) => c.companyId === co.id)
  const myDeals = deals.filter((d) => d.companyId === co.id)
  const open = myDeals.filter((d) => stageById(d.stageId).kind === 'open')
  const won = myDeals.filter((d) => d.stageId === 's5')
  const items = activities.filter((a) => a.companyId === co.id)
  const cu = customerByCompany(co.id)
  const asPartner = partners.find((p) => p.companyId === co.id)
  const [inquiryOpen, setInquiryOpen] = useState(false)

  return (
    <>
      <NewInquiryDrawer key={co.id} opened={inquiryOpen} onClose={() => setInquiryOpen(false)} companyId={co.id} />
      <Breadcrumbs mb="md" separatorMargin={6}>
        <Anchor component={Link} to="/companies" size="sm">
          Companies
        </Anchor>
        <Text size="sm">{co.name}</Text>
      </Breadcrumbs>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <Group gap="md">
          <CompanyMark name={co.name} size={56} />
          <div>
            <Title order={1}>{co.name}</Title>
            <Text c="dimmed" size="sm" mt={2}>
              {co.industry} · {co.size} employees · {co.city}
            </Text>
            <div className="mt-2">
              <NextStep companyId={co.id} />
            </div>
          </div>
        </Group>
        <Group gap="xs">
          <Button variant="default" leftSection={<IconWorld size={16} />} component="a" href={`https://${co.domain}`} target="_blank">
            {co.domain}
          </Button>
          {asPartner && (
            <Button variant="light" color="grape" leftSection={<IconAffiliate size={16} />} component={Link} to={`/partners/${asPartner.id}`}>
              Partner record
            </Button>
          )}
          {cu && (
            <Button variant="light" leftSection={<IconHeartHandshake size={16} />} component={Link} to={`/customers/${cu.id}`}>
              Customer record
            </Button>
          )}
          <Button leftSection={<IconPlus size={16} />} onClick={() => setInquiryOpen(true)}>New inquiry</Button>
        </Group>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Open pipeline" value={money(open.reduce((s, d) => s + d.amount, 0))} hint={`${open.length} open deals`} />
        <Stat label="Won to date" value={money(won.reduce((s, d) => s + d.amount, 0))} hint={`${won.length} won`} tone="good" />
        <Stat label="Contacts" value={String(people.length)} hint={`${people.filter((p) => p.tags.includes('Decision maker')).length} decision makers`} />
        <Stat label="Last activity" value={shortDate(co.lastActivity)} hint="Meeting with Anindya" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4">
          <Paper p="md">
            <Text fw={600} size="sm" mb="sm">
              About
            </Text>
            <DataList size="sm" labelWidth={100} gap={10}>
              <Field label="Website">
                <Anchor href={`https://${co.domain}`} size="sm" target="_blank">
                  {co.domain}
                </Anchor>
              </Field>
              <Field label="Industry">{co.industry}</Field>
              <Field label="Size">{co.size}</Field>
              <Field label="Location">{co.city}</Field>
              <Field label="Owner">
                <OwnerAvatar id={co.ownerId} size={20} />
              </Field>
              <Field label="Relationship">
                <Group gap={4}>
                  {cu && <Badge color="spruce">Customer</Badge>}
                  {asPartner && <Badge color="grape">Partner</Badge>}
                  {!cu && !asPartner && <Badge color="gray">Prospect</Badge>}
                </Group>
              </Field>
              {referrals[co.id] && (
                <Field label="Introduced by">
                  <PartnerChip partnerId={referrals[co.id]} size="xs" />
                </Field>
              )}
            </DataList>
          </Paper>

          <Paper p="md">
            <Group justify="space-between" mb="sm">
              <Text fw={600} size="sm">
                People · {people.length}
              </Text>
              <Button variant="subtle" size="compact-xs" leftSection={<IconPlus size={12} />}>
                Add
              </Button>
            </Group>
            <div className="flex flex-col gap-1">
              {people.map((p) => (
                <Link key={p.id} to={`/contacts/${p.id}`} className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-paper">
                  <ContactAvatar name={fullName(p)} size={28} />
                  <div className="min-w-0 flex-1">
                    <Text size="sm" fw={500} truncate>
                      {fullName(p)}
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

        <Tabs defaultValue="deals">
          <Tabs.List mb="md">
            <Tabs.Tab value="deals">Opportunities · {myDeals.length}</Tabs.Tab>
            <Tabs.Tab value="timeline">Timeline · {items.length}</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="deals">
            <Paper>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Deal</Table.Th>
                    <Table.Th>Stage</Table.Th>
                    <Table.Th ta="right">Amount</Table.Th>
                    <Table.Th>Close</Table.Th>
                    <Table.Th>Owner</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {myDeals.map((d) => (
                    <Table.Tr key={d.id}>
                      <Table.Td>
                        <Group gap="sm" wrap="nowrap">
                          <HealthDot health={d.health} />
                          <Anchor component={Link} to={`/pipeline?deal=${d.id}`} size="sm" fw={500} c="ink">
                            {d.name}
                          </Anchor>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{stageById(d.stageId).name}</Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="sm" className="tabular" fw={500}>
                          {money(d.amount)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {shortDate(d.closeDate)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <OwnerAvatar id={d.ownerId} size={24} />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>
          <Tabs.Panel value="timeline">
            <Timeline items={items} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  )
}
