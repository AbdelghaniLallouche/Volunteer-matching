import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VolunteerMissions from './pages/Volunteer/Missions';
import VolunteerProfile from './pages/Volunteer/Profile';
import VolunteerHistory from './pages/Volunteer/History';
import AssociationPublicProfile from './pages/Volunteer/AssociationPublicProfile';
import VolunteerAssociations from './pages/Volunteer/Associations';
import AssociationDashboard from './pages/Association/Dashboard';
import AssociationMissions from './pages/Association/Missions';
import AssociationProfile from './pages/Association/Profile';
import CreateMission from './pages/Association/CreateMission';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout />}>
          {/* Volunteer Routes */}
          <Route path="volunteer">
            <Route index element={<Navigate to="missions" replace />} />
            <Route path="missions" element={<VolunteerMissions />} />
            <Route path="profile" element={<VolunteerProfile />} />
            <Route path="history" element={<VolunteerHistory />} />
            <Route path="association/:id" element={<AssociationPublicProfile />} />
            <Route path="search-associations" element={<VolunteerAssociations />} />
          </Route>

          {/* Association Routes */}
          <Route path="association">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AssociationDashboard />} />
            <Route path="missions" element={<AssociationMissions />} />
            <Route path="missions/create" element={<CreateMission />} />
            <Route path="profile" element={<AssociationProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
