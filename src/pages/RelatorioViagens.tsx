import { useEffect, useState } from "react";
import { PlaneTakeoff, Calendar, MapPin, TrendingUp, Filter, ListOrdered, ArrowLeft } from "lucide-react"; // Import relevant icons and ArrowLeft
import StatusModal from "../modal/statusModal";
import { useNavigate } from "react-router-dom"; // Import useNavigate

type Despesa = { valor: number };
type ItemVenda = { quantidade: number; precoUnit: number };
type Venda = { itens: ItemVenda[] };

type Viagem = {
  id: number;
  destino: string;
  motorista: string;
  dataSaida: string;
  despesas?: Despesa[];
  vendas?: Venda[];
};

// Extend Viagem type for calculated totals
type ViagemComTotais = Viagem & {
  totalDespesas: number;
  totalVendas: number;
  lucro: number;
  data: string; // Adjusted to match the sliced date format
};

export default function RelatorioViagens() {
  const navigate = useNavigate(); // Hook for navigation

  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [filtroData, setFiltroData] = useState("");
  const [filtroDestino, setFiltroDestino] = useState("");
  const [ordenarPor, setOrdenarPor] = useState<"data" | "destino" | "lucro">("data");
  const [loading, setLoading] = useState(true); // State to manage loading status

  // States for StatusModal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchViagens = async () => {
      setLoading(true); // Start loading
      try {
        const res = await fetch("http://localhost:3000/viagens");
        if (!res.ok) {
          throw new Error("Falha ao carregar viagens. Verifique a conexão com o servidor.");
        }
        const data = await res.json();
        setViagens(data);
      } catch (err) {
        console.error("Erro ao carregar viagens", err);
        setStatusType('error');
        setStatusMessage("Não foi possível carregar o relatório de viagens. " + (err as Error).message);
        setShowStatusModal(true);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchViagens();
  }, []);

  const viagensComTotais: ViagemComTotais[] = viagens.map((v) => {
    const totalDespesas = (v.despesas ?? []).reduce((sum, d) => sum + d.valor, 0);

    const totalVendas = (v.vendas ?? [])
      .flatMap((venda) => venda.itens ?? [])
      .reduce((sum, i) => sum + i.quantidade * i.precoUnit, 0);

    const lucro = totalVendas - totalDespesas;

    return {
      ...v,
      data: v.dataSaida.slice(0, 10), // Ensures 'data' matches the format used for filtering
      totalDespesas,
      totalVendas,
      lucro,
    };
  });

  const viagensFiltradas = viagensComTotais
    .filter(
      (v) =>
        (!filtroData || v.data === filtroData) &&
        (!filtroDestino || v.destino.toLowerCase().includes(filtroDestino.toLowerCase()))
    )
    .sort((a, b) => {
      if (ordenarPor === "data") return a.data.localeCompare(b.data);
      if (ordenarPor === "destino") return a.destino.localeCompare(b.destino);
      return b.lucro - a.lucro; // Sorts by lucro in descending order
    });

  return (
    // Fundo gradiente
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-slate-900 dark:to-black flex flex-col items-center p-4 transition-colors duration-500 ease-in-out">
      <div className="w-full max-w-6xl mx-auto relative">
        {/* Botão de Voltar para Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-0 -left-12 sm:-left-20 lg:-left-28 p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-x-1 flex items-center justify-center z-10"
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <h1 className="text-4xl font-bold text-indigo-100 dark:text-indigo-400 text-center mb-8 flex items-center justify-center gap-3 drop-shadow-lg">
          <PlaneTakeoff className="h-10 w-10" /> Relatório de Viagens
        </h1>

        {/* --- Filters and Sorting Section --- */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-8 flex flex-col md:flex-row gap-6 items-end">
          <div className="flex flex-col w-full md:w-1/3">
            <label htmlFor="filter-data" className="text-md font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Calendar size={20} /> Filtrar por Data
            </label>
            <div className="relative flex items-center">
              <input
                id="filter-data"
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
              />
              {/* Icon moved inside input container for better alignment */}
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/3">
            <label htmlFor="filter-destino" className="text-md font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <MapPin size={20} /> Filtrar por Destino
            </label>
            <div className="relative flex items-center">
              <input
                id="filter-destino"
                type="text"
                placeholder="Ex: Curitiba"
                value={filtroDestino}
                onChange={(e) => setFiltroDestino(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
              />
              <MapPin className="absolute left-3 text-slate-400 dark:text-slate-500 h-6 w-6" /> {/* Icon added here */}
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/3">
            <label htmlFor="sort-by" className="text-md font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <ListOrdered size={20} /> Ordenar por
            </label>
            <div className="relative">
              <select
                id="sort-by"
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value as "data" | "destino" | "lucro")}
                className="block appearance-none w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer text-lg"
              >
                <option value="data">Data</option>
                <option value="destino">Destino</option>
                <option value="lucro">Lucro</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* --- Table Section --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 dark:border-indigo-400"></div>
            <p className="text-slate-600 dark:text-slate-300 text-xl mt-4">Carregando relatório de viagens...</p>
          </div>
        ) : viagensFiltradas.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-600 dark:text-slate-300 text-xl font-medium">Nenhuma viagem encontrada com os filtros e ordenação atuais.</p>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Tente ajustar os filtros ou a ordenação.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <table className="min-w-full text-base text-slate-800 dark:text-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-indigo-600 dark:bg-indigo-900 uppercase text-xs tracking-wider font-semibold border-b border-slate-300 dark:border-slate-600 text-white"> {/* Header row color */}
                  <th className="py-3 px-6 text-left rounded-tl-lg">Data</th>
                  <th className="py-3 px-6 text-left">Destino</th>
                  <th className="py-3 px-6 text-left">Motorista</th>
                  <th className="py-3 px-6 text-right">Despesas (R$)</th>
                  <th className="py-3 px-6 text-right">Vendas (R$)</th>
                  <th className="py-3 px-6 text-right rounded-tr-lg">Lucro (R$)</th>
                </tr>
              </thead>
              <tbody>
                {viagensFiltradas.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150 ease-in-out"
                  >
                    <td className="py-3 px-6">{new Date(v.data).toLocaleDateString('pt-BR')}</td> {/* Formata a data */}
                    <td className="py-3 px-6 font-medium">{v.destino}</td>
                    <td className="py-3 px-6">{v.motorista}</td>
                    <td className="py-3 px-6 text-right text-red-600 dark:text-red-400 font-semibold">
                      R$ {v.totalDespesas.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="py-3 px-6 text-right text-green-600 dark:text-green-400 font-semibold">
                      R$ {v.totalVendas.toFixed(2).replace(".", ",")}
                    </td>
                    <td
                      className={`py-3 px-6 text-right font-bold ${
                        v.lucro >= 0 ? "text-blue-700 dark:text-blue-500" : "text-red-700 dark:text-red-500" // Lucro positivo azul, negativo vermelho
                      }`}
                    >
                      R$ {v.lucro.toFixed(2).replace(".", ",")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Render StatusModal conditionally */}
      {showStatusModal && (
        <StatusModal
          message={statusMessage}
          type={statusType}
          onClose={() => setShowStatusModal(false)}
          duration={3000} // Fecha após 3 segundos
        />
      )}
    </div>
  );
}