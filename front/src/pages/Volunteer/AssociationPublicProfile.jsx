import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGetPublicAssociationQuery } from '../../redux/api/associationPublicApi';
import { Link } from 'react-router-dom';

const AssociationPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const { data, isLoading } = useGetPublicAssociationQuery(id);

  const association = data?.data?.association;
  const missions = data?.data?.missions || [];
  const activeMissions = missions.filter(m => m.status === 'open');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-vibrant-green"></div>
      </div>
    );
  }

  if (!association) {
    return <div className="text-center py-16 text-gray-500">Organization not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/volunteer/search-associations')}
        className="mb-4 text-sm text-gray-600 hover:text-vibrant-green flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-6">
          <img
            src={association.userId?.profilePhoto || 'https://via.placeholder.com/200'}
            alt={association.name}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 uppercase mb-2">{association.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {association.wilaya}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {activeMissions.length} active missions
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{association.description}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-100 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'about'
                ? 'text-vibrant-green border-b-2 border-vibrant-green bg-vibrant-green/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'missions'
                ? 'text-vibrant-green border-b-2 border-vibrant-green bg-vibrant-green/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Missions ({activeMissions.length})
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'contact'
                ? 'text-vibrant-green border-b-2 border-vibrant-green bg-vibrant-green/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Contact
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">About Us</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{association.description}</p>
        </div>
      )}

      {activeTab === 'missions' && (
        <div className="space-y-3">
          {activeMissions.map((mission) => (
            <Link key={mission._id} to={`/volunteer/missions/${mission._id}`}>
              <div className="bg-white rounded-lg border border-gray-100 hover:border-vibrant-green/30 hover:shadow-md transition-all duration-200 overflow-hidden group">
                <div className="flex gap-0">
                  <div className="relative w-32 flex-shrink-0 bg-gray-100">
                    <img
                      src={mission.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={mission.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold text-gray-900 text-sm uppercase mb-2 group-hover:text-vibrant-green transition-colors">
                      {mission.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{mission.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>{mission.wilaya}</span>
                      <span>{new Date(mission.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Contact Information</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="text-gray-900">{association.address}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone</p>
              <p className="text-gray-900">{association.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-gray-900">{association.email}</p>
            </div>
            {association.website && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Website</p>
                <a href={`https://${association.website}`} target="_blank" rel="noopener noreferrer" className="text-vibrant-green hover:underline">
                  {association.website}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssociationPublicProfile;
