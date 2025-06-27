import { useState } from "react"
import { PackagePlus, Save } from "lucide-react" // Importando ícones para consistência
import StatusModal from "../modal/statusModal"

export default function CadastroProduto() {
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")
  const [precoCompra, setPrecoCompra] = useState(0)
  const [margemLucro, setMargemLucro] = useState(30)
  const [quantidade, setQuantidade] = useState(1)

  // Novos estados para controlar o modal de status (sucesso/erro)
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  const precoVenda = precoCompra * (1 + margemLucro / 100)

  const salvarProduto = async (e: React.FormEvent) => {
    e.preventDefault()

    const produto = {
      nome,
      categoria,
      precoCompra,
      margemLucro,
      precoVenda: Number(precoVenda.toFixed(2)),
      quantidade
    }

    try {
      const res = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
      })

      if (res.ok) {
        // Exibe modal de sucesso
        setStatusType('success');
        setStatusMessage("Produto cadastrado com sucesso!");
        setShowStatusModal(true);

        // Limpa o formulário
        setNome("")
        setCategoria("")
        setPrecoCompra(0)
        setMargemLucro(30)
        setQuantidade(1)
      } else {
        // Exibe modal de erro
        const errorData = await res.json();
        setStatusType('error');
        setStatusMessage(errorData.message || "Erro ao cadastrar produto. Tente novamente.");
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error("Erro inesperado ao salvar produto:", error);
      // Exibe modal de erro genérico
      setStatusType('error');
      setStatusMessage("Erro inesperado ao cadastrar produto. Verifique sua conexão ou tente mais tarde.");
      setShowStatusModal(true);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <form
        onSubmit={salvarProduto}
        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-xl text-slate-800 dark:text-white"
      >
        <h2 className="text-2xl font-semibold text-center text-slate-800 dark:text-white mb-6 flex items-center justify-center gap-2">
          <PackagePlus className="h-7 w-7" /> Novo Produto
        </h2>

        <label htmlFor="nome-produto" className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">Nome</label>
        <input
          id="nome-produto"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full mb-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition px-4 py-2"
          required
        />

        <label htmlFor="categoria-produto" className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">Categoria</label>
        <input
          id="categoria-produto"
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full mb-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition px-4 py-2"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="preco-compra" className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              Preço de compra
            </label>
            <input
              id="preco-compra"
              type="number"
              step="0.01"
              value={precoCompra}
              onChange={(e) => setPrecoCompra(Number(e.target.value))}
              className="w-full mb-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="margem-lucro" className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              Margem de lucro (%)
            </label>
            <input
              id="margem-lucro"
              type="number"
              step="1"
              value={margemLucro}
              onChange={(e) => setMargemLucro(Number(e.target.value))}
              className="w-full mb-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition px-4 py-2"
              required
            />
          </div>
        </div>

        <div className="mb-4 text-sm text-slate-700 dark:text-slate-200">
          Preço de venda calculado:{" "}
          <span className="font-semibold text-green-600 dark:text-green-400">
            R$ {precoVenda.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <label htmlFor="quantidade-produto" className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">Quantidade</label>
        <input
          id="quantidade-produto"
          type="number"
          min="1"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          className="w-full mb-6 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition px-4 py-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Save className="mr-2 h-5 w-5" />
          Salvar produto
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
  )
}