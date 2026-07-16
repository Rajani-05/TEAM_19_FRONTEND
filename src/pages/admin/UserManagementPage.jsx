import React, { useState, useEffect } from 'react';
import { getUsers } from '../../api/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBanner from '../../components/common/ErrorBanner';
import { Users, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-650 hover:text-slate-905 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Control
        </button>
      </div>

      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-905 tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-violet-650" />
          User Account Directory
        </h1>
        <p className="text-slate-500 mt-1">Audit system roles, check email addresses, and manage registrations.</p>
      </div>

      {/* Main content table */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorBanner message={error} onRetry={fetchUsers} />
      ) : users.length === 0 ? (
        <div className="bg-white p-12 text-center text-slate-400 text-xs border border-slate-200 rounded-2xl">
          No users registered in the database.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left">User ID</th>
                  <th scope="col" className="px-6 py-4 text-left">Name</th>
                  <th scope="col" className="px-6 py-4 text-left">Email Address</th>
                  <th scope="col" className="px-6 py-4 text-left">System Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 bg-white">
                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-[10px] text-slate-500">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-slate-450">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border
                        ${item.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-100' : ''}
                        ${item.role === 'PLANNER' ? 'bg-violet-50 text-violet-755 border-violet-100' : ''}
                        ${item.role === 'VENDOR' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : ''}
                        ${item.role === 'CLIENT' ? 'bg-slate-100 text-slate-600 border-slate-200' : ''}
                      `}>
                        {item.role}
                      </span>
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
