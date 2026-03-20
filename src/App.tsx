import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Hotel, ChevronDown, Menu, X, UtensilsCrossed, BookOpen, Languages, Landmark, Navigation } from 'lucide-react'
import './App.css'

// Unsplash image URLs for real Sicilian sights
const images = {
  hero: 'https://images.unsplash.com/photo-1523365280197-f1783db9fe62?w=1920&q=80',
  segesta: 'https://images.unsplash.com/photo-1597914862419-41285a1c48c0?w=800&q=80',
  erice: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  marsala: 'https://images.unsplash.com/photo-1599491648979-ba048b10f5b1?w=800&q=80',
  selinunte: 'https://images.unsplash.com/photo-1610547189313-1fbea2dcd059?w=800&q=80',
  agrigento: 'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?w=800&q=80',
  piazzaArmerina: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=800&q=80',
  noto: 'https://images.unsplash.com/photo-1596627116790-af6f46dddbf4?w=800&q=80',
  siracusa: 'https://images.unsplash.com/photo-1559862839-cdc6ff10bb3e?w=800&q=80',
  catania: 'https://images.unsplash.com/photo-1565876427562-4be67f5cdd92?w=800&q=80',
  taormina: 'https://images.unsplash.com/photo-1560703748-d063e563e2d8?w=800&q=80',
  etna: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  cefalu: 'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=800&q=80',
  palermo: 'https://images.unsplash.com/photo-1553901753-215db344677a?w=800&q=80',
  monreale: 'https://images.unsplash.com/photo-1600019759241-d8d9a84a3604?w=800&q=80',
  villaRomanaTellaro: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
  scalaDeiTurchi: 'https://images.unsplash.com/photo-1559923367-1cf0f4094100?w=800&q=80',
  arancini: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400&q=80',
  cannoli: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80',
  pasta: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
  granita: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=400&q=80',
  caponata: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
  cassata: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
}

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

interface DayData {
  day: number
  date: string
  weekday: string
  title: string
  image: string
  hotel: string
  stops: { name: string; desc: string; km?: string }[]
}

