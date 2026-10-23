import React, { useState, useMemo } from 'react';
import {
  Zap,
  Calendar,
  Clock,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  PlusCircle,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldAlert,
  Send,
  Layers,
  Search,
  Filter,
  Check,
  X,
  Radio,
  Sliders,
  Flame,
  Globe,
  Share2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle,
  Copy,
  Timer,
  CheckCheck
} from 'lucide-react';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  triggerType: 'RSS' | 'KEYWORD' | 'VIRAL_ALERT' | 'GOVT_WIRE';
  sourceName: string;
  sourceUrl: string;
  district: string;
  districtHindi: string;
  category: string;
  urgencyThreshold: 'ALL' | 'TOP_STORY' | 'BREAKING_ONLY' | 'VIRAL_ONLY';
  viralScoreMin: number;
  mode: 'AUTO_PUBLISH' | 'ADMIN_APPROVAL';
  targetPlatforms: {
    facebook: boolean;
    instagram: boolean;
    telegram: boolean;
    whatsapp: boolean;
    youtube: boolean;
    twitter: boolean;
    linkedin: boolean;
  };
  graphicTemplate: 'News-Alert' | 'Minimalist' | 'Poll-Format';
  autoAIGenerateSEO: boolean;
  isActive: boolean;
  triggersToday: number;
  totalProcessed: number;
  successRate: number;
  lastTriggeredAt: string;
}

export interface ScheduledPostItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  district: string;
  districtHindi: string;
  category: string;
  urgency: 'Breaking' | 'Top Story' | 'Normal' | 'Viral';
  scheduledTime: string;
  scheduledTimestamp: number;
  timeSlotTag: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'PRIME_NIGHT' | 'CUSTOM';
  status: 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED' | 'PAUSED';
  platforms: {
    facebook: boolean;
    instagram: boolean;
    telegram: boolean;
    whatsapp: boolean;
    youtube: boolean;
    twitter: boolean;
  };
  retriesCount: number;
  errorReason?: string;
  ruleTriggered?: string;
}

export interface SyndicationPlatformConfig {
  platformId: string;
  name: string;
  iconName: string;
  badge: string;
  dailyQuota: number;
  usedToday: number;
  minIntervalMinutes: number;
  activeStatus: 'active' | 'rate_limited' | 'disconnected';
  connectedAccountName: string;
  colorTheme: string;
}

export interface ExecutionAuditLog {
  id: string;
  timestamp: string;
  ruleName: string;
  articleTitle: string;
  district: string;
  platformsTargeted: string[];
  status: 'SUCCESS' | 'APPROVAL_HOLD' | 'FAILED' | 'RETRYING';
  responseLatencyMs: number;
  logMessage: string;
  directUrl?: string;
}

interface AutomationSchedulingHubProps {
  onShowToast: (title: string, message?: string) => void;
  userDistrict?: string;
  userRole?: string;
}

