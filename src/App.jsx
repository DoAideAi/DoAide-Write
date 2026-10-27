import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import BlogIndex from './pages/BlogIndex'
import BlogPost from './pages/BlogPost'
import EditorPage from './pages/EditorPage'
import Home from './pages/Home'
import ToolPage from './pages/ToolPage'
import useSEO from './hooks/useSEO'

export default function App() {
  useSEO(useLocation().pathname.replace(/\/+$/, '') || '/')
  return (
    <Routes>
      <Route path="/editor" element={<EditorPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Route>
    </Routes>
  )
}
