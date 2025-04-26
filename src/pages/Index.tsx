
import React from 'react';
import { sampleCompanies } from '@/data/companyData';
import CompanyCard from '@/components/CompanyCard';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Index = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredCompanies, setFilteredCompanies] = React.useState(sampleCompanies);
  
  // Filter companies based on search term
  React.useEffect(() => {
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
    <div className="container max-w-7xl py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investable</h1>
          <p className="text-muted-foreground">Companies Analysis & Scoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            Filter <ChevronDown size={16} className="ml-1" />
          </Button>
          <Button size="sm">Export Report</Button>
        </div>
      </div>
      
      {/* Search and filter row */}
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Showing {filteredCompanies.length} companies
        </div>
      </div>
      
      {/* Company grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
      
      {/* Empty state */}
      {filteredCompanies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg font-semibold">No companies found</p>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
