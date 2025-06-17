import { Routes, Route, Navigate } from 'react-router-dom';
import ClientList from './pages/ClientList';
import AccountEdit from './pages/AccountEdit';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import TaskEdit from './pages/TaskEdit';
import TaskForm from "./pages/TaskForm";
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ClientList />} />
        <Route path="/account" element={<Navigate to="/" />} />
        <Route path="/account/:id" element={<AccountEdit />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/tasks/:taskId/edit" element={<TaskEdit />} />
        <Route path="/task/new/:accountId" element={<TaskForm />} />
      </Routes>
    </Layout>
  );
}

export default App;