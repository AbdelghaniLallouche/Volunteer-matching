const Stepper = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-evenly mb-8 w-full">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                index + 1 <= currentStep
                  ? 'bg-vibrant-green text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            <span className={`mt-2 text-sm font-medium ${index + 1 <= currentStep ? 'text-vibrant-green' : 'text-gray-400'}`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 rounded transition-all duration-300 ${
                index + 1 < currentStep ? 'bg-vibrant-green' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
