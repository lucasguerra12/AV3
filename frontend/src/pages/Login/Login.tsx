// frontend/src/pages/Login/Login.tsx (ATUALIZADO)
import React, { useState } from 'react';
import './Login.css';
import logo from '../../assets/logo.png';

interface LoginProps {
  // 1. Atualizamos a "assinatura" da função
  onLogin: (email: string, senha: string) => void; 
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  
  // 2. Adicionamos estado para a senha
  const [senha, setSenha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && senha) { // 3. Verificamos ambos os campos
      onLogin(email, senha); // 4. Enviamos ambos
    } else {
      alert('Por favor, preencha o email e a senha.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={logo} alt="AeroCode Logo" className="login-logo" />
        <h2>Controlo de Montagem</h2>
        
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="engenheiro@aerocode.com"
          />
        </div>
        
        {/* 5. Adicionamos o campo de senha */}
        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="********"
          />
        </div>

        <button type="submit" className="login-button">Entrar</button>
      </form>
    </div>
  );
};

export default Login;