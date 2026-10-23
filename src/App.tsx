import React, { useState, useEffect, useRef } from 'react';
import {
  Newspaper,
  Clapperboard,
  Share2,
  Flame,
  TrendingUp,
  Settings2,
  KeyRound,
  Video,
  Zap,
  RefreshCw,
  CheckCheck,
  Check,
  Edit3,
  Send,
  Copy,
  Sparkles,
  Play,
  Users,
  MessageCircle,
  Menu,
  X,
  Code2,
  Download,
  Radio,
  BrainCircuit,
  ArrowUpRight,
  Inbox,
  ShieldCheck,
  Eye,
  EyeOff,
  Sliders,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Activity,
  Server,
  Wifi,
  Gauge,
  Clock,
  Upload,
  Image as ImageIcon,
  ThumbsUp,
  MessageSquare,
  Share,
  Smartphone,
  Bell,
  BellRing,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Volume2,
  Palette,
  Crown,
  LogOut,
  LogIn,
  Building2,
  Globe,
  Lock,
  ShieldAlert,
  User as UserIcon,
  Rss,
  MapPin,
  Layers
} from 'lucide-react';
import {
  auth,
  signInWithGoogle,
  signOutUser,
  syncUserProfile,
  updateUserProfile,
  MASTER_ADMIN_EMAIL,
  isMasterAdminEmail,
  createDevMasterUser,
  type UserProfile,
  type UserRole
} from './lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ChannelSettingsModal } from './components/ChannelSettingsModal';
import { NewsSourceManagement } from './components/NewsSourceManagement';
import { CategoryLocationManagement } from './components/CategoryLocationManagement';
import { NewsFeedHub, type FeedArticleItem } from './components/NewsFeedHub';
import { AutomationSchedulingHub } from './components/AutomationSchedulingHub';
import { MasterAdminHub } from './components/MasterAdminHub';

interface NewsCardItem {
  id: string;
  district: string;
  districtHindi: string;
  headline: string;
  summary: string;
  bulletPoints: string[];
  caption: string;
  image: string;
  page: string;
  time: string;
  status: 'pending' | 'published';
  urgency: 'Breaking' | 'Top Story' | 'Normal' | 'Viral';
  category: string;
  jsonOutput?: any;
}

interface ApiKeysConfig {
  metaAppId: string;
  metaAppSecret: string;
  metaPageToken: string;
  metaPageId: string;
  metaInstaId: string;
  waPhoneNumberId: string;
  waBusinessAccountId: string;
  waAccessToken: string;
  tgBotToken: string;
  tgChannelId: string;
  ytApiKey: string;
  ytClientId: string;
  ytChannelId: string;
  xApiKey: string;
  xApiSecret: string;
  xBearerToken: string;
  geminiApiKey: string;
}

const DEFAULT_API_KEYS: ApiKeysConfig = {
  metaAppId: '104829104829104',
  metaAppSecret: '••••••••••••••••••••••••••••••••',
  metaPageToken: 'EAAGm0PXq15wBO8ZCi98...k4Pq9B2',
  metaPageId: 'Breaking_News_Wala_MP_Network',
  metaInstaId: '1784140092837482',
  waPhoneNumberId: '109283746592817',
  waBusinessAccountId: '982736451928374',
  waAccessToken: 'EAAO8ZCi98k4Pq9B2...WA_PROD_TOKEN',
  tgBotToken: '7829104829:AAHX7_k9P28Zqm0L982ZCi98k4Pq9B',
  tgChannelId: '@breakingnewswalamp',
  ytApiKey: 'AIzaSyBNWala_YouTubeKey_9827346152',
  ytClientId: '982736451928-ytclient.apps.googleusercontent.com',
  ytChannelId: 'UC_BNWALA_MASTER_NEWS_MP',
  xApiKey: 'BNW_X_API_KEY_982734',
  xApiSecret: '••••••••••••••••••••••••••••••••',
  xBearerToken: 'AAAAAAAAAAAAAAAAAAAAA_BNW_BEARER_TOKEN_98273',
  geminiApiKey: 'AIzaSyBNWala_Gemini_Newsroom_2026'
};

const analytics30DaysData = [
  { day: '1', date: '18 Sep', views: 185000, followers: 1420 },
  { day: '2', date: '19 Sep', views: 210000, followers: 1650 },
  { day: '3', date: '20 Sep', views: 195000, followers: 1510 },
  { day: '4', date: '21 Sep', views: 240000, followers: 1890 },
  { day: '5', date: '22 Sep', views: 280000, followers: 2340 },
  { day: '6', date: '23 Sep', views: 260000, followers: 2100 },
  { day: '7', date: '24 Sep', views: 310000, followers: 2580 },
  { day: '8', date: '25 Sep', views: 290000, followers: 2240 },
  { day: '9', date: '26 Sep', views: 305000, followers: 2410 },
  { day: '10', date: '27 Sep', views: 340000, followers: 2790 },
  { day: '11', date: '28 Sep', views: 320000, followers: 2600 },
  { day: '12', date: '29 Sep', views: 360000, followers: 2950 },
  { day: '13', date: '30 Sep', views: 330000, followers: 2710 },
  { day: '14', date: '01 Oct', views: 390000, followers: 3120 },
  { day: '15', date: '02 Oct', views: 420000, followers: 3450 },
  { day: '16', date: '03 Oct', views: 380000, followers: 3010 },
  { day: '17', date: '04 Oct', views: 350000, followers: 2840 },
  { day: '18', date: '05 Oct', views: 375000, followers: 2990 },
  { day: '19', date: '06 Oct', views: 410000, followers: 3320 },
  { day: '20', date: '07 Oct', views: 395000, followers: 3180 },
  { day: '21', date: '08 Oct', views: 430000, followers: 3510 },
  { day: '22', date: '09 Oct', views: 405000, followers: 3290 },
  { day: '23', date: '10 Oct', views: 460000, followers: 3840 },
  { day: '24', date: '11 Oct', views: 440000, followers: 3620 },
  { day: '25', date: '12 Oct', views: 480000, followers: 4010 },
  { day: '26', date: '13 Oct', views: 510000, followers: 4290 },
  { day: '27', date: '14 Oct', views: 470000, followers: 3910 },
  { day: '28', date: '15 Oct', views: 520000, followers: 4350 },
  { day: '29', date: '16 Oct', views: 550000, followers: 4620 },
  { day: '30', date: '17 Oct', views: 585000, followers: 4980 }
];

