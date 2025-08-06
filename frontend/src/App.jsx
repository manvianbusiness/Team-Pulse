import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

// Admin Components
import AdminLogin from './Components/Admin-Section/AdminLogin';
import Dashboard from './Components/Admin-Section/Dashboard';
import AdminAttendance from './Components/Admin-Section/Attendance';
import EmployeesList from './Components/Admin-Section/Employees';
import AdminBroadcast from './Components/Admin-Section/AdminBroadCast';
import AddLeave from './Components/Admin-Section/AddLeaveType';
import LeavePolicies from './Components/Admin-Section/LeavePolicies';
import AdminSidebar from './Components/Admin-Section/AdminSidebar';

// Employee Components
import EmployeeLogin from './Components/Employee-Section/EmployeeLogin';
import EmployeeDashboard from './Components/Employee-Section/EmployeeDashboard';
import ApplyLeave from './Components/Employee-Section/ApplyLeave';
import Attendance from './Components/Employee-Section/Attendance';
import EmployeeProfile from './Components/Employee-Section/EmployeeProfile';
import Broadcast from './Components/Employee-Section/EmployeeBroadcast';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin-sidebar" element={<AdminSidebar />} />
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<AdminAttendance />} />
        <Route path="/employees-list" element={<EmployeesList />} />
        <Route path="/admin-broadcast" element={<AdminBroadcast />} />
        <Route path="/leave-policies" element={<LeavePolicies />} />
        <Route path="/addleavetype" element={<AddLeave />} />
        {/* Employee Routes */}
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/employee-attendance" element={<Attendance />} />
        <Route path="/profile" element={<EmployeeProfile />} />
        <Route path="/employee-broadcast" element={<Broadcast />} />
      </Routes>
    </Router>
  );
};

export default App;
