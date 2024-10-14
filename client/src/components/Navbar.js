import React, { useState } from 'react';
import './Navbar.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="navbar-container">
            <img className="logo" src={`/logo100.png`} alt="Logo" />
            <div className={`nav-links ${isOpen ? "open" : ""}`}>
                <h1 className="page-title"><Link to="/about">R6TV</Link></h1>
                <h1 className="Ranking"><Link to="/">Global Ranking</Link></h1>
                <h1 className="Tournament"><Link to="/tournaments">Tournaments</Link></h1>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </div>
        </div>
    );
};

export default Navbar;