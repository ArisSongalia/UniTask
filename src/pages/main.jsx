import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '../tailwind.css';
import App from '../components/App';
import { ProjectProvider } from '../components/ProjectContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectProvider>
      <Router>
        <App />
      </Router>
    </ProjectProvider>
  </StrictMode>
);
