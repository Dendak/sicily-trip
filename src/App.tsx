import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Hotel, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Menu, X, UtensilsCrossed, BookOpen, Languages, Landmark, Navigation, ExternalLink, Info } from 'lucide-react'
import './App.css'

// Verified working Unsplash image URLs
const images = {
  hero: 'https://images.unsplash.com/photo-1523365280197-f1783db9fe62?w=1920&q=80',
  segesta: 'https://images.unsplash.com/photo-1605896801461-267e172a3759?w=800&q=80',
  erice: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  marsala: 'https://images.unsplash.com/photo-1686149501751-23d7698bd862?w=800&q=80',
  selinunte: 'https://images.unsplash.com/photo-1610547189313-1fbea2dcd059?w=800&q=80',
  agrigento: 'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?w=800&q=80',
  piazzaArmerina: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=800&q=80',
  noto: 'https://images.unsplash.com/photo-1512119384946-808e3d503064?w=800&q=80',
  siracusa: 'https://images.unsplash.com/photo-1753541723153-377729c7e05c?w=800&q=80',
  catania: 'https://images.unsplash.com/photo-1641286894787-4a2a97a1e34a?w=800&q=80',
  taormina: 'https://images.unsplash.com/photo-1750145417286-2c2fe29509d6?w=800&q=80',
  etna: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  cefalu: 'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=800&q=80',
  palermo: 'https://images.unsplash.com/photo-1553901753-215db344677a?w=800&q=80',
  monreale: 'https://images.unsplash.com/photo-1561729730-bdbcce4cb15b?w=800&q=80',
  villaRomanaTellaro: 'https://images.unsplash.com/photo-1761495438507-33d43cedd55c?w=800&q=80',
  scalaDeiTurchi: 'https://images.unsplash.com/photo-1627125337399-8938c4d0a0c0?w=800&q=80',
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

// Detailed sight information database
const sightDetails: Record<string, { summary: string; detail: string; wikipedia?: string; planUrl?: string; facts?: string[] }> = {
  'Segesta': {
    summary: 'Bedeutende Stadt der Elymer im Nordwesten Siziliens mit einem der besterhaltenen dorischen Tempel Europas.',
    detail: 'Segesta wurde im 7. Jh. v. Chr. von den Elymern gegründet, die sich auf trojanische Vorfahren beriefen. Der dorische Tempel (ca. 420 v. Chr.) misst 26 × 61 Meter mit 36 Säulen aus Travertin. Besonderheit: Die Säulen wurden nie kanneliert und die Cella fehlt – der Tempel wurde vermutlich nie vollendet. Das griechische Theater (3. Jh. v. Chr.) wurde unter Hieron II. in den Monte Barbaro gehauen. Mit 63 m Durchmesser bietet es 4.000 Zuschauern Platz und einen spektakulären Blick auf den Golf von Castellammare. Die Akustik ist hervorragend – ein Flüstern im Zentrum ist in den obersten Reihen hörbar.',
    wikipedia: 'https://en.wikipedia.org/wiki/Segesta',
    planUrl: 'https://en.wikipedia.org/wiki/Temple_of_Segesta#/media/File:Segesta_Temple.jpg',
    facts: ['Ca. 420 v. Chr. (Tempel)', '36 dorische Säulen', 'Nie fertiggestellt', 'Theater: 4.000 Plätze']
  },
  'Monte Érice': {
    summary: 'Mittelalterliche Bergstadt auf 750 m Höhe mit phönizisch-griechischen Wurzeln und normannischer Burg.',
    detail: 'Érice thront auf dem gleichnamigen Berg (751 m) an der Westspitze Siziliens. Bereits die Phönizier errichteten hier ein Heiligtum der Astarte, das die Griechen als Tempel der Aphrodite Erycina übernahmen – eines der bedeutendsten Aphrodite-Heiligtümer der antiken Welt. Die Normannen bauten im 12. Jh. das Castello di Venere (Venusburg) über den Resten des antiken Tempels. Die mittelalterliche Altstadt mit kopfsteingepflasterten Gassen, gotischen Kirchen und dem berühmten Pasticceria Maria Grammatico (legendäre Mandelgebäck-Tradition der Klosterschwestern) ist nahezu vollständig erhalten.',
    wikipedia: 'https://en.wikipedia.org/wiki/Erice',
    facts: ['751 m Höhe', 'Antikes Aphrodite-Heiligtum', 'Normannisches Castello di Venere', 'Ca. 500 Einwohner']
  },
  'Trapani': {
    summary: 'Hafenstadt an der Westspitze Siziliens mit barockem Stadtkern und lebhafter Altstadt.',
    detail: `Trapani (griech. Drepanon, „Sichel") verdankt seinen Namen der sichelförmigen Landzunge. Die Stadt war ein wichtiger punischer Hafen und Schauplatz der Seeschlacht von Drepana (249 v. Chr.) im Ersten Punischen Krieg. Die Altstadt besticht durch barocke Kirchen (Chiesa del Purgatorio, Cattedrale di San Lorenzo), den lebhaften Fischmarkt und die arabisch beeinflusste Architektur. Berühmt sind die Prozessionen der Misteri am Karfreitag – 20 lebensgroße Figurengruppen aus dem 17./18. Jh.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Trapani',
    facts: ['Gegründet: 8. Jh. v. Chr.', 'Seeschlacht 249 v. Chr.', 'Misteri-Prozessionen (Karfreitag)', 'Tor zu den Ägadischen Inseln']
  },
  'Marsala': {
    summary: 'Berühmt für den gleichnamigen Wein und das im Museum ausgestellte punische Kriegsschiff.',
    detail: `Marsala (arab. Marsa Allah, „Hafen Gottes") ist die westlichste Stadt Siziliens. Im archäologischen Museum Baglio Anselmi befindet sich ein einzigartiges punisches Langschiff (Lilybaeum Ship) aus dem 3. Jh. v. Chr. – eines der wenigen erhaltenen Kriegsschiffe der Antike. 1860 landete Giuseppe Garibaldi hier mit seinen „Tausend" (Spedizione dei Mille). Die Altstadt mit dem Barockdom und den Salzstraßen (Via del Sale) mit ihren Windmühlen und Salzbergen bietet ein einzigartiges Landschaftsbild.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Marsala',
    facts: ['Arab. Gründung: 8. Jh.', 'Punisches Schiff (3. Jh. v. Chr.)', 'Garibaldis Landung 1860', 'Berühmter Marsala-Wein']
  },
  'Cave di Cusa': {
    summary: 'Antiker Steinbruch, aus dem die Tempel von Selinunt erbaut wurden – Säulentrommeln liegen noch in situ.',
    detail: 'Die Cave di Cusa sind ein antiker Kalksteinbruch, der die Tempel von Selinunt mit Baumaterial versorgte. Die Arbeiten wurden 409 v. Chr. abrupt abgebrochen, als die Karthager Selinunt zerstörten. Faszinierend sind die in verschiedenen Bearbeitungsstadien zurückgelassenen Säulentrommeln – vom ersten Rohschnitt bis zur fast fertigen Trommel. Man kann den gesamten antiken Produktionsprozess nachvollziehen: Einritzen der kreisförmigen Umrisse, Herauslösen der Trommeln, Transport auf Holzschlitten.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cave_di_Cusa',
    facts: ['Lieferant für Selinunts Tempel', 'Aufgegeben 409 v. Chr.', 'Säulentrommeln in situ', 'Freier Eintritt']
  },
  'Selinunte': {
    summary: 'Größter archäologischer Park Europas mit einer der bedeutendsten griechischen Tempelanlagen.',
    detail: 'Selinunt (griech. Selinus) wurde 628 v. Chr. als Kolonie von Megara Hyblaea gegründet und war die westlichste griechische Stadt Siziliens. Der archäologische Park umfasst über 270 Hektar mit acht monumentalen Tempeln (mit Buchstaben A–G und O bezeichnet). Der Tempel E (Hera-Tempel, 5. Jh. v. Chr.) wurde teilweise wiederaufgerichtet und ist der am besten erhaltene. Auf der Akropolis stehen die Reste der Tempel A, C, D und O. Der kolossale Tempel G (Zeus/Apollo) war einer der größten griechischen Tempel überhaupt (113 × 54 m). 409 v. Chr. wurde die Stadt von den Karthagern unter Hannibal Mago zerstört.',
    wikipedia: 'https://en.wikipedia.org/wiki/Selinunte',
    planUrl: 'https://en.wikipedia.org/wiki/Selinunte#/media/File:Selinunte_map-en.svg',
    facts: ['Gegründet: 628 v. Chr.', '8 monumentale Tempel', 'Akropolis + Ostterrasse', 'Zerstört: 409 v. Chr.', 'UNESCO-Kandidat']
  },
  'Scala dei Turchi': {
    summary: 'Spektakuläre weiße Kalksteinklippen an der Südküste – ein Naturwunder.',
    detail: `Die Scala dei Turchi („Türkentreppe") bei Realmonte ist eine atemberaubende Formation aus blendend weißem Mergel-Kalkstein (Marna), der durch Wind und Wellen zu einer natürlichen Treppe geformt wurde. Der Name erinnert an die Sarazenen- und Türkenüberfälle des 16. Jh., die hier an der glatten Felswand anlandeten. Das Naturdenkmal kontrastiert spektakulär mit dem türkisblauen Meer und dem goldenen Sand.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Scala_dei_Turchi',
    facts: ['Weißer Mergel-Kalkstein', 'Naturdenkmal', 'Nahe Agrigento', 'Freier Zugang']
  },
  'Agrigento': {
    summary: `Das „Tal der Tempel" – eine der bedeutendsten archäologischen Stätten der Welt (UNESCO).`,
    detail: 'Akragas (griech.) wurde 581 v. Chr. von Kolonisten aus Gela gegründet und entwickelte sich zur zweitgrößten Stadt Siziliens. Das Tal der Tempel (Valle dei Templi) ist seit 1997 UNESCO-Weltkulturerbe und umfasst sieben dorische Tempel aus dem 5. Jh. v. Chr. Der Concordia-Tempel ist einer der besterhaltenen griechischen Tempel weltweit (dank seiner Umwandlung in eine christliche Kirche im 6. Jh.). Der Olympieion (Zeustempel) war mit 113 × 56 m einer der größten dorischen Tempel überhaupt – er trug 38 gewaltige Telamonen (7,5 m hohe Atlanten-Figuren). Das archäologische Museum beherbergt einen rekonstruierten Telamon.',
    wikipedia: 'https://en.wikipedia.org/wiki/Valle_dei_Templi',
    planUrl: 'https://en.wikipedia.org/wiki/Valle_dei_Templi#/media/File:Agrigent_BW_2012-10-07_13-09-13.jpg',
    facts: ['Gegründet: 581 v. Chr.', 'UNESCO seit 1997', '7 dorische Tempel', 'Concordia-Tempel besterhaltener', 'Olympieion: 113 × 56 m']
  },
  'Gela': {
    summary: 'Bedeutende griechische Kolonie mit reichem archäologischem Museum.',
    detail: 'Gela wurde 688 v. Chr. von Kolonisten aus Rhodos und Kreta gegründet und war eine der mächtigsten Städte Siziliens. Von hier aus wurde Akragas (Agrigento) gegründet. Der berühmte Tyrann Gelon verlegte seine Residenz 485 v. Chr. nach Syrakus. Aischylos, der Vater der griechischen Tragödie, starb hier 456 v. Chr. Das archäologische Museum bewahrt Funde aus der Nekropole, darunter bemalte Terrakotta-Sarkophage und die berühmten Münzen von Gela mit dem Flussgott auf einem Stier.',
    wikipedia: 'https://en.wikipedia.org/wiki/Gela',
    facts: ['Gegründet: 688 v. Chr.', 'Mutterstadt von Akragas', 'Tod des Aischylos 456 v. Chr.', 'Berühmte Münzprägung']
  },
  'Piazza Armerina': {
    summary: 'Die Villa Romana del Casale mit 3.500 m² spätantiken Mosaiken – UNESCO-Weltkulturerbe.',
    detail: `Die Villa Romana del Casale (3.–4. Jh. n. Chr.) ist eine der bedeutendsten römischen Villen der Welt. Ihre 3.500 m² Bodenmosaiken sind die umfangreichsten und besterhaltenen der gesamten Antike. Berühmt sind die „Bikini-Mädchen" (junge Frauen beim Sport in Bikini-ähnlicher Kleidung), die Große Jagdszene (66 m langer Korridor mit Tierdarstellungen aus dem gesamten Römischen Reich) und die Herkules-Abenteuer. Die Villa gehörte vermutlich einem hohen römischen Beamten oder sogar Kaiser Maximian. Seit 1997 UNESCO-Weltkulturerbe.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Villa_Romana_del_Casale',
    planUrl: 'https://en.wikipedia.org/wiki/Villa_Romana_del_Casale#/media/File:Villa_del_Casale_-_plan.png',
    facts: [`3.–4. Jh. n. Chr.`, `3.500 m² Mosaiken`, `UNESCO seit 1997`, `„Bikini-Mädchen"`, `Große Jagdszene: 66 m`]
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
    facts: ['Neubau nach Erdbeben 1693', 'UNESCO seit 2002', 'Goldgelber Kalkstein', 'Palazzo Nicolaci: Fantastische Balkone']
  },
  'Villa Romana del Tellaro': {
    summary: 'Spätrömische Landvilla mit bedeutenden polychromen Bodenmosaiken aus dem 4. Jh. n. Chr.',
    detail: 'Die Villa Romana del Tellaro liegt am Ufer des Flusses Tellaro nahe Noto. Sie wurde 1971 zufällig entdeckt, als ein Bauer beim Pflügen auf antike Strukturen stieß. Die systematischen Ausgrabungen begannen in den 1980er Jahren. Die Villa gehörte einem wohlhabenden Latifundienbesitzer und ähnelt architektonisch der Villa Romana del Casale, ist aber kleiner und intimer. Berühmt sind die polychromen Bodenmosaiken: Eine dramatische Jagdszene (Venatio) mit exotischen Tieren, Szenen aus dem Trojanischen Krieg (Auslösung des Leichnams Hektors durch Priamos), dionysische Szenen mit Satyrn und Mänaden, sowie aufwändige geometrische Muster. Die Villa wurde im 5. Jh. aufgegeben, vermutlich im Zuge der Vandaleneinfälle.',
    wikipedia: 'https://en.wikipedia.org/wiki/Villa_Romana_del_Tellaro',
    facts: ['4. Jh. n. Chr.', 'Entdeckt 1971', 'Jagdszene, Troja-Szenen', 'Dionysische Mosaiken', 'Ähnlich Villa del Casale']
  },
  'Syrakus: Ortigia': {
    summary: 'Einst mächtigste Stadt der griechischen Welt – der Dom steht im antiken Athena-Tempel.',
    detail: `Syrakus (griech. Syrakousai) wurde 734 v. Chr. von korinthischen Siedlern gegründet und entwickelte sich zur mächtigsten griechischen Stadt des westlichen Mittelmeerraums. Auf der Halbinsel Ortigia steht der Dom, der in den antiken Athena-Tempel (5. Jh. v. Chr.) hineingebaut wurde – die dorischen Säulen sind noch heute in den Seitenwänden sichtbar. Die Fonte Aretusa (Arethusa-Quelle) geht auf den Mythos der Nymphe Arethusa zurück, die sich in eine Süßwasserquelle verwandelte. Cicero nannte Syrakus „die größte aller griechischen Städte und die schönste von allen."`,
    wikipedia: 'https://en.wikipedia.org/wiki/Syracuse,_Sicily',
    facts: ['Gegründet: 734 v. Chr.', 'Dom im Athena-Tempel', 'Arethusa-Quelle', 'UNESCO seit 2005']
  },
  'Archäologischer Park': {
    summary: `Griechisches Theater, „Ohr des Dionysios" und römisches Amphitheater.`,
    detail: `Der Parco Archeologico della Neapoli umfasst einige der wichtigsten antiken Monumente Siziliens. Das griechische Theater (5. Jh. v. Chr., erweitert im 3. Jh.) ist eines der größten der antiken Welt (138 m Durchmesser, 15.000 Plätze). Das „Ohr des Dionysios" (Orecchio di Dionisio) ist eine 23 m hohe, ohrförmige Grotte mit erstaunlicher Akustik – der Legende nach ließ Tyrann Dionysios I. hier Gefangene belauschen. Der Altar Hierons II. (200 × 23 m) war der größte Altar der griechischen Welt. Das römische Amphitheater (2. Jh. n. Chr.) gehört zu den größten Siziliens.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Neapolis_(Syracuse)',
    planUrl: 'https://en.wikipedia.org/wiki/Neapolis_(Syracuse)#/media/File:SiracusaNeapolis.jpg',
    facts: ['Theater: 15.000 Plätze', 'Ohr des Dionysios: 23 m hoch', 'Altar Hierons: 200 m lang', 'Römisches Amphitheater']
  },
  'Castello Eurialo': {
    summary: 'Bedeutendstes antikes Festungswerk Siziliens – griechische Militärarchitektur.',
    detail: 'Das Castello Eurialo (griech. Euryalos) wurde unter Dionysios I. ab 402 v. Chr. als Schlüsselfestung der Befestigungsanlage von Syrakus errichtet. Es war das größte und komplexeste griechische Festungswerk der Antike: fünf Turmpaare, drei tiefe Trockengräben, ein unterirdisches Tunnelsystem zur Truppenverlegung und eine zentrale Zitadelle. Die Festung spielte eine entscheidende Rolle bei der römischen Belagerung 214–212 v. Chr., bei der Archimedes seine berühmten Kriegsmaschinen einsetzte.',
    wikipedia: 'https://en.wikipedia.org/wiki/Euryalus_Fortress',
    planUrl: 'https://en.wikipedia.org/wiki/Euryalus_Fortress#/media/File:Euryalus.svg',
    facts: ['Ab 402 v. Chr. erbaut', 'Größtes griech. Festungswerk', 'Unterirdisches Tunnelsystem', 'Archimedes-Belagerung 212 v. Chr.']
  },
  'Catania': {
    summary: 'Barockstadt am Fuße des Ätna – aus Lavagestein nach dem Erdbeben 1693 neu erbaut.',
    detail: "Catania (griech. Katane, gegr. 729 v. Chr.) wurde im Laufe ihrer Geschichte siebenmal durch Ätna-Ausbrüche und Erdbeben zerstört und immer wieder aufgebaut. Nach dem Erdbeben von 1693 und dem Ätna-Ausbruch von 1669 wurde die Stadt im Barockstil aus schwarzem Lavagestein und weißem Kalkstein neu errichtet – seit 2002 UNESCO-Weltkulturerbe. Der Dom Sant'Agata (11. Jh., barock umgebaut) birgt die Reliquien der Stadtheiligen. Auf der Piazza del Duomo steht der Fontana dell'Elefante (1736) – ein ägyptischer Lava-Elefant mit einem Obelisk. Das Teatro Romano (2. Jh. n. Chr.) liegt mitten im Stadtzentrum.",
    wikipedia: 'https://en.wikipedia.org/wiki/Catania',
    facts: ['Gegründet: 729 v. Chr.', '7× zerstört & wiederaufgebaut', 'UNESCO seit 2002', 'Elefantenbrunnen (1736)', 'Teatro Romano: 2. Jh. n. Chr.']
  },
  'Ätna': {
    summary: 'Europas höchster und aktivster Vulkan (3.357 m) – UNESCO-Weltnaturerbe.',
    detail: `Der Ätna (ital. Etna, siz. Mungibeddu) ist mit 3.357 m der höchste aktive Vulkan Europas und seit 2013 UNESCO-Weltnaturerbe. Er ist seit über 500.000 Jahren aktiv; die erste dokumentierte Eruption war 475 v. Chr. Die Griechen verorteten hier die Schmiede des Hephaistos und das Gefängnis des Riesen Typhon. Pindar besang ihn als „Säule des Himmels". Die Auffahrt zum Rifugio Sapienza (1.910 m) bietet bizarre Mondlandschaften aus erkalteter Lava, Kraterkegel und bei klarem Wetter einen Blick über ganz Sizilien.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Mount_Etna',
    facts: ['3.357 m Höhe', 'UNESCO seit 2013', 'Aktiv seit 500.000 Jahren', 'Erste Eruption 475 v. Chr.', 'Schmiede des Hephaistos']
  },
  'Alcantara-Schlucht': {
    summary: 'Spektakuläre Basaltschlucht mit bizarren prismatischen Lavagesteinsformationen.',
    detail: "Die Gole dell\u2019Alcantara ist eine bis zu 25 m tiefe und nur 2\u20135 m breite Schlucht, die der Fluss Alcantara in einen prähistorischen Lavastrom gegraben hat. Einzigartig sind die prismatischen Basaltsäulen, die durch langsame Abkühlung der Lava entstanden – sie ähneln dem Giant\u2019s Causeway in Irland. Der Name Alcantara stammt vom arabischen al-Qantarah (\u201Edie Brücke\u201C). Im Sommer kann man durch das kalte Flusswasser in die Schlucht waten.",
    wikipedia: 'https://en.wikipedia.org/wiki/Alcantara_(river)',
    facts: [`Bis 25 m tief`, `2–5 m breit`, `Prismatische Basaltsäulen`, `Arab. „die Brücke"`]
  },
  'Taormina': {
    summary: 'Legendärer Küstenort mit griechischem Theater und atemberaubendem Ätna-Panorama.',
    detail: 'Taormina (griech. Tauromenion) wurde 392 v. Chr. von Dionysios I. als Nachfolgesiedlung des zerstörten Naxos gegründet. Das Teatro Greco (3. Jh. v. Chr., von den Römern umgebaut) bietet mit seiner einzigartigen Lage – Blick auf den Ätna und das Ionische Meer – eines der berühmtesten Panoramen der Welt. Goethe beschrieb es begeistert in seiner Italienischen Reise. Der Corso Umberto I. führt durch die mittelalterliche Altstadt mit dem Palazzo Corvaja (15. Jh.), der gotischen Kirche San Giuseppe und dem Uhrturm. Seit dem 19. Jh. ist Taormina ein Sehnsuchtsort für Künstler, Schriftsteller und Reisende.',
    wikipedia: 'https://en.wikipedia.org/wiki/Taormina',
    facts: ['Gegründet: 392 v. Chr.', 'Teatro Greco: 3. Jh. v. Chr.', 'Ätna + Meer-Panorama', 'Goethes Italienische Reise']
  },
  'Milazzo / Tindari': {
    summary: 'Wahlweise Äolische Inseln oder Tindari mit Theater, Basilika und Wallfahrtskirche.',
    detail: 'Tindari (griech. Tyndaris) wurde 396 v. Chr. von Dionysios I. gegründet und nach den Dioskuren Kastor und Polydeukes benannt. Das griechische Theater (3. Jh. v. Chr.) bietet einen herrlichen Blick über die Äolischen Inseln. Die Casa Romana zeigt gut erhaltene Mosaiken. Die Basilika (1. Jh. v. Chr.) ist eine der besterhaltenen römischen Marktbasiliken Siziliens. In der Wallfahrtskirche wird eine byzantinische Schwarze Madonna verehrt. Alternative: Von Milazzo kann man auf die Äolischen Inseln (Lipari, Vulcano, Stromboli) übersetzen – UNESCO-Weltnaturerbe seit 2000.',
    wikipedia: 'https://en.wikipedia.org/wiki/Tindari',
    facts: ['Gegründet: 396 v. Chr.', 'Schwarze Madonna', 'Äolische Inseln: UNESCO', 'Griech. Theater + Basilika']
  },
  'Cefalù': {
    summary: 'Normannische Kathedrale mit dem berühmten Christus-Pantokrator-Mosaik (1131).',
    detail: 'Cefalù ist ein malerischer Küstenort, überragt von einem mächtigen Felsmassiv (La Rocca). Die normannische Kathedrale San Salvatore wurde 1131 von Roger II. gegründet – der Legende nach aufgrund eines Gelübdes nach Rettung aus einem Sturm. In der Apsis befindet sich das berühmte byzantinische Mosaik des Christus Pantokrator auf Goldgrund – eines der ältesten und eindrucksvollsten seiner Art in Sizilien (noch vor Monreale und der Cappella Palatina). Der mittelalterliche Waschplatz (Lavatoio Medievale) am Fluss Cefalino ist ein reizvolles arabisch-normannisches Baudenkmal.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cefal%C3%B9_Cathedral',
    facts: ['Gegründet: 1131 von Roger II.', 'Christus Pantokrator-Mosaik', 'UNESCO seit 2015', 'Arabisch-normannisch']
  },
  'Solunto': {
    summary: 'Hellenistisch-römische Stadt auf dem Monte Catalfano mit Peristylhäusern und Agora.',
    detail: 'Solunto (griech. Solus, phön. Kafara) war eine der drei großen phönizischen Gründungen Siziliens neben Panormus (Palermo) und Motya. Die erhaltenen Ruinen auf dem Monte Catalfano stammen aus hellenistisch-römischer Zeit (3.–1. Jh. v. Chr.) und zeigen ein regelmäßiges hippodamisches Straßenraster. Besonders sehenswert sind die Peristylhäuser mit Mosaikfußböden (Haus der Leda), die Agora mit Bouleuterion, und ein kleines Odeon. Von der Terrasse bietet sich ein grandioser Blick über den Golf von Palermo.',
    wikipedia: 'https://en.wikipedia.org/wiki/Solunto',
    facts: ['Phönizische Gründung', '3.–1. Jh. v. Chr. (Ruinen)', 'Hippodamisches Straßenraster', 'Haus der Leda mit Mosaiken']
  },
  'Palermo Altstadt': {
    summary: 'Normannenpalast mit Cappella Palatina, La Martorana und das archäologische Museum.',
    detail: "Palermo vereint wie kaum eine andere Stadt die Spuren von Phöniziern, Griechen, Römern, Arabern, Normannen und Staufern. Der Normannenpalast (Palazzo dei Normanni) steht über den Resten einer arabischen Festung und beherbergt die Cappella Palatina (1140), deren goldgrundige byzantinische Mosaiken und arabische Muqarnas-Decke ein einzigartiges Meisterwerk arabisch-normannischer Kunst darstellen. La Martorana (Santa Maria dell\u2019Ammiraglio, 1143) besitzt die ältesten byzantinischen Mosaiken Siziliens. Das Archäologische Museum Antonino Salinas zeigt die bedeutendsten Metopen von Selinunt und Funde aus ganz Westsizilien.",
    wikipedia: 'https://en.wikipedia.org/wiki/Palazzo_dei_Normanni',
    facts: ['Cappella Palatina: 1140', 'Arabisch-normannische Kunst', 'La Martorana: 1143', 'UNESCO seit 2015', 'Metopen von Selinunt im Museum']
  },
  'Monreale': {
    summary: 'Normannische Kathedrale mit 6.340 m² byzantinischer Goldmosaiken und romanischem Kreuzgang.',
    detail: 'Die Kathedrale Santa Maria Nuova von Monreale wurde 1174 von Wilhelm II. gegründet und ist das Meisterwerk arabisch-normannischer Baukunst. Ihre 6.340 m² byzantinischer Goldmosaiken bedecken nahezu alle Innenwände und erzählen in 130 Szenen die gesamte biblische Geschichte von der Schöpfung bis zur Apostelgeschichte. Der Christus Pantokrator in der Hauptapsis ist das Herzstück. Der romanische Kreuzgang (47 × 47 m) besitzt 228 Doppelsäulen, von denen jede ein anderes Kapitell trägt – ein Kompendium mittelalterlicher Bildhauerkunst. Seit 2015 UNESCO-Weltkulturerbe.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cathedral_of_Monreale',
    planUrl: 'https://en.wikipedia.org/wiki/Cathedral_of_Monreale#/media/File:Monreale_Cathedral_plan.svg',
    facts: ['Gegründet: 1174', '6.340 m² Goldmosaiken', '130 biblische Szenen', '228 Doppelsäulen im Kreuzgang', 'UNESCO seit 2015']
  },
  'Monte Pellegrino': {
    summary: `Von Goethe als „das schönste Vorgebirge der Welt" gepriesen – Wallfahrtsort Santa Rosalia.`,
    detail: "Der Monte Pellegrino (606 m) erhebt sich als markantes Kalkstein-Vorgebirge über dem Golf von Palermo. Goethe nannte ihn 1787 in seiner Italienischen Reise \u201Edas schönste Vorgebirge der Welt\u201C. In einer Höhle nahe dem Gipfel befindet sich das Santuario di Santa Rosalia, der Schutzpatronin Palermos. Die Legende besagt, dass die Entdeckung ihrer Gebeine 1624 Palermo von der Pest befreite. Die Panoramastraße bietet spektakuläre Ausblicke über Palermo, den Hafen und die Conca d\u2019Oro. Prähistorische Höhlenmalereien (Grotta dell\u2019Addaura, ca. 8.000 v. Chr.) bezeugen die jahrtausendealte Bedeutung des Berges.",
    wikipedia: 'https://en.wikipedia.org/wiki/Monte_Pellegrino',
    facts: [`606 m Höhe`, `Goethe: „schönstes Vorgebirge"`, `Santa Rosalia: Pest 1624`, `Höhlenmalereien ca. 8.000 v. Chr.`]
  },
  'Grab des Archimedes': {
    summary: 'Nekropole Grotticelli und das berühmte archäologische Museum Paolo Orsi.',
    detail: `Die Nekropole Grotticelli enthält zahlreiche Felsengräber aus griechischer und römischer Zeit. Eines davon wird traditionell als „Grab des Archimedes" bezeichnet, obwohl es sich tatsächlich um ein römisches Kolumbarium handelt. Archimedes, der größte Mathematiker und Erfinder der Antike, wurde 212 v. Chr. bei der Eroberung von Syrakus durch die Römer getötet. Das Museo Archeologico Regionale Paolo Orsi ist eines der bedeutendsten archäologischen Museen Europas mit Funden von der Vorgeschichte bis zur Spätantike aus ganz Südostsizilien.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Museo_archeologico_regionale_Paolo_Orsi',
    facts: ['Archimedes: † 212 v. Chr.', 'Nekropole Grotticelli', 'Museum Paolo Orsi', 'Bedeutendstes Museum Südostsiziliens']
  },
}

interface StopData {
  name: string
  desc: string
  km?: string
}

interface DayData {
  day: number
  date: string
  weekday: string
  title: string
  image: string
  hotel: string
  stops: StopData[]
}

const days: DayData[] = [
  {
    day: 1, date: '28. März', weekday: 'Samstag',
    title: 'Salzburg – Palermo – Segesta – Trapani – Marsala',
    image: images.segesta,
    hotel: 'Hotel Carmine, Marsala (N/F)',
    stops: [
      { name: 'Salzburg – München', desc: 'Flug mit Lufthansa nach Palermo' },
      { name: 'Segesta', desc: 'Dorischer Tempel (ca. 420 v. Chr.) und Teatro Greco mit Blick auf den Golf von Castellammare', km: '55 km' },
      { name: 'Monte Érice', desc: 'Mittelalterliche Altstadt auf 750m Höhe, phönizisch-griechische Gründung, Burg der Venus', km: '45 km' },
      { name: 'Trapani', desc: 'Altstadt mit barocken Kirchen und normannischen Spuren', km: '15 km' },
      { name: 'Marsala', desc: 'Entlang der Salzstraße; Altstadt, archäologisches Museum mit punischem Langschiff', km: '30 km' },
    ]
  },
  {
    day: 2, date: '29. März', weekday: 'Sonntag',
    title: 'Marsala – Selinunte – Agrigento',
    image: images.agrigento,
    hotel: 'Hotel Oneira Rooms, Agrigento (N/F)',
    stops: [
      { name: 'Cave di Cusa', desc: 'Antiker Steinbruch für die Tempel von Selinunt – faszinierende Säulentrommeln in situ', km: '40 km' },
      { name: 'Selinunte', desc: 'Griechischer Tempelbezirk und Akropolis, eine der größten antiken Städte Siziliens', km: '15 km' },
      { name: 'Scala dei Turchi', desc: 'Spektakuläres weißes Kalkstein-Naturmonument an der Küste', km: '85 km' },
      { name: 'Agrigento', desc: 'Tal der Tempel: Demetertempel, Zeusheiligtum (Olympieion), archäologisches Museum, Altstadt', km: '15 km' },
    ]
  },
  {
    day: 3, date: '30. März', weekday: 'Montag',
    title: 'Agrigento – Gela – Piazza Armerina – Noto – Siracusa',
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
    title: 'Siracusa – Catania – Taormina',
    image: images.siracusa,
    hotel: 'Hotel Ariston, Taormina (N/F)',
    stops: [
      { name: 'Syrakus: Ortigia', desc: 'Altstadt mit Dom (im antiken Athena-Tempel), Arethusa-Quelle, Halbinsel Ortigia' },
      { name: `Archäologischer Park`, desc: `„Ohr des Dionysios", griechisches Theater, römisches Amphitheater, Altar Hierons II.` },
      { name: 'Grab des Archimedes', desc: 'Nekropole Grotticelli und archäologisches Museum Paolo Orsi' },
      { name: 'Castello Eurialo', desc: 'Griechisches Festungswerk des Dionysios I. – bedeutendstes antikes Kastell Siziliens', km: '10 km' },
      { name: 'Catania', desc: `Dom Sant\u2019Agata, Elefantenbrunnen, Teatro Romano im Stadtzentrum`, km: '60 km' },
      { name: 'Taormina', desc: 'Ankunft im legendären Küstenort', km: '50 km' },
    ]
  },
  {
    day: 5, date: '1. April', weekday: 'Mittwoch',
    title: 'Taormina – Ätna – Alcantara-Schlucht',
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
    title: 'Taormina – Cefalù – Palermo',
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
    title: 'Palermo – Monreale – Monte Pellegrino',
    image: images.palermo,
    hotel: 'Hotel Posta, Palermo (N/F)',
    stops: [
      { name: 'Palermo Altstadt', desc: 'Normannenpalast mit Cappella Palatina (goldene Mosaiken), Normannendom, Kreuzkuppelkirche La Martorana, archäologisches Museum' },
      { name: 'Monreale', desc: 'Normannische Kathedrale (1174) mit 6.340 m² byzantinischer Goldmosaiken und romanischem Kreuzgang', km: '15 km' },
      { name: `Monte Pellegrino`, desc: `Wallfahrtsort Santa Rosalia – von Goethe als „das schönste Vorgebirge der Welt" gepriesen`, km: `25 km` },
    ]
  },
  {
    day: 8, date: '4. April', weekday: 'Samstag',
    title: 'Palermo – Rückflug',
    image: images.palermo,
    hotel: '',
    stops: [
      { name: 'Palermo Altstadt', desc: 'Altstadtrundgang: Quattro Canti, Fontana Pretoria, Vucciria-Markt' },
      { name: 'Flughafen Palermo', desc: 'Transfer zum Flughafen, Rückflug über München nach Salzburg', km: '40 km' },
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
}

const restaurants: Restaurant[] = [
  {
    name: 'Osteria Il Gallo e l\'Innamorata',
    location: 'Marsala',
    desc: 'Slow-Food-empfohlene Osteria. Bekannt für Busiate-Pasta, frischen Fisch und hausgemachte sizilianische Küche. Künstlerisches Ambiente mit Holzbalkendecke. Montags geschlossen.',
    tags: ['Slow Food', 'Osteria', 'Fisch'],
    image: images.pasta,
    mapsUrl: 'https://www.google.com/maps/place/Osteria+Il+Gallo+e+L\'innamorata/@37.7974975,12.4325306,17z/',
  },
  {
    name: 'Osteria Expanificio',
    location: 'Agrigento',
    desc: 'Michelin Bib Gourmand. In einer historischen Nachkriegsbäckerei. Berühmt für Busiate al Pesto Siciliano, Sarde a Beccafico und Pasta n\'caciata.',
    tags: ['Bib Gourmand', 'Osteria', 'Historisch'],
    image: images.caponata,
    mapsUrl: 'https://www.google.com/maps/search/Osteria+Expanificio+Agrigento+Sicily',
  },
  {
    name: 'Ristorante Dammuso',
    location: 'Noto',
    desc: 'Die Mutter des Besitzers kocht nach Familienrezepten. Hausgemachte Tintenfisch-Pasta und Thunfisch in Pistazienkruste. Große Portionen, familiäre Atmosphäre.',
    tags: ['Familienbetrieb', 'Fisch', 'Tradizionale'],
    image: images.cannoli,
    mapsUrl: 'https://www.google.com/maps/search/Ristorante+Dammuso+Noto+Sicily',
  },
  {
    name: 'Sicilia in Tavola',
    location: 'Siracusa (Ortigia)',
    desc: 'Authentisch und bodenständig. Berühmt für Caponata, Spaghettoni alla Norma und Pistazien-Tiramisu. Einer der Favoriten der Reiseforen.',
    tags: ['Ortigia', 'Tradizionale', 'Pasta'],
    image: images.arancini,
    mapsUrl: 'https://www.google.com/maps/search/Sicilia+in+Tavola+Ortigia+Siracusa',
  },
  {
    name: 'Osteria Nero d\'Avola',
    location: 'Taormina',
    desc: 'Wirt Turi Siligato zeigt den frischen Tagesfang. Fisch wird am Tisch filetiert, Desserts mit Zedratzitronen. Benannt nach dem berühmten Rotwein. Unbedingt reservieren!',
    tags: ['Erlebnis', 'Fisch', 'Interaktiv'],
    image: images.granita,
    mapsUrl: 'https://www.google.com/maps?cid=5249353599400390537',
  },
  {
    name: 'Trattoria Da Nino',
    location: 'Taormina',
    desc: 'Seit über 50 Jahren in Familienbesitz (drei Generationen). Echte sizilianische Hausmannskost. Panoramaterrasse mit Blick auf die Nordostküste Siziliens.',
    tags: ['Familienbetrieb', 'Panorama', '50+ Jahre'],
    image: images.pasta,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Luigi+Pirandello,+37a,+98039+Taormina+ME,+Italy',
  },
  {
    name: 'La Botte',
    location: 'Cefalù',
    desc: 'Seit Jahrzehnten eine Institution unter Küchenchef Giuseppe Fiduccia. Kreative Gerichte wie Couscous in Tintenfischtinte. Nahe dem normannischen Dom.',
    tags: ['Institution', 'Kreativ', 'Budget'],
    image: images.caponata,
    mapsUrl: 'https://www.google.com/maps/search/La+Botte+Ristorante+Cefalu+Sicily',
  },
  {
    name: 'Nangalarruni',
    location: 'Castelbuono (bei Cefalù)',
    desc: 'Preisgekrönte Slow-Food-Osteria in den Madonie-Bergen. Pilze, Wildschwein, Manna-Produkte. Gambero Rosso und Michelin empfohlen.',
    tags: ['Slow Food', 'Berge', 'Wild'],
    image: images.cassata,
    mapsUrl: 'https://www.google.com/maps/search/Nangalarruni+Castelbuono+Sicily',
  },
  {
    name: 'Osteria Ballarò',
    location: 'Palermo',
    desc: 'In ehemaligen Stallungen aus dem 17. Jh. mit freiliegendem Mauerwerk. Berühmt für Pasta con le Sarde mit Safran und wildem Fenchel – arabisch-sizilianische Wurzeln.',
    tags: ['Historisch', 'Arabisch-Sizilianisch', 'Osteria'],
    image: images.arancini,
    mapsUrl: 'https://www.google.com/maps/search/Osteria+Ballaro+Palermo+Sicily',
  },
  {
    name: 'Trattoria Al Ferro di Cavallo',
    location: 'Palermo',
    desc: 'Historische Taverne, geliebt von Einheimischen. Panelle, Arancini, Pasta con le Sarde – echtes palermitanisches Essen zu günstigen Preisen.',
    tags: ['Locals Only', 'Street Food', 'Budget'],
    image: images.arancini,
    mapsUrl: 'https://www.google.com/maps/search/Trattoria+Ferro+di+Cavallo+Palermo',
  },
  {
    name: 'I Cucci',
    location: 'Palermo',
    desc: 'Piazza Bologni. Gehobene sizilianische Küche von einem jungen Chef. Laut Reiseforen weltklasse Cannoli und kreative Degustationsmenüs.',
    tags: ['Fine Dining', 'Kreativ', 'Cannoli'],
    image: images.cannoli,
    mapsUrl: 'https://www.google.com/maps/search/I+Cucci+Palermo+Piazza+Bologni',
  },
  {
    name: 'Caffè Sicilia',
    location: 'Noto',
    desc: 'Berühmteste Pasticceria Siziliens, geführt von Meisterkonditor Corrado Assenza (Netflix Chef\'s Table). Legendäre Granita und Brioche.',
    tags: ['Pasticceria', 'Netflix', 'Granita'],
    image: images.granita,
    mapsUrl: 'https://www.google.com/maps/search/Caffe+Sicilia+Noto',
  },
  {
    name: 'Pasticceria Maria Grammatico',
    location: 'Érice',
    desc: 'Weit über Sizilien hinaus berühmt für Mandelgebäck, Cannoli und Süßigkeiten nach Klosterschwestern-Tradition. Ein Muss bei jedem Érice-Besuch.',
    tags: ['Pasticceria', 'Mandelgebäck', 'Tradition'],
    image: images.cassata,
    mapsUrl: 'https://www.google.com/maps/search/Pasticceria+Maria+Grammatico+Erice',
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
  { it: 'Dov\'è ...?', de: 'Wo ist ...?' },
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
  { it: 'L\'ingresso', de: 'Der Eingang / Eintritt' },
  { it: 'Chiuso / Aperto', de: 'Geschlossen / Offen' },
  { it: 'La stazione', de: 'Der Bahnhof' },
  { it: 'A destra / A sinistra', de: 'Rechts / Links' },
]

const speisen = [
  { name: 'Arancini', desc: 'Frittierte Reisbällchen mit Ragù, Mozzarella oder Pistazien – das sizilianische Street Food schlechthin.', image: images.arancini },
  { name: 'Pasta alla Norma', desc: 'Pasta mit Auberginen, Tomatensugo, gesalzenem Ricotta und Basilikum – Catanias Nationalgericht, benannt nach Bellinis Oper.', image: images.pasta },
  { name: 'Cannoli Siciliani', desc: 'Knusprige Teigrollen gefüllt mit süßer Ricotta-Creme, Pistazien und kandierten Früchten.', image: images.cannoli },
  { name: 'Granita con Brioche', desc: 'Halbgefrorenes Eis aus Mandeln, Pistazien oder Zitrone, serviert mit warmem Brioche zum Frühstück.', image: images.granita },
  { name: 'Caponata', desc: 'Süß-saures Auberginen-Gemüse mit Kapern, Oliven, Sellerie und Tomaten – arabischer Einfluss.', image: images.caponata },
  { name: 'Cassata Siciliana', desc: 'Festliche Torte mit Ricotta, Marzipan, Orangeat und Zuckerglasur – arabisch-normannisches Erbe.', image: images.cassata },
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
    source: 'Pindar, Pythische Ode 1, 18–28',
    original: '\u1f10\u03bd \u03b4\u2019 \u0391\u1f34\u03c4\u03bd\u1fb3 \u03ba\u03b5\u1fd6\u03c4\u03b1\u03b9 \u03c7\u03b1\u03bc\u03b1\u03b9\u03c0\u03b5\u03c4\u1f72\u03c2 \u03c0\u03b1\u03bd\u03b4\u03ce\u03ba\u03b1\u03c2 \u03c3\u03c4\u1f7b\u03bb\u03bf\u03c2 \u03bf\u1f50\u03c1\u03b1\u03bd\u03af\u03b1, \u03bd\u03b9\u03c6\u03cc\u03b5\u03c3\u03c3\u03b1 \u0391\u1f34\u03c4\u03bd\u03b1, \u03c0\u03ac\u03bd\u03b5\u03c4\u03b5\u03c2 \u03c7\u03b9\u03cc\u03bd\u03bf\u03c2 \u03bf\u1f50\u03c1\u03b1\u03bd\u03af\u03b1\u03c2 \u03c4\u03b9\u03b8\u03ae\u03bd\u03b1.',
    translation: 'Auf dem Ätna aber liegt er, die Säule des Himmels, die alles aufnimmt, der schneebedeckte Ätna, der ganzjährige Nährvater des scharfen Schnees, der himmlischen.',
    lang: 'Griechisch',
  },
  {
    title: 'Vergil über Siziliens Küsten',
    source: 'Vergil, Aeneis III, 692–696',
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

// Expandable sight detail component
function SightDetail({ name }: { name: string }) {
  const [expanded, setExpanded] = useState(false)
  const info = sightDetails[name]
  if (!info) return null

  return (
    <div className="sight-expandable">
      <button className="sight-expand-btn" onClick={() => setExpanded(!expanded)}>
        <Info size={14} />
        <span>Details zu {name}</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="sight-expand-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="sight-detail-text">{info.detail}</p>
            {info.facts && (
              <div className="sight-facts">
                {info.facts.map((f, i) => (
                  <span key={i} className="sight-fact">{f}</span>
                ))}
              </div>
            )}
            <div className="sight-links">
              {info.wikipedia && (
                <a href={info.wikipedia} target="_blank" rel="noopener noreferrer" className="sight-link">
                  <ExternalLink size={14} /> Wikipedia
                </a>
              )}
              {info.planUrl && (
                <a href={info.planUrl} target="_blank" rel="noopener noreferrer" className="sight-link">
                  <Landmark size={14} /> Grundriss / Plan
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('route')
  const [currentDay, setCurrentDay] = useState<number | null>(null)

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
              ['route', 'Reiseroute'],
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
          <p className="hero-dates">28. März – 4. April 2026</p>
          <p style={{ color: '#ccc', maxWidth: 600, margin: '0 auto 2rem', fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>
            Auf den Spuren der Antike, der Normannen und des Barock –
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
              <div key={d.day} className="route-day-mini" onClick={() => { setCurrentDay(d.day); scrollTo(`day-${d.day}`) }}>
                <span className="day-num">Tag {d.day}</span>
                <h4>{d.weekday}, {d.date}</h4>
                <p>{d.stops.slice(0, 3).map(s => s.name).join(' – ')}{d.stops.length > 3 ? ' ...' : ''}</p>
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
            Westsizilien (Tag 1–2)
          </button>
          <button className={`tab-btn ${activeSection === 'south' ? 'active' : ''}`} onClick={() => setActiveSection('south')}>
            Süden (Tag 3–4)
          </button>
          <button className={`tab-btn ${activeSection === 'east' ? 'active' : ''}`} onClick={() => setActiveSection('east')}>
            Osten (Tag 5–6)
          </button>
          <button className={`tab-btn ${activeSection === 'north' ? 'active' : ''}`} onClick={() => setActiveSection('north')}>
            Palermo (Tag 7–8)
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
                <span className="day-badge">Tag {d.day} – {d.weekday}</span>
                <h3>{d.date}</h3>
              </div>
            </div>
            <div className="day-card-body">
              <div className="stops-timeline">
                {d.stops.map((s, i) => (
                  <div key={i} className="stop-item">
                    <div className="stop-name">{s.name} {s.km && <span className="stop-km">({s.km})</span>}</div>
                    <div className="stop-desc">{s.desc}</div>
                    <SightDetail name={s.name} />
                  </div>
                ))}
              </div>
              {d.hotel && (
                <div className="hotel-info">
                  <Hotel size={18} />
                  <span>{d.hotel}</span>
                </div>
              )}

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
          <h2><UtensilsCrossed size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />Restaurant-Empfehlungen</h2>
          <div className="section-divider" />
          <p>Echte sizilianische Osterien, Trattorien und Slow-Food-Lokale – von Reiseforen und Guides empfohlen</p>
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
        <p>Sizilien Kulturreise 2026</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>28. März – 4. April 2026</p>
      </footer>
    </div>
  )
}

export default App
