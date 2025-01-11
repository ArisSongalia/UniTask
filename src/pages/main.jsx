import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '../tailwind.css';
import App from '../components/App';
import { ProjectProvider } from '../context/ProjectContext';
import { ReloadProvider } from '../context/ReloadContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReloadProvider>
      <ProjectProvider>
        <Router>
          <App />
        </Router>
      </ProjectProvider>
    </ReloadProvider>
  </StrictMode>
);
