import React, { useState, useEffect, useRef } from "react"
import profile from "@/assets/profile.jpeg"
import {
  MessageSquare,
  ChevronUp,
  ChevronDown,
  X,
  Send,
  MoreHorizontal,
  Edit,
  Search,
  SlidersHorizontal,
  Image,
  Paperclip,
  Smile,
  Check,
} from "lucide-react"

interface ChatMessage {
  id: string
  sender: "user" | "member"
  text: string
  at: number
}

interface ChatThread {
  memberId: string
  name: string
  role: string
  avatar: string
  online: boolean
  lastSeen: string
  messages: ChatMessage[]
}

const INITIAL_THREADS: Record<string, ChatThread> = {
  m1: {
    memberId: "m1",
    name: "Budi Santoso",
    role: "Ketua Koperasi",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150",
    online: true,
    lastSeen: "Online",
    messages: [
      { id: "1", sender: "member", text: "Halo Pak Aarief, berkas pertanggungjawaban rapat tahunan kemarin sudah siap?", at: Date.now() - 3600000 * 5 },
      { id: "2", sender: "user", text: "Sudah Pak Budi, semua data transaksi POS dan kas masuk sudah terekonsiliasi digital.", at: Date.now() - 3600000 * 4.5 },
      { id: "3", sender: "member", text: "Luar biasa. Tolong upload salinannya ke folder arsip transparansi di menu Keanggotaan ya.", at: Date.now() - 3600000 * 4 },
    ],
  },
  m2: {
    memberId: "m2",
    name: "Ahmad Hidayat",
    role: "Manajer Operasional",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    online: true,
    lastSeen: "Online",
    messages: [
      { id: "1", sender: "member", text: "Mas Bambang sedang kirim logistik minyak goreng ke gerai Cibiru. Tolong dipantau.", at: Date.now() - 3600000 * 2 },
      { id: "2", sender: "user", text: "Siap Pak Ahmad, Fajar sudah stand by di gudang Cibiru untuk verifikasi masuk.", at: Date.now() - 3600000 * 1.8 },
    ],
  },
  m3: {
    memberId: "m3",
    name: "Siti Aminah",
    role: "Manajer Keuangan",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    online: false,
    lastSeen: "Aktif 10 menit lalu",
    messages: [
      { id: "1", sender: "member", text: "Pembagian SHU anggota kuartal 1 sudah selesai di-posting. Tolong dicek pembukuannya.", at: Date.now() - 3600000 * 8 },
      { id: "2", sender: "user", text: "Baik Bu Siti, nanti siang saya sinkronisasikan laporan arus kasnya.", at: Date.now() - 3600000 * 7.5 },
    ],
  },
  m4: {
    memberId: "m4",
    name: "Dewi Lestari",
    role: "Manajer Kemitraan & AI",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    online: true,
    lastSeen: "Online",
    messages: [
      { id: "1", sender: "member", text: "Sistem keanggotaan digital untuk warga grassroot sudah di-deploy. Fiturnya sangat transparan.", at: Date.now() - 3600000 * 1 },
      { id: "2", sender: "user", text: "Bagus sekali Bu Dewi. Warga jadi bisa pantau simpanan pokok dan wajib secara langsung.", at: Date.now() - 3600000 * 0.8 },
    ],
  },
  m6: {
    memberId: "m6",
    name: "Sri Wahyuni",
    role: "Kasir Gerai Sukamaju",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    online: true,
    lastSeen: "Online",
    messages: [
      { id: "1", sender: "member", text: "Setoran kas harian gerai Sukamaju sudah saya transfer ya Pak.", at: Date.now() - 3600000 * 3 },
      { id: "2", sender: "user", text: "Oke Sri, sudah saya verifikasi di jurnal kas harian.", at: Date.now() - 3600000 * 2.8 },
    ],
  },
}

