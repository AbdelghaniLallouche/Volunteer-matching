const Card = ({ children, className = '', hover = true }) => {
  return (
    <div className={`card ${hover ? 'hover:scale-105' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
