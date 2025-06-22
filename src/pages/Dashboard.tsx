import { useNavigate } from "react-router-dom"
import { useDarkMode } from "../hooks/useDarkMode"

export default function Dashboard() {
  const navigate = useNavigate()
  const [isDark, setIsDark] = useDarkMode()

  const saldo = 1247.32 // virá do backend depois

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel do Caminhoneiro</h1>
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          Modo {isDark ? "Claro" : "Escuro"}
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div
          className={`p-6 rounded-xl shadow-md ${
            saldo >= 0
              ? "bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          <h2 className="text-lg font-semibold">Saldo Atual</h2>
          <p className="text-3xl font-bold mt-2">
            R$ {saldo.toFixed(2).replace(".", ",")}
          </p>
        </div>

        <div className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 dark:text-gray-100">
          <h2 className="text-lg font-semibold">Produtos mais vendidos</h2>
          <ul className="mt-2 text-sm space-y-1">
            <li>🌹 Rosas Vermelhas</li>
            <li>🌻 Girassóis</li>
            <li>💐 Buquê Sortido</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <button
          onClick={() => navigate("/nova-venda")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          + Nova Venda
        </button>
        <button
          onClick={() => navigate("/cadastrar-produto")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          + Novo Produto
        </button>
        <button
          onClick={() => navigate("/nova-viagem")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          + Nova Viagem
        </button>
        <button
          onClick={() => navigate("/relatorio-viagens")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          📍 Relatório de Viagens
        </button>
        <button
          onClick={() => navigate("/relatorio-vendas")}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          📊 Relatório de Vendas
        </button>
      </div>
    </div>
  )
}
