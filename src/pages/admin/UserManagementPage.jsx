import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import Toast from '../../components/common/Toast';
import { Users, Shield, ArrowLeft, Phone, User, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.message || 'Failed to load system users.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while connecting to admin services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(userId);
    try {
      const res = await deleteUser(userId);
      if (res.success) {
        setToastType('success');
        setToastMsg(`User "${userName}" deleted successfully.`);
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        setToastType('error');
        setToastMsg(res.message || 'Failed to delete user.');
      }
    } catch (err) {
      console.error(err);
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Error deleting user.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      <div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Control
        </button>
      </div>

      <div className="glass-card p-8 border border-[var(--border-color)]">
        <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-400" />
          User Account Directory
        </h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm md:text-base">Audit system roles, user phone numbers, gender details, email addresses, and registration records.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorBanner message={error} onRetry={fetchUsers} />
      ) : users.length === 0 ? (
        <div className="glass-card p-12 text-center text-[var(--text-muted)] text-xs border border-[var(--border-color)]">
          No users registered in the database.
        </div>
      ) : (
        <div className="glass-card border border-[var(--border-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border-color)] text-xs">
              <thead className="bg-[var(--bg-surface)] text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left">Name</th>
                  <th scope="col" className="px-6 py-4 text-left">Email Address</th>
                  <th scope="col" className="px-6 py-4 text-left">Phone Number</th>
                  <th scope="col" className="px-6 py-4 text-left">Gender</th>
                  <th scope="col" className="px-6 py-4 text-left">System Role</th>
                  <th scope="col" className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] font-semibold text-[var(--text-main)]">
                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--bg-surface)]/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-[var(--text-main)]">{item.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-[var(--text-muted)]">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-emerald-400">
                      {item.phoneNo || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-[var(--text-muted)]">
                      {item.gender || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border
                        ${item.role === 'ADMIN' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : ''}
                        ${item.role === 'PLANNER' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : ''}
                        ${item.role === 'VENDOR' ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : ''}
                        ${item.role === 'CLIENT' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}
                      `}>
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        disabled={deletingId === item.id || item.role === 'ADMIN'}
                        className={`p-2 rounded-lg transition-all ${
                          item.role === 'ADMIN' 
                            ? 'opacity-30 cursor-not-allowed text-[var(--text-muted)]' 
                            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                        title={item.role === 'ADMIN' ? 'Cannot delete admin' : `Delete ${item.name}`}
                      >
                        {deletingId === item.id ? (
                          <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
