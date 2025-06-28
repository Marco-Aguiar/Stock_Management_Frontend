// src/pages/RelatorioInventario.tsx
import { useEffect, useState } from "react"
import { DollarSign, Package, TrendingUp, TrendingDown, ClipboardList } from "lucide-react" // Ícones úteis
import { useNavigate } from "react-router-dom" // Para o botão de voltar
import StatusModal from "../modal/statusModal"

type ProdutoInventario = {
  id: number
  nome: string
  quantidadeAtual: number
  precoCompra: number
  precoVenda: number
  valorTotalEmEstoqueCompra: number
  valorTotalEmEstoqueVendaPotencial: number
}

type RelatorioInventarioData = {
  produtos: ProdutoInventario[]
  totais: {
    totalGeralValorCompra: number
    totalGeralValorVendaPotencial: number
    totalItensEmEstoque: number
  }
}

export default function RelatorioInventario() {
  const [relatorio, setRelatorio] = useState<RelatorioInventarioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const response = await fetch("http://localhost:3000/produtos/relatorio-inventario")
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`)
        }
        const data: RelatorioInventarioData = await response.json()
        setRelatorio(data)
      } catch (err) {
        console.error("Erro ao carregar relatório de inventário:", err)
        setError("Não foi possível carregar o relatório de inventário. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }
    fetchRelatorio()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white">
        <p>Carregando relatório...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white p-4">
        <StatusModal
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors duration-300"
        >
          Voltar para Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-6 text-slate-800 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
            <ClipboardList className="w-10 h-10 mr-3" /> Relatório de Inventário
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg shadow hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300"
          >
            Voltar para Dashboard
          </button>
        </div>

        {/* Cards de Totais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg text-blue-700 dark:text-blue-200">Total de Itens em Estoque</p>
              <p className="text-3xl font-bold text-blue-800 dark:text-blue-100">
                {relatorio?.totais.totalItensEmEstoque || 0}
              </p>
            </div>
            <Package className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg text-green-700 dark:text-green-200">Valor Total de Compra no Estoque</p>
              <p className="text-3xl font-bold text-green-800 dark:text-green-100">
                R$ {(relatorio?.totais.totalGeralValorCompra || 0).toFixed(2).replace(".", ",")}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-lg text-purple-700 dark:text-purple-200">Valor Potencial de Venda no Estoque</p>
              <p className="text-3xl font-bold text-purple-800 dark:text-purple-100">
                R$ {(relatorio?.totais.totalGeralValorVendaPotencial || 0).toFixed(2).replace(".", ",")}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        {/* Tabela de Produtos no Inventário */}
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-6">Detalhamento dos Produtos</h2>
        {relatorio?.produtos && relatorio.produtos.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white dark:bg-slate-700 rounded-lg overflow-hidden">
              <thead className="bg-slate-200 dark:bg-slate-600">
                <tr className="text-left text-slate-700 dark:text-slate-200">
                  <th className="py-3 px-4 uppercase font-semibold text-sm">Produto</th>
                  <th className="py-3 px-4 uppercase font-semibold text-sm text-center">Qtd. Atual</th>
                  <th className="py-3 px-4 uppercase font-semibold text-sm text-right">Preço Compra</th>
                  <th className="py-3 px-4 uppercase font-semibold text-sm text-right">Preço Venda</th>
                  <th className="py-3 px-4 uppercase font-semibold text-sm text-right">Valor Total Compra</th>
                  <th className="py-3 px-4 uppercase font-semibold text-sm text-right">Valor Total Venda Potencial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                {relatorio.produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-200">
                    <td className="py-3 px-4">{produto.nome}</td>
                    <td className="py-3 px-4 text-center">{produto.quantidadeAtual}</td>
                    <td className="py-3 px-4 text-right">R$ {produto.precoCompra.toFixed(2).replace(".", ",")}</td>
                    <td className="py-3 px-4 text-right">R$ {produto.precoVenda.toFixed(2).replace(".", ",")}</td>
                    <td className="py-3 px-4 text-right">R$ {produto.valorTotalEmEstoqueCompra.toFixed(2).replace(".", ",")}</td>
                    <td className="py-3 px-4 text-right">R$ {produto.valorTotalEmEstoqueVendaPotencial.toFixed(2).replace(".", ",")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">Nenhum produto encontrado no inventário.</p>
        )}
      </div>
    </div>
  )
}