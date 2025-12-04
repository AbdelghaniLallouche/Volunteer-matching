import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../components/Shared/Button';
import MissionCard from '../../components/Volunteer/MissionCard';

// Mock data
const mockAssociation = {
  id: '1',
  name: 'Green Earth Initiative',
  logo: 'https://via.placeholder.com/200',
  cover: 'https://via.placeholder.com/1200x300',
  wilaya: 'Alger',
  address: '123 Rue de la Liberté, Alger Centre',
  phone: '+213 555 123 456',
  email: 'contact@greenearth.dz',
  website: 'www.greenearth.dz',
  description: 'Green Earth Initiative is a leading environmental conservation organization dedicated to sustainable development across Algeria. We work with local communities to protect natural resources, promote renewable energy, and educate the next generation about environmental stewardship.',
  category: 'Environment',
  founded: '2015',
  volunteers: 245
};

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
    title: 'Environmental Education Workshop',
    description: 'Conduct educational workshops in schools to raise awareness about environmental conservation.',
    image: 'https://via.placeholder.com/400x250',
    startDate: '2024-02-20',
    endDate: '2024-02-22',
    wilaya: 'Alger',
    requiredSkills: ['Teaching', 'Public Speaking'],
    interests: ['Education', 'Environment'],
    volunteers: 8,
    maxVolunteers: 15,
    association: {
      id: '1',
      name: 'Green Earth Initiative',
      logo: 'https://via.placeholder.com/150'
    },
    status: 'open'
  }
];

const AssociationPublicProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8 shadow-xl">
        <img
          src={mockAssociation.cover}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-xl p-8 -mt-32 relative z-10 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={mockAssociation.logo}
            alt={mockAssociation.name}
            className="w-32 h-32 rounded-2xl object-cover shadow-lg border-4 border-white"
          />
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-deep-green mb-2">
                  {mockAssociation.name}
                </h1>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {mockAssociation.wilaya}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Founded {mockAssociation.founded}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {mockAssociation.volunteers} volunteers
                  </span>
                </div>
              </div>
              
              <span className="px-4 py-2 bg-vibrant-green/10 text-vibrant-green rounded-full text-sm font-semibold">
                {mockAssociation.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl shadow-lg mb-8 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'about'
                ? 'text-vibrant-green border-b-2 border-vibrant-green'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'missions'
                ? 'text-vibrant-green border-b-2 border-vibrant-green'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Missions ({mockMissions.length})
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'contact'
                ? 'text-vibrant-green border-b-2 border-vibrant-green'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Contact
          </button>
        </div>

        <div className="p-8">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div>
              <h2 className="text-2xl font-bold text-deep-green mb-4">About Us</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {mockAssociation.description}
              </p>
            </div>
          )}

          {/* Missions Tab */}
          {activeTab === 'missions' && (
            <div>
              <h2 className="text-2xl font-bold text-deep-green mb-6">Active Missions</h2>
              <div className="space-y-6">
                {mockMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} showRecommended={false} />
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div>
              <h2 className="text-2xl font-bold text-deep-green mb-6">Get in Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-vibrant-green mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-deep-green mb-1">Address</h3>
                      <p className="text-gray-600">{mockAssociation.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-vibrant-green mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-deep-green mb-1">Phone</h3>
                      <p className="text-gray-600">{mockAssociation.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-vibrant-green mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-deep-green mb-1">Email</h3>
                      <p className="text-gray-600">{mockAssociation.email}</p>
                    </div>
                  </div>
                  
                  {mockAssociation.website && (
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-vibrant-green mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-deep-green mb-1">Website</h3>
                        <a href={`https://${mockAssociation.website}`} target="_blank" rel="noopener noreferrer" className="text-vibrant-green hover:underline">
                          {mockAssociation.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-mint-light to-vibrant-green/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-deep-green mb-4">Send a Message</h3>
                  <form className="space-y-4">
                    <input type="text" placeholder="Your Name" className="input-field" />
                    <input type="email" placeholder="Your Email" className="input-field" />
                    <textarea placeholder="Your Message" rows="4" className="input-field resize-none" />
                    <Button fullWidth>Send Message</Button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssociationPublicProfile;
