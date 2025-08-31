import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../client'
import CreatorForm from '../components/CreatorForm'

async function uploadImageIfAny(file, name) {
  if (!file) return null
  const ext = file.name.split('.').pop()
  const safeName = name.replace(/\s+/g, '-').toLowerCase()
  const path = `creator-${safeName}-${crypto.randomUUID()}.${ext}`
  const { error: upErr } = await supabase.storage.from('creators').upload(path, file, { upsert: false })
  if (upErr) throw upErr
  const { data } = supabase.storage.from('creators').getPublicUrl(path)
  return data.publicUrl
}

export default function EditCreator() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase.from('creators').select('*').eq('id', id).single()
      if (!ignore) {
        if (error) setError(error.message)
        setCreator(data ?? null)
        setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [id])

  async function handleSubmit(values) {
    if (submitting) return
    try {
      setSubmitting(true)
      setError(null)

      // If a new file was chosen, upload it; otherwise keep existing or use typed URL
      const uploadedUrl = values.file
        ? await uploadImageIfAny(values.file, values.name.trim())
        : null

      const imageURL =
        uploadedUrl ??
        (values.imageURL?.trim() || creator?.imageURL || null)

      const payload = {
        name: values.name.trim(),
        url: values.url.trim(),
        description: values.description.trim(),
        imageURL
      }

      const { error } = await supabase.from('creators').update(payload).eq('id', id)
      if (error) throw error

      navigate(`/creator/${id}`)
    } catch (e) {
      console.error(e)
      setError(e.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this creator?')) return
    try {
      const { error } = await supabase.from('creators').delete().eq('id', id)
      if (error) throw error
      navigate('/')
    } catch (e) {
      console.error(e)
      alert(e.message || 'Delete failed')
    }
  }

  if (loading) return <p>Loading…</p>
  if (error) return <p style={{ color: 'tomato' }}>{error}</p>
  if (!creator) return <p>Not found.</p>

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <h2>Edit Creator</h2>
      <CreatorForm initialValues={creator} onSubmit={handleSubmit} submitting={submitting} />
      <div>
        <button onClick={handleDelete} style={{ background: '#ef4444', color: 'white' }} disabled={submitting}>
          Delete
        </button>
      </div>
    </section>
  )
}
