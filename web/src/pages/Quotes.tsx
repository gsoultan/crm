import { useState } from 'react'
import { ActionIcon, Badge, Button, Group, NumberInput, Paper, Select, Table, Text, Title, Divider, Anchor, type MantineColor } from '@mantine/core'
import { IconPlus, IconSend, IconTrash, IconFileTypePdf, IconArrowLeft } from '@tabler/icons-react'
import { Link } from 'react-router'
import { notifications } from '@mantine/notifications'
import { companyById, contactById, dealById, fullName, money, productById, products, quoteTotals, quotes as seed, type Quote, type QuoteLine } from '../data/mock'
import { PageHeader, shortDate } from '../components/ui'

const statusColor: Record<Quote['status'], MantineColor> = { Draft: 'gray', Sent: 'blue', Accepted: 'spruce', Expired: 'red' }

export default function Quotes() {
  const [editing, setEditing] = useState<Quote | null>(null)
  if (editing) return <QuoteEditor quote={editing} onBack={() => setEditing(null)} />

  return (
    <>
      <PageHeader
        title="Quotes"
        subtitle="Price a deal from the product catalog, send it as a PDF, and track when it is accepted."
        actions={<Button leftSection={<IconPlus size={16} />} onClick={() => setEditing({ ...seed[1], id: 'new', number: 'Q-2026-043', status: 'Draft', lines: [] })}>New quote</Button>}
      />
      <Paper>
        <Table.ScrollContainer minWidth={780}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Quote</Table.Th>
                <Table.Th>Deal</Table.Th>
                <Table.Th>Company</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Valid until</Table.Th>
                <Table.Th ta="right">Total</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {seed.map((q) => {
                const d = dealById(q.dealId)
                return (
                  <Table.Tr key={q.id} className="cursor-pointer" onClick={() => setEditing(q)}>
                    <Table.Td>
                      <Text size="sm" fw={500} className="tabular">
                        {q.number}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{d?.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {companyById(d?.companyId ?? null)?.name}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={statusColor[q.status]}>{q.status}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c={q.status === 'Expired' ? 'red' : 'dimmed'}>
                        {shortDate(q.validUntil)}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text size="sm" fw={500} className="tabular">
                        {money(quoteTotals(q).total)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </>
  )
}

function QuoteEditor({ quote, onBack }: { quote: Quote; onBack: () => void }) {
  const [lines, setLines] = useState<QuoteLine[]>(quote.lines)
  const [taxRate, setTaxRate] = useState(quote.taxRate)
  const d = dealById(quote.dealId)
  const co = companyById(d?.companyId ?? null)
  const c = contactById(d?.contactId)
  const totals = quoteTotals({ ...quote, lines, taxRate })
  const update = (i: number, patch: Partial<QuoteLine>) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)))
  const unused = products.filter((p) => !lines.some((l) => l.productId === p.id))

  return (
    <>
      <Button variant="subtle" color="gray" size="xs" leftSection={<IconArrowLeft size={14} />} onClick={onBack} mb="sm" px={4}>
        All quotes
      </Button>
      <PageHeader
        title={quote.number}
        subtitle={
          <>
            For{' '}
            <Anchor component={Link} to={`/pipeline?deal=${d?.id}`} size="sm">
              {d?.name}
            </Anchor>{' '}
            · {co?.name}
          </>
        }
        actions={
          <>
            <Badge color={statusColor[quote.status]} size="lg">
              {quote.status}
            </Badge>
            <Button variant="default" leftSection={<IconFileTypePdf size={16} />}>
              Preview PDF
            </Button>
            <Button leftSection={<IconSend size={16} />} onClick={() => notifications.show({ title: 'Quote sent', message: `${quote.number} emailed to ${c ? fullName(c) : 'the contact'}.`, color: 'spruce' })}>
              Send to {c?.firstName ?? 'contact'}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Paper>
          <Table.ScrollContainer minWidth={640}>
            <Table verticalSpacing="xs">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th w={100} ta="right">
                    Unit price
                  </Table.Th>
                  <Table.Th w={90}>Qty</Table.Th>
                  <Table.Th w={100}>Discount</Table.Th>
                  <Table.Th w={110} ta="right">
                    Line total
                  </Table.Th>
                  <Table.Th w={40} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {lines.map((l, i) => {
                  const p = productById(l.productId)
                  const lineTotal = p.unitPrice * l.qty * (1 - l.discount / 100)
                  return (
                    <Table.Tr key={p.id}>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {p.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {p.sku} · per {p.unit}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="sm" className="tabular">
                          {money(p.unitPrice)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <NumberInput size="xs" min={1} value={l.qty} onChange={(v) => update(i, { qty: Number(v) || 1 })} hideControls />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput size="xs" min={0} max={100} value={l.discount} onChange={(v) => update(i, { discount: Number(v) || 0 })} suffix="%" hideControls />
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="sm" fw={500} className="tabular">
                          {money(lineTotal)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon variant="subtle" color="gray" aria-label="Remove line" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}>
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Select
                      placeholder={lines.length ? 'Add another product' : 'Add a product from the catalog'}
                      data={unused.map((p) => ({ value: p.id, label: `${p.name} · ${money(p.unitPrice)}` }))}
                      value={null}
                      onChange={(v) => v && setLines((ls) => [...ls, { productId: v, qty: 1, discount: 0 }])}
                      leftSection={<IconPlus size={14} />}
                      variant="unstyled"
                      searchable
                      disabled={unused.length === 0}
                    />
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>

        <div className="flex flex-col gap-4">
          <Paper p="md">
            <Title order={3} mb="sm">
              Summary
            </Title>
            <div className="flex flex-col gap-2 text-[14px]">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="tabular">{money(totals.subtotal, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Tax</span>
                <Group gap={6}>
                  <NumberInput size="xs" w={70} value={taxRate} onChange={(v) => setTaxRate(Number(v) || 0)} suffix="%" hideControls />
                  <span className="tabular w-20 text-right">{money(totals.tax, { maximumFractionDigits: 2 })}</span>
                </Group>
              </div>
              <Divider my={4} />
              <div className="flex justify-between text-[16px] font-semibold">
                <span>Total</span>
                <span className="tabular">{money(totals.total, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </Paper>
          <Paper p="md">
            <Title order={3} mb="sm">
              Terms
            </Title>
            <Select label="Valid until" data={['30 days', '45 days', '60 days']} defaultValue="30 days" mb="sm" />
            <Select label="Payment" data={['Net 30', 'Net 14', 'On signature']} defaultValue="Net 30" mb="sm" />
            <Select label="Currency" data={['USD', 'EUR', 'IDR', 'SGD']} defaultValue="USD" />
          </Paper>
        </div>
      </div>
    </>
  )
}
