"use client";

import { useState,useEffect } from "react";
import axios from "axios";
import FormError from "@/components/layout/FormError";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface LoginResponse {
  error_schema: {
    error_code: string;
    error_message: string;
  };
}

export default function LoginForm() {
  
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const payload = {
    username : username,
    password : password
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/admin");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await axios.post<LoginResponse>(
      "https://pintu-sewa.up.railway.app/api/admin/login",
      payload
    );
    console.log(response);
    if(response.data.error_schema.error_code === "PS-00-000"){
      Cookies.set("token", response.data.output_schema , { expires: 1 });
      router.push('/admin');
    }else{
      setError(response.data.error_schema.error_message)
    };
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl px-6 py-8 sm:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        Login Admin
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <FormError message={error} />}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan username"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
}
