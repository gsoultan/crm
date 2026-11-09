export type Owner = { id: string; name: string; initials: string; color: string }

export const owners: Owner[] = [
  { id: 'u1', name: 'Gembit S.', initials: 'GS', color: 'spruce' },
  { id: 'u2', name: 'Maya Rahmani', initials: 'MR', color: 'indigo' },
  { id: 'u3', name: 'Dion Pratama', initials: 'DP', color: 'grape' },
  { id: 'u4', name: 'Lena Fischer', initials: 'LF', color: 'teal' },
]

export type Company = {
  id: string
  name: string
  domain: string
  industry: string
  size: string
  city: string
  ownerId: string
  openDeals: number
  pipelineValue: number
  lastActivity: string
}

export const companies: Company[] = [
  { id: 'c1', name: 'Northwind Logistics', domain: 'northwind.co', industry: 'Logistics', size: '200–500', city: 'Rotterdam', ownerId: 'u1', openDeals: 2, pipelineValue: 86000, lastActivity: '2026-11-08' },
  { id: 'c2', name: 'Harbor & Vale', domain: 'harborvale.com', industry: 'Professional services', size: '50–200', city: 'Lisbon', ownerId: 'u2', openDeals: 1, pipelineValue: 24000, lastActivity: '2026-11-07' },
  { id: 'c3', name: 'Kinara Health', domain: 'kinarahealth.id', industry: 'Healthcare', size: '500–1000', city: 'Jakarta', ownerId: 'u3', openDeals: 3, pipelineValue: 142000, lastActivity: '2026-11-09' },
  { id: 'c4', name: 'Bluefin Marine', domain: 'bluefin.sg', industry: 'Manufacturing', size: '200–500', city: 'Singapore', ownerId: 'u1', openDeals: 1, pipelineValue: 58000, lastActivity: '2026-11-04' },
  { id: 'c5', name: 'Oakline Property', domain: 'oakline.com.au', industry: 'Real estate', size: '10–50', city: 'Melbourne', ownerId: 'u4', openDeals: 1, pipelineValue: 12500, lastActivity: '2026-11-02' },
  { id: 'c6', name: 'Terra Agro Group', domain: 'terraagro.com', industry: 'Agriculture', size: '1000+', city: 'Surabaya', ownerId: 'u3', openDeals: 0, pipelineValue: 0, lastActivity: '2026-10-21' },
  { id: 'c7', name: 'Pinecrest Schools', domain: 'pinecrest.edu', industry: 'Education', size: '200–500', city: 'Auckland', ownerId: 'u2', openDeals: 1, pipelineValue: 31000, lastActivity: '2026-11-06' },
  { id: 'c8', name: 'Solstice Energy', domain: 'solstice.energy', industry: 'Energy', size: '50–200', city: 'Perth', ownerId: 'u4', openDeals: 2, pipelineValue: 97000, lastActivity: '2026-11-08' },
]

export type Lifecycle = 'Lead' | 'Qualified' | 'Customer' | 'Churned'

export type Contact = {
  id: string
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  companyId: string | null
  lifecycle: Lifecycle
  ownerId: string
  tags: string[]
  score: number
  lastActivity: string
  consent: 'Opted in' | 'Not asked' | 'Opted out'
}

export const contacts: Contact[] = [
  { id: 'p1', firstName: 'Sofie', lastName: 'de Vries', title: 'Head of Operations', email: 'sofie@northwind.co', phone: '+31 10 555 0142', companyId: 'c1', lifecycle: 'Customer', ownerId: 'u1', tags: ['Decision maker'], score: 86, lastActivity: '2026-11-08', consent: 'Opted in' },
  { id: 'p2', firstName: 'Rui', lastName: 'Carvalho', title: 'Managing Partner', email: 'rui@harborvale.com', phone: '+351 21 555 0199', companyId: 'c2', lifecycle: 'Qualified', ownerId: 'u2', tags: ['Champion'], score: 72, lastActivity: '2026-11-07', consent: 'Opted in' },
  { id: 'p3', firstName: 'Anindya', lastName: 'Putri', title: 'Procurement Director', email: 'anindya@kinarahealth.id', phone: '+62 21 555 0123', companyId: 'c3', lifecycle: 'Customer', ownerId: 'u3', tags: ['Decision maker', 'Renewal Q1'], score: 91, lastActivity: '2026-11-09', consent: 'Opted in' },
  { id: 'p4', firstName: 'Wei', lastName: 'Tan', title: 'Plant Manager', email: 'wei.tan@bluefin.sg', phone: '+65 6555 0177', companyId: 'c4', lifecycle: 'Qualified', ownerId: 'u1', tags: [], score: 58, lastActivity: '2026-11-04', consent: 'Not asked' },
  { id: 'p5', firstName: 'Grace', lastName: 'Whitfield', title: 'Director', email: 'grace@oakline.com.au', phone: '+61 3 5550 1188', companyId: 'c5', lifecycle: 'Lead', ownerId: 'u4', tags: ['Webinar Oct'], score: 34, lastActivity: '2026-11-02', consent: 'Opted in' },
  { id: 'p6', firstName: 'Bagus', lastName: 'Santoso', title: 'IT Manager', email: 'bagus@terraagro.com', phone: '+62 31 555 0164', companyId: 'c6', lifecycle: 'Churned', ownerId: 'u3', tags: [], score: 12, lastActivity: '2026-10-21', consent: 'Opted out' },
  { id: 'p7', firstName: 'Hana', lastName: 'Kimura', title: 'Principal', email: 'hana@pinecrest.edu', phone: '+64 9 555 0135', companyId: 'c7', lifecycle: 'Qualified', ownerId: 'u2', tags: ['Champion'], score: 67, lastActivity: '2026-11-06', consent: 'Opted in' },
  { id: 'p8', firstName: 'Tom', lastName: 'Barlow', title: 'CFO', email: 'tom@solstice.energy', phone: '+61 8 5550 1102', companyId: 'c8', lifecycle: 'Customer', ownerId: 'u4', tags: ['Decision maker'], score: 79, lastActivity: '2026-11-08', consent: 'Opted in' },
  { id: 'p9', firstName: 'Priya', lastName: 'Nair', title: 'Sustainability Lead', email: 'priya@solstice.energy', phone: '+61 8 5550 1109', companyId: 'c8', lifecycle: 'Qualified', ownerId: 'u4', tags: [], score: 61, lastActivity: '2026-11-05', consent: 'Opted in' },
  { id: 'p10', firstName: 'Marco', lastName: 'Bellini', title: 'Founder', email: 'marco@bellini.studio', phone: '+39 02 555 0150', companyId: null, lifecycle: 'Lead', ownerId: 'u2', tags: ['Inbound'], score: 41, lastActivity: '2026-11-03', consent: 'Opted in' },
  { id: 'p11', firstName: 'Dewi', lastName: 'Lestari', title: 'Finance Manager', email: 'dewi@kinarahealth.id', phone: '+62 21 555 0129', companyId: 'c3', lifecycle: 'Customer', ownerId: 'u3', tags: [], score: 55, lastActivity: '2026-11-01', consent: 'Opted in' },
  { id: 'p12', firstName: 'Jonas', lastName: 'Eriksen', title: 'Logistics Coordinator', email: 'jonas@northwind.co', phone: '+31 10 555 0148', companyId: 'c1', lifecycle: 'Customer', ownerId: 'u1', tags: [], score: 48, lastActivity: '2026-10-30', consent: 'Not asked' },
]

