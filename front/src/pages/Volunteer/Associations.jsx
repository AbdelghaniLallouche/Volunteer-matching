import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../../components/Shared/Card';

// Mock data
const mockAssociations = [
  {
    id: '1',
    name: 'Green Earth Initiative',
    logo: 'https://via.placeholder.com/150',
    wilaya: 'Alger',
    description: 'Dedicated to environmental conservation and sustainable development across Algeria.',
    missionCount: 12,
    category: 'Environment'
  },
  {
    id: '2',
    name: 'Hope Foundation',
    logo: 'https://via.placeholder.com/150',
    wilaya: 'Oran',
    description: 'Supporting underprivileged children with education and healthcare services.',
    missionCount: 8,
    category: 'Education'
  },
  {
    id: '3',
    name: 'Community Care',
    logo: 'https://via.placeholder.com/150',
    wilaya: 'Constantine',
    description: 'Providing essential services and support to elderly and disabled community members.',
    missionCount: 15,
    category: 'Elderly Care'
  },
  {
    id: '4',
    name: 'Tech for Good',
    logo: 'https://via.placeholder.com/150',
    wilaya: 'Blida',
    description: 'Teaching coding and digital skills to youth in underserved areas.',
    missionCount: 6,
    category: 'Technology'
  }
];

const VolunteerAssociations = () => {
  const [searchParams] = useSearchParams();
  const [associations, setAssociations] = useState(mockAssociations);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    if (searchQuery) {
      const filtered = mockAssociations.filter(assoc =>
        assoc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assoc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assoc.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setAssociations(filtered);
    } else {
      setAssociations(mockAssociations);
    }
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-deep-green mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover Associations'}
        </h1>
        <p className="text-gray-600">
          {associations.length} {associations.length === 1 ? 'association' : 'associations'} found
        </p>
      </div>

      {associations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {associations.map((assoc) => (
            <Link 
              key={assoc.id} 
              to={`/volunteer/association/${assoc.id}`}
            >
              <Card className="cursor-pointer group">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={assoc.logo}
                    alt={assoc.name}
                    className="w-16 h-16 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-deep-green group-hover:text-vibrant-green transition-colors">
                      {assoc.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{assoc.wilaya}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {assoc.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-mint-light text-deep-green">
                    {assoc.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {assoc.missionCount} missions
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No associations found</h3>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default VolunteerAssociations;
