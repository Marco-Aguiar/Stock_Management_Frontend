import { useState } from "react"

type Despesa = {
  tipo: string
  valor: number
}

export default function NovaViagem() {
  const [data, setData] = useState("")
  const [destino, setDestino] = useState("")
  const [motorista, setMotorista] = useState("")
  const [tipoDespesa, setTipoDespesa] = useState("")
  const [valorDespesa, setValorDespesa] = useState(0)

  const [despesas, setDespesas] = useState<Despesa[]>([])

  const adicionarDespesa = () => {
    if (!tipoDespesa || valorDespesa <= 0) return
    setDespesas([...despesas, { tipo: tipoDespesa, valor: valorDespesa }])
    setTipoDespesa("")
    setValorDespesa(0)
  }

  const removerDespesa = (index: number) => {
    const novas = [...despesas]
    novas.splice(index, 1)
    setDespesas(novas)
  }

  const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0)

  const salvarViagem = () => {
    const viagem = {
      data,
      destino,
      motorista,
      despesas,
      totalDespesas
    }
    console.log("Viagem salva:", viagem)
    alert("Viagem registrada com sucesso!")
    setData("")
    setDestino("")
    setMotorista("")
    setDespesas([])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Nova Viagem
      </h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6 space-y-4">
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
          required
        />
        <input
          type="text"
          placeholder="Destino"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
          required
        />
        <input
          type="text"
          placeholder="Motorista"
          value={motorista}
          onChange={(e) => setMotorista(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tipo de despesa"
            value={tipoDespesa}
            onChange={(e) => setTipoDespesa(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
          />
          <input
            type="number"
            placeholder="Valor (R$)"
            min="0"
            step="0.01"
            value={valorDespesa}
            onChange={(e) => setValorDespesa(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
          />
        </div>

        <button
          onClick={adicionarDespesa}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Adicionar Despesa
        </button>

        {despesas.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-100">
              Despesas
            </h3>
            <ul className="space-y-2">
              {despesas.map((d, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-1 text-gray-800 dark:text-gray-100"
                >
                  <span>
                    {d.tipo} — R$ {d.valor.toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={() => removerDespesa(index)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    remover
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-right text-lg font-bold text-gray-800 dark:text-gray-100">
              Total: R$ {totalDespesas.toFixed(2).replace(".", ",")}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={salvarViagem}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
      >
        Salvar Viagem
      </button>
    </div>
  )
}
