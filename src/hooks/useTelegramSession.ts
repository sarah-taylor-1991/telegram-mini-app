import { useEffect, useState } from 'react';
import { sessionManager } from '@/helpers/sessionManager';

interface SessionInfo {
  sessionId: string;
  isNew: boolean;
  existingSession?: {
    username?: string;
    avatarSrc?: string;
  };
}

export function useTelegramSession(uid: string | null) {
  const [sessionId, setSessionId] = useState<string>('');
  const [isSessionReused, setIsSessionReused] = useState(false);
  const [loginStatus, setLoginStatus] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoginStatus('Error: UID parameter is required. Please access the app with ?uid=your_user_id');
      setIsInitializing(false);
      return;
    }

    const initializeSession = async () => {
      try {
        setIsInitializing(true);
        setLoginStatus('Initializing session...');
        
        // Start cross-tab listener
        sessionManager.startCrossTabListener();
        
        // Get or create session
        const sessionResponse = await sessionManager.getOrCreateSession();
        setSessionId(sessionResponse.sessionId);
        setIsSessionReused(!sessionResponse.isNew);
        
        // Store session ID
        localStorage.setItem('telegram_session_id', sessionResponse.sessionId);
        sessionStorage.setItem('telegram_session_id', sessionResponse.sessionId);
        
        if (sessionResponse.isNew) {
          setLoginStatus('New session created');
        } else {
          setLoginStatus('Existing session reused');
          if (sessionResponse.existingSession?.username) {
            setLoginStatus(`Welcome back, ${sessionResponse.existingSession.username}!`);
          }
        }
      } catch (error) {
        console.error('❌ Failed to initialize session:', error);
        setLoginStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();

    // Listen for session changes from other tabs
    const handleSessionChanged = (event: CustomEvent) => {
      console.log('🔄 Session changed from another tab:', event.detail);
      const newSessionId = event.detail.sessionId;
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
        setIsSessionReused(true);
        setLoginStatus('Session updated from another tab');
      }
    };

    window.addEventListener('sessionChanged', handleSessionChanged as EventListener);

    return () => {
      window.removeEventListener('sessionChanged', handleSessionChanged as EventListener);
    };
  }, [uid, sessionId]);

  return {
    sessionId,
    isSessionReused,
    loginStatus,
    isInitializing,
    setLoginStatus,
  };
}

