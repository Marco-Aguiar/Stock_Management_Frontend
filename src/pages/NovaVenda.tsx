// src/pages/NovaVenda.tsx

import { useEffect, useState } from "react"
import { ShoppingCart, PlusCircle, Trash2, CheckCircle, ArrowLeft, DollarSign } from "lucide-react"
import StatusModal from "../modal/statusModal"
import { useNavigate } from "react-router-dom"

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
  precoOriginalProduto: number
}

export default function NovaVenda() {
  const navigate = useNavigate();

  const [viagens, setViagens] = useState<Viagem[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [viagemSelecionada, setViagemSelecionada] = useState("")
  const [produtoIdSelecionado, setProdutoIdSelecionado] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [itens, setItens] = useState<ItemVenda[]>([])
  const [precoVendaManual, setPrecoVendaManual] = useState<string>("");

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  const produtoAtualSelecionado = produtos.find(p => p.id === Number(produtoIdSelecionado));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resViagens, resProdutos] = await Promise.all([
          fetch("http://localhost:3000/viagens"),
          fetch("http://localhost:3000/produtos")
        ]);

        if (!resViagens.ok) throw new Error("Falha ao carregar viagens.");
        if (!resProdutos.ok) throw new Error("Falha ao carregar produtos.");

        const dataViagens = await resViagens.json();
        const dataProdutos = await resProdutos.json();

        setViagens(dataViagens);
        setProdutos(dataProdutos);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setStatusType('error');
        setStatusMessage("Não foi possível carregar os dados. " + (err as Error).message);
        setShowStatusModal(true);
      }
    };

    fetchData();
  }, [])

  useEffect(() => {
    setPrecoVendaManual("");
  }, [produtoIdSelecionado]);


  const adicionarItem = () => {
    const produto = produtos.find(p => p.id === Number(produtoIdSelecionado));
    if (!produto || quantidade <= 0) {
      setStatusType('error');
      setStatusMessage("Por favor, selecione um produto válido e uma quantidade maior que zero.");
      setShowStatusModal(true);
      return;
    }

    let precoFinalUnitario = produto.precoVenda;

    if (precoVendaManual.trim() !== "") {
      const precoParsed = parseFloat(precoVendaManual.replace(',', '.'));
      if (!isNaN(precoParsed) && precoParsed >= 0) {
        precoFinalUnitario = precoParsed;
      } else {
        setStatusType('error');
        setStatusMessage("Por favor, insira um valor válido para o preço de venda manual (número não negativo).");
        setShowStatusModal(true);
        return;
      }
    }

    const itemExistenteIndex = itens.findIndex(item => item.produtoId === produto.id);
    if (itemExistenteIndex > -1) {
      const novosItens = [...itens];
      novosItens[itemExistenteIndex].quantidade += quantidade;
      setItens(novosItens);
    } else {
      setItens([
        ...itens,
        {
          produtoId: produto.id,
          nome: produto.nome,
          quantidade,
          precoUnitario: precoFinalUnitario,
          precoOriginalProduto: produto.precoVenda
        }
      ]);
    }
    
    setProdutoIdSelecionado("");
    setQuantidade(1);
    setPrecoVendaManual("");
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
      setStatusType('error');
      setStatusMessage("Por favor, selecione uma viagem para registrar a venda.");
      setShowStatusModal(true);
      return;
    }
    if (itens.length === 0) {
      setStatusType('error');
      setStatusMessage("Adicione pelo menos um item à venda para salvar.");
      setShowStatusModal(true);
      return;
    }

    // --- ADICIONE ESTES CONSOLE.LOGS PARA DEBUGAR ---
    console.log("Estado de 'itens' antes do payload:", itens);
    console.log("Tipo de 'itens' antes do payload:", typeof itens);
    if (Array.isArray(itens)) {
        console.log("É um array, comprimento:", itens.length);
    }
    // --- FIM DOS CONSOLE.LOGS ---


    const payload = {
      viagemId: Number(viagemSelecionada),
      // Verificação defensiva extra, embora o `if (itens.length === 0)` já devesse cobrir
      itens: Array.isArray(itens) ? itens.map(({ produtoId, quantidade, precoUnitario }) => ({
        produtoId,
        quantidade,
        precoUnitario,
      })) : [] // Se por algum motivo itens não for array, retorna um array vazio
    }

    // --- ADICIONE ESTE CONSOLE.LOG PARA DEBUGAR O PAYLOAD GERADO ---
    console.log("Payload enviado:", payload);
    // --- FIM DOS CONSOLE.LOGS ---

    try {
      const res = await fetch("http://localhost:3000/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setStatusType('success');
        setStatusMessage(`Venda registrada com sucesso! Total: R$ ${totalVenda.toFixed(2).replace('.', ',')}`);
        setShowStatusModal(true);

        setItens([]);
        setViagemSelecionada("");
        setProdutoIdSelecionado("");
        setQuantidade(1);
        setPrecoVendaManual("");
      } else {
        const errorData = await res.json()
        setStatusType('error');
        setStatusMessage(errorData.message || "Erro ao registrar venda. Verifique a quantidade em estoque.");
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error("Erro na requisição fetch:", error); // Log mais detalhado do erro
      setStatusType('error');
      setStatusMessage("Erro inesperado ao registrar venda. Tente novamente.");
      setShowStatusModal(true);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-slate-900 dark:to-black flex flex-col items-center p-4 transition-colors duration-500 ease-in-out">
      <div className="w-full max-w-4xl relative">
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-0 -left-12 sm:-left-20 lg:-left-28 p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white shadow-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-x-1 flex items-center justify-center z-10"
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <h2 className="text-4xl font-bold text-indigo-100 dark:text-indigo-400 text-center mb-8 flex items-center justify-center gap-3 drop-shadow-lg">
          <ShoppingCart className="h-10 w-10" /> Nova Venda
        </h2>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6 space-y-6">
          <h3 className="text-2xl font-semibold text-slate-800 dark:text-white flex items-center gap-3 mb-4 border-b pb-4 border-slate-200 dark:border-slate-700">
            <PlusCircle className="h-7 w-7 text-indigo-500" /> Adicionar Produtos à Venda
          </h3>

          <div>
            <label htmlFor="select-viagem" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">Selecione a Viagem</label>
            <div className="relative">
              <select
                id="select-viagem"
                value={viagemSelecionada}
                onChange={(e) => setViagemSelecionada(e.target.value)}
                className="block appearance-none w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer text-lg"
              >
                <option value="">Selecione uma viagem</option>
                {viagens.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.destino} — {new Date(v.dataSaida).toLocaleDateString('pt-BR')}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="select-produto" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">Selecione o Produto</label>
              <div className="relative">
                <select
                  id="select-produto"
                  value={produtoIdSelecionado}
                  onChange={(e) => setProdutoIdSelecionado(e.target.value)}
                  className="block appearance-none w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer text-lg"
                >
                  <option value="">Selecione</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} (Padrão: R$ {p.precoVenda.toFixed(2).replace('.', ',')})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="input-quantidade" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">Quantidade</label>
              <input
                id="input-quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
              />
            </div>
          </div>

          <div className="relative flex items-center">
            <label htmlFor="input-preco-venda-manual" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2 sr-only">Preço de Venda (Opcional)</label>
            <DollarSign className="absolute left-3 text-slate-400 dark:text-slate-500 h-6 w-6 top-1/2 -translate-y-1/2 mt-1"/>
            <input
              id="input-preco-venda-manual"
              type="text"
              placeholder={produtoAtualSelecionado ? `Preço sugerido: R$ ${produtoAtualSelecionado.precoVenda.toFixed(2).replace('.', ',')}` : "Preço de Venda (Opcional)"}
              value={precoVendaManual}
              onChange={(e) => setPrecoVendaManual(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
              aria-label="Preço de Venda Manual (Opcional)"
            />
          </div>


          <button
            onClick={adicionarItem}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg mt-6"
          >
            <PlusCircle className="mr-2 h-6 w-6" />
            Adicionar Item
          </button>
        </div>

        {itens.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-6">
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-3 border-b pb-4 border-slate-200 dark:border-slate-700">
              <ShoppingCart className="h-7 w-7 text-indigo-500" /> Itens da Venda
            </h3>
            <ul className="space-y-4 mb-6">
              {itens.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                >
                  <span className="text-slate-800 dark:text-white font-medium text-lg">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.quantidade}x</span> {item.nome} —{" "}
                    <span className="text-green-600 dark:text-green-400">
                      R$ {item.precoUnitario.toFixed(2).replace(".", ",")}
                      {item.precoUnitario !== item.precoOriginalProduto && (
                        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                          (Padrão: R$ {item.precoOriginalProduto.toFixed(2).replace(".", ",")})
                        </span>
                      )}
                    </span>
                  </span>
                  <button
                    onClick={() => removerItem(index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition flex items-center gap-1.5 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Remover item"
                  >
                    <Trash2 className="h-5 w-5" /> <span className="hidden sm:inline">remover</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-right text-3xl font-bold text-slate-800 dark:text-white">
              Total:{" "}
              <span className="text-green-600 dark:text-green-400">
                R$ {totalVenda.toFixed(2).replace(".", ",")}
              </span>
            </p>
          </div>
        )}

        <button
          onClick={salvarVenda}
          disabled={itens.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg"
        >
          <CheckCircle className="mr-2 h-6 w-6" />
          Salvar Venda
        </button>
      </div>

      {showStatusModal && (
        <StatusModal
          message={statusMessage}
          type={statusType}
          onClose={() => setShowStatusModal(false)}
          duration={2000}
        />
      )}
    </div>
  )
}