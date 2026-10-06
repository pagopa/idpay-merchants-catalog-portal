import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import SearchStorePage from './pages/SearchStorePage/SearchStorePage';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Layout>{children}</Layout>
);

const LocalRoutes: React.FC = () => (
  <Routes>
    <Route path="*" element={<PublicLayout><SearchStorePage /></PublicLayout>} />
  </Routes>
);

function App() {
  return <LocalRoutes />;
}

export default App;
