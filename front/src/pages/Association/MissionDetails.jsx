import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGetMissionQuery, useUpdateMissionMutation, useHandleApplicationMutation, useCloseMissionMutation } from '../../redux/api/missionApi';
import Button from '../../components/Shared/Button';
import Card from '../../components/Shared/Card';
import Input from '../../components/Shared/Input';
import TagSelector from '../../components/Shared/TagSelector';
import SearchableSelect from '../../components/Shared/SearchableSelect';
import { WILAYAS, SKILLS, INTERESTS } from '../../utils/constants';

const MissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetMissionQuery(id);
  const [updateMission] = useUpdateMissionMutation();
  const [handleApplication] = useHandleApplicationMutation();
  const [closeMission] = useCloseMissionMutation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [expandedApplicant, setExpandedApplicant] = useState(null);

  const mission = data?.data;

  const handleEdit = () => {
    setFormData({
      title: mission.title,
      description: mission.description,
      wilaya: mission.wilaya,
      startDate: mission.startDate?.split('T')[0],
      endDate: mission.endDate?.split('T')[0],
      maxVolunteers: mission.maxVolunteers,
      requiredSkills: mission.requiredSkills || [],
      interests: mission.interests || []
    });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateMission({ id: mission._id, data: formData }).unwrap();
      setIsEditing(false);
    } catch (err) {
      alert('Error updating mission: ' + err.data?.message);
    }
  };

  const handleApplicationAction = async (volunteerId, status) => {
    try {
      await handleApplication({ missionId: mission._id, volunteerId, status }).unwrap();
    } catch (err) {
      alert('Error handling application: ' + err.data?.message);
    }
  };

  const handleCloseMission = async () => {
    if (window.confirm('Are you sure you want to close this mission?')) {
      try {
        await closeMission(mission._id).unwrap();
        navigate('/association/missions');
      } catch (err) {
        alert('Error closing mission: ' + err.data?.message);
      }
    }
  };

  const pendingCount = mission?.applicants?.filter(app => app.status === 'pending').length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-vibrant-green"></div>
      </div>
    );
  }

  if (!mission) {
    return <div className="text-center py-16">Mission not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/association/missions')}
        className="mb-4 text-sm text-gray-600 hover:text-vibrant-green flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Missions
      </button>

      {!isEditing && (
        <div className="flex justify-end gap-3 mb-6">
          {mission.status === 'open' && (
            <>
              <button onClick={handleEdit} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                Edit Mission
              </button>
              <button onClick={handleCloseMission} className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors">
                Close Mission
              </button>
            </>
          )}
        </div>
      )}

      {!isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mission Card */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {mission.images?.length > 0 && (
                <img src={mission.images[0]} alt={mission.title} className="w-full h-64 object-cover" />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    mission.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {mission.status}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase mb-4">{mission.title}</h1>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{mission.description}</p>
                
                {mission.requiredSkills?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {mission.requiredSkills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-vibrant-green/10 text-vibrant-green text-xs font-medium rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Applicants Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">
                  Applicants ({mission.applicants?.length || 0})
                </h2>
              </div>

              {mission.applicants && mission.applicants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {mission.applicants.map((applicant) => (
                        <>
                          <tr key={applicant._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-medium text-sm text-gray-900">
                                {applicant.volunteerId?.firstName} {applicant.volunteerId?.lastName}
                              </div>
                              <div className="text-xs text-gray-500">{applicant.volunteerId?.userId?.email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {applicant.volunteerId?.wilaya || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(applicant.appliedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-lg ${
                                applicant.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                applicant.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {applicant.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setExpandedApplicant(expandedApplicant === applicant._id ? null : applicant._id)}
                                  className="p-1.5 text-gray-600 hover:text-vibrant-green hover:bg-gray-100 rounded transition-colors"
                                  title="View details"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedApplicant === applicant._id ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                                  </svg>
                                </button>
                                {applicant.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApplicationAction(applicant.volunteerId._id, 'accepted')}
                                      className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                      title="Accept"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleApplicationAction(applicant.volunteerId._id, 'rejected')}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                      title="Reject"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                          {expandedApplicant === applicant._id && (
                            <tr className="bg-gray-50">
                              <td colSpan="5" className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Contact</h4>
                                    <p className="text-sm text-gray-600 mb-1">
                                      {applicant.volunteerId?.phone || 'Not provided'}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {applicant.volunteerId?.skills?.map((skill, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-vibrant-green/10 text-vibrant-green text-xs rounded">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Interests</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {applicant.volunteerId?.interests?.map((interest, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                          {interest}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                {applicant.volunteerId?.bio && (
                                  <div className="mt-3">
                                    <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">Bio</h4>
                                    <p className="text-sm text-gray-600">{applicant.volunteerId.bio}</p>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-sm text-gray-500">No applicants yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-sm font-medium text-gray-900">{mission.wilaya}</p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(mission.startDate).toLocaleDateString()} - {new Date(mission.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 mb-2">Volunteers</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Accepted</span>
                  <span className="text-sm font-bold text-gray-900">{mission.acceptedVolunteers?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Slots</span>
                  <span className="text-sm font-bold text-gray-900">{mission.maxVolunteers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <h2 className="text-2xl font-bold text-deep-green mb-6">Edit Mission</h2>
          <form onSubmit={handleUpdate}>
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div className="mb-4">
              <label className="block text-deep-green font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="6"
                className="input-field resize-none"
                required
              />
            </div>
            <SearchableSelect
              label="Wilaya"
              options={WILAYAS}
              value={formData.wilaya}
              onChange={(value) => setFormData({ ...formData, wilaya: value })}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <Input
              label="Maximum Volunteers"
              type="number"
              value={formData.maxVolunteers}
              onChange={(e) => setFormData({ ...formData, maxVolunteers: e.target.value })}
              required
            />
            <div className="mb-6">
              <TagSelector
                label="Required Skills"
                tags={SKILLS}
                selectedTags={formData.requiredSkills}
                onToggle={(skill) => setFormData(prev => ({
                  ...prev,
                  requiredSkills: prev.requiredSkills.includes(skill)
                    ? prev.requiredSkills.filter(s => s !== skill)
                    : [...prev.requiredSkills, skill]
                }))}
              />
            </div>
            <div className="mb-6">
              <TagSelector
                label="Interests"
                tags={INTERESTS}
                selectedTags={formData.interests}
                onToggle={(interest) => setFormData(prev => ({
                  ...prev,
                  interests: prev.interests.includes(interest)
                    ? prev.interests.filter(i => i !== interest)
                    : [...prev.interests, interest]
                }))}
              />
            </div>
            <div className="flex gap-4">
              <Button type="button" onClick={() => setIsEditing(false)} variant="secondary" fullWidth>
                Cancel
              </Button>
              <Button type="submit" fullWidth>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default MissionDetails;
