import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
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
import AssociationMissionDetails from './pages/Association/MissionDetails';
import VolunteerMissionDetails from './pages/Volunteer/MissionDetails';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}/missions`} replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}/missions`} replace />} />
        
        <Route path="/" element={<Layout />}>
          {/* Volunteer Routes - Protected */}
          <Route path="volunteer">
            <Route index element={<Navigate to="missions" replace />} />
            <Route 
              path="missions" 
              element={
                <ProtectedRoute allowedRole="volunteer">
                  <VolunteerMissions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="missions/:id" 
              element={
                <ProtectedRoute allowedRole="volunteer">
                  <VolunteerMissionDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <ProtectedRoute allowedRole="volunteer">
                  <VolunteerProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="history" 
              element={
                <ProtectedRoute allowedRole="volunteer">
                  <VolunteerHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="association/:id" 
              element={
                <ProtectedRoute allowedRole="volunteer">
                  <AssociationPublicProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="search-associations" 
              element={
                <ProtectedRoute allowedRole="volunteer">
                  <VolunteerAssociations />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Association Routes - Protected */}
          <Route path="association">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute allowedRole="association">
                  <AssociationDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="missions" 
              element={
                <ProtectedRoute allowedRole="association">
                  <AssociationMissions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="missions/create" 
              element={
                <ProtectedRoute allowedRole="association">
                  <CreateMission />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="missions/:id" 
              element={
                <ProtectedRoute allowedRole="association">
                  <AssociationMissionDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <ProtectedRoute allowedRole="association">
                  <AssociationProfile />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Route>

        {/* Redirect root to login if not authenticated, otherwise to user's dashboard */}
        <Route 
          path="*" 
          element={
            user ? <Navigate to={`/${user.role}/missions`} replace /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
