import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LayoutDashboard, Folder, LogOut, Moon, Sun, Zap } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: Folder, label: 'Projects' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-nav sticky top-0 z-40"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>

          {/* Left: Brand + Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            {/* Brand */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '38px', height: '38px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
                }}
              >
                <Zap style={{ width: '20px', height: '20px', color: 'white' }} />
              </motion.div>
              <span style={{
                fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                TaskFlow
              </span>
            </Link>

            {/* Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} style={{ position: 'relative', textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 1rem', borderRadius: '12px',
                      fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.02em',
                      color: isActive(link.path)
                        ? '#6366f1'
                        : darkMode ? '#94a3b8' : '#64748b',
                      transition: 'color 0.2s'
                    }}
                  >
                    <link.icon style={{ width: '18px', height: '18px' }} />
                    {link.label}
                  </motion.div>
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeTab"
                      style={{
                        position: 'absolute', bottom: '-1px', left: '12px', right: '12px',
                        height: '2px', borderRadius: '2px',
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Theme + User + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Dark mode */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              style={{
                padding: '0.625rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: darkMode ? '#1e293b' : '#f1f5f9',
                color: darkMode ? '#facc15' : '#475569',
                transition: 'background 0.2s, color 0.2s'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={darkMode ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {darkMode ? <Sun style={{ width: '18px', height: '18px' }} /> : <Moon style={{ width: '18px', height: '18px' }} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* User badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.375rem 0.875rem 0.375rem 0.5rem', borderRadius: '12px',
              background: darkMode ? 'rgba(30,41,59,0.6)' : 'rgba(241,245,249,0.8)',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: 'white', position: 'relative',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              }}>
                {user.username?.charAt(0).toUpperCase()}
                <span style={{
                  position: 'absolute', top: '-2px', right: '-2px',
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: '#34d399',
                  border: `2px solid ${darkMode ? '#0f172a' : '#f1f5f9'}`
                }} />
              </div>
              <div>
                <p style={{
                  fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2,
                  color: darkMode ? '#e2e8f0' : '#1e293b', letterSpacing: '0.02em'
                }}>
                  {user.username}
                </p>
                <p style={{
                  fontSize: '0.625rem', fontWeight: 700, color: '#6366f1',
                  textTransform: 'uppercase', letterSpacing: '0.1em'
                }}>
                  {user.role}
                </p>
              </div>
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              style={{
                padding: '0.625rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: 'transparent',
                color: darkMode ? '#64748b' : '#94a3b8',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f43f5e'}
              onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? '#64748b' : '#94a3b8'}
            >
              <LogOut style={{ width: '18px', height: '18px' }} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
