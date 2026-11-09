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
  source: 'Web form' | 'Webinar' | 'Referral' | 'Import' | 'LinkedIn'
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
  { id: 'l3', name: 'Arif Hidayat', company: 'Sentosa Logistics', email: 'arif@sentosa.id', source: 'Referral', status: 'Contacted', score: 78, ownerId: 'u3', createdAt: '2026-11-08T14:00:00', fit: 45, engagement: 33 },
  { id: 'l4', name: 'Nadia Khoury', company: 'Cedar Clinics', email: 'nadia@cedarclinics.com', source: 'LinkedIn', status: 'Qualified', score: 84, ownerId: 'u3', createdAt: '2026-11-07T10:30:00', fit: 48, engagement: 36 },
  { id: 'l5', name: 'Owen Price', company: 'Price Fabrication', email: 'owen@pricefab.co.uk', source: 'Import', status: 'Contacted', score: 29, ownerId: 'u1', createdAt: '2026-11-06T09:00:00', fit: 15, engagement: 14 },
  { id: 'l6', name: 'Yuki Sato', company: 'Sato Dental Group', email: 'yuki@satodental.jp', source: 'Web form', status: 'New', score: 57, ownerId: null, createdAt: '2026-11-08T22:15:00', fit: 30, engagement: 27 },
  { id: 'l7', name: 'Liam Doyle', company: 'Doyle Property Partners', email: 'liam@doylepp.ie', source: 'Webinar', status: 'Unqualified', score: 18, ownerId: 'u4', createdAt: '2026-11-05T12:00:00', fit: 10, engagement: 8 },
  { id: 'l8', name: 'Fatima Al-Sayed', company: 'Gulf Harbor Trading', email: 'fatima@gulfharbor.ae', source: 'Referral', status: 'Qualified', score: 81, ownerId: 'u2', createdAt: '2026-11-04T16:45:00', fit: 46, engagement: 35 },
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

// ---- Existing customers (post-sale) ----

export type Customer = {
  id: string
  companyId: string
  plan: 'Starter' | 'Team' | 'Business' | 'Enterprise'
  seats: number
  arr: number
  startedAt: string
  renewalAt: string
  csmId: string
  health: number // 0-100
  trend: 'up' | 'flat' | 'down'
  usage: number // % of seats active last 30 days
  nps: number | null
  openTickets: number
  stage: 'Onboarding' | 'Adopting' | 'Established' | 'Renewal due' | 'At risk'
}

export const customers: Customer[] = [
  { id: 'cu1', companyId: 'c3', plan: 'Business', seats: 160, arr: 86400, startedAt: '2025-01-15', renewalAt: '2027-01-15', csmId: 'u3', health: 88, trend: 'up', usage: 91, nps: 9, openTickets: 1, stage: 'Established' },
  { id: 'cu2', companyId: 'c1', plan: 'Business', seats: 85, arr: 45900, startedAt: '2024-11-28', renewalAt: '2026-11-28', csmId: 'u1', health: 74, trend: 'flat', usage: 78, nps: 8, openTickets: 2, stage: 'Renewal due' },
  { id: 'cu3', companyId: 'c8', plan: 'Team', seats: 40, arr: 21600, startedAt: '2025-12-01', renewalAt: '2026-12-01', csmId: 'u4', health: 81, trend: 'up', usage: 85, nps: 9, openTickets: 0, stage: 'Renewal due' },
  { id: 'cu4', companyId: 'c6', plan: 'Team', seats: 30, arr: 16200, startedAt: '2025-10-21', renewalAt: '2026-10-21', csmId: 'u3', health: 22, trend: 'down', usage: 12, nps: 4, openTickets: 3, stage: 'At risk' },
  { id: 'cu5', companyId: 'c7', plan: 'Starter', seats: 15, arr: 8100, startedAt: '2026-09-02', renewalAt: '2027-09-02', csmId: 'u2', health: 63, trend: 'flat', usage: 60, nps: null, openTickets: 1, stage: 'Onboarding' },
  { id: 'cu6', companyId: 'c2', plan: 'Starter', seats: 12, arr: 6480, startedAt: '2026-06-10', renewalAt: '2027-06-10', csmId: 'u2', health: 70, trend: 'up', usage: 83, nps: 7, openTickets: 0, stage: 'Adopting' },
]

export type Ticket = { id: string; customerId: string; subject: string; priority: 'Low' | 'Normal' | 'High'; status: 'Open' | 'Waiting on customer' | 'Resolved'; openedAt: string }

