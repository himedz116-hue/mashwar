import { useState, useEffect, useRef } from "react";
import { getMessageUsers, getMessages, sendMessage, type MsgUser, type Message } from "@/lib/meshwarApi";
import { MessageSquare, RefreshCw, Search, Send, ChevronDown } from "lucide-react";

export default function MessagesCenter() {
  const [users, setUsers] = useState<MsgUser[]>([]);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [selected, setSelected] = useState<MsgUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"user" | "driver">("user");
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadUsers = () => {
    setLoading(true); setError("");
    getMessageUsers(type, search)
      .then((r) => setUsers(r.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  const loadMsgs = (user: MsgUser) => {
    setSelected(user); setLoadingMsgs(true);
    getMessages(user.uuid)
      .then((r) => {
        setMsgs(r.data ?? []);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      })
      .catch(() => setMsgs([]))
      .finally(() => setLoadingMsgs(false));
  };

  useEffect(() => { loadUsers(); }, [type]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !newMsg.trim()) return;
    setSending(true);
    try {
      await sendMessage({ user_uuid: selected.uuid, message: newMsg.trim() });
      setNewMsg("");
      loadMsgs(selected);
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  const filtered = users.filter((u) => !search || u.name?.includes(search) || u.phone?.includes(search));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-heading font-black text-[#1F4A10]">مركز الرسائل</h2>
        <p className="text-sm text-gray-500 mt-0.5">التواصل مع المستخدمين والسائقين مباشرةً</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: "calc(100vh - 220px)", minHeight: 500 }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-72 border-l border-gray-100 flex flex-col flex-shrink-0">
            {/* Filters */}
            <div className="p-3 border-b border-gray-100 space-y-2">
              <div className="flex gap-1 bg-[#F6FAF0] rounded-xl p-1">
                {(["user", "driver"] as const).map((t) => (
                  <button key={t} onClick={() => setType(t)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${type === t ? "bg-white shadow text-[#1F4A10]" : "text-gray-400"}`}>
                    {t === "user" ? "مستخدمون" : "سائقون"}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadUsers()}
                  placeholder="بحث..." className="w-full pr-8 pl-3 py-2 rounded-xl bg-[#F6FAF0] text-xs outline-none focus:ring-1 focus:ring-[#679632]" />
              </div>
            </div>

            {/* User list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
              ) : error ? (
                <p className="text-center text-red-400 text-xs p-4">{error}</p>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">لا توجد محادثات</p>
                </div>
              ) : (
                filtered.map((u) => (
                  <button key={u.uuid} onClick={() => loadMsgs(u)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-[#F6FAF0] transition-colors border-b border-gray-50 ${selected?.uuid === u.uuid ? "bg-[#F0F9E8]" : ""}`}>
                    <div className="w-9 h-9 rounded-xl bg-[#D4EDA8] flex items-center justify-center flex-shrink-0">
                      {u.avatar ? <img src={u.avatar} className="w-9 h-9 rounded-xl object-cover" /> :
                        <span className="font-black text-[#1F4A10] text-sm">{u.name?.[0] ?? "?"}</span>}
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <p className="font-bold text-[#1F4A10] text-sm truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.last_message ?? u.phone}</p>
                    </div>
                    {u.unread_count ? (
                      <span className="w-5 h-5 rounded-full bg-[#679632] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">{u.unread_count}</span>
                    ) : null}
                  </button>
                ))
              )}
            </div>
            <div className="p-3 border-t border-gray-100">
              <button onClick={loadUsers} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-gray-500 hover:bg-[#F6FAF0] transition-colors">
                <RefreshCw className="w-3 h-3" /> تحديث
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-bold">اختر محادثة من القائمة</p>
                <p className="text-sm mt-1">لعرض الرسائل والرد عليها</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4EDA8] flex items-center justify-center">
                    <span className="font-black text-[#1F4A10] text-sm">{selected.name?.[0]}</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#1F4A10] text-sm">{selected.name}</p>
                    <p className="text-xs text-gray-400">{selected.phone}</p>
                  </div>
                  <button onClick={() => loadMsgs(selected)} className="mr-auto p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMsgs ? (
                    <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#679632] border-t-transparent rounded-full animate-spin" /></div>
                  ) : msgs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-sm">لا توجد رسائل بعد</div>
                  ) : (
                    msgs.map((m) => (
                      <div key={m.uuid} className={`flex ${m.is_admin ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${m.is_admin ? "bg-[#1F4A10] text-white rounded-tl-sm" : "bg-[#F6FAF0] text-[#1F4A10] rounded-tr-sm"}`}>
                          <p>{m.message}</p>
                          <p className={`text-[10px] mt-1 ${m.is_admin ? "text-white/50" : "text-gray-400"}`}>
                            {new Date(m.created_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex gap-2">
                  <input
                    value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="اكتب رسالة..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#F6FAF0] text-sm outline-none focus:ring-1 focus:ring-[#679632]"
                  />
                  <button type="submit" disabled={!newMsg.trim() || sending}
                    className="p-2.5 rounded-xl bg-[#1F4A10] text-white hover:bg-[#2A5A14] disabled:opacity-50 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