export const AutomationSchedulingHub: React.FC<AutomationSchedulingHubProps> = ({
  onShowToast,
  userDistrict = 'भोपाल',
  userRole = 'MASTER_ADMIN'
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'schedule' | 'platforms' | 'logs'>('rules');
  const [emergencyMasterPause, setEmergencyMasterPause] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // ================= 1. INITIAL AUTOMATION RULES =================
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'rule-bhopal-auto-01',
      name: 'भोपाल सुपरफास्ट - कोलार व कलेक्ट्रेट ऑटोपायलट',
      description: 'भोपाल नगर निगम व कलेक्ट्रेट RSS से टॉप स्टोरीज का 4:5 ग्राफिक बनाकर अप्रूवल क्यू में भेजेगा।',
      triggerType: 'RSS',
      sourceName: 'भोपाल जनसंपर्क व कलेक्ट्रेट RSS',
      sourceUrl: 'https://breakingnewswala.in/feeds/bhopal.xml',
      district: 'Bhopal',
      districtHindi: 'भोपाल',
      category: 'Infrastructure & Development',
      urgencyThreshold: 'TOP_STORY',
      viralScoreMin: 70,
      mode: 'ADMIN_APPROVAL',
      targetPlatforms: {
        facebook: true,
        instagram: true,
        telegram: true,
        whatsapp: true,
        youtube: false,
        twitter: true,
        linkedin: false
      },
      graphicTemplate: 'News-Alert',
      autoAIGenerateSEO: true,
      isActive: true,
      triggersToday: 8,
      totalProcessed: 142,
      successRate: 98.6,
      lastTriggeredAt: '12 मिनट पहले'
    },
    {
      id: 'rule-indore-viral-02',
      name: 'इंदौर स्मार्ट सिटी व स्वच्छता वायरल ऑटो-पायलट',
      description: 'इंदौर स्वच्छता, मेट्रो व 80+ वायरल स्कोर वाली खबरों को ऑटोमैटिक पब्लिश करेगा।',
      triggerType: 'VIRAL_ALERT',
      sourceName: 'इंदौर नगर निगम व स्मार्ट सिटी वायर',
      sourceUrl: 'https://breakingnewswala.in/feeds/indore.xml',
      district: 'Indore',
      districtHindi: 'इंदौर',
      category: 'Smart City & Civic',
      urgencyThreshold: 'VIRAL_ONLY',
      viralScoreMin: 80,
      mode: 'AUTO_PUBLISH',
      targetPlatforms: {
        facebook: true,
        instagram: true,
        telegram: true,
        whatsapp: false,
        youtube: false,
        twitter: true,
        linkedin: false
      },
      graphicTemplate: 'Minimalist',
      autoAIGenerateSEO: true,
      isActive: true,
      triggersToday: 14,
      totalProcessed: 289,
      successRate: 99.3,
      lastTriggeredAt: '25 मिनट पहले'
    },
    {
      id: 'rule-mp-breaking-03',
      name: 'मध्य प्रदेश ब्रेकिंग न्यूज़ - ऑल डिस्ट्रिक्ट्स वायर',
      description: 'मप्र जनसंपर्क व कैबिनेट निर्णयों की ब्रेकिंग खबर प्राप्त होते ही सभी जिलों में सिंडिकेट होगी।',
      triggerType: 'GOVT_WIRE',
      sourceName: 'मध्य प्रदेश शासन जनसंपर्क (DPR MP)',
      sourceUrl: 'https://mpinfo.org/rss/breaking.xml',
      district: 'ALL_MP',
      districtHindi: 'सम्पूर्ण मध्य प्रदेश',
      category: 'State Governance',
      urgencyThreshold: 'BREAKING_ONLY',
      viralScoreMin: 85,
      mode: 'ADMIN_APPROVAL',
      targetPlatforms: {
        facebook: true,
        instagram: true,
        telegram: true,
        whatsapp: true,
        youtube: true,
        twitter: true,
        linkedin: true
      },
      graphicTemplate: 'News-Alert',
      autoAIGenerateSEO: true,
      isActive: true,
      triggersToday: 6,
      totalProcessed: 94,
      successRate: 97.8,
      lastTriggeredAt: '48 मिनट पहले'
    },
    {
      id: 'rule-jabalpur-judicial-04',
      name: 'जबलपुर हाईकोर्ट व विधिक समाचार ऑटो-कैप्शन',
      description: 'मप्र हाईकोर्ट के महत्वपूर्ण आदेश व विधिक फैसलों का तुरंत विश्लेषण व पोल कार्ड तैयार करना।',
      triggerType: 'RSS',
      sourceName: 'हाईकोर्ट ऑफ मध्य प्रदेश आधिकारिक कॉजलिस',
      sourceUrl: 'https://mphc.gov.in/rss/orders.xml',
      district: 'Jabalpur',
      districtHindi: 'जबलपुर',
      category: 'Judiciary & Law',
      urgencyThreshold: 'TOP_STORY',
      viralScoreMin: 65,
      mode: 'ADMIN_APPROVAL',
      targetPlatforms: {
        facebook: true,
        instagram: false,
        telegram: true,
        whatsapp: true,
        youtube: false,
        twitter: true,
        linkedin: true
      },
      graphicTemplate: 'Poll-Format',
      autoAIGenerateSEO: true,
      isActive: false,
      triggersToday: 2,
      totalProcessed: 61,
      successRate: 96.7,
      lastTriggeredAt: '3 घंटे पहले'
    }
  ]);

  // ================= 2. INITIAL SCHEDULED POSTS MATRIX =================
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPostItem[]>([
    {
      id: 'sched-01',
      title: 'भोपाल: कोलार सिक्स लेन प्रोजेक्ट 15 मई तक होगा पूरा, 5 लाख लोगों को ट्रैफिक जाम से मुक्ति',
      summary: 'पीडब्ल्यूडी और नगर निगम ने डामरीकरण का काम तेज किया। शाम 06:30 बजे सोशल मीडिया पर प्राइम टाइम स्लॉट।',
      imageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
      district: 'Bhopal',
      districtHindi: 'भोपाल',
      category: 'Infrastructure & Development',
      urgency: 'Top Story',
      scheduledTime: 'आज शाम 06:30 PM (28 मिनट बाद)',
      scheduledTimestamp: Date.now() + 28 * 60 * 1000,
      timeSlotTag: 'EVENING',
      status: 'SCHEDULED',
      platforms: { facebook: true, instagram: true, telegram: true, whatsapp: true, youtube: false, twitter: true },
      retriesCount: 0,
      ruleTriggered: 'भोपाल सुपरफास्ट - कोलार व कलेक्ट्रेट ऑटोपायलट'
    },
    {
      id: 'sched-02',
      title: 'इंदौर: स्वच्छता सर्वेक्षण 2026 में 8वीं बार नंबर-1 बनने हेतु AI आधारित वेस्ट ट्रैकर लॉन्च',
      summary: 'इंदौर के 85 वार्डों में रीयल-टाइम सेग्रीगेशन मॉनिटरिंग। प्राइम नाइट स्लॉट में रील्स व फेसबुक पर पोस्ट।',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
      district: 'Indore',
      districtHindi: 'इंदौर',
      category: 'Smart City & Civic',
      urgency: 'Viral',
      scheduledTime: 'आज रात 08:45 PM (2 घंटे 40 मिनट बाद)',
      scheduledTimestamp: Date.now() + 160 * 60 * 1000,
      timeSlotTag: 'PRIME_NIGHT',
      status: 'SCHEDULED',
      platforms: { facebook: true, instagram: true, telegram: true, whatsapp: false, youtube: true, twitter: true },
      retriesCount: 0,
      ruleTriggered: 'इंदौर स्मार्ट सिटी व स्वच्छता वायरल ऑटो-पायलट'
    },
    {
      id: 'sched-03',
      title: 'उज्जैन: श्री महाकाल महालोक और क्षिप्रा रिवरफ्रंट का 250 करोड़ का नया सौंदर्यीकरण मास्टर प्लान मंजूर',
      summary: 'श्रद्धालुओं की सुविधा हेतु नए इलेक्ट्रिक कॉरीडोर और शेड्स का निर्माण कल सुबह से प्रारंभ।',
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
      district: 'Ujjain',
      districtHindi: 'उज्जैन',
      category: 'Religious & Tourism',
      urgency: 'Top Story',
      scheduledTime: 'कल सुबह 08:00 AM (मॉर्निंग स्लॉट)',
      scheduledTimestamp: Date.now() + 14 * 60 * 60 * 1000,
      timeSlotTag: 'MORNING',
      status: 'SCHEDULED',
      platforms: { facebook: true, instagram: true, telegram: true, whatsapp: true, youtube: false, twitter: false },
      retriesCount: 0
    },
    {
      id: 'sched-04',
      title: 'ग्वालियर: चंबल एक्सप्रेसवे के नए अलाइनमेंट से 4 जिलों को त्वरित मुआवजा वितरण आदेश जारी',
      summary: 'दोपहर का बुलेटिन स्लॉट। फेसबुक और टेलीग्राम पर लाइव प्रसारण पूरा हुआ।',
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      district: 'Gwalior',
      districtHindi: 'ग्वालियर',
      category: 'Expressway & Transport',
      urgency: 'Normal',
      scheduledTime: 'आज दोपहर 01:30 PM (सफलतापूर्वक पोस्टेड)',
      scheduledTimestamp: Date.now() - 3 * 60 * 60 * 1000,
      timeSlotTag: 'AFTERNOON',
      status: 'PUBLISHED',
      platforms: { facebook: true, instagram: false, telegram: true, whatsapp: true, youtube: false, twitter: true },
      retriesCount: 0
    }
  ]);

  // ================= 3. SYNDICATION PLATFORMS & QUOTAS =================
  const [platformConfigs, setPlatformConfigs] = useState<SyndicationPlatformConfig[]>([
    {
      platformId: 'meta_facebook',
      name: 'Facebook Pages (12 डिस्ट्रिक्ट पेजेस)',
      iconName: 'facebook',
      badge: 'Meta Graph API v19',
      dailyQuota: 50,
      usedToday: 26,
      minIntervalMinutes: 12,
      activeStatus: 'active',
      connectedAccountName: 'Breaking News Wala MP Network (Verified)',
      colorTheme: 'blue'
    },
    {
      platformId: 'meta_instagram',
      name: 'Instagram Business (Feed & Reels 4:5)',
      iconName: 'instagram',
      badge: 'Instagram Graph API',
      dailyQuota: 30,
      usedToday: 18,
      minIntervalMinutes: 20,
      activeStatus: 'active',
      connectedAccountName: '@breakingnewswala_official (142K)',
      colorTheme: 'pink'
    },
    {
      platformId: 'whatsapp_cloud',
      name: 'WhatsApp Business Cloud API',
      iconName: 'whatsapp',
      badge: 'Official WABA Broadcast',
      dailyQuota: 25,
      usedToday: 12,
      minIntervalMinutes: 30,
      activeStatus: 'active',
      connectedAccountName: 'BNW Official Channel (142,500+ Subs)',
      colorTheme: 'emerald'
    },
    {
      platformId: 'telegram_bot',
      name: 'Telegram Channel & Bot Hub',
      iconName: 'telegram',
      badge: '@BotFather Webhook',
      dailyQuota: 100,
      usedToday: 42,
      minIntervalMinutes: 5,
      activeStatus: 'active',
      connectedAccountName: '@breakingnewswalamp (58.9K Subs)',
      colorTheme: 'sky'
    },
    {
      platformId: 'youtube_data',
      name: 'YouTube Data API v3 (Community & Shorts)',
      iconName: 'youtube',
      badge: 'YouTube OAuth 2.0',
      dailyQuota: 15,
      usedToday: 6,
      minIntervalMinutes: 45,
      activeStatus: 'active',
      connectedAccountName: 'Breaking News Wala Master Channel',
      colorTheme: 'red'
    },
    {
      platformId: 'x_twitter',
      name: 'X (Twitter API v2 Developer)',
      iconName: 'twitter',
      badge: 'OAuth 1.0a / Bearer',
      dailyQuota: 60,
      usedToday: 31,
      minIntervalMinutes: 10,
      activeStatus: 'active',
      connectedAccountName: '@BreakingNewsWala (Verified)',
      colorTheme: 'slate'
    }
  ]);

  // Anti-Spam & Rate Limit Guard Settings
  const [antiSpamConfig, setAntiSpamConfig] = useState({
    globalMinIntervalMinutes: 10,
    duplicateHashGuard: true,
    duplicateWindowHours: 6,
    autoAIReviewScoreMin: 85,
    autoRetryFailedAttempts: 3
  });

  // ================= 4. EXECUTION AUDIT LOGS =================
  const [auditLogs, setAuditLogs] = useState<ExecutionAuditLog[]>([
    {
      id: 'log-101',
      timestamp: 'अभी-अभी (18:02:14)',
      ruleName: 'भोपाल सुपरफास्ट - कोलार व कलेक्ट्रेट ऑटोपायलट',
      articleTitle: 'भोपाल: कोलार सिक्स लेन डामरीकरण 15 मई तक पूरा करने की डेडलाइन',
      district: 'भोपाल',
      platformsTargeted: ['Facebook', 'Telegram', 'WhatsApp'],
      status: 'APPROVAL_HOLD',
      responseLatencyMs: 82,
      logMessage: '4:5 AI ग्राफिक कार्ड सफलता से तैयार। एडमिन अप्रूवल कतार में सुरक्षित।'
    },
    {
      id: 'log-102',
      timestamp: '14 मिनट पहले (17:48:02)',
      ruleName: 'इंदौर स्मार्ट सिटी व स्वच्छता वायरल ऑटो-पायलट',
      articleTitle: 'इंदौर: स्वच्छता 2026 हेतु नया AI वेस्ट सेग्रीगेशन सिस्टम शुरू',
      district: 'इंदौर',
      platformsTargeted: ['Facebook', 'Instagram', 'Telegram', 'Twitter'],
      status: 'SUCCESS',
      responseLatencyMs: 114,
      logMessage: 'HTTP 200 OK • 4 सोशल नेटवर्क्स पर ऑटोमैटिक लाइव पब्लिश पूरा हुआ।',
      directUrl: 'https://facebook.com/breakingnewswala/posts/98273645'
    },
    {
      id: 'log-103',
      timestamp: '42 मिनट पहले (17:20:11)',
      ruleName: 'मध्य प्रदेश ब्रेकिंग न्यूज़ - ऑल डिस्ट्रिक्ट्स वायर',
      articleTitle: 'मप्र कैबिनेट: 12 बड़े जनहित फैसलों को मंजूरी, कर्मचारियों का डीए 4% बढ़ा',
      district: 'सम्पूर्ण मप्र',
      platformsTargeted: ['Facebook', 'Instagram', 'Telegram', 'WhatsApp', 'YouTube', 'Twitter'],
      status: 'SUCCESS',
      responseLatencyMs: 146,
      logMessage: 'HTTP 200 OK • 6 नेटवर्क्स पर 1.2M फॉलोअर्स तक सिंडिकेटेड प्रसारण सम्पन्न।',
      directUrl: 'https://breakingnewswala.in/cabinet-decisions-mp'
    },
    {
      id: 'log-104',
      timestamp: '1 घंटा पहले (16:58:30)',
      ruleName: 'जबलपुर हाईकोर्ट व विधिक समाचार ऑटो-कैप्शन',
      articleTitle: 'जबलपुर: हाईकोर्ट ने सरकारी कर्मचारियों के तबादला आदेश पर लगाई रोक',
      district: 'जबलपुर',
      platformsTargeted: ['Facebook', 'LinkedIn'],
      status: 'SUCCESS',
      responseLatencyMs: 95,
      logMessage: 'HTTP 200 OK • पोल फॉर्मेट ग्राफिक कार्ड पब्लिश किया गया।'
    }
  ]);

  // ================= MODAL STATES =================
  const [showAddRuleModal, setShowAddRuleModal] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  // New Rule Form State
  const [ruleFormName, setRuleFormName] = useState<string>('');
  const [ruleFormDesc, setRuleFormDesc] = useState<string>('');
  const [ruleFormTrigger, setRuleFormTrigger] = useState<'RSS' | 'KEYWORD' | 'VIRAL_ALERT' | 'GOVT_WIRE'>('RSS');
  const [ruleFormSourceName, setRuleFormSourceName] = useState<string>('');
  const [ruleFormSourceUrl, setRuleFormSourceUrl] = useState<string>('');
  const [ruleFormDistrict, setRuleFormDistrict] = useState<string>('Bhopal');
  const [ruleFormCategory, setRuleFormCategory] = useState<string>('Infrastructure & Development');
  const [ruleFormUrgency, setRuleFormUrgency] = useState<'ALL' | 'TOP_STORY' | 'BREAKING_ONLY' | 'VIRAL_ONLY'>('TOP_STORY');
  const [ruleFormViralScore, setRuleFormViralScore] = useState<number>(75);
  const [ruleFormMode, setRuleFormMode] = useState<'AUTO_PUBLISH' | 'ADMIN_APPROVAL'>('ADMIN_APPROVAL');
  const [ruleFormTemplate, setRuleFormTemplate] = useState<'News-Alert' | 'Minimalist' | 'Poll-Format'>('News-Alert');
  const [ruleFormPlatforms, setRuleFormPlatforms] = useState({
    facebook: true,
    instagram: true,
    telegram: true,
    whatsapp: true,
    youtube: false,
    twitter: true,
    linkedin: false
  });

  // Schedule Post Modal State
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [schedTitle, setSchedTitle] = useState<string>('');
  const [schedSummary, setSchedSummary] = useState<string>('');
  const [schedImageUrl, setSchedImageUrl] = useState<string>('https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80');
  const [schedDistrict, setSchedDistrict] = useState<string>('Bhopal');
  const [schedSlotPreset, setSchedSlotPreset] = useState<'MORNING' | 'AFTERNOON' | 'EVENING' | 'PRIME_NIGHT' | 'CUSTOM'>('EVENING');
  const [schedCustomTime, setSchedCustomTime] = useState<string>('18:30');
  const [schedPlatforms, setSchedPlatforms] = useState({
    facebook: true,
    instagram: true,
    telegram: true,
    whatsapp: true,
    youtube: false,
    twitter: true
  });

  // Reschedule existing modal
  const [rescheduleTargetPost, setRescheduleTargetPost] = useState<ScheduledPostItem | null>(null);

  // ================= ACTIONS & HANDLERS =================
  const toggleEmergencyPause = () => {
    const next = !emergencyMasterPause;
    setEmergencyMasterPause(next);
    if (next) {
      onShowToast(
        '🚨 इमरजेंसी ऑटो-पॉज सक्रिय!',
        'सभी ऑटोपायलट रूल्स और शेड्यूल किए गए ऑटो-पब्लिश को तुरंत फ्रीज कर दिया गया है।'
      );
    } else {
      onShowToast(
        '✅ ऑटोमेशन इंजन सामान्य सक्रिय',
        'शेड्यूल और ऑटो-पायलट पब्लिशिंग पाइपलाइन फिर से लाइव हो गई है।'
      );
    }
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev =>
      prev.map(r => {
        if (r.id === ruleId) {
          const updated = !r.isActive;
          onShowToast(
            `रूल '${r.name}' ${updated ? 'सक्रिय' : 'निष्क्रिय'} किया गया`,
            updated ? 'ऑटोपायलट इंजन इस फीड की निगरानी करेगा' : 'पब्लिशिंग रोकी गई'
          );
          return { ...r, isActive: updated };
        }
        return r;
      })
    );
  };

  const handleRunRuleTestNow = (rule: AutomationRule) => {
    onShowToast(`⚡ रूल '${rule.name}' का टेस्ट रन प्रारंभ...`, 'सिमुलेशन: AI 4:5 कार्ड व कैप्शन जनरेट हो रहा है...');
    setTimeout(() => {
      const isAuto = rule.mode === 'AUTO_PUBLISH';
      const newLog: ExecutionAuditLog = {
        id: 'log-' + Date.now(),
        timestamp: 'अभी-अभी (' + new Date().toLocaleTimeString('hi-IN') + ')',
        ruleName: rule.name,
        articleTitle: `[लाइव टेस्ट] ${rule.districtHindi}: ${rule.category} ताज़ा खबर विश्लेषण`,
        district: rule.districtHindi,
        platformsTargeted: Object.entries(rule.targetPlatforms)
          .filter(([, v]) => v)
          .map(([k]) => k.toUpperCase()),
        status: isAuto ? 'SUCCESS' : 'APPROVAL_HOLD',
        responseLatencyMs: Math.floor(Math.random() * 60) + 75,
        logMessage: isAuto
          ? 'HTTP 200 OK • टेस्ट रन सफल! कनेक्टेड नेटवर्क्स पर पब्लिशिंग संपन्न।'
          : 'टेस्ट कार्ड व कैप्शन जनरेट हुआ। एडमिन अप्रूवल कतार में उपलब्ध है।'
      };

      setAuditLogs(prev => [newLog, ...prev]);
      setRules(prev =>
        prev.map(r => (r.id === rule.id ? { ...r, triggersToday: r.triggersToday + 1, totalProcessed: r.totalProcessed + 1, lastTriggeredAt: 'अभी-अभी' } : r))
      );

      onShowToast(
        isAuto ? '✅ टेस्ट पब्लिश सफल (200 OK)!' : '📋 टेस्ट कार्ड अप्रूवल कतार में सुरक्षित!',
        'ऑडिट लॉग्स में रिकॉर्ड दर्ज कर दिया गया है।'
      );
    }, 1200);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
    onShowToast('ऑटोमेशन रूल हटा दिया गया');
  };

  const openAddRuleModal = () => {
    setEditingRule(null);
    setRuleFormName('भोपाल एक्सप्रेस - ताज़ा RSS ऑटोपायलट');
    setRuleFormDesc('भोपाल नगर निगम व विकास योजनाओं की ब्रेकिंग खबरें 4:5 ग्राफिक बनाकर सोशल पेजों पर भेजना।');
    setRuleFormTrigger('RSS');
    setRuleFormSourceName('भोपाल नगर निगम व जनसंपर्क फीड');
    setRuleFormSourceUrl('https://breakingnewswala.in/feeds/bhopal-news.xml');
    setRuleFormDistrict('Bhopal');
    setRuleFormCategory('Infrastructure & Development');
    setRuleFormUrgency('TOP_STORY');
    setRuleFormViralScore(75);
    setRuleFormMode('ADMIN_APPROVAL');
    setRuleFormTemplate('News-Alert');
    setRuleFormPlatforms({
      facebook: true,
      instagram: true,
      telegram: true,
      whatsapp: true,
      youtube: false,
      twitter: true,
      linkedin: false
    });
    setShowAddRuleModal(true);
  };

  const openEditRuleModal = (rule: AutomationRule) => {
    setEditingRule(rule);
    setRuleFormName(rule.name);
    setRuleFormDesc(rule.description);
    setRuleFormTrigger(rule.triggerType);
    setRuleFormSourceName(rule.sourceName);
    setRuleFormSourceUrl(rule.sourceUrl);
    setRuleFormDistrict(rule.district);
    setRuleFormCategory(rule.category);
    setRuleFormUrgency(rule.urgencyThreshold);
    setRuleFormViralScore(rule.viralScoreMin);
    setRuleFormMode(rule.mode);
    setRuleFormTemplate(rule.graphicTemplate);
    setRuleFormPlatforms(rule.targetPlatforms);
    setShowAddRuleModal(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleFormName.trim()) {
      onShowToast('कृपया रूल का नाम दर्ज करें');
      return;
    }

    const districtMap: Record<string, string> = {
      Bhopal: 'भोपाल',
      Indore: 'इंदौर',
      Jabalpur: 'जबलपुर',
      Gwalior: 'ग्वालियर',
      Ujjain: 'उज्जैन',
      Sagar: 'सागर',
      Rewa: 'रीवा',
      ALL_MP: 'सम्पूर्ण मध्य प्रदेश'
    };

    if (editingRule) {
      setRules(prev =>
        prev.map(r =>
          r.id === editingRule.id
            ? {
                ...r,
                name: ruleFormName.trim(),
                description: ruleFormDesc.trim(),
                triggerType: ruleFormTrigger,
                sourceName: ruleFormSourceName.trim() || 'कस्टम समाचार स्रोत',
                sourceUrl: ruleFormSourceUrl.trim() || 'https://breakingnewswala.in/feeds/auto.xml',
                district: ruleFormDistrict,
                districtHindi: districtMap[ruleFormDistrict] || ruleFormDistrict,
                category: ruleFormCategory,
                urgencyThreshold: ruleFormUrgency,
                viralScoreMin: Number(ruleFormViralScore),
                mode: ruleFormMode,
                graphicTemplate: ruleFormTemplate,
                targetPlatforms: ruleFormPlatforms
              }
            : r
        )
      );
      onShowToast(`ऑटो-पायलट रूल '${ruleFormName}' अपडेट हुआ!`);
    } else {
      const newRule: AutomationRule = {
        id: 'rule-' + Date.now(),
        name: ruleFormName.trim(),
        description: ruleFormDesc.trim() || 'नया ऑटोपायलट न्यूज़ सिंडिकेशन रूल',
        triggerType: ruleFormTrigger,
        sourceName: ruleFormSourceName.trim() || 'कस्टम न्यूज़ फीड',
        sourceUrl: ruleFormSourceUrl.trim() || 'https://breakingnewswala.in/feeds/custom.xml',
        district: ruleFormDistrict,
        districtHindi: districtMap[ruleFormDistrict] || ruleFormDistrict,
        category: ruleFormCategory,
        urgencyThreshold: ruleFormUrgency,
        viralScoreMin: Number(ruleFormViralScore),
        mode: ruleFormMode,
        graphicTemplate: ruleFormTemplate,
        autoAIGenerateSEO: true,
        targetPlatforms: ruleFormPlatforms,
        isActive: true,
        triggersToday: 0,
        totalProcessed: 0,
        successRate: 100,
        lastTriggeredAt: 'अभी-अभी बनाया गया'
      };
      setRules(prev => [newRule, ...prev]);
      onShowToast(`नया ऑटो-पायलट रूल '${newRule.name}' सक्रिय हुआ!`);
    }

    setShowAddRuleModal(false);
  };

  // Scheduled Posts Handlers
  const handlePublishScheduledNow = (postId: string) => {
    setScheduledPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const updated: ScheduledPostItem = {
            ...p,
            status: 'PUBLISHED',
            scheduledTime: 'अभी पब्लिश किया गया'
          };
          onShowToast(`'${p.title.slice(0, 32)}...' तुरंत पब्लिश कर दी गई!`, 'फेसबुक, इंस्टाग्राम व टेलीग्राम पर लाइव!');

          // Record in Audit Log
          const newLog: ExecutionAuditLog = {
            id: 'log-' + Date.now(),
            timestamp: 'अभी-अभी',
            ruleName: 'मैन्युअल शेड्यूलिंग बाईपास (Publish Now)',
            articleTitle: p.title,
            district: p.districtHindi,
            platformsTargeted: Object.entries(p.platforms)
              .filter(([, v]) => v)
              .map(([k]) => k.toUpperCase()),
            status: 'SUCCESS',
            responseLatencyMs: 92,
            logMessage: 'HTTP 200 OK • शेड्यूल्ड खबर को तुरंत सभी कनेक्टेड नेटवर्क्स पर पब्लिश कर दिया गया।'
          };
          setAuditLogs(logs => [newLog, ...logs]);

          return updated;
        }
        return p;
      })
    );
  };

  const handleCancelScheduledPost = (postId: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== postId));
    onShowToast('शेड्यूल किया गया पोस्ट रद्द कर दिया गया');
  };

  const handleOpenReschedule = (post: ScheduledPostItem) => {
    setRescheduleTargetPost(post);
  };

  const handleConfirmReschedule = (newTimeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'PRIME_NIGHT') => {
    if (!rescheduleTargetPost) return;
    const timeLabels = {
      MORNING: 'कल सुबह 08:00 AM (मॉर्निंग स्लॉट)',
      AFTERNOON: 'आज दोपहर 01:30 PM (दोपहर स्लॉट)',
      EVENING: 'आज शाम 06:30 PM (प्राइम इवनिंग)',
      PRIME_NIGHT: 'आज रात 08:45 PM (प्राइम नाइट)'
    };

    setScheduledPosts(prev =>
      prev.map(p =>
        p.id === rescheduleTargetPost.id
          ? {
              ...p,
              timeSlotTag: newTimeSlot,
              scheduledTime: timeLabels[newTimeSlot]
            }
          : p
      )
    );
    onShowToast(`पोस्ट का समय बदलकर '${timeLabels[newTimeSlot]}' कर दिया गया!`);
    setRescheduleTargetPost(null);
  };

  const handleCreateNewSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitle.trim()) {
      onShowToast('कृपया खबर की हेडलाइन लिखें');
      return;
    }

    const timeLabels = {
      MORNING: 'कल सुबह 08:00 AM (मॉर्निंग स्लॉट)',
      AFTERNOON: 'आज दोपहर 01:30 PM (दोपहर बुलेटिन)',
      EVENING: 'आज शाम 06:30 PM (प्राइम इवनिंग)',
      PRIME_NIGHT: 'आज रात 08:45 PM (प्राइम नाइट)',
      CUSTOM: `कस्टम टाइम: ${schedCustomTime}`
    };

    const districtMap: Record<string, string> = {
      Bhopal: 'भोपाल',
      Indore: 'इंदौर',
      Jabalpur: 'जबलपुर',
      Gwalior: 'ग्वालियर',
      Ujjain: 'उज्जैन'
    };

    const newPost: ScheduledPostItem = {
      id: 'sched-' + Date.now(),
      title: schedTitle.trim(),
      summary: schedSummary.trim() || 'AI न्यूज़रूम द्वारा शेड्यूल की गई ताज़ा खबर।',
      imageUrl: schedImageUrl.trim() || 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
      district: schedDistrict,
      districtHindi: districtMap[schedDistrict] || schedDistrict,
      category: 'General News',
      urgency: 'Top Story',
      scheduledTime: timeLabels[schedSlotPreset],
      scheduledTimestamp: Date.now() + 60 * 60 * 1000,
      timeSlotTag: schedSlotPreset,
      status: 'SCHEDULED',
      platforms: schedPlatforms,
      retriesCount: 0
    };

    setScheduledPosts(prev => [newPost, ...prev]);
    onShowToast('नई खबर सफलतापूर्वक शेड्यूल हो गई!', `स्लॉट: ${timeLabels[schedSlotPreset]}`);
    setShowScheduleModal(false);
    setSchedTitle('');
    setSchedSummary('');
  };

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return rules.filter(r => {
      const matchSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.districtHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (selectedStatusFilter === 'ACTIVE') return matchSearch && r.isActive;
      if (selectedStatusFilter === 'PAUSED') return matchSearch && !r.isActive;
      if (selectedStatusFilter === 'AUTO') return matchSearch && r.mode === 'AUTO_PUBLISH';
      if (selectedStatusFilter === 'APPROVAL') return matchSearch && r.mode === 'ADMIN_APPROVAL';
      return matchSearch;
    });
  }, [rules, searchQuery, selectedStatusFilter]);

  // Overall Statistics
  const totalTriggersToday = rules.reduce((acc, r) => acc + r.triggersToday, 0);
  const totalScheduledPending = scheduledPosts.filter(p => p.status === 'SCHEDULED').length;
  const activeRulesCount = rules.filter(r => r.isActive).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* ================= MASTER HEADER BANNER ================= */}
      <div className="bg-[#121622] p-5 sm:p-6 rounded-2xl border-2 border-[#E21A25]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/30 to-amber-500/20 text-[#FFED00] border border-amber-500/40 text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-[#FFED00] animate-pulse" />
              <span>फेज 4: ऑटोमेशन, शेड्यूलिंग व मल्टी-चैनल सिंडिकेशन इंजन</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>ऑटो-पायलट न्यूज़ सिंडिकेशन व शेड्यूलिंग हब</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              RSS व सरकारी वायर सोर्सेज से खबरें प्राप्त होने पर ऑटोमैटिक 4:5 ग्राफिक व AI SEO बनाना, पीक टाइम स्लॉट्स पर शेड्यूल करना और फेसबुक, इंस्टाग्राम, टेलीग्राम, व्हाट्सएप व यूट्यूब पर सीधे प्रसारित करना।
            </p>
          </div>

          {/* Quick Actions & Emergency Kill-Switch */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Emergency Kill Switch */}
            <button
              onClick={toggleEmergencyPause}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer ${
                emergencyMasterPause
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-yellow-300 animate-pulse'
                  : 'bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/80 hover:text-white'
              }`}
              title="सभी ऑटो-पब्लिशिंग को आपातकालीन फ्रीज करने या फिर शुरू करने हेतु"
            >
              <ShieldAlert className={`w-4 h-4 ${emergencyMasterPause ? 'text-slate-950' : 'text-red-400'}`} />
              <span>{emergencyMasterPause ? '🚨 इमरजेंसी पॉज़ चालू (क्लिक कर रिज्यूम करें)' : 'आपातकालीन ऑटो-पॉज़'}</span>
            </button>

            {/* Add Rule Button */}
            <button
              onClick={openAddRuleModal}
              className="bg-[#E21A25] hover:bg-[#B70F18] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#E21A25]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#FFED00]" />
              <span>+ नया ऑटो-पायलट रूल</span>
            </button>

            {/* Quick Schedule Post Button */}
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/30"
            >
              <Calendar className="w-4 h-4 text-[#FFED00]" />
              <span>+ खबर शेड्यूल करें</span>
            </button>
          </div>
        </div>

        {/* Master KPI Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-[#0B0F19]/80 rounded-xl p-3 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">सक्रिय ऑटोपायलट रूल्स</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center justify-between">
              <span>{activeRulesCount} / {rules.length}</span>
              <Settings2 className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-[10px] text-emerald-400 mt-0.5 block">100% इंजन रेडी</span>
          </div>

          <div className="bg-[#0B0F19]/80 rounded-xl p-3 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">आज स्वतः प्रोसेस की गई खबरें</span>
            <div className="text-xl sm:text-2xl font-black text-[#FFED00] mt-1 flex items-center justify-between">
              <span>{totalTriggersToday}</span>
              <Zap className="w-4 h-4 text-[#FFED00]" />
            </div>
            <span className="text-[10px] text-slate-300 mt-0.5 block">98.8% सफलता दर</span>
          </div>

          <div className="bg-[#0B0F19]/80 rounded-xl p-3 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">पेंडिंग शेड्यूल्ड स्लॉट्स</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center justify-between">
              <span>{totalScheduledPending}</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[10px] text-amber-300 mt-0.5 block">प्राइम टाइम स्लॉट्स लॉक</span>
          </div>

          <div className="bg-[#0B0F19]/80 rounded-xl p-3 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">मल्टी-चैनल कनेक्शन स्थिति</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 flex items-center justify-between">
              <span>6 / 6 सक्रिय</span>
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">FB, IG, WA, TG, YT, X</span>
          </div>
        </div>
      </div>

      {/* ================= TAB NAVIGATION ================= */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'rules'
                ? 'bg-gradient-to-r from-[#E21A25] to-[#B70F18] text-white shadow-lg shadow-red-900/40 ring-1 ring-[#FFED00]'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Settings2 className="w-4 h-4 text-[#FFED00]" />
            <span>1. ऑटो-पायलट रूल्स इंजन ({rules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'bg-gradient-to-r from-[#E21A25] to-[#B70F18] text-white shadow-lg shadow-red-900/40 ring-1 ring-[#FFED00]'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#FFED00]" />
            <span>2. शेड्यूलिंग कैलेंडर व टाइम स्लॉट्स ({scheduledPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('platforms')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'platforms'
                ? 'bg-gradient-to-r from-[#E21A25] to-[#B70F18] text-white shadow-lg shadow-red-900/40 ring-1 ring-[#FFED00]'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>3. मल्टी-प्लेटफॉर्म व रेट लिमिट गार्ड</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-gradient-to-r from-[#E21A25] to-[#B70F18] text-white shadow-lg shadow-red-900/40 ring-1 ring-[#FFED00]'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>4. लाइव एक्जीक्यूशन ऑडिट लॉग्स ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: RULES ENGINE ================= */}
      {activeTab === 'rules' && (
        <section className="space-y-4">
          {/* Controls & Filter Bar */}
          <div className="bg-[#121622] p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="रूल का नाम, जिला या कैटेगरी से खोजें..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E21A25]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-slate-400 font-bold shrink-0">फिल्टर:</span>
              {(['ALL', 'ACTIVE', 'PAUSED', 'AUTO', 'APPROVAL'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                    selectedStatusFilter === f
                      ? 'bg-[#E21A25] text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f === 'ALL' && 'सभी रूल्स'}
                  {f === 'ACTIVE' && 'सक्रिय (Active)'}
                  {f === 'PAUSED' && 'पॉज़्ड (Paused)'}
                  {f === 'AUTO' && 'फुल ऑटोपायलट'}
                  {f === 'APPROVAL' && 'अप्रूवल कतार'}
                </button>
              ))}
            </div>
          </div>

          {/* Rules List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRules.map(rule => (
              <div
                key={rule.id}
                className={`bg-[#121622] rounded-2xl border transition-all duration-200 p-5 space-y-4 shadow-xl flex flex-col justify-between ${
                  rule.isActive
                    ? 'border-slate-800 hover:border-red-600/60'
                    : 'border-slate-800/50 opacity-70 bg-slate-950/40'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                            rule.mode === 'AUTO_PUBLISH'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {rule.mode === 'AUTO_PUBLISH' ? '⚡ फुल ऑटो-पायलट' : '🛡️ एडमिन अप्रूवल मोड'}
                        </span>
                        <span className="bg-red-950/70 text-[#FFED00] text-[10px] font-bold px-2 py-0.5 rounded border border-red-700/50">
                          {rule.districtHindi}
                        </span>
                        <span className="bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-800">
                          {rule.triggerType}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-white leading-snug pt-1">
                        {rule.name}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>

                    {/* Active/Pause Switch */}
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                        rule.isActive
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title={rule.isActive ? 'रूल पॉज़ करें' : 'रूल एक्टिव करें'}
                    >
                      {rule.isActive ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Conditions & Action Summary Grid */}
                  <div className="grid grid-cols-2 gap-2.5 py-3 text-xs">
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block font-bold">स्रोत (Source Feed):</span>
                      <span className="font-semibold text-slate-200 line-clamp-1">{rule.sourceName}</span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block font-bold">प्राथमिकता / वायरल कट-ऑफ:</span>
                      <span className="font-semibold text-[#FFED00]">
                        {rule.urgencyThreshold} • स्कोर: {rule.viralScoreMin}+
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block font-bold">4:5 ग्राफिक टेम्पलेट:</span>
                      <span className="font-semibold text-white">{rule.graphicTemplate}</span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block font-bold">आज ट्रिगर संख्या:</span>
                      <span className="font-mono font-bold text-emerald-400">{rule.triggersToday} खबरें</span>
                    </div>
                  </div>

                  {/* Target Platforms Badges */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      सिंडिकेशन लक्ष्य प्लेटफॉर्म्स:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {rule.targetPlatforms.facebook && (
                        <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded border border-blue-700/50 font-bold">
                          FB Page
                        </span>
                      )}
                      {rule.targetPlatforms.instagram && (
                        <span className="bg-pink-900/40 text-pink-300 px-2 py-0.5 rounded border border-pink-700/50 font-bold">
                          Insta 4:5
                        </span>
                      )}
                      {rule.targetPlatforms.telegram && (
                        <span className="bg-sky-900/40 text-sky-300 px-2 py-0.5 rounded border border-sky-700/50 font-bold">
                          Telegram Bot
                        </span>
                      )}
                      {rule.targetPlatforms.whatsapp && (
                        <span className="bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50 font-bold">
                          WhatsApp Channel
                        </span>
                      )}
                      {rule.targetPlatforms.youtube && (
                        <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded border border-red-700/50 font-bold">
                          YouTube Community
                        </span>
                      )}
                      {rule.targetPlatforms.twitter && (
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-bold">
                          X Alert
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] text-slate-400">
                    आखिरी ट्रिगर: <strong className="text-slate-200">{rule.lastTriggeredAt}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRunRuleTestNow(rule)}
                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                      title="इस नियम का अभी टेस्ट रन करें"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#FFED00]" />
                      <span>टेस्ट रन करें</span>
                    </button>

                    <button
                      onClick={() => openEditRuleModal(rule)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border border-slate-700"
                      title="रूल एडिट करें"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#FFED00]" />
                    </button>

                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border border-red-800/50"
                      title="रूल डिलीट करें"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= TAB 2: SCHEDULED POSTS MATRIX & CALENDAR ================= */}
      {activeTab === 'schedule' && (
        <section className="space-y-6">
          {/* Peak Time Slots Preset Cards */}
          <div className="bg-[#121622] p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Timer className="w-5 h-5 text-[#FFED00]" />
                  <span>दैनिक पीक टाइम स्लॉट्स (High Engagement Posting Windows)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  मध्य प्रदेश में सोशल मीडिया और यूट्यूब पर सर्वाधिक दर्शक उपस्थिति वाले निर्धारित समय स्लॉट्स।
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="bg-[#E21A25] hover:bg-[#B70F18] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-[#FFED00]" />
                <span>+ स्लॉट में खबर जोड़ें</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Slot 1 */}
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">स्लॉट 1 (मॉर्निंग)</span>
                  <span className="text-xs font-mono font-black text-white">08:00 AM</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">सुबह की मुख्य सुर्खियां</h4>
                <p className="text-[11px] text-slate-400">दैनिक समाचार पत्र सारांश व आज के बड़े कार्यक्रम।</p>
                <div className="pt-2 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>1 खबर शेड्यूल्ड</span>
                </div>
              </div>

              {/* Slot 2 */}
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">स्लॉट 2 (दोपहर)</span>
                  <span className="text-xs font-mono font-black text-white">01:30 PM</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">दोपहर का तेज बुलेटिन</h4>
                <p className="text-[11px] text-slate-400">लंच ब्रेक व सरकारी फैसलों का त्वरित अपडेट।</p>
                <div className="pt-2 text-[10px] text-slate-400 flex items-center gap-1">
                  <span>सफलतापूर्वक पब्लिश हो चुका</span>
                </div>
              </div>

              {/* Slot 3 */}
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-red-900/40 space-y-1.5 bg-gradient-to-br from-slate-900 to-red-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#FFED00] bg-red-600/30 px-2 py-0.5 rounded">स्लॉट 3 (प्राइम शाम)</span>
                  <span className="text-xs font-mono font-black text-[#FFED00]">06:30 PM</span>
                </div>
                <h4 className="text-xs font-bold text-white">शाम की बड़ी खबरें व कलेक्टोरेट</h4>
                <p className="text-[11px] text-slate-300">घर लौटते समय पीक ट्रैफिक व नागरिक मुद्दे।</p>
                <div className="pt-2 text-[10px] text-amber-300 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>अगला स्लॉट (28 मिनट बाद)</span>
                </div>
              </div>

              {/* Slot 4 */}
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-900/40 space-y-1.5 bg-gradient-to-br from-slate-900 to-purple-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">स्लॉट 4 (प्राइम नाइट)</span>
                  <span className="text-xs font-mono font-black text-white">08:45 PM</span>
                </div>
                <h4 className="text-xs font-bold text-white">प्राइम टाइम वीडियो व विश्लेषण</h4>
                <p className="text-[11px] text-slate-300">यूट्यूब व फेसबुक रील्स का सर्वाधिक वॉचटाइम।</p>
                <div className="pt-2 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>1 खबर शेड्यूल्ड</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduled Queue Items List */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FFED00]" />
              <span>कतार में लगी शेड्यूल्ड खबरें ({scheduledPosts.length})</span>
            </h3>

            <div className="space-y-3">
              {scheduledPosts.map(post => {
                const isPublished = post.status === 'PUBLISHED';
                return (
                  <div
                    key={post.id}
                    className={`bg-[#121622] rounded-2xl border p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl ${
                      isPublished ? 'border-slate-800/60 bg-slate-950/50' : 'border-slate-800 hover:border-amber-500/50'
                    }`}
                  >
                    {/* Left: Thumbnail & Content */}
                    <div className="flex items-start gap-3.5 flex-1">
                      <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-900 relative border border-slate-700/80">
                        <img
                          src={post.imageUrl}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <span className="absolute top-1 left-1 bg-[#E21A25] text-white text-[8px] font-bold px-1 rounded shadow">
                          {post.districtHindi}
                        </span>
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                              isPublished
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {isPublished ? '✓ पब्लिश हो चुका' : '⏰ शेड्यूल्ड'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {post.category}
                          </span>
                          <span className="text-[10px] font-mono text-[#FFED00]">
                            {post.scheduledTime}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                          {post.title}
                        </h4>

                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {post.summary}
                        </p>

                        {/* Channels target */}
                        <div className="flex items-center gap-1.5 pt-1 text-[9px] text-slate-400">
                          <span>सिंडिकेशन:</span>
                          {post.platforms.facebook && <span className="text-blue-400 font-bold">FB</span>}
                          {post.platforms.instagram && <span className="text-pink-400 font-bold">IG</span>}
                          {post.platforms.telegram && <span className="text-sky-400 font-bold">TG</span>}
                          {post.platforms.whatsapp && <span className="text-emerald-400 font-bold">WA</span>}
                          {post.platforms.youtube && <span className="text-red-400 font-bold">YT</span>}
                          {post.platforms.twitter && <span className="text-slate-300 font-bold">X</span>}
                        </div>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {!isPublished && (
                        <>
                          <button
                            onClick={() => handlePublishScheduledNow(post.id)}
                            className="bg-[#E21A25] hover:bg-[#B70F18] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                            title="शेड्यूल का इंतज़ार किए बिना अभी लाइव करें"
                          >
                            <Send className="w-3.5 h-3.5 text-[#FFED00]" />
                            <span>अभी पब्लिश करें</span>
                          </button>

                          <button
                            onClick={() => handleOpenReschedule(post)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                            title="समय बदलें"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>समय बदलें</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleCancelScheduledPost(post.id)}
                        className="bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-white p-2 rounded-xl border border-red-900/60 transition-all cursor-pointer"
                        title="रद्द करें"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 3: PLATFORMS & RATE LIMITS ================= */}
      {activeTab === 'platforms' && (
        <section className="space-y-6">
          <div className="bg-[#121622] p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <span>मल्टी-प्लेटफॉर्म सिंडिकेशन मैपिंग व दैनिक कोटा (Platform Quotas & Rate Limits)</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                सोशल मीडिया अकाउंट्स को स्पैम बैन से सुरक्षित रखने हेतु दैनिक अधिकतम पोस्ट सीमा और पोस्टिंग के बीच न्यूनतम अंतराल (Cooldown Interval) का प्रबंधन।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platformConfigs.map(p => {
                const percent = Math.round((p.usedToday / p.dailyQuota) * 100);
                return (
                  <div key={p.platformId} className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {p.badge}
                        </span>
                        <h4 className="text-sm font-black text-white mt-0.5">{p.name}</h4>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-live shrink-0"></span>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono truncate">
                      {p.connectedAccountName}
                    </div>

                    {/* Quota Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">दैनिक उपयोग:</span>
                        <span className="font-mono font-bold text-white">
                          {p.usedToday} / {p.dailyQuota} पोस्ट्स ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent > 80 ? 'bg-red-500' : percent > 50 ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800 text-slate-400">
                      <span>न्यूनतम अंतराल:</span>
                      <strong className="text-[#FFED00]">{p.minIntervalMinutes} मिनट का गैप</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anti-Spam Safeguards Settings Card */}
          <div className="bg-[#121622] p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>एंटी-स्पैम व स्मार्ट रिस्क प्रोटेक्शन सेटिंग्स</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">डुप्लिकेट टॉपिक डिटेक्शन (Content Hash Guard)</div>
                    <div className="text-[10px] text-slate-400">पिछले 6 घंटों में समान खबर को दोबारा पोस्ट होने से रोकेगा</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={antiSpamConfig.duplicateHashGuard}
                    onChange={e =>
                      setAntiSpamConfig(prev => ({ ...prev, duplicateHashGuard: e.target.checked }))
                    }
                    className="w-4 h-4 accent-[#E21A25] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-300">डिटेक्शन टाइम-विंडो:</span>
                  <span className="bg-slate-950 px-2 py-1 rounded text-white font-mono font-bold">
                    {antiSpamConfig.duplicateWindowHours} घंटे
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">AI कॉन्फिडेंस स्कोर थ्रेशोल्ड</div>
                    <div className="text-[10px] text-slate-400">यदि AI तथ्य व भाषाई स्कोर इस अंक से कम हो तो अप्रूवल में रोकें</div>
                  </div>
                  <span className="text-[#FFED00] font-mono font-bold text-sm">
                    {antiSpamConfig.autoAIReviewScoreMin}%
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
                  <input
                    type="range"
                    min="60"
                    max="95"
                    value={antiSpamConfig.autoAIReviewScoreMin}
                    onChange={e =>
                      setAntiSpamConfig(prev => ({
                        ...prev,
                        autoAIReviewScoreMin: Number(e.target.value)
                      }))
                    }
                    className="flex-1 accent-[#E21A25] cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">न्यूनतम 85% अनुशंसित</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 4: AUDIT LOGS ================= */}
      {activeTab === 'logs' && (
        <section className="space-y-4">
          <div className="bg-[#121622] p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>लाइव ऑटोमेशन एक्जीक्यूशन ऑडिट ट्रेल</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                ऑटो-पायलट ट्रिगर्स, सोशल API कॉल्स, HTTP लेटेंसी और त्रुटि निवारण का रीयल-टाइम रिकॉर्ड।
              </p>
            </div>

            <button
              onClick={() => onShowToast('ऑडिट लॉग्स CSV एक्सपोर्ट तैयार!', 'ब्राउज़र में डाउनलोड प्रारंभ हुआ')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#FFED00]" />
              <span>लॉग्स एक्सपोर्ट (CSV)</span>
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
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : log.status === 'APPROVAL_HOLD'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {log.status === 'SUCCESS' && '✓ सफल (200 OK)'}
                      {log.status === 'APPROVAL_HOLD' && '🛡️ अप्रूवल कतार में'}
                      {log.status === 'FAILED' && '✕ विफलता'}
                    </span>

                    <span className="font-bold text-white text-xs">{log.ruleName}</span>
                    <span className="text-[10px] text-slate-400">({log.district})</span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                    <span>लेटेंसी: {log.responseLatencyMs}ms</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-200">{log.articleTitle}</h5>
                    <p className="text-[11px] text-slate-400">{log.logMessage}</p>
                  </div>

                  {log.directUrl && (
                    <a
                      href={log.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFED00] hover:underline flex items-center gap-1 shrink-0 text-[11px] font-bold"
                    >
                      <span>पोस्ट देखें</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-1 text-[9px] text-slate-500">
                  <span>नेटवर्क्स:</span>
                  {log.platformsTargeted.map((plat, idx) => (
                    <span key={idx} className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300 border border-slate-800">
                      {plat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= MODAL: ADD / EDIT AUTOMATION RULE ================= */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#121622] w-full max-w-3xl rounded-2xl border-2 border-[#E21A25] p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#FFED00]" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  {editingRule ? 'ऑटो-पायलट रूल संपादित करें' : '+ नया ऑटो-पायलट न्यूज़ सिंडिकेशन रूल जोड़ें'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddRuleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">रूल का नाम:</label>
                  <input
                    type="text"
                    value={ruleFormName}
                    onChange={e => setRuleFormName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#E21A25]"
                    placeholder="उदा: भोपाल कलेक्ट्रेट ब्रेकिंग न्यूज़"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">ट्रिगर का प्रकार:</label>
                  <select
                    value={ruleFormTrigger}
                    onChange={e => setRuleFormTrigger(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="RSS">RSS XML न्यूज़ फीड</option>
                    <option value="GOVT_WIRE">सरकारी प्रेस विज्ञप्ति / DPR MP</option>
                    <option value="VIRAL_ALERT">वायरल रडार अलर्ट (Velocity &gt; 80)</option>
                    <option value="KEYWORD">कीवर्ड फ़िल्टर मैच</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">विवरण / उद्देश्य:</label>
                <input
                  type="text"
                  value={ruleFormDesc}
                  onChange={e => setRuleFormDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#E21A25]"
                  placeholder="उदा: कोलार सिक्स लेन और भोपाल कलेक्ट्रेट की ताज़ा खबरों को प्राथमिकता देना।"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">स्रोत का नाम (Source Name):</label>
                  <input
                    type="text"
                    value={ruleFormSourceName}
                    onChange={e => setRuleFormSourceName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                    placeholder="उदा: भोपाल जनसंपर्क RSS"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">फीड URL:</label>
                  <input
                    type="url"
                    value={ruleFormSourceUrl}
                    onChange={e => setRuleFormSourceUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    placeholder="https://breakingnewswala.in/feeds/bhopal.xml"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">लक्षित जिला:</label>
                  <select
                    value={ruleFormDistrict}
                    onChange={e => setRuleFormDistrict(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="ALL_MP">सम्पूर्ण मध्य प्रदेश (All MP)</option>
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
                  <label className="font-bold text-slate-300 block mb-1">प्राथमिकता सीमा (Urgency):</label>
                  <select
                    value={ruleFormUrgency}
                    onChange={e => setRuleFormUrgency(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="ALL">सभी खबरें (All)</option>
                    <option value="TOP_STORY">केवल टॉप स्टोरी या ब्रेकिंग</option>
                    <option value="BREAKING_ONLY">केवल ब्रेकिंग न्यूज़ (Urgent)</option>
                    <option value="VIRAL_ONLY">केवल वायरल अलर्ट</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">4:5 ग्राफिक कार्ड टेम्पलेट:</label>
                  <select
                    value={ruleFormTemplate}
                    onChange={e => setRuleFormTemplate(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="News-Alert">सिग्नेचर न्यूज़ अलर्ट (News-Alert)</option>
                    <option value="Minimalist">मिनिमलिस्ट मॉडर्न (Minimalist)</option>
                    <option value="Poll-Format">जनता पोल फॉर्मेट (Poll-Format)</option>
                  </select>
                </div>
              </div>

              {/* Execution Mode */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <label className="font-bold text-slate-300 block">एक्जीक्यूशन मोड (Execution Mode):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="ruleMode"
                      value="ADMIN_APPROVAL"
                      checked={ruleFormMode === 'ADMIN_APPROVAL'}
                      onChange={() => setRuleFormMode('ADMIN_APPROVAL')}
                      className="mt-0.5 accent-[#E21A25]"
                    />
                    <div>
                      <span className="font-bold text-white block">🛡️ एडमिन अप्रूवल मोड (अनुशंसित)</span>
                      <span className="text-[10px] text-slate-400">कार्ड और कैप्शन जनरेट होगा, एडमिन के 'अप्रूव' दबाने पर पब्लिश होगा</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="ruleMode"
                      value="AUTO_PUBLISH"
                      checked={ruleFormMode === 'AUTO_PUBLISH'}
                      onChange={() => setRuleFormMode('AUTO_PUBLISH')}
                      className="mt-0.5 accent-[#E21A25]"
                    />
                    <div>
                      <span className="font-bold text-white block">⚡ फुल ऑटो-पायलट (Direct Publish)</span>
                      <span className="text-[10px] text-slate-400">फीड आते ही AI कार्ड बनाकर तुरंत सीधे सोशल मीडिया पर लाइव कर देगा</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Target Platforms Toggles */}
              <div className="space-y-2 pt-1">
                <label className="font-bold text-slate-300 block">लक्ष्य सोशल मीडिया प्लेटफॉर्म्स:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ruleFormPlatforms.facebook}
                      onChange={e => setRuleFormPlatforms(p => ({ ...p, facebook: e.target.checked }))}
                      className="accent-[#E21A25]"
                    />
                    <span className="text-white font-semibold">Facebook Page</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ruleFormPlatforms.instagram}
                      onChange={e => setRuleFormPlatforms(p => ({ ...p, instagram: e.target.checked }))}
                      className="accent-[#E21A25]"
                    />
                    <span className="text-white font-semibold">Instagram (4:5 Feed)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ruleFormPlatforms.telegram}
                      onChange={e => setRuleFormPlatforms(p => ({ ...p, telegram: e.target.checked }))}
                      className="accent-[#E21A25]"
                    />
                    <span className="text-white font-semibold">Telegram Channel</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ruleFormPlatforms.whatsapp}
                      onChange={e => setRuleFormPlatforms(p => ({ ...p, whatsapp: e.target.checked }))}
                      className="accent-[#E21A25]"
                    />
                    <span className="text-white font-semibold">WhatsApp Cloud API</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ruleFormPlatforms.youtube}
                      onChange={e => setRuleFormPlatforms(p => ({ ...p, youtube: e.target.checked }))}
                      className="accent-[#E21A25]"
                    />
                    <span className="text-white font-semibold">YouTube Community</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ruleFormPlatforms.twitter}
                      onChange={e => setRuleFormPlatforms(p => ({ ...p, twitter: e.target.checked }))}
                      className="accent-[#E21A25]"
                    />
                    <span className="text-white font-semibold">X (Twitter Alert)</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#E21A25] hover:bg-[#B70F18] text-white font-bold shadow-lg shadow-red-900/40 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#FFED00]" />
                  <span>{editingRule ? 'रूल सुरक्षित करें' : 'रूल सक्रिय करें'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUICK SCHEDULE NEW POST ================= */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#121622] w-full max-w-2xl rounded-2xl border-2 border-emerald-500 p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FFED00]" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  + नई खबर सोशल मीडिया पर शेड्यूल करें
                </h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewSchedule} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">समाचार हेडलाइन:</label>
                <input
                  type="text"
                  value={schedTitle}
                  onChange={e => setSchedTitle(e.target.value)}
                  placeholder="उदा: भोपाल: कोलार सिक्स लेन प्रोजेक्ट 15 मई तक पूरा होगा"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">सारांश / मुख्य बिंदु:</label>
                <textarea
                  value={schedSummary}
                  onChange={e => setSchedSummary(e.target.value)}
                  placeholder="5 लाख नागरिकों को रोजाना ट्रैफिक जाम से मिलेगी मुक्ति..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white h-20 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">जिला चुनें:</label>
                  <select
                    value={schedDistrict}
                    onChange={e => setSchedDistrict(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Bhopal">भोपाल (Bhopal)</option>
                    <option value="Indore">इंदौर (Indore)</option>
                    <option value="Jabalpur">जबलपुर (Jabalpur)</option>
                    <option value="Gwalior">ग्वालियर (Gwalior)</option>
                    <option value="Ujjain">उज्जैन (Ujjain)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">तय समय स्लॉट (Posting Slot):</label>
                  <select
                    value={schedSlotPreset}
                    onChange={e => setSchedSlotPreset(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="MORNING">स्लॉट 1: सुबह 08:00 AM (मॉर्निंग सुर्खियां)</option>
                    <option value="AFTERNOON">स्लॉट 2: दोपहर 01:30 PM (दोपहर बुलेटिन)</option>
                    <option value="EVENING">स्लॉट 3: शाम 06:30 PM (प्राइम इवनिंग)</option>
                    <option value="PRIME_NIGHT">स्लॉट 4: रात 08:45 PM (प्राइम नाइट)</option>
                    <option value="CUSTOM">कस्टम समय चुनें</option>
                  </select>
                </div>
              </div>

              {schedSlotPreset === 'CUSTOM' && (
                <div>
                  <label className="font-bold text-slate-300 block mb-1">कस्टम समय (24 Hour Time):</label>
                  <input
                    type="time"
                    value={schedCustomTime}
                    onChange={e => setSchedCustomTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              )}

              {/* Target Platforms */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 block">किन नेटवर्क्स पर पोस्ट करें:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedPlatforms.facebook}
                      onChange={e => setSchedPlatforms(p => ({ ...p, facebook: e.target.checked }))}
                      className="accent-emerald-500"
                    />
                    <span className="text-white">Facebook Page</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedPlatforms.instagram}
                      onChange={e => setSchedPlatforms(p => ({ ...p, instagram: e.target.checked }))}
                      className="accent-emerald-500"
                    />
                    <span className="text-white">Instagram 4:5</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedPlatforms.telegram}
                      onChange={e => setSchedPlatforms(p => ({ ...p, telegram: e.target.checked }))}
                      className="accent-emerald-500"
                    />
                    <span className="text-white">Telegram Channel</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedPlatforms.whatsapp}
                      onChange={e => setSchedPlatforms(p => ({ ...p, whatsapp: e.target.checked }))}
                      className="accent-emerald-500"
                    />
                    <span className="text-white">WhatsApp Official</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedPlatforms.twitter}
                      onChange={e => setSchedPlatforms(p => ({ ...p, twitter: e.target.checked }))}
                      className="accent-emerald-500"
                    />
                    <span className="text-white">X (Twitter)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#FFED00]" />
                  <span>शेड्यूल लॉक करें</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESCHEDULE TIME SLOT ================= */}
      {rescheduleTargetPost && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="bg-[#121622] w-full max-w-md rounded-2xl border-2 border-amber-500 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>नया समय स्लॉट चुनें</span>
              </h4>
              <button
                onClick={() => setRescheduleTargetPost(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2">
              <strong>{rescheduleTargetPost.title}</strong>
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleConfirmReschedule('MORNING')}
                className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>🌅 स्लॉट 1: कल सुबह 08:00 AM (मॉर्निंग)</span>
                <span className="text-[10px] text-amber-300">08:00</span>
              </button>

              <button
                onClick={() => handleConfirmReschedule('AFTERNOON')}
                className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>☀️ स्लॉट 2: आज दोपहर 01:30 PM (बुलेटिन)</span>
                <span className="text-[10px] text-sky-300">13:30</span>
              </button>

              <button
                onClick={() => handleConfirmReschedule('EVENING')}
                className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>🌆 स्लॉट 3: आज शाम 06:30 PM (प्राइम इवनिंग)</span>
                <span className="text-[10px] text-[#FFED00]">18:30</span>
              </button>

              <button
                onClick={() => handleConfirmReschedule('PRIME_NIGHT')}
                className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>🌙 स्लॉट 4: आज रात 08:45 PM (प्राइम नाइट)</span>
                <span className="text-[10px] text-purple-300">20:45</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
