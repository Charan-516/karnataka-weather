export interface Place {
  name: string;
  type: string;
  lat: number;
  lng: number;
}

export const STATIC_PLACES: Record<string, Place[]> = {
  Bagalkot: [
    { name: "Badami Cave Temples", type: "monument", lat: 15.922, lng: 75.68 },
    { name: "Pattadakal Temples", type: "temple", lat: 15.9483, lng: 75.817 },
    { name: "Aihole Temples", type: "temple", lat: 16.021, lng: 75.885 },
    { name: "Banashankari Temple", type: "temple", lat: 16.1833, lng: 75.7167 },
  ],
  Ballari: [
    { name: "Virupaksha Temple", type: "temple", lat: 15.335, lng: 76.46 },
    { name: "Vittala Temple", type: "temple", lat: 15.319, lng: 76.453 },
    { name: "Hampi Ruins", type: "monument", lat: 15.335, lng: 76.46 },
    { name: "Matanga Hill", type: "nature", lat: 15.332, lng: 76.47 },
    { name: "Hampi Bazaar", type: "attraction", lat: 15.332, lng: 76.458 },
    { name: "Lotus Mahal", type: "monument", lat: 15.3197, lng: 76.4714 },
  ],
  Belagavi: [
    { name: "Belagavi Fort", type: "monument", lat: 15.865, lng: 74.514 },
    { name: "Gokak Falls", type: "nature", lat: 16.1833, lng: 74.85 },
    { name: "Jamboti Forest", type: "nature", lat: 15.65, lng: 74.35 },
    { name: "Kamal Basadi", type: "temple", lat: 15.866, lng: 74.51 },
  ],
  Bengaluru: [
    { name: "Lalbagh Botanical Garden", type: "park", lat: 12.9507, lng: 77.5848 },
    { name: "Bangalore Palace", type: "monument", lat: 12.9987, lng: 77.592 },
    { name: "Vidhana Soudha", type: "monument", lat: 12.9791, lng: 77.5913 },
    { name: "Cubbon Park", type: "park", lat: 12.9763, lng: 77.5929 },
  ],
  "Bengaluru Rural": [
    { name: "Devanahalli Fort", type: "monument", lat: 13.2333, lng: 77.7167 },
    { name: "Nandi Hills", type: "nature", lat: 13.37, lng: 77.68 },
  ],
  Bidar: [
    { name: "Bidar Fort", type: "monument", lat: 17.93, lng: 77.53 },
    { name: "Guru Nanak Jhira Sahib", type: "temple", lat: 17.92, lng: 77.54 },
    { name: "Bahmani Tombs", type: "monument", lat: 17.925, lng: 77.525 },
  ],
  Vijayapura: [
    { name: "Gol Gumbaz", type: "monument", lat: 16.83, lng: 75.72 },
    { name: "Ibrahim Rauza", type: "monument", lat: 16.82, lng: 75.73 },
    { name: "Bijapur Fort", type: "monument", lat: 16.833, lng: 75.715 },
  ],
  Chamarajanagara: [
    { name: "BRT Tiger Reserve", type: "nature", lat: 11.85, lng: 77.15 },
    { name: "Himavad Gopalaswamy Betta", type: "temple", lat: 11.7167, lng: 76.95 },
  ],
  Chikkaballapura: [
    { name: "Nandi Hills", type: "nature", lat: 13.37, lng: 77.68 },
    { name: "Bhoga Nandeeshwara Temple", type: "temple", lat: 13.3833, lng: 77.7 },
  ],
  Chikkamagaluru: [
    { name: "Mullayanagiri Peak", type: "nature", lat: 13.386, lng: 75.723 },
    { name: "Baba Budangiri", type: "nature", lat: 13.53, lng: 75.73 },
    { name: "Hebbe Falls", type: "nature", lat: 13.52, lng: 75.68 },
    { name: "Coffee Plantations", type: "nature", lat: 13.32, lng: 75.77 },
  ],
  Chitradurga: [
    { name: "Chitradurga Fort", type: "monument", lat: 14.23, lng: 76.4 },
    { name: "Hidimbeshwara Temple", type: "temple", lat: 14.22, lng: 76.41 },
    { name: "Vani Vilasa Sagar Dam", type: "attraction", lat: 14.05, lng: 76.55 },
    { name: "Chandravalli Caves", type: "monument", lat: 14.24, lng: 76.38 },
  ],
  "Dakshina Kannada": [
    { name: "Mangaladevi Temple", type: "temple", lat: 12.87, lng: 74.88 },
    { name: "Kadri Manjunatha Temple", type: "temple", lat: 12.88, lng: 74.86 },
    { name: "Panambur Beach", type: "beach", lat: 12.94, lng: 74.83 },
  ],
  Davanagere: [
    { name: "Shivagange", type: "temple", lat: 14.35, lng: 75.98 },
    { name: "Malebennur", type: "attraction", lat: 14.33, lng: 75.95 },
    { name: "Channagiri Fort", type: "monument", lat: 14.08, lng: 75.93 },
  ],
  Dharwad: [
    { name: "Unkal Lake", type: "nature", lat: 15.47, lng: 75.02 },
    { name: "Dharwad Fort", type: "monument", lat: 15.46, lng: 75.01 },
    { name: "Chandramouleshwara Temple", type: "temple", lat: 15.455, lng: 75.025 },
    { name: "Nrupatunga Betta", type: "nature", lat: 15.35, lng: 75.15 },
    { name: "Indira Gandhi Glass House", type: "park", lat: 15.36, lng: 75.14 },
  ],
  Gadag: [
    { name: "Veeranarayana Temple", type: "temple", lat: 15.43, lng: 75.63 },
    { name: "Gadag Fort", type: "monument", lat: 15.42, lng: 75.62 },
    { name: "Trikuteshwara Temple", type: "temple", lat: 15.425, lng: 75.635 },
  ],
  Kalaburagi: [
    { name: "Gulbarga Fort", type: "monument", lat: 17.34, lng: 76.84 },
    { name: "Khwaja Bande Nawaz Dargah", type: "temple", lat: 17.335, lng: 76.83 },
    { name: "Sharana Basaveshwara Temple", type: "temple", lat: 17.33, lng: 76.845 },
  ],
  Hassan: [
    { name: "Belur Chennakeshava Temple", type: "temple", lat: 13.16, lng: 75.86 },
    { name: "Halebidu Hoysaleswara Temple", type: "temple", lat: 13.21, lng: 75.99 },
    { name: "Shravanabelagola", type: "monument", lat: 12.86, lng: 76.49 },
  ],
  Haveri: [
    { name: "Utsav Rock Garden", type: "park", lat: 14.8, lng: 75.4 },
    { name: "Siddheshwara Temple", type: "temple", lat: 14.79, lng: 75.41 },
  ],
  Kodagu: [
    { name: "Abbey Falls", type: "nature", lat: 12.43, lng: 75.74 },
    { name: "Dubare Elephant Camp", type: "nature", lat: 12.35, lng: 75.9 },
    { name: "Talakaveri", type: "temple", lat: 12.38, lng: 75.51 },
    { name: "Raja's Seat", type: "park", lat: 12.42, lng: 75.73 },
  ],
  Kolar: [
    { name: "Kolaramma Temple", type: "temple", lat: 13.13, lng: 78.13 },
    { name: "Kolar Gold Fields", type: "monument", lat: 12.96, lng: 78.27 },
    { name: "Avani Temple", type: "temple", lat: 13.1, lng: 78.3 },
  ],
  Koppala: [
    { name: "Koppal Fort", type: "monument", lat: 15.35, lng: 76.15 },
    { name: "Mahadeva Temple Itagi", type: "temple", lat: 15.5, lng: 76.05 },
    { name: "Kanakagiri", type: "temple", lat: 15.55, lng: 76.08 },
  ],
  Mandya: [
    { name: "Srirangapatna Fort", type: "monument", lat: 12.42, lng: 76.7 },
    { name: "Ranganathittu Bird Sanctuary", type: "nature", lat: 12.44, lng: 76.66 },
    { name: "KRS Dam", type: "attraction", lat: 12.42, lng: 76.58 },
  ],
  Mysuru: [
    { name: "Mysore Palace", type: "monument", lat: 12.305, lng: 76.655 },
    { name: "Chamundi Hill Temple", type: "temple", lat: 12.27, lng: 76.67 },
    { name: "Brindavan Gardens", type: "park", lat: 12.42, lng: 76.57 },
    { name: "Mysuru Zoo", type: "park", lat: 12.3, lng: 76.66 },
  ],
  Raichur: [
    { name: "Raichur Fort", type: "monument", lat: 16.21, lng: 77.35 },
    { name: "Someshwara Temple", type: "temple", lat: 16.2, lng: 77.34 },
    { name: "Mantralayam", type: "temple", lat: 15.94, lng: 77.43 },
  ],
  Ramanagara: [
    { name: "Ramadevara Betta", type: "nature", lat: 12.72, lng: 77.28 },
    { name: "Bannerghatta National Park", type: "park", lat: 12.8, lng: 77.57 },
    { name: "Savandurga", type: "nature", lat: 12.92, lng: 77.29 },
  ],
  Shivamogga: [
    { name: "Jog Falls", type: "nature", lat: 13.83, lng: 74.87 },
    { name: "Kodachadri Peak", type: "nature", lat: 14.03, lng: 74.81 },
    { name: "Sakrebailu Elephant Camp", type: "nature", lat: 13.92, lng: 75.57 },
  ],
  Tumakuru: [
    { name: "Devarayanadurga", type: "temple", lat: 13.35, lng: 77.2 },
    { name: "Siddaganga Matha", type: "temple", lat: 13.34, lng: 77.1 },
    { name: "Namada Chilume", type: "nature", lat: 13.38, lng: 77.18 },
  ],
  Udupi: [
    { name: "Krishna Matha", type: "temple", lat: 13.35, lng: 74.75 },
    { name: "St. Mary's Island", type: "nature", lat: 13.38, lng: 74.67 },
    { name: "Malpe Beach", type: "beach", lat: 13.35, lng: 74.7 },
  ],
  "Uttara Kannada": [
    { name: "Karwar Beach", type: "beach", lat: 14.81, lng: 74.12 },
    { name: "Yana Caves", type: "nature", lat: 14.59, lng: 74.56 },
    { name: "Mirjan Fort", type: "monument", lat: 14.62, lng: 74.44 },
    { name: "Dandeli Wildlife", type: "nature", lat: 15.25, lng: 74.62 },
  ],
  Yadgir: [
    { name: "Yadgir Fort", type: "monument", lat: 16.77, lng: 77.13 },
    { name: "Vanadurga Fort", type: "monument", lat: 16.65, lng: 77.05 },
  ],
};

export function getPlacesForDistrict(district: string): Place[] {
  return STATIC_PLACES[district] || [];
}

export function getPlaceCount(district: string): number {
  return getPlacesForDistrict(district).length;
}
