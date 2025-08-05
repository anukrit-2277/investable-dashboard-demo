import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Company } from '@/types';
import ScoreRing from './ScoreRing';
import HeatmapSnippet from './HeatmapSnippet';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '../context/UserContext';
import { Button } from './ui/button';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const navigate = useNavigate();
  const lastUpdatedDate = new Date(company.lastUpdated);
  const { userType, email, name } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [accessStatus, setAccessStatus] = useState<'pending' | 'approved' | 'denied' | null>(null);
  const [refreshStatus, setRefreshStatus] = useState(0);

  // Check access status for investor
  React.useEffect(() => {
    const fetchStatus = async () => {
      if (userType === 'investor' && email) {
        try {
          const res = await fetch(`http://localhost:5050/api/access-requests/investor/${email}`);
          const data = await res.json();
          console.log('[AccessRequest Debug] API data:', data, 'company.id:', company.id);
          if (Array.isArray(data)) {
            const req = data.find((r: { companyId: string; status: 'pending' | 'approved' | 'denied' }) => r.companyId === company.id);
            console.log('[AccessRequest Debug] Matched request:', req);
            if (req) {
              setAccessStatus(req.status);
            } else {
              console.warn('[AccessRequest Debug] No matching request found for company.id:', company.id);
              setAccessStatus(null);
            }
          } else {
            console.error('[AccessRequest Debug] Unexpected API response format:', data);
            setAccessStatus(null);
          }
        } catch (err) {
          console.error('[AccessRequest Debug] Error fetching status:', err);
          setAccessStatus(null);
        }
      } else {
        setAccessStatus(null);
      }
    };
    fetchStatus();
  }, [userType, email, company.id, refreshStatus]);

  const handleClick = () => {
    if (userType === 'investor') {
      if (accessStatus === 'approved') {
        navigate(`/company/${company.id}`);
      } else {
        setShowModal(true);
      }
    } else {
      navigate(`/company/${company.id}`);
    }
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5050/api/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: company.id, investorEmail: email, investorName: name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setSuccess('Request sent!');
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
        setError('');
        setRefreshStatus(r => r + 1);
      }, 1000);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer animate-fade-in"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{company.name}</h3>
            <p className="text-xs text-muted-foreground">
              Last updated {formatDistanceToNow(lastUpdatedDate, { addSuffix: true })}
            </p>
          </div>
          <ScoreRing score={company.macroScore} size={60} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Score breakdown</p>
            <HeatmapSnippet company={company} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-primary font-medium">View details →</span>
            {userType === 'investor' && (
              <>
                {accessStatus === 'approved' ? (
                  <span className="text-green-600 text-xs font-medium">Access Approved</span>
                ) : accessStatus === 'pending' ? (
                  <span className="text-yellow-600 text-xs font-medium">Request Pending</span>
                ) : accessStatus === 'denied' ? (
                  <span className="text-red-600 text-xs font-medium">Request Denied</span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={e => { e.stopPropagation(); setShowModal(true); }}
                  >
                    Request Access
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={e => {
                e.stopPropagation();
                setShowModal(false);
                setSuccess('');
                setError('');
                setRefreshStatus(r => r + 1);
              }}
              type="button"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Request Access</h3>
            {accessStatus === 'approved' ? (
              <div className="text-green-600 text-center font-medium py-6">Access Approved</div>
            ) : accessStatus === 'pending' ? (
              <div className="text-yellow-600 text-center font-medium py-6">Request Pending</div>
            ) : accessStatus === 'denied' ? (
              <div className="text-red-600 text-center font-medium py-6">Request Denied</div>
            ) : (
              <form
                onSubmit={async e => {
                  e.stopPropagation();
                  await handleRequest(e);
                  setRefreshStatus(r => r + 1);
                }}
              >
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={name} disabled />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Your Email</label>
                  <input type="email" className="w-full border rounded px-3 py-2" value={email} disabled />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={company.name} disabled />
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {success && <div className="text-green-600 mb-2">{success}</div>}
                <Button type="submit" className="w-full" disabled={loading || !!success}>
                  {loading ? 'Requesting...' : success ? 'Requested' : 'Submit Request'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default CompanyCard;
