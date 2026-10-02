import { Destination, Attraction } from '@/types';

export const COMPREHENSIVE_DESTINATIONS: Destination[] = [
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'Delhi / NCR',
    shortDescription: 'India’s historic capital blending imperial Mughal architecture with wide neoclassical avenues.',
    detailedDescription: 'Delhi bridges ancient and modern India: the 17th-century walled city of Shahjahanabad with its red sandstone fortresses, and New Delhi designed with stately government boulevards and landscaped gardens.',
    recommendedDuration: '2–3 Days',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    shortDescription: 'City of the immortal Taj Mahal, Agra Fort, and sublime Mughal royal gardens along the Yamuna.',
    detailedDescription: 'The former seat of the Mughal Empire at its zenith, renowned for white marble inlay pietra dura craftsmanship, imperial fortresses, and romantic riverside pavilions.',
    recommendedDuration: '1–2 Days',
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'fatehpur-sikri',
    name: 'Fatehpur Sikri',
    state: 'Uttar Pradesh',
    shortDescription: 'Emperor Akbar’s magnificent red sandstone ghost capital and the towering Buland Darwaza.',
    detailedDescription: 'Founded in 1571 by Emperor Akbar, this UNESCO World Heritage city features palatial courtyards, the white marble tomb of Sufi saint Salim Chishti, and the world’s highest ceremonial gateway.',
    recommendedDuration: 'Half Day / En Route',
    heroImage: 'https://images.unsplash.com/photo-1600100397608-f010f44383a1?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    shortDescription: 'The royal Pink City of palaces, hilltop fortresses, and colorful artisan bazaars.',
    detailedDescription: 'Capital of Rajasthan founded in 1727 by Maharaja Sawai Jai Singh II. Famous for Amber Fort, Hawa Mahal, City Palace, astronomical Jantar Mantar, and vibrant textile handicrafts.',
    recommendedDuration: '2–3 Days',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'mathura-vrindavan',
    name: 'Mathura & Vrindavan',
    state: 'Uttar Pradesh',
    shortDescription: 'Sacred birthplace of Lord Krishna along the Yamuna with centuries of bhakti devotion and illuminated temples.',
    detailedDescription: 'One of Hinduism’s holiest twin pilgrimage towns, featuring Krishna Janmabhoomi, the ornate Italian marble Prem Mandir, and Banke Bihari Temple.',
    recommendedDuration: '1 Day',
    heroImage: 'https://images.unsplash.com/photo-1609137144822-26d9c6c21e35?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur',
    state: 'Rajasthan',
    shortDescription: 'The majestic Blue City crowned by the towering cliffside ramparts of Mehrangarh Fort.',
    detailedDescription: 'Known for indigo-hued houses, the sprawling Mehrangarh Fort museum, cenotaphs of Jaswant Thada, and royal art deco Umaid Bhawan Palace.',
    recommendedDuration: '1–2 Days',
    heroImage: 'https://images.unsplash.com/photo-1574950578143-858c6fc58922?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    shortDescription: 'The Venice of the East, famed for shimmering Lake Pichola and white marble island palaces.',
    detailedDescription: 'Set against the ancient Aravalli Hills, Udaipur offers spectacular palaces, tranquil sunset boat cruises, and royal Mewar heritage.',
    recommendedDuration: '2–3 Days',
    heroImage: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'jaisalmer',
    name: 'Jaisalmer',
    state: 'Rajasthan',
    shortDescription: 'The Golden City rising out of the Thar Desert with its living fort and rolling sand dunes.',
    detailedDescription: 'Famous for Sonar Qila, carved sandstone havelis, desert camps under starlit skies, and camel safaris across the Sam sand dunes.',
    recommendedDuration: '2 Days',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'pushkar',
    name: 'Pushkar',
    state: 'Rajasthan',
    shortDescription: 'Spiritual oasis centered around the holy Pushkar Lake and the rare 14th-century Lord Brahma Temple.',
    detailedDescription: 'A pilgrimage destination nestled around a sacred lake with 52 bathing ghats, rose flower plantations, vibrant bazaars, and scenic desert hills.',
    recommendedDuration: '1–2 Days',
    heroImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'ranthambore',
    name: 'Ranthambore',
    state: 'Rajasthan',
    shortDescription: 'World-famous Royal Bengal Tiger sanctuary with 10th-century jungle fortress ruins.',
    detailedDescription: 'One of Northern India’s largest national parks, offering thrilling open-top 4x4 Gypsy safaris to spot wild Bengal tigers, leopards, crocodiles, and exotic birds.',
    recommendedDuration: '2 Days',
    heroImage: 'https://images.unsplash.com/photo-1547970810-dc1eac8161a7?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'bikaner',
    name: 'Bikaner',
    state: 'Rajasthan',
    shortDescription: 'Desert fortress city celebrated for Junagarh Fort, camel breeding, and heritage havelis.',
    detailedDescription: 'An imposing desert settlement with an undefeated red sandstone fort, the historic Karni Mata temple, and savory Rajasthani delicacies.',
    recommendedDuration: '1–2 Days',
    heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    shortDescription: 'Spiritual capital of India on the sacred Ganges with mystical evening aarti ceremonies.',
    detailedDescription: 'One of the world’s oldest continuously inhabited cities, celebrated for Dashashwamedh Ghat aarti, sunrise boat rides, Kashi Vishwanath temple, and silk weaving.',
    recommendedDuration: '2–3 Days',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    shortDescription: 'Spiritual heart of Sikhism with the resplendent Golden Temple and patriotic Wagah Border ceremony.',
    detailedDescription: 'Home to Sri Harmandir Sahib, communal langar dining serving tens of thousands daily, Jallianwala Bagh, and vibrant Punjabi culture.',
    recommendedDuration: '2 Days',
    heroImage: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    shortDescription: 'The Queen of Hills, former summer capital of British India surrounded by pine and cedar forests.',
    detailedDescription: 'Charming colonial pedestrian avenues on the Ridge and Mall Road, panoramic Himalayan vistas, Jakhoo Hill, and the toy train railway.',
    recommendedDuration: '2–3 Days',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    shortDescription: 'Alpine adventure haven along the Beas River, gateway to Solang Valley, Rohtang Pass, and Atal Tunnel.',
    detailedDescription: 'Famous for snow sports, pine forests, apple orchards, river rafting, ancient Hadimba Temple, and high-altitude mountain passes.',
    recommendedDuration: '3–4 Days',
    heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'dharamshala',
    name: 'Dharamshala & McLeodGanj',
    state: 'Himachal Pradesh',
    shortDescription: 'Residence of His Holiness the Dalai Lama amidst deodar forests and the towering Dhauladhar mountains.',
    detailedDescription: 'Center of Tibetan culture in exile with peaceful monasteries, meditation retreats, mountain hiking trails, and the picturesque HPCA cricket stadium.',
    recommendedDuration: '2–3 Days',
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'srinagar',
    name: 'Srinagar',
    state: 'Jammu & Kashmir',
    shortDescription: 'Paradise on Earth with luxury Dal Lake houseboats, terraced Mughal gardens, and snow-capped peaks.',
    detailedDescription: 'Experience serene wooden Shikara cruises, floating vegetable markets, century-old Mughal pleasure gardens, and exquisite Kashmiri pashmina handicrafts.',
    recommendedDuration: '3–4 Days',
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'gulmarg',
    name: 'Gulmarg',
    state: 'Jammu & Kashmir',
    shortDescription: 'Meadow of Flowers featuring the world’s highest operating cable car and premier snow ski slopes.',
    detailedDescription: 'High-altitude mountain resort renowned for the two-phase Gulmarg Gondola riding up to 14,000 feet atop Apharwat Peak, pine-covered meadows, and alpine skiing.',
    recommendedDuration: '1–2 Days',
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'pahalgam',
    name: 'Pahalgam',
    state: 'Jammu & Kashmir',
    shortDescription: 'Valley of Shepherds with gushing Lidder River, pine forests, and scenic Betaab and Aru valleys.',
    detailedDescription: 'Pristine mountain valley celebrated for trout fishing, pony treks to Baisaran Meadow (Mini Switzerland), and scenic alpine meadows.',
    recommendedDuration: '1–2 Days',
    heroImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    shortDescription: 'Yoga capital of the world on the emerald banks of the holy Ganges at the Himalayan foothills.',
    detailedDescription: 'World-renowned destination for spiritual yoga ashrams, suspension footbridges, evening Ganga Aarti at Triveni Ghat, and white-water river rafting.',
    recommendedDuration: '2 Days',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'haridwar',
    name: 'Haridwar',
    state: 'Uttarakhand',
    shortDescription: 'Ancient holy gateway where the sacred River Ganges emerges from the Himalayas onto the Indo-Gangetic plains.',
    detailedDescription: 'Famous for the spectacular evening Maha Aarti at Har Ki Pauri where thousands of illuminated leaf diyas float down the swift Ganges currents.',
    recommendedDuration: '1 Day',
    heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'bharatpur',
    name: 'Bharatpur',
    state: 'Rajasthan',
    shortDescription: 'UNESCO-listed Keoladeo Ghana National Park wetland sanctuary and bird paradise.',
    detailedDescription: 'World-renowned wetlands sanctuary hosting over 370 species of resident and migratory waterbirds, best explored by quiet cycle rickshaw with certified naturalists.',
    recommendedDuration: '1 Day',
    heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    shortDescription: 'The vibrant City of Dreams, financial hub of India featuring colonial Victorian Gothic heritage and Marine Drive.',
    detailedDescription: 'From the Gateway of India to the grand Chhatrapati Shivaji Maharaj Terminus, Bollywood studios, and sunset strolls along the Arabian Sea.',
    recommendedDuration: '2–3 Days',
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    shortDescription: 'Sun-drenched coastal haven of golden beaches, Portuguese heritage churches, and tropical susegad lifestyle.',
    detailedDescription: 'Featuring UNESCO-listed Old Goa cathedrals, seaside forts, thrilling water sports, and tranquil coconut palm-fringed backwaters.',
    recommendedDuration: '3–4 Days',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  },
  {
    id: 'kerala',
    name: 'Kerala (Munnar & Alleppey)',
    state: 'Kerala',
    shortDescription: 'God’s Own Country with misty Munnar tea plantations and serene Alleppey backwater houseboats.',
    detailedDescription: 'Experience rolling emerald tea estates, spice gardens, Ayurvedic rejuvenation, and leisurely overnight cruises aboard traditional thatched Kettuvallam houseboats.',
    recommendedDuration: '3–5 Days',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  }
];

