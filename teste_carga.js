import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração dos cenários de teste (1, 5 e 10 usuários)
export const options = {
  stages: [
    // Cenário 1: Apenas 1 usuário por 30 segundos
    { duration: '30s', target: 1 }, 
    
    // Cenário 2: Sobe para 5 usuários e mantém por 30s
    { duration: '10s', target: 5 }, 
    { duration: '30s', target: 5 }, 

    // Cenário 3: Sobe para 10 usuários e mantém por 30s
    { duration: '10s', target: 10 }, 
    { duration: '30s', target: 10 }, 
    
    // Finaliza: Desce para 0
    { duration: '10s', target: 0 }, 
  ],
};

// O que cada "usuário virtual" vai fazer
export default function () {
  // Simula um acesso à lista de aeronaves (uma operação comum)
  const res = http.get('http://localhost:3001/api/aeronaves');
  
  // Verifica se o servidor respondeu com sucesso (Status 200)
  check(res, { 'status foi 200': (r) => r.status === 200 });
  
  // O usuário espera 1 segundo antes de atualizar a página de novo
  sleep(1); 
}