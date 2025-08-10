import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './VideoCallScreen.css';
import { API_URL, WS_URL } from '../services/service';

interface VideoCallProps {
  currentUserId: string;
  otherUserId: string;
  isCaller: boolean;
  otherUserName?: string;
  callerRole: 'DOCTOR' | 'PATIENT';
}

const VideoCallScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUserId, otherUserId, isCaller, otherUserName, callerRole } = location.state as VideoCallProps;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState(isCaller ? 'Calling...' : 'Connecting...');
  const [callConnected, setCallConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState('00:00:00');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isRemoteMuted, setIsRemoteMuted] = useState(false);
  const [showUnmuteModal, setShowUnmuteModal] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const hasEndedCall = useRef(false);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const callStartRef = useRef<Date | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  const checkCameraSupport = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasMultipleCameras(videoDevices.length > 1);
    } catch (error) {
      console.error('Error enumerating devices:', error);
      setHasMultipleCameras(false);
    }
  };

  const calculateDuration = () => {
    if (!callStartRef.current) return '00:00:00';
    const now = new Date();
    const diff = now.getTime() - callStartRef.current.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  };

  const startDurationTimer = () => {
    stopDurationTimer();
    callStartRef.current = new Date();
    durationInterval.current = setInterval(() => {
      setCallDuration(calculateDuration());
    }, 1000);
  };

  const stopDurationTimer = () => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
  };

  const handleScreenPress = () => {
    setControlsVisible(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  };

  const endCall = async (remoteEnded: boolean = false) => {
    if (hasEndedCall.current) return;
    hasEndedCall.current = true;

    try {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
      }
      if (pc.current) {
        pc.current.close();
      }
      stopDurationTimer();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }

    if (!remoteEnded && ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: 'end_call',
          from: currentUserId,
          to: otherUserId,
          endedBy: callerRole,
        })
      );
    }

    if (ws.current) {
      ws.current.close();
    }

    if (remoteEnded) {
      alert(`The ${callerRole === 'DOCTOR' ? 'doctor' : 'patient'} has ended the call`);
    }
    navigate(-1); // Go back to previous screen
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        const newMuteStatus = !audioTracks[0].enabled;
        setIsMuted(newMuteStatus);

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(
            JSON.stringify({
              type: 'mute_status',
              from: currentUserId,
              to: otherUserId,
              isMuted: newMuteStatus,
            })
          );
        }
      }
    }
  };

  const toggleSpeaker = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !isSpeakerOn;
    }
    setIsSpeakerOn(!isSpeakerOn);
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsVideoOn(videoTracks[0].enabled);
      }
    }
  };

  const switchCamera = async () => {
    if (!localStream || !hasMultipleCameras) return;

    try {
      const newCameraType = isFrontCamera ? 'user' : 'environment';
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newCameraType,
          width: 640,
          height: 480,
          frameRate: 30,
        },
        audio: true,
      });

      const newVideoTrack = stream.getVideoTracks()[0];
      const senders = pc.current?.getSenders();
      const videoSender = senders?.find(s => s.track?.kind === 'video');

      if (videoSender) {
        await videoSender.replaceTrack(newVideoTrack);
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = new MediaStream([newVideoTrack]);
      }

      localStream.getVideoTracks().forEach(track => track.stop());
      setLocalStream(stream);
      setIsFrontCamera(!isFrontCamera);
    } catch (error) {
      console.error('Error switching camera:', error);
      alert('Failed to switch camera');
    }
  };

  const setupWebSocket = () => {
    ws.current = new WebSocket(`${WS_URL}/signal`);

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          type: 'join',
          userId: currentUserId,
          role: callerRole,
        })
      );

      if (isCaller) {
        setupMedia();
      } else {
        ws.current?.send(
          JSON.stringify({
            type: 'call_accepted',
            from: currentUserId,
            to: otherUserId,
          })
        );
        setupMedia();
      }
    };

    ws.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      console.log('WebSocket message:', data.type);

      try {
        switch (data.type) {
          case 'offer':
            if (!pc.current) return;
            await pc.current.setRemoteDescription(
              new RTCSessionDescription(data.offer)
            );
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);
            ws.current?.send(
              JSON.stringify({
                type: 'answer',
                answer,
                target: otherUserId,
              })
            );
            setStatus('Connected');
            setCallConnected(true);
            if (isCaller) startDurationTimer();
            break;

          case 'answer':
            if (!pc.current) return;
            await pc.current.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
            setStatus('Connected');
            setCallConnected(true);
            if (!isCaller) startDurationTimer();
            break;

          case 'candidate':
            if (pc.current && data.candidate) {
              await pc.current.addIceCandidate(
                new RTCIceCandidate(data.candidate)
              );
            }
            break;

          case 'mute_status':
            setIsRemoteMuted(data.isMuted);
            if (data.isMuted) {
              // Vibrate for 200ms when remote mutes (only works on mobile browsers)
              if (navigator.vibrate) {
                navigator.vibrate(200);
              }
              alert(`The other user has ${data.isMuted ? 'muted' : 'unmuted'} their microphone`);
            }
            break;

          case 'unmute_request':
            if (isMuted) {
              setShowUnmuteModal(true);
            }
            break;

          case 'end_call':
            endCall(true);
            break;
        }
      } catch (error) {
        console.error('WebRTC error:', error);
        endCall();
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      alert('Connection error');
      endCall();
    };

    ws.current.onclose = () => {
      if (!hasEndedCall.current) {
        endCall();
      }
    };
  };

  const setupMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: 640,
          height: 480,
          frameRate: 30,
        },
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      pc.current = new RTCPeerConnection(configuration);

      pc.current.onicecandidate = (event) => {
        if (event.candidate && ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(
            JSON.stringify({
              type: 'candidate',
              candidate: event.candidate,
              target: otherUserId,
            })
          );
        }
      };

      pc.current.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
          setRemoteStream(event.streams[0]);
          setStatus('Connected');
          setCallConnected(true);
          startDurationTimer();
        }
      };

      stream.getTracks().forEach((track) => {
        pc.current?.addTrack(track, stream);
      });

      setLocalStream(stream);

      if (isCaller && !callConnected && pc.current) {
        const offer = await pc.current.createOffer({});
        await pc.current.setLocalDescription(offer);
        ws.current?.send(
          JSON.stringify({
            type: 'offer',
            offer,
            target: otherUserId,
          })
        );
      }
    } catch (error) {
      console.error('Media error:', error);
      alert('Could not access camera/microphone');
      endCall();
    }
  };

  useEffect(() => {
    checkCameraSupport();
    setupWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      stopDurationTimer();
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (callConnected) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [callConnected]);

  return (
    <div className="video-call-container" onClick={handleScreenPress}>
      <div className="video-call-gradient">
        {/* Remote video or placeholder */}
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="remote-video"
            muted={!isSpeakerOn}
          />
        ) : (
          <div className="remote-video-placeholder">
            <div className="user-avatar">
              <Icon icon="fa6-solid:user" className="avatar-icon" />
            </div>
            <p className="status-text">
              {status} {otherUserName ? `with ${otherUserName}` : ''}
            </p>
          </div>
        )}

        {/* Local video */}
        {localStream && isVideoOn && (
          <div className="local-video-container">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              className="local-video"
              style={{ transform: isFrontCamera ? 'scaleX(-1)' : 'scaleX(1)' }}
            />
          </div>
        )}

        {/* Call duration */}
        <div className="duration-container">
          <Icon icon="mdi:clock-outline" className="duration-icon" />
          <span className="duration-text">{callDuration}</span>
        </div>

        {/* Mute indicators */}
        {isRemoteMuted && !isMuted && (
          <div className="remote-mute-indicator">
            <Icon icon="mdi:microphone-off" className="mute-icon" />
            <span className="remote-mute-text">Other user muted their microphone</span>
            {!isCaller && (
              <button
                onClick={() => setShowUnmuteModal(true)}
                className="unmute-request-button"
              >
                Request Unmute
              </button>
            )}
          </div>
        )}

        {isMuted && (
          <div className="remote-mute-indicator muted-by-you">
            <Icon icon="mdi:microphone-off" className="mute-icon" />
            <span className="remote-mute-text">You are muted</span>
          </div>
        )}

        {/* Unmute request modal */}
        {showUnmuteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <Icon icon="mdi:information-outline" className="modal-icon" />
                <h3 className="modal-title">Unmute Request</h3>
              </div>
              <p className="modal-text">
                The other user is requesting you to unmute your microphone
              </p>
              <div className="modal-button-container">
                <button
                  onClick={() => {
                    setShowUnmuteModal(false);
                    if (ws.current) {
                      ws.current.send(
                        JSON.stringify({
                          type: 'unmute_response',
                          from: currentUserId,
                          to: otherUserId,
                          accepted: false,
                        })
                      );
                    }
                  }}
                  className="modal-button decline-button"
                >
                  <Icon icon="mdi:close" className="button-icon" />
                  <span>Decline</span>
                </button>
                <button
                  onClick={() => {
                    setShowUnmuteModal(false);
                    toggleMute();
                    if (ws.current) {
                      ws.current.send(
                        JSON.stringify({
                          type: 'unmute_response',
                          from: currentUserId,
                          to: otherUserId,
                          accepted: true,
                        })
                      );
                    }
                  }}
                  className="modal-button accept-button"
                >
                  <Icon icon="mdi:check" className="button-icon" />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {controlsVisible && (
          <div className="controls-container">
            <div className="controls-row">
              <button
                onClick={toggleMute}
                className="control-button"
              >
                <div className={`button-circle ${isMuted ? 'muted' : ''}`}>
                  <Icon
                    icon={isMuted ? 'mdi:microphone-off' : 'mdi:microphone'}
                    className="control-icon"
                  />
                </div>
                <span className="control-button-text">
                  {isMuted ? 'Unmute' : 'Mute'}
                </span>
              </button>

              <button
                onClick={toggleSpeaker}
                className="control-button"
              >
                <div className={`button-circle ${isSpeakerOn ? 'speaker-on' : ''}`}>
                  <Icon
                    icon={isSpeakerOn ? 'mdi:volume-high' : 'mdi:volume-off'}
                    className="control-icon"
                  />
                </div>
                <span className="control-button-text">
                  {isSpeakerOn ? 'Speaker' : 'Earpiece'}
                </span>
              </button>

              <button
                onClick={toggleVideo}
                className="control-button"
              >
                <div className={`button-circle ${isVideoOn ? 'video-on' : ''}`}>
                  <Icon
                    icon={isVideoOn ? 'mdi:video' : 'mdi:video-off'}
                    className="control-icon"
                  />
                </div>
                <span className="control-button-text">
                  {isVideoOn ? 'Video On' : 'Video Off'}
                </span>
              </button>

              <button
                onClick={switchCamera}
                className="control-button"
                disabled={!hasMultipleCameras}
              >
                <div className="button-circle">
                  <Icon icon="mdi:camera-flip" className="control-icon" />
                </div>
                <span className="control-button-text">Flip</span>
              </button>
            </div>

            <button
              onClick={() => endCall()}
              className="end-call-button"
            >
              <Icon icon="mdi:phone-hangup" className="end-call-icon" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallScreen;