import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaFilter } from 'react-icons/fa';
import "./Ranking.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [displayedTeams, setDisplayedTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegions, setSelectedRegions] = useState(new Set());
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const loadTeams = useCallback(async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      const parsedTeams = data.map((team) => ({
        rank: team.rank,
        fullName: team.full_name,
        name: team.tag,
        region: team.region,
        elo: team.elo
      }));

      setTeams(parsedTeams);
      setDisplayedTeams(parsedTeams.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const filteredTeams = useMemo(() => {
    return teams
      .filter(team =>
        team.name.toUpperCase().includes(searchQuery) ||
        team.fullName.toUpperCase().includes(searchQuery)
      )
      .filter(team => selectedRegions.size === 0 || selectedRegions.has(team.region));
  }, [searchQuery, selectedRegions, teams]);

  useEffect(() => {
    setDisplayedTeams(filteredTeams.slice(0, 10));
  }, [filteredTeams]);

  const loadMoreTeams = () => {
    setDisplayedTeams(prev => {
      const nextTeams = filteredTeams.slice(prev.length, prev.length + 10);
      return [...prev, ...nextTeams];
    });
  };

  const showLessTeams = () => {
    setDisplayedTeams(prev => prev.slice(0, prev.length - (prev.length % 10 || 10)));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toUpperCase());
  };

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegions(prev => {
      const newSet = new Set(prev);
      if (event.target.checked) {
        newSet.add(region);
      } else {
        newSet.delete(region);
      }
      return newSet;
    });
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(prev => !prev);
  };

  const getImageSrc = useCallback((teamName) => {
    return `/images/teams/${teamName.toLowerCase()}.png`;
  }, []);

  const uniqueRegions = useMemo(() => [...new Set(teams.map(team => team.region))], [teams]);

  const canLoadMore = !searchQuery && displayedTeams.length < filteredTeams.length;
  const canShowLess = displayedTeams.length > 10;

  const handleTeamClick = (teamTag) => {
    navigate(`/team/${teamTag}`); // Navigate to the team page using the team tag
  };

  return (
    <div className="MainPage">
      <Navbar/>
      <div className="menu-container">
          <div className="filter-container">
            <FaFilter className="filter-icon" onClick={toggleFilterMenu} />
            {isFilterMenuOpen && (
              <div className="filter-menu">
                <h3>Filter by Region</h3>
                {uniqueRegions.map(region => (
                  <label key={region} className="filter-label">
                    {region}
                    <input
                      type="checkbox"
                      value={region}
                      checked={selectedRegions.has(region)}
                      onChange={handleRegionChange}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
      </div>
      <table className="team-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th></th>
            <th>Region</th>
            <th>Elo</th>
          </tr>
        </thead>
        <tbody>
          {displayedTeams.map((team) => (
            <tr key={team.rank}>
              <td>{team.rank}</td>
              <td onClick={() => handleTeamClick(team.name)}>
                <img
                  src={getImageSrc(team.name)}
                  alt={team.name}
                  className="team-photo"
                  style={{ cursor: "pointer" }}
                />
              </td>
              <td>
                <span className="team-fullname">{team.fullName.toUpperCase()}</span>
                <span className="team-shortname">{team.name.toUpperCase()}</span>
              </td>
              <td>{team.region}</td>
              <td>{team.elo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons-container">
        <button onClick={loadMoreTeams} disabled={!canLoadMore}>Show More</button>
        <button onClick={showLessTeams} disabled={!canShowLess}>Show Less</button>
      </div>
      <h5>Made by <a href="https://x.com/BennTheBean">@BennTheBean</a></h5>
    </div>
  );
};

export default MainPage;