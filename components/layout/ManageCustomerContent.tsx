"use client";

import { useEffect, useState } from "react";
import { Pencil, CheckCircle, Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

// Interface untuk Customer dan CustomerApiResponse
export interface CustomerApiResponse {
  error_schema: {
    error_code: string;
    error_message: string;
  };
  output_schema: {
    content: Customer[];
    current_page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface Customer {
  customer_id: string;
  username: string;
  email: string;
  phone_number: string;
  status: string;
}

export default function ManageCustomerContent() {
  const [customers, setCustomers] = useState<Customer[]>([]); // State untuk menyimpan data customer
  const [searchTerm, setSearchTerm] = useState(""); // State untuk search
  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman aktif
  const [totalPages, setTotalPages] = useState(1); // State untuk jumlah total halaman
  const [totalItems, setTotalItems] = useState(1); // State untuk jumlah total halaman
  const rowsPerPage = 5; // Jumlah data per halaman
  const router = useRouter();

  const fetchData = async () => {
    try {
      // Mengambil data API berdasarkan halaman
      const response = await axios.get<CustomerApiResponse>(
        `https://pintu-sewa.up.railway.app/api/admin/manage-customer/${currentPage}`
      );

      // Menyimpan data customer dan total halaman ke state
      setCustomers(response.data.output_schema.content);
      setTotalPages(response.data.output_schema.total_pages);
      setTotalItems(response.data.output_schema.total_items);
    } catch (err) {
      console.error("Gagal fetch data dashboard:", err);
    }
  };
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/admin/login");
    }
    const message = localStorage.getItem("flashMessage");
    if (message) {
      toast.success(message);
      localStorage.removeItem("flashMessage"); // hapus biar nggak muncul lagi pas reload
    }


    fetchData(); // Memanggil data pada saat halaman pertama kali di-render dan saat halaman berubah
  }, [currentPage]);

  const currentMaxData = currentPage * rowsPerPage;
  const indexOfFirst = currentMaxData - rowsPerPage;
  const indexOfLast = indexOfFirst + customers.length;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset ke halaman pertama ketika search diubah
  };

  const RedirectFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;

    const customerId = target.getAttribute("data-customerid");
    router.push(`/admin/manage-customer/edit`);
    localStorage.removeItem("editPayloadCustomer"); // pastikan kosong dulu
    localStorage.setItem("editPayloadCustomer", JSON.stringify({ customerId }));
  };

  const SetNewStatus = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;

    const customerId = target.getAttribute("data-customerid");
    const change =
      target.getAttribute("title") == "Deactive" ? "suspend" : "unsuspend";
    try {
      const response = await axios.put(
        `https://pintu-sewa.up.railway.app/api/admin/manage-customer/${change}/${customerId}`,
      );
      
      fetchData();
      toast.success(`Berhasil ${change} Pelanggan`);
    } catch (err: any) {
      toast.error(`Gagal ${change} Pelanggan`);
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Toaster position="bottom-right" reverseOrder={false} />

      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Kelola Pelanggan</h2>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-50 text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone Number</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.customer_id}
                  className="border-t hover:bg-blue-50"
                >
                  <td className="px-6 py-4">
                    {indexOfFirst + 1 + customers.indexOf(customer)}
                  </td>
                  <td className="px-6 py-4">{customer.username}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{customer.phone_number}</td>
                  <td className="px-6 py-4">
                    {customer.status === "ACTIVE" ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-500 font-medium">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      data-customerid={customer.customer_id}
                      onClick={RedirectFunction}
                      className="px-4 py-2 border cursor-pointer border-blue-600 text-blue-600 rounded-md hover:bg-blue-100 transition duration-200"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    {customer.status === "ACTIVE" ? (
                      <button
                        data-customerid={customer.customer_id}
                        className="px-4 py-2 border cursor-pointer border-red-600 text-red-600 rounded-md hover:bg-red-100 transition duration-200"
                        title="Deactive"
                        onClick={SetNewStatus}
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        data-customerid={customer.customer_id}
                        className="px-4 py-2 border cursor-pointer border-green-600 text-green-600 rounded-md hover:bg-green-100 transition duration-200"
                        onClick={SetNewStatus}
                        title="Activate"
                      >
                        Unsuspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between px-6 py-4 text-sm text-gray-600">
            <div>
              Menampilkan {indexOfFirst + 1} - {indexOfLast} dari {totalItems}{" "}
              pelanggan
            </div>
            <div className="flex space-x-1 mt-2 sm:mt-0">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded-md border hover:bg-blue-100 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1 rounded-md border ${
                      num === currentPage
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded-md border hover:bg-blue-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
