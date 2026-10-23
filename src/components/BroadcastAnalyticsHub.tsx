import React, { useState, useMemo } from 'react';
import {
  Share2,
  Send,
  MessageCircle,
  Bell,
  Flame,
  TrendingUp,
  Radio,
  Sparkles,
  CheckCircle2,
  Users,
  Eye,
  ArrowUpRight,
  Download,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Calendar,
  Layers,
  Zap,
  Globe,
  ThumbsUp,
  MessageSquare,
  RefreshCw,
  HelpCircle,
  Clock,
  MapPin,
  Tag,
  ExternalLink,
  ChevronRight,
  Filter,
  BarChart3,
  Sliders,
  CheckCheck
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

export interface BroadcastAnalyticsHubProps {
  onShowToast: (title: string, desc?: string) => void;
  initialSubTab?: 'broadcast' | 'push' | 'community' | 'viral' | 'analytics';
  onCreateGraphic?: (data: { district: string; headline: string; summary: string; urgency: string }) => void;
  onOpenVideoStudio?: (headline: string) => void;
  analyticsData?: Array<{ day: string; date: string; views: number; followers: number }>;
}

// 30-Day Growth Analytics Seed Data
const default30DaysData = [
  { day: '1', date: '18 Sep', views: 185000, followers: 1420, shares: 14200 },
  { day: '2', date: '19 Sep', views: 210000, followers: 1650, shares: 16100 },
  { day: '3', date: '20 Sep', views: 195000, followers: 1510, shares: 15400 },
  { day: '4', date: '21 Sep', views: 240000, followers: 1890, shares: 18900 },
  { day: '5', date: '22 Sep', views: 280000, followers: 2340, shares: 22100 },
  { day: '6', date: '23 Sep', views: 260000, followers: 2100, shares: 20500 },
  { day: '7', date: '24 Sep', views: 310000, followers: 2580, shares: 24800 },
  { day: '8', date: '25 Sep', views: 290000, followers: 2240, shares: 23100 },
  { day: '9', date: '26 Sep', views: 305000, followers: 2410, shares: 24200 },
  { day: '10', date: '27 Sep', views: 340000, followers: 2790, shares: 27400 },
  { day: '11', date: '28 Sep', views: 320000, followers: 2600, shares: 25600 },
  { day: '12', date: '29 Sep', views: 360000, followers: 2950, shares: 28900 },
  { day: '13', date: '30 Sep', views: 330000, followers: 2710, shares: 26500 },
  { day: '14', date: '01 Oct', views: 390000, followers: 3120, shares: 31400 },
  { day: '15', date: '02 Oct', views: 420000, followers: 3450, shares: 34200 },
  { day: '16', date: '03 Oct', views: 380000, followers: 3010, shares: 30100 },
  { day: '17', date: '04 Oct', views: 350000, followers: 2840, shares: 27800 },
  { day: '18', date: '05 Oct', views: 375000, followers: 2990, shares: 29800 },
  { day: '19', date: '06 Oct', views: 410000, followers: 3320, shares: 32900 },
  { day: '20', date: '07 Oct', views: 395000, followers: 3180, shares: 31200 },
  { day: '21', date: '08 Oct', views: 430000, followers: 3510, shares: 34600 },
  { day: '22', date: '09 Oct', views: 405000, followers: 3290, shares: 32100 },
  { day: '23', date: '10 Oct', views: 460000, followers: 3840, shares: 37200 },
  { day: '24', date: '11 Oct', views: 440000, followers: 3620, shares: 35100 },
  { day: '25', date: '12 Oct', views: 480000, followers: 4010, shares: 39200 },
  { day: '26', date: '13 Oct', views: 510000, followers: 4290, shares: 41800 },
  { day: '27', date: '14 Oct', views: 470000, followers: 3910, shares: 38400 },
  { day: '28', date: '15 Oct', views: 520000, followers: 4350, shares: 42900 },
  { day: '29', date: '16 Oct', views: 550000, followers: 4620, shares: 45600 },
  { day: '30', date: '17 Oct', views: 585000, followers: 4980, shares: 48900 }
];

export const BroadcastAnalyticsHub: React.FC<BroadcastAnalyticsHubProps> = ({
  onShowToast,
  initialSubTab = 'broadcast',
  onCreateGraphic,
  onOpenVideoStudio,
  analyticsData = default30DaysData
}) => {
  const [subTab, setSubTab] = useState<'broadcast' | 'push' | 'community' | 'viral' | 'analytics'>(initialSubTab);

  // 1. WhatsApp & Telegram Broadcast States
  const [targetChannel, setTargetChannel] = useState<'main' | 'bhopal' | 'indore' | 'gwalior' | 'ujjain'>('main');
  const [broadcastHeadline, setBroadcastHeadline] = useState(
    'कोलार सिक्स लेन का काम अंतिम चरण में, 15 मई तक पूरा होगा डामरीकरण!'
  );
  const [broadcastSummary, setBroadcastSummary] = useState(
    '5 लाख नागरिकों को रोजाना भारी ट्रैफिक जाम से स्थायी राहत मिलेगी। नगर निगम और पीडब्ल्यूडी ने 15 मई तक सड़क का डामरीकरण और डिवाइडर ब्यूटीफिकेशन पूरा करने की डेडलाइन तय की है।'
  );
  const [broadcastLink, setBroadcastLink] = useState('https://breakingnewswala.in/bhopal-kolar-six-lane-update');
  const [broadcastImageUrl, setBroadcastImageUrl] = useState(
    'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80'
  );
  const [broadcastBullets, setBroadcastBullets] = useState<string[]>([
    'कोलार रूट के 5 लाख नागरिकों को ट्रैफिक जाम से मिलेगी मुक्ति।',
    'नगर निगम व PWD ने 15 मई की डेडलाइन की तय।',
    'स्थानीय विधायक व अधिकारियों ने सुबह 8 बजे किया ग्राउंड निरीक्षण।'
  ]);
  const [includeCtaButtons, setIncludeCtaButtons] = useState(true);
  const [autoPinTelegram, setAutoPinTelegram] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [copiedWA, setCopiedWA] = useState(false);

  // 2. Web Push Notification States
  const [pushTitle, setPushTitle] = useState('🚨 ब्रेकिंग: भोपाल कोलार सिक्स लेन 15 मई तक पूरी');
  const [pushBody, setPushBody] = useState(
    '5 लाख नागरिकों को ट्रैफिक जाम से मुक्ति! PWD और नगर निगम ने तय की अंतिम डेडलाइन।'
  );
  const [pushTargetSegment, setPushTargetSegment] = useState<'all' | 'bhopal' | 'malwa' | 'gwalior' | 'bundelkhand'>('bhopal');
  const [pushUrgency, setPushUrgency] = useState<'breaking' | 'viral' | 'alert'>('breaking');
  const [pushDeviceView, setPushDeviceView] = useState<'android' | 'desktop'>('android');
  const [pushSending, setPushSending] = useState(false);
  const [testPushSent, setTestPushSent] = useState(false);

  // 3. Community Facebook Groups States
  const [selectedGroups, setSelectedGroups] = useState<string[]>([
    'grp-bhopal-1',
    'grp-indore-2',
    'grp-gwalior-3',
    'grp-ujjain-4',
    'grp-jabalpur-5',
    'grp-sagar-6',
    'grp-schemes-7',
    'grp-rewa-8'
  ]);
  const [groupPinnedComment, setGroupPinnedComment] = useState('👉 इस सड़क प्रोजेक्ट पर आपकी क्या राय है? कमेंट में अपने विचार जरूर शेयर करें!');
  const [isCrossPosting, setIsCrossPosting] = useState(false);
  const [crossPostProgress, setCrossPostProgress] = useState(0);

  // 4. Live Viral Radar States
  const [viralRegionFilter, setViralRegionFilter] = useState<'ALL' | 'Bhopal' | 'Malwa' | 'Gwalior' | 'Mahakoshal' | 'Bundelkhand'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 5. Analytics View States
  const [chartMetricFilter, setChartMetricFilter] = useState<'both' | 'views' | 'followers' | 'shares'>('both');
  const [timeRangeFilter, setTimeRangeFilter] = useState<'7d' | '14d' | '30d'>('30d');

  // Filtered Analytics Data based on time range
  const filteredAnalyticsData = useMemo(() => {
    if (timeRangeFilter === '7d') return analyticsData.slice(-7);
    if (timeRangeFilter === '14d') return analyticsData.slice(-14);
    return analyticsData;
  }, [analyticsData, timeRangeFilter]);

  // Formatted WhatsApp Raw Text
  const waFormattedText = useMemo(() => {
    return `🔴 *ब्रेकिंग न्यूज वाला - ${targetChannel === 'main' ? 'मध्य प्रदेश' : targetChannel.toUpperCase()} स्पेशल* 🔴

*${broadcastHeadline}*

${broadcastSummary}

📌 *मुख्य बिंदु:*
${broadcastBullets.map(b => `• ${b}`).join('\n')}

👉 *पूरी रिपोर्ट विस्तार से पढ़ें:*
${broadcastLink}

📲 *ऑफिशियल WhatsApp चैनल से जुड़ें:*
https://whatsapp.com/channel/breakingnewswala`;
  }, [targetChannel, broadcastHeadline, broadcastSummary, broadcastBullets, broadcastLink]);

  // Handle WhatsApp Copy
  const handleCopyWA = () => {
    navigator.clipboard.writeText(waFormattedText);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2000);
    onShowToast('WhatsApp टेक्स्ट क्लिपबोर्ड पर कॉपी हुआ!', 'सीधे ग्रुप्स या स्टेटस में पेस्ट कर सकते हैं।');
  };

  // Dispatch Broadcast Action
  const handleDispatchBroadcast = (platform: 'both' | 'whatsapp' | 'telegram') => {
    setIsBroadcasting(true);
    const channelName =
      targetChannel === 'main'
        ? 'मुख्य चैनल (142,500+ फॉलोअर्स)'
        : `${targetChannel.toUpperCase()} जिला चैनल`;

    setTimeout(() => {
      setIsBroadcasting(false);
      if (platform === 'both') {
        onShowToast(
          'सफलता: WhatsApp व Telegram पर ब्रॉडकास्ट भेजा गया!',
          `${channelName} और Telegram Bot Hub को सफलतापूर्वक डिलीवर किया गया।`
        );
      } else if (platform === 'whatsapp') {
        onShowToast('WhatsApp ऑफिशियल चैनल पर ब्रॉडकास्ट लाइव!', `${channelName} पर 142K+ को डिलीवर हुआ।`);
      } else {
        onShowToast('Telegram सुपरग्रुप व चैनल पर ब्रॉडकास्ट सेंड!', '58,900 सब्सक्राइबर्स तक तुरंत पहुंच गया।');
      }
    }, 1200);
  };

  // Send Web Push Notification
  const handleSendWebPush = (isTest = false) => {
    if (isTest) {
      setTestPushSent(true);
      onShowToast('टेस्ट वेब पुश भेजा गया!', 'आपके ब्राउज़र में नोटिफिकेशन ट्रिगर हुआ।');
      setTimeout(() => setTestPushSent(false), 3000);
      return;
    }

    setPushSending(true);
    const audienceMap = {
      all: '280,000+ सभी सब्सक्राइबर्स (मप्र)',
      bhopal: '84,000+ भोपाल मेट्रो सब्सक्राइबर्स',
      malwa: '92,000+ इंदौर-उज्जैन सब्सक्राइबर्स',
      gwalior: '45,000+ ग्वालियर-चंबल सब्सक्राइबर्स',
      bundelkhand: '36,000+ सागर-बुंदेलखंड सब्सक्राइबर्स'
    };

    setTimeout(() => {
      setPushSending(false);
      onShowToast(
        'वेब पुश नोटिफिकेशन सफलतापूर्वक डिस्पैच हुआ!',
        `ऑडियंस: ${audienceMap[pushTargetSegment]} • डिलीवरी रेट: 98.6% • अनुमानित CTR: ~14.2%`
      );
    }, 1400);
  };

  // Group items list
  const communityGroupsList = [
    {
      id: 'grp-bhopal-1',
      name: 'भोपाल समाचार व जन समस्या फोरम',
      members: '125,000',
      region: 'भोपाल',
      adminRole: 'मॉडरेटर एक्सेस',
      lastPost: '25 मिनट पहले',
      status: 'active'
    },
    {
      id: 'grp-indore-2',
      name: 'इंदौर लाइव व मालवा न्यूज अपडेट्स',
      members: '98,000',
      region: 'इंदौर',
      adminRole: 'एडमिन एक्सेस',
      lastPost: '1 घंटा पहले',
      status: 'active'
    },
    {
      id: 'grp-gwalior-3',
      name: 'ग्वालियर-चंबल बुलेटिन व अलर्ट',
      members: '48,000',
      region: 'ग्वालियर',
      adminRole: 'एडमिन एक्सेस',
      lastPost: '2 घंटे पहले',
      status: 'active'
    },
    {
      id: 'grp-ujjain-4',
      name: 'उज्जैन महाकाल दर्शन व मालवा हलचल',
      members: '62,000',
      region: 'उज्जैन',
      adminRole: 'मॉडरेटर एक्सेस',
      lastPost: '40 मिनट पहले',
      status: 'active'
    },
    {
      id: 'grp-jabalpur-5',
      name: 'जबलपुर संस्कारधानी व महाकोशल न्यूज़',
      members: '54,000',
      region: 'जबलपुर',
      adminRole: 'एडमिन एक्सेस',
      lastPost: '3 घंटे पहले',
      status: 'active'
    },
    {
      id: 'grp-sagar-6',
      name: 'सागर व बुंदेलखंड जनसंदेश',
      members: '38,000',
      region: 'सागर',
      adminRole: 'एडमिन एक्सेस',
      lastPost: '1 दिन पहले',
      status: 'active'
    },
    {
      id: 'grp-schemes-7',
      name: 'मध्य प्रदेश सरकारी योजनाएं व युवा मंच',
      members: '140,000',
      region: 'समग्र मप्र',
      adminRole: 'मॉडरेटर एक्सेस',
      lastPost: '10 मिनट पहले',
      status: 'active'
    },
    {
      id: 'grp-rewa-8',
      name: 'रीवा-विंध्य हलचल व जनमत',
      members: '32,000',
      region: 'रीवा',
      adminRole: 'एडमिन एक्सेस',
      lastPost: '5 घंटे पहले',
      status: 'active'
    }
  ];

  // Toggle group selection
  const toggleGroup = (id: string) => {
    setSelectedGroups(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllGroups = () => {
    if (selectedGroups.length === communityGroupsList.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(communityGroupsList.map(g => g.id));
    }
  };

  // Cross Post Action
  const handleCrossPostGroups = () => {
    if (selectedGroups.length === 0) {
      onShowToast('कृपया कम से कम एक कम्युनिटी ग्रुप चुनें!');
      return;
    }
    setIsCrossPosting(true);
    setCrossPostProgress(20);

    const interval = setInterval(() => {
      setCrossPostProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCrossPosting(false);
          onShowToast(
            'कम्युनिटी ग्रुप्स में सफलतापूर्वक पोस्ट हुआ!',
            `${selectedGroups.length} फेसबुक ग्रुप्स में पिन किए गए सवाल के साथ खबर पब्लिश हो गई।`
          );
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Viral keywords data
  const hotKeywords = [
    {
      tag: '#BhopalKolarRoad',
      title: 'सिक्स लेन व 15 मई डेडलाइन',
      velocity: '180K / hr',
      growth: '+310% 🔥',
      score: 96,
      district: 'भोपाल',
      urgency: 'Top Story',
      category: 'विकास कार्य'
    },
    {
      tag: '#MPVidhanSabha',
      title: 'सत्र के हंगामे व बड़े विधेयक',
      velocity: '145K / hr',
      growth: '+280% 🔥',
      score: 92,
      district: 'भोपाल',
      urgency: 'Breaking',
      category: 'राजनीति'
    },
    {
      tag: '#LadliBehnaKist',
      title: 'अगली किस्त की तारीख व 1500 रु वृद्धि',
      velocity: '210K / hr',
      growth: '+420% 🔥',
      score: 98,
      district: 'समग्र मप्र',
      urgency: 'Top Story',
      category: 'योजना'
    },
    {
      tag: '#IndoreMetroTrial',
      title: 'सुपर कॉरिडोर से नया रूट ट्रायल',
      velocity: '92K / hr',
      growth: '+120%',
      score: 84,
      district: 'इंदौर',
      urgency: 'Normal',
      category: 'मेट्रो'
    },
    {
      tag: '#MahakalUjjainDarshan',
      title: 'भस्म आरती के नए नियम व स्लॉट बुकिंग',
      velocity: '110K / hr',
      growth: '+195% 🔥',
      score: 88,
      district: 'उज्जैन',
      urgency: 'Top Story',
      category: 'धर्म'
    },
    {
      tag: '#JabalpurHighCourt',
      title: 'आरक्षण व शिक्षक भर्ती पर अहम फैसला',
      velocity: '65K / hr',
      growth: '+85%',
      score: 79,
      district: 'जबलपुर',
      urgency: 'Normal',
      category: 'न्यायालय'
    },
    {
      tag: '#GwaliorHeritageFlyover',
      title: 'स्वर्ण रेखा एलिवेटेड कॉरिडोर लोकार्पण',
      velocity: '58K / hr',
      growth: '+95%',
      score: 76,
      district: 'ग्वालियर',
      urgency: 'Normal',
      category: 'इन्फ्रास्ट्रक्चर'
    },
    {
      tag: '#SagarSmartCityPark',
      title: 'लाखा बंजारा झील रिवरफ्रंट प्रोजेक्ट',
      velocity: '42K / hr',
      growth: '+60%',
      score: 72,
      district: 'सागर',
      urgency: 'Normal',
      category: 'स्मार्ट सिटी'
    }
  ];

  // District Velocity tracker data
  const districtVelocityList = [
    {
      name: 'भोपाल',
      region: 'Bhopal',
      score: 96,
      trend: 'कोलार सिक्स लेन 15 मई डेडलाइन घोषित',
      traffic: '5 लाख नागरिकों का सीधा जुड़ाव',
      status: 'सुपर वायरल 🔥',
      statusColor: 'text-red-400 bg-red-500/10 border-red-500/30'
    },
    {
      name: 'इंदौर',
      region: 'Malwa',
      score: 94,
      trend: 'इंदौर मेट्रो सेकंड फेज सुपर कॉरिडोर स्पीड टेस्ट',
      traffic: '3.2 लाख लोगों की नजर',
      status: 'सुपर वायरल 🔥',
      statusColor: 'text-red-400 bg-red-500/10 border-red-500/30'
    },
    {
      name: 'उज्जैन',
      region: 'Malwa',
      score: 88,
      trend: 'महाकाल मंदिर भस्म आरती नए स्लॉट गाइडलाइंस',
      traffic: 'श्रद्धालुओं का भारी सर्च वॉल्यूम',
      status: 'तीव्र गति ⚡',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      name: 'जबलपुर',
      region: 'Mahakoshal',
      score: 82,
      trend: 'हाईकोर्ट की अहम टिप्पणी व नर्मदा रिवरफ्रंट',
      traffic: '1.4 लाख सर्च क्वेरी',
      status: 'तीव्र गति ⚡',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      name: 'ग्वालियर',
      region: 'Gwalior',
      score: 78,
      trend: 'एलिवेटेड रोड व महाराज बाड़ा हेरिटेज जीर्णोद्धार',
      traffic: 'चंबल रीजन में ट्रेंडिंग',
      status: 'राइजिंग 📈',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      name: 'सागर',
      region: 'Bundelkhand',
      score: 74,
      trend: 'लाखा बंजारा झील सौंदर्यीकरण व स्मार्ट रोड',
      traffic: 'स्थानीय संवाद चरम पर',
      status: 'राइजिंग 📈',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      name: 'रीवा',
      region: 'Bundelkhand',
      score: 71,
      trend: 'सुपर स्पेशियलिटी हॉस्पिटल में नई मशीनों का शुभारंभ',
      traffic: 'विंध्य क्षेत्र में उच्च चर्चा',
      status: 'सामान्य ✓',
      statusColor: 'text-slate-400 bg-slate-800 border-slate-700'
    }
  ];

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return districtVelocityList.filter(d => {
      const matchRegion = viralRegionFilter === 'ALL' || d.region === viralRegionFilter;
      const matchSearch =
        searchQuery === '' ||
        d.name.includes(searchQuery) ||
        d.trend.includes(searchQuery);
      return matchRegion && matchSearch;
    });
  }, [viralRegionFilter, searchQuery]);

  // Export CSV Data
  const handleExportCSV = () => {
    const headers = 'Day,Date,Video_Views,Followers_Gained,WA_Shares\n';
    const rows = analyticsData.map(d => `${d.day},${d.date},${d.views},${d.followers},${(d as any).shares || 0}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bnw_analytics_30days_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('एनालिटिक्स CSV रिपोर्ट डाउनलोड हो गई!', 'पिछले 30 दिनों का पूर्ण डेटा स्प्रेडशीट में सहेजा गया।');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Phase 7 Header */}
      <div className="bg-[#121622] p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-[#FFED00] text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded shadow tracking-wide uppercase border border-yellow-300 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse fill-current" />
                फेज 7: ब्रॉडकास्ट व वायरल इंटेलिजेंस
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
                142K+ WA • 58.9K+ TG • 280K+ पुश
              </span>
              <span className="bg-purple-500/20 text-purple-300 font-bold text-[10px] px-2 py-0.5 rounded border border-purple-500/30">
                8.15M व्यूज / माह
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Share2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <span>ब्रॉडकास्ट, कम्युनिटी डिस्ट्रीब्यूशन व वायरल एनालिटिक्स हब</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              एक क्लिक में WhatsApp ऑफिशियल चैनल, Telegram बॉट, वेब पुश नोटिफिकेशन्स और 8 रीजनल कम्युनिटी ग्रुप्स पर खबर प्रसारित करें। 52 जिलों की वायरल वेलोसिटी ट्रैक करें और 30-दिवसीय ग्रोथ मेट्रिक्स का विश्लेषण करें।
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => {
                setSubTab('broadcast');
                handleCopyWA();
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4 text-[#FFED00]" />
              <span>{copiedWA ? 'कॉपी हो गया! ✓' : 'क्विक WA कॉपी'}</span>
            </button>
            <button
              onClick={() => {
                setSubTab('push');
                handleSendWebPush(true);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>टेस्ट पुश ट्रिगर</span>
            </button>
          </div>
        </div>

        {/* Phase 7 Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-[#232B3E] scrollbar-thin">
          <button
            onClick={() => setSubTab('broadcast')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'broadcast'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/50 border border-emerald-400'
                : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800'
            }`}
          >
            <MessageCircle className={`w-4 h-4 ${subTab === 'broadcast' ? 'text-[#FFED00]' : 'text-emerald-400'}`} />
            <span>1. WhatsApp व Telegram ब्रॉडकास्ट</span>
          </button>

          <button
            onClick={() => setSubTab('push')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'push'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-900/50 border border-amber-400'
                : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800'
            }`}
          >
            <Bell className={`w-4 h-4 ${subTab === 'push' ? 'text-[#FFED00]' : 'text-amber-400'}`} />
            <span>2. वेब पुश नोटिफिकेशन इंजन</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
              280K
            </span>
          </button>

          <button
            onClick={() => setSubTab('community')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'community'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50 border border-blue-400'
                : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800'
            }`}
          >
            <Users className={`w-4 h-4 ${subTab === 'community' ? 'text-[#FFED00]' : 'text-blue-400'}`} />
            <span>3. कम्युनिटी व सोशल ग्रुप्स (8)</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.2 rounded border border-blue-500/30">
              320K मेंबर्स
            </span>
          </button>

          <button
            onClick={() => setSubTab('viral')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'viral'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-red-900/50 border border-orange-400'
                : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800'
            }`}
          >
            <Flame className={`w-4 h-4 ${subTab === 'viral' ? 'text-[#FFED00]' : 'text-orange-400'}`} />
            <span>4. लाइव वायरल रडार व वेलोसिटी</span>
            <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-1.5 py-0.2 rounded border border-red-500/30">
              52 जिले
            </span>
          </button>

          <button
            onClick={() => setSubTab('analytics')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'analytics'
                ? 'bg-gradient-to-r from-[#E21A25] to-[#B70F18] text-white shadow-lg shadow-red-900/50 border border-red-400'
                : 'text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${subTab === 'analytics' ? 'text-[#FFED00]' : 'text-slate-400'}`} />
            <span>5. 30-दिन सोशल रीच व ग्रोथ</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
              +31.2%
            </span>
          </button>
        </div>
      </div>

      {/* ================= SUB-TAB 1: WHATSAPP & TELEGRAM BROADCAST ================= */}
      {subTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Broadcast Editor & Channel Selection */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#121622] p-5 rounded-2xl border border-[#232B3E] space-y-4">
              <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>ब्रॉडकास्ट कंपोज़र (WhatsApp & Telegram Engine)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    आधिकारिक चैनलों पर आकर्षक फॉर्मेटेड मैसेज प्रसारित करें
                  </p>
                </div>

                {/* Target Channel Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">चैनल:</label>
                  <select
                    value={targetChannel}
                    onChange={e => setTargetChannel(e.target.value as any)}
                    className="bg-slate-900 border border-[#232B3E] rounded-xl px-2.5 py-1 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="main">🟢 मुख्य चैनल (142,500 सब्सक्राइबर्स)</option>
                    <option value="bhopal">🟡 भोपाल हेडलाइन (48,200)</option>
                    <option value="indore">🟠 इंदौर फास्ट (64,800)</option>
                    <option value="gwalior">🔵 ग्वालियर बुलेटिन (31,500)</option>
                    <option value="ujjain">🟣 महाकाल उज्जैन (52,100)</option>
                  </select>
                </div>
              </div>

              {/* Template Presets */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  त्वरित टेम्पलेट प्रीसेट चुनें:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    onClick={() => {
                      setBroadcastHeadline('कोलार सिक्स लेन का काम अंतिम चरण में, 15 मई तक पूरा होगा डामरीकरण!');
                      setBroadcastBullets([
                        'कोलार के 5 लाख नागरिकों को ट्रैफिक जाम से मिलेगी मुक्ति।',
                        'नगर निगम व PWD ने 15 मई की डेडलाइन की तय।',
                        'स्थानीय विधायक व अधिकारियों ने सुबह 8 बजे किया ग्राउंड निरीक्षण।'
                      ]);
                      onShowToast('टेम्पलेट लागू: ब्रेकिंग अलर्ट');
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#232B3E] hover:border-emerald-500/50 text-left transition-all cursor-pointer"
                  >
                    <div className="font-bold text-red-400 text-[11px] flex items-center gap-1">
                      <span>⚡ ब्रेकिंग अलर्ट</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">त्वरित बड़ी खबर</div>
                  </button>

                  <button
                    onClick={() => {
                      setBroadcastHeadline('देखें स्पेशल वीडियो ग्राउंड रिपोर्ट: कोलार सिक्स लेन की जमीनी हकीकत!');
                      setBroadcastBullets([
                        'ड्रोन फुटेज से देखें 15 किलोमीटर का नया कॉरिडोर।',
                        'दुकानदारों और रहवासियों ने क्या कहा, देखें एक्सक्लूसिव बाइट।',
                        'यूट्यूब व फेसबुक पर फुल 4K वीडियो लाइव।'
                      ]);
                      onShowToast('टेम्पलेट लागू: वीडियो स्टोरी');
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#232B3E] hover:border-amber-500/50 text-left transition-all cursor-pointer"
                  >
                    <div className="font-bold text-amber-400 text-[11px] flex items-center gap-1">
                      <span>🎥 वीडियो स्टोरी</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">यूट्यूब/फेसबुक लिंक</div>
                  </button>

                  <button
                    onClick={() => {
                      setBroadcastHeadline('दैनिक संध्या बुलेटिन: आज दिनभर की मध्य प्रदेश की 5 बड़ी खबरें');
                      setBroadcastBullets([
                        'कोलार सिक्स लेन को 15 मई तक पूरा करने का लक्ष्य।',
                        'लाडली बहना योजना: अगली किस्त में 1500 रु देने की तैयारी।',
                        'उज्जैन महाकाल मंदिर: भस्म आरती के नए नियम लागू।'
                      ]);
                      onShowToast('टेम्पलेट लागू: संध्या बुलेटिन');
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#232B3E] hover:border-blue-500/50 text-left transition-all cursor-pointer"
                  >
                    <div className="font-bold text-blue-400 text-[11px] flex items-center gap-1">
                      <span>📰 संध्या बुलेटिन</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">दिनभर का सार</div>
                  </button>

                  <button
                    onClick={() => {
                      setBroadcastHeadline('जनमत पोल: क्या कोलार सिक्स लेन से भोपाल में ट्रैफिक जाम खत्म होगा?');
                      setBroadcastBullets([
                        'विकल्प 1: हाँ, पूरी तरह राहत मिलेगी।',
                        'विकल्प 2: नहीं, फ्लाईओवर भी जरूरी था।',
                        'विकल्प 3: समय बताएगा।'
                      ]);
                      onShowToast('टेम्पलेट लागू: जनमत पोल');
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#232B3E] hover:border-purple-500/50 text-left transition-all cursor-pointer"
                  >
                    <div className="font-bold text-purple-400 text-[11px] flex items-center gap-1">
                      <span>📊 जनमत पोल</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">एंगेजमेंट सर्वे</div>
                  </button>
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  मुख्य हेडलाइन (शीर्षक):
                </label>
                <input
                  type="text"
                  value={broadcastHeadline}
                  onChange={e => setBroadcastHeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  विस्तृत सारांश (2-3 पंक्तियां):
                </label>
                <textarea
                  rows={2}
                  value={broadcastSummary}
                  onChange={e => setBroadcastSummary(e.target.value)}
                  className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Bullet Points */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300">
                    बुलेट पॉइंट्स (Fact Points):
                  </label>
                  <button
                    onClick={() => setBroadcastBullets(prev => [...prev, 'नया बिंदु जोड़ें'])}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                  >
                    + बिंदु जोड़ें
                  </button>
                </div>
                <div className="space-y-1.5">
                  {broadcastBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs font-bold">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={e => {
                          const val = e.target.value;
                          setBroadcastBullets(prev => {
                            const copy = [...prev];
                            copy[idx] = val;
                            return copy;
                          });
                        }}
                        className="flex-1 bg-slate-900 border border-[#232B3E] rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                      {broadcastBullets.length > 1 && (
                        <button
                          onClick={() => setBroadcastBullets(prev => prev.filter((_, i) => i !== idx))}
                          className="text-slate-500 hover:text-red-400 text-xs px-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Link & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    खबर का लिंक (Destination URL):
                  </label>
                  <input
                    type="text"
                    value={broadcastLink}
                    onChange={e => setBroadcastLink(e.target.value)}
                    className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    थंबनेल / इमेज यूआरएल:
                  </label>
                  <input
                    type="text"
                    value={broadcastImageUrl}
                    onChange={e => setBroadcastImageUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-[#232B3E]">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCtaButtons}
                    onChange={e => setIncludeCtaButtons(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>इंटरएक्टिव CTA बटन्स शामिल करें</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPinTelegram}
                    onChange={e => setAutoPinTelegram(e.target.checked)}
                    className="rounded accent-sky-500"
                  />
                  <span>Telegram में ऑटो-पिन (Auto-Pin) करें</span>
                </label>
              </div>

              {/* Broadcast Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  disabled={isBroadcasting}
                  onClick={() => handleDispatchBroadcast('both')}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold p-3 rounded-xl text-xs shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#FFED00]" />
                  <span>{isBroadcasting ? 'भेजा जा रहा है...' : 'दोनों पर तुरंत भेजें'}</span>
                </button>

                <button
                  disabled={isBroadcasting}
                  onClick={() => handleDispatchBroadcast('whatsapp')}
                  className="bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold p-3 rounded-xl text-xs border border-emerald-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#FFED00]" />
                  <span>केवल WhatsApp (142K)</span>
                </button>

                <button
                  disabled={isBroadcasting}
                  onClick={() => handleDispatchBroadcast('telegram')}
                  className="bg-sky-700/80 hover:bg-sky-600 text-white font-bold p-3 rounded-xl text-xs border border-sky-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#FFED00]" />
                  <span>केवल Telegram (58.9K)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Previews (WhatsApp Bubble + Telegram Preview) */}
          <div className="lg:col-span-5 space-y-4">
            {/* WhatsApp Authentic Preview Box */}
            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#232B3E]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">WhatsApp चैनल लाइव प्रीव्यू</span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> वेरिफाइड ऑफिशियल चैनल
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCopyWA}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3 text-[#FFED00]" />
                  <span>कॉपी</span>
                </button>
              </div>

              {/* Chat Canvas Simulated Background */}
              <div className="bg-[#0b141a] p-3 rounded-xl border border-slate-800 relative">
                {/* Chat Bubble */}
                <div className="bg-[#005c4b] text-slate-100 rounded-2xl rounded-tl-sm p-3.5 space-y-2.5 shadow-md max-w-sm ml-auto sm:ml-0 text-xs">
                  {/* Channel Header inside bubble */}
                  <div className="flex items-center justify-between text-[10px] text-emerald-200 border-b border-emerald-600/40 pb-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Breaking News Wala (MP)</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                    </div>
                    <span>142K फॉलोअर्स</span>
                  </div>

                  {/* Thumbnail Image */}
                  {broadcastImageUrl && (
                    <div className="rounded-xl overflow-hidden border border-emerald-600/50 relative">
                      <img
                        src={broadcastImageUrl}
                        alt="News preview"
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-[#E21A25] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                        BREAKING ALERT
                      </div>
                    </div>
                  )}

                  {/* Headline & Body */}
                  <div>
                    <h4 className="font-extrabold text-white text-xs leading-snug">
                      🔴 {broadcastHeadline}
                    </h4>
                    <p className="text-[11px] text-slate-200 mt-1 leading-relaxed">
                      {broadcastSummary}
                    </p>
                  </div>

                  {/* Bullets */}
                  <div className="bg-emerald-950/50 p-2 rounded-lg text-[10px] space-y-1 border border-emerald-700/30">
                    <span className="font-bold text-emerald-300 block">📌 मुख्य तथ्य:</span>
                    {broadcastBullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <span className="text-emerald-400">•</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Link Preview Card */}
                  <div className="bg-[#023e34] p-2 rounded-lg text-[10px] space-y-0.5 border border-emerald-700/50">
                    <div className="text-[9px] text-emerald-300 font-mono truncate">{broadcastLink}</div>
                    <div className="font-bold text-white">breakingnewswala.in पर पूरी खबर पढ़ें</div>
                  </div>

                  {/* Interactive Buttons */}
                  {includeCtaButtons && (
                    <div className="space-y-1 pt-1">
                      <div className="bg-[#025042] hover:bg-[#036150] text-center font-bold text-white text-[11px] py-1.5 rounded-lg border border-emerald-600/40 flex items-center justify-center gap-1.5 cursor-pointer">
                        <ExternalLink className="w-3 h-3 text-[#FFED00]" />
                        <span>पूरी खबर विस्तार से पढ़ें</span>
                      </div>
                      <div className="bg-[#025042] hover:bg-[#036150] text-center font-bold text-white text-[11px] py-1.5 rounded-lg border border-emerald-600/40 flex items-center justify-center gap-1.5 cursor-pointer">
                        <Share2 className="w-3 h-3 text-emerald-300" />
                        <span>मित्रों के साथ शेयर करें</span>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & double ticks */}
                  <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/80 pt-1">
                    <span>{new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Telegram Channel Preview */}
            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#232B3E]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Telegram बॉट व सुपरग्रुप</span>
                    <span className="text-[10px] text-sky-400 font-semibold">@BreakingNewsWalaMP • 58.9K subs</span>
                  </div>
                </div>
                {autoPinTelegram && (
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 font-bold px-2 py-0.5 rounded border border-sky-500/30">
                    पिन अलर्ट एक्टिव
                  </span>
                )}
              </div>

              <div className="bg-[#17212b] p-3 rounded-xl border border-slate-800 text-xs text-slate-200 space-y-2">
                <div className="font-bold text-white border-l-2 border-sky-400 pl-2">
                  🔴 {broadcastHeadline}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {broadcastSummary}
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> 14.8K व्यूज
                  </span>
                  <span>{new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: WEB PUSH NOTIFICATION ENGINE ================= */}
      {subTab === 'push' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Push Creator */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#121622] p-5 rounded-2xl border border-[#232B3E] space-y-4">
              <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>वेब पुश नोटिफिकेशन कंपोज़र (OneSignal / FCM Native)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    वेबसाइट सब्सक्राइबर्स के मोबाइल स्क्रीन व डेस्कटॉप पर सीधे इंस्टेंट पॉपअप अलर्ट भेजें
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-[#232B3E] text-xs">
                  <button
                    onClick={() => setPushDeviceView('android')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      pushDeviceView === 'android'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Android</span>
                  </button>
                  <button
                    onClick={() => setPushDeviceView('desktop')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      pushDeviceView === 'desktop'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                </div>
              </div>

              {/* Geo Target & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    टारगेट ऑडियंस व क्षेत्र (District Geo-Fence):
                  </label>
                  <select
                    value={pushTargetSegment}
                    onChange={e => setPushTargetSegment(e.target.value as any)}
                    className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">🌍 समग्र मध्य प्रदेश (280,000 सब्सक्राइबर्स)</option>
                    <option value="bhopal">🏙️ भोपाल मेट्रो व सीहोर (84,000)</option>
                    <option value="malwa">⚡ इंदौर, उज्जैन व मालवा (92,000)</option>
                    <option value="gwalior">🏰 ग्वालियर व चंबल संभाग (45,000)</option>
                    <option value="bundelkhand">🌿 सागर व बुंदेलखंड (36,000)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    प्राथमिकता बैज (Priority Badge):
                  </label>
                  <select
                    value={pushUrgency}
                    onChange={e => setPushUrgency(e.target.value as any)}
                    className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="breaking">🚨 ब्रेकिंग न्यूज़ (High Sound / Vibrate)</option>
                    <option value="viral">🔥 वायरल ट्रेंडिंग (Standard Priority)</option>
                    <option value="alert">⚠️ जनहित व ट्रैफिक अलर्ट (Silent Push)</option>
                  </select>
                </div>
              </div>

              {/* Push Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300">
                    पुश नोटिफिकेशन शीर्षक (Title):
                  </label>
                  <span className={`text-[10px] font-mono ${pushTitle.length > 45 ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                    {pushTitle.length} / 45 वर्ण
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={55}
                  value={pushTitle}
                  onChange={e => setPushTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Push Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300">
                    पुश संदेश पाठ (Body Message):
                  </label>
                  <span className={`text-[10px] font-mono ${pushBody.length > 120 ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                    {pushBody.length} / 120 वर्ण
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={140}
                  value={pushBody}
                  onChange={e => setPushBody(e.target.value)}
                  className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Action Buttons Dispatch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  disabled={pushSending}
                  onClick={() => handleSendWebPush(false)}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold p-3 rounded-xl text-xs shadow-lg shadow-amber-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Bell className="w-4 h-4 text-[#FFED00]" />
                  <span>{pushSending ? 'पुश भेजा जा रहा है...' : 'सभी सब्सक्राइबर्स को पुश भेजें'}</span>
                </button>

                <button
                  onClick={() => handleSendWebPush(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{testPushSent ? 'डिवाइस पर भेजा गया! ✓' : 'मेरे डिवाइस पर टेस्ट पुश भेजें'}</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-[#232B3E] grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">कुल सब्सक्राइबर्स</div>
                  <div className="font-bold text-white mt-0.5">280,450</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">औसत ओपन रेट (CTR)</div>
                  <div className="font-bold text-emerald-400 mt-0.5">14.2%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">सक्रिय जिले</div>
                  <div className="font-bold text-amber-400 mt-0.5">52 जिले</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Device Simulators */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] space-y-3">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5 border-b border-[#232B3E] pb-2">
                {pushDeviceView === 'android' ? (
                  <>
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Android लॉक स्क्रीन व नोटिफिकेशन शेड प्रीव्यू</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-4 h-4 text-sky-400" />
                    <span>डेस्कटॉप Chrome नोटिफिकेशन बैनर प्रीव्यू</span>
                  </>
                )}
              </span>

              {/* Android Simulator Frame */}
              {pushDeviceView === 'android' ? (
                <div className="bg-[#0f172a] rounded-3xl p-4 border-4 border-slate-800 shadow-2xl space-y-3 max-w-sm mx-auto">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <span>85%</span>
                    </div>
                  </div>

                  {/* Android Notification Card */}
                  <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-lg space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#E21A25] flex items-center justify-center text-[9px] font-black text-white">
                          B
                        </div>
                        <span className="font-bold text-white">Breaking News Wala</span>
                        <span className="text-slate-500">• अभी</span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold">
                        {pushUrgency === 'breaking' ? '🚨 ब्रेकिंग' : pushUrgency === 'viral' ? '🔥 वायरल' : '⚠️ अलर्ट'}
                      </span>
                    </div>

                    {/* Notification Content */}
                    <div>
                      <h4 className="font-bold text-white text-xs leading-snug">
                        {pushTitle}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {pushBody}
                      </p>
                    </div>

                    {/* Banner Image in Expanded Push */}
                    {broadcastImageUrl && (
                      <div className="rounded-xl overflow-hidden mt-1 border border-slate-800">
                        <img
                          src={broadcastImageUrl}
                          alt="Banner"
                          className="w-full h-28 object-cover"
                        />
                      </div>
                    )}

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[10px] font-bold">
                      <button className="py-1 px-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-center cursor-pointer">
                        पूरी खबर पढ़ें
                      </button>
                      <button className="py-1 px-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-center cursor-pointer">
                        बाद में देखें
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop Windows/Mac Chrome Simulator Frame */
                <div className="bg-[#1e293b] rounded-2xl p-4 border-2 border-slate-700 shadow-2xl space-y-2 max-w-sm mx-auto">
                  <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-700 shadow-lg space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-sky-400" />
                        <span className="font-bold text-white">Google Chrome • breakingnewswala.in</span>
                      </div>
                      <span>✕</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E21A25] shrink-0 flex items-center justify-center text-white font-black text-sm shadow">
                        BNW
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-xs leading-tight truncate">
                          {pushTitle}
                        </h4>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                          {pushBody}
                        </p>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                      <span className="text-amber-400 font-bold">टारगेट: {pushTargetSegment.toUpperCase()}</span>
                      <span className="text-sky-400 hover:underline cursor-pointer">क्लिक कर खोलें</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: COMMUNITY GROUPS AMPLIFICATION ================= */}
      {subTab === 'community' && (
        <div className="space-y-4">
          <div className="bg-[#121622] p-5 rounded-2xl border border-[#232B3E] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232B3E] pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>रीजनल कम्युनिटी व फेसबुक ग्रुप्स नेटवर्क (320,000+ कुल सदस्य)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  मध्य प्रदेश के 8 वेरिफाइड फेसबुक और वॉट्सऐप कम्युनिटी ग्रुप्स में एक साथ खबर व एंगेजमेंट सवाल पोस्ट करें।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAllGroups}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl font-bold cursor-pointer"
                >
                  {selectedGroups.length === communityGroupsList.length ? 'सभी अन-सेलेक्ट करें' : 'सभी ग्रुप्स चुनें'}
                </button>

                <button
                  disabled={isCrossPosting}
                  onClick={handleCrossPostGroups}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-900/50 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#FFED00]" />
                  <span>{isCrossPosting ? `पोस्ट हो रहा है (${crossPostProgress}%)...` : `चुने हुए ${selectedGroups.length} ग्रुप्स में पोस्ट करें`}</span>
                </button>
              </div>
            </div>

            {/* Pinned Engagement Question */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                📌 ग्रुप में पिन किया जाने वाला एंगेजमेंट प्रश्न (Pinned Interactive Prompt):
              </label>
              <input
                type="text"
                value={groupPinnedComment}
                onChange={e => setGroupPinnedComment(e.target.value)}
                className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {communityGroupsList.map(grp => {
                const isSelected = selectedGroups.includes(grp.id);
                return (
                  <div
                    key={grp.id}
                    onClick={() => toggleGroup(grp.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 select-none ${
                      isSelected
                        ? 'bg-blue-950/30 border-blue-500/80 shadow-md shadow-blue-900/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-500/30">
                        {grp.region}
                      </span>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-xs leading-snug line-clamp-2">
                      {grp.name}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400">{grp.members} मेंबर्स</span>
                      <span className="text-emerald-400 font-semibold text-[10px]">{grp.adminRole}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 4: LIVE VIRAL RADAR & VELOCITY ================= */}
      {subTab === 'viral' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Hot Trending Keywords */}
            <div className="lg:col-span-5 bg-[#121622] p-5 rounded-2xl border border-[#232B3E] space-y-4">
              <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#E21A25]" />
                  <span>हॉट सर्च कीवर्ड्स व ट्रेंड्स (MP & India)</span>
                </span>
                <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded border border-red-500/30">
                  लाइव वेलोसिटी
                </span>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {hotKeywords.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/40 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{item.tag}</span>
                          <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                            {item.district}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.title}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-400 font-mono">{item.velocity}</div>
                        <span className="text-[9px] bg-red-500/20 text-red-400 px-1 py-0.2 rounded font-bold">
                          {item.growth}
                        </span>
                      </div>
                    </div>

                    {/* Quick Trigger Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80 text-[10px]">
                      {onCreateGraphic && (
                        <button
                          onClick={() => {
                            onCreateGraphic({
                              district: item.district,
                              headline: `${item.district}: ${item.title}`,
                              summary: `ट्रेंडिंग कीवर्ड ${item.tag} पर मध्य प्रदेश भर में तीव्र सर्च। ग्राउंड रिपोर्ट विस्तार से।`,
                              urgency: item.urgency
                            });
                            onShowToast(`ट्रेंड "${item.tag}" से 4:5 ग्राफिक कार्ड तैयार किया गया!`);
                          }}
                          className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Zap className="w-3 h-3" />
                          <span>4:5 कार्ड बनाएं</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setBroadcastHeadline(`${item.district}: ${item.title}`);
                          setSubTab('broadcast');
                          onShowToast(`ब्रॉडकास्ट में "${item.tag}" लोड किया गया!`);
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>ब्रॉडकास्ट अलर्ट</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 52 Districts Velocity Matrix */}
            <div className="lg:col-span-7 bg-[#121622] p-5 rounded-2xl border border-[#232B3E] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232B3E] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-orange-400" />
                    <span>डिस्ट्रिक्ट वायरल वेलोसिटी ट्रैकर (52 जिले)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    जिलेवार सर्च मोमेंटम व ऑडियंस एंगेजमेंट सूचकांक (1-100 स्कोर)
                  </p>
                </div>

                {/* Region Filter */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  {(['ALL', 'Bhopal', 'Malwa', 'Gwalior', 'Mahakoshal', 'Bundelkhand'] as const).map(reg => (
                    <button
                      key={reg}
                      onClick={() => setViralRegionFilter(reg)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        viralRegionFilter === reg
                          ? 'bg-[#E21A25] text-white shadow'
                          : 'text-slate-400 hover:text-white bg-slate-900'
                      }`}
                    >
                      {reg === 'ALL' ? 'सभी' : reg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Districts List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredDistricts.map((dist, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#E21A25] text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                          {dist.name} जिला
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${dist.statusColor}`}>
                          {dist.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                        <span>स्कोर:</span>
                        <span className="text-white text-sm">{dist.score}</span>
                        <span className="text-slate-500">/100</span>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-white leading-snug">
                      {dist.trend}
                    </p>

                    {/* Progress Bar of Velocity */}
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-full"
                          style={{ width: `${dist.score}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{dist.traffic}</span>
                        <span className="text-emerald-400 font-bold">हाई एंगेजमेंट विंडो</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Newsroom Advisor Card */}
          <div className="bg-[#121622] p-5 rounded-2xl border border-purple-500/30 space-y-3">
            <span className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI न्यूजरूम एडवाइजर व डिस्ट्रीब्यूशन इंटेलिजेंस</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/30 text-purple-200 space-y-1">
                <span className="font-bold text-purple-300 block">🎯 भोपाल व इंदौर पेज एडवाइस:</span>
                <p className="text-[11px] leading-relaxed">
                  कोलार सिक्स लेन और इंदौर मेट्रो ट्रायल पर 4:5 ग्राफिक कार्ड और 9:16 रील्स दोनों सिंडिकेट करें। कमेंट्स में यूजर फीडबैक मांगें।
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-900/20 border border-blue-500/30 text-blue-200 space-y-1">
                <span className="font-bold text-blue-300 block">⏰ पीक पोस्टिंग विंडो:</span>
                <p className="text-[11px] leading-relaxed">
                  शाम 07:30 PM से 08:45 PM के बीच मध्य प्रदेश सोशल चैनलों पर ऑडियंस 3.4 गुना अधिक एक्टिव रहती है।
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-900/20 border border-emerald-500/30 text-emerald-200 space-y-1">
                <span className="font-bold text-emerald-300 block">📲 WhatsApp चैनल कन्वर्जन:</span>
                <p className="text-[11px] leading-relaxed">
                  हर पोस्ट में 142K वाले ऑफिशियल WhatsApp चैनल का इनवाइट लिंक अवश्य जोड़ें। इससे ऑर्गेनिक फॉलोअर ग्रोथ +18% तेज होती है।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 5: 30-DAY REACH & GROWTH ANALYTICS ================= */}
      {subTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E]">
              <div className="text-[11px] font-bold text-slate-400 uppercase">कुल सोशल रीच (30D)</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">4.82 Million</div>
              <div className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +24.6% पिछले माह से
              </div>
            </div>

            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E]">
              <div className="text-[11px] font-bold text-slate-400 uppercase">कुल वीडियो व्यूज</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">8.15 Million</div>
              <div className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +31.2% (Shorts/Reels)
              </div>
            </div>

            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E]">
              <div className="text-[11px] font-bold text-slate-400 uppercase">कुल एंगेजमेंट व शेयर्स</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">942.3 K</div>
              <div className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" /> 142K WhatsApp शेयर्स
              </div>
            </div>

            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E]">
              <div className="text-[11px] font-bold text-slate-400 uppercase">नए फॉलोअर्स</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">+68,400</div>
              <div className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 12 डिस्ट्रिक्ट पेजेस
              </div>
            </div>
          </div>

          {/* Recharts Interactive Growth Chart */}
          <div className="bg-[#121622] p-5 rounded-2xl border-2 border-[#E21A25]/30 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232B3E] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFED00] pulse-live"></span>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#FFED00]" />
                    <span>30-दिवसीय ग्रोथ ट्रेंड: फॉलोअर्स, वीडियो व्यूज व शेयर्स</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  मध्य प्रदेश नेटवर्क (12 जिले) और मास्टर YouTube/FB चैनलों का दैनिक प्रदर्शन विश्लेषण
                </p>
              </div>

              {/* Time Range & Metric Filter Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-[#232B3E] text-xs">
                  <button
                    onClick={() => setTimeRangeFilter('7d')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      timeRangeFilter === '7d' ? 'bg-[#E21A25] text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    7 दिन
                  </button>
                  <button
                    onClick={() => setTimeRangeFilter('14d')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      timeRangeFilter === '14d' ? 'bg-[#E21A25] text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    14 दिन
                  </button>
                  <button
                    onClick={() => setTimeRangeFilter('30d')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      timeRangeFilter === '30d' ? 'bg-[#E21A25] text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    30 दिन
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-[#232B3E] text-xs">
                  <button
                    onClick={() => setChartMetricFilter('both')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      chartMetricFilter === 'both' ? 'bg-[#FFED00] text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    व्यूज + फॉलोअर्स
                  </button>
                  <button
                    onClick={() => setChartMetricFilter('views')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      chartMetricFilter === 'views' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    केवल व्यूज
                  </button>
                  <button
                    onClick={() => setChartMetricFilter('followers')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      chartMetricFilter === 'followers' ? 'bg-red-500 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    केवल फॉलोअर्स
                  </button>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="CSV डेटा डाउनलोड करें"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-4 flex-wrap">
                {(chartMetricFilter === 'both' || chartMetricFilter === 'views') && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FFED00]"></span>
                    <span className="text-slate-300">दैनिक वीडियो व्यूज (Video Views):</span>
                    <strong className="text-[#FFED00]">8.15M कुल (Peak: 585K/दिन)</strong>
                  </div>
                )}
                {(chartMetricFilter === 'both' || chartMetricFilter === 'followers') && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#E21A25]"></span>
                    <span className="text-slate-300">नए फॉलोअर्स (Followers Gained):</span>
                    <strong className="text-red-400">+68,400 कुल (Peak: 4.9K/दिन)</strong>
                  </div>
                )}
              </div>
              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ↑ 31.2% मासिक उछाल
              </span>
            </div>

            {/* Recharts Container */}
            <div className="w-full h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredAnalyticsData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#232B3E" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#8E9BAE"
                    fontSize={11}
                    tickLine={false}
                    dy={8}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#FFED00"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    domain={['auto', 'auto']}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#E21A25"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#121622] p-3 rounded-xl border-2 border-[#E21A25] shadow-2xl text-xs space-y-1.5 font-sans">
                            <p className="font-bold text-white border-b border-slate-800 pb-1 flex items-center justify-between gap-3">
                              <span>तारीख: {label}</span>
                              <span className="text-[10px] text-slate-400">फेज 7 एनालिटिक्स</span>
                            </p>
                            {payload.map((entry, index) => (
                              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                                <span style={{ color: entry.color }} className="font-semibold flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                  {entry.name}:
                                </span>
                                <span className="font-bold text-white font-mono">
                                  {Number(entry.value).toLocaleString('hi-IN')}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {(chartMetricFilter === 'both' || chartMetricFilter === 'views') && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="views"
                      name="दैनिक वीडियो व्यूज"
                      stroke="#FFED00"
                      strokeWidth={3}
                      dot={{ r: 2.5, fill: '#FFED00' }}
                      activeDot={{ r: 6, fill: '#FFED00', stroke: '#fff', strokeWidth: 2 }}
                    />
                  )}
                  {(chartMetricFilter === 'both' || chartMetricFilter === 'followers') && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="followers"
                      name="नए फॉलोअर्स"
                      stroke="#E21A25"
                      strokeWidth={3}
                      dot={{ r: 2.5, fill: '#E21A25' }}
                      activeDot={{ r: 6, fill: '#E21A25', stroke: '#fff', strokeWidth: 2 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Platform-wise breakdown bars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#232B3E]">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-red-400">YouTube</span>
                  <span className="text-white font-mono font-bold">3.42M</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <div className="text-[10px] text-slate-400">42% कुल वीडियो व्यूज</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-400">Facebook</span>
                  <span className="text-white font-mono font-bold">2.52M</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '31%' }}></div>
                </div>
                <div className="text-[10px] text-slate-400">31% रीच (12 डिस्ट्रिक्ट पेजेस)</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-pink-400">Instagram</span>
                  <span className="text-white font-mono font-bold">1.46M</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: '18%' }}></div>
                </div>
                <div className="text-[10px] text-slate-400">18% रीच (Reels & 4:5 कार्ड)</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">WhatsApp & TG</span>
                  <span className="text-white font-mono font-bold">750K</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '9%' }}></div>
                </div>
                <div className="text-[10px] text-slate-400">9% डायरेक्ट रेफरल क्लिक्स</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
