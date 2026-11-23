import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ConcertList from './components/ConcertList'
import ConcertForm from './components/ConcertForm'
import ConcertManageSection from './components/ConcertManageSection'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/concerts'

function formatApiError(data, fallbackMessage) {
  if (data && Array.isArray(data.message)) {
    return data.message.join(', ')
  }
  if (data && typeof data.message === 'string') {
    return data.message
  }
  return fallbackMessage
}

function App() {
  const [konser, setKonser] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('jadwal')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Semua')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [sortBy, setSortBy] = useState('default')
  const [feedback, setFeedback] = useState(null)

  function showFeedback(type, message) {
    setFeedback({ type, message })
  }

  useEffect(() => {
    async function fetchConcerts() {
      try {
        setLoading(true)
        const response = await fetch(API_URL)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(formatApiError(data, 'Gagal memuat data konser'))
        }

        setKonser(data)
      } catch (error) {
        showFeedback('error', error.message || 'Tidak dapat terhubung ke server backend')
      } finally {
        setLoading(false)
      }
    }

    fetchConcerts()
  }, [])

  async function handleAddConcert(payload) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        showFeedback('error', formatApiError(data, 'Gagal menambahkan konser'))
        return false
      }

      setKonser((prev) => [...prev, data])
      showFeedback('success', `Konser "${data.name}" berhasil ditambahkan.`)
      setActiveTab('jadwal')
      return true
    } catch {
      showFeedback('error', 'Gagal terhubung ke server backend.')
      return false
    }
  }

  async function handleUpdateConcert(id, payload) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        showFeedback('error', formatApiError(data, 'Gagal memperbarui konser'))
        return false
      }

      setKonser((prev) => prev.map((item) => (item.id === id ? data : item)))
      showFeedback('success', `Konser "${data.name}" berhasil diperbarui.`)
      return true
    } catch {
      showFeedback('error', 'Gagal terhubung ke server backend.')
      return false
    }
  }

  async function handleDeleteConcert(concert) {
    try {
      const response = await fetch(`${API_URL}/${concert.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        showFeedback('error', formatApiError(data, 'Gagal menghapus konser'))
        return false
      }

      setKonser((prev) => prev.filter((item) => item.id !== concert.id))
      showFeedback('success', data.message || `Konser "${concert.name}" berhasil dihapus.`)
      return true
    } catch {
      showFeedback('error', 'Gagal terhubung ke server backend.')
      return false
    }
  }

  function handleResetFilters() {
    setSearchQuery('')
    setCategoryFilter('Semua')
    setStatusFilter('Semua')
    setSortBy('default')
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredConcerts = konser
    .filter((item) => {
      const matchesSearch =
        !normalizedQuery ||
        [item.name, item.artist, item.location, item.category]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(normalizedQuery))
      const matchesCategory = categoryFilter === 'Semua' || item.category === categoryFilter
      const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
    .toSorted((a, b) => {
      if (sortBy === 'date-asc') return a.date.localeCompare(b.date)
      if (sortBy === 'price-asc') return a.ticketPrice - b.ticketPrice
      if (sortBy === 'price-desc') return b.ticketPrice - a.ticketPrice
      return 0
    })

  const totalLokal = konser.filter((item) => item.category === 'Lokal').length
  const totalInternasional = konser.filter((item) => item.category === 'Internasional').length
  const totalTersedia = konser.filter((item) => item.status === 'Tersedia').length

  return (
    <>
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalKonser={konser.length}
      />
      <main className="container">
        {feedback && (
          <div className={`feedback ${feedback.type}`} role="status">
            <span>{feedback.message}</span>
            <button
              type="button"
              className="feedback-close"
              onClick={() => setFeedback(null)}
              aria-label="Tutup pesan"
            >
              ×
            </button>
          </div>
        )}

        {activeTab === 'jadwal' && (
          <>
            <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <section className="stats-grid" aria-label="Ringkasan jadwal konser">
              <div className="stat-card">
                <span className="stat-label">Total Konser</span>
                <strong>{konser.length}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Konser Lokal</span>
                <strong>{totalLokal}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Internasional</span>
                <strong>{totalInternasional}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-label">Tiket Tersedia</span>
                <strong>{totalTersedia}</strong>
              </div>
            </section>
            <ConcertList
              konser={filteredConcerts}
              totalKonser={konser.length}
              loading={loading}
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              sortBy={sortBy}
              onCategoryChange={setCategoryFilter}
              onStatusChange={setStatusFilter}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
            />
          </>
        )}

        {activeTab === 'tambah' && (
          <ConcertForm onTambahKonser={handleAddConcert} />
        )}

        {activeTab === 'kelola' && (
          <ConcertManageSection
            konser={konser}
            onUpdateKonser={handleUpdateConcert}
            onDeleteKonser={handleDeleteConcert}
          />
        )}
      </main>
      <footer className="footer">© 2026 Konserin · Informasi konser musik di Indonesia</footer>
    </>
  )
}

export default App
