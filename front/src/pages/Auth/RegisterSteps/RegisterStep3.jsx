import { useState } from 'react';
import Button from '../../../components/Shared/Button';
import TagSelector from '../../../components/Shared/TagSelector';
import { SKILLS, INTERESTS } from '../../../utils/constants';

const RegisterStep3 = ({ formData, updateFormData, onBack, onSubmit }) => {
  const [localData, setLocalData] = useState({
    skills: formData.skills || [],
    interests: formData.interests || []
  });

  const toggleSkill = (skill) => {
    setLocalData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest) => {
    setLocalData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Step 3 - Submitting with skills and interests:', localData);
    
    // Merge with formData and submit immediately
    const completeData = { ...formData, ...localData };
    console.log('Complete data with skills/interests:', completeData);
    
    // Update parent state
    updateFormData(localData);
    
    // Call onSubmit with complete data
    onSubmit(completeData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <TagSelector
          label="Select Your Skills"
          tags={SKILLS}
          selectedTags={localData.skills}
          onToggle={toggleSkill}
        />
        <p className="text-sm text-gray-500 mt-2">
          Selected: {localData.skills.length} skills
        </p>
      </div>

      <div className="mb-8">
        <TagSelector
          label="Select Your Interests"
          tags={INTERESTS}
          selectedTags={localData.interests}
          onToggle={toggleInterest}
        />
        <p className="text-sm text-gray-500 mt-2">
          Selected: {localData.interests.length} interests
        </p>
      </div>

      <div className="flex gap-4 mt-6">
        <Button type="button" onClick={onBack} variant="secondary" fullWidth>
          Back
        </Button>
        <Button type="submit" fullWidth>
          Complete Registration
        </Button>
      </div>
    </form>
  );
};

export default RegisterStep3;
