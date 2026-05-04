import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../api/axios';
import { Plus, ArrowLeft, X, Calendar, Trash2 } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', dueDate: '' });

  useEffect(() => { load(); }, [id]);
  const load = async () => {
    try {
      const [p, t] = await Promise.all([api.get(`/projects/${id}`), api.get(`/tasks?project=${id}`)]);
      setProject(p.data); setTasks(t.data);
    } catch (e) { console.error(e); }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, project: id };
      if (!payload.dueDate) delete payload.dueDate;
      await api.post('/tasks', payload);
      setShowModal(false); setForm({ title: '', description: '', priority: 'Medium', dueDate: '' }); load();
    } catch (e) { console.error(e); }
  };
  const handleStatus = async (taskId, s) => {
    try { await api.put(`/tasks/${taskId}`, { status: s }); load(); } catch (e) { console.error(e); }
  };
  const handleDelete = async (taskId) => {
    try { await api.delete(`/tasks/${taskId}`); load(); } catch (e) { console.error(e); }
  };

  const dm = darkMode;
  const cardBg = dm ? '#16161e' : '#fff';
  const border = dm ? '#1e1e2e' : '#ecedf1';
  const txt = dm ? '#e4e4ee' : '#1a1a2e';
  const txtSub = dm ? '#6b6b84' : '#8b8fa3';
  const colBg = dm ? '#111119' : '#f4f5f7';
  const inputBg = dm ? '#0c0c14' : '#f8f9fb';
  const inputStyle = {
    width: '100%', padding: '10px 14px', fontSize: '14px',
    borderRadius: '10px', border: `1.5px solid ${border}`,
    background: inputBg, color: txt, outline: 'none', fontFamily: 'inherit',
  };

  if (!project) return <div style={{ padding: '40px', color: txtSub }}>Loading...</div>;

  const columns = [
    { key: 'Todo', label: 'To do', dot: '#6366f1' },
    { key: 'In Progress', label: 'In progress', dot: '#d97706' },
    { key: 'Completed', label: 'Done', dot: '#16a34a' },
  ];

  const priorityDot = (p) => p === 'High' ? '#dc2626' : p === 'Medium' ? '#d97706' : '#16a34a';

  return (
    <div style={{ padding: '32px 44px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <Link to="/projects" style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          fontSize: '13px', fontWeight: 500, color: txtSub, textDecoration: 'none',
          marginBottom: '14px',
        }}>
          <ArrowLeft size={14} /> Back to projects
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: txt, letterSpacing: '-0.4px' }}>
              {project.title}
            </h1>
            <p style={{ fontSize: '14px', color: txtSub, marginTop: '4px', maxWidth: '600px', lineHeight: 1.6 }}>
              {project.description}
            </p>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 18px', fontSize: '14px', fontWeight: 600,
            borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: '#fff', fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(79,70,229,0.25)',
          }}>
            <Plus size={16} /> Add task
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div key={col.key}>
              {/* Column header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '12px', padding: '0 2px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: col.dot, display: 'inline-block',
                  }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: txt }}>{col.label}</span>
                </div>
                <span style={{
                  fontSize: '12px', fontWeight: 600, color: txtSub,
                  background: dm ? '#1e1e2e' : '#ecedf1', padding: '2px 9px', borderRadius: '8px',
                }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Column body */}
              <div style={{
                background: colBg, borderRadius: '12px', padding: '8px',
                minHeight: '420px', display: 'flex', flexDirection: 'column', gap: '8px',
              }}>
                {colTasks.map(task => (
                  <div key={task._id} style={{
                    background: cardBg, border: `1px solid ${border}`,
                    borderRadius: '10px', padding: '14px 16px',
                    transition: 'box-shadow 0.15s, transform 0.15s', cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 14px ${dm ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.07)'}` ; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    {/* Priority + delete */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: priorityDot(task.priority),
                        }} />
                        <span style={{ fontSize: '12px', fontWeight: 500, color: txtSub }}>{task.priority}</span>
                      </div>
                      {user?.role === 'Admin' && (
                        <button onClick={() => handleDelete(task._id)} style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: txtSub, opacity: 0.4, padding: '2px', display: 'flex',
                          transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.color = txtSub; }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <p style={{ fontSize: '14px', fontWeight: 600, color: txt, lineHeight: 1.4, marginBottom: '4px' }}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p style={{
                        fontSize: '13px', color: txtSub, lineHeight: 1.5, marginBottom: '10px',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {task.description}
                      </p>
                    )}

                    {task.dueDate && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        fontSize: '12px', marginBottom: '12px', fontWeight: 500,
                        color: new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? '#dc2626' : txtSub,
                      }}>
                        <Calendar size={13} />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {new Date(task.dueDate) < new Date() && task.status !== 'Completed' && ' · Overdue'}
                      </div>
                    )}

                    {/* Status buttons */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {columns.map(c => {
                        const active = task.status === c.key;
                        return (
                          <button key={c.key} onClick={() => handleStatus(task._id, c.key)} style={{
                            flex: 1, padding: '5px', fontSize: '11px', fontWeight: 600,
                            borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                            background: active ? c.dot : (dm ? '#1e1e2e' : '#ecedf1'),
                            color: active ? '#fff' : txtSub,
                            transition: 'all 0.15s',
                          }}>
                            {c.label}
                          </button>
                        );
                      })}
                    </div>

                    {task.assignedTo && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '7px', marginTop: '12px',
                        paddingTop: '10px', borderTop: `1px solid ${border}`,
                      }}>
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: 700, color: '#fff',
                        }}>
                          {task.assignedTo.username?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: txtSub }}>
                          {task.assignedTo.username}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div style={{
                    padding: '40px 12px', textAlign: 'center',
                    color: dm ? '#2a2a3d' : '#c5c7d0', fontSize: '13px', fontWeight: 500,
                  }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: txt }}>New task</h2>
              <button onClick={() => setShowModal(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: txtSub, display: 'flex',
              }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: txt, marginBottom: '7px' }}>Title</label>
                  <input type="text" required placeholder="What needs to be done?" value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: txt, marginBottom: '7px' }}>Description</label>
                  <textarea rows={2} placeholder="Optional details" value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: txt, marginBottom: '7px' }}>Priority</label>
                    <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                      style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: txt, marginBottom: '7px' }}>Due date</label>
                    <input type="date" value={form.dueDate}
                      onChange={e => setForm({...form, dueDate: e.target.value})} style={inputStyle} />
                  </div>
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
                  }}>Create task</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
