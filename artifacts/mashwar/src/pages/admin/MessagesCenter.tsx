import { useState, useEffect, useRef } from "react";
import { getMessageUsers, getMessages, sendMessage, getOrders, getImageUrl, type MsgUser, type Message, type Order } from "@/lib/meshwarApi";
import {
  MessageSquare, Search, Send, RefreshCw, Phone, User,
  Smartphone, Apple, Truck, X, Circle, Clock, ChevronLeft,
  AlertCircle, Users, Car, Star, Info, MapPin, Navigation, Calendar, MoreVertical, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Avatar({ name, avatar, online, size = 12 }: { name?: string; avatar?: string; online?: boolean; size?: number }) {
  const px = size * 4;
  return (
    <div className="relative flex-shrink-0">
      {avatar
        ? <img src={getImageUrl(avatar)} className={`w-${size} h-${size} rounded-full object-cover shadow-md ring-2 ring-white`} />
        : (
          <div
            className={`w-${size} h-${size} rounded-full flex items-center justify-center shadow-md ring-2 ring-white`}
            style={{ background: "linear-gradient(135deg, #5aa526 0%, #1F4A10 100%)" }}
          >
            <span className="font-black text-white select-none" style={{ fontSize: `${px * 0.42}px`, lineHeight: 1 }}>{(name ?? "؟")[0]}</span>
          </div>
        )}
      {online !== undefined && (
        <span className={`absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full border-[3px] border-white shadow-sm ${online ? "bg-emerald-500" : "bg-gray-300"}`} />
      )}
    </div>
  );
}

export default function MessagesCenter() {
  const [type, setType] = useState<"user" | "driver">("user");
  const [users, setUsers] = useState<MsgUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<MsgUser | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [sending, setSending] = useState(false);
  
  const [msgText, setMsgText] = useState("");
  const [search, setSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [error, setError] = useState("");
  
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_REPLIES = [
    "شكراً لتواصلك معنا، سنرد قريباً.",
    "جاري مراجعة طلبك.",
    "تمت المعالجة بنجاح.",
    "نعتذر عن الإزعاج، يتم حل المشكلة الآن.",
    "الرجاء تزويدنا برقم الطلب للمتابعة."
  ];

  const loadUsers = (t = type, q = search) => {
    setLoadingUsers(true);
    getMessageUsers(t, q)
      .then((r) => setUsers(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  };
  useEffect(() => { loadUsers(); }, []);

  const loadMessages = (uuid: string, background = false) => {
    if (!background) setLoadingMsgs(true);
    getMessages(uuid)
      .then((r) => setMessages(r.data ?? []))
      .catch((e) => { if (!background) setError(e.message); })
      .finally(() => { if (!background) setLoadingMsgs(false); });
  };

  const loadOrders = (uuid: string, userType: "user" | "driver") => {
    setLoadingOrders(true);
    const params = userType === "user" ? { user_uuid: uuid } : { driver_uuid: uuid };
    getOrders(params)
      .then((r) => setUserOrders((r.data ?? []).slice(0, 5))) // Get last 5 orders
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selected) return;
    const interval = setInterval(() => loadMessages(selected.uuid, true), 3000);
    return () => clearInterval(interval);
  }, [selected]);

  const handleSelectUser = (u: MsgUser) => {
    setSelected(u); 
    setError(""); 
    setMobileShowChat(true);
    setShowInfoPanel(false); // Hide info panel by default on new selection
    loadMessages(u.uuid);
    loadOrders(u.uuid, type);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || !selected || sending) return;
    setSending(true);
    const text = msgText.trim(); setMsgText("");
    try {
      await sendMessage({ user_uuid: selected.uuid, message: text });
      loadMessages(selected.uuid);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "فشل الإرسال"); }
    finally { setSending(false); }
  };

  const handleTypeSwitch = (t: "user" | "driver") => {
    setType(t); setSelected(null); setMessages([]); setSearch(""); setMobileShowChat(false); setShowInfoPanel(false);
    loadUsers(t, "");
  };

  const filteredUsers = users.filter((u) =>
    !userSearch || u.name?.includes(userSearch) || u.phone?.includes(userSearch)
  );

  const unreadTotal = users.reduce((s, u) => s + (u.unread_count ?? 0), 0);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1F4A10]">مركز الرسائل والدعم</h2>
          <p className="text-sm text-gray-500 mt-1">تواصل مباشر مع العملاء والسائقين وحل المشكلات</p>
        </div>
        <div className="flex gap-2 items-center">
          {unreadTotal > 0 && (
            <span className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-bold animate-pulse border border-red-200 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> {unreadTotal} غير مقروء
            </span>
          )}
          <button onClick={() => loadUsers()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1F4A10] text-sm font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95">
            <RefreshCw className="w-4 h-4" /> تحديث القائمة
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex" style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}>
        
        {/* Sidebar (Conversations List) */}
        <div className={`${mobileShowChat ? "hidden" : "flex"} md:flex flex-col border-l border-gray-100 md:w-80 lg:w-96 w-full flex-shrink-0 bg-gray-50/50`}>
          
          {/* Type toggles */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1.5">
              <button onClick={() => handleTypeSwitch("user")}
                className={`flex items-center gap-2 flex-1 justify-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${type === "user" ? "bg-white shadow-sm text-blue-700" : "text-gray-500 hover:text-gray-700"}`}>
                <User className="w-4 h-4" /> العملاء
              </button>
              <button onClick={() => handleTypeSwitch("driver")}
                className={`flex items-center gap-2 flex-1 justify-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${type === "driver" ? "bg-white shadow-sm text-green-700" : "text-gray-500 hover:text-gray-700"}`}>
                <Truck className="w-4 h-4" /> السائقون
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                placeholder="البحث بالاسم أو رقم الجوال..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-gray-100 border-none text-sm outline-none focus:ring-2 focus:ring-[#D4EDA8] transition-all" />
              {userSearch && <button onClick={() => setUserSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"><X className="w-3 h-3 text-gray-500" /></button>}
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto custom-scroll">
            {loadingUsers ? (
              <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" /></div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Users className="w-12 h-12 mb-3 opacity-20" />
                <p className="font-bold">لا توجد محادثات سابقة</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredUsers.map((u) => (
                  <button key={u.uuid} onClick={() => handleSelectUser(u)}
                    className={`w-full flex items-start gap-4 p-4 hover:bg-white transition-all text-right border-r-4 ${selected?.uuid === u.uuid ? "bg-white border-[#679632] shadow-sm" : "border-transparent"}`}>
                    <Avatar name={u.name} avatar={u.avatar} size={12} online={(u.unread_count ?? 0) > 0 ? true : undefined} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-bold truncate text-sm ${selected?.uuid === u.uuid ? "text-[#1F4A10]" : "text-gray-800"}`}>{u.name}</p>
                        {(u.unread_count ?? 0) > 0 && (
                          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0 shadow-sm animate-pulse">
                            {u.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 font-mono"><Phone className="w-3 h-3" />{u.phone}</p>
                      {u.last_message && (
                        <p className={`text-xs truncate mt-1.5 ${(u.unread_count ?? 0) > 0 ? "font-bold text-gray-800" : "text-gray-500"}`}>{u.last_message}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${mobileShowChat ? "flex" : "hidden"} md:flex flex-col flex-1 min-w-0 bg-[#FAFEF6] relative`}>
          {selected ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-4 p-4 border-b border-gray-100 bg-white shadow-sm z-10">
                <button className="md:hidden p-2 bg-gray-100 rounded-xl" onClick={() => setMobileShowChat(false)}>
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <Avatar name={selected.name} avatar={selected.avatar} size={12} />
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-black text-lg text-[#1F4A10]">{selected.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-500 flex items-center gap-1 font-mono"><Phone className="w-3 h-3 text-gray-400" />{selected.phone}</p>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${type === 'driver' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {type === 'driver' ? 'سائق' : 'عميل'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => loadMessages(selected.uuid)} className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors tooltip" title="تحديث المحادثة">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowInfoPanel(!showInfoPanel)} className={`hidden lg:flex p-2.5 rounded-xl border transition-colors ${showInfoPanel ? 'bg-[#1F4A10] text-white border-[#1F4A10]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`} title="معلومات الملف">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative custom-scroll">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1F4A10 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {loadingMsgs ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" /></div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center mb-4 shadow-sm">
                      <MessageSquare className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-base font-bold text-gray-500">لا توجد رسائل سابقة</p>
                    <p className="text-sm mt-1">ابدأ المحادثة الآن عن طريق إرسال رسالة</p>
                  </div>
                ) : messages.map((m, index) => {
                  const isLast = index === messages.length - 1;
                  
                  if (m.content_type === "date") {
                    return (
                      <div key={m.uuid} className="flex justify-center my-4 relative z-10">
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs font-bold shadow-sm">
                          {m.created_at}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={m.uuid} className={`flex ${m.is_admin ? "justify-start" : "justify-end"} relative z-10`}>
                      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm relative ${
                        m.is_admin
                          ? "bg-white border border-gray-100 text-gray-800 rounded-tr-sm"
                          : "bg-[#1F4A10] text-white rounded-tl-sm"
                      }`}>
                        {m.content_type === "image" ? (
                          <a href={getImageUrl(m.message)} target="_blank" rel="noreferrer">
                            <img src={getImageUrl(m.message)} className="max-w-full h-auto rounded-xl object-contain max-h-64" />
                          </a>
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.message}</p>
                        )}
                        <div className={`flex items-center justify-end gap-1.5 mt-2 ${m.is_admin ? "text-gray-400" : "text-white/60"}`}>
                          {m.is_admin && <span className="text-[10px] font-bold text-[#679632]">الرد الإداري</span>}
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-mono">{m.created_at}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
                {error && (
                  <div className="bg-red-50 rounded-xl p-3 text-red-600 text-sm font-bold flex items-center gap-2 border border-red-100 w-max mx-auto shadow-sm relative z-10">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                  </div>
                )}
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-gray-100 flex flex-col z-10 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.02)]">
                {/* Quick Replies */}
                <div className="px-4 py-3 border-b border-gray-50 flex gap-2 overflow-x-auto custom-scroll">
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 flex-shrink-0"><Zap className="w-3 h-3"/> ردود سريعة:</span>
                  {QUICK_REPLIES.map((r, i) => (
                    <button key={i} onClick={() => setMsgText(r)}
                      className="flex-shrink-0 text-xs bg-[#F6FAF0] text-[#1F4A10] border border-[#D4EDA8] px-3 py-1.5 rounded-xl hover:bg-[#D4EDA8] transition-colors font-bold shadow-sm whitespace-nowrap">
                      {r}
                    </button>
                  ))}
                </div>
                {/* Input Box */}
                <form onSubmit={handleSend} className="flex items-end gap-3 p-4">
                  <div className="flex-1 relative">
                    <textarea
                      value={msgText} onChange={(e) => setMsgText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                      placeholder={`اكتب رسالتك لـ ${selected.name}... (اضغط Enter للإرسال)`}
                      rows={1}
                      className="w-full resize-none pr-4 pl-12 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm outline-none focus:bg-white focus:border-[#679632] focus:ring-4 focus:ring-[#D4EDA8]/30 transition-all custom-scroll"
                      style={{ maxHeight: "120px", minHeight: "52px" }}
                    />
                  </div>
                  <button type="submit" disabled={!msgText.trim() || sending}
                    className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-l from-[#1F4A10] to-[#2A6A14] text-white flex items-center justify-center flex-shrink-0 hover:opacity-90 disabled:opacity-50 disabled:grayscale transition-all shadow-md active:scale-95">
                    {sending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-5 h-5 -ml-1" />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1F4A10 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-[#F6FAF0] to-white border border-[#D4EDA8] shadow-sm flex items-center justify-center mb-6 relative">
                  <MessageSquare className="w-12 h-12 text-[#679632]" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <p className="font-heading font-black text-2xl text-[#1F4A10]">مركز الرسائل الذكي</p>
                <p className="text-gray-500 mt-2 max-w-sm text-center leading-relaxed">يرجى تحديد محادثة من القائمة الجانبية للبدء في التواصل مع العملاء والسائقين وحل استفساراتهم بسرعة وسهولة.</p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Info Panel (Trips & Details) - Desktop Only */}
        <AnimatePresence>
          {showInfoPanel && selected && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }} 
              animate={{ width: 320, opacity: 1 }} 
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex flex-col border-r border-gray-100 bg-white flex-shrink-0 overflow-hidden">
              
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-[#1F4A10]">ملف {type === 'driver' ? 'السائق' : 'العميل'}</h3>
                <button onClick={() => setShowInfoPanel(false)} className="p-1.5 hover:bg-gray-200 rounded-full"><X className="w-4 h-4 text-gray-500"/></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-6">
                
                {/* Profile Summary */}
                <div className="flex flex-col items-center text-center">
                  <Avatar name={selected.name} avatar={selected.avatar} size={24} />
                  <p className="font-heading font-black text-lg text-gray-800 mt-3">{selected.name}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1 bg-gray-100 px-3 py-1 rounded-full">{selected.phone}</p>
                </div>

                {/* Recent Trips History */}
                <div>
                  <h4 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2"><Navigation className="w-4 h-4 text-[#679632]"/> آخر الرحلات المسجلة</h4>
                  
                  {loadingOrders ? (
                    <div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-[#D4EDA8] border-t-[#679632] rounded-full animate-spin" /></div>
                  ) : userOrders.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                      <Car className="w-6 h-6 text-gray-300 mx-auto mb-2"/>
                      <p className="text-xs font-bold text-gray-500">لا توجد رحلات سابقة</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userOrders.map(order => (
                        <div key={order.uuid} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:border-[#D4EDA8] transition-colors">
                          <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-50">
                            <span className="text-[10px] font-mono text-gray-400">#{order.uuid.slice(0,6)}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status === 'completed' ? 'مكتملة' : order.status === 'cancelled' ? 'ملغاة' : 'أخرى'}
                            </span>
                          </div>
                          <div className="space-y-1.5 relative">
                            <div className="absolute right-[5px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                            <div className="flex items-center gap-2 text-[11px] relative z-10">
                              <span className="w-3 h-3 rounded-full bg-green-500 border-2 border-white flex-shrink-0"></span>
                              <span className="truncate text-gray-600">{order.from_address || "غير محدد"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] relative z-10">
                              <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white flex-shrink-0"></span>
                              <span className="truncate text-gray-600">{order.to_address || "غير محدد"}</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between items-center">
                            <span className="text-xs font-black text-[#1F4A10]">{order.price || 0} ر.س</span>
                            <span className="text-[10px] text-gray-400">{new Date(order.created_at || '').toLocaleDateString('ar-SA')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
