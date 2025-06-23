import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

export interface AppSettings {
  challengesEnabled: boolean;
  lastUpdated?: any;
  updatedBy?: string;
}

export const checkChallengesEnabled = async (): Promise<boolean> => {
  try {
    const settingsDocRef = doc(db, 'appSettings', 'global');
    const settingsDoc = await getDoc(settingsDocRef);
    
    if (settingsDoc.exists()) {
      const settings = settingsDoc.data() as AppSettings;
      return settings.challengesEnabled !== false; // Default to true if not set
    }
    
    return true; // Default to enabled if no settings exist
  } catch (error) {
    console.error('Error checking challenges settings:', error);
    return true; // Default to enabled on error
  }
};

export const subscribeToChallengesSettings = (
  callback: (enabled: boolean) => void,
  onError?: (error: Error) => void
) => {
  const settingsDocRef = doc(db, 'appSettings', 'global');
  
  return onSnapshot(
    settingsDocRef,
    (doc) => {
      if (doc.exists()) {
        const settings = doc.data() as AppSettings;
        callback(settings.challengesEnabled !== false);
      } else {
        callback(true); // Default to enabled if no settings exist
      }
    },
    (error) => {
      console.error('Error listening to challenges settings:', error);
      if (onError) {
        onError(error);
      }
      callback(true); // Default to enabled on error
    }
  );
}; 