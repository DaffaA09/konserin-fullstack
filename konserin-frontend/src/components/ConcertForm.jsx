import { useState } from 'react'

const formAwal = {
  name: '',
  artist: '',
  category: 'Lokal',
  date: '',
  time: '',
  location: '',
  ticketPrice: '',
  preSale: '',
  generalSale: '',
  status: 'Tersedia',
  description: '',
}

function ConcertForm({ onTambahKonser }) {
  const [form, setForm] = useState(formAwal)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)

    const payload = {
      name: form.name.trim(),
      artist: form.artist.trim(),
      category: form.category,
      date: form.date,
      location: form.location.trim(),
      ticketPrice: Number(form.ticketPrice),
      status: form.status,
      ...(form.time ? { time: form.time } : {}),
      ...(form.preSale ? { preSale: form.preSale } : {}),
      ...(form.generalSale ? { generalSale: form.generalSale } : {}),
      ...(form.description.trim() ? { description: form.description.trim() } : {}),
    }

    const success = await onTambahKonser(payload)
    setSubmitting(false)

    if (success) {
      setForm(formAwal)
    }
  }

  return (
    <section className="form-section" id="tambah-konser">
      <p className="eyebrow">PUNYA INFO KONSER?</p>
      <h2>Tambah ke jadwal</h2>
      <p className="form-intro">Isi informasi dasar konser untuk ditampilkan di daftar.</p>
      <form className="concert-form" onSubmit={handleSubmit}>
        <label>Nama konser<input name="name" value={form.name} onChange={handleChange} minLength={3} required /></label>
        <label>Artis atau band<input name="artist" value={form.artist} onChange={handleChange} minLength={2} required /></label>
        <label>Kategori<select name="category" value={form.category} onChange={handleChange}><option>Lokal</option><option>Internasional</option></select></label>
        <label>Tanggal<input type="date" name="date" value={form.date} onChange={handleChange} required /></label>
        <label>Waktu<input type="time" name="time" value={form.time} onChange={handleChange} /></label>
        <label>Lokasi dan kota<input name="location" value={form.location} onChange={handleChange} minLength={3} required /></label>
        <label>Harga tiket mulai (Rp)<input type="number" name="ticketPrice" min="0" placeholder="Contoh: 250000" value={form.ticketPrice} onChange={handleChange} required /></label>
        <label>Jadwal pre-sale<input type="date" name="preSale" value={form.preSale} onChange={handleChange} /></label>
        <label>Jadwal general sale<input type="date" name="generalSale" value={form.generalSale} onChange={handleChange} /></label>
        <label>Status tiket<select name="status" value={form.status} onChange={handleChange}><option>Tersedia</option><option>Segera hadir</option><option>Habis</option></select></label>
        <label className="full-width">Deskripsi<textarea name="description" value={form.description} onChange={handleChange} rows="3" /></label>
        <button className="submit-button" type="submit" disabled={submitting}>
          {submitting ? 'Menyimpan...' : 'Tambah konser'}
        </button>
      </form>
    </section>
  )
}

export default ConcertForm
