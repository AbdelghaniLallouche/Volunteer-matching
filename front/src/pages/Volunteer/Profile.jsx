import { useState } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation, useGetApplicationsQuery } from '../../redux/api/volunteerApi';
import Input from '../../components/Shared/Input';
import Button from '../../components/Shared/Button';
import TagSelector from '../../components/Shared/TagSelector';
import SearchableSelect from '../../components/Shared/SearchableSelect';
import { WILAYAS, SKILLS, INTERESTS } from '../../utils/constants';
import Card from '../../components/Shared/Card';

const VolunteerProfile = () => {
  const { data: profileData, isLoading, error } = useGetProfileQuery();
  const { data: applicationsData } = useGetApplicationsQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const volunteer = profileData?.data;
  const applications = applicationsData?.data || [];

  const handleEdit = () => {
    setFormData({
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      phone: volunteer.phone,
      bio: volunteer.bio,
      wilaya: volunteer.wilaya,
      skills: volunteer.skills,
      interests: volunteer.interests
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      alert('Error updating profile: ' + err.data?.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-vibrant-green"></div>
      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">Error loading profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        {!isEditing && (
          <button onClick={handleEdit} className="px-4 py-2 text-sm bg-vibrant-green text-white rounded-lg hover:bg-deep-green transition-colors">
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            {!isEditing ? (
              <div>
                {/* Profile Header */}
                <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
                  <img
                    src={volunteer.profilePhoto || 'https://via.placeholder.com/150'}
                    alt={`${volunteer.firstName} ${volunteer.lastName}`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{volunteer.firstName} {volunteer.lastName}</h2>
                    <p className="text-sm text-gray-500">{volunteer.userId?.email}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      {volunteer.phone && <span>{volunteer.phone}</span>}
                      {volunteer.wilaya && <span>{volunteer.wilaya}</span>}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {volunteer.bio && (
                  <div className="py-4 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">About</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{volunteer.bio}</p>
                  </div>
                )}

                {/* Skills */}
                {volunteer.skills?.length > 0 && (
                  <div className="py-4 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-vibrant-green/10 text-vibrant-green text-sm rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                {volunteer.interests?.length > 0 && (
                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1 bg-sky-blue/10 text-sky-blue text-sm rounded-lg">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <SearchableSelect
                  label="Wilaya"
                  options={WILAYAS}
                  value={formData.wilaya}
                  onChange={(value) => setFormData({ ...formData, wilaya: value })}
                />
                <div className="mb-4">
                  <label className="block text-deep-green font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="input-field resize-none"
                  />
                </div>

                <div className="mb-6">
                  <TagSelector
                    label="Skills"
                    tags={SKILLS}
                    selectedTags={formData.skills}
                    onToggle={toggleSkill}
                  />
                </div>

                <div className="mb-6">
                  <TagSelector
                    label="Interests"
                    tags={INTERESTS}
                    selectedTags={formData.interests}
                    onToggle={toggleInterest}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" onClick={() => setIsEditing(false)} variant="secondary" fullWidth>
                    Cancel
                  </Button>
                  <Button type="submit" fullWidth disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Applications</span>
                <span className="text-lg font-bold text-vibrant-green">{applications.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-lg font-bold text-vibrant-green">{volunteer.history?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Applications</h3>
            <div className="space-y-2">
              {applications.length > 0 ? (
                applications.slice(0, 3).map((app) => (
                  <div key={app._id} className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-900 truncate mb-1">
                      {app.missionId?.title}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No applications yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
