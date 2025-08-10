import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './HomeScreen.css';
import { API_URL, WS_URL } from '../services/service';

interface User {
  id: number;
  fullName: string;
  username: string;
}

const HomeScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, id, username } = location.state;
  
  const [users, setUsers] = useState<User[]>([]);
  const [incomingCallFrom, setIncomingCallFrom] = useState<string | null>(null);
  const [callerName, setCallerName] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);

  const fetchUsers = async () => {
    const oppositeRole = role === 'DOCTOR' ? 'PATIENT' : 'DOCTOR';
    try {
      const res = await fetch(`${API_URL}/api/users/role-view?role=${oppositeRole}`);
      const data = await res.json();
      setUsers(data);
    } catch {
      alert('Failed to fetch users');
    }
  };

  const handleCall = async (receiverId: number, receiverName: string) => {
    try {
      await fetch(`${API_URL}/api/calls/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callerId: id, receiverId, callerName: username }),
      });

      navigate('/video-call', {
        state: {
          currentUserId: id.toString(),
          otherUserId: receiverId.toString(),
          isCaller: true,
          otherUserName: receiverName,
          callerRole: role,
        }
      });
    } catch {
      alert('Could not initiate call');
    }
  };

  const acceptCall = () => {
    if (!incomingCallFrom) return;
    navigate('/video-call', {
      state: {
        currentUserId: id.toString(),
        otherUserId: incomingCallFrom,
        isCaller: false,
        otherUserName: callerName,
        callerRole: 'DOCTOR',
      }
    });
    setIncomingCallFrom(null);
  };

  const rejectCall = () => {
    wsRef.current?.send(JSON.stringify({
      type: 'call_rejected',
      from: id.toString(),
      to: incomingCallFrom,
    }));
    setIncomingCallFrom(null);
  };

  useEffect(() => {
    fetchUsers();

    const wsUrl = `${WS_URL}/signal`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      wsRef.current?.send(JSON.stringify({
        type: 'join',
        userId: id.toString(),
        role,
      }));
    };

    wsRef.current.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === 'incoming_call') {
          setCallerName(data.callerName || 'Unknown');
          setIncomingCallFrom(data.from);
        } else if (data.type === 'call_rejected') {
          alert('The doctor rejected your call');
          setIncomingCallFrom(null);
        }
      } catch (e) {
        console.error('WebSocket message error:', e);
      }
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <h1 className="header-title">Doctors Available</h1>
        <button 
          className="logout-button" 
          onClick={() => navigate('/')}
        >
          <span className="logout-text">Logout</span>
        </button>
      </div>

      {/* Patient/Doctor List */}
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="card-header">
              <h3 className="user-name">{user.fullName}</h3>
              <span className="user-id">#{user.id}</span>
            </div>
            <p className="user-age">25 years</p>

            <div className="card-footer">
              <div className="status-container">
                <div className="green-dot"></div>
                <span className="status-text">Active</span>
              </div>
              <div className="time-container">
                <Icon icon="mdi:clock-outline" className="clock-icon" />
                <span className="time-text">5:00 PM</span>
              </div>
            </div>

            {role === 'PATIENT' && (
              <button
                onClick={() => handleCall(user.id, user.fullName || user.username)}
                className="call-button"
              >
                <span className="call-button-text">Call Now</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Incoming Call Modal */}
      {incomingCallFrom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-text">Incoming Call from {callerName}</p>
            <div className="modal-buttons">
              <button className="accept-btn" onClick={acceptCall}>
                <span className="accept-text">Accept</span>
              </button>
              <button className="reject-btn" onClick={rejectCall}>
                <span className="reject-text">Reject</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;