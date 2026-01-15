import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductPage from './pages/ProductPage';
import SupplierPage from './pages/SupplierPage';
import AssociationPage from './pages/AssociationPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<ProductPage />} />
            <Route path="/produtos" element={<ProductPage />} />
            <Route path="/fornecedores" element={<SupplierPage />} />
            <Route path="/associacao" element={<AssociationPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
