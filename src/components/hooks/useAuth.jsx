import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    
    return unsubscribe;
  }, []);

  return {
    user,          
    uid: user?.uid,     
    isAuthenticated: !!user  
  };
}