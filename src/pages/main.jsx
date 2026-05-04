import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '../tailwind.css';
import App from '../components/App';
import { ProjectProvider } from '../context/ProjectContext';
import { ReloadProvider } from '../context/ReloadContext';
import { LayoutProvider } from '../context/LayoutContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LayoutProvider>
      <ReloadProvider>
        <ProjectProvider>
          <Router>
            <App />
          </Router>
        </ProjectProvider>
      </ReloadProvider>
    </LayoutProvider>
  </StrictMode>
);
