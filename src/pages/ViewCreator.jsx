import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../client'

export default function ViewCreator() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from('creators').select('*').eq('id', id).single()
    if (error) setError(error.message)
    setCreator(data ?? null)
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel(`creator-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'creators', filter: `id=eq.${id}` }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [id])

  if (loading) return <p>Loading…</p>
  if (error) return <p style={{ color: 'tomato' }}>Error: {error}</p>
  if (!creator) return <p>Not found.</p>

  const { name, url, description, imageURL } = creator
  const fallback = 'https://placehold.co/800x400?text=Creator'

  return (
    <article style={{ display: 'grid', gap: 12, maxWidth: 780 }}>
      <img
        src={imageURL || fallback}
        alt={name}
        style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 10 }}
      />
      <h2 style={{ margin: 0 }}>{name}</h2>
      <a href={url} target="_blank" rel="noreferrer">Visit Channel</a>
      <p style={{ color: '#94a3b8' }}>{description}</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to={`/creator/${id}/edit`}>Edit</Link>
        <button onClick={() => navigate(-1)} type="button">Back</button>
      </div>
    </article>
  )
}
