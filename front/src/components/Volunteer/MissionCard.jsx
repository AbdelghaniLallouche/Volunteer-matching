import { Link } from 'react-router-dom';
import Card from '../Shared/Card';

const MissionCard = ({ mission, showRecommended = false }) => {
  return (
    <Card className="cursor-pointer group hover:scale-[1.02]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mission Image */}
        <div className="relative w-full md:w-80 h-64 md:h-48 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={mission.image}
            alt={mission.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-vibrant-green text-white text-xs font-semibold rounded-full shadow-lg">
              {mission.status}
            </span>
          </div>
          {showRecommended && mission.recommendationScore > 0 && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-sky-blue text-white text-xs font-semibold rounded-full shadow-lg flex items-center">
                ⭐ Recommended
              </span>
            </div>
          )}
        </div>

        {/* Mission Content */}
        <div className="flex-1 flex flex-col">
          {/* Association Info */}
          <Link 
            to={`/volunteer/association/${mission.association.id}`}
            className="flex items-center space-x-3 mb-3 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={mission.association.logo}
              alt={mission.association.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="text-sm font-medium text-gray-700 hover:text-vibrant-green transition-colors">
              {mission.association.name}
            </span>
          </Link>

          {/* Mission Title */}
          <h3 className="text-2xl font-bold text-deep-green mb-2 group-hover:text-vibrant-green transition-colors">
            {mission.title}
          </h3>

          {/* Mission Description */}
          <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
            {mission.description}
          </p>

          {/* Mission Details */}
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{mission.wilaya}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(mission.startDate).toLocaleDateString()} - {new Date(mission.endDate).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{mission.volunteers}/{mission.maxVolunteers} volunteers</span>
            </div>
          </div>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {mission.requiredSkills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-mint-light text-deep-green text-xs font-medium rounded-full">
                {skill}
              </span>
            ))}
          </div>

          {/* Apply Button */}
          <button className="btn-primary w-full md:w-auto md:px-8 text-sm py-2 self-end">
            Apply Now
          </button>
        </div>
      </div>
    </Card>
  );
};

export default MissionCard;
