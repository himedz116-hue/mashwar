import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getOrders, showOrder, Order } from '@/lib/meshwarApi';
import { 
  Map as MapIcon, Layers, TrendingUp, Activity, CheckCircle, 
  MapPin, Navigation2, Target, Users, Truck,
  Star, X, Phone, Mail, Calendar, Shield, ChevronDown, ChevronUp,
  Car, Hash, CreditCard, Clock, MapPinned, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '@/lib/meshwarApi';

// Custom icons
const createIcon = (color: string) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const icons = {
  active: createIcon('#3b82f6'), // Blue for active
  completed: createIcon('#22c55e'), // Green for completed
  pending: createIcon('#f59e0b'), // Amber for pending
  canceled: createIcon('#ef4444'), // Red for canceled
  default: createIcon('#6b7280'),
};

const getIconForStatus = (status?: string) => {
  if (status === 'completed') return icons.completed;
  if (status === 'active' || status === 'accepted') return icons.active;
  if (status === 'pending') return icons.pending;
  if (status === 'canceled') return icons.canceled;
  return icons.default;
};

// Heatmap bounds helper
function MapBounds({ markers }: { markers: {lat: number, lng: number}[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [markers, map]);
  return null;
}

// Fetch road route from OSRM
async function fetchRoute(fromLat: number, fromLng: number, toLat: number, toLng: number): Promise<[number,number][]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.routes?.[0]?.geometry?.coordinates) {
      return json.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number,number]);
    }
  } catch { /* fallback */ }
  return [[fromLat, fromLng], [toLat, toLng]];
}

