import React, { useState, useEffect } from 'react';
import MemberCard from '@/components/members/MemberCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, Search, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { filterMembers, sortMembers } from '@/lib/utils/member-utils';
import { useApiQuery } from '@/hooks/useApi';
import { Members } from '@/types/member';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const ITEMS_PER_PAGE = 9;
const CACHE_KEY = 'members_cache';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes cache expiry

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'role-asc' | 'role-desc';

const MembersListPage: React.FC = () => {
  const { data, isLoading, refetch } = useApiQuery<{ members: Members[] }>({
    url: '/api/members',
  });
  
  const [members, setMembers] = useState<Members[]>([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  
  // Load from cache or fetch fresh data
  useEffect(() => {
    const loadData = async () => {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const now = Date.now();
      
      if (cachedData) {
        const { data: cachedMembers, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_EXPIRY_MS) {
          setMembers(cachedMembers);
          setLastUpdated(timestamp);
          return;
        }
      }
      
      // No valid cache, fetch fresh data
      await refetch();
    };
    
    loadData();
  }, [refetch]);

  // Update cache when data changes
  useEffect(() => {
    if (data?.members) {
      setMembers(data.members);
      const cacheData = {
        data: data.members,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setLastUpdated(cacheData.timestamp);
    }
  }, [data]);

  // Filter, sort and paginate members
  const filteredMembers = filterMembers(members, searchTerm);
  const sortedMembers = sortMembers(filteredMembers, sortBy);
  
  // Group members by role
  const membersByRole = sortedMembers.reduce((acc, member) => {
    const role = member.role || 'other';
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {} as Record<string, Members[]>);

  // Get paginated data
  const getPaginatedMembers = (members: Members[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return members.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const getTotalPages = (members: Members[]) => {
    return Math.ceil(members.length / ITEMS_PER_PAGE);
  };

  // Handle sort change
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Format last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const date = new Date(lastUpdated);
    return `Last updated: ${date.toLocaleTimeString()}`;
  };

  if (isLoading && members.length === 0) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-64">
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Members ({members.length})</h1>
          {lastUpdated > 0 && (
            <p className="text-sm text-gray-500">{formatLastUpdated()}</p>
          )}
        </div>
        
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSortChange('name-asc')}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('name-desc')}>
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('date-asc')}>
                Date (Oldest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('date-desc')}>
                Date (Newest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('role-asc')}>
                Role (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('role-desc')}>
                Role (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="bg-oma-green hover:bg-oma-green/90 text-white"
            onClick={() => navigate('/add-member')}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>
      
      {sortedMembers.length === 0 ? (
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
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({sortedMembers.length})</TabsTrigger>
            {Object.keys(membersByRole).map((role) => (
              <TabsTrigger key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)} ({membersByRole[role].length})
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getPaginatedMembers(sortedMembers).map((member) => (
                <MemberCard key={member._id} member={member} />
              ))}
            </div>
            {sortedMembers.length > ITEMS_PER_PAGE && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                      }}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: getTotalPages(sortedMembers) }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(index + 1);
                        }}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(prev => Math.min(prev + 1, getTotalPages(sortedMembers)));
                      }}
                      disabled={currentPage === getTotalPages(sortedMembers)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </TabsContent>
          
          {Object.entries(membersByRole).map(([role, roleMembers]) => (
            <TabsContent key={role} value={role}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getPaginatedMembers(roleMembers).map((member) => (
                  <MemberCard key={member._id} member={member} />
                ))}
              </div>
              {roleMembers.length > ITEMS_PER_PAGE && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                        }}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: getTotalPages(roleMembers) }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(index + 1);
                          }}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.min(prev + 1, getTotalPages(roleMembers)));
                        }}
                        disabled={currentPage === getTotalPages(roleMembers)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default MembersListPage;