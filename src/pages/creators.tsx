import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { formatTZS, getAvatarUrl } from '@/lib/utils';
import { Users, Activity, DollarSign, Search, Eye, ExternalLink } from 'lucide-react';
import type { Creator } from '@/types';
import { CreatorModal } from '@/components/CreatorModal';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.nisapoti.co.tz';

export function Creators() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { creators, setCreators } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'top-supporters' | 'top-earnings' | 'new'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/creators`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.errors && Array.isArray(errorData.errors)) {
            (errorData.errors as string[]).forEach((msg) => console.error('API error:', msg));
            throw new Error(errorData.errors.join(' | '));
          }
          throw new Error(errorData.message || 'Failed to fetch creators');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        console.log('Creator data:', data);
        setCreators(data);
      } catch (err) {
        console.error('Error fetching creators:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch creators');
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [setCreators]);

  const totalEarnings = creators.reduce((sum, creator) => sum + (creator.total_earnings || 0), 0);
  const activeCreators = creators.length;

  let filteredCreators = creators.filter(creator => 
    creator.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filter === 'top-supporters') {
    filteredCreators = [...filteredCreators].sort((a, b) => (b.total_supporters || 0) - (a.total_supporters || 0)).slice(0, 10);
  } else if (filter === 'top-earnings') {
    filteredCreators = [...filteredCreators].sort((a, b) => (b.total_earnings || 0) - (a.total_earnings || 0)).slice(0, 10);
  } else if (filter === 'new') {
    filteredCreators = [...filteredCreators].sort((a, b) => b.id.localeCompare(a.id)); // If you have created_at, use that instead
  }

  // Calculate new creators (joined in last 30 days)
  const now = new Date();
  const newCreatorsCount = creators.filter(c => {
    if (!c.created_at) return false;
    const created = new Date(c.created_at);
    return (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24) <= 30;
  }).length;

  // Pagination logic
  const totalPages = Math.ceil(filteredCreators.length / pageSize);
  const paginatedCreators = filteredCreators.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Bulk selection logic
  const allSelected = paginatedCreators.length > 0 && paginatedCreators.every(c => selectedIds.includes(c.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(selectedIds.filter(id => !paginatedCreators.some(c => c.id === id)));
    } else {
      setSelectedIds([...selectedIds, ...paginatedCreators.filter(c => !selectedIds.includes(c.id)).map(c => c.id)]);
    }
  };
  const toggleSelectOne = (id: string) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]);
  };

  const handleViewCreator = (creator: Creator) => {
    setSelectedCreator(creator);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading creators...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Creators</h1>
          <p className="text-gray-600 mt-1">Manage your content creators</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow">
            <DollarSign className="w-5 h-5" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow">
            <Users className="w-5 h-5" />
            Add New Creator
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Creators</p>
              <p className="text-2xl font-bold text-gray-900">{creators.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">{formatTZS(totalEarnings)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Creators</p>
              <p className="text-2xl font-bold text-gray-900">{activeCreators}
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 align-middle">+{newCreatorsCount} new</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Button Group */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { label: 'All', value: 'all' },
          { label: 'Top Supporters', value: 'top-supporters' },
          { label: 'Top Earnings', value: 'top-earnings' },
          { label: 'New Creators', value: 'new' },
        ].map(option => (
          <button
            key={option.value}
            className={`px-4 py-2 rounded-full font-medium transition-colors
              ${filter === option.value
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}
            `}
            onClick={() => setFilter(option.value as typeof filter)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Creators Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supporters</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedCreators.map((creator) => (
                <tr key={creator.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selectedIds.includes(creator.id)} onChange={() => toggleSelectOne(creator.id)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl overflow-hidden">
                        {creator.avatar_url ? (
                          <img
                            src={getAvatarUrl(creator.avatar_url)}
                            alt={creator.display_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                            {creator.display_name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{creator.display_name}</div>
                        <div className="text-xs text-gray-500">@{creator.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {creator.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatTZS(creator.total_earnings || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {creator.total_supporters || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {creator.created_at ? format(new Date(creator.created_at), 'MMM d, yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewCreator(creator)}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <a
                        href={`https://nisapoti.com/${creator.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors p-1 hover:bg-gray-50 rounded-lg"
                        title="Visit Profile"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <CreatorModal
        creator={selectedCreator}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}