import { useState, useEffect } from 'react';
import { WILAYAS } from '../../utils/constants';
import MissionCard from '../../components/Volunteer/MissionCard';

// Mock user data (for recommendations)
const mockUserProfile = {
  skills: ['Teaching', 'Event Planning'],
  interests: ['Education', 'Children', 'Environment']
};

// Mock missions data
const mockMissions = [
  {
    id: '1',
    title: 'Beach Cleanup Campaign',
    description: 'Join us for a massive beach cleanup initiative to protect marine life and keep our coastlines beautiful.',
    image: 'https://via.placeholder.com/400x250',
    startDate: '2024-02-15',
    endDate: '2024-02-16',
    wilaya: 'Alger',
    requiredSkills: ['Teamwork', 'Physical Fitness'],
    interests: ['Environment', 'Community Development'],
    volunteers: 25,
    maxVolunteers: 50,
    association: {
      id: '1',
      name: 'Green Earth Initiative',
      logo: 'https://via.placeholder.com/150'
    },
    status: 'open'
  },
  {
    id: '2',
    title: 'Tree Planting Initiative',
    description: 'Help us plant 1000 trees in urban areas to combat climate change and improve air quality.',
    image: 'https://via.placeholder.com/400x250',
    startDate: '2024-03-01',
    endDate: '2024-03-03',
    wilaya: 'Blida',
    requiredSkills: ['Gardening', 'Teaching'],
    interests: ['Environment', 'Climate Action'],
    volunteers: 15,
    maxVolunteers: 30,
    association: {
      id: '1',
      name: 'Green Earth Initiative',
      logo: 'https://via.placeholder.com/150'
    },
    status: 'open'
  },
  {
    id: '3',
    title: 'Children Education Program',
    description: 'Teach underprivileged children basic reading, writing, and math skills in after-school programs.',
    image: 'https://via.placeholder.com/400x250',
    startDate: '2024-02-20',
    endDate: '2024-03-20',
    wilaya: 'Oran',
    requiredSkills: ['Teaching', 'Mentoring'],
    interests: ['Education', 'Children'],
    volunteers: 8,
    maxVolunteers: 20,
    association: {
      id: '2',
      name: 'Hope Foundation',
      logo: 'https://via.placeholder.com/150'
    },
    status: 'open'
  },
  {
    id: '4',
    title: 'Elderly Care Support',
    description: 'Provide companionship and assistance to elderly residents in nursing homes.',
    image: 'https://via.placeholder.com/400x250',
    startDate: '2024-02-25',
    endDate: '2024-02-26',
    wilaya: 'Constantine',
    requiredSkills: ['Healthcare', 'Communication'],
    interests: ['Elderly Care', 'Health'],
    volunteers: 10,
    maxVolunteers: 15,
    association: {
      id: '3',
      name: 'Community Care',
      logo: 'https://via.placeholder.com/150'
    },
    status: 'open'
  },
  {
    id: '5',
    title: 'Youth Coding Workshop',
    description: 'Teach coding basics to youth in underserved areas to help bridge the digital divide.',
    image: 'https://via.placeholder.com/400x250',
    startDate: '2024-03-05',
    endDate: '2024-03-10',
    wilaya: 'Alger',
    requiredSkills: ['Teaching', 'Web Development'],
    interests: ['Education', 'Technology'],
    volunteers: 5,
    maxVolunteers: 10,
    association: {
      id: '4',
      name: 'Tech for Good',
      logo: 'https://via.placeholder.com/150'
    },
    status: 'open'
  }
];

const VolunteerMissions = () => {
  const [missions, setMissions] = useState([]);
  const [isSearchApplied, setIsSearchApplied] = useState(false);
  const [filters, setFilters] = useState({
    wilayas: [],
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Calculate recommendations based on user profile
    const recommended = mockMissions.map(mission => {
      let score = 0;
      // Match skills
      mission.requiredSkills.forEach(skill => {
        if (mockUserProfile.skills.includes(skill)) score += 2;
      });
      // Match interests
      mission.interests.forEach(interest => {
        if (mockUserProfile.interests.includes(interest)) score += 1;
      });
      return { ...mission, recommendationScore: score };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);

    setMissions(recommended);
  }, []);

  const handleSearch = () => {
    let filtered = mockMissions;

    // Filter by wilayas
    if (filters.wilayas.length > 0) {
      filtered = filtered.filter(mission => filters.wilayas.includes(mission.wilaya));
    }

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(mission => 
        new Date(mission.startDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(mission => 
        new Date(mission.endDate) <= new Date(filters.endDate)
      );
    }

    setMissions(filtered);
    setIsSearchApplied(true);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({ wilayas: [], startDate: '', endDate: '' });
    const recommended = mockMissions.map(mission => {
      let score = 0;
      mission.requiredSkills.forEach(skill => {
        if (mockUserProfile.skills.includes(skill)) score += 2;
      });
      mission.interests.forEach(interest => {
        if (mockUserProfile.interests.includes(interest)) score += 1;
      });
      return { ...mission, recommendationScore: score };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);
    setMissions(recommended);
    setIsSearchApplied(false);
  };

  const toggleWilaya = (wilaya) => {
    setFilters(prev => ({
      ...prev,
      wilayas: prev.wilayas.includes(wilaya)
        ? prev.wilayas.filter(w => w !== wilaya)
        : [...prev.wilayas, wilaya]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search Filters Section */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-deep-green">Search Missions</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-vibrant-green hover:text-deep-green font-medium transition-colors flex items-center"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <svg 
              className={`w-5 h-5 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            {/* Wilaya Filter */}
            <div>
              <label className="block text-deep-green font-medium mb-3">Filter by Wilaya (Multiple)</label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border-2 border-gray-100 rounded-xl">
                {WILAYAS.map((wilaya) => (
                  <button
                    key={wilaya}
                    type="button"
                    onClick={() => toggleWilaya(wilaya)}
                    className={`tag ${filters.wilayas.includes(wilaya) ? 'tag-selected' : 'tag-unselected'}`}
                  >
                    {wilaya}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-deep-green font-medium mb-2">Start Date (From)</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-deep-green font-medium mb-2">End Date (To)</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button onClick={handleSearch} className="btn-primary flex-1">
                Apply Filters
              </button>
              {isSearchApplied && (
                <button onClick={handleClearFilters} className="btn-secondary flex-1">
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-deep-green mb-2">
          {isSearchApplied ? 'Search Results' : 'Recommended Missions'}
        </h1>
        <p className="text-gray-600">
          {missions.length} {missions.length === 1 ? 'mission' : 'missions'} found
          {!isSearchApplied && ' based on your skills and interests'}
        </p>
      </div>

      {/* Missions List */}
      {missions.length > 0 ? (
        <div className="space-y-6">
          {missions.map((mission) => (
            <MissionCard 
              key={mission.id} 
              mission={mission} 
              showRecommended={!isSearchApplied}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No missions found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default VolunteerMissions;