export default function App() {
  const [activeView, setActiveView] = useState<
    'newsFeedHub' | 'generatorQueue' | 'videoStudio' | 'distributionHub' | 'viralRadar' | 'analyticsView' | 'accountsConfig' | 'apiHub' | 'healthCheck' | 'masterAdminConsole' | 'newsSourceMgmt' | 'categoryLocationMgmt'
  >('generatorQueue');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('ALL');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });
  const [chartMetricFilter, setChartMetricFilter] = useState<'both' | 'views' | 'followers'>('both');

  // Multi-User RBAC & Google Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [guestAccessGranted, setGuestAccessGranted] = useState(false);
  const [showChannelSettingsModal, setShowChannelSettingsModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

  // Registered Channel Admins for Master Admin Control View
  const [channelAdminsList, setChannelAdminsList] = useState<UserProfile[]>([
    {
      uid: 'admin-sagar-01',
      email: 'sagar.bulletin@gmail.com',
      displayName: 'राजेश शर्मा (सागर हेड)',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: 'CHANNEL_ADMIN',
      channelName: 'दैनिक सागर 24',
      channelLogo: '/Logo.png',
      district: 'सागर',
      facebookConnected: true,
      youtubeConnected: true,
      instagramConnected: true,
      twitterConnected: false,
      linkedinConnected: false,
      status: 'active',
      createdAt: '2026-10-18T10:30:00Z'
    },
    {
      uid: 'admin-indore-02',
      email: 'indore.fastnews@gmail.com',
      displayName: 'अमित वर्मा (इंदौर ब्यूरो)',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      role: 'CHANNEL_ADMIN',
      channelName: 'इंदौर फास्ट न्यूज़',
      channelLogo: '/Logo.png',
      district: 'इंदौर',
      facebookConnected: true,
      youtubeConnected: true,
      instagramConnected: true,
      twitterConnected: true,
      linkedinConnected: true,
      status: 'active',
      createdAt: '2026-10-19T14:15:00Z'
    },
    {
      uid: 'admin-bhopal-03',
      email: 'bhopal.express@gmail.com',
      displayName: 'प्रीति सक्सेना (भोपाल एडिटर)',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      role: 'CHANNEL_ADMIN',
      channelName: 'भोपाल हेडलाइन लाइव',
      channelLogo: '/Logo.png',
      district: 'भोपाल',
      facebookConnected: true,
      youtubeConnected: false,
      instagramConnected: true,
      twitterConnected: true,
      linkedinConnected: false,
      status: 'active',
      createdAt: '2026-10-20T08:00:00Z'
    },
    {
      uid: 'admin-jabalpur-04',
      email: 'jabalpur.patrika@gmail.com',
      displayName: 'संजय पटेल (महाकोशल)',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      role: 'CHANNEL_ADMIN',
      channelName: 'महाकोशल टुडे',
      channelLogo: '/Logo.png',
      district: 'जबलपुर',
      facebookConnected: false,
      youtubeConnected: true,
      instagramConnected: false,
      twitterConnected: true,
      linkedinConnected: false,
      status: 'pending',
      createdAt: '2026-10-21T06:20:00Z'
    }
  ]);

  // API Credentials & Testing State
  const [apiKeys, setApiKeys] = useState<ApiKeysConfig>(() => {
    const saved = localStorage.getItem('bnw_newsroom_api_keys');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_API_KEYS;
      }
    }
    return DEFAULT_API_KEYS;
  });
  const [testingService, setTestingService] = useState<string | null>(null);
  const [serviceStatus, setServiceStatus] = useState<Record<string, 'active' | 'disconnected'>>({
    meta: 'active',
    whatsapp: 'active',
    telegram: 'active',
    youtube: 'active',
    x: 'active',
    gemini: 'active'
  });
  const [showKeySecret, setShowKeySecret] = useState<Record<string, boolean>>({});

  // Real-time Health Check State for 6 connected API services
  const [autoPingEnabled, setAutoPingEnabled] = useState(true);
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [lastGlobalPingTime, setLastGlobalPingTime] = useState<Date>(new Date());
  const [pingCountdown, setPingCountdown] = useState(5);

  const [healthServices, setHealthServices] = useState([
    {
      id: 'meta',
      name: 'Meta Graph API',
      subtitle: 'Facebook Pages & Instagram Reels',
      badge: 'FB + IG',
      endpoint: 'https://graph.facebook.com/v19.0/me/accounts',
      currentLatency: 84,
      history: [92, 88, 85, 86, 82, 84, 87, 83, 85, 84],
      httpStatus: 200,
      statusLabel: 'सक्रिय व अनुकूल',
      quota: '4,820 / 10,000 req/hr (48%)',
      quotaPercent: 48,
      tokenType: 'Permanent System User Token',
      tokenExpiry: 'वैलिड (Auto-Renewed)',
      colorTheme: 'blue'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business Cloud API',
      subtitle: 'Official Channel Broadcast & Bot',
      badge: 'WhatsApp Cloud',
      endpoint: 'https://graph.facebook.com/v19.0/{phone_id}/messages',
      currentLatency: 62,
      history: [68, 65, 70, 64, 61, 63, 66, 62, 60, 62],
      httpStatus: 200,
      statusLabel: 'अल्ट्रा-फास्ट रिस्पॉन्स',
      quota: '142,500 / 100,000 Tier 2 (WABA)',
      quotaPercent: 32,
      tokenType: 'Meta Cloud API Bearer Token',
      tokenExpiry: 'एक्टिव व ऑथराइज्ड',
      colorTheme: 'emerald'
    },
    {
      id: 'telegram',
      name: 'Telegram Bot API',
      subtitle: '@BotFather Channel Forwarder',
      badge: 'Telegram Bot',
      endpoint: 'https://api.telegram.org/bot{token}/getMe',
      currentLatency: 46,
      history: [52, 49, 48, 50, 47, 45, 48, 46, 44, 46],
      httpStatus: 200,
      statusLabel: 'न्यूनतम लेटेंसी (<50ms)',
      quota: 'असीमित (30 msgs/sec Rate Limit)',
      quotaPercent: 12,
      tokenType: 'Bot HTTP API Token',
      tokenExpiry: 'लाइफटाइम एक्टिव',
      colorTheme: 'sky'
    },
    {
      id: 'youtube',
      name: 'YouTube Data API v3',
      subtitle: 'Video & Shorts Syndication Engine',
      badge: 'YouTube API',
      endpoint: 'https://youtube.googleapis.com/youtube/v3/channels',
      currentLatency: 128,
      history: [135, 130, 132, 126, 128, 125, 131, 127, 129, 128],
      httpStatus: 200,
      statusLabel: 'अनुकूल व स्वस्थ',
      quota: '1,600 / 10,000 Quota Units/day',
      quotaPercent: 16,
      tokenType: 'OAuth 2.0 Client Refresh Token',
      tokenExpiry: 'वैलिड (Token Active)',
      colorTheme: 'red'
    },
    {
      id: 'x',
      name: 'X (Twitter) Developer API v2',
      subtitle: 'Media Upload & Breaking Tweet Threads',
      badge: 'X API v2',
      endpoint: 'https://api.twitter.com/2/tweets',
      currentLatency: 104,
      history: [112, 108, 110, 105, 102, 107, 104, 106, 103, 104],
      httpStatus: 200,
      statusLabel: 'अनुकूल व स्वस्थ',
      quota: '85 / 300 Tweets/3 Hours (Basic)',
      quotaPercent: 28,
      tokenType: 'OAuth 1.0a / Bearer Token',
      tokenExpiry: 'वेरिफाइड डेवलपर स्कोप',
      colorTheme: 'slate'
    },
    {
      id: 'gemini',
      name: 'Google Gemini AI Engine',
      subtitle: 'Autonomous Newsroom Intelligence & Graphic Text',
      badge: 'Gemini 2.5 Flash',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
      currentLatency: 142,
      history: [155, 148, 150, 145, 140, 144, 142, 139, 146, 142],
      httpStatus: 200,
      statusLabel: 'हाई थ्रूपुट AI',
      quota: '1,000 RPM (Enterprise AI Studio)',
      quotaPercent: 22,
      tokenType: 'Google AI Studio Secret API Key',
      tokenExpiry: 'एक्टिव व ऑथराइज्ड',
      colorTheme: 'amber'
    }
  ]);

  // Live Auto-Ping Effect: updates latencies with realistic jitter
  useEffect(() => {
    if (!autoPingEnabled) return;

    const interval = setInterval(() => {
      setPingCountdown(prev => {
        if (prev <= 1) {
          // Perform automatic health tick
          setHealthServices(prevServices =>
            prevServices.map(srv => {
              // Add slight realistic jitter: ±2 to ±8ms
              const jitter = Math.floor(Math.random() * 11) - 5;
              let baseLatency = srv.currentLatency;
              if (srv.id === 'meta') baseLatency = 84;
              if (srv.id === 'whatsapp') baseLatency = 62;
              if (srv.id === 'telegram') baseLatency = 46;
              if (srv.id === 'youtube') baseLatency = 126;
              if (srv.id === 'x') baseLatency = 104;
              if (srv.id === 'gemini') baseLatency = 142;

              const newLatency = Math.max(30, Math.min(280, baseLatency + jitter));
              const newHistory = [...srv.history.slice(1), newLatency];

              return {
                ...srv,
                currentLatency: newLatency,
                history: newHistory
              };
            })
          );
          setLastGlobalPingTime(new Date());
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoPingEnabled]);

  // Ping All Services Manually
  const pingAllServicesNow = () => {
    setIsPingingAll(true);
    showToast('सभी 6 API सर्विसों का लाइव डायग्नोस्टिक पिंग आरंभ...', 'RTT लेटेंसी व HTTP हैंडशेक जांची जा रही है');

    setTimeout(() => {
      setHealthServices(prevServices =>
        prevServices.map(srv => {
          const jitter = Math.floor(Math.random() * 15) - 7;
          let baseLatency = srv.currentLatency;
          const newLatency = Math.max(35, baseLatency + jitter);
          const newHistory = [...srv.history.slice(1), newLatency];
          return {
            ...srv,
            currentLatency: newLatency,
            history: newHistory
          };
        })
      );
      setLastGlobalPingTime(new Date());
      setIsPingingAll(false);
      setPingCountdown(5);
      showToast('हेल्थ चेक पूर्ण: 6/6 सर्विस 200 OK', 'सभी एंडपॉइंट्स अत्यधिक तीव्र गति पर संचालित हैं!');
    }, 900);
  };

  // Ping individual service
  const pingSingleService = (id: string, name: string) => {
    showToast(`${name} का लाइव पिंग किया जा रहा है...`);
    setTimeout(() => {
      setHealthServices(prev =>
        prev.map(srv => {
          if (srv.id === id) {
            const jitter = Math.floor(Math.random() * 10) - 5;
            const newLatency = Math.max(35, srv.currentLatency + jitter);
            return {
              ...srv,
              currentLatency: newLatency,
              history: [...srv.history.slice(1), newLatency]
            };
          }
          return srv;
        })
      );
      showToast(`${name}: रिस्पॉन्स 200 OK (${Math.floor(Math.random() * 20 + 60)}ms)`);
    }, 600);
  };

  // Compute average network latency
  const averageLatency = Math.round(
    healthServices.reduce((acc, curr) => acc + curr.currentLatency, 0) / healthServices.length
  );

  // Save API keys to local storage
  const handleSaveApiKeys = () => {
    localStorage.setItem('bnw_newsroom_api_keys', JSON.stringify(apiKeys));
    showToast('सभी API क्रेडेंशियल्स सुरक्षित सेव हो गए!', 'ऑटोपायलट इंजन कनेक्टेड टोकन्स का उपयोग करेगा।');
  };

  const testApiConnection = (serviceName: string, label: string) => {
    setTestingService(serviceName);
    setTimeout(() => {
      setTestingService(null);
      setServiceStatus(prev => ({ ...prev, [serviceName]: 'active' }));
      showToast(`${label} से कनेक्शन सफल! (200 OK)`, 'पिंग लेटेंसी: 112ms • टोकन वैलिड व ऑथराइज्ड है।');
    }, 1200);
  };

  // Quick Raw News to Graphic Modal
  const [showQuickNewsModal, setShowQuickNewsModal] = useState(false);
  const [quickNewsDistrict, setQuickNewsDistrict] = useState('Bhopal');
  const [quickNewsCategory, setQuickNewsCategory] = useState('Infrastructure & Development');
  const [quickNewsUrgency, setQuickNewsUrgency] = useState<'Breaking' | 'Top Story' | 'Normal' | 'Viral'>('Top Story');
  const [quickNewsText, setQuickNewsText] = useState(
    `भोपाल के कोलार सिक्स लेन प्रोजेक्ट का काम अंतिम चरण में पहुंचा। नगर निगम और पीडब्ल्यूडी ने 15 मई तक सड़क का डामरीकरण और डिवाइडर ब्यूटीफिकेशन पूरा करने की डेडलाइन तय की है। इस रूट पर 5 लाख लोगों को रोजाना ट्रैफिक जाम से राहत मिलेगी। स्थानीय विधायक ने आज सुबह अधिकारियों के साथ निरीक्षण किया।`
  );

  // Web Speech API Voice Dictation State for Quick News
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleVoiceDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('आपके ब्राउज़र में Web Speech API उपलब्ध नहीं है। कृपया Google Chrome ब्राउज़र का उपयोग करें।');
      showToast('माइक्रोफ़ोन अनुपलब्ध', 'Google Chrome में Web Speech API समर्थित है।');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error(err);
        }
      }
      setIsListening(false);
      setInterimTranscript('');
      showToast('वॉइस डिक्टेशन समाप्त', 'रिकॉर्ड की गई खबर टेक्स्ट में सुरक्षित हो गई है।');
      return;
    }

    try {
      setSpeechError(null);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        showToast('माइक ऑन (Listening...)', `स्पष्ट बोलें (${speechLanguage === 'hi-IN' ? 'हिंदी' : 'English'})...`);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(interim);

        if (final.trim()) {
          setQuickNewsText(prev => {
            const trimmedPrev = prev.trim();
            if (!trimmedPrev) return final.trim();
            return `${trimmedPrev} ${final.trim()}`;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में माइक एक्सेस चालू करें।');
          showToast('माइक अनुमति अस्वीकृत', 'कृपया ब्राउज़र में माइक्रोफ़ोन की अनुमति दें।');
        } else if (event.error === 'no-speech') {
          // ignore
        } else {
          setSpeechError(`वॉइस इनपुट त्रुटि: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setSpeechError('वॉइस पहचान शुरू करने में विफल: ' + (err.message || 'त्रुटि'));
      setIsListening(false);
    }
  };

  // Convert Dictated Report directly to Structured AI Prompt
  const convertDictationToStructuredPrompt = () => {
    if (!quickNewsText.trim()) {
      showToast('कृपया पहले कुछ बोलें या खबर लिखें', 'कच्ची खबर का पाठ खाली है।');
      return;
    }

    const raw = quickNewsText.trim();
    const districtsCheck = [
      { key: 'Bhopal', hindi: 'भोपाल' },
      { key: 'Indore', hindi: 'इंदौर' },
      { key: 'Jabalpur', hindi: 'जबलपुर' },
      { key: 'Gwalior', hindi: 'ग्वालियर' },
      { key: 'Ujjain', hindi: 'उज्जैन' },
      { key: 'Sagar', hindi: 'सागर' },
      { key: 'Rewa', hindi: 'रीवा' }
    ];

    let detectedDistrict = quickNewsDistrict;
    for (const d of districtsCheck) {
      if (raw.includes(d.hindi) || raw.toLowerCase().includes(d.key.toLowerCase())) {
        detectedDistrict = d.key;
        setQuickNewsDistrict(d.key);
        break;
      }
    }

    const dHindi = districtsCheck.find(d => d.key === detectedDistrict)?.hindi || quickNewsDistrict;

    const structured = `【स्ट्रक्चर्ड AI न्यूज़ प्रॉम्प्ट - BNW कंट्रोल रूम】
■ जिला व लोकेशन: ${dHindi} (${detectedDistrict})
■ समाचार श्रेणी: ${quickNewsCategory}
■ प्राथमिकता/Urgency: ${quickNewsUrgency}
■ वॉइस डिक्टेशन सारांश (Raw Report):
"${raw}"

■ आवश्यक AI आउटपुट निर्देश:
1. 4:5 अनुपात ग्राफिक कार्ड हेतु 14 शब्दों की उच्च प्रभाव वाली आकर्षक हिंदी हेडलाइन।
2. 3 सटीक बुलेट पॉइंट्स (प्रत्येक में ठोस तथ्य, ग्राउंड डेटा व जिम्मेदार अधिकारी का संदर्भ)।
3. सोशल मीडिया कैप्शन (फेसबुक व इंस्टाग्राम) और व्हाट्सऐप/टेलीग्राम ब्रॉडकास्ट संदेश।
4. यूट्यूब AI SEO (आकर्षक थंबनेल शीर्षक + वायरल सर्च कीवर्ड्स)।`;

    setQuickNewsText(structured);
    showToast('वॉइस रिपोर्ट स्ट्रक्चर्ड AI प्रॉम्प्ट में बदली गई!', 'AI इंजन के लिए व्यवस्थित प्रारूप तैयार है।');
  };

  // News items including user's Kolar Six Lane story
  const [newsFeed, setNewsFeed] = useState<NewsCardItem[]>([
    {
      id: 'post-kolar-bhopal',
      district: 'Bhopal',
      districtHindi: 'भोपाल',
      headline: 'भोपाल: कोलार सिक्स लेन का काम अंतिम चरण में, 15 मई तक पूरा होगा डामरीकरण',
      summary: '5 लाख नागरिकों को रोजाना ट्रैफिक जाम से मिलेगी मुक्ति। नगर निगम और PWD ने 15 मई तक सड़क और डिवाइडर सौंदर्यीकरण की डेडलाइन तय की।',
      bulletPoints: [
        '15 मई तक डामरीकरण और डिवाइडर ब्यूटीफिकेशन की डेडलाइन तय',
        'कोलार रूट के 5 लाख नागरिकों को रोजाना ट्रैफिक जाम से मिलेगी मुक्ति',
        'स्थानीय विधायक ने पीडब्ल्यूडी और निगम अधिकारियों संग किया ग्राउंड निरीक्षण'
      ],
      caption: '🔴 #भोपाल_बड़ी_खबर : कोलार सिक्स लेन प्रोजेक्ट का काम अंतिम चरण में पहुंचा! 🛣️✨\n\nनगर निगम और पीडब्ल्यूडी ने 15 मई तक सड़क का डामरीकरण व डिवाइडर ब्यूटीफिकेशन पूरा करने की डेडलाइन तय की है। इस नए सिक्स लेन कॉरिडोर से कोलार क्षेत्र के 5 लाख से ज्यादा नागरिकों को रोजाना के भारी जाम से स्थायी राहत मिलेगी।\n\n#Bhopal #KolarRoad #SixLane #BhopalNews #BreakingNewsWala #MPNews',
      image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
      page: 'Breaking News Wala Bhopal',
      time: 'अभी-अभी',
      status: 'pending',
      urgency: 'Top Story',
      category: 'Infrastructure & Development',
      jsonOutput: {
        district: 'Bhopal',
        category: 'Infrastructure & Development',
        urgency: 'Top Story',
        graphic_4_5: {
          headline: 'भोपाल: कोलार सिक्स लेन का काम अंतिम चरण में, 15 मई तक पूरा होगा डामरीकरण',
          bullet_points: [
            '15 मई तक डामरीकरण और डिवाइडर ब्यूटीफिकेशन की डेडलाइन तय',
            'कोलार रूट के 5 लाख नागरिकों को रोजाना ट्रैफिक जाम से मिलेगी मुक्ति',
            'स्थानीय विधायक ने पीडब्ल्यूडी और निगम अधिकारियों संग किया ग्राउंड निरीक्षण'
          ],
          badge_text: 'भोपाल',
          suggested_image_keywords: 'bhopal kolar six lane road construction asphalt highway inspection'
        },
        youtube: {
          title: 'Bhopal Kolar Six Lane Road: 5 लाख लोगों को जाम से मिलेगी राहत! 15 मई तक काम होगा पूरा, देखें ग्राउंड रिपोर्ट',
          description: 'भोपाल के कोलार वासियों के लिए बड़ी राहत की खबर! बहुप्रतीक्षित कोलार सिक्स लेन प्रोजेक्ट का निर्माण कार्य अब अपने अंतिम चरण में पहुंच गया है। नगर निगम और लोक निर्माण विभाग (PWD) ने 15 मई तक डामरीकरण और डिवाइडर ब्यूटीफिकेशन पूरा करने का लक्ष्य निर्धारित किया है।\n\n📌 मुख्य बिंदु:\n• रोजाना 5 लाख से अधिक राहगीरों और वाहन चालकों को ट्रैफिक जाम से मुक्ति मिलेगी।\n• 15 मई तक डामरीकरण और सौंदर्यीकरण का काम पूरा करने की सख्त डेडलाइन।\n• स्थानीय विधायक एवं वरिष्ठ प्रशासनिक अधिकारियों ने ग्राउंड जीरो पर पहुंचकर निरीक्षण किया।\n\n#BhopalNews #KolarSixLane #BhopalTraffic #MadhyaPradesh #BreakingNewsWala #MohanYadav #MPNews',
          tags: 'Bhopal Kolar Six Lane, Kolar Road Bhopal Latest News, Bhopal Traffic News, Kolar Six Lane Project Update, MP PWD News, Bhopal Municipal Corporation, Bhopal Development, Breaking News Wala Bhopal, Bhopal News Today, Madhya Pradesh Infrastructure, Kolar Road Widening, Bhopal Breaking News',
          thumbnail_text: 'कोलार सिक्स लेन: 15 मई डेडलाइन! 5 लाख लोगों को जाम से राहत'
        },
        facebook: {
          caption: '🔴 #भोपाल_बड़ी_खबर : कोलार सिक्स लेन प्रोजेक्ट का काम अंतिम चरण में पहुंचा! 🛣️✨\n\nनगर निगम और पीडब्ल्यूडी ने 15 मई तक सड़क का डामरीकरण व डिवाइडर ब्यूटीफिकेशन पूरा करने की डेडलाइन तय की है। इस नए सिक्स लेन कॉरिडोर से कोलार क्षेत्र के 5 लाख से ज्यादा नागरिकों को रोजाना के भारी जाम से स्थायी राहत मिलेगी। आज सुबह स्थानीय विधायक ने अधिकारियों के साथ निर्माण कार्य का जायजा लिया।\n\n👉 इस प्रोजेक्ट पर आपकी क्या राय है? कमेंट कर जरूर बताएं और खबर को शेयर करें।\n\n#Bhopal #KolarRoad #SixLane #BhopalNews #BreakingNewsWala #MPNews',
          target_page_type: 'District Page'
        },
        instagram: {
          caption: 'भोपाल के 5 लाख लोगों के लिए खुशखबरी! 🛣️ कोलार सिक्स लेन का निर्माण अंतिम चरण में, 15 मई तक पूरा होगा काम।\n.\n.\n📍 कोलार रोड, भोपाल\n🚦 अब रोज-रोज के ट्रैफिक जाम से मिलेगी स्थायी राहत। विधायक ने किया निरीक्षण।',
          hashtags: '#bhopal #kolar #kolarsixlane #bhopalcity #madhyapradesh #breakingnewswala #mpnews #bhopaldiaries #roadinfrastructure #trafficrelief #bhopalnews'
        },
        x_twitter: {
          tweet_text: '🚨 #Bhopal : कोलार सिक्स लेन प्रोजेक्ट अंतिम चरण में! 15 मई तक डामरीकरण व डिवाइडर ब्यूटीफिकेशन पूरा करने की डेडलाइन तय। कोलार के 5 लाख नागरिकों को ट्रैफिक जाम से मिलेगी बड़ी राहत। अधिकारियों संग विधायक ने किया निरीक्षण।\n\n#KolarSixLane #MPNews @BreakingNewsWala'
        },
        broadcast_channel: {
          whatsapp_telegram_text: '🔴 *ब्रेकिंग न्यूज वाला - भोपाल अपडेट* 🔴\n\n*कोलार सिक्स लेन का काम अंतिम चरण में, 15 मई तक पूरा होगा डामरीकरण!*\n\n• कोलार के 5 लाख से ज्यादा लोगों को रोजाना के ट्रैफिक जाम से मिलेगी मुक्ति।\n• नगर निगम व PWD ने 15 मई की डेडलाइन की तय, डिवाइडर ब्यूटीफिकेशन भी होगा।\n• विधायक ने अधिकारियों संग ग्राउंड जीरो पर किया निरीक्षण।\n\n👉 *पूरी रिपोर्ट विस्तार से पढ़ें:*\nhttps://breakingnewswala.com/bhopal-kolar-six-lane-update\n\n📲 *हमारे WhatsApp चैनल से जुड़ें:* https://whatsapp.com/channel/breakingnewswala'
        }
      }
    },
    {
      id: 'post-1',
      district: 'Bhopal',
      districtHindi: 'भोपाल',
      headline: 'भोपाल: बड़ा तालाब के पास अतिक्रमण पर चला प्रशासन का बुलडोजर, 25 अवैध निर्माण ध्वस्त',
      summary: 'नगर निगम और जिला प्रशासन की संयुक्त कार्रवाई। 3 घंटे में भारी पुलिस बल के साथ अवैध कब्जे हटाए गए।',
      bulletPoints: ['25 अवैध निर्माण 3 घंटे में ध्वस्त', 'बड़ा तालाब कैचमेंट सुरक्षित करने का अभियान'],
      caption: '🔴 भोपाल बड़ी कार्रवाई: बड़ा तालाब कैचमेंट एरिया में अवैध कब्जों पर प्रशासन का सख्त एक्शन! 25 से अधिक दुकानों व निर्माणों पर चला बुलडोजर।\n\n#BhopalNews #Bhopal #BreakingNewsWala #MPUpdates',
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
      page: 'Breaking News Wala Bhopal',
      time: '18 मिनट पहले',
      status: 'pending',
      urgency: 'Breaking',
      category: 'Civic Administration'
    },
    {
      id: 'post-2',
      district: 'Indore',
      districtHindi: 'इंदौर',
      headline: 'इंदौर: स्वच्छता सर्वेक्षण 2026 में 8वीं बार अव्वल आने की तैयारी, 5 नए कचरा प्लांट शुरू',
      summary: 'महापौर और निगमायुक्त ने किया निरीक्षण। शहर के 100% वेस्ट का होगा साइंटिफिक डिस्पोजल।',
      bulletPoints: ['5 नए अत्याधुनिक प्रोसेसिंग प्लांट्स', '100% साइंटिफिक वेस्ट डिस्पोजल का लक्ष्य'],
      caption: 'स्वच्छता में फिर सिरमौर बनने की राह पर इंदौर! 🌟 5 नए अत्याधुनिक वेस्ट प्रोसेसिंग प्लांट्स का लोकार्पण। देखिए क्या है इंदौर का नया मॉडल।\n\n#Indore #SwachhSurvekshan #IndoreNews #BreakingNewsWala',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
      page: 'Breaking News Wala Indore',
      time: '34 मिनट पहले',
      status: 'pending',
      urgency: 'Top Story',
      category: 'Civic Pride'
    },
    {
      id: 'post-3',
      district: 'Jabalpur',
      districtHindi: 'जबलपुर',
      headline: 'जबलपुर: हाई कोर्ट का अहम फैसला, शिक्षकों के तबादला आदेश पर तत्काल प्रभाव से रोक',
      summary: 'याचिका पर सुनवाई करते हुए कोर्ट ने राज्य सरकार को 4 हफ्तों में जवाब दाखिल करने का दिया निर्देश।',
      bulletPoints: ['विवादित ट्रांसफर सूची पर अंतरिम रोक', 'शासन को 4 सप्ताह में जवाब पेश करने का आदेश'],
      caption: 'जबलपुर हाईकोर्ट से बड़ी राहत! शिक्षकों के विवादित ट्रांसफर लिस्ट पर रोक। पूरी आदेश कॉपी और रिपोर्ट यहां पढ़ें। 👇\n\n#Jabalpur #HighCourt #MPTeachers #BreakingNewsWala',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
      page: 'Breaking News Wala Jabalpur',
      time: '48 मिनट पहले',
      status: 'pending',
      urgency: 'Normal',
      category: 'Judiciary'
    },
    {
      id: 'post-4',
      district: 'Gwalior',
      districtHindi: 'ग्वालियर',
      headline: 'ग्वालियर: चंबल एक्सप्रेसवे के नए रूट को मिली मंजूरी, 4 जिलों के किसानों को मिलेगा मुआवजा',
      summary: 'प्रशासन ने भूमि अधिग्रहण की प्रक्रिया तेज की। मुरैना, भिंड और ग्वालियर के युवाओं को मिलेंगे रोजगार के अवसर।',
      bulletPoints: ['दिल्ली-ग्वालियर सफर 3 घंटे कम होगा', 'भूमि अधिग्रहण और मुआवजे की प्रक्रिया तेज'],
      caption: 'ग्वालियर-चंबल अंचल के लिए बड़ा तोहफा! नए एक्सप्रेसवे लिंक से दिल्ली का सफर 3 घंटे कम होगा।\n\n#Gwalior #ChambalExpressway #MPNews #BreakingNewsWala',
      image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
      page: 'Breaking News Wala Gwalior',
      time: '1 घंटा पहले',
      status: 'pending',
      urgency: 'Normal',
      category: 'Infrastructure'
    }
  ]);

  // Edit Card Modal state & 3-Template Selection
  const [editingCard, setEditingCard] = useState<NewsCardItem | null>(null);
  const [editDistrictHindi, setEditDistrictHindi] = useState('');
  const [editHeadline, setEditHeadline] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editPage, setEditPage] = useState('');
  const [editCardTemplate, setEditCardTemplate] = useState<'News-Alert' | 'Minimalist' | 'Poll-Format'>('News-Alert');
  const [editPollQuestion, setEditPollQuestion] = useState('क्या आप प्रशासन के इस नए निर्णय से सहमत हैं?');
  const [editPollOptionA, setEditPollOptionA] = useState('हाँ, पूर्ण समर्थन');
  const [editPollOptionB, setEditPollOptionB] = useState('नहीं, पुनर्विचार हो');
  const [templatePreviewMode, setTemplatePreviewMode] = useState<'grid' | 'single'>('grid');
  const [showPollConfigInEdit, setShowPollConfigInEdit] = useState(false);
  const [newsAlertAccent, setNewsAlertAccent] = useState<'Red' | 'Gold' | 'Blue'>('Red');
  type GraphicFilter = 'none' | 'grayscale' | 'sepia' | 'high-contrast';
  const [graphicFilter, setGraphicFilter] = useState<GraphicFilter>('none');

  const cycleNewsAlertAccent = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setNewsAlertAccent(prev => {
      const next = prev === 'Red' ? 'Gold' : prev === 'Gold' ? 'Blue' : 'Red';
      const labelMap = { Red: 'सिग्नेचर रेड', Gold: 'रॉयल गोल्ड', Blue: 'ब्रॉडकास्ट ब्लू' };
      showToast(`लेआउट एक्सेंट बदला गया: ${labelMap[next]} (${next})`);
      return next;
    });
  };

  const cycleGraphicFilter = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setGraphicFilter(prev => {
      const order: GraphicFilter[] = ['none', 'grayscale', 'sepia', 'high-contrast'];
      const nextIdx = (order.indexOf(prev) + 1) % order.length;
      const next = order[nextIdx];
      const labelMap: Record<GraphicFilter, string> = {
        none: 'ओरिजिनल (None)',
        grayscale: 'ग्रेस्केल (Grayscale)',
        sepia: 'सेपिया (Sepia)',
        'high-contrast': 'हाई-कंट्रास्ट (High Contrast)'
      };
      showToast(`इमेज फिल्टर लागू: ${labelMap[next]}`);
      return next;
    });
  };

  const getFilterStyle = (filter: GraphicFilter): React.CSSProperties => {
    switch (filter) {
      case 'grayscale':
        return { filter: 'grayscale(100%)' };
      case 'sepia':
        return { filter: 'sepia(90%) contrast(105%)' };
      case 'high-contrast':
        return { filter: 'contrast(160%) brightness(105%) saturate(120%)' };
      default:
        return { filter: 'none' };
    }
  };

  // High-Resolution 1080x1350 PNG HD Export (Phase 6)
  const downloadHighResCard = (templateName: string, headlineText: string, summaryText: string, districtText: string, imgSrc: string) => {
    showToast('1080x1350 HD PNG रेंडर हो रहा है...', 'हाई-डेफिनिशन 4:5 ग्राफिक तैयार किया जा रहा है');
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#080A0F';
    ctx.fillRect(0, 0, 1080, 1350);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1080, 1350);

      const gradTop = ctx.createLinearGradient(0, 0, 0, 320);
      gradTop.addColorStop(0, 'rgba(0,0,0,0.85)');
      gradTop.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, 1080, 320);

      const gradBottom = ctx.createLinearGradient(0, 550, 0, 1350);
      gradBottom.addColorStop(0, 'rgba(0,0,0,0)');
      gradBottom.addColorStop(0.25, 'rgba(0,0,0,0.8)');
      gradBottom.addColorStop(1, 'rgba(0,0,0,0.98)');
      ctx.fillStyle = gradBottom;
      ctx.fillRect(0, 550, 1080, 800);

      const accentBg = newsAlertAccent === 'Gold' ? '#FFED00' : newsAlertAccent === 'Blue' ? '#2563EB' : '#E21A25';
      ctx.fillStyle = accentBg;
      ctx.fillRect(50, 50, 420, 60);
      ctx.fillStyle = newsAlertAccent === 'Gold' ? '#000000' : '#FFFFFF';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(userProfile?.channelName || 'ब्रेकिंग न्यूज वाला', 70, 92);

      ctx.fillStyle = '#FFED00';
      ctx.fillRect(860, 50, 170, 60);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(districtText || 'मध्य प्रदेश', 880, 92);

      ctx.fillStyle = '#E21A25';
      ctx.fillRect(50, 860, 260, 48);
      ctx.fillStyle = '#FFED00';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('BREAKING ALERT', 70, 893);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 50px sans-serif';
      const words = (headlineText || 'खबर की हेडलाइन').split(' ');
      let line = '';
      let y = 970;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 980 && n > 0) {
          ctx.fillText(line, 50, y);
          line = words[n] + ' ';
          y += 65;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 50, y);

      if (summaryText) {
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '30px sans-serif';
        ctx.fillText(summaryText.slice(0, 60) + '...', 50, y + 60);
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 1260);
      ctx.lineTo(1030, 1260);
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '24px sans-serif';
      ctx.fillText('facebook.com/breakingnewswala', 50, 1300);
      ctx.fillStyle = '#FFED00';
      ctx.fillText('@breakingnewswala • AI NEWSROOM', 640, 1300);

      try {
        const link = document.createElement('a');
        link.download = `bnw-card-1080x1350-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('1080x1350 HD PNG सफलतापूर्वक डाउनलोड हुआ!', 'इंस्टाग्राम व फेसबुक पर शेयर करने हेतु तैयार');
      } catch (err) {
        console.error('Download error:', err);
        showToast('डाउनलोड पूरा हुआ');
      }
    };
    img.onerror = () => {
      showToast('इमेज लोड त्रुटि, डिफ़ॉल्ट टेम्पलेट डाउनलोड हो रहा है');
    };
    img.src = imgSrc;
  };

  // PWA Install State (No auto-popup when entering app as requested)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showPwaBanner, setShowPwaBanner] = useState(false);

  // Live Notification Ring State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 'notif-1',
      title: '🔴 ब्रेकिंग न्यूज कार्ड तैयार',
      desc: 'इंदौर AI वेस्ट मॉनिटरिंग सिस्टम का 4:5 कार्ड अप्रूवल के लिए तैयार है।',
      time: 'अभी-अभी',
      unread: true,
      category: 'BREAKING',
      actionView: 'generatorQueue'
    },
    {
      id: 'notif-2',
      title: '⚡ ऑटो-सिंडिकेशन सफल',
      desc: 'भोपाल कोलार सिक्स लेन खबर 3 WhatsApp ग्रुप्स में ब्रॉडकास्ट की गई।',
      time: '6 मिनट पहले',
      unread: true,
      category: 'DISTRIBUTION',
      actionView: 'distributionHub'
    },
    {
      id: 'notif-3',
      title: '🔥 4.2x वायरल अलर्ट',
      desc: 'जबलपुर हाईकोर्ट तबादला रोक खबर फेसबुक पेज पर तेजी से ट्रेंड हो रही है।',
      time: '14 मिनट पहले',
      unread: true,
      category: 'VIRAL',
      actionView: 'viralRadar'
    },
    {
      id: 'notif-4',
      title: '🟢 6/6 APIs 100% एक्टिव',
      desc: 'Meta, Telegram, Gemini, X और YouTube लेटेंसी 68ms पर स्मूथ है।',
      time: '28 मिनट पहले',
      unread: false,
      category: 'HEALTH',
      actionView: 'healthCheck'
    }
  ]);

  const unreadNotifCount = notificationsList.filter(n => n.unread).length;

  const markAllNotificationsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // 100% Original Logo State (uses uploaded Logo.png, with fallback to /logo.png)
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(() => {
    return localStorage.getItem('custom_original_logo') || '/Logo.png';
  });

  // One-time PNG logo indicator state (shown only once, then hidden permanently on both desktop & mobile Chrome)
  const [showPngButton, setShowPngButton] = useState<boolean>(() => {
    try {
      const alreadyHidden = localStorage.getItem('hide_png_button') === 'true' || localStorage.getItem('has_seen_png_prompt') === 'true';
      return !alreadyHidden;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (showPngButton) {
      // Auto-retire the PNG upload badge after 6 seconds of initial visibility so it never lingers on mobile or desktop
      const timer = setTimeout(() => {
        try {
          localStorage.setItem('hide_png_button', 'true');
          localStorage.setItem('has_seen_png_prompt', 'true');
        } catch {}
        setShowPngButton(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showPngButton]);

  const dismissPngButton = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    try {
      localStorage.setItem('hide_png_button', 'true');
      localStorage.setItem('has_seen_png_prompt', 'true');
    } catch {}
    setShowPngButton(false);
    showToast('PNG बटन हटा दिया गया है');
  };

  const handleUploadOriginalLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setCustomLogoUrl(result);
          localStorage.setItem('custom_original_logo', result);
          setShowPngButton(false);
          if (currentUser?.uid) {
            updateUserProfile(currentUser.uid, { channelLogo: result }).catch(console.error);
          }
          showToast('लोगो सफलतापूर्वक सेट व सिंक किया गया!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await syncUserProfile(user);
          setUserProfile(profile);
          if (profile.channelLogo && profile.channelLogo.trim() !== '') {
            setCustomLogoUrl(profile.channelLogo);
          }
        } catch (e) {
          console.warn('Profile sync fallback:', e);
          const isMaster = isMasterAdminEmail(user.email);
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Newsroom Admin',
            photoURL: user.photoURL || '',
            role: isMaster ? 'MASTER_ADMIN' : 'CHANNEL_ADMIN',
            channelName: isMaster ? 'AI Newsroom' : 'मेरा जिला लाइव',
            channelLogo: '/Logo.png',
            district: 'मध्य प्रदेश',
            facebookConnected: isMaster,
            youtubeConnected: isMaster,
            status: 'active'
          });
        }
      } else {
        // Check if there is an active session in localStorage (for preview/dev environments)
        const savedSession = localStorage.getItem('bnw_active_session_user');
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            const devUser = createDevMasterUser(parsed.email || 'editor.bnwtv@gmail.com', parsed.displayName || 'Editor (BNW TV)');
            setCurrentUser(devUser);
            setUserProfile({
              uid: devUser.uid,
              email: devUser.email || 'editor.bnwtv@gmail.com',
              displayName: devUser.displayName || 'Editor (BNW TV)',
              photoURL: devUser.photoURL || '',
              role: 'MASTER_ADMIN',
              channelName: 'AI Newsroom',
              channelLogo: '/Logo.png',
              district: 'मध्य प्रदेश',
              facebookConnected: true,
              youtubeConnected: true,
              instagramConnected: true,
              twitterConnected: true,
              linkedinConnected: true,
              status: 'active'
            });
            setIsAuthLoading(false);
            return;
          } catch {}
        }
        setCurrentUser(null);
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const user = await signInWithGoogle('editor.bnwtv@gmail.com');
      setCurrentUser(user);
      const isMaster = isMasterAdminEmail(user.email);
      const profile = await syncUserProfile(user);
      setUserProfile(profile);
      showToast(`Google लॉगिन सफल: स्वागत है ${user.displayName || user.email}!`);
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        console.warn('[Firebase Auth] Handled unauthorized preview domain cleanly.');
      } else {
        console.error('Google Sign-In Error:', err);
        showToast('Google साइन-इन रद्द या विफल हुआ। कृपया दोबारा प्रयास करें।');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('bnw_active_session_user');
      await signOutUser();
      setCurrentUser(null);
      setUserProfile(null);
      setGuestAccessGranted(false);
      showToast('सफलतापूर्वक लॉगआउट किया गया!');
    } catch (err) {
      console.warn('SignOut warning:', err);
      localStorage.removeItem('bnw_active_session_user');
      setCurrentUser(null);
      setUserProfile(null);
      setGuestAccessGranted(false);
      showToast('सफलतापूर्वक लॉगआउट किया गया!');
    }
  };

  const handleSaveChannelProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      await updateUserProfile(currentUser.uid, updates);
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      if (updates.channelLogo) {
        setCustomLogoUrl(updates.channelLogo);
      }
      setShowChannelSettingsModal(false);
      showToast('चैनल प्रोफाइल व सोशल मीडिया सेटिंग्स सुरक्षित की गईं!');
    } catch (e) {
      console.error(e);
      showToast('सेटिंग्स सेव करने में त्रुटि आई');
    }
  };

  // Top Nav Horizontal Scroll Ref & Smooth Scroll Handlers
  const navTabsRef = useRef<HTMLDivElement>(null);

  const scrollNav = (direction: 'left' | 'right') => {
    if (navTabsRef.current) {
      const scrollAmount = 260;
      navTabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Dynamic Scrolling News Ticker Feeds
  const [tickerNewsList, setTickerNewsList] = useState([
    { district: 'भोपाल', text: 'कोलार सिक्स लेन का काम अंतिम चरण में, 15 मई डेडलाइन तय', tag: 'इन्फ्रा' },
    { district: 'इंदौर', text: 'स्वच्छता में 8वीं बार सिरमौर बनने की तैयारी, नया AI वेस्ट मॉनिटरिंग सिस्टम शुरू', tag: 'स्मार्ट सिटी' },
    { district: 'जबलपुर', text: 'हाईकोर्ट का बड़ा फैसला: सरकारी कर्मचारियों के तबादला आदेश पर तत्काल प्रभाव से रोक', tag: 'न्यायिक' },
    { district: 'ग्वालियर', text: 'चंबल एक्सप्रेसवे के नए रूट को मंजूरी, 4 जिलों के किसानों को मिलेगा त्वरित मुआवजा', tag: 'एक्सप्रेसवे' },
    { district: 'उज्जैन', text: 'श्री महाकाल महालोक और क्षिप्रा रिवरफ्रंट सौंदर्यीकरण का दूसरा चरण शुरू', tag: 'धार्मिक' },
    { district: 'रीवा', text: 'एशिया के सबसे बड़े सोलर प्लांट से नए ग्रिड को 250MW अतिरिक्त बिजली आपूर्ति चालू', tag: 'ऊर्जा' }
  ]);
  const [tickerFeedIndex, setTickerFeedIndex] = useState(0);

  // View JSON Modal state
  const [jsonModalItem, setJsonModalItem] = useState<NewsCardItem | null>(null);

  // New RSS Rule Modal state
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [rulesList, setRulesList] = useState([
    {
      id: 1,
      name: 'Rule #1: Bhopal District Feed',
      mode: 'एडमिन अप्रूवल मोड',
      url: 'https://breakingnewswala.in/feeds/bhopal.xml',
      target: 'Breaking News Wala Bhopal'
    },
    {
      id: 2,
      name: 'Rule #2: Indore District Feed',
      mode: 'एडमिन अप्रूवल मोड',
      url: 'https://breakingnewswala.in/feeds/indore.xml',
      target: 'Breaking News Wala Indore'
    },
    {
      id: 3,
      name: 'Rule #3: Jabalpur Judicial & Civic Feed',
      mode: 'एडमिन अप्रूवल मोड',
      url: 'https://breakingnewswala.in/feeds/jabalpur.xml',
      target: 'Breaking News Wala Jabalpur'
    }
  ]);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleUrl, setNewRuleUrl] = useState('');
  const [newRulePage, setNewRulePage] = useState('Breaking News Wala Ujjain');

  // Video Studio State
  const [videoThumb, setVideoThumb] = useState('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80');
  const [videoNotes, setVideoNotes] = useState('मध्यप्रदेश कैबिनेट की बैठक में 12 बड़े फैसले, सरकारी कर्मचारियों का डीए बढ़ा, लाड़ली बहना योजना में नए प्रावधान...');
  const [videoStudioTab, setVideoStudioTab] = useState<'yt' | 'fb' | 'ig' | 'x' | 'li'>('yt');
  const [ytTitle, setYtTitle] = useState('MP Cabinet Decisions: मोहन सरकार के 12 बड़े फैसले! कर्मचारियों का महंगाई भत्ता बढ़ा, देखें पूरी लिस्ट');
  const [ytDesc, setYtDesc] = useState(`मध्यप्रदेश कैबिनेट बैठक में लिए गए अहम फैसलों की पूरी ग्राउंड रिपोर्ट। मुख्यमंत्री ने सरकारी कर्मचारियों और लाड़ली बहना योजना को लेकर क्या बड़े ऐलान किए हैं, जानिए ब्रेकिंग न्यूज वाला की इस स्पेशल वीडियो रिपोर्ट में।

📌 महत्वपूर्ण बिंदु:
00:00 - कैबिनेट बैठक के मुख्य बिंदु
01:15 - सरकारी कर्मचारियों का DA आदेश
02:10 - लाड़ली बहना योजना का नया अपडेट
03:00 - सड़कों और जल परियोजनाओं को हरी झंडी

#MPNews #MohanYadav #MPCabinet #BreakingNewsWala #MadhyaPradesh`);
  const [ytTags, setYtTags] = useState('MP Cabinet Decisions 2026, Mohan Yadav Cabinet meeting, MP DA Hike Today, Madhya Pradesh News, Bhopal Breaking News, Ladli Bahna Yojana New Update, MP Sarkari Karmchari DA, Breaking News Wala, MP News Today Live, Bhopal News Channel, Latest Hindi News, Dainik MP News');
  const [fbCaption, setFbCaption] = useState(`🔴 #BREAKING : MP कैबिनेट की आज की बैठक में हुए 12 ऐतिहासिक फैसले! 

कर्मचारियों के लिए डीए में बढ़ोतरी और महिला सशक्तिकरण को लेकर लिए गए बड़े निर्णय। पूरी खबर और कैबिनेट ब्रीफिंग का वीडियो जरूर देखें और अपनी राय कमेंट्स में बताएं! 👇

➡️ वीडियो को शेयर करना न भूलें।
#MadhyaPradesh #Bhopal #MPNews #BreakingNewsWala #MohanYadav #CabinetMeeting`);
  const [igCaption, setIgCaption] = useState(`MP Cabinet Big Decision! 🚨 जानिए आज कैबिनेट के वो 3 फैसले जो सीधा आपकी जेब और राज्य के विकास पर असर डालेंगे। 

📍 भोपाल मंत्रालय से एक्सक्लूसिव रिपोर्ट। 

🎵 रेकमेंडेड ऑडियो: Intense Newsroom Thriller Track #04
.
.
#reelsindia #mpnews #bhopal #indore #madhyapradesh #breakingnewswala #governmentschemes #viralreels #dailyupdates`);
  const [xCaption, setXCaption] = useState(`🚨 #MP_BREAKING : मध्यप्रदेश कैबिनेट बैठक खत्म। सरकारी कर्मचारियों के डीए और लाड़ली बहना योजना सहित 12 अहम प्रस्तावों को मिली मंजूरी। 

पूरी वीडियो रिपोर्ट नीचे देखें 👇
#MadhyaPradesh #BhopalNews @BreakingNewsWala`);
  const [liCaption, setLiCaption] = useState(`Policy Update | Madhya Pradesh Governance & Infrastructure

Today's State Cabinet meeting chaired by the Chief Minister greenlit several critical public administration initiatives, focusing on fiscal welfare, regional infra-projects, and women entrepreneurship schemes. 

Here is our comprehensive video breakdown of the administrative implications.
#PublicPolicy #Governance #MadhyaPradesh #BreakingNewsWala #StateEconomy`);

  // ================= SOCIAL MEDIA PREVIEW SECTION STATE =================
  const [customUploadedThumb, setCustomUploadedThumb] = useState<string | null>(null);
  const [socialPreviewPlatform, setSocialPreviewPlatform] = useState<'youtube' | 'facebook'>('youtube');
  const [previewHeadline, setPreviewHeadline] = useState(
    'MP कैबिनेट के 12 बड़े फैसले! कर्मचारियों का DA बढ़ा, लाड़ली बहना नया आदेश'
  );
  const [previewUrgencyBadge, setPreviewUrgencyBadge] = useState('🔴 EXCLUSIVE / बड़ा खुलासा');
  const [previewLocationBadge, setPreviewLocationBadge] = useState('भोपाल मंत्रालय');
  const [highContrastOverlay, setHighContrastOverlay] = useState(true);
  const [showChannelLogo, setShowChannelLogo] = useState(true);
  const [showDurationPill, setShowDurationPill] = useState(true);
  const [overlayStyle, setOverlayStyle] = useState<'redYellow' | 'darkVignette' | 'breakingFlash'>('redYellow');

  const handleCustomThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomUploadedThumb(reader.result);
          setVideoThumb(reader.result);
          showToast('कस्टम थंबनेल सफलतापूर्वक लोड हुआ!', 'ब्रांडेड हाई-कंट्रास्ट ओवरले तैयार है');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Toast Helper
  const showToast = (title: string, message: string = '') => {
    setToast({ show: true, title, message: message || 'कंट्रोल रूम डेटा अपडेटेड' });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // Approval functions
  const approveCard = (id: string) => {
    setNewsFeed(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'published' } : item))
    );
    const item = newsFeed.find(p => p.id === id);
    showToast(
      `'${item?.headline.slice(0, 32)}...' पब्लिश कर दी गई!`,
      `${item?.page} और Instagram पर लाइव`
    );
  };

  const approveAllFiltered = () => {
    setNewsFeed(prev =>
      prev.map(item => {
        if (selectedDistrictFilter === 'ALL' || item.district === selectedDistrictFilter) {
          return { ...item, status: 'published' };
        }
        return item;
      })
    );
    showToast('सभी चयनित खबरें सोशल पेजों पर पब्लिश कर दी गईं!');
  };

  // PWA Install Prompt Listener
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setShowPwaBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall as any);

    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setIsInstallable(false);
      setShowPwaBanner(false);
      showToast('🎉 ब्रेकिंग न्यूज वाला कंट्रोल रूम ऐप इंस्टॉल हो चुका है!');
    });

    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall as any);
    };
  }, []);

  // Periodic Ticker Feed Cycler
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerFeedIndex(prev => (prev + 1) % tickerNewsList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [tickerNewsList]);

  // Install PWA Trigger Handler
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          showToast('✅ वेब ऐप इंस्टॉलेशन शुरू हो गया है!');
          setShowPwaBanner(false);
        }
      } catch (err) {
        console.error('Install error:', err);
      }
      setDeferredPrompt(null);
    } else {
      showToast('📱 Chrome मेनू (⋮) पर टैप करें और "Add to Home Screen" या "Install App" चुनें!');
    }
  };

  // Open Edit Modal with 3-Template Selection
  const openEdit = (item: NewsCardItem) => {
    setEditingCard(item);
    setEditDistrictHindi(item.districtHindi);
    setEditHeadline(item.headline);
    setEditSummary(item.summary);
    setEditCaption(item.caption);
    setEditPage(item.page);
    setEditCardTemplate('News-Alert');
    setTemplatePreviewMode('grid');
    setEditPollQuestion(
      item.headline.length > 55
        ? `${item.headline.slice(0, 52)}... पर आपकी क्या राय है?`
        : `क्या आप ${item.districtHindi} के इस नए निर्णय से सहमत हैं?`
    );
    setEditPollOptionA('हाँ, पूर्ण समर्थन');
    setEditPollOptionB('नहीं, पुनर्विचार हो');
  };

  const saveEditAndPublish = () => {
    if (!editingCard) return;
    setNewsFeed(prev =>
      prev.map(item =>
        item.id === editingCard.id
          ? {
              ...item,
              districtHindi: editDistrictHindi,
              headline: editHeadline,
              summary: editSummary,
              caption: editCaption,
              page: editPage,
              status: 'published'
            }
          : item
      )
    );
    setEditingCard(null);
    showToast(`संशोधित कार्ड (${editCardTemplate} लेआउट) सोशल पेजों पर पब्लिश हुआ!`);
  };

  // News Feed Hub to 4:5 Graphic Studio Handler (Phase 3 CTA)
  const handleFeedGenerateGraphic = (article: FeedArticleItem) => {
    const bullets = article.bulletPoints && article.bulletPoints.length > 0 ? article.bulletPoints : [
      `${article.districtHindi} जिला प्रशासन द्वारा त्वरित कार्रवाई`,
      `स्थानीय नागरिकों के लिए प्राथमिकता पर कार्य जारी`,
      `विभागीय रिपोर्ट 24 घंटे में तलब`
    ];

    const cardItem: NewsCardItem = {
      id: 'feed-card-' + Date.now(),
      district: article.district,
      districtHindi: article.districtHindi,
      headline: article.headline,
      summary: article.summary,
      bulletPoints: bullets,
      caption: `🔴 #${article.districtHindi}_बड़ी_खबर : ${article.headline}\n\n${article.summary}\n\n#${article.district}News #BreakingNewsWala #MPUpdates`,
      image: article.imageUrl || 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
      page: `Breaking News Wala ${article.districtHindi}`,
      time: 'अभी-अभी',
      status: 'pending',
      urgency: article.urgency,
      category: article.categoryHindi,
      jsonOutput: {
        district: article.district,
        category: article.categoryHindi,
        urgency: article.urgency,
        graphic_4_5: {
          headline: article.headline,
          bullet_points: bullets,
          badge_text: article.districtHindi
        }
      }
    };

    setNewsFeed(prev => [cardItem, ...prev]);
    openEdit(cardItem);
    showToast(`4:5 ग्राफिक स्टूडियो खुला: ${article.districtHindi}`, '3-टेंपलेट लाइव प्रीव्यू में कस्टमाइज करें');
  };

  // News Feed Hub to Video Studio Handler (Phase 3 CTA)
  const handleFeedSendToVideoStudio = (article: FeedArticleItem) => {
    setVideoNotes(article.headline + '\n\n' + article.summary);
    setPreviewHeadline(article.headline.slice(0, 70));
    setYtTitle(`${article.districtHindi} Breaking: ${article.headline.slice(0, 68)}`);
    setYtDesc(`${article.headline}\n\n${article.summary}\n\n#${article.districtHindi} #MPNews #BreakingNewsWala`);
    if (article.imageUrl) {
      setVideoThumb(article.imageUrl);
      setCustomUploadedThumb(article.imageUrl);
    }
    setActiveView('videoStudio');
    showToast(`वीडियो स्टूडियो में लोड हुआ: ${article.districtHindi}`, 'AI SEO टैग्स, कैप्शन्स व 16:9 थंबनेल रेडी है');
  };

  // Quick News to Queue Engine
  const processQuickNewsToQueue = () => {
    const districtMap: Record<string, string> = {
      Bhopal: 'भोपाल',
      Indore: 'इंदौर',
      Jabalpur: 'जबलपुर',
      Gwalior: 'ग्वालियर',
      Ujjain: 'उज्जैन',
      Sagar: 'सागर',
      Rewa: 'रीवा'
    };

    const districtHindi = districtMap[quickNewsDistrict] || quickNewsDistrict;
    
    // Parse dynamic headline and content from user/dictated text
    const lines = quickNewsText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let headline = '';
    
    // Check if user text has a structured headline or take the first clean sentence
    const headlineMatch = quickNewsText.match(/1\.\s*(.+)/) || quickNewsText.match(/■\s*मूल घटना.*?:\s*(.+)/);
    if (headlineMatch && headlineMatch[1]) {
      headline = `${districtHindi}: ${headlineMatch[1].replace(/^[0-9.:\-\s]+/, '').slice(0, 75)}`;
    } else if (lines.length > 0) {
      const firstLine = lines[0].replace(/【.*?】/g, '').replace(/■.*?:/g, '').replace(/[।!?.,]/g, '').trim();
      headline = `${districtHindi}: ${firstLine.slice(0, 72)}`;
    } else {
      headline = `${districtHindi}: ताज़ा घटनाक्रम पर बड़ा अपडेट, प्रशासन द्वारा त्वरित कार्रवाई`;
    }

    const summaryText = quickNewsText.length > 140 ? quickNewsText.slice(0, 140) + '...' : quickNewsText;
    const bullets = [
      `${districtHindi} जिला प्रशासन व संबंधित विभाग द्वारा ग्राउंड स्तर पर त्वरित कार्रवाई के निर्देश`,
      `स्थानीय नागरिकों व हितग्राहियों के लिए परियोजना व राहत कार्य प्राथमिकता पर`,
      `आगामी सप्ताह तक कार्ययोजना की समीक्षा और नियमित निगरानी रिपोर्ट तलब`
    ];

    const newItem: NewsCardItem = {
      id: 'post-quick-' + Date.now(),
      district: quickNewsDistrict,
      districtHindi: districtHindi,
      headline: headline,
      summary: summaryText,
      bulletPoints: bullets,
      caption: `🔴 #${districtHindi}_बड़ी_खबर : ${headline}\n\n${quickNewsText}\n\n#${quickNewsDistrict}News #BreakingNewsWala #MPUpdates`,
      image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
      page: `Breaking News Wala ${quickNewsDistrict}`,
      time: 'अभी-अभी',
      status: 'pending',
      urgency: quickNewsUrgency,
      category: quickNewsCategory,
      jsonOutput: {
        district: quickNewsDistrict,
        category: quickNewsCategory,
        urgency: quickNewsUrgency,
        graphic_4_5: {
          headline: headline,
          bullet_points: bullets,
          badge_text: districtHindi,
          suggested_image_keywords: `${quickNewsDistrict.toLowerCase()} news report official ground`
        },
        youtube: {
          title: `${quickNewsDistrict} Breaking: 5 लाख लोगों को मिलेगी राहत, 15 मई तक प्रोजेक्ट होगा पूरा!`,
          description: `${quickNewsText}\n\n#${quickNewsDistrict} #BreakingNewsWala #MPNews`,
          tags: `${quickNewsDistrict} News, Breaking News Wala, MP Breaking News`,
          thumbnail_text: `${districtHindi}: 15 मई डेडलाइन तय!`
        },
        facebook: {
          caption: `🔴 #${districtHindi}_अपडेट : ${headline}\n\n${quickNewsText}`,
          target_page_type: 'District Page'
        },
        instagram: {
          caption: `${districtHindi} अपडेट: 5 लाख लोगों के लिए राहत भरी खबर!`,
          hashtags: `#${quickNewsDistrict.toLowerCase()} #mpnews #breakingnewswala`
        },
        x_twitter: {
          tweet_text: `🚨 #${quickNewsDistrict} : ${headline.slice(0, 160)}... #MPNews @BreakingNewsWala`
        },
        broadcast_channel: {
          whatsapp_telegram_text: `🔴 *${districtHindi} अपडेट* 🔴\n\n*${headline}*\n\n${quickNewsText.slice(0, 120)}...\n\n👉 विस्तार से पढ़ें: https://breakingnewswala.com`
        }
      }
    };

    setNewsFeed(prev => [newItem, ...prev]);
    setShowQuickNewsModal(false);
    setActiveView('generatorQueue');
    showToast(`'${districtHindi}' का 4:5 कार्ड व AI SEO तैयार होकर क्यू में शामिल!`);
  };

  // Copy helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('क्लिपबोर्ड में कॉपी कर लिया गया है!');
  };

  const pendingCount = newsFeed.filter(i => i.status === 'pending').length;

  const filteredNews = newsFeed.filter(item => {
    if (selectedDistrictFilter === 'ALL') return true;
    return item.district === selectedDistrictFilter;
  });

  return (
    <div className="bg-[#080A0F] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-[#E21A25] selection:text-white">
      {/* ================= PRIMARY GOOGLE LOGIN FIRST SCREEN ================= */}
      {!currentUser && !guestAccessGranted && (
        <div className="fixed inset-0 z-50 bg-[#07090F] flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Subtle Ambient Red Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E21A25]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl w-full bg-[#0E131F]/95 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl text-center space-y-5 my-auto">
            {/* Official AI Newsroom 3D Broadcast Logo Badge */}
            <div className="flex justify-center">
              <div className="relative p-1.5 rounded-full bg-gradient-to-b from-amber-400 via-red-600 to-yellow-500 shadow-[0_0_35px_rgba(226,26,37,0.5)] group">
                <img
                  src="/assets/aistudio/AI_Newsroom_Broadcast_Badge_811afc98.png"
                  alt="AI Newsroom"
                  className="h-24 sm:h-28 w-auto object-contain rounded-full drop-shadow-[0_8px_25px_rgba(0,0,0,0.8)]"
                  onError={(e) => { e.currentTarget.src = '/Logo.png'; }}
                />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FFED00] border-2 border-[#0E131F]"></span>
                </span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E21A25]/20 text-[#FFED00] text-xs font-bold border border-red-500/40 uppercase tracking-wider mb-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
                <span>ऑल-इन-वन ब्रॉडकास्ट व सोशल मीडिया ऑटोमेशन इंजन</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                AI Newsroom
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                अपने चैनल को तेजी से ग्रो करें • ऑटो-ग्राफिक्स, वीडियो सिंडिकेशन, RSS ऑटोमेशन व AI SEO
              </p>
            </div>

            {/* STEP-BY-STEP FEATURE SHOWCASE CAROUSEL (Pages 1, 2, 3 with 2 features highlighted per page) */}
            <div className="bg-[#121724] border border-[#232B3E] rounded-2xl p-4 sm:p-5 text-left space-y-4">
              {/* Stepper Header Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(1)}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                      onboardingStep === 1
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    1. चैनल ग्रोथ
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(2)}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                      onboardingStep === 2
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    2. सोशल सिंडिकेशन
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(3)}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                      onboardingStep === 3
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    3. वीडियो व SEO
                  </button>
                </div>

                <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  पेज {onboardingStep} / 3
                </span>
              </div>

              {/* PAGE 1: 4:5 Graphics & Viral Radar Growth */}
              {onboardingStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2 hover:border-amber-400/60 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-500/20 text-[#FFED00]">
                          <Zap className="w-4 h-4 fill-current" />
                        </div>
                        <h3 className="text-xs font-black text-white">3-सेकंड ऑटो 4:5 ग्राफिक्स</h3>
                      </div>
                      <span className="text-[9px] bg-red-600/30 text-red-300 font-bold px-1.5 py-0.2 rounded border border-red-500/30">
                        4:5 Ratio
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      रॉ न्यूज़ या वॉइस डिक्टेशन से 3 सेकंड में 1 कैची हिंदी हेडलाइन, 3 बुलेट पॉइंट्स और चैनल लोगो के साथ इंस्टाग्राम व फेसबुक रेडी 4:5 कार्ड्स तैयार।
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-red-500/30 space-y-2 hover:border-red-400/60 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-red-600/20 text-red-400">
                          <Flame className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-black text-white">10x चैनल ग्रोथ व वायरल रडार</h3>
                      </div>
                      <span className="text-[9px] bg-amber-500/30 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                        Viral 5.0x
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      ट्रेंडिंग खबरों का स्वतः डिटेक्शन और 2.5x से 5.0x वायरल स्पीड स्कोरिंग। सही समय पर सही खबर पब्लिश करके चैनल के फॉलोअर्स और व्यूज तेजी से बढ़ाएं।
                    </p>
                  </div>
                </div>
              )}

              {/* PAGE 2: One-Click Social Syndication & Smart RSS Automation */}
              {onboardingStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/30 space-y-2 hover:border-blue-400/60 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-600/20 text-cyan-300">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-black text-white">वन प्लेटफॉर्म ऑल सोशल शेयरिंग</h3>
                      </div>
                      <span className="text-[9px] bg-blue-500/30 text-cyan-200 font-bold px-1.5 py-0.2 rounded border border-blue-500/30">
                        7+ पेजेस
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Facebook Pages, YouTube (Shorts व Videos), Instagram Reels, X (Twitter), WhatsApp Channels, Telegram और LinkedIn पर एक क्लिक में ऑटो-शेयरिंग व शेड्यूलिंग।
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2 hover:border-emerald-400/60 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400">
                          <Radio className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-black text-white">RSS ऑटोमेशन व लाइव न्यूज़ फीड</h3>
                      </div>
                      <span className="text-[9px] bg-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                        ऑटोपायलट
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      सरकारी पोर्टल्स, वायर एजेंसीज व कस्टम RSS फीड्स से खबरों का ऑटो-फेचिंग। एडमिन अप्रूवल मोड या 100% हैंड्स-फ्री ऑटोपायलट फॉरवर्डिंग।
                    </p>
                  </div>
                </div>
              )}

              {/* PAGE 3: Video Studio, Full AI SEO & Thumbnail Engine */}
              {onboardingStep === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/30 space-y-2 hover:border-purple-400/60 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-purple-600/20 text-purple-300">
                          <Clapperboard className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-black text-white">फुल-स्टैक AI SEO इंजन</h3>
                      </div>
                      <span className="text-[9px] bg-purple-500/30 text-purple-200 font-bold px-1.5 py-0.2 rounded border border-purple-500/30">
                        High CTR
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      वीडियो अपलोड करते ही YouTube के लिए हाई-सीटीआर हिंदी टाइटल्स, 18+ सर्च टैग्स, फेसबुक हुक, इंस्टाग्राम रील्स कैप्शन्स व एक्स अलर्ट्स स्वतः जनरेट।
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-sky-500/30 space-y-2 hover:border-sky-400/60 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-sky-600/20 text-sky-300">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-black text-white">16:9 थंबनेल व लाइव सोशल प्रीव्यू</h3>
                      </div>
                      <span className="text-[9px] bg-sky-500/30 text-sky-200 font-bold px-1.5 py-0.2 rounded border border-sky-500/30">
                        16:9 Preview
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      हाई-कंट्रास्ट ब्रेकिंग बार, चैनल लोगो और कस्टम ओवरले के साथ पब्लिश करने से पहले YouTube व Facebook फीड का वास्तविक प्रीव्यू देखें।
                    </p>
                  </div>
                </div>
              )}

              {/* Stepper Navigation Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(prev => Math.max(1, prev - 1))}
                  disabled={onboardingStep === 1}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>पिछला फ़ीचर</span>
                </button>

                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(step => (
                    <span
                      key={step}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        onboardingStep === step ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700'
                      }`}
                    ></span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setOnboardingStep(prev => Math.min(3, prev + 1))}
                  disabled={onboardingStep === 3}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                >
                  <span>अगला फ़ीचर</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* MANDATORY USER AGREEMENT CHECKBOX */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 text-left">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="terms-agreement-checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-amber-500 text-red-600 focus:ring-amber-400 cursor-pointer accent-[#E21A25]"
                />
                <span className="text-xs text-slate-200 leading-snug font-medium">
                  मैंने AI Newsroom के सभी फीचर्स व ऑटोमेशन नियमों को समझ लिया है और मैं अपने चैनल का सेटअप करना चाहता हूँ।
                </span>
              </label>
            </div>

            {/* Google Login Action Area */}
            <div className="space-y-3 pt-1">
              {!termsAgreed && (
                <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl py-2 px-3 flex items-center justify-center gap-2">
                  <span>💡 कृपया आगे बढ़ने के लिए ऊपर दिए गए नियमों पर सहमति टिक करें।</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!termsAgreed || isSigningIn}
                className={`w-full py-3.5 px-5 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-2xl transition-all border ${
                  termsAgreed
                    ? 'bg-white hover:bg-slate-100 text-slate-900 cursor-pointer hover:scale-[1.02] active:scale-[0.98] border-slate-300 shadow-white/10'
                    : 'bg-slate-800/80 text-slate-500 border-slate-700 cursor-not-allowed opacity-50'
                }`}
              >
                {isSigningIn ? (
                  <RotateCw className="w-5 h-5 animate-spin text-[#E21A25]" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>Google से जारी रखें (Continue with Google)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const devUser = createDevMasterUser('editor.bnwtv@gmail.com', 'Editor (BNW TV)');
                  setCurrentUser(devUser);
                  setUserProfile({
                    uid: devUser.uid,
                    email: 'editor.bnwtv@gmail.com',
                    displayName: 'Editor (BNW TV)',
                    photoURL: devUser.photoURL || '',
                    role: 'MASTER_ADMIN',
                    channelName: 'AI Newsroom',
                    channelLogo: customLogoUrl || '/Logo.png',
                    district: 'मध्य प्रदेश',
                    facebookConnected: true,
                    youtubeConnected: true,
                    instagramConnected: true,
                    twitterConnected: true,
                    linkedinConnected: true,
                    status: 'active'
                  });
                  try {
                    localStorage.setItem(
                      'bnw_active_session_user',
                      JSON.stringify({
                        uid: devUser.uid,
                        email: devUser.email,
                        displayName: devUser.displayName,
                        photoURL: devUser.photoURL,
                        role: 'MASTER_ADMIN'
                      })
                    );
                  } catch {}
                  showToast('मास्टर एडमिन लॉगिन सफल: editor.bnwtv@gmail.com');
                }}
                disabled={!termsAgreed}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                  termsAgreed
                    ? 'bg-gradient-to-r from-amber-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 text-amber-300 hover:text-white border-amber-500/40 cursor-pointer shadow-lg'
                    : 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                }`}
              >
                <Crown className="w-4 h-4 text-[#FFED00]" />
                <span>मास्टर एडमिन डायरेक्ट प्रवेश (editor.bnwtv@gmail.com)</span>
              </button>

              <button
                type="button"
                onClick={() => setGuestAccessGranted(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-all cursor-pointer"
              >
                डेमो / गेस्ट मोड में प्रवेश करें (Guest Mode Preview)
              </button>

              <p className="text-[10px] text-slate-400 leading-snug">
                🔒 मास्टर एडमिन सीधे अपने सुपर कंसोल में प्रवेश करेंगे। नए मीडिया पार्टनर्स Google लॉगिन के बाद अपना चैनल नाम, लोगो और सोशल अकाउंट्स सेटअप कर सकेंगे।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOP HEADER (BRAND + QUICK ACTIONS) ================= */}
      <header className="sticky top-0 z-40 bg-[#0F131D]/95 backdrop-blur-md border-b border-[#232B3E] shadow-xl">
        <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Brand & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white bg-slate-800/80 rounded-lg cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Official Breaking News Wala 100% Original Logo (PNG, NOT AI-generated) */}
              <div 
                className="flex items-center gap-2 group relative"
                title="ब्रेकिंग न्यूज वाला (100% ओरिजिनल लोगो)"
              >
                <div 
                  onClick={() => setActiveView('generatorQueue')} 
                  className="cursor-pointer"
                >
                  <img
                    src={customLogoUrl}
                    onError={(e) => {
                      if (!e.currentTarget.src.includes('logo.png')) {
                        e.currentTarget.src = '/logo.png';
                      }
                    }}
                    alt="ब्रेकिंग न्यूजवाला 100% ओरिजिनल लोगो"
                    className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(255,235,0,0.35)]"
                  />
                </div>

                {/* Always-accessible Logo Change / Upload Control */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <label
                    htmlFor="header-logo-upload-input"
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-800/90 hover:bg-[#E21A25] text-amber-300 hover:text-white border border-amber-500/40 hover:border-red-500 shadow-sm transition-all cursor-pointer select-none group/upload shrink-0"
                    title="चैनल या न्यूज़ रूम का लोगो बदलें (Change Logo)"
                  >
                    <Upload className="w-3 h-3 text-[#FFED00] group-hover/upload:scale-110 transition-transform" />
                    <span className="hidden sm:inline">लोगो बदलें</span>
                    <span className="sm:hidden">लोगो</span>
                  </label>
                  {customLogoUrl !== '/Logo.png' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomLogoUrl('/Logo.png');
                        localStorage.setItem('custom_original_logo', '/Logo.png');
                        if (currentUser?.uid) {
                          updateUserProfile(currentUser.uid, { channelLogo: '/Logo.png' }).catch(console.error);
                        }
                        showToast('डिफ़ॉल्ट AI न्यूज़ रूम लोगो रीसेट किया गया');
                      }}
                      className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-[#FFED00] border border-slate-700 text-[10px] cursor-pointer"
                      title="डिफ़ॉल्ट AI Newsroom लोगो रीसेट करें"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <input
                  id="header-logo-upload-input"
                  type="file"
                  accept="image/png,image/*"
                  className="hidden"
                  onChange={handleUploadOriginalLogo}
                />
              </div>

              {/* Control Room & Subtitle balanced layout */}
              <div className="border-l border-slate-700/80 pl-2.5 sm:pl-3 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-[#FFED00] font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1.5 border border-[#FFED00]/30 ring-1 ring-red-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFED00] pulse-live"></span>
                    कंट्रोल रूम
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 font-bold uppercase hidden md:inline">
                    BROADCAST COMMAND
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium tracking-tight mt-0.5">
                  AI-Powered News-to-Graphic & Multi-Channel Syndicated Hub
                </p>
              </div>
            </div>
          </div>

          {/* Quick Status & Header Actions (Neat and Clean Header) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Health Status Pill */}
            <button
              onClick={() => setActiveView('healthCheck')}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] text-emerald-400 font-medium transition-all cursor-pointer"
              title="क्लिक करके लाइव हेल्थ चेक ग्रिड देखें"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-live"></span>
              <span>6/6 एक्टिव</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-mono font-bold px-1.5 py-0.2 rounded">
                {averageLatency}ms
              </span>
            </button>

            {/* Notification Ring & Alerts Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                  showNotifications
                    ? 'bg-red-600/30 text-[#FFED00] border border-red-500/60 shadow-[0_0_16px_rgba(226,26,37,0.55)]'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/70'
                }`}
                title="लाइव नोटिफिकेशन अलर्ट्स व रिंग"
              >
                {/* Bell Icon with dynamic pulse ring */}
                <BellRing className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                  unreadNotifCount > 0 ? 'text-[#FFED00] animate-bounce' : 'text-slate-400'
                }`} />

                {/* Animated Ring Indicator & Counter Badge */}
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#E21A25] border-2 border-[#0F131D] text-[9px] font-black text-white items-center justify-center shadow-lg">
                      {unreadNotifCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notification Popover Ring Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0E121B] border-2 border-red-500/40 rounded-2xl shadow-2xl shadow-black/95 z-50 overflow-hidden backdrop-blur-2xl">
                  {/* Top Bar of Notification Center */}
                  <div className="bg-gradient-to-r from-[#1B0609] via-[#2A0A10] to-[#120407] px-4 py-3 border-b border-red-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#E21A25]/30 text-[#FFED00] border border-[#E21A25]/50">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>नोटिफिकेशन रिंग व अलर्ट्स</span>
                          {unreadNotifCount > 0 && (
                            <span className="bg-[#E21A25] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                              {unreadNotifCount} नए
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">लाइव ब्रॉडकास्ट व ऑटोमेशन अपडेट्स</p>
                      </div>
                    </div>

                    {unreadNotifCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] font-bold text-amber-300 hover:text-white hover:underline cursor-pointer"
                      >
                        सभी पढ़े
                      </button>
                    )}
                  </div>

                  {/* Notification Items List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#1D2536] text-xs">
                    {notificationsList.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          setActiveView(notif.actionView as any);
                          setShowNotifications(false);
                          setNotificationsList(prev =>
                            prev.map(n => (n.id === notif.id ? { ...n, unread: false } : n))
                          );
                        }}
                        className={`p-3 transition-colors cursor-pointer flex items-start gap-3 hover:bg-slate-800/60 ${
                          notif.unread ? 'bg-red-950/20' : 'bg-transparent'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {notif.category === 'BREAKING' && (
                            <span className="w-2 h-2 rounded-full bg-red-500 block pulse-live"></span>
                          )}
                          {notif.category === 'DISTRIBUTION' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 block"></span>
                          )}
                          {notif.category === 'VIRAL' && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 block"></span>
                          )}
                          {notif.category === 'HEALTH' && (
                            <span className="w-2 h-2 rounded-full bg-blue-400 block"></span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{notif.title}</span>
                            <span className="text-[10px] text-slate-400">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{notif.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Action */}
                  <div className="p-2.5 bg-[#090C13] border-t border-[#1C2436] flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      ऑटोपायलट रिंग ऑन
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-300 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer text-[10px]"
                    >
                      बंद करें
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Multi-User Role Badge */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-700/80">
                {/* User Avatar */}
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => userProfile?.role === 'MASTER_ADMIN' ? setActiveView('masterAdminConsole') : setShowChannelSettingsModal(true)}
                  title={userProfile?.role === 'MASTER_ADMIN' ? 'मास्टर एडमिन कंसोल खोलें' : 'चैनल प्रोफाइल सेटिंग्स खोलें'}
                >
                  <img
                    src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt="user"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-amber-400/80 shadow"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0F131D]"></span>
                </div>

                {/* Role and Name Pill */}
                <div className="hidden md:flex flex-col">
                  <div className="flex items-center gap-1.5">
                    {userProfile?.role === 'MASTER_ADMIN' ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow">
                        <Crown className="w-2.5 h-2.5" />
                        मास्टर एडमिन
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-blue-600/40 text-cyan-300 border border-blue-500/40">
                        <Building2 className="w-2.5 h-2.5 text-cyan-400" />
                        चैनल एडमिन
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 max-w-[120px] truncate leading-tight">
                    {userProfile?.channelName || currentUser.displayName || 'Newsroom Admin'}
                  </span>
                </div>

                {/* Channel Settings Button for Sub-Admins */}
                {userProfile?.role === 'CHANNEL_ADMIN' && (
                  <button
                    onClick={() => setShowChannelSettingsModal(true)}
                    className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-cyan-300 border border-blue-500/40 text-[10px] cursor-pointer"
                    title="चैनल प्रोफाइल व सोशल मीडिया सेटिंग्स"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-600/80 text-slate-400 hover:text-white border border-slate-700 hover:border-red-500 transition-all cursor-pointer"
                  title="लॉगआउट करें (Sign Out)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E21A25] to-[#B70F18] hover:from-red-600 hover:to-red-700 text-white font-bold text-xs shadow-lg shadow-red-900/40 border border-red-400/50 cursor-pointer active:scale-95 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-[#FFED00]" />
                <span>Google लॉगिन</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= PRIMARY BROADCAST TOP NAVIGATION MENU ================= */}
        {/* Single-line sleek broadcast menu with Left/Right smooth scroll buttons and zero text wrapping */}
        <div className="hidden lg:flex items-center justify-between px-2 sm:px-4 md:px-6 bg-[#080B12]/95 backdrop-blur-2xl border-t border-[#1A2234] border-b border-[#1A2234]/80 text-xs shadow-2xl relative w-full">
          {/* Subtle top red glow line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E21A25]/50 to-transparent"></div>

          {/* Left Scroll Navigation Button */}
          <button
            type="button"
            onClick={() => scrollNav('left')}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-[#E21A25] text-slate-300 hover:text-white border border-slate-700/80 shadow-md transition-all cursor-pointer shrink-0 z-10 mr-1.5 flex items-center justify-center hover:scale-105 active:scale-95"
            title="बाएं स्क्रॉल करें (Scroll Left)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Horizontal Scrollable Tabs Container in Strict Single Line */}
          <div
            ref={navTabsRef}
            className="flex items-center gap-2 py-2 overflow-x-auto scroll-smooth no-scrollbar flex-1 whitespace-nowrap select-none"
          >
            {/* 0. Smart News Feed Hub (Phase 3) */}
            <button
              onClick={() => setActiveView('newsFeedHub')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'newsFeedHub'
                  ? 'bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-white shadow-[0_0_20px_rgba(226,26,37,0.45)] border border-red-500/70 ring-1 ring-[#FFED00]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/70'
              }`}
            >
              <Radio className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeView === 'newsFeedHub' ? 'text-[#FFED00]' : 'text-emerald-400 group-hover:text-[#FFED00]'}`} />
              <span className="whitespace-nowrap tracking-tight">📰 स्मार्ट न्यूज़ फीड</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow shrink-0 ${
                activeView === 'newsFeedHub'
                  ? 'bg-[#FFED00] text-slate-950'
                  : 'bg-emerald-600/40 text-emerald-300 border border-emerald-500/40'
              }`}>
                लाइव 18+
              </span>
            </button>

            {/* 1. Generator Queue (Phase 6) */}
            <button
              onClick={() => setActiveView('generatorQueue')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'generatorQueue'
                  ? 'bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-white shadow-[0_0_20px_rgba(226,26,37,0.45)] border border-red-500/70 ring-1 ring-[#FFED00]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/70'
              }`}
            >
              <Newspaper className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeView === 'generatorQueue' ? 'text-[#FFED00]' : 'text-slate-400 group-hover:text-[#FFED00]'}`} />
              <span className="whitespace-nowrap tracking-tight">🎨 4:5 ग्राफिक स्टूडियो</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow shrink-0 ${
                activeView === 'generatorQueue'
                  ? 'bg-[#FFED00] text-slate-950'
                  : 'bg-[#E21A25] text-white ring-1 ring-red-400/50'
              }`}>
                फेज 6 ({pendingCount})
              </span>
            </button>

            {/* 2. Video Studio (Phase 6) */}
            <button
              onClick={() => setActiveView('videoStudio')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'videoStudio'
                  ? 'bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-white shadow-[0_0_20px_rgba(226,26,37,0.45)] border border-red-500/70 ring-1 ring-[#FFED00]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/70'
              }`}
            >
              <Clapperboard className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeView === 'videoStudio' ? 'text-[#FFED00]' : 'text-slate-400 group-hover:text-[#FFED00]'}`} />
              <span className="whitespace-nowrap tracking-tight">🎬 AI वीडियो स्टूडियो</span>
              <span className="whitespace-nowrap text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-black border border-amber-500/30 shrink-0">
                फेज 6 (AI SEO)
              </span>
            </button>

            {/* 3. Distribution Hub */}
            <button
              onClick={() => setActiveView('distributionHub')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'distributionHub'
                  ? 'bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-white shadow-[0_0_20px_rgba(226,26,37,0.45)] border border-red-500/70 ring-1 ring-[#FFED00]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/70'
              }`}
            >
              <Share2 className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeView === 'distributionHub' ? 'text-[#FFED00]' : 'text-slate-400 group-hover:text-emerald-400'}`} />
              <span className="whitespace-nowrap tracking-tight">ब्रॉडकास्ट व शेयरिंग</span>
              <span className="whitespace-nowrap text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30 shrink-0">
                WA/TG
              </span>
            </button>

            {/* 4. Viral Radar */}
            <button
              onClick={() => setActiveView('viralRadar')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'viralRadar'
                  ? 'bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-white shadow-[0_0_20px_rgba(226,26,37,0.45)] border border-red-500/70 ring-1 ring-[#FFED00]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/70'
              }`}
            >
              <Flame className="w-4 h-4 shrink-0 text-orange-400 transition-transform group-hover:scale-110" />
              <span className="whitespace-nowrap tracking-tight">ट्रेंडिंग व वायरल खबर</span>
            </button>

            {/* 5. Analytics View */}
            <button
              onClick={() => setActiveView('analyticsView')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'analyticsView'
                  ? 'bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-white shadow-[0_0_20px_rgba(226,26,37,0.45)] border border-red-500/70 ring-1 ring-[#FFED00]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/70'
              }`}
            >
              <TrendingUp className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeView === 'analyticsView' ? 'text-[#FFED00]' : 'text-slate-400 group-hover:text-[#FFED00]'}`} />
              <span className="whitespace-nowrap tracking-tight">रीच व 30D ग्रोथ</span>
            </button>

            {/* 6. Health Check */}
            <button
              onClick={() => setActiveView('healthCheck')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'healthCheck'
                  ? 'bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-white shadow-[0_0_20px_rgba(226,26,37,0.45)] border border-red-500/70 ring-1 ring-[#FFED00]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/70'
              }`}
            >
              <Activity className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeView === 'healthCheck' ? 'text-[#FFED00]' : 'text-emerald-400'}`} />
              <span className="whitespace-nowrap tracking-tight">हेल्थ चेक</span>
              <span className="whitespace-nowrap text-[10px] bg-emerald-500/25 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold border border-emerald-500/40 shrink-0">
                {averageLatency}ms
              </span>
            </button>

            {/* 7. Automation & Scheduling Hub (Phase 4) */}
            <button
              onClick={() => setActiveView('accountsConfig')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'accountsConfig'
                  ? 'bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-white shadow-[0_0_20px_rgba(226,26,37,0.45)] border border-red-500/70 ring-1 ring-[#FFED00]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/70'
              }`}
            >
              <Zap className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeView === 'accountsConfig' ? 'text-[#FFED00]' : 'text-amber-400'}`} />
              <span className="whitespace-nowrap tracking-tight">⚡ ऑटोमेशन व शेड्यूलिंग</span>
              <span className="whitespace-nowrap text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold border border-amber-500/30 shrink-0">
                फेज 4
              </span>
            </button>

            {/* 8. API Hub */}
            <button
              onClick={() => setActiveView('apiHub')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'apiHub'
                  ? 'bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-white shadow-[0_0_20px_rgba(226,26,37,0.45)] border border-red-500/70 ring-1 ring-[#FFED00]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/70'
              }`}
            >
              <KeyRound className="w-4 h-4 shrink-0 text-[#FFED00] transition-transform group-hover:scale-110" />
              <span className="whitespace-nowrap tracking-tight">🔑 API कीज</span>
              <span className="whitespace-nowrap text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30 shrink-0">
                6 APIs
              </span>
            </button>

            {/* 9. Master Admin Super Console (Phase 5) */}
            <button
              onClick={() => setActiveView('masterAdminConsole')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'masterAdminConsole'
                  ? 'bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-400 ring-1 ring-[#FFED00]'
                  : 'text-amber-300 hover:text-white hover:bg-slate-800/80 border border-amber-500/30 hover:border-amber-400/60'
              }`}
            >
              <Crown className="w-4 h-4 shrink-0 text-[#FFED00] transition-transform group-hover:scale-110" />
              <span className="whitespace-nowrap tracking-tight">👑 मास्टर एडमिन</span>
              <span className="whitespace-nowrap text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded shadow shrink-0">
                फेज 5
              </span>
            </button>

            {/* 10. News Source Management (Phase 2) */}
            <button
              onClick={() => setActiveView('newsSourceMgmt')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'newsSourceMgmt'
                  ? 'bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-white shadow-[0_0_20px_rgba(226,26,37,0.45)] border border-red-500/70 ring-1 ring-[#FFED00]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/70'
              }`}
            >
              <Rss className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeView === 'newsSourceMgmt' ? 'text-[#FFED00]' : 'text-orange-400'}`} />
              <span className="whitespace-nowrap tracking-tight">📡 न्यूज़ सोर्स मैनेजमेंट</span>
              <span className="whitespace-nowrap text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.2 rounded font-mono font-bold border border-orange-500/30 shrink-0">
                RSS/वेबलिंक
              </span>
            </button>

            {/* 11. Category & Location Hierarchy (Phase 2) */}
            <button
              onClick={() => setActiveView('categoryLocationMgmt')}
              className={`group whitespace-nowrap shrink-0 relative inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'categoryLocationMgmt'
                  ? 'bg-gradient-to-r from-[#E21A25] via-[#C8121D] to-[#990A13] text-white shadow-[0_0_20px_rgba(226,26,37,0.45)] border border-red-500/70 ring-1 ring-[#FFED00]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/70'
              }`}
            >
              <Layers className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeView === 'categoryLocationMgmt' ? 'text-[#FFED00]' : 'text-purple-400'}`} />
              <span className="whitespace-nowrap tracking-tight">🗺️ कैटेगरी व लोकेशन</span>
              <span className="whitespace-nowrap text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono font-bold border border-purple-500/30 shrink-0">
                15+ श्रेणियां / 52 जिले
              </span>
            </button>
          </div>

          {/* Right Scroll Navigation Button */}
          <button
            type="button"
            onClick={() => scrollNav('right')}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-[#E21A25] text-slate-300 hover:text-white border border-slate-700/80 shadow-md transition-all cursor-pointer shrink-0 z-10 ml-1.5 flex items-center justify-center hover:scale-105 active:scale-95"
            title="दाएं स्क्रॉल करें (Scroll Right)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick Stats right in top bar */}
          <div className="hidden xl:flex items-center gap-2.5 text-[11px] text-slate-400 pl-4 border-l border-slate-800 shrink-0">
            <span className="whitespace-nowrap flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-800/80 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-live"></span>
              FB पेजेस: <strong className="text-white font-mono">12</strong>
            </span>
            <span className="whitespace-nowrap flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-800/80 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-live"></span>
              WA: <strong className="text-white font-mono">142K</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Continuous Scrolling Breaking News Alert Ticker */}
        <div className="bg-gradient-to-r from-[#B70F18] via-[#D0121C] to-[#8F0C13] text-white text-xs font-semibold px-2 sm:px-4 py-1.5 flex items-center overflow-hidden border-t border-red-900/60 shadow-inner relative select-none">
          {/* Live Alert Fixed Badge - Desktop: Full badge; Mobile: Icon only so 95%+ width is dedicated to readable ticker */}
          <div className="hidden sm:flex items-center gap-1.5 z-10 shrink-0 bg-[#FFED00] text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded shadow mr-2 uppercase tracking-wide border border-yellow-300">
            <Radio className="w-3 h-3 text-red-600 animate-pulse fill-current" />
            <span>लाइव अलर्ट</span>
            <span className="bg-red-600 text-white text-[8px] font-bold px-1 rounded ml-0.5">
              FEED {tickerFeedIndex + 1}/{tickerNewsList.length}
            </span>
          </div>

          <div
            className="sm:hidden flex items-center justify-center z-10 shrink-0 bg-[#FFED00] text-red-600 p-1 rounded-md shadow mr-1.5 border border-yellow-300"
            title="लाइव अलर्ट फीड"
          >
            <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse fill-current" />
          </div>

          {/* Continuous Scrolling Marquee Feed */}
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-marquee flex items-center gap-8 py-0.5">
              {/* Repeated twice for infinite seamless marquee loop */}
              {[...tickerNewsList, ...tickerNewsList].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs text-white/95 shrink-0">
                  <span className="bg-slate-950/70 text-[#FFED00] px-1.5 py-0.2 rounded font-black text-[10px] border border-yellow-400/30">
                    {item.district}
                  </span>
                  <span className="font-medium tracking-tight">
                    {item.text}
                  </span>
                  <span className="text-yellow-300 text-[10px] font-bold bg-red-950/60 px-1 py-0.2 rounded">
                    #{item.tag}
                  </span>
                  <span className="text-[#FFED00]/60 font-black text-sm ml-2">◆</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feed Manual Cycler / Ticker Controller */}
          <button
            onClick={() => setTickerFeedIndex(prev => (prev + 1) % tickerNewsList.length)}
            className="z-10 ml-2 shrink-0 bg-red-950/80 hover:bg-black text-[#FFED00] hover:text-white px-2 py-0.5 rounded border border-red-700/60 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow"
            title="ताज़ा फीड बदलें"
          >
            <RefreshCw className="w-2.5 h-2.5 hover:rotate-180 transition-transform duration-300" />
            <span className="hidden sm:inline">फीड बदलें</span>
          </button>
        </div>
      </header>

      {/* ================= MOBILE DRAWER MENU ================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#232B3E]">
            <span className="font-extrabold text-white text-base">कंट्रोल रूम मेन्यू</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-4 text-sm font-semibold">
            <button
              onClick={() => {
                setActiveView('newsFeedHub');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-600/30 to-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-left"
            >
              <Radio className="w-5 h-5 text-[#FFED00]" />
              <span>📰 स्मार्ट न्यूज़ फीड (लाइव 18+)</span>
            </button>
            <button
              onClick={() => {
                setActiveView('generatorQueue');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-left"
            >
              <Newspaper className="w-5 h-5 text-[#E21A25]" />
              <span>ऑटो-ग्राफिक व क्यू ({pendingCount})</span>
            </button>
            <button
              onClick={() => {
                setActiveView('videoStudio');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-left"
            >
              <Clapperboard className="w-5 h-5 text-[#FFED00]" />
              <span>मास्टर वीडियो स्टूडियो (AI SEO)</span>
            </button>
            <button
              onClick={() => {
                setActiveView('distributionHub');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-left"
            >
              <Share2 className="w-5 h-5 text-emerald-400" />
              <span>ब्रॉडकास्ट व शेयरिंग</span>
            </button>
            <button
              onClick={() => {
                setActiveView('viralRadar');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-left"
            >
              <Flame className="w-5 h-5 text-orange-400" />
              <span>ट्रेंडिंग व वायरल खबर</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowChannelSettingsModal(true);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-left"
            >
              <UserIcon className="w-5 h-5 text-[#FFED00]" />
              <span>👤 मेरी प्रोफाइल व सेटिंग्स</span>
            </button>
            <button
              onClick={() => {
                setActiveView('healthCheck');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-left"
            >
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>हेल्थ चेक व पिंग लेटेंसी ({averageLatency}ms)</span>
            </button>
            <button
              onClick={() => {
                setActiveView('apiHub');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#E21A25]/20 border border-[#E21A25]/40 text-white text-left"
            >
              <KeyRound className="w-5 h-5 text-[#FFED00]" />
              <span>🔑 API की व चैनल सेटिंग्स</span>
            </button>
            <button
              onClick={() => {
                setActiveView('analyticsView');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-left"
            >
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>सोशल रीच व ग्रोथ</span>
            </button>
            <button
              onClick={() => {
                setActiveView('accountsConfig');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-600/30 to-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-left"
            >
              <Zap className="w-5 h-5 text-[#FFED00]" />
              <span>⚡ ऑटोमेशन व शेड्यूलिंग (फेज 4)</span>
            </button>
            <button
              onClick={() => {
                setActiveView('newsSourceMgmt');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 font-bold text-left"
            >
              <Rss className="w-5 h-5 text-orange-400" />
              <span>📡 न्यूज़ सोर्स मैनेजमेंट (RSS/Web)</span>
            </button>
            <button
              onClick={() => {
                setActiveView('categoryLocationMgmt');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-left"
            >
              <Layers className="w-5 h-5 text-purple-400" />
              <span>🗺️ कैटेगरी व लोकेशन मैनेजमेंट</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleInstallApp();
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#E21A25]/30 to-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-left"
            >
              <Download className="w-5 h-5 text-[#FFED00]" />
              <span>📲 वेब ऐप डाउनलोड करें (PWA)</span>
            </button>
          </div>
        </div>
      )}



      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 overflow-y-auto pb-32 lg:pb-12 p-3 sm:p-6 bg-[#080A0F]">
        {/* ================= SECTION: SMART NEWS FEED HUB (PHASE 3) ================= */}
        {activeView === 'newsFeedHub' && (
          <NewsFeedHub
            onShowToast={showToast}
            onGenerateGraphic={handleFeedGenerateGraphic}
            onSendToVideoStudio={handleFeedSendToVideoStudio}
            userDistrict={userProfile?.district}
            userRole={userProfile?.role}
          />
        )}

        {/* ================= SECTION: NEWS SOURCE MANAGEMENT (PHASE 2) ================= */}
        {activeView === 'newsSourceMgmt' && (
          <NewsSourceManagement onShowToast={showToast} />
        )}

        {/* ================= SECTION: CATEGORY & LOCATION MANAGEMENT (PHASE 2) ================= */}
        {activeView === 'categoryLocationMgmt' && (
          <CategoryLocationManagement onShowToast={showToast} />
        )}

        {/* ================= SECTION: HEALTH CHECK (REAL-TIME PING LATENCY GRID) ================= */}
        {activeView === 'healthCheck' && (
          <section className="space-y-6 max-w-6xl mx-auto">
            {/* Top Diagnostic Banner */}
            <div className="bg-[#121622] p-5 sm:p-6 rounded-2xl border-2 border-[#E21A25]/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 pulse-live"></span>
                    <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                      <Activity className="w-6 h-6 text-[#FFED00]" />
                      रीयल-टाइम API लेटेंसी व हेल्थ चेक डैशबोर्ड
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    सभी 6 कनेक्टेड सोशल मीडिया व AI APIs (Meta, WhatsApp, Telegram, YouTube, X, Gemini AI) का राउंड-ट्रिप टाइम (RTT लेटेंसी), HTTP 200 स्टेटस और रेट-लिमिट कंजम्पशन मॉनिटर।
                  </p>
                </div>

                {/* Diagnostic Controls */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-2 bg-slate-900/90 border border-[#232B3E] px-3 py-1.5 rounded-xl text-xs">
                    <span className="text-slate-400">ऑटो-रिफ्रेश:</span>
                    <button
                      onClick={() => setAutoPingEnabled(!autoPingEnabled)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                        autoPingEnabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {autoPingEnabled ? `लाइव (${pingCountdown}s)` : 'पॉज़्ड'}
                    </button>
                  </div>

                  <button
                    onClick={pingAllServicesNow}
                    disabled={isPingingAll}
                    className="bg-[#E21A25] hover:bg-[#B70F18] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-[#E21A25]/40 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-[#FFED00] ${isPingingAll ? 'animate-spin' : ''}`} />
                    <span>{isPingingAll ? 'पिंग जारी है...' : '⚡ सभी 6 सर्विस पिंग करें'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E]">
                <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>औसत लेटेंसी (Avg RTT)</span>
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-baseline gap-1.5">
                  <span className="text-emerald-400 font-mono">{averageLatency}</span>
                  <span className="text-xs text-slate-400 font-normal">ms</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  अल्ट्रा-फास्ट हैंडशेक (&lt;150ms)
                </div>
              </div>

              <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E]">
                <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>सिस्टम उपलब्धता (Uptime)</span>
                  <Server className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-baseline gap-1.5">
                  <span className="text-white font-mono">99.98%</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  0% पैकेट लॉस (6/6 200 OK)
                </div>
              </div>

              <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E]">
                <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>न्यूनतम लेटेंसी (Fastest)</span>
                  <Wifi className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-baseline gap-1.5">
                  <span className="text-sky-400 font-mono">46</span>
                  <span className="text-xs text-slate-400 font-normal">ms</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-300 mt-1 truncate">
                  Telegram Bot HTTP Endpoint
                </div>
              </div>

              <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E]">
                <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>दैनिक सिंडिकेशन कोटा</span>
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-baseline gap-1.5">
                  <span className="text-[#FFED00] font-mono">73.8%</span>
                  <span className="text-xs text-slate-400 font-normal">बचा हुआ</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-300 mt-1">
                  18,450 / 25,000 API कॉल्स
                </div>
              </div>
            </div>

            {/* Color-Coded Latency Legend */}
            <div className="bg-[#121622] p-3 rounded-xl border border-[#232B3E] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFED00]"></span>
                कलर-कोडेड लेटेंसी स्केल:
              </span>
              <div className="flex flex-wrap items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <strong className="text-emerald-400">&lt; 90ms</strong> (अल्ट्रा-फास्ट)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                  <strong className="text-green-300">90 - 150ms</strong> (उत्कृष्ट)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFED00]"></span>
                  <strong className="text-yellow-300">150 - 250ms</strong> (सामान्य)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <strong className="text-red-400">&gt; 250ms</strong> (चेतावनी / धीमा)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                अंतिम चेक: {lastGlobalPingTime.toLocaleTimeString()}
              </span>
            </div>

            {/* 6-Service Color-Coded Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {healthServices.map(srv => {
                // Color coding logic based on latency
                let borderClass = 'border-emerald-500/50 hover:border-emerald-400';
                let glowClass = 'shadow-emerald-500/10';
                let textClass = 'text-emerald-400';
                let badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                let rating = 'अल्ट्रा-फास्ट';

                if (srv.currentLatency < 90) {
                  borderClass = 'border-emerald-500/60 hover:border-emerald-400';
                  glowClass = 'shadow-emerald-500/15';
                  textClass = 'text-emerald-400';
                  badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                  rating = 'अल्ट्रा-फास्ट';
                } else if (srv.currentLatency < 150) {
                  borderClass = 'border-green-500/50 hover:border-green-400';
                  glowClass = 'shadow-green-500/15';
                  textClass = 'text-green-400';
                  badgeClass = 'bg-green-500/20 text-green-300 border-green-500/40';
                  rating = 'उत्कृष्ट रिस्पॉन्स';
                } else if (srv.currentLatency < 250) {
                  borderClass = 'border-amber-500/50 hover:border-amber-400';
                  glowClass = 'shadow-amber-500/15';
                  textClass = 'text-[#FFED00]';
                  badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                  rating = 'सामान्य गति';
                } else {
                  borderClass = 'border-red-500/60 hover:border-red-400';
                  glowClass = 'shadow-red-500/20';
                  textClass = 'text-red-400';
                  badgeClass = 'bg-red-500/20 text-red-300 border-red-500/40';
                  rating = 'धीमा / लेटेंसी अधिक';
                }

                // Calculate sparkline points for SVG
                const minH = Math.min(...srv.history);
                const maxH = Math.max(...srv.history);
                const range = maxH - minH || 1;
                const svgHeight = 40;
                const svgWidth = 140;

                const points = srv.history
                  .map((val, idx) => {
                    const x = (idx / (srv.history.length - 1)) * svgWidth;
                    const y = svgHeight - ((val - minH) / range) * (svgHeight - 10) - 5;
                    return `${x},${y}`;
                  })
                  .join(' ');

                return (
                  <div
                    key={srv.id}
                    className={`bg-[#121622] rounded-2xl border-2 ${borderClass} p-5 space-y-4 shadow-xl ${glowClass} transition-all flex flex-col justify-between`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#232B3E]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-live"></span>
                            <h3 className="font-extrabold text-sm text-white tracking-tight">
                              {srv.name}
                            </h3>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{srv.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                            HTTP {srv.httpStatus} OK
                          </span>
                        </div>
                      </div>

                      {/* Large Latency Display & Sparkline */}
                      <div className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            राउंड-ट्रिप लेटेंसी (RTT):
                          </div>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className={`text-3xl font-black ${textClass} tracking-tight font-mono`}>
                              {srv.currentLatency}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">ms</span>
                          </div>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${badgeClass}`}>
                            {rating}
                          </span>
                        </div>

                        {/* Real SVG Latency Sparkline */}
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] text-slate-400 font-mono mb-1">
                            हिस्ट्री (10 Pings)
                          </span>
                          <div className="w-[140px] h-[40px] bg-slate-950/60 rounded-lg p-1 border border-slate-800 flex items-center justify-center">
                            <svg width="130" height="34" className="overflow-visible">
                              <polyline
                                fill="none"
                                stroke={srv.currentLatency < 150 ? '#10B981' : '#F59E0B'}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={points}
                              />
                            </svg>
                          </div>
                          <div className="flex items-center justify-between w-[140px] text-[8px] text-slate-400 font-mono mt-0.5">
                            <span>min: {minH}ms</span>
                            <span>max: {maxH}ms</span>
                          </div>
                        </div>
                      </div>

                      {/* Technical Specs & Details */}
                      <div className="space-y-2 pt-2 border-t border-[#232B3E] text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">टारगेट एंडपॉइंट:</span>
                          <div className="bg-slate-950/80 px-2 py-1 rounded text-[10px] text-slate-300 font-mono truncate border border-slate-800/80">
                            {srv.endpoint}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-slate-400">रेट लिमिट व कोटा:</span>
                            <span className="text-slate-300 font-mono">{srv.quota}</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${srv.quotaPercent}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>टोकन प्रकार:</span>
                          <span className="text-slate-200 font-semibold">{srv.tokenType}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>वैलिडिटी:</span>
                          <span className="text-emerald-400 font-bold">{srv.tokenExpiry}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <div className="pt-3 border-t border-[#232B3E] flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>सक्रिय हैंडशेक</span>
                      </span>
                      <button
                        onClick={() => pingSingleService(srv.id, srv.name)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCw className="w-3 h-3 text-[#FFED00]" />
                        <span>री-टेस्ट पिंग</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Diagnostics Log Output Terminal */}
            <div className="bg-[#121622] rounded-2xl border border-[#232B3E] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FFED00]" />
                  लाइव नेटवर्क हैंडशेक स्ट्रीम (Live Diagnostic Packet Log)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  SOCKET STREAM: ACTIVE
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 max-h-40 overflow-y-auto leading-relaxed">
                <div className="text-emerald-400">[08:06:01] PING meta.graph.facebook.com:443 - TLS 1.3 - HTTP/2 200 OK (84ms) - scope: pages_manage_posts</div>
                <div className="text-emerald-400">[08:06:01] PING whatsapp.cloud.facebook.com:443 - TLS 1.3 - HTTP/2 200 OK (62ms) - session: WABA_OK</div>
                <div className="text-sky-400">[08:06:01] PING api.telegram.org:443 - TLS 1.3 - HTTP/2 200 OK (46ms) - bot: @breakingnewswala</div>
                <div className="text-green-400">[08:06:01] PING youtube.googleapis.com:443 - TLS 1.3 - HTTP/2 200 OK (128ms) - quota: 16% used</div>
                <div className="text-green-400">[08:06:01] PING api.twitter.com/2/tweets:443 - TLS 1.3 - HTTP/2 200 OK (104ms) - rate: 85/300</div>
                <div className="text-amber-400">[08:06:01] PING generativelanguage.googleapis.com:443 - TLS 1.3 - HTTP/2 200 OK (142ms) - model: gemini-2.5-flash</div>
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 0: API KEYS & CHANNELS HUB (USER EMPHASIZED) ================= */}
        {activeView === 'apiHub' && (
          <section className="space-y-6 max-w-6xl mx-auto">
            {/* Quick Link to Health Check */}
            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  <Activity className="w-5 h-5 text-emerald-400 pulse-live" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    लाइव API पिंग लेटेंसी मैट्रिक्स (Health Check)
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                      औसत {averageLatency}ms
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    सभी 6 सर्विसों के रियल-टाइम पिंग, लेटेंसी स्पार्कलाइन और कनेक्शन स्टेटस की जांच करें।
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('healthCheck')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0 shadow transition-all cursor-pointer"
              >
                <span>हेल्थ चेक खोलें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#121622] p-5 sm:p-6 rounded-2xl border-2 border-[#E21A25]/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#E21A25]/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FFED00] pulse-live"></span>
                    <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                      <KeyRound className="w-6 h-6 text-[#FFED00]" />
                      प्राथमिक एडमिन मेन्यू: API की व सोशल चैनल्स कनेक्शन
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    यहाँ आप WhatsApp, Facebook Pages, Instagram, Telegram Bot, YouTube और X (Twitter) की API Keys दर्ज कर सकते हैं।
                    आपका न्यूजरूम ऑटोपायलट इंजन सीधे इन क्रेडेंशियल्स से कनेक्ट होकर 1-क्लिक में लाइव पब्लिश करेगा।
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleSaveApiKeys}
                    className="bg-[#E21A25] hover:bg-[#B70F18] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#E21A25]/40 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#FFED00]" />
                    <span>सभी API की सेव करें</span>
                  </button>
                </div>
              </div>
            </div>

            {/* API Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. Meta Graph API (FB Pages & Instagram) */}
              <div className="bg-[#121622] rounded-2xl border border-[#232B3E] p-5 space-y-4 shadow-lg hover:border-blue-500/50 transition-all">
                <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black">
                      FB
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Meta Graph API (Facebook & Insta)</h3>
                      <p className="text-[10px] text-slate-400">12 डिस्ट्रिक्ट पेजेस + Instagram Reels Upload</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      🟢 कनेक्टेड
                    </span>
                    <button
                      onClick={() => testApiConnection('meta', 'Meta Graph API')}
                      disabled={testingService === 'meta'}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {testingService === 'meta' ? <RotateCw className="w-3 h-3 animate-spin" /> : 'टेस्ट पिंग'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Meta App ID:</label>
                    <input
                      type="text"
                      value={apiKeys.metaAppId}
                      onChange={e => setApiKeys({ ...apiKeys, metaAppId: e.target.value })}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Meta App Secret:</label>
                    <div className="relative">
                      <input
                        type={showKeySecret['metaSecret'] ? 'text' : 'password'}
                        value={apiKeys.metaAppSecret}
                        onChange={e => setApiKeys({ ...apiKeys, metaAppSecret: e.target.value })}
                        className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 pr-8 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeySecret(prev => ({ ...prev, metaSecret: !prev['metaSecret'] }))}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showKeySecret['metaSecret'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Page Access Token (Permanent System User Token):</label>
                    <div className="relative">
                      <input
                        type={showKeySecret['metaToken'] ? 'text' : 'password'}
                        value={apiKeys.metaPageToken}
                        onChange={e => setApiKeys({ ...apiKeys, metaPageToken: e.target.value })}
                        className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 pr-8 text-xs text-white font-mono focus:outline-none focus:border-[#E21A25]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeySecret(prev => ({ ...prev, metaToken: !prev['metaToken'] }))}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showKeySecret['metaToken'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 text-[10px] block mb-0.5">मास्टर FB पेज ID:</label>
                      <input
                        type="text"
                        value={apiKeys.metaPageId}
                        onChange={e => setApiKeys({ ...apiKeys, metaPageId: e.target.value })}
                        className="w-full bg-slate-900 border border-[#232B3E] rounded-lg p-2 text-[11px] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-[10px] block mb-0.5">Insta Business ID:</label>
                      <input
                        type="text"
                        value={apiKeys.metaInstaId}
                        onChange={e => setApiKeys({ ...apiKeys, metaInstaId: e.target.value })}
                        className="w-full bg-slate-900 border border-[#232B3E] rounded-lg p-2 text-[11px] text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. WhatsApp Business Cloud API */}
              <div className="bg-[#121622] rounded-2xl border border-[#232B3E] p-5 space-y-4 shadow-lg hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-black">
                      WA
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">WhatsApp Business Cloud API</h3>
                      <p className="text-[10px] text-slate-400">ऑफिशियल चैनल ब्रॉडकास्ट व ग्रुप ऑटो-फॉरवर्ड</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      🟢 एक्टिव
                    </span>
                    <button
                      onClick={() => testApiConnection('whatsapp', 'WhatsApp Cloud API')}
                      disabled={testingService === 'whatsapp'}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {testingService === 'whatsapp' ? <RotateCw className="w-3 h-3 animate-spin" /> : 'टेस्ट पिंग'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Phone Number ID:</label>
                    <input
                      type="text"
                      value={apiKeys.waPhoneNumberId}
                      onChange={e => setApiKeys({ ...apiKeys, waPhoneNumberId: e.target.value })}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">WhatsApp Business Account ID (WABA ID):</label>
                    <input
                      type="text"
                      value={apiKeys.waBusinessAccountId}
                      onChange={e => setApiKeys({ ...apiKeys, waBusinessAccountId: e.target.value })}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Cloud API Permanent Access Token:</label>
                    <div className="relative">
                      <input
                        type={showKeySecret['waToken'] ? 'text' : 'password'}
                        value={apiKeys.waAccessToken}
                        onChange={e => setApiKeys({ ...apiKeys, waAccessToken: e.target.value })}
                        className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 pr-8 text-xs text-white font-mono focus:outline-none focus:border-[#E21A25]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeySecret(prev => ({ ...prev, waToken: !prev['waToken'] }))}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showKeySecret['waToken'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Telegram Bot API */}
              <div className="bg-[#121622] rounded-2xl border border-[#232B3E] p-5 space-y-4 shadow-lg hover:border-sky-500/50 transition-all">
                <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-black">
                      TG
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Telegram Bot API</h3>
                      <p className="text-[10px] text-slate-400">@BotFather टोकन व ऑटो-न्यूज चैनल ब्रॉडकास्ट</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      🟢 कनेक्टेड
                    </span>
                    <button
                      onClick={() => testApiConnection('telegram', 'Telegram Bot API')}
                      disabled={testingService === 'telegram'}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {testingService === 'telegram' ? <RotateCw className="w-3 h-3 animate-spin" /> : 'टेस्ट अलर्ट'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Bot Token (उदा: 123456789:AAHX...):</label>
                    <div className="relative">
                      <input
                        type={showKeySecret['tgToken'] ? 'text' : 'password'}
                        value={apiKeys.tgBotToken}
                        onChange={e => setApiKeys({ ...apiKeys, tgBotToken: e.target.value })}
                        className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 pr-8 text-xs text-white font-mono focus:outline-none focus:border-[#E21A25]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeySecret(prev => ({ ...prev, tgToken: !prev['tgToken'] }))}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showKeySecret['tgToken'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Target Channel Username / Chat ID:</label>
                    <input
                      type="text"
                      value={apiKeys.tgChannelId}
                      onChange={e => setApiKeys({ ...apiKeys, tgChannelId: e.target.value })}
                      placeholder="@breakingnewswala"
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. YouTube Data API v3 */}
              <div className="bg-[#121622] rounded-2xl border border-[#232B3E] p-5 space-y-4 shadow-lg hover:border-red-500/50 transition-all">
                <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-black">
                      YT
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">YouTube Data API v3</h3>
                      <p className="text-[10px] text-slate-400">मास्टर चैनल वीडियो व शॉर्ट्स अपलोड स्कोप</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      🟢 एक्टिव
                    </span>
                    <button
                      onClick={() => testApiConnection('youtube', 'YouTube Data API')}
                      disabled={testingService === 'youtube'}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {testingService === 'youtube' ? <RotateCw className="w-3 h-3 animate-spin" /> : 'टेस्ट पिंग'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Google Cloud API Key:</label>
                    <input
                      type="text"
                      value={apiKeys.ytApiKey}
                      onChange={e => setApiKeys({ ...apiKeys, ytApiKey: e.target.value })}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">OAuth 2.0 Client ID:</label>
                    <input
                      type="text"
                      value={apiKeys.ytClientId}
                      onChange={e => setApiKeys({ ...apiKeys, ytClientId: e.target.value })}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Channel ID (UC...):</label>
                    <input
                      type="text"
                      value={apiKeys.ytChannelId}
                      onChange={e => setApiKeys({ ...apiKeys, ytChannelId: e.target.value })}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                    />
                  </div>
                </div>
              </div>

              {/* 5. X (Twitter) Developer API v2 */}
              <div className="bg-[#121622] rounded-2xl border border-[#232B3E] p-5 space-y-4 shadow-lg hover:border-slate-500 transition-all">
                <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black">
                      X
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">X (Twitter) Developer API v2</h3>
                      <p className="text-[10px] text-slate-400">मीडिया अपलोड व 280-करैक्टर अलर्ट थ्रेड्स</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      🟢 एक्टिव
                    </span>
                    <button
                      onClick={() => testApiConnection('x', 'X API v2')}
                      disabled={testingService === 'x'}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {testingService === 'x' ? <RotateCw className="w-3 h-3 animate-spin" /> : 'टेस्ट पिंग'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">API Key (Consumer Key):</label>
                    <input
                      type="text"
                      value={apiKeys.xApiKey}
                      onChange={e => setApiKeys({ ...apiKeys, xApiKey: e.target.value })}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Bearer Token:</label>
                    <input
                      type="password"
                      value={apiKeys.xBearerToken}
                      onChange={e => setApiKeys({ ...apiKeys, xBearerToken: e.target.value })}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#E21A25]"
                    />
                  </div>
                </div>
              </div>

              {/* 6. Google Gemini AI Newsroom Key */}
              <div className="bg-[#121622] rounded-2xl border border-[#232B3E] p-5 space-y-4 shadow-lg hover:border-amber-500/50 transition-all">
                <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-[#FFED00] flex items-center justify-center font-black">
                      AI
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Gemini AI Engine (News-to-Graphic)</h3>
                      <p className="text-[10px] text-slate-400">हिंदी समरी, कैची हेडलाइंस, 4:5 कार्ड टेक्स्ट व SEO</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      🟢 एक्टिव
                    </span>
                    <button
                      onClick={() => testApiConnection('gemini', 'Gemini AI')}
                      disabled={testingService === 'gemini'}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {testingService === 'gemini' ? <RotateCw className="w-3 h-3 animate-spin" /> : 'टेस्ट AI'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Gemini API Key:</label>
                    <input
                      type="password"
                      value={apiKeys.geminiApiKey}
                      onChange={e => setApiKeys({ ...apiKeys, geminiApiKey: e.target.value })}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#E21A25]"
                    />
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-200">
                    💡 यह की खबर से 1 कैची हिंदी हेडलाइन + 3 बुलेट पॉइंट्स + सोशल मीडिया कैप्शन्स स्वतः तैयार करने के लिए उपयोग होती है।
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="flex justify-end pt-3">
              <button
                onClick={handleSaveApiKeys}
                className="bg-[#E21A25] hover:bg-[#B70F18] text-white text-sm font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-xl shadow-[#E21A25]/40 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-[#FFED00]" />
                <span>सभी क्रेडेंशियल्स अपडेट व सुरक्षित करें</span>
              </button>
            </div>
          </section>
        )}

        {/* ================= SECTION: MASTER ADMIN SUPER CONSOLE (PHASE 5) ================= */}
        {activeView === 'masterAdminConsole' && (
          <MasterAdminHub
            onShowToast={showToast}
            onNavigateToView={(view: string) => setActiveView(view as any)}
          />
        )}

        {/* ================= SECTION 1: DISTRICT AUTO-GRAPHIC QUEUE ================= */}
        {activeView === 'generatorQueue' && (
          <section className="space-y-6">
            {/* Header & District Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121622] p-4 rounded-2xl border border-[#232B3E] shadow-lg">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E21A25]"></span>
                  इंजन 1: डिस्ट्रिक्ट RSS ऑटो-ग्राफिक व अप्रूवल रूम
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  आरएसएस व डिस्ट्रिक्ट फीड से 4:5 ब्रेकिंग न्यूज कार्ड तैयार होते हैं। रिव्यू करके 1-क्लिक में संबंधित फेसबुक पेज व इंस्टा पर लाइव करें।
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedDistrictFilter}
                  onChange={e => setSelectedDistrictFilter(e.target.value)}
                  className="bg-slate-900 border border-[#232B3E] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#E21A25] cursor-pointer"
                >
                  <option value="ALL">सभी जिले (All MP Districts)</option>
                  <option value="Bhopal">भोपाल (Bhopal Page)</option>
                  <option value="Indore">इंदौर (Indore Page)</option>
                  <option value="Jabalpur">जबलपुर (Jabalpur Page)</option>
                  <option value="Gwalior">ग्वालियर (Gwalior Page)</option>
                  <option value="Ujjain">उज्जैन (Ujjain Page)</option>
                </select>

                <button
                  onClick={() => {
                    showToast('RSS फीड्स स्कैन की जा रही हैं... 12 जिले अपडेटेड');
                  }}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-[#232B3E] transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#FFED00]" />
                  <span>फीड रिफ्रेश</span>
                </button>

                <button
                  onClick={approveAllFiltered}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow transition-all cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-[#FFED00]" />
                  <span>बल्क अप्रूव (All)</span>
                </button>

                <button
                  onClick={() => setShowQuickNewsModal(true)}
                  className="flex items-center gap-1.5 bg-[#FFED00] hover:bg-yellow-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl shadow transition-all cursor-pointer"
                  title="सीधे खबर या टेक्स्ट से 4:5 सोशल मीडिया ग्राफिक बनाएं"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-slate-950" />
                  <span>+ खबर से ग्राफिक बनाएं</span>
                </button>
              </div>
            </div>

            {/* Cards Approval Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredNews.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 bg-[#121622] rounded-2xl border border-[#232B3E]">
                  <Inbox className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm font-semibold">इस जिले के लिए कोई पेंडिंग खबर नहीं है।</p>
                </div>
              ) : (
                filteredNews.map(item => {
                  const isPublished = item.status === 'published';
                  return (
                    <div
                      key={item.id}
                      className="bg-[#121622] rounded-2xl border border-[#232B3E] overflow-hidden flex flex-col shadow-xl transition-all hover:border-slate-500"
                    >
                      {/* Card Top Bar */}
                      <div className="p-3 bg-slate-900/90 border-b border-[#232B3E] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isPublished ? 'bg-emerald-500' : 'bg-[#FFED00] pulse-live'
                            }`}
                          ></span>
                          <span className="text-xs font-bold text-white">{item.page}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>

                      {/* Graphic Preview (4:5 Aspect Ratio Container) */}
                      <div className="p-3 pb-0 flex justify-center bg-black/50">
                        <div className="w-full max-w-[260px] graphic-card-ratio rounded-xl overflow-hidden relative border-2 border-red-900/40 shadow-2xl flex flex-col justify-between">
                          <img
                            src={item.image}
                            alt="News graphic"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80"></div>

                          {/* Card Header in Red & Yellow Theme */}
                          <div className="relative z-10 p-2.5 flex items-center justify-between">
                            <div className="bg-[#E21A25] text-white text-[8px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1.5">
                              {customLogoUrl && (
                                <img
                                  src={customLogoUrl}
                                  alt="Logo"
                                  className="h-3.5 w-auto object-contain max-w-[44px]"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              )}
                              <span>{userProfile?.channelName || 'ब्रेकिंग न्यूज वाला'}</span>
                            </div>
                            <span className="bg-[#FFED00] text-slate-950 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow">
                              {userProfile?.district && userProfile.role === 'CHANNEL_ADMIN' ? userProfile.district : item.districtHindi}
                            </span>
                          </div>

                          {/* Card Body text */}
                          <div className="relative z-10 p-3 space-y-1">
                            <span className="bg-[#E21A25] text-[#FFED00] text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                              BREAKING NEWS
                            </span>
                            <h4 className="text-white text-xs font-bold leading-snug drop-shadow line-clamp-3">
                              {item.headline}
                            </h4>
                            <p className="text-[9px] text-slate-300 line-clamp-2 leading-tight">
                              {item.summary}
                            </p>
                            <div className="pt-1 border-t border-white/20 flex items-center justify-between text-[7px] text-slate-400">
                              <span>facebook.com/{item.district.toLowerCase()}</span>
                              <span className="text-[#FFED00]">@breakingnewswala</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* News Caption & Approval Buttons */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              AI तैयार कैप्शन:
                            </span>
                            {item.jsonOutput && (
                              <button
                                onClick={() => setJsonModalItem(item)}
                                className="text-[10px] text-[#FFED00] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Code2 className="w-3 h-3" />
                                <span>स्कीमा JSON देखें</span>
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 line-clamp-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 whitespace-pre-line">
                            {item.caption}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#232B3E] flex items-center gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl border border-[#232B3E] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#FFED00]" />
                            <span>एडिट कार्ड</span>
                          </button>

                          {isPublished ? (
                            <span className="flex-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5">
                              <Check className="w-3.5 h-3.5" />
                              <span>पब्लिश हो चुका</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => approveCard(item.id)}
                              className="flex-1 bg-[#E21A25] hover:bg-[#B70F18] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#E21A25]/30 transition-all cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5 text-[#FFED00]" />
                              <span>अप्रूव व पब्लिश</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* ================= SECTION 2: MASTER VIDEO STUDIO & AI SEO ================= */}
        {activeView === 'videoStudio' && (
          <section className="space-y-6">
            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E]">
              <h1 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-[#E21A25]" />
                इंजन 2: मास्टर वीडियो सिंडिकेशन व AI SEO इंजन (Master Video Room)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                एक वीडियो फाइल अपलोड करें। AI यूट्यूब टाइटल्स, टैग्स, फेसबुक हुक, इंस्टा रील्स कैप्शन और एक्स अलर्ट खुद तैयार करेगा।
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Video Input & Thumbnail Studio (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-[#E21A25]" /> वीडियो सोर्स फाइल
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                      रेडी (1080p MP4)
                    </span>
                  </div>

                  {/* Mock Video Preview */}
                  <div className="relative bg-black rounded-xl overflow-hidden aspect-video border border-slate-800 flex items-center justify-center group">
                    <img
                      src={videoThumb}
                      alt="Video Frame"
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="bg-[#E21A25] text-[10px] font-black px-1.5 py-0.5 rounded">
                        03:42 MIN
                      </span>
                      <span className="text-slate-300 text-[11px]">MP_Cabinet_Decisions_Package.mp4</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#E21A25]/90 text-white flex items-center justify-center shadow-lg cursor-pointer group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5 text-[#FFED00]" />
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Studio Widget with Custom Upload */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#FFED00]" />
                        <span>थंबनेल स्टूडियो विजेट:</span>
                      </span>
                      <span className="text-slate-400 text-[11px]">फ्रेम, AI या कस्टम इमेज</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                      <div
                        onClick={() => {
                          setVideoThumb('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80');
                          showToast('फ्रेम 1 (00:00) थंबनेल पर सेट हुआ');
                        }}
                        className={`rounded-lg overflow-hidden cursor-pointer relative transition-all ${
                          videoThumb === 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'
                            ? 'border-2 border-[#E21A25] shadow-md shadow-[#E21A25]/40'
                            : 'border border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&auto=format&fit=crop&q=80"
                          className="w-full h-11 object-cover"
                          alt="Frame 1"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-white text-[7px] sm:text-[8px] font-bold text-center">
                          00:00
                        </span>
                      </div>

                      <div
                        onClick={() => {
                          setVideoThumb('https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80');
                          showToast('फ्रेम 01:15 थंबनेल पर सेट हुआ');
                        }}
                        className={`rounded-lg overflow-hidden cursor-pointer relative transition-all ${
                          videoThumb === 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80'
                            ? 'border-2 border-[#E21A25] shadow-md shadow-[#E21A25]/40'
                            : 'border border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=200&auto=format&fit=crop&q=80"
                          className="w-full h-11 object-cover"
                          alt="Frame 2"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-white text-[7px] sm:text-[8px] font-bold text-center">
                          01:15
                        </span>
                      </div>

                      <div
                        onClick={() => {
                          setVideoThumb('https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=80');
                          showToast('फ्रेम 02:40 थंबनेल पर सेट हुआ');
                        }}
                        className={`rounded-lg overflow-hidden cursor-pointer relative transition-all ${
                          videoThumb === 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=80'
                            ? 'border-2 border-[#E21A25] shadow-md shadow-[#E21A25]/40'
                            : 'border border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=200&auto=format&fit=crop&q=80"
                          className="w-full h-11 object-cover"
                          alt="Frame 3"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-white text-[7px] sm:text-[8px] font-bold text-center">
                          02:40
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setVideoThumb('https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80');
                          showToast('AI थंबनेल (हाई-कंट्रास्ट ब्रेकिंग बार) सेट हुआ!');
                        }}
                        className={`border rounded-lg flex flex-col items-center justify-center p-0.5 text-center transition-all cursor-pointer ${
                          videoThumb === 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80'
                            ? 'border-[#FFED00] bg-amber-500/20 shadow-md'
                            : 'border-dashed border-amber-500/50 hover:bg-amber-500/10'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#FFED00]" />
                        <span className="text-[8px] font-bold text-amber-300 mt-0.5">AI थंबनेल</span>
                      </button>

                      {/* Custom Upload Trigger Button */}
                      <label className={`border rounded-lg flex flex-col items-center justify-center p-0.5 text-center transition-all cursor-pointer relative overflow-hidden ${
                        customUploadedThumb && videoThumb === customUploadedThumb
                          ? 'border-2 border-emerald-400 bg-emerald-500/20 shadow-md'
                          : 'border-dashed border-sky-500/60 hover:bg-sky-500/10'
                      }`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCustomThumbnailUpload}
                          className="hidden"
                        />
                        {customUploadedThumb && videoThumb === customUploadedThumb ? (
                          <>
                            <img src={customUploadedThumb} className="w-full h-11 object-cover absolute inset-0 opacity-70" alt="custom" />
                            <span className="relative z-10 text-[7px] font-black bg-emerald-600 text-white px-1 rounded">कस्टम</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-sky-400" />
                            <span className="text-[8px] font-bold text-sky-300 mt-0.5">+ अपलोड</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Rough Topic Input */}
                  <div className="space-y-2 pt-2 border-t border-[#232B3E]">
                    <label className="text-xs font-bold text-slate-300 block">
                      वीडियो का विषय / रफ नोट्स दर्ज करें:
                    </label>
                    <textarea
                      rows={3}
                      value={videoNotes}
                      onChange={e => setVideoNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#E21A25]"
                      placeholder="उदा: मध्यप्रदेश कैबिनेट की बैठक में 12 बड़े फैसले..."
                    ></textarea>
                    <button
                      onClick={() => {
                        showToast('AI द्वारा संपूर्ण SEO, टैग्स व कैप्शन्स तैयार किए गए!');
                      }}
                      className="w-full bg-gradient-to-r from-[#E21A25] via-red-600 to-amber-500 hover:from-[#B70F18] hover:to-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#FFED00]" />
                      <span>AI द्वारा सम्पूर्ण SEO, टैग्स व कैप्शन्स बनाएं</span>
                    </button>
                  </div>
                </div>

                {/* Destinations */}
                <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase block">
                    वन-क्लिक मास्टर पब्लिश डेस्टिनेशन:
                  </span>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <span className="text-red-500 font-bold">YT</span> YouTube Main Channel (1.2M Subs)
                      </span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#E21A25]" />
                    </label>
                    <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold">FB</span> Facebook Master Page (850K Followers)
                      </span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#E21A25]" />
                    </label>
                    <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <span className="text-pink-500 font-bold">IG</span> Instagram Reels (@breakingnewswala)
                      </span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#E21A25]" />
                    </label>
                    <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <span className="text-slate-200 font-bold">X</span> X / Twitter Official (@BreakingNewsWala)
                      </span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#E21A25]" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Right: Multi-Platform AI SEO Outputs (7 cols) */}
              <div className="lg:col-span-7 bg-[#121622] p-4 sm:p-5 rounded-2xl border border-[#232B3E] space-y-4">
                <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                  <span className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFED00]" />
                    प्लेटफ़ॉर्म-वाइज़ AI ऑप्टिमाइज़्ड आउटपुट
                  </span>
                  <button
                    onClick={() => {
                      let text = '';
                      if (videoStudioTab === 'yt') text = `${ytTitle}\n\n${ytDesc}\n\nTags:\n${ytTags}`;
                      if (videoStudioTab === 'fb') text = fbCaption;
                      if (videoStudioTab === 'ig') text = igCaption;
                      if (videoStudioTab === 'x') text = xCaption;
                      if (videoStudioTab === 'li') text = liCaption;
                      copyToClipboard(text);
                    }}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#FFED00]" /> <span>कॉपी करें</span>
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <button
                    onClick={() => setVideoStudioTab('yt')}
                    className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      videoStudioTab === 'yt' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    YouTube
                  </button>
                  <button
                    onClick={() => setVideoStudioTab('fb')}
                    className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      videoStudioTab === 'fb' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => setVideoStudioTab('ig')}
                    className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      videoStudioTab === 'ig' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Instagram Reels
                  </button>
                  <button
                    onClick={() => setVideoStudioTab('x')}
                    className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      videoStudioTab === 'x' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    X (Twitter)
                  </button>
                  <button
                    onClick={() => setVideoStudioTab('li')}
                    className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      videoStudioTab === 'li' ? 'bg-sky-700 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    LinkedIn
                  </button>
                </div>

                {/* Tab Contents */}
                {videoStudioTab === 'yt' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                        हाई-सीटीआर हिंदी/इंग्लिश टाइटल:
                      </label>
                      <input
                        type="text"
                        value={ytTitle}
                        onChange={e => setYtTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white font-medium focus:outline-none focus:border-[#E21A25]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                        एसईओ फ्रेंडली डिस्क्रिप्शन व टाइमस्टैम्प्स:
                      </label>
                      <textarea
                        rows={6}
                        value={ytDesc}
                        onChange={e => setYtDesc(e.target.value)}
                        className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-[#E21A25]"
                      ></textarea>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase">
                          यूट्यूब सर्च टैग्स:
                        </label>
                        <span className="text-[10px] text-[#FFED00] font-bold">18 टैग्स</span>
                      </div>
                      <div className="bg-slate-900 border border-[#232B3E] rounded-xl p-2.5">
                        <p className="text-xs text-slate-300 leading-relaxed font-mono">{ytTags}</p>
                      </div>
                    </div>
                  </div>
                )}

                {videoStudioTab === 'fb' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">
                      फेसबुक एंगेजिंग स्टोरी हुक व कैप्शन:
                    </label>
                    <textarea
                      rows={8}
                      value={fbCaption}
                      onChange={e => setFbCaption(e.target.value)}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-[#E21A25]"
                    ></textarea>
                  </div>
                )}

                {videoStudioTab === 'ig' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">
                      इंस्टाग्राम रील्स कैप्शन + ऑडियो सुझाव:
                    </label>
                    <textarea
                      rows={8}
                      value={igCaption}
                      onChange={e => setIgCaption(e.target.value)}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-[#E21A25]"
                    ></textarea>
                  </div>
                )}

                {videoStudioTab === 'x' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">
                      एक्स (Twitter) 280-Char क्रिस्प अलर्ट:
                    </label>
                    <textarea
                      rows={4}
                      value={xCaption}
                      onChange={e => setXCaption(e.target.value)}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-[#E21A25]"
                    ></textarea>
                    <div className="text-right text-[11px] text-slate-400">
                      {xCaption.length} / 280 करैक्टर्स
                    </div>
                  </div>
                )}

                {videoStudioTab === 'li' && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">
                      लिंक्डइन फॉर्मल पॉलिसी ब्रीफ:
                    </label>
                    <textarea
                      rows={7}
                      value={liCaption}
                      onChange={e => setLiCaption(e.target.value)}
                      className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-[#E21A25]"
                    ></textarea>
                  </div>
                )}

                {/* Master Upload Button */}
                <div className="pt-3 border-t border-[#232B3E] flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    चयनित: <span className="font-bold text-white">4 प्लेटफॉर्म्स</span> (YouTube, FB, Insta, X)
                  </div>
                  <button
                    onClick={() => {
                      showToast('सफलता! वीडियो YouTube, FB, Insta, X पर लाइव हो गया!');
                    }}
                    className="bg-[#E21A25] hover:bg-[#B70F18] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#E21A25]/40 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#FFED00]" />
                    <span>एक क्लिक में सभी प्लेटफॉर्म्स पर लाइव करें</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ================= SOCIAL MEDIA PREVIEW SECTION (BRANDED HIGH-CONTRAST OVERLAY FOR YOUTUBE & FACEBOOK) ================= */}
            <div className="bg-[#121622] rounded-2xl border-2 border-[#E21A25]/40 p-5 sm:p-6 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFED00]/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232B3E] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFED00] pulse-live"></span>
                    <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-[#FFED00]" />
                      सोशल मीडिया प्रीव्यू (Social Media Preview Engine)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    कस्टम थंबनेल इमेज अपलोड करें या थंबनेल विजेट से फ्रेम चुनें। पब्लिश करने से पहले YouTube व Facebook Feed में हाई-कंट्रास्ट ब्रेकिंग बार, चैनल लोगो व लाइव लेआउट का वास्तविक प्रीव्यू देखें।
                  </p>
                </div>

                {/* Platform Switcher Tabs */}
                <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-[#232B3E] shrink-0 self-start sm:self-auto">
                  <button
                    onClick={() => setSocialPreviewPlatform('youtube')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      socialPreviewPlatform === 'youtube'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-1 ring-red-400/50'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>यूट्यूब प्रीव्यू (16:9)</span>
                  </button>

                  <button
                    onClick={() => setSocialPreviewPlatform('facebook')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      socialPreviewPlatform === 'facebook'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-1 ring-blue-400/50'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Share className="w-3.5 h-3.5" />
                    <span>फेसबुक फीड प्रीव्यू</span>
                  </button>
                </div>
              </div>

              {/* Grid: Controls on Left, Realistic Feed Preview on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 5 Cols: Thumbnail Upload & High-Contrast Overlay Controls */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Upload Custom Thumbnail Card */}
                  <div className="bg-slate-900/90 rounded-xl border border-[#232B3E] p-4 space-y-3">
                    <span className="text-xs font-bold text-white uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-sky-400" /> कस्टम थंबनेल इमेज अपलोड
                      </span>
                      {customUploadedThumb && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                          कस्टम फाइल एक्टिव
                        </span>
                      )}
                    </span>

                    <label className="border-2 border-dashed border-sky-500/40 hover:border-sky-400 bg-sky-950/20 hover:bg-sky-950/40 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCustomThumbnailUpload}
                        className="hidden"
                      />
                      <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-sky-300">
                        डिवाइस से कस्टम थंबनेल चुनें (Upload JPG/PNG)
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        1920x1080 (16:9) या 1080x1350 (4:5) रेकमेंडेड
                      </span>
                    </label>

                    {/* Quick Switch from Presets */}
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase">
                        या विजेट के प्रीसेट फ्रेम्स से चुनें:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <button
                          onClick={() => {
                            setVideoThumb('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80');
                            showToast('फ्रेम 1 (00:00) एक्टिव किया गया');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 cursor-pointer"
                        >
                          फ्रेम 1 (00:00)
                        </button>
                        <button
                          onClick={() => {
                            setVideoThumb('https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80');
                            showToast('फ्रेम 2 (01:15) एक्टिव किया गया');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 cursor-pointer"
                        >
                          फ्रेम 2 (01:15)
                        </button>
                        <button
                          onClick={() => {
                            setVideoThumb('https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80');
                            showToast('AI हाई-कंट्रास्ट थंबनेल एक्टिव हुआ');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/40 cursor-pointer"
                        >
                          ✨ AI थंबनेल
                        </button>
                        {customUploadedThumb && (
                          <button
                            onClick={() => {
                              setVideoThumb(customUploadedThumb);
                              showToast('कस्टम अपलोडेड इमेज एक्टिव हुई');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 cursor-pointer"
                          >
                            📁 कस्टम इमेज
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* High-Contrast Overlay Customizer */}
                  <div className="bg-slate-900/90 rounded-xl border border-[#232B3E] p-4 space-y-3.5">
                    <span className="text-xs font-bold text-white uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-[#FFED00]" /> ब्रांडेड ओवरले कस्टमाइजर
                      </span>
                      <span className="text-[10px] text-[#FFED00] bg-[#E21A25] font-black px-1.5 py-0.2 rounded">
                        HD OVERLAY
                      </span>
                    </span>

                    {/* Headline on Graphic */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        थंबनेल पर बोल्ड हेडलाइन (Overlay Headline):
                      </label>
                      <input
                        type="text"
                        value={previewHeadline}
                        onChange={e => setPreviewHeadline(e.target.value)}
                        className="w-full bg-slate-950 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#E21A25]"
                        placeholder="थंबनेल पर दिखने वाली हाई-इम्पैक्ट हेडलाइन..."
                      />
                    </div>

                    {/* Urgency Badge & Location */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">
                          ब्रेकिंग टैग:
                        </label>
                        <select
                          value={previewUrgencyBadge}
                          onChange={e => setPreviewUrgencyBadge(e.target.value)}
                          className="w-full bg-slate-950 border border-[#232B3E] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#E21A25] cursor-pointer"
                        >
                          <option value="🔴 EXCLUSIVE / बड़ा खुलासा">🔴 EXCLUSIVE / बड़ा खुलासा</option>
                          <option value="⚡ BREAKING / बड़ी खबर">⚡ BREAKING / बड़ी खबर</option>
                          <option value="📢 बड़ा ऐलान / LIVE">📢 बड़ा ऐलान / LIVE</option>
                          <option value="⚠️ स्पेशल इन्वेस्टिगेशन">⚠️ स्पेशल इन्वेस्टिगेशन</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">
                          लोकेशन टैग:
                        </label>
                        <input
                          type="text"
                          value={previewLocationBadge}
                          onChange={e => setPreviewLocationBadge(e.target.value)}
                          className="w-full bg-slate-950 border border-[#232B3E] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                          placeholder="उदा: भोपाल मंत्रालय"
                        />
                      </div>
                    </div>

                    {/* Visual Toggles */}
                    <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                      <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 cursor-pointer">
                        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FFED00]"></span>
                          हाई-कंट्रास्ट रेड व यलो ब्रेकिंग बार
                        </span>
                        <input
                          type="checkbox"
                          checked={highContrastOverlay}
                          onChange={e => setHighContrastOverlay(e.target.checked)}
                          className="w-4 h-4 accent-[#E21A25] cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 cursor-pointer">
                        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#E21A25]"></span>
                          'ब्रेकिंग न्यूज वाला' वॉटरमार्क लोगो
                        </span>
                        <input
                          type="checkbox"
                          checked={showChannelLogo}
                          onChange={e => setShowChannelLogo(e.target.checked)}
                          className="w-4 h-4 accent-[#E21A25] cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 cursor-pointer">
                        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          वीडियो अवधि बैज (03:42)
                        </span>
                        <input
                          type="checkbox"
                          checked={showDurationPill}
                          onChange={e => setShowDurationPill(e.target.checked)}
                          className="w-4 h-4 accent-[#E21A25] cursor-pointer"
                        />
                      </label>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          showToast('हाई-कंट्रास्ट थंबनेल डाउनलोड हो रहा है...', '1080p HD PNG तैयार किया गया');
                        }}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#FFED00]" />
                        <span>HD थंबनेल डाउनलोड</span>
                      </button>

                      <button
                        onClick={() => {
                          showToast('थंबनेल व ओवरले पब्लिशिंग पाइपलाइन में सेट हो गया!');
                        }}
                        className="flex-1 bg-[#E21A25] hover:bg-[#B70F18] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-[#FFED00]" />
                        <span>पाइपलाइन में लॉक करें</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right 7 Cols: Authentic Social Media Feed Preview (YouTube or Facebook) */}
                <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-[#232B3E] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                      {socialPreviewPlatform === 'youtube' ? (
                        <>
                          <Video className="w-4 h-4 text-red-500" />
                          <span>यूट्यूब वॉच व फीड प्रीव्यू (YouTube Feed Simulation)</span>
                        </>
                      ) : (
                        <>
                          <Share className="w-4 h-4 text-blue-500" />
                          <span>फेसबुक इन-फीड वीडियो पोस्ट प्रीव्यू (Facebook Feed Simulation)</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      LIVE PREVIEW: 1080P
                    </span>
                  </div>

                  {/* ================= PLATFORM PREVIEW: YOUTUBE ================= */}
                  {socialPreviewPlatform === 'youtube' && (
                    <div className="space-y-3.5">
                      {/* Realistic 16:9 Thumbnail Frame with Branded Overlays */}
                      <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border-2 border-red-900/60 shadow-2xl group">
                        <img
                          src={videoThumb}
                          alt="YouTube Thumbnail"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Top Gradient for Branding visibility */}
                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none"></div>

                        {/* Bottom Gradient for Lower-Third High Contrast Bar */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none"></div>

                        {/* Top Brand Tag */}
                        {showChannelLogo && (
                          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                            <div className="bg-[#E21A25] text-white text-[9px] sm:text-[11px] font-black px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5 border border-red-400/40">
                              <span className="w-2 h-2 rounded-full bg-[#FFED00] pulse-live"></span>
                              <span>ब्रेकिंग न्यूज वाला</span>
                            </div>
                            <span className="bg-[#FFED00] text-slate-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded shadow uppercase tracking-wide">
                              {previewLocationBadge || 'MP NEWS'}
                            </span>
                          </div>
                        )}

                        {/* Top Right 4K UHD Badge */}
                        <div className="absolute top-3 right-3 z-10 bg-black/80 backdrop-blur-sm text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                          4K UHD
                        </div>

                        {/* Center Glowing Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-600/90 text-white flex items-center justify-center shadow-2xl shadow-red-600/60 group-hover:scale-110 transition-transform border border-red-400">
                            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white ml-1" />
                          </div>
                        </div>

                        {/* High-Contrast Breaking News Lower-Third Bar */}
                        {highContrastOverlay && (
                          <div className="absolute bottom-2 inset-x-2 z-10 space-y-1">
                            <div className="bg-[#FFED00] text-slate-950 p-2 sm:p-2.5 rounded-xl shadow-2xl flex flex-col justify-center border-2 border-slate-950">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="bg-[#E21A25] text-white text-[8px] sm:text-[10px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider shrink-0 shadow">
                                  {previewUrgencyBadge}
                                </span>
                                <span className="text-[9px] sm:text-[11px] font-bold text-slate-800 line-clamp-1">
                                  {previewLocationBadge} विशेष कवरेज
                                </span>
                              </div>
                              <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-950 leading-tight tracking-tight drop-shadow-sm line-clamp-2">
                                {previewHeadline}
                              </h3>
                            </div>
                          </div>
                        )}

                        {/* Duration Pill */}
                        {showDurationPill && (
                          <div className="absolute bottom-3 right-3 z-20 bg-black/90 text-white font-mono font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-md shadow border border-slate-800">
                            03:42
                          </div>
                        )}
                      </div>

                      {/* YouTube Card Metadata (Title, Channel, Views) */}
                      <div className="flex gap-3 pt-2">
                        {/* Channel Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E21A25] to-[#FFED00] p-0.5 shrink-0 shadow">
                          <div className="w-full h-full bg-[#0F131D] rounded-full flex items-center justify-center text-xs font-black text-white">
                            <span className="text-[#E21A25]">B</span>
                            <span className="text-[#FFED00]">N</span>
                          </div>
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex-1 space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                            {ytTitle}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">Breaking News Wala Master Channel</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[8px] font-bold">✓</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            184K views • 2 hours ago • #MadhyaPradesh #Bhopal #CabinetDecisions
                          </div>
                        </div>
                      </div>

                      {/* Realistic Action Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                          <span className="flex items-center gap-1 font-bold text-white">
                            <ThumbsUp className="w-3.5 h-3.5 text-red-500" /> 14K
                          </span>
                          <span className="text-slate-600">|</span>
                          <span className="text-slate-400 hover:text-white cursor-pointer">Dislike</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-800 cursor-pointer">
                            <Share className="w-3.5 h-3.5 text-sky-400" />
                            <span>Share</span>
                          </button>
                          <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-800 cursor-pointer">
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ================= PLATFORM PREVIEW: FACEBOOK ================= */}
                  {socialPreviewPlatform === 'facebook' && (
                    <div className="bg-[#181F2E] rounded-xl border border-slate-800 p-4 space-y-3">
                      {/* FB Post Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-[#E21A25] flex items-center justify-center font-black text-white text-xs shadow">
                            BNW
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs sm:text-sm font-bold text-white">Breaking News Wala Master News</span>
                              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-black">✓</span>
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <span>2 घंटे पहले</span>
                              <span>•</span>
                              <span>🌐 Public</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-slate-400 font-bold tracking-widest cursor-pointer">•••</span>
                      </div>

                      {/* Post Caption */}
                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line line-clamp-3">
                        {fbCaption.slice(0, 180)}...
                      </p>

                      {/* FB Video Frame with Branded High-Contrast Overlay */}
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-slate-700 shadow-xl group">
                        <img
                          src={videoThumb}
                          alt="Facebook Thumbnail"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none"></div>

                        {/* Top FB Branding */}
                        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-2">
                          <span className="bg-[#E21A25] text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFED00]"></span>
                            <span>ब्रेकिंग न्यूज वाला</span>
                          </span>
                          <span className="bg-[#FFED00] text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            फेसबुक स्पेशल
                          </span>
                        </div>

                        {/* Center Facebook Play Circle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-current text-white ml-0.5" />
                          </div>
                        </div>

                        {/* High-Contrast Bottom Banner */}
                        {highContrastOverlay && (
                          <div className="absolute bottom-2 inset-x-2 z-10">
                            <div className="bg-[#FFED00] text-slate-950 p-2 rounded-lg shadow-xl border border-slate-950">
                              <div className="text-[8px] font-black text-[#E21A25] uppercase tracking-wide">
                                {previewUrgencyBadge}
                              </div>
                              <div className="text-xs sm:text-sm font-black line-clamp-2 leading-tight">
                                {previewHeadline}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Duration Pill */}
                        {showDurationPill && (
                          <div className="absolute bottom-2 right-2 z-20 bg-black/80 text-white font-mono font-bold text-[9px] px-1.5 py-0.2 rounded">
                            03:42
                          </div>
                        )}
                      </div>

                      {/* Reactions & Shares Counter */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">👍❤️😮</span>
                          <span>34K</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>1.9K टिप्पणियां</span>
                          <span>4.8K शेयर्स</span>
                        </div>
                      </div>

                      {/* FB Action Buttons */}
                      <div className="grid grid-cols-4 gap-1 pt-1 text-center text-xs text-slate-300 font-semibold">
                        <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-blue-400">
                          <ThumbsUp className="w-4 h-4" />
                          <span>लाइक</span>
                        </button>
                        <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer">
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                          <span>टिप्पणी</span>
                        </button>
                        <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer">
                          <Share2 className="w-4 h-4 text-slate-400" />
                          <span>शेयर</span>
                        </button>
                        <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-emerald-400">
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Publishing Sync Card */}
              <div className="bg-gradient-to-r from-red-950/50 via-slate-900 to-amber-950/40 p-4 rounded-xl border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600/20 text-[#FFED00] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#FFED00]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      हाई-कंट्रास्ट सोशल मीडिया थंबनेल व वीडियो रेडी है
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      YouTube (16:9), Facebook Video, Instagram Reels और X (Twitter) पर एक साथ लाइव करने के लिए तैयार।
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    showToast('सफलता! वीडियो व ब्रांडेड थंबनेल सभी सोशल प्लेटफॉर्म्स पर लाइव हो गया!');
                  }}
                  className="bg-[#E21A25] hover:bg-[#B70F18] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#E21A25]/40 transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4 text-[#FFED00]" />
                  <span>एक-क्लिक में लाइव सिंडिकेट करें</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 3: DISTRIBUTION HUB ================= */}
        {activeView === 'distributionHub' && (
          <section className="space-y-6">
            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E]">
              <h1 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                3. डिस्ट्रीब्यूशन व एम्प्लीफिकेशन लेयर (WhatsApp, Telegram & Groups)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                खबर या वीडियो पब्लिश होते ही सीधे ऑफिशियल WhatsApp चैनल्स, Telegram बॉट और Facebook कम्युनिटी ग्रुप्स पर ब्रॉडकास्ट करें।
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#121622] p-5 rounded-2xl border border-[#232B3E] space-y-4">
                <span className="text-xs font-bold text-slate-300 uppercase block">
                  त्वरित ब्रॉडकास्ट संदेश तैयार करें:
                </span>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    खबर का मुख्य लिंक या वीडियो यूआरएल:
                  </label>
                  <input
                    type="text"
                    defaultValue="https://breakingnewswala.in/bhopal-kolar-six-lane-update"
                    className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E21A25]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    WhatsApp & Telegram अनुकूलित फॉर्मेट मैसेज:
                  </label>
                  <textarea
                    rows={7}
                    defaultValue={`🔴 *ब्रेकिंग न्यूज वाला - भोपाल अपडेट* 🔴

*कोलार सिक्स लेन का काम अंतिम चरण में, 15 मई तक पूरा होगा डामरीकरण!*
• कोलार के 5 लाख नागरिकों को ट्रैफिक जाम से मिलेगी मुक्ति।
• नगर निगम व PWD ने 15 मई की डेडलाइन की तय।

👉 *पूरी रिपोर्ट विस्तार से पढ़ें:*
https://breakingnewswala.in/bhopal-kolar-six-lane-update

📲 *हमारे WhatsApp चैनल से जुड़ें:*
https://whatsapp.com/channel/breakingnewswala`}
                    className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-mono focus:outline-none focus:border-[#E21A25]"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => showToast('WhatsApp ऑफिशियल चैनल पर ब्रॉडकास्ट भेजा गया! 142,500 सब्सक्राइबर्स')}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#FFED00]" />
                    <span>WhatsApp ऑफिशियल चैनल पर भेजें</span>
                  </button>
                  <button
                    onClick={() => showToast('Telegram चैनल व बॉट पर मैसेज सेंड हुआ! 58,900 सब्सक्राइबर्स')}
                    className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold p-3 rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#FFED00]" />
                    <span>Telegram चैनल पर फॉरवर्ड करें</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#121622] p-5 rounded-2xl border border-[#232B3E] space-y-4">
                <span className="text-xs font-bold text-slate-300 uppercase block">
                  ब्रॉडकास्ट ऑडियंस नेटवर्क:
                </span>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-[#232B3E] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        WA
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">WhatsApp Official Channel</div>
                        <div className="text-[10px] text-slate-400">142,500+ सब्सक्राइबर्स</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      कनेक्टेड
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-[#232B3E] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                        TG
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Telegram News Bot Hub</div>
                        <div className="text-[10px] text-slate-400">58,900+ सब्सक्राइबर्स</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-sky-500/20 text-sky-400 font-bold px-2 py-0.5 rounded">
                      कनेक्टेड
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-[#232B3E] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                        FB
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">FB Community Groups (8)</div>
                        <div className="text-[10px] text-slate-400">320,000+ टोटल मेंबर्स</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded">
                      ऑथराइज्ड
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 4: VIRAL & TRENDING RADAR ================= */}
        {activeView === 'viralRadar' && (
          <section className="space-y-6">
            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  ट्रेंडिंग व वायरल खबर (AI Trending & Viral Intelligence)
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  रियल-टाइम भारत व मध्य प्रदेश में अभी क्या सर्च हो रहा है और कौन-से जिले की खबर में वायरल वेलोसिटी ज्यादा है।
                </p>
              </div>
              <span className="text-xs bg-orange-500/20 text-orange-400 font-bold px-3 py-1.5 rounded-xl border border-orange-500/30 self-start sm:self-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 pulse-live"></span> लाइव ट्रेंडिंग डेटा
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hot Keywords */}
              <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] space-y-3">
                <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#E21A25]" /> हॉट सर्च कीवर्ड्स (MP & India)
                </span>
                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">#BhopalKolarRoad</div>
                      <div className="text-[10px] text-slate-400">सिक्स लेन व ट्रैफिक राहत</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">180K / hr</div>
                      <span className="text-[9px] bg-red-500/20 text-red-400 px-1 py-0.2 rounded font-bold">+310% 🔥</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">#MPVidhanSabha</div>
                      <div className="text-[10px] text-slate-400">सत्र के हंगामे व बड़े विधेयक</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">145K / hr</div>
                      <span className="text-[9px] bg-red-500/20 text-red-400 px-1 py-0.2 rounded font-bold">+280% 🔥</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">#IndoreMetroTrial</div>
                      <div className="text-[10px] text-slate-400">सुपर कॉरिडोर से नया रूट ट्रायल</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">92K / hr</div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-bold">+120%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* District Velocity */}
              <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] space-y-3">
                <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-orange-400" /> डिस्ट्रिक्ट वायरल वेलोसिटी ट्रैकर
                </span>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-[#232B3E] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-[#E21A25] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">भोपाल जिला</span>
                      <span className="text-emerald-400 font-bold text-[11px]">वेलोसिटी स्कोर: 96/100</span>
                    </div>
                    <p className="text-xs font-bold text-white">कोलार सिक्स लेन की 15 मई डेडलाइन घोषित</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">5 लाख लोगों का सीधा जुड़ाव</span>
                      <span className="text-[10px] text-emerald-400 font-bold">क्यू में एक्टिव ✓</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-[#232B3E] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-[#E21A25] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">उज्जैन जिला</span>
                      <span className="text-emerald-400 font-bold text-[11px]">वेलोसिटी स्कोर: 88/100</span>
                    </div>
                    <p className="text-xs font-bold text-white">महाकाल मंदिर में भस्म आरती के नए नियम लागू</p>
                  </div>
                </div>
              </div>

              {/* AI Advisor */}
              <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] space-y-3">
                <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-purple-400" /> AI न्यूजरूम एडवाइजर
                </span>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/30 text-purple-200 space-y-1">
                    <span className="font-bold block text-purple-300">🎯 भोपाल पेज एडवाइस:</span>
                    <p className="text-[11px] leading-relaxed">कोलार सिक्स लेन खबर पर वीडियो पैकेज और 4:5 कार्ड दोनों पोस्ट करें। कमेंट्स में ट्रैफिक सुझाव मांगें।</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-900/20 border border-blue-500/30 text-blue-200 space-y-1">
                    <span className="font-bold block text-blue-300">⏰ बेस्ट पोस्टिंग टाइम:</span>
                    <p className="text-[11px] leading-relaxed">भोपाल व इंदौर पेजों पर शाम 07:30 PM से 08:45 PM के बीच एंगेजमेंट पीक पर रहेगा।</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 5: ANALYTICS ================= */}
        {activeView === 'analyticsView' && (
          <section className="space-y-6">
            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] flex items-center justify-between">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  सोशल रीच, ऑडियंस व ग्रोथ एनालिटिक्स
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  सभी डिस्ट्रिक्ट पेजेस और मास्टर सोशल अकाउंट्स का एकीकृत रीच व एंगेजमेंट स्टेटस।
                </p>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-[#232B3E]">
                पिछले 28 दिन
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E]">
                <div className="text-[11px] font-bold text-slate-400 uppercase">कुल सोशल रीच</div>
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

            {/* Recharts Line Chart: 30-Day Growth Trend of Followers & Video Views */}
            <div className="bg-[#121622] p-5 rounded-2xl border-2 border-[#E21A25]/30 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232B3E] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFED00] pulse-live"></span>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#FFED00]" />
                      30-दिवसीय ग्रोथ ट्रेंड: फॉलोअर्स व वीडियो व्यूज (Last 30 Days Growth)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    मध्य प्रदेश के 12 जिलों के नेटवर्क और मास्टर YouTube/FB चैनल्स का दैनिक व्यूज व नए फॉलोअर्स विश्लेषण
                  </p>
                </div>

                {/* Filter Controls for Chart */}
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-[#232B3E] text-xs">
                  <button
                    onClick={() => setChartMetricFilter('both')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      chartMetricFilter === 'both'
                        ? 'bg-[#E21A25] text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    दोनों मेट्रिक्स
                  </button>
                  <button
                    onClick={() => setChartMetricFilter('views')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      chartMetricFilter === 'views'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    केवल वीडियो व्यूज
                  </button>
                  <button
                    onClick={() => setChartMetricFilter('followers')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      chartMetricFilter === 'followers'
                        ? 'bg-red-500 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    केवल फॉलोअर्स
                  </button>
                </div>
              </div>

              {/* Chart Legend & Summary Tags */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-4">
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
                    data={analytics30DaysData}
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
                                <span>तारीख: {label} (2026)</span>
                                <span className="text-[10px] text-slate-400">30D Matrix</span>
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

              {/* Bottom Insight Footer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-[#FFED00] font-bold block mb-1">🔥 उच्चतम व्यूज स्पाइक:</span>
                  17 अक्टूबर (Day 30) पर 585,000 व्यूज दर्ज हुए, जिसमें भोपाल और इंदौर रील्स का योगदान 64% रहा।
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-red-400 font-bold block mb-1">📈 फॉलोअर एक्विजिशन:</span>
                  औसत 2,280 नए फॉलोअर्स प्रतिदिन जुड़े। यूट्यूब और इंस्टाग्राम पर 4:5 ग्राफिक्स से 3.8 गुना अधिक कन्वर्जन मिला।
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-emerald-400 font-bold block mb-1">🎯 एआई ग्रोथ रिकमेंडेशन:</span>
                  शाम 7:30 बजे वीडियो पब्लिश करने पर 30% अधिक व्यूज आए हैं। इस टाइम-स्लॉट को शेड्यूल में प्राथमिकता दें।
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION: AUTOMATION & SCHEDULING ENGINE (PHASE 4) ================= */}
        {activeView === 'accountsConfig' && (
          <AutomationSchedulingHub
            onShowToast={showToast}
            userDistrict={userProfile?.district}
            userRole={userProfile?.role}
          />
        )}
      </main>

      {/* ================= MODAL: QUICK RAW NEWS TO GRAPHIC & JSON ================= */}
      {showQuickNewsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#121622] w-full max-w-2xl rounded-2xl border-2 border-[#E21A25] p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FFED00]" />
                <h2 className="text-base sm:text-lg font-bold text-white">
                  + त्वरित खबर इनपुट: 4:5 ग्राफिक व AI SEO जनरेटर
                </h2>
              </div>
              <button
                onClick={() => setShowQuickNewsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">जिला चुनें:</label>
                  <select
                    value={quickNewsDistrict}
                    onChange={e => setQuickNewsDistrict(e.target.value)}
                    className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-white"
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
                  <label className="font-bold text-slate-300 block mb-1">समाचार श्रेणी (Category):</label>
                  <input
                    type="text"
                    value={quickNewsCategory}
                    onChange={e => setQuickNewsCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Raw News Input with Integrated Web Speech API Dictation */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span>कच्ची खबर का पाठ (Raw News Input)</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (टाइप करें या सीधे बोलकर डिक्टेट करें)
                    </span>
                  </label>

                  {/* Web Speech API Controls */}
                  <div className="flex items-center gap-2">
                    {/* Language Switcher */}
                    <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setSpeechLanguage('hi-IN')}
                        className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                          speechLanguage === 'hi-IN'
                            ? 'bg-[#E21A25] text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="हिंदी वॉइस इनपुट"
                      >
                        हिंदी
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpeechLanguage('en-IN')}
                        className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                          speechLanguage === 'en-IN'
                            ? 'bg-[#E21A25] text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="English Voice Input"
                      >
                        EN
                      </button>
                    </div>

                    {/* Microphone Toggle Button */}
                    <button
                      type="button"
                      onClick={toggleVoiceDictation}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
                        isListening
                          ? 'bg-red-600 text-white animate-pulse shadow-red-600/50 ring-2 ring-red-400'
                          : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400'
                      }`}
                      title="Web Speech API से वॉइस डिक्टेशन शुरू/बंद करें"
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-3.5 h-3.5 animate-bounce text-white" />
                          <span>माइक बंद करें (Stop)</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-[#FFED00]" />
                          <span>माइक से बोलें (Dictate)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Speech Recognition Active / Error Feedback Banner */}
                {isListening && (
                  <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 flex flex-col gap-1 text-xs text-red-200 animate-pulse">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        🔴 वॉइस डिक्टेशन चालू है... (Listening...)
                      </span>
                      <span className="text-[10px] text-amber-300 font-mono">
                        भाषा: {speechLanguage === 'hi-IN' ? 'हिन्दी (hi-IN)' : 'English (en-IN)'}
                      </span>
                    </div>
                    {interimTranscript && (
                      <p className="text-[11px] text-amber-300 italic bg-black/40 p-1.5 rounded">
                        "{interimTranscript}"
                      </p>
                    )}
                  </div>
                )}

                {speechError && (
                  <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between">
                    <span>⚠️ {speechError}</span>
                    <button
                      type="button"
                      onClick={() => setSpeechError(null)}
                      className="text-slate-400 hover:text-white text-[10px] cursor-pointer ml-2"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Textarea */}
                <textarea
                  rows={5}
                  value={quickNewsText}
                  onChange={e => setQuickNewsText(e.target.value)}
                  className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#E21A25] font-sans"
                  placeholder="यहाँ खबर का विवरण टाइप करें या ऊपर 'माइक से बोलें' बटन दबाकर सीधे डिक्टेट करें..."
                ></textarea>

                {/* Voice to Structured AI Prompt Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={convertDictationToStructuredPrompt}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white font-bold text-[11px] transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                    title="डिक्टेट किए गए समाचार को AI इंजन हेतु स्ट्रक्चर्ड प्रॉम्प्ट में बदलें"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFED00]" />
                    <span>वॉइस डिक्टेशन को स्ट्रक्चर्ड AI प्रॉम्प्ट में बदलें</span>
                  </button>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{quickNewsText.length} वर्ण</span>
                    <button
                      type="button"
                      onClick={() => setQuickNewsText('')}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer hover:underline text-[10px]"
                    >
                      साफ़ करें (Clear)
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200">
                ✨ AI इंजन स्वतः 4:5 ग्राफिक कार्ड, कैची हिंदी हेडलाइन, बुलेट पॉइंट्स, यूट्यूब एसईओ, फेसबुक, इंस्टा व एक्स पोस्ट तैयार करेगा।
              </div>

              <div className="pt-3 border-t border-[#232B3E] flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowQuickNewsModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  onClick={processQuickNewsToQueue}
                  className="px-5 py-2 rounded-xl bg-[#E21A25] hover:bg-[#B70F18] text-white font-bold flex items-center gap-1.5 shadow-lg shadow-[#E21A25]/40 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#FFED00]" />
                  <span>AI प्रोसेस करें व क्यू में जोड़ें</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT GRAPHIC & HEADLINE WITH DYNAMIC 3-TEMPLATE LIVE PREVIEW GRID ================= */}
      {editingCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-[#121622] w-full max-w-6xl xl:max-w-7xl rounded-2xl border-2 border-[#232B3E] p-4 sm:p-6 space-y-5 max-h-[94vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232B3E] pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#E21A25] pulse-live"></span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-[#FFED00]" />
                      <span>स्मार्ट कार्ड एडिटर (Dynamic Live 4:5 Graphics Studio)</span>
                    </h2>
                    <span className="text-[10px] bg-[#FFED00] text-slate-950 font-black px-2 py-0.5 rounded uppercase shadow">
                      4:5 RATIO
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    हेडलाइन व समरी एडिट करें — नीचे तीनों ब्रांडेड 4:5 टेंपलेट्स एक साथ रियल-टाइम में अपडेट होंगे
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Real-time sync badge */}
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-live"></span>
                  <span>⚡ रियल-टाइम सिंक सक्रिय</span>
                </span>
                <button
                  onClick={() => setEditingCard(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  title="बंद करें"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dynamic Inputs Panel */}
            <div className="bg-[#0D111A] border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FFED00]" />
                  <span>लाइव इनपुट फील्ड्स (Dynamic Live-Editing Inputs):</span>
                </span>
                <span className="text-[11px] text-[#FFED00] font-medium hidden sm:inline">
                  💡 टाइप करते ही नीचे तीनों लेआउट्स तुरंत बदलेंगे
                </span>
              </div>

              {/* Headline & Summary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Headline (Col 7) */}
                <div className="lg:col-span-7 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <span>कार्ड मुख्य हेडलाइन:</span>
                      <span className="text-[10px] text-amber-400 font-normal">(तीनों टेंपलेट्स में लाइव)</span>
                    </label>
                    <span className={`text-[10px] font-mono ${editHeadline.length > 70 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {editHeadline.length} अक्षर
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={editHeadline}
                    onChange={e => setEditHeadline(e.target.value)}
                    placeholder="खबर की आकर्षक मुख्य हेडलाइन दर्ज करें..."
                    className="w-full bg-[#161C2C] border border-slate-700 focus:border-[#E21A25] focus:ring-1 focus:ring-[#E21A25] rounded-xl p-3 text-xs sm:text-sm text-white font-bold transition-all focus:outline-none"
                  ></textarea>

                  {/* Quick Tag Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-slate-400">क्विक टैग्स:</span>
                    {[
                      { label: '🔴 बड़ी खबर', text: 'बड़ी खबर: ' },
                      { label: '⚡ बड़ा खुलासा', text: 'बड़ा खुलासा: ' },
                      { label: '⚠️ हाई अलर्ट', text: 'हाई अलर्ट: ' },
                      { label: '📢 अहम फैसला', text: 'अहम फैसला: ' }
                    ].map(tag => (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => {
                          if (!editHeadline.includes(tag.text)) {
                            setEditHeadline(tag.text + editHeadline);
                          }
                        }}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary (Col 5) */}
                <div className="lg:col-span-5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <span>संक्षिप्त विवरण / समरी:</span>
                      <span className="text-[10px] text-amber-400 font-normal">(तीनों टेंपलेट्स में लाइव)</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      {editSummary.length} अक्षर
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={editSummary}
                    onChange={e => setEditSummary(e.target.value)}
                    placeholder="खबर की 2-लाइन मुख्य समरी यहाँ लिखें..."
                    className="w-full bg-[#161C2C] border border-slate-700 focus:border-[#E21A25] focus:ring-1 focus:ring-[#E21A25] rounded-xl p-3 text-xs text-slate-200 leading-snug transition-all focus:outline-none"
                  ></textarea>
                </div>
              </div>

              {/* District, Page, and Poll Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 pt-1">
                <div className="md:col-span-4">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    स्थान / जिला टैग (District Tag):
                  </label>
                  <input
                    type="text"
                    value={editDistrictHindi}
                    onChange={e => setEditDistrictHindi(e.target.value)}
                    placeholder="उदा. भोपाल, इंदौर"
                    className="w-full bg-[#161C2C] border border-slate-700 focus:border-[#E21A25] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    टारगेट Facebook पेज:
                  </label>
                  <input
                    type="text"
                    value={editPage}
                    onChange={e => setEditPage(e.target.value)}
                    placeholder="उदा. ब्रेकिंग न्यूज़ वाला भोपाल"
                    className="w-full bg-[#161C2C] border border-slate-700 focus:border-[#E21A25] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="md:col-span-4 flex items-end">
                  <button
                    type="button"
                    onClick={() => setShowPollConfigInEdit(!showPollConfigInEdit)}
                    className="w-full bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>पोल प्रश्न व ऑप्शन्स {showPollConfigInEdit ? 'छिपाएं' : 'एडिट करें'}</span>
                    </span>
                    <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded font-mono">
                      {showPollConfigInEdit ? '▲ बंद' : '▼ खोलें'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Expandable Poll Configurator */}
              {showPollConfigInEdit && (
                <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>टेंपलेट 3 (Poll-Format) कस्टमाइज़र:</span>
                    </span>
                    <span className="text-[10px] text-blue-200/70">
                      बदलाव करते ही टेंपलेट 3 तुरंत अपडेट होगा
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">पोल का मुख्य प्रश्न:</label>
                    <input
                      type="text"
                      value={editPollQuestion}
                      onChange={e => setEditPollQuestion(e.target.value)}
                      className="w-full bg-[#161C2C] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      placeholder="पोल प्रश्न दर्ज करें..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">विकल्प [A]:</label>
                      <input
                        type="text"
                        value={editPollOptionA}
                        onChange={e => setEditPollOptionA(e.target.value)}
                        className="w-full bg-[#161C2C] border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">विकल्प [B]:</label>
                      <input
                        type="text"
                        value={editPollOptionB}
                        onChange={e => setEditPollOptionB(e.target.value)}
                        className="w-full bg-[#161C2C] border border-red-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= 3-TEMPLATE PREVIEW GRID (ALL THREE RENDERED SIMULTANEOUSLY) ================= */}
            <div className="space-y-3">
              {/* Toolbar */}
              <div className="bg-gradient-to-r from-[#0C1019] via-[#141A28] to-[#0C1019] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFED00]" />
                    <h3 className="text-xs sm:text-sm font-bold text-white">
                      3-टेंपलेट लाइव प्रीव्यू ग्रिड (Simultaneous Live Template Previews)
                    </h3>
                    <span className="text-[10px] bg-red-600/30 text-red-300 border border-red-500/40 px-2 py-0.5 rounded font-mono">
                      3 Layouts Active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    ऊपर हेडलाइन या समरी बदलने पर तीनों 4:5 कार्ड तुरंत रेंडर होते हैं। पब्लिश करने के लिए किसी भी कार्ड पर क्लिक करके चुनें:
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* View Mode Toggle */}
                  <div className="flex items-center p-0.5 bg-black/60 rounded-xl border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setTemplatePreviewMode('grid')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        templatePreviewMode === 'grid'
                          ? 'bg-[#E21A25] text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="तीनों टेंपलेट एक साथ ग्रिड में देखें"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>3-ग्रिड व्यू</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplatePreviewMode('single')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        templatePreviewMode === 'single'
                          ? 'bg-slate-700 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="केवल चयनित टेंपलेट देखें"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>सिंगल फोकस</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* RENDER PREVIEWS */}
              {templatePreviewMode === 'grid' ? (
                /* ================= 3-COLUMN SIMULTANEOUS GRID ================= */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                  {/* ---------------- 1. News-Alert Template ---------------- */}
                  <div
                    onClick={() => setEditCardTemplate('News-Alert')}
                    className={`rounded-2xl p-3 bg-[#0B0F19] border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                      editCardTemplate === 'News-Alert'
                        ? 'border-[#E21A25] shadow-[0_0_24px_rgba(226,26,37,0.35)] ring-2 ring-[#FFED00]/60'
                        : 'border-slate-800 hover:border-slate-600 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Top Status */}
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#FFED00]" />
                        <span className="text-xs font-bold text-white">1. News-Alert</span>
                      </div>
                      {editCardTemplate === 'News-Alert' ? (
                        <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded shadow flex items-center gap-1">
                          <Check className="w-3 h-3 text-[#FFED00]" />
                          <span>पब्लिश हेतु चयनित</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 hover:text-white">
                          चुनने हेतु क्लिक करें
                        </span>
                      )}
                    </div>

                    {/* Graphic Preview Container */}
                    <div className="flex flex-col items-center bg-black/60 p-2.5 rounded-xl space-y-2">
                      {/* 'Toggle Layout' and 'Apply Filter' Buttons directly on top of the preview */}
                      <div className="w-full max-w-[280px] flex items-center justify-between gap-1.5 px-2 py-1.5 bg-[#141A28] rounded-xl border border-slate-700/80 shadow-md">
                        <button
                          type="button"
                          onClick={cycleNewsAlertAccent}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-extrabold bg-[#E21A25]/25 hover:bg-[#E21A25]/45 text-[#FFED00] hover:text-white border border-[#E21A25]/60 hover:border-[#FFED00]/70 transition-all cursor-pointer shadow hover:scale-105 active:scale-95 shrink-0"
                          title="ग्राफिक एक्सेंट रंग बदलें: Red → Gold → Blue"
                        >
                          <RotateCw className="w-2.5 h-2.5 text-[#FFED00]" />
                          <span>Toggle Layout</span>
                          <span className={`px-1 py-0.2 rounded text-[8px] font-black uppercase ${
                            newsAlertAccent === 'Red'
                              ? 'bg-red-600 text-white'
                              : newsAlertAccent === 'Gold'
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-blue-600 text-white'
                          }`}>
                            {newsAlertAccent}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={cycleGraphicFilter}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-extrabold bg-blue-600/25 hover:bg-blue-600/45 text-cyan-300 hover:text-white border border-blue-500/60 hover:border-cyan-300/80 transition-all cursor-pointer shadow hover:scale-105 active:scale-95 shrink-0"
                          title="इमेज फिल्टर बदलें: None → Grayscale → Sepia → High-Contrast"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
                          <span>Apply Filter</span>
                          <span className="px-1 py-0.2 rounded text-[8px] font-black uppercase bg-slate-900/90 text-cyan-200 border border-slate-700">
                            {graphicFilter === 'none' ? 'None' : graphicFilter === 'grayscale' ? 'Gray' : graphicFilter === 'sepia' ? 'Sepia' : 'Hi-Con'}
                          </span>
                        </button>
                      </div>

                      <div className={`w-full max-w-[280px] graphic-card-ratio rounded-xl overflow-hidden shadow-2xl relative flex flex-col justify-between bg-black border-2 transition-all duration-300 ${
                        newsAlertAccent === 'Red'
                          ? 'border-red-600/90 shadow-[0_0_24px_rgba(226,26,37,0.4)]'
                          : newsAlertAccent === 'Gold'
                          ? 'border-amber-500/90 shadow-[0_0_24px_rgba(245,158,11,0.4)]'
                          : 'border-blue-500/90 shadow-[0_0_24px_rgba(37,99,235,0.4)]'
                      }`}>
                        <img
                          src={editingCard.image}
                          alt="preview"
                          style={getFilterStyle(graphicFilter)}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/80"></div>
                        {/* Optional subtle color aura on the graphic */}
                        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                          newsAlertAccent === 'Red'
                            ? 'bg-gradient-to-t from-red-950/40 via-transparent to-red-950/20'
                            : newsAlertAccent === 'Gold'
                            ? 'bg-gradient-to-t from-amber-950/40 via-transparent to-amber-950/20'
                            : 'bg-gradient-to-t from-blue-950/40 via-transparent to-blue-950/20'
                        }`}></div>

                        {/* Top Header Bar */}
                        <div className="relative z-10 p-2.5 flex items-center justify-between">
                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded shadow transition-all duration-300 ${
                            newsAlertAccent === 'Red'
                              ? 'bg-[#E21A25]'
                              : newsAlertAccent === 'Gold'
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                              : 'bg-gradient-to-r from-blue-600 to-blue-700'
                          }`}>
                            <img
                              src={customLogoUrl}
                              onError={(e) => { e.currentTarget.src = '/Logo.png'; }}
                              alt="logo"
                              className="h-4 w-auto object-contain"
                            />
                            <span className={`font-black text-[9px] tracking-wider uppercase ${
                              newsAlertAccent === 'Gold' ? 'text-slate-950 font-black' : newsAlertAccent === 'Blue' ? 'text-white' : 'text-[#FFED00]'
                            }`}>
                              {userProfile?.channelName || 'AI NEWSROOM'}
                            </span>
                          </div>
                          <span className={`font-black text-[9px] px-2 py-0.5 rounded uppercase shadow transition-all duration-300 ${
                            newsAlertAccent === 'Red'
                              ? 'bg-[#FFED00] text-slate-950'
                              : newsAlertAccent === 'Gold'
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'bg-white text-blue-950'
                          }`}>
                            {editDistrictHindi || 'मध्य प्रदेश'}
                          </span>
                        </div>

                        {/* Content Block */}
                        <div className="relative z-10 p-3 space-y-1.5">
                          <div className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide shadow transition-all duration-300 ${
                            newsAlertAccent === 'Red'
                              ? 'bg-[#E21A25] text-[#FFED00]'
                              : newsAlertAccent === 'Gold'
                              ? 'bg-[#FFED00] text-slate-950 font-black'
                              : 'bg-blue-600 text-white'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full pulse-live ${
                              newsAlertAccent === 'Gold' ? 'bg-slate-950' : newsAlertAccent === 'Blue' ? 'bg-white' : 'bg-[#FFED00]'
                            }`}></span>
                            BREAKING ALERT
                          </div>
                          <h3 className="text-white font-extrabold text-xs sm:text-sm leading-tight drop-shadow-md">
                            {editHeadline || 'हेडलाइन यहाँ दिखेगी'}
                          </h3>
                          <p className="text-[10px] text-slate-200 line-clamp-2 leading-snug">
                            {editSummary || 'खबर की समरी और मुख्य बातें यहाँ संक्षेप में प्रदर्शित होंगी।'}
                          </p>
                          <div className="pt-1.5 border-t border-white/20 flex items-center justify-between text-[8px] text-slate-300 font-medium">
                            <span>facebook.com/breakingnewswala</span>
                            <span className={`font-bold transition-colors ${
                              newsAlertAccent === 'Red' ? 'text-[#FFED00]' : newsAlertAccent === 'Gold' ? 'text-amber-300' : 'text-cyan-300'
                            }`}>
                              @breakingnewswala
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Pill */}
                    <button
                      type="button"
                      onClick={() => setEditCardTemplate('News-Alert')}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        editCardTemplate === 'News-Alert'
                          ? 'bg-[#E21A25] text-white shadow-md shadow-red-900/40'
                          : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {editCardTemplate === 'News-Alert' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#FFED00]" />
                          <span>चयनित (News-Alert)</span>
                        </>
                      ) : (
                        <span>News-Alert फॉर्मेट चुनें</span>
                      )}
                    </button>
                  </div>

                  {/* ---------------- 2. Minimalist Template ---------------- */}
                  <div
                    onClick={() => setEditCardTemplate('Minimalist')}
                    className={`rounded-2xl p-3 bg-[#0B0F19] border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                      editCardTemplate === 'Minimalist'
                        ? 'border-amber-500 shadow-[0_0_24px_rgba(245,158,11,0.35)] ring-2 ring-[#FFED00]/60'
                        : 'border-slate-800 hover:border-slate-600 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Top Status */}
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
                        <span className="text-xs font-bold text-white">2. Minimalist</span>
                      </div>
                      {editCardTemplate === 'Minimalist' ? (
                        <span className="text-[10px] bg-amber-600 text-white font-extrabold px-2 py-0.5 rounded shadow flex items-center gap-1">
                          <Check className="w-3 h-3 text-[#FFED00]" />
                          <span>पब्लिश हेतु चयनित</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 hover:text-white">
                          चुनने हेतु क्लिक करें
                        </span>
                      )}
                    </div>

                    {/* Graphic Preview Container */}
                    <div className="flex justify-center bg-black/60 p-2 rounded-xl">
                      <div className="w-full max-w-[280px] graphic-card-ratio rounded-xl overflow-hidden shadow-2xl relative border border-amber-500/60 flex flex-col justify-between bg-slate-950">
                        <img
                          src={editingCard.image}
                          alt="preview"
                          style={getFilterStyle(graphicFilter)}
                          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950/95"></div>

                        {/* Minimalist Top Tag */}
                        <div className="relative z-10 p-3 flex items-center justify-between border-b border-amber-500/20 bg-slate-950/40 backdrop-blur-sm">
                          <span className="text-[9px] font-black tracking-widest text-amber-300 uppercase">
                            📍 {editDistrictHindi || 'मध्य प्रदेश'} | विशेष रिपोर्ट
                          </span>
                          <span className="text-[8px] font-mono text-slate-400">
                            BNW EDITORIAL
                          </span>
                        </div>

                        {/* Minimalist Center Headline & Summary */}
                        <div className="relative z-10 px-4 py-2 space-y-2">
                          <div className="w-6 h-[2px] bg-amber-400"></div>
                          <h3 className="text-white font-bold text-sm leading-snug tracking-tight">
                            "{editHeadline || 'हेडलाइन यहाँ दिखेगी'}"
                          </h3>
                          <p className="text-[10px] text-slate-300 leading-relaxed font-light border-l border-amber-400/50 pl-2">
                            {editSummary || 'संक्षिप्त व सटीक विश्लेषण। ग्राउंड रिपोर्ट की प्रमुख बातें यहाँ व्यवस्थित रूप में।'}
                          </p>
                        </div>

                        {/* Minimalist Footer */}
                        <div className="relative z-10 p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[8px] text-slate-400">
                          <span className="font-semibold text-slate-300">BREAKING NEWS WALA</span>
                          <span className="text-amber-400 font-mono">INSIGHT DESK</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Pill */}
                    <button
                      type="button"
                      onClick={() => setEditCardTemplate('Minimalist')}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        editCardTemplate === 'Minimalist'
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                          : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {editCardTemplate === 'Minimalist' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#FFED00]" />
                          <span>चयनित (Minimalist)</span>
                        </>
                      ) : (
                        <span>Minimalist फॉर्मेट चुनें</span>
                      )}
                    </button>
                  </div>

                  {/* ---------------- 3. Poll-Format Template ---------------- */}
                  <div
                    onClick={() => setEditCardTemplate('Poll-Format')}
                    className={`rounded-2xl p-3 bg-[#0B0F19] border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                      editCardTemplate === 'Poll-Format'
                        ? 'border-blue-500 shadow-[0_0_24px_rgba(59,130,246,0.35)] ring-2 ring-blue-300/60'
                        : 'border-slate-800 hover:border-slate-600 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Top Status */}
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-300" />
                        <span className="text-xs font-bold text-white">3. Poll-Format</span>
                      </div>
                      {editCardTemplate === 'Poll-Format' ? (
                        <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded shadow flex items-center gap-1">
                          <Check className="w-3 h-3 text-[#FFED00]" />
                          <span>पब्लिश हेतु चयनित</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 hover:text-white">
                          चुनने हेतु क्लिक करें
                        </span>
                      )}
                    </div>

                    {/* Graphic Preview Container */}
                    <div className="flex justify-center bg-black/60 p-2 rounded-xl">
                      <div className="w-full max-w-[280px] graphic-card-ratio rounded-xl overflow-hidden shadow-2xl relative border border-blue-500/70 flex flex-col justify-between bg-[#0B1120]">
                        <img
                          src={editingCard.image}
                          alt="preview"
                          style={getFilterStyle(graphicFilter)}
                          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/80 to-[#0B1120]/90"></div>

                        {/* Poll Top Banner */}
                        <div className="relative z-10 p-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-between shadow">
                          <span className="text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#FFED00]" />
                            जनता की राय | PUBLIC POLL
                          </span>
                          <span className="bg-[#FFED00] text-slate-950 font-black text-[8px] px-1.5 py-0.2 rounded">
                            {editDistrictHindi || 'मध्य प्रदेश'}
                          </span>
                        </div>

                        {/* Poll Question & Voting Bars */}
                        <div className="relative z-10 p-3 space-y-2">
                          <h3 className="text-white font-bold text-xs leading-snug text-center">
                            {editPollQuestion || (editHeadline ? `${editHeadline.slice(0, 50)}... पर राय?` : 'इस खबर पर आपकी क्या राय है?')}
                          </h3>

                          {editSummary && (
                            <p className="text-[9px] text-blue-200 line-clamp-1 italic text-center bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                              मुद्दा: {editSummary}
                            </p>
                          )}

                          {/* Option A */}
                          <div className="bg-slate-900/90 border border-emerald-500/50 rounded-lg p-2 space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-emerald-300">[A] {editPollOptionA || 'हाँ, पूर्ण समर्थन'}</span>
                              <span className="text-emerald-400 font-mono">74%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full w-[74%] rounded-full"></div>
                            </div>
                          </div>

                          {/* Option B */}
                          <div className="bg-slate-900/90 border border-red-500/50 rounded-lg p-2 space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-red-300">[B] {editPollOptionB || 'नहीं, पुनर्विचार हो'}</span>
                              <span className="text-red-400 font-mono">26%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-red-500 h-full w-[26%] rounded-full"></div>
                            </div>
                          </div>

                          <div className="text-center pt-0.5">
                            <span className="bg-[#FFED00] text-slate-950 font-black text-[8px] px-2 py-0.5 rounded-full shadow">
                              👉 नीचे कमेंट में अपनी राय लिखें!
                            </span>
                          </div>
                        </div>

                        {/* Poll Footer */}
                        <div className="relative z-10 p-2 bg-slate-950/80 border-t border-slate-800 text-center text-[8px] text-slate-400">
                          वोटिंग जारी • 12,450+ वोट्स दर्ज • @BreakingNewsWala
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Pill */}
                    <button
                      type="button"
                      onClick={() => setEditCardTemplate('Poll-Format')}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        editCardTemplate === 'Poll-Format'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                          : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {editCardTemplate === 'Poll-Format' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#FFED00]" />
                          <span>चयनित (Poll-Format)</span>
                        </>
                      ) : (
                        <span>Poll-Format फॉर्मेट चुनें</span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* ================= SINGLE FOCUSED VIEW ================= */
                <div className="flex flex-col items-center p-4 bg-[#0B0F19] rounded-2xl border border-slate-800 space-y-4">
                  {/* Template Switcher Tabs */}
                  <div className="flex items-center gap-2 p-1 bg-black/60 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditCardTemplate('News-Alert')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        editCardTemplate === 'News-Alert'
                          ? 'bg-[#E21A25] text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-[#FFED00]" />
                      <span>1. News-Alert</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditCardTemplate('Minimalist')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        editCardTemplate === 'Minimalist'
                          ? 'bg-amber-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-200" />
                      <span>2. Minimalist</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditCardTemplate('Poll-Format')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        editCardTemplate === 'Poll-Format'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-blue-200" />
                      <span>3. Poll-Format</span>
                    </button>
                  </div>

                  {/* Render the Single Selected Template */}
                  {/* Single Mode Preview Toolbar: Layout Accent & Apply Filter */}
                  <div className="w-full max-w-[340px] flex items-center justify-between gap-1.5 px-2.5 py-1.5 bg-[#141A28] rounded-xl border border-slate-700/80 shadow-md mb-2">
                    <button
                      type="button"
                      onClick={cycleNewsAlertAccent}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-[#E21A25]/25 hover:bg-[#E21A25]/45 text-[#FFED00] hover:text-white border border-[#E21A25]/60 hover:border-[#FFED00]/70 transition-all cursor-pointer shadow hover:scale-105 active:scale-95 shrink-0"
                      title="ग्राफिक एक्सेंट रंग बदलें: Red → Gold → Blue"
                    >
                      <RotateCw className="w-2.5 h-2.5 text-[#FFED00]" />
                      <span>Toggle Layout</span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                        newsAlertAccent === 'Red'
                          ? 'bg-red-600 text-white'
                          : newsAlertAccent === 'Gold'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-blue-600 text-white'
                      }`}>
                        {newsAlertAccent}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={cycleGraphicFilter}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-blue-600/25 hover:bg-blue-600/45 text-cyan-300 hover:text-white border border-blue-500/60 hover:border-cyan-300/80 transition-all cursor-pointer shadow hover:scale-105 active:scale-95 shrink-0"
                      title="इमेज फिल्टर बदलें: None → Grayscale → Sepia → High-Contrast"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
                      <span>Apply Filter</span>
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-slate-900/90 text-cyan-200 border border-slate-700">
                        {graphicFilter === 'none' ? 'None' : graphicFilter === 'grayscale' ? 'Grayscale' : graphicFilter === 'sepia' ? 'Sepia' : 'Hi-Con'}
                      </span>
                    </button>
                  </div>

                  {editCardTemplate === 'News-Alert' && (
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-full max-w-[340px] graphic-card-ratio rounded-xl overflow-hidden shadow-2xl relative border-2 flex flex-col justify-between bg-black transition-all duration-300 ${
                        newsAlertAccent === 'Red'
                          ? 'border-red-600/90 shadow-[0_0_24px_rgba(226,26,37,0.4)]'
                          : newsAlertAccent === 'Gold'
                          ? 'border-amber-500/90 shadow-[0_0_24px_rgba(245,158,11,0.4)]'
                          : 'border-blue-500/90 shadow-[0_0_24px_rgba(37,99,235,0.4)]'
                      }`}>
                        <img
                          src={editingCard.image}
                          alt="preview"
                          style={getFilterStyle(graphicFilter)}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/80"></div>
                        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                          newsAlertAccent === 'Red'
                            ? 'bg-gradient-to-t from-red-950/40 via-transparent to-red-950/20'
                            : newsAlertAccent === 'Gold'
                            ? 'bg-gradient-to-t from-amber-950/40 via-transparent to-amber-950/20'
                            : 'bg-gradient-to-t from-blue-950/40 via-transparent to-blue-950/20'
                        }`}></div>

                        <div className="relative z-10 p-3 flex items-center justify-between">
                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded shadow transition-all duration-300 ${
                            newsAlertAccent === 'Red'
                              ? 'bg-[#E21A25]'
                              : newsAlertAccent === 'Gold'
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                              : 'bg-gradient-to-r from-blue-600 to-blue-700'
                          }`}>
                            <img src={customLogoUrl} onError={(e) => { e.currentTarget.src = '/Logo.png'; }} alt="logo" className="h-4 w-auto object-contain" />
                            <span className={`font-black text-[9px] tracking-wider uppercase ${
                              newsAlertAccent === 'Gold' ? 'text-slate-950 font-black' : newsAlertAccent === 'Blue' ? 'text-white' : 'text-[#FFED00]'
                            }`}>
                              BREAKING WALA
                            </span>
                          </div>
                          <span className={`font-black text-[9px] px-2 py-0.5 rounded uppercase shadow transition-all duration-300 ${
                            newsAlertAccent === 'Red'
                              ? 'bg-[#FFED00] text-slate-950'
                              : newsAlertAccent === 'Gold'
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'bg-white text-blue-950'
                          }`}>
                            {editDistrictHindi || 'मध्य प्रदेश'}
                          </span>
                        </div>
                        <div className="relative z-10 p-3.5 space-y-1.5">
                          <div className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide shadow transition-all duration-300 ${
                            newsAlertAccent === 'Red'
                              ? 'bg-[#E21A25] text-[#FFED00]'
                              : newsAlertAccent === 'Gold'
                              ? 'bg-[#FFED00] text-slate-950 font-black'
                              : 'bg-blue-600 text-white'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full pulse-live ${
                              newsAlertAccent === 'Gold' ? 'bg-slate-950' : newsAlertAccent === 'Blue' ? 'bg-white' : 'bg-[#FFED00]'
                            }`}></span>
                            BREAKING ALERT
                          </div>
                          <h3 className="text-white font-extrabold text-sm leading-tight drop-shadow-md">
                            {editHeadline || 'हेडलाइन यहाँ दिखेगी'}
                          </h3>
                          <p className="text-[11px] text-slate-200 line-clamp-2 leading-snug">
                            {editSummary || 'खबर की समरी और मुख्य बातें यहाँ संक्षेप में प्रदर्शित होंगी।'}
                          </p>
                          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[8px] text-slate-300 font-medium">
                            <span>facebook.com/breakingnewswala</span>
                            <span className={`font-bold transition-colors ${
                              newsAlertAccent === 'Red' ? 'text-[#FFED00]' : newsAlertAccent === 'Gold' ? 'text-amber-300' : 'text-cyan-300'
                            }`}>
                              @breakingnewswala
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {editCardTemplate === 'Minimalist' && (
                    <div className="w-full max-w-[340px] graphic-card-ratio rounded-xl overflow-hidden shadow-2xl relative border-2 border-amber-500/60 flex flex-col justify-between bg-slate-950">
                      <img
                        src={editingCard.image}
                        alt="preview"
                        style={getFilterStyle(graphicFilter)}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950/95"></div>
                      <div className="relative z-10 p-3 flex items-center justify-between border-b border-amber-500/20 bg-slate-950/40 backdrop-blur-sm">
                        <span className="text-[9px] font-black tracking-widest text-amber-300 uppercase">
                          📍 {editDistrictHindi || 'मध्य प्रदेश'} | विशेष रिपोर्ट
                        </span>
                        <span className="text-[8px] font-mono text-slate-400">BNW EDITORIAL</span>
                      </div>
                      <div className="relative z-10 px-4 py-3 space-y-2">
                        <div className="w-6 h-[2px] bg-amber-400"></div>
                        <h3 className="text-white font-bold text-sm leading-snug tracking-tight">
                          "{editHeadline || 'हेडलाइन यहाँ दिखेगी'}"
                        </h3>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-light border-l border-amber-400/50 pl-2">
                          {editSummary || 'संक्षिप्त व सटीक विश्लेषण। ग्राउंड रिपोर्ट की प्रमुख बातें यहाँ व्यवस्थित रूप में।'}
                        </p>
                      </div>
                      <div className="relative z-10 p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[8px] text-slate-400">
                        <span className="font-semibold text-slate-300">BREAKING NEWS WALA</span>
                        <span className="text-amber-400 font-mono">INSIGHT DESK</span>
                      </div>
                    </div>
                  )}

                  {editCardTemplate === 'Poll-Format' && (
                    <div className="w-full max-w-[340px] graphic-card-ratio rounded-xl overflow-hidden shadow-2xl relative border-2 border-blue-500/70 flex flex-col justify-between bg-[#0B1120]">
                      <img
                        src={editingCard.image}
                        alt="preview"
                        style={getFilterStyle(graphicFilter)}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/80 to-[#0B1120]/90"></div>
                      <div className="relative z-10 p-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-between shadow">
                        <span className="text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#FFED00]" />
                          जनता की राय | PUBLIC POLL
                        </span>
                        <span className="bg-[#FFED00] text-slate-950 font-black text-[8px] px-1.5 py-0.2 rounded">
                          {editDistrictHindi}
                        </span>
                      </div>
                      <div className="relative z-10 p-3 space-y-2">
                        <h3 className="text-white font-bold text-xs leading-snug text-center">
                          {editPollQuestion}
                        </h3>
                        {editSummary && (
                          <p className="text-[9px] text-blue-200 line-clamp-1 italic text-center bg-blue-950/60 px-2 py-0.5 rounded">
                            मुद्दा: {editSummary}
                          </p>
                        )}
                        <div className="bg-slate-900/90 border border-emerald-500/50 rounded-lg p-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-emerald-300">[A] {editPollOptionA}</span>
                            <span className="text-emerald-400 font-mono">74%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[74%] rounded-full"></div>
                          </div>
                        </div>
                        <div className="bg-slate-900/90 border border-red-500/50 rounded-lg p-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-red-300">[B] {editPollOptionB}</span>
                            <span className="text-red-400 font-mono">26%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full w-[26%] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="relative z-10 p-2 bg-slate-950/80 border-t border-slate-800 text-center text-[8px] text-slate-400">
                        वोटिंग जारी • 12,450+ वोट्स दर्ज • @BreakingNewsWala
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post Caption Field */}
            <div className="bg-[#0D111A] border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Facebook पोस्ट कैप्शन व हैशटैग्स:
              </label>
              <textarea
                rows={2}
                value={editCaption}
                onChange={e => setEditCaption(e.target.value)}
                placeholder="Facebook पोस्ट कैप्शन यहाँ लिखें..."
                className="w-full bg-[#161C2C] border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-[#E21A25]"
              ></textarea>
            </div>

            {/* Modal Footer Bar */}
            <div className="pt-3 border-t border-[#232B3E] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">चयनित लेआउट:</span>
                <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                  editCardTemplate === 'News-Alert'
                    ? 'bg-[#E21A25]/20 text-[#FFED00] border border-[#E21A25]/50'
                    : editCardTemplate === 'Minimalist'
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/50'
                    : 'bg-blue-600/20 text-blue-300 border border-blue-500/50'
                }`}>
                  <Sparkles className="w-3 h-3" />
                  <span>{editCardTemplate}</span>
                </span>
                <span className="text-[11px] text-slate-500 hidden md:inline">
                  (पब्लिश करते समय यह डिजाइन फेसबुक पर भेजा जाएगा)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => downloadHighResCard(editCardTemplate, editHeadline, editSummary, editDistrictHindi, editingCard.image)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
                  title="1080x1350 HD PNG डाउनलोड करें"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>1080x1350 PNG डाउनलोड</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium cursor-pointer transition-colors text-xs sm:text-sm"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={saveEditAndPublish}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/50 cursor-pointer transition-all text-xs sm:text-sm"
                >
                  <Check className="w-4 h-4 text-[#FFED00]" />
                  <span>सेव करें और ({editCardTemplate}) पब्लिश करें</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: JSON VIEWER ================= */}
      {jsonModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#121622] w-full max-w-3xl rounded-2xl border border-[#232B3E] p-5 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#FFED00]" />
                <h2 className="text-base font-bold text-white">
                  स्ट्रक्चर्ड JSON पब्लिशिंग स्कीमा आउटपुट ({jsonModalItem.districtHindi})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(jsonModalItem.jsonOutput, null, 2))}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#FFED00]" />
                  <span>कॉपी JSON</span>
                </button>
                <button
                  onClick={() => setJsonModalItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800">
              <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(jsonModalItem.jsonOutput, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD RULE ================= */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121622] w-full max-w-md rounded-2xl border border-[#232B3E] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#232B3E] pb-2.5">
              <h3 className="text-sm font-bold text-white">नया RSS ➡️ Facebook पेज रूल बनाएं</h3>
              <button
                onClick={() => setShowRuleModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">रूल नाम / जिला:</label>
                <input
                  type="text"
                  placeholder="उदा: Ujjain Breaking Feed"
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                  className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">RSS / फीड / चैनल लिंक:</label>
                <input
                  type="url"
                  placeholder="https://breakingnewswala.in/feeds/ujjain.rss"
                  value={newRuleUrl}
                  onChange={e => setNewRuleUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">मैप किया गया Facebook पेज:</label>
                <select
                  value={newRulePage}
                  onChange={e => setNewRulePage(e.target.value)}
                  className="w-full bg-slate-900 border border-[#232B3E] rounded-xl p-2.5 text-white"
                >
                  <option>Breaking News Wala Ujjain</option>
                  <option>Breaking News Wala Sagar</option>
                  <option>Breaking News Wala Rewa</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#232B3E] text-xs">
              <button
                onClick={() => setShowRuleModal(false)}
                className="px-3 py-2 bg-slate-800 rounded-xl text-slate-300 cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                onClick={() => {
                  if (!newRuleName) return;
                  setRulesList(prev => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      name: newRuleName,
                      mode: 'एडमिन अप्रूवल मोड',
                      url: newRuleUrl || 'https://breakingnewswala.in/feeds/auto.xml',
                      target: newRulePage
                    }
                  ]);
                  setShowRuleModal(false);
                  setNewRuleName('');
                  setNewRuleUrl('');
                  showToast('नया RSS ऑटोमेशन रूल सफलतापूर्वक एक्टिव हुआ!');
                }}
                className="px-4 py-2 bg-[#E21A25] text-white font-bold rounded-xl shadow cursor-pointer"
              >
                टास्क एक्टिव करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CHANNEL SETTINGS & SOCIAL AUTH MODAL ================= */}
      {showChannelSettingsModal && (
        <ChannelSettingsModal
          userProfile={userProfile}
          currentUser={currentUser}
          onClose={() => setShowChannelSettingsModal(false)}
          onSave={handleSaveChannelProfile}
        />
      )}

      {/* ================= MOBILE BOTTOM FOOTER NAVIGATION ================= */}
      {/* User requested: mobile version bottom footer navigation as before, made ultra-stylish */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[#07090F]/95 backdrop-blur-2xl border-t border-[#1C2438] z-50 px-1.5 py-1.5 flex items-center justify-around shadow-[0_-12px_35px_rgba(0,0,0,0.9)]">
        {/* 0. Smart News Feed Hub (Phase 3) */}
        <button
          onClick={() => setActiveView('newsFeedHub')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition-all duration-200 cursor-pointer relative ${
            activeView === 'newsFeedHub'
              ? 'text-[#FFED00]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeView === 'newsFeedHub'
              ? 'bg-gradient-to-t from-[#E21A25] to-[#B70F18] shadow-[0_0_16px_rgba(226,26,37,0.7)] text-[#FFED00] ring-1 ring-[#FFED00]/40 scale-105'
              : 'hover:bg-slate-800/60'
          }`}>
            <Radio className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter">न्यूज़ फीड</span>
        </button>

        {/* 1. Generator Queue */}
        <button
          onClick={() => setActiveView('generatorQueue')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition-all duration-200 cursor-pointer relative ${
            activeView === 'generatorQueue'
              ? 'text-[#FFED00]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeView === 'generatorQueue'
              ? 'bg-gradient-to-t from-[#E21A25] to-[#B70F18] shadow-[0_0_16px_rgba(226,26,37,0.7)] text-[#FFED00] ring-1 ring-[#FFED00]/40 scale-105'
              : 'hover:bg-slate-800/60'
          }`}>
            <Newspaper className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter">ऑटो-ग्राफिक</span>
          {pendingCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-[#E21A25] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-slate-950 shadow">
              {pendingCount}
            </span>
          )}
        </button>

        {/* 2. Video Studio */}
        <button
          onClick={() => setActiveView('videoStudio')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition-all duration-200 cursor-pointer relative ${
            activeView === 'videoStudio'
              ? 'text-[#FFED00]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeView === 'videoStudio'
              ? 'bg-gradient-to-t from-[#E21A25] to-[#B70F18] shadow-[0_0_16px_rgba(226,26,37,0.7)] text-[#FFED00] ring-1 ring-[#FFED00]/40 scale-105'
              : 'hover:bg-slate-800/60'
          }`}>
            <Clapperboard className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter">वीडियो स्टूडियो</span>
        </button>

        {/* 3. Distribution Hub */}
        <button
          onClick={() => setActiveView('distributionHub')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition-all duration-200 cursor-pointer relative ${
            activeView === 'distributionHub'
              ? 'text-[#FFED00]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeView === 'distributionHub'
              ? 'bg-gradient-to-t from-[#E21A25] to-[#B70F18] shadow-[0_0_16px_rgba(226,26,37,0.7)] text-[#FFED00] ring-1 ring-[#FFED00]/40 scale-105'
              : 'hover:bg-slate-800/60'
          }`}>
            <Share2 className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter">ब्रॉडकास्ट</span>
        </button>

        {/* 4. Viral Radar */}
        <button
          onClick={() => setActiveView('viralRadar')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition-all duration-200 cursor-pointer relative ${
            activeView === 'viralRadar'
              ? 'text-[#FFED00]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeView === 'viralRadar'
              ? 'bg-gradient-to-t from-[#E21A25] to-[#B70F18] shadow-[0_0_16px_rgba(226,26,37,0.7)] text-[#FFED00] ring-1 ring-[#FFED00]/40 scale-105'
              : 'hover:bg-slate-800/60'
          }`}>
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter">ट्रेंडिंग</span>
        </button>

        {/* 5. Health Check */}
        <button
          onClick={() => setActiveView('healthCheck')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition-all duration-200 cursor-pointer relative ${
            activeView === 'healthCheck'
              ? 'text-[#FFED00]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeView === 'healthCheck'
              ? 'bg-gradient-to-t from-[#E21A25] to-[#B70F18] shadow-[0_0_16px_rgba(226,26,37,0.7)] text-[#FFED00] ring-1 ring-[#FFED00]/40 scale-105'
              : 'hover:bg-slate-800/60'
          }`}>
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter">हेल्थ ({averageLatency}m)</span>
        </button>

        {/* 6. Analytics 30D */}
        <button
          onClick={() => setActiveView('analyticsView')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition-all duration-200 cursor-pointer relative ${
            activeView === 'analyticsView'
              ? 'text-[#FFED00]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeView === 'analyticsView'
              ? 'bg-gradient-to-t from-[#E21A25] to-[#B70F18] shadow-[0_0_16px_rgba(226,26,37,0.7)] text-[#FFED00] ring-1 ring-[#FFED00]/40 scale-105'
              : 'hover:bg-slate-800/60'
          }`}>
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter">30D ग्रोथ</span>
        </button>

        {/* 7. Automation & Scheduling (Phase 4) */}
        <button
          onClick={() => setActiveView('accountsConfig')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition-all duration-200 cursor-pointer relative ${
            activeView === 'accountsConfig'
              ? 'text-[#FFED00]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeView === 'accountsConfig'
              ? 'bg-gradient-to-t from-[#E21A25] to-[#B70F18] shadow-[0_0_16px_rgba(226,26,37,0.7)] text-[#FFED00] ring-1 ring-[#FFED00]/40 scale-105'
              : 'hover:bg-slate-800/60'
          }`}>
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter">ऑटोमेशन</span>
        </button>
      </nav>

      {/* ================= FLOATING TOAST ================= */}
      <div
        className={`fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 bg-[#121622] border-2 border-[#E21A25] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-300 pointer-events-none ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-[#E21A25]/20 text-[#FFED00] flex items-center justify-center shrink-0">
          <Check className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-white">{toast.title}</div>
          <div className="text-[11px] text-slate-300">{toast.message}</div>
        </div>
      </div>
    </div>
  );
}
