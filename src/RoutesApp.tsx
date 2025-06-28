// src/RoutesApp.tsx
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CadastroProduto from "./pages/CadastroProduto"
import NovaVenda from "./pages/NovaVenda"
import NovaViagem from "./pages/NovaViagem"
import RelatorioViagens from "./pages/RelatorioViagens"
import RelatorioVendas from "./pages/RelatorioVendas"
import EstoqueAtual from "./pages/EstoqueAtual"       // <-- Importe o novo componente
import EntradaProdutos from "./pages/EntradaProdutos" // <-- Importe o novo componente
import { PrivateRoute } from "./contexts/PrivateRoute"
import RelatorioInventario from "./pages/RelatorioInventario"

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/cadastrar-produto" element={<PrivateRoute><CadastroProduto /></PrivateRoute>} />
      <Route path="/nova-venda" element={<PrivateRoute><NovaVenda /></PrivateRoute>} />
      <Route path="/nova-viagem" element={<PrivateRoute><NovaViagem /></PrivateRoute>} />
      <Route path="/relatorio-viagens" element={<PrivateRoute><RelatorioViagens /></PrivateRoute>} />
      <Route path="/relatorio-vendas" element={<PrivateRoute><RelatorioVendas /></PrivateRoute>} />
      <Route path="/estoque-atual" element={<PrivateRoute><EstoqueAtual /></PrivateRoute>} />       {/* <-- Nova rota */}
      <Route path="/entrada-produtos" element={<PrivateRoute><EntradaProdutos /></PrivateRoute>} /> {/* <-- Nova rota */}
      <Route path="/relatorio-inventario" element={<PrivateRoute><RelatorioInventario /></PrivateRoute>} /> {/* <-- NOVA ROTA */}
    </Routes>
  )
}