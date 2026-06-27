import { useRef, useState } from "react"
import { Send, Sparkles } from "lucide-react"
import aiBot from "@/assets/ai-bot.png"
import profile from "@/assets/profile.jpeg"
import { AnimatePresence, motion } from "framer-motion"
import { useSikoraStore } from "@/store/useSikoraStore"
import { answer, SUGGESTIONS } from "@/lib/assistant"
import { cn } from "@/lib/utils"

interface Msg {
  role: "user" | "ai"
  text: string
}

/** Render **bold** and line breaks from the scripted answers. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block min-h-[2px]">
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            ),
          )}
        </span>
      ))}
    </>
  )
}

export function AssistantPanel({ className }: { className?: string }) {
  const coop = useSikoraStore((s) => s.coop)
  const products = useSikoraStore((s) => s.products)
  const transactions = useSikoraStore((s) => s.transactions)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  function ask(question: string) {
    const q = question.trim()
    if (!q || isTyping) return
    
    // Add user message and set typing state
    setMessages((m) => [...m, { role: "user", text: q }])
    setInput("")
    setIsTyping(true)
    
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    })

    // Simulate thinking delay
    setTimeout(() => {
      const reply = answer(q, { coop, products, transactions })
      setMessages((m) => [...m, { role: "ai", text: reply }])
      setIsTyping(false)
      
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
      })
    }, 750)
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-blue-50 to-white shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-800">SIKORA AI</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
            <Sparkles className="size-3" /> AI
          </span>
        </div>
        <img src={aiBot} alt="SIKORA AI" className="h-24 w-auto object-contain drop-shadow-md" />
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 && !isTyping ? (
          <div>
            <p className="text-sm font-medium text-slate-700">Halo Admin! 👋</p>
            <p className="text-sm text-slate-500">Saya siap membantu Anda hari ini.</p>
            <div className="mt-4 space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  disabled={isTyping}
                  className="flex w-full items-center justify-between gap-2 rounded-xl bg-white/80 px-3.5 py-2.5 text-left text-sm text-slate-600 shadow-sm ring-1 ring-slate-100 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-50"
                >
                  {s}
                  <Sparkles className="size-3.5 shrink-0 text-violet-400" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex items-end gap-2", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "user" && (
                    <img
                      src={profile}
                      alt="Admin Koperasi"
                      className="size-6 shrink-0 rounded-full object-cover ring-1 ring-slate-200 order-last"
                    />
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white text-slate-700 ring-1 ring-slate-100",
                    )}
                  >
                    <RichText text={m.text} />
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-slate-700 ring-1 ring-slate-100 max-w-[88%] rounded-2xl px-4 py-3 shadow-sm flex items-center gap-1 min-h-[36px]">
                    <span className="size-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="size-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="size-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
        className="flex items-center gap-2 border-t border-white/60 bg-white/40 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          placeholder={isTyping ? "SIKORA AI sedang berpikir..." : "Ketik pertanyaan..."}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-primary disabled:bg-slate-50/50 disabled:text-slate-400"
        />
        <button
          type="submit"
          disabled={isTyping}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}
