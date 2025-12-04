import { useState } from 'react';
import Input from '../../../components/Shared/Input';
import Button from '../../../components/Shared/Button';
import SearchableSelect from '../../../components/Shared/SearchableSelect';
import { WILAYAS } from '../../../utils/constants';

const AssociationStep2 = ({ formData, updateFormData, onBack, onSubmit }) => {
  const [localData, setLocalData] = useState({
    phone: formData.phone,
    wilaya: formData.wilaya,
    address: formData.address,
    description: formData.description,
    logo: formData.logo,
    website: formData.website
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocalData({ ...localData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(localData);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-deep-green font-medium mb-3">Logo / Profile Photo (Optional)</label>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-3xl">🏢</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-gray-600"
          />
        </div>
      </div>

      <Input
        label="Phone Number"
        type="tel"
        name="phone"
        value={localData.phone}
        onChange={handleChange}
        placeholder="+213 XXX XXX XXX"
        required
      />

      <SearchableSelect
        label="Wilaya"
        options={WILAYAS}
        value={localData.wilaya}
        onChange={(value) => setLocalData({ ...localData, wilaya: value })}
        placeholder="Select your wilaya"
        required
      />

      <Input
        label="Address"
        name="address"
        value={localData.address}
        onChange={handleChange}
        placeholder="123 Rue de la Liberté, Alger"
        required
      />

      <div className="mb-4">
        <label className="block text-deep-green font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={localData.description}
          onChange={handleChange}
          placeholder="Tell us about your association..."
          rows="4"
          className="input-field resize-none"
          required
        />
      </div>

      <Input
        label="Website (Optional)"
        type="url"
        name="website"
        value={localData.website}
        onChange={handleChange}
        placeholder="www.yourorganization.dz"
      />

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

export default AssociationStep2;
