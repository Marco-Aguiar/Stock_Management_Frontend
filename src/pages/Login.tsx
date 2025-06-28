// src/pages/Login.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Importação do useAuth
import { AtSign, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Usando o hook useAuth para obter a função login

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "E-mail ou senha inválidos.");
      }

      // <-- ATENÇÃO AQUI: Agora desestruturamos 'token' E 'nomeUsuario' da resposta
      const { token, nomeUsuario } = await res.json();

      // Você já está salvando o token no localStorage via useAuth().login
      // Então, esta linha `localStorage.setItem("token", token);` pode ser removida
      // se a função `login` do AuthContext já faz isso.
      // Vou manter a chamada `login(token, nomeUsuario)` abaixo, que é a que realmente
      // gerencia o estado e o localStorage pelo AuthContext.
      // localStorage.setItem("token", token); // <-- Esta linha provavelmente será removida/comentada

      // <-- ATENÇÃO AQUI: Passamos AMBOS o token e o nomeUsuario para a função login
      login(token, nomeUsuario); // Corrigido para passar o nome do usuário

      navigate("/dashboard");
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            Projeto Marco
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Bem-vindo de volta! Faça login para continuar.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-semibold text-center text-slate-800 dark:text-white mb-6">
            Acesso ao Sistema
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              E-mail
            </label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {erro && (
            <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/20 p-3 rounded-lg mb-4">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Entrar
              </>
            )}
          </button>

          <div className="text-center mt-6">
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Esqueceu sua senha?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}