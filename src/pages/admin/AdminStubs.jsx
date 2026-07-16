import React from 'react';
const StubPage = ({ name }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
    <h1 className="text-xl font-bold text-slate-800">{name} Stub</h1>
    <p className="text-slate-500 mt-2">This is the {name} page. It will be built in a subsequent stage.</p>
  </div>
);

export const UserManagementPage = () => <StubPage name="User Management" />;
export const VendorModerationPage = () => <StubPage name="Vendor Moderation" />;
