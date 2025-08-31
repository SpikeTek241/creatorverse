import { useEffect, useState } from 'react'

function looksLikeUrl(s) {
  if (!s) return true
  try { new URL(s); return true } catch { return false }
}

export default function CreatorForm({ initialValues, onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: '',
    url: '',
    description: '',
    imageURL: '',
    file: null, // new field for uploads
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name ?? '',
        url: initialValues.url ?? '',
        description: initialValues.description ?? '',
        imageURL: initialValues.imageURL ?? '',
        file: null, // reset file when editing
      })
    }
  }, [initialValues])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.url.trim() || !form.description.trim()) {
      setError('Name, URL, and description are required.')
      return
    }
    if (!looksLikeUrl(form.url)) {
      setError('Enter a valid URL including https://')
      return
    }
    if (form.imageURL && !looksLikeUrl(form.imageURL)) {
      setError('Image URL must be a valid URL or leave blank.')
      return
    }

    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
      {error && <p style={{ color: 'tomato', marginBottom: 0 }}>{error}</p>}

      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Creator name"
          required
        />
      </label>

      <label>
        URL
        <input
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="https://..."
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What they make"
          required
        />
      </label>

      <label>
        Image URL (optional)
        <input
          name="imageURL"
          value={form.imageURL}
          onChange={handleChange}
          placeholder="https://.../img.jpg"
        />
      </label>

      <label>
        Upload Image (optional)
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            setForm((f) => ({ ...f, file }))
          }}
        />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
