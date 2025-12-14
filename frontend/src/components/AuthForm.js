import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthForm.css';

const AuthForm = ({ type, onSubmit, message }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-card glass-panel">
                <h2>{type === 'login' ? 'Welcome Back' : 'Join the Crew'}</h2>
                <p className="auth-subtitle">
                    {type === 'login' ? 'Login to manage your sweets' : 'Register for an account'}
                </p>

                <form onSubmit={handleSubmit}>
                    {type === 'register' && (
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn hover-glow">
                        {type === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>

                {message && <p className="auth-message">{message}</p>}

                <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
                    {type === 'login' ? (
                        <p>New here? <Link to="/register" style={{ color: "var(--color-accent)" }}>Create an account</Link></p>
                    ) : (
                        <p>Already joined? <Link to="/login" style={{ color: "var(--color-accent)" }}>Login</Link></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