export type ActivityType = 'note' | 'call' | 'email' | 'meeting' | 'task' | 'stage'

export type Activity = {
  id: string
  type: ActivityType
  subject: string
  body?: string
  at: string
  contactId?: string
  companyId?: string
  dealId?: string
  ownerId: string
  done?: boolean
  dueAt?: string
}

export const activities: Activity[] = [
  { id: 'a1', type: 'meeting', subject: 'Renewal planning call', body: 'Agreed to expand to 3 more clinics in Q1. Anindya wants volume pricing before 20 Nov.', at: '2026-11-09T09:30:00', contactId: 'p3', companyId: 'c3', dealId: 'd3', ownerId: 'u3' },
  { id: 'a2', type: 'email', subject: 'Sent revised proposal v2', body: 'Attached updated SOW and pricing for the Rotterdam hub.', at: '2026-11-08T16:10:00', contactId: 'p1', companyId: 'c1', dealId: 'd1', ownerId: 'u1' },
  { id: 'a3', type: 'call', subject: 'Discovery call with Tom', body: 'Budget confirmed for FY27. Needs board sign-off in December.', at: '2026-11-08T11:00:00', contactId: 'p8', companyId: 'c8', dealId: 'd7', ownerId: 'u4' },
  { id: 'a4', type: 'stage', subject: 'Moved to Proposal', at: '2026-11-07T15:40:00', companyId: 'c2', dealId: 'd2', ownerId: 'u2' },
  { id: 'a5', type: 'note', subject: 'Competitor mentioned', body: 'Rui said they are also looking at a local vendor. Price-sensitive but values support.', at: '2026-11-07T14:20:00', contactId: 'p2', companyId: 'c2', dealId: 'd2', ownerId: 'u2' },
  { id: 'a6', type: 'task', subject: 'Send volume pricing to Kinara', at: '2026-11-09T09:45:00', dueAt: '2026-11-12', contactId: 'p3', companyId: 'c3', dealId: 'd3', ownerId: 'u3', done: false },
  { id: 'a7', type: 'task', subject: 'Follow up on proposal v2', at: '2026-11-08T16:15:00', dueAt: '2026-11-11', contactId: 'p1', companyId: 'c1', dealId: 'd1', ownerId: 'u1', done: false },
  { id: 'a8', type: 'task', subject: 'Book site visit at Bluefin', at: '2026-11-04T10:00:00', dueAt: '2026-11-09', contactId: 'p4', companyId: 'c4', dealId: 'd4', ownerId: 'u1', done: false },
  { id: 'a9', type: 'task', subject: 'Prepare webinar follow-up list', at: '2026-11-02T13:00:00', dueAt: '2026-11-10', ownerId: 'u4', done: true },
  { id: 'a10', type: 'email', subject: 'Intro from Hana', body: 'Hana introduced us to the board chair. Meeting requested for late November.', at: '2026-11-06T08:50:00', contactId: 'p7', companyId: 'c7', dealId: 'd6', ownerId: 'u2' },
  { id: 'a11', type: 'call', subject: 'Left voicemail', at: '2026-11-05T17:05:00', contactId: 'p9', companyId: 'c8', ownerId: 'u4' },
  { id: 'a12', type: 'note', subject: 'Inbound from pricing page', body: 'Filled the demo form. Studio of 12 people, wants to replace a spreadsheet.', at: '2026-11-03T10:12:00', contactId: 'p10', ownerId: 'u2' },
  { id: 'a13', type: 'task', subject: 'Call Grace about webinar questions', at: '2026-11-02T15:30:00', dueAt: '2026-11-08', contactId: 'p5', companyId: 'c5', ownerId: 'u4', done: false },
]

export type Stage = { id: string; name: string; probability: number; kind: 'open' | 'won' | 'lost' }

