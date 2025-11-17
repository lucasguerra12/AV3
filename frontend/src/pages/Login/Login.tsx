import React, { useState } from 'react';
import './Login.css';
import backgroundImage from '../../assets/aviao.jpg'; // Imagem da AV2
import logoImage from '../../assets/logo.png'; // Logo da AV2
import { Funcionario } from '../../models/Funcionario';

interface LoginProps {
  // A nossa prop onLogin (do App.tsx da AV3) espera email e senha
  onLogin: (email: string, senha: string) => void; 
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // O original da AV2 usava 'password'

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // A lógica da AV3: passa ambos os campos para o App.tsx
        onLogin(email, password);
    };

    return (
        // Este é o JSX/Visual 100% idêntico ao da AV2
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