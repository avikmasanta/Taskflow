import { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LayoutDashboard, Folder, LogOut, Moon, Sun, Zap, ChevronRight } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  const dm = darkMode;
  const sidebarBg = dm ? '#111119' : '#fff';
  const borderClr = dm ? '#1e1e2e' : '#ecedf1';
  const mainBg = dm ? '#0c0c14' : '#f8f9fb';
  const txtPrimary = dm ? '#e4e4ee' : '#1a1a2e';
  const txtMuted = dm ? '#6b6b84' : '#8b8fa3';
  const hoverBg = dm ? '#1a1a28' : '#f3f4f8';
  const activeBg = dm ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.06)';
  const activeText = dm ? '#a5b4fc' : '#4f46e5';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside style={{
        width: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: sidebarBg, borderRight: `1px solid ${borderClr}`,
      }}>
        {/* Brand */}
        <div style={{ padding: '24px 20px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
          }}>
            <Zap size={17} color="#fff" />
          </div>
          <span style={{ fontSize: '17px', fontWeight: 800, color: txtPrimary, letterSpacing: '-0.4px' }}>
            TaskFlow
          </span>
        </div>

        {/* Section label */}
        <div style={{
          padding: '0 20px', marginBottom: '6px', marginTop: '8px',
          fontSize: '11px', fontWeight: 600, color: txtMuted,
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          Menu
        </div>

        {/* Nav */}
        <nav style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {[
            { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
            { to: '/projects', icon: Folder, label: 'Projects' },
          ].map(item => (
            <NavLink key={item.to} to={item.to} end={item.end} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '9px', textDecoration: 'none',
              fontSize: '14px', fontWeight: isActive ? 600 : 500,
              color: isActive ? activeText : txtMuted,
              background: isActive ? activeBg : 'transparent',
              transition: 'all 0.15s ease',
            })}>
              <item.icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {/* no extra elements */}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: `1px solid ${borderClr}` }}>
          <button onClick={toggleDarkMode} style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
            padding: '9px 12px', borderRadius: '9px', border: 'none',
            background: 'transparent', cursor: 'pointer', fontSize: '14px',
            fontWeight: 500, color: txtMuted, fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = hoverBg}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            {dm ? <Sun size={18} /> : <Moon size={18} />}
            {dm ? 'Light mode' : 'Dark mode'}
          </button>

          {/* User card */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '9px', marginTop: '4px',
            background: dm ? '#1a1a28' : '#f3f4f8',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '14px', fontWeight: 700, flexShrink: 0,
            }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '13px', fontWeight: 600, color: txtPrimary, lineHeight: 1.3,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user?.username}
              </p>
              <p style={{ fontSize: '11px', fontWeight: 500, color: txtMuted }}>
                {user?.role}
              </p>
            </div>
            <button onClick={handleLogout} title="Log out" style={{
              background: 'none', border: 'none', cursor: 'pointer', color: txtMuted,
              padding: '4px', borderRadius: '6px', display: 'flex',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = txtMuted}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', background: mainBg }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
