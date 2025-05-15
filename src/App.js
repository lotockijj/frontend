import { Routes, Route, Navigate } from 'react-router-dom';
import ClientList from './ClientList';
import AccountEdit from './AccountEdit';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientList />} />
      <Route path="/account" element={<Navigate to="/" />} />
      <Route path="/account/:id" element={<AccountEdit />} />
    </Routes>
  );
}

export default App;