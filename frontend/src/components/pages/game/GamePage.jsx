


import React, { useState, useEffect } from 'react';
import socket from '../../../utils/socket'; 
import { useNavigate } from 'react-router-dom';

export default function GamePage() {
  const [countdown, setCountdown] = useState(null);
  const [formValue, setFormValue] = useState('');
  const [playersCount, setPlayersCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    socket.connect();

    const intervalId = setInterval(() => {
      socket.emit('playerCount', { sessionId });
      console.log('Emitting playerCount...');
    }, 100);

    const successHandler = ({ sessionId: incomingSessionId, count }) => {
      if (incomingSessionId === sessionId) {
        setPlayersCount(count);
      }
    };

    const errorHandler = ({ message }) => {
      console.error(`Player count error: ${message}`);
    };

    const broadcastHandler = ({ sessionId: incomingSessionId, count }) => {
      if (incomingSessionId === sessionId) {
        setPlayersCount(count);
      }
    };

    const countdownHandler = ({ seconds }) => {
      setCountdown(seconds);
      if (seconds === 0) {
        navigate('/');
      }
    };

    socket.on('playerSuccess', successHandler);
    socket.on('playerError', errorHandler);
    socket.on('playerCount', broadcastHandler);
    socket.on('sessionCountdown', countdownHandler);

    return () => {
      clearInterval(intervalId);
      socket.off('playerSuccess', successHandler);
      socket.off('playerError', errorHandler);
      socket.off('playerCount', broadcastHandler);
      socket.off('sessionCountdown', countdownHandler);
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionId = localStorage.getItem('sessionId');
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
const parsedUser = JSON.parse(user);



try {
  const response = await fetch(`http://localhost:4000/game/choose-number`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      sessionId,
      userId: parsedUser.user._id,
      number: parseInt(formValue)
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.data?.message || 'Submission failed');
  }

  const result = await response.json();
  console.log('Submission result:', result);
  navigate('/gameresult');
} catch (err) {
  alert(`Failed to submit number: ${err.message}`);
}
  };

  return (
    <div className="relative min-h-screen bg-[#f2f0ec] flex items-center justify-center">
      <div className="absolute top-4 right-4 text-lg font-bold text-gray-800">
        Countdown timer: <br /> {countdown !== null ? `${countdown}s` : 'Waiting...'}
      </div>

      <div className="p-8 w-full max-w-md text-center space-y-6">
        <div className="text-2xl font-semibold text-gray-900">
          Pick a random number from 1 - 9
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            min="1"
            max="9"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Enter a number"
            className="w-full px-4 py-2 bg-white rounded focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Pick
          </button>
        </form>
        <div className="text-green-600 text-sm font-medium">
          {playersCount} users join
        </div>
      </div>
    </div>
  );
}
