import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function AddCreator() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(values) {
    if (submitting) return
    try {
      setSubmitting(true)
      setError(null)

      const imageURL = values.file
        ? await uploadImageIfAny(values.file, values.name.trim())
        : (values.imageURL?.trim() || null)

      const payload = {
        name: values.name.trim(),
        url: values.url.trim(),
        description: values.description.trim(),
        imageURL
      }

      const { data, error } = await supabase
        .from('creators')
        .insert([payload])
        .select()
        .single()
      if (error) throw error

      navigate(`/creator/${data.id}`)
    } catch (e) {
      console.error(e)
      setError(e.message || 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h2>Add Creator</h2>
      {error && <p style={{ color: 'tomato' }}>{error}</p>}
      <CreatorForm onSubmit={handleSubmit} submitting={submitting} />
    </section>
  )
}
