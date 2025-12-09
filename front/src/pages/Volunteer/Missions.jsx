import { useState } from 'react';
import { useGetRecommendedMissionsQuery, useSearchMissionsQuery, useApplyToMissionMutation } from '../../redux/api/volunteerApi';
import MissionCard from '../../components/Volunteer/MissionCard';
import { WILAYAS } from '../../utils/constants';
import SearchableSelect from '../../components/Shared/SearchableSelect';

const VolunteerMissions = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    wilaya: '',
    date: ''
  });

  const { data: recommendedData, isLoading: loadingRecommended } = useGetRecommendedMissionsQuery(undefined, {
    skip: isSearching
  });

  const searchParams = isSearching ? {
    ...(filters.wilaya && { wilaya: filters.wilaya }),
    ...(filters.date && { date: filters.date })
  } : {};

  const { data: searchData, isLoading: loadingSearch } = useSearchMissionsQuery(searchParams, {
    skip: !isSearching
  });

  const [applyToMission] = useApplyToMissionMutation();

  const missions = isSearching ? searchData?.data : recommendedData?.data;
  const isLoading = isSearching ? loadingSearch : loadingRecommended;

  const toggleWilaya = (wilaya) => {
    setFilters(prev => ({
      ...prev,
      wilayas: prev.wilayas.includes(wilaya)
        ? prev.wilayas.filter(w => w !== wilaya)
        : [...prev.wilayas, wilaya]
    }));
  };

  const handleSearch = () => {
    setIsSearching(true);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({ wilaya: '', date: '' });
    setIsSearching(false);
  };

  const handleApply = async (missionId) => {
    try {
      await applyToMission(missionId).unwrap();
      alert('Application submitted successfully!');
    } catch (err) {
      alert('Error applying to mission: ' + (err.data?.message || 'Already applied'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-vibrant-green"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search Filters Section */}
      <div className="bg-white rounded-lg border border-gray-100 p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium text-gray-700">Filters</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs text-gray-500 hover:text-vibrant-green font-medium transition-colors flex items-center gap-1"
          >
            {showFilters ? 'Hide' : 'Show'}
            <svg 
              className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {showFilters && (
          <div className="space-y-2">
            {/* Location Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
              <SearchableSelect
                options={WILAYAS}
                value={filters.wilaya}
                onChange={(value) => setFilters({ ...filters, wilaya: value })}
                placeholder="Any"
              />
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full px-2 py-1.5 text-xs rounded-md border border-gray-200 focus:border-vibrant-green focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button 
                onClick={handleSearch} 
                className="flex-1 py-1.5 px-3 bg-vibrant-green text-white text-xs font-medium rounded-md hover:bg-deep-green transition-colors"
              >
                Apply
              </button>
              {isSearching && (
                <button 
                  onClick={handleClearFilters} 
                  className="flex-1 py-1.5 px-3 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          {isSearching ? 'Search Results' : 'Recommended Missions'}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {missions?.length || 0} {missions?.length === 1 ? 'mission' : 'missions'} found
        </p>
      </div>

      {/* Missions List */}
      {missions && missions.length > 0 ? (
        <div className="space-y-3">
          {missions.map((mission) => (
            <MissionCard 
              key={mission._id} 
              mission={mission} 
              showRecommended={!isSearching}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No missions found</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default VolunteerMissions;
