import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../api/axios';
import { CheckCircle, Clock, AlertTriangle, ListTodo, ArrowRight, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [t, p] = await Promise.all([api.get('/tasks'), api.get('/projects')]);
        setTasks(t.data); setProjects(p.data);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const dm = darkMode;
  const cardBg = dm ? '#16161e' : '#fff';
  const border = dm ? '#1e1e2e' : '#ecedf1';
  const txt = dm ? '#e4e4ee' : '#1a1a2e';
  const txtSub = dm ? '#6b6b84' : '#8b8fa3';
  const rowHover = dm ? '#1a1a28' : '#f8f9fb';

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length,
  };
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statCards = [
    { label: 'Total tasks', val: stats.total, icon: ListTodo, color: '#4f46e5', bg: dm ? 'rgba(79,70,229,0.1)' : '#eef2ff' },
    { label: 'Completed', val: stats.completed, icon: CheckCircle, color: '#16a34a', bg: dm ? 'rgba(22,163,74,0.1)' : '#f0fdf4' },
    { label: 'In progress', val: stats.inProgress, icon: Clock, color: '#d97706', bg: dm ? 'rgba(217,119,6,0.1)' : '#fffbeb' },
    { label: 'Overdue', val: stats.overdue, icon: AlertTriangle, color: '#dc2626', bg: dm ? 'rgba(220,38,38,0.1)' : '#fef2f2' },
  ];

  const priorityBadge = (p) => {
    const map = { High: { bg: '#fef2f2', text: '#dc2626', dbg: 'rgba(220,38,38,0.12)', dt: '#f87171' },
      Medium: { bg: '#fffbeb', text: '#d97706', dbg: 'rgba(217,119,6,0.12)', dt: '#fbbf24' },
      Low: { bg: '#f0fdf4', text: '#16a34a', dbg: 'rgba(22,163,74,0.12)', dt: '#4ade80' } };
    const c = map[p] || map.Low;
    return { background: dm ? c.dbg : c.bg, color: dm ? c.dt : c.text };
  };

  const statusBadge = (s) => {
    if (s === 'Completed') return { background: dm ? 'rgba(22,163,74,0.12)' : '#f0fdf4', color: dm ? '#4ade80' : '#16a34a' };
    if (s === 'In Progress') return { background: dm ? 'rgba(217,119,6,0.12)' : '#fffbeb', color: dm ? '#fbbf24' : '#d97706' };
    return { background: dm ? '#1e1e2e' : '#f3f4f6', color: dm ? '#6b6b84' : '#6b7280' };
  };

  return (
    <div style={{ padding: '36px 44px', maxWidth: '1120px' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: txt, letterSpacing: '-0.4px' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.username} 👋
        </h1>
        <p style={{ fontSize: '14px', color: txtSub, marginTop: '4px' }}>
          Here's what's happening across your projects today.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            padding: '20px', borderRadius: '14px', background: cardBg,
            border: `1px solid ${border}`, transition: 'box-shadow 0.2s',
            cursor: 'default',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 16px ${dm ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)'}`}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <s.icon size={20} color={s.color} />
            </div>
            <p style={{ fontSize: '30px', fontWeight: 800, color: txt, letterSpacing: '-1px', lineHeight: 1 }}>
              {s.val}
            </p>
            <p style={{ fontSize: '13px', color: txtSub, marginTop: '6px', fontWeight: 500 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{
        padding: '20px 24px', borderRadius: '14px', background: cardBg,
        border: `1px solid ${border}`, marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '20px',
      }}>
        <TrendingUp size={20} color="#4f46e5" />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: txt }}>Overall progress</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#4f46e5' }}>{pct}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: dm ? '#1e1e2e' : '#ecedf1' }}>
            <div style={{
              height: '100%', borderRadius: '4px', width: `${pct}%`,
              background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Grid: Tasks + Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Tasks table */}
        <div style={{ borderRadius: '14px', background: cardBg, border: `1px solid ${border}`, overflow: 'hidden' }}>
          <div style={{
            padding: '16px 22px', borderBottom: `1px solid ${border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: txt }}>Recent tasks</span>
            <span style={{ fontSize: '12px', color: txtSub, fontWeight: 500 }}>
              {tasks.length} total
            </span>
          </div>
          {tasks.length === 0 ? (
            <div style={{ padding: '50px', textAlign: 'center' }}>
              <ListTodo size={40} color={dm ? '#2a2a3d' : '#d1d5db'} style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: '14px', fontWeight: 500, color: txtSub }}>No tasks yet</p>
              <p style={{ fontSize: '13px', color: dm ? '#3a3a50' : '#c5c7d0', marginTop: '4px' }}>
                Create a project and add your first task
              </p>
            </div>
          ) : (
            tasks.slice(0, 7).map((task, i) => (
              <div key={task._id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 22px',
                borderBottom: i < Math.min(tasks.length, 7) - 1 ? `1px solid ${border}` : 'none',
                cursor: 'default', transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = rowHover}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ flex: 1, minWidth: 0, marginRight: '16px' }}>
                  <p style={{
                    fontSize: '14px', fontWeight: 500, color: txt,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {task.title}
                  </p>
                  <p style={{ fontSize: '12px', color: txtSub, marginTop: '2px' }}>{task.project?.title}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px',
                    ...priorityBadge(task.priority),
                  }}>
                    {task.priority}
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px',
                    ...statusBadge(task.status),
                  }}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Projects */}
        <div style={{ borderRadius: '14px', background: cardBg, border: `1px solid ${border}`, overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{
            padding: '16px 22px', borderBottom: `1px solid ${border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: txt }}>Projects</span>
            <Link to="/projects" style={{
              fontSize: '13px', fontWeight: 600, color: '#6366f1', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {projects.length === 0 ? (
            <div style={{ padding: '36px 22px', textAlign: 'center', fontSize: '14px', color: txtSub }}>
              No projects yet.
            </div>
          ) : (
            projects.slice(0, 5).map((proj, i) => {
              const pt = tasks.filter(t => t.project?._id === proj._id);
              const done = pt.filter(t => t.status === 'Completed').length;
              const total = pt.length;
              const p = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <Link key={proj._id} to={`/projects/${proj._id}`} style={{
                  display: 'block', padding: '14px 22px', textDecoration: 'none',
                  borderBottom: i < Math.min(projects.length, 5) - 1 ? `1px solid ${border}` : 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = rowHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: txt }}>{proj.title}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: p === 100 ? '#16a34a' : txtSub }}>{p}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', borderRadius: '3px', background: dm ? '#1e1e2e' : '#ecedf1' }}>
                    <div style={{
                      height: '100%', borderRadius: '3px', width: `${p}%`,
                      background: p === 100 ? '#16a34a' : 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                  <p style={{ fontSize: '12px', color: txtSub, marginTop: '6px' }}>
                    {total} tasks · {proj.members?.length || 0} members
                  </p>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
