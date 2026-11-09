import type { ReactNode } from 'react'
import { Avatar, Badge, DataList, Group, Text, Title, Tooltip, type MantineColor } from '@mantine/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ownerById, type Lifecycle } from '../data/mock'

dayjs.extend(relativeTime)

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <Title order={1}>{title}</Title>
        {subtitle && (
          <Text c="dimmed" size="sm" mt={4}>
            {subtitle}
          </Text>
        )}
      </div>
      {actions && <Group gap="xs">{actions}</Group>}
    </div>
  )
}

export function OwnerAvatar({ id, size = 26 }: { id: string | null; size?: number }) {
  const o = ownerById(id)
  if (!o)
    return (
      <Tooltip label="Unassigned">
        <Avatar size={size} radius="xl" color="gray" variant="light">
          ?
        </Avatar>
      </Tooltip>
    )
  return (
    <Tooltip label={o.name}>
      <Avatar size={size} radius="xl" color={o.color} variant="light" styles={{ placeholder: { fontSize: size * 0.4, fontWeight: 600 } }}>
        {o.initials}
      </Avatar>
    </Tooltip>
  )
}

export function ContactAvatar({ name, size = 30, color = 'spruce' }: { name: string; size?: number; color?: MantineColor }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <Avatar size={size} radius="xl" color={color} variant="light" styles={{ placeholder: { fontSize: size * 0.38, fontWeight: 600 } }}>
      {initials}
    </Avatar>
  )
}

const lifecycleColor: Record<Lifecycle, MantineColor> = {
  Lead: 'gray',
  Qualified: 'blue',
  Customer: 'spruce',
  Churned: 'red',
}

export function LifecycleBadge({ stage }: { stage: Lifecycle }) {
  return <Badge color={lifecycleColor[stage]}>{stage}</Badge>
}

export function HealthDot({ health }: { health: 'on track' | 'at risk' | 'stalled' }) {
  const color = health === 'on track' ? 'bg-spruce-500' : health === 'at risk' ? 'bg-amber-signal' : 'bg-red-500'
  return (
    <Tooltip label={health[0].toUpperCase() + health.slice(1)}>
      <span className={`inline-block size-2 rounded-full ${color}`} />
    </Tooltip>
  )
}

export function ScoreBar({ score }: { score: number }) {
  const tone = score >= 70 ? 'bg-spruce-600' : score >= 40 ? 'bg-amber-signal' : 'bg-gray-400'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${score}%` }} />
      </div>
      <span className="tabular text-[13px] text-muted">{score}</span>
    </div>
  )
}

export const relative = (iso: string) => dayjs(iso).fromNow()
export const shortDate = (iso: string) => dayjs(iso).format('D MMM')
export const longDate = (iso: string) => dayjs(iso).format('D MMM YYYY')
export const dateTime = (iso: string) => dayjs(iso).format('D MMM, HH:mm')

export function Stat({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: 'good' | 'warn' | 'bad' }) {
  const hintColor = tone === 'good' ? 'text-spruce-600' : tone === 'warn' ? 'text-amber-signal' : tone === 'bad' ? 'text-red-600' : 'text-muted'
  return (
    <div className="rounded-lg border border-line bg-white px-4 py-3.5">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <div className="tabular mt-1 text-[24px] leading-none font-semibold">{value}</div>
      {hint && <div className={`mt-2 text-[12.5px] ${hintColor}`}>{hint}</div>}
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <DataList.Item>
      <DataList.ItemLabel>{label}</DataList.ItemLabel>
      <DataList.ItemValue>{children}</DataList.ItemValue>
    </DataList.Item>
  )
}
