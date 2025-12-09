import { Link } from 'react-router-dom';

const MissionCard = ({ mission }) => {
  const daysUntilStart = Math.ceil((new Date(mission.startDate) - new Date()) / (1000 * 60 * 60 * 24));
  const spotsLeft = mission.maxVolunteers - (mission.applicants?.length || 0);

  return (
    <Link to={`/volunteer/missions/${mission._id}`}>
      <div className="bg-white rounded-lg border border-gray-100 hover:border-vibrant-green/30 hover:shadow-lg transition-all duration-200 overflow-hidden group">
        <div className="flex gap-0">
          {/* Image - Full Height */}
          <div className="relative w-32 flex-shrink-0 bg-gray-100">
            <img
              src={mission.images?.[0] || 'https://via.placeholder.com/150'}
              alt={mission.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 p-4">
            {/* Title */}
            <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-1 uppercase group-hover:text-vibrant-green transition-colors">
              {mission.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
              {mission.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {mission.wilaya}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Starts in {daysUntilStart}d
              </span>
              <span className={`flex items-center gap-1 ${spotsLeft <= 5 ? 'text-orange-600 font-medium' : ''}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {spotsLeft} spots left
              </span>
            </div>

            {/* Skills */}
            {mission.requiredSkills?.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {mission.requiredSkills.slice(0, 4).map((skill, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-vibrant-green/10 text-vibrant-green rounded font-medium">
                    {skill}
                  </span>
                ))}
                {mission.requiredSkills.length > 4 && (
                  <span className="text-xs px-2 py-1 text-gray-400">
                    +{mission.requiredSkills.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MissionCard;
