import { useState } from "react"

type Viagem = {
  id: string
  data: string
  destino: string
  motorista: string
  totalDespesas: number
}

type Venda = {
  viagemId: string
  itens: {
    produto: string
    quantidade: number
    precoUnitario: number
  }[]
}

const viagens: Viagem[] = [
  { id: "v001", data: "2025-06-20", destino: "São Paulo", motorista: "João", totalDespesas: 300 },
  { id: "v002", data: "2025-06-21", destino: "Curitiba", motorista: "João", totalDespesas: 420 },
]

const vendas: Venda[] = [
  { viagemId: "v001", itens: [{ produto: "Rosas", quantidade: 10, precoUnitario: 20 }, { produto: "Girassóis", quantidade: 5, precoUnitario: 15 }] },
  { viagemId: "v002", itens: [{ produto: "Tulipas", quantidade: 8, precoUnitario: 30 }, { produto: "Buquês", quantidade: 3, precoUnitario: 25 }] },
]

export default function RelatorioViagens() {
  const [filtroData, setFiltroData] = useState("")
  const [filtroDestino, setFiltroDestino] = useState("")
  const [ordenarPor, setOrdenarPor] = useState<"data" | "destino" | "lucro">("data")

  const viagensComLucro = viagens.map((v) => {
    const vendasDaViagem = vendas.filter((vend) => vend.viagemId === v.id)
    const totalVendas = vendasDaViagem.reduce(
      (acc, venda) =>
        acc + venda.itens.reduce((sub, i) => sub + i.quantidade * i.precoUnitario, 0),
      0
    )
    const lucro = totalVendas - v.totalDespesas
    return { ...v, totalVendas, lucro }
  })

  const viagensFiltradas = viagensComLucro
    .filter((v) =>
      (filtroData === "" || v.data === filtroData) &&
      (filtroDestino === "" || v.destino.toLowerCase().includes(filtroDestino.toLowerCase()))
    )
    .sort((a, b) => {
      if (ordenarPor === "data") return a.data.localeCompare(b.data)
      if (ordenarPor === "destino") return a.destino.localeCompare(b.destino)
      return b.lucro - a.lucro
    })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">📋 Relatório de Viagens</h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row gap-6 items-end">
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium mb-1">Filtrar por Data</label>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium mb-1">Filtrar por Destino</label>
          <input
            type="text"
            placeholder="Ex: Curitiba"
            value={filtroDestino}
            onChange={(e) => setFiltroDestino(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium mb-1">Ordenar por</label>
          <select
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value as any)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="data">Data</option>
            <option value="destino">Destino</option>
            <option value="lucro">Lucro</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 uppercase text-xs leading-normal border-b border-gray-300 dark:border-gray-600">
              <th className="py-3 px-6 text-left">Data</th>
              <th className="py-3 px-6 text-left">Destino</th>
              <th className="py-3 px-6 text-left">Motorista</th>
              <th className="py-3 px-6 text-right">Despesas (R$)</th>
              <th className="py-3 px-6 text-right">Vendas (R$)</th>
              <th className="py-3 px-6 text-right">Lucro (R$)</th>
            </tr>
          </thead>
          <tbody>
            {viagensFiltradas.map((v) => (
              <tr key={v.id} className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="py-3 px-6">{v.data}</td>
                <td className="py-3 px-6">{v.destino}</td>
                <td className="py-3 px-6">{v.motorista}</td>
                <td className="py-3 px-6 text-right">R$ {v.totalDespesas.toFixed(2).replace(".", ",")}</td>
                <td className="py-3 px-6 text-right">R$ {v.totalVendas.toFixed(2).replace(".", ",")}</td>
                <td className={`py-3 px-6 text-right font-bold ${v.lucro >= 0 ? "text-green-600" : "text-red-600"}`}>
                  R$ {v.lucro.toFixed(2).replace(".", ",")}
                </td>
              </tr>
            ))}
            {viagensFiltradas.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 italic text-gray-500 dark:text-gray-300">
                  Nenhuma viagem encontrada com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
