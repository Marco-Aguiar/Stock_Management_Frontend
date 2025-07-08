// src/pages/RelatorioInventario.tsx
import { useEffect, useState } from "react"
import { DollarSign, Package, TrendingUp, ClipboardList, ArrowLeft } from "lucide-react" // Ícones úteis e ArrowLeft
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
        setError("Não foi possível carregar o relatório de inventário. Verifique sua conexão com o servidor ou tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }
    fetchRelatorio()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-800 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-slate-900 dark:to-black text-white">
        <p className="text-xl font-medium animate-pulse">Carregando relatório de inventário...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-800 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-slate-900 dark:to-black flex flex-col items-center justify-center p-4">
        <StatusModal
          message={error}
          type="error"
          onClose={() => setError(null)}
          duration={5000} // Mostra o erro por 5 segundos
        />
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 text-lg"
        >
          <ArrowLeft className="h-6 w-6" /> Voltar para Dashboard
        </button>
      </div>
    )
  }

  return (
    // Fundo gradiente
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-slate-900 dark:to-black p-6 text-slate-800 dark:text-white transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 relative"> {/* rounded-2xl */}
        {/* Botão de Voltar para Dashboard */}
        {/* Ajustado o posicionamento para ser mais consistente */}
        <button
          onClick={() => navigate("/dashboard")}
          // Usando 'top-6' e 'left-6' para um posicionamento mais dentro do fluxo do conteúdo,
          // mas ainda no canto superior esquerdo do card principal.
          // Removendo os '-left' negativos para evitar problemas em telas menores.
          className="absolute top-6 left-6 p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-x-1 flex items-center justify-center z-10"
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-400 text-center mb-10 flex items-center justify-center gap-3 drop-shadow-lg">
          <ClipboardList className="h-10 w-10" /> Relatório de Inventário
        </h1>

        {/* Cards de Totais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card Total Itens em Estoque */}
          <div className="bg-blue-500/10 dark:bg-blue-900/40 p-6 rounded-xl shadow-md flex items-center justify-between border border-blue-400 dark:border-blue-700">
            <div>
              <p className="text-lg text-blue-700 dark:text-blue-200 font-medium">Total de Itens em Estoque</p>
              <p className="text-4xl font-bold text-blue-800 dark:text-blue-100 mt-2">
                {relatorio?.totais.totalItensEmEstoque || 0}
              </p>
            </div>
            <Package className="w-14 h-14 text-blue-600 dark:text-blue-400 opacity-75" />
          </div>

          {/* Card Valor Total de Compra */}
          <div className="bg-orange-500/10 dark:bg-orange-900/40 p-6 rounded-xl shadow-md flex items-center justify-between border border-orange-400 dark:border-orange-700">
            <div>
              <p className="text-lg text-orange-700 dark:text-orange-200 font-medium">Valor Total de Compra no Estoque</p>
              <p className="text-4xl font-bold text-orange-800 dark:text-orange-100 mt-2">
                R$ {(relatorio?.totais.totalGeralValorCompra || 0).toFixed(2).replace(".", ",")}
              </p>
            </div>
            <DollarSign className="w-14 h-14 text-orange-600 dark:text-orange-400 opacity-75" />
          </div>

          {/* Card Valor Potencial de Venda */}
          <div className="bg-green-500/10 dark:bg-green-900/40 p-6 rounded-xl shadow-md flex items-center justify-between border border-green-400 dark:border-green-700">
            <div>
              <p className="text-lg text-green-700 dark:text-green-200 font-medium">Valor Potencial de Venda no Estoque</p>
              <p className="text-4xl font-bold text-green-800 dark:text-green-100 mt-2">
                R$ {(relatorio?.totais.totalGeralValorVendaPotencial || 0).toFixed(2).replace(".", ",")}
              </p>
            </div>
            <TrendingUp className="w-14 h-14 text-green-600 dark:text-green-400 opacity-75" />
          </div>
        </div>

        {/* Tabela de Produtos no Inventário */}
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-6 flex items-center gap-2 border-b pb-4 border-slate-200 dark:border-slate-700">
          <ClipboardList className="h-7 w-7 text-indigo-500" /> Detalhamento dos Produtos
        </h2>
        {relatorio?.produtos && relatorio.produtos.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
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
                    <td className="py-3 px-4 text-slate-800 dark:text-white">{produto.nome}</td>
                    <td className="py-3 px-4 text-center text-slate-800 dark:text-white font-medium">{produto.quantidadeAtual}</td>
                    <td className="py-3 px-4 text-right text-orange-600 dark:text-orange-400 font-medium">R$ {produto.precoCompra.toFixed(2).replace(".", ",")}</td>
                    <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">R$ {produto.precoVenda.toFixed(2).replace(".", ",")}</td>
                    <td className="py-3 px-4 text-right text-orange-700 dark:text-orange-300 font-bold">R$ {produto.valorTotalEmEstoqueCompra.toFixed(2).replace(".", ",")}</td>
                    <td className="py-3 px-4 text-right text-green-700 dark:text-green-300 font-bold">R$ {produto.valorTotalEmEstoqueVendaPotencial.toFixed(2).replace(".", ",")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8 text-lg">Nenhum produto encontrado no inventário para gerar o relatório.</p>
        )}
      </div>
    </div>
  )
}