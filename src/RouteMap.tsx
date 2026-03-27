import { useState, useMemo, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap, Marker } from 'react-leaflet'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 305 points sampled from 25168 GPX track points - the actual driven route
const routePath: [number,number,number][] = [[38.11069,13.35192,38],[38.12947,13.32993,47],[38.17019,13.30043,62],[38.19524,13.2753,32],[38.1992,13.2576,20],[38.17664,13.22043,10],[38.1761,13.15538,12],[38.16282,13.11345,80],[38.13384,13.07562,90],[38.09205,13.09636,127],[38.04536,13.05011,113],[38.01611,12.9803,120],[37.99858,12.91901,86],[37.96379,12.91117,62],[37.95199,12.85998,127],[37.94388,12.83542,248],[37.93886,12.83718,328],[37.94696,12.83233,240],[37.94275,12.78159,293],[37.92849,12.72436,162],[37.96472,12.62379,80],[38.00782,12.57587,34],[38.01298,12.53824,10],[38.01747,12.51669,10],[38.00392,12.53504,10],[37.95288,12.51528,20],[37.92561,12.50582,12],[37.89829,12.50325,11],[37.86684,12.51735,40],[37.80609,12.46192,20],[37.79751,12.43311,11],[37.77113,12.46328,10],[37.7416,12.48613,10],[37.71748,12.51572,20],[37.67567,12.58229,20],[37.64983,12.62144,40],[37.65506,12.7795,135],[37.66211,12.81025,123],[37.6196,12.84377,74],[37.58929,12.83764,41],[37.58292,12.83439,29],[37.59247,12.83914,46],[37.63239,12.89416,62],[37.59855,13.01211,150],[37.51981,13.07637,65],[37.50874,13.12722,79],[37.4949,13.17509,48],[37.49095,13.22327,40],[37.44006,13.24633,50],[37.39085,13.34627,95],[37.34831,13.38276,51],[37.32726,13.43803,120],[37.3094,13.47975,102],[37.29372,13.50736,20],[37.29423,13.53661,68],[37.29848,13.55234,82],[37.31661,13.56529,139],[37.31343,13.56982,224],[37.31214,13.57391,266],[37.31487,13.5703,224],[37.31813,13.59257,181],[37.30931,13.60802,109],[37.27233,13.63717,68],[37.25055,13.66568,60],[37.20743,13.70004,124],[37.1935,13.74427,89],[37.16195,13.80951,119],[37.13519,13.86528,20],[37.11457,13.9664,10],[37.11154,14.01724,20],[37.12082,14.07003,40],[37.11493,14.14542,27],[37.09635,14.17051,10],[37.08026,14.21551,10],[37.07174,14.23129,46],[37.06777,14.24752,50],[37.06482,14.26111,10],[37.08117,14.26599,13],[37.12631,14.30034,42],[37.17101,14.34206,94],[37.20189,14.37238,180],[37.23191,14.38173,293],[37.27107,14.38232,462],[37.31733,14.36795,542],[37.36075,14.35557,660],[37.37539,14.3631,680],[37.38591,14.3681,685],[37.37722,14.36824,704],[37.37196,14.38699,655],[37.36259,14.41016,590],[37.33934,14.42298,466],[37.32879,14.44521,460],[37.31628,14.44748,450],[37.29939,14.45976,341],[37.28967,14.48306,334],[37.27707,14.48128,422],[37.25265,14.51385,408],[37.22993,14.54138,509],[37.22507,14.55411,463],[37.20924,14.56186,420],[37.20155,14.60214,425],[37.19855,14.64473,470],[37.18917,14.70173,527],[37.1812,14.75442,646],[37.17034,14.76789,700],[37.16063,14.80924,721],[37.14376,14.83248,781],[37.13026,14.83726,789],[37.12571,14.84584,787],[37.12492,14.85512,865],[37.10831,14.87348,838],[37.09823,14.88065,752],[37.07962,14.88301,624],[37.06715,14.87677,520],[37.05329,14.89321,684],[37.04582,14.90343,679],[37.02435,14.92396,650],[37.0053,14.94935,641],[36.97488,14.97096,595],[36.95136,14.97765,582],[36.92862,14.9846,516],[36.92279,15.00783,441],[36.9162,15.02394,358],[36.9041,15.03596,231],[36.88845,15.04985,133],[36.8901,15.06476,100],[36.8842,15.07728,82],[36.87558,15.08324,51],[36.86374,15.09944,30],[36.90516,15.11759,68],[36.95594,15.17161,50],[37.03475,15.22241,16],[37.05538,15.22759,10],[37.06703,15.26332,10],[37.06813,15.28092,10],[37.0667,15.28396,10],[37.07402,15.26187,19],[37.07196,15.22483,23],[37.11854,15.19189,120],[37.18284,15.15322,110],[37.25398,15.14825,50],[37.30297,15.06798,30],[37.39568,15.03495,10],[37.4461,15.03072,18],[37.46243,15.04728,13],[37.45891,15.03271,21],[37.4939,15.02019,131],[37.52777,15.03274,196],[37.55114,15.0815,275],[37.58597,15.12504,319],[37.62301,15.1401,275],[37.68153,15.15921,220],[37.72225,15.17273,143],[37.76012,15.18071,130],[37.80502,15.2015,116],[37.82604,15.24884,41],[37.84871,15.27443,101],[37.86283,15.29557,40],[37.8593,15.29111,99],[37.85831,15.28918,159],[37.85041,15.28183,206],[37.85039,15.29339,176],[37.8573,15.28884,159],[37.85813,15.29017,110],[37.86194,15.2956,44],[37.8633,15.29455,60],[37.83767,15.25935,60],[37.8159,15.22141,68],[37.78467,15.18574,116],[37.74023,15.17423,150],[37.70404,15.16558,190],[37.70084,15.16609,199],[37.70009,15.14437,332],[37.70739,15.12541,488],[37.70246,15.11032,589],[37.69512,15.09816,653],[37.68686,15.09393,789],[37.68642,15.08706,929],[37.69671,15.07946,1059],[37.69439,15.06674,1207],[37.69681,15.05648,1334],[37.69652,15.04443,1460],[37.69836,15.02659,1677],[37.69895,15.00473,1897],[37.69902,15.00187,1891],[37.69765,15.01989,1732],[37.69654,15.03909,1499],[37.69833,15.05609,1354],[37.69605,15.06629,1231],[37.69625,15.076,1091],[37.68534,15.08764,934],[37.68791,15.09188,811],[37.69526,15.09732,663],[37.70286,15.11141,578],[37.70627,15.12928,441],[37.70054,15.14587,326],[37.7,15.16601,198],[37.70495,15.16746,188],[37.73582,15.17386,159],[37.78095,15.18461,113],[37.81564,15.2206,69],[37.83193,15.2548,48],[37.82451,15.26742,20],[37.81934,15.24969,24],[37.82636,15.22995,60],[37.83609,15.22556,60],[37.85157,15.20912,100],[37.87216,15.19223,126],[37.87999,15.17521,204],[37.87176,15.19114,128],[37.84882,15.21345,100],[37.85371,15.22535,85],[37.83753,15.23889,60],[37.82449,15.26487,27],[37.83126,15.26847,14],[37.84296,15.27961,10],[37.84673,15.27886,62],[37.84993,15.28,159],[37.85,15.28273,191],[37.85143,15.29548,178],[37.86076,15.28948,131],[37.86147,15.28958,80],[37.86552,15.29647,30],[37.88756,15.31339,41],[37.92165,15.34421,38],[37.95158,15.36823,50],[37.98222,15.39906,21],[38.00267,15.41993,39],[38.03426,15.44941,27],[38.06697,15.4817,30],[38.09262,15.49968,30],[38.12382,15.5162,24],[38.14733,15.51536,78],[38.17577,15.52205,145],[38.19824,15.53976,105],[38.22234,15.52538,226],[38.23931,15.49571,197],[38.25138,15.46894,82],[38.23706,15.4381,48],[38.22548,15.3983,30],[38.20503,15.34483,20],[38.19298,15.28156,37],[38.16638,15.21453,20],[38.13528,15.14578,10],[38.1132,15.07148,10],[38.14889,15.02523,18],[38.14863,14.97484,14],[38.16775,14.94351,92],[38.14713,14.8562,72],[38.14617,14.78855,90],[38.11824,14.7263,71],[38.08243,14.68227,79],[38.06081,14.62843,100],[38.04951,14.58351,110],[38.03186,14.51941,147],[38.02573,14.47746,111],[38.01861,14.39798,116],[38.00555,14.3304,109],[37.99895,14.26464,112],[38.00384,14.20955,135],[38.01236,14.11667,146],[38.02651,14.03163,182],[38.02848,14.01781,100],[38.03588,14.02299,41],[38.02835,14.01741,94],[38.02595,14.03142,189],[38.02365,13.97847,70],[38.00722,13.9301,46],[37.98186,13.85424,12],[37.96378,13.7545,55],[37.97532,13.68172,88],[38.00765,13.61906,30],[38.06061,13.52654,65],[38.08466,13.43658,33],[38.08712,13.34893,70],[38.10699,13.35365,36],[38.10943,13.32961,71],[38.09542,13.31154,110],[38.08319,13.29239,303],[38.09205,13.3067,134],[38.10219,13.32816,83],[38.13978,13.34099,33],[38.14889,13.35895,42],[38.15289,13.36472,109],[38.15356,13.36162,188],[38.15538,13.36261,252],[38.15972,13.35172,357],[38.16773,13.35025,428],[38.16385,13.35638,557],[38.16477,13.35295,500],[38.16248,13.3494,383],[38.1567,13.36083,308],[38.15458,13.36112,220],[38.15167,13.36419,130],[38.15235,13.36566,62],[38.14487,13.34629,30],[38.15487,13.31893,61],[38.19046,13.28244,47],[38.1987,13.26266,20],[38.18234,13.24371,25],[38.16834,13.17325,6],[38.19051,13.1213,10],[38.18811,13.11106,10],[38.17826,13.10354,17],[38.17489,13.09273,14]]

