'use client'

// import { useState } from 'react' // Comentado
// import Sidebar from './Sidebar' // Comentado
// import Header from './Header' // Comentado
// import Footer from './Footer' // Comentado
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  // const [collapsed, setCollapsed] = useState(false); // Comentado

  return (
    // <div className="min-h-screen flex flex-col bg-gray-50"> // Comentado
    //   {/* Header fixo no topo */}
    //   <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow">
    //     <Header onToggleSidebar={() => setCollapsed(!collapsed)} />
    //   </header>

    //   <div className="flex flex-1 pt-16">
    //     {/* Sidebar fixa */}
    //     <aside className={`${collapsed ? 'w-16' : 'w-64'} hidden md:block bg-white shadow h-[calc(100vh-4rem)] fixed left-0 top-16 z-10 transition-all duration-300`}>
    //       <Sidebar collapsed={collapsed} />
    //     </aside>

    //     {/* Conteúdo principal usando toda a largura disponível */}
    //     <main className={`flex-1 ${collapsed ? 'ml-16' : 'ml-64'} px-4 py-10 transition-all duration-300`}>
    //       <div className="w-full"><Outlet /></div>
    //     </main>
    //   </div>

    //   {/* Rodapé */}
    //   <footer className="bg-white shadow py-4 mt-auto z-0">
    //     <Footer />
    //   </footer>
    // </div> // Comentado

    // --- Versão Simplificada --- 
    <div style={{ border: '2px solid red', padding: '20px' }}>
      <h1>Admin Layout Simplificado (Teste)</h1>
      <main>
        <Outlet />
      </main>
    </div>
    // --- Fim Versão Simplificada ---
  )
}
