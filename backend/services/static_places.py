PLACES_BY_DISTRICT: dict[str, list[dict]] = {
    "Bagalkot": [
        {"name": "Badami Cave Temples", "type": "monument", "lat": 15.9220, "lng": 75.6800},
        {"name": "Pattadakal Temples", "type": "temple", "lat": 15.9483, "lng": 75.8170},
        {"name": "Aihole Temples", "type": "temple", "lat": 16.0210, "lng": 75.8850},
        {"name": "Banashankari Temple", "type": "temple", "lat": 16.1833, "lng": 75.7167},
    ],
    "Ballari": [
        {"name": "Virupaksha Temple", "type": "temple", "lat": 15.3350, "lng": 76.4600},
        {"name": "Vittala Temple", "type": "temple", "lat": 15.3190, "lng": 76.4530},
        {"name": "Hampi Ruins", "type": "monument", "lat": 15.3350, "lng": 76.4600},
        {"name": "Matanga Hill", "type": "nature", "lat": 15.3320, "lng": 76.4700},
        {"name": "Hampi Bazaar", "type": "attraction", "lat": 15.3320, "lng": 76.4580},
        {"name": "Lotus Mahal", "type": "monument", "lat": 15.3197, "lng": 76.4714},
    ],
    "Belagavi": [
        {"name": "Belagavi Fort", "type": "monument", "lat": 15.8650, "lng": 74.5140},
        {"name": "Gokak Falls", "type": "nature", "lat": 16.1833, "lng": 74.8500},
        {"name": "Jamboti Forest", "type": "nature", "lat": 15.6500, "lng": 74.3500},
        {"name": "Kamal Basadi", "type": "temple", "lat": 15.8660, "lng": 74.5100},
    ],
    "Bengaluru": [
        {"name": "Lalbagh Botanical Garden", "type": "park", "lat": 12.9507, "lng": 77.5848},
        {"name": "Bangalore Palace", "type": "monument", "lat": 12.9987, "lng": 77.5920},
        {"name": "Vidhana Soudha", "type": "monument", "lat": 12.9791, "lng": 77.5913},
        {"name": "Cubbon Park", "type": "park", "lat": 12.9763, "lng": 77.5929},
    ],
    "Bengaluru Rural": [
        {"name": "Devanahalli Fort", "type": "monument", "lat": 13.2333, "lng": 77.7167},
        {"name": "Nandi Hills", "type": "nature", "lat": 13.3700, "lng": 77.6800},
    ],
    "Bidar": [
        {"name": "Bidar Fort", "type": "monument", "lat": 17.9300, "lng": 77.5300},
        {"name": "Guru Nanak Jhira Sahib", "type": "temple", "lat": 17.9200, "lng": 77.5400},
        {"name": "Bahmani Tombs", "type": "monument", "lat": 17.9250, "lng": 77.5250},
    ],
    "Vijayapura": [
        {"name": "Gol Gumbaz", "type": "monument", "lat": 16.8300, "lng": 75.7200},
        {"name": "Ibrahim Rauza", "type": "monument", "lat": 16.8200, "lng": 75.7300},
        {"name": "Bijapur Fort", "type": "monument", "lat": 16.8330, "lng": 75.7150},
    ],
    "Chamarajanagara": [
        {"name": "BRT Tiger Reserve", "type": "nature", "lat": 11.8500, "lng": 77.1500},
        {"name": "Himavad Gopalaswamy Betta", "type": "temple", "lat": 11.7167, "lng": 76.9500},
    ],
    "Chikkaballapura": [
        {"name": "Nandi Hills", "type": "nature", "lat": 13.3700, "lng": 77.6800},
        {"name": "Bhoga Nandeeshwara Temple", "type": "temple", "lat": 13.3833, "lng": 77.7000},
    ],
    "Chikkamagaluru": [
        {"name": "Mullayanagiri Peak", "type": "nature", "lat": 13.3860, "lng": 75.7230},
        {"name": "Baba Budangiri", "type": "nature", "lat": 13.5300, "lng": 75.7300},
        {"name": "Hebbe Falls", "type": "nature", "lat": 13.5200, "lng": 75.6800},
        {"name": "Coffee Plantations", "type": "nature", "lat": 13.3200, "lng": 75.7700},
    ],
    "Chitradurga": [
        {"name": "Chitradurga Fort", "type": "monument", "lat": 14.2300, "lng": 76.4000},
        {"name": "Hidimbeshwara Temple", "type": "temple", "lat": 14.2200, "lng": 76.4100},
        {"name": "Vani Vilasa Sagar Dam", "type": "attraction", "lat": 14.0500, "lng": 76.5500},
        {"name": "Chandravalli Caves", "type": "monument", "lat": 14.2400, "lng": 76.3800},
    ],
    "Dakshina Kannada": [
        {"name": "Mangaladevi Temple", "type": "temple", "lat": 12.8700, "lng": 74.8800},
        {"name": "Kadri Manjunatha Temple", "type": "temple", "lat": 12.8800, "lng": 74.8600},
        {"name": "Panambur Beach", "type": "beach", "lat": 12.9400, "lng": 74.8300},
    ],
    "Davanagere": [
        {"name": "Shivagange", "type": "temple", "lat": 14.3500, "lng": 75.9800},
        {"name": "Malebennur", "type": "attraction", "lat": 14.3300, "lng": 75.9500},
        {"name": "Channagiri Fort", "type": "monument", "lat": 14.0800, "lng": 75.9300},
    ],
    "Dharwad": [
        {"name": "Unkal Lake", "type": "nature", "lat": 15.4700, "lng": 75.0200},
        {"name": "Dharwad Fort", "type": "monument", "lat": 15.4600, "lng": 75.0100},
        {"name": "Chandramouleshwara Temple", "type": "temple", "lat": 15.4550, "lng": 75.0250},
        {"name": "Nrupatunga Betta", "type": "nature", "lat": 15.3500, "lng": 75.1500},
        {"name": "Indira Gandhi Glass House", "type": "park", "lat": 15.3600, "lng": 75.1400},
    ],
    "Gadag": [
        {"name": "Veeranarayana Temple", "type": "temple", "lat": 15.4300, "lng": 75.6300},
        {"name": "Gadag Fort", "type": "monument", "lat": 15.4200, "lng": 75.6200},
        {"name": "Trikuteshwara Temple", "type": "temple", "lat": 15.4250, "lng": 75.6350},
    ],
    "Kalaburagi": [
        {"name": "Gulbarga Fort", "type": "monument", "lat": 17.3400, "lng": 76.8400},
        {"name": "Khwaja Bande Nawaz Dargah", "type": "temple", "lat": 17.3350, "lng": 76.8300},
        {"name": "Sharana Basaveshwara Temple", "type": "temple", "lat": 17.3300, "lng": 76.8450},
    ],
    "Hassan": [
        {"name": "Belur Chennakeshava Temple", "type": "temple", "lat": 13.1600, "lng": 75.8600},
        {"name": "Halebidu Hoysaleswara Temple", "type": "temple", "lat": 13.2100, "lng": 75.9900},
        {"name": "Shravanabelagola", "type": "monument", "lat": 12.8600, "lng": 76.4900},
    ],
    "Haveri": [
        {"name": "Utsav Rock Garden", "type": "park", "lat": 14.8000, "lng": 75.4000},
        {"name": "Siddheshwara Temple", "type": "temple", "lat": 14.7900, "lng": 75.4100},
    ],
    "Kodagu": [
        {"name": "Abbey Falls", "type": "nature", "lat": 12.4300, "lng": 75.7400},
        {"name": "Dubare Elephant Camp", "type": "nature", "lat": 12.3500, "lng": 75.9000},
        {"name": "Talakaveri", "type": "temple", "lat": 12.3800, "lng": 75.5100},
        {"name": "Raja's Seat", "type": "park", "lat": 12.4200, "lng": 75.7300},
    ],
    "Kolar": [
        {"name": "Kolaramma Temple", "type": "temple", "lat": 13.1300, "lng": 78.1300},
        {"name": "Kolar Gold Fields", "type": "monument", "lat": 12.9600, "lng": 78.2700},
        {"name": "Avani Temple", "type": "temple", "lat": 13.1000, "lng": 78.3000},
    ],
    "Koppala": [
        {"name": "Koppal Fort", "type": "monument", "lat": 15.3500, "lng": 76.1500},
        {"name": "Mahadeva Temple Itagi", "type": "temple", "lat": 15.5000, "lng": 76.0500},
        {"name": "Kanakagiri", "type": "temple", "lat": 15.5500, "lng": 76.0800},
    ],
    "Mandya": [
        {"name": "Srirangapatna Fort", "type": "monument", "lat": 12.4200, "lng": 76.7000},
        {"name": "Ranganathittu Bird Sanctuary", "type": "nature", "lat": 12.4400, "lng": 76.6600},
        {"name": "KRS Dam", "type": "attraction", "lat": 12.4200, "lng": 76.5800},
    ],
    "Mysuru": [
        {"name": "Mysore Palace", "type": "monument", "lat": 12.3050, "lng": 76.6550},
        {"name": "Chamundi Hill Temple", "type": "temple", "lat": 12.2700, "lng": 76.6700},
        {"name": "Brindavan Gardens", "type": "park", "lat": 12.4200, "lng": 76.5700},
        {"name": "Mysuru Zoo", "type": "park", "lat": 12.3000, "lng": 76.6600},
    ],
    "Raichur": [
        {"name": "Raichur Fort", "type": "monument", "lat": 16.2100, "lng": 77.3500},
        {"name": "Someshwara Temple", "type": "temple", "lat": 16.2000, "lng": 77.3400},
        {"name": "Mantralayam", "type": "temple", "lat": 15.9400, "lng": 77.4300},
    ],
    "Ramanagara": [
        {"name": "Ramadevara Betta", "type": "nature", "lat": 12.7200, "lng": 77.2800},
        {"name": "Bannerghatta National Park", "type": "park", "lat": 12.8000, "lng": 77.5700},
        {"name": "Savandurga", "type": "nature", "lat": 12.9200, "lng": 77.2900},
    ],
    "Shivamogga": [
        {"name": "Jog Falls", "type": "nature", "lat": 13.8300, "lng": 74.8700},
        {"name": "Kodachadri Peak", "type": "nature", "lat": 14.0300, "lng": 74.8100},
        {"name": "Sakrebailu Elephant Camp", "type": "nature", "lat": 13.9200, "lng": 75.5700},
    ],
    "Tumakuru": [
        {"name": "Devarayanadurga", "type": "temple", "lat": 13.3500, "lng": 77.2000},
        {"name": "Siddaganga Matha", "type": "temple", "lat": 13.3400, "lng": 77.1000},
        {"name": "Namada Chilume", "type": "nature", "lat": 13.3800, "lng": 77.1800},
    ],
    "Udupi": [
        {"name": "Krishna Matha", "type": "temple", "lat": 13.3500, "lng": 74.7500},
        {"name": "St. Mary's Island", "type": "nature", "lat": 13.3800, "lng": 74.6700},
        {"name": "Malpe Beach", "type": "beach", "lat": 13.3500, "lng": 74.7000},
    ],
    "Uttara Kannada": [
        {"name": "Karwar Beach", "type": "beach", "lat": 14.8100, "lng": 74.1200},
        {"name": "Yana Caves", "type": "nature", "lat": 14.5900, "lng": 74.5600},
        {"name": "Mirjan Fort", "type": "monument", "lat": 14.6200, "lng": 74.4400},
        {"name": "Dandeli Wildlife", "type": "nature", "lat": 15.2500, "lng": 74.6200},
    ],
    "Yadgir": [
        {"name": "Yadgir Fort", "type": "monument", "lat": 16.7700, "lng": 77.1300},
        {"name": "Vanadurga Fort", "type": "monument", "lat": 16.6500, "lng": 77.0500},
    ],
}
