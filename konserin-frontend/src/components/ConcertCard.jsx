function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function ConcertCard({ konser }) {
  return (
    <article className="concert-card">
      <div className="card-top">
        <span className="category">{konser.category}</span>
        <span className="status">{konser.status}</span>
      </div>
      <h3>{konser.name}</h3>
      <p className="artist">{konser.artist}</p>
      <p className="description">{konser.description || 'Informasi konser musik di Indonesia.'}</p>
      <div className="details">
        <p>
          <strong>Tanggal & waktu</strong>
          {konser.date}
          {konser.time ? ` · ${konser.time} WIB` : ''}
        </p>
        <p><strong>Lokasi</strong>{konser.location}</p>
        <p><strong>Harga tiket</strong>{formatRupiah(konser.ticketPrice)}</p>
        {konser.preSale && <p><strong>Pre-sale</strong>{konser.preSale}</p>}
        {konser.generalSale && <p><strong>General sale</strong>{konser.generalSale}</p>}
      </div>
    </article>
  )
}

export default ConcertCard
