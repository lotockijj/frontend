import { Routes, Route, Navigate } from 'react-router-dom';
import ClientList from './ClientList';
import AccountEdit from './AccountEdit';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import TaskEdit from './TaskEdit';
import TaskForm from "./TaskForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientList />} />
      <Route path="/account" element={<Navigate to="/" />} />
      <Route path="/account/:id" element={<AccountEdit />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/tasks/:taskId/edit" element={<TaskEdit />} />
      <Route path="/task/new/:accountId" element={<TaskForm />} />
    </Routes>
  );
}

export default App;