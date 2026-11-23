import ConcertCard from './ConcertCard'

function ConcertList({
  konser,
  totalKonser,
  loading,
  searchQuery,
  categoryFilter,
  statusFilter,
  sortBy,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onResetFilters,
}) {
  const hasActiveFilter =
    Boolean(searchQuery) || categoryFilter !== 'Semua' || statusFilter !== 'Semua'

  return (
    <section className="concert-section" id="konser">
      <div className="section-heading">
        <div>
          <p className="eyebrow">JADWAL PILIHAN</p>
          <h2>Konser mendatang</h2>
        </div>
        <div className="section-meta">
          {hasActiveFilter && (
            <button type="button" className="reset-search" onClick={onResetFilters}>
              Reset filter
            </button>
          )}
          <span className="count">
            {hasActiveFilter ? `${konser.length} dari ${totalKonser} konser` : `${konser.length} konser`}
          </span>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-pills" role="group" aria-label="Filter kategori">
          {['Semua', 'Lokal', 'Internasional'].map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-pill ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="filter-controls">
          <select
            aria-label="Filter status tiket"
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <option value="Semua">Semua status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Segera hadir">Segera hadir</option>
            <option value="Habis">Habis</option>
          </select>

          <select
            aria-label="Urutkan konser"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="default">Urutan default</option>
            <option value="date-asc">Tanggal terdekat</option>
            <option value="price-asc">Harga termurah</option>
            <option value="price-desc">Harga termahal</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="empty-state">Memuat jadwal konser...</p>
      ) : konser.length === 0 ? (
        <p className="empty-state">
          {hasActiveFilter
            ? 'Tidak ada konser yang sesuai dengan pencarian atau filter yang dipilih.'
            : 'Belum ada data konser'}
        </p>
      ) : (
        <div className="concert-grid">
          {konser.map((item) => <ConcertCard key={item.id} konser={item} />)}
        </div>
      )}
    </section>
  )
}

export default ConcertList
