import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout.jsx'

// Import pages
import Entries from './pages/Entries.jsx'
import Journals from './pages/Journals.jsx'
import NewEntry from './pages/NewEntry.jsx'
import ViewEntry from './pages/ViewEntry.jsx'
import Insights from './pages/Insights.jsx'
import Goals from './pages/Goals.jsx'
import Settings from './pages/settings.jsx'
import CalendarView from './pages/CalendarView.jsx'
import MapView from './pages/MapView.jsx'
import Search from './pages/Search.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Entries /></Layout>} />
      <Route path="/entries" element={<Layout><Entries /></Layout>} />
      <Route path="/journals" element={<Layout><Journals /></Layout>} />
      <Route path="/new-entry" element={<Layout><NewEntry /></Layout>} />
      <Route path="/entry/:id" element={<Layout><ViewEntry /></Layout>} />
      <Route path="/insights" element={<Layout><Insights /></Layout>} />
      <Route path="/goals" element={<Layout><Goals /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      <Route path="/calendar" element={<Layout><CalendarView /></Layout>} />
      <Route path="/map" element={<Layout><MapView /></Layout>} />
      <Route path="/search" element={<Layout><Search /></Layout>} />
    </Routes>
  )
}

export default App
