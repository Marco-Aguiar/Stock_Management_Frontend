// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definição do tipo para o contexto de autenticação
interface AuthContextType {
  token: string | null;
  nomeUsuario: string | null; // Adicionamos o nome do usuário aqui
  login: (token: string, nome: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Crie o contexto com um valor padrão ou null
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Estados para o token e o nome do usuário
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(localStorage.getItem('nomeUsuario')); // Estado para o nome

  // Efeito para carregar o token e nome do localStorage ao iniciar a aplicação
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedNomeUsuario = localStorage.getItem('nomeUsuario');
    if (storedToken && storedNomeUsuario) {
      setToken(storedToken);
      setNomeUsuario(storedNomeUsuario);
    }
  }, []);

  // Função de login que agora recebe o nome
  const login = (newToken: string, nome: string) => {
    setToken(newToken);
    setNomeUsuario(nome);
    localStorage.setItem('token', newToken);
    localStorage.setItem('nomeUsuario', nome); // Armazena o nome no localStorage
  };

  // Função de logout
  const logout = () => {
    setToken(null);
    setNomeUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('nomeUsuario'); // Remove o nome do localStorage
  };

  const isAuthenticated = !!token; // Verifica se há um token

  return (
    <AuthContext.Provider value={{ token, nomeUsuario, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso do contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};