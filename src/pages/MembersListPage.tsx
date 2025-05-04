
import React, { useState } from 'react';
import { useMemberContext } from '@/contexts/MemberContext';
import MemberCard from '@/components/members/MemberCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { filterMembers } from '@/lib/utils/member-utils';
import { useApiQuery } from '@/hooks/useApi';
import { Member } from '@/types/member';

const MembersListPage: React.FC = () => {

  
  const { data: members, isLoading } = useApiQuery<Member[]>({
    url: '/api/members',
  });
  
  console.log(members)
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMembers = filterMembers(members, searchTerm);
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Members ({members?.length})</h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button 
            className="bg-oma-green hover:bg-oma-green/90 text-white"
            onClick={() => navigate('/add-member')}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>
      
      {filteredMembers?.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          {searchTerm ? (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No results found</h3>
              <p className="text-gray-600">
                No members match your search for "{searchTerm}". Try a different search term.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No members yet</h3>
              <p className="text-gray-600 mb-4">
                Start adding members to your organization.
              </p>
              <Button 
                className="bg-oma-green hover:bg-oma-green/90 text-white"
                onClick={() => navigate('/add-member')}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add First Member
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers?.map((member) => (
            <MemberCard key={member._id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersListPage;
