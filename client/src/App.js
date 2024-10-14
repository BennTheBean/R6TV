import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Ranking from "./pages/Ranking";
import TournamentPage from "./pages/TournamentPage";
import MainPage from "./pages/MainPage";
import TeamPage from "./pages/TeamPage"; // Import the new TeamPage component

function App() {
    return (
        <Router basename="/">
            <Routes>
                <Route exact path="/" element={<Ranking />} />
                <Route exact path="/about" element={<MainPage />} />
                <Route exact path="/tournaments" element={<TournamentPage />} />
                <Route exact path="/team/:tag" element={<TeamPage />} /> {/* Add new route for team page */}
            </Routes>
        </Router>
    );
}

export default App;