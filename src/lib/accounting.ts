import type { JournalEntry, LedgerEntry, Product, Transaction } from "./types"

/**
 * Derived accounting reporting layer — NOT a separate source of truth.
 * Everything here is computed from the existing cash ledger / transactions / products
 * that the rest of the app already maintains, the same way aiEngine derives
 * recommendations from product state. This keeps a single source of truth
 * (the cash ledger) while presenting it through standard accounting views.
 */

export const ACCOUNTS = {
  KAS: "Kas",
  PERSEDIAAN: "Persediaan Barang Dagang",
  MODAL: "Modal Koperasi",
  PENDAPATAN: "Pendapatan Penjualan",
  PENDAPATAN_LAIN: "Pendapatan Lain-lain",
  HPP: "Beban Pembelian (HPP)",
  BEBAN_OPERASIONAL: "Beban Operasional",
} as const

/** Maps each cash-ledger entry to its double-entry debit/credit account pair. */
function journalAccountsFor(entry: LedgerEntry): { debitAccount: string; creditAccount: string } {
  if (entry.category === "Saldo Awal") return { debitAccount: ACCOUNTS.KAS, creditAccount: ACCOUNTS.MODAL }
  if (entry.category === "Penjualan") return { debitAccount: ACCOUNTS.KAS, creditAccount: ACCOUNTS.PENDAPATAN }
  if (entry.category === "Pembelian") return { debitAccount: ACCOUNTS.PERSEDIAAN, creditAccount: ACCOUNTS.KAS }
  if (entry.category === "Selisih Kas") {
    return entry.type === "masuk"
      ? { debitAccount: ACCOUNTS.KAS, creditAccount: ACCOUNTS.PENDAPATAN_LAIN }
      : { debitAccount: ACCOUNTS.BEBAN_OPERASIONAL, creditAccount: ACCOUNTS.KAS }
  }
  return entry.type === "masuk"
    ? { debitAccount: ACCOUNTS.KAS, creditAccount: ACCOUNTS.PENDAPATAN_LAIN }
    : { debitAccount: ACCOUNTS.BEBAN_OPERASIONAL, creditAccount: ACCOUNTS.KAS }
}

/** Jurnal Umum — one double-entry journal line per cash-ledger entry. */
export function journalEntries(ledger: LedgerEntry[]): JournalEntry[] {
  return ledger.map((entry) => {
    const { debitAccount, creditAccount } = journalAccountsFor(entry)
    return {
      id: "j_" + entry.id,
      at: entry.at,
      debitAccount,
      creditAccount,
      amount: entry.amount,
      description: entry.description,
    }
  })
}

export interface AccountLedgerLine {
  at: number
  description: string
  debit: number
  credit: number
  balance: number
}

/** Buku Besar — per-account postings with running balance (debit - credit, cumulative). */
export function generalLedger(ledger: LedgerEntry[]): Record<string, AccountLedgerLine[]> {
  const journal = journalEntries(ledger)
  const byAccount: Record<string, AccountLedgerLine[]> = {}
  const runningBalance: Record<string, number> = {}

  for (const j of journal) {
    for (const [account, isDebit] of [[j.debitAccount, true], [j.creditAccount, false]] as const) {
      const prev = runningBalance[account] ?? 0
      const balance = isDebit ? prev + j.amount : prev - j.amount
      runningBalance[account] = balance
      byAccount[account] = [
        ...(byAccount[account] ?? []),
        { at: j.at, description: j.description, debit: isDebit ? j.amount : 0, credit: isDebit ? 0 : j.amount, balance },
      ]
    }
  }
  return byAccount
}

export interface IncomeStatement {
  pendapatan: number
  hpp: number
  labaKotor: number
  bebanOperasional: number
  labaBersih: number
}

/** Laporan Laba Rugi — derived from sales revenue, cost of goods sold, and operational expense. */
export function incomeStatement(transactions: Transaction[], ledger: LedgerEntry[], products: Product[]): IncomeStatement {
  const costByProduct = new Map(products.map((p) => [p.id, p.cost]))
  const pendapatan = transactions.reduce((sum, t) => sum + t.total, 0)
  const hpp = transactions.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.qty * (costByProduct.get(i.productId) ?? 0), 0),
    0,
  )
  const bebanOperasional = ledger
    .filter((l) => l.category === "Selisih Kas" && l.type === "keluar")
    .reduce((sum, l) => sum + l.amount, 0)
  const labaKotor = pendapatan - hpp
  const labaBersih = labaKotor - bebanOperasional
  return { pendapatan, hpp, labaKotor, bebanOperasional, labaBersih }
}

export interface BalanceSheet {
  kas: number
  persediaan: number
  totalAset: number
  modalAwal: number
  labaDitahan: number
  totalModal: number
}

/** Neraca — simplified balance sheet (Aset = Modal Awal + Laba Ditahan, laba ditahan as the balancing plug). */
export function balanceSheet(cashBalance: number, products: Product[], modalAwal: number): BalanceSheet {
  const kas = cashBalance
  const persediaan = products.reduce((sum, p) => sum + p.stock * p.cost, 0)
  const totalAset = kas + persediaan
  const labaDitahan = totalAset - modalAwal
  return { kas, persediaan, totalAset, modalAwal, labaDitahan, totalModal: modalAwal + labaDitahan }
}
