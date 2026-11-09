import { Anchor, Badge, Breadcrumbs, Button, DataList, Group, Menu, Paper, Tabs, Text, Title, ActionIcon, Divider } from '@mantine/core'
import { IconDots, IconMail, IconPlus, IconUserPlus, IconFileDollar } from '@tabler/icons-react'
import { Link, useParams } from 'react-router'
import { notifications } from '@mantine/notifications'
import { companyById, contacts, customers, daysUntil, deals, fullName, leads, money, owners, partnerById, partnerStats, referrals, stageById } from '../data/mock'
import { ContactAvatar, Field, HealthDot, OwnerAvatar, ScoreBar, Stat, longDate, relative, shortDate } from '../components/ui'
import { CompanyMark } from './Companies'
import { partnerStatusColor, tierColor } from './Partners'
import { HealthRing } from './Customers'

export default function PartnerDetail() {
  const { id } = useParams()
  const p = partnerById(id)
  if (!p) return <Text>Partner not found.</Text>
  const co = companyById(p.companyId)!
  const s = partnerStats(p)
  const people = contacts.filter((c) => c.companyId === co.id)
  const myLeads = leads.filter((l) => referrals[l.id] === p.id)
  const myDeals = deals.filter((d) => referrals[d.id] === p.id).sort((a, b) => Number(a.stageId === 's5') - Number(b.stageId === 's5'))
  const myCustomers = customers.filter((c) => referrals[c.companyId] === p.id)
  const manager = owners.find((o) => o.id === p.managerId)
  const agreementDays = daysUntil(p.agreementUntil)

  return (
    <>
      <Breadcrumbs mb="md" separatorMargin={6}>
        <Anchor component={Link} to="/partners" size="sm">
          Partners
        </Anchor>
        <Text size="sm">{co.name}</Text>
      </Breadcrumbs>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <Group gap="md" align="flex-start">
          <CompanyMark name={co.name} size={56} />
          <div>
            <Group gap="sm">
              <Title order={1}>{co.name}</Title>
              <Badge color={tierColor[p.tier]} size="md">
                {p.tier} {p.kind.toLowerCase()} partner
              </Badge>
              <Badge color={partnerStatusColor[p.status]} size="md" variant="outline" styles={{ root: { borderColor: '#e3e8e6' } }}>
                {p.status}
              </Badge>
            </Group>
            <Text c="dimmed" size="sm" mt={2}>
              {co.industry} · {co.city} · partner since {longDate(p.since)} ·{' '}
              <Anchor component={Link} to={`/companies/${co.id}`} size="sm">
                company record
              </Anchor>
            </Text>
          </div>
        </Group>
        <Group gap="xs">
          <Button variant="default" leftSection={<IconMail size={16} />}>
            Email partner
          </Button>
          <Button variant="default" leftSection={<IconFileDollar size={16} />} onClick={() => notifications.show({ message: `Commission statement for ${co.name} queued`, color: 'spruce' })}>
            Commission statement
          </Button>
          <Button leftSection={<IconUserPlus size={16} />}>Register a lead</Button>
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="default" size={34} aria-label="More">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Change tier or commission</Menu.Item>
              <Menu.Item>Change partner manager</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red">Deactivate partner</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Leads referred" value={String(s.leads)} hint={`${myLeads.filter((l) => l.status === 'Qualified').length} qualified · ${myLeads.filter((l) => l.status === 'New').length} waiting`} />
        <Stat label="Open pipeline" value={money(s.openValue)} hint={`${s.openDeals} deals from this partner`} />
        <Stat label="Sourced revenue, 12 months" value={money(s.sourcedRevenue12m)} hint={`${s.customers} ${s.customers === 1 ? 'customer' : 'customers'} they introduced`} tone="good" />
        <Stat label="Commission owed" value={money(p.commissionOwed)} hint={`${money(p.commissionPaid)} paid to date · ${p.commissionRate}% of first-year orders`} tone={p.commissionOwed ? 'warn' : undefined} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Tabs defaultValue="leads">
          <Tabs.List mb="md">
            <Tabs.Tab value="leads">Leads · {myLeads.length}</Tabs.Tab>
            <Tabs.Tab value="deals">Deals · {myDeals.length}</Tabs.Tab>
            <Tabs.Tab value="customers">Customers · {myCustomers.length}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="leads">
            <Paper>
              {myLeads.map((l) => (
                <Link key={l.id} to="/leads" className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0 hover:bg-paper">
                  <ContactAvatar name={l.name} size={30} color="gray" />
                  <div className="min-w-0 flex-1">
                    <Text size="sm" fw={500}>
                      {l.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {l.company} · arrived {relative(l.createdAt)}
                    </Text>
                  </div>
                  <ScoreBar score={l.score} />
                  <Badge color={l.status === 'New' ? 'amber' : l.status === 'Qualified' ? 'spruce' : l.status === 'Contacted' ? 'blue' : 'gray'}>{l.status}</Badge>
                  <OwnerAvatar id={l.ownerId} size={22} />
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 py-3">
                <Text size="sm" c="dimmed">
                  Leads this partner registered or that arrived with their referral code.
                </Text>
                <Button variant="light" size="xs" leftSection={<IconPlus size={14} />}>
                  Register a lead
                </Button>
              </div>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="deals">
            <Paper>
              {myDeals.map((d) => {
                const st = stageById(d.stageId)
                return (
                  <Link key={d.id} to={`/pipeline?deal=${d.id}`} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0 hover:bg-paper">
                    <HealthDot health={d.health} />
                    <div className="min-w-0 flex-1">
                      <Text size="sm" fw={500}>
                        {d.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {companyById(d.companyId)?.name} · {st.kind === 'won' ? `won ${shortDate(d.closeDate)}` : `${st.name} · closes ${shortDate(d.closeDate)}`}
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text size="sm" fw={500} className="tabular">
                        {money(d.amount)}
                      </Text>
                      <Text size="xs" c="dimmed" className="tabular">
                        {st.kind === 'won' ? `${money(d.amount * (p.commissionRate / 100))} commission` : `${money(d.amount * (p.commissionRate / 100))} if won`}
                      </Text>
                    </div>
                    <Badge color={st.kind === 'won' ? 'spruce' : 'gray'}>{st.name}</Badge>
                  </Link>
                )
              })}
              {myDeals.length === 0 && (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  No deals from this partner yet.
                </Text>
              )}
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="customers">
            <Paper>
              {myCustomers.map((c) => {
                const cco = companyById(c.companyId)!
                return (
                  <Link key={c.id} to={`/customers/${c.id}`} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0 hover:bg-paper">
                    <CompanyMark name={cco.name} />
                    <div className="min-w-0 flex-1">
                      <Text size="sm" fw={500}>
                        {cco.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Customer since {longDate(c.firstOrderAt)} · {c.stage}
                      </Text>
                    </div>
                    <Text size="sm" fw={500} className="tabular">
                      {money(c.revenue12m)}
                    </Text>
                    <HealthRing value={c.health} size={30} />
                  </Link>
                )
              })}
              {myCustomers.length === 0 && (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  No customers introduced by this partner yet.
                </Text>
              )}
            </Paper>
          </Tabs.Panel>
        </Tabs>

        <div className="flex flex-col gap-4">
          <Paper p="md">
            <Text fw={600} size="sm" mb="sm">
              Partner agreement
            </Text>
            <DataList size="sm" labelWidth={110} gap={10}>
              <Field label="Type">{p.kind}</Field>
              <Field label="Tier">
                <Badge color={tierColor[p.tier]} variant="light">
                  {p.tier}
                </Badge>
              </Field>
              <Field label="Commission">
                <span className="tabular">{p.commissionRate}% of first-year order value</span>
              </Field>
              <Field label="Paid out">
                <span className="tabular">{money(p.commissionPaid)}</span>
              </Field>
              <Field label="Valid until">
                <Text size="sm" c={agreementDays <= 60 ? 'amber.8' : undefined} fw={agreementDays <= 60 ? 500 : 400} component="span">
                  {longDate(p.agreementUntil)}
                </Text>
                {agreementDays <= 60 && (
                  <Text size="xs" c="dimmed">
                    Renew within {agreementDays} days
                  </Text>
                )}
              </Field>
              <Field label="Partner manager">
                <Group gap={6}>
                  <OwnerAvatar id={p.managerId} size={20} />
                  <Text size="sm">{manager?.name}</Text>
                </Group>
              </Field>
            </DataList>
          </Paper>

          <Paper p="md">
            <Text fw={600} size="sm" mb="sm">
              Contacts at the partner
            </Text>
            <div className="flex flex-col gap-1">
              {people.map((c) => (
                <Link key={c.id} to={`/contacts/${c.id}`} className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-paper">
                  <ContactAvatar name={fullName(c)} size={26} color="grape" />
                  <div className="min-w-0 flex-1">
                    <Text size="sm" fw={500} truncate>
                      {fullName(c)}
                    </Text>
                    <Text size="xs" c="dimmed" truncate>
                      {c.title}
                    </Text>
                  </div>
                </Link>
              ))}
              {people.length === 0 && (
                <Text size="sm" c="dimmed">
                  No contacts yet.
                </Text>
              )}
            </div>
            <Divider my="sm" />
            <Button variant="subtle" size="compact-xs" leftSection={<IconPlus size={12} />}>
              Add contact
            </Button>
          </Paper>
        </div>
      </div>
    </>
  )
}
