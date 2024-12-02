import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import '../tailwind.css';
import App from '../components/App';
import Navbar from '../components/Navbar';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <section className="flex flex-col">
        <Navbar />
        <App />
      </section>
    </Router>
  </StrictMode>
);