const days: DayData[] = [
  {
    day: 1, date: '28. März', weekday: 'Samstag',
    title: 'Salzburg \u2013 Palermo \u2013 Segesta \u2013 Trapani \u2013 Marsala',
    image: images.segesta,
    hotel: 'Hotel Carmine, Marsala (N/F)',
    stops: [
      { name: 'Salzburg \u2013 München', desc: 'Flug mit Lufthansa nach Palermo' },
      { name: 'Segesta', desc: 'Dorischer Tempel (ca. 420 v. Chr.) und Teatro Greco mit Blick auf den Golf von Castellammare', km: '55 km' },
      { name: 'Monte Érice', desc: 'Mittelalterliche Altstadt auf 750m Höhe, phönizisch-griechische Gründung, Burg der Venus', km: '45 km' },
      { name: 'Trapani', desc: 'Altstadt mit barocken Kirchen und normannischen Spuren', km: '15 km' },
      { name: 'Marsala', desc: 'Entlang der Salzstraße; Altstadt, archäologisches Museum mit punischem Langschiff', km: '30 km' },
    ]
  },
  {
    day: 2, date: '29. März', weekday: 'Sonntag',
    title: 'Marsala \u2013 Selinunte \u2013 Agrigento',
    image: images.agrigento,
    hotel: 'Hotel Oneira Rooms, Agrigento (N/F)',
    stops: [
      { name: 'Cave di Cusa', desc: 'Antiker Steinbruch für die Tempel von Selinunt \u2013 faszinierende Säulentrommeln in situ', km: '40 km' },
      { name: 'Selinunte', desc: 'Griechischer Tempelbezirk und Akropolis, eine der größten antiken Städte Siziliens', km: '15 km' },
      { name: 'Scala dei Turchi', desc: 'Spektakuläres weißes Kalkstein-Naturmonument an der Küste', km: '85 km' },
      { name: 'Agrigento', desc: 'Tal der Tempel: Demetertempel, Zeusheiligtum (Olympieion), archäologisches Museum, Altstadt', km: '15 km' },
    ]
  },
  {
    day: 3, date: '30. März', weekday: 'Montag',
    title: 'Agrigento \u2013 Gela \u2013 Piazza Armerina \u2013 Noto \u2013 Siracusa',
    image: images.noto,
    hotel: 'Hotel I Santi Coronati, Siracusa (N/F)',
    stops: [
      { name: 'Gela', desc: 'Archäologisches Museum mit Funden der griechischen Kolonie (688 v. Chr.)', km: '80 km' },
      { name: 'Piazza Armerina', desc: 'Villa Romana del Casale: spätrömische Mosaiken von Weltrang (UNESCO)', km: '45 km' },
      { name: 'Akrai', desc: 'Griechisches Theater und Aphroditetempel der syrakusanischen Kolonie', km: '100 km' },
      { name: 'Noto', desc: 'Perle des sizilianischen Barocks (UNESCO), nach dem Erdbeben 1693 wiederaufgebaut', km: '30 km' },
      { name: 'Villa Romana del Tellaro', desc: 'Spätrömische Villa mit bedeutenden Mosaiken (4. Jh. n. Chr.)', km: '10 km' },
      { name: 'Siracusa', desc: 'Ankunft im Hotel, einst mächtigste Stadt der griechischen Welt', km: '40 km' },
    ]
  },
  {
    day: 4, date: '31. März', weekday: 'Dienstag',
    title: 'Siracusa \u2013 Catania \u2013 Taormina',
    image: images.siracusa,
    hotel: 'Hotel Ariston, Taormina (N/F)',
    stops: [
      { name: 'Syrakus: Ortigia', desc: 'Altstadt mit Dom (im antiken Athena-Tempel), Arethusa-Quelle, Halbinsel Ortigia' },
      { name: 'Archäologischer Park', desc: '„Ohr des Dionysios", griechisches Theater, römisches Amphitheater, Altar Hierons II.' },
      { name: 'Grab des Archimedes', desc: 'Nekropole Grotticelli und archäologisches Museum Paolo Orsi' },
      { name: 'Castello Eurialo', desc: 'Griechisches Festungswerk des Dionysios I. \u2013 bedeutendstes antikes Kastell Siziliens', km: '10 km' },
      { name: 'Catania', desc: 'Dom Sant\u2019Agata, Elefantenbrunnen, Teatro Romano im Stadtzentrum', km: '60 km' },
      { name: 'Taormina', desc: 'Ankunft im legendären Küstenort', km: '50 km' },
    ]
  },
  {
    day: 5, date: '1. April', weekday: 'Mittwoch',
    title: 'Taormina \u2013 Ätna \u2013 Alcantara-Schlucht',
    image: images.etna,
    hotel: 'Hotel Ariston, Taormina (N/F)',
    stops: [
      { name: 'Ätna', desc: 'Auffahrt bis 1900m Höhe auf Europas höchsten aktiven Vulkan (3357m), ev. Umrundung', km: '55 km' },
      { name: 'Alcantara-Schlucht', desc: 'Spektakuläre Basaltschlucht mit bizarren Lavagesteinsformationen', km: '100 km' },
      { name: 'Taormina', desc: 'Teatro Greco (3. Jh. v. Chr.) mit Ätna-Panorama, malerische Altstadt, Corso Umberto', km: '25 km' },
    ]
  },
  {
    day: 6, date: '2. April', weekday: 'Donnerstag',
    title: 'Taormina \u2013 Cefalù \u2013 Palermo',
    image: images.cefalu,
    hotel: 'Hotel Posta, Palermo (N/F)',
    stops: [
      { name: 'Milazzo / Tindari', desc: 'Option: Äolische Inseln ODER Tindari mit Teatro Greco, Basilika, Casa Romana, Wallfahrtskirche', km: '90 km' },
      { name: 'Cefalù', desc: 'Normannische Kathedrale San Salvatore (1131) mit byzantinischen Christus-Pantokrator-Mosaiken', km: '115 km' },
      { name: 'Solunto', desc: 'Hellenistisch-römische Stadt mit Peristylhäusern und Agora auf dem Monte Catalfano', km: '55 km' },
      { name: 'Palermo', desc: 'Ankunft in der sizilianischen Hauptstadt', km: '20 km' },
    ]
  },
  {
    day: 7, date: '3. April', weekday: 'Freitag',
    title: 'Palermo \u2013 Monreale \u2013 Monte Pellegrino',
    image: images.palermo,
    hotel: 'Hotel Posta, Palermo (N/F)',
    stops: [
      { name: 'Palermo Altstadt', desc: 'Normannenpalast mit Cappella Palatina (goldene Mosaiken), Normannendom, Kreuzkuppelkirche La Martorana, archäologisches Museum' },
      { name: 'Monreale', desc: 'Normannische Kathedrale (1174) mit 6.340 m² byzantinischer Goldmosaiken und romanischem Kreuzgang', km: '15 km' },
      { name: 'Monte Pellegrino', desc: 'Wallfahrtsort Santa Rosalia \u2013 von Goethe als „das schönste Vorgebirge der Welt" gepriesen', km: '25 km' },
    ]
  },
  {
    day: 8, date: '4. April', weekday: 'Samstag',
    title: 'Palermo \u2013 Rückflug',
    image: images.palermo,
    hotel: '',
    stops: [
      { name: 'Palermo Altstadt', desc: 'Altstadtrundgang: Quattro Canti, Fontana Pretoria, Vucciria-Markt' },
      { name: 'Flughafen Palermo', desc: 'Transfer zum Flughafen, Rückflug über München nach Salzburg', km: '40 km' },
    ]
  },
]

