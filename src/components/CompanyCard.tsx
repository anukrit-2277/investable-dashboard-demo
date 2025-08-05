import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Company } from '@/types';
import ScoreRing from './ScoreRing';
import HeatmapSnippet from './HeatmapSnippet';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '../context/UserContext';
import { Button } from './ui/button';
import { Lock, Eye, EyeOff, BarChart3, Download } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { exportCompanyReportSimple } from '@/utils/pdfExportSimple';
import { useToast } from '@/hooks/use-toast';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const navigate = useNavigate();
  const lastUpdatedDate = new Date(company.lastUpdated);
  const { userType, email, name, isLoading } = useUser();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [accessStatus, setAccessStatus] = useState<'pending' | 'approved' | 'denied' | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isExporting, setIsExporting] = useState(false);



  // Function to get cache key for this company's access status
  const getCacheKey = React.useCallback(() => {
    if (!email || !company.id) {
      return null;
    }
    return `access_status_${email}_${company.id}`;
  }, [email, company.id]);

  // Function to get cached access status
  const getCachedStatus = React.useCallback(() => {
    const cacheKey = getCacheKey();
    if (!cacheKey) return null;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { status, timestamp } = JSON.parse(cached);
        // Cache is valid for 5 minutes
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          return status;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.error('Error reading cached access status:', error);
    }
    return null;
  }, [getCacheKey]);

  // Function to cache access status
  const cacheStatus = React.useCallback((status: 'pending' | 'approved' | 'denied' | null) => {
    const cacheKey = getCacheKey();
    if (!cacheKey) {
      return;
    }
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        status,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching access status:', error);
    }
  }, [getCacheKey]);

  // Function to fetch access status
  const fetchAccessStatus = React.useCallback(async () => {
    if (userType === 'investor' && email && company.id) {
      setIsLoadingStatus(true);
      try {
        const res = await fetch(API_ENDPOINTS.ACCESS_REQUESTS_BY_INVESTOR(email));
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
                 const data = await res.json();
         
         if (Array.isArray(data)) {
           const req = data.find((r: { companyId: string; status: 'pending' | 'approved' | 'denied' }) => r.companyId === company.id);
           if (req) {
             setAccessStatus(req.status);
             cacheStatus(req.status);
           } else {
             setAccessStatus(null);
             cacheStatus(null);
           }
         } else {
           console.error('Unexpected API response format:', data);
           setAccessStatus(null);
           cacheStatus(null);
         }
             } catch (err) {
         console.error('Error fetching status:', err);
         setAccessStatus(null);
         cacheStatus(null);
       } finally {
         setIsLoadingStatus(false);
       }
     } else if (userType !== 'investor') {
       // Reset status for non-investors
       setAccessStatus(null);
       setIsLoadingStatus(false);
     }
  }, [userType, email, company.id, cacheStatus]);

  // Check access status for investor - wait for user data to be loaded
  React.useEffect(() => {
    // Only fetch if user data is loaded and we have all required data
    if (!isLoading && userType === 'investor' && email && company.id) {
      // First check cache
      const cachedStatus = getCachedStatus();
      if (cachedStatus !== null) {
        setAccessStatus(cachedStatus);
      } else {
        fetchAccessStatus();
      }
    } else if (!isLoading && userType !== 'investor') {
      setAccessStatus(null);
    }
  }, [isLoading, userType, email, company.id, fetchAccessStatus, getCachedStatus]);

  // Add focus event listener to refresh status when window regains focus
  React.useEffect(() => {
    const handleFocus = () => {
      if (!isLoading && userType === 'investor' && email && company.id) {
        // Refetch status when window regains focus
        fetchAccessStatus();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isLoading, userType, email, company.id, fetchAccessStatus]);

  // Add periodic refresh for pending requests
  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (!isLoading && userType === 'investor' && email && company.id && accessStatus === 'pending') {
      // Check for status updates every 30 seconds for pending requests
      intervalId = setInterval(() => {
        fetchAccessStatus();
      }, 30000); // 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoading, userType, email, company.id, accessStatus, fetchAccessStatus]);

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

  const handleExportCompanyReport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user has access to this company
    if (userType === 'investor' && accessStatus !== 'approved') {
      toast({
        title: "Access Required",
        description: "You need approved access to export this company's report.",
        variant: "destructive",
      });
      return;
    }
    
    setIsExporting(true);
    try {
      await exportCompanyReportSimple(company);
      toast({
        title: "Company report exported!",
        description: `PDF report for ${company.name} has been downloaded.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error generating the company report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(API_ENDPOINTS.ACCESS_REQUESTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          companyId: company.id, 
          companyName: company.name,
          investorEmail: email, 
          investorName: name 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setSuccess('Request sent!');
      // Update the local state immediately
      setAccessStatus('pending');
      cacheStatus('pending');
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
        setError('');
      }, 1000);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  // Check if content should be blurred (investor without approved access)
  const shouldBlur = userType === 'investor' && accessStatus !== 'approved';

  return (
    <>
      <Card
        className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in hover-lift relative`}
        onClick={handleClick}
      >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 to-indigo-950/20 opacity-50"></div>
      
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-foreground mb-1">{company.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Updated {formatDistanceToNow(lastUpdatedDate, { addSuffix: true })}
              {shouldBlur && (
                <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  🔒 Restricted
                </span>
              )}
              {userType === 'investor' && accessStatus === 'approved' && (
                <span className="ml-2 text-xs text-green-600 bg-green-950/20 px-2 py-1 rounded-full">
                  ✓ Approved
                </span>
              )}
            </p>
          </div>
          <div className="relative">
            <div className={shouldBlur ? 'blur-content' : ''}>
              <ScoreRing score={company.macroScore} size={60} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{Math.round(company.macroScore)}</span>
              </div>
            </div>
            {shouldBlur && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card/80 rounded-full p-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-4">
          <div className="relative">
            <p className="text-xs font-medium text-foreground mb-2 flex items-center">
              <BarChart3 className="w-3 h-3 mr-1" />
              Score Breakdown
            </p>
            <div className="bg-card/50 rounded-lg p-3 backdrop-blur-sm relative">
              {/* Blur overlay for sensitive data */}
              {shouldBlur && (
                <>
                  <div className="blur-content">
                    <HeatmapSnippet company={company} />
                  </div>
                  <div className="blur-overlay">
                    <div className="text-center p-4">
                      <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Access Required</p>
                      <p className="text-xs text-muted-foreground">Request access to view scores</p>
                    </div>
                  </div>
                </>
              )}
              {!shouldBlur && <HeatmapSnippet company={company} />}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                View details →
              </span>
              {/* Show export button for non-investors or investors with approved access */}
              {(userType !== 'investor' || accessStatus === 'approved') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportCompanyReport}
                  disabled={isExporting}
                  className="h-6 px-2 text-xs"
                >
                  {isExporting ? (
                    <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
            
            {userType === 'investor' && (
              <>
                {isLoading || isLoadingStatus ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-muted-foreground">Loading...</span>
                  </div>
                ) : accessStatus === 'approved' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-green-600 bg-green-950/20 px-2 py-1 rounded-full">
                      ✓ Access Approved
                    </span>
                    
                  </div>
                ) : accessStatus === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-950/20 px-2 py-1 rounded-full">
                      ⏳ Request Pending
                    </span>
                    
                  </div>
                ) : accessStatus === 'denied' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-red-600 bg-red-950/20 px-2 py-1 rounded-full">
                      ✗ Request Denied
                    </span>
                    
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={e => { e.stopPropagation(); setShowModal(true); }}
                      className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600"
                    >
                      Request Access
                    </Button>
                    
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>

      </Card>
      
      {/* Modal - Moved outside card for better positioning */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-scale-in max-h-[90vh] overflow-y-auto border border-border">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">Request Access</h3>
                <button
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={e => {
                    e.stopPropagation();
                    setShowModal(false);
                    setSuccess('');
                    setError('');
                  }}
                  type="button"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {accessStatus === 'approved' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-green-600 mb-2">Access Approved</h4>
                  <p className="text-muted-foreground">You can now view detailed company information.</p>
                </div>
                              ) : accessStatus === 'pending' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-yellow-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-yellow-600 mb-2">Request Pending</h4>
                  <p className="text-muted-foreground">Your request is being reviewed by the admin.</p>
                </div>
                              ) : accessStatus === 'denied' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-red-600 mb-2">Request Denied</h4>
                  <p className="text-muted-foreground">Your access request has been denied.</p>
                </div>
              ) : (
                <form onSubmit={handleRequest} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Your Name</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground" 
                        value={name} 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Your Email</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground" 
                        value={email} 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Company</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground" 
                        value={company.name} 
                        disabled 
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                  
                  {success && (
                    <div className="bg-green-950/20 border border-green-800/30 rounded-lg p-3">
                      <p className="text-green-400 text-sm">{success}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 rounded-lg transition-all duration-200" 
                    disabled={loading || !!success}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Requesting...
                      </div>
                    ) : success ? (
                      'Requested ✓'
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyCard;
