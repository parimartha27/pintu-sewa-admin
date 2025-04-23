"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export interface Customer {
  id: string;
  username: string;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
  birth_date: string;
}

export interface PostResponse{
  error_schema: {
      error_code: string;
      error_message:string;
  };
  output_schema: string;
}

export default function EditCustomerForm() {
  const [formData, setFormData] = useState<Customer | null>(null);
  const [currentData, setCurrentData] = useState<Customer | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/admin/login");
    }
    const fetchData = async () => {
      try {
        const data = JSON.parse(localStorage.getItem("editPayloadCustomer") || "{}");
        const response = await axios.get(
          `https://pintu-sewa.up.railway.app/api/customers/${data.customerId}`
        );
        const mappedData: Customer = {
          id: response.data.output_schema.id,
          username: response.data.output_schema.username,
          name: response.data.output_schema.name,
          email: response.data.output_schema.email,
          phone_number: response.data.output_schema.phone_number,
          gender: response.data.output_schema.gender,
          birth_date: response.data.output_schema.birth_date,
        };
        setFormData(mappedData);
        setCurrentData(mappedData);
      } catch (err: any) {
        console.error("Gagal fetch data customer:", err);
        setErrorMessage("Gagal mengambil data pelanggan.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(currentData === formData){
      setErrorMessage("Tidak ada Data yang berubah");
    }else{
      try {
        const response = await axios.put<PostResponse>("https://pintu-sewa.up.railway.app/api/admin/manage-customer/edit-biodata", formData);

        localStorage.setItem("flashMessage", "Data berhasil diperbarui");
        router.push("/admin/manage-customer");
        
      } catch (err: any) {
        console.error("Gagal Merubah data:", err);
        const errorList = err?.response?.data?.output_schema;
      
        if (Array.isArray(errorList) && errorList.length > 0) {
          const firstError = errorList[0];
          const firstMessage = Array.isArray(firstError.error_message)
            ? firstError.error_message[0]
            : "Terjadi kesalahan.";
          setErrorMessage(firstMessage);
        } else {
          setErrorMessage("Terjadi kesalahan saat Merubah data.");
        }
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      if (!prevData) return prevData;
  
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  if (!formData) return <div>Loading...</div>;
  return (
    
    <div className="flex-1 flex flex-col p-6">
      <h2 className="text-2xl font-semibold mb-6">Form Edit Pelanggan</h2>
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {errorMessage}
        </div>
      )}
      <div className="flex flex-col gap-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 shadow-lg rounded-lg"
        >
          <div className="flex flex-col sm:flex-col gap-4">
            <div className="flex-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
                placeholder="Masukkan Username"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
                placeholder="Masukkan Nama"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
                placeholder="Masukkan Email"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
                placeholder="Masukkan No Telp"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              >
                <option value="">Pilih Gender</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="birth_date"
                className="block text-sm font-medium text-gray-700"
              >
                Birth Date
              </label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md"
                placeholder="Tanggal Lahir"
              />
            </div>
          </div>

          <div className="flex flex-row w-full gap-4 justify-end">
            <a
              onClick={() => {
                router.back();
              }}
              className="p-3 bg-red-500 text-white rounded-md font-semibold cursor-pointer hover:bg-red-600 transition"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="p-3 bg-blue-500 text-white rounded-md font-semibold cursor-pointer hover:bg-blue-600 transition"
            >
              Ubah Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
