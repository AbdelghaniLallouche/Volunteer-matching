import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../redux/slices/authSlice';
import Stepper from '../../components/Auth/Stepper';
import RegisterStep1 from './RegisterSteps/RegisterStep1';
import RegisterStep2 from './RegisterSteps/RegisterStep2';
import RegisterStep3 from './RegisterSteps/RegisterStep3';
import AssociationStep2 from './RegisterSteps/AssociationStep2';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    associationName: '',
    email: '',
    password: '',
    role: 'volunteer',
    // Step 2 - Volunteer
    bio: '',
    phone: '',
    profilePhoto: null,
    wilaya: '',
    // Step 2 - Association
    address: '',
    description: '',
    logo: null,
    website: '',
    // Step 3 - Volunteer only
    skills: [],
    interests: []
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate(`/${user.role}/missions`);
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const volunteerSteps = ['Account', 'Profile', 'Preferences'];
  const associationSteps = ['Account', 'Profile'];

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (finalData = null) => {
    const dataToSubmit = finalData || formData;
    console.log('Final form data before submission:', dataToSubmit);
    console.log('Skills in final data:', dataToSubmit.skills);
    console.log('Interests in final data:', dataToSubmit.interests);
    dispatch(register(dataToSubmit));
  };

  const updateFormData = (data) => {
    console.log('Updating form data with:', data);
    setFormData(prev => {
      const updated = { ...prev, ...data };
      console.log('Updated form data:', updated);
      return updated;
    });
  };

  const isVolunteer = formData.role === 'volunteer';
  const steps = isVolunteer ? volunteerSteps : associationSteps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-light to-vibrant-green/20 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-vibrant-green mb-1">
              {isVolunteer ? 'Join Valunteer' : 'Join Association'}
            </h1>
            <p className="text-sm text-gray-600">
              {isVolunteer ? 'Start your journey of making a difference' : 'Register your organization to recruit volunteers'}
            </p>
          </div>

          <Stepper currentStep={currentStep} steps={steps} />

          <div className="mt-6">
            {currentStep === 1 && (
              <RegisterStep1
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && isVolunteer && (
              <RegisterStep2
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 2 && !isVolunteer && (
              <AssociationStep2
                formData={formData}
                updateFormData={updateFormData}
                onBack={handleBack}
                onSubmit={handleSubmit}
              />
            )}
            {currentStep === 3 && isVolunteer && (
              <RegisterStep3
                formData={formData}
                updateFormData={updateFormData}
                onBack={handleBack}
                onSubmit={handleSubmit}
              />
            )}
          </div>

          <p className="text-center text-gray-600 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-vibrant-green font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
