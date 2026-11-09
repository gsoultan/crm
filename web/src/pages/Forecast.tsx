import { Group, Paper, Progress, SegmentedControl, Select, Table, Text, Title, Tooltip } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import { deals, forecastByMonth, money, moneyShort, owners, stageById } from '../data/mock'
import { OwnerAvatar, PageHeader, Stat } from '../components/ui'

export default function Forecast() {
  const open = deals.filter((d) => stageById(d.stageId).kind === 'open')
  const won = deals.filter((d) => d.stageId === 's5').reduce((s, d) => s + d.amount, 0)
  const commit = open.filter((d) => stageById(d.stageId).probability >= 80).reduce((s, d) => s + d.amount, 0)
  const bestCase = open.filter((d) => stageById(d.stageId).probability >= 60).reduce((s, d) => s + d.amount, 0)
  const pipeline = open.reduce((s, d) => s + d.amount, 0)
  const quota = 340000

  const reps = owners.map((o) => {
    const mine = deals.filter((d) => d.ownerId === o.id)
    const w = mine.filter((d) => d.stageId === 's5').reduce((s, d) => s + d.amount, 0)
    const cm = mine.filter((d) => stageById(d.stageId).probability >= 80).reduce((s, d) => s + d.amount, 0)
    const bc = mine.filter((d) => stageById(d.stageId).kind === 'open' && stageById(d.stageId).probability >= 60).reduce((s, d) => s + d.amount, 0)
    const pl = mine.filter((d) => stageById(d.stageId).kind === 'open').reduce((s, d) => s + d.amount, 0)
    return { o, won: w, commit: cm, bestCase: bc, pipeline: pl, quota: 85000 }
  })

  return (
    <>
      <PageHeader
        title="Forecast"
        subtitle="Q4 2026 · Commit is deals in Negotiation or later. Best case adds Proposal."
        actions={
          <>
            <Select data={['Q4 2026', 'Q3 2026']} defaultValue="Q4 2026" w={130} />
            <SegmentedControl size="xs" data={['Team', 'Mine']} />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Won" value={money(won)} hint={`${Math.round((won / quota) * 100)}% of ${moneyShort(quota)} quota`} tone="good" />
        <Stat label="Commit" value={money(won + commit)} hint={`Won + ${moneyShort(commit)} in Negotiation`} />
        <Stat label="Best case" value={money(won + bestCase)} hint={`Adds ${moneyShort(bestCase - commit)} in Proposal`} />
        <Stat label="Gap to quota" value={money(Math.max(quota - won - commit, 0))} hint="After commit · needs 2 more Proposal deals" tone="warn" />
      </div>

      <Paper p="lg" mt="md">
        <Group justify="space-between" mb="xs">
          <Title order={3}>Quarter progress</Title>
          <Text size="sm" c="dimmed" className="tabular">
            Quota {money(quota)}
          </Text>
        </Group>
        <Tooltip.Group openDelay={200}>
          <Progress.Root size={22} radius="sm">
            <Tooltip label={`Won ${money(won)}`}>
              <Progress.Section value={(won / quota) * 100} color="spruce.7" />
            </Tooltip>
            <Tooltip label={`Commit ${money(commit)}`}>
              <Progress.Section value={(commit / quota) * 100} color="spruce.4" />
            </Tooltip>
            <Tooltip label={`Best case ${money(bestCase - commit)}`}>
              <Progress.Section value={((bestCase - commit) / quota) * 100} color="spruce.2" />
            </Tooltip>
          </Progress.Root>
        </Tooltip.Group>
        <Group gap="lg" mt="sm">
          {[
            ['bg-spruce-700', 'Won'],
            ['bg-spruce-500', 'Commit'],
            ['bg-spruce-100', 'Best case'],
            ['bg-line', 'Remaining'],
          ].map(([c, l]) => (
            <Text key={l} size="xs" c="dimmed" className="flex items-center gap-1.5">
              <span className={`inline-block size-2.5 rounded-sm ${c}`} /> {l}
            </Text>
          ))}
        </Group>
      </Paper>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Paper p="lg" className="lg:col-span-3">
          <Title order={3} mb={2}>
            Won against quota by month
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            November and December show commit on top of what is already won.
          </Text>
          <BarChart
            h={240}
            data={forecastByMonth}
            dataKey="month"
            type="stacked"
            series={[
              { name: 'won', label: 'Won', color: 'spruce.7' },
              { name: 'commit', label: 'Commit', color: 'spruce.3' },
            ]}
            valueFormatter={(v) => moneyShort(v)}
            referenceLines={[{ y: 170000, label: 'Monthly quota', color: 'gray.5' }]}
            gridAxis="y"
            withLegend
            legendProps={{ verticalAlign: 'bottom', height: 28 }}
            barProps={{ radius: 3 }}
          />
        </Paper>

        <Paper className="lg:col-span-2">
          <Title order={3} p="lg" pb="sm">
            By rep
          </Title>
          <Table verticalSpacing="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Rep</Table.Th>
                <Table.Th ta="right">Won</Table.Th>
                <Table.Th ta="right">Commit</Table.Th>
                <Table.Th ta="right">Pipeline</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {reps.map((r) => (
                <Table.Tr key={r.o.id}>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <OwnerAvatar id={r.o.id} size={24} />
                      <div>
                        <Text size="sm" fw={500}>
                          {r.o.name}
                        </Text>
                        <Progress value={((r.won + r.commit) / r.quota) * 100} size={4} color="spruce.6" w={90} mt={3} />
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" className="tabular" fw={500}>
                      {moneyShort(r.won)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" className="tabular">
                      {moneyShort(r.commit)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" className="tabular" c="dimmed">
                      {moneyShort(r.pipeline)}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Text size="xs" c="dimmed" px="lg" py="sm">
            Bars show won plus commit against each rep's {moneyShort(85000)} quota. Total pipeline {money(pipeline)}.
          </Text>
        </Paper>
      </div>
    </>
  )
}
