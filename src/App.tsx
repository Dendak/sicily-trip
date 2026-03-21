import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Hotel, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Menu, X, UtensilsCrossed, BookOpen, Languages, Landmark, Navigation, ExternalLink, Info, Clock } from 'lucide-react'
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
const sightDetails: Record<string, { summary: string; detail: string; wikipedia?: string; planUrl?: string; facts?: string[] }> = {
  'Segesta': {
    summary: 'Bedeutende Stadt der Elymer im Nordwesten Siziliens mit einem der besterhaltenen dorischen Tempel Europas.',
    detail: 'Segesta wurde im 7. Jh. v. Chr. von den Elymern gegründet, die sich auf trojanische Vorfahren beriefen. Der dorische Tempel (ca. 420 v. Chr.) misst 26 × 61 Meter mit 36 Säulen aus Travertin. Die Säulen wurden nie kanneliert und die Cella fehlt – der Tempel wurde vermutlich nie vollendet. Thukydides berichtet (VI, 6), dass die Segestaner 415 v. Chr. Athen um Hilfe gegen das mächtige Selinunt baten und dabei ihren Reichtum demonstrierten – was zur verhängnisvollen Sizilienexpedition Athens führte, die Thukydides als „die größte Katastrophe der griechischen Geschichte" bezeichnete. Der Historiker Diodor (XI, 21) überliefert, dass die Elymer sich auf die Trojaner als Vorfahren beriefen: Aeneas soll hier auf seiner Flucht aus Troja gelandet sein. Das Theater (3. Jh. v. Chr.) wurde unter Hieron II. in den Monte Barbaro gehauen. Mit 63 m Durchmesser bietet es 4.000 Zuschauern Platz und einen spektakulären Blick auf den Golf von Castellammare.',
    wikipedia: 'https://en.wikipedia.org/wiki/Segesta',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Segesta-Temple-Plan-bjs.png',
    facts: ['Ca. 420 v. Chr. (Tempel)', '36 dorische Säulen', 'Nie fertiggestellt', 'Theater: 4.000 Plätze', 'Sizilienexpedition Athens 415 v. Chr.']
  },
  'Monte Érice': {
    summary: 'Mittelalterliche Bergstadt auf 750 m Höhe mit phönizisch-griechischen Wurzeln und normannischer Burg.',
    detail: 'Érice thront auf dem gleichnamigen Berg (751 m) an der Westspitze Siziliens. Bereits die Phönizier errichteten hier ein Heiligtum der Astarte, das die Griechen als Tempel der Aphrodite Erycina übernahmen – Diodor (IV, 83) berichtet, dass Daidalos nach seiner Flucht aus Kreta hier für König Eryx einen goldenen Widder als Weihgeschenk schuf. Vergil lässt Aeneas hier seinen Vater Anchises begraben (Aeneis V). Das Heiligtum war so berühmt, dass Rom einen eigenen Tempel der Venus Erycina auf dem Kapitol errichtete (215 v. Chr.). Die Normannen bauten im 12. Jh. das Castello di Venere über den Resten des antiken Tempels. Heute ist Érice auch als Sitz des Ettore Majorana Centre for Scientific Culture bekannt, gegründet 1963 vom Physiker Antonino Zichichi, wo regelmäßig Nobelpreisträger tagen.',
    wikipedia: 'https://en.wikipedia.org/wiki/Erice',
    facts: ['751 m Höhe', 'Antikes Aphrodite-Heiligtum', 'Daidalos-Sage', 'Castello di Venere (12. Jh.)', 'Majorana-Zentrum (1963)']
  },
  'Trapani': {
    summary: 'Hafenstadt an der Westspitze Siziliens mit barockem Stadtkern und lebhafter Altstadt.',
    detail: `Trapani (griech. Drepanon, „Sichel") verdankt seinen Namen der sichelförmigen Landzunge. Die Stadt war ein wichtiger punischer Hafen und Schauplatz der Seeschlacht von Drepana (249 v. Chr.) im Ersten Punischen Krieg, bei der Konsul Publius Claudius Pulcher die heiligen Hühner ins Meer werfen ließ, als sie nicht fressen wollten – mit den Worten „Dann sollen sie eben trinken!" (Valerius Maximus I, 4, 3). Er verlor die Schlacht und fast 100 Schiffe. Die Altstadt besticht durch barocke Kirchen, den Fischmarkt und die arabisch beeinflusste Architektur. Unter den Arabern (827–1072) war Trapani ein bedeutendes Handelszentrum. Berühmt sind die Prozessionen der Misteri am Karfreitag – 20 lebensgroße Figurengruppen aus dem 17./18. Jh., die 24 Stunden durch die Stadt getragen werden.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Trapani',
    facts: ['Gegründet: 8. Jh. v. Chr.', 'Seeschlacht 249 v. Chr.', 'Heilige-Hühner-Episode', 'Misteri (Karfreitag)', 'Tor zu den Ägadischen Inseln']
  },
  'Marsala': {
    summary: 'Berühmt für den gleichnamigen Wein und das im Museum ausgestellte punische Kriegsschiff.',
    detail: `Marsala (arab. Marsa Allah, „Hafen Gottes"), das antike Lilybaeum, war die letzte und stärkste punische Festung auf Sizilien. Im archäologischen Museum Baglio Anselmi befindet sich ein einzigartiges punisches Langschiff (Lilybaeum Ship) aus dem 3. Jh. v. Chr. – entdeckt 1971 von der Archäologin Honor Frost, einer Pionierin der Unterwasserarchäologie. Es ist eines der wenigen erhaltenen Kriegsschiffe der Antike. Polybios (I, 42) beschreibt die vergebliche römische Belagerung Lilybaeums 250–241 v. Chr. Am 11. Mai 1860 landete Giuseppe Garibaldi hier mit seinen 1.089 „Rothemden" (I Mille) und begann die Einigung Italiens. Der Marsala-Wein wurde 1773 vom englischen Kaufmann John Woodhouse „entdeckt", der Wein mit Branntwein versetzte, damit er die Seereise nach England überstehe.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Marsala',
    facts: ['Antik: Lilybaeum', 'Punisches Schiff (3. Jh. v. Chr.)', 'Honor Frost (1971)', 'Garibaldi 1860', 'Marsala-Wein ab 1773']
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
    facts: ['Gegründet: 628 v. Chr.', '8 monumentale Tempel', 'Tempel G: 113 × 54 m', 'Zerstört: 409 v. Chr.', 'Empedokles und die Malaria']
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
    facts: ['Gegründet: 581 v. Chr.', 'UNESCO seit 1997', 'Tyrann Theron (488–472)', 'Empedokles (490–430)', 'Olympieion: 113 × 56 m']
  },
  'Gela': {
    summary: 'Bedeutende griechische Kolonie – Geburtsort des Tyrannen Gelon und Sterbeort des Aischylos.',
    detail: 'Gela wurde 688 v. Chr. von Kolonisten aus Rhodos und Kreta gegründet. Hier wuchs Gelon auf, der 485 v. Chr. Syrakus eroberte und es zur mächtigsten Stadt der griechischen Welt machte. 480 v. Chr. schlug er die Karthager bei Himera – am selben Tag, so die Überlieferung, als die Griechen bei Salamis die Perser besiegten. Aischylos, der Vater der griechischen Tragödie, starb hier 456 v. Chr. – laut Plinius (X, 7) soll ein Adler eine Schildkröte auf seinen kahlen Kopf fallen gelassen haben, die er für einen Felsen hielt. Der Dichter selbst soll als Grabinschrift nur seine Teilnahme an der Schlacht von Marathon erwähnt haben, nicht seine Dramen. Das Museum zeigt bemalte Terrakotta-Sarkophage und die berühmten Münzen mit dem Flussgott Gelas auf einem Stier.',
    wikipedia: 'https://en.wikipedia.org/wiki/Gela',
    facts: ['Gegründet: 688 v. Chr.', 'Tyrann Gelon', 'Aischylos † 456 v. Chr.', 'Schlacht bei Himera 480', 'Berühmte Münzprägung']
  },
  'Piazza Armerina': {
    summary: 'Die Villa Romana del Casale mit 3.500 m² spätantiken Mosaiken – UNESCO-Weltkulturerbe.',
    detail: `Die Villa Romana del Casale (3.–4. Jh. n. Chr.) gehörte vermutlich einem Angehörigen der senatorischen Aristokratie, möglicherweise Lucius Aradius Valerius Proculus, der 340 n. Chr. Konsul war – oder sogar Kaiser Maximian (Mitregent Diokletians). Die 3.500 m² Bodenmosaiken sind die umfangreichsten der gesamten Antike, geschaffen von nordafrikanischen Werkstätten. Die „Bikini-Mädchen" zeigen junge Frauen beim Diskuswurf, Laufen und Ballspiel – das früheste Zeugnis weiblicher Sportbekleidung. Die Große Jagdszene (66 m Korridor) zeigt den Fang exotischer Tiere für die Arenen Roms: Löwen, Tiger, Nashörner, Elefanten. Die Mosaiken der kleinen Jagd zeigen eine Opferszene an die Göttin Diana. Nach einer Überschwemmung im 12. Jh. wurde die Villa verschüttet und erst 1929 durch den Archäologen Paolo Orsi wiederentdeckt.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Villa_Romana_del_Casale',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Villa-del-Casale-plan-color-bjs-1.jpg',
    facts: [`3.–4. Jh. n. Chr.`, `3.500 m² Mosaiken`, `UNESCO seit 1997`, `„Bikini-Mädchen"`, `Große Jagdszene: 66 m`, `Wiederentdeckt 1929`]
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
    detail: `Syrakus wurde 734 v. Chr. von korinthischen Siedlern unter dem Oikisten Archias gegründet. Unter den Tyrannen Gelon und Hieron I. (5. Jh. v. Chr.) stieg es zur mächtigsten Stadt des westlichen Mittelmeerraums auf. Der Dom wurde in den Athena-Tempel (5. Jh. v. Chr.) hineingebaut – die dorischen Säulen sind noch heute sichtbar. Cicero (In Verrem II, 4.117) pries die Stadt als „die größte aller griechischen Städte, die schönste von allen" – und dokumentierte gleichzeitig die Plünderungen des Statthalters Verres (73–71 v. Chr.), der u.a. die Türen des Athena-Tempels rauben ließ. Am Hof Hierons I. wirkten die Dichter Pindar, Bakchylides und Aischylos. Die Fonte Aretusa geht auf den Mythos der Nymphe zurück, die vor dem Flussgott Alpheios von Olympia unter dem Meer hindurch nach Sizilien floh (Ovid, Metamorphosen V).`,
    wikipedia: 'https://en.wikipedia.org/wiki/Syracuse,_Sicily',
    facts: ['Gegründet: 734 v. Chr.', 'Dom im Athena-Tempel', 'Cicero gegen Verres', 'Pindar, Aischylos am Hof', 'UNESCO seit 2005']
  },
  'Archäologischer Park': {
    summary: `Griechisches Theater, „Ohr des Dionysios" und römisches Amphitheater.`,
    detail: `Der Parco Archeologico della Neapoli umfasst die wichtigsten antiken Monumente Siziliens. Das griechische Theater (5. Jh. v. Chr., erweitert unter Hieron II.) ist eines der größten der antiken Welt (138 m Durchmesser, 15.000 Plätze). Hier wurden Aischylos' Tragödien uraufgeführt – seine „Perser" wurden 472 v. Chr. in Syrakus wiederaufgeführt. Das „Ohr des Dionysios" benannte der Maler Caravaggio 1608 während seines Sizilien-Aufenthalts (er floh vor einer Mordanklage in Malta). Der Tyrann Dionysios I. (405–367 v. Chr.) soll hier die 7.000 athenischen Kriegsgefangenen von 413 v. Chr. eingesperrt haben – Thukydides (VII, 87) beschreibt ihr Elend in den Steinbrüchen als eines der grausamsten Schicksale des Peloponnesischen Krieges. Der Altar Hierons II. (200 × 23 m) diente der Opferung von 450 Stieren gleichzeitig.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Neapolis_(Syracuse)',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Top.neapolis-Cavallari.jpg',
    facts: ['Theater: 15.000 Plätze', 'Aischylos-Uraufführungen', 'Caravaggio 1608', 'Athenische Gefangene 413 v. Chr.', 'Altar: 450 Stiere']
  },
  'Castello Eurialo': {
    summary: 'Bedeutendstes antikes Festungswerk Siziliens – griechische Militärarchitektur.',
    detail: `Das Castello Eurialo wurde unter Dionysios I. ab 402 v. Chr. als Schlüsselfestung errichtet. Es war das komplexeste griechische Festungswerk der Antike: fünf Turmpaare, drei tiefe Trockengräben und ein unterirdisches Tunnelsystem. Bei der römischen Belagerung 214–212 v. Chr. setzte der Mathematiker Archimedes hier seine legendären Kriegsmaschinen ein: Katapulte, die Felsbrocken schleuderten, „Krallen des Archimedes" (Kräne, die Schiffe aus dem Wasser hoben) und angeblich Brennspiegel. Der römische General Marcellus soll gesagt haben: „Er übertrifft ja die hundertarmigen Riesen der Fabel!" (Plutarch, Marcellus 17). Archimedes wurde 212 v. Chr. bei der Eroberung von einem Soldaten getötet, trotz Marcellus' Befehl, ihn zu verschonen – seine letzten Worte: „Störe meine Kreise nicht!" (Noli turbare circulos meos).`,
    wikipedia: 'https://en.wikipedia.org/wiki/Euryalus_Fortress',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Mappa_del_Castello_Eurialo_sull%27Epipoli.jpg',
    facts: ['Ab 402 v. Chr. erbaut', `Archimedes' Kriegsmaschinen`, '„Störe meine Kreise nicht!"', 'Unterirdisches Tunnelsystem']
  },
  'Catania': {
    summary: 'Barockstadt am Fuße des Ätna – aus Lavagestein nach dem Erdbeben 1693 neu erbaut.',
    detail: `Catania (griech. Katane, gegr. 729 v. Chr. von Naxos-Siedlern) wurde siebenmal zerstört und wiederaufgebaut. Der Tyrann Hieron I. vertrieb 476 v. Chr. die gesamte Bevölkerung und benannte die Stadt in Aitna um – Pindar widmete ihm die 1. Pythische Ode zur Neugründung. Nach dem Erdbeben von 1693 (ca. 16.000 Tote allein in Catania) schuf der Architekt Giovanni Battista Vaccarini den barocken Neubau aus schwarzem Lavagestein und weißem Kalkstein. Der Elefantenbrunnen (1736) – ein antiker Lavastein-Elefant mit ägyptischem Obelisk – ist sein Meisterwerk. Catania ist auch die Geburtsstadt des Komponisten Vincenzo Bellini (1801–1835), dessen Oper „Norma" dem Nationalgericht Pasta alla Norma den Namen gab. Im Teatro Romano (2. Jh. n. Chr., 7.000 Plätze) fanden noch bis ins 5. Jh. Aufführungen statt.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Catania',
    facts: ['Gegründet: 729 v. Chr.', '7× zerstört', 'UNESCO seit 2002', 'Bellini (1801–1835)', 'Vaccarinis Barock']
  },
  'Ätna': {
    summary: 'Europas höchster und aktivster Vulkan (3.357 m) – UNESCO-Weltnaturerbe.',
    detail: `Der Ätna (ital. Etna, siz. Mungibeddu) ist mit 3.357 m der höchste aktive Vulkan Europas und seit 2013 UNESCO-Weltnaturerbe. Er ist seit über 500.000 Jahren aktiv; die erste dokumentierte Eruption war 475 v. Chr. Die Griechen verorteten hier die Schmiede des Hephaistos und das Gefängnis des Riesen Typhon. Pindar besang ihn als „Säule des Himmels". Die Auffahrt zum Rifugio Sapienza (1.910 m) bietet bizarre Mondlandschaften aus erkalteter Lava, Kraterkegel und bei klarem Wetter einen Blick über ganz Sizilien.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Mount_Etna',
    facts: ['3.357 m Höhe', 'UNESCO seit 2013', 'Aktiv seit 500.000 Jahren', 'Erste Eruption 475 v. Chr.', 'Schmiede des Hephaistos']
  },
  'Alcantara-Schlucht': {
    summary: 'Spektakuläre Basaltschlucht mit bizarren prismatischen Lavagesteinsformationen.',
    detail: `Die Gole dell'Alcantara ist eine bis zu 25 m tiefe und nur 2–5 m breite Schlucht, die der Fluss Alcantara in einen prähistorischen Lavastrom gegraben hat. Einzigartig sind die prismatischen Basaltsäulen, die durch langsame Abkühlung der Lava entstanden – sie ähneln dem Giant's Causeway in Irland. Der Name Alcantara stammt vom arabischen al-Qantarah („die Brücke"). Im Sommer kann man durch das kalte Flusswasser in die Schlucht waten.`,
    wikipedia: 'https://en.wikipedia.org/wiki/Alcantara_(river)',
    facts: [`Bis 25 m tief`, `2–5 m breit`, `Prismatische Basaltsäulen`, `Arab. „die Brücke"`]
  },
  'Taormina': {
    summary: 'Legendärer Küstenort mit griechischem Theater und atemberaubendem Ätna-Panorama.',
    detail: 'Taormina (griech. Tauromenion) wurde 392 v. Chr. von Andromachos, dem Vater des Historikers Timaios, gegründet. Es nahm die Überlebenden des von Dionysios I. zerstörten Naxos auf. Das Teatro Greco (3. Jh. v. Chr., römisch umgebaut) bietet das berühmteste Panorama der Welt. Goethe schrieb am 7. Mai 1787: „Wenn man auch nur in Gedanken sich an jene Stelle versetzt, so ist es ein ungeheurer Anblick." Im 19. Jh. wurde Taormina zum Sehnsuchtsort: Der deutsche Fotograf Wilhelm von Gloeden schuf hier ab 1878 seine berühmten Fotografien, Oscar Wilde besuchte ihn 1897 nach seiner Haftentlassung. D.H. Lawrence lebte 1920–23 in Taormina und schrieb hier Teile von „Kangaroo". Zuletzt diente die Stadt als Drehort für „The White Lotus" (HBO, 2023) im Hotel San Domenico Palace.',
    wikipedia: 'https://en.wikipedia.org/wiki/Taormina',
    facts: ['Gegründet: 392 v. Chr.', 'Goethe: 7. Mai 1787', 'Von Gloeden, Oscar Wilde', 'D.H. Lawrence (1920–23)', 'White Lotus (HBO)']
  },
  'Milazzo / Tindari': {
    summary: 'Wahlweise Äolische Inseln oder Tindari mit Theater, Basilika und Wallfahrtskirche.',
    detail: 'Tindari (griech. Tyndaris) wurde 396 v. Chr. von Dionysios I. gegründet und nach den Dioskuren Kastor und Polydeukes benannt. Das griechische Theater (3. Jh. v. Chr.) bietet einen herrlichen Blick über die Äolischen Inseln. Die Casa Romana zeigt gut erhaltene Mosaiken. Die Basilika (1. Jh. v. Chr.) ist eine der besterhaltenen römischen Marktbasiliken Siziliens. In der Wallfahrtskirche wird eine byzantinische Schwarze Madonna verehrt. Alternative: Von Milazzo kann man auf die Äolischen Inseln (Lipari, Vulcano, Stromboli) übersetzen – UNESCO-Weltnaturerbe seit 2000.',
    wikipedia: 'https://en.wikipedia.org/wiki/Tindari',
    facts: ['Gegründet: 396 v. Chr.', 'Schwarze Madonna', 'Äolische Inseln: UNESCO', 'Griech. Theater + Basilika']
  },
  'Cefalù': {
    summary: 'Normannische Kathedrale mit dem berühmten Christus-Pantokrator-Mosaik (1131).',
    detail: 'Cefalù (griech. Kephaloidion, „Kopf") ist nach dem mächtigen Felsmassiv La Rocca benannt. Die normannische Kathedrale wurde 1131 von Roger II. gegründet – der Legende nach nach Rettung aus einem Seesturm. Roger II. (1095–1154) war einer der bemerkenswertesten Herrscher des Mittelalters: Er vereinte normannische, arabische und byzantinische Kultur. Sein Hof in Palermo war das gebildetste Zentrum Europas; der arabische Geograph al-Idrisi schuf für ihn 1154 die genaueste Weltkarte des Mittelalters (Tabula Rogeriana). Der Christus Pantokrator in der Apsis (1148) ist das älteste normannische Mosaik Siziliens – strenger und majestätischer als die späteren in Monreale. Das Buch in seiner linken Hand zeigt den Text in Griechisch und Latein – Symbol der Zweisprachigkeit des normannischen Hofes.',
    wikipedia: 'https://en.wikipedia.org/wiki/Cefal%C3%B9_Cathedral',
    facts: ['Gegründet: 1131 von Roger II.', 'Christus Pantokrator (1148)', 'al-Idrisi: Tabula Rogeriana', 'UNESCO seit 2015']
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
    facts: ['Cappella Palatina: 1140', 'Friedrich II. „Stupor Mundi"', 'Muqarnas-Decke', 'Georg von Antiochien', 'UNESCO seit 2015']
  },
  'Monreale': {
    summary: 'Normannische Kathedrale mit 6.340 m² byzantinischer Goldmosaiken und romanischem Kreuzgang.',
    detail: 'Die Kathedrale wurde 1174 von Wilhelm II. „dem Guten" gegründet – angeblich nach einer Traumvision, in der die Madonna ihm den Ort eines vergrabenen Schatzes zeigte, den er zum Kirchenbau verwenden solle. In Wahrheit war es ein politisches Projekt: Wilhelm wollte den mächtigen Erzbischof von Palermo, Walter of the Mill (Gualtiero Offamiglio), übertrumpfen, der gerade den Palermitaner Dom umbaute. Die 6.340 m² byzantinischer Goldmosaiken erzählen in 130 Szenen die biblische Geschichte. Besonders bemerkenswert: Die Darstellung der Erschaffung Evas, der Sündenfall und die Arche Noah. Der Kreuzgang (47 × 47 m) mit 228 Doppelsäulen zeigt arabische, normannische und antike Motive – jedes Kapitell ist einzigartig. Maupassant schrieb 1885: „Die schönste Kirche der Welt, das erstaunlichste religiöse Juwel, das die menschliche Vorstellungskraft ersonnen hat."',
    wikipedia: 'https://en.wikipedia.org/wiki/Cathedral_of_Monreale',
    planUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/A_history_of_architecture_in_Italy_from_the_time_of_Constantine_to_the_dawn_of_the_renaissance_(1901)_(14784471905).jpg',
    facts: ['Gegründet: 1174', '6.340 m² Goldmosaiken', 'Wilhelm II. vs. Walter of the Mill', '228 einzigartige Kapitelle', 'UNESCO seit 2015']
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
    facts: ['Archimedes: † 212 v. Chr.', 'Nekropole Grotticelli', 'Museum Paolo Orsi', 'Bedeutendstes Museum Südostsiziliens']
  },
}

interface StopData {
  name: string
  desc: string
  km?: string
  image?: string
}

// Sight images from Wikimedia Commons and Unsplash
const sightImages: Record<string, string> = {
  'Segesta': 'https://images.unsplash.com/photo-1677967062355-b951f29c66e8?w=800&q=80',
  'Monte Érice': 'https://images.unsplash.com/photo-1531050661635-3999fed2312e?w=800&q=80',
  'Trapani': 'https://images.unsplash.com/photo-1749832147262-76b40c0fc005?w=800&q=80',
  'Marsala': 'https://images.unsplash.com/photo-1513258419489-57f9e66da32b?w=800&q=80',
  'Cave di Cusa': 'https://images.unsplash.com/photo-1585756908524-d7935e897056?w=800&q=80',
  'Selinunte': 'https://images.unsplash.com/photo-1581364899794-1e21c0179a4e?w=800&q=80',
  'Scala dei Turchi': images.scalaDeiTurchi,
  'Agrigento': images.agrigento,
  'Gela': 'https://images.unsplash.com/photo-1727617855734-35b07c4fdfdb?w=800&q=80',
  'Piazza Armerina': 'https://images.unsplash.com/photo-1768910924686-2a2bda2d8ac4?w=800&q=80',
  'Akrai': 'https://images.unsplash.com/photo-1764520684170-afebcdd38506?w=800&q=80',
  'Noto': images.noto,
  'Villa Romana del Tellaro': 'https://images.unsplash.com/photo-1706830342145-7ba06ed51e30?w=800&q=80',
  'Syrakus': images.siracusa,
  'Castello Eurialo': 'https://images.unsplash.com/photo-1767032330785-033405e26229?w=800&q=80',
  'Catania': images.catania,
  'Ätna': images.etna,
  'Alcantara-Schlucht': 'https://images.unsplash.com/photo-1704737035139-d8cc36aea123?w=800&q=80',
  'Taormina': images.taormina,
  'Tindari': 'https://images.unsplash.com/photo-1710092880781-3cbee5b05d85?w=800&q=80',
  'Cefalù': images.cefalu,
  'Solunto': 'https://images.unsplash.com/photo-1668212145518-b9a2a614bbd9?w=800&q=80',
  'Palermo Altstadt': images.palermo,
  'Monreale': images.monreale,
  'Monte Pellegrino': 'https://images.unsplash.com/photo-1516986078574-f2f732941c4a?w=800&q=80',
  'Syrakus: Ortigia': 'https://images.unsplash.com/photo-1593290904368-e993b56accc9?w=800&q=80',
  'Archäologischer Park': 'https://images.unsplash.com/photo-1670694106275-20601b741a63?w=800&q=80',
  'Grab des Archimedes': 'https://images.unsplash.com/photo-1725255922252-4b4ab90c9477?w=800&q=80',
  'Milazzo / Tindari': 'https://images.unsplash.com/photo-1710092880781-3cbee5b05d85?w=800&q=80',
  'Siracusa': images.siracusa,
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
  hotel: string
  hotelData?: HotelData
  stops: StopData[]
}

const days: DayData[] = [
  {
    day: 1, date: '28. März', weekday: 'Samstag',
    title: 'Salzburg – Palermo – Segesta – Trapani – Marsala',
    image: images.segesta,
    hotel: 'Hotel Carmine, Marsala (N/F)',
    hotelData: { name: 'Hotel Carmine', mapsQuery: 'Hotel+Carmine+Marsala+Sicily', mapsEmbed: 'Hotel+Carmine,+Marsala,+TP,+Italy' },
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
    hotelData: { name: 'Oneira Rooms', mapsQuery: 'Oneira+Rooms+Agrigento+Sicily', mapsEmbed: 'Oneira+Rooms,+Agrigento,+AG,+Italy' },
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
    hotelData: { name: 'I Santi Coronati', mapsQuery: 'Hotel+I+Santi+Coronati+Siracusa', mapsEmbed: 'I+Santi+Coronati,+Siracusa,+SR,+Italy' },
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
    hotelData: { name: 'Hotel Ariston', mapsQuery: 'Hotel+Ariston+Taormina+Sicily', mapsEmbed: 'Hotel+Ariston,+Taormina,+ME,+Italy' },
    stops: [
      { name: 'Syrakus: Ortigia', desc: 'Altstadt mit Dom (im antiken Athena-Tempel), Arethusa-Quelle, Halbinsel Ortigia' },
      { name: `Archäologischer Park`, desc: `„Ohr des Dionysios", griechisches Theater, römisches Amphitheater, Altar Hierons II.` },
      { name: 'Grab des Archimedes', desc: 'Nekropole Grotticelli und archäologisches Museum Paolo Orsi' },
      { name: 'Castello Eurialo', desc: 'Griechisches Festungswerk des Dionysios I. – bedeutendstes antikes Kastell Siziliens', km: '10 km' },
      { name: 'Catania', desc: `Dom Sant'Agata, Elefantenbrunnen, Teatro Romano im Stadtzentrum`, km: '60 km' },
      { name: 'Taormina', desc: 'Ankunft im legendären Küstenort', km: '50 km' },
    ]
  },
  {
    day: 5, date: '1. April', weekday: 'Mittwoch',
    title: 'Taormina – Ätna – Alcantara-Schlucht',
    image: images.etna,
    hotel: 'Hotel Ariston, Taormina (N/F)',
    hotelData: { name: 'Hotel Ariston', mapsQuery: 'Hotel+Ariston+Taormina+Sicily', mapsEmbed: 'Hotel+Ariston,+Taormina,+ME,+Italy' },
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
    hotelData: { name: 'Hotel Posta', mapsQuery: 'Hotel+Posta+Palermo+Sicily', mapsEmbed: 'Hotel+Posta,+Palermo,+PA,+Italy' },
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
    image: images.monreale,
    hotel: 'Hotel Posta, Palermo (N/F)',
    hotelData: { name: 'Hotel Posta', mapsQuery: 'Hotel+Posta+Palermo+Sicily', mapsEmbed: 'Hotel+Posta,+Palermo,+PA,+Italy' },
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
    translation: '',
    lang: 'Deutsch (Original)',
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
  const [restaurantFilter, setRestaurantFilter] = useState<string>('Alle')
  const [glossarRichtung, setGlossarRichtung] = useState<'it-de' | 'de-it'>('it-de')

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
              ['route', 'Reiseroute'],
              ['restaurants', 'Restaurants'],
              ['speisen', 'Speisen'],
              ['texte', 'Antike Texte'],
              ['architektur', 'Architektur'],
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
              <img src={d.image} alt={d.title} loading="lazy" />
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
                        <div className="stop-card-bg" style={{ backgroundImage: `url(${img})` }} />
                      )}
                      <div className="stop-card-content">
                        <div className="stop-name">{s.name} {s.km && <span className="stop-km">({s.km})</span>}</div>
                        <div className="stop-desc">{s.desc}</div>
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
              {t.translation && (
                <div>
                  <div className="text-label">Deutsche Übersetzung</div>
                  <div className="text-translation">{t.translation}</div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
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
                { url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Order_%28PSF%29.png', label: 'Schema: Drei Säulenordnungen', schema: true },
                { url: images.doricCol, label: 'Parthenon, Athen – Dorische Säulen' },
              ],
            },
            {
              name: 'Ionische Ordnung',
              color: '#2C5F8A',
              merkmale: ['Basis: Torus + Spira + Plinthe', '24 Kanneluren mit stumpfen Stegen', 'Kapitell: charakteristische Voluten (Schnecken)', 'Architrav in drei Fascien (Streifen) gegliedert', 'Schlank, elegant, weiblich'],
              beispiel: 'Häufig in Kleinasien; in Sizilien selten',
              slides: [
                { url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Order_%28PSF%29.png', label: 'Schema: Drei Säulenordnungen', schema: true },
                { url: images.ionicCol, label: 'Ionisches Volutenkapitell – Nahaufnahme' },
              ],
            },
            {
              name: 'Korinthische Ordnung',
              color: '#4A7A3A',
              merkmale: ['Wie ionisch, aber aufwendigeres Kapitell', 'Kapitell mit Akanthusblättern und Voluten-Bändern', 'Entwickelt ca. 420 v. Chr. in Korinth', 'Besonders prunkvoll und dekorativ', 'In römischer Architektur am beliebtesten'],
              beispiel: 'Spätantike Bauten; Pantheon Rom',
              slides: [
                { url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Order_%28PSF%29.png', label: 'Schema: Drei Säulenordnungen', schema: true },
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

        <div className="glossary-grid">
          {[...glossary].sort((a, b) =>
            glossarRichtung === 'it-de'
              ? a.it.localeCompare(b.it, 'it')
              : a.de.localeCompare(b.de, 'de')
          ).map((g, i) => (
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
