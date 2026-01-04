import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSeleniumSocketOptions {
  sessionId: string | null;
  onSeleniumReady?: () => void;
  onPhoneLoginButtonFound?: () => void;
}

interface SeleniumSocketState {
  isConnected: boolean;
  isSeleniumReady: boolean;
  seleniumStatus: string;
  phoneLoginButtonFound: boolean;
}

const SERVER_URL = 'http://localhost:3005';

export function useSeleniumSocket({
  sessionId,
  onSeleniumReady,
  onPhoneLoginButtonFound,
}: UseSeleniumSocketOptions): SeleniumSocketState {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSeleniumReady, setIsSeleniumReady] = useState(false);
  const [seleniumStatus, setSeleniumStatus] = useState<string>('Waiting for Selenium...');
  const [phoneLoginButtonFound, setPhoneLoginButtonFound] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!sessionId) return;

    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling']
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
      setIsSeleniumReady(false);
      setSeleniumStatus('Selenium server disconnected');
    });

    socket.on('reconnect', () => {
      console.log('Socket reconnected to Selenium server');
      setSeleniumStatus('Reconnecting to Selenium...');
      if (sessionId) {
        socket.emit('getSessionStatus', sessionId);
      }
    });

    // Selenium window connection events
    socket.on('chromeWindowConnected', (data) => {
      console.log('✅ Selenium window connected:', data);
      setIsSeleniumReady(true);
      setSeleniumStatus('Selenium ready');
      onSeleniumReady?.();
    });

    socket.on('immediateTestReceived', (data) => {
      console.log('✅ Immediate test received from Chrome window:', data);
      setIsSeleniumReady(true);
      setSeleniumStatus('Selenium ready');
      onSeleniumReady?.();
    });

    // Telegram login updates
    socket.on('telegramLoginUpdate', (data) => {
      if (data.event === 'status' && data.data?.message) {
        if (data.data.message.includes('Chrome driver initialized') || 
            data.data.message.includes('Browser window opened')) {
          setIsSeleniumReady(true);
          setSeleniumStatus('Selenium ready');
          onSeleniumReady?.();
        }
      }
      
      if (data.event === 'error') {
        setIsSeleniumReady(false);
        setSeleniumStatus(`Selenium error: ${data.data?.error || 'Unknown error'}`);
      }
    });

    // Session status
    socket.on('sessionStatus', (data) => {
      console.log('📊 Session status received:', data);
      if (data.sessionId === sessionId) {
        if (data.status === 'running' || data.status === 'completed') {
          console.log('✅ Session is active, Selenium should be ready');
          setIsSeleniumReady(true);
          setSeleniumStatus('Selenium ready (session active)');
          onSeleniumReady?.();
        }
      }
    });

    // All sessions
    socket.on('allSessions', (sessions) => {
      console.log('📋 All sessions received:', sessions);
      const hasActiveSession = sessions.some((session: any) => 
        session.status === 'running' || session.status === 'completed'
      );
      if (hasActiveSession) {
        console.log('✅ Found active session, Selenium should be ready');
        setIsSeleniumReady(true);
        setSeleniumStatus('Selenium ready (active session found)');
        onSeleniumReady?.();
      }
    });

    // Element check results
    socket.on('elementCheckResult', (data) => {
      console.log('🔍 Element check result:', data);
      if (data.sessionId === sessionId && data.elementType === 'PHONE_LOGIN_BUTTON') {
        if (data.elementFound) {
          console.log('✅ Phone login button found in Selenium window!');
          setPhoneLoginButtonFound(true);
          setSeleniumStatus('Phone login button ready');
          onPhoneLoginButtonFound?.();
        } else {
          console.log('❌ Phone login button not found in Selenium window');
          setPhoneLoginButtonFound(false);
          setSeleniumStatus('Phone login button not found - waiting for page to load...');
        }
      }
    });

    // Initial checks
    if (sessionId) {
      socket.emit('getSessionStatus', sessionId);
      socket.emit('getAllSessions');
    }

    // Cleanup
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, onSeleniumReady, onPhoneLoginButtonFound]);

  // Periodic checks
  useEffect(() => {
    if (!socketRef.current?.connected || !sessionId) return;

    const checkInterval = setInterval(() => {
      if (socketRef.current?.connected && sessionId) {
        socketRef.current.emit('getSessionStatus', sessionId);
      }
    }, 5000);

    const buttonCheckInterval = setInterval(() => {
      if (socketRef.current?.connected && sessionId && isSeleniumReady && !phoneLoginButtonFound) {
        console.log('🔄 Periodic check for phone login button...');
        socketRef.current.emit('checkElementInSelenium', {
          sessionId: sessionId,
          elementType: 'PHONE_LOGIN_BUTTON',
          timestamp: new Date().toISOString()
        });
      }
    }, 3000);

    const timeoutId = setTimeout(() => {
      if (!isSeleniumReady) {
        setSeleniumStatus('Selenium timeout - please refresh the page');
        console.warn('⚠️ Selenium readiness timeout reached');
      }
    }, 30000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(buttonCheckInterval);
      clearTimeout(timeoutId);
    };
  }, [sessionId, isSeleniumReady, phoneLoginButtonFound]);

  return {
    isConnected,
    isSeleniumReady,
    seleniumStatus,
    phoneLoginButtonFound,
  };
}

