"use client";

import { Toaster } from "react-hot-toast";
import { Send } from "lucide-react";

export default function ManageReportContent() {
  return (
    <div className="h-svh flex flex-col w-full overflow-hidden ">
      <Toaster position="bottom-right" reverseOrder={false} />
      <main className="flex flex-col flex-1 p-6 overflow-hidden">
        <h2 className="text-2xl font-semibold mb-6">Kelola Report</h2>

        <div className="flex flex-row w-full flex-1 overflow-hidden bg-white shadow-md rounded-xl">
          {/* LIST CHAT */}
          <section className="flex-1/4 overflow-y-auto border-l-2 border-y-2 border">
            <div className="w-full flex flex-row items-center gap-4 p-4 h-1/10 cursor-pointer hover:bg-blue-50">
              <div className="w-16 h-full rounded-full bg-amber-500">
                <img src="" alt="" />
              </div>
              <p className="text-2xl font-semibold">Matthew</p>
            </div>
          </section>

          {/* CHATNYA */}
          <section className="flex-3/4 flex justify-between flex-col overflow-y-auto border-2">
            <div className="flex flex-row items-center h-1/12 gap-2 p-2 border-b-2">
              <div className="w-15 h-full rounded-full bg-white">
                <img src="" alt="" />
              </div>
              <p className="text-2xl font-semibold">Mathew</p>
            </div>
            <div className="h-10/12 overflow-y-auto flex flex-col gap-4 p-4">
              {/* Tanggal */}
              <div className="text-center text-gray-500 text-sm">
                10 Feb 2025
              </div>

              {/* Pesan keluar */}
              <div className="flex justify-end">
                <div className="bg-blue-800 text-white text-sm px-4 py-2 rounded-xl max-w-[60%]">
                  <p>Hai Kawan!! ada yang bisa kami bantu?</p>
                  <div className="flex justify-between items-center text-xs mt-1 text-gray-200">
                    <span>14:00</span>
                  </div>
                </div>
              </div>

              {/* Pesan masuk */}
              <div className="flex justify-start">
                <div className="bg-blue-200 text-sm px-4 py-2 rounded-xl max-w-[60%]">
                  <p>Selamat malam min, aku mau bertanya untuk topup menggunakan bank Allo bisa tidak ya?</p>
                  <p className="text-xs text-right text-gray-600 mt-1">14:30</p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-800 text-white text-sm px-4 py-2 rounded-xl max-w-[60%]">
                  <p>Malam juga ka, mohon maaf nie sebelumnya untuk saat ini jika ingin melakukan top up belum bisa menggunakan bank tersebut, mungkin kedepannya akan kami usahakan</p>
                  <div className="flex justify-between items-center text-xs mt-1 text-gray-200">
                    <span>14:40</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-1/12 border-t p-2">
              <div className="w-full h-full flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-950 bg-white shadow-md">
                <input
                  type="text"
                  placeholder="Tulis pesanmu di sini..."
                  className="flex-1 bg-transparent outline-none text-sm"
                />
                <button className="text-blue-800 text-lg hover:scale-110 transition-transform">
                  <Send className="text-blue-800 w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
