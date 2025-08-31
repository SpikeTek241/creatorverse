import { Link } from 'react-router-dom'

export default function CreatorCard({ creator }) {
  const { id, name, url, description, imageURL } = creator
  const fallback = 'https://placehold.co/600x400/0f172a/94a3b8?text=Creatorverse'


  return (
    <article style={{ border: '1px solid #334155', borderRadius: 12, padding: 16, background: '#0b1223' }}>
      <img
        src={imageURL || fallback}
        alt={name}
        style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
      />
      <h3 style={{ margin: '0 0 .25rem' }}>
        <Link to={`/creator/${id}`}>{name}</Link>
      </h3>
      <p style={{ margin: '0 0 .5rem', color: '#94a3b8' }}>{description}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <a href={url} target="_blank" rel="noreferrer">Visit</a>
        <Link to={`/creator/${id}/edit`}>Edit</Link>
      </div>
    </article>
  )
}
