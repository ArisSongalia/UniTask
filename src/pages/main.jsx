import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import '../tailwind.css';
import App from '../components/App';
import Navbar from '../components/Navbar';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <section className="flex flex-col h-screen">
          <Navbar />
          <App />
      </section>
    </Router>
  </StrictMode>
);
