import { useEffect, useState } from "react"
import { ShoppingCart, PlusCircle, Trash2, CheckCircle } from "lucide-react" // Não precisamos mais do CheckCircle aqui, pois o modal o importa
import StatusModal from "../modal/statusModal"

type Viagem = {
  id: number
  destino: string
  dataSaida: string
}

type Produto = {
  id: number
  nome: string
  precoVenda: number
}

type ItemVenda = {
  produtoId: number
  nome: string
  quantidade: number
  precoUnitario: number
}

export default function NovaVenda() {
  const [viagens, setViagens] = useState<Viagem[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [viagemSelecionada, setViagemSelecionada] = useState("")
  const [produtoIdSelecionado, setProdutoIdSelecionado] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [itens, setItens] = useState<ItemVenda[]>([])

  // Novos estados para controlar o modal de status (sucesso/erro)
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<'success' | 'error'>('success'); // Define o tipo padrão como sucesso

  useEffect(() => {
    fetch("http://localhost:3000/viagens")
      .then(res => res.json())
      .then(setViagens)

    fetch("http://localhost:3000/produtos")
      .then(res => res.json())
      .then(setProdutos)
  }, [])

  const adicionarItem = () => {
    const produto = produtos.find(p => p.id === Number(produtoIdSelecionado))
    if (!produto || quantidade <= 0) return
    setItens([
      ...itens,
      {
        produtoId: produto.id,
        nome: produto.nome,
        quantidade,
        precoUnitario: produto.precoVenda
      }
    ])
    setProdutoIdSelecionado("")
    setQuantidade(1)
  }

  const removerItem = (index: number) => {
    const novosItens = [...itens]
    novosItens.splice(index, 1)
    setItens(novosItens)
  }

  const totalVenda = itens.reduce(
    (total, item) => total + item.quantidade * item.precoUnitario,
    0
  )

  const salvarVenda = async () => {
    if (!viagemSelecionada) {
      // Exibe o modal de erro se nenhuma viagem for selecionada
      setStatusType('error');
      setStatusMessage("Por favor, selecione uma viagem para registrar a venda.");
      setShowStatusModal(true);
      return;
    }

    const payload = {
      viagemId: Number(viagemSelecionada),
      itens: itens.map(({ produtoId, quantidade }) => ({
        produtoId,
        quantidade
      }))
    }

    try {
      const res = await fetch("http://localhost:3000/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        // Define a mensagem de sucesso e mostra o modal
        setStatusType('success');
        setStatusMessage(`Venda registrada com sucesso! Total: R$ ${totalVenda.toFixed(2).replace('.', ',')}`);
        setShowStatusModal(true);

        // Limpa os campos após o sucesso
        setItens([]);
        setViagemSelecionada("");
      } else {
        const errorData = await res.json()
        // Define a mensagem de erro e mostra o modal
        setStatusType('error');
        setStatusMessage(errorData.message || "Erro ao registrar venda. Verifique a quantidade em estoque.");
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error(error); // Loga o erro para depuração
      // Define uma mensagem de erro genérica e mostra o modal
      setStatusType('error');
      setStatusMessage("Erro inesperado ao registrar venda. Tente novamente.");
      setShowStatusModal(true);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-4xl">
        <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 text-center mb-8 flex items-center justify-center gap-3">
          <ShoppingCart className="h-9 w-9" /> Nova Venda
        </h2>

        {/* Card para Adicionar Itens */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6 space-y-6">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-indigo-500" /> Adicionar Produtos à Venda
          </h3>

          <div>
            <label htmlFor="select-viagem" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Viagem</label>
            <div className="relative">
              <select
                id="select-viagem"
                value={viagemSelecionada}
                onChange={(e) => setViagemSelecionada(e.target.value)}
                className="block appearance-none w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="">Selecione uma viagem</option>
                {viagens.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.destino} — {new Date(v.dataSaida).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="select-produto" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Produto</label>
              <div className="relative">
                <select
                  id="select-produto"
                  value={produtoIdSelecionado}
                  onChange={(e) => setProdutoIdSelecionado(e.target.value)}
                  className="block appearance-none w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="">Selecione</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} (R$ {p.precoVenda.toFixed(2).replace('.', ',')})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="input-quantidade" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Quantidade</label>
              <input
                id="input-quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <button
            onClick={adicionarItem}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Adicionar Item
          </button>
        </div>

        {/* Card para Itens da Venda */}
        {itens.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-indigo-500" /> Itens da Venda
            </h3>
            <ul className="space-y-3 mb-6">
              {itens.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <span className="text-slate-800 dark:text-white font-medium">
                    {item.quantidade}x {item.nome} —{" "}
                    <span className="text-green-600 dark:text-green-400">R$ {item.precoUnitario.toFixed(2).replace(".", ",")}</span>
                  </span>
                  <button
                    onClick={() => removerItem(index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> remover
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-right text-2xl font-bold text-slate-800 dark:text-white">
              Total:{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                R$ {totalVenda.toFixed(2).replace(".", ",")}
              </span>
            </p>
          </div>
        )}

        {/* Botão de Salvar Venda */}
        <button
          onClick={salvarVenda}
          disabled={itens.length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Salvar Venda
        </button>
      </div>

      {/* Renderiza o modal de status condicionalmente */}
      {showStatusModal && (
        <StatusModal
          message={statusMessage}
          type={statusType}
          onClose={() => setShowStatusModal(false)} // Callback para fechar o modal
        />
      )}
    </div>
  )
}