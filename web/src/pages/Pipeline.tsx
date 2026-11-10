import { useMemo, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { Badge, Button, Drawer, Group, Paper, SegmentedControl, Select, Text, Tooltip, DataList, Anchor, Divider, Stack, Tabs, Table, Menu, ActionIcon, Stepper } from '@mantine/core'
import { IconCalendar, IconDots, IconPlus, IconTrophy, IconX, IconCurrencyDollar, IconHeartHandshake, IconSparkles, IconAffiliate } from '@tabler/icons-react'
import { Link, useSearchParams } from 'react-router'
import { notifications } from '@mantine/notifications'
import { activities, companyById, contactById, customerByCompany, dealKind, deals as seed, fullName, lostReasons, money, moneyShort, nextOrderDue, owners, partnerById, referrals, stageById, stages, type Deal } from '../data/mock'
import { PartnerChip } from './Partners'
import { ContactAvatar, HealthDot, OwnerAvatar, PageHeader, shortDate, longDate, Field } from '../components/ui'
import { Timeline } from './Activities'
import { NextStep, openWhatsNext } from '../components/NextStep'
import { NewInquiryDrawer } from '../components/NewInquiry'

export function KindBadge({ deal, size = 'xs' }: { deal: Deal; size?: 'xs' | 'sm' }) {
  const customer = dealKind(deal) === 'Customer'
  const partner = partnerById(referrals[deal.id])
  const partnerCo = partner ? companyById(partner.companyId) : undefined
  return (
    <Group gap={4} wrap="nowrap">
      <Tooltip label={customer ? 'Existing customer asking for more' : 'A company that has not ordered from us yet'} openDelay={400}>
        <Badge
          size={size}
          variant={customer ? 'light' : 'outline'}
          color={customer ? 'teal' : 'gray'}
          leftSection={customer ? <IconHeartHandshake size={10} /> : <IconSparkles size={10} />}
          styles={{ root: { borderColor: customer ? undefined : '#e3e8e6', color: customer ? undefined : '#5d6b72' } }}
        >
          {customer ? 'Customer' : 'New account'}
        </Badge>
      </Tooltip>
      {partner && (
        <Tooltip label={`Referred by ${partnerCo?.name} · ${partner.commissionRate}% commission on the order`} openDelay={400}>
          <Badge size={size} variant="light" color="grape" leftSection={<IconAffiliate size={10} />}>
            via {partnerCo?.name?.split(' ')[0]}
          </Badge>
        </Tooltip>
      )}
    </Group>
  )
}

function DealCard({ deal, onOpen, dragging }: { deal: Deal; onOpen?: () => void; dragging?: boolean }) {
  const co = companyById(deal.companyId)
  const overdue = deal.closeDate < '2026-11-09' && stageById(deal.stageId).kind === 'open'
  return (
    <div
      onClick={onOpen}
      className={`cursor-grab rounded-md border bg-white px-3 py-2.5 active:cursor-grabbing ${dragging ? 'rotate-1 border-spruce-500 shadow-md' : 'border-line hover:border-gray-300'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Text size="sm" fw={500} lineClamp={2}>
          {deal.name}
        </Text>
        <HealthDot health={deal.health} />
      </div>
      <Group gap={6} mt={3} wrap="nowrap">
        <KindBadge deal={deal} />
        <Text size="xs" c="dimmed" truncate>
          {co?.name}
        </Text>
      </Group>
      {stageById(deal.stageId).kind === 'open' && (
        <div className="mt-2">
          <NextStep dealId={deal.id} size="xs" onPlan={() => openWhatsNext({ dealId: deal.id, stageId: deal.stageId, ownerId: deal.ownerId })} />
        </div>
      )}
      <div className="mt-2.5 flex items-center justify-between">
        <Text size="sm" fw={600} className="tabular">
          {money(deal.amount)}
        </Text>
        <Group gap={6}>
          <Tooltip label={`Closes ${shortDate(deal.closeDate)} · ${deal.daysInStage} days in stage`}>
            <Text size="xs" c={overdue ? 'red' : 'dimmed'} className="flex items-center gap-1">
              <IconCalendar size={12} /> {shortDate(deal.closeDate)}
            </Text>
          </Tooltip>
          <OwnerAvatar id={deal.ownerId} size={20} />
        </Group>
      </div>
    </div>
  )
}

function Draggable({ deal, onOpen }: { deal: Deal; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: deal.id })
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ opacity: isDragging ? 0.3 : 1 }}>
      <DealCard deal={deal} onOpen={onOpen} />
    </div>
  )
}

function Column({ stageId, deals, onOpen }: { stageId: string; deals: Deal[]; onOpen: (d: Deal) => void }) {
  const stage = stageById(stageId)
  const { setNodeRef, isOver } = useDroppable({ id: stageId })
  const total = deals.reduce((s, d) => s + d.amount, 0)
  return (
    <div className="flex w-[268px] shrink-0 flex-col">
      <div className="mb-2 px-1">
        <div className="flex items-center justify-between">
          <Group gap={6}>
            <Text size="sm" fw={600}>
              {stage.name}
            </Text>
            <Text size="xs" c="dimmed" className="tabular">
              {deals.length}
            </Text>
          </Group>
          <Text size="xs" c="dimmed">
            {stage.probability}%
          </Text>
        </div>
        <Text size="xs" c="dimmed" className="tabular">
          {money(total)}{stage.kind === 'open' ? ` · ${moneyShort(total * (stage.probability / 100))} weighted` : ' this quarter'}
        </Text>
        <Tooltip label={stage.hint} multiline w={240} openDelay={300}>
          <Text size="xs" c="dimmed" mt={2} truncate className="cursor-help">
            {stage.hint}
          </Text>
        </Tooltip>
        <div className="mt-2 h-[3px] rounded-full bg-line">
          <div className={`h-full rounded-full ${stage.kind === 'won' ? 'bg-spruce-700' : 'bg-spruce-500'}`} style={{ width: `${stage.probability}%` }} />
        </div>
      </div>
      <div ref={setNodeRef} className={`flex min-h-[320px] flex-1 flex-col gap-2 rounded-lg p-1.5 transition-colors ${isOver ? 'bg-spruce-100/60 ring-1 ring-spruce-500' : 'bg-black/[0.025]'}`}>
        {deals.map((d) => (
          <Draggable key={d.id} deal={d} onOpen={() => onOpen(d)} />
        ))}
        {deals.length === 0 && (
          <div className="grid flex-1 place-items-center rounded-md border border-dashed border-line text-[12.5px] text-muted">Drop an opportunity here</div>
        )}
      </div>
    </div>
  )
}

export default function Pipeline() {
  const [deals, setDeals] = useState<Deal[]>(seed)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [params, setParams] = useSearchParams()
  const [owner, setOwner] = useState<string | null>(null)
  const [mode, setMode] = useState('board')
  const [kind, setKind] = useState('all')
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const open = params.get('deal')
  const current = deals.find((d) => d.id === open) ?? null
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const visible = useMemo(() => deals.filter((d) => (!owner || d.ownerId === owner) && (kind === 'all' || (kind === 'partner' ? !!referrals[d.id] : dealKind(d) === kind))), [deals, owner, kind])
  const openDeals = visible.filter((d) => stageById(d.stageId).kind === 'open')
  const total = openDeals.reduce((s, d) => s + d.amount, 0)
  const weighted = openDeals.reduce((s, d) => s + d.amount * (stageById(d.stageId).probability / 100), 0)

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const to = e.over?.id
    if (!to) return
    const deal = deals.find((d) => d.id === e.active.id)
    if (!deal || deal.stageId === to) return
    setDeals((ds) => ds.map((d) => (d.id === deal.id ? { ...d, stageId: String(to), daysInStage: 0 } : d)))
    const stage = stageById(String(to))
    notifications.show({
      title: stage.kind === 'won' ? 'Order confirmed' : `Moved to ${stage.name}`,
      message: `${deal.name} · ${money(deal.amount)}`,
      color: 'spruce',
      icon: stage.kind === 'won' ? <IconTrophy size={16} /> : undefined,
    })
    if (stage.kind === 'open') openWhatsNext({ reason: `${deal.name} moved to ${stage.name}. What happens next?`, stageId: String(to), dealId: deal.id, ownerId: deal.ownerId })
  }

  return (
    <>
      <PageHeader
        title="Pipeline"
        subtitle={
          <>
            One board for every chance to get an order. {openDeals.length} open · {openDeals.filter((d) => dealKind(d) === 'New account').length} new accounts · {openDeals.filter((d) => dealKind(d) === 'Customer').length} customers · {openDeals.filter((d) => referrals[d.id]).length} via partners · <span className="tabular">{money(total)}</span> total, <span className="tabular">{money(weighted)}</span> weighted
          </>
        }
        actions={
          <>
            <SegmentedControl
              size="xs"
              value={kind}
              onChange={setKind}
              data={[
                { value: 'all', label: 'All' },
                { value: 'New account', label: 'New accounts' },
                { value: 'Customer', label: 'Customers' },
                { value: 'partner', label: 'Via partner' },
              ]}
            />
            <Select placeholder="Everyone" data={owners.map((o) => ({ value: o.id, label: o.name }))} value={owner} onChange={setOwner} clearable w={160} />
            <SegmentedControl
              size="xs"
              value={mode}
              onChange={setMode}
              data={[
                { value: 'board', label: 'Board' },
                { value: 'table', label: 'Table' },
              ]}
            />
            <Button leftSection={<IconPlus size={16} />} onClick={() => setInquiryOpen(true)}>New inquiry</Button>
          </>
        }
      />

      {mode === 'board' ? (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex gap-3">
              {stages.map((s) => (
                <Column key={s.id} stageId={s.id} deals={visible.filter((d) => d.stageId === s.id)} onOpen={(d) => setParams({ deal: d.id })} />
              ))}
            </div>
          </div>
          <DragOverlay dropAnimation={null}>{activeId ? <DealCard deal={deals.find((d) => d.id === activeId)!} dragging /> : null}</DragOverlay>
        </DndContext>
      ) : (
        <Paper>
          <Table.ScrollContainer minWidth={820}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Opportunity</Table.Th>
                  <Table.Th>Company</Table.Th>
                  <Table.Th>Kind</Table.Th>
                  <Table.Th>Stage</Table.Th>
                  <Table.Th ta="right">Amount</Table.Th>
                  <Table.Th ta="right">Weighted</Table.Th>
                  <Table.Th>Close</Table.Th>
                  <Table.Th>Owner</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {visible.map((d) => (
                  <Table.Tr key={d.id} className="cursor-pointer" onClick={() => setParams({ deal: d.id })}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <HealthDot health={d.health} />
                        <Text size="sm" fw={500}>
                          {d.name}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{companyById(d.companyId)?.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <KindBadge deal={d} size="sm" />
                    </Table.Td>
                    <Table.Td>
                      <Badge color={stageById(d.stageId).kind === 'won' ? 'spruce' : 'gray'}>{stageById(d.stageId).name}</Badge>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" fw={500} className="tabular">
                        {money(d.amount)}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" c="dimmed" className="tabular">
                        {money(d.amount * (stageById(d.stageId).probability / 100))}
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
          </Table.ScrollContainer>
        </Paper>
      )}

      <NewInquiryDrawer opened={inquiryOpen} onClose={() => setInquiryOpen(false)} />

      <Drawer opened={!!current} onClose={() => setParams({})} position="right" size="lg" title={current?.name} padding="lg">
        {current && (
          <DealPanel
            deal={current}
            onStage={(s) => {
              setDeals((ds) => ds.map((d) => (d.id === current.id ? { ...d, stageId: s } : d)))
              const st = stageById(s)
              if (st.kind === 'open') openWhatsNext({ reason: `${current.name} moved to ${st.name}. What happens next?`, stageId: s, dealId: current.id, ownerId: current.ownerId })
            }}
          />
        )}
      </Drawer>
    </>
  )
}

function DealPanel({ deal, onStage }: { deal: Deal; onStage: (s: string) => void }) {
  const co = companyById(deal.companyId)
  const c = contactById(deal.contactId)
  const stage = stageById(deal.stageId)
    const items = activities.filter((a) => a.dealId === deal.id)
  const cu = customerByCompany(deal.companyId)
  const customer = dealKind(deal) === 'Customer'
  const partner = partnerById(referrals[deal.id])
  const stepIdx = stages.findIndex((s) => s.id === deal.stageId)
  const due = cu ? nextOrderDue(cu) : null
  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <div>
          <Group gap="xs">
            <Text size="xl" fw={600} className="tabular">
              {money(deal.amount)}
            </Text>
            <KindBadge deal={deal} size="sm" />
          </Group>
          <Text size="sm" c="dimmed">
            {stage.probability}% likely · {money(deal.amount * (stage.probability / 100))} weighted
          </Text>
        </div>
        <Group gap="xs">
          <Button size="xs" color="spruce" leftSection={<IconTrophy size={14} />} onClick={() => onStage('s5')} disabled={stage.kind === 'won'}>
            Order confirmed
          </Button>
          <Menu position="bottom-end" width={200}>
            <Menu.Target>
              <Button size="xs" variant="default" leftSection={<IconX size={14} />} disabled={stage.kind === 'won'}>
                Mark lost
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Why did we lose it?</Menu.Label>
              {lostReasons.map((r) => (
                <Menu.Item key={r} onClick={() => notifications.show({ title: 'Marked lost', message: `${deal.name} · ${r}`, color: 'gray' })}>
                  {r}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <Menu>
            <Menu.Target>
              <ActionIcon variant="default" size={30} aria-label="More">
                <IconDots size={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconCurrencyDollar size={14} />} component={Link} to="/quotes">
                Create quote
              </Menu.Item>
              <Menu.Item>Change owner</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red">Delete deal</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      {customer && cu && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-teal-200 bg-teal-50 px-3 py-2">
          <Text size="sm" c="teal.9">
            Customer since {longDate(cu.firstOrderAt)} · {money(cu.revenue12m)} last 12 months · usually orders every {cu.orderEveryDays} days
            {due ? `, next expected ${shortDate(due)}` : ''} · {cu.paymentTerms}
          </Text>
          <Anchor component={Link} to={`/customers/${cu.id}`} size="sm" c="teal.9" fw={500} className="shrink-0">
            Customer record
          </Anchor>
        </div>
      )}
      {!customer && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-paper px-3 py-2">
          <Text size="sm" c="dimmed">
            New account. First order confirmed here makes {co?.name} a customer{partner ? ` and earns ${companyById(partner.companyId)?.name} ${partner.commissionRate}% commission` : ''}.
          </Text>
        </div>
      )}

      <div>
        <Stepper active={stepIdx} size="xs" onStepClick={(i) => onStage(stages[i].id)} allowNextStepsSelect styles={{ stepLabel: { fontSize: 12 }, separator: { marginInline: 4 } }}>
          {stages.map((s) => (
            <Stepper.Step key={s.id} label={s.name} />
          ))}
        </Stepper>
        <Text size="xs" c="dimmed" mt={6}>
          {stage.name}: {stage.hint}
        </Text>
      </div>

      <div className="rounded-md border border-line bg-paper px-3 py-2.5">
        <NextStep dealId={deal.id} onPlan={() => openWhatsNext({ dealId: deal.id, stageId: deal.stageId, ownerId: deal.ownerId })} />
      </div>

      <DataList size="sm" labelWidth={110} gap={8}>
        <Field label="Company">
          <Anchor component={Link} to={`/companies/${co?.id}`} size="sm">
            {co?.name}
          </Anchor>
        </Field>
        <Field label="Contact">
          {c && (
            <Group gap={6}>
              <ContactAvatar name={fullName(c)} size={18} />
              <Anchor component={Link} to={`/contacts/${c.id}`} size="sm">
                {fullName(c)}
              </Anchor>
              <Text size="xs" c="dimmed">
                {c.title}
              </Text>
            </Group>
          )}
        </Field>
        <Field label="Close date">{shortDate(deal.closeDate)}</Field>
        {partner && (
          <Field label="Referred by">
            <Group gap={8}>
              <PartnerChip partnerId={partner.id} />
              <Text size="xs" c="dimmed" className="tabular">
                {money(deal.amount * (partner.commissionRate / 100))} commission if confirmed
              </Text>
            </Group>
          </Field>
        )}
        <Field label="Owner">
          <Group gap={6}>
            <OwnerAvatar id={deal.ownerId} size={20} />
            <Text size="sm">{owners.find((o) => o.id === deal.ownerId)?.name}</Text>
          </Group>
        </Field>
        <Field label="Health">
          <Group gap={6}>
            <HealthDot health={deal.health} />
            <Text size="sm">
              {deal.health === 'stalled' ? `No activity for ${deal.daysInStage} days` : deal.health === 'at risk' ? 'Competitor mentioned' : 'Active this week'}
            </Text>
          </Group>
        </Field>
      </DataList>

      <Divider />
      <Tabs defaultValue="timeline">
        <Tabs.List mb="sm">
          <Tabs.Tab value="timeline">Timeline · {items.length}</Tabs.Tab>
          <Tabs.Tab value="quotes">Quotes</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="timeline">
          {items.length ? (
            <Timeline items={items} showDeal={false} />
          ) : (
            <Text size="sm" c="dimmed">
              Nothing logged on this opportunity yet.
            </Text>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="quotes">
          <Text size="sm" c="dimmed">
            Quotes attached to this deal appear here.{' '}
            <Anchor component={Link} to="/quotes" size="sm">
              Open quotes
            </Anchor>
          </Text>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}
