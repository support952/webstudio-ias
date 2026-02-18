import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, User, Settings, Activity, MessageSquarePlus,
  Clock, CheckCircle2, AlertCircle, Send,
  Lock, Mail, Phone, Building2, Edit3, Save, FileText,
  TrendingUp, Inbox, ImagePlus, X
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type TabKey = "overview" | "profile" | "settings" | "progress" | "requests";

const tabConfig: { key: TabKey; icon: typeof LayoutDashboard; labelKey: string }[] = [
  { key: "overview", icon: LayoutDashboard, labelKey: "dashboard.overview" },
  { key: "profile", icon: User, labelKey: "dashboard.profile" },
  { key: "settings", icon: Settings, labelKey: "dashboard.settings" },
  { key: "progress", icon: Activity, labelKey: "dashboard.progress" },
  { key: "requests", icon: MessageSquarePlus, labelKey: "dashboard.requests" },
];

function OverviewTab() {
  const { t } = useI18n();
  const { data: overview, isLoading } = useQuery<{
    projectCount: number;
    requestCount: number;
    messageCount: number;
    openRequests: number;
    latestUpdates: any[];
    latestRequests: any[];
  }>({ queryKey: ["/api/dashboard/overview"] });

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
    { label: t("dashboard.projects"), value: overview?.projectCount || 0, icon: FileText, color: "text-neon-purple" },
    { label: t("dashboard.totalRequests"), value: overview?.requestCount || 0, icon: Inbox, color: "text-neon-cyan" },
    { label: t("dashboard.messages"), value: overview?.messageCount || 0, icon: MessageSquarePlus, color: "text-neon-pink" },
    { label: t("dashboard.openRequests"), value: overview?.openRequests || 0, icon: AlertCircle, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card border-white/[0.06]" data-testid={`card-stat-${stat.label}`}>
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
              <TrendingUp className="w-4 h-4 text-neon-purple" />
              {t("dashboard.recentProgress")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overview?.latestUpdates && overview.latestUpdates.length > 0 ? (
              <div className="space-y-3">
                {overview.latestUpdates.map((update: any) => (
                  <div key={update.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                    <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple text-sm font-bold shrink-0">
                      {update.progressPercent}%
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium truncate">{update.title}</p>
                      <p className="text-xs text-slate-400 truncate">{update.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">{update.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">{t("dashboard.noUpdates")}</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Inbox className="w-4 h-4 text-neon-cyan" />
              {t("dashboard.recentRequests")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overview?.latestRequests && overview.latestRequests.length > 0 ? (
              <div className="space-y-3">
                {overview.latestRequests.map((req: any) => (
                  <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                    <StatusIcon status={req.status} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium truncate">{req.subject}</p>
                      <p className="text-xs text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <PriorityBadge priority={req.priority} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">{t("dashboard.noRequests")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { data: profile, isLoading } = useQuery<any>({ queryKey: ["/api/profile"] });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", "/api/profile", data);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update profile");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setEditing(false);
      toast({ title: t("dashboard.profileUpdated") });
    },
    onError: (err: any) => {
      toast({ title: err.message || "Error", variant: "destructive" });
    },
  });

  if (isLoading) {
    return <Card className="glass-card border-white/[0.06] animate-pulse"><CardContent className="p-8"><div className="h-48" /></CardContent></Card>;
  }

  const startEdit = () => {
    setFormData({
      fullName: profile?.fullName || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      company: profile?.company || "",
    });
    setEditing(true);
  };

  return (
    <Card className="glass-card border-white/[0.06]">
      <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
        <div>
          <CardTitle className="text-white">{t("dashboard.profileTitle")}</CardTitle>
          <CardDescription className="text-slate-400">{t("dashboard.profileDesc")}</CardDescription>
        </div>
        {!editing && (
          <Button variant="outline" size="sm" onClick={startEdit} data-testid="button-edit-profile">
            <Edit3 className="w-4 h-4 mr-1.5" />
            {t("dashboard.edit")}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {editing ? (
          <div className="space-y-4">
            {[
              { key: "fullName", icon: User, labelKey: "dashboard.fullName" },
              { key: "email", icon: Mail, labelKey: "dashboard.email" },
              { key: "phone", icon: Phone, labelKey: "dashboard.phone" },
              { key: "company", icon: Building2, labelKey: "dashboard.company" },
            ].map(({ key, icon: Icon, labelKey }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-slate-300 text-sm flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {t(labelKey)}
                </Label>
                <Input
                  value={formData[key] || ""}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="bg-white/[0.04] border-white/[0.08] text-white"
                  data-testid={`input-profile-${key}`}
                />
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <Button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending} data-testid="button-save-profile">
                <Save className="w-4 h-4 mr-1.5" />
                {t("dashboard.save")}
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)} data-testid="button-cancel-edit">
                {t("dashboard.cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { icon: User, label: t("dashboard.fullName"), value: profile?.fullName },
              { icon: Mail, label: t("dashboard.email"), value: profile?.email },
              { icon: Phone, label: t("dashboard.phone"), value: profile?.phone || "---" },
              { icon: Building2, label: t("dashboard.company"), value: profile?.company || "---" },
            ].map((field) => (
              <div key={field.label} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                <div className="p-2 rounded-lg bg-white/[0.04] text-slate-400">
                  <field.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{field.label}</p>
                  <p className="text-sm text-white">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SettingsTab() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await apiRequest("POST", "/api/profile/password", data);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    },
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: t("dashboard.passwordChanged") });
    },
    onError: (err: any) => {
      toast({ title: err.message || "Error", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: t("dashboard.passwordMismatch"), variant: "destructive" });
      return;
    }
    mutation.mutate({ currentPassword, newPassword });
  };

  return (
    <Card className="glass-card border-white/[0.06]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-neon-purple" />
          {t("dashboard.changePassword")}
        </CardTitle>
        <CardDescription className="text-slate-400">{t("dashboard.changePasswordDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">{t("dashboard.currentPassword")}</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] text-white"
              required
              data-testid="input-current-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">{t("dashboard.newPassword")}</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] text-white"
              required
              minLength={6}
              data-testid="input-new-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">{t("dashboard.confirmPassword")}</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] text-white"
              required
              minLength={6}
              data-testid="input-confirm-password"
            />
          </div>
          <Button type="submit" disabled={mutation.isPending} data-testid="button-change-password">
            <Lock className="w-4 h-4 mr-1.5" />
            {t("dashboard.updatePassword")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ProgressTab() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { data: updates, isLoading: updatesLoading } = useQuery<any[]>({ queryKey: ["/api/progress"] });
  const { data: messages, isLoading: messagesLoading } = useQuery<any[]>({ queryKey: ["/api/messages"] });
  const [newMessage, setNewMessage] = useState("");
  const [attachmentPreview, setAttachmentPreview] = useState<{ url: string; type: string; name: string } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAttachmentPreview({
        url: reader.result as string,
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const sendMutation = useMutation({
    mutationFn: async (data: { message: string; attachmentUrl?: string; attachmentType?: string }) => {
      const res = await apiRequest("POST", "/api/messages", data);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to send message");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/overview"] });
      setNewMessage("");
      setAttachmentPreview(null);
      toast({ title: t("dashboard.messageSent") });
    },
    onError: (err: any) => {
      toast({ title: err.message || "Error", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <Card className="glass-card border-white/[0.06]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-neon-cyan" />
            {t("dashboard.projectProgress")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {updatesLoading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-lg bg-white/[0.02] animate-pulse" />)}</div>
          ) : updates && updates.length > 0 ? (
            <div className="space-y-4">
              {updates.map((update: any) => (
                <div key={update.id} className="p-4 rounded-lg bg-white/[0.02] space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h4 className="text-sm font-semibold text-white">{update.title}</h4>
                    <Badge variant="outline" className="text-xs">{update.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-400">{update.description}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{t("dashboard.completion")}</span>
                      <span className="text-neon-cyan font-medium">{update.progressPercent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-500"
                        style={{ width: `${update.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">{t("dashboard.noProjectsYet")}</p>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card border-white/[0.06]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-neon-pink" />
            {t("dashboard.sendMessage")}
          </CardTitle>
          <CardDescription className="text-slate-400">{t("dashboard.sendMessageDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t("dashboard.typeMessage")}
            className="bg-white/[0.04] border-white/[0.08] text-white min-h-[80px]"
            data-testid="textarea-message"
          />

          {attachmentPreview && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              {attachmentPreview.type === "image" ? (
                <img src={attachmentPreview.url} alt="" className="w-16 h-16 rounded-md object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-md bg-white/[0.04] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{attachmentPreview.name}</p>
                <p className="text-xs text-slate-400">{attachmentPreview.type === "image" ? t("dashboard.imageAttached") : t("dashboard.fileAttached")}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setAttachmentPreview(null)}
                data-testid="button-remove-attachment"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("file-upload")?.click()}
              data-testid="button-attach-file"
            >
              <ImagePlus className="w-4 h-4 mr-1.5" />
              {t("dashboard.attachFile")}
            </Button>
            <input
              id="file-upload"
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file-upload"
            />
            <Button
              onClick={() => {
                if (!newMessage.trim() && !attachmentPreview) return;
                sendMutation.mutate({
                  message: newMessage || (attachmentPreview ? t("dashboard.fileAttached") : ""),
                  attachmentUrl: attachmentPreview?.url,
                  attachmentType: attachmentPreview?.type,
                });
              }}
              disabled={(!newMessage.trim() && !attachmentPreview) || sendMutation.isPending}
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4 mr-1.5" />
              {t("dashboard.send")}
            </Button>
          </div>

          {messagesLoading ? (
            <div className="space-y-2">{[...Array(2)].map((_, i) => <div key={i} className="h-12 rounded bg-white/[0.02] animate-pulse" />)}</div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-2 pt-4 border-t border-white/[0.06]">
              <p className="text-xs text-slate-500 font-medium mb-2">{t("dashboard.previousMessages")}</p>
              {messages.map((msg: any) => (
                <div key={msg.id} className={`p-3 rounded-lg text-sm ${msg.senderType === "client" ? "bg-neon-purple/10 text-slate-200 ml-6" : "bg-white/[0.03] text-slate-300 mr-6"}`}>
                  <p>{msg.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function RequestsTab() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { data: requests, isLoading } = useQuery<any[]>({ queryKey: ["/api/requests"] });
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/requests", data);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to submit request");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/overview"] });
      setShowForm(false);
      setSubject("");
      setMessage("");
      setPriority("medium");
      toast({ title: t("dashboard.requestSubmitted") });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-lg font-semibold text-white">{t("dashboard.myRequests")}</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate"
          data-testid="button-new-request"
        >
          <MessageSquarePlus className="w-4 h-4 mr-1.5" />
          {t("dashboard.newRequest")}
        </Button>
      </div>

      {showForm && (
        <Card className="glass-card border-white/[0.06]">
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">{t("dashboard.subject")}</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-white/[0.04] border-white/[0.08] text-white"
                data-testid="input-request-subject"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">{t("dashboard.message")}</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white/[0.04] border-white/[0.08] text-white min-h-[100px]"
                data-testid="textarea-request-message"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">{t("dashboard.priority")}</Label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((p) => (
                  <Button
                    key={p}
                    variant={priority === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriority(p)}
                    data-testid={`button-priority-${p}`}
                  >
                    {t(`dashboard.priority.${p}`)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => mutation.mutate({ subject, message, priority })}
                disabled={!subject.trim() || !message.trim() || mutation.isPending}
                data-testid="button-submit-request"
              >
                <Send className="w-4 h-4 mr-1.5" />
                {t("dashboard.submit")}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>{t("dashboard.cancel")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-lg bg-white/[0.02] animate-pulse" />)}</div>
      ) : requests && requests.length > 0 ? (
        <div className="space-y-3">
          {requests.map((req: any) => (
            <Card key={req.id} className="glass-card border-white/[0.06]" data-testid={`card-request-${req.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3 min-w-0">
                    <StatusIcon status={req.status} />
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium">{req.subject}</p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{req.message}</p>
                      <p className="text-xs text-slate-500 mt-2">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={req.priority} />
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card border-white/[0.06]">
          <CardContent className="p-8 text-center">
            <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">{t("dashboard.noRequestsYet")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "open":
      return <div className="p-1.5 rounded-full bg-amber-400/20 text-amber-400 shrink-0"><Clock className="w-3.5 h-3.5" /></div>;
    case "in_progress":
      return <div className="p-1.5 rounded-full bg-neon-cyan/20 text-neon-cyan shrink-0"><Activity className="w-3.5 h-3.5" /></div>;
    case "closed":
      return <div className="p-1.5 rounded-full bg-emerald-400/20 text-emerald-400 shrink-0"><CheckCircle2 className="w-3.5 h-3.5" /></div>;
    default:
      return <div className="p-1.5 rounded-full bg-slate-400/20 text-slate-400 shrink-0"><AlertCircle className="w-3.5 h-3.5" /></div>;
  }
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    in_progress: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20",
    closed: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  };
  return <Badge variant="outline" className={`text-xs ${colors[status] || ""}`}>{status}</Badge>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    low: "bg-slate-400/10 text-slate-400 border-slate-400/20",
    medium: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    high: "bg-red-400/10 text-red-400 border-red-400/20",
  };
  return <Badge variant="outline" className={`text-xs ${colors[priority] || ""}`}>{priority}</Badge>;
}

export default function Dashboard() {
  const { t } = useI18n();
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ tab?: string }>();
  const activeTab = (params?.tab as TabKey) || "overview";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-900">
        <div className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const setTab = (tab: TabKey) => {
    if (tab === "overview") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard/${tab}`);
    }
  };

  return (
    <div className="min-h-screen bg-deep-900">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{t("dashboard.welcome")}, {user.fullName.split(" ")[0]}</h1>
                <p className="text-sm text-slate-400">{t("dashboard.welcomeDesc")}</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-56 shrink-0">
                <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                  {tabConfig.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setTab(tab.key)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                        activeTab === tab.key
                          ? "bg-white/[0.08] text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                      }`}
                      data-testid={`button-tab-${tab.key}`}
                    >
                      <tab.icon className="w-4 h-4 shrink-0" />
                      {t(tab.labelKey)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex-1 min-w-0">
                {activeTab === "overview" && <OverviewTab />}
                {activeTab === "profile" && <ProfileTab />}
                {activeTab === "settings" && <SettingsTab />}
                {activeTab === "progress" && <ProgressTab />}
                {activeTab === "requests" && <RequestsTab />}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
