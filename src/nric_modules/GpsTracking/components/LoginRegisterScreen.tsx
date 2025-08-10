import React, { useState } from 'react';
import { register, login } from '../api/api';
import styles from '../styles/AuthScreenStyles';

interface Props {
  onLogin: (customer: any) => void;
}

const LoginRegisterScreen: React.FC<Props> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const fn = mode === 'login' ? login : register;
      const res = await fn(form);

      if (res.data) {
        const cust = res.data;
        onLogin(cust);
        setSuccess(mode === 'login' ? 'Login successful!' : 'Registration successful!');
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.message || `Error during ${mode}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>

        {/* Email */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.alertError}>
            <p style={styles.alertText}>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={styles.alertSuccess}>
            <p style={styles.alertText}>{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          style={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            'Loading...'
          ) : (
            mode === 'login' ? 'Login' : 'Register'
          )}
        </button>

        {/* Switch Mode */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}
          </p>
          <button
            style={styles.switchMode}
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
              setSuccess('');
            }}
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterScreen;