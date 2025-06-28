import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDarkMode } from "../hooks/useDarkMode"
// Importando TODOS os ícones necessários, incluindo ClipboardList para o novo relatório
import { Sun, Moon, DollarSign, Package, Truck, BarChart, ShoppingCart, Warehouse, PackagePlus, ClipboardList } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

type ProdutoMaisVendido = {
  nome: string
  quantidade: number
}

type DashboardData = {
  totalVendas: number
  totalLucro: number
  totalDespesas: number
  lucroLiquido: number
  topProdutosMaisVendidos: ProdutoMaisVendido[]
  viagemMaisRentavel: { viagemId: number; receita: number } | null
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [isDark, setIsDark] = useDarkMode()
  const [dados, setDados] = useState<DashboardData | null>(null)
  const { nomeUsuario } = useAuth() // <-- NOVO: Acesse o nomeUsuario do contexto de autenticação

  useEffect(() => {
    // Certifique-se de que se precisar de autenticação para essa chamada, o token seja enviado
    fetch("http://localhost:3000/dashboard")
      .then(res => res.json())
      .then(setDados)
      .catch(error => console.error("Erro ao carregar dashboard:", error))
  }, [])

  const saldo = dados ? dados.lucroLiquido : 0

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            {/* <-- NOVO: Adicione a saudação com o nome do usuário */}
            Olá {nomeUsuario ? nomeUsuario.split(' ')[0] : 'Caminhoneiro'}!
          </h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 ease-in-out flex items-center gap-2"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            Modo {isDark ? "Claro" : "Escuro"}
          </button>
        </div>

        {/* --- Dashboard Cards (unchanged) --- */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Card de Saldo Atual */}
          <div
            className={`p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center transition-colors duration-300
            ${
              saldo >= 0
                ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            <DollarSign className="h-10 w-10 mb-3" />
            <h2 className="text-xl font-semibold mb-2">Saldo Atual</h2>
            <p className="text-4xl font-bold">
              R$ {saldo.toFixed(2).replace(".", ",")}
            </p>
          </div>

          {/* Card de Top Produtos Mais Vendidos */}
          <div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-colors duration-300">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Package className="h-6 w-6" /> Top 5 Produtos Mais Vendidos
            </h2>
            <ul className="mt-2 text-base space-y-2">
              {dados?.topProdutosMaisVendidos && dados.topProdutosMaisVendidos.length > 0 ? (
                dados.topProdutosMaisVendidos.map((p, i) => (
                  <li key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{i + 1}. {p.nome}</span>
                    <span className="text-slate-600 dark:text-slate-300">{p.quantidade} unidades</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 dark:text-slate-400 text-center py-4">Nenhum produto registrado ainda.</li>
              )}
            </ul>
          </div>

          {/* Card de Viagem Mais Rentável */}
          <div className="p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-colors duration-300 flex flex-col justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6" /> Viagem Mais Rentável
            </h2>
            {dados?.viagemMaisRentavel ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  Viagem #{dados.viagemMaisRentavel.viagemId}
                </p>
                <p className="text-3xl font-bold mt-2">
                  R$ {dados.viagemMaisRentavel.receita.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  (Maior receita individual)
                </p>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4 h-full flex items-center justify-center">Nenhuma viagem registrada com receita ainda.</p>
            )}
          </div>
        </div>

        {/* --- Action Buttons Section (REORDENADA) --- */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* 1. Cadastro de Produtos */}
          <button
            onClick={() => navigate("/cadastrar-produto")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Package className="mr-2 h-5 w-5" />
            + Novo Produto
          </button>
          {/* 2. Nova Viagem */}
          <button
            onClick={() => navigate("/nova-viagem")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Truck className="mr-2 h-5 w-5" />
            + Nova Viagem
          </button>
          {/* 3. Nova Venda */}
          <button
            onClick={() => navigate("/nova-venda")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            + Nova Venda
          </button>

          {/* Gerenciamento de Estoque */}
          <button
            onClick={() => navigate("/estoque-atual")}
            className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            <Warehouse className="mr-2 h-5 w-5" />
            Estoque Atual
          </button>
          <button
            onClick={() => navigate("/entrada-produtos")}
            className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            <PackagePlus className="mr-2 h-5 w-5" />
            Entrada de Produtos
          </button>

          {/* Relatórios */}
          <button
            onClick={() => navigate("/relatorio-inventario")}
            className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            <ClipboardList className="mr-2 h-5 w-5" />
            Relatório de Inventário
          </button>
          <button
            onClick={() => navigate("/relatorio-viagens")}
            className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            <BarChart className="mr-2 h-5 w-5" />
            Relatório de Viagens
          </button>
          <button
            onClick={() => navigate("/relatorio-vendas")}
            className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Relatório de Vendas
          </button>
        </div>
      </div>
    </div>
  )
}