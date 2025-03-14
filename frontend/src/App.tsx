import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AddInventory } from './components/AddInventory';
import { SearchInventory } from './components/SearchInventory';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/search" replace />} />
          <Route path="add" element={<AddInventory />} />
          <Route path="search" element={<SearchInventory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
