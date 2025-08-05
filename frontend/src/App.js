import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/auth/Login';
import Register from './components/pages/auth/Register';
import Homepage from './components/pages/index/HomePage';
import './App.css';
import GamePage from './components/pages/game/GamePage';
import GamePageResult from './components/pages/game/GamePageResult';
import TopPlayersTable from './components/pages/game/TopPlayersTable';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            index
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gamepage"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <TopPlayersTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gameresult"
            element={
              <ProtectedRoute>
                <GamePageResult />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;