export const stages: Stage[] = [
  { id: 's1', name: 'Qualified', probability: 20, kind: 'open' },
  { id: 's2', name: 'Discovery', probability: 40, kind: 'open' },
  { id: 's3', name: 'Proposal', probability: 60, kind: 'open' },
  { id: 's4', name: 'Negotiation', probability: 80, kind: 'open' },
  { id: 's5', name: 'Won', probability: 100, kind: 'won' },
]

export type Deal = {
  id: string
  name: string
  companyId: string
  contactId: string
  amount: number
  stageId: string
  closeDate: string
  ownerId: string
  daysInStage: number
  health: 'on track' | 'at risk' | 'stalled'
}

export const deals: Deal[] = [
  { id: 'd1', name: 'Rotterdam hub rollout', companyId: 'c1', contactId: 'p1', amount: 62000, stageId: 's4', closeDate: '2026-11-28', ownerId: 'u1', daysInStage: 6, health: 'on track' },
  { id: 'd8', name: 'Driver app add-on', companyId: 'c1', contactId: 'p12', amount: 24000, stageId: 's2', closeDate: '2026-12-19', ownerId: 'u1', daysInStage: 12, health: 'on track' },
  { id: 'd2', name: 'Advisory team seats', companyId: 'c2', contactId: 'p2', amount: 24000, stageId: 's3', closeDate: '2026-12-05', ownerId: 'u2', daysInStage: 2, health: 'at risk' },
  { id: 'd3', name: 'Clinic network expansion', companyId: 'c3', contactId: 'p3', amount: 98000, stageId: 's4', closeDate: '2026-11-21', ownerId: 'u3', daysInStage: 9, health: 'on track' },
  { id: 'd9', name: 'Patient intake forms', companyId: 'c3', contactId: 'p11', amount: 26000, stageId: 's1', closeDate: '2027-01-15', ownerId: 'u3', daysInStage: 4, health: 'on track' },
  { id: 'd10', name: 'Finance integration', companyId: 'c3', contactId: 'p11', amount: 18000, stageId: 's2', closeDate: '2027-01-30', ownerId: 'u3', daysInStage: 21, health: 'stalled' },
  { id: 'd4', name: 'Plant maintenance pilot', companyId: 'c4', contactId: 'p4', amount: 58000, stageId: 's2', closeDate: '2026-12-12', ownerId: 'u1', daysInStage: 18, health: 'stalled' },
  { id: 'd5', name: 'Agent onboarding', companyId: 'c5', contactId: 'p5', amount: 12500, stageId: 's1', closeDate: '2026-12-20', ownerId: 'u4', daysInStage: 7, health: 'on track' },
  { id: 'd6', name: 'Campus-wide licence', companyId: 'c7', contactId: 'p7', amount: 31000, stageId: 's3', closeDate: '2026-12-15', ownerId: 'u2', daysInStage: 5, health: 'on track' },
  { id: 'd7', name: 'FY27 platform agreement', companyId: 'c8', contactId: 'p8', amount: 75000, stageId: 's3', closeDate: '2026-12-22', ownerId: 'u4', daysInStage: 3, health: 'on track' },
  { id: 'd11', name: 'Reporting module', companyId: 'c8', contactId: 'p9', amount: 22000, stageId: 's1', closeDate: '2027-02-10', ownerId: 'u4', daysInStage: 10, health: 'at risk' },
  { id: 'd12', name: 'Q3 fleet telematics', companyId: 'c1', contactId: 'p1', amount: 44000, stageId: 's5', closeDate: '2026-10-28', ownerId: 'u1', daysInStage: 12, health: 'on track' },
  { id: 'd13', name: 'Pharmacy module', companyId: 'c3', contactId: 'p3', amount: 36000, stageId: 's5', closeDate: '2026-10-15', ownerId: 'u3', daysInStage: 25, health: 'on track' },
]

export type Lead = {
  id: string
  name: string
  company: string
  email: string
  source: 'Web form' | 'Webinar' | 'Referral' | 'Partner' | 'Import' | 'LinkedIn'
  status: 'New' | 'Contacted' | 'Qualified' | 'Unqualified'
  score: number
  ownerId: string | null
  createdAt: string
  fit: number
  engagement: number
}

export const leads: Lead[] = [
  { id: 'l1', name: 'Marco Bellini', company: 'Bellini Studio', email: 'marco@bellini.studio', source: 'Web form', status: 'New', score: 41, ownerId: null, createdAt: '2026-11-09T08:12:00', fit: 20, engagement: 21 },
  { id: 'l2', name: 'Chloe Martin', company: 'Marin & Co Accounting', email: 'chloe@marinco.fr', source: 'Webinar', status: 'New', score: 63, ownerId: null, createdAt: '2026-11-09T07:40:00', fit: 35, engagement: 28 },
  { id: 'l3', name: 'Arif Hidayat', company: 'Sentosa Logistics', email: 'arif@sentosa.id', source: 'Partner', status: 'Contacted', score: 78, ownerId: 'u3', createdAt: '2026-11-08T14:00:00', fit: 45, engagement: 33 },
  { id: 'l4', name: 'Nadia Khoury', company: 'Cedar Clinics', email: 'nadia@cedarclinics.com', source: 'Partner', status: 'Qualified', score: 84, ownerId: 'u3', createdAt: '2026-11-07T10:30:00', fit: 48, engagement: 36 },
  { id: 'l5', name: 'Owen Price', company: 'Price Fabrication', email: 'owen@pricefab.co.uk', source: 'Import', status: 'Contacted', score: 29, ownerId: 'u1', createdAt: '2026-11-06T09:00:00', fit: 15, engagement: 14 },
  { id: 'l6', name: 'Yuki Sato', company: 'Sato Dental Group', email: 'yuki@satodental.jp', source: 'Partner', status: 'New', score: 57, ownerId: null, createdAt: '2026-11-08T22:15:00', fit: 30, engagement: 27 },
  { id: 'l7', name: 'Liam Doyle', company: 'Doyle Property Partners', email: 'liam@doylepp.ie', source: 'Webinar', status: 'Unqualified', score: 18, ownerId: 'u4', createdAt: '2026-11-05T12:00:00', fit: 10, engagement: 8 },
  { id: 'l8', name: 'Fatima Al-Sayed', company: 'Gulf Harbor Trading', email: 'fatima@gulfharbor.ae', source: 'Partner', status: 'Qualified', score: 81, ownerId: 'u2', createdAt: '2026-11-04T16:45:00', fit: 46, engagement: 35 },
]

