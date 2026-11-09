import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { BrowserRouter, Route, Routes } from 'react-router'
import { theme } from './theme'
import Shell from './layout/Shell'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import ContactDetail from './pages/ContactDetail'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import Customers from './pages/Customers'
import CustomerDetail from './pages/CustomerDetail'
import Partners from './pages/Partners'
import PartnerDetail from './pages/PartnerDetail'
import Activities from './pages/Activities'
import Leads from './pages/Leads'
import Pipeline from './pages/Pipeline'
import Quotes from './pages/Quotes'
import Forecast from './pages/Forecast'
import Segments from './pages/Segments'

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications position="bottom-right" />
        <BrowserRouter>
          <Routes>
            <Route element={<Shell />}>
              <Route index element={<Dashboard />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="contacts/:id" element={<ContactDetail />} />
              <Route path="companies" element={<Companies />} />
              <Route path="companies/:id" element={<CompanyDetail />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="activities" element={<Activities />} />
              <Route path="leads" element={<Leads />} />
              <Route path="pipeline" element={<Pipeline />} />
              <Route path="partners" element={<Partners />} />
              <Route path="partners/:id" element={<PartnerDetail />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="forecast" element={<Forecast />} />
              <Route path="segments" element={<Segments />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ModalsProvider>
    </MantineProvider>
  )
}
