import { Link } from 'react-router-dom';
import { useGetAssociationMissionsQuery } from '../../redux/api/associationApi';
import { useDeleteMissionMutation, useCloseMissionMutation } from '../../redux/api/missionApi';
import { useState } from 'react';

const AssociationMissions = () => {
  const { data: missions, isLoading, error } = useGetAssociationMissionsQuery();
  const [deleteMission] = useDeleteMissionMutation();
  const [closeMission] = useCloseMissionMutation();
  const [showAll, setShowAll] = useState(false);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mission?')) {
      try {
        await deleteMission(id).unwrap();
      } catch (err) {
        alert('Error deleting mission: ' + err.data?.message);
      }
    }
  };

  const handleClose = async (id) => {
    if (window.confirm('Are you sure you want to close this mission?')) {
      try {
        await closeMission(id).unwrap();
      } catch (err) {
        alert('Error closing mission: ' + err.data?.message);
      }
    }
  };

  const handleClearFilters = () => {
    setShowAll(!showAll);
  };

  // Filter missions based on showAll state
  const displayedMissions = showAll ? missions : missions?.filter(m => m.status === 'open');

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
        <p className="text-red-500">Error loading missions</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">My Missions</h1>
          <p className="text-xs text-gray-500 mt-0.5">{displayedMissions?.length || 0} missions</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAll(!showAll)} className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            {showAll ? 'Active Only' : 'Show All'}
          </button>
          <Link to="/association/missions/create">
            <button className="px-4 py-2 text-sm bg-vibrant-green text-white rounded-lg hover:bg-deep-green transition-colors">
              Create Mission
            </button>
          </Link>
        </div>
      </div>

      {displayedMissions && displayedMissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedMissions.map((mission) => (
            <div key={mission._id} className={`bg-white rounded-lg border border-gray-100 overflow-hidden transition-all ${mission.status === 'closed' ? 'opacity-60' : 'hover:border-vibrant-green/30 hover:shadow-md'}`}>
              <div className="relative h-40 bg-gray-100">
                <img
                  src={mission.images?.[0] || 'https://via.placeholder.com/400x250'}
                  alt={mission.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-medium ${
                  mission.status === 'open' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {mission.status}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900 uppercase mb-2 line-clamp-1">{mission.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">{mission.description}</p>

                <div className="space-y-1.5 mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{mission.wilaya}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(mission.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{mission.applicants?.length || 0} / {mission.maxVolunteers} applicants</span>
                  </div>
                  {mission.applicants?.filter(app => app.status === 'pending').length > 0 && (
                    <div className="flex items-center gap-2 text-orange-600 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span>{mission.applicants.filter(app => app.status === 'pending').length} pending reviews</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Link to={`/association/missions/${mission._id}`}>
                    <button className="w-full py-2 text-xs font-medium bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      View Details
                    </button>
                  </Link>
                  {mission.status === 'open' && (
                    <button onClick={() => handleClose(mission._id)} className="w-full py-2 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                      Close Mission
                    </button>
                  )}
                  <button onClick={() => handleDelete(mission._id)} className="w-full py-2 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-sm text-gray-500 mb-1">No missions yet</p>
          <p className="text-xs text-gray-400 mb-4">Create your first mission to start recruiting</p>
          <Link to="/association/missions/create">
            <button className="px-6 py-2 bg-vibrant-green text-white text-sm font-medium rounded-lg hover:bg-deep-green transition-colors">
              Create Mission
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AssociationMissions;
