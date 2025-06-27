import { createContext, useContext, useState, ReactNode } from "react"

type AuthContextType = {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("auth") === "true"
  })

  const login = (token: string) => {
    setIsAuthenticated(true)
    localStorage.setItem("auth", "true")
    localStorage.setItem("token", token)
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("auth")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
