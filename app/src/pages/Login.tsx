import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystem } from '../contexts/SystemContext';

export function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);
  
  const { login } = useSystem();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const sucesso = login(usuario, senha);
    if (sucesso) {
      navigate('/');
    } else {
      setErro(true);
      setSenha('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-body relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #8f9098 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface-low border border-outline-variant/20 p-10 rounded-sm relative z-10 shadow-2xl backdrop-blur-xl">
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-surface-highest border border-outline-variant/30 flex items-center justify-center rounded-sm">
            <span className="material-symbols-outlined text-primary text-3xl">flight_takeoff</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-black tracking-widest text-on-surface font-headline uppercase mb-2">AEROCODE</h1>
          <p className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase">Kinetic Vault | Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest">Identificação (Usuário)</label>
            <input 
              type="text" 
              required
              value={usuario}
              onChange={(e) => { setUsuario(e.target.value); setErro(false); }}
              className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary px-4 py-3 rounded-sm text-sm text-on-surface outline-none transition-colors font-mono placeholder:text-on-surfaceVariant/30"
              placeholder="ex: admin, eng, op"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest">Senha de Acesso</label>
            <input 
              type="password" 
              required
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setErro(false); }}
              className="w-full bg-surface-container border border-outline-variant/30 focus:border-primary px-4 py-3 rounded-sm text-sm text-on-surface outline-none transition-colors font-mono tracking-widest placeholder:text-on-surfaceVariant/30"
              placeholder="••••••••"
            />
          </div>

          {erro && (
            <div className="bg-error-container/20 border border-[#ef4444]/30 p-3 rounded-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ef4444] text-[16px]">warning</span>
              <p className="text-[10px] font-bold text-[#ef4444] uppercase tracking-widest">Credenciais Inválidas</p>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-4 bg-primary text-background font-headline font-bold text-xs uppercase tracking-[0.2em] rounded-sm hover:brightness-110 transition-all mt-4 shadow-[0_0_20px_rgba(183,199,235,0.15)] hover:shadow-[0_0_30px_rgba(183,199,235,0.3)]"
          >
            Acessar Sistema
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline-variant/10 pt-6">
          <p className="text-[9px] text-on-surfaceVariant uppercase tracking-widest">Conexão Segura Estabelecida</p>
        </div>
      </div>
    </div>
  );
}