export type Product = { id: string; sku: string; name: string; unitPrice: number; unit: string }

export const products: Product[] = [
  { id: 'pr1', sku: 'CRM-SEAT', name: 'Platform seat, annual', unitPrice: 540, unit: 'seat' },
  { id: 'pr2', sku: 'CRM-ONB', name: 'Onboarding and data migration', unitPrice: 4500, unit: 'project' },
  { id: 'pr3', sku: 'CRM-SUP-P', name: 'Priority support', unitPrice: 2400, unit: 'year' },
  { id: 'pr4', sku: 'CRM-API', name: 'API access add-on', unitPrice: 1800, unit: 'year' },
  { id: 'pr5', sku: 'CRM-TRN', name: 'Team training day', unitPrice: 1200, unit: 'day' },
]

export type QuoteLine = { productId: string; qty: number; discount: number }

export type Quote = {
  id: string
  number: string
  dealId: string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Expired'
  validUntil: string
  lines: QuoteLine[]
  taxRate: number
}

export const quotes: Quote[] = [
  { id: 'q1', number: 'Q-2026-041', dealId: 'd1', status: 'Sent', validUntil: '2026-11-30', taxRate: 21, lines: [{ productId: 'pr1', qty: 85, discount: 10 }, { productId: 'pr2', qty: 1, discount: 0 }, { productId: 'pr3', qty: 1, discount: 0 }] },
  { id: 'q2', number: 'Q-2026-042', dealId: 'd3', status: 'Draft', validUntil: '2026-11-25', taxRate: 11, lines: [{ productId: 'pr1', qty: 160, discount: 15 }, { productId: 'pr2', qty: 1, discount: 0 }, { productId: 'pr4', qty: 1, discount: 0 }, { productId: 'pr5', qty: 2, discount: 0 }] },
  { id: 'q3', number: 'Q-2026-039', dealId: 'd7', status: 'Sent', validUntil: '2026-12-10', taxRate: 10, lines: [{ productId: 'pr1', qty: 120, discount: 8 }, { productId: 'pr3', qty: 1, discount: 0 }] },
  { id: 'q4', number: 'Q-2026-036', dealId: 'd12', status: 'Accepted', validUntil: '2026-10-31', taxRate: 21, lines: [{ productId: 'pr1', qty: 70, discount: 5 }, { productId: 'pr2', qty: 1, discount: 0 }] },
  { id: 'q5', number: 'Q-2026-033', dealId: 'd4', status: 'Expired', validUntil: '2026-10-20', taxRate: 9, lines: [{ productId: 'pr1', qty: 90, discount: 0 }] },
]

export type Rule = { field: string; op: string; value: string }

export type Segment = {
  id: string
  name: string
  description: string
  type: 'Dynamic' | 'Static'
  count: number
  rules: Rule[]
  match: 'all' | 'any'
  updatedAt: string
  usedIn: number
}

export const segments: Segment[] = [
  { id: 'sg1', name: 'Customers up for renewal in Q1', description: 'Active customers with a renewal date in the next 90 days.', type: 'Dynamic', count: 38, match: 'all', rules: [{ field: 'Lifecycle stage', op: 'is', value: 'Customer' }, { field: 'Renewal date', op: 'is within', value: 'next 90 days' }, { field: 'Email consent', op: 'is', value: 'Opted in' }], updatedAt: '2026-11-09', usedIn: 2 },
  { id: 'sg2', name: 'Webinar attendees, no reply', description: 'Attended the October webinar and have not replied to the follow-up.', type: 'Dynamic', count: 112, match: 'all', rules: [{ field: 'Tag', op: 'contains', value: 'Webinar Oct' }, { field: 'Last email reply', op: 'is before', value: '2026-10-25' }], updatedAt: '2026-11-08', usedIn: 1 },
  { id: 'sg3', name: 'Healthcare decision makers', description: 'Contacts in healthcare companies with a decision-maker tag.', type: 'Dynamic', count: 64, match: 'all', rules: [{ field: 'Company industry', op: 'is', value: 'Healthcare' }, { field: 'Tag', op: 'contains', value: 'Decision maker' }], updatedAt: '2026-11-06', usedIn: 3 },
  { id: 'sg4', name: 'High-score leads this month', description: 'Leads scored 60 or above created in the last 30 days.', type: 'Dynamic', count: 27, match: 'all', rules: [{ field: 'Lead score', op: 'is at least', value: '60' }, { field: 'Created', op: 'is within', value: 'last 30 days' }], updatedAt: '2026-11-09', usedIn: 1 },
  { id: 'sg5', name: 'Trade show list, Singapore 2026', description: 'Imported badge scans from the Singapore show.', type: 'Static', count: 213, match: 'all', rules: [], updatedAt: '2026-10-14', usedIn: 1 },
  { id: 'sg6', name: 'Do not email', description: 'Opted out or bounced. Used as a suppression list on every send.', type: 'Dynamic', count: 341, match: 'any', rules: [{ field: 'Email consent', op: 'is', value: 'Opted out' }, { field: 'Email status', op: 'is', value: 'Bounced' }], updatedAt: '2026-11-09', usedIn: 6 },
]

