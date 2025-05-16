import { Routes, Route, Navigate } from 'react-router-dom';
import ClientList from './ClientList';
import AccountEdit from './AccountEdit';
import RegistrationForm from './RegistrationForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientList />} />
      <Route path="/account" element={<Navigate to="/" />} />
      <Route path="/account/:id" element={<AccountEdit />} />
      <Route path="/register" element={<RegistrationForm />} />
    </Routes>
  );
}

export default App;