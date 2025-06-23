'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaToggleOn, FaToggleOff, FaCode, FaExclamationTriangle } from 'react-icons/fa';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { AppSettings } from '../types';

interface SettingsTabProps {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ showSuccess, showError }) => {
  const [settings, setSettings] = useState<AppSettings>({
    challengesEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Load current settings and set up real-time listener
    const settingsDocRef = doc(db, 'appSettings', 'global');
    
    const unsubscribe = onSnapshot(settingsDocRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as AppSettings);
      } else {
        // Create default settings if they don't exist
        initializeSettings();
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to settings:', error);
      showError('Failed to load settings');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [showError]);

  const initializeSettings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const defaultSettings: AppSettings = {
        challengesEnabled: true,
        lastUpdated: serverTimestamp(),
        updatedBy: user.uid
      };

      await setDoc(doc(db, 'appSettings', 'global'), defaultSettings);
      showSuccess('Settings initialized successfully');
    } catch (error) {
      console.error('Error initializing settings:', error);
      showError('Failed to initialize settings');
    }
  };

  const toggleChallenges = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        showError('You must be logged in to update settings');
        return;
      }

      setUpdating(true);
      
      const newSettings: AppSettings = {
        ...settings,
        challengesEnabled: !settings.challengesEnabled,
        lastUpdated: serverTimestamp(),
        updatedBy: user.uid
      };

      await setDoc(doc(db, 'appSettings', 'global'), newSettings);
      
      showSuccess(
        `Code challenges ${newSettings.challengesEnabled ? 'enabled' : 'disabled'} successfully!`
      );
    } catch (error) {
      console.error('Error updating settings:', error);
      showError('Failed to update settings');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-3xl p-8 border border-gray-600 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <FaCog className="text-2xl text-blue-400" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight">App Settings</h2>
              <p className="text-gray-400 text-lg">Configure global application settings</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Cards */}
      <div className="space-y-6">
        {/* Code Challenges Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <FaCode className="text-xl text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Code Challenge Page</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Control whether users can access the code challenge page. When disabled, 
                the page will show as unavailable to all users.
              </p>
              
              {/* Status indicator */}
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                settings.challengesEnabled 
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                  : 'bg-red-900/30 text-red-400 border border-red-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  settings.challengesEnabled ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <span>
                  {settings.challengesEnabled ? 'Currently Enabled' : 'Currently Disabled'}
                </span>
              </div>

              {!settings.challengesEnabled && (
                <div className="mt-3 flex items-center gap-2 text-yellow-400">
                  <FaExclamationTriangle className="text-sm" />
                  <span className="text-sm">Users will see "Page Not Available" when visiting /code_challenge</span>
                </div>
              )}
            </div>
            
            {/* Toggle Button */}
            <div className="ml-6">
              <button
                onClick={toggleChallenges}
                disabled={updating}
                className={`relative inline-flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  updating 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : settings.challengesEnabled
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25'
                }`}
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    {settings.challengesEnabled ? (
                      <FaToggleOn className="text-xl" />
                    ) : (
                      <FaToggleOff className="text-xl" />
                    )}
                    <span>
                      {settings.challengesEnabled ? 'Disable Challenges' : 'Enable Challenges'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Future Settings Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
              <FaCog className="text-2xl text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">More Settings Coming Soon</h3>
            <p className="text-gray-500 text-sm">
              Additional configuration options will be available in future updates.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsTab; 