export const forecastByMonth = [
  { month: 'Jul', won: 118000, quota: 150000 },
  { month: 'Aug', won: 142000, quota: 150000 },
  { month: 'Sep', won: 131000, quota: 160000 },
  { month: 'Oct', won: 174000, quota: 160000 },
  { month: 'Nov', won: 80000, quota: 170000, commit: 160000, bestCase: 222000 },
  { month: 'Dec', won: 0, quota: 170000, commit: 98000, bestCase: 186000 },
]

export const pipelineTrend = [
  { week: 'W40', created: 6, won: 2, lost: 1 },
  { week: 'W41', created: 4, won: 1, lost: 2 },
  { week: 'W42', created: 7, won: 3, lost: 0 },
  { week: 'W43', created: 5, won: 2, lost: 1 },
  { week: 'W44', created: 8, won: 1, lost: 1 },
  { week: 'W45', created: 6, won: 2, lost: 2 },
]

// Helpers
export const ownerById = (id: string | null) => owners.find((o) => o.id === id)
export const companyById = (id: string | null) => companies.find((c) => c.id === id)
export const contactById = (id: string | null | undefined) => contacts.find((c) => c.id === id)
export const dealById = (id: string | null | undefined) => deals.find((d) => d.id === id)
export const stageById = (id: string) => stages.find((s) => s.id === id)!
export const productById = (id: string) => products.find((p) => p.id === id)!
export const fullName = (c: Contact) => `${c.firstName} ${c.lastName}`

export const money = (n: number, opts: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, ...opts }).format(n)

export const moneyShort = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : money(n)

export const quoteTotals = (q: Quote) => {
  const subtotal = q.lines.reduce((s, l) => s + productById(l.productId).unitPrice * l.qty * (1 - l.discount / 100), 0)
  const tax = subtotal * (q.taxRate / 100)
  return { subtotal, tax, total: subtotal + tax }
}

// ---- Existing customers (B2B account management) ----

export type Customer = {
  id: string
  companyId: string
  tier: 'Key account' | 'Regular' | 'Occasional'
  stage: 'New account' | 'Repeat buyer' | 'Growing' | 'Dormant' | 'At risk'
  firstOrderAt: string
  lastOrderAt: string
  orderEveryDays: number // typical gap between orders
  revenue12m: number
  revenuePrev12m: number
  lifetimeRevenue: number
  openOrders: number
  outstanding: number // unpaid invoices
  overdue: number // of which past due
  creditLimit: number
  paymentTerms: 'Net 14' | 'Net 30' | 'Net 60' | 'Prepaid'
  accountManagerId: string
  health: number
  trend: 'up' | 'flat' | 'down'
  productLines: string[] // what they buy today
}

export const productLines = ['Platform licences', 'Implementation', 'Training', 'Priority support', 'API add-on', 'Custom reports']

export const customers: Customer[] = [
  { id: 'cu1', companyId: 'c3', tier: 'Key account', stage: 'Growing', firstOrderAt: '2025-01-15', lastOrderAt: '2026-10-15', orderEveryDays: 45, revenue12m: 214000, revenuePrev12m: 158000, lifetimeRevenue: 412000, openOrders: 1, outstanding: 36000, overdue: 0, creditLimit: 150000, paymentTerms: 'Net 30', accountManagerId: 'u3', health: 88, trend: 'up', productLines: ['Platform licences', 'Implementation', 'Training', 'Priority support'] },
  { id: 'cu2', companyId: 'c1', tier: 'Key account', stage: 'Repeat buyer', firstOrderAt: '2024-11-28', lastOrderAt: '2026-10-28', orderEveryDays: 60, revenue12m: 168000, revenuePrev12m: 171000, lifetimeRevenue: 396000, openOrders: 2, outstanding: 44000, overdue: 0, creditLimit: 120000, paymentTerms: 'Net 30', accountManagerId: 'u1', health: 74, trend: 'flat', productLines: ['Platform licences', 'Implementation', 'Priority support'] },
  { id: 'cu3', companyId: 'c8', tier: 'Regular', stage: 'Growing', firstOrderAt: '2025-12-01', lastOrderAt: '2026-11-02', orderEveryDays: 50, revenue12m: 96000, revenuePrev12m: 0, lifetimeRevenue: 96000, openOrders: 1, outstanding: 22000, overdue: 0, creditLimit: 80000, paymentTerms: 'Net 30', accountManagerId: 'u4', health: 81, trend: 'up', productLines: ['Platform licences', 'Training'] },
  { id: 'cu4', companyId: 'c6', tier: 'Regular', stage: 'At risk', firstOrderAt: '2025-10-21', lastOrderAt: '2026-06-18', orderEveryDays: 60, revenue12m: 38000, revenuePrev12m: 71000, lifetimeRevenue: 109000, openOrders: 0, outstanding: 18500, overdue: 18500, creditLimit: 40000, paymentTerms: 'Net 30', accountManagerId: 'u3', health: 22, trend: 'down', productLines: ['Platform licences'] },
  { id: 'cu5', companyId: 'c7', tier: 'Occasional', stage: 'New account', firstOrderAt: '2026-09-02', lastOrderAt: '2026-09-02', orderEveryDays: 0, revenue12m: 14500, revenuePrev12m: 0, lifetimeRevenue: 14500, openOrders: 1, outstanding: 0, overdue: 0, creditLimit: 25000, paymentTerms: 'Prepaid', accountManagerId: 'u2', health: 63, trend: 'flat', productLines: ['Platform licences', 'Implementation'] },
  { id: 'cu6', companyId: 'c2', tier: 'Occasional', stage: 'Dormant', firstOrderAt: '2025-06-10', lastOrderAt: '2026-07-09', orderEveryDays: 75, revenue12m: 12800, revenuePrev12m: 19200, lifetimeRevenue: 32000, openOrders: 0, outstanding: 0, overdue: 0, creditLimit: 25000, paymentTerms: 'Net 14', accountManagerId: 'u2', health: 51, trend: 'down', productLines: ['Platform licences'] },
]

