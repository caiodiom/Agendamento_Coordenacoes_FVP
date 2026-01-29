import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import logoFVP from '@/assets/logo-fvp.jpg';
import { toast } from 'sonner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    // Simula delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = login(username.trim(), password.trim());
    
    if (success) {
      toast.success('Login realizado com sucesso!');
      
      // Redireciona baseado no tipo de coordenador
      if (username === 'geral') {
        navigate('/geral');
      } else {
        navigate('/painel');
      }
    } else {
      toast.error('Credenciais inválidas');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="header-gradient p-8 text-center">
            <div className="bg-white rounded-xl p-2 w-20 h-20 mx-auto mb-4 shadow-lg">
              <img 
                src={logoFVP} 
                alt="Faculdade Vale do Pajeú" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Área do Coordenador</h1>
            <p className="text-white/80 text-sm mt-1">Sistema de Agendamentos</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="input-field"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="input-field pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>
        </div>

              {/*
                Link voltar para a página inicial
                (comentado para não ser exibido na página)
              */}
              {/*
              <p className="text-center mt-6">
                <a
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  ← Voltar para a página inicial
                </a>
              </p>
              */}

              
      </div>
      
    </div>
    

  );
};

export default Login;
