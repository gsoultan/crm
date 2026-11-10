import { useState } from 'react'
import { Badge, Button, Chip, Group, Select, Stack, Text, TextInput, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconArrowRight, IconCalendarEvent, IconCheck, IconPlus } from '@tabler/icons-react'
import { Link } from 'react-router'
import { TODAY, nextStepFor, nextStepState, owners, type Activity } from '../data/mock'
import { OwnerAvatar, shortDate } from './ui'

const toneClass = { planned: 'text-spruce-700', today: 'text-amber-700', overdue: 'text-red-600', none: 'text-amber-700' } as const

export function dueText(a: Activity) {
  const due = a.type === 'task' ? a.dueAt! : a.at.slice(0, 10)
  const state = nextStepState(a)
  if (state === 'overdue') return `${Math.round((new Date(TODAY).getTime() - new Date(due).getTime()) / 86400000)}d overdue`
  if (state === 'today') return a.type === 'meeting' ? `today ${a.at.slice(11, 16)}` : 'today'
  return due === '2026-11-10' ? 'tomorrow' : shortDate(due)
}

/**
 * The one line every deal, contact and company carries: what happens next, when, and who owns it.
 * Reads the earliest open task or upcoming meeting linked to the record.
 */
export function NextStep({
  dealId,
  companyId,
  contactId,
  size = 'sm',
  label = true,
  onPlan,
}: {
  dealId?: string
  companyId?: string
  contactId?: string
  size?: 'xs' | 'sm'
  label?: boolean
  onPlan?: () => void
}) {
  const a = nextStepFor({ dealId, companyId, contactId })
  const xs = size === 'xs'
  const plan = onPlan ?? (() => openWhatsNext({ dealId, companyId, contactId }))

  if (!a) {
    return (
      <Group gap={6} wrap="nowrap" className={toneClass.none}>
        {label && !xs && (
          <Text size="xs" c="dimmed" className="w-[68px] shrink-0">
            Next step
          </Text>
        )}
        <span className={`inline-block size-1.5 shrink-0 rounded-full bg-amber-signal`} />
        <Text size={xs ? 'xs' : 'sm'} className="text-amber-700">
          No next step
        </Text>
        <Button
          size="compact-xs"
          variant="subtle"
          color="amber"
          px={6}
          onClick={(e) => {
            e.stopPropagation()
            plan()
          }}
        >
          Plan
        </Button>
      </Group>
    )
  }

  const state = nextStepState(a)
  const Icon = a.type === 'meeting' ? IconCalendarEvent : IconArrowRight
  return (
    <Group gap={6} wrap="nowrap" className="min-w-0">
      {label && !xs && (
        <Text size="xs" c="dimmed" className="w-[68px] shrink-0">
          Next step
        </Text>
      )}
      <Icon size={xs ? 12 : 14} className={`shrink-0 ${toneClass[state]}`} />
      <Tooltip label={`${a.type === 'meeting' ? 'Meeting' : 'Task'} · ${owners.find((o) => o.id === a.ownerId)?.name}`} openDelay={400}>
        <Link to="/activities" className={`truncate ${xs ? 'text-[12px]' : 'text-[13.5px] font-medium'} hover:underline`} onClick={(e) => e.stopPropagation()}>
          {a.subject}
        </Link>
      </Tooltip>
      <Text size="xs" className={`shrink-0 whitespace-nowrap ${toneClass[state]}`}>
        · {dueText(a)}
      </Text>
      {!xs && <OwnerAvatar id={a.ownerId} size={18} />}
    </Group>
  )
}

const suggestionsByStage: Record<string, string[]> = {
  s1: ['Call to confirm quantities and delivery date', 'Send catalogue and price list', 'Check stock and lead time'],
  s2: ['Follow up on the quote in 3 days', 'Offer a sample', 'Ask for the decision date'],
  s3: ['Send the revised quote', 'Agree payment terms and delivery', 'Ask for the PO'],
  done: ['Send a recap email', 'Book the next meeting', 'Check in next week'],
}

const dueOptions = [
  { value: '2026-11-10', label: 'Tomorrow' },
  { value: '2026-11-12', label: 'In 3 days' },
  { value: '2026-11-16', label: 'Next week' },
  { value: '2026-11-23', label: 'In two weeks' },
]

function WhatsNextForm({ reason, stageId, dealId, ownerId, onDone }: { reason: string; stageId?: string; dealId?: string; ownerId?: string; onDone: () => void }) {
  const [text, setText] = useState('')
  const [due, setDue] = useState<string | null>(stageId === 's3' ? '2026-11-10' : '2026-11-12')
  const [who, setWho] = useState<string | null>(ownerId ?? 'u1')
  const suggestions = suggestionsByStage[stageId ?? 'done'] ?? suggestionsByStage.done
  return (
    <Stack gap="sm">
      <Text size="sm" c="dimmed">
        {reason}
      </Text>
      <Group gap={6}>
        {suggestions.map((s) => (
          <Chip key={s} size="xs" checked={text === s} onChange={() => setText(s)} variant="light" color="spruce">
            {s}
          </Chip>
        ))}
      </Group>
      <TextInput value={text} onChange={(e) => setText(e.currentTarget.value)} placeholder="Or write your own" leftSection={<IconArrowRight size={14} />} data-autofocus />
      <Group grow>
        <Select label="Due" data={dueOptions} value={due} onChange={setDue} />
        <Select label="Owner" data={owners.map((o) => ({ value: o.id, label: o.name }))} value={who} onChange={setWho} />
      </Group>
      <Group justify="space-between" mt="xs">
        <Button
          variant="subtle"
          color="gray"
          size="xs"
          onClick={() => {
            onDone()
            notifications.show({ message: 'No next step planned. The deal will show as stalled until one is added.', color: 'amber' })
          }}
        >
          Skip for now
        </Button>
        <Button
          size="sm"
          leftSection={<IconCheck size={14} />}
          disabled={!text}
          onClick={() => {
            onDone()
            notifications.show({ message: `Task "${text}" due ${dueOptions.find((d) => d.value === due)?.label.toLowerCase()}${dealId ? ', linked to the deal' : ''}`, color: 'spruce' })
          }}
        >
          Plan it
        </Button>
      </Group>
    </Stack>
  )
}

/**
 * The "What's next?" prompt. Opened after a stage change, after completing a task from a deal,
 * or from any "Plan" button on a record with no next step.
 */
export function openWhatsNext({ reason, stageId, dealId, companyId, contactId, ownerId }: { reason?: string; stageId?: string; dealId?: string; companyId?: string; contactId?: string; ownerId?: string }) {
  const id = modals.open({
    title: (
      <Group gap="xs">
        <Badge color="amber" variant="light" size="sm" leftSection={<IconPlus size={10} />}>
          Next step
        </Badge>
        <Text fw={600}>What's next?</Text>
      </Group>
    ),
    size: 'md',
    children: (
      <WhatsNextForm
        reason={reason ?? (dealId ? 'Every open deal should have one planned task or meeting. Pick a suggestion or write your own.' : companyId || contactId ? 'Plan the next touch so this record does not go quiet.' : 'Plan what happens next.')}
        stageId={stageId}
        dealId={dealId}
        ownerId={ownerId}
        onDone={() => modals.close(id)}
      />
    ),
  })
}
