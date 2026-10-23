import React, { useState, useMemo } from 'react';
import {
  Crown,
  Users,
  Settings2,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  KeyRound,
  Activity,
  Server,
  TrendingUp,
  Globe,
  Radio,
  Search,
  Filter,
  PlusCircle,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Check,
  X,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  Sparkles,
  BrainCircuit,
  Bell,
  Eye,
  Layers,
  Share2,
  ChevronRight,
  Database,
  UserCheck,
  UserX,
  UserPlus
} from 'lucide-react';
import { MASTER_ADMIN_EMAIL, type UserProfile, type UserRole } from '../lib/firebase';

export interface AdminUserItem {
  id: string;
  displayName: string;
  email: string;
  mobile: string;
  organization: string;
  role: 'MASTER_ADMIN' | 'CHANNEL_ADMIN' | 'EDITOR' | 'REPORTER';
  district: string;
  districtHindi: string;
  status: 'active' | 'suspended' | 'pending';
  channelName: string;
  channelLogo: string;
  permissions: {
    canDirectPublish: boolean;
    canEditGraphics: boolean;
    canManageSources: boolean;
    canBroadcast: boolean;
  };
  socialAccounts: {
    facebook: boolean;
    youtube: boolean;
    instagram: boolean;
    twitter: boolean;
    linkedin: boolean;
  };
  postsToday: number;
  totalPosts: number;
  lastActive: string;
  createdAt: string;
}

export interface SystemSettingsConfig {
  defaultCardTemplate: 'News-Alert' | 'Minimalist' | 'Poll-Format';
  defaultColorTheme: 'Red' | 'Gold' | 'Blue';
  aiModel: 'gemini-2.5-flash' | 'gemini-2.5-pro';
  aiTemperature: number;
  strictFactChecking: boolean;
  autoSeoGeneration: boolean;
  rssSyncIntervalMinutes: number;
  globalNotificationBanner: string;
  globalNotificationActive: boolean;
  dailyPostLimitPerAdmin: number;
  autoArchiveDays: number;
}

export interface SystemAuditLogItem {
  id: string;
  timestamp: string;
  userEmail: string;
  userDisplayName: string;
  userRole: string;
  actionType: 'PUBLISH' | 'SETTINGS_CHANGE' | 'USER_MANAGEMENT' | 'SOURCE_UPDATE' | 'SECURITY_ALERT';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress?: string;
  affectedItem?: string;
}

interface MasterAdminHubProps {
  onShowToast: (title: string, message?: string) => void;
  onNavigateToView?: (view: string) => void;
}