export type Order = { id: string; number: string; customerId: string; date: string; amount: number; status: 'Quoted' | 'Confirmed' | 'Delivered' | 'Invoiced' | 'Paid'; items: string }

export const orders: Order[] = [
  { id: 'o1', number: 'SO-2026-118', customerId: 'cu2', date: '2026-10-28', amount: 44000, status: 'Invoiced', items: '85 licences, 12-month renewal' },
  { id: 'o2', number: 'SO-2026-121', customerId: 'cu2', date: '2026-11-05', amount: 24000, status: 'Confirmed', items: 'Driver app add-on pilot, 40 users' },
  { id: 'o3', number: 'SO-2026-097', customerId: 'cu2', date: '2026-08-30', amount: 36000, status: 'Paid', items: 'Implementation, Rotterdam hub' },
  { id: 'o4', number: 'SO-2026-071', customerId: 'cu2', date: '2026-06-24', amount: 28000, status: 'Paid', items: 'Priority support, 12 months' },
  { id: 'o5', number: 'SO-2026-052', customerId: 'cu2', date: '2026-04-20', amount: 36000, status: 'Paid', items: '70 licences, 12-month' },
  { id: 'o6', number: 'SO-2026-112', customerId: 'cu1', date: '2026-10-15', amount: 36000, status: 'Invoiced', items: 'Pharmacy module, 2 clinics' },
  { id: 'o7', number: 'SO-2026-088', customerId: 'cu1', date: '2026-08-02', amount: 86400, status: 'Paid', items: '160 licences, 12-month renewal' },
  { id: 'o8', number: 'SO-2026-066', customerId: 'cu1', date: '2026-06-10', amount: 42000, status: 'Paid', items: 'Implementation, 3 clinics' },
  { id: 'o9', number: 'SO-2026-044', customerId: 'cu1', date: '2026-04-01', amount: 24000, status: 'Paid', items: 'Training, 4 sessions' },
  { id: 'o10', number: 'SO-2026-040', customerId: 'cu4', date: '2026-06-18', amount: 18500, status: 'Invoiced', items: '30 licences, 6-month' },
  { id: 'o11', number: 'SO-2026-009', customerId: 'cu4', date: '2026-01-14', amount: 19500, status: 'Paid', items: '30 licences, 6-month' },
  { id: 'o12', number: 'SO-2026-120', customerId: 'cu3', date: '2026-11-02', amount: 22000, status: 'Invoiced', items: 'Training and 10 extra licences' },
  { id: 'o13', number: 'SO-2026-101', customerId: 'cu5', date: '2026-09-02', amount: 14500, status: 'Delivered', items: '15 licences and implementation' },
  { id: 'o14', number: 'SO-2026-079', customerId: 'cu6', date: '2026-07-09', amount: 6400, status: 'Paid', items: '12 licences, 6-month' },
]

export type Invoice = { id: string; number: string; customerId: string; orderId: string; issuedAt: string; dueAt: string; amount: number; status: 'Paid' | 'Open' | 'Overdue' }

export const invoices: Invoice[] = [
  { id: 'i1', number: 'INV-2026-301', customerId: 'cu2', orderId: 'o1', issuedAt: '2026-10-29', dueAt: '2026-11-28', amount: 44000, status: 'Open' },
  { id: 'i2', number: 'INV-2026-262', customerId: 'cu2', orderId: 'o3', issuedAt: '2026-09-01', dueAt: '2026-10-01', amount: 36000, status: 'Paid' },
  { id: 'i3', number: 'INV-2026-230', customerId: 'cu2', orderId: 'o4', issuedAt: '2026-06-25', dueAt: '2026-07-25', amount: 28000, status: 'Paid' },
  { id: 'i4', number: 'INV-2026-296', customerId: 'cu1', orderId: 'o6', issuedAt: '2026-10-16', dueAt: '2026-11-15', amount: 36000, status: 'Open' },
  { id: 'i5', number: 'INV-2026-251', customerId: 'cu1', orderId: 'o7', issuedAt: '2026-08-03', dueAt: '2026-09-02', amount: 86400, status: 'Paid' },
  { id: 'i6', number: 'INV-2026-224', customerId: 'cu4', orderId: 'o10', issuedAt: '2026-06-19', dueAt: '2026-07-19', amount: 18500, status: 'Overdue' },
  { id: 'i7', number: 'INV-2026-305', customerId: 'cu3', orderId: 'o12', issuedAt: '2026-11-03', dueAt: '2026-12-03', amount: 22000, status: 'Open' },
]

export type Agreement = { id: string; customerId: string; name: string; terms: string; validUntil: string }

