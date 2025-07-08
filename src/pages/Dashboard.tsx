// src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../contexts/AuthContext";
import { Sun, Moon, DollarSign, Package, Truck, BarChart, ShoppingCart, Warehouse, PackagePlus, ClipboardList, TrendingUp, X } from "lucide-react";

// --- Tipos para o Relatório Mensal ---
type RelatorioMensal = {
  dataFechamento: string;
  totalVendas: number;
  lucroBruto: number;
  totalDespesasOperacionais: number;
  custoMercadoriaVendida: number;
  lucroLiquidoMensal: number;
  viagensRealizadas: number;
  vendasRealizadas: number;
}

// --- Tipos existentes do seu DashboardData ---
type ProdutoMaisVendido = {
  nome: string;
  quantidade: number;
}

type DashboardData = {
  totalVendas: number;
  totalLucro: number;
  totalDespesas: number;
  lucroLiquido: number;
  topProdutosMaisVendidos: ProdutoMaisVendido[];
  viagemMaisRentavel: { viagemId: number; receita: number } | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useDarkMode();
  const [dados, setDados] = useState<DashboardData | null>(null);
  const { nomeUsuario, token } = useAuth();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relatorioMensal, setRelatorioMensal] = useState<RelatorioMensal | null>(null);
  const [isLoadingFecharMes, setIsLoadingFecharMes] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/dashboard`, { headers });
        if (!res.ok) {
          if (res.status === 401) {
            navigate('/login');
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setDados(data);
      } catch (error: any) {
        console.error("Erro ao carregar dashboard:", error);
        setErrorMessage("Erro ao carregar os dados do dashboard: " + error.message);
      }
    };

    fetchDashboardData();
  }, [token, navigate]);

  const saldo = dados ? dados.lucroLiquido : 0;

  const handleConfirmFecharMes = async () => {
    setShowConfirmModal(false);
    setIsLoadingFecharMes(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/fechar-mes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro do servidor: ${response.status}`);
      }

      const data = await response.json();
      setRelatorioMensal(data.relatorio);
      setIsModalOpen(true);

      const updatedDashboardHeaders: HeadersInit = {};
      if (token) {
        updatedDashboardHeaders['Authorization'] = `Bearer ${token}`;
      }
      fetch(`${API_BASE_URL}/dashboard`, { headers: updatedDashboardHeaders })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(setDados)
        .catch(error => console.error("Erro ao recarregar dashboard após fechamento:", error));

    } catch (error: any) {
      setErrorMessage(`Falha ao fechar o mês: ${error.message}`);
      console.error("Erro ao fechar o mês:", error);
    } finally {
      setIsLoadingFecharMes(false);
    }
  };

  return (
    // ALTERAÇÃO AQUI: Gradiente com 3 cores para transição mais suave
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-purple-800 to-indigo-900 dark:from-gray-900 dark:via-slate-900 dark:to-black flex flex-col items-center p-8 transition-colors duration-500 ease-in-out">
      <div className="w-full max-w-5xl">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-5xl font-extrabold text-blue-300 dark:text-indigo-400 drop-shadow-md text-center sm:text-left">
            Olá {nomeUsuario ? nomeUsuario.split(' ')[0] : 'Caminhoneiro'}!
          </h1>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4">
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isLoadingFecharMes}
              className="px-6 py-3 rounded-full text-lg font-bold bg-emerald-600 dark:bg-emerald-700 text-white shadow-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingFecharMes ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <TrendingUp className="h-6 w-6" />
                  Fechar Mês
                </>
              )}
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="px-6 py-3 rounded-full text-lg font-bold bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white shadow-lg hover:bg-slate-400 dark:hover:bg-slate-600 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
            >
              {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              Modo {isDark ? "Claro" : "Escuro"}
            </button>
          </div>
        </header>

        {/* Mensagem de erro */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl shadow-md mb-8 transition-all duration-300 flex items-center justify-center text-center font-medium">
            <strong className="font-bold mr-2">Erro:</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}

        {/* --- Dashboard Cards --- */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10">
          {/* Card Saldo Atual */}
          <div
            className={`p-8 rounded-3xl shadow-2xl border ${saldo >= 0 ? "border-emerald-300 dark:border-emerald-700" : "border-red-300 dark:border-red-700"} flex flex-col items-center justify-center text-center transition-all duration-500 ease-in-out
            ${
              saldo >= 0
                ? "bg-gradient-to-br from-emerald-50 to-emerald-200 text-emerald-800 dark:from-emerald-900 dark:to-emerald-800 dark:text-emerald-200"
                : "bg-gradient-to-br from-red-50 to-red-200 text-red-800 dark:from-red-900 dark:to-red-800 dark:text-red-200"
            }`}
          >
            <DollarSign className="h-12 w-12 mb-4 drop-shadow-sm" />
            <h2 className="text-2xl font-bold mb-2">Saldo Atual</h2>
            <p className="text-4xl font-extrabold break-words"> 
              R$ {saldo.toFixed(2).replace(".", ",")}
            </p>
          </div>

          {/* Card Top 5 Produtos Mais Vendidos */}
          <div className="p-8 rounded-3xl shadow-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-colors duration-300 flex flex-col">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-5">
              <Package className="h-8 w-8 text-indigo-500" /> Top 5 Produtos Mais Vendidos
            </h2>
            <ul className="flex-grow space-y-3">
              {dados?.topProdutosMaisVendidos && dados.topProdutosMaisVendidos.length > 0 ? (
                dados.topProdutosMaisVendidos.map((p, i) => (
                  <li key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <span className="font-medium text-slate-700 dark:text-slate-200 text-lg">{i + 1}. {p.nome}</span>
                    <span className="text-slate-600 dark:text-slate-300 text-base">{p.quantidade} unidades</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 dark:text-slate-400 text-center py-6 text-lg">Nenhum produto registrado ainda.</li>
              )}
            </ul>
          </div>

          {/* Card Viagem Mais Rentável */}
          <div className="p-8 rounded-3xl shadow-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-colors duration-300 flex flex-col justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-5">
              <Truck className="h-8 w-8 text-purple-500" /> Viagem Mais Rentável
            </h2>
            {dados?.viagemMaisRentavel ? (
              <div className="flex flex-col items-center justify-center flex-grow text-center">
                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
                  Viagem #{dados.viagemMaisRentavel.viagemId}
                </p>
                <p className="text-4xl font-extrabold text-green-600 dark:text-green-400">
                  R$ {dados.viagemMaisRentavel.receita.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-base text-slate-500 dark:text-slate-400 mt-3">
                  (Maior receita individual)
                </p>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-6 flex-grow flex items-center justify-center text-lg">Nenhuma viagem registrada com receita ainda.</p>
            )}
          </div>
        </div>

        {/* --- Action Buttons Section --- */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Botões de INSERÇÃO */}
          <ActionButton
            icon={<ShoppingCart className="h-8 w-8" />}
            label="+ Nova Venda"
            onClick={() => navigate("/nova-venda")}
            colors="bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
          />
          <ActionButton
            icon={<Package className="h-8 w-8" />}
            label="+ Novo Produto"
            onClick={() => navigate("/cadastrar-produto")}
            colors="bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
          />
          <ActionButton
            icon={<Truck className="h-8 w-8" />}
            label="+ Nova Viagem"
            onClick={() => navigate("/nova-viagem")}
            colors="bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
          />

          {/* Botões de RELATÓRIOS / ESTOQUE */}
          <ActionButton
            icon={<Warehouse className="h-8 w-8" />}
            label="Estoque Atual"
            onClick={() => navigate("/estoque-atual")}
            colors="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
          />
          <ActionButton
            icon={<PackagePlus className="h-8 w-8" />}
            label="Entrada de Produtos"
            onClick={() => navigate("/entrada-produtos")}
            colors="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
          />
          <ActionButton
            icon={<ClipboardList className="h-8 w-8" />}
            label="Relatório de Inventário"
            onClick={() => navigate("/relatorio-inventario")}
            colors="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
          />
          <ActionButton
            icon={<BarChart className="h-8 w-8" />}
            label="Relatório de Vendas"
            onClick={() => navigate("/relatorio-vendas")}
            colors="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
          />
          <ActionButton
            icon={<ShoppingCart className="h-8 w-8" />}
            label="Relatório de Viagens"
            onClick={() => navigate("/relatorio-viagens")}
            colors="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
          />
        </div>
      </div>

      {/* --- Modal de Confirmação para Fechar Mês --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-3xl border border-slate-200 dark:border-slate-700 w-full max-w-lg relative text-slate-800 dark:text-white transform scale-95 opacity-0 animate-scale-in-smooth">
            <h3 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-6 text-center">
              Atenção! Confirmação Necessária
            </h3>
            <p className="text-xl text-center mb-8 leading-relaxed">
              Tem certeza que deseja **fechar o mês**? Esta ação é **irreversível** e irá:
            </p>
            <ul className="list-disc list-inside space-y-3 mb-8 text-lg pl-4">
              <li className="text-red-700 dark:text-red-300 font-semibold">Gerar o relatório financeiro consolidado do mês.</li>
              <li className="text-red-700 dark:text-red-300 font-semibold">**APAGAR IRREVERSIVELMENTE** todas as Vendas, Despesas e Viagens registradas.</li>
              <li className="text-red-700 dark:text-red-300 font-semibold">Manter apenas os Produtos no estoque.</li>
            </ul>
            <div className="flex flex-col sm:flex-row justify-around gap-4 mt-8">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-3 rounded-full font-bold bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white hover:bg-slate-400 dark:hover:bg-slate-700 transition-all duration-300 transform hover:scale-105"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmFecharMes}
                className="flex-1 px-6 py-3 rounded-full font-bold bg-red-600 text-white hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
              >
                Confirmar Fechamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal de Relatório Mensal --- */}
      {isModalOpen && relatorioMensal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-3xl border border-slate-200 dark:border-slate-700 w-full max-w-xl relative text-slate-800 dark:text-white transform scale-95 opacity-0 animate-scale-in-smooth overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
            >
              <X className="h-7 w-7" />
            </button>
            <h2 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-8 text-center border-b pb-4 border-slate-200 dark:border-slate-700">
              Relatório Mensal
            </h2>
            <div className="space-y-6 text-xl">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-indigo-500 mr-2">📅</span> Data do Fechamento:{" "}
                <span className="font-normal text-slate-600 dark:text-slate-400">{new Date(relatorioMensal.dataFechamento).toLocaleDateString()}</span>
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MetricDisplay label="Total de Vendas" value={relatorioMensal.totalVendas} color="text-emerald-600 dark:text-emerald-400" />
                <MetricDisplay label="Custo da Mercadoria Vendida (CMV)" value={relatorioMensal.custoMercadoriaVendida} color="text-orange-600 dark:text-orange-400" />
              </div>

              <MetricDisplay label="Lucro Bruto (Vendas - CMV)" value={relatorioMensal.lucroBruto} color={relatorioMensal.lucroBruto >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'} isBold={true} />
              
              <MetricDisplay label="Total de Despesas (Geral)" value={relatorioMensal.totalDespesasOperacionais} color="text-red-600 dark:text-red-400" />

              <MetricDisplay label="Lucro Líquido Mensal" value={relatorioMensal.lucroLiquidoMensal} color={relatorioMensal.lucroLiquidoMensal >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'} isLarge={true} isBold={true} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p><span className="font-semibold text-slate-700 dark:text-slate-300">Viagens Realizadas:</span> <span className="font-normal text-slate-600 dark:text-slate-400">{relatorioMensal.viagensRealizadas}</span></p>
                <p><span className="font-semibold text-slate-700 dark:text-slate-300">Vendas Realizadas:</span> <span className="font-normal text-slate-600 dark:text-slate-400">{relatorioMensal.vendasRealizadas}</span></p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-8 text-center pt-4 border-t border-slate-200 dark:border-slate-700">
              Os dados de vendas, despesas e viagens foram limpos para o novo ciclo financeiro.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Componente Auxiliar para Botões de Ação (Para maior legibilidade e reuso) ---
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  colors: string; // Tailwind classes for background/text colors
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick, colors }) => (
  <button
    onClick={onClick}
    className={`w-full h-32 flex flex-col items-center justify-center p-4 rounded-2xl shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105
      ${colors}
      group
    `}
  >
    <div className={`mb-3 text-current group-hover:scale-110 transition-transform duration-200 ${colors.includes('text-white') ? 'text-white' : 'text-indigo-500 dark:text-indigo-300'}`}>
      {icon}
    </div>
    <span className="text-xl font-bold text-current">{label}</span>
  </button>
);

// --- Componente Auxiliar para Métricas no Modal (Para maior legibilidade e reuso) ---
interface MetricDisplayProps {
  label: string;
  value: number;
  color: string;
  isLarge?: boolean;
  isBold?: boolean;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, color, isLarge = false, isBold = false }) => (
  <p className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm">
    <span className={`font-semibold text-slate-700 dark:text-slate-300 ${isLarge ? 'text-xl' : 'text-lg'}`}>{label}:</span>
    <span className={`${color} ${isLarge ? 'text-3xl' : 'text-xl'} ${isBold ? 'font-extrabold' : 'font-semibold'}`}>
      R$ {value.toFixed(2).replace(".", ",")}
    </span>
  </p>
);