import React, { useEffect, useState, useRef } from 'react';
import socket from '../../../utils/socket'; 
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
  const [user, setUser] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [win, setWin] = useState(0);
  const [lose, setLose] = useState(0); 
  const sessionActiveRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.user._id
   socket.connect();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
     
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }

    const intervalId = setInterval(() => {
      if (userId) {
        socket.emit('getUserData', { userId });
      }
    }, 100);

    const sessionCountdownHandler = ({ seconds }) => {
      setCountdown(seconds);
      setSessionActive(true);
      sessionActiveRef.current = true;
    };

    const delayCountdownHandler = ({ seconds }) => {
      setCountdown(seconds);
      setSessionActive(false);
      sessionActiveRef.current = false;
    };

    const newSessionHandler = ({ sessionId }) => {
      console.log('Session started:', sessionId);
      localStorage.setItem('sessionId', sessionId);
      setCountdown(null);
      setSessionActive(true);
      sessionActiveRef.current = true;
    };

    const sessionEndHandler = () => {
      setCountdown(null);
      setSessionActive(false);
      sessionActiveRef.current = false;
    };

    const sessionSuccessHandler = ({
      userId: receivedSessionId,      
      totalWins,
      totalLosses,
    }) => {
        setWin(totalWins || 0); 
        setLose(totalLosses || 0);      
      
    };

    const sessionErrorHandler = ({ message }) => {
      console.error(`⚠️ Session data error: ${message}`);
    };

    socket.on('sessionCountdown', sessionCountdownHandler);
    socket.on('delayCountdown', delayCountdownHandler);
    socket.on('newSession', newSessionHandler);
    socket.on('sessionEnd', sessionEndHandler);
    socket.on('userSuccess', sessionSuccessHandler);
    socket.on('userError', sessionErrorHandler);

   
    

    return () => {
      clearInterval(intervalId);
      socket.off('sessionCountdown', sessionCountdownHandler);
      socket.off('delayCountdown', delayCountdownHandler);
      socket.off('newSession', newSessionHandler);
      socket.off('sessionEnd', sessionEndHandler);
      socket.off('sessionSuccess', sessionSuccessHandler);
      socket.off('sessionError', sessionErrorHandler);
      socket.disconnect(); 
    };
  }, []);

  useEffect(() => {
    console.log('Rendering component. sessionActive is now:', sessionActive);
  }, [sessionActive]);

  const handleJoinClick = () => {
    if (sessionActive && user) {
      const sessionId = localStorage.getItem('sessionId');
      socket.emit('joinRoom', {
        sessionId,
        id: user.user._id,
      });

      const successHandler = ({ sessionId }) => {
        console.log('Successfully joined:', sessionId);
        navigate('/gamepage');
        socket.off('joinSuccess', successHandler); 
      };

      const errorHandler = ({ message }) => {
        alert(`Join failed: ${message}`);
        socket.off('joinError', errorHandler);
      };

      socket.on('joinSuccess', successHandler);
      socket.on('joinError', errorHandler);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f2f0ec] flex items-center justify-center">
      <div className="absolute top-4 right-4 text-lg font-medium text-gray-900">
        {user ? `Hi ${user.user.username}` : 'Hi Guest'}
      </div>

      <div className="p-8 w-full max-w-md text-center space-y-6">
        <div className="text-2xl font-semibold text-gray-900">
          Total Wins: {win}
        </div>
        <div className="text-2xl font-semibold text-gray-900">
          Total Losses: {lose} 
        </div>

        <button
          className={`w-full py-3 rounded transition ${
            sessionActive ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
          } text-white`}
          disabled={!sessionActive}
          onClick={handleJoinClick}
        >
          {sessionActive ? 'JOIN' : 'Waiting for Session'}
        </button>

        {countdown !== null && (
          <div className="text-red-600 text-sm font-medium">
            {sessionActive
              ? `There's an active session you can join in ${countdown}s`
              : `Session starting in ${countdown}s`}
          </div>
        )}
      </div>
    </div>
  );
}