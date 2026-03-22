import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Hotel, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Menu, X, UtensilsCrossed, BookOpen, Languages, Landmark, Navigation, ExternalLink, Info, Clock, Users, Globe, Map, FileText } from 'lucide-react'
import './App.css'

// Verified working Unsplash image URLs
const images = {
  hero: 'https://images.unsplash.com/photo-1678043007579-8d5d62056d05?w=1920&q=80',
  segesta: 'https://images.unsplash.com/photo-1605896801461-267e172a3759?w=800&q=80',
  erice: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  marsala: 'https://images.unsplash.com/photo-1686149501751-23d7698bd862?w=800&q=80',
  selinunte: 'https://images.unsplash.com/photo-1610547189313-1fbea2dcd059?w=800&q=80',
  agrigento: 'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?w=800&q=80',
  piazzaArmerina: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=800&q=80',
  noto: 'https://images.unsplash.com/photo-1512119384946-808e3d503064?w=800&q=80',
  siracusa: 'https://images.unsplash.com/photo-1753541723153-377729c7e05c?w=800&q=80',
  catania: 'https://images.unsplash.com/photo-1641286894787-4a2a97a1e34a?w=800&q=80',
  taormina: 'https://images.unsplash.com/photo-1678043007579-8d5d62056d05?w=800&q=80',
  etna: 'https://images.unsplash.com/photo-1740387223785-6ab827ab4fb1?w=800&q=80',
  cefalu: 'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=800&q=80',
  palermo: 'https://images.unsplash.com/photo-1553901753-215db344677a?w=800&q=80',
  monreale: 'https://images.unsplash.com/photo-1561729730-bdbcce4cb15b?w=800&q=80',
  villaRomanaTellaro: 'https://images.unsplash.com/photo-1761495438507-33d43cedd55c?w=800&q=80',
  scalaDeiTurchi: 'https://images.unsplash.com/photo-1544475913-d45a76d9e199?w=800&q=80',
  arancini: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Arancini_002.jpg',
  cannoli: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Cannoli_siciliani.jpg',
  pasta: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Pasta_alla_Norma_-_Wiki_Loves_Sicilia.jpg',
  granita: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Granita_brioche.JPG',
  caponata: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Caponata_%2814049113982%29.jpg',
  cassata: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Cassatasiciliana.jpg',
  panelle: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Pane_e_panelle.jpg',
  pastaSarde: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Pasta_con_le_sarde_-_19960039311.jpg',
  sardeBeccafico: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Sarde_a_beccafico.jpg',
  sfincione: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Sfincione_palermitano.jpg',
  stoccafisso: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Stoccafisso_alla_messinese.jpg',
  biancomangiare: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Bianco_mangiare_limone_e_pistacchio_1.jpg',
  // Säulenordnungen
  doricCol: 'https://images.unsplash.com/photo-1721250150605-6f43bae03fce?w=800&q=80',
  ionicCol: 'https://images.unsplash.com/photo-1761701826167-9b5f164e2cf8?w=800&q=80',
  corinthianCol: 'https://images.unsplash.com/photo-1767551427154-bd320d9ba413?w=800&q=80',
}

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const personenDaten = [
  {
    name: 'Agatha, Heilige',
    lebensdaten: 'gest. 251',
    kategorie: 'Märtyrerin & Heilige',
    herkunft: 'Palermo oder Catania',
    farbe: '#8B3A3A',
    beschreibung: 'Wegen ihrer Treue zum christlichen Glauben unter Kaiser Decius zum Tode verurteilt und hingerichtet. Der Legende nach wurden ihr die Brüste mit Zangen abgeschnitten. Noch zu Lebzeiten das „Idol" vieler Zeitgenossen – Schutzpatronin von Catania.',
  },
  {
    name: 'Agathokles',
    lebensdaten: '360–289 v. Chr.',
    kategorie: 'König von Sizilien',
    herkunft: 'Rhegion (heute Reggio)',
    farbe: '#8B1A1A',
    beschreibung: 'Erster „König von Sizilien". Alleinherrscher von Syrakus seit 316 v. Chr., gründete 313 v. Chr. den Sizilischen Städtebund. Griff 311/310 v. Chr. die Karthager sogar in Nordafrika an. Polybios nannte ihn und Dionysios I. „die größten Staatsmänner aller Zeiten".',
  },
  {
    name: 'Antonello da Messina',
    lebensdaten: 'ca. 1430–1479',
    kategorie: 'Maler',
    herkunft: 'Messina',
    farbe: '#2C6E9E',
    beschreibung: 'Einziger sizilianischer Maler von europäischem Rang. Studierte in Neapel die altniederländische Malerei van Eycks und verband deren naturalistische Detailtreue mit dem italienischen Sinn für Perspektive. Wirkte in Venedig und beeinflusste die venezianische Malerei nachhaltig.',
  },
  {
    name: 'Archimedes',
    lebensdaten: '287–212 v. Chr.',
    kategorie: 'Mathematiker & Physiker',
    herkunft: 'Syrakus',
    farbe: '#2C6E9E',
    beschreibung: 'Größter Mathematiker und Physiker der Antike. Entdeckte das Hebelgesetz und den hydrostatischen Auftrieb, erfand die archimedische Schraube zur Wasserförderung. Als Sohn des Hofastronomen Phaidias in Syrakus geboren, kehrte er nach seiner Studienzeit in Alexandria heim und fiel 212 v. Chr. bei der Verteidigung seiner Stadt gegen die Römer.',
  },
  {
    name: 'Charondas',
    lebensdaten: 'ca. Ende 6. Jh. v. Chr.',
    kategorie: 'Gesetzgeber',
    herkunft: 'Katane (Catania)',
    farbe: '#2D6B4A',
    beschreibung: 'Neben Drakon und Solon einer der drei bedeutendsten Gesetzgeber der griechischen Antike. Sein Ruhm stand dem ihrigen in nichts nach. Seine Gesetze galten in den chalkidischen Gründungen Siziliens und Süditaliens und erlangten besonders in Katane und Rhegion Gesetzeskraft.',
  },
  {
    name: 'Dionysios I.',
    lebensdaten: 'ca. 430–367 v. Chr.',
    kategorie: 'Tyrann von Syrakus',
    herkunft: 'Syrakus',
    farbe: '#8B1A1A',
    beschreibung: 'Ab 405 v. Chr. Alleinherrscher von Syrakus. In 38 Regierungsjahren unterwarf oder zerstörte er Städte, drängte die Karthager aus Westsizilien zurück und dehnte seinen Einfluss über ganz Süditalien aus. Verfasste selbst literarische Werke. Polybios nannte ihn „größten Staatsmann aller Zeiten".',
  },
  {
    name: 'Empedokles',
    lebensdaten: 'ca. 495–435 v. Chr.',
    kategorie: 'Philosoph & Arzt',
    herkunft: 'Akragas (Agrigento)',
    farbe: '#7B6B52',
    beschreibung: 'Schöpfer der Lehre von den vier Elementen (Feuer, Wasser, Erde, Luft) und Religionsgründer. Befasste sich mit Astronomie, Kosmologie, Mathematik und Zoologie. Zu Lebzeiten wie ein Gott verehrt; seine Gestalt faszinierte Goethe, Hölderlin und Brecht. Soll freiwillig in den Ätna gesprungen sein.',
  },
  {
    name: 'Epicharmos',
    lebensdaten: '550–460 v. Chr.',
    kategorie: 'Dichter & Komödienvater',
    herkunft: 'Syrakus',
    farbe: '#2D6B4A',
    beschreibung: 'Indem er die altdorische Volksposse zur Kunstform erhob, gilt der Syrakusaner Epicharmos als Erfinder der Komödie. Berühmt waren seine Parodien der Götter und Helden. Sein Sentenzenreichtum brachte ihm den Ruf eines Philosophen ein.',
  },
  {
    name: 'Friedrich II. von Aragon',
    lebensdaten: '1272–1337',
    kategorie: 'König von Sizilien',
    herkunft: 'Valencia',
    farbe: '#8B6914',
    beschreibung: '1297 vom sizilianischen Parlament zum König gewählt. Kämpfte gegen Barcelona, die Anjou und das Papsttum. Schloss 1302 den Friedensvertrag von Caltabellotta, der festlegte, dass das Königreich nach seinem Tod an die Anjou fallen sollte – durfte sich fortan „König von Trinakria" nennen.',
  },
  {
    name: 'Friedrich II. von Hohenstaufen',
    lebensdaten: '1194–1250',
    kategorie: 'Kaiser & König',
    herkunft: 'Jesi (Marken)',
    farbe: '#8B6914',
    beschreibung: '„Stupor Mundi" – Staunen der Welt. König von Sizilien ab 1198, Deutscher König ab 1212, Kaiser des Heiligen Römischen Reiches ab 1220. Von Kind auf von arabischen, byzantinischen und hebräischen Gelehrten umgeben. Palermo war unter ihm Zentrum arabisch-christlich-jüdischer Gelehrsamkeit.',
  },
  {
    name: 'Giovanni Falcone',
    lebensdaten: '1939–1992',
    kategorie: 'Richter & Anti-Mafia-Kämpfer',
    herkunft: 'Palermo',
    farbe: '#1A5276',
    beschreibung: 'Italiens bekanntester Anti-Mafia-Richter. Aufgewachsen im Palermitaner Arbeiterviertel La Kalsa, studierte er Rechtswissenschaften und wurde Staatsanwalt. Als Leiter des „Pool Antimafia" führte er den historischen „Maxi-Prozesso" (1986–87) durch, bei dem 360 Bosse der Cosa Nostra verurteilt wurden. Am 23. Mai 1992 wurde er zusammen mit seiner Frau und drei Leibwächtern auf der Autobahn bei Capaci durch eine Autobombe ermordet.',
  },
  {
    name: 'Giovanni Verga',
    lebensdaten: '1840–1922',
    kategorie: 'Schriftsteller',
    herkunft: 'Catania',
    farbe: '#2E6B4F',
    beschreibung: 'Begründer des italienischen Verismus. Als Zwanzigjähriger kämpfte er begeistert mit Garibaldis Truppen – bald enttäuscht über die Repressalien. Seine bekanntesten Werke sind „Mastro Don Gesualdo", „Die Malavoglia" und „Cavalleria Rusticana", die Pietro Mascagni 1890 vertonte.',
  },
  {
    name: 'Gorgias',
    lebensdaten: 'ca. 485–380 v. Chr.',
    kategorie: 'Sophist & Rhetoriker',
    herkunft: 'Leontinoi (Lentini)',
    farbe: '#5B2D8A',
    beschreibung: 'Hauptvertreter der griechischen Sophistik und Vater der rhetorischen Kunstprosa. Reiste 427 v. Chr. als Gesandter nach Athen, wo er als Redner gefeiert und unbezahlbar wurde. Soll mit 110 Jahren entschlossen Speise und Trank verweigert haben, um seinem Leben ein Ende zu setzen.',
  },
  {
    name: 'Lucia, Heilige',
    lebensdaten: 'ca. 283–304',
    kategorie: 'Märtyrerin & Heilige',
    herkunft: 'Syrakus',
    farbe: '#8B3A3A',
    beschreibung: 'In Syrakus geboren, war die hl. Agatha ihr Vorbild. Von ihrem eigenen Verlobten angezeigt, erlitt sie den Märtyrertod während der letzten Christenverfolgung unter Diokletian. Schutzpatronin des Lichts und der Sehenden – ihr Festtag (13. Dezember) wird in Skandinavien besonders gefeiert.',
  },
  {
    name: 'Luigi Pirandello',
    lebensdaten: '1867–1936',
    kategorie: 'Schriftsteller',
    herkunft: 'Agrigento',
    farbe: '#2E6B4F',
    beschreibung: 'Nobelpreisträger für Literatur 1934. Studierte Philologie in Bonn und promovierte 1891. Ein sizilianischer Schriftsteller führte ihn in die römische Theaterwelt ein. Sein literarisches Werk umfasst Dramen, Novellen und Romane, die dem modernen Theater entscheidende Impulse gaben.',
  },
  {
    name: 'Paolo Borsellino',
    lebensdaten: '1940–1992',
    kategorie: 'Richter & Anti-Mafia-Kämpfer',
    herkunft: 'Palermo',
    farbe: '#1A5276',
    beschreibung: 'Enger Freund und Weggefährte Giovanni Falcones im Kampf gegen die Cosa Nostra. Ebenfalls in La Kalsa aufgewachsen, widmete er sein Leben der Strafverfolgung der Mafia. Nach Falcones Ermordung setzte er seine Arbeit unbeirrt fort, obwohl er wusste, dass sein Tod beschlossene Sache war. Am 19. Juli 1992 wurde er vor dem Haus seiner Mutter in der Via d\'Amelio in Palermo durch eine Autobombe getötet – zusammen mit fünf seiner Leibwächter. Beide Attentate erschütterten Italien und leiteten eine neue Phase der Anti-Mafia-Gesetzgebung ein.',
  },
  {
    name: 'Roger II.',
    lebensdaten: '1097–1154',
    kategorie: 'Normannenkönig',
    herkunft: 'Mileto (Kalabrien)',
    farbe: '#2D6B4A',
    beschreibung: '1130 zum König von Sizilien gekrönt – als einziger fehlte ihm die Krone. Von Kind auf von arabischen, byzantinischen und hebräischen Gelehrten umgeben. Unter seiner Regierung entwickelte sich Sizilien nicht nur zum bedeutendsten Kulturzentrum, sondern erreichte auch seine größte politische Ausdehnung.',
  },
  {
    name: 'Rosalia, Santa',
    lebensdaten: 'ca. 1130–1166',
    kategorie: 'Heilige & Stadtpatronin',
    herkunft: 'Palermo',
    farbe: '#8B3A6B',
    beschreibung: 'Schutzpatronin Palermos aus normannischem Adelsgeschlecht, vermutlich Verwandte Rogers II. Zog sich als junge Frau als Einsiedlerin in eine Höhle auf dem Monte Pellegrino zurück. 1625 wurden ihre Gebeine entdeckt – kurz darauf endete die verheerende Pest in Palermo. Seitdem wird ihr jährlich am 15. Juli das große Festino di Santa Rosalia gefeiert, eines der spektakulärsten Straßenfeste Italiens.',
  },
  {
    name: 'Salvatore Quasimodo',
    lebensdaten: '1901–1968',
    kategorie: 'Dichter',
    herkunft: 'Modica',
    farbe: '#2E6B4F',
    beschreibung: 'Nobelpreisträger für Literatur 1959. Sohn eines Bahnhofswärters aus Modica, studierte unter schwierigen Umständen Physik und Mathematik in Rom. 1930 veröffentlichte die Zeitschrift Solaria drei seiner Gedichte. Seine Übersetzungen der griechischen und römischen Klassiker gelten als Meisterwerke.',
  },
]

const regionFakten = [
  { icon: 'globe',       label: 'Fläche',               wert: '25.832 km²',         sub: '= 8,5 % Italiens; größte Insel des Mittelmeers' },
  { icon: 'users',       label: 'Einwohner',             wert: '4,84 Mio.',           sub: 'ISTAT 2024 – rückläufig seit 2001' },
  { icon: 'density',     label: 'Bevölkerungsdichte',    wert: '187 Einw./km²',       sub: 'Unter dem italienischen Durchschnitt (198)' },
  { icon: 'map',         label: 'Hauptstadt',            wert: 'Palermo',             sub: 'ca. 630.000 Einwohner (2024)' },
  { icon: 'provinces',   label: 'Provinzen',             wert: '9',                   sub: 'PA, AG, CL, CT, EN, ME, RG, SR, TP' },
  { icon: 'mountain',    label: 'Höchster Punkt',        wert: 'Ätna 3.357 m',        sub: 'Aktivster Vulkan Europas; fast täglich Aktivität' },
  { icon: 'waves',       label: 'Küstenlänge',           wert: '1.484 km',            sub: 'Tyrrhenisches, Ionisches & Afrikanisches Meer' },
  { icon: 'africa',      label: 'Entfernung zu Afrika',  wert: '140 km',              sub: 'Cap Bon, Tunesien – nächster afrikan. Punkt' },
  { icon: 'sun',         label: 'Sonnenstunden',         wert: '2.600 / Jahr',        sub: 'Palermo: eine der sonnigsten Städte Europas' },
  { icon: 'temp',        label: 'Ø Jahrestemperatur',    wert: '18,5 °C',             sub: 'Palermo; Sommer bis 38 °C, Winter mild 12 °C' },
  { icon: 'gdp',         label: 'BIP',                   wert: 'ca. 99 Mrd. €',       sub: '2023; ca. 20.500 € pro Kopf' },
  { icon: 'jobless',     label: 'Arbeitslosigkeit',      wert: '15,8 %',              sub: '2024; Jugendarbeitslosigkeit ca. 38 %' },
  { icon: 'tourism',     label: 'Tourismus',             wert: '15,2 Mio.',           sub: 'Ankünfte 2023/24 – Rekordentwicklung' },
  { icon: 'unesco',      label: 'UNESCO-Welterbe',       wert: '7 Stätten',           sub: 'u.a. Agrigento, Syrakus, Ätna, Noto, Monreale' },
  { icon: 'wine',        label: 'Weinproduktion',        wert: 'ca. 5 Mio. hl',       sub: '2024; Nero d\'Avola, Marsala, Etna DOC' },
  { icon: 'olives',      label: 'Olivenanbau',           wert: '150.000+ ha',         sub: 'Drittgrößte Olivenöl-Produktion Italiens' },
  { icon: 'airports',    label: 'Internationale Airports',wert: '3',                  sub: 'Catania-Fontanarossa, Palermo-Falcone, Trapani' },
  { icon: 'uni',         label: 'Älteste Universität',   wert: 'Catania 1434',        sub: 'Zweite älteste Italiens nach Bologna (1088)' },
  { icon: 'comuni',      label: 'Gemeinden',             wert: '391',                 sub: 'Kleinste: Assoro (EN) mit ca. 4.600 Ew.' },
  { icon: 'messina',     label: 'Meerenge von Messina',  wert: '3,2 km',              sub: 'Schmalste Stelle zwischen Sizilien & Kalabrien' },
  { icon: 'islands',     label: 'Vorgelagerte Inseln',   wert: '3 Inselgruppen',      sub: 'Äolische, Ägadische & Pelagische Inseln' },
  { icon: 'mafia',       label: 'Sitz der Antimafia',    wert: 'Palermo',             sub: 'Commissione parlamentare antimafia seit 1962' },
  { icon: 'mosaik',      label: 'Größtes antikes Mosaik',wert: '3.500 m²',            sub: 'Villa Romana del Casale, Piazza Armerina (UNESCO)' },
  { icon: 'mountain2',   label: 'Naturschutzgebiete',    wert: 'über 80',             sub: 'Inkl. Ätna-Nationalpark, Nebrodi, Zingaro' },
  { icon: 'pop2',        label: 'Bevölkerungsentwicklung',wert: '−6,3 % seit 2001',   sub: 'Starke Abwanderung v.a. junger Sizilianer nach Norditalien' },
]

const regionProvinzen = [
  { kuerzel: 'PA', name: 'Palermo',      flaeche: 4992, einwohner: 1195000, hauptstadt: 'Palermo',      hs_ew: 630000 },
  { kuerzel: 'CT', name: 'Catania',      flaeche: 3552, einwohner: 1100000, hauptstadt: 'Catania',      hs_ew: 310000 },
  { kuerzel: 'ME', name: 'Messina',      flaeche: 3247, einwohner:  615000, hauptstadt: 'Messina',      hs_ew: 225000 },
  { kuerzel: 'AG', name: 'Agrigento',    flaeche: 3042, einwohner:  443000, hauptstadt: 'Agrigento',    hs_ew:  59000 },
  { kuerzel: 'TP', name: 'Trapani',      flaeche: 2461, einwohner:  432000, hauptstadt: 'Trapani',      hs_ew:  67000 },
  { kuerzel: 'EN', name: 'Enna',         flaeche: 2562, einwohner:  157000, hauptstadt: 'Enna',         hs_ew:  26000 },
  { kuerzel: 'SR', name: 'Siracusa',     flaeche: 2180, einwohner:  396000, hauptstadt: 'Siracusa',     hs_ew: 120000 },
  { kuerzel: 'CL', name: 'Caltanissetta',flaeche: 2128, einwohner:  263000, hauptstadt: 'Caltanissetta',hs_ew:  59000 },
  { kuerzel: 'RG', name: 'Ragusa',       flaeche: 1614, einwohner:  318000, hauptstadt: 'Ragusa',       hs_ew:  73000 },
]

const regionIconMap: Record<string, string> = {
  globe: '🌍', users: '👥', density: '📊', map: '🏛️', provinces: '🗺️',
  mountain: '🌋', waves: '🌊', africa: '🌍', sun: '☀️', temp: '🌡️',
  gdp: '💶', jobless: '📉', tourism: '✈️', unesco: '🏛️', wine: '🍷',
  olives: '🫒', airports: '🛫', uni: '🎓', comuni: '🏘️', messina: '⚓',
  islands: '🏝️', mafia: '⚖️', mosaik: '🎨', mountain2: '🌿', pop2: '📉',
}
const regionIcon = (key: string) => regionIconMap[key] ?? '📌'

const zeittafelDaten = [
  {
    epoche: 'Vor- und Frühgeschichte',
    zeitraum: '35.000–750 v. Chr.',
    farbe: '#7B6B52',
    ereignisse: [
      { datum: '35.000–5.000 v. Chr.', text: 'Spätes Paläolithikum: Sammler- und Jägerkulturen; Felsmalereien in den Grotten am Monte Pellegrino (Palermo)' },
      { datum: '5.000–3.000 v. Chr.', text: 'Neolithikum: Sesshaftigkeit, Ackerbau und Viehzucht; Stentinello-Kultur mit bemalter Keramik' },
      { datum: '3.000–2.000 v. Chr.', text: 'Kupferzeit: erste Metallverarbeitung; Kulturen von Malpasso und Serraferlichio' },
      { datum: '2.000–1.000 v. Chr.', text: 'Bronzezeit: dörfliche Ansiedlungen; Castelluccio-, Thapsos- und Pantalica-Kultur' },
      { datum: '1.000–750 v. Chr.', text: 'Phönizische Handelsstützpunkte entstehen: Motye (bei Marsala) und Panormos (Palermo)' },
    ]
  },
  {
    epoche: 'Griechen',
    zeitraum: 'ab 750 v. Chr.',
    farbe: '#2C6E9E',
    ereignisse: [
      { datum: '735–580 v. Chr.', text: 'Griechische Stadtgründungen: Naxos (735), Syrakus/Siracusa (734), Zanklé/Messina (730), Katane/Catania (729), Selinunte (628), Akragas/Agrigento (582)' },
      { datum: '480 v. Chr.', text: 'Sieg bei Himera: griechische Städte besiegen die Karthager; Beginn der klassischen Blütezeit' },
      { datum: '415–413 v. Chr.', text: 'Sizilische Expedition Athens scheitert katastrophal vor Syrakus – Thukydides nennt es die „größte Katastrophe der griechischen Geschichte"' },
      { datum: '409 v. Chr.', text: 'Karthager zerstören Selinunt und Himera; blutiger Rachefeldzug des Hannibal Mago' },
      { datum: '405–367 v. Chr.', text: 'Dionysios I. Tyrann in Syrakus; macht die Stadt zur mächtigsten Kraft im westlichen Mittelmeer' },
      { datum: '344–337 v. Chr.', text: 'Timoleon aus Korinth stellt Demokratie und Frieden in Syrakus wieder her' },
      { datum: '316–289 v. Chr.', text: 'Agathokles führt Krieg gegen Karthago; nach seinem Tod Anarchie auf Sizilien' },
    ]
  },
  {
    epoche: 'Römer',
    zeitraum: '264 v. Chr. – 468 n. Chr.',
    farbe: '#8B1A1A',
    ereignisse: [
      { datum: '264–241 v. Chr.', text: 'Erster Punischer Krieg: 241 v. Chr. wird Sizilien erste Provinz des Römischen Reiches' },
      { datum: '218–201 v. Chr.', text: 'Zweiter Punischer Krieg: Syrakus fällt nach dem Tod Hierons II.; Sizilien vollständig unter römischer Kontrolle' },
      { datum: '135–101 v. Chr.', text: 'Zwei große Sklavenkriege erschüttern die Insel; Hunderttausende Sklaven auf den Latifundien' },
      { datum: '73–71 v. Chr.', text: 'Statthalter Verres plündert systematisch Siziliens Kunstwerke; Cicero klagt ihn an (In Verrem)' },
      { datum: '27 v. Chr.–200 n. Chr.', text: 'Pax Romana: Sizilien als Kornkammer Roms; Bau von Theatern und Amphitheatern; ruhigste Epoche der Geschichte' },
    ]
  },
  {
    epoche: 'Byzantiner & Araber',
    zeitraum: '468–1061 n. Chr.',
    farbe: '#5B2D8A',
    ereignisse: [
      { datum: '440', text: 'Die Vandalen unter Geiserich fallen in Sizilien ein – erste germanische Herrschaft über die Insel' },
      { datum: '468–535', text: 'Sizilien unter vandalischer und ostgotischer Herrschaft' },
      { datum: '535', text: 'Belisár, Feldherr Kaiser Justinians, erobert Sizilien zurück; Rückkehr zu byzantinischer Verwaltung' },
      { datum: '827', text: 'Arabische Invasion: 10.000 Mann unter General Euphemius landen in Mazara del Vallo' },
      { datum: '878', text: 'Syrakus fällt nach langer Belagerung; Palermo wird zur muslimischen Hauptstadt (bis 965)' },
      { datum: 'ab 948', text: 'Kalbiten-Emirat: Palermo blüht als eine der prächtigsten Städte Europas auf; Hochkultur mit Wissenschaft und Dichtung' },
    ]
  },
  {
    epoche: 'Normannen – Monarchia Sicula',
    zeitraum: '1061–1197',
    farbe: '#2D6B4A',
    ereignisse: [
      { datum: '1061', text: 'Roger I. nimmt Messina ein; Beginn der normannischen Rückeroberung von den Arabern' },
      { datum: '1071', text: 'Noto als letzter arabischer Stützpunkt fällt; Ende der arabischen Herrschaft' },
      { datum: '1130', text: 'Roger II. wird König von Sizilien: das Normannenreich vereint arabische, byzantinische und romanische Kultur einzigartig' },
      { datum: '1140', text: 'Gesetzgebungswerk des Roger II.: eines der fortschrittlichsten Rechtssysteme des Mittelalters' },
      { datum: '1186', text: 'Heirat von Konstanze, Tochter Rogers II., mit dem späteren deutschen Kaiser Heinrich VI.' },
      { datum: '1194', text: 'Heinrich VI. erhält die Krone des Königreichs Sizilien; Beginn der staufischen Herrschaft' },
    ]
  },
  {
    epoche: 'Staufer, Anjou & Aragonesen',
    zeitraum: '1197–1516',
    farbe: '#8B6914',
    ereignisse: [
      { datum: '1198', text: 'Friedrich II. wird als Dreijähriger König von Sizilien (1198), später deutscher König (1212) und Kaiser des Heiligen Römischen Reiches (1220)' },
      { datum: '1220', text: 'Friedrich II. Kaiser: Liber Augustalis; zentralisierter Rechtsstaat; Palermo als glanzvolles Kulturzentrum' },
      { datum: '1250', text: 'Tod Friedrichs II.; Verfall und Anarchie; Handel und Bevölkerungszahl sinken dramatisch' },
      { datum: '1266', text: 'Karl I. von Anjou übernimmt nach der Niederlage Manfreds das Königreich Sizilien; Beginn der Anjou-Herrschaft' },
      { datum: '1282', text: 'Sizilianische Vesper (30. März): Volksaufstand gegen die Anjou-Besatzer; Tausende Franzosen getötet' },
      { datum: '1347', text: 'Pest erreicht Sizilien; Bevölkerung bricht um die Hälfte ein; permanente Kriegszüge erschöpfen die Insel' },
      { datum: '1469', text: 'Heirat Ferdinands II. von Aragon mit Isabella von Kastilien: Grundstein des spanischen Weltreiches' },
      { datum: '1442', text: 'Alfons V. von Aragón erobert Neapel; er wird vom Papst als Alfons I. mit dem Königreich Neapel-Sizilien belehnt' },
      { datum: '1487', text: 'Einführung der Inquisition in Sizilien durch die katholischen Könige' },
    ]
  },
  {
    epoche: 'Spanische Herrschaft & Aufklärung',
    zeitraum: '1492–1860',
    farbe: '#8B3A3A',
    ereignisse: [
      { datum: '1492', text: 'Vertreibung der Juden und Muslime; massiver Verlust an Handwerkern, Gelehrten und Kapital' },
      { datum: '1500–20', text: 'Katastrophale Dürreperiode und Hungersnot erschüttern die Insel' },
      { datum: '1504', text: 'Ferdinand II. von Aragón verbindet Neapel-Sizilien mit der spanischen Krone; die spanische Herrschaft dauert bis 1713' },
      { datum: '1516', text: 'Sizilien fällt an Karl V.; Beginn der spanisch-habsburgischen Vizekönigs-Herrschaft' },
      { datum: '1571', text: 'Seeschlacht von Lepanto: Don Giovanni d\'Austria besiegt die osmanische Flotte; Ende der türkischen Seemacht im Mittelmeer' },
      { datum: '1669', text: 'Jahrhundert-Ausbruch des Ätna; Catania wird verwüstet; Lavamassen erreichen das Meer' },
      { datum: '1693', text: 'Verheerendes Erdbeben (ca. M 7,4) vernichtet Städte Südostsiziliens; Noto, Ragusa, Catania entstehen neu im Barockstil' },
      { datum: '1713', text: 'Nach dem Spanischen Erbfolgekrieg fällt Sizilien an Savoyen; 1735 übernehmen die spanischen Bourbonen die Herrschaft' },
      { datum: '1735–1860', text: 'Regierungszeit der spanischen Bourbonen in Neapel-Sizilien' },
      { datum: '1806–1815', text: 'Britische Besatzung unter General Bentinck; 1812 schafft Ferdinand III. den Feudalismus ab' },
      { datum: '1837', text: 'Cholera-Epidemie fordert allein in Palermo 70.000 Todesopfer' },
      { datum: '1848', text: 'Revolution: Aufstand gegen die Bourbonen; nach kurzer Unabhängigkeit blutige Niederschlagung' },
    ]
  },
  {
    epoche: 'Einigung & Moderne',
    zeitraum: 'ab 1860',
    farbe: '#2E6B4F',
    ereignisse: [
      { datum: '1860', text: 'Garibaldi landet mit den „Tausend" (I Mille) in Marsala; Sizilien wird Teil des neugegründeten Königreichs Italien' },
      { datum: '1893', text: 'Landarbeiterunruhen (Fasci Siciliani); die Mafia festigt ihre politische Macht' },
      { datum: '1908', text: 'Verheerendes Erdbeben von Messina: ca. 80.000 Todesopfer; Messina wird fast völlig zerstört' },
      { datum: '1943', text: 'Alliierte landen auf Sizilien (Unternehmen Husky, 10. Juli); Beginn der Befreiung Italiens' },
      { datum: '1946', text: 'Sizilien erhält Status einer autonomen Region innerhalb der Italienischen Republik' },
      { datum: '1992', text: 'Staatsanwälte Giovanni Falcone und Paolo Borsellino durch Mafia-Bombenanschläge ermordet; weltweite Erschütterung' },
      { datum: '1997', text: 'Teatro Massimo in Palermo nach 23 Jahren Restaurierung wiedereröffnet; Symbol des Aufbruchs gegen die Mafia' },
      { datum: '1950–84', text: 'Milliardenbeiträge der Cassa del Mezzogiorno sollen die wirtschaftliche Entwicklung Süditaliens ankurbeln; ein Großteil versickert in Mafia-Kanälen' },
      { datum: '2011', text: 'US-Museen geben aus Morgantina (Provinz Enna) geraubte antike Kunstwerke zurück – darunter eine Venusstatue' },
      { datum: '2014–17', text: '550.000 Flüchtlinge, vorwiegend aus Subsahara-Afrika, stranden an Siziliens Küsten; Tausende ertrinken im Mittelmeer' },
      { datum: '2018', text: 'Das Kulturfestival Manifesta lässt historische Paläste in Palermo restaurieren; Street-Art erblüht in vernachlässigten Vierteln wie der Kalsa' },
      { datum: '2019', text: 'Ätna-Ausbruch am 24. Dezember 2018 mit Nachbeben; heftige Eruptionen am Stromboli – Insel zeitweise für Besucher gesperrt' },
      { datum: '2022', text: 'Nach zwei Corona-Jahren erholt sich der Tourismus langsam; Sizilien setzt auf nachhaltigen Kulturtourismus' },
    ]
  },
]

interface OrdnungSlide { url: string; label: string; schema?: boolean }
interface OrdnungData { name: string; color: string; merkmale: string[]; beispiel: string; slides: OrdnungSlide[] }