const restaurants = [
  {
    name: 'Osteria Ferrara',
    location: 'Marsala',
    desc: 'Traditionelle Küche mit fangfrischem Fisch und handgemachter Pasta. Slow-Food-Empfehlung.',
    tags: ['Slow Food', 'Fisch', 'Pasta'],
    image: images.pasta,
  },
  {
    name: 'Trattoria dei Templi',
    location: 'Agrigento',
    desc: 'Familiengeführt direkt am Tal der Tempel. Berühmt für Couscous alla trapanese und sizilianische Antipasti.',
    tags: ['Familienbetrieb', 'Couscous', 'Antipasti'],
    image: images.caponata,
  },
  {
    name: 'Osteria Nero d\u2019Avola',
    location: 'Noto',
    desc: 'Benannt nach der berühmten sizilianischen Rebsorte. Regionale Spezialitäten wie Caponata und Pasta alla Norma.',
    tags: ['Wein', 'Caponata', 'Regional'],
    image: images.arancini,
  },
  {
    name: 'Taverna Sveva',
    location: 'Siracusa (Ortigia)',
    desc: 'In einem mittelalterlichen Gewölbe auf Ortigia. Fischgerichte, sizilianisches Streetfood und lokale Weine.',
    tags: ['Ortigia', 'Fisch', 'Historisch'],
    image: images.cannoli,
  },
  {
    name: 'Osteria da Rita',
    location: 'Taormina',
    desc: 'Kleine, authentische Osteria abseits der Touristenströme. Hausgemachte Pasta, Involtini und Granita.',
    tags: ['Authentisch', 'Pasta', 'Granita'],
    image: images.granita,
  },
  {
    name: 'Trattoria Ferro di Cavallo',
    location: 'Palermo',
    desc: 'Uriges Lokal im Herzen der Altstadt. Panelle, Arancini, Pasta con le sarde \u2013 echtes palermitanisches Essen.',
    tags: ['Street Food', 'Tradition', 'Arancini'],
    image: images.arancini,
  },
  {
    name: 'Osteria dei Vespri',
    location: 'Palermo',
    desc: 'Gehobene sizilianische Küche in historischem Palazzo. Slow-Food-Präsidium. Degustationsmenüs mit lokalen Produkten.',
    tags: ['Slow Food', 'Fine Dining', 'Palazzo'],
    image: images.cassata,
  },
  {
    name: 'Ristorante Nangalarruni',
    location: 'Castelbuono (bei Cefalù)',
    desc: 'Slow-Food-Osteria in den Madonie-Bergen. Pilze, Wildschwein, Manna-Produkte, hausgemachte Tummala.',
    tags: ['Slow Food', 'Berge', 'Wild'],
    image: images.pasta,
  },
]

