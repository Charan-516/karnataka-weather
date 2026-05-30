export interface WeatherContent {
    title: string
    subtitle: string
    heroImage: string
    description: string
    cards: {
        image: string
        title: string
        text: string
        alt: string
    }[]
    travel: {
        destination: string
        image: string
        description: string
        bestTime: string
        tip: string
    }[]
    tips: string[]
}

export const WEATHER_CONTENT: Record<string, WeatherContent> = {
    Sunny: {
        title: 'Sunny',
        subtitle: 'Clear skies · Golden light · Perfect visibility',
        heroImage: 'https://images.unsplash.com/photo-1776777043748-00e82fd739f8?fm=jpg&q=60&w=2000&auto=format&fit=crop',
        description: 'High pressure systems dominate, bringing warm temperatures and clear blue skies across Karnataka.',
        cards: [
            {
                image: 'https://images.unsplash.com/photo-1776650386020-2d8ff50728ea?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Golden Landscapes',
                text: 'The sun-drenched valleys of Karnataka come alive under brilliant blue skies. Rolling hills painted in gold stretch to the horizon, offering postcard-perfect views at every turn.',
                alt: 'Rolling green hills under bright blue sky',
            },
            {
                image: 'https://images.unsplash.com/photo-1775931714819-cd2b57c1c3ab?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Endless Horizons',
                text: 'With visibility stretching for miles, sunny days reveal the true scale of Karnataka\'s diverse terrain — from the Deccan Plateau to the coastal plains washed in golden sunlight.',
                alt: 'Vast green field under sunny blue sky',
            },
            {
                image: 'https://images.unsplash.com/photo-1776361984537-bee22e956323?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Coastal Radiance',
                text: 'Along Karnataka\'s 320-km coastline, sunny weather transforms beaches into glittering strips of gold. The Arabian Sea sparkles under clear skies, inviting travellers to its warm shores.',
                alt: 'Tropical beach with palm trees on sunny day',
            },
        ],
        travel: [
            {
                destination: 'Gokarna Beach',
                image: 'https://images.pexels.com/photos/17352592/pexels-photo-17352592.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'Sunny days are perfect for Gokarna\'s pristine beaches — Om Beach, Half Moon, and Paradise Beach offer crystal-clear waters and golden sands.',
                bestTime: 'October to March',
                tip: 'Visit early morning for the best light and empty shores',
            },
            {
                destination: 'Nandi Hills Sunrise',
                image: 'https://images.pexels.com/photos/5922727/pexels-photo-5922727.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'The most popular sunrise spot near Bangalore. Clear skies guarantee breathtaking views of the sun rising over the Deccan plateau.',
                bestTime: '5:30 AM — year-round',
                tip: 'Weekdays are far less crowded than weekends',
            },
            {
                destination: 'Mysore Palace',
                image: 'https://images.pexels.com/photos/33688561/pexels-photo-33688561.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'The Indo-Saracenic architecture of Mysore Palace gleams under bright sunshine. The Sunday illumination at dusk is a must-see.',
                bestTime: 'October to February',
                tip: 'Visit on Sunday for the 7 PM palace illumination',
            },
        ],
        tips: [
            'Wear lightweight cotton clothing and a wide-brimmed hat',
            'Apply SPF 50+ sunscreen — UV index is high on clear days',
            'Stay hydrated — carry at least 2L of water for outdoor activities',
            'Best time for photography is the golden hour (6-7 AM and 4-5 PM)',
            'Book outdoor activities early morning to avoid midday heat',
        ],
    },

    Cloudy: {
        title: 'Cloudy',
        subtitle: 'Diffused light · Dramatic skies · Cool breeze',
        heroImage: 'https://images.unsplash.com/photo-1769411972412-234cdb5a181b?fm=jpg&q=60&w=2000&auto=format&fit=crop',
        description: 'A blanket of clouds moderates temperatures, creating a dramatic canvas of light and shadow across the landscape.',
        cards: [
            {
                image: 'https://images.unsplash.com/photo-1771250851493-a156fb0a6b85?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Dramatic Canopies',
                text: 'Cloud cover transforms Karnataka\'s skies into a living painting. Layers of grey and white stretch endlessly, filtering sunlight into soft, diffused beams that dance across the landscape.',
                alt: 'Dramatic clouds over rural landscape',
            },
            {
                image: 'https://images.unsplash.com/photo-1769755503719-bcb034b02bfd?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Light Through Clouds',
                text: 'Sunbeams breaking through cloud layers create ethereal crepuscular rays — nature\'s own spotlight illuminating the valleys and villages below.',
                alt: 'Sunbeams breaking through clouds over landscape',
            },
            {
                image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Moody Countryside',
                text: 'Cloudy weather adds depth and drama to Karnataka\'s already stunning countryside. The muted light brings out rich greens and earthy browns in the landscape.',
                alt: 'Cloudy sky over green countryside',
            },
        ],
        travel: [
            {
                destination: 'Hampi Ruins',
                image: 'https://images.pexels.com/photos/14514891/pexels-photo-14514891.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'Cloudy skies provide the perfect lighting for Hampi\'s ancient ruins — no harsh shadows, just the dramatic stones of Vijayanagara against a moody sky.',
                bestTime: 'November to February',
                tip: 'Cloudy days mean comfortable exploration — carry a light jacket',
            },
            {
                destination: 'Chikmagalur Coffee Trails',
                image: 'https://images.pexels.com/photos/11758101/pexels-photo-11758101.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'The coffee estates of Chikmagalur are at their most atmospheric under cloudy skies. Mist drifts between rows of coffee plants, creating a serene escape.',
                bestTime: 'June to September',
                tip: 'Take a plantation tour — the aroma of coffee in cool weather is unforgettable',
            },
            {
                destination: 'Badami Caves',
                image: 'https://images.pexels.com/photos/32236992/pexels-photo-32236992.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'The 6th-century rock-cut cave temples of Badami are best explored in cloud cover — the soft light reveals intricate carvings without glare.',
                bestTime: 'October to March',
                tip: 'Combine with Aihole and Pattadakal for a full heritage day',
            },
        ],
        tips: [
            'Perfect weather for long drives and outdoor exploration',
            'Carry a light jacket or shawl — temperatures drop under cloud cover',
            'Cloudy days offer the best photography lighting — no harsh shadows',
            'Ideal weather for trekking — not too hot, not too wet',
            'Visit viewpoints — clouds create dramatic layered landscapes',
        ],
    },

    Rainy: {
        title: 'Rainy',
        subtitle: 'Petrichor · Emerald green · Cascading falls',
        heroImage: 'https://images.unsplash.com/photo-1776675456831-95ccdaa8c907?fm=jpg&q=60&w=2000&auto=format&fit=crop',
        description: 'The monsoon transforms Karnataka into a lush, emerald paradise. Rivers swell, waterfalls roar, and the air is filled with the scent of wet earth.',
        cards: [
            {
                image: 'https://images.unsplash.com/photo-1750766515250-041d45e76021?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Monsoon Magic',
                text: 'The Western Ghats receive some of India\'s heaviest rainfall, transforming into a rainforest paradise. Every shade of green emerges as the landscape drinks deeply from the monsoon clouds.',
                alt: 'Lush green mountain landscape in monsoon',
            },
            {
                image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Thundering Falls',
                text: 'Jog Falls, the second-highest plunge waterfall in India, roars to life during the monsoon. The Sharavathi River swells, and the segmented cascade merges into one thundering curtain.',
                alt: 'Waterfall cascading during monsoon',
            },
            {
                image: 'https://images.unsplash.com/photo-1759220948579-aa4866af0f0d?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Rain-Washed Coast',
                text: 'Karnataka\'s coastline takes on a raw, wild beauty during the rains. Dramatic waves crash against cliffs, and the beaches are deserted — perfect for solitary walks.',
                alt: 'Rainy coastline with dramatic waves',
            },
        ],
        travel: [
            {
                destination: 'Jog Falls',
                image: 'https://images.pexels.com/photos/25841472/pexels-photo-25841472.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'At 830 feet, Jog Falls is at its most spectacular during the monsoon. The roar of water can be heard from miles away as the Sharavathi River plunges into the gorge.',
                bestTime: 'July to September',
                tip: 'Visit during July-August for peak water volume — absolutely breathtaking',
            },
            {
                destination: 'Agumbe Rainforest',
                image: 'https://images.pexels.com/photos/7867865/pexels-photo-7867865.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'Known as the "Cherrapunji of the South," Agumbe receives torrential rainfall that sustains dense rainforests, rare wildlife, and misty trails.',
                bestTime: 'June to August',
                tip: 'Carry leech socks and a good raincoat — trails get slippery',
            },
            {
                destination: 'Sakleshpur',
                image: 'https://images.pexels.com/photos/35659936/pexels-photo-35659936.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'The greenest place in Karnataka during monsoon. Sakleshpur\'s rolling hills, spice plantations, and the Manjarabad Fort emerge from the mist.',
                bestTime: 'July to September',
                tip: 'Take the Sakleshpur-Mangalore railway route for stunning views',
            },
        ],
        tips: [
            'Carry a quality raincoat and waterproof footwear — umbrellas are useless in wind',
            'Drive carefully — roads in the Western Ghats can be slippery',
            'Book accommodation in advance — monsoon is off-season but popular destinations fill up',
            'Perfect time for Ayurvedic treatments and spa retreats',
            'Pack quick-dry clothing and waterproof bags for electronics',
        ],
    },

    Stormy: {
        title: 'Stormy',
        subtitle: 'Thunder · Lightning · Raw power',
        heroImage: 'https://images.unsplash.com/photo-1767327837733-c049331752c3?fm=jpg&q=60&w=2000&auto=format&fit=crop',
        description: 'Nature unleashes its power. Electrical storms paint the sky, winds howl, and rain lashes the earth in a dramatic display of atmospheric energy.',
        cards: [
            {
                image: 'https://images.unsplash.com/photo-1768573488866-8e2985f0acff?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Electric Skies',
                text: 'Storm clouds stack high into the atmosphere, crackling with electrical energy. Lightning forks across the sky, illuminating the landscape in brief, brilliant flashes.',
                alt: 'Storm clouds over mountains with lightning',
            },
            {
                image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Wind and Rain',
                text: 'Gale-force winds bend trees and drive rain horizontally. The storm transforms Karnataka\'s landscape into a churning, wild spectacle that commands respect.',
                alt: 'Stormy weather with wind and rain',
            },
            {
                image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'After the Storm',
                text: 'As the storm passes, a profound stillness settles. The air is washed clean, and the sun breaks through, casting long golden rays over the drenched landscape.',
                alt: 'Sunlight breaking through after storm',
            },
        ],
        travel: [
            {
                destination: 'Coorg (Kodagu)',
                image: 'https://images.pexels.com/photos/1583207/pexels-photo-1583207.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'Storm season brings a raw energy to Coorg\'s coffee plantations. The rolling hills become a front-row seat to nature\'s most dramatic displays.',
                bestTime: 'June to August',
                tip: 'Stay in a homestay with large windows for safe storm viewing',
            },
            {
                destination: 'Karwar Coast',
                image: 'https://images.pexels.com/photos/34414701/pexels-photo-34414701.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'The coastline near Karwar experiences some of the most dramatic storms. Massive waves crash against ancient rocks as thunder rolls across the sea.',
                bestTime: 'June to August',
                tip: 'Never go near the water during a storm — stay at a safe cliffside vantage',
            },
            {
                destination: 'Kudremukh',
                image: 'https://images.pexels.com/photos/33839644/pexels-photo-33839644.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'The "Horse Face" peak of Kudremukh is surrounded by some of Karnataka\'s most intense storm activity, creating an unforgettable wilderness experience.',
                bestTime: 'July to September',
                tip: 'Only experienced trekkers should attempt trails during storm season',
            },
        ],
        tips: [
            'Stay indoors and away from windows during lightning',
            'Unplug electronic devices — power surges are common',
            'Avoid driving through flooded roads — turn around, don\'t drown',
            'Keep emergency supplies ready: flashlight, batteries, first-aid kit',
            'Stay updated with weather alerts from Karnataka State Natural Disaster Management',
        ],
    },

    Foggy: {
        title: 'Foggy',
        subtitle: 'Mist · Silence · Mystery',
        heroImage: 'https://images.unsplash.com/photo-1486911278844-a81c5267e227?fm=jpg&q=60&w=2000&auto=format&fit=crop',
        description: 'A dense blanket of fog rolls in, reducing visibility to mere metres. The world becomes soft, quiet, and surreal — a landscape painted in shades of grey.',
        cards: [
            {
                image: 'https://images.unsplash.com/photo-1771518701790-9094cc6bd106?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Veiled Landscapes',
                text: 'Fog wraps the Western Ghats in an ethereal embrace. Familiar hills and valleys disappear into a white sea, with only the closest trees and outlines visible.',
                alt: 'Misty road winding through foggy forest',
            },
            {
                image: 'https://images.unsplash.com/photo-1764618979779-f5a8abf6ab28?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Tea Gardens in the Mist',
                text: 'The tea and coffee plantations take on a ghostly beauty in foggy conditions. Neat rows of bushes fade into the white, creating a serene, meditative landscape.',
                alt: 'Misty tea plantation in foggy weather',
            },
            {
                image: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Stillness',
                text: 'Fog brings a profound hush to the countryside. Sounds are muffled, the wind dies, and the world holds its breath in a moment of perfect stillness.',
                alt: 'Foggy morning over a serene valley',
            },
        ],
        travel: [
            {
                destination: 'Coorg Misty Mornings',
                image: 'https://images.pexels.com/photos/35688870/pexels-photo-35688870.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'Coorg at dawn in foggy weather is a spiritual experience. Coffee estates disappear into mist, and the only sound is birdsong filtering through the fog.',
                bestTime: 'December to February',
                tip: 'Wake up at 5:30 AM for the most magical fog experience',
            },
            {
                destination: 'Kemmangundi',
                image: 'https://images.pexels.com/photos/13197241/pexels-photo-13197241.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'This hill station at 1,434 metres is frequently enveloped in fog, giving it an almost otherworldly atmosphere. The mist drifts through eucalyptus and silver oak plantations.',
                bestTime: 'November to February',
                tip: 'The Rose Garden is spectacular when viewed through morning mist',
            },
            {
                destination: 'Agumbe Sunset Point',
                image: 'https://images.pexels.com/photos/19583628/pexels-photo-19583628.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'Agumbe\'s famous sunset is made even more magical when fog rolls in from the Arabian Sea, filtering the light into a soft, golden haze.',
                bestTime: 'November to January',
                tip: 'Arrive an hour before sunset — the light changes dramatically by the minute',
            },
        ],
        tips: [
            'Drive with fog lights — visibility can drop below 50 metres',
            'Morning fog usually clears by 10-11 AM — plan activities accordingly',
            'Fog creates magical photography conditions — use a tripod for long exposures',
            'Wear warm layers — foggy conditions are colder than they look',
            'Perfect weather for coffee shop visits and cosy indoor activities',
        ],
    },

    Windy: {
        title: 'Windy',
        subtitle: 'Gusts · Movement · Energy',
        heroImage: 'https://images.unsplash.com/photo-1775489876620-6611994afd43?fm=jpg&q=60&w=2000&auto=format&fit=crop',
        description: 'Strong winds sweep across Karnataka, bending trees and whipping through valleys. The air is charged with energy and movement.',
        cards: [
            {
                image: 'https://images.unsplash.com/photo-1748671631643-87e9ce7aa917?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Wind-Swept Plains',
                text: 'The Deccan Plateau catches the full force of seasonal winds. Grass ripples like waves, dust devils spiral across the plains, and the sky streaks with fast-moving clouds.',
                alt: 'Wind-swept grassland under dramatic sky',
            },
            {
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Dancing Trees',
                text: 'Trees along Karnataka\'s wind corridors have learned to bend and sway with the gusts. Their contorted shapes tell the story of wind as a landscape-shaping force.',
                alt: 'Trees bending in strong wind',
            },
            {
                image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?fm=jpg&q=60&w=1200&auto=format&fit=crop',
                title: 'Dynamic Skies',
                text: 'Wind pushes clouds into dramatic formations — lenticular, cumulonimbus, and streaky cirrus create an ever-changing ceiling of art above Karnataka.',
                alt: 'Dramatic cloud formations in windy weather',
            },
        ],
        travel: [
            {
                destination: 'Dandeli River Rafting',
                image: 'https://images.pexels.com/photos/18759469/pexels-photo-18759469.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'Windy conditions add an extra thrill to white-water rafting on the Kali River. The gusts create challenging rapids that experienced rafters love.',
                bestTime: 'November to March',
                tip: 'Check with operators — some cancel in extreme wind conditions',
            },
            {
                destination: 'Nandi Hills Paragliding',
                image: 'https://images.pexels.com/photos/5922727/pexels-photo-5922727.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'Nandi Hills\' consistent thermals make it a paragliding hotspot. Windy days provide the lift needed for extended flights over the Deccan plateau.',
                bestTime: 'October to March',
                tip: 'Go early — wind conditions are most stable in the morning',
            },
            {
                destination: 'Mysore Dasara',
                image: 'https://images.pexels.com/photos/20064037/pexels-photo-20064037.jpeg?auto=compress&cs=tinysrgb&w=1200',
                description: 'The festive season in Mysore coincides with windy weather. Colourful flags and bunting whip in the breeze, adding energy to the already vibrant celebrations.',
                bestTime: 'September to October',
                tip: 'Windy weather keeps the heat down — perfect for festival exploration',
            },
        ],
        tips: [
            'Secure loose items on balconies and rooftops',
            'Wear wrap-around sunglasses to protect eyes from dust',
            'Wind chill can make it feel colder than the thermometer reads — dress accordingly',
            'Great weather for kite flying and wind sports',
            'Avoid burning trash or open fires — wind spreads flames rapidly',
        ],
    },
}
