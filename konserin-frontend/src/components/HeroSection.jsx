function HeroSection({ searchQuery, onSearchChange }) {
  function handleSearchSubmit(event) {
    event.preventDefault()
    document.getElementById('konser')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="beranda">
      <p className="eyebrow">PANGGUNG MUSIK INDONESIA</p>
      <h1>Temukan konser<br />yang kamu tunggu.</h1>
      <p className="hero-text">Jelajahi jadwal konser musisi lokal dan internasional di Indonesia.</p>
      <div className="hero-actions">
        <a className="button-link" href="#konser">Lihat jadwal</a>
        <form className="hero-search" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            placeholder="Cari nama konser, artis, atau kota..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Cari konser"
          />
          <button type="submit" className="search-button">Cari konser</button>
        </form>
      </div>
    </section>
  )
}

export default HeroSection
