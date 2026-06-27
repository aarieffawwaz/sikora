/**
 * Real Simkopdes statistics (source: simkopdes.go.id/pers/dashboard, 27/06/2026).
 * `name` matches the PROVINSI property in the 38-province GeoJSON exactly.
 * lat/lng are approximate provincial centroids for map bubbles.
 */
export interface Province {
  id: string
  name: string
  lat: number
  lng: number
  koperasi: number
  nib: number
  npwp: number
  rat: number
  simpananPokok: number
  simpananWajib: number
  volume: number
}

export const NATIONAL = {
  totalKoperasi: 83383,
  akun: 79701,
  npwp: 80978,
  nib: 60759,
  simpananPokok: 40355166015,
  simpananWajib: 10159113180,
  volumeTransaksi: 49543,
  nilaiTransaksi: 29493403316,
}

export const PROVINCES: Province[] = [
  { id: "aceh", name: "Aceh", lat: 4.7, lng: 96.7, koperasi: 6534, nib: 4439, npwp: 6529, rat: 4530, simpananPokok: 329224200, simpananWajib: 97650060, volume: 3715 },
  { id: "bali", name: "Bali", lat: -8.4, lng: 115.2, koperasi: 718, nib: 497, npwp: 716, rat: 643, simpananPokok: 904805000, simpananWajib: 305083000, volume: 32963 },
  { id: "banten", name: "Banten", lat: -6.4, lng: 106.1, koperasi: 1553, nib: 1341, npwp: 1553, rat: 870, simpananPokok: 2665672700, simpananWajib: 383981320, volume: 24692 },
  { id: "bengkulu", name: "Bengkulu", lat: -3.8, lng: 102.3, koperasi: 1508, nib: 1001, npwp: 1506, rat: 900, simpananPokok: 146286400, simpananWajib: 56566285, volume: 0 },
  { id: "diy", name: "Daerah Istimewa Yogyakarta", lat: -7.9, lng: 110.4, koperasi: 438, nib: 403, npwp: 438, rat: 397, simpananPokok: 388765000, simpananWajib: 146981000, volume: 476 },
  { id: "dki", name: "DKI Jakarta", lat: -6.2, lng: 106.8, koperasi: 268, nib: 266, npwp: 267, rat: 267, simpananPokok: 295850000, simpananWajib: 216600000, volume: 17876 },
  { id: "gorontalo", name: "Gorontalo", lat: 0.7, lng: 122.4, koperasi: 731, nib: 637, npwp: 731, rat: 428, simpananPokok: 176565000, simpananWajib: 34735025, volume: 2399 },
  { id: "jambi", name: "Jambi", lat: -1.6, lng: 103.0, koperasi: 1591, nib: 1058, npwp: 1586, rat: 812, simpananPokok: 441756600, simpananWajib: 161515380, volume: 839 },
  { id: "jabar", name: "Jawa Barat", lat: -6.9, lng: 107.6, koperasi: 5971, nib: 5260, npwp: 5965, rat: 3466, simpananPokok: 3550972085, simpananWajib: 2806809414, volume: 95041 },
  { id: "jateng", name: "Jawa Tengah", lat: -7.3, lng: 110.0, koperasi: 8524, nib: 8150, npwp: 8523, rat: 6819, simpananPokok: 4330029650, simpananWajib: 1438449760, volume: 43386 },
  { id: "jatim", name: "Jawa Timur", lat: -7.8, lng: 112.7, koperasi: 8494, nib: 7873, npwp: 8494, rat: 6392, simpananPokok: 15448150700, simpananWajib: 1275160670, volume: 2192746 },
  { id: "kalbar", name: "Kalimantan Barat", lat: -0.3, lng: 111.5, koperasi: 2156, nib: 1405, npwp: 2151, rat: 649, simpananPokok: 295695050, simpananWajib: 103015020, volume: 10540 },
  { id: "kalsel", name: "Kalimantan Selatan", lat: -3.1, lng: 115.3, koperasi: 2013, nib: 1651, npwp: 2013, rat: 1651, simpananPokok: 1718716110, simpananWajib: 318564000, volume: 7509 },
  { id: "kalteng", name: "Kalimantan Tengah", lat: -1.7, lng: 113.4, koperasi: 1543, nib: 741, npwp: 1543, rat: 469, simpananPokok: 227295000, simpananWajib: 97695000, volume: 272 },
  { id: "kaltim", name: "Kalimantan Timur", lat: 0.5, lng: 116.5, koperasi: 1037, nib: 707, npwp: 1036, rat: 565, simpananPokok: 344000000, simpananWajib: 171202000, volume: 2401 },
  { id: "kaltara", name: "Kalimantan Utara", lat: 3.1, lng: 116.0, koperasi: 411, nib: 311, npwp: 411, rat: 196, simpananPokok: 19020450, simpananWajib: 37880000, volume: 9 },
  { id: "babel", name: "Kepulauan Bangka Belitung", lat: -2.7, lng: 106.4, koperasi: 393, nib: 385, npwp: 393, rat: 325, simpananPokok: 64410200, simpananWajib: 32280030, volume: 225 },
  { id: "kepri", name: "Kepulauan Riau", lat: 0.9, lng: 104.5, koperasi: 407, nib: 305, npwp: 407, rat: 181, simpananPokok: 81900000, simpananWajib: 28100000, volume: 0 },
  { id: "lampung", name: "Lampung", lat: -4.9, lng: 105.0, koperasi: 2651, nib: 2106, npwp: 2651, rat: 1787, simpananPokok: 1144359400, simpananWajib: 355359701, volume: 23678 },
  { id: "maluku", name: "Maluku", lat: -3.2, lng: 129.0, koperasi: 1236, nib: 680, npwp: 1236, rat: 574, simpananPokok: 53290000, simpananWajib: 17680000, volume: 0 },
  { id: "malut", name: "Maluku Utara", lat: 0.8, lng: 127.8, koperasi: 1191, nib: 616, npwp: 1187, rat: 289, simpananPokok: 117600000, simpananWajib: 69710000, volume: 900 },
  { id: "ntb", name: "Nusa Tenggara Barat", lat: -8.7, lng: 117.4, koperasi: 1172, nib: 984, npwp: 1170, rat: 892, simpananPokok: 765990200, simpananWajib: 210732280, volume: 31244 },
  { id: "ntt", name: "Nusa Tenggara Timur", lat: -8.7, lng: 121.1, koperasi: 3452, nib: 2218, npwp: 3451, rat: 2049, simpananPokok: 2008343493, simpananWajib: 280055930, volume: 50295 },
  { id: "papua", name: "Papua", lat: -3.9, lng: 139.0, koperasi: 985, nib: 254, npwp: 881, rat: 377, simpananPokok: 48070050, simpananWajib: 16255000, volume: 1698 },
  { id: "pabar", name: "Papua Barat", lat: -1.3, lng: 133.2, koperasi: 826, nib: 205, npwp: 666, rat: 274, simpananPokok: 10010000, simpananWajib: 2070000, volume: 6 },
  { id: "pbd", name: "Papua Barat Daya", lat: -1.0, lng: 131.3, koperasi: 1024, nib: 209, npwp: 956, rat: 218, simpananPokok: 16611000, simpananWajib: 5470000, volume: 0 },
  { id: "papeg", name: "Papua Pegunungan", lat: -4.0, lng: 138.9, koperasi: 2387, nib: 133, npwp: 954, rat: 145, simpananPokok: 140000, simpananWajib: 40000, volume: 0 },
  { id: "papsel", name: "Papua Selatan", lat: -7.0, lng: 139.7, koperasi: 640, nib: 41, npwp: 260, rat: 104, simpananPokok: 2240000, simpananWajib: 680000, volume: 0 },
  { id: "papteng", name: "Papua Tengah", lat: -3.9, lng: 136.9, koperasi: 1200, nib: 143, npwp: 1041, rat: 279, simpananPokok: 11145000, simpananWajib: 3540000, volume: 0 },
  { id: "riau", name: "Riau", lat: 0.5, lng: 101.7, koperasi: 1866, nib: 1106, npwp: 1864, rat: 1064, simpananPokok: 626197978, simpananWajib: 114465000, volume: 2076 },
  { id: "sulbar", name: "Sulawesi Barat", lat: -2.8, lng: 119.2, koperasi: 648, nib: 510, npwp: 648, rat: 548, simpananPokok: 183525000, simpananWajib: 49445060, volume: 3035 },
  { id: "sulsel", name: "Sulawesi Selatan", lat: -4.5, lng: 120.0, koperasi: 3081, nib: 2517, npwp: 3074, rat: 2257, simpananPokok: 768486115, simpananWajib: 275678945, volume: 28932 },
  { id: "sulteng", name: "Sulawesi Tengah", lat: -1.4, lng: 121.4, koperasi: 1983, nib: 1284, npwp: 1982, rat: 1252, simpananPokok: 329590000, simpananWajib: 50835860, volume: 26 },
  { id: "sultra", name: "Sulawesi Tenggara", lat: -4.1, lng: 122.2, koperasi: 2273, nib: 1556, npwp: 2270, rat: 1123, simpananPokok: 622764050, simpananWajib: 163460080, volume: 1055 },
  { id: "sulut", name: "Sulawesi Utara", lat: 1.0, lng: 124.8, koperasi: 1839, nib: 1145, npwp: 1838, rat: 1159, simpananPokok: 400700950, simpananWajib: 105455840, volume: 5676 },
  { id: "sumbar", name: "Sumatera Barat", lat: -0.7, lng: 100.5, koperasi: 1270, nib: 1149, npwp: 1270, rat: 1265, simpananPokok: 494637100, simpananWajib: 189538000, volume: 12628 },
  { id: "sumsel", name: "Sumatera Selatan", lat: -3.3, lng: 104.0, koperasi: 3267, nib: 2655, npwp: 3263, rat: 2430, simpananPokok: 806488559, simpananWajib: 367543120, volume: 5252 },
  { id: "sumut", name: "Sumatera Utara", lat: 2.5, lng: 99.0, koperasi: 6102, nib: 4818, npwp: 6054, rat: 2740, simpananPokok: 515862975, simpananWajib: 168830400, volume: 3362 },
]

export function provinceById(id: string | null): Province | undefined {
  return id ? PROVINCES.find((p) => p.id === id) : undefined
}