const waypoints = [
  { lat: 38.111, lon: 13.352, label: 'Palermo', day: 1 },
  { lat: 37.939, lon: 12.839, label: 'Segesta', day: 1 },
  { lat: 38.017, lon: 12.516, label: 'Trapani / Érice', day: 1 },
  { lat: 37.798, lon: 12.434, label: 'Marsala', day: 1 },
  { lat: 37.589, lon: 12.825, label: 'Selinunte', day: 2 },
  { lat: 37.312, lon: 13.575, label: 'Agrigento', day: 2 },
  { lat: 37.066, lon: 14.250, label: 'Gela', day: 3 },
  { lat: 37.386, lon: 14.367, label: 'Piazza Armerina', day: 3 },
  { lat: 36.891, lon: 15.071, label: 'Noto', day: 3 },
  { lat: 37.065, lon: 15.291, label: 'Siracusa', day: 4 },
  { lat: 37.460, lon: 15.050, label: 'Catania', day: 4 },
  { lat: 37.851, lon: 15.283, label: 'Taormina', day: 4 },
  { lat: 37.699, lon: 15.002, label: 'Ätna (1.900m)', day: 5 },
  { lat: 37.821, lon: 15.251, label: 'Alcantara', day: 5 },
  { lat: 37.880, lon: 15.174, label: 'Messina', day: 6 },
  { lat: 38.035, lon: 14.024, label: 'Cefalù', day: 6 },
  { lat: 38.083, lon: 13.292, label: 'Monreale', day: 7 },
  { lat: 38.166, lon: 13.354, label: 'Monte Pellegrino', day: 7 },
  { lat: 38.177, lon: 13.092, label: 'Flughafen PMO', day: 8 },
]

