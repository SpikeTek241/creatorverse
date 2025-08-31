const base = import.meta.env.VITE_SUPABASE_URL
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY
const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  // returns minimal or representation (we want JSON rows back on write)
  Prefer: 'return=representation',
}

// READ all
export async function fetchCreators() {
  const res = await fetch(`${base}/rest/v1/creators?select=*&order=created_at.desc`, { headers })
  if (!res.ok) throw new Error('Failed to load creators')
  return res.json()
}

// READ one
export async function fetchCreator(id) {
  const res = await fetch(`${base}/rest/v1/creators?id=eq.${id}&select=*`, { headers })
  if (!res.ok) throw new Error('Failed to load creator')
  const rows = await res.json()
  return rows[0] || null
}

// CREATE
export async function createCreator(payload) {
  const res = await fetch(`${base}/rest/v1/creators`, {
    method: 'POST', headers, body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create')
  const rows = await res.json()
  return rows[0]
}

// UPDATE
export async function updateCreator(id, payload) {
  const res = await fetch(`${base}/rest/v1/creators?id=eq.${id}`, {
    method: 'PATCH', headers, body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to update')
  const rows = await res.json()
  return rows[0]
}

// DELETE
export async function deleteCreator(id) {
  const res = await fetch(`${base}/rest/v1/creators?id=eq.${id}`, {
    method: 'DELETE', headers,
  })
  if (!res.ok) throw new Error('Failed to delete')
  return true
}