export const MasterAdminHub: React.FC<MasterAdminHubProps> = ({
  onShowToast,
  onNavigateToView
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'audit' | 'overview'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // ================= 1. ADMIN USERS & RBAC STATE =================
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([
    {
      id: 'admin-master-00',
      displayName: 'Editor (BNW TV)',
      email: MASTER_ADMIN_EMAIL,
      mobile: '+91 98260 12345',
      organization: 'Breaking News Wala Network Head Office',
      role: 'MASTER_ADMIN',
      district: 'Bhopal',
      districtHindi: 'सम्पूर्ण मध्य प्रदेश (हेडक्वार्टर)',
      status: 'active',
      channelName: 'Breaking News Wala Master Network',
      channelLogo: '/Logo.png',
      permissions: {
        canDirectPublish: true,
        canEditGraphics: true,
        canManageSources: true,
        canBroadcast: true
      },
      socialAccounts: {
        facebook: true,
        youtube: true,
        instagram: true,
        twitter: true,
        linkedin: true
      },
      postsToday: 32,
      totalPosts: 4890,
      lastActive: 'अभी सक्रिय',
      createdAt: '2026-09-01T00:00:00Z'
    },
    {
      id: 'admin-sagar-01',
      displayName: 'राजेश शर्मा (सागर हेड)',
      email: 'sagar.bulletin@gmail.com',
      mobile: '+91 94251 77889',
      organization: 'दैनिक सागर 24 डिजिटल न्यूज़',
      role: 'CHANNEL_ADMIN',
      district: 'Sagar',
      districtHindi: 'सागर',
      status: 'active',
      channelName: 'दैनिक सागर 24',
      channelLogo: '/Logo.png',
      permissions: {
        canDirectPublish: true,
        canEditGraphics: true,
        canManageSources: false,
        canBroadcast: true
      },
      socialAccounts: {
        facebook: true,
        youtube: true,
        instagram: true,
        twitter: false,
        linkedin: false
      },
      postsToday: 6,
      totalPosts: 384,
      lastActive: '14 मिनट पहले',
      createdAt: '2026-10-18T10:30:00Z'
    },
    {
      id: 'admin-indore-02',
      displayName: 'अमित वर्मा (इंदौर ब्यूरो)',
      email: 'indore.fastnews@gmail.com',
      mobile: '+91 98930 44556',
      organization: 'इंदौर फास्ट डिजिटल मीडिया',
      role: 'CHANNEL_ADMIN',
      district: 'Indore',
      districtHindi: 'इंदौर',
      status: 'active',
      channelName: 'इंदौर फास्ट न्यूज़ 24',
      channelLogo: '/Logo.png',
      permissions: {
        canDirectPublish: true,
        canEditGraphics: true,
        canManageSources: false,
        canBroadcast: true
      },
      socialAccounts: {
        facebook: true,
        youtube: true,
        instagram: true,
        twitter: true,
        linkedin: true
      },
      postsToday: 11,
      totalPosts: 620,
      lastActive: '22 मिनट पहले',
      createdAt: '2026-10-19T14:15:00Z'
    },
    {
      id: 'admin-bhopal-03',
      displayName: 'प्रीति सक्सेना (भोपाल एडिटर)',
      email: 'bhopal.express@gmail.com',
      mobile: '+91 97520 88990',
      organization: 'भोपाल हेडलाइन लाइव प्रेस',
      role: 'EDITOR',
      district: 'Bhopal',
      districtHindi: 'भोपाल',
      status: 'active',
      channelName: 'भोपाल हेडलाइन लाइव',
      channelLogo: '/Logo.png',
      permissions: {
        canDirectPublish: false,
        canEditGraphics: true,
        canManageSources: false,
        canBroadcast: true
      },
      socialAccounts: {
        facebook: true,
        youtube: false,
        instagram: true,
        twitter: true,
        linkedin: false
      },
      postsToday: 9,
      totalPosts: 295,
      lastActive: '45 मिनट पहले',
      createdAt: '2026-10-20T08:00:00Z'
    },
    {
      id: 'admin-jabalpur-04',
      displayName: 'संजय पटेल (महाकोशल)',
      email: 'jabalpur.patrika@gmail.com',
      mobile: '+91 96170 33221',
      organization: 'महाकोशल टुडे विधिक समाचार',
      role: 'CHANNEL_ADMIN',
      district: 'Jabalpur',
      districtHindi: 'जबलपुर',
      status: 'pending',
      channelName: 'महाकोशल टुडे',
      channelLogo: '/Logo.png',
      permissions: {
        canDirectPublish: false,
        canEditGraphics: true,
        canManageSources: false,
        canBroadcast: false
      },
      socialAccounts: {
        facebook: false,
        youtube: true,
        instagram: false,
        twitter: true,
        linkedin: false
      },
      postsToday: 0,
      totalPosts: 42,
      lastActive: '2 दिन पहले',
      createdAt: '2026-10-21T06:20:00Z'
    }
  ]);

  // ================= 2. SYSTEM SETTINGS STATE =================
  const [systemSettings, setSystemSettings] = useState<SystemSettingsConfig>({
    defaultCardTemplate: 'News-Alert',
    defaultColorTheme: 'Red',
    aiModel: 'gemini-2.5-flash',
    aiTemperature: 0.3,
    strictFactChecking: true,
    autoSeoGeneration: true,
    rssSyncIntervalMinutes: 15,
    globalNotificationBanner: '🔴 ब्रेकिंग: मध्य प्रदेश विधानसभा सत्र की विशेष कवरेज लाइव जारी है।',
    globalNotificationActive: true,
    dailyPostLimitPerAdmin: 25,
    autoArchiveDays: 30
  });

  // ================= 3. SYSTEM AUDIT LOGS STATE =================
  const [auditLogs, setAuditLogs] = useState<SystemAuditLogItem[]>([
    {
      id: 'audit-01',
      timestamp: 'अभी-अभी (18:15:30)',
      userEmail: MASTER_ADMIN_EMAIL,
      userDisplayName: 'Editor (BNW TV)',
      userRole: 'MASTER_ADMIN',
      actionType: 'SETTINGS_CHANGE',
      description: 'ऑटोमेशन इंजन में डुप्लिकेट हैश डिटेक्शन और कूलडाउन 12 मिनट पर सेट किया गया।',
      severity: 'medium',
      ipAddress: '103.24.120.14',
      affectedItem: 'Automation Engine'
    },
    {
      id: 'audit-02',
      timestamp: '18 मिनट पहले',
      userEmail: 'indore.fastnews@gmail.com',
      userDisplayName: 'अमित वर्मा (इंदौर ब्यूरो)',
      userRole: 'CHANNEL_ADMIN',
      actionType: 'PUBLISH',
      description: 'इंदौर: स्वच्छता 2026 AI वेस्ट ट्रैकर खबर 4:5 ग्राफिक सहित फेसबुक पेज पर पब्लिश की गई।',
      severity: 'low',
      ipAddress: '117.201.88.42',
      affectedItem: 'Post ID #indore-ai-waste'
    },
    {
      id: 'audit-03',
      timestamp: '42 मिनट पहले',
      userEmail: MASTER_ADMIN_EMAIL,
      userDisplayName: 'Editor (BNW TV)',
      userRole: 'MASTER_ADMIN',
      actionType: 'SOURCE_UPDATE',
      description: 'नया सरकारी समाचार स्रोत जोड़ा गया: मध्य प्रदेश जनसंपर्क विभाग (DPR MP) RSS फीड।',
      severity: 'low',
      ipAddress: '103.24.120.14',
      affectedItem: 'RSS: mpinfo.org/rss/breaking.xml'
    },
    {
      id: 'audit-04',
      timestamp: '1 घंटा 20 मिनट पहले',
      userEmail: 'bhopal.express@gmail.com',
      userDisplayName: 'प्रीति सक्सेना (भोपाल एडिटर)',
      userRole: 'EDITOR',
      actionType: 'PUBLISH',
      description: 'भोपाल कोलार सिक्स लेन खबर 3 WhatsApp ग्रुप्स और 1 टेलीग्राम चैनल पर ब्रॉडकास्ट की गई।',
      severity: 'low',
      ipAddress: '157.34.192.11',
      affectedItem: 'WhatsApp Broadcast'
    },
    {
      id: 'audit-05',
      timestamp: '3 घंटे पहले',
      userEmail: 'system.security@newsroom.in',
      userDisplayName: 'Security Sentinel Daemon',
      userRole: 'SYSTEM_BOT',
      actionType: 'SECURITY_ALERT',
      description: 'Meta Graph API टोकन स्वचालित रिफ्रेश सफल (200 OK), लेटेंसी: 84ms।',
      severity: 'low',
      ipAddress: '127.0.0.1',
      affectedItem: 'OAuth Token'
    }
  ]);

  // ================= 4. MODAL STATES =================
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserItem | null>(null);

  // Invite Form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMobile, setInviteMobile] = useState('');
  const [inviteOrg, setInviteOrg] = useState('');
  const [inviteRole, setInviteRole] = useState<'CHANNEL_ADMIN' | 'EDITOR' | 'REPORTER'>('CHANNEL_ADMIN');
  const [inviteDistrict, setInviteDistrict] = useState('Bhopal');
  const [inviteChannelName, setInviteChannelName] = useState('');
  const [inviteCanDirectPublish, setInviteCanDirectPublish] = useState(true);
  const [inviteCanEditGraphics, setInviteCanEditGraphics] = useState(true);
  const [inviteCanBroadcast, setInviteCanBroadcast] = useState(true);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return adminUsers.filter(u => {
      const matchSearch =
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.districtHindi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [adminUsers, searchQuery, roleFilter, statusFilter]);

  // Handlers
  const handleToggleUserStatus = (userId: string) => {
    setAdminUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          if (u.role === 'MASTER_ADMIN') {
            onShowToast('मास्टर एडमिन को सस्पेंड नहीं किया जा सकता');
            return u;
          }
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          onShowToast(
            `${u.displayName} (${u.channelName}) का खाता ${nextStatus === 'active' ? 'सक्रिय किया गया' : 'निलंबित (सस्पेंड) किया गया'}`,
            nextStatus === 'active' ? 'अब एडमिन सिस्टम में लॉगिन कर सकते हैं' : 'एडमिन की पहुँच तत्काल रोकी गई'
          );

          // Add to Audit Log
          const logEntry: SystemAuditLogItem = {
            id: 'audit-' + Date.now(),
            timestamp: 'अभी-अभी',
            userEmail: MASTER_ADMIN_EMAIL,
            userDisplayName: 'Master Admin',
            userRole: 'MASTER_ADMIN',
            actionType: 'USER_MANAGEMENT',
            description: `यूज़र '${u.displayName}' (${u.email}) की स्थिति को '${nextStatus}' में बदला गया।`,
            severity: 'medium',
            affectedItem: u.email
          };
          setAuditLogs(l => [logEntry, ...l]);

          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleApprovePendingUser = (userId: string) => {
    setAdminUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          onShowToast(`चैनल एडमिन '${u.displayName}' को स्वीकृति मिली!`, 'खाता सक्रिय हो गया है।');
          return { ...u, status: 'active' };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    const user = adminUsers.find(u => u.id === userId);
    if (user?.role === 'MASTER_ADMIN') {
      onShowToast('मास्टर एडमिन खाता हटाया नहीं जा सकता');
      return;
    }
    setAdminUsers(prev => prev.filter(u => u.id !== userId));
    onShowToast(`यूज़र '${user?.displayName}' को हटा दिया गया`);

    const logEntry: SystemAuditLogItem = {
      id: 'audit-' + Date.now(),
      timestamp: 'अभी-अभी',
      userEmail: MASTER_ADMIN_EMAIL,
      userDisplayName: 'Master Admin',
      userRole: 'MASTER_ADMIN',
      actionType: 'USER_MANAGEMENT',
      description: `यूज़र '${user?.displayName}' (${user?.email}) को सिस्टम से स्थायी रूप से हटाया गया।`,
      severity: 'high',
      affectedItem: user?.email
    };
    setAuditLogs(l => [logEntry, ...l]);
  };

  const handlePasswordResetTrigger = (user: AdminUserItem) => {
    onShowToast(`पासवर्ड रीसेट लिंक '${user.email}' पर भेजा गया!`, 'सुरक्षित 24 घंटे का सत्यापन टोकन ईमेल किया गया');
  };

  const handleOpenInviteModal = () => {
    setInviteName('');
    setInviteEmail('');
    setInviteMobile('');
    setInviteOrg('');
    setInviteRole('CHANNEL_ADMIN');
    setInviteDistrict('Bhopal');
    setInviteChannelName('');
    setInviteCanDirectPublish(true);
    setInviteCanEditGraphics(true);
    setInviteCanBroadcast(true);
    setShowInviteModal(true);
  };

  const handleSaveInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      onShowToast('कृपया नाम और ईमेल दर्ज करें');
      return;
    }

    const districtMap: Record<string, string> = {
      Bhopal: 'भोपाल',
      Indore: 'इंदौर',
      Jabalpur: 'जबलपुर',
      Gwalior: 'ग्वालियर',
      Ujjain: 'उज्जैन',
      Sagar: 'सागर',
      Rewa: 'रीवा'
    };

    const newUser: AdminUserItem = {
      id: 'admin-' + Date.now(),
      displayName: inviteName.trim(),
      email: inviteEmail.trim().toLowerCase(),
      mobile: inviteMobile.trim() || '+91 98000 00000',
      organization: inviteOrg.trim() || 'डिजिटल समाचार ब्यूरो',
      role: inviteRole,
      district: inviteDistrict,
      districtHindi: districtMap[inviteDistrict] || inviteDistrict,
      status: 'active',
      channelName: inviteChannelName.trim() || `${districtMap[inviteDistrict] || inviteDistrict} न्यूज़ लाइव`,
      channelLogo: '/Logo.png',
      permissions: {
        canDirectPublish: inviteCanDirectPublish,
        canEditGraphics: inviteCanEditGraphics,
        canManageSources: false,
        canBroadcast: inviteCanBroadcast
      },
      socialAccounts: {
        facebook: true,
        youtube: false,
        instagram: true,
        twitter: false,
        linkedin: false
      },
      postsToday: 0,
      totalPosts: 0,
      lastActive: 'अभी आमंत्रित',
      createdAt: new Date().toISOString()
    };

    setAdminUsers(prev => [newUser, ...prev]);
    setShowInviteModal(false);
    onShowToast(`नया एडमिन '${newUser.displayName}' सफलतापूर्वक आमंत्रित!`, `रोल: ${newUser.role} • जिला: ${newUser.districtHindi}`);

    const logEntry: SystemAuditLogItem = {
      id: 'audit-' + Date.now(),
      timestamp: 'अभी-अभी',
      userEmail: MASTER_ADMIN_EMAIL,
      userDisplayName: 'Master Admin',
      userRole: 'MASTER_ADMIN',
      actionType: 'USER_MANAGEMENT',
      description: `नया एडमिन '${newUser.displayName}' (${newUser.email}) आमंत्रित किया गया। जिला: ${newUser.districtHindi}`,
      severity: 'medium',
      affectedItem: newUser.email
    };
    setAuditLogs(l => [logEntry, ...l]);
  };

  const handleSaveSystemSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('सिस्टम व AI मॉडल सेटिंग्स सुरक्षित की गईं!', 'डिफ़ॉल्ट टेम्पलेट और जनरेशन पैरामीटर्स अपडेट हुए');

    const logEntry: SystemAuditLogItem = {
      id: 'audit-' + Date.now(),
      timestamp: 'अभी-अभी',
      userEmail: MASTER_ADMIN_EMAIL,
      userDisplayName: 'Master Admin',
      userRole: 'MASTER_ADMIN',
      actionType: 'SETTINGS_CHANGE',
      description: `सिस्टम सेटिंग्स अपडेट की गईं: मॉडल=${systemSettings.aiModel}, टेम्पलेट=${systemSettings.defaultCardTemplate}, थीम=${systemSettings.defaultColorTheme}`,
      severity: 'medium',
      affectedItem: 'Global System Config'
    };
    setAuditLogs(l => [logEntry, ...l]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* ================= MASTER SUPER BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#200508] via-[#150A1C] to-[#0A1224] border-2 border-amber-500/50 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-[#FFED00] border border-amber-400/40 text-xs font-black uppercase tracking-wider">
              <Crown className="w-4 h-4 text-[#FFED00] animate-bounce" />
              <span>सुपर एडमिन सुप्रीम कमांड सेंटर • Master Super Admin Console</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>मास्टर एडमिन कंट्रोल कंसोल (फेज 5)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              पूरे AI NEWSROOM नेटवर्क के चैनल एडमिन्स (RBAC), सिस्टम व AI मॉडल सेटिंग्स, सोशल मीडिया ऑथेंटिकेशन और ग्लोबल सिक्योरिटी ऑडिट ट्रेल्स का सर्वोच्च प्रबंधन।
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300 font-mono pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-live"></span>
              <span>मास्टर क्रेडेंशियल:</span>
              <strong className="text-white underline">{MASTER_ADMIN_EMAIL}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 shrink-0">
            <button
              onClick={handleOpenInviteModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>+ नया एडमिन आमंत्रित करें</span>
            </button>

            {onNavigateToView && (
              <>
                <button
                  onClick={() => onNavigateToView('newsSourceMgmt')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span>सोर्स मैनेजमेंट</span>
                </button>
                <button
                  onClick={() => onNavigateToView('categoryLocationMgmt')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>कैटेगरी व लोकेशन</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Master KPI Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-[#0B0F19]/80 rounded-2xl p-3.5 border border-amber-500/30">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">कुल रजिस्टर्ड एडमिन्स</span>
            <div className="text-2xl font-black text-white mt-1 flex items-center justify-between">
              <span>{adminUsers.length}</span>
              <Users className="w-5 h-5 text-amber-400 opacity-80" />
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block font-medium">
              {adminUsers.filter(u => u.status === 'active').length} सक्रिय • {adminUsers.filter(u => u.status === 'pending').length} समीक्षाधीन
            </span>
          </div>

          <div className="bg-[#0B0F19]/80 rounded-2xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">सिंडिकेटेड नेटवर्क रीच</span>
            <div className="text-2xl font-black text-[#FFED00] mt-1 flex items-center justify-between">
              <span>1.85M+</span>
              <TrendingUp className="w-5 h-5 text-[#FFED00] opacity-80" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">30D कुल व्यूज</span>
          </div>

          <div className="bg-[#0B0F19]/80 rounded-2xl p-3.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">सक्रिय डिस्ट्रिक्ट्स</span>
            <div className="text-2xl font-black text-white mt-1 flex items-center justify-between">
              <span>52 / 52</span>
              <Globe className="w-5 h-5 text-blue-400 opacity-80" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">मध्य प्रदेश नेटवर्क</span>
          </div>

          <div className="bg-[#0B0F19]/80 rounded-2xl p-3.5 border border-emerald-500/30">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">सिस्टम हेल्थ व सुरक्षा</span>
            <div className="text-2xl font-black text-emerald-400 mt-1 flex items-center justify-between">
              <span>100% सुरक्षित</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400 opacity-80" />
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block font-mono">0 सुरक्षा अलर्ट्स</span>
          </div>
        </div>
      </div>

      {/* ================= TAB NAVIGATION ================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg ring-1 ring-yellow-300'
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>1. मास्टर डैशबोर्ड व नेटवर्क ओवरव्यू</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-[#E21A25] to-[#B70F18] text-white shadow-lg shadow-red-900/40 ring-1 ring-[#FFED00]'
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-[#FFED00]" />
          <span>2. यूज़र एवं RBAC एडमिन मैनेजमेंट ({adminUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-[#E21A25] to-[#B70F18] text-white shadow-lg shadow-red-900/40 ring-1 ring-[#FFED00]'
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Settings2 className="w-4 h-4 text-cyan-400" />
          <span>3. सिस्टम सेटिंग्स व AI मॉडल इंजन</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-gradient-to-r from-[#E21A25] to-[#B70F18] text-white shadow-lg shadow-red-900/40 ring-1 ring-[#FFED00]'
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>4. ऑडिट लॉग एवं सुरक्षा मॉनिटरिंग ({auditLogs.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW DASHBOARD ================= */}
      {activeTab === 'overview' && (
        <section className="space-y-6">
          {/* Global Broadcast Emergency Alert Banner Preview */}
          {systemSettings.globalNotificationActive && (
            <div className="bg-gradient-to-r from-[#B70F18] via-[#D0121C] to-[#8F0C13] p-4 rounded-2xl border-2 border-red-500/80 shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#FFED00] pulse-live shrink-0"></span>
                <span className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                  {systemSettings.globalNotificationBanner}
                </span>
              </div>
              <span className="text-[10px] bg-black/60 text-[#FFED00] font-black px-2.5 py-1 rounded-lg shrink-0 border border-yellow-300/40">
                वैश्विक लाइव सूचना
              </span>
            </div>
          )}

          {/* Quick Module Launchpad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#121622] p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black">
                <Users className="w-5 h-5 text-[#FFED00]" />
              </div>
              <h3 className="text-base font-black text-white">यूज़र एवं रोल मैनेजमेंट (RBAC)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                सभी चैनल एडमिन्स के सोशल अकाउंट्स, परमिशन मैट्रिक्स और एक्टिव/सस्पेंड स्थिति नियंत्रित करें।
              </p>
              <button
                onClick={() => setActiveTab('users')}
                className="text-xs text-[#FFED00] font-bold hover:underline flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>एडमिन्स प्रबंधित करें</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#121622] p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-cyan-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black">
                <BrainCircuit className="w-5 h-5 text-cyan-300" />
              </div>
              <h3 className="text-base font-black text-white">AI मॉडल व जनरेशन सेटिंग्स</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gemini AI मॉडल चयन, टेम्परेचर (क्रिएटिविटी), सख्त तथ्य सत्यापन और 4:5 कार्ड डिफ़ॉल्ट थीम्स।
              </p>
              <button
                onClick={() => setActiveTab('settings')}
                className="text-xs text-[#FFED00] font-bold hover:underline flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>सिस्टम सेटिंग्स खोलें</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#121622] p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-black text-white">सुरक्षा व ऑडिट ट्रेल लॉग</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                किस एडमिन ने कब कौन-सा ग्राफिक बनाया, खबर पब्लिश की अथवा सेटिंग्स बदली - सम्पूर्ण लॉग हिस्ट्री।
              </p>
              <button
                onClick={() => setActiveTab('audit')}
                className="text-xs text-[#FFED00] font-bold hover:underline flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>ऑडिट लॉग्स देखें</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 2: USERS & RBAC ================= */}
      {activeTab === 'users' && (
        <section className="space-y-4">
          {/* Search & Filter Header */}
          <div className="bg-[#121622] p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="एडमिन का नाम, ईमेल, चैनल या जिले से खोजें..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E21A25]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-bold"
              >
                <option value="ALL">सभी रोल्स (All Roles)</option>
                <option value="MASTER_ADMIN">मास्टर एडमिन</option>
                <option value="CHANNEL_ADMIN">चैनल एडमिन</option>
                <option value="EDITOR">एडिटर</option>
                <option value="REPORTER">रिपोर्टर</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-bold"
              >
                <option value="ALL">सभी स्थिति</option>
                <option value="active">सक्रिय (Active)</option>
                <option value="suspended">निलंबित (Suspended)</option>
                <option value="pending">समीक्षाधीन (Pending)</option>
              </select>

              <button
                onClick={handleOpenInviteModal}
                className="bg-[#E21A25] hover:bg-[#B70F18] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow"
              >
                <PlusCircle className="w-4 h-4 text-[#FFED00]" />
                <span>+ नया एडमिन जोड़ें</span>
              </button>
            </div>
          </div>

          {/* Users Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map(user => {
              const isMaster = user.role === 'MASTER_ADMIN';
              return (
                <div
                  key={user.id}
                  className={`bg-[#121622] rounded-2xl border p-5 space-y-4 shadow-xl transition-all ${
                    user.status === 'active'
                      ? 'border-slate-800 hover:border-amber-500/40'
                      : user.status === 'pending'
                      ? 'border-yellow-500/40 bg-yellow-950/10'
                      : 'border-red-900/50 opacity-60 bg-slate-950/50'
                  }`}
                >
                  {/* Top Bar with Channel Branding */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.channelLogo || '/Logo.png'}
                        alt={user.channelName}
                        className="w-12 h-12 rounded-xl object-contain bg-black/60 p-1 border border-slate-700 shrink-0"
                        onError={(e) => { e.currentTarget.src = '/Logo.png'; }}
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-white">{user.displayName}</h4>
                          <span className={`text-[9px] font-black px-2 py-0.2 rounded uppercase ${
                            isMaster
                              ? 'bg-amber-500/20 text-[#FFED00] border border-amber-400/50'
                              : user.role === 'CHANNEL_ADMIN'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-semibold">{user.channelName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shrink-0 ${
                      user.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : user.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {user.status === 'active' ? '● एक्टिव' : user.status === 'pending' ? '⏳ समीक्षाधीन' : '✕ सस्पेंडेड'}
                    </span>
                  </div>

                  {/* Metadata Info (District, Phone, Org) */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">जिला (Territory):</span>
                      <span className="font-bold text-[#FFED00]">{user.districtHindi}</span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">मोबाइल / फोन:</span>
                      <span className="font-mono text-slate-200">{user.mobile}</span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 col-span-2">
                      <span className="text-[10px] text-slate-400 block font-bold">संगठन / मीडिया हाउस:</span>
                      <span className="text-slate-300 truncate block">{user.organization}</span>
                    </div>
                  </div>

                  {/* Social Accounts Status Badges */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>कनेक्टेड सोशल मीडिया एकाउंट्स:</span>
                      <span className="text-[9px] font-mono text-slate-500">
                        आज {user.postsToday} पोस्ट्स प्रकाशित
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-lg border font-bold flex items-center gap-1 ${
                        user.socialAccounts.facebook ? 'bg-blue-600/20 text-blue-300 border-blue-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}>
                        <Check className={`w-3 h-3 ${user.socialAccounts.facebook ? 'text-blue-400' : 'text-slate-600'}`} />
                        <span>FB Page</span>
                      </span>

                      <span className={`px-2 py-0.5 rounded-lg border font-bold flex items-center gap-1 ${
                        user.socialAccounts.youtube ? 'bg-red-600/20 text-red-300 border-red-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}>
                        <Check className={`w-3 h-3 ${user.socialAccounts.youtube ? 'text-red-400' : 'text-slate-600'}`} />
                        <span>YouTube</span>
                      </span>

                      <span className={`px-2 py-0.5 rounded-lg border font-bold flex items-center gap-1 ${
                        user.socialAccounts.instagram ? 'bg-pink-600/20 text-pink-300 border-pink-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}>
                        <Check className={`w-3 h-3 ${user.socialAccounts.instagram ? 'text-pink-400' : 'text-slate-600'}`} />
                        <span>Insta 4:5</span>
                      </span>

                      <span className={`px-2 py-0.5 rounded-lg border font-bold flex items-center gap-1 ${
                        user.socialAccounts.twitter ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}>
                        <Check className={`w-3 h-3 ${user.socialAccounts.twitter ? 'text-slate-200' : 'text-slate-600'}`} />
                        <span>X Alert</span>
                      </span>

                      <span className={`px-2 py-0.5 rounded-lg border font-bold flex items-center gap-1 ${
                        user.socialAccounts.linkedin ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}>
                        <Check className={`w-3 h-3 ${user.socialAccounts.linkedin ? 'text-indigo-400' : 'text-slate-600'}`} />
                        <span>LinkedIn</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    {!isMaster ? (
                      <div className="flex items-center gap-2">
                        {user.status === 'pending' ? (
                          <button
                            onClick={() => handleApprovePendingUser(user.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] shadow transition-all cursor-pointer"
                          >
                            स्वीकृत करें (Approve)
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              user.status === 'active'
                                ? 'bg-red-500/10 hover:bg-red-500/25 text-red-300 border-red-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {user.status === 'active' ? 'अकाउंट सस्पेंड करें' : 'सक्रिय करें'}
                          </button>
                        )}

                        <button
                          onClick={() => handlePasswordResetTrigger(user)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all cursor-pointer"
                          title="पासवर्ड रीसेट लिंक भेजें"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5" />
                        <span>सर्वोच्च मास्टर एडमिन</span>
                      </span>
                    )}

                    {!isMaster && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-white border border-red-800/40 cursor-pointer"
                        title="यूज़र को हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= TAB 3: SYSTEM & AI SETTINGS ================= */}
      {activeTab === 'settings' && (
        <section className="space-y-6">
          <form onSubmit={handleSaveSystemSettings} className="space-y-6">
            {/* AI Engine & Generation Parameters */}
            <div className="bg-[#121622] p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-cyan-300" />
                  <span>Google Gemini AI मॉडल व न्यूज़ जनरेशन सेटिंग्स</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  हेडलाइंस, 4:5 कार्ड बुलेट्स, यूट्यूब SEO कीवर्ड्स और सोशल कैप्शन जनरेशन के AI पैरामीटर्स।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">AI इंजन मॉडल:</label>
                  <select
                    value={systemSettings.aiModel}
                    onChange={e => setSystemSettings(s => ({ ...s, aiModel: e.target.value as any }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (सुपर-फास्ट &lt;150ms - अनुशंसित)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (गहन खोजी पत्रकारिता विश्लेषण)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    क्रिएटिविटी / टेम्परेचर: <span className="font-mono text-[#FFED00]">{systemSettings.aiTemperature}</span>
                  </label>
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={systemSettings.aiTemperature}
                      onChange={e => setSystemSettings(s => ({ ...s, aiTemperature: parseFloat(e.target.value) }))}
                      className="flex-1 accent-[#E21A25] cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400">तथ्यों हेतु 0.3 श्रेष्ठ है</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <div>
                    <span className="font-bold text-white block">सख्त तथ्य सत्यापन मोड (Strict Fact-Checking)</span>
                    <span className="text-[10px] text-slate-400">बिना पुष्टि वाली अपुष्ट अफवाहों को कार्ड में आने से रोकना</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.strictFactChecking}
                    onChange={e => setSystemSettings(s => ({ ...s, strictFactChecking: e.target.checked }))}
                    className="w-4 h-4 accent-[#E21A25] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <div>
                    <span className="font-bold text-white block">ऑटोमैटिक YouTube SEO जनरेशन</span>
                    <span className="text-[10px] text-slate-400">प्रत्येक खबर के साथ वायरल थंबनेल टाइटल्स व टैग्स तैयार करना</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.autoSeoGeneration}
                    onChange={e => setSystemSettings(s => ({ ...s, autoSeoGeneration: e.target.checked }))}
                    className="w-4 h-4 accent-[#E21A25] cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Default News Graphic Themes */}
            <div className="bg-[#121622] p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>डिफ़ॉल्ट 4:5 ग्राफिक कार्ड टेम्पलेट व थीम</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  सभी चैनल एडमिन्स के लिए डिफ़ॉल्ट रूप से लागू होने वाली डिज़ाइन शैली।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">डिफ़ॉल्ट कार्ड टेम्पलेट:</label>
                  <select
                    value={systemSettings.defaultCardTemplate}
                    onChange={e => setSystemSettings(s => ({ ...s, defaultCardTemplate: e.target.value as any }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="News-Alert">सिग्नेचर न्यूज़ अलर्ट (News-Alert)</option>
                    <option value="Minimalist">मिनिमलिस्ट मॉडर्न (Minimalist)</option>
                    <option value="Poll-Format">जनता पोल फॉर्मेट (Poll-Format)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">डिफ़ॉल्ट कलर एक्सेंट:</label>
                  <select
                    value={systemSettings.defaultColorTheme}
                    onChange={e => setSystemSettings(s => ({ ...s, defaultColorTheme: e.target.value as any }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="Red">सिग्नेचर रेड (#E21A25)</option>
                    <option value="Gold">रॉयल गोल्ड (#FFED00)</option>
                    <option value="Blue">ब्रॉडकास्ट ब्लू (#2563EB)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">दैनिक पोस्ट सीमा (प्रति एडमिन):</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={systemSettings.dailyPostLimitPerAdmin}
                    onChange={e => setSystemSettings(s => ({ ...s, dailyPostLimitPerAdmin: parseInt(e.target.value) || 25 }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Global Broadcast Notification Banner Settings */}
            <div className="bg-[#121622] p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-red-500" />
                    <span>ग्लोबल नोटिफिकेशन बैनर (Master Broadcast Banner)</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    सभी एडमिन्स और यूज़र्स के डैशबोर्ड पर शीर्ष पर दिखाई देने वाली आपातकालीन या महत्वपूर्ण सूचना।
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-300 font-bold">बैनर लाइव करें:</span>
                  <input
                    type="checkbox"
                    checked={systemSettings.globalNotificationActive}
                    onChange={e => setSystemSettings(s => ({ ...s, globalNotificationActive: e.target.checked }))}
                    className="w-4 h-4 accent-[#E21A25]"
                  />
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={systemSettings.globalNotificationBanner}
                  onChange={e => setSystemSettings(s => ({ ...s, globalNotificationBanner: e.target.value }))}
                  placeholder="उदा: 🔴 ब्रेकिंग: मध्य प्रदेश विधानसभा सत्र की विशेष कवरेज लाइव जारी है।"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="bg-[#E21A25] hover:bg-[#B70F18] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-xl shadow-red-900/40 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#FFED00]" />
                <span>सभी सिस्टम सेटिंग्स सुरक्षित करें</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ================= TAB 4: AUDIT LOGS ================= */}
      {activeTab === 'audit' && (
        <section className="space-y-4">
          <div className="bg-[#121622] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>ग्लोबल सुरक्षा व गतिविधि ऑडिट ट्रेल (Security Audit Log)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                प्रत्येक एडमिन की गतिविधि, सेटिंग्स परिवर्तन, पब्लिशिंग इतिहास व API सुरक्षा घटनाओं का पूर्ण रिकॉर्ड।
              </p>
            </div>

            <button
              onClick={() => onShowToast('ऑडिट लॉग्स JSON एक्सपोर्ट तैयार!', 'सुरक्षित लॉग फाइल डाउनलोड हुई')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-[#FFED00]" />
              <span>ऑडिट लॉग्स एक्सपोर्ट (JSON)</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="bg-[#121622] p-4 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                      log.actionType === 'PUBLISH'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : log.actionType === 'SETTINGS_CHANGE'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : log.actionType === 'USER_MANAGEMENT'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {log.actionType}
                    </span>

                    <span className="font-bold text-white">{log.userDisplayName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({log.userEmail})</span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                    {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <div className="text-slate-300 leading-relaxed">
                  {log.description}
                </div>

                {log.affectedItem && (
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
                    आइटम: <span className="text-slate-400">{log.affectedItem}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= MODAL: INVITE NEW ADMIN ================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#121622] w-full max-w-2xl rounded-2xl border-2 border-amber-500 p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#FFED00]" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  + नया चैनल एडमिन या रिपोर्टर आमंत्रित करें
                </h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvite} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">पूरा नाम:</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={e => setInviteName(e.target.value)}
                    placeholder="उदा: कुलदीप सिंह तोमर"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">ईमेल एड्रेस:</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="gwalior.news@gmail.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">मोबाइल नंबर:</label>
                  <input
                    type="tel"
                    value={inviteMobile}
                    onChange={e => setInviteMobile(e.target.value)}
                    placeholder="+91 98260 00000"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">संगठन / एजेंसी का नाम:</label>
                  <input
                    type="text"
                    value={inviteOrg}
                    onChange={e => setInviteOrg(e.target.value)}
                    placeholder="ग्वालियर फास्ट डिजिटल मीडिया"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">भूमिका (Role):</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="CHANNEL_ADMIN">चैनल एडमिन (Channel Admin)</option>
                    <option value="EDITOR">सब-एडिटर (Editor)</option>
                    <option value="REPORTER">फील्ड रिपोर्टर (Reporter)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">आवंटित जिला:</label>
                  <select
                    value={inviteDistrict}
                    onChange={e => setInviteDistrict(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Bhopal">भोपाल (Bhopal)</option>
                    <option value="Indore">इंदौर (Indore)</option>
                    <option value="Jabalpur">जबलपुर (Jabalpur)</option>
                    <option value="Gwalior">ग्वालियर (Gwalior)</option>
                    <option value="Ujjain">उज्जैन (Ujjain)</option>
                    <option value="Sagar">सागर (Sagar)</option>
                    <option value="Rewa">रीवा (Rewa)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">चैनल / पेज का नाम:</label>
                  <input
                    type="text"
                    value={inviteChannelName}
                    onChange={e => setInviteChannelName(e.target.value)}
                    placeholder="ग्वालियर हेडलाइंस 24"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block">अनुमतियाँ (Permissions):</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inviteCanDirectPublish}
                      onChange={e => setInviteCanDirectPublish(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span className="text-slate-300">सीधे पब्लिश कर सकते हैं</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inviteCanEditGraphics}
                      onChange={e => setInviteCanEditGraphics(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span className="text-slate-300">4:5 ग्राफिक एडिट करें</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inviteCanBroadcast}
                      onChange={e => setInviteCanBroadcast(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span className="text-slate-300">WA/TG ब्रॉडकास्ट करें</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>आमंत्रण लिंक भेजें व जोड़ें</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
