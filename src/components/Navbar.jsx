import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, onSnapshot, orderBy, query, updateDoc, writeBatch } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import unitask from '../assets/images/unitask.svg';
import { auth, db } from '../config/firebase';
import { checkIsPro } from '../services/CheckIsPro';
import HomeSideBar from './HomeSideBar';
import { IconAction, IconUser } from './Icon';
import MenuBar from './MenuBar';
import SearchBar from './SearchBar';
import SocialSection from './SocialSection';
import { ProSubscriptionButton } from './modal-group/ProSubscriptionModal';
import { NotificationPopup } from './modal-group/Popup';

const isPro = await checkIsPro();


function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [visibilitity, setVisbility] = useState({
    socialSection: false,
    sideBar: false,
    menuBar: false,
    unlockPro: false,
    notification: false
  })

  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  const markAllRead = async () => {
    if (!user?.uid) return;
    const notifRef = collection(db, 'users', user.uid, 'notifications');
    const unreadQuery = query(notifRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(unreadQuery);
    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnap) => {
      if (docSnap.data().read) return;
      batch.update(docSnap.ref, { read: true });
    });
    await batch.commit();
  };

  const toggleVisibility = (section) => {
    setVisbility((prev) => {
      const next = { ...prev, [section]: !prev[section] };
      if (section === 'notification' && next.notification) {
        setHasUnread(false);
        markAllRead();
      }
      return next;
    })
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const notifRef = collection(db, 'users', user.uid, 'notifications');
    const notifQuery = query(notifRef, orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(notifQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setNotifications(items);
      setHasUnread(items.some((item) => item.read === false));
    });

    return () => unsub();
  }, [user?.uid]);

  if (location.pathname === '/Home/Project') {
    return null;
  }

  return (
    <section className="bg-surface-base flex z-50 i-center justify-center w-full h-fit px-4 sticky top-0 shadow-soft">
      <div className="flex relative items-center gap-2 justify-between max-w-[144rem] w-full py-3">
        <div className="flex gap-4">
          <IconAction dataFeather='menu' iconOnClick={() => toggleVisibility('menuBar')} />
          {visibilitity.menuBar && <MenuBar closeModal={() => toggleVisibility('menuBar')} />}

          <Link to="/Home" className="hidden md:flex items-center gap-2 text-brand-900 text-lg font-bold">
            <img src={unitask} alt="UniTask" className="w-6 h-6" />
            <span className="font-merriweather w-fit pr-8">UniTask</span>
          </Link>
        </div>

        <SearchBar />

        <span className="flex w-fit gap-2 items-center">
          <ProSubscriptionButton />

          <span className='relative'>
            <IconAction dataFeather='bell' className='' iconOnClick={() => toggleVisibility('notification')} />
            {hasUnread && (
              <span className='absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border border-white' />
            )}
            {visibilitity.notification && (
              <NotificationPopup
                notifications={notifications}
                onClear={markAllRead}
              />
            )}
          </span>

          <IconAction dataFeather='bar-chart-2' className='lg:hidden' iconOnClick={() => toggleVisibility('sideBar')} />
          {visibilitity.sideBar && 
            <HomeSideBar 
              closeModal={() => toggleVisibility('sideBar')}
              className='fixed top-0 left-0 w-full min-h-screen max-w-[100vw] z-40 bg-white lg:hidden'
            />
          }
          <IconUser user={auth.currentUser} />
        </span>
      </div>
    </section>
  );
}

export default Navbar;
