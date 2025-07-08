// src/pages/CadastroProduto.tsx

import { useState } from "react"
import { PackagePlus, Save, ArrowLeft } from "lucide-react" // Importando ícones e ArrowLeft
import StatusModal from "../modal/statusModal"
import { useNavigate } from "react-router-dom" // Importando useNavigate para navegação

export default function CadastroProduto() {
  const navigate = useNavigate(); // Hook para navegação

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
    // Novo gradiente de fundo e estrutura para o botão de voltar
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-slate-900 dark:to-black flex flex-col items-center p-4 transition-colors duration-500 ease-in-out">
      <div className="w-full max-w-xl relative"> {/* Container para alinhar o botão e o formulário */}
        {/* Botão de Voltar para Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-0 -left-12 sm:-left-20 lg:-left-28 p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-x-1 flex items-center justify-center z-10"
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <form
          onSubmit={salvarProduto}
          className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full text-slate-800 dark:text-white relative" // Adicionado relative para posicionamento interno
        >
          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8 flex items-center justify-center gap-3">
            <PackagePlus className="h-8 w-8" /> Cadastrar Novo Produto
          </h2>

          <div className="mb-4">
            <label htmlFor="nome-produto" className="block mb-2 text-md font-medium text-slate-700 dark:text-slate-300">Nome do Produto</label>
            <input
              id="nome-produto"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Ex: Óleo 20W50"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="categoria-produto" className="block mb-2 text-md font-medium text-slate-700 dark:text-slate-300">Categoria</label>
            <input
              id="categoria-produto"
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Ex: Lubrificantes"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="preco-compra" className="block mb-2 text-md font-medium text-slate-700 dark:text-slate-300">
                Preço de Compra (R$)
              </label>
              <input
                id="preco-compra"
                type="number"
                step="0.01"
                value={precoCompra}
                onChange={(e) => setPrecoCompra(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="margem-lucro" className="block mb-2 text-md font-medium text-slate-700 dark:text-slate-300">
                Margem de Lucro (%)
              </label>
              <input
                id="margem-lucro"
                type="number"
                step="1"
                min="0"
                value={margemLucro}
                onChange={(e) => setMargemLucro(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="mb-6 text-lg text-slate-700 dark:text-slate-200 text-center p-3 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
            Preço de Venda Calculado:{" "}
            <span className="font-extrabold text-green-600 dark:text-green-400">
              R$ {precoVenda.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <div className="mb-6">
            <label htmlFor="quantidade-produto" className="block mb-2 text-md font-medium text-slate-700 dark:text-slate-300">Quantidade em Estoque</label>
            <input
              id="quantidade-produto"
              type="number"
              min="0" 
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-xl transform hover:-translate-y-1 text-lg"
          >
            <Save className="mr-3 h-6 w-6" />
            Salvar Produto
          </button>
        </form>
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
  )
}