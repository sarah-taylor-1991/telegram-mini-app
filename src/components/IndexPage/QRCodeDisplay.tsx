import type { FC } from 'react';

interface QRCodeDisplayProps {
  qrCodeData: string | null;
  showQR: boolean;
}

export const QRCodeDisplay: FC<QRCodeDisplayProps> = ({ qrCodeData, showQR }) => {
  if (!showQR || !qrCodeData) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '20px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        fontSize: '18px',
        color: '#333',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        Scan QR Code
      </h3>
      <img 
        src={qrCodeData} 
        alt="QR Code" 
        style={{
          width: '200px',
          height: '200px',
          border: '1px solid #e1e8ed',
          borderRadius: '4px'
        }}
      />
      <p style={{
        fontSize: '14px',
        color: '#666',
        marginTop: '12px',
        textAlign: 'center',
        maxWidth: '300px'
      }}>
        Scan this QR code with your Telegram app to log in
      </p>
    </div>
  );
};

