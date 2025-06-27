import { useEffect, useState } from "react";
import { PlaneTakeoff, Calendar, MapPin, TrendingUp, Filter, ListOrdered } from "lucide-react"; // Import relevant icons
import StatusModal from "../modal/statusModal";

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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center p-4 transition-colors duration-300">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 text-center mb-8 flex items-center justify-center gap-3">
          <PlaneTakeoff className="h-9 w-9" /> Relatório de Viagens
        </h1>

        {/* --- Filters and Sorting Section --- */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-8 flex flex-col md:flex-row gap-6 items-end">
          <div className="flex flex-col w-full md:w-1/3">
            <label htmlFor="filter-data" className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1">
              <Calendar size={16} /> Filtrar por Data
            </label>
            <div className="relative flex items-center">
              <input
                id="filter-data"
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <Calendar className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/3">
            <label htmlFor="filter-destino" className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1">
              <MapPin size={16} /> Filtrar por Destino
            </label>
            <div className="relative flex items-center">
              <input
                id="filter-destino"
                type="text"
                placeholder="Ex: Curitiba"
                value={filtroDestino}
                onChange={(e) => setFiltroDestino(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <MapPin className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/3">
            <label htmlFor="sort-by" className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1">
              <ListOrdered size={16} /> Ordenar por
            </label>
            <div className="relative">
              <select
                id="sort-by"
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value as "data" | "destino" | "lucro")}
                className="block appearance-none w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
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
          <p className="text-slate-600 dark:text-slate-300 text-center text-lg mt-10">Carregando relatório de viagens...</p>
        ) : viagensFiltradas.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-300 text-center text-lg mt-10">Nenhuma viagem encontrada com os filtros e ordenação atuais.</p>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <table className="min-w-full text-base text-slate-800 dark:text-slate-200">
              <thead>
                <tr className="bg-indigo-50 dark:bg-indigo-900/50 uppercase text-xs tracking-wider font-semibold border-b border-slate-300 dark:border-slate-600">
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
                    <td className="py-3 px-6">{v.data}</td>
                    <td className="py-3 px-6">{v.destino}</td>
                    <td className="py-3 px-6">{v.motorista}</td>
                    <td className="py-3 px-6 text-right text-red-500 dark:text-red-400">
                      R$ {v.totalDespesas.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="py-3 px-6 text-right text-green-600 dark:text-green-400">
                      R$ {v.totalVendas.toFixed(2).replace(".", ",")}
                    </td>
                    <td
                      className={`py-3 px-6 text-right font-bold ${
                        v.lucro >= 0 ? "text-green-700 dark:text-green-500" : "text-red-700 dark:text-red-500"
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
        />
      )}
    </div>
  );
}