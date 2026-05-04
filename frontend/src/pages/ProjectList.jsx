import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../api/axios';
import { Plus, X, Folder, Users, Trash2 } from 'lucide-react';

const ProjectList = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });

  useEffect(() => { load(); }, []);
  const load = async () => {
    try { const { data } = await api.get('/projects'); setProjects(data); } catch (e) { console.error(e); }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    try { await api.post('/projects', form); setShowModal(false); setForm({ title: '', description: '' }); load(); } catch (e) { console.error(e); }
  };
  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await api.delete(`/projects/${id}`); load(); } catch (e) { console.error(e); }
  };

  const dm = darkMode;
  const cardBg = dm ? '#16161e' : '#fff';
  const border = dm ? '#1e1e2e' : '#ecedf1';
  const txt = dm ? '#e4e4ee' : '#1a1a2e';
  const txtSub = dm ? '#6b6b84' : '#8b8fa3';
  const inputBg = dm ? '#0c0c14' : '#f8f9fb';
  const hoverBg = dm ? '#1a1a28' : '#f8f9fb';

  const inputStyle = {
    width: '100%', padding: '10px 14px', fontSize: '14px',
    borderRadius: '10px', border: `1.5px solid ${border}`,
    background: inputBg, color: txt, outline: 'none', fontFamily: 'inherit',
  };

  const gradients = [
    'linear-gradient(135deg, #4f46e5, #7c3aed)',
    'linear-gradient(135deg, #0891b2, #06b6d4)',
    'linear-gradient(135deg, #059669, #10b981)',
    'linear-gradient(135deg, #d97706, #f59e0b)',
    'linear-gradient(135deg, #dc2626, #f43f5e)',
    'linear-gradient(135deg, #7c3aed, #a855f7)',
  ];

  return (
    <div style={{ padding: '36px 44px', maxWidth: '1120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: txt, letterSpacing: '-0.4px' }}>Projects</h1>
          <p style={{ fontSize: '14px', color: txtSub, marginTop: '4px' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace
          </p>
        </div>
        {user?.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 18px', fontSize: '14px', fontWeight: 600,
            borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: '#fff', fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(79,70,229,0.25)',
          }}>
            <Plus size={16} /> New project
          </button>
        )}
      </div>

      {/* Project cards grid */}
      {projects.length === 0 ? (
        <div style={{
          padding: '60px', textAlign: 'center', borderRadius: '14px',
          background: cardBg, border: `1px solid ${border}`,
        }}>
          <Folder size={44} color={dm ? '#2a2a3d' : '#d1d5db'} style={{ margin: '0 auto 14px' }} />
          <p style={{ fontSize: '15px', fontWeight: 500, color: txtSub }}>No projects yet</p>
          <p style={{ fontSize: '13px', color: dm ? '#3a3a50' : '#c5c7d0', marginTop: '4px' }}>
            {user?.role === 'Admin' ? 'Create your first project to get started' : 'No projects assigned to you'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {projects.map((proj, i) => (
            <div key={proj._id} style={{
              borderRadius: '14px', background: cardBg, border: `1px solid ${border}`,
              overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px ${dm ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}` ; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              {/* Color accent bar */}
              <div style={{ height: '4px', background: gradients[i % gradients.length] }} />

              <div style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: gradients[i % gradients.length], display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Folder size={18} color="#fff" />
                  </div>
                  {user?.role === 'Admin' && (
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(proj._id); }} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: txtSub, padding: '4px', borderRadius: '6px',
                      opacity: 0.5, transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = txtSub; }}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 600, color: txt, marginBottom: '4px' }}>
                  {proj.title}
                </h3>
                <p style={{
                  fontSize: '13px', color: txtSub, lineHeight: 1.5, marginBottom: '16px',
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {proj.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: txtSub }}>
                    <Users size={14} /> {proj.members?.length || 0} members
                  </div>
                  <Link to={`/projects/${proj._id}`} onClick={e => e.stopPropagation()} style={{
                    fontSize: '13px', fontWeight: 600, color: '#6366f1', textDecoration: 'none',
                  }}>
                    Open →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: dm ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px',
        }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: cardBg, borderRadius: '16px', padding: '28px',
            width: '100%', maxWidth: '440px', border: `1px solid ${border}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: txt }}>New project</h2>
              <button onClick={() => setShowModal(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: txtSub, display: 'flex',
              }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: txt, marginBottom: '7px' }}>Name</label>
                  <input type="text" required placeholder="e.g., Marketing Campaign" value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: txt, marginBottom: '7px' }}>Description</label>
                  <textarea required rows={3} placeholder="What's this project about?" value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{
                    padding: '9px 18px', fontSize: '14px', fontWeight: 500, borderRadius: '10px',
                    border: `1.5px solid ${border}`, background: 'transparent', cursor: 'pointer',
                    color: txtSub, fontFamily: 'inherit',
                  }}>Cancel</button>
                  <button type="submit" style={{
                    padding: '9px 18px', fontSize: '14px', fontWeight: 600, borderRadius: '10px',
                    border: 'none', background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                    color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 2px 8px rgba(79,70,229,0.25)',
                  }}>Create project</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
