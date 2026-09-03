import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import DestinationPage from './pages/DestinationPage';
import ChatBot from './components/chatbot/ChatBot';
import './styles/globals.css';
import './styles/animations.css';

function NotFound() {
  return (
    <main
      id="main-content"
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem',
        paddingTop: '80px',
      }}
    >
      <div style={{ fontSize: '4rem' }}>🌍</div>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800 }}>
        404 — Page Not Found
      </h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Looks like this destination doesn't exist.
      </p>
      <a href="/" className="btn btn-primary">← Back Home</a>
    </main>
  );
}

// Global chatbot — only on non-destination pages
// (destination page renders its own context-aware chatbot)
function GlobalChatBot() {
  const { pathname } = useLocation();
  const isDestinationPage = pathname.startsWith('/destination/');
  if (isDestinationPage) return null;
  return <ChatBot />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/destination/:id" element={<DestinationPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />

      <GlobalChatBot />
    </BrowserRouter>
  );
}
