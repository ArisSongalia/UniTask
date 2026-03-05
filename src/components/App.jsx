import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Project from './Project';
import { SignIn, SignUp } from './modal-group/ModalAuth';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
        <div
          id="main-container"
          className=''
        >
          <Routes>
            <Route path="/" element={<Navigate to="/Home" replace />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/Project/:projectId' element={<Project />} />
            <Route path='/Sign-In' element={<SignIn />} />
            <Route path='/Sign-Up' element={<SignUp />} />
          </Routes>
          <ToastContainer
            position="top-center"
            autoClose={2500}
            newestOnTop
            pauseOnHover
            theme="light"
          />
        </div>
  );
}

export default App;
