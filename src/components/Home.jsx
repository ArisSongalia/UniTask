import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";

import { auth } from "../config/firebase";
import { SortProvider } from "../context/SortContext";

import HomeSideBar from "./HomeSideBar";
import Navbar from "./Navbar";
import RecentTasks from "./RecentTasks";
import { PaymentResultsModal } from "./modal-group/PaymentModals";
import { BarLoader } from "react-spinners";

function Home() {
  const [user, setUser] = useState(undefined);
  const [paymentResult, setPaymentResult] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isProjectView = location.pathname === "/Home/Project";

  // Check if user is logged in w/ firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/Sign-In");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Detect payment redirect
  useEffect(() => {
    const payment = searchParams.get("payment");

    if (payment) {
      setPaymentResult(payment);
      window.history.replaceState({}, document.title, "/Home");
    }
  }, [searchParams]);

  if (user === undefined) {
    return <div className="h-100vh w-full"><BarLoader /></div>;
  }

  return (
    <>
      {paymentResult && (
        <PaymentResultsModal
          result={paymentResult}
          closeModal={() => setPaymentResult(null)}
        />
      )}

      <div className="flex flex-col h-screen w-full overflow-hidden items-center">
        <Navbar />

        {!isProjectView && (
          <SortProvider>
            <div className="flex flex-1 min-h-0 w-full gap-2 max-w-screen-2xl my-2">
              <RecentTasks className="flex-1 min-h-0" />
              <HomeSideBar className="hidden lg:flex flex-col w-80" />
            </div>
          </SortProvider>
        )}

        <Outlet />
      </div>
    </>
  );
}

export default Home;