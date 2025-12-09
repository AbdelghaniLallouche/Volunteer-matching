import { useState } from 'react';
import Input from '../../../components/Shared/Input';
import Button from '../../../components/Shared/Button';

const RegisterStep1 = ({ formData, updateFormData, onNext }) => {
  const [localData, setLocalData] = useState({
    firstName: formData.firstName,
    lastName: formData.lastName,
    associationName: formData.associationName,
    email: formData.email,
    password: formData.password,
    role: formData.role
  });

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    const newData = { ...localData, role };
    setLocalData(newData);
    updateFormData(newData); // Update parent immediately
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(localData);
    onNext();
  };

  const isVolunteer = localData.role === 'volunteer';

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleRoleChange('volunteer')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all ${
              localData.role === 'volunteer'
                ? 'bg-vibrant-green text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Volunteer
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('association')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all ${
              localData.role === 'association'
                ? 'bg-vibrant-green text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Association
          </button>
        </div>
      </div>

      {isVolunteer ? (
        <>
          <Input
            label="First Name"
            name="firstName"
            value={localData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={localData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </>
      ) : (
        <Input
          label="Association Name"
          name="associationName"
          value={localData.associationName}
          onChange={handleChange}
          placeholder="Green Earth Initiative"
          required
        />
      )}

      <Input
        label="Email"
        type="email"
        name="email"
        value={localData.email}
        onChange={handleChange}
        placeholder={isVolunteer ? "john@example.com" : "contact@association.dz"}
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={localData.password}
        onChange={handleChange}
        placeholder="••••••••"
        required
      />

      <Button type="submit" fullWidth className="mt-6">
        Next Step
      </Button>
    </form>
  );
};

export default RegisterStep1;
