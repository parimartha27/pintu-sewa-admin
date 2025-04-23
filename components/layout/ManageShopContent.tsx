"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

// Interface untuk Shop dan ShopApiResponse
export interface ShopApiResponse {
  error_schema: {
    error_code: string;
    error_message: string;
  };
  output_schema: {
    content: Shop[];
    current_page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface Shop {
  id: string;
  name: string;
  customer_name: string;
  description: string;
  street: string;
  regency: string;
  shop_status: string;
}

export default function ManageShopContent() {
  const [shops, setShops] = useState<Shop[]>([]); // State untuk menyimpan data shop
  const [searchTerm, setSearchTerm] = useState(""); // State untuk search
  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman aktif
  const [totalPages, setTotalPages] = useState(1); // State untuk jumlah total halaman
  const [totalItems, setTotalItems] = useState(1); // State untuk jumlah total items
  const rowsPerPage = 5; // Jumlah data per halaman
  const router = useRouter();

  const fetchData = async () => {
    try {
      // Mengambil data API berdasarkan halaman
      const response = await axios.get<ShopApiResponse>(
        `https://pintu-sewa.up.railway.app/api/admin/manage-shop/${currentPage}`
      );

      // Menyimpan data shop dan total halaman ke state
      setShops(response.data.output_schema.content);
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
      localStorage.removeItem("flashMessage");
    }

    fetchData(); // Memanggil data pada saat halaman pertama kali di-render dan saat halaman berubah
  }, [currentPage]);

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMaxData = currentPage * rowsPerPage;
  const indexOfFirst = currentMaxData - rowsPerPage;
  const indexOfLast = indexOfFirst + shops.length;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset ke halaman pertama ketika search diubah
  };

  const SetNewStatus = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;

    const shopId = target.getAttribute("data-shopid");
    const change =
      target.getAttribute("title") == "Deactive" ? "deactive" : "activate";
    try {
      const response = await axios.put(
        `https://pintu-sewa.up.railway.app/api/admin/manage-shop/${change}/${shopId}`
      );

      fetchData();
      toast.success(`Berhasil ${change} Toko`);
    } catch (err: any) {
      toast.error(`Gagal ${change} Toko`);
      console.error(err);
    }
  };

  const RedirectFunction = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;

    const shopId = target.getAttribute("data-shopid");
    router.push(`/admin/manage-shop/edit`);
    localStorage.removeItem("editPayloadShop"); // pastikan kosong dulu
    localStorage.setItem("editPayloadShop", JSON.stringify({ shopId }));
  };

  return (
    <div className="flex-1 flex flex-col">
      <Toaster position="bottom-right" reverseOrder={false} />

      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Kelola Toko</h2>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari nama atau customer..."
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
                <th className="px-6 py-3">Shop Name</th>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Street</th>
                <th className="px-6 py-3">Regency</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id} className="border-t hover:bg-blue-50">
                  <td className="px-6 py-4">
                    {indexOfFirst + 1 + shops.indexOf(shop)}
                  </td>
                  <td className="px-6 py-4">{shop.name}</td>
                  <td className="px-6 py-4">{shop.customer_name}</td>
                  <td className="px-6 py-4">{shop.description}</td>
                  <td className="px-6 py-4">{shop.street}</td>
                  <td className="px-6 py-4">{shop.regency}</td>
                  <td className="px-6 py-4">
                    {shop.shop_status === "ACTIVE" ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-500 font-medium">Inactive</span>
                    )}
                  </td>
                  <td className="flex flex-row px-6 py-4 text-center space-x-2">
                    <button
                      data-shopid={shop.id}
                      onClick={RedirectFunction}
                      className="px-4 py-2 border cursor-pointer border-blue-600 text-blue-600 rounded-md hover:bg-blue-100 transition duration-200"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    {shop.shop_status === "ACTIVE" ? (
                      <button
                        data-shopid={shop.id}
                        className="px-4 py-2 border cursor-pointer border-red-600 text-red-600 rounded-md hover:bg-red-100 transition duration-200"
                        title="Deactive"
                        onClick={SetNewStatus}
                      >
                        Deactive
                      </button>
                    ) : (
                      <button
                        data-shopid={shop.id}
                        className="px-4 py-2 border cursor-pointer border-green-600 text-green-600 rounded-md hover:bg-green-100 transition duration-200"
                        onClick={SetNewStatus}
                        title="Activate"
                      >
                        Activate
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
              Menampilkan {indexOfFirst + 1} -{" "}
              {indexOfLast} dari {totalItems}{" "}
              shop
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