export const agreements: Agreement[] = [
  { id: 'ag1', customerId: 'cu2', name: 'Framework agreement 2025–2026', terms: '12% off list on licences, Net 30, quarterly review', validUntil: '2026-12-31' },
  { id: 'ag2', customerId: 'cu2', name: 'Support SLA', terms: '4-hour response, named engineer', validUntil: '2027-06-24' },
  { id: 'ag3', customerId: 'cu1', name: 'Volume price list', terms: '15% off list above 150 licences', validUntil: '2027-08-01' },
  { id: 'ag4', customerId: 'cu4', name: 'Standard terms', terms: 'List price, Net 30', validUntil: '2026-12-31' },
]

export type SuccessStep = { id: string; customerId: string; title: string; dueAt: string; done: boolean; ownerId: string }

export const successSteps: SuccessStep[] = [
  { id: 'ss1', customerId: 'cu2', title: 'Quarterly business review with Sofie', dueAt: '2026-11-12', done: false, ownerId: 'u1' },
  { id: 'ss2', customerId: 'cu2', title: 'Renew framework agreement before 31 Dec', dueAt: '2026-11-30', done: false, ownerId: 'u1' },
  { id: 'ss3', customerId: 'cu2', title: 'Propose training package (not bought yet)', dueAt: '2026-11-20', done: false, ownerId: 'u1' },
  { id: 'ss4', customerId: 'cu2', title: 'Kickoff and admin training', dueAt: '2024-12-05', done: true, ownerId: 'u1' },
  { id: 'ss5', customerId: 'cu2', title: 'Driver app pilot agreed', dueAt: '2026-10-20', done: true, ownerId: 'u1' },
  { id: 'ss6', customerId: 'cu4', title: 'Call Bagus about the overdue invoice', dueAt: '2026-11-10', done: false, ownerId: 'u3' },
  { id: 'ss7', customerId: 'cu4', title: 'Find out why no reorder since June', dueAt: '2026-11-09', done: false, ownerId: 'u3' },
  { id: 'ss8', customerId: 'cu1', title: 'Scope expansion to 3 more clinics with Anindya', dueAt: '2026-11-20', done: false, ownerId: 'u3' },
  { id: 'ss9', customerId: 'cu5', title: 'Delivery sign-off and first invoice', dueAt: '2026-11-13', done: false, ownerId: 'u2' },
  { id: 'ss10', customerId: 'cu5', title: 'Kickoff call', dueAt: '2026-09-05', done: true, ownerId: 'u2' },
]

export const revenueByMonth: Record<string, { month: string; revenue: number }[]> = {
  cu1: [{ month: 'Dec', revenue: 0 }, { month: 'Jan', revenue: 0 }, { month: 'Feb', revenue: 12000 }, { month: 'Mar', revenue: 0 }, { month: 'Apr', revenue: 24000 }, { month: 'May', revenue: 0 }, { month: 'Jun', revenue: 42000 }, { month: 'Jul', revenue: 0 }, { month: 'Aug', revenue: 86400 }, { month: 'Sep', revenue: 0 }, { month: 'Oct', revenue: 36000 }, { month: 'Nov', revenue: 0 }],
  cu2: [{ month: 'Dec', revenue: 0 }, { month: 'Jan', revenue: 0 }, { month: 'Feb', revenue: 0 }, { month: 'Mar', revenue: 0 }, { month: 'Apr', revenue: 36000 }, { month: 'May', revenue: 0 }, { month: 'Jun', revenue: 28000 }, { month: 'Jul', revenue: 0 }, { month: 'Aug', revenue: 36000 }, { month: 'Sep', revenue: 0 }, { month: 'Oct', revenue: 44000 }, { month: 'Nov', revenue: 24000 }],
  cu3: [{ month: 'Dec', revenue: 21600 }, { month: 'Jan', revenue: 0 }, { month: 'Feb', revenue: 0 }, { month: 'Mar', revenue: 18000 }, { month: 'Apr', revenue: 0 }, { month: 'May', revenue: 12400 }, { month: 'Jun', revenue: 0 }, { month: 'Jul', revenue: 22000 }, { month: 'Aug', revenue: 0 }, { month: 'Sep', revenue: 0 }, { month: 'Oct', revenue: 0 }, { month: 'Nov', revenue: 22000 }],
  cu4: [{ month: 'Dec', revenue: 0 }, { month: 'Jan', revenue: 19500 }, { month: 'Feb', revenue: 0 }, { month: 'Mar', revenue: 0 }, { month: 'Apr', revenue: 0 }, { month: 'May', revenue: 0 }, { month: 'Jun', revenue: 18500 }, { month: 'Jul', revenue: 0 }, { month: 'Aug', revenue: 0 }, { month: 'Sep', revenue: 0 }, { month: 'Oct', revenue: 0 }, { month: 'Nov', revenue: 0 }],
  cu5: [{ month: 'Dec', revenue: 0 }, { month: 'Jan', revenue: 0 }, { month: 'Feb', revenue: 0 }, { month: 'Mar', revenue: 0 }, { month: 'Apr', revenue: 0 }, { month: 'May', revenue: 0 }, { month: 'Jun', revenue: 0 }, { month: 'Jul', revenue: 0 }, { month: 'Aug', revenue: 0 }, { month: 'Sep', revenue: 14500 }, { month: 'Oct', revenue: 0 }, { month: 'Nov', revenue: 0 }],
  cu6: [{ month: 'Dec', revenue: 0 }, { month: 'Jan', revenue: 6400 }, { month: 'Feb', revenue: 0 }, { month: 'Mar', revenue: 0 }, { month: 'Apr', revenue: 0 }, { month: 'May', revenue: 0 }, { month: 'Jun', revenue: 0 }, { month: 'Jul', revenue: 6400 }, { month: 'Aug', revenue: 0 }, { month: 'Sep', revenue: 0 }, { month: 'Oct', revenue: 0 }, { month: 'Nov', revenue: 0 }],
}

