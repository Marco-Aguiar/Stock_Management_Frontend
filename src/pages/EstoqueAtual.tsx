// src/pages/EstoqueAtual.tsx

import { useEffect, useState } from "react";
import { Package, Search, Filter, Warehouse, ArrowLeft } from "lucide-react"; // Novos ícones e ArrowLeft
import StatusModal from "../modal/statusModal";
import { useNavigate } from "react-router-dom"; // Importando useNavigate para navegação

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  precoVenda: number;
  quantidade: number; // Quantidade atual em estoque
};

export default function EstoqueAtual() {
  const navigate = useNavigate(); // Hook para navegação

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
    // Novo gradiente de fundo e estrutura para o botão de voltar
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-slate-900 dark:to-black flex flex-col items-center p-4 transition-colors duration-500 ease-in-out">
      <div className="w-full max-w-5xl relative"> {/* Container para alinhar o botão e o conteúdo */}
        {/* Botão de Voltar para Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-0 -left-12 sm:-left-20 lg:-left-28 p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-x-1 flex items-center justify-center z-10"
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <h1 className="text-4xl font-bold text-indigo-100 dark:text-indigo-400 text-center mb-8 flex items-center justify-center gap-3 drop-shadow-lg">
          <Warehouse className="h-10 w-10" /> Estoque Atual
        </h1>

        {/* --- Filtros --- */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-8 flex flex-col md:flex-row gap-6 items-end">
          <div className="flex flex-col w-full md:w-1/2">
            <label htmlFor="filtro-nome" className="text-md font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Search size={18} /> Buscar por Nome
            </label>
            <div className="relative flex items-center">
              <input
                id="filtro-nome"
                type="text"
                placeholder="Nome do produto"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
              <Search className="absolute left-3 text-slate-400 dark:text-slate-500" size={20} />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/2">
            <label htmlFor="filtro-categoria" className="text-md font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Filter size={18} /> Filtrar por Categoria
            </label>
            <div className="relative flex items-center">
              <input
                id="filtro-categoria"
                type="text"
                placeholder="Ex: Lubrificantes"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
              <Filter className="absolute left-3 text-slate-400 dark:text-slate-500" size={20} />
            </div>
          </div>
        </div>

        {/* --- Tabela de Estoque --- */}
        {loading ? (
          <p className="text-slate-200 dark:text-slate-300 text-center text-xl mt-10 py-6 animate-pulse">
            <Warehouse className="h-16 w-16 mx-auto mb-4 text-indigo-300 dark:text-indigo-500" />
            Carregando estoque...
          </p>
        ) : produtosFiltrados.length === 0 ? (
          <p className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-center text-xl mt-10">
            Nenhum produto encontrado com os filtros aplicados.
            <br />
            {produtos.length > 0 && "Tente ajustar seus filtros."}
            {produtos.length === 0 && "Comece cadastrando novos produtos!"}
          </p>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <table className="min-w-full text-base text-slate-800 dark:text-slate-200">
              <thead>
                <tr className="bg-indigo-100 dark:bg-indigo-900/40 uppercase text-sm tracking-wider font-semibold border-b border-slate-300 dark:border-slate-600">
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
                    <td className="py-3 px-6 text-right font-medium">
                      R$ {produto.precoVenda.toFixed(2).replace(".", ",")}
                    </td>
                    <td className={`py-3 px-6 text-right font-bold text-lg ${
                        // Exemplo de alerta visual para quantidade baixa
                        produto.quantidade < 10
                            ? "text-red-600 dark:text-red-400" // Menos de 10 unidades
                            : produto.quantidade < 20
                                ? "text-orange-600 dark:text-orange-400" // Entre 10 e 19
                                : "text-green-600 dark:text-green-400" // 20 ou mais
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
          duration={2000} // Passa a duração de 2 segundos (2000 ms)
        />
      )}
    </div>
  );
}