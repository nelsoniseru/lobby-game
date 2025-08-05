import React, { useState, useEffect } from 'react';

export default function TopPlayersTable() {
  const [filter, setFilter] = useState('all');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
                const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:4000/game/leaderboard?filter=${filter}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        const { status, data } = await response.json();
        if (!status) throw new Error(data.message || 'Failed to fetch leaderboard');
        setPlayers(data.topPlayers || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [filter]);

  return (
    <div className="p-4 bg-[#e5e3df] min-h-screen text-gray-900">
      <h2 className="text-lg font-bold mb-4">Top 10 Players</h2>

      <div className="flex gap-4 mb-4">
        {['all', 'day', 'week', 'month'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 border rounded ${
              filter === type ? 'bg-green-700 text-white' : 'bg-[#dad8d4]'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full border border-gray-300 bg-[#f2f0ec]">
          <thead className="bg-[#dad8d4]">
            <tr>
              <th className="text-left p-2 border">Player</th>
              <th className="text-left p-2 border">Wins</th>
              <th className="text-left p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{player.name}</td>
                <td className="p-2">{player.wins}</td>
                <td className="p-2">{player.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}