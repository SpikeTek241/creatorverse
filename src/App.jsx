import { Link, useRoutes } from 'react-router-dom'
import ShowCreators from './pages/ShowCreators.jsx'
import ViewCreator from './pages/ViewCreator.jsx'
import AddCreator from './pages/AddCreator.jsx'
import EditCreator from './pages/EditCreator.jsx'

export default function App() {
  const element = useRoutes([
    { path: '/', element: <ShowCreators /> },
    { path: '/new', element: <AddCreator /> },
    { path: '/creator/:id', element: <ViewCreator /> },
    { path: '/creator/:id/edit', element: <EditCreator /> },
  ])

  return (
    <main className="container">
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '1rem 0' }}>
        <h1 style={{ margin: 0 }}>Creatorverse</h1>
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/new">Add Creator</Link>
        </nav>
      </header>
      {element}
    </main>
  )
}
