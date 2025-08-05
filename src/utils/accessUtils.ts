import { Company } from '@/types';
import { API_ENDPOINTS } from '../config/api';

interface AccessRequest {
  companyId: string;
  status: 'pending' | 'approved' | 'denied';
}

export const getApprovedCompanies = async (email: string, allCompanies: Company[]): Promise<Company[]> => {
  try {
    const res = await fetch(API_ENDPOINTS.ACCESS_REQUESTS_BY_INVESTOR(email));
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (Array.isArray(data)) {
      // Get all approved company IDs
      const approvedCompanyIds = data
        .filter((req: AccessRequest) => req.status === 'approved')
        .map((req: AccessRequest) => req.companyId);
      
      // Filter companies to only include approved ones
      return allCompanies.filter(company => approvedCompanyIds.includes(company.id));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching approved companies:', error);
    return [];
  }
};

export const getCompanyAccessStatus = async (email: string, companyId: string): Promise<'pending' | 'approved' | 'denied' | null> => {
  try {
    const res = await fetch(API_ENDPOINTS.ACCESS_REQUESTS_BY_INVESTOR(email));
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (Array.isArray(data)) {
      const req = data.find((r: AccessRequest) => r.companyId === companyId);
      return req ? req.status : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching company access status:', error);
    return null;
  }
}; 