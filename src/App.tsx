import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Config from './pages/Config';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/config" />} />
        <Route path="/config" element={<Config />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;