import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import RoutesApp from "./RoutesApp"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesApp />
      </AuthProvider>
    </BrowserRouter>
  )
}