export const tickets: Ticket[] = [
  { id: 't1', customerId: 'cu4', subject: 'Login fails for SSO users', priority: 'High', status: 'Open', openedAt: '2026-11-06' },
  { id: 't2', customerId: 'cu4', subject: 'Export to Excel missing columns', priority: 'Normal', status: 'Waiting on customer', openedAt: '2026-11-03' },
  { id: 't3', customerId: 'cu4', subject: 'Request: Bahasa Indonesia UI', priority: 'Low', status: 'Open', openedAt: '2026-10-28' },
  { id: 't4', customerId: 'cu2', subject: 'Slow pipeline board with 400+ deals', priority: 'High', status: 'Open', openedAt: '2026-11-07' },
  { id: 't5', customerId: 'cu2', subject: 'Add two more admin seats', priority: 'Normal', status: 'Resolved', openedAt: '2026-11-01' },
  { id: 't6', customerId: 'cu1', subject: 'Webhook retries not firing', priority: 'Normal', status: 'Open', openedAt: '2026-11-08' },
  { id: 't7', customerId: 'cu5', subject: 'Help importing contacts from spreadsheet', priority: 'Normal', status: 'Open', openedAt: '2026-11-05' },
]

export type SuccessStep = { id: string; customerId: string; title: string; dueAt: string; done: boolean; ownerId: string }

export const successSteps: SuccessStep[] = [
  { id: 'ss1', customerId: 'cu2', title: 'Quarterly business review', dueAt: '2026-11-12', done: false, ownerId: 'u1' },
  { id: 'ss2', customerId: 'cu2', title: 'Send renewal proposal (same seats, 5% uplift)', dueAt: '2026-11-14', done: false, ownerId: 'u1' },
  { id: 'ss3', customerId: 'cu2', title: 'Fix board performance ticket before QBR', dueAt: '2026-11-11', done: false, ownerId: 'u1' },
  { id: 'ss4', customerId: 'cu2', title: 'Kickoff and admin training', dueAt: '2024-12-05', done: true, ownerId: 'u1' },
  { id: 'ss5', customerId: 'cu2', title: 'Driver app pilot agreed', dueAt: '2026-10-20', done: true, ownerId: 'u1' },
  { id: 'ss6', customerId: 'cu4', title: 'Executive call with Bagus about usage drop', dueAt: '2026-11-10', done: false, ownerId: 'u3' },
  { id: 'ss7', customerId: 'cu4', title: 'Resolve SSO ticket', dueAt: '2026-11-09', done: false, ownerId: 'u3' },
  { id: 'ss8', customerId: 'cu1', title: 'Expansion to 3 clinics: scope with Anindya', dueAt: '2026-11-20', done: false, ownerId: 'u3' },
  { id: 'ss9', customerId: 'cu5', title: 'Import contacts and set up pipeline', dueAt: '2026-11-13', done: false, ownerId: 'u2' },
  { id: 'ss10', customerId: 'cu5', title: 'Kickoff call', dueAt: '2026-09-05', done: true, ownerId: 'u2' },
]

export const usageTrend: Record<string, { week: string; active: number }[]> = {
  cu1: [{ week: 'W40', active: 84 }, { week: 'W41', active: 86 }, { week: 'W42', active: 88 }, { week: 'W43', active: 90 }, { week: 'W44', active: 89 }, { week: 'W45', active: 91 }],
  cu2: [{ week: 'W40', active: 80 }, { week: 'W41', active: 79 }, { week: 'W42', active: 81 }, { week: 'W43', active: 77 }, { week: 'W44', active: 78 }, { week: 'W45', active: 78 }],
  cu3: [{ week: 'W40', active: 70 }, { week: 'W41', active: 74 }, { week: 'W42', active: 78 }, { week: 'W43', active: 80 }, { week: 'W44', active: 83 }, { week: 'W45', active: 85 }],
  cu4: [{ week: 'W40', active: 48 }, { week: 'W41', active: 40 }, { week: 'W42', active: 31 }, { week: 'W43', active: 24 }, { week: 'W44', active: 15 }, { week: 'W45', active: 12 }],
  cu5: [{ week: 'W40', active: 20 }, { week: 'W41', active: 33 }, { week: 'W42', active: 41 }, { week: 'W43', active: 52 }, { week: 'W44', active: 55 }, { week: 'W45', active: 60 }],
  cu6: [{ week: 'W40', active: 66 }, { week: 'W41', active: 70 }, { week: 'W42', active: 75 }, { week: 'W43', active: 79 }, { week: 'W44', active: 81 }, { week: 'W45', active: 83 }],
}

export const customerById = (id: string | null | undefined) => customers.find((c) => c.id === id)
export const customerByCompany = (companyId: string | null | undefined) => customers.find((c) => c.companyId === companyId)
