import React from 'react';
import '../styles/Navbar.css';
import logo from '../logo.jpg';

const Navbar = ({ onLogout }) => {
    return (
        <nav className="navbar glass-panel">
            <div className="navbar-left">
                <img src={logo} alt="Sweet Tooth Logo" style={{ height: "50px", borderRadius: "8px" }} />
            </div>

            <div className="navbar-center">
                <h1>Sweet Tooth</h1>
            </div>

            <div className="navbar-right">
                <button className="nav-item">Shop</button>
                <button className="nav-item">About</button>
                <button className="nav-item logout-btn" onClick={onLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
