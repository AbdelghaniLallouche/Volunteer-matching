import { useParams, useNavigate } from 'react-router-dom';
import { useGetMissionQuery } from '../../redux/api/missionApi';
import { useApplyToMissionMutation } from '../../redux/api/volunteerApi';

const VolunteerMissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetMissionQuery(id);
  const [applyToMission, { isLoading: isApplying }] = useApplyToMissionMutation();

  const mission = data?.data;

  const handleApply = async () => {
    try {
      await applyToMission(mission._id).unwrap();
      alert('Application submitted successfully!');
    } catch (err) {
      alert('Error applying: ' + (err.data?.message || 'Already applied'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-vibrant-green"></div>
      </div>
    );
  }

  if (!mission) {
    return <div className="text-center py-16 text-gray-500">Mission not found</div>;
  }

  const daysUntilStart = Math.ceil((new Date(mission.startDate) - new Date()) / (1000 * 60 * 60 * 24));
  const duration = Math.ceil((new Date(mission.endDate) - new Date(mission.startDate)) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/volunteer/missions')}
        className="mb-4 text-sm text-gray-600 hover:text-vibrant-green flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Images */}
          {mission.images?.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <img
                src={mission.images[0]}
                alt={mission.title}
                className="w-full h-64 object-cover"
              />
              {mission.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-3">
                  {mission.images.slice(1, 5).map((img, idx) => (
                    <img key={idx} src={img} alt={`${idx + 2}`} className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mission Info */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900 uppercase mb-4">{mission.title}</h1>
            
            <div className="prose prose-sm max-w-none mb-6">
              <p className="text-sm text-gray-600 leading-relaxed">{mission.description}</p>
            </div>

            {/* Skills & Interests */}
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

            {mission.interests?.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {mission.interests.map((interest, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Organization */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-4">Organized By</h3>
            <div className="flex items-center gap-4">
              <img
                src={mission.associationId?.userId?.profilePhoto || 'https://via.placeholder.com/150'}
                alt={mission.associationId?.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{mission.associationId?.name}</h4>
                <p className="text-xs text-gray-500">{mission.associationId?.wilaya}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Key Details */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="text-sm font-medium text-gray-900">{mission.wilaya}</p>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500 mb-1">Duration</p>
              <p className="text-sm font-medium text-gray-900">{duration} days</p>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500 mb-1">Starts</p>
              <p className="text-sm font-medium text-gray-900">{new Date(mission.startDate).toLocaleDateString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">in {daysUntilStart} days</p>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500 mb-1">Ends</p>
              <p className="text-sm font-medium text-gray-900">{new Date(mission.endDate).toLocaleDateString()}</p>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500 mb-1">Volunteers</p>
              <p className="text-sm font-medium text-gray-900">
                {mission.applicants?.length || 0} / {mission.maxVolunteers}
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-vibrant-green h-1.5 rounded-full transition-all" 
                  style={{ width: `${((mission.applicants?.length || 0) / mission.maxVolunteers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          {mission.status === 'open' && (
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="w-full py-3 bg-vibrant-green text-white font-medium rounded-lg hover:bg-deep-green transition-colors disabled:opacity-50"
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerMissionDetails;
