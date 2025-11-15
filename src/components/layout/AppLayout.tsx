import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'

export default function AppLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="container mx-auto w-full max-w-screen-2xl flex-1 p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
