
import { useState, useEffect } from 'react';
import { sampleCompanies } from '@/data/companyData';
import CompanyCard from '@/components/CompanyCard';
import { Search, ChevronDown, TrendingUp, Users, BarChart3, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import UserProfile from '@/components/UserProfile';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(sampleCompanies);
  const { userType, email } = useUser();
  
  // Filter companies based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCompanies(sampleCompanies);
    } else {
      const filtered = sampleCompanies.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"></div>
        
        <div className="relative container max-w-7xl mx-auto px-4 py-16 sm:py-24">
          {/* Header with User Profile */}
          <div className="absolute top-4 right-4 z-10">
            <UserProfile />
          </div>
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight">
              Discover
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Investable
              </span>
              Companies
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Comprehensive analysis and scoring of companies across finance, legal, tax, HR, and more.
              Make informed investment decisions with our advanced evaluation system.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">{sampleCompanies.length}+</div>
                  <div className="text-blue-100">Companies Analyzed</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <BarChart3 className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">24</div>
                  <div className="text-blue-100">Evaluation Metrics</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <Shield className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-blue-100">Data Security</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Company Directory</h2>
            <p className="text-gray-300">Explore and analyze companies with our comprehensive scoring system</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex shadow-sm">
              <ChevronDown size={16} className="mr-2" />
              Filter
            </Button>
            <Button size="sm" className="shadow-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Export Report
            </Button>
          </div>
        </div>
        
        {/* Search and filter row */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
              Showing {filteredCompanies.length} companies
            </div>
          </div>
        </div>
        
        {/* Company grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanies.map((company, index) => (
            <div
              key={company.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CompanyCard company={company} />
            </div>
          ))}
        </div>
        
        {/* Empty state */}
        {filteredCompanies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center max-w-md">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No companies found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
