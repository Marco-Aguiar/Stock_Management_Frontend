import { useState } from "react"

export default function CadastroProduto() {
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")
  const [precoCompra, setPrecoCompra] = useState(0)
  const [margemLucro, setMargemLucro] = useState(30)
  const [quantidade, setQuantidade] = useState(1)

  const precoVenda = precoCompra * (1 + margemLucro / 100)

  const salvarProduto = (e: React.FormEvent) => {
    e.preventDefault()
    const produto = {
      nome,
      categoria,
      precoCompra,
      margemLucro,
      precoVenda: Number(precoVenda.toFixed(2)),
      quantidade
    }
    console.log("Produto salvo:", produto)
    alert("Produto cadastrado com sucesso!")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex justify-center items-start">
      <form
        onSubmit={salvarProduto}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-xl text-gray-800 dark:text-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6">Novo Produto</h2>

        <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
          Nome
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
          required
        />

        <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
          Categoria
        </label>
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Preço de compra
            </label>
            <input
              type="number"
              step="0.01"
              value={precoCompra}
              onChange={(e) => setPrecoCompra(Number(e.target.value))}
              className="w-full mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Margem de lucro (%)
            </label>
            <input
              type="number"
              step="1"
              value={margemLucro}
              onChange={(e) => setMargemLucro(Number(e.target.value))}
              className="w-full mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
              required
            />
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-700 dark:text-gray-200">
          Preço de venda calculado:{" "}
          <span className="font-semibold text-green-700 dark:text-green-400">
            R$ {precoVenda.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
          Quantidade
        </label>
        <input
          type="number"
          min="1"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          className="w-full mb-6 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Salvar produto
        </button>
      </form>
    </div>
  )
}
