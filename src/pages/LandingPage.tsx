import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Check,
  ChevronDown,
  WifiOff,
  Menu,
  X
} from "lucide-react"

// Import SIKORA assets and components
import logoInvert from "@/assets/logo_invert.png"
import onlyLogo from "@/assets/only_logo.png"
import heroVideo from "@/assets/Video_hero.mp4"
import footerVideo from "@/assets/Video_footer.mp4"
import nirmatechLogo from "@/assets/nirmatech_logo.png"
import nirmatechIcon from "@/assets/N_Logo.jpeg"
import testiBandung from "@/assets/testimonial_bandung.jpg"
import testiMalang from "@/assets/testimonial_malang.jpg"
import testiMedan from "@/assets/testimonial_medan.jpg"
import { OperationsMap } from "@/components/shared/OperationsMap"
import { CountUp } from "@/components/shared/CountUp"

// Reusable Scroll Reveal Wrapper
function Reveal({ 
  children, 
  direction = "up", 
  delay = 0 
}: { 
  children: React.ReactNode
  direction?: "up" | "left" | "right"
  delay?: number 
}) {
  const xOffset = direction === "left" ? -40 : direction === "right" ? 40 : 0
  const yOffset = direction === "up" ? 40 : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset, y: yOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

// Reusable Badge Component (Saudara-style)
function SaudaraBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-gradient-to-b from-white to-slate-50 border border-blue-500/10 rounded-full px-3.5 py-[6px] shadow-[0_0_8px_rgba(37,99,235,0.04),0_0_0_1px_rgba(37,99,235,0.02),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_0_12px_rgba(37,99,235,0.1),0_0_0_1px_rgba(37,99,235,0.06)] transition-all duration-300 ease-out active:scale-[0.97] cursor-pointer">
      <span className="text-[11px] text-slate-500 font-sans tracking-wide">Backed by</span>
      <div className="w-[18px] h-[18px] rounded-xs flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src={nirmatechIcon} alt="N" className="w-full h-full object-cover" />
      </div>
      <span className="text-[11px] font-semibold text-slate-800 font-sans tracking-wide">{text}</span>
    </div>
  )
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number[]>([])
  const [scrollProgress, setScrollProgress] = useState(0)

  // Track page scroll relative to timeline viewport to animate timeline progress line
  useEffect(() => {
    const handleScroll = () => {
      const timelineEl = document.getElementById("cara-kerja")
      if (timelineEl) {
        const rect = timelineEl.getBoundingClientRect()
        const height = rect.height
        const triggerStart = window.innerHeight * 0.75
        const triggerEnd = window.innerHeight * 0.25
        const totalDist = height + (triggerStart - triggerEnd)
        const scrolledDist = triggerStart - rect.top
        
        let progress = scrolledDist / totalDist
        if (progress < 0) progress = 0
        if (progress > 1) progress = 1
        
        setScrollProgress(progress)
      }
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll() // Trigger on mount to check initial scroll
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  // Satgas KDKMP Master List Logos
  const PARTNER_LOGOS = [
    { name: "Kemenko Pangan", url: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Logo_Kemenko_Pangan.png" },
    { name: "Kemenkop", url: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Logo_Kementerian_Koperasi_Republik_Indonesia_%282024%29.svg" },
    { name: "Badan Gizi Nas.", url: "https://upload.wikimedia.org/wikipedia/id/2/29/Logo_Badan_Gizi_Nasional.svg" },
    { name: "Kemenkeu", url: "http://media.kemenkeu.go.id/getmedia/e49f347e-00d7-4976-a83c-b7acf3814bfd/logo-2?width=140&height=130&ext=.png" },
    { name: "Kemenkes", url: "https://upload.wikimedia.org/wikipedia/commons/d/de/Logo_of_the_Ministry_of_Health_of_the_Republic_of_Indonesia.png" },
    { name: "Kemenkumham", url: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_of_the_Ministry_of_Law_and_Human_Rights_of_the_Republic_of_Indonesia.svg" },
    { name: "Bappenas", url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Logo_Kementerian_PPN-Bappenas_%282023%29.png" },
    { name: "LKPP", url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Lambang_LKPP.svg" },
    { name: "Kemen BUMN", url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_Ministry_of_State_Owned_Enterprises_of_the_Republic_of_Indonesia.svg" },
    { name: "Danantara", url: "https://upload.wikimedia.org/wikipedia/commons/9/90/Danantara_Indonesia_%28no_SW%29.svg" }
  ]

  return (
    <div 
      className="min-h-screen bg-slate-50/40 overflow-x-hidden font-sans antialiased relative"
      style={{ color: "oklch(0.21 0.03 256)" }}
    >
      
      {/* Decorative Blur Gradients */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[80%] max-w-6xl h-[600px] bg-gradient-to-br from-blue-100/30 via-indigo-50/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-[1200px] right-[-200px] w-[500px] h-[500px] bg-blue-50/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      {/* --- 1. FLOATING CAPSULE HEADER --- */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out rounded-full h-14 w-[90%] sm:w-[85%] max-w-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-slate-900/5">
        <div className="mx-auto h-full px-6">
          <nav className="flex items-center justify-between h-full gap-4 sm:gap-12">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-2">
              <img src={logoInvert} alt="SIKORA" className="h-7 object-contain" />
              <span className="text-[8px] bg-blue-50 text-[var(--primary)] border border-blue-100 px-1.5 py-0.5 rounded-full font-bold uppercase hidden xs:inline tracking-wider">AI DSS</span>
            </div>

            {/* Navigation links */}
            <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
              <a href="#fitur" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors tracking-wide">Fitur Utama</a>
              <a href="#cara-kerja" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors tracking-wide">Alur Kerja</a>
              <a href="#faq" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors tracking-wide">FAQ</a>
            </div>

            <div className="hidden md:flex items-center">
              <Link 
                to="/dashboard" 
                className="btn-glow inline-flex items-center justify-center whitespace-nowrap text-xs font-bold h-9 px-5 rounded-full bg-slate-900 hover:bg-slate-850 text-white shadow-sm transition-all"
              >
                Masuk Demo
              </Link>
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-full h-9 w-9 bg-white border border-slate-200 text-slate-700 shadow-sm"
              >
                {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 md:hidden flex flex-col p-6 gap-6 justify-start items-center">
          <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-slate-655 hover:text-slate-900">Fitur Utama</a>
          <a href="#cara-kerja" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-slate-655 hover:text-slate-900">Alur Kerja</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-slate-655 hover:text-slate-900">FAQ</a>
          <Link 
            to="/dashboard" 
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm"
          >
            Masuk Aplikasi Demo
          </Link>
        </div>
      )}

      {/* --- 2. HERO SECTION (ARMOR STYLE: FULLY CENTERED WITH FLOATING MAP BELOW) --- */}
      <section className="relative px-4 pt-28 md:pt-36 pb-12 overflow-hidden">
        {/* Background Video Underlay */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none -z-10"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        
        {/* Centered Hero Wrapper */}
        <div className="flex flex-col items-center text-center justify-center max-w-5xl mx-auto relative z-10">
          
          <div className="flex justify-center mb-6">
            <SaudaraBadge text="Nirmatech" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-[3.25rem] lg:text-[3.75rem] mb-6 leading-[1.12] tracking-tight font-serif max-w-3xl text-slate-900">
            <span className="font-normal">Keputusan Operasional</span><br />
            <span className="font-normal">Koperasi Lebih Cerdas.</span><br />
            <span className="font-sans italic text-[0.88em] font-semibold" style={{ color: "var(--primary)" }}>From Data to Decision.</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base mb-8 max-w-2xl mx-auto leading-relaxed font-sans font-medium text-slate-500">
            Sinergi Koperasi Raya (SIKORA) merevolusi pengelolaan koperasi desa (KDKMP). Sinkronisasikan data Simkopdes Anda, biarkan AI Engine memprediksi ketersediaan stok, restock otomatis, dan mengelola pengadaan real-time.
          </p>

          {/* CTA Buttons Side-By-Side Centered */}
          <div className="flex flex-col sm:flex-row items-center gap-5 justify-center w-full">
            <Link 
              to="/dashboard" 
              className="btn-glow inline-flex w-full sm:w-auto items-center justify-center whitespace-nowrap bg-slate-900 hover:bg-slate-850 text-white rounded-full px-8 h-11 text-xs sm:text-sm font-bold tracking-wide transition-colors cursor-pointer"
            >
              Masuk Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>

            <a 
              href="#cara-kerja" 
              className="inline-flex items-center justify-center whitespace-nowrap border border-slate-350 hover:bg-slate-50 bg-white text-slate-655 rounded-full px-6 h-11 text-xs sm:text-sm font-bold tracking-wide transition-colors"
            >
              Pelajari Alur Kerja
            </a>
          </div>

          {/* Large Center Floating Map (Cockpit/Armor View style) */}
          <div className="w-full max-w-4xl mt-14 animate-float">
            <Reveal>
              <div className="glossy-glass rounded-3xl p-4 sm:p-5 border border-white/40 shadow-2xl relative bg-white/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--primary)" }}></div>
                    <span className="text-[10px] font-bold font-sans tracking-wide uppercase">PETA MONITORING KOPERASI NASIONAL</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-red-100/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    LIVE • Real-time Data
                  </div>
                </div>
                
                {/* Embedded actual map container */}
                <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900 shadow-inner">
                  <OperationsMap className="h-[360px] sm:h-[420px] w-full" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- 3. HORIZONTAL SCROLLING BRAND PARTNERS MARQUEE --- */}
      <section className="py-6 border-t border-b border-slate-200/50 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-6 md:gap-12 relative">
          
          <div className="shrink-0 bg-white z-10 pr-6 border-r border-slate-200/60 hidden md:block">
            <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Diintegrasikan dengan</p>
          </div>
          
          <div className="flex-1 overflow-hidden relative w-full">
            {/* Gradient masks for smooth scrolling edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex items-center animate-infinite-scroll whitespace-nowrap" style={{ width: "max-content" }}>
              {/* Partner Logos from Satgas KDKMP direct URLs */}
              {PARTNER_LOGOS.map((logo, idx) => (
                <div key={idx} className="inline-flex items-center px-8 shrink-0">
                  <img 
                    src={logo.url} 
                    alt={logo.name} 
                    className="h-8 max-w-[130px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0 shrink-0" 
                  />
                </div>
              ))}
              {/* Duplicate list to loop smoothly */}
              {PARTNER_LOGOS.map((logo, idx) => (
                <div key={`dup-${idx}`} className="inline-flex items-center px-8 shrink-0">
                  <img 
                    src={logo.url} 
                    alt={logo.name} 
                    className="h-8 max-w-[130px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0 shrink-0" 
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* --- 4. TIMELINE "CARA KERJA SIKORA" (How it Works) --- */}
      <section id="cara-kerja" className="py-16 md:py-24 bg-white relative">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto px-4 mb-14 text-center flex flex-col items-center">
          <Reveal>
            <h2 className="text-2xl sm:text-4xl font-serif mb-3 tracking-tight" style={{ color: "oklch(0.21 0.03 256)" }}>
              Bagaimana <span className="font-sans italic font-semibold" style={{ color: "var(--primary)" }}>SIKORA</span> Bekerja
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans font-medium max-w-md">
              Penyatuan analitik AI, kasir offline-first, dan rantai pasok dalam alur kerja sederhana bagi pengurus koperasi pedesaan.
            </p>
          </Reveal>
        </div>

        {/* Timeline body wrapper */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          
          {/* Scroll-Progress Timeline Line */}
          <div className="absolute left-8 top-12 bottom-12 w-px bg-slate-100 md:left-1/2 md:transform md:-translate-x-1/2">
            <div 
              className="absolute top-0 w-full origin-top transition-all duration-100"
              style={{ height: "100%", transform: `scaleY(${scrollProgress})`, backgroundColor: "var(--primary)" }}
            ></div>
          </div>

          {/* Step 1: Sinkronisasi Simkopdes */}
          <TimelineStep 
            number="01"
            timeTag="5 MENIT"
            title="Sinkronisasi Simkopdes Instan"
            description="Tarik data profil koperasi, data gerai, dan data awal anggota langsung dari sistem Simkopdes nasional secara aman. Tidak perlu input manual ulang untuk mendaftarkan aset gerai koperasi."
            align="right"
          >
            <div className="rounded-lg bg-white p-4 border border-slate-200 shadow-xs text-[10px] space-y-2.5 font-mono text-slate-655">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="font-bold text-slate-800">API Connection: Simkopdes</span>
                <span className="font-bold" style={{ color: "var(--primary)" }}>CONNECTED</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3" style={{ color: "var(--primary)" }} />
                  <span>Verifikasi Nomor Induk Berusaha (NIB)... Sukses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3" style={{ color: "var(--primary)" }} />
                  <span>Kategori: Ritel Konsumsi & Sembako... Sukses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3" style={{ color: "var(--primary)" }} />
                  <span>Sinkronisasi 150 Data Anggota... Sukses</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full w-full rounded-full" style={{ backgroundColor: "var(--primary)" }}></div>
              </div>
              <div className="text-[9px] text-slate-400 text-center font-sans">Proses sinkronisasi selesai 100% secara aman</div>
            </div>
          </TimelineStep>

          {/* Step 2: AI DSS Analisis & Pencarian Supplier */}
          <TimelineStep 
            number="02"
            timeTag="24 JAM"
            title="Pencarian Pemasok & Bulog Otomatis"
            description="Asisten AI SIKORA memindai jaringan Bulog, distributor sembako regional, dan produsen tani lokal secara instan — memverifikasi perizinan, riwayat pengiriman tepat waktu, serta menyusun draf dokumen perjanjian kerja sama."
            align="left"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] text-slate-500 border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1">
                  <svg className="w-2.5 h-2.5 text-[#DE7356] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Pemindaian rantai pasok lokal
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-2.5 h-2.5 text-[#DE7356] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Verifikasi sertifikat Bulog
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-2.5 h-2.5 text-[#DE7356] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  Riwayat pengiriman real-time
                </span>
              </div>
              <div className="mask-b-from-50 -mx-4 -mb-4 px-4 pt-2 bg-slate-50/50 rounded-b-2xl border-t border-slate-100 relative">
                <div className="mt-2 overflow-hidden h-[180px] relative w-full flex items-center justify-center">
                  <div className="grid [grid-template-areas:'stack'] h-[150px] w-full place-items-center">
                    {/* Card 1: KUD Tani Makmur */}
                    <div className="relative flex h-28 w-[19rem] -skew-y-[6deg] select-none flex-col justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 transition-all duration-500 group-hover:shadow-md hover:border-slate-300 hover:bg-slate-50 grayscale-[100%] hover:grayscale-0 [&>*]:flex [&>*]:items-center [&>*]:gap-2 [grid-area:stack] -translate-y-4 hover:-translate-y-12">
                      <div className="flex items-center gap-2">
                        <span className="relative inline-block rounded-full p-1 bg-orange-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3 text-white"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
                        </span>
                        <p className="text-xs font-bold text-orange-500">KUD Tani Makmur</p>
                      </div>
                      <p className="whitespace-nowrap text-xs text-slate-800 font-bold">Beras Cianjur & Palawija • 95% Tepat Waktu</p>
                      <p className="text-slate-500 text-[10px]">140 pengiriman selesai • Cianjur</p>
                    </div>
                    
                    {/* Card 2: PT Sembako Utama */}
                    <div className="relative flex h-28 w-[19rem] -skew-y-[6deg] select-none flex-col justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 transition-all duration-500 group-hover:shadow-md hover:border-slate-300 hover:bg-slate-50 grayscale-[100%] hover:grayscale-0 [&>*]:flex [&>*]:items-center [&>*]:gap-2 [grid-area:stack] translate-x-4 translate-y-2 hover:-translate-y-6">
                      <div className="flex items-center gap-2">
                        <span className="relative inline-block rounded-full p-1 bg-slate-900">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3 text-white"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
                        </span>
                        <p className="text-xs font-bold text-orange-500">PT Sembako Utama</p>
                      </div>
                      <p className="whitespace-nowrap text-xs text-slate-800 font-bold">Minyak & Gula Pasir • 89% Tepat Waktu</p>
                      <p className="text-slate-500 text-[10px]">87 pengiriman selesai • Bandung</p>
                    </div>
                    
                    {/* Card 3: Bulog Divre Jabar */}
                    <div className="relative flex h-28 w-[19rem] -skew-y-[6deg] select-none flex-col justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 transition-all duration-500 group-hover:shadow-md hover:border-slate-300 hover:bg-slate-50 grayscale-[100%] hover:grayscale-0 [&>*]:flex [&>*]:items-center [&>*]:gap-2 [grid-area:stack] translate-x-8 translate-y-8 hover:-translate-y-2">
                      <div className="flex items-center gap-2">
                        <span className="relative inline-block rounded-full p-1 bg-slate-900">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3 text-white"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
                        </span>
                        <p className="text-xs font-bold text-orange-500">Bulog Divre Jabar</p>
                      </div>
                      <p className="whitespace-nowrap text-xs text-slate-800 font-bold">Beras SPHP Stabilisasi • 98% Tepat Waktu</p>
                      <p className="text-slate-500 text-[10px]">412 pengiriman selesai • Bandung</p>
                    </div>
                  </div>
                </div>
                {/* Smooth fade-out overlays to prevent sharp boundary cutoff */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50/90 to-transparent pointer-events-none z-10"></div>
                <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-slate-50/90 to-transparent pointer-events-none z-10"></div>
              </div>
            </div>
          </TimelineStep>

          {/* Step 3: Pembuatan Smart-PO via Chatbot */}
          <TimelineStep 
            number="03"
            timeTag="5 MENIT"
            title="Konsultasi & Buat PO via Chatbot AI"
            description="Ketik kebutuhan persediaan koperasi Anda dalam bahasa sehari-hari. Chatbot AI SIKORA akan menafsirkan spesifikasi, memverifikasi ketersediaan stok, dan langsung menyiapkan draf purchase order secara otomatis."
            align="right"
          >
            <div className="mask-b-from-50 -mx-4 -mb-4 px-4 pt-2 group">
              <div className="rounded-xl bg-slate-50 border border-slate-200 mt-2 p-3 pb-4 transition-transform duration-300 group-hover:translate-y-0 translate-y-2 shadow-xs" aria-hidden="true">
                <div className="w-fit flex items-center gap-1 text-[10px] font-bold text-[var(--primary)] mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="size-3.5 fill-blue-500/20 stroke-[var(--primary)]"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
                  SIKORA AI Assistant
                </div>
                <p className="text-[11px] text-slate-800 leading-normal font-medium bg-white p-2 rounded-lg border border-slate-100 shadow-3xs mb-3">
                  "Saya butuh restok beras premium 2 ton dan minyak goreng Kita 500 liter untuk gerai KUD Karangploso."
                </p>
                
                <div className="bg-slate-100/80 -mx-3 -mb-4 mt-2 space-y-2 rounded-b-xl p-2.5 border-t border-slate-200/50">
                  <div className="text-slate-400 text-[9px] font-sans">Ketik permintaan barang atau unggah draf...</div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1.5">
                      <button className="flex items-center justify-center bg-white border border-slate-200 size-6.5 rounded-full shadow-3xs text-slate-500 hover:bg-slate-50 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="size-3.5"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                      </button>
                      <button className="flex items-center justify-center bg-white border border-slate-200 size-6.5 rounded-full shadow-3xs text-slate-500 hover:bg-slate-50 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="size-3.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                      </button>
                    </div>
                    <button className="flex items-center justify-center bg-slate-900 text-white size-6.5 rounded-full shadow-md hover:bg-slate-800 cursor-pointer border-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" className="size-3.5"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TimelineStep>

          {/* Step 4: Kasir POS Offline-First */}
          <TimelineStep 
            number="04"
            timeTag="1 DETIK"
            title="Transaksi POS Offline-First"
            description="Kasir tetap berjalan mencatatkan penjualan sembako meskipun koneksi internet desa terputus total. Poin loyalitas dan promo diskon anggota dihitung secara luring, lalu disinkronkan otomatis saat online."
            align="left"
          >
            <div className="rounded-lg bg-white p-4 border border-slate-200 shadow-xs text-[10px] space-y-3 font-sans text-slate-655">
              <div className="flex justify-between items-center bg-amber-50 border border-amber-200 p-2 rounded text-amber-700">
                <div className="flex items-center gap-1.5">
                  <WifiOff className="h-3 w-3" />
                  <span className="font-bold text-[9px]">Sinyal Putus: Mode Offline Aktif</span>
                </div>
                <span className="text-[8px] bg-amber-200/50 px-1 py-0.5 rounded">Saved Locally</span>
              </div>
              <div className="space-y-1 text-slate-500">
                <div className="flex justify-between">
                  <span>Beras Premium 5kg (x1)</span>
                  <span>Rp 67.000</span>
                </div>
                <div className="flex justify-between font-medium" style={{ color: "var(--primary)" }}>
                  <span>Diskon Anggota (Gold Tier)</span>
                  <span>-Rp 3.350</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-800">
                <span>Total Bayar</span>
                <span>Rp 63.650</span>
              </div>
            </div>
          </TimelineStep>

          {/* Step 5: Pembukuan Otomatis */}
          <TimelineStep 
            number="05"
            timeTag="INSTAN"
            title="Pembukuan derived-reporting Otomatis"
            description="Setiap transaksi POS kasir dan penerimaan PO supplier otomatis memicu perubahan pada laporan keuangan koperasi. Jurnal umum, buku besar, neraca, dan laba rugi koperasi selalu sinkron dan seimbang."
            align="right"
          >
            <div className="rounded-lg bg-white p-4 border border-slate-200 shadow-xs text-[10px] space-y-2.5 font-sans text-slate-655">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="font-bold text-slate-800">Laporan Neraca (Live Balance)</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Balanced
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Aset (Kas + Stok)</span>
                  <span className="font-bold text-slate-800">Rp 124.500.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Kewajiban (Utang Dagang)</span>
                  <span className="font-bold text-slate-800">Rp 45.000.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Ekuitas (Modal Awal + Laba)</span>
                  <span className="font-bold text-slate-800">Rp 79.500.000</span>
                </div>
              </div>
              <div className="text-[8px] text-slate-400 text-center font-mono">Formula: Aset = Liabilitas + Ekuitas (Terderivasi Otomatis)</div>
            </div>
          </TimelineStep>

        </div>
      </section>

      {/* --- 4.3 CREATIVE FEATURES DISPLAY (Saudara.ai Style) --- */}
      <section id="features" className="py-16 md:py-24 bg-white relative z-10 border-t border-slate-100">
        <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
          
          {/* Header */}
          <div className="text-center mb-12">
            <Reveal>
              <h2 className="text-2xl sm:text-4xl font-serif text-slate-900 mb-3 tracking-tight">
                Teknologi <span className="font-sans italic font-semibold" style={{ color: "var(--primary)" }}>AI Pintar</span> untuk Koperasi Anda
              </h2>
              <p className="text-sm md:text-base font-sans text-slate-500 max-w-xl mx-auto leading-relaxed">
                Kami menyediakan asisten digital, sistem pelacakan otomatis, dan jaminan pembukuan yang andal di gerai koperasi Anda.
              </p>
            </Reveal>
          </div>

          {/* Large Card: Smart Supplier Matching */}
          <Reveal>
            <div className="text-card-foreground shadow-sm overflow-hidden p-6 md:p-8 border border-slate-200 bg-white hover:shadow-lg transition-shadow duration-300 rounded-[32px] flex flex-col md:flex-row gap-8 min-h-[480px]">
              <div className="w-full md:w-80 flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--primary)] mb-2">Automated Procurement</span>
                <h3 className="text-slate-900 text-xl md:text-2xl font-bold font-serif mb-4 leading-tight">Pencarian Pemasok Cerdas</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed">
                  Asisten AI SIKORA memindai ratusan rantai pasok lokal dan distributor pangan nasional — memverifikasi sertifikat halal, legalitas hukum, memantau riwayat pengiriman tepat waktu, serta memberikan rekomendasi restock harga terbaik.
                </p>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full scale-90 sm:scale-100">
                  <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 w-full max-w-2xl shadow-sm">
                    {/* Mock Chat Header */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <img src={onlyLogo} alt="SIKORA" className="w-4.5 h-4.5 object-contain" />
                        <span className="text-xs font-bold text-slate-800">SIKORA AI Assistant</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    {/* Mock Chat Body */}
                    <div className="p-4 space-y-3">
                      <div className="flex justify-end">
                        <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tr-md p-2.5 max-w-xs text-xs font-medium">
                          <p>Butuh restok beras premium 2 ton dan minyak goreng Kita 500 liter untuk KUD Karangploso.</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-start">
                        <div className="bg-blue-50/50 text-slate-800 border border-blue-100/60 rounded-2xl rounded-bl-md p-3.5 w-full">
                          <p className="text-xs font-bold text-[var(--primary)] mb-2.5">Menemukan 3 pemasok yang cocok:</p>
                          
                          <div className="space-y-2">
                            {/* Match 1 */}
                            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900">KUD Tani Makmur</span>
                                  <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">95% Tepat Waktu</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">Beras Cianjur & Palawija • Cianjur</p>
                                <p className="text-[9px] text-slate-400">140 pengiriman • Est. Rp 13.200/kg</p>
                              </div>
                              <button className="rounded-full font-bold text-[10px] bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 cursor-pointer border-0">Buat PO</button>
                            </div>

                            {/* Match 2 */}
                            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900">PT Sembako Utama</span>
                                  <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">89% Tepat Waktu</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">Minyak & Gula Pasir • Bandung</p>
                                <p className="text-[9px] text-slate-400">87 pengiriman • Est. Rp 14.500/L</p>
                              </div>
                              <button className="rounded-full font-bold text-[10px] bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 cursor-pointer border-0">Buat PO</button>
                            </div>

                            {/* Match 3 */}
                            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900">Bulog Divre Jabar</span>
                                  <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">98% Tepat Waktu</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">Beras SPHP Stabilisasi • Bandung</p>
                                <p className="text-[9px] text-slate-400">412 pengiriman • Est. Rp 12.500/kg</p>
                              </div>
                              <button className="rounded-full font-bold text-[10px] bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 cursor-pointer border-0">Buat PO</button>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mock Chat Footer */}
                    <div className="p-3 pt-0">
                      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <input type="text" placeholder="Tanyakan seputar pemasok..." className="flex-1 bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 px-1" readOnly />
                        <button className="flex items-center justify-center rounded-full text-white size-6.5 bg-orange-500 hover:bg-orange-600 cursor-pointer border-0">
                          <svg xmlns="http://www.w3.org/2050/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
                        </button>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bottom Row Grid: Tracking, Network, QC */}
          <div className="mt-6 flex flex-col md:flex-row items-stretch gap-6 w-full">
            
            {/* Card 1: Production Tracking */}
            <Reveal delay={0.1}>
              <div className="text-card-foreground shadow-sm group w-full md:flex-1 rounded-3xl overflow-hidden min-h-[300px] border border-slate-200 bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between p-6">
                <div>
                  <h3 className="text-slate-900 text-base font-bold font-serif mb-2 leading-tight">Pelacakan Transaksi Real-Time</h3>
                  <p className="text-slate-500 text-xs font-sans leading-relaxed">
                    Sistem memantau penjualan harian gerai secara terpusat. Dapatkan statistik performa secara real-time dan peringatan dini jika terjadi lonjakan permintaan sembako.
                  </p>
                </div>
                
                <div className="bg-slate-50 border-t border-slate-100 -mx-6 -mb-6 h-[160px] flex items-center justify-center relative overflow-hidden">
                  <div className="w-full scale-90">
                    <div aria-hidden="true" className="relative h-24 flex items-center justify-center">
                      <div className="rounded-xl border text-card-foreground shadow-sm aspect-video w-4/5 p-3 bg-white border-slate-200">
                        <div className="mb-2 flex items-center gap-1.5">
                          <div className="bg-blue-600 w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-2.5 text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                          </div>
                          <span className="text-slate-700 text-[11px] font-bold">5 Gerai Aktif</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="bg-emerald-100 h-2 rounded-full w-4/5"></div>
                          <div className="bg-amber-100 h-2 w-3/5 rounded-full"></div>
                          <div className="bg-blue-100 h-2 w-1/2 rounded-full"></div>
                        </div>
                        <div className="mt-2 text-[9px] text-slate-400 font-medium">Performa Transaksi Wilayah</div>
                      </div>
                      
                      <div className="rounded-xl border text-card-foreground shadow-sm absolute -top-3 right-4 flex w-10 h-10 bg-white border-slate-200">
                        <div className="bg-emerald-50 m-auto flex w-6.5 h-6.5 rounded-full border border-emerald-100">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-emerald-600 m-auto size-3"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 2: Network-Powered Intelligence */}
            <Reveal delay={0.2}>
              <div className="text-card-foreground shadow-sm group w-full md:flex-1 rounded-3xl overflow-hidden min-h-[300px] border border-slate-200 bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between p-6">
                <div>
                  <h3 className="text-slate-900 text-base font-bold font-serif mb-2 leading-tight">Kecerdasan Logistik Kolektif</h3>
                  <p className="text-slate-500 text-xs font-sans leading-relaxed">
                    Setiap transaksi POS kasir memperkaya data prediksi logistik nasional. Koperasi Anda mendapatkan manfaat wawasan harga pasar terupdate secara kolektif.
                  </p>
                </div>
                
                <div className="bg-slate-50 border-t border-slate-100 -mx-6 -mb-6 h-[160px] flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-[110px]" viewBox="0 0 380 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <defs>
                      <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1" />
                      </pattern>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="380" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <line x1="0" y1="30" x2="380" y2="30" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="60" x2="380" y2="60" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="90" x2="380" y2="90" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="1" strokeDasharray="4 4" />
                    <rect x="25" y="85" width="10" height="30" rx="3" fill="url(#barGrad)" />
                    <rect x="65" y="75" width="10" height="40" rx="3" fill="url(#barGrad)" />
                    <rect x="105" y="60" width="10" height="55" rx="3" fill="url(#barGrad)" />
                    <rect x="145" y="68" width="10" height="47" rx="3" fill="url(#barGrad)" />
                    <rect x="185" y="45" width="10" height="70" rx="3" fill="url(#barGrad)" />
                    <rect x="225" y="55" width="10" height="60" rx="3" fill="url(#barGrad)" />
                    <rect x="265" y="30" width="10" height="85" rx="3" fill="url(#barGrad)" />
                    <rect x="305" y="40" width="10" height="75" rx="3" fill="url(#barGrad)" />
                    <rect x="345" y="20" width="10" height="95" rx="3" fill="url(#barGrad)" />
                    <path d="M 10 95 C 45 92, 55 70, 95 68 C 135 66, 145 40, 185 38 C 225 36, 235 22, 275 20 C 315 18, 335 12, 370 10" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 10 95 C 45 92, 55 70, 95 68 C 135 66, 145 40, 185 38 C 225 36, 235 22, 275 20 C 315 18, 335 12, 370 10 V 115 H 10 Z" fill="url(#areaGrad)" />
                    <circle cx="95" cy="68" r="4" fill="#6366f1" stroke="white" strokeWidth="1.5" />
                    <circle cx="185" cy="38" r="4" fill="#6366f1" stroke="white" strokeWidth="1.5" />
                    <circle cx="275" cy="20" r="4" fill="#ec4899" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </Reveal>

            {/* Card 3: Quality Guarantee */}
            <Reveal delay={0.3}>
              <div className="text-card-foreground shadow-sm group w-full md:flex-1 rounded-3xl overflow-hidden min-h-[300px] border border-slate-200 bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between p-6">
                <div>
                  <h3 className="text-slate-900 text-base font-bold font-serif mb-2 leading-tight">Verifikasi Pembukuan 3 Tahap</h3>
                  <p className="text-slate-500 text-xs font-sans leading-relaxed">
                    Kami menjamin kepatuhan akuntansi koperasi Anda. Jurnal umum, buku besar, neraca, dan laporan derived-reporting diverifikasi berlapis secara otomatis.
                  </p>
                </div>
                
                <div className="bg-slate-50 border-t border-slate-100 -mx-6 -mb-6 h-[160px] flex items-center justify-center relative overflow-hidden">
                  <div className="w-full scale-90">
                    <div className="rounded-xl border text-card-foreground shadow-sm p-3 bg-white border-slate-200">
                      <div className="w-fit flex items-center gap-1.5 mb-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 fill-blue-500/20 stroke-[var(--primary)]"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
                        <p className="text-[10px] font-bold text-slate-700">Verifikasi Jurnal Aktif</p>
                      </div>
                      
                      <div className="bg-slate-50 -mx-1.5 -mb-1.5 p-2 rounded-lg border border-slate-200">
                        <div className="text-slate-400 text-[8px] font-sans">Status Neraca Derived</div>
                        <div className="flex gap-2 my-1.5">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span className="text-[9px] text-slate-500">Certified</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                            <span className="text-[9px] text-slate-500">In Review</span>
                          </div>
                        </div>
                        <button className="rounded-full font-bold text-[8px] bg-[var(--primary)] text-white py-1 w-full cursor-pointer border-0">Unduh Laporan</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>

        </div>
      </section>

      {/* --- 4.5 GLOSSY GLASS STATS BANNER (Placed above FAQ section) --- */}
      <section className="py-8 relative z-10 px-4 bg-slate-50/20">
        <div className="w-full max-w-4xl mx-auto">
          <Reveal>
            <div className="glossy-glass rounded-3xl p-6 sm:p-7 border border-white/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden bg-white/40 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row items-center justify-around flex-1 w-full gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60 text-center sm:text-left">
                
                {/* Stat 1 */}
                <div className="flex flex-col items-center sm:items-start w-full sm:px-6 pt-4 sm:pt-0">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "oklch(0.21 0.03 256)" }}>
                    <CountUp value={2477305} format={(n) => n.toLocaleString("id-ID")} />
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-wider">Anggota Teraktivasi</span>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col items-center sm:items-start w-full sm:px-6 pt-4 sm:pt-0">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "oklch(0.21 0.03 256)" }}>
                    <CountUp value={1487674} format={(n) => n.toLocaleString("id-ID")} />
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-wider">Anggota Laki-Laki</span>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col items-center sm:items-start w-full sm:px-6 pt-4 sm:pt-0">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "oklch(0.21 0.03 256)" }}>
                    <CountUp value={989631} format={(n) => n.toLocaleString("id-ID")} />
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-wider">Anggota Perempuan</span>
                </div>

              </div>

              {/* Stat CTA Button with .btn-glow */}
              <Link
                to="/dashboard"
                className="btn-glow shrink-0 w-full md:w-auto inline-flex items-center justify-center bg-slate-900 hover:bg-slate-850 text-white rounded-full px-6 py-3 text-xs font-bold transition-colors cursor-pointer"
              >
                Masuk Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>

            </div>
          </Reveal>
        </div>
      </section>

      {/* --- 4.7 TESTIMONIALS SECTION (Saudara.ai Style) --- */}
      <section className="py-16 md:py-24 bg-white relative z-10 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Header */}
          <div className="text-center mb-16 flex flex-col items-center">
            <Reveal>
              <h2 className="text-2xl sm:text-4xl font-serif mb-3 tracking-tight text-slate-900">
                Dipercaya oleh <span className="font-sans italic font-semibold" style={{ color: "var(--primary)" }}>Pengurus Koperasi Desa</span> Terbaik
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-md mx-auto">
                Kesaksian nyata dari para ketua, pengawas, dan pengelola gerai koperasi KDKMP di seluruh Indonesia.
              </p>
            </Reveal>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            
            {/* Card 1 */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-slate-200/85 bg-white p-4 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-all duration-300">
                <div className="space-y-4">
                  <img src={testiBandung} alt="H. Agus Setiawan" className="rounded-xl w-full aspect-video object-cover object-top" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-[var(--primary)] font-bold flex items-center justify-center shrink-0 border border-blue-100/50 text-xs">
                      AS
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">H. Agus Setiawan</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Ketua Koperasi Mitra Sejahtera, Bandung</p>
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium italic">
                    "Sejak sinkronisasi Simkopdes diaktifkan dan dipadu AI DSS SIKORA, kami tidak pernah lagi kehabisan stok beras premium. Pengadaan barang terprediksi dengan sangat akurat dan proses PO Bulog selesai dalam hitungan detik."
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Card 2 */}
            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-slate-200/85 bg-white p-4 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-all duration-300">
                <div className="space-y-4">
                  <img src={testiMalang} alt="Dewi Lestari" className="rounded-xl w-full aspect-video object-cover object-top" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 font-bold flex items-center justify-center shrink-0 border border-amber-100/50 text-xs">
                      DL
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">Dewi Lestari</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Wakil Ketua Bidang Usaha KUD Karangploso, Malang</p>
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium italic">
                    "Kasir POS Offline SIKORA benar-benar penyelamat di wilayah kami yang sering mati lampu dan kehilangan sinyal. Transaksi tetap berjalan luring di gerai sembako, dan otomatis sinkron saat internet kembali menyala."
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Card 3 */}
            <Reveal delay={0.3}>
              <div className="rounded-2xl border border-slate-200/85 bg-white p-4 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-all duration-300">
                <div className="space-y-4">
                  <img src={testiMedan} alt="Bambang Hutapea" className="rounded-xl w-full aspect-video object-cover object-top" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center shrink-0 border border-emerald-100/50 text-xs">
                      BH
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">Bambang Hutapea</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Ketua Pengawas Koperasi Mandiri Rakyat, Medan</p>
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium italic">
                    "Laporan keuangan neraca dan laba rugi derived-reporting otomatis sangat mempermudah pengawasan operasional harian. Pembukuan selalu seimbang (balanced) dan transparan bagi seluruh anggota."
                  </p>
                </div>
              </div>
            </Reveal>

          </div>

        </div>
      </section>

      {/* --- 5. FAQ SECTION --- */}
      <section id="faq" className="py-16 md:py-24 bg-slate-50/40 border-t border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-12 flex flex-col items-center">
              <h2 className="text-2xl sm:text-4xl font-serif mb-3 tracking-tight" style={{ color: "oklch(0.21 0.03 256)" }}>
                Pertanyaan yang <span className="font-sans italic font-semibold" style={{ color: "var(--primary)" }}>Sering Diajukan</span>
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Informasi lengkap seputar program digitalisasi KDKMP, integrasi sistem, dan kepatuhan hukum SIKORA.
              </p>
            </div>
          </Reveal>

          <div className="space-y-3 max-w-3xl mx-auto">
            <Reveal delay={0.1}>
              <SaudaraFaqItem
                question="Apakah SIKORA menggantikan sistem Simkopdes milik pemerintah?"
                answer="Tidak. SIKORA melengkapi sistem Simkopdes. SIKORA dirancang untuk menarik profil dan database gerai secara langsung dari API Simkopdes guna menghindari penginputan ulang, lalu berfokus memecahkan masalah operasional nyata di lapangan seperti ketiadaan riwayat transaksi, POS kasir offline-first, dan analisis prediksi restock otomatis."
                isOpen={faqOpen.includes(0)}
                onClick={() => toggleFaq(0)}
              />
            </Reveal>
            <Reveal delay={0.2}>
              <SaudaraFaqItem
                question="Bagaimana kasir POS tetap bisa memproses transaksi saat internet terputus?"
                answer="Aplikasi kasir SIKORA berjalan 100% di browser client menggunakan penyimpanan database lokal terenkripsi (IndexedDB/Zustand LocalStorage). Transaksi diselesaikan dan disimpan di perangkat lokal terlebih dahulu. Begitu perangkat kasir terhubung kembali dengan internet, antrean transaksi tertunda akan otomatis disinkronkan ke server pusat."
                isOpen={faqOpen.includes(1)}
                onClick={() => toggleFaq(1)}
              />
            </Reveal>
            <Reveal delay={0.3}>
              <SaudaraFaqItem
                question="Apakah SIKORA AI DSS memakan biaya API key berbayar seperti ChatGPT?"
                answer="Tidak. SIKORA menggunakan mesin keputusan deterministik berbasis aturan logis lokal (Rule-Based AI Engine) yang berjalan seutuhnya di sisi browser client. Ini menjamin aplikasi 100% bebas biaya langganan API tambahan, andal tanpa resiko server AI mati, dan andal ketika jaringan internet desa sangat lambat."
                isOpen={faqOpen.includes(2)}
                onClick={() => toggleFaq(2)}
              />
            </Reveal>
            <Reveal delay={0.4}>
              <SaudaraFaqItem
                question="Apakah platform ini memenuhi standar peraturan pemerintah?"
                answer="Ya. SIKORA dikembangkan selaras dengan program peningkatan volume usaha KDKMP (Koperasi Desa/Kelurahan Merah Putih) berdasarkan PMK No. 7/2026 dan Inpres No. 17/2025 mengenai percepatan operasional gerai dan logistik nasional."
                isOpen={faqOpen.includes(3)}
                onClick={() => toggleFaq(3)}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- 6. CTA BANNER CARD (Floating Video Box) --- */}
      <section className="py-12 px-4 relative z-20">
        <div className="max-w-5xl mx-auto rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden bg-slate-950 text-white py-24 sm:py-32 min-h-[480px] flex flex-col justify-end px-6">
          {/* Background Video Underlay */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-75"
          >
            <source src={footerVideo} type="video/mp4" />
          </video>
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-slate-950/45 z-10"></div>
          
          <div className="max-w-3xl mx-auto text-center relative z-20 flex flex-col items-center">
            <Reveal>
              <h2 className="text-2xl sm:text-4xl font-serif leading-tight">
                Siap Memodernisasi Koperasi Anda?
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Rasakan kemudahan mengelola gerai koperasi desa, memantau pengadaan stok berbasis AI, dan menyusun laporan keuangan otomatis.
              </p>

              <div className="mt-8">
                <Link
                  to="/dashboard"
                  className="btn-glow inline-flex items-center justify-center bg-slate-900 hover:bg-slate-850 text-white font-sans font-extrabold text-sm tracking-wide rounded-full px-8 py-3 shadow-lg transition-colors cursor-pointer"
                >
                  Masuk Demo
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- 7. MULTI-COLUMN FOOTER (Saudara.ai Style) --- */}
      <footer className="w-full bg-white pt-16 pb-8 px-6 text-slate-500 text-xs font-sans border-t border-slate-200/60 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-slate-200/60">
            
            {/* Column 1: Brand & Desc (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center">
                <img src={logoInvert} alt="SIKORA" className="h-8 object-contain" />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                Sinergi Koperasi Raya (SIKORA) merevolusi pengelolaan koperasi desa (KDKMP). Keputusan operasional lebih cerdas, aman, dan terintegrasi secara nasional.
              </p>
              <p className="text-[11px] text-slate-400">
                Indonesia
              </p>
            </div>

            {/* Column 2: Fitur (2 cols) */}
            <div className="md:col-span-2 space-y-3.5">
              <h4 className="font-bold text-[11px] text-slate-800 tracking-wider uppercase">Fitur</h4>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#fitur" className="hover:text-slate-900 transition-colors">API Simkopdes</a></li>
                <li><a href="#fitur" className="hover:text-slate-900 transition-colors">AI DSS Engine</a></li>
                <li><a href="#fitur" className="hover:text-slate-900 transition-colors">Kasir Offline POS</a></li>
                <li><a href="#fitur" className="hover:text-slate-900 transition-colors">Derived Reporting</a></li>
              </ul>
            </div>

            {/* Column 3: Company (2 cols) */}
            <div className="md:col-span-2 space-y-3.5">
              <h4 className="font-bold text-[11px] text-slate-800 tracking-wider uppercase">Perusahaan</h4>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#" className="hover:text-slate-900 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-slate-900 transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="mailto:info@nirmatech.com" className="hover:text-slate-900 transition-colors">Hubungi Kami</a></li>
              </ul>
            </div>

            {/* Column 4: Newsletter / Stay Updated (4 cols) */}
            <div className="md:col-span-4 space-y-3.5">
              <h4 className="font-bold text-[11px] text-slate-800 tracking-wider uppercase">Stay Updated</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Dapatkan pembaruan sistem dan info digitalisasi koperasi nasional.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5 w-full">
                <input 
                  type="email" 
                  placeholder="Email Anda" 
                  className="flex-1 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs text-slate-850 focus:outline-none focus:border-[var(--primary)] w-full"
                />
                <button 
                  type="submit" 
                  className="rounded-full bg-slate-900 text-white font-bold text-xs px-3.5 py-1.5 hover:bg-slate-800 transition-colors"
                >
                  Kirim
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Copyright Line */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 text-[11px]">
            <div className="flex items-center gap-3">
              <img src={onlyLogo} alt="SIKORA" className="h-5.5 object-contain" />
              <span>&copy; 2026 SIKORA — Sinergi Koperasi Raya. Hak Cipta Dilindungi.</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex gap-2.5 items-center">
                <span className="text-slate-400">Powered by</span>
                <img src={nirmatechLogo} alt="NIRMATECH" className="h-[96px] object-contain opacity-95 hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Social Media Icons (Saudara.ai Style with inline SVGs) */}
              <div className="flex items-center gap-3 text-slate-400">
                <a 
                  href="#" 
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-slate-900 transition-colors"
                  title="Twitter / X"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/nirmatech/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 transition-colors"
                  title="Instagram"
                >
                  <svg className="size-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/nirmala-technology/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 transition-colors"
                  title="LinkedIn"
                >
                  <svg className="size-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  )
}

// Subcomponents helper to prevent compile issue

function TimelineStep({
  number,
  timeTag,
  title,
  description,
  children,
  align
}: {
  number: string
  timeTag: string
  title: string
  description: string
  children: React.ReactNode
  align: "left" | "right"
}) {
  const isRight = align === "right"
  
  return (
    <div className="relative mb-16 md:mb-28 last:mb-0">
      
      {/* Icon dot indicator on timeline */}
      <div className="absolute left-8 top-8 z-20 md:hidden">
        <div className="w-6 h-6 rounded-full border-2 border-slate-200 bg-white shadow-lg flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--primary)" }}></div>
        </div>
      </div>
      
      <div className="hidden md:block absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 rounded-full border-2 border-slate-200 bg-white shadow-lg flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--primary)" }}></div>
        </div>
      </div>

      {/* Grid container with direction reveal animations */}
      <div className={`w-full pl-20 md:pl-0 md:w-[45%] ${isRight ? "md:ml-auto md:pl-16" : "md:mr-auto md:pr-16"}`}>
        <Reveal direction={isRight ? "right" : "left"}>
          <div className="liquid-glass rounded-2xl p-6 relative overflow-hidden group shadow-md hover:shadow-lg transition-all duration-300 min-h-[350px] flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/2 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div>
              <div 
                className="inline-block mb-3 px-3 py-1 text-[10px] font-bold rounded-full tracking-wider uppercase border"
                style={{ color: "var(--primary)", borderColor: "rgba(37,99,235,0.15)", backgroundColor: "rgba(37,99,235,0.05)" }}
              >
                {timeTag}
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold mb-2 leading-tight tracking-tight" style={{ color: "oklch(0.21 0.03 256)" }}>
                {title}
              </h3>
              
              <p className="text-slate-500 leading-relaxed font-sans text-xs sm:text-[13px] font-medium mb-4">
                {description}
              </p>
            </div>

            <div className="w-full mt-auto pt-2 z-10 relative">
              {children}
            </div>

            {/* Large back count number */}
            <div className="absolute top-4 right-4 text-6xl font-black text-slate-200/20 select-none leading-none z-0">
              {number}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

function SaudaraFaqItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className="border border-slate-200/80 bg-white rounded-xl overflow-hidden shadow-xs">
      <button
        onClick={onClick}
        className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-slate-50/50 transition-colors focus:outline-none"
      >
        <span className="font-bold text-xs sm:text-sm font-sans tracking-wide" style={{ color: "oklch(0.21 0.03 256)" }}>
          {question}
        </span>
        <ChevronDown
          className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pb-5 text-slate-500 text-xs sm:text-[13px] font-sans leading-relaxed border-t border-slate-100 pt-3">
          {answer}
        </p>
      </div>
    </div>
  )
}
