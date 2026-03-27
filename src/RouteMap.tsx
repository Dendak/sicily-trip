import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts'
import 'leaflet/dist/leaflet.css'

// GPX route points with elevation data - the complete Sicily trip route
const routePoints = [
  { lat: 38.111227, lon: 13.352443, ele: 48, label: 'Palermo', day: 1 },
  { lat: 37.938649, lon: 12.838504, ele: 346, label: 'Segesta', day: 1 },
  { lat: 38.017396, lon: 12.516022, ele: 11, label: 'Trapani / Érice', day: 1 },
  { lat: 37.797922, lon: 12.434209, ele: 14, label: 'Marsala', day: 1 },
  { lat: 37.588426, lon: 12.824651, ele: 38, label: 'Selinunte', day: 2 },
  { lat: 37.312299, lon: 13.574650, ele: 277, label: 'Agrigento', day: 2 },
  { lat: 37.066436, lon: 14.250244, ele: 46, label: 'Gela', day: 3 },
  { lat: 37.385946, lon: 14.367174, ele: 685, label: 'Piazza Armerina', day: 3 },
  { lat: 36.890886, lon: 15.070645, ele: 118, label: 'Noto', day: 3 },
  { lat: 37.064614, lon: 15.290720, ele: 1, label: 'Siracusa', day: 4 },
  { lat: 37.460446, lon: 15.049617, ele: 12, label: 'Catania', day: 4 },
  { lat: 37.851222, lon: 15.283019, ele: 217, label: 'Taormina', day: 4 },
  { lat: 37.751025, lon: 14.994032, ele: 1900, label: 'Ätna (1.900m)', day: 5 },
  { lat: 37.821356, lon: 15.251174, ele: 28, label: 'Alcantara-Schlucht', day: 5 },
  { lat: 37.879603, lon: 15.174145, ele: 171, label: 'Messina', day: 6 },
  { lat: 38.034957, lon: 14.024456, ele: 85, label: 'Cefalù', day: 6 },
  { lat: 38.111227, lon: 13.352443, ele: 48, label: 'Palermo', day: 7 },
  { lat: 38.082632, lon: 13.291993, ele: 306, label: 'Monreale', day: 7 },
  { lat: 38.166110, lon: 13.353803, ele: 589, label: 'Monte Pellegrino', day: 7 },
  { lat: 38.176517, lon: 13.091643, ele: 10, label: 'Flughafen PMO', day: 8 },
]

const dayColors: Record<number, string> = {
  1: '#B8860B', 2: '#2C6E9E', 3: '#2D6B4A', 4: '#8B3A3A',
  5: '#7B6B52', 6: '#1A5276', 7: '#8B6914', 8: '#5B2D8A',
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  map.setView(center, map.getZoom(), { animate: true })
  return null
}

export default function RouteMap() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const chartData = useMemo(() => {
    let totalDist = 0
    return routePoints.map((p, i) => {
      if (i > 0) totalDist += haversine(routePoints[i - 1].lat, routePoints[i - 1].lon, p.lat, p.lon)
      return { km: Math.round(totalDist), ele: Math.round(p.ele), label: p.label, day: p.day, idx: i }
    })
  }, [])

  const totalKm = chartData[chartData.length - 1].km
  const activePoint = hoverIdx !== null ? routePoints[hoverIdx] : null
  const mapCenter: [number, number] = activePoint ? [activePoint.lat, activePoint.lon] : [37.6, 14.3]

  return (
    <div className="route-map-container">
      <div className="route-map-wrapper">
        <MapContainer
          center={[37.6, 14.3]}
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: '400px', width: '100%', borderRadius: '12px 12px 0 0' }}
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {activePoint && <MapUpdater center={mapCenter} />}
          <Polyline
            positions={routePoints.map(p => [p.lat, p.lon] as [number, number])}
            color="#B8860B"
            weight={3}
            opacity={0.7}
          />
          {routePoints.map((p, i) => (
            <CircleMarker
              key={i}
              center={[p.lat, p.lon]}
              radius={hoverIdx === i ? 10 : 5}
              fillColor={dayColors[p.day] || '#B8860B'}
              fillOpacity={hoverIdx === i ? 1 : 0.8}
              color={hoverIdx === i ? '#fff' : '#2C3E50'}
              weight={hoverIdx === i ? 3 : 1}
            >
              <Popup>
                <strong>{p.label}</strong><br />
                Tag {p.day} · {p.ele} m ü.M.
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        <div className="route-elevation">
          <div className="route-elevation-header">
            <span className="route-elevation-title">Höhenprofil</span>
            <span className="route-elevation-info">
              {activePoint
                ? `${activePoint.label} · Tag ${activePoint.day} · ${activePoint.ele} m`
                : `Gesamtstrecke: ca. ${totalKm} km`
              }
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart
              data={chartData}
              onMouseMove={(e: any) => {
                if (e?.activePayload?.[0]?.payload) setHoverIdx(e.activePayload[0].payload.idx)
              }}
              onMouseLeave={() => setHoverIdx(null)}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="eleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B8860B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#B8860B" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="km" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v} km`} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}m`} width={50} />
              <Tooltip
                formatter={(v: any) => [`${v} m`, 'Höhe']}
                labelFormatter={(km: any) => {
                  const pt = chartData.find(d => d.km === km)
                  return pt ? `${pt.label} (${km} km)` : `${km} km`
                }}
                contentStyle={{ fontSize: '0.85rem', borderRadius: 8, border: '1px solid #B8860B' }}
              />
              <Area type="monotone" dataKey="ele" stroke="#B8860B" strokeWidth={2} fill="url(#eleGrad)" />
              {hoverIdx !== null && chartData[hoverIdx] && (
                <ReferenceDot
                  x={chartData[hoverIdx].km}
                  y={chartData[hoverIdx].ele}
                  r={6}
                  fill="#B8860B"
                  stroke="#fff"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
          <div className="route-day-legend">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(d => (
              <span key={d} className="route-day-chip" style={{ background: dayColors[d] }}>
                Tag {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
