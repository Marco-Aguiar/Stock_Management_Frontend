import { useEffect, useState } from "react";
import { PackagePlus, Save, Box, PlusCircle } from "lucide-react"; // Ícones relevantes
import StatusModal from "../modal/statusModal";

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  quantidade: number; // Quantidade atual em estoque (para referência)
};

export default function EntradaProdutos() {
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<Produto[]>([]);
  const [produtoIdSelecionado, setProdutoIdSelecionado] = useState("");
  const [quantidadeEntrada, setQuantidadeEntrada] = useState(1);
  const [loadingProdutos, setLoadingProdutos] = useState(true);

  // Estados para o StatusModal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoadingProdutos(true);
      try {
        const res = await fetch("http://localhost:3000/produtos");
        if (!res.ok) {
          throw new Error("Falha ao carregar produtos para entrada.");
        }
        const data = await res.json();
        setProdutosDisponiveis(data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setStatusType('error');
        setStatusMessage("Não foi possível carregar a lista de produtos para entrada. " + (err as Error).message);
        setShowStatusModal(true);
      } finally {
        setLoadingProdutos(false);
      }
    };

    fetchProdutos();
  }, []);

  const darEntradaProduto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!produtoIdSelecionado || quantidadeEntrada <= 0) {
      setStatusType('error');
      setStatusMessage("Por favor, selecione um produto e informe uma quantidade válida.");
      setShowStatusModal(true);
      return;
    }

    const produtoParaAtualizar = produtosDisponiveis.find(p => p.id === Number(produtoIdSelecionado));

    if (!produtoParaAtualizar) {
      setStatusType('error');
      setStatusMessage("Produto selecionado não encontrado.");
      setShowStatusModal(true);
      return;
    }

    const novaQuantidade = produtoParaAtualizar.quantidade + quantidadeEntrada;

    try {
      const res = await fetch(`http://localhost:3000/produtos/${produtoIdSelecionado}`, {
        method: "PATCH", // Usamos PATCH para atualizar parcialmente o recurso
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade: novaQuantidade }),
      });

      if (res.ok) {
        // Atualiza a lista local de produtos para refletir a nova quantidade
        setProdutosDisponiveis(prev =>
          prev.map(p =>
            p.id === Number(produtoIdSelecionado) ? { ...p, quantidade: novaQuantidade } : p
          )
        );

        setStatusType('success');
        setStatusMessage(`Entrada de ${quantidadeEntrada} unidades de "${produtoParaAtualizar.nome}" registrada com sucesso! Novo estoque: ${novaQuantidade}`);
        setShowStatusModal(true);

        // Limpa os campos
        setProdutoIdSelecionado("");
        setQuantidadeEntrada(1);

      } else {
        const errorData = await res.json();
        setStatusType('error');
        setStatusMessage(errorData.message || "Erro ao registrar entrada de produto.");
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error("Erro inesperado ao registrar entrada:", error);
      setStatusType('error');
      setStatusMessage("Erro inesperado ao registrar entrada. Tente novamente.");
      setShowStatusModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <form
        onSubmit={darEntradaProduto}
        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-xl text-slate-800 dark:text-white"
      >
        <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 text-center mb-8 flex items-center justify-center gap-3">
          <PackagePlus className="h-9 w-9" /> Entrada de Produtos
        </h2>

        {loadingProdutos ? (
          <p className="text-slate-600 dark:text-slate-300 text-center text-lg mb-6">Carregando produtos disponíveis...</p>
        ) : (
          <>
            <label htmlFor="select-produto-entrada" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Produto</label>
            <div className="relative mb-4">
              <select
                id="select-produto-entrada"
                value={produtoIdSelecionado}
                onChange={(e) => setProdutoIdSelecionado(e.target.value)}
                className="block appearance-none w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
                required
              >
                <option value="">Selecione um produto</option>
                {produtosDisponiveis.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} (Estoque atual: {p.quantidade})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
              </div>
            </div>

            <label htmlFor="input-quantidade-entrada" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Quantidade para Entrada</label>
            <div className="relative mb-6">
                <input
                id="input-quantidade-entrada"
                type="number"
                min="1"
                value={quantidadeEntrada}
                onChange={(e) => setQuantidadeEntrada(Number(e.target.value))}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
                />
                <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loadingProdutos || !produtoIdSelecionado || quantidadeEntrada <= 0} // Desabilita se estiver carregando ou campos inválidos
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Save className="mr-2 h-5 w-5" />
          Registrar Entrada
        </button>
      </form>

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