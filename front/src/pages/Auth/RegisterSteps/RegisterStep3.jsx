import { useState } from 'react';
import Button from '../../../components/Shared/Button';
import TagSelector from '../../../components/Shared/TagSelector';
import { SKILLS, INTERESTS } from '../../../utils/constants';

const RegisterStep3 = ({ formData, updateFormData, onBack, onSubmit }) => {
  const [localData, setLocalData] = useState({
    skills: formData.skills,
    interests: formData.interests
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
    updateFormData(localData);
    onSubmit();
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
      </div>

      <div className="mb-8">
        <TagSelector
          label="Select Your Interests"
          tags={INTERESTS}
          selectedTags={localData.interests}
          onToggle={toggleInterest}
        />
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
