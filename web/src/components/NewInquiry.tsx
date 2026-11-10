import { useMemo, useState } from 'react'
import { ActionIcon, Badge, Button, Divider, Drawer, Group, NumberInput, Select, SegmentedControl, Stack, Switch, Text, TextInput, Textarea, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconArrowRight, IconFileDollar, IconHeartHandshake, IconPlus, IconSparkles, IconTrash } from '@tabler/icons-react'
import { Link } from 'react-router'
import { companies, companyById, contacts, customerByCompany, daysSince, fullName, money, nextOrderDue, owners, partners, products } from '../data/mock'
import { longDate, shortDate } from './ui'

type Line = { productId: string | null; qty: number }

const sources = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'website', label: 'Website' },
  { value: 'visit', label: 'Visit' },
  { value: 'partner', label: 'Partner' },
  { value: 'event', label: 'Event' },
]

const dueOptions = [
  { value: '2026-11-10', label: 'Tomorrow' },
  { value: '2026-11-12', label: 'In 3 days' },
  { value: '2026-11-16', label: 'Next week' },
]

/**
 * The one form that opens every opportunity, for a new account or an existing customer.
 * Who is asking, what they want, how it came in, who owns it, and the first next step.
 */
export function NewInquiryDrawer({ opened, onClose, companyId: preset }: { opened: boolean; onClose: () => void; companyId?: string }) {
  const [companyId, setCompanyId] = useState<string | null>(preset ?? null)
  const [contactId, setContactId] = useState<string | null>(contacts.find((c) => c.companyId === preset)?.id ?? null)
  const [lines, setLines] = useState<Line[]>([{ productId: null, qty: 1 }])
  const [details, setDetails] = useState('')
  const [expected, setExpected] = useState('12 Dec 2026')
  const [source, setSource] = useState('call')
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [nextStep, setNextStep] = useState(customerByCompany(preset) ? 'Confirm quantities against their usual order' : 'Call to confirm quantities and delivery date')
  const [due, setDue] = useState<string | null>('2026-11-10')
  const [quoteNow, setQuoteNow] = useState(false)

  const co = companyById(companyId)
  const cu = customerByCompany(companyId)
  const people = useMemo(() => contacts.filter((c) => c.companyId === companyId), [companyId])
  const estimate = lines.reduce((s, l) => s + (products.find((p) => p.id === l.productId)?.unitPrice ?? 0) * l.qty, 0)
  const owner = ownerId ?? co?.ownerId ?? 'u1'
  const next = cu ? nextOrderDue(cu) : null

  const pick = (id: string | null) => {
    setCompanyId(id)
    const c = companyById(id)
    const first = contacts.find((x) => x.companyId === id)
    setContactId(first?.id ?? null)
    setOwnerId(c?.ownerId ?? null)
    if (customerByCompany(id)) setNextStep('Confirm quantities against their usual order')
  }
  const update = (i: number, patch: Partial<Line>) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)))

  const submit = () => {
    notifications.show({
      title: 'Inquiry created',
      message: `${co?.name} · ${estimate ? money(estimate) : 'value to confirm'} · ${quoteNow ? 'opening a quote' : `next step ${dueOptions.find((d) => d.value === due)?.label.toLowerCase()}`}`,
      color: 'spruce',
    })
    onClose()
  }

  return (
    <Drawer opened={opened} onClose={onClose} position="right" size="lg" title="New inquiry" padding="lg">
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Someone wants to buy something. This puts it on the pipeline at Inquiry and plans the first step.
        </Text>

        <div>
          <Text size="sm" fw={600} mb={6}>
            Who is asking
          </Text>
          <Stack gap="xs">
            <Select
              label="Company"
              placeholder="Search by name"
              searchable
              data={companies.map((c) => ({ value: c.id, label: c.name }))}
              value={companyId}
              onChange={pick}
              nothingFoundMessage="Not found. Press enter to create a new company."
              rightSectionWidth={co ? 110 : undefined}
              rightSection={
                co ? (
                  cu ? (
                    <Badge size="xs" color="teal" variant="light" leftSection={<IconHeartHandshake size={10} />}>
                      Customer
                    </Badge>
                  ) : (
                    <Badge size="xs" color="gray" variant="outline" leftSection={<IconSparkles size={10} />} styles={{ root: { borderColor: '#e3e8e6', color: '#5d6b72' } }}>
                      New account
                    </Badge>
                  )
                ) : undefined
              }
            />
            {cu && (
              <div className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2">
                <Text size="xs" c="teal.9">
                  Customer since {longDate(cu.firstOrderAt)} · {money(cu.revenue12m)} last 12 months · last order {shortDate(cu.lastOrderAt)} ({daysSince(cu.lastOrderAt)} days ago)
                  {next ? ` · usually reorders every ${cu.orderEveryDays} days, next expected ${shortDate(next)}` : ''}
                  {cu.outstanding ? ` · ${money(cu.outstanding)} outstanding` : ''}
                  {cu.overdue ? `, ${money(cu.overdue)} overdue` : ''}
                </Text>
                <Text size="xs" c="teal.9" mt={2}>
                  Buys: {cu.productLines.join(', ')}.{' '}
                  <Link to={`/customers/${cu.id}`} className="font-medium hover:underline">
                    Customer record
                  </Link>
                </Text>
              </div>
            )}
            <Group grow align="flex-end">
              <Select
                label="Contact"
                placeholder={companyId ? 'Who at the company' : 'Pick a company first'}
                disabled={!companyId}
                data={people.map((p) => ({ value: p.id, label: `${fullName(p)} · ${p.title}` }))}
                value={contactId}
                onChange={setContactId}
                searchable
                nothingFoundMessage="Press enter to add a contact"
              />
              <Select label="Owner" data={owners.map((o) => ({ value: o.id, label: o.name }))} value={owner} onChange={setOwnerId} />
            </Group>
          </Stack>
        </div>

        <Divider />

        <div>
          <Group justify="space-between" mb={6}>
            <Text size="sm" fw={600}>
              What they want
            </Text>
            <Text size="xs" c="dimmed">
              Rough is fine. The quote makes it exact.
            </Text>
          </Group>
          <Stack gap={6}>
            {lines.map((l, i) => (
              <Group key={i} gap="xs" wrap="nowrap" align="flex-end">
                <Select
                  className="flex-1"
                  placeholder="Product"
                  searchable
                  data={products.map((p) => ({ value: p.id, label: `${p.name} · ${money(p.unitPrice)} / ${p.unit}` }))}
                  value={l.productId}
                  onChange={(v) => update(i, { productId: v })}
                />
                <NumberInput w={90} min={1} value={l.qty} onChange={(v) => update(i, { qty: Number(v) || 1 })} hideControls placeholder="Qty" />
                <Text size="sm" className="tabular w-[84px] text-right" c={l.productId ? undefined : 'dimmed'}>
                  {l.productId ? money((products.find((p) => p.id === l.productId)?.unitPrice ?? 0) * l.qty) : '—'}
                </Text>
                <ActionIcon variant="subtle" color="gray" aria-label="Remove line" onClick={() => setLines((ls) => (ls.length > 1 ? ls.filter((_, j) => j !== i) : ls))}>
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
            ))}
            <Group justify="space-between">
              <Button variant="subtle" size="compact-xs" leftSection={<IconPlus size={12} />} onClick={() => setLines((ls) => [...ls, { productId: null, qty: 1 }])}>
                Add product
              </Button>
              <Text size="sm" fw={600} className="tabular">
                Estimated {estimate ? money(estimate) : '—'}
              </Text>
            </Group>
            <Textarea placeholder="Details: specs, delivery location, deadline, anything they said" value={details} onChange={(e) => setDetails(e.currentTarget.value)} minRows={2} autosize />
            <Group grow>
              <TextInput label="Expected order date" value={expected} onChange={(e) => setExpected(e.currentTarget.value)} />
              <div>
                <Text size="sm" fw={500} mb={4}>
                  How it came in
                </Text>
                <SegmentedControl fullWidth size="xs" data={sources} value={source} onChange={setSource} />
              </div>
            </Group>
            {source === 'partner' && (
              <Select
                label="Referred by"
                placeholder="Which partner"
                data={partners.map((p) => ({ value: p.id, label: `${companyById(p.companyId)?.name} · ${p.kind}, ${p.commissionRate}%` }))}
                value={partnerId}
                onChange={setPartnerId}
                description={partnerId ? `${money(estimate * ((partners.find((p) => p.id === partnerId)?.commissionRate ?? 0) / 100))} commission if the order is confirmed` : 'Commission is booked when the order is confirmed'}
              />
            )}
          </Stack>
        </div>

        <Divider />

        <div>
          <Text size="sm" fw={600} mb={6}>
            First next step
          </Text>
          <Group gap="xs" align="flex-end" wrap="nowrap">
            <TextInput className="flex-1" leftSection={<IconArrowRight size={14} />} value={nextStep} onChange={(e) => setNextStep(e.currentTarget.value)} disabled={quoteNow} />
            <Select w={140} data={dueOptions} value={due} onChange={setDue} disabled={quoteNow} />
          </Group>
          <Tooltip label="Skips the Inquiry work: the opportunity is created and the quote editor opens, pre-filled with these products." multiline w={260}>
            <Switch size="xs" mt="sm" label="I already know enough. Go straight to a quote." checked={quoteNow} onChange={(e) => setQuoteNow(e.currentTarget.checked)} />
          </Tooltip>
        </div>

        <Group justify="space-between" mt="xs">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Group gap="xs">
            {quoteNow ? (
              <Button leftSection={<IconFileDollar size={16} />} disabled={!companyId} component={Link} to="/quotes" onClick={submit}>
                Create and open quote
              </Button>
            ) : (
              <Button leftSection={<IconPlus size={16} />} disabled={!companyId} onClick={submit}>
                Create inquiry
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Drawer>
  )
}
