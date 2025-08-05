import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import socket from '../../../utils/socket'; 

export default function GamePageResult({ sessionId, userId }) {
  const [countdown, setCountdown] = useState(null); 
  const [delayCountdown, setDelayCountdown] = useState(null); 
  const [activeUsers, setActiveUsers] = useState([]);
  const [winners, setWinners] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [winningNumber, setWinningNumber] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const sessionActiveRef = useRef(false);
  const navigate = useNavigate(); 

 useEffect(() => {
  const sessionId = localStorage.getItem('sessionId');
  socket.connect();
  console.log(sessionId);

  const intervalId = setInterval(() => {
    socket.emit('getSessionData', { sessionId });
    console.log('Emitting getSessionData...');
  }, 100);

  const sessionCountdownHandler = ({ seconds }) => {
    setCountdown(seconds);
    setSessionActive(true);
    sessionActiveRef.current = true;
  };

  const delayCountdownHandler = ({ seconds }) => {
    setDelayCountdown(seconds);
    setSessionActive(false);
    sessionActiveRef.current = false;
     if (seconds === 0) {
        setSessionActive(true);
        sessionActiveRef.current = true;
        navigate('/');

      }
  };

  const activeUsersHandler = ({ sessionId: receivedSessionId, activeUsers }) => {
    if (receivedSessionId === sessionId) {
      console.log(activeUsers);
      setActiveUsers(activeUsers);
    }
  };

  const playerCountHandler = ({ sessionId: receivedSessionId, count }) => {
    if (receivedSessionId === sessionId) {
      setTotalPlayers(count);
    }
  };

  const winnersHandler = ({ sessionId: receivedSessionId, winners }) => {
    if (receivedSessionId === sessionId) {
      setWinners(winners);
    }
  };

  const winCountHandler = ({ sessionId: receivedSessionId, count }) => {
    if (receivedSessionId === sessionId) {
      setTotalWins(count);
    }
  };

  const sessionEndHandler = ({ sessionId: receivedSessionId, winningNumber, activeUsers, playerCount }) => {
    if (receivedSessionId === sessionId) {
      setWinningNumber(winningNumber);
      setActiveUsers(activeUsers);
      setTotalPlayers(playerCount);
      setCountdown(null);
      setSessionActive(false);
      sessionActiveRef.current = false;
    }
  };

  const sessionSuccessHandler = ({ sessionId: receivedSessionId, activeUsers, winners, playerCount, winCount }) => {
    if (receivedSessionId === sessionId) {
      setActiveUsers(activeUsers);
      setWinners(winners);
      setTotalPlayers(playerCount);
      setTotalWins(winCount);
    }
  };

  const sessionErrorHandler = ({ message }) => {
    console.error(`⚠️ Session data error: ${message}`);
  };

  const countdownHandler = ({ seconds }) => {
    setCountdown(seconds);
  };

  socket.on('sessionCountdown', sessionCountdownHandler);
  socket.on('delayCountdown', delayCountdownHandler);
  socket.on('activeUsers', activeUsersHandler);
  socket.on('playerCount', playerCountHandler);
  socket.on('winners', winnersHandler);
  socket.on('winCount', winCountHandler);
  socket.on('sessionEnd', sessionEndHandler);
  socket.on('sessionSuccess', sessionSuccessHandler);
  socket.on('sessionError', sessionErrorHandler);
  socket.on('sessionCountdown', countdownHandler);

  socket.emit('getSessionData', { sessionId });

  return () => {
    clearInterval(intervalId);
    socket.off('sessionCountdown', sessionCountdownHandler);
    socket.off('delayCountdown', delayCountdownHandler);
    socket.off('activeUsers', activeUsersHandler);
    socket.off('playerCount', playerCountHandler);
    socket.off('winners', winnersHandler);
    socket.off('winCount', winCountHandler);
    socket.off('sessionEnd', sessionEndHandler);
    socket.off('sessionSuccess', sessionSuccessHandler);
    socket.off('sessionError', sessionErrorHandler);
    socket.off('sessionCountdown', countdownHandler);
    socket.disconnect();
  };
}, []);

  return (
    <div className="min-h-screen bg-[#e5e3df] grid grid-cols-3 w-full text-sm">
      <div className="bg-[#dad8d4] text-green-700 flex flex-col justify-center items-center gap-2 py-10">
        <h2 className="text-lg font-bold">Active Users Session</h2>
{(activeUsers || []).map((user) => (
            <div key={user} className="text-black">
            {user}
          </div>
        ))}
      </div>

      <div className="bg-[#f2f0ec] text-gray-900 flex flex-col justify-center items-center gap-2 py-10 text-center">
        <h2 className="text-lg font-bold">Result</h2>
        <div className="text-3xl font-semibold mb-10">{sessionActive && countdown !== null ? countdown : 0}</div>
        <div>
          Total Players: <strong>{totalPlayers}</strong>
        </div>
        <div>
          Total Wins: <strong>{totalWins}</strong>
        </div>
        <div className="mt-2 font-medium text-red-700">
          New session starts in: {delayCountdown !== null && !sessionActive ? delayCountdown : '0'}...
        </div>
      </div>

      <div className="bg-[#dad8d4] text-green-700 flex flex-col justify-center items-center gap-2 py-10">
        <h2 className="text-lg font-bold">Winners</h2>
{(winners || []).map((user) => (
            <div className="text-black" key={user}>
            {user}
          </div>
        ))}
      </div>
    </div>
  );
}