// Helper to get image URL
function getImgUrl(path?: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}/${path}`;
}

// Reusable info row
function InfoRow({ icon, label, value, dir }: { icon: React.ReactNode; label: string; value?: string; dir?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-gray-800 truncate" dir={dir}>{value}</p>
      </div>
    </div>
  );
}

export function OrdersMapDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number,number][]>([]);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showDriver, setShowDriver] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOrders()
      .then(async (res: any) => {
        const list: Order[] = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        if (list.length === 0) { setOrders([]); return; }

        // Fetch full details for each order (in parallel) to get coordinates
        const detailed = await Promise.all(
          list.map(async (o) => {
            try {
              const detail: any = await showOrder(o.uuid);
              const d = detail.data || detail;
              return { ...o, ...d };
            } catch {
              return o; // Keep original if detail fetch fails
            }
          })
        );
        setOrders(detailed);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Fetch road route when an order is selected
  useEffect(() => {
    if (selectedOrder?.lat_from && selectedOrder?.lng_from && selectedOrder?.lat_to && selectedOrder?.lng_to) {
      setRouteCoords([]);
      fetchRoute(Number(selectedOrder.lat_from), Number(selectedOrder.lng_from), Number(selectedOrder.lat_to), Number(selectedOrder.lng_to))
        .then(setRouteCoords);
    } else {
      setRouteCoords([]);
    }
    setShowCustomer(false);
    setShowDriver(false);
  }, [selectedOrder]);

  const validOrders = useMemo(() => orders.filter(o => {
    const lat = Number(o.lat_from);
    const lng = Number(o.lng_from);
    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  }), [orders]);

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return validOrders;
    if (filter === 'active') return validOrders.filter(o => o.status !== 'completed' && o.status !== 'canceled');
    if (filter === 'completed') return validOrders.filter(o => o.status === 'completed');
    return validOrders;
  }, [validOrders, filter]);

  // Statistics
  const stats = useMemo(() => {
    const total = validOrders.length;
    const active = validOrders.filter(o => o.status !== 'completed' && o.status !== 'canceled').length;
    const completed = validOrders.filter(o => o.status === 'completed').length;
    const avgPrice = validOrders.reduce((acc, curr) => acc + Number(curr.price || 0), 0) / (total || 1);
    
    // Simple Hotspot Calculation (most frequent city name if available)
    const locations = validOrders.map(o => o.location_from?.split(',')[0] || 'غير معروف').filter(Boolean);
    const counts = locations.reduce((acc, val) => { acc[val] = (acc[val] || 0) + 1; return acc; }, {} as Record<string, number>);
    const hotspot = Object.entries(counts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'لا يوجد';

    return { total, active, completed, avgPrice, hotspot };
  }, [validOrders]);

  return (
    <div className="mt-12 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[800px] relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gradient-to-r from-gray-50 to-white z-10 relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F4A10] to-[#2A6A14] flex items-center justify-center shadow-lg shadow-[#1F4A10]/20">
            <MapIcon className="w-6 h-6 text-[#D4EDA8]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1F4A10]">غرفة العمليات الجغرافية</h2>
            <p className="text-sm text-gray-500 font-bold mt-1">تتبع وتحليل أماكن الطلبات الحية والمكتملة</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center p-1 bg-gray-100/80 rounded-xl backdrop-blur-sm border border-gray-200">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>الكل</button>
          <button onClick={() => setFilter('active')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>النشطة الآن</button>
          <button onClick={() => setFilter('completed')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'completed' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>المكتملة</button>
        </div>
      </div>

      {/* 6 Features Insight Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-0 border-b border-gray-100 bg-white z-10 relative divide-x divide-gray-100 rtl:divide-x-reverse">
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <Target className="w-5 h-5 text-gray-400 mb-2" />
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">إجمالي الطلبات</p>
          <p className="text-xl font-black text-gray-800">{stats.total}</p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <Activity className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">طلبات نشطة</p>
          <p className="text-xl font-black text-blue-600">{stats.active}</p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">مكتملة</p>
          <p className="text-xl font-black text-green-600">{stats.completed}</p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-5 h-5 text-purple-500 mb-2" />
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">متوسط التكلفة</p>
          <p className="text-xl font-black text-purple-600">{stats.avgPrice.toFixed(0)} ر.س</p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <Layers className="w-5 h-5 text-orange-500 mb-2" />
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">أكثر مكان طلباً</p>
          <p className="text-sm font-black text-orange-600 truncate w-full px-2">{stats.hotspot}</p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <MapPin className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">المناطق المغطاة</p>
          <p className="text-xl font-black text-red-600">{Object.keys(validOrders.reduce((a,c)=>({...a, [c.location_from||'']:1}),{})).length}</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm z-10">
            <div className="w-10 h-10 border-4 border-[#1F4A10]/20 border-t-[#1F4A10] rounded-full animate-spin" />
          </div>
        ) : (
          <MapContainer 
            center={[24.7136, 46.6753]} // Riyadh default
            zoom={6} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {filteredOrders.length > 0 && <MapBounds markers={filteredOrders.map(o => ({lat: Number(o.lat_from), lng: Number(o.lng_from)}))} />}
            
            {filteredOrders.map(order => (
              <React.Fragment key={order.uuid}>
                <Marker 
                  position={[Number(order.lat_from), Number(order.lng_from)]}
                  icon={getIconForStatus(order.status)}
                  eventHandlers={{ click: () => setSelectedOrder(order) }}
                />
                {/* Destination marker */}
                {selectedOrder?.uuid === order.uuid && order.lat_to && order.lng_to && (
                  <Marker
                    position={[Number(order.lat_to), Number(order.lng_to)]}
                    icon={createIcon('#ef4444')}
                  />
                )}
              </React.Fragment>
            ))}
            {/* Real road route */}
            {routeCoords.length > 1 && (
              <Polyline
                positions={routeCoords}
                color="#1F4A10"
                weight={4}
                opacity={0.85}
              />
            )}
          </MapContainer>
        )}

        {/* 360 Degree View Sidebar */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[400px] max-w-full bg-white/95 backdrop-blur-xl shadow-2xl border-l border-white/20 z-[400] overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xl text-gray-800 flex items-center gap-2">
                    <Navigation2 className="w-5 h-5 text-[#679632]" />
                    تفاصيل الرحلة
                  </h3>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Status Card */}
                <div className="bg-gradient-to-br from-[#1F4A10] to-[#2A6A14] rounded-2xl p-5 text-white shadow-xl shadow-[#1F4A10]/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">رقم الطلب</p>
                      <p className="font-black text-lg">#{selectedOrder.uuid.split('-')[0]}</p>
                    </div>
                    <div className="bg-white/20 px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-md">
                      {selectedOrder.status === 'completed' ? 'مكتمل' : selectedOrder.status === 'active' ? 'نشط' : selectedOrder.status || 'مجهول'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-2">
                    <div>
                      <p className="text-white/60 text-[10px] font-bold uppercase mb-1">السعر</p>
                      <p className="font-black">{selectedOrder.price || 0} ر.س</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] font-bold uppercase mb-1">المسافة</p>
                      <p className="font-black">{selectedOrder.distance || 0} كم</p>
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div className="space-y-4 relative before:absolute before:right-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
                  <div className="flex gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-[#1F4A10] border-4 border-white shadow-sm flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 mb-1">نقطة الانطلاق</p>
                      <p className="text-sm font-bold text-gray-800 leading-relaxed">{selectedOrder.location_from || selectedOrder.from_address || 'غير متوفر'}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-red-500 border-4 border-white shadow-sm flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 mb-1">نقطة الوصول</p>
                      <p className="text-sm font-bold text-gray-800 leading-relaxed">{selectedOrder.location_to || selectedOrder.to_address || 'غير متوفر'}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Button */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <button onClick={() => setShowCustomer(!showCustomer)} className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-wider">معلومات العميل</p>
                        <p className="font-black text-gray-800 text-sm">{selectedOrder.user?.name || 'غير متوفر'}</p>
                      </div>
                    </div>
                    {showCustomer ? <ChevronUp className="w-5 h-5 text-blue-500" /> : <ChevronDown className="w-5 h-5 text-blue-500" />}
                  </button>
                  <AnimatePresence>
                    {showCustomer && selectedOrder.user && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-4 bg-white space-y-2.5 border-t border-gray-100">
                          {selectedOrder.user.image && (
                            <div className="flex justify-center mb-3">
                              <img src={getImgUrl(selectedOrder.user.image)} className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 shadow-md" />
                            </div>
                          )}
                          <InfoRow icon={<Hash className="w-4 h-4" />} label="UUID" value={selectedOrder.user.uuid} />
                          <InfoRow icon={<Phone className="w-4 h-4" />} label="الهاتف" value={selectedOrder.user.mobile || selectedOrder.user.phone} dir="ltr" />
                          <InfoRow icon={<Mail className="w-4 h-4" />} label="البريد" value={selectedOrder.user.email} dir="ltr" />
                          <InfoRow icon={<Shield className="w-4 h-4" />} label="الحالة" value={selectedOrder.user.status} />
                          <InfoRow icon={<Calendar className="w-4 h-4" />} label="تاريخ التسجيل" value={selectedOrder.user.created_at} />
                          <InfoRow icon={<Star className="w-4 h-4" />} label="التقييم" value={selectedOrder.user.rating != null ? String(selectedOrder.user.rating) : undefined} />
                          <InfoRow icon={<Navigation2 className="w-4 h-4" />} label="عدد الرحلات" value={selectedOrder.user.trips_count != null ? String(selectedOrder.user.trips_count) : undefined} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Driver Button */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <button onClick={() => setShowDriver(!showDriver)} className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-orange-600/70 uppercase tracking-wider">معلومات السائق</p>
                        <p className="font-black text-gray-800 text-sm">{selectedOrder.driver?.name || 'لم يحدد بعد'}</p>
                      </div>
                    </div>
                    {showDriver ? <ChevronUp className="w-5 h-5 text-orange-500" /> : <ChevronDown className="w-5 h-5 text-orange-500" />}
                  </button>
                  <AnimatePresence>
                    {showDriver && selectedOrder.driver && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-4 bg-white space-y-2.5 border-t border-gray-100">
                          {selectedOrder.driver.image && (
                            <div className="flex justify-center mb-3">
                              <img src={getImgUrl(selectedOrder.driver.image)} className="w-16 h-16 rounded-full object-cover border-4 border-orange-100 shadow-md" />
                            </div>
                          )}
                          <InfoRow icon={<Hash className="w-4 h-4" />} label="UUID" value={selectedOrder.driver.uuid} />
                          <InfoRow icon={<Phone className="w-4 h-4" />} label="الهاتف" value={selectedOrder.driver.mobile || selectedOrder.driver.phone} dir="ltr" />
                          <InfoRow icon={<Mail className="w-4 h-4" />} label="البريد" value={selectedOrder.driver.email} dir="ltr" />
                          <InfoRow icon={<Star className="w-4 h-4" />} label="التقييم" value={String((selectedOrder.driver as any).rating_avg ?? selectedOrder.driver.rating ?? '0')} />
                          <InfoRow icon={<Navigation2 className="w-4 h-4" />} label="عدد الرحلات" value={selectedOrder.driver.trips_count != null ? String(selectedOrder.driver.trips_count) : undefined} />
                          <InfoRow icon={<Shield className="w-4 h-4" />} label="الحالة" value={selectedOrder.driver.is_accepted ? 'مقبول ✅' : (selectedOrder.driver.status || 'غير محدد')} />
                          <InfoRow icon={<Car className="w-4 h-4" />} label="السيارة" value={(selectedOrder.driver as any).car_name || selectedOrder.driver.car?.name || undefined} />
                          <InfoRow icon={<CreditCard className="w-4 h-4" />} label="رخصة القيادة" value={selectedOrder.driver.license} />
                          <InfoRow icon={<Calendar className="w-4 h-4" />} label="تاريخ الميلاد" value={selectedOrder.driver.date_of_birth || selectedOrder.driver.dob} />
                          <InfoRow icon={<CreditCard className="w-4 h-4" />} label="الرصيد" value={selectedOrder.driver.balance != null ? `${selectedOrder.driver.balance} ر.س` : undefined} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
