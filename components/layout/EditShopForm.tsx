"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export interface Shop {
  id: string
  name: string
  description: string
  image: string
  street: string
  district: string
  regency: string
  province: string
  post_code: string
  work_hours: string
}

export interface PostResponse {
  error_schema: {
    error_code: string
    error_message: string
  }
  output_schema: string
}

export default function EditShopForm() {
  const [formData, setFormData] = useState<Shop | null>(null)
  const [currentData, setCurrentData] = useState<Shop | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const router = useRouter()
  useEffect(() => {
    const token = Cookies.get("token")
    if (!token) {
      router.push("/admin/login")
    }
    const fetchData = async () => {
      try {
        const data = JSON.parse(localStorage.getItem("editPayloadShop") || "{}")
        const response = await axios.get(`https://pintu-sewa-backend.up.railway.app/api/shop/${data.shopId}`)
        const mappedData: Shop = {
          id: response.data.output_schema.id,
          name: response.data.output_schema.name,
          description: response.data.output_schema.description,
          image: response.data.output_schema.image,
          street: response.data.output_schema.street,
          district: response.data.output_schema.district,
          regency: response.data.output_schema.regency,
          province: response.data.output_schema.province,
          post_code: response.data.output_schema.post_code,
          work_hours: response.data.output_schema.work_hours,
        }
        setFormData(mappedData)
        setCurrentData(mappedData)
      } catch (err: any) {
        console.error("Gagal fetch data Shop:", err)
        setErrorMessage("Gagal mengambil data Shop.")
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentData === formData) {
      setErrorMessage("Tidak ada Data yang berubah")
    } else {
      try {
        const response = await axios.put<PostResponse>("https://pintu-sewa-backend.up.railway.app/api/admin/manage-shop/edit", formData)

        localStorage.setItem("flashMessage", "Data berhasil diperbarui")
        router.push("/admin/manage-shop")
      } catch (err: any) {
        console.error("Gagal Mengubah data:", err)
        const errorList = err?.response?.data?.output_schema

        if (Array.isArray(errorList) && errorList.length > 0) {
          const firstError = errorList[0]
          const firstMessage = Array.isArray(firstError.error_message) ? firstError.error_message[0] : "Terjadi kesalahan."
          setErrorMessage(firstMessage)
        } else {
          setErrorMessage("Terjadi kesalahan saat mengubah data.")
        }
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prevData) => {
      if (!prevData) return prevData

      return {
        ...prevData,
        [name]: value,
      }
    })
  }

  if (!formData) return <div>Loading...</div>
  return (
    <div className='flex-1 flex flex-col p-6'>
      <h2 className='text-2xl font-semibold mb-6'>Form Edit Toko</h2>
      {errorMessage && <div className='mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md'>{errorMessage}</div>}
      <div className='flex flex-col gap-6'>
        <form
          onSubmit={handleSubmit}
          className='space-y-6 bg-white p-6 shadow-lg rounded-lg'
        >
          <div className='flex flex-col sm:flex-col gap-4'>
            <div className='flex-1'>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Nama
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md'
                placeholder='Masukkan Nama'
              />
            </div>
            <div className='flex-1'>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700'
              >
                Description
              </label>
              <input
                type='text'
                id='description'
                name='description'
                value={formData.description}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md'
                placeholder='Masukkan Description'
              />
            </div>
            <div className='flex-1'>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Jalan
              </label>
              <input
                type='text'
                id='street'
                name='street'
                value={formData.street}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md'
                placeholder='Masukkan Jalan'
              />
            </div>
            <div className='flex-1'>
              <label
                htmlFor='district'
                className='block text-sm font-medium text-gray-700'
              >
                Kecamatan
              </label>
              <input
                type='text'
                id='district'
                name='district'
                value={formData.district}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md'
                placeholder='Masukkan Kecamatan'
              />
            </div>
            <div className='flex-1'>
              <label
                htmlFor='regency'
                className='block text-sm font-medium text-gray-700'
              >
                Kota
              </label>
              <input
                type='text'
                id='regency'
                name='regency'
                value={formData.regency}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md'
                placeholder='Masukkan Kota'
              />
            </div>
            <div className='flex-1'>
              <label
                htmlFor='province'
                className='block text-sm font-medium text-gray-700'
              >
                Provinsi
              </label>
              <input
                type='text'
                id='province'
                name='province'
                value={formData.province}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md'
                placeholder='Masukkan Provinsi'
              />
            </div>
            <div className='flex-1'>
              <label
                htmlFor='post_code'
                className='block text-sm font-medium text-gray-700'
              >
                Kode Pos
              </label>
              <input
                type='text'
                id='post_code'
                name='post_code'
                value={formData.post_code}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md'
                placeholder='Masukkan Kode Pos'
              />
            </div>
            <div className='flex-1'>
              <label
                htmlFor='work_hours'
                className='block text-sm font-medium text-gray-700'
              >
                Jam Kerja
              </label>
              <input
                type='text'
                id='work_hours'
                name='work_hours'
                value={formData.work_hours}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md'
                placeholder='Masukkan Jam Kerja'
              />
            </div>
          </div>
          <div className='flex flex-row w-full gap-4 justify-end'>
            <a
              onClick={() => {
                router.back()
              }}
              className='p-3 bg-red-500 text-white rounded-md font-semibold cursor-pointer hover:bg-red-600 transition'
            >
              Cancel
            </a>
            <button
              type='submit'
              className='p-3 bg-blue-500 text-white rounded-md font-semibold cursor-pointer hover:bg-blue-600 transition'
            >
              Ubah Data
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
