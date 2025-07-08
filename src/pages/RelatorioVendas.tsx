import { useEffect, useState } from "react"
import { BarChart2, Calendar, MapPin, Search, ArrowLeft } from "lucide-react" // Ícones relevantes e ArrowLeft
import StatusModal from "../modal/statusModal"
import { useNavigate } from "react-router-dom" // Para o botão de voltar

type Venda = {
  id: number
  data: string
  viagem: { destino: string }
  itens: {
    quantidade: number
    precoUnit: number
    produto: { nome: string }
  }[]
}

export default function RelatorioVendas() {
  const navigate = useNavigate(); // Hook para navegação

  const [vendas, setVendas] = useState<Venda[]>([])
  const [filtroData, setFiltroData] = useState("")
  const [filtroDestino, setFiltroDestino] = useState("")
  const [loading, setLoading] = useState(true); // Estado para indicar carregamento

  // Estados para o StatusModal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchVendas = async () => {
      setLoading(true); // Inicia o carregamento
      try {
        const res = await fetch("http://localhost:3000/vendas");
        if (!res.ok) {
          throw new Error("Falha ao carregar vendas. Verifique a conexão com o servidor.");
        }
        const data = await res.json();
        setVendas(data);
      } catch (err) {
        console.error("Erro ao carregar vendas", err);
        setStatusType('error');
        setStatusMessage("Não foi possível carregar o relatório de vendas. " + (err as Error).message);
        setShowStatusModal(true);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchVendas();
  }, [])

  const vendasFiltradas = vendas.filter((v) => {
    const dataVenda = new Date(v.data).toISOString().split("T")[0]
    const coincideData = !filtroData || dataVenda === filtroData
    const coincideDestino = !filtroDestino || v.viagem.destino.toLowerCase().includes(filtroDestino.toLowerCase())
    return coincideData && coincideDestino
  })

  return (
    // Fundo gradiente
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-slate-900 dark:to-black flex flex-col items-center p-4 transition-colors duration-500 ease-in-out">
      <div className="w-full max-w-5xl mx-auto relative"> {/* Adicionado 'relative' para o botão de voltar */}
        {/* Botão de Voltar para Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-0 -left-12 sm:-left-20 lg:-left-28 p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-x-1 flex items-center justify-center z-10"
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <h1 className="text-4xl font-bold text-indigo-100 dark:text-indigo-400 text-center mb-8 flex items-center justify-center gap-3 drop-shadow-lg">
          <BarChart2 className="h-10 w-10" /> Relatório de Vendas
        </h1>

        {/* Filtros */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-8 flex flex-col md:flex-row items-center gap-4">
          <label htmlFor="filtro-data" className="sr-only">Filtrar por data</label> {/* Acessibilidade */}
          <div className="relative flex items-center w-full md:w-auto flex-grow">
            <Calendar className="absolute left-3 text-slate-400 dark:text-slate-500 h-6 w-6" /> {/* Ícone maior */}
            <input
              id="filtro-data"
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
              aria-label="Filtrar por data"
            />
          </div>
          <label htmlFor="filtro-destino" className="sr-only">Filtrar por destino</label> {/* Acessibilidade */}
          <div className="relative flex items-center w-full md:w-auto flex-grow">
            <MapPin className="absolute left-3 text-slate-400 dark:text-slate-500 h-6 w-6" /> {/* Ícone maior */}
            <input
              id="filtro-destino"
              type="text"
              placeholder="Filtrar por destino"
              value={filtroDestino}
              onChange={(e) => setFiltroDestino(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
              aria-label="Filtrar por destino"
            />
          </div>
          {/* O botão "Buscar" pode ser mantido para visual, mas a funcionalidade já é automática */}
          <button
            onClick={() => { /* Lógica de pesquisa se houver, ou apenas um visual */ }}
            className="w-full md:w-auto flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg"
            aria-label="Aplicar filtros"
          >
            <Search className="mr-2 h-6 w-6" /> Buscar
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 dark:border-indigo-400"></div>
            <p className="text-slate-600 dark:text-slate-300 text-xl mt-4">Carregando vendas...</p>
          </div>
        ) : vendasFiltradas.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-600 dark:text-slate-300 text-xl font-medium">Nenhuma venda encontrada para os filtros aplicados.</p>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Tente ajustar a data ou o destino.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {vendasFiltradas.map((venda) => {
              const total = venda.itens.reduce(
                (acc, item) => acc + item.quantidade * item.precoUnit,
                0
              )
              return (
                <div
                  key={venda.id}
                  className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-shadow duration-200 hover:shadow-lg"
                >
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      Venda ID: {venda.id}
                    </h2>
                    <span className="text-lg font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-indigo-500" /> {venda.viagem.destino}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Data: {new Date(venda.data).toLocaleDateString('pt-BR')}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Itens da Venda:</h3>
                  <ul className="mt-3 space-y-2 text-base text-slate-700 dark:text-slate-300">
                    {venda.itens.map((item, index) => (
                      <li key={index} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                        <span className="font-medium text-slate-800 dark:text-white">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.quantidade}x</span> {item.produto.nome}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          R$ {(item.quantidade * item.precoUnit).toFixed(2).replace(".", ",")}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-right text-3xl font-bold text-slate-800 dark:text-white">
                    Total da Venda:{" "}
                    <span className="text-green-600 dark:text-green-400">
                      R$ {total.toFixed(2).replace(".", ",")}
                    </span>
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Renderiza o modal de status condicionalmente */}
      {showStatusModal && (
        <StatusModal
          message={statusMessage}
          type={statusType}
          onClose={() => setShowStatusModal(false)}
          duration={3000} // Fecha após 3 segundos
        />
      )}
    </div>
  )
}