import { useState } from 'react'

function getEditInitialForm(concert) {
  return {
    name: concert.name || '',
    artist: concert.artist || '',
    category: concert.category || 'Lokal',
    date: concert.date || '',
    time: concert.time || '',
    location: concert.location || '',
    ticketPrice: concert.ticketPrice ?? '',
    preSale: concert.preSale || '',
    generalSale: concert.generalSale || '',
    status: concert.status || 'Tersedia',
    description: concert.description || '',
  }
}

function EditConcertPanel({ concert, onUpdateKonser, onCancel }) {
  const [form, setForm] = useState(() => getEditInitialForm(concert))
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

    const success = await onUpdateKonser(concert.id, payload)
    setSubmitting(false)

    if (success) {
      onCancel()
    }
  }

  return (
    <div className="manage-edit-box">
      <h3>Ubah konser: {concert.name}</h3>
      <form className="concert-form" onSubmit={handleSubmit}>
        <label>Nama konser<input name="name" value={form.name} onChange={handleChange} minLength={3} required /></label>
        <label>Artis atau band<input name="artist" value={form.artist} onChange={handleChange} minLength={2} required /></label>
        <label>Kategori<select name="category" value={form.category} onChange={handleChange}><option>Lokal</option><option>Internasional</option></select></label>
        <label>Tanggal<input type="date" name="date" value={form.date} onChange={handleChange} required /></label>
        <label>Waktu<input type="time" name="time" value={form.time} onChange={handleChange} /></label>
        <label>Lokasi dan kota<input name="location" value={form.location} onChange={handleChange} minLength={3} required /></label>
        <label>Harga tiket mulai (Rp)<input type="number" name="ticketPrice" min="0" value={form.ticketPrice} onChange={handleChange} required /></label>
        <label>Jadwal pre-sale<input type="date" name="preSale" value={form.preSale} onChange={handleChange} /></label>
        <label>Jadwal general sale<input type="date" name="generalSale" value={form.generalSale} onChange={handleChange} /></label>
        <label>Status tiket<select name="status" value={form.status} onChange={handleChange}><option>Tersedia</option><option>Segera hadir</option><option>Habis</option></select></label>
        <label className="full-width">Deskripsi<textarea name="description" value={form.description} onChange={handleChange} rows="3" /></label>
        <div className="form-actions full-width">
          <button className="submit-button" type="submit" disabled={submitting}>
            {submitting ? 'Menyimpan...' : 'Simpan perubahan'}
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}

function ConcertManageSection({ konser, onUpdateKonser, onDeleteKonser }) {
  const [editingConcert, setEditingConcert] = useState(null)
  const [confirmDeleteConcert, setConfirmDeleteConcert] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function handleConfirmDelete() {
    if (!confirmDeleteConcert) return
    setDeleting(true)
    const success = await onDeleteKonser(confirmDeleteConcert)
    setDeleting(false)
    if (success) {
      if (editingConcert?.id === confirmDeleteConcert.id) {
        setEditingConcert(null)
      }
      setConfirmDeleteConcert(null)
    }
  }

  return (
    <section className="manage-section" id="kelola-konser">
      <p className="eyebrow">KELOLA DATA KONSER</p>
      <h2>Ubah atau hapus jadwal</h2>
      <p className="form-intro">Pilih konser dari daftar di bawah ini untuk memperbarui informasi atau menghapusnya.</p>

      {konser.length === 0 ? (
        <p className="empty-state">Belum ada data konser untuk dikelola.</p>
      ) : (
        <div className="manage-list">
          {konser.map((item) => (
            <div key={item.id} className="manage-item">
              <div className="manage-info">
                <strong>{item.name}</strong>
                <span>{item.artist} · {item.date} · {item.status}</span>
              </div>
              <div className="manage-actions">
                <button
                  type="button"
                  className="action-button"
                  onClick={() => {
                    setConfirmDeleteConcert(null)
                    setEditingConcert(item)
                  }}
                >
                  Ubah
                </button>
                <button
                  type="button"
                  className="action-button delete"
                  onClick={() => {
                    setEditingConcert(null)
                    setConfirmDeleteConcert(item)
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDeleteConcert && (
        <div className="confirm-box" role="alertdialog" aria-labelledby="confirm-delete-title">
          <p id="confirm-delete-title">
            Apakah kamu yakin ingin menghapus konser <strong>&ldquo;{confirmDeleteConcert.name}&rdquo;</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="form-actions">
            <button
              type="button"
              className="confirm-delete-button"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? 'Menghapus...' : 'Ya, hapus konser'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setConfirmDeleteConcert(null)}
              disabled={deleting}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {editingConcert && (
        <EditConcertPanel
          key={editingConcert.id}
          concert={editingConcert}
          onUpdateKonser={onUpdateKonser}
          onCancel={() => setEditingConcert(null)}
        />
      )}
    </section>
  )
}

export default ConcertManageSection

