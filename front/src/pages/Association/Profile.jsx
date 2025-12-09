import { useState } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../redux/api/associationApi';
import Input from '../../components/Shared/Input';
import Button from '../../components/Shared/Button';
import SearchableSelect from '../../components/Shared/SearchableSelect';
import { WILAYAS } from '../../utils/constants';

const AssociationProfile = () => {
  const { data, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const association = data?.data?.association;

  const handleEdit = () => {
    setFormData({
      name: association.name,
      phone: association.phone,
      wilaya: association.wilaya,
      address: association.address,
      description: association.description,
      website: association.website
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  if (error || !association) {
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
        <h1 className="text-lg font-semibold text-gray-900">Organization Profile</h1>
        {!isEditing && (
          <button onClick={handleEdit} className="px-4 py-2 text-sm bg-vibrant-green text-white rounded-lg hover:bg-deep-green transition-colors">
            Edit
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        {!isEditing ? (
          <div>
            {/* Profile Header */}
            <div className="flex items-start gap-6 pb-6 border-b border-gray-100">
              <img
                src={association.logo || association.userId?.profilePhoto || 'https://via.placeholder.com/150'}
                alt={association.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 uppercase mb-1">{association.name}</h2>
                <p className="text-sm text-gray-500 mb-3">{association.email}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {association.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {association.wilaya}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Address</h3>
                <p className="text-sm text-gray-900">{association.address}</p>
              </div>
              
              {association.website && (
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Website</h3>
                  <a href={`https://${association.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-vibrant-green hover:underline">
                    {association.website}
                  </a>
                </div>
              )}
              
              <div className="md:col-span-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">About</h3>
                <p className="text-sm text-gray-900 leading-relaxed">{association.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label="Organization Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <SearchableSelect
              label="Wilaya"
              options={WILAYAS}
              value={formData.wilaya}
              onChange={(value) => setFormData({ ...formData, wilaya: value })}
              required
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-vibrant-green focus:outline-none resize-none"
                required
              />
            </div>
            <Input
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="www.example.com"
            />

            <div className="flex gap-3 mt-5">
              <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isUpdating} className="flex-1 py-2 px-4 bg-vibrant-green text-white text-sm font-medium rounded-lg hover:bg-deep-green transition-colors disabled:opacity-50">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssociationProfile;
