import { CSSProperties } from 'react';

interface AuthScreenStyles {
  container: CSSProperties;
  card: CSSProperties;
  title: CSSProperties;
  formGroup: CSSProperties;
  label: CSSProperties;
  input: CSSProperties;
  alertError: CSSProperties;
  alertSuccess: CSSProperties;
  alertText: CSSProperties;
  button: CSSProperties;
  footer: CSSProperties;
  footerText: CSSProperties;
  switchMode: CSSProperties;
}

const styles: AuthScreenStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#007bff',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '32px 28px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 28,
    textAlign: 'center',
    color: '#004aad',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: '#3a3a3a',
    fontWeight: 600,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#aac4ff',
    borderRadius: 12,
    padding: '0 16px',
    backgroundColor: '#f9fbff',
    fontSize: 16,
    color: '#222',
    boxShadow: '0 2px 3px rgba(176, 196, 255, 0.25)',
    width: '100%',
  },
  alertError: {
    backgroundColor: '#ffd6d6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },
  alertSuccess: {
    backgroundColor: '#d6ffd6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4dff4d',
  },
  alertText: {
    color: '#333',
    fontSize: 15,
    fontWeight: 600,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#004aad',
    padding: '14px 0',
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
    boxShadow: '0 6px 8px rgba(0, 74, 173, 0.4)',
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.5,
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerText: {
    fontSize: 15,
    color: '#555',
  },
  switchMode: {
    fontSize: 15,
    color: '#004aad',
    marginLeft: 6,
    fontWeight: 700,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
};

export default styles;