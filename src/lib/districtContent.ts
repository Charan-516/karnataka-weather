export interface DistrictContent {
    cards: { image: string; title: string; text: string; alt: string }[]
    travel: { destination: string; image: string; description: string; bestTime: string; tip: string }[]
    tips: string[]
}

const IMG = (id: string) => id.startsWith('http')
    ? id
    : `https://images.unsplash.com/${id}?fm=jpg&q=60&w=1200&auto=format&fit=crop`

const PEX = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`

export const DISTRICT_CONTENT: Record<string, DistrictContent> = {

    Bagalkote: {
        cards: [
            { image: IMG('photo-1599661046289-e31897846e41'), title: 'Badami Cave Temples', text: 'Carved into sandstone cliffs, the 6th-century cave temples of Badami showcase exquisite Chalukya artistry. Four caves dedicated to Hindu and Jain deities reveal intricate sculptures that have endured twelve centuries.', alt: 'Badami cave temple sandstone cliffs' },
            { image: PEX(29833608), title: 'Pattadakal Heritage', text: 'A UNESCO World Heritage site, Pattadakal\'s nine Hindu temples blend northern and southern Indian architecture. The Virupaksha Temple\'s towering vimana dominates the skyline along the Malaprabha River.', alt: 'Pattadakal temple complex heritage' },
            { image: PEX(5497596), title: 'Aihole\'s Experimental Ground', text: 'Known as the "Cradle of Indian Architecture," Aihole houses over 125 temples spanning centuries. The Durga Temple\'s apsidal plan and the Lad Khan Temple\'s unique design showcase bold architectural experimentation.', alt: 'Aihole ancient temple architecture' },
        ],
        travel: [
            { destination: 'Badami Cave Complex', image: IMG('photo-1501785888041-af3ef285b470'), description: 'Explore four rock-cut caves dating to the Chalukya dynasty, each adorned with detailed carvings of Hindu deities, dancing figures, and Jain Tirthankaras.', bestTime: 'October to March', tip: 'Visit Cave 3 first — it has the largest and most intricate carvings' },
            { destination: 'Pattadakal Group of Monuments', image: IMG('photo-1464822759023-fed622ff2c3b'), description: 'A UNESCO site with nine magnificent temples built in the 7th-8th centuries, where northern Nagara and southern Dravidian styles converge.', bestTime: 'November to February', tip: 'The Virupaksha Temple\'s inscriptions narrate the Chalukya dynasty story' },
            { destination: 'Banashankari Temple', image: IMG('photo-1771518701790-9094cc6bd106'), description: 'A sacred Shakti shrine nestled in a tank, dedicated to Goddess Banashankari. The annual fair in January draws thousands of devotees.', bestTime: 'December to February', tip: 'The temple tank is believed to have healing properties' },
        ],
        tips: ['Carry a torch for exploring dark cave interiors', 'Wear sturdy shoes — the rock-cut steps are uneven', 'Hire a guide at Pattadakal for deeper historical context', 'Start early to avoid heat at the exposed heritage sites', 'Combine Badami, Pattadakal, and Aihole in one day trip'],
    },

    Ballari: {
        cards: [
            { image: IMG('photo-1566837945700-30057527ade0'), title: 'Hampi\'s Vijayanagara Glory', text: 'Once the wealthiest city in India, Hampi\'s 1,600+ ruins sprawl across a surreal boulder-strewn landscape. The Vittala Temple\'s stone chariot and musical pillars epitomize Vijayanagara craftsmanship.', alt: 'Hampi ruins boulder landscape' },
            { image: IMG('photo-1504608524841-42fe6f032b4b'), title: 'Sunset at Matanga Hill', text: 'The highest point in Hampi offers panoramic views of the ruined city at golden hour. As the sun sinks behind the granite boulders, the entire valley glows in amber light.', alt: 'Sunset Matanga Hill Hampi view' },
            { image: IMG('photo-1769755503719-bcb034b02bfd'), title: 'Tungabhadra Riverside Life', text: 'The Tungabhadra River sustained the Vijayanagara Empire. Today, coracle rides, riverside banana plantations, and bathing ghats tell the story of a civilization built around water.', alt: 'Tungabhadra river Hampi coracle' },
        ],
        travel: [
            { destination: 'Virupaksha Temple', image: IMG('photo-1600100393203-5ba9541df13c'), description: 'The oldest functioning temple in Hampi, dedicated to Lord Shiva. Its 50-metre gopuram and pillared halls date to the 7th century with later Vijayanagara additions.', bestTime: 'October to March', tip: 'The temple\'s inverted shadow pinhole camera effect appears in March' },
            { destination: 'Vittala Temple Complex', image: IMG('photo-1505144808419-1957a94ca61e'), description: 'Hampi\'s crown jewel featuring the iconic stone chariot, musical pillars that ring when tapped, and the magnificent Ranga Mantapa.', bestTime: 'November to February', tip: 'Tap the pillars gently — each produces a different musical note' },
            { destination: 'Hampi Bazaar', image: IMG('photo-1506905925346-21bda4d32df4'), description: 'Once a mile-long market street lined with jewellery and silk shops, now a collection of pavilions and a path to the Virupaksha Temple.', bestTime: 'October to March', tip: 'Early morning offers the best light for photography of the bazaar ruins' },
        ],
        tips: ['Rent a bicycle or scooter to cover Hampi\'s vast area', 'Carry at least 2 litres of water — it gets extremely hot', 'Wear a hat and sunscreen for boulder climbing', 'Hire a local guide to uncover hidden ruins', 'The coracle ride on Tungabhadra is best at sunset'],
    },

    Belagavi: {
        cards: [
            { image: IMG('photo-1507525428034-b723cf961d3e'), title: 'Belagavi Fort Heritage', text: 'The 12th-century Belagavi Fort, built by the Rattas, has witnessed centuries of warfare. Its hexagonal plan, moat, and the Kamal Basadi Jain temple within tell tales of successive dynasties.', alt: 'Belagavi fort architecture' },
            { image: IMG('photo-1764618979779-f5a8abf6ab28'), title: 'Waterfalls of the Region', text: 'Around Belagavi, waterfalls like Gokak Falls — a 52-metre cascade on the Ghataprabha River — thunder during the monsoon, creating rainbows in the mist.', alt: 'Gokak falls waterfall monsoon' },
            { image: IMG('photo-1511497584788-876760111969'), title: 'Jamboti Forests', text: 'The dense evergreen forests of Jamboti, part of the Western Ghats, are a biodiversity hotspot. Misty trails wind through groves of teak, bamboo, and sandalwood.', alt: 'Jamboti forest Western Ghats' },
        ],
        travel: [
            { destination: 'Gokak Falls', image: PEX(18082819), description: 'A horseshoe-shaped waterfall plunging 52 metres, often called the "Niagara of Karnataka." The hanging bridge offers a thrilling view.', bestTime: 'July to September', tip: 'Visit after heavy rainfall for the most dramatic waterfall volume' },
            { destination: 'Kamal Basadi', image: IMG('photo-1504384308090-c894fdcc538d'), description: 'A beautifully carved Jain temple within Belagavi Fort, featuring polished black stone pillars and intricate ceiling carvings.', bestTime: 'October to February', tip: 'The sunlight streaming through the lattice work is photographer\'s delight' },
            { destination: 'Kittur', image: IMG('photo-1499002238440-d264edd596ec'), description: 'The historic town of Kittur is famous for Rani Chennamma\'s 1824 rebellion against the British. Her palace and fort are preserved as memorials.', bestTime: 'November to February', tip: 'Visit during the Kittur Utsava in February for cultural performances' },
        ],
        tips: ['Try Belagavi\'s famous Kunda ice cream — a local specialty', 'The region is known for its sugarcane — taste fresh jaggery', 'Carry rain gear if visiting during monsoon season', 'The Belgaum Fort is free to enter and open until sunset', 'Combine Kittur and Gokak Falls in a single day trip'],
    },

    BengaluruRural: {
        cards: [
            { image: IMG('photo-1506905925346-21bda4d32df4'), title: 'Nandi Hills Escapes', text: 'Just 60 km from Bengaluru, Nandi Hills rises 1,479 metres above sea level. The former summer retreat of Tipu Sultan offers sunrise views that draw crowds before dawn.', alt: 'Nandi Hills sunrise view' },
            { image: IMG('photo-1470071459604-3b5ec3a7fe05'), title: 'Devanahalli Fort', text: 'The birthplace of Tipu Sultan, this 15th-century fort features imposing granite walls and a temple dedicated to Lord Venugopala. The adjacent town retains old-world charm.', alt: 'Devanahalli fort Tipu Sultan' },
            { image: PEX(35664855), title: 'Wine Country Pilgrimage', text: 'Kanavu and surrounding estates produce award-winning wines. The Nandi Valley\'s granite terrain and cool climate create ideal conditions for vineyards beside ancient hills.', alt: 'Nandi Valley vineyards wine' },
        ],
        travel: [
            { destination: 'Nandi Hills Sunrise Point', image: IMG('photo-1505144808419-1957a94ca61e'), description: 'The most popular sunrise destination near Bangalore. The view of the sun rising over the Deccan plateau from 1,479 metres is unforgettable.', bestTime: '5:30 AM year-round', tip: 'Weekdays are much less crowded than weekends for sunrise' },
            { destination: 'Tipu\'s Drop', image: IMG('photo-1748671631643-87e9ce7aa917'), description: 'A cliff within Nandi Hills where prisoners were once pushed off. Now a viewpoint offering vertigo-inducing views of the valley below.', bestTime: 'October to March', tip: 'The drop has a 600-metre vertical fall — keep a safe distance' },
            { destination: 'Muddenahalli', image: IMG('photo-1464822759023-fed622ff2c3b'), description: 'The birthplace of Sir M. Visvesvaraya, this serene town features his memorial and a museum showcasing his engineering marvels.', bestTime: 'November to February', tip: 'The memorial is beautifully lit in the evenings' },
        ],
        tips: ['Reach Nandi Hills by 5:30 AM for sunrise gate opening', 'Carry a jacket — hilltop mornings can be surprisingly cold', 'Book online tickets for Nandi Hills in advance on weekends', 'Try the local chikki (peanut brittle) sold at the hills', 'The drive up has 10 hairpin bends with scenic valley views'],
    },

    BengaluruUrban: {
        cards: [
            { image: IMG('photo-1600100393203-5ba9541df13c'), title: 'Bengaluru Palace', text: 'A Tudor-style palace built in 1887, inspired by Windsor Castle. Its manicured grounds, Gothic windows, and ornate woodwork offer a surprising slice of British royalty in the Garden City.', alt: 'Bengaluru Palace Tudor architecture' },
            { image: IMG('photo-1504384308090-c894fdcc538d'), title: 'Lalbagh\'s Green Legacy', text: 'Founded by Hyder Ali in 1760, Lalbagh Botanical Gardens spans 240 acres with 1,800+ species. The glass house, modelled on London\'s Crystal Palace, hosts biannual flower shows.', alt: 'Lalbagh glass house garden' },
            { image: IMG('photo-1771250851493-a156fb0a6b85'), title: 'Cubbon Park Walks', text: 'An urban oasis of 300 acres in the heart of the city. Winding paths under century-old trees, statues of luminaries, and the State Central Library make it a cultural hub.', alt: 'Cubbon Park trees walkway' },
        ],
        travel: [
            { destination: 'Bangalore Palace', image: IMG('photo-1501785888041-af3ef285b470'), description: 'A magnificent Tudor-style palace with fortified turrets, graceful arches, and exquisite woodcarvings spanning 45,000 square feet of royal heritage.', bestTime: 'October to March', tip: 'The palace hosts concerts and events — check the schedule in advance' },
            { destination: 'ISKCON Temple', image: IMG('photo-1771518701790-9094cc6bd106'), description: 'One of the largest ISKCON temples in the world, this sprawling complex on Rajajinagar\'s hill combines modern engineering with traditional Vaishnava architecture.', bestTime: 'Year-round', tip: 'Visit during Janmashtami for the grandest celebrations' },
            { destination: 'Commercial Street Shopping', image: IMG('photo-1507525428034-b723cf961d3e'), description: 'Bengaluru\'s oldest shopping district, buzzing with energy. From designer boutiques to street-side jewellery stalls, it captures the city\'s vibrant spirit.', bestTime: 'November to January', tip: 'Park at a nearby mall and walk — Commercial Street gets very congested' },
        ],
        tips: ['Use Bengaluru\'s metro to avoid traffic jams', 'The city\'s craft beer scene is among India\'s finest', 'Visit Lalbagh flower show in January or August', 'Carry a light jacket — Bengaluru\'s evenings are cool year-round', 'Try local filter coffee at MTR or CTR for an authentic experience'],
    },

    Bidar: {
        cards: [
            { image: IMG('photo-1775489876620-6611994afd43'), title: 'Bidar Fort\'s Majesty', text: 'One of India\'s largest forts, Bidar Fort sprawls over 10 square kilometres. Its unique Islamic architecture, intricate tile work, and the Rangin Mahal\'s Persian inscriptions showcase Bahmani grandeur.', alt: 'Bidar Fort Islamic architecture' },
            { image: IMG('photo-1504608524841-42fe6f032b4b'), title: 'Madrasa of Mahmud Gawan', text: 'A 15th-century Islamic college that was once a leading centre of learning in Asia. Its three-storey facade, minarets, and colourful tiles reflect Timurid influence in the Deccan.', alt: 'Madrasa Mahmud Gawan Bidar' },
            { image: PEX(32089411), title: 'Bidri Craft Heritage', text: 'Bidar is world-famous for Bidriware — a metalwork craft where silver inlay is set against blackened zinc alloy. This 600-year-old art form is a protected GI craft.', alt: 'Bidriware metal craft Bidar' },
        ],
        travel: [
            { destination: 'Bidar Fort', image: IMG('photo-1505118380757-91f5f5632de0'), description: 'Explore the royal palaces, audience halls, and underground water systems of this sprawling Bahmani fort. The Solah Khamba Mosque is a masterpiece.', bestTime: 'October to March', tip: 'The fort\'s underground chambers maintain a cool temperature year-round' },
            { destination: 'Ashtur Tombs', image: IMG('photo-1499002238440-d264edd596ec'), description: 'A necropolis housing the tombs of Bahmani sultans, each topped with a distinctive dome. The intricate tile work on the facades is remarkably preserved.', bestTime: 'November to February', tip: 'Sunset light makes the tile work glow with vibrant colours' },
            { destination: 'Maidan Barid Shahi', image: IMG('photo-1441974231531-c6227db76b6e'), description: 'The former royal gardens of the Barid Shahi dynasty, now a tranquil park with remnants of pavilions, water channels, and a lotus pond.', bestTime: 'December to February', tip: 'A peaceful spot for a picnic away from crowds' },
        ],
        tips: ['Bidar is off the tourist trail — enjoy the solitude', 'Buy authentic Bidriware directly from local artisans\' cooperatives', 'Carry a torch for the dark chambers inside Bidar Fort', 'The Madrasa is best visited in the morning for photography', 'Combine with a visit to the nearby Guru Nanak Jhira Sahib'],
    },

    Chamarajanagara: {
        cards: [
            { image: IMG('photo-1511497584788-876760111969'), title: 'Biligirirangan Hills', text: 'The BR Hills form a unique biological bridge between the Western and Eastern Ghats. This tiger reserve shelters elephants, gaurs, and leopards amid shola forests and grasslands.', alt: 'BR Hills forest tiger reserve' },
            { image: IMG('photo-1464822759023-fed622ff2c3b'), title: 'Himavad Gopalaswamy Betta', text: 'The highest peak in the BR Hills, crowned by a temple perpetually wrapped in mist. The 360-degree view from the top stretches across the Mysore plateau to the Nilgiris.', alt: 'Gopalaswamy Betta misty hilltop' },
            { image: IMG('photo-1771518701790-9094cc6bd106'), title: 'River Kapila\'s Course', text: 'The Kapila River (Kabini) forms the district\'s southern boundary, creating rich riparian habitats. Boat safaris on the river offer close encounters with wildlife.', alt: 'Kabini river wildlife safari' },
        ],
        travel: [
            { destination: 'Biligiriranganatha Temple', image: IMG('photo-1441974231531-c6227db76b6e'), description: 'Perched atop BR Hills, this ancient temple to Lord Vishnu is reached by a 3-km trek or jeep ride. The surrounding forest is home to the Soliga tribe.', bestTime: 'October to February', tip: 'Spend a night in the forest guesthouse for the full experience' },
            { destination: 'Kabini Backwaters', image: IMG('photo-1505144808419-1957a94ca61e'), description: 'The backwaters of the Kabini Reservoir create prime wildlife-viewing territory. Elephants, tigers, and over 250 bird species are regularly spotted.', bestTime: 'February to May', tip: 'Boat safaris at dawn offer the best wildlife sightings' },
            { destination: 'Gundlupet', image: IMG('photo-1559056199-641a0ac8b55e'), description: 'This historic town is a gateway to Bandipur and Mudumalai. Its weekly market overflows with local produce, flowers, and spices from surrounding farms.', bestTime: 'Year-round', tip: 'The Saturday shandy (market) is a vibrant cultural experience' },
        ],
        tips: ['Book safaris at BR Hills well in advance', 'Carry binoculars for bird watching in the shola forests', 'The Soliga tribe offers guided nature walks — book through the forest department', 'Monsoon brings leeches — wear appropriate socks and gaiters', 'Respect wildlife corridor rules while driving through the forest'],
    },

    Chikkaballapura: {
        cards: [
            { image: IMG('photo-1506905925346-21bda4d32df4'), title: 'Nandi Hills Majesty', text: 'The crown jewel of Chikkaballapura, Nandi Hills offers ancient hilltop temples, Tipu Sultan\'s summer palace, and sunrise views that reveal the entire Deccan plateau stretching endlessly.', alt: 'Nandi Hills sunrise panorama' },
            { image: IMG('photo-1748671631643-87e9ce7aa917'), title: 'Vidurashwatha Serenity', text: 'Known as the "Kashi of the South," this sacred site features a massive banyan tree covering several acres. The ancient temple and serene tank attract pilgrims seeking peace.', alt: 'Vidurashwatha banyan tree temple' },
            { image: PEX(3509775), title: 'Avani\'s Mythological Legacy', text: 'The small village of Avani is believed to be where Lord Rama\'s consort Sita spent her exile. Seven temples dedicated to the Ramayana legend dot the scenic hillside.', alt: 'Avani temple hillside' },
        ],
        travel: [
            { destination: 'Nandi Hills', image: IMG('photo-1501785888041-af3ef285b470'), description: 'The historic hill fortress with temples, a palace, and stunning viewpoints. Yoga and meditation retreats are popular at the hilltop.', bestTime: 'October to March', tip: 'The Yoga centre on the hill offers classes with a view' },
            { destination: 'Bhoga Nandeeshwara Temple', image: PEX(29833608), description: 'A magnificent 9th-century temple complex at the base of Nandi Hills, featuring three shrines and a large pushkarni (stepped tank).', bestTime: 'Year-round', tip: 'The temple tank reflects the gopuram beautifully at sunrise' },
            { destination: 'Gudibanda Fort', image: IMG('photo-1771250851493-a156fb0a6b85'), description: 'A lesser-known hill fort with panoramic views, ancient temples, and a unique rock-cut cave shrine dedicated to Lord Ganesha.', bestTime: 'October to February', tip: 'The trek up takes 30 minutes and offers great valley views' },
        ],
        tips: ['Book Nandi Hills tickets online for weekends', 'The drive from Bengaluru takes about 1.5 hours', 'Pack a picnic — there are few food options at the top', 'Early morning mist at Nandi Hills is magical in December', 'Combine with a visit to the Lepakshi temple across the border'],
    },

    Chikkamagaluru: {
        cards: [
            { image: IMG('photo-1559056199-641a0ac8b55e'), title: 'Coffee Country', text: 'Chikkamagaluru is the birthplace of Indian coffee. The misty slopes of the Mullayanagiri range host sprawling estates where arabica and robusta thrive under silver oak shade.', alt: 'Coffee plantation Chikkamagaluru' },
            { image: IMG('photo-1504384308090-c894fdcc538d'), title: 'Mullayanagiri Peak', text: 'At 1,930 metres, Mullayanagiri is Karnataka\'s highest peak. The trek to the summit passes through shola forests and grasslands, rewarding hikers with a breathtaking 360-degree panorama.', alt: 'Mullayanagiri peak trek view' },
            { image: PEX(18082819), title: 'Hebbe Falls Descent', text: 'A 168-metre two-tiered waterfall that cascades through coffee plantations. The trek to Hebbe Falls is as rewarding as the destination, with spice-scented air guiding the way.', alt: 'Hebbe falls waterfall coffee estate' },
        ],
        travel: [
            { destination: 'Mullayanagiri Trek', image: IMG('photo-1464822759023-fed622ff2c3b'), description: 'Trek Karnataka\'s highest peak through misty shola forests. The summit offers views stretching to the Arabian Sea on clear days.', bestTime: 'October to February', tip: 'Start the trek by 6 AM to see sunrise from the summit' },
            { destination: 'Kudremukh Range', image: IMG('photo-1585409677983-0f6c41ca9c3b'), description: 'The "Horse Face" peak at 1,894 metres is part of a biodiversity hotspot. The 22-km trek through rolling grasslands is one of Karnataka\'s best.', bestTime: 'October to March', tip: 'Carry 3+ litres of water — the grassland sections have no shade' },
            { destination: 'Bhadra Wildlife Sanctuary', image: IMG('photo-1511497584788-876760111969'), description: 'A tiger reserve spanning 892 square kilometres with elephants, leopards, and over 300 bird species. Boat safaris on the Bhadra Reservoir are unforgettable.', bestTime: 'November to May', tip: 'The backwater boat safari offers the best chance to spot wildlife' },
        ],
        tips: ['Take a coffee plantation tour to understand the bean-to-cup process', 'Pack warm clothes — temperatures drop significantly at night', 'The drive through ghat roads is scenic but winding — drive carefully', 'Sakleshpur-Mangalore railway route passes through 50+ tunnels', 'Visit during December-January for the coffee blossom season'],
    },

    Chitradurga: {
        cards: [
            { image: IMG('photo-1504608524841-42fe6f032b4b'), title: "Chitradurga Fort's Seven Walls", text: 'Built across 1,500 years, this massive fort features seven concentric walls, 19 gateways, and a sophisticated water harvesting system. The fort\'s Kannada name means "picturesque fort."', alt: 'Chitradurga fort walls' },
            { image: IMG('photo-1775489876620-6611994afd43'), title: 'The Hidden Garbha Gudi', text: 'Within the fort lies the Hidimbeshwara Temple, where a unique Shiva linga emerges naturally from the rock floor. The temple\'s architecture blends naturally with the boulders.', alt: 'Hidimbeshwara temple fort' },
            { image: PEX(15172763), title: 'Rock Climbing Paradise', text: 'Chitradurga\'s giant granite boulders attract climbers from across India. Routes range from beginner-friendly slabs to daunting overhangs, all set against a historic backdrop.', alt: 'Rock climbing Chitradurga boulders' },
        ],
        travel: [
            { destination: 'Chitradurga Fort', image: IMG('photo-1748671631643-87e9ce7aa917'), description: 'Explore one of India\'s most impressive hill forts. The seven-walled fortress contains temples, granaries, oil pits, and a sophisticated water system.', bestTime: 'October to March', tip: 'Hire a guide to navigate the fort\'s maze-like passages' },
            { destination: 'Chandravalli Caves', image: IMG('photo-1771518701790-9094cc6bd106'), description: 'Ancient natural caves with archaeological evidence of habitation from the 1st century BCE. The cave complex is set in a beautiful valley.', bestTime: 'November to February', tip: 'Combine with a visit to the nearby Ankali Mutt' },
            { destination: 'Jogimatti State Forest', image: PEX(939850), description: 'A lesser-known forest area with scenic viewpoints, a watchtower, and a small hill station feel. The sunset from Jogimatti is spectacular.', bestTime: 'October to March', tip: 'The forest department guesthouse offers basic but scenic accommodation' },
        ],
        tips: ['Wear comfortable walking shoes — the fort involves extensive climbing', 'Visit early morning to avoid the afternoon heat', 'The fort\'s audio guide is informative and worth the nominal fee', 'Carry water and snacks — there are limited options inside the fort', 'The nearby Vani Vilasa Dam is a peaceful evening spot'],
    },

    DakshinaKannada: {
        cards: [
            { image: IMG('photo-1507525428034-b723cf961d3e'), title: 'Mangalore\'s Coastal Charm', text: 'Mangalore, the district headquarters, blends coastal tradition with modernity. Its red-tiled roofs, coconut groves, and the rhythmic chant of Konkani hymns define the city\'s soul.', alt: 'Mangalore coastal city' },
            { image: IMG('photo-1505118380757-91f5f5632de0'), title: 'Temples of the Coast', text: 'Dakshina Kannada is home to the famed Krishna Temple at Udupi, the Mangaladevi Temple, and the Kollur Mookambika Temple — each a masterpiece of Kerala-style architecture.', alt: 'Udupi Krishna temple' },
            { image: IMG('photo-1505144808419-1957a94ca61e'), title: 'Pilikula Nisargadhama', text: 'A 358-acre eco-tourism complex featuring a zoo, botanical garden, and lake. The Pilikula Heritage Village showcases the distinct culture of Tulu Nadu.', alt: 'Pilikula botanical garden lake' },
        ],
        travel: [
            { destination: 'Panambur Beach', image: PEX(10412253), description: 'One of India\'s safest and cleanest beaches, Panambur offers water sports, dolphin sightings, and spectacular sunsets over the Arabian Sea.', bestTime: 'October to March', tip: 'Visit during the beach festival in December for cultural events' },
            { destination: 'Kudroli Gokarnanatha Temple', image: IMG('photo-1771250851493-a156fb0a6b85'), description: 'A magnificent temple built in the Kerala architectural style, dedicated to Lord Shiva. The intricate woodwork and towering gopuram are stunning.', bestTime: 'Year-round', tip: 'Visit during Maha Shivaratri for the grandest celebrations' },
            { destination: 'Kudremukh National Park', image: IMG('photo-1511497584788-876760111969'), description: 'A UNESCO World Heritage site within the Western Ghats, this national park protects vital elephant habitat and pristine shola-grassland ecosystems.', bestTime: 'October to February', tip: 'Trekking requires prior permission from the forest department' },
        ],
        tips: ['Mangalore\'s seafood is legendary — try the Mangalorean fish curry', 'The city is known for its unique red-tiled roof architecture', 'Carry an umbrella — coastal rains can arrive suddenly', 'Tulu is the primary language spoken here', 'Visit the local markets for spices and cashews'],
    },

    Davanagere: {
        cards: [
            { image: IMG('photo-1559056199-641a0ac8b55e'), title: 'Davanagere\'s Culinary Heart', text: 'Famous across Karnataka for its benne dosa (butter dosa), Davanagere\'s food culture is legendary. The city\'s eateries have perfected this crispy, buttery delicacy over generations.', alt: 'Davanagere benne dosa food' },
            { image: PEX(5540015), title: 'Anjaneya Swamy Temple', text: 'The towering 72-foot Hanuman statue at Doddabathi is one of Karnataka\'s tallest. The temple complex offers panoramic views of the surrounding plains.', alt: 'Doddabathi Hanuman statue' },
            { image: PEX(1522344), title: 'Bhadra River Backwaters', text: 'The Bhadra Reservoir creates serene backwaters that attract migratory birds and offer peaceful boating. The surrounding hills are covered in lush forests.', alt: 'Bhadra river backwaters' },
        ],
        travel: [
            { destination: 'Davanagere Benne Dosa Trail', image: PEX(3509775), description: 'Embark on a culinary trail through Davanagere\'s iconic eateries, each claiming to serve the perfect butter dosa — crispy, golden, and generously buttered.', bestTime: 'Year-round', tip: 'Start with Sri Guru Kottureshwara for the original benne dosa' },
            { destination: 'Kunduvada Kere', image: PEX(35688869), description: 'A serene lake surrounded by gardens, perfect for evening walks and bird watching. The park hosts a musical fountain show on weekends.', bestTime: 'October to February', tip: 'Visit during sunset for a beautiful golden-hour experience' },
            { destination: 'Honnali', image: IMG('photo-1441974231531-c6227db76b6e'), description: 'A historic town on the banks of the Tungabhadra, known for its ancient temples and the scenic Honnali Falls on the river.', bestTime: 'November to February', tip: 'The temple\'s annual chariot festival in March is a vibrant affair' },
        ],
        tips: ['Don\'t leave Davanagere without trying the benne dosa', 'The city is a textile hub — check out the local cotton sarees', 'November to February is the best time to visit', 'The Davanagere coconut is known for its sweetness', 'Handloom shopping is excellent in the old market area'],
    },

    Dharwad: {
        cards: [
            { image: IMG('photo-1506905925346-21bda4d32df4'), title: 'Dharwad\'s Musical Heritage', text: 'Dharwad is the birthplace of Hindustani classical legends like Bhimsen Joshi and Gangubai Hangal. The town\'s akashwani (radio) station has nurtured musical genius for decades.', alt: 'Dharwad music heritage' },
            { image: IMG('photo-1464822759023-fed622ff2c3b'), title: 'Karnataka University Campus', text: 'One of India\'s most beautiful university campuses, spread over 500 acres of wooded land. The architecture blends Indo-Saracenic and modern styles amid landscaped gardens.', alt: 'Karnataka University Dharwad campus' },
            { image: IMG('photo-1769755503719-bcb034b02bfd'), title: 'Unkal Lake Serenity', text: 'A picturesque lake with a musical fountain and landscaped gardens. The sunset views from the lakeside promenade are a favourite among locals and visitors alike.', alt: 'Unkal lake Dharwad sunset' },
        ],
        travel: [
            { destination: 'Siddharoodha Math', image: IMG('photo-1600100393203-5ba9541df13c'), description: 'A revered spiritual centre dedicated to Saint Siddharoodha, attracting devotees from across India. The math\'s peaceful campus is ideal for meditation.', bestTime: 'Year-round', tip: 'The annual jatra in February features spiritual discourses and music' },
            { destination: 'Nrupatunga Betta', image: IMG('photo-1748671631643-87e9ce7aa917'), description: 'A scenic hill overlooking Dharwad with a beautiful park and a giant Shiva statue. The hill offers panoramic views of Dharwad and Hubballi.', bestTime: 'October to March', tip: 'The hill is ideal for a sunset picnic with family' },
            { destination: 'Bharateshwar Temple', image: IMG('photo-1499002238440-d264edd596ec'), description: 'An ancient temple dedicated to Lord Bharateshwara, known for its intricate carvings and peaceful atmosphere. The surrounding garden is well maintained.', bestTime: 'November to February', tip: 'The temple\'s architecture shows Rashtrakuta period influences' },
        ],
        tips: ['Dharwad is famous for its peda (sweet) — buy from traditional shops', 'The Hubballi-Dharwad twin cities are known for their cotton markets', 'Try the local North Karnataka thali for a authentic meal', 'The music festival in January attracts legendary artists', 'Visit during December for the Dharwad Utsav'],
    },

    Gadag: {
        cards: [
            { image: IMG('photo-1599661046289-e31897846e41'), title: 'Veeranarayana Temple', text: 'Gadag\'s crowning glory, this 12th-century temple is a masterpiece of Kalyani Chalukya architecture. The temple\'s ornate pillars and intricate ceiling carvings are a testament to ancient craftsmanship.', alt: 'Veeranarayana temple Gadag' },
            { image: PEX(5497596), title: 'Triple Temple Complex', text: 'The Trikuteshwara temple complex houses three shrines — to Shiva, Brahma, and Surya — under one roof. The Saraswati shrine within features a stunning ceiling of concentric circles.', alt: 'Trikuteshwara temple complex' },
            { image: PEX(20405544), title: 'Kittur Rani Chennamma Memorial', text: 'Gadag district was the epicentre of Kittur\'s rebellion. The memorial at Kittur celebrates the first female ruler to lead an armed uprising against the British in 1824.', alt: 'Kittur Chennamma memorial' },
        ],
        travel: [
            { destination: 'Veeranarayana Temple', image: IMG('photo-1501785888041-af3ef285b470'), description: 'A marvel of Chalukya architecture with 96 carved pillars, each telling a story from the epics. The temple\'s sikharas dominate Gadag\'s skyline.', bestTime: 'October to February', tip: 'The evening aarti is a beautiful experience in the candle-lit shrine' },
            { destination: 'Tirumala Saavira Kambada Basadi', image: IMG('photo-1771518701790-9094cc6bd106'), description: 'A Jain temple with over 1,000 pillars, dating to the 8th century. The intricate carvings and serene atmosphere make it a hidden gem.', bestTime: 'November to February', tip: 'The pillar reflections in the polished floor create a stunning visual effect' },
            { destination: 'Sunnal Lake', image: PEX(7075297), description: 'A serene artificial lake surrounded by green hills, popular for bird watching and peaceful picnics. The lake is an important stopover for migratory birds.', bestTime: 'October to March', tip: 'Bring binoculars for spotting flamingos and pelicans' },
        ],
        tips: ['Gadag\'s architecture enthusiasts will love the temple circuit', 'The town has excellent handloom cotton fabrics', 'Carry a guidebook on Chalukya architecture for deeper appreciation', 'Visit during winter for comfortable temple exploration', 'The local jolad rotti (jowar bread) is a must-try'],
    },

    Hassan: {
        cards: [
            { image: IMG('photo-1600100393203-5ba9541df13c'), title: 'Belur\'s Chennakeshava Temple', text: 'Hoysala architecture at its zenith — this 12th-century temple at Belur took 103 years to complete. Every inch of the exteriors is covered in intricate friezes of gods, dancers, and mythical creatures.', alt: 'Chennakeshava temple Belur' },
            { image: IMG('photo-1599661046289-e31897846e41'), title: 'Halebidu\'s Hoysaleswara Temple', text: 'Though never completed, this temple is considered the finest example of Hoysala architecture. The Nandi pavilion houses a magnificent 3.6-metre bull carved from a single stone.', alt: 'Hoysaleswara temple Halebidu' },
            { image: IMG('photo-1504384308090-c894fdcc538d'), title: 'Shravanabelagola\'s Colossus', text: 'The 18-metre monolithic statue of Gommateshwara (Bahubali) on Vindhyagiri Hill is the world\'s tallest Jain statue. The Mahamastakabhisheka ceremony every 12 years draws millions.', alt: 'Gommateshwara statue Shravanabelagola' },
        ],
        travel: [
            { destination: 'Chennakeshava Temple, Belur', image: IMG('photo-1769755503719-bcb034b02bfd'), description: 'A masterpiece of Hoysala architecture with 48 intricately carved pillars, each unique. The bracket figures depict dancers in 81 different poses.', bestTime: 'October to March', tip: 'The temple opens at 7:30 AM — visit early to avoid crowds' },
            { destination: 'Hoysaleswara Temple, Halebidu', image: IMG('photo-1505144808419-1957a94ca61e'), description: 'Despite being unfinished, this temple\'s detailed soapstone carvings are considered the pinnacle of Hoysala artistry. The star-shaped platform is unique.', bestTime: 'November to February', tip: 'The Archaeological Museum nearby houses Hoysala sculptures' },
            { destination: 'Shravanabelagola', image: IMG('photo-1464822759023-fed622ff2c3b'), description: 'Climb 614 steps to witness the 1,000-year-old Gommateshwara statue. The panoramic view from the top is worth every step.', bestTime: 'December to February', tip: 'Visit on a full moon night when the statue is illuminated' },
        ],
        tips: ['The Hoysala temples are best visited between October and March', 'Wear comfortable shoes for climbing at Shravanabelagola', 'Hire a guide at Belur and Halebidu for the full story behind the carvings', 'Carry a camera with a good zoom for capturing intricate details', 'Combine all three sites in a well-planned two-day itinerary'],
    },

    Haveri: {
        cards: [
            { image: IMG('photo-1566837945700-30057527ade0'), title: 'Siddheshwara Temple', text: 'Built in the 11th century by the Kalyani Chalukyas, this temple at Haveri features a unique blend of early Hoysala and Chalukya styles. The sculpted Nandi is exceptionally detailed.', alt: 'Siddheshwara temple Haveri' },
            { image: PEX(32563599), title: 'Mukteshwara Temple', text: 'A gem of Chalukya architecture at Chaudayyadanapura. The temple\'s ornate doorframe and sculpted panels depict scenes from the Ramayana with remarkable detail.', alt: 'Mukteshwara temple carvings' },
            { image: PEX(611269), title: 'Utsav Rock Garden', text: 'A unique open-air museum featuring life-sized sculptures depicting rural Karnataka life. The garden showcases traditional occupations, festivals, and daily village scenes.', alt: 'Utsav Rock Garden sculptures' },
        ],
        travel: [
            { destination: 'Siddheshwara Temple', image: IMG('photo-1501785888041-af3ef285b470'), description: 'An 11th-century architectural wonder with a beautifully carved Nandi mandapa and intricate ceiling panels depicting floral and geometric patterns.', bestTime: 'October to February', tip: 'The temple\'s polished black stone pillars are cool to touch even in summer' },
            { destination: 'Bada And Shikaripura', image: PEX(3509775), description: 'Twin towns rich in history with ancient temples, a fort, and a beautiful lake. The area is known for its cotton and silk weaving traditions.', bestTime: 'November to February', tip: 'Watch traditional handloom weaving in the local weavers\' colony' },
            { destination: 'Byadgi Chilli Market', image: PEX(35688870), description: 'Haveri is the heart of Karnataka\'s chilli cultivation. The Byadgi market, Asia\'s largest chilli market, explodes with colour during the harvest season.', bestTime: 'January to March', tip: 'The Byadgi chilli is known for its vibrant colour, not heat' },
        ],
        tips: ['Haveri\'s temples are off the tourist trail — enjoy the solitude', 'The Utsav Rock Garden is great for families with children', 'Visit the Byadgi chilli market for a sensory overload', 'Temple timings vary — call ahead to confirm opening hours', 'The local cotton sarees make excellent souvenirs'],
    },

    Kalaburagi: {
        cards: [
            { image: IMG('photo-1775489876620-6611994afd43'), title: 'Gulbarga Fort\'s Grandeur', text: 'Built in the 14th century and later strengthened by the Bahmani Sultanate, Gulbarga Fort\'s 37 bastions and 15 gates encircle a fascinating blend of Islamic and Hindu architecture.', alt: 'Gulbarga fort bastions' },
            { image: IMG('photo-1504608524841-42fe6f032b4b'), title: 'Jama Masjid\'s Persian Soul', text: 'Inspired by the Great Mosque of Cordoba, this 14th-century mosque inside the fort is one of India\'s largest. Its 75 domes and 250 arches create a forest of geometric harmony.', alt: 'Jama Masjid Gulbarga domes' },
            { image: IMG('photo-1499002238440-d264edd596ec'), title: 'Sharana Basaveshwara Temple', text: 'A 12th-century temple dedicated to Basaveshwara, the 12th-century social reformer. The temple\'s Rajagopuram rises 9 storeys, visible from across the city.', alt: 'Sharana Basaveshwara temple' },
        ],
        travel: [
            { destination: 'Gulbarga Fort', image: IMG('photo-1505118380757-91f5f5632de0'), description: 'Explore the massive fort with its unique blend of architectural styles. The Allah-ud-din Bahmani Mosque within is one of India\'s finest examples of Persian architecture.', bestTime: 'October to March', tip: 'The fort\'s underground passages are a must-explore (carry a torch)' },
            { destination: 'Dargah of Khwaja Bande Nawaz', image: IMG('photo-1441974231531-c6227db76b6e'), description: 'A revered Sufi shrine attracting pilgrims of all faiths. The dargah\'s annual urs (death anniversary) festival draws thousands of devotees from across India.', bestTime: 'Year-round, but the urs in November is special', tip: 'The dargah\'s qawwali sessions on Thursday evenings are mesmerising' },
            { destination: 'Haft Gumbaz', image: IMG('photo-1771518701790-9094cc6bd106'), description: 'Translation: "Seven Domes" — a group of seven Bahmani tombs with beautifully proportioned domes. The site offers a peaceful evening walk.', bestTime: 'October to February', tip: 'Sunset photography at Haft Gumbaz is spectacular' },
        ],
        tips: ['Kalaburagi is known for its rich Urdu and Kannada cultural blend', 'Try the local cuisine — especially the Gulbarga-style biryani', 'The fort is huge — allocate at least 3 hours for exploration', 'Thursday evenings at the dargah are a unique cultural experience', 'Carry water and sun protection — the fort has limited shade'],
    },

    Kodagu: {
        cards: [
            { image: IMG('photo-1504384308090-c894fdcc538d'), title: 'Coffee Plantations of Coorg', text: 'Kodagu produces one-third of India\'s coffee. The misty hills are carpeted with emerald coffee plants interspersed with pepper vines, cardamom, and towering shade trees.', alt: 'Coorg coffee plantation mist' },
            { image: PEX(25841472), title: 'Abbey Falls\' Monsoon Roar', text: 'Plunging 70 metres through coffee plantations, Abbey Falls is at its most spectacular during the monsoon. The walkway through spice gardens adds to the experience.', alt: 'Abbey falls Coorg waterfall' },
            { image: IMG('photo-1511497584788-876760111969'), title: 'Nagarahole Tiger Reserve', text: 'Part of the Nilgiri Biosphere Reserve, Nagarahole shelters India\'s highest tiger density. Kabini\'s backwaters offer unmatched wildlife viewing from boat safaris.', alt: 'Nagarahole tiger reserve safari' },
        ],
        travel: [
            { destination: 'Raja\'s Seat', image: IMG('photo-1501785888041-af3ef285b470'), description: 'The "King\'s Seat" is a viewpoint commanding a panoramic sweep of the Western Ghats. Sunrise and sunset from this spot are legendary.', bestTime: 'October to March', tip: 'Arrive 30 minutes before sunrise for the best experience' },
            { destination: 'Dubare Elephant Camp', image: PEX(14013575), description: 'Interact with elephants in a natural forest setting on the banks of the Kaveri. The camp offers bathing, feeding, and educational sessions.', bestTime: 'October to February', tip: 'Book the morning session when elephants are most active' },
            { destination: 'Talakaveri', image: IMG('photo-1505144808419-1957a94ca61e'), description: 'The birthplace of the sacred River Kaveri at 1,276 metres in the Brahmagiri range. The temple and tank mark the origin of this revered river.', bestTime: 'November to February', tip: 'Visit during Sankramana (October) for the special water-rising event' },
        ],
        tips: ['Coorg\'s Kodava culture is unique with distinct rituals and cuisine', 'Try Pandi curry (pork) with steamed rice — a local specialty', 'Homestays offer the most authentic Coorg experience', 'Carry warm clothes — evenings are cool year-round', 'Coffee plantation tours usually end with a complimentary tasting'],
    },

    Kolar: {
        cards: [
            { image: IMG('photo-1506905925346-21bda4d32df4'), title: 'Kolar Gold Fields Legacy', text: 'Once Asia\'s largest gold mines, KGF operated for over a century before closing in 2001. The deep shafts and historic mining infrastructure narrate tales of colonial-era mining.', alt: 'Kolar gold fields mining' },
            { image: IMG('photo-1600100393203-5ba9541df13c'), title: 'Kolaramma Temple', text: 'A 9th-century Chola temple dedicated to the goddess Kolaramma. The temple\'s unique sculptural panels and the 1,000-pillar mantapa showcase Chola artistry far from Tamil Nadu.', alt: 'Kolaramma temple Chola architecture' },
            { image: PEX(3509775), title: 'Avani\'s Ramayana Connection', text: 'The village of Avani in Kolar district is believed to be where Sita spent her exile. Eight ancient temples dot the hillside, each linked to episodes from the Ramayana.', alt: 'Avani temple Ramayana' },
        ],
        travel: [
            { destination: 'Kolar Gold Fields', image: IMG('photo-1748671631643-87e9ce7aa917'), description: 'Take a guided tour of the historic gold mining town. The British-era bungalows, mine shafts, and the KGF museum tell the story of gold mining.', bestTime: 'October to March', tip: 'The KGF museum has authentic mining equipment on display' },
            { destination: 'Kolaramma Temple', image: IMG('photo-1504639725590-34d0984388bd'), description: 'One of Karnataka\'s finest Chola temples, featuring a unique circular shrine and exceptional stone carvings including a rare sculpture of Goddess Kolaramma.', bestTime: 'Year-round', tip: 'The temple tank is believed to have medicinal properties' },
            { destination: 'Antharagange', image: IMG('photo-1464822759023-fed622ff2c3b'), description: 'A scenic hill with a perennial spring, cave shrine, and panoramic views. The site is known for its unique microclimate and biodiversity.', bestTime: 'October to February', tip: 'The spring water is believed to never dry up — even in summer' },
        ],
        tips: ['Kolar is known for its gold, milk, and silk production', 'Visit the KGF area early in the day for the best experience', 'The local milk products — especially Kolar peda — are excellent', 'Antharagange makes for a great half-day trip from Bangalore', 'The Chola temples in Kolar are often overlooked — don\'t miss them'],
    },

    Koppal: {
        cards: [
            { image: IMG('photo-1566837945700-30057527ade0'), title: 'Hampi\'s Other Half', text: 'Koppal district shares the Hampi heritage area. The Anegundi village across the Tungabhadra is believed to be the mythical Kishkindha from the Ramayana.', alt: 'Anegundi Hampi Kishkindha' },
            { image: IMG('photo-1504608524841-42fe6f032b4b'), title: 'Koppal Fort\'s Stratigraphy', text: 'The fort atop a massive hill reveals layers of history — from the Vijayanagara Empire to the Bijapur Sultanate and the British Raj. The climb rewards with 360-degree views.', alt: 'Koppal fort hill view' },
            { image: IMG('photo-1775489876620-6611994afd43'), title: 'Mahadeva Temple at Itagi', text: 'Described as "the emperor of all Chalukya temples," this 12th-century masterpiece at Itagi features exquisite carvings, a massive Nandi, and a beautifully proportioned vimana.', alt: 'Mahadeva temple Itagi' },
        ],
        travel: [
            { destination: 'Anegundi', image: IMG('photo-1501785888041-af3ef285b470'), description: 'Older than Hampi, Anegundi is believed to be the monkey kingdom of Kishkindha. Explore the ancient fort, the Pampa Sarovar, and the Anjanadri Hill.', bestTime: 'October to March', tip: 'Anjanadri Hill is believed to be the birthplace of Hanuman' },
            { destination: 'Mahadeva Temple, Itagi', image: IMG('photo-1505144808419-1957a94ca61e'), description: 'A pinnacle of Western Chalukya architecture with exquisite sculptures. The temple\'s inscription describes it as "the emperor of temples."', bestTime: 'November to February', tip: 'The carving of the Nandi at the entrance is remarkably lifelike' },
            { destination: 'Kinhal Village', image: PEX(5540015), description: 'Famous for Kinhal-style wooden toys and lacquerware, this village has preserved its craft tradition for over 200 years. Watch artisans at work.', bestTime: 'Year-round', tip: 'Buy directly from the artisans for the best prices and quality' },
        ],
        tips: ['Anegundi is less crowded than Hampi — enjoy the peace', 'Take the coracle ferry across the Tungabhadra to Anegundi', 'Kinhal toys make unique and sustainable souvenirs', 'The Mahadeva temple is a masterpiece — don\'t rush through it', 'Hire a local guide at Anegundi for the mythological connections'],
    },

    Mandya: {
        cards: [
            { image: IMG('photo-1507525428034-b723cf961d3e'), title: 'Sugarcane Country', text: 'Mandya is called the "Sugar Bowl of Karnataka." Endless fields of sugarcane sway across the district, fed by the Krishna Raja Sagara dam and its network of canals.', alt: 'Sugarcane fields Mandya' },
            { image: IMG('photo-1559056199-641a0ac8b55e'), title: 'Srirangapatna\'s Royal Past', text: 'The island fortress of Srirangapatna was the capital of Tipu Sultan\'s kingdom. The Ranganathaswamy Temple, Dariya Daulat Palace, and Tipu\'s summer palace dot the island.', alt: 'Srirangapatna Tipu palace' },
            { image: IMG('photo-1600100393203-5ba9541df13c'), title: 'Krishna Raja Sagara Dam', text: 'The iconic KRS Dam, built in 1931, is a marvel of engineering. The Brindavan Gardens below it are illuminated on weekends, creating a wonderland of lights and fountains.', alt: 'KRS dam Brindavan Gardens' },
        ],
        travel: [
            { destination: 'Dariya Daulat Palace', image: IMG('photo-1771518701790-9094cc6bd106'), description: 'Tipu Sultan\'s summer palace, built in Indo-Islamic style. The palace walls are covered in beautiful frescoes depicting Tipu\'s court, battles, and daily life.', bestTime: 'October to March', tip: 'The museum inside houses Tipu\'s personal belongings and weapons' },
            { destination: 'Ranganathaswamy Temple', image: IMG('photo-1499002238440-d264edd596ec'), description: 'One of the five sacred Pancharanga Kshetra temples along the Kaveri. The temple\'s towering gopuram and 2,000-year-old shrine attract pilgrims year-round.', bestTime: 'Year-round', tip: 'Visit during the Vaikuntha Ekadasi festival for special rituals' },
            { destination: 'Melukote', image: IMG('photo-1764618979779-f5a8abf6ab28'), description: 'A historic hill-town with the Cheluvanarayana Swamy Temple and the Academy of Sanskrit Research. The panoramic view from the hilltop is spectacular.', bestTime: 'October to February', tip: 'The temple\'s special sweet, puliyogare, is served as prasadam' },
        ],
        tips: ['Srirangapatna can be covered in a day from Mysore', 'Try the locally produced jaggery (unrefined sugar)', 'The Ranganathitittu Bird Sanctuary is a short boat ride away', 'Brindavan Gardens\' musical fountain show starts at 7 PM', 'Visit during the sugarcane harvest season (Nov-March) for local festivities'],
    },

    Mysuru: {
        cards: [
            { image: IMG('photo-1600100393203-5ba9541df13c'), title: 'Mysore Palace Majesty', text: 'The Amba Vilas Palace, built in 1912, is one of India\'s most spectacular royal residences. Its Indo-Saracenic architecture, stained glass, and intricate woodwork dazzle 6 million visitors annually.', alt: 'Mysore Palace illuminated' },
            { image: IMG('photo-1566837945700-30057527ade0'), title: 'Dasara Festivities', text: 'Mysore Dasara is a 10-day festival celebrating the victory of good over evil. The illuminated palace, caparisoned elephants, and cultural processions make it India\'s most regal festival.', alt: 'Mysore Dasara procession' },
            { image: IMG('photo-1504384308090-c894fdcc538d'), title: 'Chamundi Hills Journey', text: 'Rising 1,030 metres above Mysore, Chamundi Hill is crowned by the Chamundeshwari Temple. The 1,000-step climb passes a giant Nandi statue and offers views of the entire city.', alt: 'Chamundi hill Nandi statue' },
        ],
        travel: [
            { destination: 'Mysore Palace', image: IMG('photo-1501785888041-af3ef285b470'), description: 'Visit the royal palace at night when it is illuminated with 97,000 lights. The Sunday illumination is particularly spectacular, especially during Dasara.', bestTime: 'Year-round, especially Sundays and Dasara season', tip: 'The palace\'s Durbar Hall with its stained-glass ceiling is breathtaking' },
            { destination: 'Brindavan Gardens', image: IMG('photo-1759220948579-aa4866af0f0d'), description: 'Terraced gardens with illuminated fountains, musical water shows, and manicured lawns overlooking the KRS Dam reservoir.', bestTime: 'October to May', tip: 'The night lighting and musical fountain show (7 PM) is a must-see' },
            { destination: 'Mysore Zoo', image: PEX(939850), description: 'One of India\'s oldest and best-maintained zoos, founded by the Maharaja in 1892. The walk-through aviary and reptile house are highlights.', bestTime: 'November to February', tip: 'Visit early morning when the animals are most active' },
        ],
        tips: ['Mysore pak is a must-buy sweet from its place of origin', 'October/November during Dasara is the best time to visit', 'The city\'s silk sarees are world-famous — visit the government silk factory', 'Mysore Palace\'s sound and light show is informative and entertaining', 'St. Philomena\'s Church is a stunning example of Gothic architecture'],
    },

    Raichur: {
        cards: [
            { image: IMG('photo-1775489876620-6611994afd43'), title: 'Raichur Fort\'s Defence', text: 'Perched on a 117-metre rock, Raichur Fort changed hands between Vijayanagara and Bahmani kingdoms. The fort\'s massive cannon, one of India\'s largest, still guards the entrance.', alt: 'Raichur fort cannon' },
            { image: IMG('photo-1504608524841-42fe6f032b4b'), title: 'Krishna-Tungabhadra Confluence', text: 'The sacred meeting of the Krishna and Tungabhadra rivers creates a fertile landscape. The Kudalasangama Sangameshwara Temple at the confluence is a major pilgrimage site.', alt: 'Krishna Tungabhadra confluence' },
            { image: IMG('photo-1499002238440-d264edd596ec'), title: 'Ek Minar Mosque', text: 'Also known as the "One Pillar Mosque," this unique structure stands on a single pillar. The architectural feat demonstrates the engineering prowess of the Bahmani builders.', alt: 'Ek Minar mosque Raichur' },
        ],
        travel: [
            { destination: 'Raichur Fort', image: IMG('photo-1505118380757-91f5f5632de0'), description: 'Explore the historic fort with its massive ramparts, ancient cannons, and panoramic views of the Krishna River valley and Raichur city.', bestTime: 'October to March', tip: 'The fort\'s cannon (Top-e-Bahadur) is 4.5 metres long — one of India\'s largest' },
            { destination: 'Kudalasangama', image: IMG('photo-1764618979779-f5a8abf6ab28'), description: 'The sacred confluence of the Krishna and Malaprabha rivers. The Sangameshwara Temple at the sangam is a revered pilgrimage site.', bestTime: 'December to February', tip: 'The temple hosts a large fair during Maha Shivaratri' },
            { destination: 'Mudgal Fort', image: IMG('photo-1441974231531-c6227db76b6e'), description: 'A lesser-known but fascinating fort complex with three concentric walls, ancient temples, and a mosque. The fort offers a glimpse into medieval Deccan warfare.', bestTime: 'October to February', tip: 'The fort\'s ancient granary is remarkably well preserved' },
        ],
        tips: ['Raichur is off the tourist map — expect no crowds', 'The local cuisine has strong Telangana influences', 'Carry binoculars for bird watching at the river confluence', 'The fort requires moderate climbing — wear appropriate footwear', 'Combine with a visit to the nearby Mantralayam temple'],
    },

    Ramanagara: {
        cards: [
            { image: IMG('photo-1506905925346-21bda4d32df4'), title: 'Ramadevara Betta', text: 'The iconic rocky hill where the Bollywood classic "Sholay" was filmed. The 800-year-old Ramadevara Temple on the hill was Gabbar Singh\'s den in the movie.', alt: 'Ramadevara Betta Sholay' },
            { image: IMG('photo-1748671631643-87e9ce7aa917'), title: 'Silk Country', text: 'Ramanagara is Karnataka\'s silk cocoon capital. The weekly silk market is Asia\'s largest, trading millions of rupees worth of golden cocoons every Wednesday.', alt: 'Silk market Ramanagara' },
            { image: IMG('photo-1464822759023-fed622ff2c3b'), title: 'Rock Climbing Hub', text: 'Ramanagara\'s granite monoliths attract climbers from across India. Routes ranging from 5.8 to 5.13 make it suitable for beginners and experienced climbers alike.', alt: 'Rock climbing Ramanagara' },
        ],
        travel: [
            { destination: 'Ramadevara Betta', image: IMG('photo-1504639725590-34d0984388bd'), description: 'Climb the 450 steps to the hilltop temple featured in "Sholay." The view from the top reveals Ramanagara\'s dramatic boulder-studded landscape.', bestTime: 'October to March', tip: 'The sunrise view from the hilltop is spectacular and crowd-free' },
            { destination: 'Silk Cocoon Market', image: IMG('photo-1759220948579-aa4866af0f0d'), description: 'Asia\'s largest silk cocoon market, bustling every Wednesday morning. Farmers from across Karnataka bring their harvest for auction.', bestTime: 'Year-round on Wednesdays', tip: 'Arrive by 7 AM to see the auction in full swing' },
            { destination: 'Bheemeshwari Wildlife Sanctuary', image: IMG('photo-1511497584788-876760111969'), description: 'A protected forest along the Cauvery River, known for mahseer fishing, rafting, and wildlife. The sanctuary shelters elephants, deer, and over 200 bird species.', bestTime: 'November to May', tip: 'The Cauvery fishing camp offers overnight stays in forest cottages' },
        ],
        tips: ['Ramanagara is a 1-hour drive from Bengaluru', 'Wednesday is the best day to visit for the silk market', 'Rock climbing requires prior booking with local operators', 'The Sholay connection is a fun photo opportunity', 'Pack climbing gear if you plan to tackle the granite monoliths'],
    },

    Shivamogga: {
        cards: [
            { image: IMG('photo-1600965962272-3b5e1a2e0a0a'), title: 'Jog Falls\' Thunder', text: 'India\'s second-highest plunge waterfall at 830 feet, Jog Falls is segmented into four cascades — Raja, Rani, Rover, and Rocket. During monsoon, they merge into one roaring curtain.', alt: 'Jog Falls monsoon cascade' },
            { image: IMG('photo-1511497584788-876760111969'), title: 'Sakrebailu Elephant Camp', text: 'A forest department camp housing rescued and domesticated elephants. Visitors can observe bathing, feeding, and training sessions in a natural forest setting.', alt: 'Sakrebailu elephant camp' },
            { image: IMG('photo-1441974231531-c6227db76b6e'), title: 'Kavaledurga Fort Trek', text: 'A 14th-century fort atop a rocky hill surrounded by dense forest. The 4-km trek through the Western Ghats passes streams, spice gardens, and ancient gateways.', alt: 'Kavaledurga fort trek' },
        ],
        travel: [
            { destination: 'Jog Falls', image: PEX(25841472), description: 'Witness one of India\'s most spectacular waterfalls. The view from the viewing platforms and the walk down to the base are unforgettable.', bestTime: 'July to October', tip: 'The walk down to the base is steep — allow 2 hours for the round trip' },
            { destination: 'Tyarekol (Tiger) Falls', image: IMG('photo-1505144808419-1957a94ca61e'), description: 'A lesser-known waterfall near Jog, equally stunning but far less crowded. The pool at the base is perfect for a refreshing dip.', bestTime: 'August to November', tip: 'Ask locals for directions — the falls are not well signposted' },
            { destination: 'Kodachadri Peak', image: IMG('photo-1464822759023-fed622ff2c3b'), description: 'At 1,343 metres, Kodachadri offers breathtaking views of the Arabian Sea on clear days. The peak is surrounded by dense shola forests and grasslands.', bestTime: 'October to February', tip: 'The 14-km trek is challenging but the views are worth every step' },
        ],
        tips: ['Jog Falls is at its best in August-September', 'The drive through the ghats is scenic but winding', 'Carry a raincoat even in "dry" season — the spray from Jog is intense', 'Book forest accommodation for Kodachadri in advance', 'Try the local areca nut and betel leaf products'],
    },

    Tumakuru: {
        cards: [
            { image: IMG('photo-1771250851493-a156fb0a6b85'), title: 'Siddaganga Math', text: 'One of Karnataka\'s most revered spiritual institutions, the Siddaganga Math has been a centre of learning for 900 years. The math runs a free residential school for thousands of students.', alt: 'Siddaganga Math Tumakuru' },
            { image: IMG('photo-1504639725590-34d0984388bd'), title: 'Devarayanadurga Hills', text: 'A scenic hill range with temples, a massive Nandi statue, and panoramic views. The 9-km forest trek passes boulders and shrines to reach the hilltop Bhoga Narasimha Temple.', alt: 'Devarayanadurga hills trek' },
            { image: IMG('photo-1748671631643-87e9ce7aa917'), title: 'Shivaganga Hill', text: 'Known as "Dakshina Kashi" (Varanasi of the South), this 1,374-metre peak is crowned by a temple. The Honna Devi water stream is believed to have healing properties.', alt: 'Shivaganga hill temple' },
        ],
        travel: [
            { destination: 'Siddaganga Math', image: IMG('photo-1771518701790-9094cc6bd106'), description: 'Visit the sprawling campus of one of Karnataka\'s oldest monasteries. The math\'s free school educates over 10,000 students from rural backgrounds.', bestTime: 'Year-round', tip: 'The math offers free meals to all visitors — experience the community dining' },
            { destination: 'Devarayanadurga', image: IMG('photo-1764618979779-f5a8abf6ab28'), description: 'Trek through boulder-strewn forests to reach the hilltop temples. The 12-foot granite Nandi at the base temple is a masterpiece of sculpture.', bestTime: 'October to March', tip: 'Full moon nights illuminate the boulders beautifully' },
            { destination: 'Kunigal Lake', image: IMG('photo-1759220948579-aa4866af0f0d'), description: 'A scenic lake known for stud farm, boating, and bird watching. The lake is an important stopover for migratory flamingos and pelicans.', bestTime: 'November to February', tip: 'The Kunigal stud farm is one of India\'s oldest horse breeding centres' },
        ],
        tips: ['Tumakuru is Karnataka\'s coconut capital — try fresh coconut water', 'Siddaganga Math welcomes all visitors regardless of faith', 'The drive from Bengaluru takes about 1.5 hours', 'Carry trekking shoes for Devarayanadurga and Shivaganga', 'Visit on a full moon night for a magical hill experience'],
    },

    Udupi: {
        cards: [
            { image: IMG('photo-1507525428034-b723cf961d3e'), title: 'Krishna Math Heritage', text: 'The 13th-century Krishna Math founded by Madhvacharya is Udupi\'s spiritual heart. The unique window (Navagraha Kindi) through which Lord Krishna is worshipped is world-famous.', alt: 'Udupi Krishna Math temple' },
            { image: IMG('photo-1505118380757-91f5f5632de0'), title: 'Malpe Beach\'s Golden Shore', text: 'Udupi\'s pristine coastline stretches for kilometres. Malpe Beach offers dolphin spotting tours, water sports, and stunning sunsets over the Arabian Sea.', alt: 'Malpe beach Udupi sunset' },
            { image: IMG('photo-1499002238440-d264edd596ec'), title: 'St. Mary\'s Island Geology', text: 'A unique geological formation of basalt columns, formed by ancient volcanic activity. Accessible by boat from Malpe, the island is one of India\'s 26 Geological Heritage Sites.', alt: "St Mary's Island basalt columns" },
        ],
        travel: [
            { destination: 'Krishna Math Temple', image: IMG('photo-1759220948579-aa4866af0f0d'), description: 'Witness the unique worship of Lord Krishna through a silver-plated window with nine holes. The temple\'s 700-year-old idol was originally worshipped by Madhvacharya.', bestTime: 'Year-round', tip: 'The Annadanam (free meal) at noon is a beautiful community tradition' },
            { destination: 'Malpe Beach', image: IMG('photo-1501785888041-af3ef285b470'), description: 'Relax on pristine golden sands, go dolphin spotting, or take a boat to St. Mary\'s Island. The beach is lined with palm trees and seafood shacks.', bestTime: 'October to March', tip: 'Dolphin sightings are most common in the early morning' },
            { destination: 'St. Mary\'s Island', image: IMG('photo-1505144808419-1957a94ca61e'), description: 'Walk on hexagonal basalt columns formed by underwater volcanic eruptions millions of years ago. The island is a protected geological monument.', bestTime: 'November to February', tip: 'Boats operate only in calm seas — check weather before planning' },
        ],
        tips: ['Udupi cuisine is world-famous — try the authentic masala dosa', 'The Krishna Math\'s Paryaya festival occurs every two years', 'Fresh seafood at Malpe is excellent and affordable', 'Carry a hat and sunscreen for the boat ride to St. Mary\'s Island', 'The town is known for its peaceful, spiritual atmosphere'],
    },

    UttaraKannada: {
        cards: [
            { image: IMG('photo-1507525428034-b723cf961d3e'), title: 'Gokarna\'s Sacred Shores', text: 'Gokarna is both a pilgrimage town and a beach paradise. The Mahabaleshwar Temple houses a revered atmalinga, while Om Beach and Half Moon Beach offer pristine sands.', alt: 'Gokarna beach temple' },
            { image: IMG('photo-1505118380757-91f5f5632de0'), title: 'Dandeli\'s Wild River', text: 'The Kali River through Dandeli offers India\'s best white-water rafting. The surrounding forest of the Dandeli Wildlife Sanctuary teems with wildlife and bird species.', alt: 'Dandeli river rafting' },
            { image: IMG('photo-1511497584788-876760111969'), title: 'Yana\'s Limestone Pillars', text: 'Deep in the forests of Uttara Kannada, two massive limestone monoliths — Bhairaveshwara Shikhara and Mohini Shikhara — rise dramatically from the jungle floor.', alt: 'Yana limestone pillars forest' },
        ],
        travel: [
            { destination: 'Gokarna Beaches', image: IMG('photo-1759220948579-aa4866af0f0d'), description: 'Explore a string of pristine beaches — Om, Half Moon, Paradise, and Nirvana. Each offers a different character, connected by scenic cliffside trails.', bestTime: 'October to March', tip: 'The cliff walk from Om Beach to Half Moon Beach is stunning at sunset' },
            { destination: 'Dandeli Wildlife Sanctuary', image: IMG('photo-1441974231531-c6227db76b6e'), description: 'Home to tigers, leopards, elephants, and over 300 bird species. The Kali River adds a unique dimension with rafting and coracle rides.', bestTime: 'November to May', tip: 'The white-water rafting season is November to March' },
            { destination: 'Vibhooti Falls', image: PEX(18082819), description: 'A spectacular but less-touristed waterfall near Yellapur. The falls plunge into a deep pool perfect for swimming in a pristine forest setting.', bestTime: 'August to November', tip: 'The trail to the falls passes through areca nut plantations' },
        ],
        tips: ['Gokarna beaches are cleaner and quieter than Goa', 'Dandeli offers adventure for all levels — rafting, kayaking, and trekking', 'The Jog Falls-Sharavathi region is part of Uttara Kannada', 'Monsoon brings out the best in waterfalls and lush greenery', 'Try the local Gokarna seafood — especially the pomfret fry'],
    },

    Vijayapura: {
        cards: [
            { image: IMG('photo-1775489876620-6611994afd43'), title: 'Gol Gumbaz\'s Whispering Wonders', text: 'The mausoleum of Muhammad Adil Shah, Gol Gumbaz features one of the world\'s largest domes — 38 metres in diameter. The whispering gallery carries sound across 37 metres.', alt: 'Gol Gumbaz dome Vijayapura' },
            { image: IMG('photo-1504608524841-42fe6f032b4b'), title: 'Ibrahim Roza\'s Elegance', text: 'Often described as the "Taj Mahal of the Deccan," this mausoleum of Ibrahim Adil Shah II is a masterpiece of symmetry and proportion. The intricate stonework is breathtaking.', alt: 'Ibrahim Roza Vijayapura' },
            { image: IMG('photo-1499002238440-d264edd596ec'), title: 'Bijapur Fort\'s Armoury', text: 'The massive fort encloses the city with its 10-km perimeter and 101 bastions. Inside, the Asar Mahal and Gagan Mahal showcase the opulence of the Adil Shahi dynasty.', alt: 'Bijapur fort architecture' },
        ],
        travel: [
            { destination: 'Gol Gumbaz', image: IMG('photo-1505118380757-91f5f5632de0'), description: 'Marvel at the massive dome — the second largest pre-modern dome in the world after St Peter\'s Basilica. The whispering gallery is a must-experience acoustic wonder.', bestTime: 'October to March', tip: 'Clap in the whispering gallery — the echo repeats 7 times' },
            { destination: 'Ibrahim Roza', image: IMG('photo-1764618979779-f5a8abf6ab28'), description: 'A stunning mausoleum complex that inspired the Taj Mahal\'s architecture. The perfectly symmetrical structures and intricate lattice work are extraordinary.', bestTime: 'November to February', tip: 'Visit during golden hour for spectacular photography of the marble work' },
            { destination: 'Taj Bawdi', image: IMG('photo-1771518701790-9094cc6bd106'), description: 'A magnificent stepwell (bawdi) built by Ibrahim Adil Shah. The 200-step descent to the water level reveals intricate Islamic geometric patterns.', bestTime: 'October to March', tip: 'The stepwell\'s structure is best viewed from the highest level' },
        ],
        tips: ['Vijayapura is known for its unique Deccan-style cuisine', 'Gol Gumbaz\'s dome was built without any central support', 'The city is also called Bijapur — both names are used interchangeably', 'Hire a guide to fully appreciate the Adil Shahi architecture', 'Visit between November and February for pleasant weather'],
    },

    Yadgir: {
        cards: [
            { image: IMG('photo-1599661046289-e31897846e41'), title: 'Yadgir Fort\'s Heights', text: 'Perched on massive granite boulders, Yadgir Fort offers panoramic views of the surrounding plains. The fort\'s strategic location made it a coveted prize for successive Deccan empires.', alt: 'Yadgir fort granite boulders' },
            { image: IMG('photo-1504639725590-34d0984388bd'), title: 'Kembavi\'s Ancient Temple', text: 'The Sangameshwara Temple at Kembavi is a fine example of Chalukya architecture with beautifully sculpted pillars and a serene tank. The site is remarkably well preserved.', alt: 'Kembavi temple Chalukya' },
            { image: IMG('photo-1771250851493-a156fb0a6b85'), title: 'Shahapur\'s Craft Tradition', text: 'Shahapur in Yadgir is known for its traditional wooden toy making and lacquerware. The vibrant hand-painted toys are a protected GI craft passed down through generations.', alt: 'Shahapur wooden toys craft' },
        ],
        travel: [
            { destination: 'Yadgir Fort', image: IMG('photo-1748671631643-87e9ce7aa917'), description: 'Explore the ruined fort atop a granite hill. The climb rewards with magnificent views of the Bhima River valley and the surrounding agricultural landscape.', bestTime: 'October to February', tip: 'The sunrise view from the top is spectacular and completely crowd-free' },
            { destination: 'Sangameshwara Temple, Kembavi', image: PEX(32089411), description: 'An 11th-century Chalukya temple with exquisite carvings and a large pushkarni (stepped tank). The temple is remarkably intact despite its age.', bestTime: 'November to February', tip: 'The temple tank\'s stepped architecture is beautifully photogenic' },
            { destination: 'Chandrampalli Dam', image: IMG('photo-1441974231531-c6227db76b6e'), description: 'A scenic irrigation dam on the Bhima River, popular for picnics and bird watching. Migratory birds flock to the reservoir in winter.', bestTime: 'December to March', tip: 'Winter evenings offer the best bird sightings and a beautiful sunset' },
        ],
        tips: ['Yadgir is one of Karnataka\'s least explored districts', 'The local wooden toys make unique, sustainable souvenirs', 'Carry water — the fort trek can be dehydrating', 'The Bhima River valley is beautiful during the monsoon', 'Combine with a visit to nearby Gulbarga for a heritage tour'],
    },
}
