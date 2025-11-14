import React, { useState } from 'react';
import './Login.css';

import backgroundImage from '../../assets/aviao.jpg';
import logoImage from '../../assets/logo.png';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email);
    };

    return (
        <div className="login-page-container">
            <div 
                className="login-image-side" 
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
            </div>

            <div className="login-form-side">
                <div className="login-card">
                    <img src={logoImage} alt="AeroCode Logo" className="login-logo" />
                    <h2>LOGIN</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;