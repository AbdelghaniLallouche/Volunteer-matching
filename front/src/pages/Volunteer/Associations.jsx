import { useSearchParams , Link } from 'react-router-dom';
import { useSearchAssociationsQuery } from '../../redux/api/associationPublicApi';
import Card from '../../components/Shared/Card';

const VolunteerAssociations = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const { data, isLoading, error } = useSearchAssociationsQuery(searchQuery);

  const associations = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-vibrant-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">Error loading associations</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          {searchQuery ? `Results for "${searchQuery}"` : 'Discover Organizations'}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {associations.length} {associations.length === 1 ? 'organization' : 'organizations'}
        </p>
      </div>

      {associations.length > 0 ? (
        <div className="space-y-3">
          {associations.map((assoc) => (
            <Link 
              key={assoc._id} 
              to={`/volunteer/association/${assoc._id}`}
            >
              <div className="bg-white rounded-lg border border-gray-100 hover:border-vibrant-green/30 hover:shadow-md transition-all duration-200 overflow-hidden group">
                <div className="flex gap-4 p-4 items-center">
                  <img
                    src={assoc.logo || 'https://via.placeholder.com/150'}
                    alt={assoc.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-vibrant-green transition-colors uppercase">
                      {assoc.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{assoc.wilaya}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {assoc.missionCount || 0} missions
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No organizations found</p>
          <p className="text-xs text-gray-400 mt-1">Try different search terms</p>
        </div>
      )}
    </div>
  );
};

export default VolunteerAssociations;
