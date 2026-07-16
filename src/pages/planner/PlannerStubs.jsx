import React from 'react';
const StubPage = ({ name }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
    <h1 className="text-xl font-bold text-slate-800">{name} Stub</h1>
    <p className="text-slate-500 mt-2">This is the {name} page. It will be built in the next development stage.</p>
  </div>
);

export const VendorDirectoryPage = () => <StubPage name="Vendor Directory" />;
export const VendorProfilePage = () => <StubPage name="Vendor Profile" />;
export const CreateEventPage = () => <StubPage name="Create Event" />;
export const EventBuilderPage = () => <StubPage name="Event Builder" />;
export const ChatPage = () => <StubPage name="Chat" />;
export const PaymentHistoryPage = () => <StubPage name="Payment History" />;
export const ReviewPage = () => <StubPage name="Review" />;