const dayColors: Record<number, string> = {
  1: '#B8860B', 2: '#2C6E9E', 3: '#2D6B4A', 4: '#8B3A3A',
  5: '#7B6B52', 6: '#1A5276', 7: '#8B6914', 8: '#5B2D8A',
}

const daySegments: { day: number; start: number; end: number }[] = [
  { day: 1, start: 0, end: 30 },
  { day: 2, start: 30, end: 60 },
  { day: 3, start: 60, end: 127 },
  { day: 4, start: 127, end: 155 },
  { day: 5, start: 155, end: 218 },
  { day: 6, start: 218, end: 265 },
  { day: 7, start: 265, end: 298 },
  { day: 8, start: 298, end: 304 },
]

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Pulsing red dot for current GPS position
const gpsIcon = L.divIcon({
  className: 'gps-pulse-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  html: '<div class="gps-dot"><div class="gps-pulse"></div></div>',
})

function HoverMarker({ position }: { position: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    // Don't pan the whole map, just show the marker
  }, [position, map])
  return (
    <CircleMarker
      center={position}
      radius={9}
      fillColor="#ff4444"
      fillOpacity={1}
      color="#fff"
      weight={3}
    />
  )
}

export default function RouteMap() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [gpsPos, setGpsPos] = useState<[number, number] | null>(null)
  const [gpsError, setGpsError] = useState('')
  const [showGps, setShowGps] = useState(false)

  const chartData = useMemo(() => {
    let totalDist = 0
    return routePath.map(([lat, lon, ele], i) => {
      if (i > 0) totalDist += haversine(routePath[i - 1][0], routePath[i - 1][1], lat, lon)
      let closest = ''
      let minDist = Infinity
      let day = 1
      for (const wp of waypoints) {
        const d = haversine(lat, lon, wp.lat, wp.lon)
        if (d < minDist) { minDist = d; closest = wp.label; day = wp.day }
      }
      for (const seg of daySegments) {
        if (i >= seg.start && i <= seg.end) { day = seg.day; break }
      }
      return { km: Math.round(totalDist), ele, label: minDist < 5 ? closest : '', idx: i, day }
    })
  }, [])

  const totalKm = chartData[chartData.length - 1].km
  const activePoint = hoverIdx !== null ? routePath[hoverIdx] : null

  const handleChartHover = useCallback((e: any) => {
    if (e?.activePayload?.[0]?.payload) setHoverIdx(e.activePayload[0].payload.idx)
  }, [])

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('GPS nicht verfügbar')
      return
    }
    setShowGps(true)
    setGpsError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => setGpsPos([pos.coords.latitude, pos.coords.longitude]),
      () => setGpsError('Position konnte nicht ermittelt werden'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  return (
    <div className="route-map-container">
      <div className="route-map-wrapper">
        <MapContainer
          center={[37.6, 14.3]}
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: '420px', width: '100%', borderRadius: '12px 12px 0 0' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {daySegments.map(seg => (
            <Polyline
              key={seg.day}
              positions={routePath.slice(seg.start, seg.end + 1).map(([lat, lon]) => [lat, lon] as [number, number])}
              color={dayColors[seg.day]}
              weight={4}
              opacity={0.85}
            />
          ))}
          {activePoint && <HoverMarker position={[activePoint[0], activePoint[1]]} />}
          {waypoints.map((wp, i) => (
            <CircleMarker
              key={i}
              center={[wp.lat, wp.lon]}
              radius={6}
              fillColor={dayColors[wp.day]}
              fillOpacity={0.9}
              color="#fff"
              weight={2}
            >
              <Popup><strong>{wp.label}</strong><br />Tag {wp.day}</Popup>
            </CircleMarker>
          ))}
          {showGps && gpsPos && (
            <Marker position={gpsPos} icon={gpsIcon}>
              <Popup>Aktuelle Position</Popup>
            </Marker>
          )}
        </MapContainer>

        <div className="route-elevation">
          <div className="route-elevation-header">
            <span className="route-elevation-title">Höhenprofil</span>
            <span className="route-elevation-info">
              {activePoint
                ? `${chartData[hoverIdx!]?.label || ''} · ${activePoint[2]} m · km ${chartData[hoverIdx!]?.km}`
                : `Gesamtstrecke: ca. ${totalKm} km`
              }
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart
              data={chartData}
              onMouseMove={handleChartHover}
              onMouseLeave={() => setHoverIdx(null)}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="eleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B8860B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#B8860B" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="km" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}`} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}m`} width={45} />
              <Tooltip
                formatter={(v: any) => [`${v} m ü.M.`, 'Höhe']}
                labelFormatter={(km: any) => {
                  const pt = chartData.find(d => d.km === km)
                  return pt?.label ? `${pt.label} (km ${km})` : `km ${km}`
                }}
                contentStyle={{ fontSize: '0.85rem', borderRadius: 8, border: '1px solid #B8860B' }}
              />
              <Area type="monotone" dataKey="ele" stroke="#B8860B" strokeWidth={2} fill="url(#eleGrad)" />
              {hoverIdx !== null && chartData[hoverIdx] && (
                <ReferenceDot x={chartData[hoverIdx].km} y={chartData[hoverIdx].ele} r={5} fill="#ff4444" stroke="#fff" strokeWidth={2} />
              )}
            </AreaChart>
          </ResponsiveContainer>
          <div className="route-bottom-bar">
            <div className="route-day-legend">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(d => (
                <span key={d} className="route-day-chip" style={{ background: dayColors[d] }}>Tag {d}</span>
              ))}
            </div>
            <button className="gps-button" onClick={locateMe} title="Aktuelle Position anzeigen">
              📍 Mein Standort
            </button>
          </div>
          {gpsError && <div className="gps-error">{gpsError}</div>}
        </div>
      </div>
    </div>
  )
}
