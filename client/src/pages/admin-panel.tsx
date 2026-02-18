import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users, Mail, Inbox, MessageSquare, BarChart3, Eye,
  Lock, LogIn, LogOut, ChevronRight, Clock, CheckCircle2,
  AlertCircle, Search, Send, Plus, Zap, Shield,
  ArrowLeft, TrendingUp, FileText
} from "lucide-react";

type AdminTab = "overview" | "clients" | "contacts" | "requests" | "messages";

interface AdminUser {
  id: string;
  fullName: string;
  role: string;
}

interface ClientInfo {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string | null;
  company: string | null;
  createdAt: string;
}

function AdminLogin({ onLogin }: { onLogin: (admin: AdminUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest("POST", "/api/admin/login", { email, password });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onLogin(data);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#050A14] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-4 rounded-md bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white" data-testid="text-admin-login-title">Management Panel</h1>
          <p className="text-sm text-slate-500 mt-1">Authorized access only</p>
        </div>

        <div className="glass-card rounded-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 rounded-md px-3 py-2" data-testid="text-admin-error">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@webstudio-ias.com"
                  className="ps-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                  data-testid="input-admin-email"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="ps-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                  data-testid="input-admin-password"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate"
              data-testid="button-admin-login"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Access Panel
                </span>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function OverviewTab() {
  const { data, isLoading } = useQuery<{
    totalClients: number;
    totalContacts: number;
    totalRequests: number;
    totalMessages: number;
    openRequests: number;
    recentClients: ClientInfo[];
    recentContacts: any[];
    recentRequests: any[];
  }>({ queryKey: ["/api/admin/overview"] });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card border-white/[0.06] animate-pulse">
            <CardContent className="p-6"><div className="h-16" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Registered Clients", value: data?.totalClients || 0, icon: Users, color: "text-neon-purple" },
    { label: "Contact Forms", value: data?.totalContacts || 0, icon: Mail, color: "text-neon-cyan" },
    { label: "Requests", value: data?.totalRequests || 0, icon: Inbox, color: "text-neon-pink" },
    { label: "Open Requests", value: data?.openRequests || 0, icon: AlertCircle, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card border-white/[0.06]" data-testid={`card-admin-stat-${stat.label}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg bg-white/[0.04] ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-neon-purple" />
              Recent Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data?.recentClients?.length ? data.recentClients.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white/[0.02]" data-testid={`row-recent-client-${c.id}`}>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{c.fullName}</p>
                  <p className="text-xs text-slate-500 truncate">{c.email}</p>
                </div>
                <p className="text-xs text-slate-500 shrink-0">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
            )) : (
              <p className="text-sm text-slate-500 py-4 text-center">No clients yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-neon-cyan" />
              Recent Contact Forms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data?.recentContacts?.length ? data.recentContacts.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white/[0.02]" data-testid={`row-recent-contact-${c.id}`}>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{c.name} - {c.subject}</p>
                  <p className="text-xs text-slate-500 truncate">{c.email}</p>
                </div>
                <p className="text-xs text-slate-500 shrink-0">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
            )) : (
              <p className="text-sm text-slate-500 py-4 text-center">No contact forms yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ClientsTab() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: clients, isLoading } = useQuery<ClientInfo[]>({ queryKey: ["/api/admin/clients"] });
  const { data: clientDetail } = useQuery<{
    client: ClientInfo;
    updates: any[];
    messages: any[];
    requests: any[];
  }>({
    queryKey: ["/api/admin/clients", selectedClient],
    enabled: !!selectedClient,
  });

  const [replyText, setReplyText] = useState("");
  const sendReply = useMutation({
    mutationFn: async (data: { userId: string; message: string }) => {
      await apiRequest("POST", "/api/admin/messages", data);
    },
    onSuccess: () => {
      setReplyText("");
      toast({ title: "Message sent" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients", selectedClient] });
    },
  });

  const [projForm, setProjForm] = useState({ title: "", description: "", status: "pending", progressPercent: 0 });
  const [showProjForm, setShowProjForm] = useState(false);
  const createProject = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/projects", data);
    },
    onSuccess: () => {
      setProjForm({ title: "", description: "", status: "pending", progressPercent: 0 });
      setShowProjForm(false);
      toast({ title: "Project created" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients", selectedClient] });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PATCH", `/api/admin/projects/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Project updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients", selectedClient] });
    },
  });

  const filtered = clients?.filter(c =>
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.company || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedClient && clientDetail) {
    const c = clientDetail.client;
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" className="text-slate-400 gap-1.5" onClick={() => setSelectedClient(null)} data-testid="button-back-clients">
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Button>

        <Card className="glass-card border-white/[0.06]">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white" data-testid="text-client-name">{c.fullName}</h2>
                <p className="text-sm text-slate-400">{c.email}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                  {c.phone && <span>Phone: {c.phone}</span>}
                  {c.company && <span>Company: {c.company}</span>}
                  <span>Joined: {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-neon-purple border-neon-purple/30">{clientDetail.updates.length} Projects</Badge>
                <Badge variant="outline" className="text-neon-cyan border-neon-cyan/30">{clientDetail.requests.length} Requests</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card border-white/[0.06]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-neon-purple" /> Projects
              </CardTitle>
              <Button size="sm" variant="ghost" className="text-neon-cyan" onClick={() => setShowProjForm(!showProjForm)} data-testid="button-add-project">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence>
                {showProjForm && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2 p-3 rounded-lg bg-white/[0.03]">
                    <Input placeholder="Project title" value={projForm.title} onChange={(e) => setProjForm(p => ({ ...p, title: e.target.value }))} className="bg-white/[0.03] border-white/[0.08] text-white text-sm" data-testid="input-project-title" />
                    <Textarea placeholder="Description" value={projForm.description} onChange={(e) => setProjForm(p => ({ ...p, description: e.target.value }))} className="bg-white/[0.03] border-white/[0.08] text-white text-sm resize-none" data-testid="input-project-desc" />
                    <div className="flex gap-2">
                      <Select value={projForm.status} onValueChange={(v) => setProjForm(p => ({ ...p, status: v }))}>
                        <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white text-xs" data-testid="select-project-status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input type="number" min={0} max={100} placeholder="%" value={projForm.progressPercent} onChange={(e) => setProjForm(p => ({ ...p, progressPercent: Number(e.target.value) }))} className="w-20 bg-white/[0.03] border-white/[0.08] text-white text-xs" data-testid="input-project-progress" />
                    </div>
                    <Button size="sm" onClick={() => createProject.mutate({ userId: selectedClient, ...projForm })} disabled={!projForm.title || !projForm.description || createProject.isPending} className="bg-neon-purple text-white border-0 no-default-hover-elevate" data-testid="button-create-project">Create</Button>
                  </motion.div>
                )}
              </AnimatePresence>
              {clientDetail.updates.length ? clientDetail.updates.map((u: any) => (
                <div key={u.id} className="p-3 rounded-lg bg-white/[0.02] space-y-2" data-testid={`card-project-${u.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-white font-medium">{u.title}</p>
                    <Badge variant="outline" className={u.status === "completed" ? "text-green-400 border-green-400/30" : u.status === "in_progress" ? "text-neon-cyan border-neon-cyan/30" : "text-slate-400 border-slate-400/30"}>
                      {u.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">{u.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all" style={{ width: `${u.progressPercent}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{u.progressPercent}%</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Select defaultValue={u.status} onValueChange={(v) => updateProject.mutate({ id: u.id, data: { status: v } })}>
                      <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white text-xs" data-testid={`select-update-status-${u.id}`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" min={0} max={100} defaultValue={u.progressPercent} onBlur={(e) => updateProject.mutate({ id: u.id, data: { progressPercent: Number(e.target.value) } })} className="w-20 bg-white/[0.03] border-white/[0.08] text-white text-xs" data-testid={`input-update-progress-${u.id}`} />
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500 py-4 text-center">No projects yet</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/[0.06]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-neon-cyan" /> Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {clientDetail.messages.length ? clientDetail.messages.map((m: any) => (
                  <div key={m.id} className={`p-2.5 rounded-lg ${m.senderType === "admin" ? "bg-neon-purple/10 ml-4" : "bg-white/[0.03] mr-4"}`} data-testid={`msg-${m.id}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge variant="outline" className={`text-xs ${m.senderType === "admin" ? "text-neon-purple border-neon-purple/30" : "text-slate-400 border-slate-400/30"}`}>
                        {m.senderType === "admin" ? "You" : "Client"}
                      </Badge>
                      <span className="text-xs text-slate-600">{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-300">{m.message}</p>
                    {m.attachmentUrl && m.attachmentType?.startsWith("image") && (
                      <img src={m.attachmentUrl} alt="Attachment" className="mt-2 max-h-32 rounded-md" />
                    )}
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 py-4 text-center">No messages yet</p>
                )}
              </div>
              <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
                <Input
                  placeholder="Reply to client..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.08] text-white text-sm"
                  onKeyDown={(e) => { if (e.key === "Enter" && replyText.trim()) sendReply.mutate({ userId: selectedClient!, message: replyText.trim() }); }}
                  data-testid="input-admin-reply"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={!replyText.trim() || sendReply.isPending}
                  onClick={() => sendReply.mutate({ userId: selectedClient!, message: replyText.trim() })}
                  className="text-neon-cyan"
                  data-testid="button-send-reply"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Inbox className="w-4 h-4 text-amber-400" /> Client Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {clientDetail.requests.length ? clientDetail.requests.map((r: any) => (
              <div key={r.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-white/[0.02]" data-testid={`row-client-request-${r.id}`}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white font-medium">{r.subject}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.message}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <Badge variant="outline" className={r.priority === "high" ? "text-red-400 border-red-400/30" : r.priority === "medium" ? "text-amber-400 border-amber-400/30" : "text-slate-400 border-slate-400/30"}>
                      {r.priority}
                    </Badge>
                    <span className="text-xs text-slate-600">{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <StatusSelector requestId={r.id} currentStatus={r.status} clientId={selectedClient!} />
              </div>
            )) : (
              <p className="text-sm text-slate-500 py-4 text-center">No requests yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search clients by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ps-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600"
          data-testid="input-search-clients"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="glass-card border-white/[0.06] animate-pulse">
              <CardContent className="p-4"><div className="h-12" /></CardContent>
            </Card>
          ))}
        </div>
      ) : filtered?.length ? (
        <div className="space-y-2">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className="glass-card border-white/[0.06] cursor-pointer hover-elevate"
              onClick={() => setSelectedClient(c.id)}
              data-testid={`card-client-${c.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-white">{c.fullName.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{c.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{c.email} {c.company ? `| ${c.company}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 py-8 text-center">
          {searchTerm ? "No clients match your search" : "No clients registered yet"}
        </p>
      )}
    </div>
  );
}

function StatusSelector({ requestId, currentStatus, clientId }: { requestId: string; currentStatus: string; clientId: string }) {
  const { toast } = useToast();
  const update = useMutation({
    mutationFn: async (status: string) => {
      await apiRequest("PATCH", `/api/admin/requests/${requestId}`, { status });
    },
    onSuccess: () => {
      toast({ title: "Status updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/overview"] });
    },
  });

  return (
    <Select defaultValue={currentStatus} onValueChange={(v) => update.mutate(v)}>
      <SelectTrigger className="w-32 bg-white/[0.03] border-white/[0.08] text-white text-xs" data-testid={`select-request-status-${requestId}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="resolved">Resolved</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
      </SelectContent>
    </Select>
  );
}

function ContactsTab() {
  const { data: contacts, isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/contacts"] });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) return <div className="space-y-2">{[...Array(3)].map((_, i) => <Card key={i} className="glass-card border-white/[0.06] animate-pulse"><CardContent className="p-4"><div className="h-12" /></CardContent></Card>)}</div>;

  return (
    <div className="space-y-2">
      {contacts?.length ? contacts.map((c: any) => (
        <Card key={c.id} className="glass-card border-white/[0.06]" data-testid={`card-contact-${c.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
              <div className="min-w-0">
                <p className="text-sm text-white font-medium">{c.name}</p>
                <p className="text-xs text-slate-500">{c.email} | {c.subject}</p>
              </div>
              <span className="text-xs text-slate-600 shrink-0">{new Date(c.createdAt).toLocaleString()}</span>
            </div>
            <AnimatePresence>
              {expandedId === c.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-white/[0.06]">
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{c.message}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      )) : (
        <p className="text-sm text-slate-500 py-8 text-center">No contact submissions yet</p>
      )}
    </div>
  );
}

function AllRequestsTab() {
  const { data: requests, isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/requests"] });
  const { data: clients } = useQuery<ClientInfo[]>({ queryKey: ["/api/admin/clients"] });

  const clientMap: Record<string, string> = {};
  clients?.forEach(c => { clientMap[c.id] = c.fullName; });

  if (isLoading) return <div className="space-y-2">{[...Array(3)].map((_, i) => <Card key={i} className="glass-card border-white/[0.06] animate-pulse"><CardContent className="p-4"><div className="h-12" /></CardContent></Card>)}</div>;

  return (
    <div className="space-y-2">
      {requests?.length ? requests.map((r: any) => (
        <Card key={r.id} className="glass-card border-white/[0.06]" data-testid={`card-all-request-${r.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-white font-medium">{r.subject}</p>
                  <Badge variant="outline" className={r.priority === "high" ? "text-red-400 border-red-400/30" : r.priority === "medium" ? "text-amber-400 border-amber-400/30" : "text-slate-400 border-slate-400/30"}>
                    {r.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{r.message}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-xs text-neon-purple">{clientMap[r.userId] || "Unknown"}</span>
                  <span className="text-xs text-slate-600">{new Date(r.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <StatusSelector requestId={r.id} currentStatus={r.status} clientId={r.userId} />
            </div>
          </CardContent>
        </Card>
      )) : (
        <p className="text-sm text-slate-500 py-8 text-center">No requests yet</p>
      )}
    </div>
  );
}

function AllMessagesTab() {
  const { data: messages, isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/messages"] });
  const { data: clients } = useQuery<ClientInfo[]>({ queryKey: ["/api/admin/clients"] });

  const clientMap: Record<string, string> = {};
  clients?.forEach(c => { clientMap[c.id] = c.fullName; });

  if (isLoading) return <div className="space-y-2">{[...Array(3)].map((_, i) => <Card key={i} className="glass-card border-white/[0.06] animate-pulse"><CardContent className="p-4"><div className="h-12" /></CardContent></Card>)}</div>;

  return (
    <div className="space-y-2">
      {messages?.length ? messages.map((m: any) => (
        <Card key={m.id} className="glass-card border-white/[0.06]" data-testid={`card-all-msg-${m.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-neon-purple">{clientMap[m.userId] || "Unknown"}</span>
                  <Badge variant="outline" className={`text-xs ${m.senderType === "admin" ? "text-neon-purple border-neon-purple/30" : "text-slate-400 border-slate-400/30"}`}>
                    {m.senderType === "admin" ? "Admin" : "Client"}
                  </Badge>
                </div>
                <p className="text-sm text-slate-300">{m.message}</p>
                {m.attachmentUrl && m.attachmentType?.startsWith("image") && (
                  <img src={m.attachmentUrl} alt="Attachment" className="mt-2 max-h-24 rounded-md" />
                )}
              </div>
              <span className="text-xs text-slate-600 shrink-0">{new Date(m.createdAt).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      )) : (
        <p className="text-sm text-slate-500 py-8 text-center">No messages yet</p>
      )}
    </div>
  );
}

const adminTabs: { key: AdminTab; icon: typeof BarChart3; label: string }[] = [
  { key: "overview", icon: BarChart3, label: "Overview" },
  { key: "clients", icon: Users, label: "Clients" },
  { key: "contacts", icon: Mail, label: "Contact Forms" },
  { key: "requests", icon: Inbox, label: "Requests" },
  { key: "messages", icon: MessageSquare, label: "Messages" },
];

export default function AdminPanel() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.role === "admin") setAdmin(data);
        setCheckingAuth(false);
      })
      .catch(() => setCheckingAuth(false));
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#050A14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return <AdminLogin onLogin={setAdmin} />;
  }

  function handleLogout() {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" }).then(() => setAdmin(null));
  }

  return (
    <div className="min-h-screen bg-[#050A14] text-white">
      <header className="sticky top-0 z-50 glass-nav border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">WebStudio Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">{admin.fullName}</span>
            <Button size="sm" variant="ghost" className="text-slate-400 gap-1.5" onClick={handleLogout} data-testid="button-admin-logout">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-52 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0" data-testid="nav-admin-tabs">
              {adminTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? "bg-white/[0.08] text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                  }`}
                  data-testid={`button-admin-tab-${tab.key}`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "clients" && <ClientsTab />}
            {activeTab === "contacts" && <ContactsTab />}
            {activeTab === "requests" && <AllRequestsTab />}
            {activeTab === "messages" && <AllMessagesTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
