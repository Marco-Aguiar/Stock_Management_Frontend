import { useEffect, useState } from "react";
import { Package, Search, Filter, Warehouse } from "lucide-react"; // Novos ícones
import StatusModal from "../modal/statusModal";

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  precoVenda: number;
  quantidade: number; // Quantidade atual em estoque
};

export default function EstoqueAtual() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [loading, setLoading] = useState(true);

  // Estados para o StatusModal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/produtos");
        if (!res.ok) {
          throw new Error("Falha ao carregar produtos. Verifique a conexão com o servidor.");
        }
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setStatusType('error');
        setStatusMessage("Não foi possível carregar o estoque. " + (err as Error).message);
        setShowStatusModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((produto) => {
    const coincideNome = !filtroNome || produto.nome.toLowerCase().includes(filtroNome.toLowerCase());
    const coincideCategoria = !filtroCategoria || produto.categoria.toLowerCase().includes(filtroCategoria.toLowerCase());
    return coincideNome && coincideCategoria;
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center p-4 transition-colors duration-300">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 text-center mb-8 flex items-center justify-center gap-3">
          <Warehouse className="h-9 w-9" /> Estoque Atual
        </h1>

        {/* --- Filtros --- */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-8 flex flex-col md:flex-row gap-6 items-end">
          <div className="flex flex-col w-full md:w-1/2">
            <label htmlFor="filtro-nome" className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1">
              <Search size={16} /> Buscar por Nome
            </label>
            <div className="relative flex items-center">
              <input
                id="filtro-nome"
                type="text"
                placeholder="Nome do produto"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <Search className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/2">
            <label htmlFor="filtro-categoria" className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1">
              <Filter size={16} /> Filtrar por Categoria
            </label>
            <div className="relative flex items-center">
              <input
                id="filtro-categoria"
                type="text"
                placeholder="Ex: Bebidas"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <Filter className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />
            </div>
          </div>
        </div>

        {/* --- Tabela de Estoque --- */}
        {loading ? (
          <p className="text-slate-600 dark:text-slate-300 text-center text-lg mt-10">Carregando estoque...</p>
        ) : produtosFiltrados.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-300 text-center text-lg mt-10">Nenhum produto encontrado com os filtros aplicados.</p>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <table className="min-w-full text-base text-slate-800 dark:text-slate-200">
              <thead>
                <tr className="bg-indigo-50 dark:bg-indigo-900/50 uppercase text-xs tracking-wider font-semibold border-b border-slate-300 dark:border-slate-600">
                  <th className="py-3 px-6 text-left rounded-tl-lg">Produto</th>
                  <th className="py-3 px-6 text-left">Categoria</th>
                  <th className="py-3 px-6 text-right">Preço Venda (R$)</th>
                  <th className="py-3 px-6 text-right rounded-tr-lg">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((produto) => (
                  <tr
                    key={produto.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150 ease-in-out"
                  >
                    <td className="py-3 px-6">{produto.nome}</td>
                    <td className="py-3 px-6">{produto.categoria}</td>
                    <td className="py-3 px-6 text-right">
                      R$ {produto.precoVenda.toFixed(2).replace(".", ",")}
                    </td>
                    <td className={`py-3 px-6 text-right font-bold ${
                        // Exemplo de alerta visual para quantidade baixa
                        produto.quantidade < 5 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                    }`}>
                      {produto.quantidade} unid.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  );
}