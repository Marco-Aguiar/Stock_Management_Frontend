import { useState } from "react"

type Venda = {
  id: string
  viagemDestino: string
  data: string
  itens: {
    produto: string
    quantidade: number
    precoUnitario: number
  }[]
}

const vendasMock: Venda[] = [
  {
    id: "v001",
    viagemDestino: "São Paulo",
    data: "2025-06-20",
    itens: [
      { produto: "Rosas Vermelhas", quantidade: 10, precoUnitario: 8.5 },
      { produto: "Girassóis", quantidade: 5, precoUnitario: 7.0 }
    ]
  },
  {
    id: "v002",
    viagemDestino: "Curitiba",
    data: "2025-06-21",
    itens: [
      { produto: "Buquê Sortido", quantidade: 3, precoUnitario: 20.0 }
    ]
  }
]

export default function RelatorioVendas() {
  const [filtroData, setFiltroData] = useState("")
  const [filtroDestino, setFiltroDestino] = useState("")

  const vendasFiltradas = vendasMock.filter((v) => {
    const coincideData = !filtroData || v.data === filtroData
    const coincideDestino = !filtroDestino || v.viagemDestino.toLowerCase().includes(filtroDestino.toLowerCase())
    return coincideData && coincideDestino
  })

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Relatório de Vendas
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          className="border rounded-lg px-4 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Filtrar por destino"
          value={filtroDestino}
          onChange={(e) => setFiltroDestino(e.target.value)}
          className="border rounded-lg px-4 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      {vendasFiltradas.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Nenhuma venda encontrada.</p>
      ) : (
        <div className="space-y-6">
          {vendasFiltradas.map((venda) => {
            const total = venda.itens.reduce((acc, item) => acc + item.quantidade * item.precoUnitario, 0)
            return (
              <div key={venda.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {venda.viagemDestino} - {venda.data}
                </h2>
                <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {venda.itens.map((item, index) => (
                    <li key={index}>
                      {item.quantidade}x {item.produto} @ R$ {item.precoUnitario.toFixed(2).replace(".", ",")}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-right font-bold text-gray-900 dark:text-white">
                  Total: R$ {total.toFixed(2).replace(".", ",")}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
