"use client"

import { useState } from "react"
import Cookies from "js-cookie"
import { Home, UserRoundPen, Store, MessageSquareWarning, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SideBar({ navigation }: { navigation: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <aside
        className={`fixed z-30 inset-y-0 text-white left-0 transform md:static md:translate-x-0 w-64 bg-blue-950 shadow-lg transition-transform duration-200 ease-in-out flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <h2 className='flex flex-row gap-2 items-center text-xl font-bold p-5'>PINTU SEWA</h2>
          <nav>
            <a
              onClick={() => {
                router.push("/admin")
              }}
              className={`flex items-center gap-2 text-md p-5 font-medium hover:text-blue-400 ${navigation == "dashboard" ? "text-blue-300" : ""}`}
            >
              <Home size={18} /> Dashboard
            </a>
            <a
              onClick={() => {
                router.push("/admin/manage-customer")
              }}
              className={`flex items-center gap-2 text-md p-5 font-medium hover:text-blue-400 ${navigation == "pelanggan" ? "text-blue-300" : ""}`}
            >
              <UserRoundPen size={18} /> Manage Pelanggan
            </a>
            <a
              onClick={() => {
                router.push("/admin/manage-shop")
              }}
              className={`flex items-center gap-2 text-md p-5 font-medium hover:text-blue-400 ${navigation == "toko" ? "text-blue-300" : ""}`}
            >
              <Store size={18} /> Manage Toko
            </a>
            <a
              onClick={() => {
                router.push("/admin/manage-report")
              }}
              className={`flex items-center gap-2 text-md p-5 font-medium hover:text-blue-400 ${navigation == "keluhan" ? "text-blue-300" : ""}`}
            >
              <MessageSquareWarning size={18} /> Manage Keluhan
            </a>
            {/* Tambahkan menu lain di sini */}
          </nav>
        </div>
        <button
          onClick={() => {
            Cookies.remove("token")
            router.push("/")
          }}
          className='flex m-5 py-4 px-2 items-center rounded-xl justify-center bg-blue-400 gap-2 text-md  text-white cursor-pointer'
        >
          Log out
        </button>
      </aside>

      {/* Sidebar */}
      <div className='md:hidden flex items-center justify-between bg-white p-4 shadow-sm'>
        <div></div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={24} />
        </button>
      </div>
    </>
  )
}
