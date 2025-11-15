import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function Header() {
  const linkStyle: React.CSSProperties = { textDecoration: 'none', color: 'inherit' }
  const activeStyle: React.CSSProperties = { fontWeight: 700 }
  const navigate = useNavigate()
  const { user, clearSession } = useAuth()

  const logoutMut = useMutation({
    mutationFn: async () => {
      await api.post<{ ok: boolean }>('/auth/logout')
    },
    onSettled: () => {
      clearSession()
      navigate('/login')
    },
  })

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-backdrop-filter:border-b border-border">
      <nav className="container mx-auto max-w-screen-2xl h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-semibold text-primary">Hospital Client</Link>
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'px-3 py-2 rounded-md bg-secondary text-foreground' : 'px-3 py-2 rounded-md hover:bg-secondary'}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'px-3 py-2 rounded-md bg-secondary text-foreground' : 'px-3 py-2 rounded-md hover:bg-secondary'}>
              Dashboard
            </NavLink>
            <NavLink to="/appointments" className={({ isActive }) => isActive ? 'px-3 py-2 rounded-md bg-secondary text-foreground' : 'px-3 py-2 rounded-md hover:bg-secondary'}>
              Appointments
            </NavLink>
            <NavLink to="/staff" className={({ isActive }) => isActive ? 'px-3 py-2 rounded-md bg-secondary text-foreground' : 'px-3 py-2 rounded-md hover:bg-secondary'}>
              Staff
            </NavLink>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NavLink to="/about" className={({ isActive }) => isActive ? 'px-3 py-2 rounded-md bg-secondary text-foreground' : 'px-3 py-2 rounded-md hover:bg-secondary'}>
            About
          </NavLink>
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMut.mutate()}
              disabled={logoutMut.isPending}
            >
              {logoutMut.isPending ? 'Logging out…' : 'Logout'}
            </Button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => isActive ? 'px-3 py-2 rounded-md bg-secondary text-foreground' : 'px-3 py-2 rounded-md hover:bg-secondary'}>
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}