const glossary = [
  { it: 'Buongiorno', de: 'Guten Tag / Guten Morgen' },
  { it: 'Buonasera', de: 'Guten Abend' },
  { it: 'Grazie', de: 'Danke' },
  { it: 'Per favore / Per piacere', de: 'Bitte' },
  { it: 'Scusi', de: 'Entschuldigung' },
  { it: 'Quanto costa?', de: 'Wie viel kostet das?' },
  { it: 'Il conto, per favore', de: 'Die Rechnung, bitte' },
  { it: 'Dov\u2019è ...?', de: 'Wo ist ...?' },
  { it: 'Sì / No', de: 'Ja / Nein' },
  { it: 'Acqua (naturale/frizzante)', de: 'Wasser (still/sprudelnd)' },
  { it: 'Vino rosso / bianco', de: 'Rotwein / Weißwein' },
  { it: 'Primo piatto', de: 'Erster Gang (Pasta, Risotto)' },
  { it: 'Secondo piatto', de: 'Zweiter Gang (Fleisch, Fisch)' },
  { it: 'Contorno', de: 'Beilage' },
  { it: 'Dolce', de: 'Nachspeise / Süßigkeit' },
  { it: 'La chiesa', de: 'Die Kirche' },
  { it: 'Il duomo / La cattedrale', de: 'Der Dom / Die Kathedrale' },
  { it: 'Il museo', de: 'Das Museum' },
  { it: 'Il teatro', de: 'Das Theater' },
  { it: 'La piazza', de: 'Der Platz' },
  { it: 'L\u2019ingresso', de: 'Der Eingang / Eintritt' },
  { it: 'Chiuso / Aperto', de: 'Geschlossen / Offen' },
  { it: 'La stazione', de: 'Der Bahnhof' },
  { it: 'A destra / A sinistra', de: 'Rechts / Links' },
]

const speisen = [
  { name: 'Arancini', desc: 'Frittierte Reisbällchen mit Ragù, Mozzarella oder Pistazien \u2013 das sizilianische Street Food schlechthin.', image: images.arancini },
  { name: 'Pasta alla Norma', desc: 'Pasta mit Auberginen, Tomatensugo, gesalzenem Ricotta und Basilikum \u2013 Catanias Nationalgercht, benannt nach Bellinis Oper.', image: images.pasta },
  { name: 'Cannoli Siciliani', desc: 'Knusprige Teigrollen gefüllt mit süßer Ricotta-Creme, Pistazien und kandierten Früchten.', image: images.cannoli },
  { name: 'Granita con Brioche', desc: 'Halbgefrorenes Eis aus Mandeln, Pistazien oder Zitrone, serviert mit warmem Brioche zum Frühstück.', image: images.granita },
  { name: 'Caponata', desc: 'Süß-saures Auberginen-Gemüse mit Kapern, Oliven, Sellerie und Tomaten \u2013 arabischer Einfluss.', image: images.caponata },
  { name: 'Cassata Siciliana', desc: 'Festliche Torte mit Ricotta, Marzipan, Orangeat und Zuckerglasur \u2013 arabisch-normannisches Erbe.', image: images.cassata },
]

