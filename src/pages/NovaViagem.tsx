import { useState } from "react"
import { PlaneTakeoff, PlusCircle, Trash2, Save, MapPin, Calendar, User, DollarSign, Tag, ArrowLeft } from "lucide-react" // Importing relevant icons and ArrowLeft
import StatusModal from "../modal/statusModal"
import { useNavigate } from "react-router-dom" // Importing useNavigate

type Despesa = {
  tipo: string
  valor: number
}

export default function NovaViagem() {
  const navigate = useNavigate(); // Hook para navegação

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

    // Verifica se a despesa já existe para somar o valor
    const despesaExistenteIndex = despesas.findIndex(d => d.tipo.toLowerCase() === tipoDespesa.toLowerCase());
    if (despesaExistenteIndex > -1) {
      const novasDespesas = [...despesas];
      novasDespesas[despesaExistenteIndex].valor += valorDespesa;
      setDespesas(novasDespesas);
    } else {
      setDespesas([...despesas, { tipo: tipoDespesa, valor: valorDespesa }]);
    }
    
    setTipoDespesa("");
    setValorDespesa(0);
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
      dataSaida: new Date(data).toISOString(), // Format to ISO string for backend
      dataRetorno: new Date(data).toISOString(), // Assuming dataRetorno is the same as dataSaida for simplicity
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
        setStatusMessage(errorData.message || "Erro ao salvar viagem. Verifique se o destino já existe ou tente novamente.");
        setShowStatusModal(true);
        return;
      }

      const viagemCriada = await resViagem.json()

      // Salvando despesas apenas se houverem
      if (despesas.length > 0) {
        // Usar Promise.all para enviar todas as despesas em paralelo
        const despesaPromises = despesas.map(d => {
          return fetch("http://localhost:3000/despesas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              viagemId: viagemCriada.id,
              tipo: d.tipo,
              valor: d.valor
            })
          });
        });

        const despesaResponses = await Promise.all(despesaPromises);
        const failedExpenses = despesaResponses.filter(res => !res.ok);

        if (failedExpenses.length > 0) {
          // You might want to get more specific error messages from each failed response
          setStatusType('error');
          setStatusMessage(`Viagem salva, mas houve erros ao salvar ${failedExpenses.length} despesas. Verifique o console.`);
          setShowStatusModal(true);
          // Log errors for debugging
          failedExpenses.forEach(async res => console.error("Erro ao salvar despesa:", await res.json()));
        } else {
          setStatusType('success');
          setStatusMessage("Viagem e despesas registradas com sucesso!");
          setShowStatusModal(true);
        }
      } else {
        // If no expenses, just show trip success
        setStatusType('success');
        setStatusMessage("Viagem registrada com sucesso!");
        setShowStatusModal(true);
      }


      // Clear form after successful save (or partial success with expenses)
      setData(new Date().toISOString().split("T")[0]); // Reset to today's date
      setDestino("");
      setMotorista("");
      setDespesas([]);
      setTipoDespesa(""); // Clear despesa input
      setValorDespesa(0); // Clear despesa input

    } catch (error) {
      console.error("Erro inesperado ao registrar viagem:", error);
      setStatusType('error');
      setStatusMessage("Erro inesperado ao registrar viagem. Verifique sua conexão ou tente novamente.");
      setShowStatusModal(true);
    }
  }

  return (
    // Fundo gradiente
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-slate-900 dark:to-black flex flex-col items-center p-4 transition-colors duration-500 ease-in-out">
      <div className="w-full max-w-4xl relative">
        {/* Botão de Voltar para Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-0 -left-12 sm:-left-20 lg:-left-28 p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-x-1 flex items-center justify-center z-10"
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <h2 className="text-4xl font-bold text-indigo-100 dark:text-indigo-400 text-center mb-8 flex items-center justify-center gap-3 drop-shadow-lg">
          <PlaneTakeoff className="h-10 w-10" /> Nova Viagem
        </h2>

        {/* Card para Dados da Viagem */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6 space-y-6">
          <h3 className="text-2xl font-semibold text-slate-800 dark:text-white flex items-center gap-3 mb-4 border-b pb-4 border-slate-200 dark:border-slate-700">
            Dados da Viagem
          </h3>
          <div className="space-y-4"> {/* Grouping primary trip details */}
            <div>
              <label htmlFor="data-viagem" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">Data da Viagem</label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 text-slate-400 dark:text-slate-500 h-6 w-6" /> {/* Ícone maior */}
                <input
                  id="data-viagem"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="destino-viagem" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">Destino</label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 text-slate-400 dark:text-slate-500 h-6 w-6" /> {/* Ícone maior */}
                <input
                  id="destino-viagem"
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="motorista-viagem" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">Motorista</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 text-slate-400 dark:text-slate-500 h-6 w-6" /> {/* Ícone maior */}
                <input
                  id="motorista-viagem"
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={motorista}
                  onChange={(e) => setMotorista(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card para Despesas */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6 space-y-6">
          <h3 className="text-2xl font-semibold text-slate-800 dark:text-white flex items-center gap-3 mb-4 border-b pb-4 border-slate-200 dark:border-slate-700">
            <DollarSign className="h-7 w-7 text-green-500" /> Adicionar Despesas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Espaçamento maior */}
            <div>
              <label htmlFor="tipo-despesa" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de Despesa</label>
              <div className="relative flex items-center">
                <Tag className="absolute left-3 text-slate-400 dark:text-slate-500 h-6 w-6" /> {/* Ícone maior */}
                <input
                  id="tipo-despesa"
                  type="text"
                  placeholder="Ex: Combustível"
                  value={tipoDespesa}
                  onChange={(e) => setTipoDespesa(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
                />
              </div>
            </div>
            <div>
              <label htmlFor="valor-despesa" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">Valor (R$)</label>
              <div className="relative flex items-center">
                <DollarSign className="absolute left-3 text-slate-400 dark:text-slate-500 h-6 w-6" /> {/* Ícone maior */}
                <input
                  id="valor-despesa"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={valorDespesa === 0 ? "" : valorDespesa} // Para mostrar placeholder quando valor é 0
                  onChange={(e) => setValorDespesa(Number(e.target.value))}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
                />
              </div>
            </div>
          </div>

          <button
            onClick={adicionarDespesa}
            type="button"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg mt-6"
          >
            <PlusCircle className="mr-2 h-6 w-6" />
            Adicionar Despesa
          </button>

          {despesas.length > 0 && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-3 border-b pb-4 border-slate-200 dark:border-slate-700">
                Despesas da Viagem
              </h3>
              <ul className="space-y-4 mb-6"> {/* Espaçamento maior */}
                {despesas.map((d, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                  >
                    <span className="text-slate-800 dark:text-white font-medium text-lg">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{d.tipo}</span> —{" "}
                      <span className="text-green-600 dark:text-green-400">R$ {d.valor.toFixed(2).replace(".", ",")}</span>
                    </span>
                    <button
                      onClick={() => removerDespesa(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition flex items-center gap-1.5 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label="Remover despesa"
                    >
                      <Trash2 className="h-5 w-5" /> <span className="hidden sm:inline">remover</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-right text-3xl font-bold text-slate-800 dark:text-white">
                Total de Despesas:{" "}
                <span className="text-red-600 dark:text-red-400"> {/* Cor vermelha para despesas */}
                  R$ {totalDespesas.toFixed(2).replace(".", ",")}
                </span>
              </p>
            </div>
          )}
        </div>

        <button
          onClick={salvarViagem}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg"
        >
          <Save className="mr-2 h-6 w-6" />
          Salvar Viagem
        </button>
      </div>

      {/* Render the StatusModal conditionally */}
      {showStatusModal && (
        <StatusModal
          message={statusMessage}
          type={statusType}
          onClose={() => setShowStatusModal(false)}
          duration={2000} // Fecha após 2 segundos
        />
      )}
    </div>
  )
}