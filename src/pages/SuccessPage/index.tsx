import React, { useState, useEffect } from 'react';

import { Page } from '@/components/Page.tsx';

interface BufferStats {
  total: number;
  ready: number;
  assigned: number;
  error: number;
  expired: number;
  assignedExpired: number;
}

export const SuccessPage: React.FC = () => {
  const [bufferStats, setBufferStats] = useState<BufferStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBufferStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/buffer/stats');
        if (response.ok) {
          const data = await response.json();
          setBufferStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch buffer stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBufferStats();
  }, []);

  return (
    <Page back={false}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px 20px',
        backgroundColor: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        {/* Loading Spinner */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #0088cc',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }} />
          <div style={{
            fontSize: '16px',
            color: '#666',
            fontWeight: '500',
            marginBottom: '20px'
          }}>
            Loading...
          </div>
        </div>

        {/* Buffer Window Status */}
        {!loading && bufferStats && (
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px',
            minWidth: '300px',
            textAlign: 'center'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: '#333',
              fontSize: '18px'
            }}>
              Buffer Windows Status
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <strong>Ready:</strong> {bufferStats.ready}
              </div>
              <div style={{
                backgroundColor: '#cce5ff',
                color: '#004085',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <strong>Assigned:</strong> {bufferStats.assigned}
              </div>
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <strong>Error:</strong> {bufferStats.error}
              </div>
              <div style={{
                backgroundColor: '#e2e3e5',
                color: '#383d41',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <strong>Total:</strong> {bufferStats.total}
              </div>
              <div style={{
                backgroundColor: '#fff3cd',
                color: '#856404',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <strong>Expired:</strong> {bufferStats.expired}
              </div>
              <div style={{
                backgroundColor: '#d1ecf1',
                color: '#0c5460',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <strong>Protected:</strong> {bufferStats.assignedExpired}
              </div>
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '10px'
            }}>
              {bufferStats.ready > 0 ? 
                '✅ Buffer windows available for instant startup (90s lifetime)' : 
                '⚠️ No buffer windows available - new windows will be created'
              }
              {bufferStats.assignedExpired > 0 && (
                <div style={{ marginTop: '5px', color: '#0c5460' }}>
                  🛡️ {bufferStats.assignedExpired} buffer(s) protected from cleanup (in use)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Page>
  );
};
