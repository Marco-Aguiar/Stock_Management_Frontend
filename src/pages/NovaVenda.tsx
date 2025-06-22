import { useState } from "react"

type Viagem = {
  id: string
  data: string
  destino: string
}

type ItemVenda = {
  produto: string
  quantidade: number
  precoUnitario: number
}

type Venda = {
  viagemId: string
  itens: ItemVenda[]
}

export default function NovaVenda() {
  const viagens: Viagem[] = [
    { id: "v001", data: "2025-06-20", destino: "São Paulo" },
    { id: "v002", data: "2025-06-21", destino: "Curitiba" },
  ]

  const produtosCadastrados = [
    "Rosas",
    "Girassóis",
    "Tulipas",
    "Buquê Misto",
    "Orquídeas",
  ]

  const [viagemSelecionada, setViagemSelecionada] = useState("")
  const [produto, setProduto] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [precoUnitario, setPrecoUnitario] = useState(10.0)
  const [itens, setItens] = useState<ItemVenda[]>([])

  const adicionarItem = () => {
    if (!produto || quantidade <= 0 || precoUnitario <= 0) return
    setItens([...itens, { produto, quantidade, precoUnitario }])
    setProduto("")
    setQuantidade(1)
    setPrecoUnitario(10.0)
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

  const salvarVenda = () => {
    if (!viagemSelecionada) {
      alert("Selecione uma viagem para associar à venda.")
      return
    }

    const novaVenda: Venda = {
      viagemId: viagemSelecionada,
      itens: [...itens],
    }

    console.log("Venda registrada:", novaVenda)
    alert(`Venda registrada! Total: R$ ${totalVenda.toFixed(2)}`)
    setItens([])
    setViagemSelecionada("")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🛒 Nova Venda</h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Viagem</label>
          <select
            value={viagemSelecionada}
            onChange={(e) => setViagemSelecionada(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="">Selecione uma viagem</option>
            {viagens.map((v) => (
              <option key={v.id} value={v.id}>
                {v.destino} — {v.data}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Produto</label>
            <select
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecione</option>
              {produtosCadastrados.map((p, idx) => (
                <option key={idx} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantidade</label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preço Unitário (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={precoUnitario}
              onChange={(e) => setPrecoUnitario(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={adicionarItem}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Adicionar Item
        </button>
      </div>

      {itens.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Itens da Venda</h3>
          <ul className="space-y-2">
            {itens.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-2"
              >
                <span>
                  {item.quantidade}x {item.produto} — R${" "}
                  {item.precoUnitario.toFixed(2).replace(".", ",")}
                </span>
                <button
                  onClick={() => removerItem(index)}
                  className="text-red-600 dark:text-red-400 text-sm hover:underline"
                >
                  remover
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-right text-lg font-bold">
            Total: R$ {totalVenda.toFixed(2).replace(".", ",")}
          </p>
        </div>
      )}

      <button
        onClick={salvarVenda}
        disabled={itens.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-300 dark:disabled:bg-gray-700"
      >
        Salvar Venda
      </button>
    </div>
  )
}
  