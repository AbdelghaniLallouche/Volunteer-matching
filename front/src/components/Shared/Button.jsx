const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false, fullWidth = false, className = '' }) => {
  const baseClass = fullWidth ? 'w-full' : '';
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
