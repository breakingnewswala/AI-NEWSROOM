import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Check,
  CheckCircle2,
  Building2,
  MapPin,
  Image as ImageIcon,
  Share2,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Radio,
  RotateCw,
  Sparkles,
  User,
  Phone,
  Mail,
  Globe,
  Palette,
  Hash,
  Shield,
  Bell,
  Clock,
  Key,
  Smartphone,
  AlertTriangle,
  Info,
  Trash2,
  Plus
} from 'lucide-react';
import type { UserProfile } from '../lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

interface AdminProfileModalProps {
  userProfile: UserProfile | null;
  currentUser: FirebaseUser | null;
  onClose: () => void;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
  initialTab?: 'personal' | 'branding' | 'social' | 'captions' | 'security' | 'notifications';
}

const ALL_INDIAN_STATES: Record<string, string[]> = {
  'मध्य प्रदेश': [
    'भोपाल', 'इंदौर', 'जबलपुर', 'ग्वालियर', 'उज्जैन', 'सागर', 'रीवा', 'सतना',
    'छिंदवाड़ा', 'रतलाम', 'मुरैना', 'भिंड', 'शिवपुरी', 'विदिशा', 'सीहोर', 'देवास',
    'खंडवा', 'खरगोन', 'नीमच', 'मंदसौर', 'धार', 'होशंगाबाद (नर्मदापुरम)', 'बैतूल',
    'बालाघाट', 'सिवनी', 'मंडला', 'डिंडौरी', 'कटनी', 'दमोह', 'पन्ना', 'छतरपुर',
    'टीकमगढ़', 'निवाड़ी', 'शहडोल', 'उमरिया', 'अनूपपुर', 'सीधी', 'सिंगरौली',
    'राजगढ़', 'शाजापुर', 'आगर मालवा', 'गुना', 'अशोकनगर', 'श्योपुर', 'बड़वानी',
    'बुरहानपुर', 'अलीराजपुर', 'झाबुआ', 'हरदा', 'रायसेन'
  ],
  'उत्तर प्रदेश': ['लखनऊ', 'वाराणसी', 'कानपुर', 'प्रयागराज', 'आगरा', 'नोएडा', 'गाजियाबाद', 'गोरखपुर', 'मेरठ', 'झांसी'],
  'राजस्थान': ['जयपुर', 'जोधपुर', 'उदयपुर', 'कोटा', 'अजमेर', 'बीकानेर', 'अलवर', 'भरतपुर'],
  'बिहार': ['पटना', 'गया', 'मुजफ्फरपुर', 'भागलपुर', 'दरभंगा', 'पूर्णिया', 'आरा'],
  'दिल्ली (NCT)': ['नई दिल्ली', 'उत्तर दिल्ली', 'दक्षिण दिल्ली', 'पूर्वी दिल्ली', 'पश्चिम दिल्ली', 'मध्य दिल्ली'],
  'महाराष्ट्र': ['मुंबई', 'पुणे', 'नागपुर', 'ठाणे', 'नासिक', 'औरंगाबाद', 'कोल्हापुर'],
  'छत्तीसगढ़': ['रायपुर', 'बिलासपुर', 'दुर्ग', 'भिलाई', 'कोरबा', 'राजनांदगांव', 'जगदलपुर']
};

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  userProfile,
  currentUser,
  onClose,
  onSave,
  initialTab = 'personal'
}) => {
  const [activeTab, setActiveTab] = useState<
    'personal' | 'branding' | 'social' | 'captions' | 'security' | 'notifications'
  >(initialTab);

  // Tab 1: Personal Info
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [email] = useState(userProfile?.email || currentUser?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [altWhatsapp, setAltWhatsapp] = useState(userProfile?.altWhatsapp || '');
  const [designation, setDesignation] = useState(userProfile?.designation || 'वरिष्ठ ब्यूरो चीफ / संपादक');
  const [organization, setOrganization] = useState(userProfile?.organization || 'Breaking News Network');
  const [websiteUrl, setWebsiteUrl] = useState(userProfile?.websiteUrl || 'https://breakingnewswala.com');
  const [selectedState, setSelectedState] = useState(userProfile?.state || 'मध्य प्रदेश');
  const [selectedDistrict, setSelectedDistrict] = useState(userProfile?.district || 'भोपाल');
  const [city, setCity] = useState(userProfile?.city || 'भोपाल');
  const [preferredLanguage, setPreferredLanguage] = useState(userProfile?.preferredLanguage || 'हिंदी');
  const [timezone, setTimezone] = useState(userProfile?.timezone || 'IST (UTC+5:30)');

  // Tab 2: Channel & Brand Settings
  const [channelName, setChannelName] = useState(userProfile?.channelName || '');
  const [channelLogo, setChannelLogo] = useState(userProfile?.channelLogo || '/Logo.png');
  const [brandColor, setBrandColor] = useState(userProfile?.brandColor || '#E21A25');
  const [cardTheme, setCardTheme] = useState<'News-Alert' | 'Minimalist' | 'Poll-Format' | 'Breaking-Flash'>(
    userProfile?.cardTheme || 'News-Alert'
  );
  const [headlineFont, setHeadlineFont] = useState(userProfile?.headlineFont || 'Noto Sans Devanagari');
  const [headlineFontSize, setHeadlineFontSize] = useState(userProfile?.headlineFontSize || 'Large (28px)');
  const [logoPosition, setLogoPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>(
    userProfile?.logoPosition || 'top-right'
  );
  const [footerText, setFooterText] = useState(
    userProfile?.footerText || 'सटीक एवं निष्पक्ष पत्रकारिता • ब्रेकिंग न्यूज वाला'
  );
  const [socialHandle, setSocialHandle] = useState(userProfile?.socialHandle || '@breakingnewswala');
  const [showContactInfo, setShowContactInfo] = useState(userProfile?.showContactInfo ?? true);

  // Tab 3: Social Media Connections
  const [facebookConnected, setFacebookConnected] = useState(userProfile?.facebookConnected ?? false);
  const [youtubeConnected, setYoutubeConnected] = useState(userProfile?.youtubeConnected ?? false);
  const [instagramConnected, setInstagramConnected] = useState(userProfile?.instagramConnected ?? false);
  const [twitterConnected, setTwitterConnected] = useState(userProfile?.twitterConnected ?? false);
  const [linkedinConnected, setLinkedinConnected] = useState(userProfile?.linkedinConnected ?? false);

  // Tab 4: Caption & Hashtag Settings
  const [captionStyle, setCaptionStyle] = useState<'formal' | 'breaking' | 'concise' | 'detailed' | 'custom'>(
    userProfile?.captionStyle || 'breaking'
  );
  const [defaultCaptionLang, setDefaultCaptionLang] = useState(userProfile?.defaultCaptionLang || 'hi');
  const [captionLength, setCaptionLength] = useState<'short' | 'medium' | 'detailed'>(
    userProfile?.captionLength || 'medium'
  );
  const [captionTone, setCaptionTone] = useState<'factual' | 'urgent' | 'engaging'>(
    userProfile?.captionTone || 'urgent'
  );
  const [useEmojis, setUseEmojis] = useState(userProfile?.useEmojis ?? true);
  const [includeChannelName, setIncludeChannelName] = useState(userProfile?.includeChannelName ?? true);
  const [includeWebsiteUrl, setIncludeWebsiteUrl] = useState(userProfile?.includeWebsiteUrl ?? true);
  const [permanentHashtags, setPermanentHashtags] = useState<string[]>(
    userProfile?.permanentHashtags || ['#BreakingNews', '#MPNews', '#LatestUpdate', '#NewsToday']
  );
  const [newTagInput, setNewTagInput] = useState('');
  const [tagError, setTagError] = useState('');

  // Tab 5: Security & Login
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(userProfile?.twoFactorEnabled ?? false);

  // Tab 6: Notifications
  const [notifNewImportant, setNotifNewImportant] = useState(userProfile?.notifNewImportant ?? true);
  const [notifCategoryNews, setNotifCategoryNews] = useState(userProfile?.notifCategoryNews ?? true);
  const [notifGraphicReady, setNotifGraphicReady] = useState(userProfile?.notifGraphicReady ?? true);
  const [notifPublishSuccess, setNotifPublishSuccess] = useState(userProfile?.notifPublishSuccess ?? true);
  const [notifPublishFailed, setNotifPublishFailed] = useState(userProfile?.notifPublishFailed ?? true);
  const [notifSocialExpired, setNotifSocialExpired] = useState(userProfile?.notifSocialExpired ?? true);
  const [notifRssError, setNotifRssError] = useState(userProfile?.notifRssError ?? true);
  const [notifSecurityAlert, setNotifSecurityAlert] = useState(userProfile?.notifSecurityAlert ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        if (result) {
          setChannelLogo(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addHashtag = () => {
    setTagError('');
    const cleanTag = newTagInput.trim().replace(/^#+/, '');
    if (!cleanTag) return;
    if (permanentHashtags.length >= 5) {
      setTagError('अधिकतम 5 स्थायी हैशटैग ही जोड़े जा सकते हैं।');
      return;
    }
    const fullTag = `#${cleanTag}`;
    if (permanentHashtags.includes(fullTag)) {
      setTagError('यह हैशटैग पहले से सूची में है।');
      return;
    }
    setPermanentHashtags([...permanentHashtags, fullTag]);
    setNewTagInput('');
  };

  const removeHashtag = (tagToRemove: string) => {
    setTagError('');
    setPermanentHashtags(permanentHashtags.filter(t => t !== tagToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        displayName: displayName.trim() || 'Newsroom Admin',
        phone,
        altWhatsapp,
        designation,
        organization,
        websiteUrl,
        state: selectedState,
        district: selectedDistrict,
        city,
        preferredLanguage,
        timezone,
        channelName: channelName.trim() || 'मेरा न्यूज़ चैनल',
        channelLogo,
        brandColor,
        cardTheme,
        headlineFont,
        headlineFontSize,
        logoPosition,
        footerText,
        socialHandle,
        showContactInfo,
        facebookConnected,
        youtubeConnected,
        instagramConnected,
        twitterConnected,
        linkedinConnected,
        captionStyle,
        defaultCaptionLang,
        captionLength,
        captionTone,
        useEmojis,
        includeChannelName,
        includeWebsiteUrl,
        permanentHashtags,
        twoFactorEnabled,
        notifNewImportant,
        notifCategoryNews,
        notifGraphicReady,
        notifPublishSuccess,
        notifPublishFailed,
        notifSocialExpired,
        notifRssError,
        notifSecurityAlert
      });
      onClose();
    } catch (err) {
      console.error('Error saving profile settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-[#0B0F17] border-2 border-amber-500/50 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#232B3E] bg-gradient-to-r from-[#141A28] via-[#0E131F] to-[#141A28] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg font-black shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>एडमिन प्रोफाइल एवं ब्रांड सेटिंग्स सेंटर</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  userProfile?.role === 'MASTER_ADMIN'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-blue-600 text-white'
                }`}>
                  {userProfile?.role === 'MASTER_ADMIN' ? 'मास्टर एडमिन' : 'चैनल एडमिन'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
                {email} • आपकी ब्रांड थीम, सोशल मीडिया अकाउंट्स और ऑटो-सिंडिकेशन प्राथमिकताएँ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 py-2 border-b border-[#1E273A] bg-[#0A0D14] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'personal'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. व्यक्तिगत जानकारी</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'branding'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>2. ब्रांड व चैनल थीम</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'social'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>3. सोशल मीडिया अकाउंट्स</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('captions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'captions'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>4. कैप्शन व हैशटैग</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>5. सुरक्षा व लॉगिन</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notifications'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>6. नोटिफिकेशन प्राथमिकताएँ</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: Personal Info */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>पूरा नाम (Full Name):</span>
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="उदा: राजेश शर्मा"
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>आधिकारिक ईमेल (Email Address):</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 font-mono cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>मोबाइल नंबर (Mobile Number):</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98260 00000"
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-green-400" />
                    <span>वैकल्पिक WhatsApp नंबर:</span>
                  </label>
                  <input
                    type="tel"
                    value={altWhatsapp}
                    onChange={(e) => setAltWhatsapp(e.target.value)}
                    placeholder="+91 94250 00000"
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>पद एवं भूमिका (Designation):</span>
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="उदा: ब्यूरो हेड / विशेष संवाददाता"
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>मीडिया संस्थान / वेबसाइट URL:</span>
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://breakingnewswala.com"
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Dynamic State & District Hierarchy */}
              <div className="p-4 rounded-2xl bg-[#121622]/80 border border-[#232B3E] space-y-3">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>भौगोलिक कवरेज व लोकेशन पदानुक्रम (Location Hierarchy):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-semibold">राज्य (State):</label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        const newState = e.target.value;
                        setSelectedState(newState);
                        const districts = ALL_INDIAN_STATES[newState] || [];
                        if (districts.length > 0) {
                          setSelectedDistrict(districts[0]);
                        }
                      }}
                      className="w-full bg-[#0A0D14] border border-[#232B3E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                    >
                      {Object.keys(ALL_INDIAN_STATES).map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-semibold">जिला (District):</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-[#0A0D14] border border-[#232B3E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                    >
                      {(ALL_INDIAN_STATES[selectedState] || []).map((dst) => (
                        <option key={dst} value={dst}>{dst}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-semibold">शहर / संभाग (City):</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="उदा: भोपाल"
                      className="w-full bg-[#0A0D14] border border-[#232B3E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Channel & Brand Settings */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              {/* Channel Logo Picker & Live Preview */}
              <div className="p-4 rounded-2xl bg-[#121622]/80 border border-[#232B3E] space-y-3">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>चैनल / न्यूज़ रूम लोगो (Channel Logo):</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative p-2 rounded-2xl bg-black/60 border-2 border-dashed border-amber-500/40 flex items-center justify-center w-28 h-28 shrink-0 overflow-hidden group">
                    <img
                      src={channelLogo}
                      alt="Channel Logo Preview"
                      className="max-h-24 max-w-24 object-contain"
                      onError={(e) => { e.currentTarget.src = '/Logo.png'; }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[10px] text-amber-300 font-bold">प्रीव्यू</span>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>नया लोगो अपलोड करें</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChannelLogo('/Logo.png')}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 cursor-pointer"
                      >
                        डिफ़ॉल्ट BNW लोगो
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png,image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <p className="text-[11px] text-slate-400 leading-snug">
                      PNG पारदर्शी लोगो अपलोड करें। यह लोगो आपके 4:5 ग्राफिक्स, यूट्यूब थंबनेल्स व सोशल पोस्ट्स में ऑटोमैटिक प्रदर्शित होगा।
                    </p>
                  </div>
                </div>
              </div>

              {/* Channel Name & Brand Color */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>चैनल का नाम (Channel Name):</span>
                  </label>
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="उदा: दैनिक सागर 24 / मेरा जिला लाइव"
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-red-500" />
                    <span>ब्रांड कलर थीम (Brand Accent Color):</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border border-slate-700 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="flex-1 bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2 text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">डिफ़ॉल्ट कार्ड लेआउट थीम:</label>
                  <select
                    value={cardTheme}
                    onChange={(e) => setCardTheme(e.target.value as any)}
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-xs text-white font-semibold"
                  >
                    <option value="News-Alert">🔴 News-Alert (सिग्नेचर ब्रॉडकास्ट हेडलाइन)</option>
                    <option value="Minimalist">⚪ Minimalist (स्वच्छ मॉडर्न फोटो-फर्स्ट)</option>
                    <option value="Poll-Format">📊 Poll-Format (जनमत संग्रह व ओपिनियन)</option>
                    <option value="Breaking-Flash">⚡ Breaking-Flash (हाई-कंट्रास्ट रेड फ्लैश)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">लोगो की स्थिति (Logo Placement):</label>
                  <select
                    value={logoPosition}
                    onChange={(e) => setLogoPosition(e.target.value as any)}
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-xs text-white font-semibold"
                  >
                    <option value="top-right">ऊपर दाएं कोने में (Top-Right - रेकमेंडेड)</option>
                    <option value="top-left">ऊपर बाएं कोने में (Top-Left)</option>
                    <option value="bottom-right">नीचे दाएं कोने में (Bottom-Right)</option>
                    <option value="bottom-left">नीचे बाएं कोने में (Bottom-Left)</option>
                  </select>
                </div>
              </div>

              {/* Footer & Social Handle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">फुटर टेक्स्ट (Footer Disclaimer):</label>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    placeholder="सटीक एवं निष्पक्ष पत्रकारिता • ब्रेकिंग न्यूज वाला"
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">सोशल मीडिया हैंडल (Watermark Handle):</label>
                  <input
                    type="text"
                    value={socialHandle}
                    onChange={(e) => setSocialHandle(e.target.value)}
                    placeholder="@breakingnewswala"
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Social Media Accounts */}
          {activeTab === 'social' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  प्रत्येक एडमिन अपने स्वयं के आधिकारिक पेज और सोशल चैनल्स को अधिकृत करता है। किसी भी सोशल अकाउंट का टोकन अन्य एडमिन्स के साथ साझा नहीं होता।
                </span>
              </div>

              {/* Facebook Card */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] flex items-center justify-between gap-3 hover:border-blue-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Facebook Pages</span>
                      {facebookConnected ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                          सक्रिय • 12 पेजेस कनेक्टेड
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-bold">
                          अनकनेक्टेड
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400">जिला स्तरीय Facebook पेजों पर ऑटो 4:5 कार्ड व वीडियो सिंडिकेशन</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFacebookConnected(!facebookConnected)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    facebookConnected
                      ? 'bg-red-950/40 text-red-300 border border-red-500/50 hover:bg-red-900/60'
                      : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
                  }`}
                >
                  {facebookConnected ? 'डिस्कनेक्ट करें' : 'Page कनेक्ट करें'}
                </button>
              </div>

              {/* YouTube Card */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] flex items-center justify-between gap-3 hover:border-red-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>YouTube Channel</span>
                      {youtubeConnected ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                          ऑथराइज्ड (Shorts व Long Video)
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-bold">
                          अनकनेक्टेड
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400">16:9 वीडियो बुलेटिन्स व Shorts ऑटोमेशन विद AI SEO</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setYoutubeConnected(!youtubeConnected)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    youtubeConnected
                      ? 'bg-red-950/40 text-red-300 border border-red-500/50 hover:bg-red-900/60'
                      : 'bg-red-600 text-white hover:bg-red-500 shadow-md'
                  }`}
                >
                  {youtubeConnected ? 'डिस्कनेक्ट करें' : 'YouTube कनेक्ट करें'}
                </button>
              </div>

              {/* Instagram Card */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] flex items-center justify-between gap-3 hover:border-pink-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Instagram Creator Profile</span>
                      {instagramConnected && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                          कनेक्टेड
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400">4:5 न्यूज़ कार्ड्स एवं रील्स कवर अपलोड</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInstagramConnected(!instagramConnected)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    instagramConnected
                      ? 'bg-red-950/40 text-red-300 border border-red-500/50 hover:bg-red-900/60'
                      : 'bg-pink-600 text-white hover:bg-pink-500 shadow-md'
                  }`}
                >
                  {instagramConnected ? 'डिस्कनेक्ट करें' : 'Insta कनेक्ट करें'}
                </button>
              </div>

              {/* X / Twitter Card */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] flex items-center justify-between gap-3 hover:border-slate-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>X (Twitter) Developer API</span>
                      {twitterConnected && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                          कनेक्टेड
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400">280-कैरेक्टर लाइव ब्रेकिंग न्यूज़ थ्रेड्स</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTwitterConnected(!twitterConnected)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    twitterConnected
                      ? 'bg-red-950/40 text-red-300 border border-red-500/50 hover:bg-red-900/60'
                      : 'bg-slate-700 text-white hover:bg-slate-600 shadow-md'
                  }`}
                >
                  {twitterConnected ? 'डिस्कनेक्ट करें' : 'X कनेक्ट करें'}
                </button>
              </div>

              {/* LinkedIn Card */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] flex items-center justify-between gap-3 hover:border-sky-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>LinkedIn Company Page</span>
                      {linkedinConnected && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                          कनेक्टेड
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400">गवर्नेंस, इकोनॉमिक एवं पॉलिसी रिपोर्ट्स</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLinkedinConnected(!linkedinConnected)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    linkedinConnected
                      ? 'bg-red-950/40 text-red-300 border border-red-500/50 hover:bg-red-900/60'
                      : 'bg-sky-600 text-white hover:bg-sky-500 shadow-md'
                  }`}
                >
                  {linkedinConnected ? 'डिस्कनेक्ट करें' : 'LinkedIn कनेक्ट करें'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Caption & Hashtag Settings */}
          {activeTab === 'captions' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">डिफ़ॉल्ट कैप्शन शैली (Caption Style):</label>
                  <select
                    value={captionStyle}
                    onChange={(e) => setCaptionStyle(e.target.value as any)}
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-xs text-white font-semibold"
                  >
                    <option value="breaking">🔴 ब्रेकिंग न्यूज़ शैली (Breaking Alert Hook + Bullets)</option>
                    <option value="formal">🏛️ औपचारिक समाचार शैली (Formal Press Report)</option>
                    <option value="concise">⚡ संक्षिप्त सोशल मीडिया शैली (Short & Punchy)</option>
                    <option value="detailed">📜 विस्तृत समाचार विवरण (In-depth Narrative)</option>
                    <option value="custom">✍️ कस्टम एडमिन शैली (Personalized Template)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">कैप्शन टोन (Tone of Voice):</label>
                  <select
                    value={captionTone}
                    onChange={(e) => setCaptionTone(e.target.value as any)}
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-xs text-white font-semibold"
                  >
                    <option value="urgent">अत्यंत महत्वपूर्ण व त्वरित (Urgent & Alert)</option>
                    <option value="factual">तथ्यपरक व संतुलित (Objective & Factual)</option>
                    <option value="engaging">आकर्षक व सहभागिता-प्रेरक (Engaging & Question CTA)</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-[#121622] border border-[#232B3E]">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={useEmojis}
                    onChange={(e) => setUseEmojis(e.target.checked)}
                    className="rounded accent-[#E21A25]"
                  />
                  <span>इमोजी का उपयोग करें (Use Emojis)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={includeChannelName}
                    onChange={(e) => setIncludeChannelName(e.target.checked)}
                    className="rounded accent-[#E21A25]"
                  />
                  <span>कैप्शन में चैनल का नाम जोड़ें</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={includeWebsiteUrl}
                    onChange={(e) => setIncludeWebsiteUrl(e.target.checked)}
                    className="rounded accent-[#E21A25]"
                  />
                  <span>वेबसाइट लिंक शामिल करें</span>
                </label>
              </div>

              {/* STRICT 5 Permanent Hashtags Section */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-amber-400" />
                    <span>स्थायी हैशटैग (Permanent Hashtags - अधिकतम 5 सीमा):</span>
                  </label>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    permanentHashtags.length >= 5
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {permanentHashtags.length} / 5 प्रयुक्त
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  ये 5 हैशटैग आपकी प्रत्येक पोस्ट में स्थायी रूप से जोड़े जाएंगे। AI द्वारा खबर-विशिष्ट अतिरिक्त हैशटैग अलग से सुझाए जाएंगे।
                </p>

                {/* Hashtag Badges */}
                <div className="flex flex-wrap items-center gap-2 min-h-10 p-2.5 rounded-xl bg-[#0A0D14] border border-[#1E273A]">
                  {permanentHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeHashtag(tag)}
                        className="text-slate-400 hover:text-red-400 cursor-pointer"
                        title="हटाएं"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {permanentHashtags.length === 0 && (
                    <span className="text-xs text-slate-500 italic">कोई स्थायी हैशटैग नहीं जोड़ा गया</span>
                  )}
                </div>

                {/* Add New Tag Input (Disabled if 5 tags) */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">#</span>
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => {
                        setNewTagInput(e.target.value);
                        setTagError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addHashtag();
                        }
                      }}
                      disabled={permanentHashtags.length >= 5}
                      placeholder={
                        permanentHashtags.length >= 5
                          ? 'अधिकतम 5 हैशटैग पूरे हो चुके हैं'
                          : 'नया स्थायी हैशटैग लिखें (जैसे BhopalLive) और जोड़ें'
                      }
                      className="w-full bg-[#0A0D14] border border-[#232B3E] rounded-xl pl-7 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addHashtag}
                    disabled={permanentHashtags.length >= 5 || !newTagInput.trim()}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>जोड़ें</span>
                  </button>
                </div>

                {tagError && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{tagError}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Security & Login */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Google OAuth व सुरक्षा स्थिति</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0A0D14] border border-[#1E273A]">
                    <span className="text-slate-400 block text-[11px]">लॉगिन प्रदाता:</span>
                    <strong className="text-white flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Google Single Sign-On (SSO)
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0A0D14] border border-[#1E273A]">
                    <span className="text-slate-400 block text-[11px]">ईमेल वेरिफिकेशन:</span>
                    <strong className="text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                      वेरिफाइड Google अकाउंट
                    </strong>
                  </div>
                </div>
              </div>

              {/* 2FA Toggle with factual note */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">टू-स्टेप वेरिफिकेशन (2FA Policy)</h4>
                    <p className="text-[11px] text-slate-400">
                      सुरक्षा प्रोटोकॉल के अंतर्गत Google 2-Step Verification आपके Google Account स्तर पर स्वचालित रूप से संचालित होता है।
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>सक्रिय लॉगिन सेशन (Active Sessions):</span>
                </h4>
                <div className="p-3 rounded-xl bg-[#0A0D14] border border-[#1E273A] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-live"></span>
                    <div>
                      <div className="text-xs font-bold text-white">वर्तमान डिवाइस (Current Browser)</div>
                      <div className="text-[10px] text-slate-400 font-mono">Chrome on Linux • IP: Protected Dev Proxy</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                    सक्रिय
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                चुनें कि आपको किन घटनाओं पर इन-ऐप और अलर्ट रिंग नोटिफिकेशन चाहिए:
              </p>

              <div className="divide-y divide-[#1D2536] rounded-2xl bg-[#121622] border border-[#232B3E]">
                <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/50">
                  <div>
                    <div className="text-xs font-bold text-white">नई महत्वपूर्ण व ब्रेकिंग खबर</div>
                    <div className="text-[11px] text-slate-400">राज्य या जिले से उच्च-प्राथमिकता वाली खबर प्राप्त होने पर</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifNewImportant}
                    onChange={(e) => setNotifNewImportant(e.target.checked)}
                    className="accent-[#E21A25] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/50">
                  <div>
                    <div className="text-xs font-bold text-white">ग्राफिक कार्ड तैयार होने पर</div>
                    <div className="text-[11px] text-slate-400">4:5 न्यूज़ कार्ड AI द्वारा सफलतापूर्वक प्रोसेस होने पर</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifGraphicReady}
                    onChange={(e) => setNotifGraphicReady(e.target.checked)}
                    className="accent-[#E21A25] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/50">
                  <div>
                    <div className="text-xs font-bold text-white">सफल सोशल मीडिया प्रकाशन</div>
                    <div className="text-[11px] text-slate-400">Facebook, YouTube या WhatsApp पर पोस्ट लाइव होने पर</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPublishSuccess}
                    onChange={(e) => setNotifPublishSuccess(e.target.checked)}
                    className="accent-[#E21A25] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/50">
                  <div>
                    <div className="text-xs font-bold text-white">प्रकाशन विफलता अलर्ट (Publishing Failure)</div>
                    <div className="text-[11px] text-slate-400">किसी सोशल मीडिया API या नेटवर्क समस्या पर तुरंत सूचना</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPublishFailed}
                    onChange={(e) => setNotifPublishFailed(e.target.checked)}
                    className="accent-[#E21A25] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/50">
                  <div>
                    <div className="text-xs font-bold text-white">RSS फीड सिंक त्रुटि अलर्ट</div>
                    <div className="text-[11px] text-slate-400">किसी न्यूज़ वायर या सरकारी पोर्टल फीड के डाउन होने पर</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifRssError}
                    onChange={(e) => setNotifRssError(e.target.checked)}
                    className="accent-[#E21A25] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#232B3E] bg-[#0A0D14] flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>लाइव Firestore RBAC सिंक</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-all"
            >
              रद्द करें
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
              )}
              <span>प्रोफाइल व सेटिंग्स सेव करें</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
