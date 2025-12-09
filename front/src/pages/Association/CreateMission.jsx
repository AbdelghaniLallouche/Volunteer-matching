import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateMissionMutation } from '../../redux/api/missionApi';
import Input from '../../components/Shared/Input';
import Button from '../../components/Shared/Button';
import TagSelector from '../../components/Shared/TagSelector';
import SearchableSelect from '../../components/Shared/SearchableSelect';
import { WILAYAS, SKILLS, INTERESTS } from '../../utils/constants';

const CreateMission = () => {
  const navigate = useNavigate();
  const [createMission, { isLoading }] = useCreateMissionMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wilaya: '',
    startDate: '',
    endDate: '',
    maxVolunteers: '',
    requiredSkills: [],
    interests: [],
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Combine existing images with new ones, limit to 6 total
    const allFiles = [...formData.images, ...newFiles].slice(0, 6);
    setFormData({ ...formData, images: allFiles });

    // Generate previews for all images
    const previews = allFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter(s => s !== skill)
        : [...prev.requiredSkills, skill]
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

    const missionFormData = new FormData();
    missionFormData.append('title', formData.title);
    missionFormData.append('description', formData.description);
    missionFormData.append('wilaya', formData.wilaya);
    missionFormData.append('startDate', formData.startDate);
    missionFormData.append('endDate', formData.endDate);
    missionFormData.append('maxVolunteers', formData.maxVolunteers);
    missionFormData.append('requiredSkills', JSON.stringify(formData.requiredSkills));
    missionFormData.append('interests', JSON.stringify(formData.interests));

    formData.images.forEach((image) => {
      missionFormData.append('images', image);
    });

    try {
      await createMission(missionFormData).unwrap();
      alert('Mission created successfully!');
      navigate('/association/missions');
    } catch (err) {
      alert('Error creating mission: ' + err.data?.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-deep-green mb-8">Create New Mission</h1>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <form onSubmit={handleSubmit}>
          <Input
            label="Mission Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Environmental Cleanup Campaign"
            required
          />

          <div className="mb-4">
            <label className="block text-deep-green font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your mission..."
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
            placeholder="Select wilaya"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Maximum Volunteers"
            type="number"
            name="maxVolunteers"
            value={formData.maxVolunteers}
            onChange={handleChange}
            placeholder="50"
            required
          />

          <div className="mb-6">
            <label className="block text-deep-green font-medium mb-3">Mission Images (Max 6)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="input-field"
            />
            <p className="text-sm text-gray-500 mt-2">
              Selected: {formData.images.length} / 6 image(s)
            </p>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-32 object-cover rounded-xl" 
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <TagSelector
              label="Required Skills"
              tags={SKILLS}
              selectedTags={formData.requiredSkills}
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
            <Button type="button" onClick={() => navigate('/association/missions')} variant="secondary" fullWidth>
              Cancel
            </Button>
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Mission'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMission;