const texte = [
  {
    title: 'Cicero über Syrakus',
    source: 'Cicero, In Verrem II, 4.117',
    original: 'Urbem Syracusas maximam esse Graecarum, pulcherrimam omnium saepe audistis. Est, iudices, ita ut dicitur. Nam et situ est cum munito tum ex omni aditu vel terra vel mari praeclaro ad aspectum.',
    translation: 'Ihr habt oft gehört, dass Syrakus die größte aller griechischen Städte sei, die schönste von allen. So ist es, ihr Richter, wie man sagt. Denn sie ist sowohl durch ihre Lage befestigt als auch von jedem Zugang zu Wasser und zu Land her von prächtigem Anblick.',
    lang: 'Lateinisch',
  },
  {
    title: 'Pindar über Ätna und Sizilien',
    source: 'Pindar, Pythische Ode 1, 18\u201328',
    original: '\u1f10\u03bd \u03b4\u2019 \u0391\u1f34\u03c4\u03bd\u1fb3 \u03ba\u03b5\u1fd6\u03c4\u03b1\u03b9 \u03c7\u03b1\u03bc\u03b1\u03b9\u03c0\u03b5\u03c4\u1f72\u03c2 \u03c0\u03b1\u03bd\u03b4\u03ce\u03ba\u03b1\u03c2 \u03c3\u03c4\u1f7b\u03bb\u03bf\u03c2 \u03bf\u1f50\u03c1\u03b1\u03bd\u03af\u03b1, \u03bd\u03b9\u03c6\u03cc\u03b5\u03c3\u03c3\u03b1 \u0391\u1f34\u03c4\u03bd\u03b1, \u03c0\u03ac\u03bd\u03b5\u03c4\u03b5\u03c2 \u03c7\u03b9\u03cc\u03bd\u03bf\u03c2 \u03bf\u1f50\u03c1\u03b1\u03bd\u03af\u03b1\u03c2 \u03c4\u03b9\u03b8\u03ae\u03bd\u03b1.',
    translation: 'Auf dem Ätna aber liegt er, die Säule des Himmels, die alles aufnimmt, der schneebedeckte Ätna, der ganzjährige Nährvater des scharfen Schnees, der himmlischen.',
    lang: 'Griechisch',
  },
  {
    title: 'Vergil über Siziliens Küsten',
    source: 'Vergil, Aeneis III, 692\u2013696',
    original: 'Hinc altas cautes proiectaque saxa Pachyni radimus, et fatis numquam concessa moveri apparet Camerina procul campique Geloi, immanisque Gela fluvii cognomine dicta.',
    translation: 'Von hier streifen wir die hohen Klippen und vorspringenden Felsen von Pachynum, und aus der Ferne erscheint Camerina, die das Schicksal nie zu bewegen gestattete, und die Gefilde von Gela, und das gewaltige Gela, nach dem Fluss benannt.',
    lang: 'Lateinisch',
  },
  {
    title: 'Goethe über Monte Pellegrino',
    source: 'Goethe, Italienische Reise (3. April 1787)',
    original: 'Der Monte Pellegrino, ein großes Vorgebirge am Meerbusen, [...] ist das schönste Vorgebirge der Welt.',
    translation: 'Der Monte Pellegrino, ein großes Vorgebirge am Meerbusen, [...] ist das schönste Vorgebirge der Welt.',
    lang: 'Deutsch (Original)',
  },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('route')

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => scrollTo('hero')}>Sizilien 2026</div>
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {[
              ['route', 'Reiseroute'],
              ['villa-tellaro', 'Villa del Tellaro'],
              ['restaurants', 'Restaurants'],
              ['speisen', 'Speisen'],
              ['texte', 'Antike Texte'],
              ['glossar', 'Glossar'],
            ].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id) }}>{label}</a></li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${images.hero})` }} />
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={fadeIn}>
          <p className="hero-subtitle">Akademische Kulturreise</p>
          <h1>Sizilien</h1>
          <p className="hero-dates">28. März \u2013 4. April 2026</p>
          <p style={{ color: '#ccc', maxWidth: 600, margin: '0 auto 2rem', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
            Auf den Spuren der Antike, der Normannen und des Barock \u2013
            eine Reise durch drei Jahrtausende Kulturgeschichte
          </p>
          <a className="hero-cta" href="#route" onClick={(e) => { e.preventDefault(); scrollTo('route') }}>
            Reiseroute entdecken
          </a>
        </motion.div>
        <div className="scroll-indicator">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Route Overview */}
      <section className="section" id="route">
        <div className="section-header">
          <h2><Navigation size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Reiseroute</h2>
          <div className="section-divider" />
          <p>8 Tage durch das kulturelle Herz Siziliens</p>
        </div>

        <div className="route-overview">
          <h3>Tagesübersicht</h3>
          <div className="route-days">
            {days.map(d => (
              <div key={d.day} className="route-day-mini" onClick={() => scrollTo(`day-${d.day}`)}>
                <span className="day-num">Tag {d.day}</span>
                <h4>{d.weekday}, {d.date}</h4>
                <p>{d.stops.slice(0, 3).map(s => s.name).join(' \u2013 ')}{d.stops.length > 3 ? ' ...' : ''}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs for filtering */}
        <div className="tabs">
          <button className={`tab-btn ${activeSection === 'route' ? 'active' : ''}`} onClick={() => setActiveSection('route')}>
            <Landmark size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Alle Tage
          </button>
          <button className={`tab-btn ${activeSection === 'west' ? 'active' : ''}`} onClick={() => setActiveSection('west')}>
            Westsizilien (Tag 1\u20132)
          </button>
          <button className={`tab-btn ${activeSection === 'south' ? 'active' : ''}`} onClick={() => setActiveSection('south')}>
            Süden (Tag 3\u20134)
          </button>
          <button className={`tab-btn ${activeSection === 'east' ? 'active' : ''}`} onClick={() => setActiveSection('east')}>
            Osten (Tag 5\u20136)
          </button>
          <button className={`tab-btn ${activeSection === 'north' ? 'active' : ''}`} onClick={() => setActiveSection('north')}>
            Palermo (Tag 7\u20138)
          </button>
        </div>

        {days
          .filter(d => {
            if (activeSection === 'route') return true
            if (activeSection === 'west') return d.day <= 2
            if (activeSection === 'south') return d.day >= 3 && d.day <= 4
            if (activeSection === 'east') return d.day >= 5 && d.day <= 6
            if (activeSection === 'north') return d.day >= 7
            return true
          })
          .map(d => (
          <motion.div
            key={d.day}
            id={`day-${d.day}`}
            className="day-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeIn}
          >
            <div className="day-card-hero">
              <img src={d.image} alt={d.title} loading="lazy" />
              <div className="day-card-overlay">
                <span className="day-badge">Tag {d.day} \u2013 {d.weekday}</span>
                <h3>{d.date}</h3>
              </div>
            </div>
            <div className="day-card-body">
              <div className="stops-timeline">
                {d.stops.map((s, i) => (
                  <div key={i} className="stop-item">
                    <div className="stop-name">{s.name} {s.km && <span className="stop-km">({s.km})</span>}</div>
                    <div className="stop-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
              {d.hotel && (
                <div className="hotel-info">
                  <Hotel size={18} />
                  <span>{d.hotel}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Villa Romana del Tellaro */}
      <section className="section" id="villa-tellaro">
        <div className="section-header">
          <h2><Landmark size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Villa Romana del Tellaro</h2>
          <div className="section-divider" />
          <p>Spätrömische Pracht im Tal des Tellaro</p>
        </div>

        <div className="villa-feature">
          <div className="villa-feature-inner">
            <div className="villa-img">
              <img src={images.villaRomanaTellaro} alt="Villa Romana del Tellaro" loading="lazy" />
            </div>
            <div className="villa-text">
              <h3>Villa Romana del Tellaro</h3>
              <p className="subtitle">Noto, Provinz Syrakus \u2013 4. Jahrhundert n. Chr.</p>
              <p>
                Die Villa Romana del Tellaro ist eine spätrömische Landvilla aus dem 4. Jahrhundert n. Chr.,
                die am Ufer des Flusses Tellaro nahe der Barockstadt Noto liegt. Sie wurde 1971 zufällig
                entdeckt, als ein Bauer beim Pflügen auf antike Strukturen stieß. Die systematischen
                Ausgrabungen begannen erst in den 1980er Jahren.
              </p>
              <p>
                Die Villa gehörte vermutlich einem wohlhabenden römischen Latifundienbesitzer und diente
                als luxuriöser Landsitz inmitten der fruchtbaren Agrarlandschaft Südostsiziliens.
                Architektonisch ähnelt sie der berühmteren Villa Romana del Casale bei Piazza Armerina,
                ist jedoch kleiner und intimer.
              </p>
              <p>
                Berühmt ist die Villa vor allem für ihre herausragenden polychromen Bodenmosaiken,
                die zu den bedeutendsten spätantiken Mosaikfunden Siziliens zählen. Besonders bemerkenswert sind:
              </p>
            </div>
          </div>
        </div>

        <div className="sight-detail">
          <h4>Die Mosaiken im Detail</h4>
          <p>
            <strong>Jagdszene (Venatio):</strong> Ein großformatiges Mosaik zeigt eine dramatische Jagdszene
            mit exotischen Tieren \u2013 Löwen, Leoparden und Antilopen \u2013 die auf den Handel mit wilden Tieren
            für die römischen Arenen hinweist. Die Darstellung zeugt von den weitreichenden Handelsverbindungen
            des Villenbesitzers bis nach Nordafrika.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <strong>Szenen aus dem Trojanischen Krieg:</strong> Ein weiteres bedeutendes Mosaik illustriert
            Episoden aus dem Trojanischen Sagenkreis, darunter die Auslösung des Leichnams Hektors durch
            König Priamos. Diese mythologische Darstellung verrät die klassische Bildung des Auftraggebers.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <strong>Dionysische Szenen:</strong> Darstellungen des Gottes Dionysos/Bacchus mit seinem Gefolge
            aus Satyrn und Mänaden verweisen auf den Weinkult und die Fruchtbarkeit des sizilianischen Landes.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <strong>Geometrische Muster:</strong> Neben den figürlichen Darstellungen finden sich aufwändige
            geometrische und florale Muster, die die Nebenräume der Villa schmücken und von hoher
            handwerklicher Qualität zeugen.
          </p>
          <p style={{ marginTop: '1rem' }}>
            Die Villa wurde im 5. Jahrhundert n. Chr. aufgegeben, möglicherweise im Zuge der
            Vandaleneinfälle. Eine frühchristliche Nekropole, die über den Ruinen angelegt wurde,
            bezeugt die spätere Nutzung des Geländes. Heute ist die Villa als archäologisches Museum
            zugänglich und bietet einen faszinierenden Einblick in das luxuriöse Landleben der
            spätrömischen Oberschicht auf Sizilien.
          </p>
        </div>
      </section>

      {/* Restaurants */}
      <section className="section" id="restaurants">
        <div className="section-header">
          <h2><UtensilsCrossed size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Restaurant-Empfehlungen</h2>
          <div className="section-divider" />
          <p>Typisch sizilianische Osterien, Trattorien und Slow-Food-Lokale</p>
        </div>

        <div className="restaurants-grid">
          {restaurants.map((r, i) => (
            <motion.div
              key={i}
              className="restaurant-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeIn}
            >
              <div className="restaurant-img">
                <img src={r.image} alt={r.name} loading="lazy" />
              </div>
              <div className="restaurant-body">
                <h4>{r.name}</h4>
                <div className="restaurant-location">
                  <MapPin size={14} /> {r.location}
                </div>
                <p>{r.desc}</p>
                <div className="restaurant-tags">
                  {r.tags.map(t => <span key={t} className="restaurant-tag">{t}</span>)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Speisen */}
      <section className="section" id="speisen">
        <div className="section-header">
          <h2>Sizilianische Spezialitäten</h2>
          <div className="section-divider" />
          <p>Kulinarische Höhepunkte der Insel</p>
        </div>

        <div className="speisen-grid">
          {speisen.map((s, i) => (
            <motion.div
              key={i}
              className="speise-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="speise-img">
                <img src={s.image} alt={s.name} loading="lazy" />
              </div>
              <div className="speise-body">
                <h4>{s.name}</h4>
                <p>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Antike Texte */}
      <section className="section" id="texte">
        <div className="section-header">
          <h2><BookOpen size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Antike Texte zu Sizilien</h2>
          <div className="section-divider" />
          <p>Lateinische und griechische Quellen in deutscher Übersetzung</p>
        </div>

        {texte.map((t, i) => (
          <motion.div
            key={i}
            className="text-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h4>{t.title}</h4>
            <div className="text-source">{t.source}</div>
            <div className="text-columns">
              <div>
                <div className="text-label">{t.lang}</div>
                <div className="text-original">{t.original}</div>
              </div>
              <div>
                <div className="text-label">Deutsche Übersetzung</div>
                <div className="text-translation">{t.translation}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Glossar */}
      <section className="section" id="glossar">
        <div className="section-header">
          <h2><Languages size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Italienisches Glossar</h2>
          <div className="section-divider" />
          <p>Die wichtigsten Wörter und Redewendungen für unterwegs</p>
        </div>

        <div className="glossary-grid">
          {glossary.map((g, i) => (
            <div key={i} className="glossary-item">
              <span className="glossary-italian">{g.it}</span>
              <span className="glossary-german">{g.de}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Sizilien Kulturreise 2026 | Privatgymnasium der Herz-Jesu-Missionare</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>28. März \u2013 4. April 2026</p>
      </footer>
    </div>
  )
}

export default App