const OrdnungCard = ({ o }: { o: OrdnungData }) => {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % o.slides.length), 7000)
    return () => clearInterval(t)
  }, [o.slides.length])
  const s = o.slides[idx]
  return (
    <motion.div className="arch-ordnung-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
      <div className={`arch-ordnung-img${s.schema ? ' arch-ordnung-schema' : ''}`}>
        <img src={s.url} alt={s.label} loading="lazy" className={s.schema ? 'schema-rotated' : ''} />
        <div className="arch-ordnung-overlay" style={{ borderColor: o.color }}>
          <h4 style={{ color: o.color }}>{o.name}</h4>
          <span className="arch-slide-label">{s.label}</span>
        </div>
        <div className="arch-ordnung-dots">
          {o.slides.map((_, i) => (
            <button key={i} className={`arch-ordnung-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      </div>
      <div className="arch-ordnung-body">
        <ul>{o.merkmale.map((m, j) => <li key={j}>{m}</li>)}</ul>
        <div className="arch-beispiel">📍 {o.beispiel}</div>
      </div>
    </motion.div>
  )
}

// Detailed sight information database
const sightDetails: Record<string, { summary: string; detail: string; wikipedia?: string; planUrl?: string; facts?: string[]; photos?: {url: string; caption: string}[]; textBoxes?: {title: string; content: string}[] }> = {
  'Segesta': {
    summary: 'Bedeutende Stadt der Elymer im Nordwesten Siziliens mit einem der besterhaltenen dorischen Tempel Europas.',
    detail: 'Segesta wurde im 7. Jh. v. Chr. von den Elymern gegründet, die sich auf trojanische Vorfahren beriefen. Der dorische Tempel (ca. 420 v. Chr.) misst 26 × 61 Meter mit 36 Säulen aus Travertin. Die Säulen wurden nie kanneliert und die Cella fehlt – der Tempel wurde vermutlich nie vollendet. Thukydides berichtet (VI, 6), dass die Segestaner 415 v. Chr. Athen um Hilfe gegen das mächtige Selinunt baten und dabei ihren Reichtum demonstrierten – was zur verhängnisvollen Sizilienexpedition Athens führte, die Thukydides als „die größte Katastrophe der griechischen Geschichte" bezeichnete. Der Historiker Diodor (XI, 21) überliefert, dass die Elymer sich auf die Trojaner als Vorfahren beriefen: Aeneas soll hier auf seiner Flucht aus Troja gelandet sein. Das Theater (3. Jh. v. Chr.) wurde unter Hieron II. in den Monte Barbaro gehauen. Mit 63 m Durchmesser bietet es 4.000 Zuschauern Platz und einen spektakulären Blick auf den Golf von Castellammare.',
    wikipedia: 'https://en.wikipedia.org/wiki/Segesta',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Segesta-Temple-Plan-bjs.png',
    facts: ['Ca. 420 v. Chr. (Tempel)', '36 dorische Säulen', 'Nie fertiggestellt', 'Theater: 4.000 Plätze', 'Sizilienexpedition Athens 415 v. Chr.'],
    photos: [
      { url: '/sicily-trip/1-SA-Segesta.jpg', caption: 'Dorischer Tempel von Segesta' },
      { url: '/sicily-trip/detail-Segesta-2.jpg', caption: 'Tempel im Abendlicht' },
      { url: '/sicily-trip/detail-Segesta-3.jpg', caption: 'Teatro Greco, Monte Barbaro' },
      { url: '/sicily-trip/detail-Segesta-4.jpg', caption: 'Tempel – Detailansicht' },
      { url: '/sicily-trip/detail-Segesta-Goethe.jpg', caption: 'Tempel – Goethe-Perspektive' },
      { url: '/sicily-trip/detail-Segesta-Theater-Rekonstruktion.jpg', caption: 'Theater – antike Rekonstruktion' },
    ]
  },
  'Monte Érice': {
    summary: 'Mittelalterliche Bergstadt auf 750 m Höhe mit phönizisch-griechischen Wurzeln und normannischer Burg.',
    detail: 'Érice thront auf dem gleichnamigen Berg (751 m) an der Westspitze Siziliens. Bereits die Phönizier errichteten hier ein Heiligtum der Astarte, das die Griechen als Tempel der Aphrodite Erycina übernahmen – Diodor (IV, 83) berichtet, dass Daidalos nach seiner Flucht aus Kreta hier für König Eryx einen goldenen Widder als Weihgeschenk schuf. Vergil lässt Aeneas hier seinen Vater Anchises begraben (Aeneis V). Das Heiligtum war so berühmt, dass Rom einen eigenen Tempel der Venus Erycina auf dem Kapitol errichtete (215 v. Chr.). Die Normannen bauten im 12. Jh. das Castello di Venere über den Resten des antiken Tempels. Heute ist Érice auch als Sitz des Ettore Majorana Centre for Scientific Culture bekannt, gegründet 1963 vom Physiker Antonino Zichichi, wo regelmäßig Nobelpreisträger tagen.',
    wikipedia: 'https://en.wikipedia.org/wiki/Erice',
    facts: ['751 m Höhe', 'Antikes Aphrodite-Heiligtum', 'Daidalos-Sage', 'Castello di Venere (12. Jh.)', 'Majorana-Zentrum (1963)'],
    photos: [
      { url: '/sicily-trip/detail-Erice-1.jpg', caption: 'Mittelalterliche Gassen von Érice' },
      { url: '/sicily-trip/detail-Erice-2.jpg', caption: 'Blick über die Westküste Siziliens' },
    ]
  },
  'Trapani': {
    summary: 'Hafenstadt an der Westspitze Siziliens mit barockem Stadtkern und lebhafter Altstadt.',
    detail: `Trapani (griech. Drepanon, „Sichel") verdankt seinen Namen der sichelförmigen Landzunge. Die Stadt war ein wichtiger punischer Hafen und Schauplatz der Seeschlacht von Drepana (249 v. Chr.) im Ersten Punischen Krieg, bei der Konsul Publius Claudius Pulcher die heiligen Hühner ins Meer werfen ließ, als sie nicht fressen wollten – mit den Worten „Dann sollen sie eben trinken!" (Valerius Maximus I, 4, 3). Er verlor die Schlacht und fast 100 Schiffe. Die Altstadt besticht durch barocke Kirchen, den Fischmarkt und die arabisch beeinflusste Architektur. Unter den Arabern (827–1072) war Trapani ein bedeutendes Handelszentrum. Berühmt sind die Prozessionen der Misteri am Karfreitag – 20 lebensgroße Figurengruppen aus dem 17./18. Jh., die 24 Stunden durch die Stadt getragen werden.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Trapani',
    facts: ['Gegründet: 8. Jh. v. Chr.', 'Seeschlacht 249 v. Chr.', 'Heilige-Hühner-Episode', 'Misteri (Karfreitag)', 'Tor zu den Ägadischen Inseln'],
    photos: [
      { url: '/sicily-trip/detail-Trapani-Stadtplan.jpg', caption: 'Stadtplan Trapani' },
      { url: '/sicily-trip/detail-Trapani-Postamt.jpg', caption: 'Historisches Postamt Trapani' },
    ],
    textBoxes: [
      { title: 'Die Salinen der Provinz Trapani', content: 'Der Ursprung der Salinen von Trapani geht möglicherweise bis auf die Phönizier zurück, schriftlich belegt ist ihre Existenz durch Plinius den Älteren im 1. Jh. n. Chr. Der hohe Salzgehalt (für Spezialisten: 3,5–4,5 Baumé) des Meerwassers, die geringen Niederschläge, hohen Temperaturen und häufigen Winde ermöglichen die Produktion von Salz während sechs Monaten im Jahr, etwa in der Zeit von März bis September.\n\nNoch in den 30er-Jahren des vergangenen Jahrhunderts produzierten die damals 53 Salinen von Trapani 200.000 Tonnen Salz pro Jahr, beschäftigten dabei mehr als 1500 Arbeiter. Dann setzte ein langer Niedergang ein. Erst in den letzten Jahrzehnten hat sich das Gewerbe mit staatlicher Unterstützung wieder erholt: Heute arbeiten wieder insgesamt fast 30 Salinen entlang der Via del Sale, produzieren auf 800 Hektar Fläche pro Jahr rund 100.000 Tonnen Salz und geben dabei etwa 100 Arbeitern eine ständige und weiteren 200 Kräften eine saisonale Beschäftigung.\n\nDas Grundprinzip des Verfahrens ist einfach. Aus größeren, tieferen Becken mit kühlerem Wasser am Rand der Lagune wird das Salzwasser über Kanäle in immer kleinere, flachere Becken gepumpt, wo es sich in der Sonne erwärmt. Mehr und mehr Wasser verdunstet, der Salzgehalt steigt an. Das „gemachte" Wasser (acqua fatta, 25 Baumé) in den letzten Verdunstungsbecken nimmt eine rötliche Färbung an, bald zeigen sich die ersten Salzschichten. Zweimal pro Sommer wird das Salz geerntet, in Form kleiner Hügel aufgeschichtet und zum Schutz vor Regen, Wind und Verunreinigungen mit Ziegeln bedeckt.\n\nViele der alten Salinen-Gebäude wurden restauriert, darunter insgesamt fünf Windmühlen, die zum Pumpen des Wassers von einem Becken zum nächsten, aber auch zum Mahlen des Salzes dienten. Eine von ihnen, die Hauptmühle der Saline Ettore e Infersa beim Inselchen Mozia, wurde als Museum eingerichtet, ein weiteres Salzmuseum findet sich in Nubia.' },
    ]
  },
  'Marsala': {
    summary: 'Berühmt für den gleichnamigen Wein und das im Museum ausgestellte punische Kriegsschiff.',
    detail: `Marsala (arab. Marsa Allah, „Hafen Gottes"), das antike Lilybaeum, war die letzte und stärkste punische Festung auf Sizilien. Im archäologischen Museum Baglio Anselmi befindet sich ein einzigartiges punisches Langschiff (Lilybaeum Ship) aus dem 3. Jh. v. Chr. – entdeckt 1971 von der Archäologin Honor Frost, einer Pionierin der Unterwasserarchäologie. Es ist eines der wenigen erhaltenen Kriegsschiffe der Antike. Polybios (I, 42) beschreibt die vergebliche römische Belagerung Lilybaeums 250–241 v. Chr. Am 11. Mai 1860 landete Giuseppe Garibaldi hier mit seinen 1.089 „Rothemden" (I Mille) und begann die Einigung Italiens. Der Marsala-Wein wurde 1773 vom englischen Kaufmann John Woodhouse „entdeckt", der Wein mit Branntwein versetzte, damit er die Seereise nach England überstehe.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Marsala',
    facts: ['Antik: Lilybaeum', 'Punisches Schiff (3. Jh. v. Chr.)', 'Honor Frost (1971)', 'Garibaldi 1860', 'Marsala-Wein ab 1773'],
    photos: [
      { url: '/sicily-trip/detail-Marsala-1.jpg', caption: 'Marsala – Salinen und Altstadt' },
    ],
    textBoxes: [
      { title: 'La Mattanza – Schlacht um den Thun', content: 'Seit etlichen Jahren ist die Mattanza (die letzte fand 2007 statt) Geschichte. Die traditionelle Jagd nach den großen Fischen, die mit Langleinen und seit neun Jahrhunderten betrieben wurde, fand Ende April bis Anfang Mai statt, wenn die Tiere auf dem Weg zum Laichen ins Meer schwammen. Schon im April wurden zwischen den Inseln und der sizilianischen Nordküste die kilometerlangen, sich verzweigenden Netze ausgelegt. Sie bildeten eine Reihe von sogenannten „Kammern" und mündeten schließlich in die „Todeskammer", aus der es für die Fische kein Zurück gab. Sieben bis acht Mal im Frühsommer war dies blutig. Dabei wurde die Todeskammer von Fischerbooten aus portiert. Drei Schiffe sicherten die Westseite, während der Rais (arab. Anführer) mit der Mehrheit der Männer in der Mitte des Getümmels von einem Schiff nach den Anweisungen des rais folgte. Den bedrängten Fischen wurde das Netz mehr und mehr verengt, bis das Meer von ihren Schlägen schäumte.\n\nIm Durchschnitt der letzten zwei Jahrzehnte, in denen die Mattanza betrieben wurde, lag die Strecke bei etwa tausend Thunfischen pro Jahr – deutlich weniger als in den besten Zeiten Mitte des 19. Jh., als in manchen Jahren Rekordfänge von über 10.000 Tieren erzielt wurden. Und wenn die Überfischung durch immer offensivere Fangschiffe anhält, wird der Mittelmeer-Thunfisch bald ausgestorben sein.\n\nDie geringe Anzahl verbliebener Thunfische und die strikte Regulierung der Fangmengen durch die italienische Regierung machten die Mattanza Ende der 90er Jahre unrentabel. Favignana, das als Tonnara galt, war einer der letzten Orte Italiens, wo das harte Handwerk ausgeübt wurde. Dabei gab es auf Sizilien einmal mehr als 80 „Tonnare" – Vergangenheit.' },
    ]
  },
  'Cave di Cusa': {
    summary: 'Antiker Steinbruch, aus dem die Tempel von Selinunt erbaut wurden – Säulentrommeln liegen noch in situ.',
    detail: 'Die Cave di Cusa sind ein antiker Kalksteinbruch, der die Tempel von Selinunt mit Baumaterial versorgte. Die Arbeiten wurden 409 v. Chr. abrupt abgebrochen, als die Karthager Selinunt zerstörten. Faszinierend sind die in verschiedenen Bearbeitungsstadien zurückgelassenen Säulentrommeln – vom ersten Rohschnitt bis zur fast fertigen Trommel. Man kann den gesamten antiken Produktionsprozess nachvollziehen: Einritzen der kreisförmigen Umrisse, Herauslösen der Trommeln, Transport auf Holzschlitten.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cave_di_Cusa',
    facts: ['Lieferant für Selinunts Tempel', 'Aufgegeben 409 v. Chr.', 'Säulentrommeln in situ', 'Freier Eintritt']
  },
  'Selinunte': {
    summary: 'Größter archäologischer Park Europas mit einer der bedeutendsten griechischen Tempelanlagen.',
    detail: 'Selinunt (griech. Selinus, nach dem wilden Sellerie/Eppich benannt) wurde 628 v. Chr. als Kolonie von Megara Hyblaea gegründet und war die westlichste griechische Stadt Siziliens. Der archäologische Park umfasst über 270 Hektar mit acht monumentalen Tempeln. Der Tempel E (Hera-Tempel, 5. Jh. v. Chr.) ist der am besten erhaltene. Der kolossale Tempel G (Zeus/Apollo, 113 × 54 m) war einer der größten griechischen Tempel überhaupt – seine Säulen hatten einen Durchmesser von 3,40 m, er wurde über 100 Jahre gebaut und nie vollendet. Diodor (XIII, 54–59) schildert eindringlich die Zerstörung 409 v. Chr. durch den Karthager Hannibal Mago (Enkel des bei Himera 480 v. Chr. gefallenen Hamilkar): 16.000 Einwohner wurden getötet, 5.000 verschleppt. Der Philosoph Empedokles aus Akragas soll laut Diogenes Laertius die Malaria in Selinunt bekämpft haben, indem er auf eigene Kosten zwei Flüsse umleiten ließ.',
    wikipedia: 'https://en.wikipedia.org/wiki/Selinunte',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Selinunte-TempleC-Plan-bjs.png',
    facts: ['Gegründet: 628 v. Chr.', '8 monumentale Tempel', 'Tempel G: 113 × 54 m', 'Zerstört: 409 v. Chr.', 'Empedokles und die Malaria'],
    photos: [
      { url: '/sicily-trip/2-SO-Selinunte.jpg', caption: 'Tempel E (Hera-Tempel)' },
      { url: '/sicily-trip/detail-Selinunte-1.jpg', caption: 'Tempel im archäologischen Park' },
      { url: '/sicily-trip/detail-Selinunte-TempelE.jpg', caption: 'Tempel E – Nahaufnahme' },
      { url: '/sicily-trip/detail-Selinunte-Rekonstruktion.jpg', caption: 'Rekonstruktion der Tempelanlage' },
      { url: '/sicily-trip/detail-Selinunte-TempelRekonstruktion.jpg', caption: 'Tempel – antike Rekonstruktionszeichnung' },
      { url: '/sicily-trip/detail-Selinunte-Demeter.jpg', caption: 'Demeterheiligtum' },
      { url: '/sicily-trip/detail-Selinunte-Karte.jpg', caption: 'Karte des archäologischen Parks' },
    ]
  },
  'Scala dei Turchi': {
    summary: 'Spektakuläre weiße Kalksteinklippen an der Südküste – ein Naturwunder.',
    detail: `Die Scala dei Turchi („Türkentreppe") bei Realmonte ist eine atemberaubende Formation aus blendend weißem Mergel-Kalkstein (Marna), der durch Wind und Wellen zu einer natürlichen Treppe geformt wurde. Der Name erinnert an die Sarazenen- und Türkenüberfälle des 16. Jh., die hier an der glatten Felswand anlandeten. Das Naturdenkmal kontrastiert spektakulär mit dem türkisblauen Meer und dem goldenen Sand.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Scala_dei_Turchi',
    facts: ['Weißer Mergel-Kalkstein', 'Naturdenkmal', 'Nahe Agrigento', 'Freier Zugang']
  },
  'Agrigento': {
    summary: `Das „Tal der Tempel" – eine der bedeutendsten archäologischen Stätten der Welt (UNESCO).`,
    detail: 'Akragas wurde 581 v. Chr. von Kolonisten aus Gela gegründet. Unter dem Tyrannen Theron (488–472 v. Chr.) erlebte die Stadt ihre Blütezeit: Nach dem Sieg über die Karthager bei Himera 480 v. Chr. wurden mit der Beute die monumentalen Tempel errichtet. Der Concordia-Tempel ist einer der besterhaltenen griechischen Tempel weltweit (dank seiner Umwandlung zur Kirche durch Bischof Gregorius im 6. Jh.). Der Olympieion (113 × 56 m) trug 38 gewaltige Telamonen (7,5 m hohe Atlanten-Figuren). Pindar (Olympische Ode II) pries Theron: „Der nach dem Guten strebt mit aller Kraft..." Der Philosoph Empedokles (ca. 490–430 v. Chr.) stammte aus Akragas – er lehrte die vier Elemente und soll sich in den Ätna gestürzt haben. Diodor berichtet, dass die Akragantiner ihre Pferde so luxuriös hielten, dass sie ihnen Grabmäler errichteten.',
    wikipedia: 'https://en.wikipedia.org/wiki/Valle_dei_Templi',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Akragas-sitemap-bjs.jpg',
    facts: ['Gegründet: 581 v. Chr.', 'UNESCO seit 1997', 'Tyrann Theron (488–472)', 'Empedokles (490–430)', 'Olympieion: 113 × 56 m'],
    photos: [
      { url: '/sicily-trip/2-SO-Agrigento.jpg', caption: 'Concordia-Tempel im Tal der Tempel' },
      { url: '/sicily-trip/detail-Agrigento-1.jpg', caption: 'Concordia-Tempel bei Nacht' },
      { url: '/sicily-trip/detail-Agrigento-Ekklesiasterion.jpg', caption: 'Ekklesiasterion – antike Volksversammlung' },
      { url: '/sicily-trip/detail-Agrigento-Karte.jpg', caption: 'Karte des Archäologischen Parks' },
    ],
    textBoxes: [
      { title: 'Göttlicher Empedokles', content: 'Der um 490 v. Chr. in Akragas geborene Empedokles war ein echtes Multitalent: Philosoph, demokratischer Politiker, Arzt und Dichter. Von ihm stammt die These, die Welt bestehe aus den vier Grundelementen Feuer, Wasser, Luft und Erde. Durch die Urkräfte Liebe und Hass auf ewig in Bewegung gehalten, vermischten sich diese Elemente beständig – es gebe also kein Werden und Vergehen, sondern nur ständigen Wandel. Der Anhänger der Lehre von der Seelenwanderung war auch ein glühender Verfechter der Gleichheit aller Geschöpfe. Als Konsequenz forderte er die Abschaffung der Sklaverei und der Tieropfer.\n\nBei der Bevölkerung höchst beliebt war er hauptsächlich seiner praktischen Ideen wegen: Die kollabierende Kanalisation von Selinunt brachte er durch Umleitung zweier Bäche in Schwung, und seine Heimatstadt befreite er vom Gestank der Sümpfe, indem er als Luftschneise eine künstliche Schlucht in die Hügel von Akragas schlagen ließ. Die Verehrung, die das Volk Empedokles entgegenbrachte, stellte ihn einem Gott gleich. Nicht gerade bescheiden sah er sich ebenso: „Nicht mehr als Mensch, als unsterblicher Gott wandl ich unter euch, von allen geehrt, wie es sich gehört …" hieß es in einem seiner Lieder.\n\nUm seinen Tod ranken sich verschiedene Legenden: von Flammen umgeben soll er sich gen Himmel erhoben haben, einer anderen Version zufolge selbstmörderisch in den Krater des Ätna gesprungen sein. Nüchterne Historiker allerdings lassen sein Leben um 430 v. Chr. im politischen Exil auf dem Peloponnes enden.' },
    ]
  },
  'Gela': {
    summary: 'Bedeutende griechische Kolonie – Geburtsort des Tyrannen Gelon und Sterbeort des Aischylos.',
    detail: 'Gela wurde 688 v. Chr. von Kolonisten aus Rhodos und Kreta gegründet. Hier wuchs Gelon auf, der 485 v. Chr. Syrakus eroberte und es zur mächtigsten Stadt der griechischen Welt machte. 480 v. Chr. schlug er die Karthager bei Himera – am selben Tag, so die Überlieferung, als die Griechen bei Salamis die Perser besiegten. Aischylos, der Vater der griechischen Tragödie, starb hier 456 v. Chr. – laut Plinius (X, 7) soll ein Adler eine Schildkröte auf seinen kahlen Kopf fallen gelassen haben, die er für einen Felsen hielt. Der Dichter selbst soll als Grabinschrift nur seine Teilnahme an der Schlacht von Marathon erwähnt haben, nicht seine Dramen. Das Museum zeigt bemalte Terrakotta-Sarkophage und die berühmten Münzen mit dem Flussgott Gelas auf einem Stier.',
    wikipedia: 'https://en.wikipedia.org/wiki/Gela',
    facts: ['Gegründet: 688 v. Chr.', 'Tyrann Gelon', 'Aischylos † 456 v. Chr.', 'Schlacht bei Himera 480', 'Berühmte Münzprägung'],
    textBoxes: [
      { title: 'Die tödliche Schildkröte', content: '„Das Ende des Dichters Aischylos war zwar kein freiwilliges, dennoch ist es wegen seiner Besonderheit bemerkenswert. Er machte einen Spaziergang außerhalb der sizilischen Stadt, in der er sich aufhielt, und setzte sich an einer sonnigen Stelle nieder. Da flog über ihm ein Adler mit einer Schildkröte in den Klauen, wurde durch den Glanz seines Kopfes getäuscht – er war nämlich von Haaren entblößt – und warf auf diesen, als wäre er ein Stein, das Tier hinab, damit es zerschmettere und er seines Fleisches habhaft würde. Dieser Wurf tötete den Erfinder und Meister des höheren Trauerspiels."\n\nValerius Maximus, aus: „Sizilien", Eckart Peterich. Geschehen im Jahr 456 v. Chr. zu Gela. Von Aischylos stammt z.B. das Drama „Die Perser".' },
    ]
  },
  'Piazza Armerina': {
    summary: 'Die Villa Romana del Casale mit 3.500 m² spätantiken Mosaiken – UNESCO-Weltkulturerbe.',
    detail: `Die Villa Romana del Casale (3.–4. Jh. n. Chr.) gehörte vermutlich einem Angehörigen der senatorischen Aristokratie, möglicherweise Lucius Aradius Valerius Proculus, der 340 n. Chr. Konsul war – oder sogar Kaiser Maximian (Mitregent Diokletians). Die 3.500 m² Bodenmosaiken sind die umfangreichsten der gesamten Antike, geschaffen von nordafrikanischen Werkstätten. Die „Bikini-Mädchen" zeigen junge Frauen beim Diskuswurf, Laufen und Ballspiel – das früheste Zeugnis weiblicher Sportbekleidung. Die Große Jagdszene (66 m Korridor) zeigt den Fang exotischer Tiere für die Arenen Roms: Löwen, Tiger, Nashörner, Elefanten. Die Mosaiken der kleinen Jagd zeigen eine Opferszene an die Göttin Diana. Nach einer Überschwemmung im 12. Jh. wurde die Villa verschüttet und erst 1929 durch den Archäologen Paolo Orsi wiederentdeckt.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Villa_Romana_del_Casale',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Villa-del-Casale-plan-color-bjs-1.jpg',
    facts: [`3.–4. Jh. n. Chr.`, `3.500 m² Mosaiken`, `UNESCO seit 1997`, `„Bikini-Mädchen"`, `Große Jagdszene: 66 m`, `Wiederentdeckt 1929`],
    photos: [
      { url: '/sicily-trip/3-MO-Piazza-Armerina.jpg', caption: 'Bikini-Mädchen-Mosaik' },
      { url: '/sicily-trip/detail-PiazzaArmerina-Plan.jpg', caption: 'Grundriss der Villa Romana del Casale' },
    ]
  },
  'Akrai': {
    summary: 'Syrakusanische Kolonie mit griechischem Theater und Aphroditetempel in den Ibleischen Bergen.',
    detail: 'Akrai (griech. Akrai, lat. Acrae) wurde 664 v. Chr. als erste Kolonie von Syrakus in den Ibleischen Bergen gegründet. Das kleine, aber gut erhaltene griechische Theater (3. Jh. v. Chr.) bot ca. 600 Zuschauern Platz. Besonders bemerkenswert sind die Santoni – zwölf in den Fels gehauene Reliefs der Göttin Kybele (Magna Mater) aus hellenistischer Zeit. Der Aphroditetempel und die Überreste des Bouleuterion (Ratsversammlung) zeugen von der Bedeutung der Stadt. Seit 2002 zusammen mit Syrakus und der Nekropole von Pantalica UNESCO-Weltkulturerbe.',
    wikipedia: 'https://en.wikipedia.org/wiki/Akrai',
    facts: ['Gegründet: 664 v. Chr.', 'Erste Kolonie von Syrakus', 'Santoni-Felsreliefs (Kybele)', 'UNESCO seit 2002']
  },
  'Noto': {
    summary: `Die „Hauptstadt des sizilianischen Barocks" – UNESCO-Weltkulturerbe nach dem Erdbeben von 1693.`,
    detail: 'Noto wurde nach dem verheerenden Erdbeben von 1693 (ca. 60.000 Tote in Ostsizilien) komplett neu aufgebaut – und zwar an einem neuen Standort, 10 km vom zerstörten Noto Antica entfernt. Die Barockarchitektur aus dem lokalen goldgelben Kalkstein, der im Abendlicht warm leuchtet, macht die Stadt einzigartig. Höhepunkte sind die Cattedrale di San Nicolò (deren Kuppel 1996 einstürzte und 2007 restauriert wurde), der Palazzo Ducezio (Rathaus), die Chiesa di San Domenico und der Palazzo Nicolaci mit seinen fantastischen Balkonen mit Pferden, Löwen und Meerjungfrauen. Seit 2002 UNESCO-Weltkulturerbe.',
    wikipedia: 'https://en.wikipedia.org/wiki/Noto',
    facts: ['Neubau nach Erdbeben 1693', 'UNESCO seit 2002', 'Goldgelber Kalkstein', 'Palazzo Nicolaci: Fantastische Balkone'],
    photos: [
      { url: '/sicily-trip/3-MO-Noto.jpg', caption: 'Cattedrale di San Nicolò' },
      { url: '/sicily-trip/detail-Noto-Stadtplan.jpg', caption: 'Stadtplan von Noto' },
    ]
  },
  'Villa Romana del Tellaro': {
    summary: 'Spätrömische Landvilla mit bedeutenden polychromen Bodenmosaiken aus dem 4. Jh. n. Chr.',
    detail: 'Die Villa Romana del Tellaro liegt am Ufer des Flusses Tellaro nahe Noto. Sie wurde 1971 zufällig entdeckt, als ein Bauer beim Pflügen auf antike Strukturen stieß. Die systematischen Ausgrabungen begannen in den 1980er Jahren. Die Villa gehörte einem wohlhabenden Latifundienbesitzer und ähnelt architektonisch der Villa Romana del Casale, ist aber kleiner und intimer. Berühmt sind die polychromen Bodenmosaiken: Eine dramatische Jagdszene (Venatio) mit exotischen Tieren, Szenen aus dem Trojanischen Krieg (Auslösung des Leichnams Hektors durch Priamos), dionysische Szenen mit Satyrn und Mänaden, sowie aufwändige geometrische Muster. Die Villa wurde im 5. Jh. aufgegeben, vermutlich im Zuge der Vandaleneinfälle.',
    wikipedia: 'https://en.wikipedia.org/wiki/Villa_Romana_del_Tellaro',
    facts: ['4. Jh. n. Chr.', 'Entdeckt 1971', 'Jagdszene, Troja-Szenen', 'Dionysische Mosaiken', 'Ähnlich Villa del Casale']
  },
  'Syrakus: Ortigia': {
    summary: 'Einst mächtigste Stadt der griechischen Welt – der Dom steht im antiken Athena-Tempel.',
    detail: `Syrakus wurde 734 v. Chr. von korinthischen Siedlern unter dem Oikisten Archias gegründet. Unter den Tyrannen Gelon und Hieron I. (5. Jh. v. Chr.) stieg es zur mächtigsten Stadt des westlichen Mittelmeerraums auf. Der Dom wurde in den Athena-Tempel (5. Jh. v. Chr.) hineingebaut – die dorischen Säulen sind noch heute sichtbar. Cicero (In Verrem II, 4.117) pries die Stadt als „die größte aller griechischen Städte, die schönste von allen" – und dokumentierte gleichzeitig die Plünderungen des Statthalters Verres (73–71 v. Chr.), der u.a. die Türen des Athena-Tempels rauben ließ. Am Hof Hierons I. wirkten die Dichter Pindar, Bakchylides und Aischylos. Die Fonte Aretusa geht auf den Mythos der Nymphe zurück, die vor dem Flussgott Alpheios von Olympia unter dem Meer hindurch nach Sizilien floh (Ovid, Metamorphosen V).`,
    wikipedia: 'https://en.wikipedia.org/wiki/Syracuse,_Sicily',
    facts: ['Gegründet: 734 v. Chr.', 'Dom im Athena-Tempel', 'Cicero gegen Verres', 'Pindar, Aischylos am Hof', 'UNESCO seit 2005'],
    photos: [
      { url: '/sicily-trip/3-MO-Siracusa-Duomo.jpg', caption: 'Dom von Syrakus (im Athena-Tempel)' },
      { url: '/sicily-trip/detail-Syrakus-Dom-1.jpg', caption: 'Innenraum des Doms' },
      { url: '/sicily-trip/detail-Syrakus-Dom-2.jpg', caption: 'Dorische Säulen im Dom' },
      { url: '/sicily-trip/detail-Syrakus-Dom-3.jpg', caption: 'Seitenkapelle' },
      { url: '/sicily-trip/detail-Syrakus-Dom-4.jpg', caption: 'Dom – weitere Innenansicht' },
      { url: '/sicily-trip/detail-Syrakus-Apollotempel.jpg', caption: 'Apollontempel auf Ortigia' },
      { url: '/sicily-trip/detail-Syrakus-Apollontempel-Grundriss.jpg', caption: 'Grundriss des Apollontempels' },
      { url: '/sicily-trip/detail-Syrakus-Olympieion-Grundriss.jpg', caption: 'Grundriss des Olympieion' },
      { url: '/sicily-trip/detail-Syrakus-Stadtplan.jpg', caption: 'Stadtplan von Syrakus' },
    ],
    textBoxes: [
      { title: 'Papyrus – das älteste Papier der Welt', content: '„Papier" kommt von Papyrus. Schon im dritten Jahrtausend vor Christus wurden die Stauden von den alten Ägyptern zur Herstellung von Schreibmaterial verwendet. Aber Papyrus ist vielseitig nutzbar: Die Wurzeln dienten auch als Nahrungsmittel, aus den Schafthüllen wurden Körbe und ganze Boote geflochten. In Europa wachsen die zur Familie der Riedgräser gehörenden Pflanzen nur auf Sizilien. Die hiesige Art unterscheidet sich allerdings geringfügig von der ägyptischen. Die oft geäußerte Annahme, Hieron II. habe die ersten Stauden von Pharao Ptolemäos II. (übrigens auch ein Grieche) erhalten, ist also eher zweifelhaft. Dennoch sind die in Siracusa an Souvenirständen erhältlichen Papyri praktisch durchgängig mit völlig unpassenden ägyptischen Motiven bedruckt.' },
      { title: 'Ein Frauenraub und die Folgen', content: 'Schon lange war Hades, Gott der Unterwelt, in Liebe entbrannt – die angebetete Persephone, schöne Tochter der Demeter, wollte jedoch von ihm nichts wissen. In seiner Not wandte er sich an Bruder Zeus. Der Göttervater lockte die Blumen pflückende Persephone mit einer besonders schönen Narzisse von ihren Freundinnen weg, einzig die Nymphe Kyane blieb bei ihr. Da griff Hades zu und verschleppte Persephone in die Unterwelt. Kyane, die ihre Herrin verteidigte, wurde von ihm in eine Quelle (Fonte Ciane bei Siracusa) verwandelt. Als Demeter vom Schicksal ihrer Tochter erfuhr, weinte sie bittere Tränen, aus denen der See von Pergusa wurde. Demeter, als Fruchtbarkeitsgöttin verantwortlich für die Landwirtschaft, grämte sich lange – zu lange, die Erde trocknete aus, das Getreide verdorrte. Schließlich musste Zeus eingreifen. Er zwang seinen Bruder zu einem Kompromiss: Acht Monate lang darf Persephone auf der Erde bleiben, und ihre glückliche Mutter sorgt für Wachstum allerorten. Vier Monate jedoch muss sie in der Unterwelt verbringen – der Winter war „erfunden".' },
    ]
  },
  'Archäologischer Park': {
    summary: `Griechisches Theater, „Ohr des Dionysios" und römisches Amphitheater.`,
    detail: `Der Parco Archeologico della Neapoli umfasst die wichtigsten antiken Monumente Siziliens. Das griechische Theater (5. Jh. v. Chr., erweitert unter Hieron II.) ist eines der größten der antiken Welt (138 m Durchmesser, 15.000 Plätze). Hier wurden Aischylos' Tragödien uraufgeführt – seine „Perser" wurden 472 v. Chr. in Syrakus wiederaufgeführt. Das „Ohr des Dionysios" benannte der Maler Caravaggio 1608 während seines Sizilien-Aufenthalts (er floh vor einer Mordanklage in Malta). Der Tyrann Dionysios I. (405–367 v. Chr.) soll hier die 7.000 athenischen Kriegsgefangenen von 413 v. Chr. eingesperrt haben – Thukydides (VII, 87) beschreibt ihr Elend in den Steinbrüchen als eines der grausamsten Schicksale des Peloponnesischen Krieges. Der Altar Hierons II. (200 × 23 m) diente der Opferung von 450 Stieren gleichzeitig.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Neapolis_(Syracuse)',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Top.neapolis-Cavallari.jpg',
    facts: ['Theater: 15.000 Plätze', 'Aischylos-Uraufführungen', 'Caravaggio 1608', 'Athenische Gefangene 413 v. Chr.', 'Altar: 450 Stiere'],
    photos: [
      { url: '/sicily-trip/detail-Syrakus-Ohr.jpg', caption: 'Eingang zum „Ohr des Dionysios"' },
      { url: '/sicily-trip/detail-Syrakus-Steinbrueche.jpg', caption: 'Latomie – antike Steinbrüche' },
      { url: '/sicily-trip/detail-Syrakus-Theater-Skene.jpg', caption: 'Skene des griechischen Theaters' },
      { url: '/sicily-trip/detail-Syrakus-Arch-Park-Karte.jpg', caption: 'Karte des Archäologischen Parks' },
    ]
  },
  'Castello Eurialo': {
    summary: 'Bedeutendstes antikes Festungswerk Siziliens – griechische Militärarchitektur.',
    detail: `Das Castello Eurialo wurde unter Dionysios I. ab 402 v. Chr. als Schlüsselfestung errichtet. Es war das komplexeste griechische Festungswerk der Antike: fünf Turmpaare, drei tiefe Trockengräben und ein unterirdisches Tunnelsystem. Bei der römischen Belagerung 214–212 v. Chr. setzte der Mathematiker Archimedes hier seine legendären Kriegsmaschinen ein: Katapulte, die Felsbrocken schleuderten, „Krallen des Archimedes" (Kräne, die Schiffe aus dem Wasser hoben) und angeblich Brennspiegel. Der römische General Marcellus soll gesagt haben: „Er übertrifft ja die hundertarmigen Riesen der Fabel!" (Plutarch, Marcellus 17). Archimedes wurde 212 v. Chr. bei der Eroberung von einem Soldaten getötet, trotz Marcellus' Befehl, ihn zu verschonen – seine letzten Worte: „Störe meine Kreise nicht!" (Noli turbare circulos meos).`,
    wikipedia: 'https://en.wikipedia.org/wiki/Euryalus_Fortress',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Mappa_del_Castello_Eurialo_sull%27Epipoli.jpg',
    facts: ['Ab 402 v. Chr. erbaut', `Archimedes' Kriegsmaschinen`, '„Störe meine Kreise nicht!"', 'Unterirdisches Tunnelsystem'],
    photos: [
      { url: '/sicily-trip/detail-FortEuryalos-Plan.jpg', caption: 'Grundriss des Castello Eurialo' },
    ]
  },
  'Catania': {
    summary: 'Barockstadt am Fuße des Ätna – aus Lavagestein nach dem Erdbeben 1693 neu erbaut.',
    detail: `Catania (griech. Katane, gegr. 729 v. Chr. von Naxos-Siedlern) wurde siebenmal zerstört und wiederaufgebaut. Der Tyrann Hieron I. vertrieb 476 v. Chr. die gesamte Bevölkerung und benannte die Stadt in Aitna um – Pindar widmete ihm die 1. Pythische Ode zur Neugründung. Nach dem Erdbeben von 1693 (ca. 16.000 Tote allein in Catania) schuf der Architekt Giovanni Battista Vaccarini den barocken Neubau aus schwarzem Lavagestein und weißem Kalkstein. Der Elefantenbrunnen (1736) – ein antiker Lavastein-Elefant mit ägyptischem Obelisk – ist sein Meisterwerk. Catania ist auch die Geburtsstadt des Komponisten Vincenzo Bellini (1801–1835), dessen Oper „Norma" dem Nationalgericht Pasta alla Norma den Namen gab. Im Teatro Romano (2. Jh. n. Chr., 7.000 Plätze) fanden noch bis ins 5. Jh. Aufführungen statt.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Catania',
    facts: ['Gegründet: 729 v. Chr.', '7× zerstört', 'UNESCO seit 2002', 'Bellini (1801–1835)', 'Vaccarinis Barock'],
    photos: [
      { url: '/sicily-trip/detail-Catania-Elefant.jpg', caption: 'Elefantenbrunnen auf der Piazza del Duomo' },
      { url: '/sicily-trip/detail-Catania-Stadtplan.jpg', caption: 'Stadtplan von Catania' },
    ]
  },
  'Ätna': {
    summary: 'Europas höchster und aktivster Vulkan (3.357 m) – UNESCO-Weltnaturerbe.',
    detail: `Der Ätna (ital. Etna, siz. Mungibeddu) ist mit 3.357 m der höchste aktive Vulkan Europas und seit 2013 UNESCO-Weltnaturerbe. Er ist seit über 500.000 Jahren aktiv; die erste dokumentierte Eruption war 475 v. Chr. Die Griechen verorteten hier die Schmiede des Hephaistos und das Gefängnis des Riesen Typhon. Pindar besang ihn als „Säule des Himmels". Die Auffahrt zum Rifugio Sapienza (1.910 m) bietet bizarre Mondlandschaften aus erkalteter Lava, Kraterkegel und bei klarem Wetter einen Blick über ganz Sizilien.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Mount_Etna',
    facts: ['3.357 m Höhe', 'UNESCO seit 2013', 'Aktiv seit 500.000 Jahren', 'Erste Eruption 475 v. Chr.', 'Schmiede des Hephaistos'],
    photos: [
      { url: '/sicily-trip/5-MI-Etna-Krater.jpg', caption: 'Krater des Ätna' },
      { url: '/sicily-trip/detail-Etna-1.jpg', caption: 'Lavalandschaft am Ätna' },
      { url: '/sicily-trip/5-MI-Etna2.jpg', caption: 'Panorama Ätna-Rundfahrt' },
    ]
  },
  'Alcantara-Schlucht': {
    summary: 'Spektakuläre Basaltschlucht mit bizarren prismatischen Lavagesteinsformationen.',
    detail: `Die Gole dell'Alcantara ist eine bis zu 25 m tiefe und nur 2–5 m breite Schlucht, die der Fluss Alcantara in einen prähistorischen Lavastrom gegraben hat. Einzigartig sind die prismatischen Basaltsäulen, die durch langsame Abkühlung der Lava entstanden – sie ähneln dem Giant's Causeway in Irland. Der Name Alcantara stammt vom arabischen al-Qantarah („die Brücke"). Im Sommer kann man durch das kalte Flusswasser in die Schlucht waten.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Alcantara_(river)',
    facts: [`Bis 25 m tief`, `2–5 m breit`, `Prismatische Basaltsäulen`, `Arab. „die Brücke"`],
    photos: [
      { url: '/sicily-trip/detail-Alcantara.jpg', caption: 'Prismatische Basaltsäulen der Alcantara-Schlucht' },
    ]
  },
  'Taormina': {
    summary: 'Legendärer Küstenort mit griechischem Theater und atemberaubendem Ätna-Panorama.',
    detail: 'Taormina (griech. Tauromenion) wurde 392 v. Chr. von Andromachos, dem Vater des Historikers Timaios, gegründet. Es nahm die Überlebenden des von Dionysios I. zerstörten Naxos auf. Das Teatro Greco (3. Jh. v. Chr., römisch umgebaut) bietet das berühmteste Panorama der Welt. Goethe schrieb am 7. Mai 1787: „Wenn man auch nur in Gedanken sich an jene Stelle versetzt, so ist es ein ungeheurer Anblick." Im 19. Jh. wurde Taormina zum Sehnsuchtsort: Der deutsche Fotograf Wilhelm von Gloeden schuf hier ab 1878 seine berühmten Fotografien, Oscar Wilde besuchte ihn 1897 nach seiner Haftentlassung. D.H. Lawrence lebte 1920–23 in Taormina und schrieb hier Teile von „Kangaroo". Zuletzt diente die Stadt als Drehort für „The White Lotus" (HBO, 2023) im Hotel San Domenico Palace.',
    wikipedia: 'https://en.wikipedia.org/wiki/Taormina',
    facts: ['Gegründet: 392 v. Chr.', 'Goethe: 7. Mai 1787', 'Von Gloeden, Oscar Wilde', 'D.H. Lawrence (1920–23)', 'White Lotus (HBO)'],
    photos: [
      { url: '/sicily-trip/5-MI-Taormina.jpg', caption: 'Teatro Greco mit Ätna-Panorama' },
      { url: '/sicily-trip/detail-Taormina-1.jpg', caption: 'Griechisches Theater von Taormina' },
      { url: '/sicily-trip/detail-Taormina-2.jpg', caption: 'Bühnenbereich des Theaters' },
      { url: '/sicily-trip/detail-Taormina-Stadtplan.jpg', caption: 'Stadtplan von Taormina' },
    ]
  },
  'Milazzo / Tindari': {
    summary: 'Wahlweise Äolische Inseln oder Tindari mit Theater, Basilika und Wallfahrtskirche.',
    detail: 'Tindari (griech. Tyndaris) wurde 396 v. Chr. von Dionysios I. gegründet und nach den Dioskuren Kastor und Polydeukes benannt. Das griechische Theater (3. Jh. v. Chr.) bietet einen herrlichen Blick über die Äolischen Inseln. Die Casa Romana zeigt gut erhaltene Mosaiken. Die Basilika (1. Jh. v. Chr.) ist eine der besterhaltenen römischen Marktbasiliken Siziliens. In der Wallfahrtskirche wird eine byzantinische Schwarze Madonna verehrt. Alternative: Von Milazzo kann man auf die Äolischen Inseln (Lipari, Vulcano, Stromboli) übersetzen – UNESCO-Weltnaturerbe seit 2000.',
    wikipedia: 'https://en.wikipedia.org/wiki/Tindari',
    facts: ['Gegründet: 396 v. Chr.', 'Schwarze Madonna', 'Äolische Inseln: UNESCO', 'Griech. Theater + Basilika'],
    photos: [
      { url: '/sicily-trip/6-DO-Tindari.jpg', caption: 'Tindari – Theater und Küste' },
      { url: '/sicily-trip/detail-Tindari-1.jpg', caption: 'Griechisches Theater von Tindari' },
      { url: '/sicily-trip/detail-Tindari-2.jpg', caption: 'Blick über die Äolischen Inseln' },
      { url: '/sicily-trip/detail-Lipari-Karte.jpg', caption: 'Karte der Insel Lipari' },
      { url: '/sicily-trip/detail-Vulcano-Karte.jpg', caption: 'Karte der Insel Vulcano' },
    ],
    textBoxes: [
      { title: '„Schwarz bin ich, aber schön"', content: 'Mit der Madonna Nera von Tindari ist natürlich eine Legende verknüpft. Das Schiff, das sie wahrscheinlich vor dem Bilderstreit in Byzanz (Ablehnung der Bilderverehrung) in Sicherheit gebracht hatte, strandete an der hiesigen Küste und konnte erst flottgemacht werden, nachdem die Muttergottes von Bord gebracht war – die Madonna hatte ihr Plätzchen gewählt und wollte offenbar in Tyndaris bleiben …\n\nBald kamen die ersten Pilger, darunter eine von weither angereiste Mutter mit ihrem Kind. Von der dunklen Dame gar nicht angetan, schimpfte sie laut haltlos drauflos. Die Madonna konterte kühl: „Schwarz bin ich, aber schön". Und sie zeigte sich versöhnlich. Als bald darauf das Kind der mürrischen Mutter vom Felsen fiel, erhoben sich weiche Sandstrände aus dem Meer und fingen es unverletzt auf – das erste einer Kette von Wundern, die, wie jeder Wallfahrer fraglos bestätigen wird, bis heute nicht abreißt.' },
      { title: 'Vom Nachteil der Neugier', content: 'Dem sterblichen Äolus (griech. Aiolos) war von Göttervater Zeus die Herrschaft über die Winde verliehen worden. Zufrieden lebte er mit Frau Kyane und den jeweils sechs Töchtern und Söhnen, die in aller Unschuld den Inzest pflegten („Und er gab die Töchter den Söhnen zum Weibe", Homer). Der auf Äolia gestrandete Odysseus erfuhr freundliche Hilfe. Ein milder West blies sein Schiff zuverlässig vor die Küste der Heimat Ithaka, im Gepäck als kleine Gabe ein Sack voller Winde. Doch ach, als Odysseus schlief, öffneten die neugierigen Genossen das Geschenk des gütigen Äolus. Die entfesselten Winde trieben das Schiff zurück nach Äolia – der König, wütend über soviel Dummheit, wollte diesmal allerdings von den Griechen nichts mehr wissen. Die Odyssee nahm ihren Lauf.' },
    ]
  },
  'Cefalù': {
    summary: 'Normannische Kathedrale mit dem berühmten Christus-Pantokrator-Mosaik (1131).',
    detail: 'Cefalù (griech. Kephaloidion, „Kopf") ist nach dem mächtigen Felsmassiv La Rocca benannt. Die normannische Kathedrale wurde 1131 von Roger II. gegründet – der Legende nach nach Rettung aus einem Seesturm. Roger II. (1095–1154) war einer der bemerkenswertesten Herrscher des Mittelalters: Er vereinte normannische, arabische und byzantinische Kultur. Sein Hof in Palermo war das gebildetste Zentrum Europas; der arabische Geograph al-Idrisi schuf für ihn 1154 die genaueste Weltkarte des Mittelalters (Tabula Rogeriana). Der Christus Pantokrator in der Apsis (1148) ist das älteste normannische Mosaik Siziliens – strenger und majestätischer als die späteren in Monreale. Das Buch in seiner linken Hand zeigt den Text in Griechisch und Latein – Symbol der Zweisprachigkeit des normannischen Hofes.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cefal%C3%B9_Cathedral',
    facts: ['Gegründet: 1131 von Roger II.', 'Christus Pantokrator (1148)', 'al-Idrisi: Tabula Rogeriana', 'UNESCO seit 2015'],
    photos: [
      { url: '/sicily-trip/6-DO-Cefalu.jpg', caption: 'Normannische Kathedrale von Cefalù' },
      { url: '/sicily-trip/detail-Cefalu-Dom-1.jpg', caption: 'Christus Pantokrator in der Apsis' },
      { url: '/sicily-trip/detail-Cefalu-Dom-2.jpg', caption: 'Byzantinische Mosaiken' },
      { url: '/sicily-trip/detail-Cefalu-Stadt.jpg', caption: 'Cefalù – Altstadt und La Rocca' },
    ]
  },
  'Lipari / Vulcano': {
    summary: 'Äolische Inseln (UNESCO): Lipari mit Castello und Museum, Vulcano mit aktiven Fumarolen.',
    detail: 'Die Äolischen Inseln (ital. Isole Eolie) sind seit 2000 UNESCO-Weltnaturerbe. Lipari ist die größte und belebteste Insel mit einer eindrucksvollen Akropolis (Castello), dem Archäologischen Museum und charakteristischem Bimsstein-Bergbau. Vulcano, die südlichste Insel, beeindruckt mit aktiven Fumarolen, Schwefelkratern und natürlichen Schlammbädern. Stromboli, der „Leuchtturm des Mittelmeers", ist fast ständig aktiv. Die Inseln gelten als Heimat des Windgottes Aiolos (Homer, Odyssee X).',
    wikipedia: 'https://en.wikipedia.org/wiki/Aeolian_Islands',
    facts: ['UNESCO Weltnaturerbe seit 2000', 'Lipari: größte Insel', 'Vulcano: aktive Fumarolen', 'Stromboli: kontinuierlich aktiv', 'Heimat des Windgottes Aiolos'],
    photos: [
      { url: '/sicily-trip/6-DO-Lipari-Vulcano.jpg', caption: 'Äolische Inseln' },
      { url: '/sicily-trip/detail-Lipari-Karte.jpg', caption: 'Karte der Insel Lipari' },
      { url: '/sicily-trip/detail-Vulcano-Karte.jpg', caption: 'Karte der Insel Vulcano' },
    ],
    textBoxes: [
      { title: 'Lipari und der Bimsstein', content: 'Fast ein Viertel (22,4 %, entspricht 8,4 qkm) der Inseloberfläche Liparis besteht aus dem weißen, porösen Material, das so leicht ist, dass es im Wasser schwimmt. Bimsstein ist wie Obsidian ein vulkanisches Produkt, entstanden aus saurem, beim Auswurf durch Gasbläschen stark aufgeschäumtem und glasigem Magma. Der Bimsstein, früher ein begehrter Exportartikel, wurde auch bis vor kurzem abgebaut, wenn auch in wesentlich geringerem Umfang als noch in den 1970er-Jahren. Verwendung findet er in erster Linie als Polier- und Schleifmittel für Metalle, Stein, Glas, Holz, Leder oder andere Materialien, ebenso als Filterstoff. Viele Putz- und Scheuermittel enthalten ebenfalls feinen Bimsstaub, und auch die „Stone-Washed"-Optik mancher Jeans ist auf den Einsatz dieses Materials zurückzuführen. Bimsstein isoliert jedoch auch sehr gut und ist gleichzeitig relativ elastisch, weshalb er sich auch als Baumaterial bestens eignet.\n\nDas Ende des Abbaus auf Lipari im Jahr 2007 freute die Gesundheitsämter – der feine Staub, der beim Abbau entsteht, ist nämlich für eine spezifische Lungenkrankheit verantwortlich: Die Silikose (eine Form der Staublung), auch „Liparose" genannt, brachte einst vielen Arbeitern der Bimssteinwerke den frühen Tod. Trotz des Abbau-Stopps ist man sich der Bedeutung des Bimssteins (und des Obsidians) für Lipari bewusst geblieben und plant, den Einfluss der beiden Gesteine auf die Inselgeschichte in einem Museum sowie einem Geomineralienpark zu thematisieren.' },
    ]
  },
  'Solunto': {
    summary: 'Hellenistisch-römische Stadt auf dem Monte Catalfano mit Peristylhäusern und Agora.',
    detail: 'Solunto (griech. Solus, phön. Kafara) war eine der drei großen phönizischen Gründungen Siziliens neben Panormus (Palermo) und Motya. Die erhaltenen Ruinen auf dem Monte Catalfano stammen aus hellenistisch-römischer Zeit (3.–1. Jh. v. Chr.) und zeigen ein regelmäßiges hippodamisches Straßenraster. Besonders sehenswert sind die Peristylhäuser mit Mosaikfußböden (Haus der Leda), die Agora mit Bouleuterion, und ein kleines Odeon. Von der Terrasse bietet sich ein grandioser Blick über den Golf von Palermo.',
    wikipedia: 'https://en.wikipedia.org/wiki/Solunto',
    facts: ['Phönizische Gründung', '3.–1. Jh. v. Chr. (Ruinen)', 'Hippodamisches Straßenraster', 'Haus der Leda mit Mosaiken']
  },
  'Palermo Altstadt': {
    summary: 'Normannenpalast mit Cappella Palatina, La Martorana und das archäologische Museum.',
    detail: `Palermo (phön. Ziz, „Blume"; griech. Panormos, „Allhafen") vereint 3.000 Jahre Kulturgeschichte. Der Normannenpalast steht über arabischen Fundamenten und beherbergt die Cappella Palatina (1140), die Friedrich II. (1194–1250), der „Stupor Mundi" (Staunen der Welt), als Taufkirche diente. Die Muqarnas-Decke (Stalaktitengewölbe) ist das größte fatimidische Holzkunstwerk außerhalb der islamischen Welt. Friedrich II. wuchs hier auf, sprach sechs Sprachen und gründete die erste staatliche Universität Europas (Neapel, 1224). La Martorana (1143) wurde vom Admiral Georg von Antiochien gestiftet – ein griechisch-orthodoxer Christ im Dienste des normannischen Königs, der die größte Flotte des Mittelmeerraums befehligte. Im Salinas-Museum finden sich die Metopen von Selinunt – einzigartige Zeugnisse der griechischen Großplastik (u.a. Europa auf dem Stier, Perseus und Medusa).`,
    wikipedia: 'https://en.wikipedia.org/wiki/Palazzo_dei_Normanni',
    facts: ['Cappella Palatina: 1140', 'Friedrich II. „Stupor Mundi"', 'Muqarnas-Decke', 'Georg von Antiochien', 'UNESCO seit 2015'],
    photos: [
      { url: '/sicily-trip/7-FR-Palermo-Altstadt.jpg', caption: 'Palermo – Gesichter in La Martorana' },
      { url: '/sicily-trip/detail-Palermo-Martorana.jpg', caption: 'La Martorana – Mosaikdetail' },
      { url: '/sicily-trip/detail-Palermo-Pretoria.jpg', caption: 'Fontana Pretoria' },
      { url: '/sicily-trip/detail-Palermo-Museum.jpg', caption: 'Archäologisches Museum Salinas' },
      { url: '/sicily-trip/detail-Palermo-Karte.jpg', caption: 'Karte der Altstadt Palermo' },
    ],
    textBoxes: [
      { title: 'Mafia', content: 'Den aus zahllosen Filmen bekannten Mafia-Paten „alter Schule", den von allen geachteten „uomo di rispetto", gibt es vielleicht noch in Landstädten Westsiziliens, in Palermo jedenfalls nicht mehr. Die Mafia hat sich den Erfordernissen der modernen Zeit angepasst. Nicht mehr die traditionelle Schutzgelderpressung, das Inkasso von Wasserrechten oder die Überwachung der Prostitution – obwohl jeweils als Zusatzgeschäft gerne mitgenommen – bringen heute das große Geld, sondern Drogenverarbeitung und -handel, Waffengeschäfte und, gerade in Zeiten der Krise, die Kontrolle ganzer Industriezweige. Und wenn auch die alte Garde verschwunden ist, funktioniert das bewährte System immer noch ganz gut: Verflechtung mit Organen des Staates, „kleine Geschenke" und Gefälligkeiten gegen Schutz und Protektion, Einschüchterung und notfalls auch Ermordung standhafter Politiker und Richter.\n\nDie Stimmung jedoch ist längst umgeschlagen. Eine immer wahnsinniger mordende Mafia, die den Tod von Frauen und Kindern in Kauf nahm und sogar bewusst zur Einschüchterung einsetzte, hat völlig an Respekt verloren: die „Ehrenwerte Gesellschaft" hat sich in den Augen des Volkes selbst entehrt. Bestes Beispiel für die Verehrung, die stattdessen die Kämpfer gegen die Mafia genießen, ist der dem ermordeten Giovanni Falcone gewidmete, mit Fotografien, Blumen und Spruchbändern geschmückte Baum nahe seiner Wohnung in der Via Notarbartolo 23. Infos zur Anti-Mafia-Initiative „Addiopizzo" – siehe auch „Schutzgeld ade" unten.' },
      { title: '„Schutzgeld ade"', content: 'Addio Pizzo, „Schutzgeld ade", nennt sich eine Initiative in Palermo, die Geschäftsleute ermutigt, sich den Zahlungen an die Mafia zu verweigern. Ausgangspunkt war eine Gruppe junger Leute, die eine Kneipe eröffnen wollte. Doch dann kam die Pizzo-Frage auf, wodurch das Thema erst einmal erledigt war. Stattdessen wurden Aufkleber produziert, die bald an den Hauswänden und Laternenpfosten Palermos prangten: „Ein ganzes Volk, das Pizzo bezahlt, ist ein Volk ohne Würde". Das Addiopizzo-Komitee entwickelte eine neue Idee: Ladenbesitzer und Kunden gemeinsam gegen die Mafia. Hunderte Unternehmer haben sich zusammengeschlossen und öffentlich erklärt, künftig kein Schutzgeld mehr zu zahlen, tausende Unterstützer fördern die Aktion, indem sie bevorzugt bei diesen Geschäftsinhabern einkaufen. Konsum als Protest gegen die Mafia, ein Schlag ins Gesicht der Cosa Nostra. Infos, auch auf Englisch und mit einer App mit Adressen der Addio-Pizzo-Läden: www.addiopizzo.org' },
      { title: 'Papst Franziskus über die Mafia', content: '„Diejenigen, die in ihrem Leben die Straße des Bösen einschlagen, wie die Mafiosi, sind nicht in Gemeinschaft mit Gott. Sie sind exkommuniziert." — Papst Franziskus' },
      { title: 'Trinacria – Flagge und Wahrzeichen Siziliens', content: 'Seit dem Jahr 2000 ist die Trinacria Siziliens offizielle Regionalflagge, doch geht die rot-gelbe Fahne bis mindestens auf die Zeit der Französischen Vesper im 13. Jh. zurück. Ihre Grundfarben beziehen sich auf Palermo und Corleone, beides Hochburgen des Widerstands gegen die Franzosen; der Name Trinacria bzw. Trinakria (Insel der drei Kaps) stand bereits in der Antike für Sizilien. Das zentrale Symbol, eine Triskele aus drei abgewinkelten Beinen mit einem Medusenhaupt in der Mitte, ist auf der Insel ebenfalls bereits seit griechischer Zeit überliefert. Unter den Römern wurde aus der Medusa die freundlichere Getreidegöttin Ceres, die Schlangen auf dem Kopf wichen Weizenähren. Heute zählt die Trinacria, häufig aus Keramik gestaltet, zu den beliebtesten Souvenirs der Insel.' },
    ]
  },
  'Monreale': {
    summary: 'Normannische Kathedrale mit 6.340 m² byzantinischer Goldmosaiken und romanischem Kreuzgang.',
    detail: 'Die Kathedrale wurde 1174 von Wilhelm II. „dem Guten" gegründet – angeblich nach einer Traumvision, in der die Madonna ihm den Ort eines vergrabenen Schatzes zeigte, den er zum Kirchenbau verwenden solle. In Wahrheit war es ein politisches Projekt: Wilhelm wollte den mächtigen Erzbischof von Palermo, Walter of the Mill (Gualtiero Offamiglio), übertrumpfen, der gerade den Palermitaner Dom umbaute. Die 6.340 m² byzantinischer Goldmosaiken erzählen in 130 Szenen die biblische Geschichte. Besonders bemerkenswert: Die Darstellung der Erschaffung Evas, der Sündenfall und die Arche Noah. Der Kreuzgang (47 × 47 m) mit 228 Doppelsäulen zeigt arabische, normannische und antike Motive – jedes Kapitell ist einzigartig. Maupassant schrieb 1885: „Die schönste Kirche der Welt, das erstaunlichste religiöse Juwel, das die menschliche Vorstellungskraft ersonnen hat."',
    wikipedia: 'https://en.wikipedia.org/wiki/Cathedral_of_Monreale',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/A_history_of_architecture_in_Italy_from_the_time_of_Constantine_to_the_dawn_of_the_renaissance_(1901)_(14784471905).jpg',
    facts: ['Gegründet: 1174', '6.340 m² Goldmosaiken', 'Wilhelm II. vs. Walter of the Mill', '228 einzigartige Kapitelle', 'UNESCO seit 2015'],
    photos: [
      { url: '/sicily-trip/7-FR-Monreale.jpg', caption: 'Kathedrale von Monreale' },
      { url: '/sicily-trip/detail-Monreale-2.jpg', caption: 'Byzantinische Goldmosaiken' },
      { url: '/sicily-trip/detail-Monreale-3.jpg', caption: 'Romanischer Kreuzgang' },
      { url: '/sicily-trip/detail-Monreale-Mosaiken1.jpg', caption: 'Mosaiken – Altes Testament' },
      { url: '/sicily-trip/detail-Monreale-Mosaiken2.jpg', caption: 'Mosaiken – Detailansicht' },
    ]
  },
  'Monte Pellegrino': {
    summary: `Von Goethe als „das schönste Vorgebirge der Welt" gepriesen – Wallfahrtsort Santa Rosalia.`,
    detail: `Der Monte Pellegrino (606 m) erhebt sich als markantes Kalkstein-Vorgebirge über dem Golf von Palermo. Goethe nannte ihn 1787 in seiner Italienischen Reise „das schönste Vorgebirge der Welt". In einer Höhle nahe dem Gipfel befindet sich das Santuario di Santa Rosalia, der Schutzpatronin Palermos. Die Legende besagt, dass die Entdeckung ihrer Gebeine 1624 Palermo von der Pest befreite. Die Panoramastraße bietet spektakuläre Ausblicke über Palermo, den Hafen und die Conca d'Oro. Prähistorische Höhlenmalereien (Grotta dell'Addaura, ca. 8.000 v. Chr.) bezeugen die jahrtausendealte Bedeutung des Berges.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Monte_Pellegrino',
    facts: [`606 m Höhe`, `Goethe: „schönstes Vorgebirge"`, `Santa Rosalia: Pest 1624`, `Höhlenmalereien ca. 8.000 v. Chr.`]
  },
  'Grab des Archimedes': {
    summary: 'Nekropole Grotticelli und das berühmte archäologische Museum Paolo Orsi.',
    detail: `Die Nekropole Grotticelli enthält zahlreiche Felsengräber aus griechischer und römischer Zeit. Eines davon wird traditionell als „Grab des Archimedes" bezeichnet, obwohl es sich tatsächlich um ein römisches Kolumbarium handelt. Archimedes, der größte Mathematiker und Erfinder der Antike, wurde 212 v. Chr. bei der Eroberung von Syrakus durch die Römer getötet. Das Museo Archeologico Regionale Paolo Orsi ist eines der bedeutendsten archäologischen Museen Europas mit Funden von der Vorgeschichte bis zur Spätantike aus ganz Südostsizilien.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Museo_archeologico_regionale_Paolo_Orsi',
    facts: ['Archimedes: † 212 v. Chr.', 'Nekropole Grotticelli', 'Museum Paolo Orsi', 'Bedeutendstes Museum Südostsiziliens'],
    photos: [
      { url: '/sicily-trip/detail-Syrakus-Archimedes.jpg', caption: 'Grab des Archimedes, Nekropole Grotticelli' },
    ]
  },
}

// Tag 3: Siracusa-Stop teilt die gleichen Infos wie Tag 4: Syrakus: Ortigia
sightDetails['Siracusa'] = sightDetails['Syrakus: Ortigia']

interface StopData {
  name: string
  desc: string
  km?: string
  image?: string
  caption?: string
  flight?: string
  flightTimes?: string
}

// Sight images from Wikimedia Commons and Unsplash
const sightImages: Record<string, string> = {
  'Segesta': '/sicily-trip/1-SA-Segesta.jpg',
  'Monte Érice': '/sicily-trip/1-SA-Erice.jpg',
  'Trapani': 'https://images.unsplash.com/photo-1749832147262-76b40c0fc005?w=800&q=80',
  'Marsala': '/sicily-trip/1-SA-Marsala.jpg',
  'Cave di Cusa': '/sicily-trip/2-SO-Cave-di-Cusa.png',
  'Selinunte': '/sicily-trip/2-SO-Selinunte.jpg',
  'Scala dei Turchi': '/sicily-trip/2-SO-Scala-dei-Turchi.jpg',
  'Porto Empedocle': '/sicily-trip/2-SO-Porto-Empedocle.jpg',
  'Agrigento': '/sicily-trip/2-SO-Agrigento.jpg',
  'Gela': '/sicily-trip/3-MO-Gela.jpg',
  'Piazza Armerina': '/sicily-trip/3-MO-Piazza-Armerina.jpg',
  'Akrai': '/sicily-trip/3-MO-Akrai.jpg',
  'Noto': '/sicily-trip/3-MO-Noto.jpg',
  'Villa Romana del Tellaro': 'https://images.unsplash.com/photo-1760384339539-22071b2978b3?w=800&q=80',
  'Syrakus': images.siracusa,
  'Castello Eurialo': 'https://images.unsplash.com/photo-1767032330785-033405e26229?w=800&q=80',
  'Catania': '/sicily-trip/4-DI-Catania.jpg',
  'Ätna': '/sicily-trip/5-MI-Etna-Krater.jpg',
  'Ätna-Rundfahrt': '/sicily-trip/5-MI-Etna2.jpg',
  'Alcantara-Schlucht': '/sicily-trip/5-MI-Alcantara.jpg',
  'Taormina': '/sicily-trip/5-MI-Taormina.jpg',
  'Tindari': '/sicily-trip/6-DO-Tindari.jpg',
  'Cefalù': '/sicily-trip/6-DO-Cefalu.jpg',
  'Solunto': '/sicily-trip/6-DO-Solunto.jpg',
  'Palermo Altstadt': '/sicily-trip/7-FR-Palermo-Altstadt.jpg',
  'Monreale': '/sicily-trip/7-FR-Monreale.jpg',
  'Monte Pellegrino': '/sicily-trip/7-FR-MontePellegrino.jpg',
  'Syrakus: Ortigia': '/sicily-trip/4-DI-Siracusa-Arethusa.jpg',
  'Archäologischer Park': '/sicily-trip/4-DI-Archpark.jpg',
  'Grab des Archimedes': '/sicily-trip/4-DI-Archimedes.jpg',
  'Messina': '/sicily-trip/6-DO-Messina.jpg',
  'Milazzo': '/sicily-trip/6-DO-Milazzo.jpg',
  'Lipari / Vulcano': '/sicily-trip/6-DO-Lipari-Vulcano.jpg',
  'Siracusa': '/sicily-trip/3-MO-Siracusa-Duomo.jpg',
}

interface HotelData {
  name: string
  mapsQuery: string
  mapsEmbed: string
}

interface DayData {
  day: number
  date: string
  weekday: string
  title: string
  image: string
  imagePosition?: string
  imageSize?: string
  hotel: string
  hotelData?: HotelData
  stops: StopData[]
}

const days: DayData[] = [
  {
    day: 1, date: '28. März', weekday: 'Samstag',
    title: 'Salzburg – Palermo – Segesta – Trapani – Marsala',
    image: '/sicily-trip/1-SA-Titel-Segesta.jpg',
    hotel: 'Hotel Carmine, Marsala (N/F)',
    hotelData: { name: 'Hotel Carmine', mapsQuery: 'Hotel+Carmine+Marsala+Sicily', mapsEmbed: 'Hotel+Carmine,+Marsala,+TP,+Italy' },
    stops: [
      { name: 'Salzburg – München', desc: 'Flug mit Lufthansa nach Palermo', flight: 'LH 1914', flightTimes: '09:20 Abflug München · 11:20 Ankunft Palermo' },
      { name: 'Segesta', desc: 'Dorischer Tempel (ca. 420 v. Chr.) und Teatro Greco mit Blick auf den Golf von Castellammare', km: '55 km', caption: 'Dorischer Tempel von Segesta' },
      { name: 'Monte Érice', desc: 'Mittelalterliche Altstadt auf 750m Höhe, phönizisch-griechische Gründung, Burg der Venus', km: '45 km', caption: 'Mittelalterliche Gassen der Città Vecchia' },
      { name: 'Trapani', desc: 'Altstadt mit barocken Kirchen und normannischen Spuren', km: '15 km' },
      { name: 'Marsala', desc: 'Entlang der Salzstraße; Altstadt, archäologisches Museum mit punischem Langschiff', km: '30 km', caption: 'Marsala – Salinen und Altstadt' },
    ]
  },
  {
    day: 2, date: '29. März', weekday: 'Sonntag',
    title: 'Marsala – Selinunte – Agrigento',
    image: '/sicily-trip/2-SO-Titel-Selinunte.jpg',
    hotel: 'Hotel Oneira Rooms, Agrigento (N/F)',
    hotelData: { name: 'Oneira Rooms', mapsQuery: 'Oneira+Rooms+Agrigento+Sicily', mapsEmbed: 'Oneira+Rooms,+Agrigento,+AG,+Italy' },
    stops: [
      { name: 'Cave di Cusa', desc: 'Antiker Steinbruch für die Tempel von Selinunt – faszinierende Säulentrommeln in situ', km: '40 km' },
      { name: 'Selinunte', desc: 'Griechischer Tempelbezirk und Akropolis, eine der größten antiken Städte Siziliens', km: '15 km' },
      { name: 'Scala dei Turchi', desc: 'Spektakuläres weißes Kalkstein-Naturmonument an der Küste', km: '85 km' },
      { name: 'Porto Empedocle', desc: 'Heimatstadt Camilleris und Schauplatz von Commissario Montalbano – Statue des berühmten Ermittlers am Hafen', km: '5 km' },
      { name: 'Agrigento', desc: 'Tal der Tempel: Demetertempel, Zeusheiligtum (Olympieion), archäologisches Museum, Altstadt', km: '10 km' },
    ]
  },
  {
    day: 3, date: '30. März', weekday: 'Montag',
    title: 'Agrigento – Gela – Piazza Armerina – Noto – Siracusa',
    image: '/sicily-trip/3-MO-Titel-PiazzaArmerina.jpg',
    imagePosition: 'center top',
    imageSize: 'auto 350%',
    hotel: 'Hotel I Santi Coronati, Siracusa (N/F)',
    hotelData: { name: 'I Santi Coronati', mapsQuery: 'Hotel+I+Santi+Coronati+Siracusa', mapsEmbed: 'I+Santi+Coronati,+Siracusa,+SR,+Italy' },
    stops: [
      { name: 'Gela', desc: 'Archäologisches Museum mit Funden der griechischen Kolonie (688 v. Chr.)', km: '80 km' },
      { name: 'Piazza Armerina', desc: 'Villa Romana del Casale: spätrömische Mosaiken von Weltrang (UNESCO)', km: '50 km' },
      { name: 'Akrai', desc: 'Griechisches Theater und Aphroditetempel der syrakusanischen Kolonie', km: '110 km' },
      { name: 'Villa Romana del Tellaro', desc: 'Spätrömische Villa mit bedeutenden Mosaiken (4. Jh. n. Chr.)', km: '40 km' },
      { name: 'Noto', desc: 'Perle des sizilianischen Barocks (UNESCO), nach dem Erdbeben 1693 wiederaufgebaut', km: '10 km' },
      { name: 'Siracusa', desc: 'Ankunft im Hotel, einst mächtigste Stadt der griechischen Welt', km: '40 km' },
    ]
  },
  {
    day: 4, date: '31. März', weekday: 'Dienstag',
    title: 'Siracusa – Catania – Taormina',
    image: '/sicily-trip/4-DI-Titel-Siracusa.jpg',
    hotel: 'Hotel Ariston, Taormina (N/F)',
    hotelData: { name: 'Hotel Ariston', mapsQuery: 'Hotel+Ariston+Taormina+Sicily', mapsEmbed: 'Hotel+Ariston,+Taormina,+ME,+Italy' },
    stops: [
      { name: 'Syrakus: Ortigia', desc: 'Altstadt mit Dom (im antiken Athena-Tempel), Arethusa-Quelle, Halbinsel Ortigia' },
      { name: `Archäologischer Park`, desc: `„Ohr des Dionysios", griechisches Theater, römisches Amphitheater, Altar Hierons II.`, caption: 'Ohr des Dionysios – Latomie del Paradiso' },
      { name: 'Grab des Archimedes', desc: 'Nekropole Grotticelli und archäologisches Museum Paolo Orsi', caption: 'Nekropole Grotticelli – Grabkammer' },
      { name: 'Castello Eurialo', desc: 'Griechisches Festungswerk des Dionysios I. – bedeutendstes antikes Kastell Siziliens', km: '10 km' },
      { name: 'Catania', desc: `Dom Sant'Agata, Elefantenbrunnen, Teatro Romano im Stadtzentrum`, km: '60 km', caption: 'Elefantenbrunnen – Wahrzeichen Catanias' },
      { name: 'Taormina', desc: 'Ankunft im legendären Küstenort', km: '50 km', caption: 'Teatro Greco mit Blick auf den Ätna' },
    ]
  },
  {
    day: 5, date: '1. April', weekday: 'Mittwoch',
    title: 'Taormina – Ätna – Alcantara-Schlucht',
    image: '/sicily-trip/5-MI-Titel-Etna.jpg',
    hotel: 'Hotel Ariston, Taormina (N/F)',
    hotelData: { name: 'Hotel Ariston', mapsQuery: 'Hotel+Ariston+Taormina+Sicily', mapsEmbed: 'Hotel+Ariston,+Taormina,+ME,+Italy' },
    stops: [
      { name: 'Ätna', desc: 'Auffahrt bis 1900m Höhe auf Europas höchsten aktiven Vulkan (3357m), ev. Umrundung', km: '55 km' },
      { name: 'Ätna-Rundfahrt', desc: 'Panoramafahrt um den Vulkan – Lavafelder, Kastanienwälder und spektakuläre Ausblicke', km: '75 km' },
      { name: 'Alcantara-Schlucht', desc: 'Spektakuläre Basaltschlucht mit bizarren Lavagesteinsformationen', km: '10 km', caption: 'Basaltlava-Formationen der Alcantara-Schlucht' },
      { name: 'Taormina', desc: 'Teatro Greco (3. Jh. v. Chr.) mit Ätna-Panorama, malerische Altstadt, Corso Umberto', km: '30 km', caption: 'Teatro Greco – das schönste Theater Siziliens' },
    ]
  },
  {
    day: 6, date: '2. April', weekday: 'Donnerstag',
    title: 'Taormina – Cefalù – Palermo',
    image: '/sicily-trip/6-DO-Titel-Isole.jpg',
    hotel: 'Hotel Posta, Palermo (N/F)',
    hotelData: { name: 'Hotel Posta', mapsQuery: 'Hotel+Posta+Palermo+Sicily', mapsEmbed: 'Hotel+Posta,+Palermo,+PA,+Italy' },
    stops: [
      { name: 'Messina', desc: 'Fährhafen und Tor zur Insel – Meerenge von Messina, Dom mit astronomischer Uhr', km: '50 km' },
      { name: 'Milazzo', desc: 'Ausgangspunkt für die Äolischen Inseln – Kastell, Altstadt, Hafen', km: '20 km' },
      { name: 'Lipari / Vulcano', desc: 'Äolische Inseln (UNESCO): Lipari mit Castello und Archäologischem Museum, Vulcano mit aktiven Fumarolen', km: '0km', option: 'Option 1' } as any,
      { name: 'Tindari', desc: 'Griechische Kolonie Tyndaris mit Ruinen, antikes Theater und Basilika della Madonna Nera', km: '40 km', option: 'Option 2' } as any,
      { name: 'Cefalù', desc: 'Normannische Kathedrale San Salvatore (1131) mit byzantinischen Christus-Pantokrator-Mosaiken', km: '110 km' },
      { name: 'Solunto', desc: 'Hellenistisch-römische Stadt mit Peristylhäusern und Agora auf dem Monte Catalfano', km: '55 km' },
      { name: 'Palermo', desc: 'Ankunft in der sizilianischen Hauptstadt', km: '20 km' },
    ]
  },
  {
    day: 7, date: '3. April', weekday: 'Freitag',
    title: 'Palermo – Monreale – Monte Pellegrino',
    image: '/sicily-trip/7-FR-Gesichter-Martorana.jpg',
    hotel: 'Hotel Posta, Palermo (N/F)',
    hotelData: { name: 'Hotel Posta', mapsQuery: 'Hotel+Posta+Palermo+Sicily', mapsEmbed: 'Hotel+Posta,+Palermo,+PA,+Italy' },
    stops: [
      { name: 'Palermo Altstadt', desc: 'Normannenpalast mit Cappella Palatina (goldene Mosaiken), Normannendom, Kreuzkuppelkirche La Martorana, archäologisches Museum', bgPosition: 'center 10%', bgSize: '100%' } as any,
      { name: 'Monreale', desc: 'Normannische Kathedrale (1174) mit 6.340 m² byzantinischer Goldmosaiken und romanischem Kreuzgang', km: '15 km' },
      { name: `Monte Pellegrino`, desc: `Wallfahrtsort Santa Rosalia – von Goethe als „das schönste Vorgebirge der Welt" gepriesen`, km: `25 km` },
    ]
  },
  {
    day: 8, date: '4. April', weekday: 'Samstag',
    title: 'Palermo – Rückflug',
    image: '/sicily-trip/8-SA-Titel-Palermo2.jpg',
    hotel: '',
    stops: [
      { name: 'Palermo Altstadt', desc: 'Altstadtrundgang: Quattro Canti, Fontana Pretoria, Vucciria-Markt', image: '/sicily-trip/8-SA-Palermo-Altstadt.jpg' },
      { name: 'Flughafen Palermo', desc: 'Transfer zum Flughafen, Rückflug über München nach Salzburg', km: '40 km', flight: 'LH 1915', flightTimes: '11:55 Abflug Palermo · 13:55 Ankunft München' },
    ]
  },
]

interface Restaurant {
  name: string
  location: string
  desc: string
  tags: string[]
  image: string
  mapsUrl: string
  hours?: string
  closed?: string
  warning?: string
}

const restaurants: Restaurant[] = [
  {
    name: 'Osteria Il Gallo e l\'Innamorata',
    location: 'Marsala',
    desc: 'Slow-Food-empfohlene Osteria. Bekannt für Busiate-Pasta, frischen Fisch und hausgemachte sizilianische Küche. Künstlerisches Ambiente mit Holzbalkendecke.',
    tags: ['Slow Food', 'Osteria', 'Fisch'],
    image: 'https://itin-dev.wanderlogstatic.com/freeImage/XFmojE5rxts3BbMSB3y1btvFbYMGyWg5',
    mapsUrl: 'https://www.google.com/maps/place/Osteria+Il+Gallo+e+L\'innamorata/@37.7974975,12.4325306,17z/',
    hours: 'Di–Sa 12:30–14:30 / 19:30–22:30, So nur Mittag',
    closed: 'Montag',
  },
  {
    name: 'Osteria Expanificio',
    location: 'Agrigento',
    desc: 'Michelin Bib Gourmand. In einer historischen Nachkriegsbäckerei. Berühmt für Busiate al Pesto Siciliano, Sarde a Beccafico und Pasta n\'caciata.',
    tags: ['Bib Gourmand', 'Osteria', 'Historisch'],
    image: 'https://www.osteriaexpanificio.it/wp-content/uploads/2023/10/EXPANIFICIO-FOTO-TAVOLO-CON-LOGO-1.webp',
    mapsUrl: 'https://www.google.com/maps/search/Osteria+Expanificio+Agrigento+Sicily',
    hours: 'Täglich 12:30–14:30 / 19:30–23:00',
  },
  {
    name: 'Ristorante Dammuso',
    location: 'Noto',
    desc: 'Die Mutter des Besitzers kocht nach Familienrezepten. Hausgemachte Tintenfisch-Pasta und Thunfisch in Pistazienkruste. Große Portionen, familiäre Atmosphäre.',
    tags: ['Familienbetrieb', 'Fisch', 'Tradizionale'],
    image: 'https://www.ristorantedammuso.it/img/home1.jpg',
    mapsUrl: 'https://www.google.com/maps/search/Ristorante+Dammuso+Noto+Sicily',
    hours: 'Nur Abendessen, ca. 19:00–24:00',
    closed: 'Dienstag',
  },
  {
    name: 'Sicilia in Tavola',
    location: 'Siracusa (Ortigia)',
    desc: 'Authentisch und bodenständig. Berühmt für Caponata, Spaghettoni alla Norma und Pistazien-Tiramisu. Einer der Favoriten der Reiseforen.',
    tags: ['Ortigia', 'Tradizionale', 'Pasta'],
    image: 'https://www.siciliaintavola.eu/wp-content/uploads/2019/03/sicilia-in-tavola-1.jpg',
    mapsUrl: 'https://www.google.com/maps/search/Sicilia+in+Tavola+Ortigia+Siracusa',
    hours: 'Di–So 12:30–14:30 / 19:30–22:30',
    closed: 'Montag',
    warning: 'Montag 30.3. geschlossen! Erst Di 31.3. geöffnet.',
  },
  {
    name: 'Trattoria Da Nino',
    location: 'Taormina',
    desc: 'Seit über 50 Jahren in Familienbesitz (drei Generationen). Echte sizilianische Hausmannskost. Panoramaterrasse mit Blick auf die Nordostküste Siziliens.',
    tags: ['Familienbetrieb', 'Panorama', '50+ Jahre'],
    image: 'https://trattoriadaninotaormina.com/images/slideshow/slideshow1.jpg',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Luigi+Pirandello,+37a,+98039+Taormina+ME,+Italy',
    hours: 'Täglich 12:00–14:30 / 19:00–22:30',
    warning: 'War bis März 2026 in Renovierung – vorher anrufen!',
  },
  {
    name: 'La Botte',
    location: 'Cefalù',
    desc: 'Seit Jahrzehnten eine Institution unter Küchenchef Giuseppe Fiduccia. Kreative Gerichte wie Couscous in Tintenfischtinte. Nahe dem normannischen Dom.',
    tags: ['Institution', 'Kreativ', 'Budget'],
    image: 'https://www.cefalu.website/media/images/items/187/la-botte-large-b174.jpg',
    mapsUrl: 'https://www.google.com/maps/search/La+Botte+Ristorante+Cefalu+Sicily',
    hours: 'Di–So 12:30–14:30 / 19:30–23:00',
    closed: 'Montag',
  },
  {
    name: 'Nangalarruni',
    location: 'Castelbuono (bei Cefalù)',
    desc: 'Preisgekrönte Slow-Food-Osteria in den Madonie-Bergen. Pilze, Wildschwein, Manna-Produkte. Gambero Rosso und Michelin empfohlen.',
    tags: ['Slow Food', 'Berge', 'Wild'],
    image: 'https://www.hostarianangalarruni.it/wp-content/uploads/2017/07/DSF0005.jpg',
    mapsUrl: 'https://www.google.com/maps/search/Nangalarruni+Castelbuono+Sicily',
  },
  {
    name: 'Osteria Ballarò',
    location: 'Palermo',
    desc: 'In ehemaligen Stallungen aus dem 17. Jh. mit freiliegendem Mauerwerk. Berühmt für Pasta con le Sarde mit Safran und wildem Fenchel – arabisch-sizilianische Wurzeln.',
    tags: ['Historisch', 'Arabisch-Sizilianisch', 'Osteria'],
    image: 'https://osteriaballaro.it/wp-content/uploads/2024/01/365219667_326584539692689_4016882391528918212_n-768x630.jpg',
    mapsUrl: 'https://www.google.com/maps/search/Osteria+Ballaro+Palermo+Sicily',
    hours: 'Täglich 12:00–15:00 / 19:00–23:00',
  },
  {
    name: 'Trattoria Al Ferro di Cavallo',
    location: 'Palermo',
    desc: 'Historische Taverne, geliebt von Einheimischen. Panelle, Arancini, Pasta con le Sarde – echtes palermitanisches Essen zu günstigen Preisen. Keine Reservierung – first come, first served!',
    tags: ['Locals Only', 'Street Food', 'Budget'],
    image: 'https://ferrodicavallopalermo.it/deposito/2025/08/ferro-di-cavallo-header-01.jpg',
    mapsUrl: 'https://www.google.com/maps/search/Trattoria+Ferro+di+Cavallo+Palermo',
    hours: 'ca. 12:00–15:30 / 18:30–23:00',
  },
  {
    name: 'I Cucci',
    location: 'Palermo',
    desc: 'Piazza Bologni. Gehobene sizilianische Küche von einem jungen Chef. Laut Reiseforen weltklasse Cannoli und kreative Degustationsmenüs.',
    tags: ['Fine Dining', 'Kreativ', 'Cannoli'],
    image: 'https://www.icuccibistrorante.it/wp-content/uploads/2022/07/ristorante-i-cucci-palermo.jpg',
    mapsUrl: 'https://www.google.com/maps/search/I+Cucci+Palermo+Piazza+Bologni',
  },
  {
    name: 'Caffè Sicilia',
    location: 'Noto',
    desc: 'Berühmteste Pasticceria Siziliens, geführt von Meisterkonditor Corrado Assenza (Netflix Chef\'s Table). Legendäre Granita und Brioche.',
    tags: ['Pasticceria', 'Netflix', 'Granita'],
    image: 'https://www.identitagolose.it/public/images/xmedium/img-1175-1.jpg',
    mapsUrl: 'https://www.google.com/maps/search/Caffe+Sicilia+Noto',
    hours: 'Di–So 8:00–22:00',
    closed: 'Montag',
    warning: 'Am Mo 30.3. geschlossen (regulärer Ruhetag)!',
  },
  {
    name: 'Pasticceria Maria Grammatico',
    location: 'Érice',
    desc: 'Weit über Sizilien hinaus berühmt für Mandelgebäck, Cannoli und Süßigkeiten nach Klosterschwestern-Tradition. Ein Muss bei jedem Érice-Besuch.',
    tags: ['Pasticceria', 'Mandelgebäck', 'Tradition'],
    image: 'https://www.mariagrammatico.it/wp-content/uploads/2023/11/Erice-Pasticceria-Maria-Grammatico-Dolici-Tipici-Siciliani-007.jpg',
    mapsUrl: 'https://www.google.com/maps/search/Pasticceria+Maria+Grammatico+Erice',
  },
  // ── Vinotheken Marsala ──────────────────────────────────────
  {
    name: 'Nenanti – Enoteca & Degustazione',
    location: 'Marsala',
    desc: 'Boutique-Vinothek mit Fokus auf sizilianische Urrebsorten – Grillo, Catarratto und Zibibbo aus dem Marsala-DOC-Gebiet. Weinproben mit lokalen Antipasti in entspannter Atmosphäre.',
    tags: ['Vinothek', 'Marsala-Wein', 'Weinprobe', 'Degustazione'],
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    mapsUrl: 'https://www.google.com/maps/search/Nenanti+Enoteca+Marsala+Sicily',
    hours: 'Di–Sa 10:00–13:00 / 16:00–20:00',
    closed: 'Montag & Sonntag',
  },
  {
    name: 'Cantine Pellegrino',
    location: 'Marsala',
    desc: 'Seit 1880 einer der renommiertesten Marsala-Produzenten. Historische Gewölbekeller, Fassräume und klassische Marsala-Weinprobe. Führungen auf Deutsch buchbar.',
    tags: ['Vinothek', 'Marsala-Wein', 'Historisch', 'Führungen'],
    image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&q=80',
    mapsUrl: 'https://www.google.com/maps/search/Cantine+Pellegrino+Marsala',
    hours: 'Mo–Fr 9:00–17:00, Sa nach Voranmeldung',
  },
  {
    name: 'Cantina Florio',
    location: 'Marsala',
    desc: 'Die ikonischste Marsala-Kellerei, gegründet 1833 von Vincenzo Florio. Monumentale Gewölbe mit Fässern aus dem 19. Jh., integriertes Weinmuseum und Verkostung direkt am Hafen.',
    tags: ['Vinothek', 'Marsala-Wein', 'Museum', 'Ikonisch'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    mapsUrl: 'https://www.google.com/maps/search/Cantina+Florio+Marsala',
    hours: 'Mo–Sa 9:30–18:00',
  },
  // ── Vinotheken Ätna ─────────────────────────────────────────
  {
    name: 'Tenute Terre Nere',
    location: 'Ätna',
    desc: 'Biodynamisches Vorzeige-Weingut am Nordhang des Ätna bei Randazzo. Alte Nerello-Mascalese-Reben (bis 100 Jahre alt) auf Vulkanböden. Etna-DOC-Weinproben mit Vulkanpanorama – Voranmeldung erforderlich.',
    tags: ['Vinothek', 'Etna DOC', 'Biodynamisch', 'Alte Reben'],
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
    mapsUrl: 'https://www.google.com/maps/search/Tenute+Terre+Nere+Randazzo+Etna+Sicily',
    hours: 'Weinproben nach Voranmeldung (tenute-terrenere.com)',
  },
  {
    name: 'Benanti Winery',
    location: 'Ätna',
    desc: 'Pionier der Etna-Weinrenaissance seit 1988. Die Weine Pietramarina (Carricante) und Serra della Contessa gehören zu Italiens besten Weißweinen. Führungen mit Blick auf den Vulkan in Viagrande.',
    tags: ['Vinothek', 'Etna DOC', 'Pionier', 'Nerello'],
    image: 'https://images.unsplash.com/photo-1675026922181-b30935570a78?w=800&q=80',
    mapsUrl: 'https://www.google.com/maps/search/Benanti+Winery+Viagrande+Etna+Sicily',
    hours: 'Besuche nach Voranmeldung (vinicolabenanti.it)',
  },
]

const glossaryByCategory = [
  {
    category: 'Begrüßung & Abschied',
    entries: [
      { it: 'buongiorno', de: 'Guten Tag / Guten Morgen' },
      { it: 'buonasera', de: 'Guten Abend' },
      { it: 'buona notte', de: 'Gute Nacht' },
      { it: 'ciao / salve', de: 'Hallo / Grüß Gott' },
      { it: 'arrivederci', de: 'Auf Wiedersehen' },
      { it: 'sì / no', de: 'ja / nein' },
      { it: 'grazie', de: 'Danke' },
      { it: 'per favore / per piacere', de: 'Bitte' },
      { it: 'scusi', de: 'Entschuldigung' },
      { it: 'come dice?', de: 'Wie bitte?' },
    ]
  },
  {
    category: 'Im Restaurant',
    entries: [
      { it: 'acqua (naturale/frizzante)', de: 'Wasser (still/sprudelnd)' },
      { it: 'vino rosso / bianco', de: 'Rotwein / Weißwein' },
      { it: 'primo piatto', de: 'Erster Gang (Pasta, Risotto)' },
      { it: 'secondo piatto', de: 'Zweiter Gang (Fleisch, Fisch)' },
      { it: 'contorno', de: 'Beilage' },
      { it: 'dolce', de: 'Nachspeise / Süßigkeit' },
      { it: 'il conto, per favore', de: 'Die Rechnung, bitte' },
      { it: 'quanto costa?', de: 'Wie viel kostet das?' },
    ]
  },
  {
    category: 'Sehenswürdigkeiten',
    entries: [
      { it: 'la chiesa', de: 'Kirche' },
      { it: 'il duomo / la cattedrale', de: 'Dom / Kathedrale' },
      { it: 'il museo', de: 'Museum' },
      { it: 'il teatro', de: 'Theater' },
      { it: 'la piazza', de: 'Platz' },
      { it: "l'ingresso", de: 'Eingang / Eintritt' },
      { it: 'chiuso / aperto', de: 'geschlossen / offen' },
    ]
  },
  {
    category: 'Unterwegs',
    entries: [
      { it: "dov'è ...?", de: 'Wo ist ...?' },
      { it: 'a destra / a sinistra', de: 'rechts / links' },
      { it: 'diritto', de: 'geradeaus' },
      { it: 'senso unico', de: 'Einbahnstraße' },
      { it: 'tutte le direzioni', de: 'alle Richtungen' },
      { it: 'pianta della città', de: 'Stadtplan' },
      { it: 'la stazione', de: 'Bahnhof' },
      { it: 'aeroporto', de: 'Flughafen' },
      { it: 'spiaggia', de: 'Strand' },
      { it: 'ponte', de: 'Brücke' },
      { it: 'entrata', de: 'Eingang / Einfahrt' },
      { it: 'informazione', de: 'Auskunft / Information' },
      { it: 'posta', de: 'Postamt' },
    ]
  },
  {
    category: 'Einkaufen & Bezahlen',
    entries: [
      { it: 'negozio', de: 'Geschäft / Laden' },
      { it: 'mercato', de: 'Markt' },
      { it: 'soldi', de: 'Geld' },
      { it: 'carta di credito', de: 'Kreditkarte' },
      { it: 'bancomat', de: 'Geldautomat' },
      { it: 'panificio', de: 'Bäckerei' },
      { it: 'alimentari', de: 'Lebensmittelgeschäft' },
      { it: 'caro/-a', de: 'teuer' },
      { it: 'a buon mercato', de: 'günstig / billig' },
      { it: 'taglia', de: 'Größe (Kleidung)' },
    ]
  },
  {
    category: 'Zahlen',
    entries: [
      { it: 'uno / due / tre', de: '1 / 2 / 3' },
      { it: 'quattro / cinque / sei', de: '4 / 5 / 6' },
      { it: 'sette / otto / nove', de: '7 / 8 / 9' },
      { it: 'dieci / undici / dodici', de: '10 / 11 / 12' },
      { it: 'venti / trenta / quaranta', de: '20 / 30 / 40' },
      { it: 'cinquanta / sessanta / settanta', de: '50 / 60 / 70' },
      { it: 'ottanta / novanta / cento', de: '80 / 90 / 100' },
      { it: 'mille', de: '1000' },
    ]
  },
  {
    category: 'Zeit & Wochentage',
    entries: [
      { it: 'ora / giorno', de: 'Stunde / Tag' },
      { it: 'settimana', de: 'Woche' },
      { it: 'mese', de: 'Monat' },
      { it: 'anno', de: 'Jahr' },
      { it: 'oggi / ieri', de: 'heute / gestern' },
      { it: 'domani', de: 'morgen' },
      { it: 'di mattina / di sera', de: 'morgens / abends' },
      { it: 'a mezzogiorno', de: 'mittags' },
      { it: 'presto / tardi', de: 'früh / spät' },
      { it: 'lunedì', de: 'Montag' },
      { it: 'martedì', de: 'Dienstag' },
      { it: 'mercoledì', de: 'Mittwoch' },
      { it: 'giovedì', de: 'Donnerstag' },
      { it: 'venerdì', de: 'Freitag' },
      { it: 'sabato', de: 'Samstag' },
      { it: 'domenica', de: 'Sonntag' },
    ]
  },
  {
    category: 'Übernachten',
    entries: [
      { it: 'albergo / pensione', de: 'Hotel / Pension' },
      { it: 'camera singola', de: 'Einzelzimmer' },
      { it: 'camera doppia', de: 'Doppelzimmer' },
      { it: 'con/senza bagno', de: 'mit/ohne Bad' },
      { it: 'bagno / gabinetto', de: 'Bad / Toilette' },
      { it: 'doccia', de: 'Dusche' },
      { it: 'con prima colazione', de: 'mit Frühstück' },
      { it: 'mezza pensione', de: 'Halbpension' },
      { it: 'bagagli', de: 'Gepäck' },
    ]
  },
  {
    category: 'Wichtige Redewendungen',
    entries: [
      { it: 'non capisco.', de: 'Ich verstehe nicht.' },
      { it: 'non parlo italiano.', de: 'Ich spreche kein Italienisch.' },
      { it: 'parla tedesco / inglese?', de: 'Sprechen Sie Deutsch / Englisch?' },
      { it: 'come si chiama?', de: 'Wie heißen Sie?' },
      { it: 'come sta?', de: 'Wie geht es Ihnen?' },
      { it: 'che ora è?', de: 'Wie viel Uhr ist es?' },
      { it: 'come faccio ad arrivare a ...?', de: 'Wie komme ich nach ...?' },
      { it: 'ha una camera libera?', de: 'Haben Sie ein Zimmer frei?' },
      { it: 'ho bisogno di un medico.', de: 'Ich brauche einen Arzt.' },
      { it: 'mi fa male qui.', de: 'Hier tut es weh.' },
    ]
  },
  {
    category: 'Notfall & Gesundheit',
    entries: [
      { it: 'aiuto!', de: 'Hilfe!' },
      { it: 'guasto', de: 'Panne / Defekt' },
      { it: 'incidente', de: 'Unfall' },
      { it: 'dolori', de: 'Schmerzen' },
      { it: 'ospedale', de: 'Krankenhaus' },
      { it: 'farmacia', de: 'Apotheke' },
      { it: 'medico / dentista', de: 'Arzt / Zahnarzt' },
      { it: 'polizia', de: 'Polizei' },
    ]
  },
]

const vorspeisen = [
  { name: 'Arancini', desc: 'Frittierte Reisbällchen mit Ragù, Mozzarella oder Pistazien – das sizilianische Street Food schlechthin.', image: images.arancini },
  { name: 'Caponata', desc: 'Süß-saures Auberginen-Gemüse mit Kapern, Oliven, Sellerie und Tomaten – arabischer Einfluss.', image: images.caponata },
  { name: 'Pane e Panelle', desc: 'Kichererbsenmehl-Fladen, frittiert und in Sesambrot gefüllt – das älteste Streetfood Palermos mit arabischen Wurzeln.', image: images.panelle },
  { name: 'Sarde a Beccafico', desc: 'Gefüllte Sardinenröllchen mit Semmelbröseln, Rosinen und Pinienkernen – typisch für Palermo, benannt nach dem Singvogel Beccafico.', image: images.sardeBeccafico },
  { name: 'Sfincione Palermitano', desc: 'Sizilianische Focaccia mit Tomaten, Zwiebeln, Anchovis und Caciocavallo-Käse – das „dicke" Street Food vom Ballarò-Markt.', image: images.sfincione },
]

const hauptspeisen = [
  { name: 'Pasta alla Norma', desc: 'Pasta mit Auberginen, Tomatensugo, gesalzenem Ricotta und Basilikum – Catanias Nationalgericht, benannt nach Bellinis Oper.', image: images.pasta },
  { name: 'Pasta con le Sarde', desc: 'Pasta mit frischen Sardinen, wildem Fenchel, Rosinen, Safran und Pinienkernen – arabisch-sizilianisches Meisterwerk.', image: images.pastaSarde },
  { name: 'Stoccafisso alla Ghiotta', desc: 'Geschmorter Stockfisch mit Kartoffeln, Oliven, Kapern und Tomaten – typisch für die westliche Provinz Siziliens.', image: images.stoccafisso },
]

const nachspeisen = [
  { name: 'Cannoli Siciliani', desc: 'Knusprige Teigrollen gefüllt mit süßer Ricotta-Creme, Pistazien und kandierten Früchten.', image: images.cannoli },
  { name: 'Granita con Brioche', desc: 'Halbgefrorenes Eis aus Mandeln, Pistazien oder Zitrone, serviert mit warmem Brioche zum Frühstück.', image: images.granita },
  { name: 'Cassata Siciliana', desc: 'Festliche Torte mit Ricotta, Marzipan, Orangeat und Zuckerglasur – arabisch-normannisches Erbe.', image: images.cassata },
  { name: 'Biancomangiare alle Mandorle', desc: 'Cremiger Pudding aus Mandelmilch mit Orangenblütenwasser – ein Erbe der arabischen Küche Siziliens.', image: images.biancomangiare },
]

const texte = [
  {
    title: 'Il ladro di merendine – Montalbano e François',
    source: 'Andrea Camilleri (1925–2019), Il ladro di merendine (1996)',
    original: '«Gli confidò cose che mai aveva detto a nessuno, manco a Livia. Il pianto sconsolato di certe notti, con la testa sotto il cuscino perché suo padre non lo sentisse; la disperazione mattutina quando sapeva che non c\'era sua madre in cucina a preparargli la colazione o, qualche anno dopo, la merendina per la scuola. Ed è una mancanza che non viene mai più colmata, te la porti appresso fino in punto di morte.»',
    translation: '„Er vertraute ihm Dinge an, die er nie jemandem gesagt hatte, nicht einmal Livia. Das trostlose Weinen mancher Nächte, den Kopf unter dem Kissen, damit sein Vater es nicht hörte; die Verzweiflung morgens, wenn er wusste, dass die Mutter nicht in der Küche war, um ihm das Frühstück zu machen oder, ein paar Jahre später, die Merendine für die Schule. Und das ist ein Fehlen, das nie wieder ausgefüllt wird – du trägst es bis zum letzten Atemzug mit dir."',
    lang: 'Italienisch',
  },
  {
    title: 'Il commissario Montalbano – Catarella al telefono',
    source: 'Andrea Camilleri (1925–2019), Montalbano-Reihe – typischer Dialog im Stil Camilleris',
    original: `CATARELLA: Dottori! Dottori! C'è una pirsona che s'apprisenta con il nomi di... aspittassi... di Trantino, no, Tantino...
MONTALBANO: Catarè, mandamelo.
CATARELLA: Sissì, Dottori! Ma prima m'ha ditto che la facennia è d'urgentissima urgenza!
MONTALBANO: E allura mannalo immediatamenti!
CATARELLA: Sissì, Dottori, vossignoria è già accontintata!

──────────────────────────
Catarella spricht immer „Dottori" statt „Dottore", verdreht Namen und mischt sizilianischen Dialekt mit gebrochenem Hochitalienisch. Sein Sprachcaos ist Camilleris komischstes Stilmittel.`,
    translation: `CATARELLA: Herr Doktor! Herr Doktor! Da ist eine Person, die sich mit dem Namen... warten Sie... Trantino, nein, Tantino... vorstellt.
MONTALBANO: Catarè, schick ihn rein.
CATARELLA: Jawohl, Herr Doktor! Aber vorher hat er mir gesagt, die Sache sei von dringendster Dringlichkeit!
MONTALBANO: Dann schick ihn sofort rein!
CATARELLA: Jawohl, Herr Doktor, Euer Gnaden ist bereits zufriedengestellt!`,
    lang: 'Italienisch (sizilianischer Dialekt)',
  },
  {
    title: 'Cicero über Sizilien – Insel der Ceres und Persephone',
    source: 'Cicero (106–43 v. Chr.), In Verrem II, 4, 106–108',
    original: `Vetus est haec opinio, iudices, quae constat ex antiquissimis
Graecorum litteris atque monumentis, insulam Siciliam esse
a Cerere et Libera inventam atque in ea primum fruges repertas esse.
Huius rei tamquam confirmandae causa, quod in ea terra primum
exstitisse frumentum arbitrantur, ea frumenti maxima atque
uberrima repetitur fertilitas.

[…] Nam cum Liberam raptam a Plutone conqueruntur
et quaerunt Cererem, in hac insula primum sistitur vestigium,
hic primum luctus est auditus; hinc mater erravit in omnis terras.
Enna autem, ubi ea quae dixi geruntur, est loco perexcelso atque edito,
in quo est lacus non magnus, campi patentes, et montes qui eam undique
cingunt ad caeli regionem pertinentes: quae loca propter divinitatem
sacra habentur.`,
    translation: `Es ist eine alte Überzeugung, ihr Richter, die durch die ältesten griechischen Schriften und Zeugnisse bestätigt wird: dass die Insel Sizilien von Ceres und Libera entdeckt worden sei und dass dort zuerst das Getreide gefunden wurde. Gleichsam zur Bestätigung dieser Überlieferung findet sich in jenem Land eine so gewaltige und reiche Getreidefruchtbarkeit, als wolle die Erde selbst anzeigen, dass sie der Ceres gehört.

[…] Denn als Libera (Persephone) von Pluto geraubt wurde und Ceres sie suchend beklagte, da wurde zuerst auf dieser Insel ihre Spur entdeckt, hier wurde zuerst ihr Klagen gehört; von hier irrte die Mutter in alle Länder umher. Enna aber, wo sich dies alles ereignet haben soll, liegt an einem sehr hohen und erhabenen Ort, auf dem sich ein kleiner See befindet, weite Ebenen und Berge, die es ringsum umschließen und bis zum Himmel zu reichen scheinen: diese Orte gelten wegen ihrer Heiligkeit als gottgeweiht.

(Cic. Verr. II, 4, 106–108; nach Theodor Nüßlein, Artemis-Ausgabe)`,
    lang: 'Lateinisch',
    note: 'Cicero verbindet in diesem Abschnitt seiner Anklage gegen Verres die Würde Siziliens mit dem Mythos von Demeter und Persephone (lat. Ceres und Libera). Indem er Verres vorwirft, Kultgegenstände aus Enna gestohlen zu haben, stellt er dessen Frevel als Sakrileg gegen die älteste und heiligste Überlieferung der Insel dar. Der See bei Enna ist der heutige Lago di Pergusa – in der Antike galt er als Eingang zur Unterwelt.',
  },
  {
    title: 'Cicero über Syrakus',
    source: 'Cicero (106–43 v. Chr.), In Verrem II, 4.117',
    original: 'Urbem Syracusas maximam esse Graecarum, pulcherrimam omnium saepe audistis. Est, iudices, ita ut dicitur. Nam et situ est cum munito tum ex omni aditu vel terra vel mari praeclaro ad aspectum.',
    translation: 'Ihr habt oft gehört, dass Syrakus die größte aller griechischen Städte sei, die schönste von allen. So ist es, ihr Richter, wie man sagt. Denn sie ist sowohl durch ihre Lage befestigt als auch von jedem Zugang zu Wasser und zu Land her von prächtigem Anblick.',
    lang: 'Lateinisch',
  },
  {
    title: 'Daidalos und König Kokalos',
    source: 'Diodoros Sikeliotes (ca. 90–30 v. Chr.), Bibliotheke historike IV, 77–79',
    original: `Daidalos, der kunstfertigste Handwerker seiner Zeit, lebte am Hof des König Minos auf Kreta. Als er dem Ungeheuer Minotauros durch den Bau des Labyrinths diente, geriet er in Ungnade: Minos sperrte ihn samt seinem Sohn Ikaros ein. Doch Daidalos fertigte sich und seinem Sohn Flügel aus Federn und Wachs. Ikaros flog zu hoch, das Wachs schmolz in der Sonne – er stürzte ins Meer, das seitdem „Ikarisches Meer" heißt.

Daidalos selbst entkam nach Sizilien zum König Kokalos, wo er in dessen Dienst herrliche Werke schuf: eine uneinnehmbare Burg auf dem Felsplateau von Kamikos, einen Schwitzbad-Palast, einen Tempel der Aphrodite auf dem Gipfel von Érice – und goldene Waben als Weihgeschenk für die Göttin.

Minos, der mächtigste Herr der Meere, rüstete eine gewaltige Flotte aus und segelte nach Sizilien, um Daidalos zurückzufordern. Kokalos empfing ihn scheinbar freundlich als Gast und versprach, den Flüchtling auszuliefern. Doch seine Töchter, die Daidalos liebgewonnen hatten, leiteten siedendes Wasser durch Röhren in das Bad des Königs. So fand Minos, Herr der Meere und Richter der Toten, auf sizilischem Boden seinen Tod – und Daidalos blieb für immer frei.`,
    translation: '',
    lang: 'Deutsch (nach Diodoros Sikeliotes IV, 77–79)',
  },
  {
    title: 'Per questo mi chiamo Giovanni – La struttura di Cosa Nostra',
    source: 'Luigi Garlando (*1969), Per questo mi chiamo Giovanni (Rizzoli, 2004), S. 38–41',
    original: `«Cosca. Ma è una parola che non si usa quasi più, adesso
ha un altro significato: gruppo di mafiosi. Cosca o anche
famiglia. Quando Giovanni tornò a lavorare a Palermo, la città
era come questo carciofo: ogni quartiere, una cosca di mafiosi.»

[…] «Gli chiedono se accetta di entrare nella cosa, lui risponde
di sì, allora l'uomo d'onore chiede ai due testimoni di pungere
il dito del nuovo mafioso con una spina di arancia amara e di
versare una goccia di sangue su un'immaginetta sacra. Infine
bruciano la figurina di carta, il nuovo mafioso deve tenerla in
mano finché il fuoco si spegne e pronunciare queste parole:
«Le mie carni debbono bruciare come questo santino
se non manterrò fede al giuramento.»

[…] «Comunque, finito il fuoco, l'uomo d'onore che dirige il
rito, svela al nuovo mafioso che la cosa ha un nome: Cosa Nostra.»
[…] «È un mostro dalle mille facce e ha più tentacoli di questo
polipo che sto mangiando. […] in alto c'è un capo, eletto dagli
uomini d'onore, affiancato da un vicecapo; sotto di loro ci sono
due o tre consiglieri e più sotto ancora i capodecina, che comandano
i soldati o picciotti.»`,
    translation: `„Cosca. Aber das Wort wird kaum noch benutzt, heute bedeutet es:
Gruppe von Mafiosi. Cosca oder auch Familie. Als Giovanni nach
Palermo zurückkam, war die Stadt wie diese Artischocke:
jedes Viertel eine Cosca von Mafiosi."

[…] „Sie fragen ihn, ob er bereit ist, der Cosa beizutreten. Er sagt ja.
Dann bittet der Uomo d'onore die beiden Zeugen, dem neuen Mafioso
mit einem Dorn der Bitteroranje in den Finger zu stechen und
einen Blutstropfen auf ein heiliges Bildchen fallen zu lassen.
Schließlich verbrennen sie die Figur; der neue Mafioso muss sie
in der Hand halten, bis das Feuer erlischt, und dabei sprechen:
‚Möge mein Fleisch brennen wie dieses Heiligenbild,
wenn ich meinem Schwur nicht treu bleibe.'"

[…] „Als das Feuer erloschen ist, enthüllt der Uomo d'onore,
der das Ritual leitet, dem neuen Mafioso, dass die Cosa einen Namen hat:
Cosa Nostra." […] „Es ist ein Ungeheuer mit tausend Gesichtern und mehr
Tentakeln als dieser Oktopus, den ich gerade esse. […] Oben steht ein Capo,
gewählt von den Uomini d'onore, an seiner Seite ein Vicecapo; unter ihnen
zwei oder drei Consiglieri, und darunter die Capodecina,
die die Soldaten oder Picciotti befehligen."`,
    lang: 'Italienisch',
  },
  {
    title: 'Goethe über Monte Pellegrino',
    source: 'Johann Wolfgang von Goethe (1749–1832), Italienische Reise (Palermo, 3. April 1787)',
    original: `Palermo, den 3. April 1787.

Der Monte Pellegrino liegt gerade gegenüber meiner Wohnung, ein großes Vorgebirge am Meerbusen. Im ersten Augenblick war es mir wie ein Idol, das mich anschaut; immer sah ich ihn wie einen Freund an. Er hat eine gar sonderliche Gestalt und eine eigene Physiognomie: Kalksteinfels, fast senkrecht aus dem Meere tretend, kein Baum, kein Strauch daran zu sehen – und doch von einer großen, ehrwürdigen Gestalt.

Was den Charakter dieser Gegend im allgemeinen betrifft, so kann ich sagen: Es ist alles hier in einem gewissen höheren Sinne schön. Nicht allein das Meer, die Küste, der Hafen – sondern auch die Stadt selbst ist ein Anblick. Niemand, der Sizilien gesehen hat, trägt ein unvollständiges Bild von Italien in seiner Seele.

Das schönste Vorgebirge der Welt.`,
    translation: '',
    lang: 'Deutsch (Original)',
  },
  {
    title: 'Polyphem – Der Zyklop und Odysseus',
    source: 'Homer (ca. 8. Jh. v. Chr.), Odyssee IX, 366–367',
    original: `„Οὖτίς μοι ὄνομά ἐστι· Οὖτιν δέ με κικλήσκουσι
μήτηρ ἠδὲ πατὴρ ἠδ᾽ ἄλλοι πάντες ἑταῖροι."`,
    translation: '„Niemand ist mein Name; Niemand nennen mich Mutter und Vater und alle anderen Gefährten." – Mit diesem Trick entkommt Odysseus dem geblendeten Zyklopen Polyphem auf Sizilien. Die schwarzen Faraglioni-Felsen bei Aci Trezza (Catania) gelten als die Felsbrocken, die Polyphem nach dem fliehenden Schiff warf.',
    lang: 'Altgriechisch',
  },
  {
    title: 'Skylla und Charybdis – Die Meerenge von Messina',
    source: 'Homer (ca. 8. Jh. v. Chr.), Odyssee XII, 73',
    original: '„δύο σκόπελοι, ὁ μὲν οὐρανὸν εὐρὺν ἱκάνει / ὀξείῃ κορυφῇ..."',
    translation: '„Zwei Felsen ragen auf – der eine reicht mit spitzer Kuppe bis zum weiten Himmel..." – Die Meerenge von Messina zwischen Sizilien und dem Festland galt in der Antike als Sitz der beiden Ungeheuer: Charybdis, die das Meer dreimal täglich verschlingt, und Skylla mit ihren sechs Köpfen.',
    lang: 'Altgriechisch',
  },
  {
    title: 'Arethusa – Die Nymphe unter dem Meer',
    source: 'Ovid (43 v. Chr.–17 n. Chr.), Metamorphosen V, 487–490 & 572–576',
    original: `pars ego nympharum, quae sunt in Achaide, una fui,
nec me studiosius altera saltus
legit nec posuit studiosius altera casses.
[...]
ergo dum Stygio sub terris gurgite labor,
visa tua est oculis illic Proserpina nostris:
illa quidem tristis neque adhuc interrita vultu,
sed regina tamen, sed opaci maxima mundi,
sed tamen inferni pollens matrona tyranni.`,
    translation: 'Ich war eine unter den Nymphen Achaias... Während ich unter der Erde durch den stygischen Strudel mühsam zog, sah ich dort mit meinen Augen deine Proserpina: sie war zwar traurig und noch verängstigt im Gesicht, aber dennoch schon Königin – Herrin der dunklen Welt, mächtige Herrin des Unterwelt-Tyrannen. Die Quelle der Arethusa auf der Insel Ortygia in Syrakus existiert noch heute.',
    lang: 'Lateinisch',
  },
  {
    title: 'Persephone – Der Raub bei Enna',
    source: 'Ovid (43 v. Chr.–17 n. Chr.), Metamorphosen V, 385–396',
    original: `Haud procul Hennaeis lacus est a moenibus altae,
nomine Pergus, aquae: non illo plura Caystros
carmina cycnorum labentibus audit in undis.
silva coronat aquas cingens latus omne suisque
frondibus ut velo Phoebeos submovet ictus;
frigora dant rami, Tyrios humus umida flores:
perpetuum ver est.
quo dum Proserpina luco
ludit et aut violas aut candida lilia carpit,
paene simul visa est dilectaque raptaque Diti:
usque adeo est properatus amor.`,
    translation: 'Nicht weit von Hennas hohen Mauern liegt ein See namens Pergus; kein See hört mehr Schwäne auf seinen gleitenden Wellen. Wald umkrönt das Wasser und wehrt mit seinen Zweigen Phöbus\' Strahlen ab; die Äste schenken Kühle, der feuchte Boden trägt tyrische Blumen: ewiger Frühling herrscht hier. In diesem Hain spielte Proserpina und pflückte Veilchen oder weiße Lilien – kaum war sie gesehen, da liebte und entführte sie Dis: so eilig war seine Liebe.',
    lang: 'Lateinisch',
  },
  {
    title: 'Die Perser – Der Traum der Atossa',
    source: 'Aischylos (ca. 525–456 v. Chr.), Die Perser (472 v. Chr.), V. 176–199',
    original: `ἔδοξά μοι νυκτὸς ἐν ἀμβροσίᾳ
δύο γυναῖκε, καλλίπεπλε μέν,
ἡ μὲν Περσίδα στολὴν ἔχουσ᾽,
ἡ δ᾽ αὖτε Δωρίδ᾽, εἰσελθεῖν ποτε,
μεγέθει τε τῶν νῦν ἐκπρεπεστάτα,
κάλλει τ᾽ ἀμώμω, καὶ κασιγνήτα γένος
ταὐτοῦ πατρός· οἰκεῖν δ᾽, ὡς ἔλαχον,
τὴν μὲν Ἑλλάδ᾽ αἶαν, τὴν δὲ βάρβαρον χθόν᾽.
τούτω στάσιν πρὸς ἀλλήλα σφε θέσθαι,
ὡς ἐδόκει μοι· μαθὼν δ᾽ υἱός
ἐμὸς κατεῖχε κἀκόσμει,
ζυγῷ τ᾽ ἔπεισεν ἅρμ᾽ ὑπαίξαι·
καὶ ταύτην μὲν ἐν ἱμᾶσιν
αὐχέν᾽ εἶχ᾽ ὑπήκοον·
στόμαργος δ᾽ ἡ ᾽τέρα καὶ χερσὶν ἐντὸς
ἅρματος κεροτυποῦσα
καὶ σπαραγμοῖσι δεσμῶν ἡνίας ἔσπα,
κἄξω δίφρου φέρεται κρατοῦσ᾽ ἄτερ ζυγοῦ·
ξύρρηξε δ᾽ αὐχένα.
πίπτει δ᾽ υἱὸς ἐμός,
καὶ πατὴρ παρίσταται Δαρεῖος οἰκτίρων αὐτόν.`,
    translation: `Es schien mir in der göttlichen Nacht, als träten zwei Frauen ein –
herrlich gewandet: die eine in persischem Gewand,
die andere in dorischer Tracht,
von Gestalt über alle Heutigen hervorragend,
von fehlerloser Schönheit, Schwestern von gleichem Vater.
Als Los hatte die eine das griechische Land erhalten,
die andere das Land der Barbaren.

Zwischen diesen beiden entstand, wie mir schien, ein Streit.
Mein Sohn erkannte es, versuchte sie zu bändigen und zu zähmen,
spannte sie unter das Joch seines Wagens.
Die eine – im Gewand geschmückt – beugte gehorsam den Hals.
Doch die andere stampfte und schlug
mit den Händen im Innern des Wagens um sich,
zerriss mit Gewalt die Zügel
und jagte ohne Joch davon, das Gebiss sprengend.
Sie warf meinen Sohn ab – er stürzte zu Boden.
Sein Vater Darios trat hinzu und beklagte ihn.

(Übersetzt nach Oskar Werner / Tusculum-Ausgabe)`,
    lang: 'Griechisch',
    note: 'Atossa, Mutter des Xerxes und Witwe des Darios, berichtet dem Chor von ihrem Traum – kurz vor der Nachricht der Niederlage bei Salamis. Die beiden Frauen verkörpern Persien (gehorsam) und Griechenland (unbändig). Das Bild des zerbrochenen Joches ist das prophetische Zentrum des Stückes: Xerxes hat versucht, Griechenland zu unterwerfen – und ist selbst zu Fall gekommen. Der dann erscheinende Geist des weisen Vaters Darios macht den Frevel des Sohnes vollends sichtbar.',
  },
  {
    title: 'Die Perser – Der Schlachtruf bei Salamis',
    source: 'Aischylos (ca. 525–456 v. Chr.), Die Perser (472 v. Chr.), V. 402–405',
    original: 'ὦ παῖδες Ἑλλήνων ἴτε,\nἐλευθεροῦτε πατρίδ᾽, ἐλευθεροῦτε δὲ\nπαῖδας, γυναῖκας, θεῶν τε πατρῴων ἕδη,\nθήκας τε προγόνων· νῦν ὑπὲρ πάντων ἀγών.',
    translation: '„Auf, Kinder Griechenlands! Befreit das Vaterland,\nbefreit die Kinder, Frauen, der Götter Throne,\ndie Gräber eurer Ahnen –\njetzt gilt es alles!"',
    lang: 'Griechisch',
    note: '„Die Perser" (472 v. Chr.) ist die älteste erhaltene griechische Tragödie und das einzige Stück, das ein zeitgenössisches historisches Ereignis behandelt: die Seeschlacht bei Salamis (480 v. Chr.), in der Griechenland die persische Flotte des Xerxes vernichtend schlug. Aischylos selbst hatte als Soldat an der Schlacht teilgenommen. Das Stück ist aus persischer Perspektive geschrieben – Xerxes und der Geist des Darius trauern um den Untergang – und gilt daher als bemerkenswertes Zeugnis für die Fähigkeit der Griechen, sich in den Feind hineinzuversetzen.',
  },
  {
    title: 'Pindar über Ätna und Sizilien',
    source: 'Pindar (ca. 522–443 v. Chr.), Pythische Ode 1, 13–28',
    original: `ἐν δ᾽ Αἴτνᾳ κεῖται χαμαιπετὲς πανδόκας
στῦλος οὐρανία, νιφόεσσα Αἴτνα,
πάνετες χιόνος οὐρανίας τιθήνα·
τᾶς ἐρεύγονται μὲν ἀπλάτου πυρὸς ἁγνόταται
ἐκ μυχῶν παγαί·
ποταμοὶ δ᾽ ἁμέραισιν μὲν
προχέοντι ῥόον καπνοῦ αἴθων᾽·
ἀλλ᾽ ἐν ὄρφναισιν πέτρας
φοίνισσα κυλινδομένα φλὸξ
ἐς βαθεῖαν φέρει πόντου πλάκα σὺν πατάγῳ.`,
    translation: `Und in Aitna liegt er unten, die Säule des Himmels, die alles aufnimmt –
der schneebedeckte Aitna, ganzjähriger Nährvater des beißenden Schnees.
Aus seinen Tiefen schießen unzugängliche Quellen reinen Feuers.
Bei Tage strömen die Flüsse glühenden Rauchs;
doch in den Nächten schleppt die rote, rollende Flamme
die Felsen mit Getöse hinab auf die tiefe Fläche des Meeres.

(Pindar schrieb diese Ode 470 v. Chr. zu Ehren Hierons I. von Syrakus, der beim Wagenrennen in Delphi siegte. Hieron hatte kurz zuvor die Stadt Aitna am Fuß des Vulkans neu gegründet. Der darunter gefangene Riese Typhon, den Zeus mit dem Blitz besiegt hatte, gilt als Ursache der vulkanischen Ausbrüche.)`,
    lang: 'Griechisch',
  },
  {
    title: 'Così è (se vi pare) – Schlussszene',
    source: 'Luigi Pirandello (1867–1936), Così è (se vi pare) (1917), III. Akt',
    original: `IL PREFETTO: Siete la figlia della signora Frola?
SIGNORA PONZA: E la seconda moglie del signor Ponza, sì.
IL PREFETTO: No, no – per voi stessa, come siete voi?
SIGNORA PONZA: (con voce ferma) Io sono… colei che mi si crede.
LAUDISI: (ridendo) Ed ecco, signori, come parla la verità!`,
    translation: `DER PRÄFEKT: Sind Sie die Tochter der Signora Frola?
SIGNORA PONZA: Und die zweite Frau des Herrn Ponza, ja.
DER PRÄFEKT: Nein, nein – für Sie selbst, wer sind Sie?
SIGNORA PONZA: (mit fester Stimme) Ich bin… diejenige, für die man mich hält.
LAUDISI: (lachend) Und so, meine Herrschaften, spricht die Wahrheit!`,
    lang: 'Italienisch',
  },
  {
    title: 'Die Bürgschaft',
    source: 'Friedrich Schiller (1759–1805), Die Bürgschaft (1798) – Ballade, spielt in Syrakus',
    original: `Zu Dionys dem Tyrannen, schlich
Damon den Dolch im Gewande,
Ihn schlugen die Häscher in Bande.
„Was wolltest du mit dem Dolche, sprich!"
Entgegnet ihm finster der Wüterich.
„Die Stadt vom Tyrannen befreien!"
„Das sollst du am Kreuze bereuen."

„Ich bin", spricht jener, „zu sterben bereit,
Und bitte nicht um mein Leben;
Doch willst du Gnade mir geben,
Ich flehe dich um drei Tage Zeit,
Bis ich die Schwester dem Gatten gefreit:
Ich lasse den Freund dir als Bürgen –
Ihn magst du, entrinn ich, erwürgen."

Da lächelt der König mit arger List
Und spricht nach kurzem Bedenken:
„Drei Tage will ich dir schenken.
Doch wisse: wenn sie verstrichen, die Frist,
Eh du zurück mir gegeben bist,
So muß er statt deiner erblassen,
Doch dir ist die Strafe erlassen."

Und er kommt zum Freunde: „Der König gebeut,
Daß ich am Kreuz mit dem Leben
Bezahle das frevelnde Streben
Doch will er mir gönnen drei Tage Zeit,
Bis ich die Schwester dem Gatten gefreit,
So bleib du dem König zum Pfande,
Bis ich komme, zu lösen die Bande."

Und schweigend umarmt ihn der treue Freund,
Und liefert sich aus dem Tyrannen,
Der andere ziehet von dannen.
Und ehe das dritte Morgenrot scheint,
Hat er schnell mit dem Gatten die Schwester vereint,
Eilt heim mit sorgender Seele,
Damit er die Frist nicht verfehle.

Da gießt unendlicher Regen herab,
Von den Bergen stürzen die Quellen,
Und die Bäche, die Ströme schwellen.
Und er kommt ans Ufer mit wanderndem Stab –
Da reißet die Brücke der Strudel hinab,
Und donnernd sprengen die Wogen
Des Gewölbes krachenden Bogen.

Und trostlos irrt er an Ufers Rand,
Wie weit er auch spähet und blicket,
Und die Stimme, die rufende, schicket –
Da stößet kein Nachen vom sichern Strand,
Der ihn setze an das gewünschte Land,
Kein Schiffer lenket die Fähre,
Und der wilde Strom wird zum Meere.

Da sinkt er ans Ufer und weint und fleht,
Die Hände zum Zeus erhoben:
„O hemme des Stromes Toben!
Es eilen die Stunden, im Mittag steht
Die Sonne und wenn sie niedergeht,
Und ich kann die Stadt nicht erreichen,
So muß der Freund mir erbleichen."

Doch wachsend erneut sich des Stromes Wut,
Und Welle auf Welle zerrinnet,
Und Stunde an Stunde entrinnet,
Da treibt ihn die Angst, da faßt er sich Mut
Und wirft sich hinein in die brausende Flut,
Und teilt mit gewaltigen Armen
Den Strom, und ein Gott hat Erbarmen.

Und gewinnt das Ufer und eilet fort,
Und danket dem rettenden Gotte;
Da stürzet die raubende Rotte
Hervor aus des Waldes nächtlichem Ort,
Den Pfad ihm sperrend, und schnaubet Mord
Und hemmet des Wanderers Eile
Mit drohend geschwungener Keule.

„Was wollt ihr?" ruft er vor Schrecken bleich
„Ich habe nichts als mein Leben,
Das muß ich dem Könige geben!"
Und entreißt die Keule dem nächsten gleich:
„Um des Freundes willen erbarmet euch!"
Und drei, mit gewaltigen Streichen,
Erlegt er, die andern entweichen.

Und die Sonne versendet glühenden Brand
Und von der unendlichen Mühe
Ermattet sinken die Kniee:
„O hast du mich gnädig aus Räubershand,
Aus dem Strom mich gerettet ans heilige Land,
Und soll hier verschmachtend verderben,
Und der Freund mir, der liebende, sterben!"

Und horch! da sprudelt es silberhell
Ganz nahe, wie rieselndes Rauschen,
Und stille hält er, zu lauschen;
Und sieh, aus dem Felsen, geschwätzig, schnell,
Springt murmelnd hervor ein lebendiger Quell,
Und freudig bückt er sich nieder,
Und erfrischet die brennenden Glieder.

Und die Sonne blickt durch der Zweige Grün
Und malt auf den glänzenden Matten
Der Bäume gigantische Schatten;
Und zwei Wanderer sieht er die Straße ziehn,
Will eilenden Laufes vorüber fliehn,
Da hört er die Worte sie sagen:
„Jetzt wird er ans Kreuz geschlagen."

Und die Angst beflügelt den eilenden Fuß,
Ihn jagen der Sorge Qualen;
Da schimmern in Abendrots Strahlen
Von ferne die Zinnen von Syrakus,
Und entgegen kommt ihm Philostratus,
Des Hauses redlicher Hüter,
Der erkennet entsetzt den Gebieter:

„Zurück! du rettest den Freund nicht mehr,
So rette das eigene Leben!
Den Tod erleidet er eben.
Von Stunde zu Stunde gewartet er
Mit hoffender Seele der Wiederkehr,
Ihm konnte den mutigen Glauben
Der Hohn des Tyrannen nicht rauben."

„Und ist es zu spät, und kann ich ihm nicht
Ein Retter willkommen erscheinen,
So soll mich der Tod ihm vereinen.
Des rühme der blutge Tyrann sich nicht,
Daß der Freund dem Freunde gebrochen die Pflicht –
Er schlachte der Opfer zweie
Und glaube an Liebe und Treue."

Und die Sonne geht unter, da steht er am Tor
Und sieht das Kreuz schon erhöhet,
Das die Menge gaffend umstehet;
An dem Seile schon zieht man den Freund empor,
Da zertrennt er gewaltig den dichten Chor:
„Mich, Henker!" ruft er, „erwürget!
Da bin ich, für den er gebürget!"

Und Erstaunen ergreifet das Volk umher,
In den Armen liegen sich beide,
Und weinen für Schmerzen und Freude.
Da sieht man kein Auge tränenleer,
Und zum Könige bringt man die Wundermär,
Der fühlt ein menschliches Rühren,
Läßt schnell vor den Thron sie führen.

Und blicket sie lange verwundert an,
Drauf spricht er: „Es ist euch gelungen,
Ihr habt das Herz mir bezwungen,
Und die Treue, sie ist doch kein leerer Wahn –
So nehmet auch mich zum Genossen an,
Ich sei, gewährt mir die Bitte,
In eurem Bunde der Dritte."`,
    translation: 'Schillers Ballade spielt am Hof des Tyrannen Dionysios I. in Syrakus. Sie besingt die Freundschaft zwischen Damon und Pythias, die stärker ist als Furcht vor dem Tod – und selbst den Tyrannen zur Umkehr bewegt.',
    lang: 'Deutsch',
  },
  {
    title: 'Vergil über Siziliens Küsten',
    source: 'Vergil (70–19 v. Chr.), Aeneis III, 692–696',
    original: 'Hinc altas cautes proiectaque saxa Pachyni radimus, et fatis numquam concessa moveri apparet Camerina procul campique Geloi, immanisque Gela fluvii cognomine dicta.',
    translation: 'Von hier streifen wir die hohen Klippen und vorspringenden Felsen von Pachynum, und aus der Ferne erscheint Camerina, die das Schicksal nie zu bewegen gestattete, und die Gefilde von Gela, und das gewaltige Gela, nach dem Fluss benannt.',
    lang: 'Lateinisch',
  },
  {
    title: 'Hephaistos am Ätna – Die Schmiede der Götter',
    source: 'Vergil (70–19 v. Chr.), Aeneis VIII, 415–422',
    original: `insula Sicanium iuxta latus Aeoliamque
erigitur Liparen fumantibus ardua saxis,
quam subter specus et Cyclopum exesa caminis
antra Aetnaea tonant, validique incudibus ictus
auditi referunt gemitus, striduntque cavernis
stricturae Chalybum et fornacibus ignis anhelat,
Volcani domus et Volcania nomine tellus.`,
    translation: 'Die Insel Lipara erhebt sich nahe der sizilischen Küste, hoch aufragend mit rauchenden Felsen. Darunter donnern die Höhlen der Kyklopen, ausgehöhlt von den Schmiedeöfen des Ätna. Man hört das Hallen der Hammerschläge auf den Ambossen; der Stahl zischt in den Grotten, Feuer keucht aus den Öfen: Dies ist Vulcans Haus – das Land trägt seinen Namen.',
    lang: 'Lateinisch',
  },
  {
    title: 'Die Schlacht bei Himera – Gelon besiegt die Karthager',
    source: 'Herodot (ca. 484–425 v. Chr.), Historien 7,165–167',
    original: `Λέγεται δὲ καὶ ὅδε λόγος ὑπὸ τῶν Σικελιητέων,
ὡς ἄρα Γέλων, καὶ εἰ ἔμελλε ὑπακούσεσθαι τοῖσι Ἕλλησι,
ὅμως ἂν ἐβοήθεε, εἰ μή Τήρυλλος ὁ Κρινίππου
Ἱμεραίων τύραννος … Ἀμίλκαν τὸν Καρχηδόνιον
ἤγαγε ἐς τὴν Σικελίην … στρατὸν πεντήκοντα μυριάδων.
ἐν δὲ τῇ αὐτῇ ἡμέρῃ συνέβη νικᾶν τε Γέλωνα
καὶ Θήρωνα ἐν Σικελίῃ Ἀμίλκαν τὸν Καρχηδόνιον
καὶ τοὺς Ἕλληνας τὸν Πέρσην ἐν Σαλαμῖνι.`,
    translation: `Es wird aber auch folgende Geschichte von den Sizilischen Griechen erzählt:
Gelon hätte den Griechen Hilfe geschickt, selbst wenn er ihnen hätte gehorchen müssen —
wenn nicht Terillos, der Tyrann der Himeräer, Sohn des Krinippos,
… den Karthager Hamilkar nach Sizilien geführt hätte …
mit einem Heer von fünfhunderttausend Mann.
Am selben Tag aber geschah es, dass Gelon und Theron in Sizilien
über den Karthager Hamilkar siegten — und die Griechen
über den Perser bei Salamis.
(Hdt. 7,165–166; nach Josef Feix, Tusculum-Ausgabe)`,
    lang: 'Griechisch',
  },
  {
    title: 'Gelon von Gela – Aufstieg zum Tyrannen von Syrakus',
    source: 'Herodot (ca. 484–425 v. Chr.), Historien 7,153–154',
    original: `Γέλωνος δὲ τοῦ Δεινομένεος πέρι, τοῦ Συρηκουσίων τυράννου, ὧδε ἔχει·
τῶν Γελώιων πρότερον ἄρχοντος Ἱπποκράτεος …
Γέλων ἱππάρχης ὢν ἐδόκεε εἶναι τῶν ἄλλων θεραπόντων πολλῷ πρῶτος.
μετὰ δὲ Ἱπποκράτεος τελευτήσαντος …
Γέλων … πρῶτα μὲν Γελώιοισι ἐτυράννευε,
μετὰ δὲ καὶ Συρηκουσίους … ὑπ᾽ ἑωυτῷ ἐποιήσατο.`,
    translation: `Was Gelon, den Sohn des Deinomenes, den Tyrannen von Syrakus, betrifft,
so verhält es sich folgendermaßen:
Als früher Hippokrates über die Geloer herrschte,
war Gelon als Reiterführer bei weitem der Angesehenste unter seinen Dienern.
Nach dem Tod des Hippokrates …
herrschte Gelon zunächst als Tyrann über die Geloer,
dann aber machte er auch die Syrakusaner … sich untertan.
(Hdt. 7,153–154; nach Josef Feix, Tusculum-Ausgabe)`,
    lang: 'Griechisch',
  },
  {
    title: 'Cicero über Agrigent – Willkür des Verres',
    source: 'Cicero (106–43 v. Chr.), Verres 2,2,123–124',
    original: `Agrigentini de senatu cooptando Scipionis leges antiquas habent,
in quibus et illa eadem sancta sunt et hoc amplius:
cum Agrigentinorum duo genera sint,
unum veterum, alterum colonorum quos T. Manlius praetor
ex senatus consulto de oppidis Siculorum deduxit Agrigentum,
cautum est in Scipionis legibus ne plures essent in senatu
ex colonorum numero quam ex vetere Agrigentinorum.
Iste, qui omnia iura pretio exaequasset …
non modo illa quae erant aetatis ordinis quaestusque permiscuit,
sed etiam in his duobus generibus civium novorum veterumque turbavit.`,
    translation: `Die Agrigentiner besitzen alte Gesetze des Scipio über die Ergänzungswahl zum Senat,
in denen dieselben Bestimmungen festgelegt sind und noch folgendes darüber hinaus:
Da es unter den Agrigentinern zwei Gruppen gibt —
eine der Alteingesessenen und eine der Kolonisten,
die der Prätor T. Manlius auf Beschluss des Senats
aus den sizilischen Städten nach Agrigent geführt hatte —,
ist in den Gesetzen des Scipio festgelegt, dass die Zahl der Kolonisten im Senat
nicht größer sein darf als die der alteingesessenen Agrigentiner.
Dieser [Verres], der alle Rechtsnormen durch Geld gleichgestellt hatte,
verwarf nicht nur jene Unterschiede nach Alter, Stand und Beruf,
sondern brachte auch bei diesen zwei Gruppen von Bürgern völlige Verwirrung.
(Cic. Verr. 2,2,123–124)`,
    lang: 'Lateinisch',
  },
  {
    title: 'Die Samier und Zankle – Gründung Messinas',
    source: 'Herodot (ca. 484–425 v. Chr.), Historien 6,22–24',
    original: `Μίλητος μέν νυν οὕτω κεκένωτο ἀνδρῶν·
Σαμίων δὲ οἱ χρήματα ἔχοντες …
ἀπικόμενοι δὲ ἐς Ζάγκλην τῆς Σικελίης …
ἐβουλεύοντο … περὶ Σικελίης οἰκισμοῦ.
ἐν τούτῳ δὲ τῷ χρόνῳ Ἀνάξιλος ὁ Ῥηγίου τύραννος …
ἐπείσε τοὺς Σαμίους … Ζάγκλην … αἱρέειν·
οἱ δὲ Σάμιοι ἐπείθοντο καὶ τὴν Ζάγκλην ἔσχον.`,
    translation: `Milet nun war so seiner Männer beraubt worden.
Von den Samiern aber — diejenigen, die Vermögen besaßen —
nachdem sie nach Zankle in Sizilien gelangt waren,
berieten sie über die Gründung einer Siedlung in Sizilien.
In dieser Zeit überredete Anaxilas, der Tyrann von Rhegion,
die Samier, Zankle in Besitz zu nehmen;
die Samier folgten seinem Rat und bemächtigten sich Zankles.
(Hdt. 6,22–23; nach Josef Feix, Tusculum-Ausgabe)`,
    lang: 'Griechisch',
  },
  {
    title: 'Thukydides – Die Athener in den Latomien',
    source: 'Thukydides (ca. 460–400 v. Chr.), Historien VII, 87',
    original: `οἱ δ᾽ ἐν ταῖς λιθοτομίαις χαλεπῶς τοὺς πρώτους χρόνους
διετέθησαν. πολλοὶ γὰρ ὄντες ἐν ὀλίγῳ, ὑπαίθρῳ τε
καὶ στεγνῷ χωρίῳ, αἵ τε τοῦ ἡλίου προσβολαὶ καὶ τὸ πνῖγος
ἔτι ἐλύπει· αἵ τε νύκτες ἐπιγιγνόμεναι τοὐναντίον
μετοπωριναὶ καὶ ψυχραὶ τῇ μεταβολῇ ἐς ἀσθένειαν ἐνεδίδοσαν·
πάντα τε ἐποίουν ἐν τῷ αὐτῷ διὰ στενοχωρίαν,
καὶ οἱ νεκροὶ ὁμοῦ ἐπ᾽ ἀλλήλοις ᾔκειντο,
οἱ ἀπό τε τῶν τραυμάτων καὶ διὰ τὴν μεταβολὴν
καὶ τὸ τοιοῦτον ἀποθανόντες, καὶ ὀσμαὶ ἦσαν οὐκ ἀνεκταί.`,
    translation: `Die aber in den Steinbrüchen wurden in den ersten Zeiten aufs härteste behandelt. Denn da ihrer viele waren auf engem Raum, unter freiem Himmel und ohne Dach, trafen sie noch die Strahlen der Sonne und die Schwüle; die Nächte aber, die herbstlich und kalt einfielen, brachten durch den Wechsel Krankheiten; alles mussten sie an derselben Stelle verrichten aus Platzmangel, und die Toten lagen beieinander aufeinander – von Wunden Gestorbene und durch den Wechsel Dahingerafften –, und die Gerüche waren unerträglich.

(Thuk. VII, 87; nach Georg Peter Landmann, dtv-Ausgabe)`,
    lang: 'Griechisch',
    note: 'Im Jahr 413 v. Chr. scheiterte die größte Expedition, die Athen je ausgerüstet hatte: 40.000 Soldaten, 200 Schiffe – vernichtet vor Syrakus. Die Überlebenden wurden in die Latomien (Steinbrüche) getrieben, die noch heute in Syrakus zu besichtigen sind. Thukydides nennt es „das verhängnisvollste Ereignis in diesem Krieg und, wie mir scheint, in der griechischen Geschichte überhaupt." General Nikias und Demosthenes wurden hingerichtet.',
  },
  {
    title: 'Platon – Erfahrungen in Syrakus (7. Brief)',
    source: 'Platon (428–348 v. Chr.), Epistula VII, 326b–327a',
    original: `Ἐλθὼν δ᾽ εἰς Συρακούσας νέος ὢν τότε – τί χρὴ λέγειν;
πρεσβύτης γὰρ ὢν νῦν γράφω –
ἦλθον δὴ τότε παρὰ Διονύσιον.
Δίων δὲ ἦν Διονυσίου μὲν κηδεστής,
ἐμοῖς δὲ λόγοις ἐρασθεὶς εἰς ἀεί,
καὶ ζηλωτὴς γενόμενος τοῦ τρόπου τούτου τοῦ βίου·
ἤλπισε δ᾽ αὐτὸν καὶ Διονύσιον οὕτω θήσεσθαι.
ὁ δ᾽ οὐκ ἤθελε – καὶ ὁ βίος ὁ τῆς πόλεως
τῶν Συρακουσίων ἐτάραττέ με,
βίος εὐδαιμονίας Ἰταλιώτου τε καὶ Συρακουσίου,
πλήρης τραπεζῶν Ἰταλικῶν καὶ Συρακουσίων.`,
    translation: `Als ich nach Syrakus kam, damals jung – was soll ich sagen? Als alter Mann schreibe ich dies jetzt –, da kam ich zu Dionysios. Dion nun war der Schwager des Dionysios, von meinen Gesprächen für immer eingenommen und Bewunderer dieser Lebensweise; er hoffte, auch Dionysios werde so eingestellt werden. Dieser aber wollte nicht – und das Leben der Stadt der Syrakusaner beunruhigte mich: das Leben eines italiotischen und syrakusanischen Glücks, voll italischer und syrakusanischer Tafeln.

Platon besuchte Syrakus dreimal: 388, 367 und 361 v. Chr. Bei seinem ersten Besuch ließ ihn Dionysios I. als Sklaven verkaufen; ein Freund erkaufte seine Freiheit. Beim zweiten Besuch sollte er den jungen Dionysios II. zum Philosophenkönig erziehen – das Experiment scheiterte grandios. Platons Akademie und seine Idee des „Philosophenkönigs" wurden durch diese Syrakus-Erfahrungen geprägt.

(Plat. Ep. VII, 326b–327a; nach Klaus Schöpsdau, Tusculum-Ausgabe)`,
    lang: 'Griechisch',
    note: 'Platons 7. Brief gilt als das einzige authentische Selbstzeugnis des Philosophen. Er beschreibt, wie ihn das üppige Tafelleben Syrakus\' abstieß – „zweimal täglich satt sein und nie allein schlafen" sei nicht der Weg zur Tugend. Der Brief ist auch ein Dokument des politischen Scheiterns: der Versuch, einen Tyrannen durch Philosophie zu zähmen, endete in Gefangenschaft.',
  },
  {
    title: 'Pausanias – Alpheios und Arethusa',
    source: 'Pausanias (ca. 115–180 n. Chr.), Periegesis V, 7, 1–3',
    original: `Ἀλφειὸς δὲ ποταμῶν τῶν ἐν Πελοποννήσῳ μέγιστος ῥεῖ
καὶ θέαν παρέχεται καλλίστην·
λέγεται δὲ ἐς αὐτὸν λόγος,
ὡς Ἀλφειὸς ἐρωτικῶς διατεθεὶς πρὸς Ἀρέθουσαν
διώκοι τὴν Ἀρέθουσαν·
ἣ δὲ οὐ θέλουσα γῆμαι
πέρασα ἐς τὴν Ὀρτυγίαν τὴν ἀπαντικρὺ Συρακουσῶν
κρήνη ἐνταῦθα ἐγένετο.
Ἀλφειῷ δὲ ἔδωκεν ὁ θεὸς ἰέναι διὰ τῆς θαλάσσης,
καὶ ἐς τὴν Ἀρέθουσαν ἀφικνεῖται συμμιγνύς.
τούτῳ πεπίστευκε καὶ ὁ θεὸς ὁ ἐν Δελφοῖς·

Ὀρτυγίη τις κεῖται ἐν ἠεροειδέϊ πόντῳ,
Ἀλφειοῦ πηγαῖς Ἀρεθοίσης στόμασι πλησίον.`,
    translation: `Kommt man nach Olympia, sieht man den Fluß Alpheios. Er führt viel Wasser, ein wundervoller Anblick. Es gibt die folgende Sage vom Alpheios: Er sei ein Jäger und in die Arethusa verliebt gewesen. Auch sie liebte die Jagd. Arethusa habe aber Alpheios nicht heiraten wollen und sei nach Sizilien auf die Insel Ortygia bei Syrakus geflohen. Dort sei sie in eine Quelle verwandelt worden. Aus Liebe soll dann auch Alpheios sich in einen Fluß verwandelt haben, der durch das Meer fließt und bei Ortygia sein Wasser mit dem der Quelle vermischt. Das sagt auch der Gott in Delphi:

Ortygia liegt im dunkelflutenden Meere,
wo der Strom Alpheios hervorquillt,
und sich vereinigt mit dem Wasser
der sprudelnden Quelle Arethusa.

(Pausanias V, 7, 1–3)`,
    lang: 'Griechisch',
    note: 'Die Arethusa-Quelle auf der Halbinsel Ortygia in Syrakus ist noch heute zu sehen – ein kleiner Teich mit Papyrus und Enten direkt am Meer. Der Mythos erklärt, warum das Süßwasser der Quelle trotz Meeresnähe nicht salzig ist: Der Fluß Alpheios aus Olympia fließe unterirdisch durch das Meer, um sich mit seiner Geliebten zu vereinigen. Pausanias, der im 2. Jh. n. Chr. Griechenland bereiste und beschrieb, zitiert dazu das Delphische Orakel als Zeugen.',
  },
  {
    title: 'Pausanias – Exaenetos aus Agrigento und die 300 Viergespanne',
    source: 'Pausanias (ca. 115–180 n. Chr.), Periegesis VI, 4, 5–6',
    original: `Ἐξαίνετος δὲ ὁ Ἀκραγαντῖνος δύο ὀλυμπιάδας τοῖς ἐφεξῆς
νικήσας σταδίῳ, κατῆλθεν ἐς Ἀκράγαντα
σὺν ἅρμασιν ἑκατόν τε καὶ τριακοσίοις,
τῶν ἁρμάτων λευκοὶ πάντων ὄντων τῶν ἵππων.
ἐπράχθη δὲ καὶ ἄλλο ἐς τιμὴν αὐτοῦ τοιόνδε·
αἱ γυναῖκες αἱ ἐπιφανέσταται τῆς πόλεως
ὑπήντησαν ἐξελθοῦσαι, καὶ ἄλλα δῶρα ἐδίδοσαν
καὶ κοσμήματα τῶν ἑαυτῶν.`,
    translation: `Exaenetos aus Agrigento, der in zwei aufeinanderfolgenden Olympiaden den Stadionlauf gewann, kehrte nach Agrigento zurück, begleitet von dreihundert Viergespannen, wobei alle Pferde der Gespanne weiß waren. Zu seiner Ehrung geschah auch folgendes: Die angesehensten Frauen der Stadt kamen heraus, um ihn zu empfangen, und überreichten ihm Geschenke und Schmuck aus ihrem eigenen Besitz.

(Pausanias VI, 4, 5–6; nach Ernst Meyer, Artemis-Ausgabe)`,
    lang: 'Griechisch',
    note: 'Exaenetos gewann den Stadionlauf in Olympia 412 und 408 v. Chr. – in der Blütezeit Agrigents unter dem Tyrannen Theron. Der Triumphzug mit 300 weißen Viergespannen gibt eine Vorstellung vom Reichtum und Selbstbewusstsein der Stadt, die Pindar als „schönste Sterblichenstadt" pries. Der Einzug mit weißen Pferden erinnert an den Triumphator-Brauch – in Agrigento aber als Bürgerfest, nicht als Herrschaftsgestus.',
  },
  {
    title: 'Pausanias – Gelon und die Weihgaben nach Himera',
    source: 'Pausanias (ca. 115–180 n. Chr.), Periegesis VI, 9, 4',
    original: `Γέλων δὲ ὁ Συρακόσιος, νικήσας δὲ τῇ μάχῃ τῇ πρὸς
Καρχηδονίους τῇ ἐν Ἱμέρᾳ, ἀνέθηκεν εἰς Δελφοὺς
θυμιατήριον χρυσοῦν.
ἀνέθηκε δὲ καὶ ἐς Ὀλυμπίαν τρίποδα χρυσοῦν·
τὰ δὲ ἐς τὴν νίκην ἐκείνην λέγουσι Συρακόσιοί τε
καὶ Ἀκραγαντῖνοι, ὡς ἐν τῇ αὐτῇ ἡμέρᾳ
Γέλων μὲν ἐν Σικελίᾳ Καρχηδονίους,
Θεμιστοκλῆς δὲ ναυμαχῶν ἐνίκα Πέρσας.`,
    translation: `Gelon aus Syrakus, der in der Schlacht gegen die Karthager bei Himera gesiegt hatte, weihte nach Delphi ein goldenes Räuchergefäß. Er weihte auch nach Olympia einen goldenen Dreifuß. Über jenen Sieg erzählen Syrakusaner und Agrigentiner, dass am selben Tag Gelon in Sizilien die Karthager, Themistokles aber in der Seeschlacht die Perser besiegte.

(Pausanias VI, 9, 4; nach Ernst Meyer, Artemis-Ausgabe)`,
    lang: 'Griechisch',
    note: 'Die Parallelität von Himera (480 v. Chr.) und Salamis (480 v. Chr.) war in der Antike ein vielzitierter Topos: Am selben Tag sollten die Griechen im Westen die Karthager und im Osten die Perser besiegt haben – als wäre die Rettung der griechischen Welt ein einziges, koordiniertes Ereignis. Die Weihgaben in Delphi und Olympia zeigen, wie die westgriechischen Tyrannen ihre Siege in panhellenischen Heiligtümern zur Schau stellten und damit Weltruhm beanspruchten.',
  },
  {
    title: 'Pausanias – Demeter und der Raub der Persephone bei Enna',
    source: 'Pausanias (ca. 115–180 n. Chr.), Periegesis VIII, 46, 2',
    original: `Δήμητρι δὲ ἐν τῇ Σικελίᾳ μάλιστα τιμαὶ νενέμηνται·
λέγεται δὲ ὡς ἡ μὲν Κόρη ἡρπάσθη τε αὐτόθι
καὶ Δήμητρι δὴ ἡ νῆσος αὕτη ἱερά ἐστιν.
ἔστι δὲ καὶ Ἕνναν πόλιν ἐν μέσῃ μάλιστα τῇ νήσῳ
ἐφ᾽ ὑψηλοῦ λόφου κειμένην,
ἐν ᾗ Δήμητρος ἱερόν ἐστιν ἀρχαῖον.`,
    translation: `Demeter wird auf Sizilien vor allem anderen verehrt. Die Sage lautet, dass die Kore (Persephone) dort entführt wurde und dass diese Insel der Demeter heilig ist. Es gibt auch die Stadt Enna, die auf einem hohen Hügel inmitten der Insel liegt, in der sich ein altes Heiligtum der Demeter befindet.

(Pausanias VIII, 46, 2; nach Ernst Meyer, Artemis-Ausgabe)`,
    lang: 'Griechisch',
    note: 'Enna (heute noch Enna) liegt tatsächlich fast genau im geographischen Mittelpunkt Siziliens, auf einem markanten Plateau. Das Demeter-Heiligtum war eines der bedeutendsten Kultzentren der Insel. Pausanias bestätigt hier, was Cicero, Ovid und andere berichten: Sizilien galt in der Antike als das Land der Demeter schlechthin – die mythische Raub-Szene wurde im fruchtbaren Hochland bei Enna verortet, in der Nähe des Lago di Pergusa.',
  },
  {
    title: 'Pausanias – Das athenische Ehrengrab für die Gefallenen in Sizilien',
    source: 'Pausanias (ca. 115–180 n. Chr.), Periegesis I, 29, 12',
    original: `ἔστι δὲ καὶ τάφος Εὐριπίδου, κενὸς μέν,
μνήματι δὲ εἰκὼς ἐπιφανεῖ.
ἐτελεύτησε δὲ ἐν Μακεδονίᾳ.
ἐχομένη δέ ἐστι στήλη λίθου λευκοῦ
ἐφ᾽ ἧς ἐπιγέγραπται·
„Σικελίας οὓς εἷλεν ἀπεχθομένη τύχα
ὧδ᾽ ἔχουσι νεκροί·
τοῖς δ᾽ ἐπιγιγνομένοις
τοῦτο λέγει τὸ μνῆμα·"
τοὺς δὲ ἐν Σικελίᾳ ἀποθανόντας τῶν Ἀθηναίων
ἐνταῦθα φασιν ἐντεθάφθαι.`,
    translation: `Es gibt auch ein Grab des Euripides, das zwar leer ist, aber einem ansehnlichen Denkmal gleicht. Er starb nämlich in Makedonien. Daneben steht eine Stele aus weißem Stein, auf der geschrieben steht: „Die Toten, welche das feindliche Schicksal in Sizilien gefangen hat, liegen hier; dieses Denkmal sagt es den Nachgeborenen." Die in Sizilien gefallenen Athener, sagt man, seien hier begraben.

(Pausanias I, 29, 12; nach Ernst Meyer, Artemis-Ausgabe)`,
    lang: 'Griechisch',
    note: 'Das Keramikeion, der athenische Staatsfriedhof, bewahrte das Andenken an die Katastrophe von 413 v. Chr.: Die sizilische Expedition endete mit der Vernichtung zweier athenischer Heere und Flotten. Die meisten Gefallenen blieben in Sizilien – in den Latomien von Syrakus oder verscharrt auf dem Schlachtfeld. Das Ehrengrab in Athen war ein Kenotaph, ein leeres Grab, das das kollektive Trauma der Stadt bezeugte. Thukydides (VII, 87) nennt es „das bedeutendste Ereignis in diesem Krieg – ja, soweit wir wissen, das bedeutendste in griechischer Geschichte".',
  },
  {
    title: 'Empedokles – Ich bin ein unsterblicher Gott',
    source: 'Empedokles (ca. 490–430 v. Chr.), Fragment B112 (nach Diels-Kranz)',
    original: `ὦ φίλοι, οἳ μέγα ἄστυ κατὰ ξανθοῦ Ἀκράγαντος
ναίετ᾽ ἀν᾽ ἄκρα πόλεος, ἀγαθῶν μελεδήμονες ἔργων,
ξείνων αἰδοῖοι λιμένες, κακότητος ἄπειροι –
χαίρετ᾽· ἐγὼ δ᾽ ὑμῖν θεὸς ἄμβροτος, οὐκέτι θνητός,
πωλεῦμαι μετὰ πᾶσι τετιμένος, ὥσπερ ἔοικα,
ταινίαις τε περίστεπτος στέφεσίν τε θαλείοις.
τοῖσίν τε προσίκω κατ᾽ ἄστεα τηλεθάοντα,
ἀνδράσιν ἠδὲ γυναιξί· σέβονται δέ με μυρίοι,
οἵτε μαντοσύνας ζητοῦσιν, οἱ δ᾽ ἐπ᾽ ἰήσει
ἔπεσθαι ζήτεον, δηρὸν δὴ χαλεπῇσι πεπαρμένοι.`,
    translation: `Freunde, ihr die ihr am Ufer des gelben Akragas wohnt,
auf der Höhe der Stadt, sorgsam um gute Werke,
ehrwürdige Häfen für Fremde, unkundig des Bösen –
seid gegrüßt! Ich aber wandle unter euch als unsterblicher Gott, kein Sterblicher mehr,
von allen geehrt, wie es sich ziemt,
bekränzt mit Bändern und blühenden Kränzen.
Wenn ich in die blühenden Städte komme,
werde ich von Männern und Frauen verehrt; Zehntausende folgen mir –
die einen, die nach Weissagung fragen,
die anderen, die Heilung suchen für lange, schwere Leiden.

(Empedokles, Fragment B112; nach Hermann Diels / Walther Kranz)`,
    lang: 'Griechisch',
    note: 'Dieses Fragment des Empedokles ist eines der kühnsten Selbstzeugnisse der Antike: Ein Mensch erklärt sich selbst zum Gott. Empedokles aus Akragas (Agrigento) war Philosoph, Arzt, Politiker und religiöser Wundertäter. Er lehrte die vier Elemente (Feuer, Wasser, Luft, Erde) und die Urkräfte Liebe und Hass. Die Legende, er sei in den Ätna gesprungen um seine Göttlichkeit zu beweisen, ist wohl ein Mythos – aber ein bezeichnender.',
  },
  {
    title: 'Theokrit – Der verliebte Kyklop (Polyphem an Galateia)',
    source: 'Theokrit (ca. 300–260 v. Chr.), Idyll XI, 19–34',
    original: `ὦ Γαλάτεια, τί τὸν φιλέοντ᾽ ἀποβάλλῃ,
λευκοτέρα πακτᾶς ποτιδεῖν, ἁπαλωτέρα ἀρνός,
μόσχω γαυροτέρα, φιαρωτέρα ὄμφακος ὠμᾶς;
φοιτῇς δ᾽ αὖθ᾽ οὕτως, ὅκκα γλυκὺς ὕπνος ἔχῃ με,
οἴχῃ δ᾽ εὐθὺς ἰοῖσ᾽, ὅκκα γλυκὺς ὕπνος ἀνῇ με,
φεύγεις δ᾽ ὥσπερ ὄις πολιὸν λύκον ἀθρήσασα.
ἠράσθην μὲν ἔγωγε τεοῦς, κόρα, ἁνίκα πρᾶτον
ἦνθες ἐμᾷ σὺν ματρὶ θέλοισ᾽ ὑακίνθινα φύλλα
ἐξ ὄρεος δρέψασθαι, ἐγὼ δ᾽ ὁδὸν ἁγεμόνευον·
παύσασθαι δ᾽ ἐσιδών τυ καὶ ὕστερον οὐδ᾽ ἔτι πω νῦν
ἐκ τήνω δύναμαι· τὶν δ᾽ οὐ μέλει, οὐ μὰ Δί᾽, οὐδέν.`,
    translation: `O Galateia, warum weist du zurück, der dich liebt –
du, weißer als Quark anzuschauen, zarter als ein Lamm,
lebhafter als ein junges Rind, reifer als eine unreife Traube?
Du kommst, wenn der süße Schlaf mich hält,
und gehst sofort fort, wenn der süße Schlaf mich loslässt;
du fliehst wie ein Schaf, das den grauen Wolf erblickt hat.
Ich verliebte mich in dich, Mädchen, als du das erste Mal
mit deiner Mutter kamst, Hyazinthblätter zu pflücken
vom Berg, und ich den Weg zeigte;
und seitdem ich dich gesehen habe, kann ich nicht mehr aufhören –
bis auf den heutigen Tag. Dir aber, bei Zeus, liegt nichts daran.

(Theokrit, Idyll XI, 19–34; nach Bernd Effe, Tusculum-Ausgabe)`,
    lang: 'Griechisch (dorischer Dialekt)',
    note: 'Theokrit aus Syrakus gilt als Begründer der Bukolik (Hirtendichtung) und damit als Vorbild für Vergils Eklogen und die gesamte abendländische Pastoraldichtung. Das 11. Idyll ist eine komische Umkehrung des Polyphem-Mythos: Der gefürchtete Kyklop ist ein plumper Liebhaber, der mit seiner Musik die Meerespnymphe Galateia zu gewinnen versucht – vergeblich. Theokrit macht den Ungeheuer menschlich – und damit tragisch-komisch.',
  },
  {
    title: 'Lukrez – Der Ätna und seine Feuer',
    source: 'Lukrez (ca. 97–55 v. Chr.), De Rerum Natura VI, 639–646 & 680–686',
    original: `Nunc age, Aetnaeae quae sint incendia causas
percipe. primum omnino formidolus hic est
montis, totus enim vasto consurgit in altum
vertice, nec facile est aditu tentare propinquo.
Principio venti vis magnus et impetus urget
in cavernis terrae magnos quassare tumultus
atque replere cavas saxis ardentibus oras
quae subter specus et Cyclopum exesa caminis
antra tonant validoque incudibus ictus.`,
    translation: `Wohlan, vernimm nun, was die Feuer des Ätna verursacht.
Zunächst ist dieser Berg überhaupt schauenerregend –
er erhebt sich ganz mit gewaltigem Gipfel in die Höhe,
und es ist nicht leicht, ihm nahe zu treten.
Vor allem treibt die mächtige Kraft und der Ansturm des Windes
die großen Erschütterungen in den Höhlen der Erde,
und füllt die hohlen Räume mit brennenden Felsen –
darunter donnern die Höhlen, die von den Öfen der Kyklopen ausgehöhlt sind,
mit den wuchtigen Hammerschlägen auf den Ambossen.

(Lukr. VI, 639–646 & 680–686; nach Karl Büchner)`,
    lang: 'Lateinisch',
    note: 'Lukrez erklärt den Ätna nicht durch Götter, sondern durch Naturkräfte: Wind in unterirdischen Hohlräumen. Sein Lehrgedicht „De Rerum Natura" ist das große atomistische Weltbild der Antike – alles erklärt sich durch Atome im leeren Raum. Die Kyklopen-Referenz übernimmt er aus Vergil, aber als poetisches Bild, nicht als Glaubenssatz. Lukrez gilt als Vorgänger der modernen Naturwissenschaft.',
  },
  {
    title: 'Strabon – Geographische Beschreibung Siziliens',
    source: 'Strabon (ca. 64 v. Chr.–24 n. Chr.), Geographika VI, 2, 1 & 2, 3',
    original: `Ἡ Σικελία τρίγωνός ἐστι τὸ σχῆμα·
ὅθεν Τρινακρία μὲν πρότερον, ὕστερον δὲ Θρινακία ἐκλήθη,
εἶτα Σικελία μετωνομάσθη.
αἱ δὲ πλευραὶ τρεῖς εἰσιν οὐκ ἴσαι·
Πελωριὰς μὲν εἰς τὴν Ἰταλίαν νεύουσα τὸ ἄκρον ἔχει
ἐγγύτατα τῆς Ἰταλίας ...
πλησίον δ᾽ ἐστὶν ἡ Αἴτνη,
μέγιστον ὄρος τῆς Σικελίας,
τῆς κορυφῆς ψιλῆς οὔσης καὶ χιόνος ἀεὶ τὸν χειμῶνα.`,
    translation: `Sizilien ist von dreieckiger Gestalt; daher wurde es früher Trinakria, dann Thrinakia genannt, schließlich erhielt es den Namen Sikelia. Die drei Seiten sind nicht gleich lang; das Kap Peloria, das nach Italien weist, liegt dem Festland am nächsten ...
In der Nähe liegt der Ätna, der höchste Berg Siziliens, dessen Gipfel kahl ist und im Winter stets Schnee trägt.

[Über Syrakus:] Syrakus wurde von Archias aus Korinth gegründet, ungefähr zur gleichen Zeit wie Karthago. Thukydides berichtet, dass die Phönizier vor den Griechen an den Vorgebirgen und Inseln um Sizilien siedelten. Als die Griechen in Menge hereinkamen, gaben die Phönizier die meisten Orte auf und hielten sich nur noch bei Motye, Solus und Panormus. Syrakus aber ist die berühmteste Stadt und war immer der Führung am würdigsten.

(Strab. VI, 2, 1 & 2, 4; nach Stefan Radt, Vandenhoeck & Ruprecht)`,
    lang: 'Griechisch',
    note: 'Strabon verfasste im augusteischen Zeitalter die erste große Geographie der antiken Welt. Sein Bericht über Sizilien (Geographika VI, 2) ist ein einzigartiges Dokument: Er beschreibt nicht nur Landschaft und Städte, sondern auch Geschichte, Kultur und Wirtschaft. Als gebildeter Grieche schreibt er über eine Insel, die schon lange römisch ist – und bewahrt damit Erinnerungen an eine verschwundene griechische Welt.',
  },
]

const texteGruppen = [
  {
    label: 'Mythologisches',
    ids: [
      'Arethusa – Die Nymphe unter dem Meer',
      'Daidalos und König Kokalos',
      'Hephaistos am Ätna – Die Schmiede der Götter',
      'Persephone – Der Raub bei Enna',
      'Polyphem – Der Zyklop und Odysseus',
      'Skylla und Charybdis – Die Meerenge von Messina',
      'Pausanias – Alpheios und Arethusa',
      'Pausanias – Demeter und der Raub der Persephone bei Enna',
      'Empedokles – Ich bin ein unsterblicher Gott',
      'Theokrit – Der verliebte Kyklop (Polyphem an Galateia)',
    ],
  },
  {
    label: 'Historisches',
    ids: [
      'Die Perser – Der Traum der Atossa',
      'Die Perser – Der Schlachtruf bei Salamis',
      'Cicero über Sizilien – Insel der Ceres und Persephone',
      'Cicero über Syrakus',
      'Cicero über Agrigent – Willkür des Verres',
      'Die Schlacht bei Himera – Gelon besiegt die Karthager',
      'Die Samier und Zankle – Gründung Messinas',
      'Gelon von Gela – Aufstieg zum Tyrannen von Syrakus',
      'Pausanias – Exaenetos aus Agrigento und die 300 Viergespanne',
      'Pausanias – Gelon und die Weihgaben nach Himera',
      'Pindar über Ätna und Sizilien',
      'Vergil über Siziliens Küsten',
      'Thukydides – Die Athener in den Latomien',
      'Pausanias – Das athenische Ehrengrab für die Gefallenen in Sizilien',
      'Platon – Erfahrungen in Syrakus (7. Brief)',
      'Lukrez – Der Ätna und seine Feuer',
      'Strabon – Geographische Beschreibung Siziliens',
    ],
  },
  {
    label: 'Zeitgenössisches',
    ids: [
      'Il ladro di merendine – Montalbano e François',
      'Il commissario Montalbano – Catarella al telefono',
      'Per questo mi chiamo Giovanni – La struttura di Cosa Nostra',
      'Goethe über Monte Pellegrino',
      'Così è (se vi pare) – Schlussszene',
      'Die Bürgschaft',
    ],
  },
]

// Speisen Karussell – rotiert automatisch alle 10 Sekunden
function SpeisenKarussel({ gerichte }: { gerichte: { name: string; desc: string; image: string }[] }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % gerichte.length), 7000)
    return () => clearInterval(timer)
  }, [gerichte.length])
  const s = gerichte[idx]
  return (
    <div className="speisen-karussel">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="speise-card-featured"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
        >
          <div className="speise-img-featured">
            <img src={s.image} alt={s.name} loading="lazy" />
          </div>
          <div className="speise-body">
            <h4>{s.name}</h4>
            <p>{s.desc}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="speisen-dots">
        {gerichte.map((_, i) => (
          <button key={i} className={`speisen-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} aria-label={gerichte[i].name} />
        ))}
      </div>
    </div>
  )
}

// Hotel card with expandable Google Maps
function HotelCard({ hotel, hotelData }: { hotel: string; hotelData?: HotelData }) {
  const [expanded, setExpanded] = useState(false)
  if (!hotel) return null

  return (
    <div className="hotel-section">
      <div className="hotel-info" onClick={() => hotelData && setExpanded(!expanded)} style={{ cursor: hotelData ? 'pointer' : 'default' }}>
        <Hotel size={18} />
        <span>{hotel}</span>
        {hotelData && (expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
      </div>
      <AnimatePresence>
        {expanded && hotelData && (
          <motion.div
            className="hotel-map-card"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="hotel-map-inner">
              <iframe
                className="hotel-map-iframe"
                src={`https://www.google.com/maps?q=${hotelData.mapsEmbed}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title={hotelData.name}
              />
              <a
                href={`https://www.google.com/maps/search/${hotelData.mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hotel-maps-link"
              >
                <MapPin size={14} /> Auf Google Maps öffnen (Bewertungen, Fotos, Route)
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Expandable sight detail component
function SightDetail({ name }: { name: string }) {
  const info = sightDetails[name]
  if (!info) return null

  return (
    <motion.div
      className="sight-detail-panel"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h4 className="sight-detail-title">{name}</h4>
      <p className="sight-detail-text">{info.detail}</p>
      {info.facts && (
        <div className="sight-facts">
          {info.facts.map((f, i) => (
            <span key={i} className="sight-fact">{f}</span>
          ))}
        </div>
      )}
      {info.photos && info.photos.length > 0 && (
        <div className="sight-photos">
          {info.photos.map((p, i) => (
            <figure key={i} className="sight-photo-item">
              <img src={p.url} alt={p.caption} loading="lazy" className="sight-photo-img" />
              <figcaption className="sight-photo-caption">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {info.textBoxes && info.textBoxes.length > 0 && (
        <div className="sight-textboxes">
          {info.textBoxes.map((t, i) => (
            <div key={i} className="sight-textbox">
              <h5 className="sight-textbox-title">{t.title}</h5>
              <div className="sight-textbox-content">{t.content.split('\n\n').map((para, pi) => <p key={pi}>{para}</p>)}</div>
            </div>
          ))}
        </div>
      )}
      {info.planUrl && (
        <div className="sight-plan">
          <div className="sight-plan-label"><Landmark size={14} /> Grundriss / Plan</div>
          <a href={info.planUrl} target="_blank" rel="noopener noreferrer">
            <img src={info.planUrl} alt={`Grundriss ${name}`} loading="lazy" className="sight-plan-img" />
          </a>
        </div>
      )}
      <div className="sight-links">
        {info.wikipedia && (
          <a href={info.wikipedia} target="_blank" rel="noopener noreferrer" className="sight-link">
            <ExternalLink size={14} /> Wikipedia
          </a>
        )}
      </div>
    </motion.div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentDay, setCurrentDay] = useState<number | null>(null)
  const [expandedSight, setExpandedSight] = useState<string | null>(null)
  const [expandedPerson, setExpandedPerson] = useState<number | null>(null)
  const [expandedText, setExpandedText] = useState<string | null>(null)
  const [expandedGruppen, setExpandedGruppen] = useState<string[]>([])
  const [restaurantFilter, setRestaurantFilter] = useState<string>('Alle')
  const [glossarRichtung, setGlossarRichtung] = useState<'it-de' | 'de-it'>('it-de')
  const [glossarOpenCats, setGlossarOpenCats] = useState<string[]>([])

  // Track which day card is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible entry that is intersecting
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          // Pick the one with highest intersection ratio
          const best = visible.reduce((a, b) => a.intersectionRatio > b.intersectionRatio ? a : b)
          const dayNum = parseInt(best.target.id.replace('day-', ''))
          if (!isNaN(dayNum)) setCurrentDay(dayNum)
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.5], rootMargin: '-120px 0px -30% 0px' }
    )
    // Delay to ensure elements are rendered
    const timer = setTimeout(() => {
      for (let i = 1; i <= 8; i++) {
        const el = document.getElementById(`day-${i}`)
        if (el) observer.observe(el)
      }
    }, 500)
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    if (currentDay === null) return
    const newDay = direction === 'prev' ? currentDay - 1 : currentDay + 1
    if (newDay >= 1 && newDay <= 8) {
      setCurrentDay(newDay)
      scrollTo(`day-${newDay}`)
    }
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
              ['region', 'Region'],
              ['route', 'Reiseroute'],
              ['restaurants', 'Restaurants'],
              ['speisen', 'Speisen'],
              ['texte', 'Texte'],
              ['architektur', 'Architektur'],
              ['natur', 'Flora & Fauna'],
              ['zeittafel', 'Zeittafel'],
              ['personen', 'Persönlichkeiten'],
              ['glossar', 'Glossar'],
              ['karten', 'Karten & Pläne'],
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
          <p className="hero-dates">28. März – 4. April 2026</p>
          <p style={{ color: '#ccc', maxWidth: 600, margin: '0 auto 2rem', fontFamily: 'var(--font-serif)', fontSize: '1.15rem', lineHeight: '1.8' }}>
            Auf den Spuren der Antike, der Normannen und des Barock –<br />
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

      {/* Region Sizilien */}
      <section className="section" id="region">
        <div className="section-header">
          <h2><Globe size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Die Region Sizilien</h2>
          <div className="section-divider" />
          <p>Größte Insel des Mittelmeers – Zahlen, Daten &amp; Fakten 2024/2025</p>
        </div>

        {/* Karte – Provinzen */}
        <div className="region-maps-row">
          <div className="region-map-wrap region-map-svg-wrap">
            <svg viewBox="0 0 820 460" xmlns="http://www.w3.org/2000/svg" className="region-map-svg">
              {/* Sicily coastline – improved with NE Messina peninsula */}
              <polygon
                points="
                  114,89  175,49  205,84
                  306,65  346,68  447,84
                  575,52  640,60  690,42  730,35  760,28  790,31
                  775,48  760,55  748,72  738,95  720,115
                  713,129  700,148  686,186  667,211
                  699,274  713,311  720,327  681,402
                  620,393  595,386  555,379  530,362
                  496,311  430,302  344,259
                  249,208  162,194  114,140  114,89
                "
                fill="#1e3a5f" stroke="#c9a96e" strokeWidth="2.5"
              />
              {/* Province boundary lines (approximate, dashed) */}
              {/* TP / PA */}
              <polyline points="238,84 200,128 162,194" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5,4"/>
              {/* PA / ME (N coast → interior) */}
              <polyline points="575,52 568,98 572,145 590,178" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5,4"/>
              {/* ME / CT (Taormina inland) */}
              <polyline points="720,115 690,145 660,175 590,178" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5,4"/>
              {/* PA / EN (N coast → EN center) */}
              <polyline points="447,84 452,120 458,170 468,200" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5,4"/>
              {/* EN / CT (E border) */}
              <polyline points="590,178 575,210 565,238" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5,4"/>
              {/* EN / CL (S border) */}
              <polyline points="468,200 490,218 530,228 565,238" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5,4"/>
              {/* CL / AG (W border) */}
              <polyline points="344,259 380,250 420,243 468,200" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5,4"/>
              {/* CL / CT (E) and CL / RG (SE) */}
              <polyline points="565,238 578,268 575,310 555,362 530,362" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5,4"/>
              {/* CT / SR */}
              <polyline points="699,274 672,295 658,325 645,350" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5,4"/>
              {/* SR / RG */}
              <polyline points="645,350 628,365 615,390" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5,4"/>

              {/* Province bubbles */}
              {[
                { id:'ME', cx:728, cy: 72, fill:'#d35400', name:'Messina' },
                { id:'PA', cx:308, cy: 98, fill:'#2980b9', name:'Palermo' },
                { id:'TP', cx:145, cy:138, fill:'#e67e22', name:'Trapani' },
                { id:'AG', cx:340, cy:278, fill:'#27ae60', name:'Agrigento' },
                { id:'CL', cx:465, cy:258, fill:'#8e44ad', name:'Caltanissetta' },
                { id:'EN', cx:505, cy:197, fill:'#c0392b', name:'Enna' },
                { id:'CT', cx:652, cy:230, fill:'#16a085', name:'Catania' },
                { id:'RG', cx:582, cy:358, fill:'#f39c12', name:'Ragusa' },
                { id:'SR', cx:695, cy:335, fill:'#1abc9c', name:'Siracusa' },
              ].map(p => (
                <g key={p.id}>
                  <circle cx={p.cx} cy={p.cy} r={26} fill={p.fill} opacity={0.92} stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                  <text x={p.cx} y={p.cy - 3} textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">{p.id}</text>
                  <text x={p.cx} y={p.cy + 11} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.88)">{p.name}</text>
                </g>
              ))}
            </svg>
            <div className="region-map-caption">
              🎨 Alle 9 Provinzen mit Hauptstädten
            </div>
          </div>
          <div className="region-map-wrap region-map-osm-wrap">
            <iframe
              className="region-map-iframe"
              src="https://www.openstreetmap.org/export/embed.html?bbox=11.9%2C36.4%2C15.7%2C38.3&layer=mapnik"
              title="Satellitenkarte Sizilien"
              loading="lazy"
            />
            <div className="region-map-caption">
              🗺️ Topographische Karte · Quelle: OpenStreetMap
            </div>
          </div>
        </div>

        {/* Provinzen */}
        <h3 className="region-section-title">Die 9 Provinzen</h3>
        <div className="region-provinzen-grid">
          {regionProvinzen.map((p, i) => (
            <motion.div key={i} className="region-provinz-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="region-provinz-kuerzel">{p.kuerzel}</div>
              <div className="region-provinz-name">{p.name}</div>
              <div className="region-provinz-details">
                <span>🏙️ {p.hauptstadt}</span>
                <span>📐 {p.flaeche.toLocaleString('de-DE')} km²</span>
                <span>👥 {(p.einwohner / 1000).toFixed(0)}.000 Einw.</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fakten */}
        <h3 className="region-section-title">Fakten &amp; Zahlen</h3>
        <div className="region-fakten-grid">
          {regionFakten.map((f, i) => (
            <motion.div key={i} className="region-fakt-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="region-fakt-icon">{regionIcon(f.icon)}</div>
              <div className="region-fakt-wert">{f.wert}</div>
              <div className="region-fakt-label">{f.label}</div>
              <div className="region-fakt-sub">{f.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Trinacria */}
        <h3 className="region-section-title">Trinacria – Flagge und Wahrzeichen</h3>
        <div className="trinacria-block">
          <div className="trinacria-flag">
            <img
              src="/sicily-trip/flag-sicily.png"
              alt="Flagge Siziliens mit Trinacria"
              className="trinacria-flag-img"
            />
            <div className="trinacria-flag-caption">Flagge der Region Sizilien</div>
          </div>
          <div className="trinacria-text">
            <p>Seit dem Jahr 2000 ist die Trinacria Siziliens offizielle Regionalflagge, doch geht die rot-gelbe Fahne bis mindestens auf die Zeit der Sizilianischen Vesper im 13. Jh. zurück. Ihre Grundfarben beziehen sich auf <strong>Palermo</strong> (Rot) und <strong>Corleone</strong> (Gelb), beides Hochburgen des Widerstands gegen die Franzosen.</p>
            <p>Der Name <em>Trinacria</em> bzw. <em>Trinakria</em> (griech.: „Insel der drei Kaps") stand bereits in der Antike für Sizilien und bezieht sich auf die drei Landspitzen: <strong>Peloro</strong> (Messina), <strong>Pachino</strong> (Syrakus) und <strong>Lilibeo</strong> (Marsala).</p>
            <p>Das zentrale Symbol ist eine <strong>Triskele</strong> – drei abgewinkelte Beine, die eine rotierende Bewegung andeuten – mit einem <strong>Medusenhaupt</strong> in der Mitte. Es ist auf der Insel seit griechischer Zeit überliefert. Unter den Römern wurde die Medusa zur freundlicheren Getreidegöttin <em>Ceres</em>, die Schlangen auf dem Kopf wichen <strong>Weizenähren</strong> – Symbol für Siziliens Bedeutung als Kornkammer Roms.</p>
            <p>Heute zählt die Trinacria, häufig aus Keramik gestaltet, zu den beliebtesten Souvenirs der Insel.</p>
          </div>
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
              <div key={d.day} className="route-day-mini" onClick={() => { setCurrentDay(d.day); scrollTo(`day-${d.day}`) }}>
                <span className="day-num">Tag {d.day}</span>
                <h4>{d.weekday}, {d.date}</h4>
                <p>{d.stops.slice(0, 3).map(s => s.name).join(' – ')}{d.stops.length > 3 ? ' ...' : ''}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky day navigation strip */}
        <div className="day-strip">
          {days.map(d => (
            <button
              key={d.day}
              className={`day-strip-btn ${currentDay === d.day ? 'active' : ''}`}
              onClick={() => { setCurrentDay(d.day); scrollTo(`day-${d.day}`) }}
            >
              {d.day} {d.weekday.slice(0, 2)}
            </button>
          ))}
        </div>

        {days.map(d => (
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
              {d.imageSize
                ? <div className="day-card-hero-bg" style={{ backgroundImage: `url(${d.image})`, backgroundSize: d.imageSize, backgroundPosition: (d as any).imagePosition || 'center top' }} />
                : <img src={d.image} alt={d.title} loading="lazy" style={{ objectPosition: (d as any).imagePosition || 'center' }} />
              }
              <div className="day-card-overlay">
                <span className="day-badge">Tag {d.day} – {d.weekday}</span>
                <h3>{d.date}</h3>
              </div>
            </div>
            <div className="day-card-body">
              <div className="stops-grid">
                {d.stops.map((s, i) => {
                  const img = s.image || sightImages[s.name]
                  const hasSight = !!sightDetails[s.name]
                  return (
                    <div
                      key={i}
                      className={`stop-card${img ? ' stop-card-has-img' : ''}${hasSight ? ' stop-card-clickable' : ''}`}
                      onClick={() => hasSight && setExpandedSight(expandedSight === `${d.day}-${i}` ? null : `${d.day}-${i}`)}
                    >
                      {img && (
                        <div className="stop-card-bg" style={{ backgroundImage: `url(${img})`, backgroundPosition: (s as any).bgPosition || 'center', backgroundSize: (s as any).bgSize || 'cover' }} />
                      )}
                      <div className="stop-card-content">
                        <div className="stop-name">{s.name} {s.km && <span className="stop-km">({s.km})</span>}{(s as any).option && <span className="stop-option"> [{(s as any).option}]</span>}</div>
                        <div className="stop-desc">{s.desc}</div>
                        {s.flight && (
                          <a
                            className="stop-flight"
                            href={`https://www.lufthansa.com/de/de/flugstatus?flightNumber=${s.flight.replace(' ', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                          >
                            ✈ {s.flight}
                          </a>
                        )}
                        {s.flightTimes && (
                          <div className="stop-flight-times">{s.flightTimes}</div>
                        )}
                        {hasSight && (
                          <div className="stop-card-hint">
                            <Info size={12} /> Details {expandedSight === `${d.day}-${i}` ? '▲' : '▼'}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Full-width sight details below grid */}
              {d.stops.map((s, i) => (
                expandedSight === `${d.day}-${i}` && sightDetails[s.name] ? (
                  <SightDetail key={`detail-${i}`} name={s.name} />
                ) : null
              ))}
              <HotelCard hotel={d.hotel} hotelData={d.hotelData} />

              {/* Day navigation */}
              <div className="day-nav">
                {d.day > 1 && (
                  <button className="day-nav-btn" onClick={() => { setCurrentDay(d.day - 1); navigateDay('prev') }}>
                    <ChevronLeft size={18} /> Tag {d.day - 1}
                  </button>
                )}
                <div style={{ flex: 1 }} />
                {d.day < 8 && (
                  <button className="day-nav-btn" onClick={() => { setCurrentDay(d.day + 1); scrollTo(`day-${d.day + 1}`) }}>
                    Tag {d.day + 1} <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Restaurants */}
      <section className="section" id="restaurants">
        <div className="section-header">
          <h2><UtensilsCrossed size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Restaurant- & Vinothek-Empfehlungen</h2>
          <div className="section-divider" />
          <p>Echte sizilianische Osterien, Trattorien und Slow-Food-Lokale – von Reiseforen und Guides empfohlen</p>
        </div>

        <div className="restaurant-filter">
          {['Alle', ...Array.from(new Set(restaurants.map(r => r.location)))].map(loc => (
            <button
              key={loc}
              className={`restaurant-filter-btn${restaurantFilter === loc ? ' active' : ''}`}
              onClick={() => setRestaurantFilter(loc)}
            >
              {loc}
            </button>
          ))}
        </div>

        <div className="restaurants-grid">
          {restaurants.filter(r => restaurantFilter === 'Alle' || r.location === restaurantFilter).map((r, i) => (
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
                {r.warning && (
                  <div className="restaurant-warning">⚠️ {r.warning}</div>
                )}
                <p>{r.desc}</p>
                {(r.hours || r.closed) && (
                  <div className="restaurant-info-grid">
                    {r.hours && <div className="restaurant-info-item"><Clock size={13} /> {r.hours}</div>}
                    {r.closed && <div className="restaurant-info-item restaurant-closed">Ruhetag: {r.closed}</div>}
                  </div>
                )}
                <div className="restaurant-tags">
                  {r.tags.map(t => <span key={t} className="restaurant-tag">{t}</span>)}
                </div>
                <a href={r.mapsUrl} target="_blank" rel="noopener noreferrer" className="restaurant-maps-link">
                  <MapPin size={14} /> Auf Google Maps öffnen
                </a>
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

        <div className="speisen-sections">
          <div className="speisen-kategorie">
            <h3 className="speisen-kat-titel">🥗 Vorspeisen</h3>
            <SpeisenKarussel gerichte={vorspeisen} />
          </div>
          <div className="speisen-kategorie">
            <h3 className="speisen-kat-titel">🍝 Hauptspeisen</h3>
            <SpeisenKarussel gerichte={hauptspeisen} />
          </div>
          <div className="speisen-kategorie">
            <h3 className="speisen-kat-titel">🍮 Nachspeisen</h3>
            <SpeisenKarussel gerichte={nachspeisen} />
          </div>
        </div>
      </section>

      {/* Texte zu Sizilien */}
      <section className="section" id="texte">
        <div className="section-header">
          <h2><BookOpen size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Texte zu Sizilien</h2>
          <div className="section-divider" />
          <p>Lateinische, griechische und deutsche Quellen zu Sizilien</p>
        </div>

        {texteGruppen.map(gruppe => {
          const isOpen = expandedGruppen.includes(gruppe.label)
          const toggle = () => setExpandedGruppen(prev =>
            prev.includes(gruppe.label) ? prev.filter(g => g !== gruppe.label) : [...prev, gruppe.label]
          )
          return (
            <div key={gruppe.label} className={`texte-gruppe${isOpen ? ' texte-gruppe-open' : ''}`}>
              <div className="texte-gruppe-header" onClick={toggle}>
                <h3 className="texte-gruppe-titel">{gruppe.label}</h3>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {gruppe.ids.map(id => {
                      const t = texte.find(x => x.title === id)
                      if (!t) return null
                      return (
                        <motion.div
                          key={t.title}
                          className={`text-card${expandedText === t.title ? ' text-card-open' : ''}`}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={fadeIn}
                        >
                          <div className="text-card-header" onClick={() => setExpandedText(expandedText === t.title ? null : t.title)}>
                            <div>
                              <h4>{t.title}</h4>
                              <div className="text-source">{t.source}</div>
                            </div>
                            {expandedText === t.title ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                          <AnimatePresence>
                            {expandedText === t.title && (
                              <motion.div
                                className="text-card-body"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="text-columns">
                                  <div>
                                    <div className="text-label">{t.lang}</div>
                                    <div className="text-original">{t.original}</div>
                                  </div>
                                  {t.translation && (
                                    <div>
                                      <div className="text-label">Deutsche Übersetzung</div>
                                      <div className="text-translation">{t.translation}</div>
                                    </div>
                                  )}
                                  {(t as any).note && (
                                    <div className="text-note">{(t as any).note}</div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </section>

      {/* Glossar */}
      {/* Architektur */}
      <section className="section" id="architektur">
        <div className="section-header">
          <h2><Landmark size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Architektur auf Sizilien</h2>
          <div className="section-divider" />
          <p>Tempelformen, Säulenordnungen und Kirchentypen – von der Antike bis zur Normannenzeit</p>
        </div>

        {/* Tempelformen */}
        <h3 className="arch-subtitle">Griechische Tempelformen</h3>

        {/* Grundriss-Diagramm */}
        <div className="arch-schema-detail" style={{ margin: '0 0 1.5rem 0', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
            Grundrissschemata der wichtigsten Tempeltypen (Draufsicht: Punkte = Säulen, dicke Linien = Mauern)
          </p>
          <img
            src="/sicily-trip/arch-tempeltypen.svg"
            alt="Grundrissdiagramm griechischer Tempeltypen: Tholos, Antentempel, Prostylos, Peripteros, Dipteros u.a."
            style={{ maxWidth: '100%', width: '660px', border: '1px solid #e0d5c8', borderRadius: '4px', padding: '0.5rem', background: 'white' }}
          />
        </div>

        <div className="arch-grid">
          {[
            { name: 'Antentempel', desc: 'Einfachste Form: Kultraum (Naos/Cella) + Vorraum (Pronaos) mit zwei Säulen zwischen den Mauerenden (Anten).', beispiel: '' },
            { name: 'Prostylos', desc: 'Säulenhalle nur an der Vorderseite. Die Säulen stehen vor dem Pronaos.', beispiel: '' },
            { name: 'Amphiprostylos', desc: 'Säulenhallen an Vorder- und Rückseite des Tempels.', beispiel: '' },
            { name: 'Peripteros', desc: 'Vollständiger Säulenkranz (Peristasis) umgibt die Cella. Die Ringhalle heißt Pteron. Häufigste Form in Sizilien.', beispiel: 'Segesta, Agrigento (Concordia-Tempel)' },
            { name: 'Dipteros', desc: 'Doppelter Säulenkranz. Sehr aufwendig – nur für die bedeutendsten Heiligtümer.', beispiel: 'Artemision von Ephesus' },
            { name: 'Pseudodipteros', desc: 'Wirkt wie Dipteros, aber die innere Säulenreihe fehlt – mehr Raum in der Ringhalle.', beispiel: '' },
            { name: 'Tholos', desc: 'Runder Tempel mit kreisförmigem Säulenkranz und runder Cella.', beispiel: '' },
            { name: 'Monopteros', desc: 'Runder Säulenkranz ohne Cella – offener Pavillon-Typ.', beispiel: '' },
          ].map((t, i) => (
            <motion.div key={i} className="arch-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <h4>{t.name}</h4>
              <p>{t.desc}</p>
              {t.beispiel && <div className="arch-beispiel">📍 {t.beispiel}</div>}
            </motion.div>
          ))}
        </div>

        {/* Säulenordnungen */}
        <h3 className="arch-subtitle">Die drei Säulenordnungen</h3>
        <div className="arch-ordnungen">
          {([
            {
              name: 'Dorische Ordnung',
              color: '#8B6914',
              merkmale: ['Keine Basis – Säule steht direkt auf dem Stylobat', '16–20 Kanneluren mit scharfen Graten', 'Kapitell: Echinus (runder Wulst) + Abakus (Platte)', 'Fries: abwechselnd Triglyphen und Metopen', 'Wuchtig, schlicht, maskulin'],
              beispiel: 'Tempel in Segesta, Agrigento, Selinunte',
              slides: [
                { url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Doric_capital_-_Temple_of_Heracles_-_Agrigento_-_Italy_2015.JPG', label: 'Dorisches Kapitell – Heraklestempel, Agrigento' },
                { url: images.doricCol, label: 'Parthenon, Athen – Dorische Säulen' },
              ],
            },
            {
              name: 'Ionische Ordnung',
              color: '#2C5F8A',
              merkmale: ['Basis: Torus + Spira + Plinthe', '24 Kanneluren mit stumpfen Stegen', 'Kapitell: charakteristische Voluten (Schnecken)', 'Architrav in drei Fascien (Streifen) gegliedert', 'Schlank, elegant, weiblich'],
              beispiel: 'Häufig in Kleinasien; in Sizilien selten',
              slides: [
                { url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Ionic_capital_from_the_Erechtheum_at_the_British_Museum.jpg', label: 'Ionisches Kapitell – Erechtheion, Athen (British Museum)' },
                { url: images.ionicCol, label: 'Ionisches Volutenkapitell – Nahaufnahme' },
              ],
            },
            {
              name: 'Korinthische Ordnung',
              color: '#4A7A3A',
              merkmale: ['Wie ionisch, aber aufwendigeres Kapitell', 'Kapitell mit Akanthusblättern und Voluten-Bändern', 'Entwickelt ca. 420 v. Chr. in Korinth', 'Besonders prunkvoll und dekorativ', 'In römischer Architektur am beliebtesten'],
              beispiel: 'Spätantike Bauten; Pantheon Rom',
              slides: [
                { url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Corinthian_capital%2C_AM_of_Epidauros%2C_202545.jpg', label: 'Korinthisches Kapitell – Archäologisches Museum Epidauros' },
                { url: images.corinthianCol, label: 'Korinthische Säulen mit Akanthuskapitell' },
              ],
            },
          ] as OrdnungData[]).map((o, i) => <OrdnungCard key={i} o={o} />)}
        </div>

        {/* Detailschema */}
        <div className="arch-schema-detail">
          <h3 className="arch-subtitle">Detailschema der Säulenordnungen</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>Klicken zum Vergrößern – deutsches Übersichtsschema (1892)</p>
          <a href="https://upload.wikimedia.org/wikipedia/commons/5/53/Schema_Saeulenordnungen.jpg" target="_blank" rel="noopener noreferrer">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Schema_Saeulenordnungen.jpg"
              alt="Schema der Säulenordnungen – Dorisch, Ionisch, Korinthisch"
              loading="lazy"
              className="arch-schema-img"
            />
          </a>
        </div>

        {/* Aufbau des Tempels */}
        <h3 className="arch-subtitle">Aufbau eines dorischen Tempels</h3>
        <div className="arch-aufbau">
          {[
            { teil: 'Stereobat', desc: 'Unterer Stufenunterbau aus drei Stufen' },
            { teil: 'Krepis', desc: 'Stufenunterbau (= Stereobat)' },
            { teil: 'Stylobat', desc: 'Oberste Stufe – Standfläche der Säulen' },
            { teil: 'Säule', desc: 'Mit Kanneluren; dorisch ohne Basis, ionisch mit Basis' },
            { teil: 'Kapitell', desc: 'Echinus (runder Wulst) und Abakus (Deckplatte)' },
            { teil: 'Architrav', desc: 'Waagrechter Träger über den Säulen' },
            { teil: 'Fries', desc: 'Dorisch: Triglyphen + Metopen; ionisch: Bilderfries' },
            { teil: 'Geison', desc: 'Vorspringendes Kranzgesims' },
            { teil: 'Tympanon', desc: 'Dreieckiges Giebelfeld, oft mit Skulpturen' },
            { teil: 'Sima', desc: 'Dachrinne mit Wasserspeiern (Löwenköpfe)' },
            { teil: 'Akroter', desc: 'Schmuckelemente an den Giebelecken und -spitzen' },
          ].map((t, i) => (
            <div key={i} className="arch-aufbau-item">
              <span className="arch-aufbau-term">{t.teil}</span>
              <span className="arch-aufbau-desc">{t.desc}</span>
            </div>
          ))}
        </div>

        {/* Tempel-Aufbau Diagramme */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', margin: '1rem 0', alignItems: 'start' }}>
          <div className="arch-schema-detail" style={{ margin: 0 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '0.6rem' }}>Schema: Säulenbasis (Fundament – Krepis – Stylobat)</p>
            <img src="/sicily-trip/arch-saeulenbasis.svg" alt="Dorische Säulenbasis: Fundament, Krepis, Euthynterie, Stylobat" style={{ width: '100%', maxWidth: '320px', borderRadius: '8px', border: '1px solid var(--color-border)', background: '#fff', padding: '0.5rem' }} />
          </div>
          <div className="arch-schema-detail" style={{ margin: 0 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '0.6rem' }}>Klicken zum Vergrößern – Beschriftetes Schema: Kapitell, Gebälk und Giebel (Wikimedia Commons)</p>
            <a href="https://upload.wikimedia.org/wikipedia/commons/a/ae/Doric-order-labeled.jpg" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Doric-order-labeled.jpg" alt="Dorische Ordnung – vollständig beschriftet: Triglyphen, Metopen, Architrav, Kapitell, Echinus, Abakus" loading="lazy" className="arch-schema-img" />
            </a>
          </div>
        </div>

        {/* Dorischer Eckkonflikt */}
        <div className="arch-eckkonflikt">
          <div className="arch-eckkonflikt-img-wrap">
            <img src="/sicily-trip/detail-Segesta-Theater-Rekonstruktion.jpg" alt="Dorischer Eckkonflikt – Schema" loading="lazy" className="arch-eckkonflikt-img" />
          </div>
          <div className="arch-eckkonflikt-text">
            <h3 className="arch-eckkonflikt-title">Dorischer Eckkonflikt</h3>
            <p>Im Steinbau dorischer Ordnung wird damit das Problem bezeichnet, eine gleichmäßige, um die Ecke biegende Abfolge von Triglyphen und Metopen im Gebälk über der Säulenstellung zu bewirken. In der kanonischen dorischen Baustruktur lagert jede zweite Triglyphe mittig über einer Säule. Dies wird an der Ecke unrealisierbar, wo die Tiefe des auf den Kapitellen lagernden Architravs (a) die Breite einer Triglyphe übersteigt – entweder liegt der Architrav nicht mehr zentriert auf der Deckplatte des Eckkapitells auf, oder die Mitte der Ecktriglyphe rückt aus der Säulenachse nach außen.</p>
            <p>Der Eckkonflikt war in der Antike ein bekanntes, diskutiertes und am Ende ungelöstes Architekturproblem, das nach einer Aussage des Architekten Vitruv letztlich den Verzicht auf die dorische Bauordnung begründet haben soll. Die Art der Behandlung des Eckkonfliktes gibt Aufschluss über die chronologische und formgeschichtliche Einordnung eines Tempels. Als „Lösung" wurde im späten 6. Jh. vor allem die Verengung (Kontraktion) des Eckjoches entwickelt – auf Sizilien im Verlauf des 5. Jh. v. Chr. mit vielfältigen Kombinationen von Manipulationen der Friesmaße und der Säulenstellung.</p>
            <div className="arch-eckkonflikt-fachbegriffe">
              <span><strong>Normaljoch</strong> – Standardabstand zwischen zwei Säulen</span>
              <span><strong>Eckjoch</strong> – verkleinertes Joch an der Tempelecke</span>
              <span><strong>Triglyphe</strong> – senkrecht gerilltes Frieselement</span>
              <span><strong>Metope</strong> – glatte oder reliefierte Platte zwischen zwei Triglyphen</span>
            </div>
          </div>
        </div>

        {/* Kirchentypen */}
        <h3 className="arch-subtitle">Kirchentypen auf Sizilien</h3>
        <div className="arch-grid arch-grid-3">
          {[
            { name: 'Frühchristliche Basilika', desc: 'Längsgerichteter Bau mit Mittelschiff, zwei Seitenschiffen, Apsis. Vorbild: römische Gerichtsbasilika. Narthex (Vorhalle) und Exonarthex (äußere Vorhalle).', img: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Rom%2C_Basilika_Santa_Sabina%2C_Innenansicht.jpg' },
            { name: 'Byzantinische Kreuzkuppelkirche', desc: 'Griechisches Kreuz im Grundriss mit Zentralkuppel. Reiche Mosaikausstattung – typisch für normannisch-byzantinische Kirchen Siziliens.', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Chiesa_della_Martorana_Palermo_mosaico_Cristo.jpg' },
            { name: 'Normannischer Stil', desc: 'Verbindet arabische, byzantinische und romanische Elemente. Charakteristisch: Spitzbögen, Mosaikfußböden, Kuppeln. Hauptwerke: Monreale, Cappella Palatina, Cefalù.', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Cefalu_Cathedral_exterior_BW_2012-10-11_12-13-18.jpg' },
          ].map((k, i) => (
            <motion.div key={i} className="arch-card arch-card-church" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="arch-card-church-img">
                <img src={k.img} alt={k.name} loading="lazy" />
              </div>
              <h4>{k.name}</h4>
              <p>{k.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Gefäßformen */}
        <h3 className="arch-subtitle">Griechische Gefäßformen</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
          Die griechische Keramik gliedert sich nach Verwendungszweck in Vorrats-, Misch-, Schöpf-, Trink- und Salbgefäße. In den Museen Siziliens – vor allem im Museo Orsi (Siracusa) und im Archäologischen Museum Agrigento – zeugen prächtige Exemplare von hoher Töpferkunst der Kolonisten.
        </p>
        <div className="arch-grid arch-grid-3">
          {([
            { name: 'Amphore', greek: 'ἀμφορεύς · amphoreús', zweck: 'Vorratsgefäß', desc: 'Zweihenkelig, eiförmiger Bauch, enger Hals. Für Wein, Öl und Honig. Die Panathenäische Preisamphore wurde als Wettkampfpreis überreicht. Häufigste Keramikform in sizilianischen Museen.', museum: 'Museo Orsi Siracusa · Museo Agrigento', img: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Amphorae_retouched.jpg' },
            { name: 'Hydria', greek: 'ὑδρία · hydrίa', zweck: 'Wassergefäß', desc: 'Dreihenkelig: zwei waagrechte Traghenkel, ein senkrechter Ausgusshenkel. Zum Wassertransport vom Brunnen; Frauen beim Füllen der Hydria ist häufiges Bildthema.', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Hydria_Hermonax_Rhodes.jpg' },
            { name: 'Krater', greek: 'κρατήρ · kratḗr', zweck: 'Mischgefäß', desc: 'Großes offenes Gefäß für das Mischen von Wein und Wasser beim Symposion. Typen: Volutenkrater (Voluten am Hals), Glockenkrater, Kolonettenkrater, Kelchkrater. In Magna Graecia besonders beliebt.', museum: 'Museo Orsi Siracusa · Museo Agrigento', img: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Bell-krater_rider_Louvre_G493.jpg' },
            { name: 'Kylix', greek: 'κύλιξ · kýlix', zweck: 'Trinkschale', desc: 'Flache Trinkschale mit zwei waagrechten Henkeln und langem Stiel. Das Innenmedaillon (Tondo) trägt mythologische Bilder. Beim Symposion auch für das Kottabos-Wurfspiel verwendet.', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Kylix_61.7_with_Helen_and_Hermes%2C_ca._420_BC%2C_part_of_the_Vassil_Bojkov_collection%2C_Sofia%2C_Bulgaria.png' },
            { name: 'Lekythos', greek: 'λήκυθος · lḗkythos', zweck: 'Öl- / Grabgefäß', desc: 'Schlanke Ölflasche mit engem Hals. Weißgrundige Lekythen mit polychromer Bemalung wurden ausschließlich als Grabbeigaben verwendet; häufig in Nekropolen Siziliens gefunden.', museum: 'Museo Orsi Siracusa', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Apollonia_Painter_-_Red-Figure_%22Kerch%22-Style_Lekythos_-_Walters_4884_-_Right.jpg' },
            { name: 'Oinochoe', greek: 'οἰνοχόη · oinochóē', zweck: 'Weinkanne', desc: 'Weinkrug mit einem Henkel, oft Kleeblatt-Mündung (trilobos). Diente zum Einschenken beim Symposion. Varianten: Olpe (schlank), Chus (bauchig, für das Choen-Fest der Kinder).', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Oinoche_Camiros_fantastic_Louvre_A318.jpg' },
            { name: 'Skyphos', greek: 'σκύφος · skýphos', zweck: 'Trinkbecher', desc: 'Tiefer Trinkbecher mit zwei waagrechten Henkeln. Alltägliches Trinkgefäß; mit Herakles assoziiert. Variante Kotyle: mit hohem Fuß.', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Skyphos_Boscoreale_Louvre_Bj2367.jpg' },
            { name: 'Stamnos', greek: 'σταμνός · stamnós', zweck: 'Vorratsgefäß', desc: 'Breites Vorratsgefäß mit kurzem Hals und zwei waagrechten Henkeln. Für Wein; seltener als Amphore. Beim Kottabos-Spiel beliebt.', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Stamnos_tripod_Louvre_G180.jpg' },
            { name: 'Pelike', greek: 'πελίκη · pelíkē', zweck: 'Vorratsgefäß', desc: 'Variante der Amphore mit tieferem Schwerpunkt – bauchiger nach unten. Zwei senkrechte Henkel. Häufig für rotfigurige Darstellungen gewählt.', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Pelike_woman_youth_BM_F316.jpg' },
          ] as { name: string; greek: string; zweck: string; desc: string; museum: string; img: string }[]).map((v, i) => (
            <motion.div key={i} className="arch-card arch-card-church" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="arch-card-church-img arch-card-vessel-img">
                <img src={v.img} alt={v.name} loading="lazy" />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                <h4 style={{ margin: 0 }}>{v.name}</h4>
                <span className="arch-gefaesse-zweck">{v.zweck}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '0.4rem' }}>{v.greek}</div>
              <p>{v.desc}</p>
              {v.museum && <div className="arch-beispiel">📍 {v.museum}</div>}
            </motion.div>
          ))}
        </div>

        {/* Dekorstile */}
        <h3 className="arch-subtitle">Dekorstile der griechischen Vasenmalerei</h3>
        <div className="arch-grid arch-grid-3">
          {([
            { name: 'Schwarzfigurig', zeit: 'ca. 700–480 v. Chr.', desc: 'Figuren in schwarzem Firnis auf rotem Tongrund. Details durch Einritzen (Sgraffito) gearbeitet; weißer Schlicker für Frauenhaut. Entstanden in Korinth und Athen. In Sizilien häufig als Grabbeigabe.', img: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Herakles_Geryon_Staatliche_Antikensammlungen_1379.jpg' },
            { name: 'Rotfigurig', zeit: 'ab ca. 530 v. Chr.', desc: 'Figuren bleiben im Tonrot, Hintergrund schwarz gefirnisst. Körperdetails mit dem Pinsel frei gemalt – ermöglicht naturalistischere Zeichnung. Technik erfunden in Athen, schnell die führende Bildsprache.', img: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Cup_Apatouria_Louvre_G138.jpg' },
            { name: 'Weißgrundig', zeit: 'ab ca. 500 v. Chr.', desc: 'Weißer Kalkschlicker als Grundierung, darüber polychrome Bemalung. Sehr fragil – fast ausschließlich für Lekythen als Grabbeigaben. Erlaubt feine Farbpalette; Totenklage und Abschiedsszenen sind typische Themen.', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Loutrophoros_Louvre_CA1960.jpg' },
          ] as { name: string; zeit: string; desc: string; img: string }[]).map((d, i) => (
            <motion.div key={i} className="arch-card arch-card-church" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="arch-card-church-img">
                <img src={d.img} alt={d.name} loading="lazy" />
              </div>
              <h4>{d.name}</h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-gold)', marginBottom: '0.4rem' }}>{d.zeit}</div>
              <p>{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Flora & Fauna */}
      <section className="section" id="natur">
        <div className="section-header">
          <h2>🌿 Flora &amp; Fauna</h2>
          <div className="section-divider" />
          <p>Die Natur Siziliens – zwischen Mittelmeer, Ätna und afrikanischem Klima</p>
        </div>

        {/* Flora */}
        <h3 className="arch-subtitle">🌱 Markante Pflanzen Siziliens</h3>
        <div className="arch-grid arch-grid-3">
          {([
            {
              name: 'Ficodindia', lat: 'Opuntia ficus-indica',
              badge: 'flora', ort: 'Überall auf Sizilien',
              desc: 'Der Feigenkaktus ist das bekannteste Symbol der sizilianischen Landschaft. Seine leuchtend roten, gelben oder weißen Früchte prägen jeden Straßenrand und jede Steinmauer. Ursprünglich aus Mexiko, ist er seit dem 16. Jh. allgegenwärtig – und aus der sizilianischen Küche nicht wegzudenken.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Opuntia_ficus-indica1.jpg/400px-Opuntia_ficus-indica1.jpg',
            },
            {
              name: 'Blutorange', lat: 'Citrus sinensis „Tarocco" / „Moro"',
              badge: 'flora', ort: '📍 Ätna-Tiefebene (Tag 4/5)',
              desc: 'Die berühmteste sizilianische Frucht wächst fast ausschließlich in der Ätna-Tiefebene. Der tiefe Rotton (Anthocyan) entsteht durch nächtliche Kältereize – ein einzigartiges Mikroklima am Fuß des Vulkans. Sorten: Tarocco (mild-süß), Moro (intensiv rot) und Sanguinello.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Blood_oranges.jpg/400px-Blood_oranges.jpg',
              tipp: true,
            },
            {
              name: 'Papyrus', lat: 'Cyperus papyrus',
              badge: 'flora', ort: '📍 Fluss Ciane, Siracusa (Tag 3/4)',
              desc: 'Am Fluss Ciane bei Siracusa wächst das nördlichste natürliche Papyrusvorkommen der Welt außerhalb Afrikas. Die bis zu 4 m hohen Stauden wurden schon in der Antike zur Papierherstellung genutzt. Eine Bootsfahrt auf dem Ciane lohnt sehr.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Cyperus_papyrus_kz1.jpg/400px-Cyperus_papyrus_kz1.jpg',
              tipp: true,
            },
            {
              name: 'Zwerpalme', lat: 'Chamaerops humilis',
              badge: 'flora', ort: 'West- und Südküste',
              desc: 'Die einzige indigene Palme Europas: Diese niedrige, buschige Palme wächst wild in sizilianischen Macchie-Landschaften, vor allem im Westen. Sie überlebt extremen Trockenstress und gilt als Symbol der Resistenz. Im Frühjahr trägt sie gelbe Blütenrispen.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Chamaerops_humilis_2.jpg/400px-Chamaerops_humilis_2.jpg',
            },
            {
              name: 'Pistazie aus Bronte', lat: 'Pistacia vera',
              badge: 'flora', ort: '📍 Bronte / Ätna-Westhang (Tag 5)',
              desc: 'Auf dem Lavaboden des Ätna-Westhangs gedeihen die berühmtesten Pistazien der Welt. Das vulkanische Gestein verleiht ihnen ein intensiv grünes Fleisch und ein nussig-süßes Aroma. Die Ernte erfolgt alle zwei Jahre im September. Bronte nennt sich stolz „Capitale del Pistacchio".',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Pistachio_Bronte_2.jpg/400px-Pistachio_Bronte_2.jpg',
              tipp: true,
            },
            {
              name: 'Kapernstrauch', lat: 'Capparis spinosa',
              badge: 'flora', ort: 'Felsen & Mauern, Pantelleria',
              desc: 'Der Kapernstrauch wächst aus den kleinsten Gesteinsspalten und ist eine botanische Meisterleistung der Trockenresistenz. Die getrockneten Blütenknospen (Kapern) sind eine unverzichtbare Zutat der sizilianischen Küche – ob in der Caponata, auf der Pizza oder in Pasta puttanesca.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Caper_bush.jpg/400px-Caper_bush.jpg',
            },
            {
              name: 'Johannisbrotbaum', lat: 'Ceratonia siliqua',
              badge: 'flora', ort: 'Süd- und Westküste',
              desc: 'Der „Carrubo" kann über 500 Jahre alt werden und ist an der sizilianischen Südküste weit verbreitet. Seine schokoladenbraunen Hülsen (Karobe) galten in der Antike als Nahrung für Arme – und als Gewichte für Goldschmiede (daraus entstand der Begriff „Karat").',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Ceratonia_siliqua_fruits.jpg/400px-Ceratonia_siliqua_fruits.jpg',
            },
            {
              name: 'Mandel', lat: 'Prunus dulcis',
              badge: 'flora', ort: 'Agrigento-Region (Tag 2/3)',
              desc: 'Sizilien ist einer der größten Mandelerzeuger Europas. Spektakulär ist die Blüte im Februar und März – dann leuchten die Hänge um Agrigento und Selinunte in zartem Weiß und Rosa, noch bevor das Laub austreibt. Das Mandelblütenfest in Agrigento ist weltberühmt.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Almonds_Flickr.jpg/400px-Almonds_Flickr.jpg',
              tipp: true,
            },
            {
              name: 'Ätna-Birke', lat: 'Betula aetnensis',
              badge: 'flora', ort: '📍 Ätna ab 1.400 m (Tag 5)',
              desc: 'Diese endemische Birkenart wächst ausschließlich am Ätna oberhalb von 1.400 m – eine der seltensten Baum-Endemiten Europas. Auf der Auffahrt zum Ätna bildet sie lichte Wälder mit Lärchengebüsch. Im Herbst färbt sie sich goldgelb – ein surrealer Anblick neben schwarzem Lavafeld.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Betula_pendula_Roth_8.jpg/400px-Betula_pendula_Roth_8.jpg',
              tipp: true,
            },
          ] as { name: string; lat: string; badge: string; ort: string; desc: string; img: string; tipp?: boolean }[]).map((p, i) => (
            <motion.div key={i} className="arch-card arch-card-church" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="arch-card-church-img">
                <img src={p.img} alt={p.name} loading="lazy" className="arch-card-natur-img" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.1rem' }}>
                <span className="natur-badge natur-badge-flora">Pflanze</span>
                {p.tipp && <span className="natur-badge natur-badge-tipp">🗺 Route-Tipp</span>}
              </div>
              <div className="natur-lat">{p.lat}</div>
              <h4 style={{ margin: '0 0 0.3rem 0' }}>{p.name}</h4>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>{p.desc}</p>
              <div className="arch-beispiel" style={{ marginTop: '0.4rem' }}>📍 {p.ort}</div>
            </motion.div>
          ))}
        </div>

        {/* Meerestiere */}
        <h3 className="arch-subtitle" style={{ marginTop: '2rem' }}>🌊 Tiere – Meer</h3>
        <div className="arch-grid arch-grid-3">
          {([
            {
              name: 'Roter Thunfisch', lat: 'Thunnus thynnus',
              ort: 'Tyrrhenisches Meer & Sizilienkanal',
              desc: 'Der Bluefin-Thunfisch ist eng mit Siziliens Geschichte verwoben. Jahrhundertelang betrieben die Küstenbewohner die rituelle Mattanza – eine Treibjagd mit Netzen, bei der die Thunfische in ein Labyrinth aus Kammern gelenkt wurden. Heute ist die Mattanza verschwunden, der Thunfisch aber bleibt kulinarisches Herzstück.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Pacific_bluefin_tuna.jpg/400px-Pacific_bluefin_tuna.jpg',
            },
            {
              name: 'Schwertfisch', lat: 'Xiphias gladius',
              ort: '📍 Meerenge von Messina (Tag 6)',
              desc: 'In der Meerenge von Messina kreuzen sich warme und kühle Meeresströmungen – ideale Bedingungen für den Schwertfisch. Fischer auf der Feluke, einem hohen Ausguckmast, erspähen die Tiere von weitem. Pesce spada alla messinese (mit Kapern, Oliven, Tomaten) ist ein Klassiker der Straßenküche.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Swordfish_breaching.jpg/400px-Swordfish_breaching.jpg',
              tipp: true,
            },
            {
              name: 'Unechte Karettschildkröte', lat: 'Caretta caretta',
              ort: 'Südstrände (Vendicari, Linosa)',
              desc: 'Siziliens Südstrände sind wichtige Nistplätze dieser bedrohten Meeresschildkröte. Die Weibchen kommen im Sommer (Juni–August) nachts an Land und legen bis zu 120 Eier. Das Naturreservat Vendicari (bei Noto) ist ein gesichertes Schutzgebiet – auf Ihrer Route am Tag 3!',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Caretta_caretta_01.jpg/400px-Caretta_caretta_01.jpg',
              tipp: true,
            },
            {
              name: 'Pottwal', lat: 'Physeter macrocephalus',
              ort: 'Tyrrhenisches Meer / Ionisches Meer',
              desc: 'Der Pottwal taucht regelmäßig in den tiefen Gewässern rund um Sizilien auf – vor allem im Tyrrhenischen Meer und der Straße von Messina. Die bis zu 18 m langen Tiere tauchen auf der Jagd nach Tintenfischen in Tiefen von über 1.000 m. Walbeobachtungstouren werden von Milazzo aus angeboten.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Sperm-whale2.jpg/400px-Sperm-whale2.jpg',
            },
            {
              name: 'Großer Tümmler', lat: 'Tursiops truncatus',
              ort: 'Küstengewässer, v.a. Nordküste',
              desc: 'Delfine sind in sizilianischen Gewässern häufig anzutreffen – oft begleiten sie Fähren oder spielen in der Bugwelle von Schiffen. Vor allem entlang der Nordküste (zwischen Cefalù und Palermo) sowie rund um die Äolischen Inseln sind Sichtungen von Bord aus keine Seltenheit.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/400px-Tursiops_truncatus_01.jpg',
              tipp: true,
            },
          ] as { name: string; lat: string; ort: string; desc: string; img: string; tipp?: boolean }[]).map((t, i) => (
            <motion.div key={i} className="arch-card arch-card-church" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="arch-card-church-img">
                <img src={t.img} alt={t.name} loading="lazy" className="arch-card-natur-img" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.1rem' }}>
                <span className="natur-badge natur-badge-fauna">Meerestier</span>
                {t.tipp && <span className="natur-badge natur-badge-tipp">🗺 Route-Tipp</span>}
              </div>
              <div className="natur-lat">{t.lat}</div>
              <h4 style={{ margin: '0 0 0.3rem 0' }}>{t.name}</h4>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>{t.desc}</p>
              <div className="arch-beispiel" style={{ marginTop: '0.4rem' }}>📍 {t.ort}</div>
            </motion.div>
          ))}
        </div>

        {/* Vögel & Landtiere */}
        <h3 className="arch-subtitle" style={{ marginTop: '2rem' }}>🦅 Tiere – Vögel &amp; Land</h3>
        <div className="arch-grid arch-grid-3">
          {([
            {
              name: 'Eleonorenfalke', lat: 'Falco eleonorae',
              ort: 'Küstenfelsen, Marettimo, Ustica',
              desc: 'Einer der elegantesten Zugvögel Europas: Der Eleonorenfalke brütet ausschließlich auf Inseln und Küstenfelsen des Mittelmeers – und synchronisiert seine Brut mit dem Herbstzug der Singvögel, um seine Jungen mit frischer Beute zu versorgen. Im Winter zieht er nach Madagaskar. Benannt nach Eleonore d'Arborea, der sardinischen Fürstin.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Falco_eleonorae_-Majorca%2C_Spain-8.jpg/400px-Falco_eleonorae_-Majorca%2C_Spain-8.jpg',
            },
            {
              name: 'Rosaflamingo', lat: 'Phoenicopterus roseus',
              ort: '📍 Naturreservat Vendicari (Tag 3)',
              desc: 'Das Naturreservat Vendicari an der Südostküste Siziliens – direkt auf Ihrer Route zwischen Noto und Siracusa – ist ein bedeutender Rastplatz für Flamingos und Zugvögel. Bis zu 200 Flamingos überwintern hier in den flachen Lagunen. Der kurze Umweg lohnt sich sehr.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Greater_flamingo_Phoenicopterus_roseus_in_Camargue.jpg/400px-Greater_flamingo_Phoenicopterus_roseus_in_Camargue.jpg',
              tipp: true,
            },
            {
              name: 'Sizilianische Mauereidechse', lat: 'Podarcis waglerianus',
              ort: 'Steinmauern & Ruinen überall',
              desc: 'Diese endemische Eidechse ist an jedem antiken Steinmauerwerk zu finden – in Selinunte, Agrigento oder Syrakus huschen sie flink über die Tempelruinen. Das Männchen hat einen charakteristisch blauen Fleck hinter den Vorderbeinen. Die Art ist nur auf Sizilien und einigen vorgelagerten Inseln heimisch.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Podarcis_sicula_male.jpg/400px-Podarcis_sicula_male.jpg',
            },
            {
              name: 'Stachelschwein', lat: 'Hystrix cristata',
              ort: 'Landesinnere, nachtaktiv',
              desc: 'Das Stachelschwein ist das größte Nagetier Siziliens und streng nachtaktiv. Mit etwas Glück findet man morgens seine langen Stacheln (bis 35 cm) am Wegesrand. Es ist überraschend laut – beim Schütteln seiner Stacheln erzeugt es ein weithin hörbares Rasseln als Warnsignal.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Hystrix_cristata_qtl1.jpg/400px-Hystrix_cristata_qtl1.jpg',
            },
            {
              name: 'Sizilien als Vogelzug-Drehscheibe', lat: 'Via migratoria del Mediterraneo',
              ort: 'Gesamte Insel, März–April optimal',
              desc: 'Sizilien liegt auf einem der wichtigsten Vogelzugrouten Europas. Im Frühjahr (März/April – genau Ihre Reisezeit!) rasten Millionen von Zugvögeln auf der Insel, bevor sie das Mittelmeer überqueren: Weihen, Bussarde, Milane, Störche und unzählige Singvögel. Naturreservate wie Vendicari, Lo Zingaro und Lago di Pergusa sind Hotspots.',
              img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Ciconia_ciconia_-Archena%2C_Murcia%2C_Spain-8.jpg/400px-Ciconia_ciconia_-Archena%2C_Murcia%2C_Spain-8.jpg',
              tipp: true,
            },
          ] as { name: string; lat: string; ort: string; desc: string; img: string; tipp?: boolean }[]).map((v, i) => (
            <motion.div key={i} className="arch-card arch-card-church" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="arch-card-church-img">
                <img src={v.img} alt={v.name} loading="lazy" className="arch-card-natur-img" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.1rem' }}>
                <span className="natur-badge natur-badge-fauna">Tier</span>
                {v.tipp && <span className="natur-badge natur-badge-tipp">🗺 Route-Tipp</span>}
              </div>
              <div className="natur-lat">{v.lat}</div>
              <h4 style={{ margin: '0 0 0.3rem 0' }}>{v.name}</h4>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>{v.desc}</p>
              <div className="arch-beispiel" style={{ marginTop: '0.4rem' }}>📍 {v.ort}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Zeittafel */}
      <section className="section" id="zeittafel">
        <div className="section-header">
          <h2><Clock size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Zeittafel Sizilien</h2>
          <div className="section-divider" />
          <p>Von der Vorgeschichte bis zur Gegenwart – drei Jahrtausende Geschichte</p>
        </div>
        <div className="timeline">
          {zeittafelDaten.map((epoche, ei) => (
            <div key={ei} className="timeline-epoche">
              <div className="timeline-epoche-header" style={{ borderLeftColor: epoche.farbe }}>
                <h3 style={{ color: epoche.farbe }}>{epoche.epoche}</h3>
                <span className="timeline-epoche-zeitraum">{epoche.zeitraum}</span>
              </div>
              <div className="timeline-ereignisse">
                {epoche.ereignisse.map((e, i) => (
                  <motion.div key={i} className="timeline-item" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <div className="timeline-dot" style={{ background: epoche.farbe }} />
                    <div className="timeline-content">
                      <span className="timeline-datum" style={{ color: epoche.farbe }}>{e.datum}</span>
                      <p className="timeline-text">{e.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Persönlichkeiten */}
      <section className="section" id="personen">
        <div className="section-header">
          <h2><Users size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Berühmte Persönlichkeiten</h2>
          <div className="section-divider" />
          <p>Herausragende Menschen, die Siziliens Geschichte und Kultur geprägt haben</p>
        </div>
        <div className="personen-grid">
          {personenDaten.map((p, i) => (
            <motion.div key={i} className={`person-card${expandedPerson === i ? ' person-card-open' : ''}`} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="person-card-header person-card-clickable" style={{ borderColor: p.farbe }} onClick={() => setExpandedPerson(expandedPerson === i ? null : i)}>
                <div className="person-name-block">
                  <h3 className="person-name">{p.name}</h3>
                  <span className="person-lebensdaten" style={{ color: p.farbe }}>{p.lebensdaten}</span>
                </div>
                <div className="person-header-right">
                  <span className="person-kategorie" style={{ background: p.farbe }}>{p.kategorie}</span>
                  {expandedPerson === i ? <ChevronUp size={16} style={{ color: p.farbe, flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: p.farbe, flexShrink: 0 }} />}
                </div>
              </div>
              <AnimatePresence>
                {expandedPerson === i && (
                  <motion.div className="person-card-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <p className="person-beschreibung">{p.beschreibung}</p>
                    <div className="person-herkunft"><MapPin size={13} /> {p.herkunft}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section" id="glossar">
        <div className="section-header">
          <h2><Languages size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Italienisches Glossar</h2>
          <div className="section-divider" />
          <p>Die wichtigsten Wörter und Redewendungen für unterwegs</p>
        </div>

        <div className="glossary-toggle">
          <button
            className={`glossary-toggle-btn${glossarRichtung === 'it-de' ? ' active' : ''}`}
            onClick={() => setGlossarRichtung('it-de')}
          >🇮🇹 Italienisch → Deutsch</button>
          <button
            className={`glossary-toggle-btn${glossarRichtung === 'de-it' ? ' active' : ''}`}
            onClick={() => setGlossarRichtung('de-it')}
          >🇩🇪 Deutsch → Italienisch</button>
        </div>

        <div className="glossary-categories">
          {glossaryByCategory.map(cat => {
            const isOpen = glossarOpenCats.includes(cat.category)
            const toggle = () => setGlossarOpenCats(prev =>
              isOpen ? prev.filter(c => c !== cat.category) : [...prev, cat.category]
            )
            const sorted = [...cat.entries].sort((a, b) =>
              glossarRichtung === 'it-de'
                ? a.it.localeCompare(b.it, 'it')
                : a.de.localeCompare(b.de, 'de')
            )
            return (
              <div key={cat.category} className="glossary-category">
                <button className="glossary-cat-header" onClick={toggle}>
                  <span>{cat.category}</span>
                  <span className="glossary-cat-arrow">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="glossary-grid">
                    {sorted.map((g, i) => (
                      <div key={i} className="glossary-item">
                        <span className="glossary-italian">
                          {glossarRichtung === 'it-de' ? g.it : g.de}
                        </span>
                        <span className="glossary-german">
                          {glossarRichtung === 'it-de' ? g.de : g.it}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Karten & Pläne */}
      <section className="section" id="karten">
        <div className="container">
          <h2><Map size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Karten &amp; Pläne</h2>
          <div className="karten-grid">
            {[
              { title: 'Sizilien – Übersichtskarte', desc: 'DuMont Reisekarte Sizilien mit allen wichtigen Reisezielen und Straßen', icon: 'sizilien', url: '/sicily-trip/Karte-Sizilien-DuMont.pdf' },
              { title: 'Antike Städte Siziliens', desc: 'Karte der wichtigsten antiken Stätten und griechisch-römischen Siedlungen', icon: 'antike', url: '/sicily-trip/Karte-antike-Staedte.pdf' },
              { title: 'Palermo – Stadtplan', desc: 'Detaillierter Stadtplan von Palermo mit Sehenswürdigkeiten', icon: 'palermo', url: '/sicily-trip/Karte-Palermo.pdf' },
              { title: 'Palermo – DuMont Stadtplan', desc: 'DuMont Stadtplan Palermo mit Altstadtvierteln und Hauptattraktionen', icon: 'palermoDumont', url: '/sicily-trip/Karte-Palermo-DuMont.pdf' },
            ].map(k => (
              <a key={k.url} href={k.url} target="_blank" rel="noopener noreferrer" className="karten-card">
                <div className="karten-card-icon"><FileText size={40} /></div>
                <div className="karten-card-body">
                  <div className="karten-card-title">{k.title}</div>
                  <div className="karten-card-desc">{k.desc}</div>
                </div>
                <div className="karten-card-open"><ExternalLink size={16} /> Öffnen</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Sizilien Kulturreise 2026</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>28. März – 4. April 2026</p>
      </footer>
    </div>
  )
}

export default App