export function MessagingDrawer() {
  const [expanded, setExpanded] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [threads, setThreads] = useState<Record<string, ChatThread>>(INITIAL_THREADS)
  const [inputValue, setInputValue] = useState("")
  const [typingId, setTypingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"focused" | "other">("focused")
  const [searchQuery, setSearchQuery] = useState("")

  const messageEndRef = useRef<HTMLDivElement>(null)

  // Listen to open-chat custom events from Keanggotaan detail card
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent
      const memberId = customEvent.detail.id
      const memberName = customEvent.detail.name
      const memberRole = customEvent.detail.role
      const memberAvatar = customEvent.detail.avatar

      // Initialize thread if it doesn't exist
      setThreads((prev) => {
        if (prev[memberId]) return prev
        return {
          ...prev,
          [memberId]: {
            memberId,
            name: memberName,
            role: memberRole,
            avatar: memberAvatar,
            online: true,
            lastSeen: "Online",
            messages: [],
          },
        }
      })

      setActiveChatId(memberId)
      setExpanded(true)
    }

    window.addEventListener("open-sikora-chat", handleOpenChat)
    return () => window.removeEventListener("open-sikora-chat", handleOpenChat)
  }, [])

  // Auto-scroll messages list to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeChatId, threads, typingId])

  const activeThread = activeChatId ? threads[activeChatId] : null

  // Trigger auto AI response reply
  const triggerAiResponse = (id: string, text: string) => {
    setTypingId(id)
    setTimeout(() => {
      setThreads((prev) => {
        const thread = prev[id]
        if (!thread) return prev

        let replyText = "Baik Pak, pesan Anda sudah saya terima. Sukses terus untuk KDKMP Sukamaju!"
        const lower = text.toLowerCase()

        if (id === "m1") {
          if (lower.includes("pertanggungjawaban") || lower.includes("berkas")) {
            replyText = "Siap, segera saya tandatangani berkas digitalnya sore ini. Terima kasih laporannya!"
          } else {
            replyText = "Mantap Pak Aarief, mari terus tingkatkan transparansi tata kelola koperasi kita."
          }
        } else if (id === "m2") {
          replyText = "Oke siap, tim logistik sedang memuat barang masuk. Saya pantau terus lewat dashboard."
        } else if (id === "m3") {
          replyText = "Baik, laporan rekonsiliasi kas masuk sudah masuk tabulasi pembukuan. Aman!"
        } else if (id === "m4") {
          replyText = "Bagus sekali. Rekayasa fitur keanggotaan ini membuat warga grassroot semakin percaya pada transparansi koperasi."
        } else if (id === "m6") {
          replyText = "Terima kasih Pak Aarief. Tablet POS baru sangat lancar, transaksi offline juga tersinkron otomatis."
        }

        const newMsg: ChatMessage = {
          id: String(Date.now()),
          sender: "member",
          text: replyText,
          at: Date.now(),
        }

        return {
          ...prev,
          [id]: {
            ...thread,
            messages: [...thread.messages, newMsg],
          },
        }
      })
      setTypingId(null)
    }, 1200)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeChatId || !inputValue.trim()) return

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text: inputValue.trim(),
      at: Date.now(),
    }

    setThreads((prev) => {
      const thread = prev[activeChatId]
      return {
        ...prev,
        [activeChatId]: {
          ...thread,
          messages: [...thread.messages, userMsg],
        },
      }
    })

    const textSent = inputValue.trim()
    setInputValue("")
    triggerAiResponse(activeChatId, textSent)
  }

  // Filter threads for search query
  const filteredThreads = Object.values(threads).filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed bottom-0 right-8 z-50 flex items-end gap-4 pointer-events-none select-none font-sans">
      {/* 1. CHAT POPUP WINDOW (if activeChatId is set) */}
      {activeChatId && activeThread && (
        <div className="w-80 bg-white border border-slate-200 shadow-2xl rounded-t-xl flex flex-col pointer-events-auto h-[400px]">
          {/* Header */}
          <div className="bg-white border-b border-slate-150 px-3 py-2 flex items-center justify-between rounded-t-xl shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={activeThread.avatar}
                  className="size-8.5 rounded-full object-cover border border-slate-100"
                  alt={activeThread.name}
                />
                {activeThread.online && (
                  <span className="absolute bottom-0 right-0 size-2.5 border-1.5 border-white bg-emerald-500 rounded-full" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{activeThread.name}</h4>
                <p className="text-[9.5px] font-medium text-slate-400 truncate leading-tight mt-0.5">
                  {activeThread.online ? "Online" : activeThread.lastSeen}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <button className="p-1 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors">
                <MoreHorizontal className="size-4" />
              </button>
              <button
                onClick={() => setActiveChatId(null)}
                className="p-1 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/50">
            {activeThread.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <MessageSquare className="size-8 text-slate-300" />
                <p className="text-[10.5px] font-bold text-slate-400 mt-2">Mulai obrolan baru dengan {activeThread.name}</p>
                <p className="text-[9px] text-slate-300 mt-0.5">Semua obrolan di enkripsi secara transparan.</p>
              </div>
            ) : (
              activeThread.messages.map((msg) => {
                const isUser = msg.sender === "user"
                return (
                  <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-normal shadow-sm ${
                        isUser
                          ? "bg-slate-800 text-white rounded-tr-sm"
                          : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"
                      }`}
                    >
                      <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                      <p className={`text-[8.5px] mt-1 text-right font-semibold ${isUser ? "text-white/70" : "text-slate-400"}`}>
                        {new Date(msg.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {isUser && <Check className="inline size-3 ml-1 text-blue-400 stroke-[3]" />}
                      </p>
                    </div>
                  </div>
                )
              })
            )}

            {/* Typing indicator */}
            {typingId === activeChatId && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-slate-400 shadow-sm flex items-center gap-1">
                  <span className="size-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="size-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="size-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-150 p-2 bg-white shrink-0 flex flex-col gap-1.5">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tulis pesan..."
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="size-8 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white disabled:text-slate-350 transition-colors shadow-sm shadow-blue-500/10 shrink-0"
              >
                <Send className="size-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between px-2 text-slate-400 shrink-0">
              <div className="flex items-center gap-2.5">
                <button type="button" className="hover:text-slate-600 transition-colors"><Image className="size-4" /></button>
                <button type="button" className="hover:text-slate-600 transition-colors"><Paperclip className="size-4" /></button>
                <button type="button" className="hover:text-slate-600 transition-colors"><Smile className="size-4" /></button>
              </div>
              <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-300">SIKORA Chat</span>
            </div>
          </form>
        </div>
      )}

      {/* 2. MAIN MESSAGING DRAWER (Conversation List) */}
      <div
        className={`w-72 bg-white border border-slate-200 shadow-2xl rounded-t-xl flex flex-col pointer-events-auto transition-all duration-300 ${
          expanded ? "h-[400px]" : "h-11"
        }`}
      >
        {/* Header Bar */}
        <div
          onClick={() => setExpanded(!expanded)}
          className="h-11 bg-white border-b border-slate-150 px-3.5 py-2.5 flex items-center justify-between rounded-t-xl cursor-pointer select-none shrink-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0">
              <img
                src={profile}
                className="size-6.5 rounded-full object-cover border border-slate-200"
                alt="Me"
              />
              <span className="absolute bottom-0 right-0 size-2 border border-white bg-emerald-500 rounded-full" />
            </div>
            <h4 className="text-xs font-black text-slate-800 tracking-tight">Messaging</h4>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <button className="p-1 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors"><MoreHorizontal className="size-3.5" /></button>
            <button className="p-1 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors"><Edit className="size-3.5" /></button>
            {expanded ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
          </div>
        </div>

        {/* Messaging Body */}
        {expanded && (
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Tab view selectors */}
            <div className="flex border-b border-slate-100 shrink-0 text-center text-xs font-bold text-slate-400">
              <button
                onClick={() => setActiveTab("focused")}
                className={`flex-1 py-2 border-b-2 transition-all ${
                  activeTab === "focused" ? "border-emerald-600 text-emerald-700" : "border-transparent hover:text-slate-600"
                }`}
              >
                Focused
              </button>
              <button
                onClick={() => setActiveTab("other")}
                className={`flex-1 py-2 border-b-2 transition-all ${
                  activeTab === "other" ? "border-emerald-600 text-emerald-700" : "border-transparent hover:text-slate-600"
                }`}
              >
                Other
              </button>
            </div>

            {/* Search Input bar */}
            <div className="p-2 border-b border-slate-50 shrink-0 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pesan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1 text-[11px] font-semibold text-slate-750 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
              <button className="p-1 rounded-lg border border-slate-250 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all shrink-0">
                <SlidersHorizontal className="size-3.5" />
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filteredThreads.length === 0 ? (
                <p className="text-center py-10 text-[10px] text-slate-400 font-bold">Tidak ada pesan ditemukan.</p>
              ) : (
                filteredThreads.map((thread) => {
                  const lastMsg = thread.messages[thread.messages.length - 1]
                  const active = activeChatId === thread.memberId
                  return (
                    <div
                      key={thread.memberId}
                      onClick={() => {
                        setActiveChatId(thread.memberId)
                        setExpanded(true)
                      }}
                      className={`flex gap-3 px-3 py-2.5 cursor-pointer hover:bg-slate-50/70 transition-colors ${
                        active ? "bg-slate-50" : ""
                      }`}
                    >
                      <div className="relative shrink-0 mt-0.5">
                        <img
                          src={thread.avatar}
                          className="size-9.5 rounded-full object-cover border border-slate-100"
                          alt={thread.name}
                        />
                        {thread.online && (
                          <span className="absolute bottom-0 right-0 size-2.5 border-1.5 border-white bg-emerald-500 rounded-full" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-baseline">
                          <h5 className="text-[11px] font-bold text-slate-800 truncate leading-none">{thread.name}</h5>
                          <span className="text-[9px] text-slate-400 font-semibold leading-none">
                            {lastMsg ? new Date(lastMsg.at).toLocaleDateString([], { month: "short", day: "numeric" }) : ""}
                          </span>
                        </div>
                        <p className="text-[9.5px] font-semibold text-slate-400 truncate leading-tight mt-0.5">{thread.role}</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate mt-1 leading-snug">
                          {lastMsg ? (lastMsg.sender === "user" ? "You: " : "") + lastMsg.text : "Belum ada pesan."}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