export const COMPREHENSIVE_ATTRACTIONS: Attraction[] = [
  // ==========================================
  // DELHI
  // ==========================================
  {
    id: 'delhi-qutub',
    destinationId: 'delhi',
    destinationName: 'Delhi',
    name: 'Qutub Minar Complex',
    shortDescription: 'UNESCO-listed 72.5-meter fluted red sandstone minaret and 4th-century rust-proof Iron Pillar.',
    detailedDescription: 'Built in 1192 AD by Qutb-ud-din Aibak, the complex showcases Indo-Islamic architecture, Quranic calligraphy, and the ancient Iron Pillar of Chandragupta II.',
    duration: '1.5–2 Hours',
    category: 'Monument & Heritage',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'delhi-humayun',
    destinationId: 'delhi',
    destinationName: 'Delhi',
    name: 'Humayun’s Tomb',
    shortDescription: 'Sublime 16th-century Mughal garden tomb that inspired the design of the Taj Mahal.',
    detailedDescription: 'UNESCO World Heritage monument surrounded by formal Persian-style Charbagh water gardens, featuring red sandstone walls inlaid with delicate white marble.',
    duration: '1.5 Hours',
    category: 'Mughal Monument',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'delhi-india-gate',
    destinationId: 'delhi',
    destinationName: 'Delhi',
    name: 'India Gate & Kartavya Path',
    shortDescription: 'Iconic 42-meter triumphal war memorial arch and grand ceremonial boulevard.',
    detailedDescription: 'Designed by Sir Edwin Lutyens honoring Indian soldiers of World War I. Beautifully illuminated in the evening with landscaped lawns and fountains.',
    duration: '45 Minutes',
    category: 'National Memorial',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'delhi-red-fort',
    destinationId: 'delhi',
    destinationName: 'Delhi',
    name: 'Red Fort (Lal Qila)',
    shortDescription: 'Imposing octagonal red sandstone fortress of Shah Jahan and historic seat of Mughal power.',
    detailedDescription: 'UNESCO World Heritage citadel encompassing Diwan-i-Aam, Diwan-i-Khas, Moti Masjid, and royal bath pavilions along the Yamuna bank.',
    duration: '2 Hours',
    category: 'Historic Fortress',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'delhi-lotus',
    destinationId: 'delhi',
    destinationName: 'Delhi',
    name: 'Lotus Temple (Baháʼí House of Worship)',
    shortDescription: 'World-famous lotus flower-shaped marble temple welcoming people of all faiths for silent meditation.',
    detailedDescription: 'Engineered with 27 free-standing white marble petals surrounded by nine tranquil ponds. A serene sanctuary of universal peace.',
    duration: '1 Hour',
    category: 'Architectural Shrine',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'delhi-akshardham',
    destinationId: 'delhi',
    destinationName: 'Delhi',
    name: 'Swaminarayan Akshardham Temple',
    shortDescription: 'Colossal intricately carved pink sandstone and Italian Carrara marble temple with musical water fountain.',
    detailedDescription: 'Showcases millennia of traditional Indian art, culture, and spirituality through intricate stone carvings of deities, dancers, and flora.',
    duration: '2.5 Hours',
    category: 'Spiritual Complex',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1609137144822-26d9c6c21e35?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'delhi-chandni-chowk',
    destinationId: 'delhi',
    destinationName: 'Delhi',
    name: 'Chandni Chowk & Old Delhi Rickshaw Tour',
    shortDescription: 'Atmospheric rickshaw safari through 350-year-old spice markets, silver bazaars, and street food lanes.',
    detailedDescription: 'Experience the kinetic energy of Old Delhi, visiting Khari Baoli (Asia’s largest spice market), Kinari Bazaar, and sampling traditional parathas and jalebis.',
    duration: '2 Hours',
    category: 'Cultural Activity',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'delhi-jama-masjid',
    destinationId: 'delhi',
    destinationName: 'Delhi',
    name: 'Jama Masjid & Raj Ghat Memorial',
    shortDescription: 'One of the largest mosques in India built by Shah Jahan, followed by the tranquil riverside Gandhi memorial.',
    detailedDescription: 'Marvel at the sweeping courtyard accommodating 25,000 worshippers, towering minarets, and pay respects at Mahatma Gandhi’s black marble memorial at Raj Ghat.',
    duration: '1.5 Hours',
    category: 'Historic Monument',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // AGRA
  // ==========================================
  {
    id: 'agra-taj-mahal',
    destinationId: 'agra',
    destinationName: 'Agra',
    name: 'Taj Mahal (Sunrise / Daytime Tour)',
    shortDescription: 'Pinnacle of Mughal architecture and UNESCO World Wonder in pure white Makrana marble.',
    detailedDescription: 'Commissioned in 1632 by Emperor Shah Jahan in memory of his beloved empress Mumtaz Mahal. Celebrated for luminous marble domes, floral pietra dura inlays, and reflective pools.',
    duration: '2.5–3 Hours',
    category: 'World Wonder & Monument',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'agra-fort',
    destinationId: 'agra',
    destinationName: 'Agra',
    name: 'Agra Fort (Lal Qila of Agra)',
    shortDescription: 'Grand 16th-century imperial red sandstone and marble fortress overlooking the Yamuna River.',
    detailedDescription: 'The primary residence of the Mughal emperors until 1638. Encloses Jahangiri Mahal, Khas Mahal, the mirror-inlaid Sheesh Mahal, and the balcony where Shah Jahan was imprisoned.',
    duration: '2 Hours',
    category: 'Imperial Fortress',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'agra-mehtab-bagh',
    destinationId: 'agra',
    destinationName: 'Agra',
    name: 'Mehtab Bagh (Moonlight Garden Sunset Taj View)',
    shortDescription: 'Charbagh garden complex across the Yamuna River offering iconic crowd-free sunset views of the Taj.',
    detailedDescription: 'Aligned symmetrically with the Taj Mahal across the river, this garden provides a tranquil vantage point to witness the marble monument glow golden at dusk.',
    duration: '1 Hour',
    category: 'Royal Garden & Sunset View',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'agra-itmad-ud-daulah',
    destinationId: 'agra',
    destinationName: 'Agra',
    name: 'Tomb of I’timād-ud-Daulah (Baby Taj)',
    shortDescription: 'Intricate marble jewel-box mausoleum preceding the Taj Mahal in delicate floral inlay craftsmanship.',
    detailedDescription: 'Built by Empress Nur Jahan for her father between 1622 and 1628. Marked the historic architectural transition from red sandstone to white marble.',
    duration: '1 Hour',
    category: 'Mughal Mausoleum',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'agra-sikandra',
    destinationId: 'agra',
    destinationName: 'Agra',
    name: 'Akbar’s Tomb at Sikandra',
    shortDescription: 'Grand multi-tiered red sandstone and white marble mausoleum of Emperor Akbar surrounded by deer gardens.',
    detailedDescription: 'A unique architectural hybrid of Hindu, Islamic, Buddhist, and Jain styles featuring four minarets and expansive peaceful gardens.',
    duration: '1 Hour',
    category: 'Historic Monument',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // FATEHPUR SIKRI
  // ==========================================
  {
    id: 'fs-buland-darwaza',
    destinationId: 'fatehpur-sikri',
    destinationName: 'Fatehpur Sikri',
    name: 'Buland Darwaza & Sheikh Salim Chishti Shrine',
    shortDescription: 'The 54-meter high Gate of Magnificence and the white marble Sufi shrine of Sheikh Salim Chishti.',
    detailedDescription: 'Built in 1601 by Akbar to commemorate his victory over Gujarat. Features a soaring arched portal, Persian calligraphy, and the sacred tomb with pierced marble lattice jali screens.',
    duration: '1.5 Hours',
    category: 'UNESCO Monumental Gate',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1600100397608-f010f44383a1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fs-palace-complex',
    destinationId: 'fatehpur-sikri',
    destinationName: 'Fatehpur Sikri',
    name: 'Fatehpur Sikri Royal Palaces & Panch Mahal',
    shortDescription: 'Akbar’s five-story tiered pillared pavilion, Diwan-i-Khas central carved pillar, and Anup Talao pool.',
    detailedDescription: 'A marvel of secular Mughal palace architecture where Akbar engaged with scholars of all faiths around the iconic central carved lotus pillar of the Hall of Private Audience.',
    duration: '1.5 Hours',
    category: 'Historic Palace Complex',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // JAIPUR
  // ==========================================
  {
    id: 'jaipur-amber-fort',
    destinationId: 'jaipur',
    destinationName: 'Jaipur',
    name: 'Amber Fort & Palace (Amer Fort)',
    shortDescription: 'Majestic hilltop Rajput fortress with mirror-studded Sheesh Mahal overlooking Maota Lake.',
    detailedDescription: 'A UNESCO World Heritage hill fort built by Raja Man Singh I. Features multi-tiered courtyards, marble corridors, Diwan-i-Aam, and the world-renowned Palace of Mirrors.',
    duration: '2.5 Hours',
    category: 'Hill Fortress & Palace',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaipur-hawa-mahal',
    destinationId: 'jaipur',
    destinationName: 'Jaipur',
    name: 'Hawa Mahal (Palace of Winds)',
    shortDescription: 'Iconic 5-story pink honeycomb facade featuring 953 delicately carved jharokha lattice windows.',
    detailedDescription: 'Constructed in 1799 by Maharaja Sawai Pratap Singh so royal women could observe festive street processions without being seen from outside.',
    duration: '45 Minutes',
    category: 'Palace Facade & Monument',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaipur-city-palace',
    destinationId: 'jaipur',
    destinationName: 'Jaipur',
    name: 'City Palace, Jaipur',
    shortDescription: 'Living royal residence of the Maharaja of Jaipur featuring the ornate Peacock Gate courtyards.',
    detailedDescription: 'A blend of Rajasthani and Mughal court architecture, housing the Maharaja Sawai Man Singh II Museum, silver urns (Gangajalis), and royal weapon galleries.',
    duration: '2 Hours',
    category: 'Royal Palace Complex',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaipur-jantar-mantar',
    destinationId: 'jaipur',
    destinationName: 'Jaipur',
    name: 'Jantar Mantar Astronomical Observatory',
    shortDescription: '18th-century UNESCO stone observatory housing the world’s largest stone sundial (Samrat Yantra).',
    detailedDescription: 'Collection of 19 monumental geometric instruments designed by astronomer-king Sawai Jai Singh II to measure time and predict eclipses with millimeter precision.',
    duration: '1 Hour',
    category: 'Astronomical Monument',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaipur-jal-mahal',
    destinationId: 'jaipur',
    destinationName: 'Jaipur',
    name: 'Jal Mahal (Water Palace Photo Stop)',
    shortDescription: 'Yellow sandstone Rajput palace floating gracefully in the center of Man Sagar Lake.',
    detailedDescription: 'Built in the 1750s as a royal shooting lodge. Four of its five storeys remain submerged under water, creating an enchanting reflection against the Aravalli hills.',
    duration: '30 Minutes',
    category: 'Lake Palace',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaipur-nahargarh',
    destinationId: 'jaipur',
    destinationName: 'Jaipur',
    name: 'Nahargarh Fort & Sunset Viewpoint',
    shortDescription: 'Ridgetop fortress offering breathtaking 360-degree sunset panoramas over the entire Pink City.',
    detailedDescription: 'Formed a northern defense barrier alongside Jaigarh and Amber. Features the Madhavendra Bhawan with interconnected royal suites for nine queens.',
    duration: '1.5 Hours',
    category: 'Fort & Panoramic View',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1574950578143-858c6fc58922?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaipur-chokhi-dhani',
    destinationId: 'jaipur',
    destinationName: 'Jaipur',
    name: 'Chokhi Dhani Ethnic Cultural Village',
    shortDescription: 'Traditional Rajasthani fair with folk music, Kalbeliya dance, puppet shows, and royal thali dining.',
    detailedDescription: 'An evening celebration of village traditions featuring camel rides, acrobatics, potters at work, and an authentic sit-down feast served with pure ghee.',
    duration: '3 Hours',
    category: 'Cultural Evening & Dinner',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaipur-patrika-gate',
    destinationId: 'jaipur',
    destinationName: 'Jaipur',
    name: 'Patrika Gate & Albert Hall Museum',
    shortDescription: 'Vibrantly hand-painted architectural gateway and Rajasthan’s oldest museum building.',
    detailedDescription: 'Each archway of Patrika Gate portrays historical eras of Rajasthan in vivid fresco. Albert Hall showcases Indo-Saracenic design and royal artifacts.',
    duration: '1.5 Hours',
    category: 'Heritage & Museum',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // MATHURA & VRINDAVAN
  // ==========================================
  {
    id: 'mv-janmabhoomi',
    destinationId: 'mathura-vrindavan',
    destinationName: 'Mathura & Vrindavan',
    name: 'Shri Krishna Janmabhoomi Temple',
    shortDescription: 'Sacred prison cell sanctum (Garbha Griha) marking the birth site of Lord Krishna.',
    detailedDescription: 'A pilgrimage site attracting millions, featuring intricate stone carvings, temple courtyards, and deep spiritual heritage along the Yamuna.',
    duration: '1.5 Hours',
    category: 'Pilgrimage Shrine',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1609137144822-26d9c6c21e35?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mv-prem-mandir',
    destinationId: 'mathura-vrindavan',
    destinationName: 'Mathura & Vrindavan',
    name: 'Prem Mandir Vrindavan',
    shortDescription: 'Magnificent white Italian marble temple with illuminated life-sized Krishna leela tableaux.',
    detailedDescription: 'Renowned for exquisite marble carvings depicting Radha Krishna pastimes, landscaped gardens, and a synchronized evening musical fountain show.',
    duration: '1.5 Hours',
    category: 'Spiritual Monument',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mv-banke-bihari',
    destinationId: 'mathura-vrindavan',
    destinationName: 'Mathura & Vrindavan',
    name: 'Banke Bihari Temple Vrindavan',
    shortDescription: 'One of the most revered Krishna temples in India known for spontaneous bhakti singing and curtain darshan.',
    detailedDescription: 'Established by Swami Haridas, the deity of Banke Bihari stands in the Tribhanga posture. The temple echoes with devotional joy and vibrant flowers.',
    duration: '1 Hour',
    category: 'Sacred Temple',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1609137144822-26d9c6c21e35?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mv-iskcon',
    destinationId: 'mathura-vrindavan',
    destinationName: 'Mathura & Vrindavan',
    name: 'ISKCON Krishna Balaram Temple',
    shortDescription: 'White marble international Vedic temple complex famed for melodious 24-hour Hare Krishna kirtan.',
    detailedDescription: 'One of Vrindavan’s primary spiritual centers, featuring ornate deity altars, Prabhupada Samadhi, and serene courtyards with devotional music.',
    duration: '1 Hour',
    category: 'Pilgrimage Temple',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1609137144822-26d9c6c21e35?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // JODHPUR
  // ==========================================
  {
    id: 'jodhpur-mehrangarh',
    destinationId: 'jodhpur',
    destinationName: 'Jodhpur',
    name: 'Mehrangarh Fort',
    shortDescription: 'Formidable fortress perched 400 feet above the Blue City on perpendicular cliff ramparts.',
    detailedDescription: 'One of India’s best preserved forts, built in 1459 by Rao Jodha. Houses an armory, royal palanquin gallery, miniature paintings, and sweeping blue city views.',
    duration: '2.5 Hours',
    category: 'Hill Fortress & Museum',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1574950578143-858c6fc58922?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jodhpur-jaswant-thada',
    destinationId: 'jodhpur',
    destinationName: 'Jodhpur',
    name: 'Jaswant Thada (Taj of Marwar)',
    shortDescription: 'Delicate white marble cenotaph memorial built in 1899 with carved gazebos and tier gardens.',
    detailedDescription: 'Crafted from thin sheets of Makrana marble that emit a warm golden glow when sunlight passes through. Overlooks a serene desert lake.',
    duration: '1 Hour',
    category: 'Royal Memorial',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jodhpur-umaid-bhawan',
    destinationId: 'jodhpur',
    destinationName: 'Jodhpur',
    name: 'Umaid Bhawan Palace & Heritage Museum',
    shortDescription: 'One of the world’s largest private royal residences built in golden Chittar sandstone.',
    detailedDescription: 'Designed by British architect Henry Lanchester in art deco style. Features 347 rooms, manicured gardens, vintage car collections, and royal museum galleries.',
    duration: '1.5 Hours',
    category: 'Palace Museum',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1574950578143-858c6fc58922?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jodhpur-mandore',
    destinationId: 'jodhpur',
    destinationName: 'Jodhpur',
    name: 'Mandore Gardens & Royal Cenotaphs',
    shortDescription: 'Ancient capital of Marwar featuring towering rock cenotaphs, high-rock temples, and lush gardens.',
    detailedDescription: 'A peaceful botanical sanctuary holding the intricately carved stone devals of Jodhpur’s erstwhile rulers alongside troop of friendly langur monkeys.',
    duration: '1.5 Hours',
    category: 'Heritage Gardens',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1574950578143-858c6fc58922?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jodhpur-blue-city-walk',
    destinationId: 'jodhpur',
    destinationName: 'Jodhpur',
    name: 'Blue City Walking Tour & Clock Tower Bazaar',
    shortDescription: 'Guided walk through indigo-washed Brahmin alleys, spice emporiums, and the Sadar Bazaar clock tower.',
    detailedDescription: 'Immerse yourself in authentic old Jodhpur, sampling authentic mirchi vadas, mawa kachori, and photographing vivid indigo-painted courtyards.',
    duration: '1.5 Hours',
    category: 'Cultural Walk',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1574950578143-858c6fc58922?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // UDAIPUR
  // ==========================================
  {
    id: 'udaipur-city-palace',
    destinationId: 'udaipur',
    destinationName: 'Udaipur',
    name: 'City Palace Complex & Crystal Gallery',
    shortDescription: 'Rajasthan’s largest palace complex perched over the azure waters of Lake Pichola.',
    detailedDescription: 'Built over 400 years by the rulers of Mewar, combining Rajput and Mughal architectural styles with marble balconies, mirror inlays, and wall murals.',
    duration: '2.5 Hours',
    category: 'Palace Complex',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'udaipur-pichola-boat',
    destinationId: 'udaipur',
    destinationName: 'Udaipur',
    name: 'Lake Pichola Sunset Boat Cruise & Jag Mandir',
    shortDescription: 'Scenic boat cruise past the floating Taj Lake Palace to the island pleasure palace of Jag Mandir.',
    detailedDescription: 'Glide past the white ghats and royal palaces of Udaipur at golden hour, disembarking at Jag Mandir island with its carved stone elephant sentinels.',
    duration: '1.5 Hours',
    category: 'Scenic Boat Cruise',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'udaipur-saheliyon-ki-bari',
    destinationId: 'udaipur',
    destinationName: 'Udaipur',
    name: 'Saheliyon-ki-Bari (Courtyard of Maidens)',
    shortDescription: 'Ornamental royal gardens featuring marble elephant fountains, lotus pools, and pavilions.',
    detailedDescription: 'Built in the 18th century by Maharana Sangram Singh for the queen and her 48 royal attendants to relax away from court politics.',
    duration: '1 Hour',
    category: 'Historic Gardens',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'udaipur-bagore-ki-haveli',
    destinationId: 'udaipur',
    destinationName: 'Udaipur',
    name: 'Bagore Ki Haveli & Dharohar Folk Dance Show',
    shortDescription: '18th-century lakeside haveli at Gangaur Ghat hosting an evening Rajasthani folk dance and puppet performance.',
    detailedDescription: 'Features energetic Chari fire dancers, Kalbeliya serpent movements, and the world record Bhavai dancer balancing 11 brass pots on her head.',
    duration: '1.5 Hours',
    category: 'Cultural Dance Show',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'udaipur-monsoon-palace',
    destinationId: 'udaipur',
    destinationName: 'Udaipur',
    name: 'Sajjangarh Monsoon Palace Sunset Lookout',
    shortDescription: 'High hilltop white palace perched 3,100 feet above sea level with sweeping sunset vistas over lakes.',
    detailedDescription: 'Constructed by Maharana Sajjan Singh to track monsoon clouds, offering peerless panoramic views across the Udaipur basin and Aravalli mountain ranges.',
    duration: '1.5 Hours',
    category: 'Hilltop Palace & Sunset',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // JAISALMER
  // ==========================================
  {
    id: 'jaisalmer-fort',
    destinationId: 'jaisalmer',
    destinationName: 'Jaisalmer',
    name: 'Jaisalmer Fort (Sonar Qila / Golden Fort)',
    shortDescription: 'A living UNESCO World Heritage golden sandstone fortress housing one-fourth of the old city.',
    detailedDescription: 'Built in 1156 AD by Rawal Jaisal. Wander through narrow lanes of merchant havelis, carved 12th-century Jain temples, and rooftop cannon bastions.',
    duration: '2.5 Hours',
    category: 'Living Hill Fort',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaisalmer-sam-dunes',
    destinationId: 'jaisalmer',
    destinationName: 'Jaisalmer',
    name: 'Sam Sand Dunes Camel Safari & Desert Camp',
    shortDescription: 'Sunset camel trek across Thar Desert ripple dunes followed by folk dance and campfire dinner.',
    detailedDescription: 'Ride across shifting golden sand dunes, watch desert sunsets, enjoy Kalbeliya tribal songs, and sleep in Swiss tents under star-studded skies.',
    duration: '4 Hours',
    category: 'Desert Adventure & Camp',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaisalmer-patwon-haveli',
    destinationId: 'jaisalmer',
    destinationName: 'Jaisalmer',
    name: 'Patwon Ki Haveli & Salim Singh Haveli',
    shortDescription: 'Cluster of carved yellow sandstone merchant havelis with intricate stone jharokhas.',
    detailedDescription: 'Built over 50 years by a wealthy merchant family, showcasing the finest stone filigree carving and antique mirror frescoes in Rajasthan.',
    duration: '1.5 Hours',
    category: 'Heritage Haveli',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaisalmer-gadisar-lake',
    destinationId: 'jaisalmer',
    destinationName: 'Jaisalmer',
    name: 'Gadisar Lake & Desert Cultural Centre',
    shortDescription: 'Scenic 14th-century rainwater reservoir surrounded by carved yellow sandstone shrines and ghats.',
    detailedDescription: 'Offers peaceful boat rides among yellow stone cenotaphs rising from the water, migratory birds, and the famous Tillon Ki Pol carved gateway.',
    duration: '1 Hour',
    category: 'Scenic Lake & Shrines',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // PUSHKAR
  // ==========================================
  {
    id: 'pushkar-brahma-temple',
    destinationId: 'pushkar',
    destinationName: 'Pushkar',
    name: 'Jagatpita Brahma Temple',
    shortDescription: 'One of the very few surviving temples in the world dedicated to Lord Brahma the Creator.',
    detailedDescription: 'Dating back to the 14th century with marble steps, silver coin inlays, and a red spire, serving as the central pilgrim shrine of Pushkar.',
    duration: '1 Hour',
    category: 'Rare Pilgrim Temple',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pushkar-lake-ghats',
    destinationId: 'pushkar',
    destinationName: 'Pushkar',
    name: 'Pushkar Holy Lake & 52 Bathing Ghats',
    shortDescription: 'Sacred desert lake believed to have appeared where Lord Brahma dropped a lotus petal.',
    detailedDescription: 'Surrounded by whitewashed temples and 52 ghats where pilgrims perform prayers and evening chants echo across the calm water.',
    duration: '1 Hour',
    category: 'Sacred Water Shrine',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pushkar-savitri-temple',
    destinationId: 'pushkar',
    destinationName: 'Pushkar',
    name: 'Savitri Devi Temple & Ratnagiri Hill Ropeway',
    shortDescription: 'Hilltop shrine reachable by scenic ropeway cable car offering birds-eye views of the sacred town and Thar desert.',
    detailedDescription: 'Dedicated to Goddess Savitri, Lord Brahma’s consort. A premier spot for early sunrise and late afternoon panoramas.',
    duration: '1.5 Hours',
    category: 'Hilltop Temple & Cable Car',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // RANTHAMBORE
  // ==========================================
  {
    id: 'ranthambore-tiger-safari',
    destinationId: 'ranthambore',
    destinationName: 'Ranthambore',
    name: 'Ranthambore Jungle Safari (Zones 1–5 / 6–10)',
    shortDescription: 'Open-top 4x4 Gypsy tiger tracking safari through dry deciduous forests and lake ruins.',
    detailedDescription: 'One of the best places in the world to observe wild Royal Bengal tigers hunting around ancient banyan trees, lakes, and cenotaph ruins.',
    duration: '3.5 Hours',
    category: 'Wildlife Tiger Safari',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac8161a7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ranthambore-fort',
    destinationId: 'ranthambore',
    destinationName: 'Ranthambore',
    name: 'Ranthambore Fort & Trinetra Ganesh Temple',
    shortDescription: '10th-century UNESCO cliff fortress surrounded by the wildlife park, home to the three-eyed Ganesh temple.',
    detailedDescription: 'Provides sweeping views of the national park lakes and tiger reserve forests below, with thousands of pilgrims mailing wedding invites to the deity.',
    duration: '2 Hours',
    category: 'UNESCO Forest Fort',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac8161a7?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // BIKANER
  // ==========================================
  {
    id: 'bikaner-junagarh-fort',
    destinationId: 'bikaner',
    destinationName: 'Bikaner',
    name: 'Junagarh Fort & Museum Complex',
    shortDescription: 'Imposing 16th-century red sandstone fortress that was never conquered in history.',
    detailedDescription: 'Built by Raja Rai Singh, housing lavishly decorated royal apartments: Anup Mahal with gold leaf lacquer, Badal Mahal depicting rain clouds, and Karan Mahal.',
    duration: '2 Hours',
    category: 'Unconquered Fortress',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bikaner-karni-mata',
    destinationId: 'bikaner',
    destinationName: 'Bikaner',
    name: 'Karni Mata Temple (Deshnoke Rat Temple)',
    shortDescription: 'World-famous 600-year-old temple sheltering over 25,000 revered sacred black rats (kabbas).',
    detailedDescription: 'An extraordinary spiritual sanctum where sighting a rare white rat is considered an auspicious blessing. Built with pure white Makrana marble facade.',
    duration: '1.5 Hours',
    category: 'Sacred Pilgrimage',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bikaner-camel-research',
    destinationId: 'bikaner',
    destinationName: 'Bikaner',
    name: 'National Research Centre on Camel & Safari',
    shortDescription: 'Asia’s premier camel breeding farm featuring camel rides, research museum, and fresh camel milk ice cream.',
    detailedDescription: 'Observe hundreds of desert camels across Bikaneri, Jaisalmeri, and Marwari breeds while learning about desert ecology and breeding programs.',
    duration: '1.5 Hours',
    category: 'Desert Wildlife Activity',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bikaner-rampuria-havelis',
    destinationId: 'bikaner',
    destinationName: 'Bikaner',
    name: 'Rampuria Havelis & Lalgarh Palace',
    shortDescription: 'Spectacular red sandstone merchant havelis with intricate stone lattices and Victorian royal palace.',
    detailedDescription: 'Walk through narrow cobblestone lanes of the old walled city to marvel at the 400-year-old red sandstone jharokhas of wealthy Marwari traders.',
    duration: '1.5 Hours',
    category: 'Heritage Architecture',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // VARANASI
  // ==========================================
  {
    id: 'varanasi-ganga-aarti',
    destinationId: 'varanasi',
    destinationName: 'Varanasi',
    name: 'Dashashwamedh Ghat Evening Ganga Aarti',
    shortDescription: 'Mesmerizing evening prayer ritual conducted with multi-tiered brass oil lamps, incense, and conch shells.',
    detailedDescription: 'Witnessed from wooden boats on the sacred Ganges as seven young priests choreograph fiery offerings to Mother Ganga in unison.',
    duration: '1.5 Hours',
    category: 'Spiritual River Ritual',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'varanasi-sunrise-boat',
    destinationId: 'varanasi',
    destinationName: 'Varanasi',
    name: 'Sunrise Boat Cruise along Varanasi Ghats',
    shortDescription: 'Dawn rowing boat journey along Manikarnika, Assi, and Harishchandra Ghats witnessing ancient morning rituals.',
    detailedDescription: 'Watch the sunrise bathe the ancient palatial riverfront in golden amber, as pilgrims perform Surya Namaskar and temple bells chime.',
    duration: '2 Hours',
    category: 'Scenic Boat Journey',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'varanasi-kashi-vishwanath',
    destinationId: 'varanasi',
    destinationName: 'Varanasi',
    name: 'Kashi Vishwanath Temple (Golden Temple of Shiva)',
    shortDescription: 'One of the twelve sacred Jyotirlingas, crowned by a one-ton pure gold dome.',
    detailedDescription: 'The spiritual heart of Varanasi, dedicated to Lord Shiva as Vishwanatha (Lord of the Universe), connected to the Ganges by the new temple corridor.',
    duration: '2 Hours',
    category: 'Jyotirlinga Temple',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'varanasi-sarnath',
    destinationId: 'varanasi',
    destinationName: 'Varanasi',
    name: 'Sarnath Buddhist Pilgrimage & Dhamek Stupa',
    shortDescription: 'Sacred deer park where Gautama Buddha taught his first sermon after attaining enlightenment.',
    detailedDescription: 'A revered Buddhist site featuring the colossal 43-meter Dhamek Stupa, Ashoka Pillar ruins, and the Sarnath Archaeological Museum.',
    duration: '2 Hours',
    category: 'Buddhist Heritage',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'varanasi-silk-weaving',
    destinationId: 'varanasi',
    destinationName: 'Varanasi',
    name: 'Banaras Silk Weaving Workshop & Old Alleys',
    shortDescription: 'Experience master weavers crafting gold zari Banarasi sarees on centuries-old wooden pit looms.',
    detailedDescription: 'Explore narrow bazaar alleys to observe traditional handloom weaving techniques passed down through generations of artisan families.',
    duration: '1.5 Hours',
    category: 'Artisan Workshop',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // AMRITSAR
  // ==========================================
  {
    id: 'amritsar-golden-temple',
    destinationId: 'amritsar',
    destinationName: 'Amritsar',
    name: 'Sri Harmandir Sahib (The Golden Temple & Langar)',
    shortDescription: 'The spiritual heart of Sikhism crowned in 750 kg of pure gold leaf, encircled by the Amrit Sarovar pool.',
    detailedDescription: 'Open to all humankind with four doors representing openness. Visit the sacred sanctum, hear continuous live Gurbani kirtan, and experience the world’s largest free community kitchen (Langar).',
    duration: '3 Hours',
    category: 'Sacred Sikh Shrine',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'amritsar-wagah-border',
    destinationId: 'amritsar',
    destinationName: 'Amritsar',
    name: 'Wagah Border Beating Retreat Ceremony',
    shortDescription: 'Electrifying daily military flag-lowering parade between Indian BSF and Pakistani Rangers.',
    detailedDescription: 'A synchronized high-energy drill conducted with theatrical goose-stepping, trumpet calls, and thunderous patriotic chanting before international border gates close at sunset.',
    duration: '3 Hours',
    category: 'Patriotic Military Ceremony',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'amritsar-jallianwala-bagh',
    destinationId: 'amritsar',
    destinationName: 'Amritsar',
    name: 'Jallianwala Bagh National Memorial',
    shortDescription: 'Historic public garden memorial commemorating the martyrs of the fateful 1919 independence movement.',
    detailedDescription: 'Preserves the original brick walls riddled with British bullet marks, the Martyr’s Well, and the eternal flame memorializing the freedom struggle.',
    duration: '1 Hour',
    category: 'Historical Memorial',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'amritsar-gobindgarh',
    destinationId: 'amritsar',
    destinationName: 'Amritsar',
    name: 'Gobindgarh Fort & Old Amritsar Food Walk',
    shortDescription: '18th-century military fort of Maharaja Ranjit Singh followed by authentic Amritsari kulcha and lassi tasting.',
    detailedDescription: 'Houses the Toshakhana coin museum, martial arts demonstrations, and culinary tours of century-old food stalls in the heritage walled city.',
    duration: '2 Hours',
    category: 'Fort & Culinary Tour',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // SHIMLA
  // ==========================================
  {
    id: 'shimla-ridge-mall',
    destinationId: 'shimla',
    destinationName: 'Shimla',
    name: 'The Ridge & Mall Road Walking Tour',
    shortDescription: 'Pedestrian colonial promenade with neo-Gothic Christ Church and panoramic Himalayan vistas.',
    detailedDescription: 'The social hub of Shimla free from vehicular traffic, featuring Gaiety Theatre, Tudor-style town halls, craft emporiums, and sunset lookouts.',
    duration: '2 Hours',
    category: 'Colonial Promenade',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'shimla-kufri',
    destinationId: 'shimla',
    destinationName: 'Shimla',
    name: 'Kufri Adventure Park & Snow Viewpoint',
    shortDescription: 'High-altitude hill resort at 8,600 feet offering horse rides, Himalayan wildlife, and winter snow activities.',
    detailedDescription: 'Famous for Mahasu Peak views, apple orchards, yak rides, and tobogganing slopes overlooking snow-covered Himalayan peaks.',
    duration: '3 Hours',
    category: 'Hill Adventure Resort',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'shimla-jakhoo-temple',
    destinationId: 'shimla',
    destinationName: 'Shimla',
    name: 'Jakhoo Temple & Aerial Ropeway',
    shortDescription: 'Highest peak in Shimla (8,050 feet) crowned by a monumental 108-foot orange statue of Lord Hanuman.',
    detailedDescription: 'Accessible via a scenic aerial ropeway cable car from the Ridge, offering panoramic views of the Shivalik hill ranges and forested valleys.',
    duration: '1.5 Hours',
    category: 'Hilltop Shrine & Cable Car',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'shimla-viceregal-lodge',
    destinationId: 'shimla',
    destinationName: 'Shimla',
    name: 'Viceregal Lodge (Rashtrapati Niwas)',
    shortDescription: 'Magnificent Jacobethan stone estate that served as the summer headquarters of the British Viceroy.',
    detailedDescription: 'Surrounded by manicured pine lawns, where historic partition conferences occurred. Today houses the Indian Institute of Advanced Study.',
    duration: '1.5 Hours',
    category: 'Colonial Heritage Estate',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // MANALI
  // ==========================================
  {
    id: 'manali-solang-valley',
    destinationId: 'manali',
    destinationName: 'Manali',
    name: 'Solang Valley Adventure Activities',
    shortDescription: 'Premier alpine adventure arena for paragliding, zorbing, quad biking, and winter ski slopes.',
    detailedDescription: 'Nestled between Solang village and Beas Kund glacier, offering tandem paragliding soaring over alpine pine meadows and snow activities.',
    duration: '3.5 Hours',
    category: 'Mountain Adventure Arena',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'manali-atal-tunnel',
    destinationId: 'manali',
    destinationName: 'Manali',
    name: 'Atal Tunnel & Sissu Waterfall (Lahaul Valley)',
    shortDescription: 'Drive through the world’s longest highway tunnel (9.02 km) at 10,000 feet into trans-Himalayan Lahaul.',
    detailedDescription: 'Cross beneath the Pir Panjal range to enter the dramatically stark landscape of Sissu village with its cascading glacial waterfall and suspension bridge.',
    duration: '4 Hours',
    category: 'Engineering Marvel & Excursion',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'manali-hadimba-temple',
    destinationId: 'manali',
    destinationName: 'Manali',
    name: 'Hadimba Devi Wooden Temple & Dhungri Van Vihar',
    shortDescription: '16th-century pagoda-style cedar wood temple hidden inside ancient deodar pine forests of Dhungri.',
    detailedDescription: 'Built in 1553 AD around a natural cave sanctum. Celebrated for intricate wooden carvings of animals, folk dancers, and tranquil forest atmosphere.',
    duration: '1 Hour',
    category: 'Heritage Wood Temple',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'manali-rohtang-pass',
    destinationId: 'manali',
    destinationName: 'Manali',
    name: 'Rohtang Pass Snow Excursion (13,058 ft)',
    shortDescription: 'High-altitude mountain pass connecting Kullu with Lahaul and Spiti, offering year-round glacier snow.',
    detailedDescription: 'Witness dramatic high-altitude vistas, glacier waterfalls, and enjoy snow scooter rides and skiing against the backdrop of towering Himalayan peaks.',
    duration: '5 Hours',
    category: 'Glacier Snow Pass',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'manali-old-manali',
    destinationId: 'manali',
    destinationName: 'Manali',
    name: 'Old Manali Village & Vashisht Hot Sulphur Springs',
    shortDescription: 'Traditional timber-and-stone village with bohemian cafes and natural mineral hot water healing baths.',
    detailedDescription: 'A laid-back cultural walk through rustic wooden houses, apple orchards, and the ancient stone temple dedicated to Sage Vashisht.',
    duration: '2 Hours',
    category: 'Cultural Village & Thermal Springs',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // DHARAMSHALA & MCLEODGANJ
  // ==========================================
  {
    id: 'dharamshala-dalai-lama-temple',
    destinationId: 'dharamshala',
    destinationName: 'Dharamshala & McLeodGanj',
    name: 'Tsuglagkhang Complex (Dalai Lama Temple & Monastery)',
    shortDescription: 'The spiritual heart of Tibetan Buddhism in exile, home to His Holiness the 14th Dalai Lama.',
    detailedDescription: 'Visit the revered main prayer hall with statues of Avalokiteshvara and Padmasambhava, spin sacred prayer wheels, and walk the tranquil Kora meditation path.',
    duration: '2 Hours',
    category: 'Tibetan Buddhist Complex',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dharamshala-hpca-stadium',
    destinationId: 'dharamshala',
    destinationName: 'Dharamshala & McLeodGanj',
    name: 'HPCA International Cricket Stadium',
    shortDescription: 'World’s most picturesque cricket stadium set at 4,780 feet against the snow-clad Dhauladhar peaks.',
    detailedDescription: 'Famous for its vibrant Tibetan-style pavilion architecture and awe-inspiring backdrop of sheer mountain rock and pine forests.',
    duration: '1 Hour',
    category: 'Scenic Stadium & Monument',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dharamshala-bhagsu-waterfall',
    destinationId: 'dharamshala',
    destinationName: 'Dharamshala & McLeodGanj',
    name: 'Bhagsunath Temple & Waterfall Hike',
    shortDescription: 'Ancient Lord Shiva temple, freshwater swimming pool, and scenic mountain trail to Bhagsunath waterfall.',
    detailedDescription: 'Enjoy a light mountain hike along mountain streams to the roaring waterfall with famous cliffside cafes serving herbal teas and pancakes.',
    duration: '2 Hours',
    category: 'Nature Hike & Temple',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dharamshala-norbulingka',
    destinationId: 'dharamshala',
    destinationName: 'Dharamshala & McLeodGanj',
    name: 'Norbulingka Tibetan Cultural Institute',
    shortDescription: 'Tranquil Japanese-inspired gardens preserving Tibetan Thangka painting, woodcarving, and bronze casting.',
    detailedDescription: 'Dedicated to keeping traditional Tibetan arts alive through live artisan workshops, shaded bamboo walkways, and traditional tea houses.',
    duration: '1.5 Hours',
    category: 'Cultural Art Institute',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // SRINAGAR
  // ==========================================
  {
    id: 'srinagar-dal-lake-shikara',
    destinationId: 'srinagar',
    destinationName: 'Srinagar',
    name: 'Dal Lake Sunset Shikara Ride & Floating Markets',
    shortDescription: 'Romantic wooden boat cruise through lotus gardens, floating handicraft shops, and Char Chinar island.',
    detailedDescription: 'Glide gently on traditional velvet-cushioned wooden boats over mirror-still waters reflecting snow-peaked Pir Panjal mountains.',
    duration: '2 Hours',
    category: 'Iconic Lake Experience',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srinagar-mughal-gardens',
    destinationId: 'srinagar',
    destinationName: 'Srinagar',
    name: 'Mughal Gardens (Nishat & Shalimar Bagh)',
    shortDescription: 'Terraced imperial Mughal water gardens with cascading fountains and centuries-old chinar trees.',
    detailedDescription: 'Built by Emperors Jahangir and Shah Jahan on the banks of Dal Lake, featuring tiered fountains, flower beds, and pavilion terraces.',
    duration: '2 Hours',
    category: 'Imperial Gardens',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srinagar-shankaracharya',
    destinationId: 'srinagar',
    destinationName: 'Srinagar',
    name: 'Shankaracharya Hilltop Temple',
    shortDescription: 'Ancient 9th-century stone Shiva temple perched atop Gopadari Hill overlooking the entire Kashmir Valley.',
    detailedDescription: 'Climb 240 stone stairs to reach the historic sanctum where Adi Shankaracharya meditated, commanding magnificent birds-eye views of Dal Lake and Srinagar city.',
    duration: '1.5 Hours',
    category: 'Hilltop Sacred Shrine',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srinagar-old-city-heritage',
    destinationId: 'srinagar',
    destinationName: 'Srinagar',
    name: 'Srinagar Heritage Walk & Jamia Masjid',
    shortDescription: 'Colossal wooden Indo-Saracenic mosque with 378 deodar pillars, wooden bridges, and spice emporiums.',
    detailedDescription: 'Explore Old Srinagar along the Jhelum River, visiting the wooden Shah-i-Hamadan shrine, spice markets, and walnut woodcarving workshops.',
    duration: '2 Hours',
    category: 'Heritage Walk',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // GULMARG
  // ==========================================
  {
    id: 'gulmarg-gondola',
    destinationId: 'gulmarg',
    destinationName: 'Gulmarg',
    name: 'Gulmarg Gondola (Kongdoori & Apharwat Peak)',
    shortDescription: 'World’s highest operating cable car taking visitors up to 13,780 feet onto glacier snowfields.',
    detailedDescription: 'Soar above pine canopies into the alpine tundra of Mount Apharwat near the LOC. Enjoy snow walks, sledging, skiing, and panoramic Himalayan vistas.',
    duration: '3.5 Hours',
    category: 'High Altitude Gondola & Snow',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gulmarg-golf-course',
    destinationId: 'gulmarg',
    destinationName: 'Gulmarg',
    name: 'Gulmarg Meadow Walk & Historic Golf Course',
    shortDescription: 'One of the world’s highest green 18-hole golf courses surrounded by rolling wildflower meadows.',
    detailedDescription: 'Stroll across lush alpine meadows lined with pine forests, colonial British cottages, and wild lupines blooming in summer.',
    duration: '1.5 Hours',
    category: 'Alpine Meadow Walk',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gulmarg-st-marys',
    destinationId: 'gulmarg',
    destinationName: 'Gulmarg',
    name: 'St. Mary’s Church & Strawberry Valley',
    shortDescription: 'Victorian stone church built in 1902 standing quietly in the snowfields, alongside sweet strawberry meadows.',
    detailedDescription: 'A postcard-perfect heritage site with stained glass windows and stone bell tower surrounded by alpine deodar forest.',
    duration: '1 Hour',
    category: 'Heritage Church & Valley',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // PAHALGAM
  // ==========================================
  {
    id: 'pahalgam-valleys',
    destinationId: 'pahalgam',
    destinationName: 'Pahalgam',
    name: 'Betaab Valley & Aru Valley Excursion',
    shortDescription: 'Spectacular river valley surrounded by snow-covered peaks, lush meadows, and gushing streams.',
    detailedDescription: 'Named after the famous Bollywood film shot here. Visit the idyllic mountain meadows of Aru, Betaab valley, and the banks of the Lidder River.',
    duration: '3.5 Hours',
    category: 'Scenic Alpine Valley',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pahalgam-baisaran',
    destinationId: 'pahalgam',
    destinationName: 'Pahalgam',
    name: 'Baisaran Meadow (Mini Switzerland) Pony Trek',
    shortDescription: 'Gentle pony trek through dense deodar forests opening onto panoramic emerald hilltop meadows.',
    detailedDescription: 'A pristine mountain meadow ringed by snow-dusted peaks and pine woods, offering zorbing, horse riding, and picnic spots.',
    duration: '2.5 Hours',
    category: 'Pony Trek & Alpine Meadow',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pahalgam-lidder-river',
    destinationId: 'pahalgam',
    destinationName: 'Pahalgam',
    name: 'Lidder River Walk & Trout Angling',
    shortDescription: 'Crystal-clear glacial mountain river famous for brown trout fishing and serene riverside strolls.',
    detailedDescription: 'Listen to the roar of glacial meltwater cascading over boulders, visit trout farms, and enjoy fresh Kashmiri riverfront barbecues.',
    duration: '1.5 Hours',
    category: 'Riverside Nature Walk',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // RISHIKESH
  // ==========================================
  {
    id: 'rishikesh-ganga-aarti',
    destinationId: 'rishikesh',
    destinationName: 'Rishikesh',
    name: 'Triveni Ghat Evening Maha Aarti & Ram Jhula',
    shortDescription: 'Soulful sunset river prayer with oil lamps floating down the crystal-clear Ganges.',
    detailedDescription: 'Join thousands of pilgrims chanting Vedic hymns as large brass diyas are swayed in prayer at the holy confluence of three sacred rivers.',
    duration: '2 Hours',
    category: 'Spiritual River Aarti',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rishikesh-river-rafting',
    destinationId: 'rishikesh',
    destinationName: 'Rishikesh',
    name: 'White Water River Rafting (Shivpuri to Rishikesh)',
    shortDescription: 'Thrilling 16-km river rafting adventure over Grade III and IV rapids on the glacial Ganges.',
    detailedDescription: 'Navigate famous rapids including Roller Coaster, Golf Course, and Club House guided by international certified river rescue guides.',
    duration: '3 Hours',
    category: 'River Adventure Sport',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rishikesh-beatles-ashram',
    destinationId: 'rishikesh',
    destinationName: 'Rishikesh',
    name: 'The Beatles Ashram (Chaurasi Kutia) & Meditation',
    shortDescription: 'Historic jungle ashram of Maharishi Mahesh Yogi where the Beatles composed the White Album in 1968.',
    detailedDescription: 'Now part of Rajaji Tiger Reserve, featuring 84 stone meditation caves, colorful pop-art murals, and a tranquil woodland sanctuary.',
    duration: '2 Hours',
    category: 'Cultural Heritage Ashram',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rishikesh-neelkanth',
    destinationId: 'rishikesh',
    destinationName: 'Rishikesh',
    name: 'Neelkanth Mahadev Temple & Cliff Views',
    shortDescription: 'Sacred mountain shrine dedicated to Lord Shiva at 4,300 feet surrounded by dense forested hills.',
    detailedDescription: 'Legend marks this as the spot where Shiva consumed the cosmic poison (Halahala) during the churning of the ocean, turning his throat blue.',
    duration: '2.5 Hours',
    category: 'Hilltop Pilgrimage',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // HARIDWAR
  // ==========================================
  {
    id: 'haridwar-har-ki-pauri',
    destinationId: 'haridwar',
    destinationName: 'Haridwar',
    name: 'Har Ki Pauri Evening Ganga Aarti',
    shortDescription: 'Spectacular sunset aarti ceremony at the Footstep of God where thousands of floating leaf lamps illuminate the river.',
    detailedDescription: 'One of the most sacred pilgrimage ghats in India. The swift waters reflect hundreds of illuminated lanterns while conch shells echo in reverence.',
    duration: '2 Hours',
    category: 'World Famous Pilgrimage Aarti',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'haridwar-mansa-devi',
    destinationId: 'haridwar',
    destinationName: 'Haridwar',
    name: 'Mansa Devi Temple & Udankhatola Ropeway',
    shortDescription: 'Hilltop wish-fulfilling goddess temple atop Bilwa Parvat reachable by scenic aerial cable car.',
    detailedDescription: 'Pilgrims tie holy threads to tree branches praying for wishes to be granted, while taking in sweeping views of the Ganges plain.',
    duration: '1.5 Hours',
    category: 'Hilltop Temple & Cable Car',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'haridwar-chandi-devi',
    destinationId: 'haridwar',
    destinationName: 'Haridwar',
    name: 'Chandi Devi Temple & Neel Parvat Trek',
    shortDescription: 'Ancient 8th-century temple established by Adi Shankaracharya atop Neel Parvat hill.',
    detailedDescription: 'Accessible by ropeway or hillside trek, offering panoramic vistas over Haridwar and the serene Shivalik foothills.',
    duration: '1.5 Hours',
    category: 'Sacred Hilltop Shrine',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // BHARATPUR
  // ==========================================
  {
    id: 'bharatpur-keoladeo',
    destinationId: 'bharatpur',
    destinationName: 'Bharatpur',
    name: 'Keoladeo Ghana National Park (UNESCO Bird Sanctuary)',
    shortDescription: 'World-renowned wetland sanctuary hosting over 370 resident & migratory bird species.',
    detailedDescription: 'Explore by silent cycle rickshaw pedaled by certified naturalist guides. Spot painted storks, pelicans, Siberian cranes, and pythons basking in marshes.',
    duration: '3 Hours',
    category: 'UNESCO Wildlife Sanctuary',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bharatpur-lohagarh',
    destinationId: 'bharatpur',
    destinationName: 'Bharatpur',
    name: 'Lohagarh Fort (Iron Fort) & Government Museum',
    shortDescription: 'Virtually impenetrable 18th-century moat fortress built by Jat Maharaja Suraj Mal.',
    detailedDescription: 'Surrounded by deep water moats that withstood repeated British sieges. Houses an impressive archaeological museum of antique arms, sculptures, and coins.',
    duration: '1.5 Hours',
    category: 'Historic Moat Fort',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // MUMBAI
  // ==========================================
  {
    id: 'mumbai-gateway-india',
    destinationId: 'mumbai',
    destinationName: 'Mumbai',
    name: 'Gateway of India & Taj Mahal Palace Hotel',
    shortDescription: 'Iconic 26-meter basalt triumphal arch built in 1924 overlooking the Arabian Sea harbor.',
    detailedDescription: 'Mumbai’s foremost colonial landmark facing the storied Taj Mahal Palace hotel, where ferry boats depart for Elephanta Island.',
    duration: '1.5 Hours',
    category: 'Historic Monument',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mumbai-marine-drive',
    destinationId: 'mumbai',
    destinationName: 'Mumbai',
    name: 'Marine Drive & Queen’s Necklace Sunset Walk',
    shortDescription: '3-kilometer arc-shaped seaside boulevard illuminated with glittering street lamps at twilight.',
    detailedDescription: 'Stroll along the Arabian Sea promenade from Nariman Point to Girgaon Chowpatty beach, feeling cool sea breezes and sampling local kulfi.',
    duration: '1.5 Hours',
    category: 'Seaside Promenade',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mumbai-cst-terminus',
    destinationId: 'mumbai',
    destinationName: 'Mumbai',
    name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
    shortDescription: 'UNESCO-listed High Victorian Gothic railway terminus with gargoyles, turrets, and stained glass.',
    detailedDescription: 'Designed by F.W. Stevens and opened in 1887. An architectural masterpiece combining Victorian Italianate Gothic Revival with traditional Indian court palace motifs.',
    duration: '1 Hour',
    category: 'UNESCO Victorian Heritage',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mumbai-elephanta-caves',
    destinationId: 'mumbai',
    destinationName: 'Mumbai',
    name: 'Elephanta Island Rock-Cut Shiva Caves',
    shortDescription: 'UNESCO-listed 5th-century rock-cut cave temples dedicated to Shiva, reached by harbor ferry.',
    detailedDescription: 'Features the world-famous 6-meter-high three-headed Sadashiva sculpture portraying creator, preserver, and destroyer aspects of divinity.',
    duration: '3.5 Hours',
    category: 'UNESCO Rock-Cut Caves & Boat',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mumbai-bandra-sea-link',
    destinationId: 'mumbai',
    destinationName: 'Mumbai',
    name: 'Bandra-Worli Sea Link & Siddhivinayak Temple',
    shortDescription: 'Cable-stayed engineering marvel spanning Mahim Bay, followed by Mumbai’s most revered Ganesh shrine.',
    detailedDescription: 'Drive across the 8-lane cable bridge with modern skyline views and visit Prabhadevi’s gold-plated sanctum of Lord Ganesha.',
    duration: '2 Hours',
    category: 'Modern Landmark & Temple',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // GOA
  // ==========================================
  {
    id: 'goa-old-goa-churches',
    destinationId: 'goa',
    destinationName: 'Goa',
    name: 'Basilica of Bom Jesus & Se Cathedral (Old Goa)',
    shortDescription: 'UNESCO-listed Portuguese baroque churches enshrining the mortal remains of St. Francis Xavier.',
    detailedDescription: 'Masterpiece of 16th-century Manueline and Baroque architecture with carved gilded altars and the famous Se Cathedral bell.',
    duration: '2 Hours',
    category: 'UNESCO Heritage Cathedral',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'goa-calangute-baga',
    destinationId: 'goa',
    destinationName: 'Goa',
    name: 'Baga & Calangute Beach Watersports',
    shortDescription: 'Vibrant golden sand beach with parasailing, jet-skiing, banana rides, and seaside shacks.',
    detailedDescription: 'The heart of North Goa beach culture with exhilarating Arabian Sea water sports, fresh seafood shacks, and sunset beach vibes.',
    duration: '3 Hours',
    category: 'Beach & Watersports',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'goa-dudhsagar',
    destinationId: 'goa',
    destinationName: 'Goa',
    name: 'Dudhsagar Waterfalls Jungle Jeep Safari',
    shortDescription: 'Four-tiered 310-meter cascading milky waterfall inside Bhagwan Mahavir Wildlife Sanctuary.',
    detailedDescription: 'Take an open 4x4 Jeep through jungle streams, swim in the freshwater plunge pool beneath the railway viaduct, and feed wild monkeys.',
    duration: '5 Hours',
    category: 'Waterfall Jungle Adventure',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'goa-fort-aguada',
    destinationId: 'goa',
    destinationName: 'Goa',
    name: 'Fort Aguada & Lighthouse Sinquerim',
    shortDescription: '17th-century Portuguese coastal fortress and four-story lighthouse guarding the Mandovi River mouth.',
    detailedDescription: 'Once the grandest freshwater replenishment station for Portuguese naval ships, commanding sweeping views of the Arabian Sea.',
    duration: '1.5 Hours',
    category: 'Seaside Coastal Fortress',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },

  // ==========================================
  // KERALA
  // ==========================================
  {
    id: 'kerala-alleppey-houseboat',
    destinationId: 'kerala',
    destinationName: 'Kerala (Munnar & Alleppey)',
    name: 'Alleppey Backwaters Houseboat Day Cruise',
    shortDescription: 'Traditional thatched wooden Kettuvallam cruise through emerald canals, paddy fields, and lagoons.',
    detailedDescription: 'Glide peacefully along palm-fringed backwaters while enjoying freshly prepared authentic Kerala Karimeen fish and coconut curries onboard.',
    duration: '4 Hours',
    category: 'Backwater Houseboat Cruise',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kerala-munnar-tea-gardens',
    destinationId: 'kerala',
    destinationName: 'Kerala (Munnar & Alleppey)',
    name: 'Munnar Tea Plantations & Tata Tea Museum',
    shortDescription: 'Rolling emerald tea estate walks, tea picking experience, and processing demonstration.',
    detailedDescription: 'Perched in the Western Ghats at 5,200 feet. Walk through manicured green tea gardens, visit Mattupetty Dam, and taste freshly brewed orthodox tea.',
    duration: '3 Hours',
    category: 'Hill Plantation Experience',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kerala-periyar-wildlife',
    destinationId: 'kerala',
    destinationName: 'Kerala (Munnar & Alleppey)',
    name: 'Periyar Lake Wildlife Boat Safari (Thekkady)',
    shortDescription: 'Boat safari across artificial mountain lake spotting wild Asian elephants, gaur, and sambar deer.',
    detailedDescription: 'Located within Periyar Tiger Reserve in Cardamom Hills, surrounded by fragrant organic spice plantations of cardamom, pepper, and cinnamon.',
    duration: '2.5 Hours',
    category: 'Wildlife Lake Safari',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kerala-kochi-chinese-nets',
    destinationId: 'kerala',
    destinationName: 'Kerala (Munnar & Alleppey)',
    name: 'Fort Kochi Chinese Fishing Nets & Kathakali Performance',
    shortDescription: '14th-century cantilevered sea nets followed by an evening classical Kathakali dance and facial makeup show.',
    detailedDescription: 'Wander past Portuguese houses, Jewish Synagogue, and witness master artists narrate epic Ramayana tales through elaborate eye expressions and mudras.',
    duration: '3 Hours',
    category: 'Cultural Show & Heritage',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
  }
];

// Helper: Common Driving Distances & Times between cities
export const INTERCITY_ROUTES: Record<string, { distanceKm: number; driveTime: string; routeVia?: string }> = {
  'delhi-agra': { distanceKm: 210, driveTime: '3.5–4 Hours', routeVia: 'Yamuna Expressway' },
  'agra-delhi': { distanceKm: 210, driveTime: '3.5–4 Hours', routeVia: 'Yamuna Expressway' },
  'agra-jaipur': { distanceKm: 240, driveTime: '4.5–5 Hours', routeVia: 'NH 21 via Fatehpur Sikri' },
  'jaipur-agra': { distanceKm: 240, driveTime: '4.5–5 Hours', routeVia: 'NH 21 via Bharatpur & Fatehpur Sikri' },
  'agra-fatehpur-sikri': { distanceKm: 38, driveTime: '50 Minutes', routeVia: 'Agra-Bikaner Highway' },
  'fatehpur-sikri-agra': { distanceKm: 38, driveTime: '50 Minutes', routeVia: 'Agra-Bikaner Highway' },
  'fatehpur-sikri-jaipur': { distanceKm: 205, driveTime: '3.5–4 Hours', routeVia: 'NH 21' },
  'jaipur-fatehpur-sikri': { distanceKm: 205, driveTime: '3.5–4 Hours', routeVia: 'NH 21' },
  'delhi-jaipur': { distanceKm: 270, driveTime: '4–4.5 Hours', routeVia: 'Delhi-Mumbai Expressway' },
  'jaipur-delhi': { distanceKm: 270, driveTime: '4–4.5 Hours', routeVia: 'Delhi-Mumbai Expressway' },
  'delhi-mathura-vrindavan': { distanceKm: 155, driveTime: '2.5 Hours', routeVia: 'Yamuna Expressway' },
  'mathura-vrindavan-delhi': { distanceKm: 155, driveTime: '2.5 Hours', routeVia: 'Yamuna Expressway' },
  'mathura-vrindavan-agra': { distanceKm: 60, driveTime: '1 Hour', routeVia: 'NH 19' },
  'agra-mathura-vrindavan': { distanceKm: 60, driveTime: '1 Hour', routeVia: 'NH 19' },
  'jaipur-jodhpur': { distanceKm: 330, driveTime: '5.5–6 Hours', routeVia: 'NH 25 via Ajmer' },
  'jodhpur-jaipur': { distanceKm: 330, driveTime: '5.5–6 Hours', routeVia: 'NH 25' },
  'jaipur-pushkar': { distanceKm: 145, driveTime: '2.5–3 Hours', routeVia: 'NH 48 via Kishangarh' },
  'pushkar-jaipur': { distanceKm: 145, driveTime: '2.5–3 Hours', routeVia: 'NH 48 via Kishangarh' },
  'pushkar-jodhpur': { distanceKm: 190, driveTime: '3.5 Hours', routeVia: 'NH 25' },
  'jodhpur-pushkar': { distanceKm: 190, driveTime: '3.5 Hours', routeVia: 'NH 25' },
  'jaipur-udaipur': { distanceKm: 395, driveTime: '6.5–7 Hours', routeVia: 'NH 48 via Chittorgarh' },
  'udaipur-jaipur': { distanceKm: 395, driveTime: '6.5–7 Hours', routeVia: 'NH 48 via Chittorgarh' },
  'jodhpur-udaipur': { distanceKm: 260, driveTime: '5 Hours', routeVia: 'Ranakpur Jain Temples' },
  'udaipur-jodhpur': { distanceKm: 260, driveTime: '5 Hours', routeVia: 'Ranakpur Jain Temples' },
  'jodhpur-jaisalmer': { distanceKm: 280, driveTime: '4.5–5 Hours', routeVia: 'NH 11' },
  'jaisalmer-jodhpur': { distanceKm: 280, driveTime: '4.5–5 Hours', routeVia: 'NH 11' },
  'jodhpur-bikaner': { distanceKm: 250, driveTime: '4.5 Hours', routeVia: 'NH 62' },
  'bikaner-jodhpur': { distanceKm: 250, driveTime: '4.5 Hours', routeVia: 'NH 62' },
  'jaipur-bikaner': { distanceKm: 335, driveTime: '5.5 Hours', routeVia: 'NH 52' },
  'bikaner-jaipur': { distanceKm: 335, driveTime: '5.5 Hours', routeVia: 'NH 52' },
  'bikaner-jaisalmer': { distanceKm: 330, driveTime: '5.5 Hours', routeVia: 'NH 11' },
  'jaisalmer-bikaner': { distanceKm: 330, driveTime: '5.5 Hours', routeVia: 'NH 11' },
  'jaipur-ranthambore': { distanceKm: 160, driveTime: '3 Hours', routeVia: 'Delhi-Mumbai Expressway' },
  'ranthambore-jaipur': { distanceKm: 160, driveTime: '3 Hours', routeVia: 'Delhi-Mumbai Expressway' },
  'delhi-amritsar': { distanceKm: 450, driveTime: '7–8 Hours', routeVia: 'NH 44 GT Road' },
  'amritsar-delhi': { distanceKm: 450, driveTime: '7–8 Hours', routeVia: 'NH 44 GT Road' },
  'delhi-shimla': { distanceKm: 345, driveTime: '7–7.5 Hours', routeVia: 'Himalayan Expressway' },
  'shimla-delhi': { distanceKm: 345, driveTime: '7–7.5 Hours', routeVia: 'Himalayan Expressway' },
  'shimla-manali': { distanceKm: 240, driveTime: '7–8 Hours', routeVia: 'NH 205' },
  'manali-shimla': { distanceKm: 240, driveTime: '7–8 Hours', routeVia: 'NH 205' },
  'manali-dharamshala': { distanceKm: 215, driveTime: '6.5 Hours', routeVia: 'NH 154' },
  'dharamshala-manali': { distanceKm: 215, driveTime: '6.5 Hours', routeVia: 'NH 154' },
  'dharamshala-amritsar': { distanceKm: 200, driveTime: '4.5 Hours', routeVia: 'Pathankot' },
  'amritsar-dharamshala': { distanceKm: 200, driveTime: '4.5 Hours', routeVia: 'Pathankot' },
  'delhi-rishikesh': { distanceKm: 235, driveTime: '4.5–5 Hours', routeVia: 'Delhi-Dehradun Expressway' },
  'rishikesh-delhi': { distanceKm: 235, driveTime: '4.5–5 Hours', routeVia: 'Delhi-Dehradun Expressway' },
  'haridwar-rishikesh': { distanceKm: 25, driveTime: '40 Minutes', routeVia: 'Haridwar-Rishikesh Highway' },
  'rishikesh-haridwar': { distanceKm: 25, driveTime: '40 Minutes', routeVia: 'Haridwar-Rishikesh Highway' },
  'delhi-haridwar': { distanceKm: 215, driveTime: '4 Hours', routeVia: 'Upper Ganga Canal Expressway' },
  'haridwar-delhi': { distanceKm: 215, driveTime: '4 Hours', routeVia: 'Upper Ganga Canal Expressway' },
  'srinagar-gulmarg': { distanceKm: 50, driveTime: '1.5 Hours', routeVia: 'Narbal-Gulmarg Road' },
  'gulmarg-srinagar': { distanceKm: 50, driveTime: '1.5 Hours', routeVia: 'Narbal-Gulmarg Road' },
  'srinagar-pahalgam': { distanceKm: 90, driveTime: '2.5 Hours', routeVia: 'Saffron Fields of Pampore & Avantipur' },
  'pahalgam-srinagar': { distanceKm: 90, driveTime: '2.5 Hours', routeVia: 'Saffron Fields of Pampore & Avantipur' },
  'pahalgam-gulmarg': { distanceKm: 140, driveTime: '3.5 Hours', routeVia: 'Srinagar Bypass' },
  'gulmarg-pahalgam': { distanceKm: 140, driveTime: '3.5 Hours', routeVia: 'Srinagar Bypass' },
  'agra-bharatpur': { distanceKm: 55, driveTime: '1 Hour', routeVia: 'NH 21' },
  'bharatpur-agra': { distanceKm: 55, driveTime: '1 Hour', routeVia: 'NH 21' },
  'bharatpur-jaipur': { distanceKm: 185, driveTime: '3.5 Hours', routeVia: 'NH 21' },
  'jaipur-bharatpur': { distanceKm: 185, driveTime: '3.5 Hours', routeVia: 'NH 21' },
  'mumbai-goa': { distanceKm: 590, driveTime: '10–11 Hours', routeVia: 'Mumbai-Goa Coastal Highway NH 66' }
};

export interface CoverImagePreset {
  id: string;
  name: string;
  destination: string;
  url: string;
  unesco?: boolean;
}

export const FEATURED_COVER_PRESETS: CoverImagePreset[] = [
  {
    id: 'cov-taj',
    name: 'Taj Mahal at Sunrise',
    destination: 'Agra',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    unesco: true
  },
  {
    id: 'cov-india-gate',
    name: 'India Gate & Rajpath',
    destination: 'Delhi',
    url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cov-qutub',
    name: 'Qutub Minar Victory Tower',
    destination: 'Delhi',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    unesco: true
  },
  {
    id: 'cov-amber',
    name: 'Amber Fort & Maota Lake',
    destination: 'Jaipur',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    unesco: true
  },
  {
    id: 'cov-hawa-mahal',
    name: 'Hawa Mahal (Palace of Winds)',
    destination: 'Jaipur',
    url: 'https://images.unsplash.com/photo-1609137144822-26d9c6c21e35?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cov-udaipur',
    name: 'City Palace & Lake Pichola',
    destination: 'Udaipur',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cov-golden-temple',
    name: 'Harmandir Sahib (Golden Temple)',
    destination: 'Amritsar',
    url: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cov-kerala',
    name: 'Alleppey Backwaters & Houseboat',
    destination: 'Kerala',
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cov-dal-lake',
    name: 'Dal Lake Houseboats & Shikara',
    destination: 'Srinagar, Kashmir',
    url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cov-gateway',
    name: 'Gateway of India',
    destination: 'Mumbai',
    url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80'
  }
];