export const customerById = (id: string | null | undefined) => customers.find((c) => c.id === id)
export const customerByCompany = (companyId: string | null | undefined) => customers.find((c) => c.companyId === companyId)
export const daysSince = (iso: string) => Math.round((new Date('2026-11-09').getTime() - new Date(iso).getTime()) / 86400000)
export const daysUntil = (iso: string) => -daysSince(iso)
/** Expected next order date from the usual gap; null for first-time buyers. */
export const nextOrderDue = (c: Customer) => (c.orderEveryDays ? new Date(new Date(c.lastOrderAt).getTime() + c.orderEveryDays * 86400000).toISOString().slice(0, 10) : null)

// ---- Partners (referral and reseller) ----

export type Partner = {
  id: string
  companyId: string
  kind: 'Referral' | 'Reseller' | 'Consultant'
  tier: 'Gold' | 'Silver' | 'Bronze'
  commissionRate: number // % of first-year order value
  since: string
  managerId: string
  status: 'Active' | 'Onboarding' | 'Inactive'
  agreementUntil: string
  commissionPaid: number
  commissionOwed: number
}

export const partnerCompanies: Company[] = [
  { id: 'pc1', name: 'Meridian Advisory', domain: 'meridianadvisory.com', industry: 'Consulting', size: '10–50', city: 'Singapore', ownerId: 'u2', openDeals: 0, pipelineValue: 0, lastActivity: '2026-11-07' },
  { id: 'pc2', name: 'Cloudbase Systems', domain: 'cloudbase.id', industry: 'IT services', size: '50–200', city: 'Jakarta', ownerId: 'u3', openDeals: 0, pipelineValue: 0, lastActivity: '2026-11-08' },
  { id: 'pc3', name: 'Harbor & Vale', domain: 'harborvale.com', industry: 'Professional services', size: '50–200', city: 'Lisbon', ownerId: 'u2', openDeals: 1, pipelineValue: 24000, lastActivity: '2026-11-07' },
]
companies.push(partnerCompanies[0], partnerCompanies[1])

export const partners: Partner[] = [
  { id: 'pt1', companyId: 'pc2', kind: 'Reseller', tier: 'Gold', commissionRate: 15, since: '2025-03-01', managerId: 'u3', status: 'Active', agreementUntil: '2027-02-28', commissionPaid: 18600, commissionOwed: 5400 },
  { id: 'pt2', companyId: 'pc1', kind: 'Referral', tier: 'Silver', commissionRate: 10, since: '2025-09-15', managerId: 'u2', status: 'Active', agreementUntil: '2026-12-31', commissionPaid: 6200, commissionOwed: 2400 },
  { id: 'pt3', companyId: 'c2', kind: 'Consultant', tier: 'Bronze', commissionRate: 8, since: '2026-08-01', managerId: 'u2', status: 'Onboarding', agreementUntil: '2027-07-31', commissionPaid: 0, commissionOwed: 0 },
]

export const partnerContacts: Contact[] = [
  { id: 'pp1', firstName: 'Reza', lastName: 'Wibowo', title: 'Partnerships Lead', email: 'reza@cloudbase.id', phone: '+62 21 555 0190', companyId: 'pc2', lifecycle: 'Customer', ownerId: 'u3', tags: ['Partner'], score: 0, lastActivity: '2026-11-08', consent: 'Opted in' },
  { id: 'pp2', firstName: 'Clara', lastName: 'Lim', title: 'Managing Director', email: 'clara@meridianadvisory.com', phone: '+65 6555 0181', companyId: 'pc1', lifecycle: 'Customer', ownerId: 'u2', tags: ['Partner'], score: 0, lastActivity: '2026-11-07', consent: 'Opted in' },
]
contacts.push(...partnerContacts)

/** Which partner referred a lead, deal or customer. */
export const referrals: Record<string, string> = {
  // leads
  l3: 'pt1', // Arif Hidayat, Sentosa Logistics
  l4: 'pt2', // Nadia Khoury, Cedar Clinics
  l8: 'pt2', // Fatima Al-Sayed
  l6: 'pt1', // Yuki Sato
  // deals
  d3: 'pt1', // Clinic network expansion (Kinara)
  d9: 'pt1',
  d13: 'pt1', // Pharmacy module, won
  d6: 'pt2', // Campus-wide licence (Pinecrest)
  d5: 'pt2',
  // customers (companies) originally sourced by a partner
  c3: 'pt1',
  c7: 'pt2',
}

export const partnerById = (id: string | null | undefined) => partners.find((p) => p.id === id)
export const referrerOf = (recordId: string) => partnerById(referrals[recordId])
export const partnerStats = (p: Partner) => {
  const leadIds = leads.filter((l) => referrals[l.id] === p.id).map((l) => l.id)
  const myDeals = deals.filter((d) => referrals[d.id] === p.id)
  const won = myDeals.filter((d) => d.stageId === 's5')
  const open = myDeals.filter((d) => stageById(d.stageId).kind === 'open')
  const sourcedCustomers = customers.filter((c) => referrals[c.companyId] === p.id)
  return {
    leads: leadIds.length,
    openDeals: open.length,
    openValue: open.reduce((s, d) => s + d.amount, 0),
    wonDeals: won.length,
    wonValue: won.reduce((s, d) => s + d.amount, 0),
    sourcedRevenue12m: sourcedCustomers.reduce((s, c) => s + c.revenue12m, 0),
    customers: sourcedCustomers.length,
  }
}
