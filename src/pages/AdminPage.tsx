import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface AccessRequest {
  _id: string;
  companyId: string;
  investorEmail: string;
  investorName: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
}

export default function AdminPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5050/api/access-requests');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch requests');
      setRequests(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'denied') => {
    try {
      const res = await fetch(`http://localhost:5050/api/access-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update request');
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Failed to update request'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Access Requests</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : requests.length === 0 ? (
        <div>No requests found.</div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white shadow-sm">
              <div>
                <div className="font-medium">{req.investorName} ({req.investorEmail})</div>
                <div className="text-sm text-muted-foreground">Company ID: {req.companyId}</div>
                <div className="text-sm">Status: <span className={req.status === 'pending' ? 'text-yellow-600' : req.status === 'approved' ? 'text-green-600' : 'text-red-600'}>{req.status}</span></div>
                <div className="text-xs text-gray-400">Requested: {new Date(req.createdAt).toLocaleString()}</div>
              </div>
              {req.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAction(req._id, 'approved')}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleAction(req._id, 'denied')}>Deny</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
