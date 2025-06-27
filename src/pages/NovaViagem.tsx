import { useState } from "react"
import { PlaneTakeoff, PlusCircle, Trash2, Save, MapPin, Calendar, User, DollarSign, Tag } from "lucide-react" // Importing relevant icons
import StatusModal from "../modal/statusModal"

type Despesa = {
  tipo: string
  valor: number
}

export default function NovaViagem() {
  const [data, setData] = useState(() => {
    const hoje = new Date()
    return hoje.toISOString().split("T")[0]
  })
  const [destino, setDestino] = useState("")
  const [motorista, setMotorista] = useState("")
  const [tipoDespesa, setTipoDespesa] = useState("")
  const [valorDespesa, setValorDespesa] = useState(0)

  const [despesas, setDespesas] = useState<Despesa[]>([])

  // State for the StatusModal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<'success' | 'error'>('success'); // Default to 'success'


  const adicionarDespesa = () => {
    if (!tipoDespesa || valorDespesa <= 0) {
      setStatusType('error');
      setStatusMessage("Por favor, insira um tipo e valor válidos para a despesa.");
      setShowStatusModal(true);
      return;
    }
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

  const salvarViagem = async () => {
    if (!data || !destino) {
      setStatusType('error');
      setStatusMessage("Por favor, preencha a Data e o Destino da viagem.");
      setShowStatusModal(true);
      return;
    }

    const novaViagem = {
      destino,
      motorista,
      dataSaida: new Date(data),
      dataRetorno: new Date(data), // Assuming dataRetorno is the same as dataSaida for simplicity
    }

    try {
      const resViagem = await fetch("http://localhost:3000/viagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaViagem)
      })

      if (!resViagem.ok) {
        const errorData = await resViagem.json();
        setStatusType('error');
        setStatusMessage(errorData.message || "Erro ao salvar viagem. Tente novamente.");
        setShowStatusModal(true);
        return;
      }

      const viagemCriada = await resViagem.json()

      // Loop through and save expenses
      for (const d of despesas) {
        const resDespesa = await fetch("http://localhost:3000/despesas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            viagemId: viagemCriada.id,
            tipo: d.tipo,
            valor: d.valor
          })
        })

        if (!resDespesa.ok) {
          // If a single expense fails, you might want to log it or handle it differently.
          // For now, we'll show an error and stop the process, but the trip might still be saved.
          setStatusType('error');
          setStatusMessage(`Erro ao salvar despesa '${d.tipo}'. Viagem salva, mas despesas podem estar incompletas.`);
          setShowStatusModal(true);
          return; // Stop processing further expenses if one fails
        }
      }

      setStatusType('success');
      setStatusMessage("Viagem registrada com sucesso!");
      setShowStatusModal(true);

      // Clear form after successful save
      setData(new Date().toISOString().split("T")[0]); // Reset to today's date
      setDestino("");
      setMotorista("");
      setDespesas([]);
    } catch (error) {
      console.error("Erro inesperado ao registrar viagem:", error);
      setStatusType('error');
      setStatusMessage("Erro inesperado ao registrar viagem. Verifique sua conexão ou tente novamente.");
      setShowStatusModal(true);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-4xl">
        <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 text-center mb-8 flex items-center justify-center gap-3">
          <PlaneTakeoff className="h-9 w-9" /> Nova Viagem
        </h2>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6 space-y-6">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            Dados da Viagem
          </h3>
          <div className="space-y-4"> {/* Grouping primary trip details */}
            <div>
              <label htmlFor="data-viagem" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Data da Viagem</label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />
                <input
                  id="data-viagem"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="destino-viagem" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Destino</label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />
                <input
                  id="destino-viagem"
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="motorista-viagem" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Motorista</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />
                <input
                  id="motorista-viagem"
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={motorista}
                  onChange={(e) => setMotorista(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card para Despesas */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6 space-y-6">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            Adicionar Despesas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tipo-despesa" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Tipo de Despesa</label>
              <div className="relative flex items-center">
                <Tag className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />
                <input
                  id="tipo-despesa"
                  type="text"
                  placeholder="Ex: Combustível"
                  value={tipoDespesa}
                  onChange={(e) => setTipoDespesa(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>
            <div>
              <label htmlFor="valor-despesa" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Valor (R$)</label>
              <div className="relative flex items-center">
                <DollarSign className="absolute left-3 text-slate-400 dark:text-slate-500" size={18} />
                <input
                  id="valor-despesa"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={valorDespesa}
                  onChange={(e) => setValorDespesa(Number(e.target.value))}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <button
            onClick={adicionarDespesa}
            type="button" // Important: set type="button" to prevent form submission
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Adicionar Despesa
          </button>

          {despesas.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                Despesas Adicionadas
              </h3>
              <ul className="space-y-3 mb-6">
                {despesas.map((d, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600"
                  >
                    <span className="text-slate-800 dark:text-white font-medium">
                      {d.tipo} —{" "}
                      <span className="text-green-600 dark:text-green-400">R$ {d.valor.toFixed(2).replace(".", ",")}</span>
                    </span>
                    <button
                      onClick={() => removerDespesa(index)}
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
                  R$ {totalDespesas.toFixed(2).replace(".", ",")}
                </span>
              </p>
            </div>
          )}
        </div>

        <button
          onClick={salvarViagem}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Save className="mr-2 h-5 w-5" />
          Salvar Viagem
        </button>
      </div>

      {/* Render the StatusModal conditionally */}
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