import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Eye, EyeOff, Moon, Sun, Zap, CheckCircle, Users, BarChart3 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [isReg, setIsReg] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (isReg) await register(username, email, password, role);
      else await login(email, password);
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  const dm = darkMode;
  const panelBg = dm ? '#111119' : '#fff';
  const heroBg = dm ? '#0c0c14' : '#f0eef6';
  const border = dm ? '#1e1e2e' : '#e5e3ee';
  const txt = dm ? '#e4e4ee' : '#1a1a2e';
  const txtSub = dm ? '#8888a2' : '#6b6b84';
  const inputBg = dm ? '#0c0c14' : '#f8f9fb';

  const inputStyle = {
    width: '100%', padding: '11px 14px', fontSize: '14px', lineHeight: 1.5,
    borderRadius: '10px', border: `1.5px solid ${border}`, background: inputBg,
    color: txt, outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const features = [
    { icon: CheckCircle, title: 'Task tracking', desc: 'Kanban boards, priorities, due dates' },
    { icon: Users, title: 'Team collaboration', desc: 'Assign tasks, manage roles' },
    { icon: BarChart3, title: 'Project insights', desc: 'Track progress across all projects' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left hero panel */}
      <div style={{
        flex: 1, background: heroBg, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle decorative shapes */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px',
          borderRadius: '50%', background: dm ? 'rgba(79,70,229,0.06)' : 'rgba(79,70,229,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-40px', width: '200px', height: '200px',
          borderRadius: '50%', background: dm ? 'rgba(124,58,237,0.05)' : 'rgba(124,58,237,0.06)',
        }} />

        <div style={{ position: 'relative', maxWidth: '420px' }}>
          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
            }}>
              <Zap size={20} color="#fff" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: txt, letterSpacing: '-0.5px' }}>
              TaskFlow
            </span>
          </div>

          <h1 style={{
            fontSize: '36px', fontWeight: 800, color: txt,
            letterSpacing: '-0.8px', lineHeight: 1.2, marginBottom: '16px',
          }}>
            Manage your team's<br />work in one place
          </h1>
          <p style={{ fontSize: '16px', color: txtSub, lineHeight: 1.7, marginBottom: '40px' }}>
            Plan projects, assign tasks, and track progress — all with a simple, 
            intuitive interface your team will actually enjoy using.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: dm ? 'rgba(79,70,229,0.12)' : 'rgba(79,70,229,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <f.icon size={18} color="#6366f1" />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: txt, marginBottom: '2px' }}>
                    {f.title}
                  </p>
                  <p style={{ fontSize: '13px', color: txtSub, lineHeight: 1.5 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        width: '480px', flexShrink: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 50px',
        background: panelBg, borderLeft: `1px solid ${border}`,
      }}>
        {/* Theme toggle */}
        <button onClick={toggleDarkMode} style={{
          position: 'absolute', top: '20px', right: '20px', background: 'none',
          border: `1px solid ${border}`, borderRadius: '8px', padding: '7px',
          cursor: 'pointer', color: txtSub, display: 'flex',
        }}>
          {dm ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <h2 style={{
          fontSize: '22px', fontWeight: 700, color: txt,
          letterSpacing: '-0.3px', marginBottom: '6px',
        }}>
          {isReg ? 'Create your account' : 'Welcome back'}
        </h2>
        <p style={{ fontSize: '14px', color: txtSub, marginBottom: '28px' }}>
          {isReg ? 'Start managing projects with your team' : 'Log in to continue to TaskFlow'}
        </p>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: '8px', marginBottom: '16px',
            background: dm ? 'rgba(239,68,68,0.1)' : '#fef2f2',
            border: `1px solid ${dm ? 'rgba(239,68,68,0.2)' : '#fecaca'}`,
            color: '#ef4444', fontSize: '13px', fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {isReg && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: txt, marginBottom: '7px' }}>
                  Full name
                </label>
                <input type="text" required placeholder="John Doe" value={username}
                  onChange={e => setUsername(e.target.value)} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = border; e.target.style.boxShadow = 'none'; }} />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: txt, marginBottom: '7px' }}>
                Email address
              </label>
              <input type="email" required placeholder="you@company.com" value={email}
                onChange={e => setEmail(e.target.value)} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = border; e.target.style.boxShadow = 'none'; }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: txt, marginBottom: '7px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} required placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '42px' }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = border; e.target.style.boxShadow = 'none'; }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: txtSub, display: 'flex',
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isReg && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: txt, marginBottom: '7px' }}>
                  Role
                </label>
                <select value={role} onChange={e => setRole(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '11px', fontSize: '14px', fontWeight: 600,
              borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              color: '#fff', fontFamily: 'inherit', marginTop: '4px',
              opacity: loading ? 0.6 : 1, boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
              transition: 'opacity 0.2s, transform 0.1s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              {loading ? 'Please wait...' : (isReg ? 'Create account' : 'Log in')}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: txtSub }}>
          {isReg ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => { setIsReg(!isReg); setError(''); }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6366f1', fontWeight: 600, fontSize: '13px', fontFamily: 'inherit',
          }}>
            {isReg ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
