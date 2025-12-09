import { useState } from 'react';
import { useGetHistoryQuery, useGetApplicationsQuery } from '../../redux/api/volunteerApi';
import { Link, useNavigate } from 'react-router-dom';

const VolunteerHistory = () => {
  const [activeTab, setActiveTab] = useState('completed');
  const { data: historyData, isLoading: loadingHistory } = useGetHistoryQuery();
  const { data: applicationsData, isLoading: loadingApplications } = useGetApplicationsQuery();
  const navigate = useNavigate();

  if (loadingHistory || loadingApplications) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-vibrant-green"></div>
      </div>
    );
  }

  const completedMissions = historyData?.data || [];
  const applications = applicationsData?.data || [];
  
  // Separate accepted and pending from active applications
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const pendingApplications = applications.filter(app => app.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Applications & History</h1>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'completed'
                ? 'text-vibrant-green border-b-2 border-vibrant-green bg-vibrant-green/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Completed ({completedMissions.length})
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'accepted'
                ? 'text-vibrant-green border-b-2 border-vibrant-green bg-vibrant-green/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Upcoming ({acceptedApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-vibrant-green border-b-2 border-vibrant-green bg-vibrant-green/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Pending ({pendingApplications.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'completed' && (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {completedMissions.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mission</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Organization</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {completedMissions.map((mission) => (
                  <tr key={mission._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={mission.images?.[0] || 'https://via.placeholder.com/150'}
                          alt={mission.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900 uppercase">{mission.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{mission.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{mission.wilaya}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(mission.startDate).toLocaleDateString()} - {new Date(mission.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{mission.associationId?.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No completed missions yet</p>
              <p className="text-xs text-gray-400 mt-1">Your completed missions will appear here</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'accepted' && (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {acceptedApplications.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mission</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Applied</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {acceptedApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/volunteer/missions/${app.missionId._id}`)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.missionId?.images?.[0] || 'https://via.placeholder.com/150'}
                          alt={app.missionId?.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900 uppercase">{app.missionId?.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.missionId?.wilaya}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(app.missionId?.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        Accepted
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No upcoming missions</p>
              <p className="text-xs text-gray-400 mt-1">Your accepted applications will appear here</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {pendingApplications.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mission</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Applied</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/volunteer/missions/${app.missionId._id}`)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.missionId?.images?.[0] || 'https://via.placeholder.com/150'}
                          alt={app.missionId?.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900 uppercase">{app.missionId?.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.missionId?.wilaya}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(app.missionId?.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No pending applications</p>
              <p className="text-xs text-gray-400 mt-1">Your pending applications will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerHistory;
