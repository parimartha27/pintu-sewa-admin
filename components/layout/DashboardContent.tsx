"use client"

import DashboardCard from "./DashboardCard"
import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

interface DashboardResponse {
  error_schema: {
    error_code: string
    error_message: string
  }
  output_schema: {
    customer_id: null
    customers_count: number
    shops_count: number
    reports_count: number
  }
}

export default function DashboardContent() {
  const router = useRouter()
  const [customersCount, setCustomersCount] = useState<number | null>(null)
  const [shopsCount, setShopsCount] = useState<number | null>(null)
  const [reportsCount, setReportsCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DashboardResponse>("https://pintu-sewa-backend.up.railway.app/api/admin/dashboard")
        const output = response.data.output_schema
        setCustomersCount(output.customers_count)
        setShopsCount(output.shops_count)
        setReportsCount(output.reports_count)
      } catch (err) {
        console.error("Gagal fetch data dashboard:", err)
      }
    }

    const token = Cookies.get("token")
    if (!token) {
      router.push("/admin/login")
    }

    fetchData() // initial fetch

    const interval = setInterval(fetchData, 5000) // polling tiap 5 detik

    return () => clearInterval(interval) // clear saat komponen unmount
  }, [])

  return (
    <div className='flex-1 flex flex-col'>
      <main className='flex-1 p-6'>
        <h2 className='text-2xl font-semibold mb-6'>Hai, Dashboard</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          <DashboardCard
            title='Total Pelanggan'
            count={customersCount ?? 0}
          />
          <DashboardCard
            title='Total Toko'
            count={shopsCount ?? 0}
          />
          <DashboardCard
            title='Total Keluhan'
            count={reportsCount ?? 0}
          />
        </div>
      </main>
    </div>
  )
}
