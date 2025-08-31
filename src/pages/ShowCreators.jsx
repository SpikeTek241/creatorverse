import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../client.js'
import CreatorCard from '../components/CreatorCard.jsx'

export default function ShowCreators() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // prevent double-running in React 18 StrictMode (dev)
  const ranRef = useRef(false)
  const channelRef = useRef(null)

  async function load() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setCreators(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    // initial fetch
    load()

    // one realtime subscription for this page
    if (!channelRef.current) {
      channelRef.current = supabase
        .channel('creators_once')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'creators' },
          () => load()
        )
        .subscribe()
    }

    // cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [])

  if (loading) return <p>Loading creators…</p>
  if (error) return <p style={{ color: 'tomato' }}>Error: {error}</p>

  if (!creators.length) {
    return (
      <section>
        <p>No creators yet. Add your first one.</p>
        <Link to="/new" role="button">Add Creator</Link>
      </section>
    )
  }

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16
      }}
    >
      {creators.map((c) => (
        <CreatorCard key={c.id} creator={c} />
      ))}
    </section>
  )
}
