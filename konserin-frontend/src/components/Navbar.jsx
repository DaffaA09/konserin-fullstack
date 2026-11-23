function Navbar({ activeTab, onTabChange, totalKonser }) {
  return (
    <header className="navbar">
      <button
        type="button"
        className="brand brand-button"
        onClick={() => onTabChange('jadwal')}
      >
        Konserin<span>.</span>
      </button>
      <nav aria-label="Navigasi utama">
        <button
          type="button"
          className={`nav-tab ${activeTab === 'jadwal' ? 'active' : ''}`}
          onClick={() => onTabChange('jadwal')}
        >
          Jadwal Konser
        </button>
        <button
          type="button"
          className={`nav-tab ${activeTab === 'tambah' ? 'active' : ''}`}
          onClick={() => onTabChange('tambah')}
        >
          Tambah Konser
        </button>
        <button
          type="button"
          className={`nav-tab ${activeTab === 'kelola' ? 'active' : ''}`}
          onClick={() => onTabChange('kelola')}
        >
          Kelola Konser ({totalKonser})
        </button>
      </nav>
    </header>
  )
}

export default Navbar
