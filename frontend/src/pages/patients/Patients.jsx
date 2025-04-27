import { useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import CustomPageTabs from '@/components/CustomPageTabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Patients = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeTab, setActiveTab] = useState('active');

  const tabs = ['active-patients', 'inactive-patients'];

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ page: '1', search: searchQuery });
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <CustomPageTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <Outlet context={{ searchQuery: searchParams.get('search') || '' }} />
    </div>
  );
};

export default Patients;
