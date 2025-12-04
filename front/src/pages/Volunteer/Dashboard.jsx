const VolunteerDashboard = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-deep-green mb-8">Welcome Back! 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-vibrant-green to-deep-green text-white">
          <h3 className="text-lg font-semibold mb-2">Active Applications</h3>
          <p className="text-4xl font-bold">5</p>
        </div>
        <div className="card bg-gradient-to-br from-sky-blue to-blue-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Missions Completed</h3>
          <p className="text-4xl font-bold">12</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-400 to-purple-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Hours Volunteered</h3>
          <p className="text-4xl font-bold">48</p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
