"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Send } from "lucide-react";

interface ListChatResponse {
  id: string;
  name: string;
  image: string;
}

interface MessageResponse {
  message: string;
  time: string;
  date: string;
  sender_type: string;
}

interface GroupedMessageResponse {
  date: string;
  messages: MessageResponse[];
}

export default function ManageReportContent() {
  const [messageText, setMessageText] = useState("");
  const [chatList, setChatList] = useState<ListChatResponse[]>([]);
  const [selectedChat, setSelectedChat] = useState<ListChatResponse | null>(
    null
  );
  const [groupedMessages, setGroupedMessages] = useState<
    GroupedMessageResponse[]
  >([]);

  // Fetch daftar chat
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          "https://pintu-sewa.up.railway.app/api/chat/admin/get-roomchat"
        );
        setChatList(response.data.output_schema);
      } catch (error) {
        console.error("Gagal mengambil daftar room chat:", error);
      }
    };

    fetchChats();
  }, []);

  // Auto fetch isi chat tiap 1 detik
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://pintu-sewa.up.railway.app/api/chat/view-roomchat/${selectedChat.id}`
        );
        setGroupedMessages(response.data.output_schema);
      } catch (error) {
        console.error("Gagal mengambil isi chat:", error);
      }
    };

    // fetch langsung saat pilih chat
    fetchMessages();

    const interval = setInterval(fetchMessages, 1000); // setiap 1 detik

    return () => clearInterval(interval); // cleanup saat ganti chat
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      await axios.post("https://pintu-sewa.up.railway.app/api/chat/send-message", {
        room_chat_id: selectedChat?.id,
        message: messageText,
        sender_type: "shop",
      });

      setMessageText(""); // reset input setelah kirim
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  };

  return (
    <div className="h-svh flex flex-col w-full overflow-hidden">
      <Toaster position="bottom-right" reverseOrder={false} />
      <main className="flex flex-col flex-1 p-6 overflow-hidden">
        <h2 className="text-2xl font-semibold mb-6">Kelola Report</h2>

        <div className="flex flex-row w-full flex-1 overflow-hidden bg-white shadow-md rounded-xl">
          {/* === LIST CHAT === */}
          <section className="w-1/3 overflow-y-auto border-r">
            {chatList.length === 0 ? (
              <div className="p-4 text-gray-500">Tidak ada chat report</div>
            ) : (
              chatList.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full flex flex-row items-center gap-4 p-4 cursor-pointer hover:bg-blue-50 border-b ${
                    selectedChat?.id === chat.id ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                    <img
                      src={chat.image || "/placeholder.png"}
                      alt={chat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-lg font-medium">{chat.name}</p>
                </div>
              ))
            )}
          </section>

          {/* === CHAT ROOM === */}
          <section className="w-2/3 flex flex-col justify-between border-l">
            {selectedChat ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-2 p-4 border-b">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={selectedChat.image || "/placeholder.png"}
                      alt={selectedChat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xl font-semibold">{selectedChat.name}</p>
                </div>

                {/* Chat content */}
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                  {groupedMessages.length === 0 ? (
                    <div className="text-gray-400 text-center">
                      Belum ada pesan
                    </div>
                  ) : (
                    groupedMessages.map((group) => (
                      <div key={group.date}>
                        <div className="text-center text-gray-500 text-sm mb-4">
                          {group.date}
                        </div>
                        {group.messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex mb-4 ${
                              msg.sender_type === "shop"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`${
                                msg.sender_type === "shop"
                                  ? "bg-blue-800 text-white"
                                  : "bg-blue-200 text-gray-900"
                              } text-sm px-4 py-2 rounded-xl max-w-[60%]`}
                            >
                              <p>{msg.message}</p>
                              <div className="text-xs mt-1 text-right text-gray-400">
                                {msg.time}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="border-t p-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white shadow-md">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Tulis pesanmu..."
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="text-blue-800 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                Pilih chat untuk mulai melihat isi percakapan
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
