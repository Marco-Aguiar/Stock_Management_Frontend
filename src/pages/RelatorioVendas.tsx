import { useEffect, useState } from "react"
import { BarChart2, Calendar, MapPin, Search } from "lucide-react" // Ícones relevantes
import StatusModal from "../modal/statusModal"

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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center p-4 transition-colors duration-300">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 text-center mb-8 flex items-center justify-center gap-3">
          <BarChart2 className="h-9 w-9" /> Relatório de Vendas
        </h1>

        {/* Filtros */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex items-center w-full md:w-auto flex-grow">
            <Calendar className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />
            <input
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              aria-label="Filtrar por data"
            />
          </div>
          <div className="relative flex items-center w-full md:w-auto flex-grow">
            <MapPin className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Filtrar por destino"
              value={filtroDestino}
              onChange={(e) => setFiltroDestino(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              aria-label="Filtrar por destino"
            />
          </div>
          {/* Adicione um botão ou ícone de pesquisa se quiser, mas o filtro é automático com onChange */}
          <button
            onClick={() => { /* Lógica de pesquisa se houver, ou apenas um visual */ }}
            className="hidden md:flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors duration-300"
            aria-label="Aplicar filtros"
          >
            <Search className="mr-2 h-5 w-5" /> Buscar
          </button>
        </div>

        {loading ? (
          <p className="text-slate-600 dark:text-slate-300 text-center text-lg mt-10">Carregando vendas...</p>
        ) : vendasFiltradas.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-300 text-center text-lg mt-10">Nenhuma venda encontrada para os filtros aplicados.</p>
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
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Venda ID: {venda.id} - {venda.viagem.destino}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Data: {new Date(venda.data).toLocaleDateString()}
                  </p>
                  <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">Itens:</h3>
                  <ul className="mt-3 space-y-2 text-base text-slate-700 dark:text-slate-300">
                    {venda.itens.map((item, index) => (
                      <li key={index} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-2 rounded-md">
                        <span className="font-medium">
                          {item.quantidade}x {item.produto.nome}
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          R$ {(item.quantidade * item.precoUnit).toFixed(2).replace(".", ",")}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-right text-2xl font-bold text-slate-800 dark:text-white">
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
        />
      )}
    </div>
  )
}