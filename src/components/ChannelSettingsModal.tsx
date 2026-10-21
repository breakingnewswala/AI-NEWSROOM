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
  Sparkles
} from 'lucide-react';
import type { UserProfile } from '../lib/firebase';
import type { User } from 'firebase/auth';

interface ChannelSettingsModalProps {
  userProfile: UserProfile | null;
  currentUser: User | null;
  onClose: () => void;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
}

const MP_DISTRICTS = [
  'भोपाल (Bhopal)',
  'इंदौर (Indore)',
  'जबलपुर (Jabalpur)',
  'ग्वालियर (Gwalior)',
  'उज्जैन (Ujjain)',
  'सागर (Sagar)',
  'रीवा (Rewa)',
  'सतना (Satna)',
  'छिंदवाड़ा (Chhindwara)',
  'रतलाम (Ratlam)',
  'मुरैना (Morena)',
  'भिंड (Bhind)',
  'शिवपुरी (Shivpuri)',
  'विदिशा (Vidisha)',
  'सीहोर (Sehore)',
  'देवास (Dewas)',
  'खंडवा (Khandwa)',
  'खरगोन (Khargone)',
  'नीमच (Neemuch)',
  'मंदसौर (Mandsaur)',
  'मध्य प्रदेश (समस्त राज्य)'
];

export const ChannelSettingsModal: React.FC<ChannelSettingsModalProps> = ({
  userProfile,
  currentUser,
  onClose,
  onSave
}) => {
  const [channelName, setChannelName] = useState(userProfile?.channelName || '');
  const [district, setDistrict] = useState(userProfile?.district || 'भोपाल');
  const [channelLogo, setChannelLogo] = useState(userProfile?.channelLogo || '/Logo.png');
  const [facebookConnected, setFacebookConnected] = useState(userProfile?.facebookConnected ?? false);
  const [youtubeConnected, setYoutubeConnected] = useState(userProfile?.youtubeConnected ?? false);
  const [instagramConnected, setInstagramConnected] = useState(userProfile?.instagramConnected ?? false);
  const [twitterConnected, setTwitterConnected] = useState(userProfile?.twitterConnected ?? false);
  const [linkedinConnected, setLinkedinConnected] = useState(userProfile?.linkedinConnected ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'social'>('profile');

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        channelName: channelName.trim() || 'मेरा न्यूज़ चैनल',
        district,
        channelLogo,
        facebookConnected,
        youtubeConnected,
        instagramConnected,
        twitterConnected,
        linkedinConnected
      });
      onClose();
    } catch (err) {
      console.error('Error saving channel settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0D111A] border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-6 shadow-2xl relative my-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#232B3E] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>चैनल सेटिंग्स व सोशल मीडिया ऑथेंटिकेशन</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                  {userProfile?.role === 'MASTER_ADMIN' ? 'मास्टर एडमिन' : 'चैनल एडमिन'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser?.email} • अपने चैनल का नाम, लोगो और सोशल अकाउंट्स कनेक्ट करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>1. चैनल प्रोफाइल व लोगो</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'social'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>2. सोशल मीडिया ऑथेंटिकेशन</span>
          </button>
        </div>

        {/* TAB 1: Channel Profile & Logo */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Channel Logo Picker & Live Preview */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
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
                      डिफ़ॉल्ट लोगो
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
                    PNG या उच्च-गुणवत्ता वाली पारदर्शी इमेज अपलोड करें। यह लोगो 4:5 ग्राफिक्स, यूट्यूब थंबनेल और हेडर में प्रदर्शित होगा।
                  </p>
                </div>
              </div>
            </div>

            {/* Channel Name */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>चैनल या न्यूज़ बुलेटिन का नाम (Channel Name):</span>
              </label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="उदा: दैनिक सागर 24 / इंदौर फास्ट न्यूज़"
                className="w-full bg-slate-900 border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-semibold"
              />
            </div>

            {/* Coverage District */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>कवरेज जिला / संभाग (District / Coverage Region):</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-900 border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-semibold"
              >
                {MP_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist.split(' ')[0]}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* TAB 2: Social Media Authentications */}
        {activeTab === 'social' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              ⚡ अपने चैनल के आधिकारिक सोशल मीडिया हैंडल्स को ऑथेंटिकेट करें ताकि ऑटो-सिंडिकेशन द्वारा खबर एक क्लिक में सभी पेजों पर लाइव हो सके।
            </p>

            {/* Facebook */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 hover:border-blue-500/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <Facebook className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Facebook Page</span>
                    {facebookConnected && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                        कनेक्टेड
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400">डिस्ट्रिक्ट पेज व वीडियो ऑटो-पोस्टिंग</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFacebookConnected(!facebookConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  facebookConnected
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/50'
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
                }`}
              >
                {facebookConnected ? 'डिस्कनेक्ट करें' : 'Page कनेक्ट करें'}
              </button>
            </div>

            {/* YouTube */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 hover:border-red-500/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>YouTube Channel</span>
                    {youtubeConnected && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                        कनेक्टेड
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400">वीडियो बुलेटिन व Shorts अपलोड स्कोप</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setYoutubeConnected(!youtubeConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  youtubeConnected
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/50'
                    : 'bg-red-600 text-white hover:bg-red-500 shadow-md'
                }`}
              >
                {youtubeConnected ? 'डिस्कनेक्ट करें' : 'YouTube ऑथराइज करें'}
              </button>
            </div>

            {/* Instagram */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 hover:border-pink-500/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Instagram Professional Profile</span>
                    {instagramConnected && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                        कनेक्टेड
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400">4:5 पोस्ट्स व रील्स सिंडिकेशन</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInstagramConnected(!instagramConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  instagramConnected
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/50'
                    : 'bg-pink-600 text-white hover:bg-pink-500 shadow-md'
                }`}
              >
                {instagramConnected ? 'डिस्कनेक्ट करें' : 'Insta कनेक्ट करें'}
              </button>
            </div>

            {/* X / Twitter */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-500/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                  <Twitter className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>X (Twitter) Handle</span>
                    {twitterConnected && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                        कनेक्टेड
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400">280-चरित्र त्वरित ब्रेकिंग न्यूज़ थ्रेड्स</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTwitterConnected(!twitterConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  twitterConnected
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/50'
                    : 'bg-slate-700 text-white hover:bg-slate-600 shadow-md'
                }`}
              >
                {twitterConnected ? 'डिस्कनेक्ट करें' : 'X कनेक्ट करें'}
              </button>
            </div>

            {/* LinkedIn */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 hover:border-sky-500/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold">
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
                  <p className="text-[11px] text-slate-400">फॉर्मल गवर्नमेंट पॉलिसी व इकोनॉमिक ब्रीफ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLinkedinConnected(!linkedinConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  linkedinConnected
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/50'
                    : 'bg-sky-600 text-white hover:bg-sky-500 shadow-md'
                }`}
              >
                {linkedinConnected ? 'डिस्कनेक्ट करें' : 'LinkedIn कनेक्ट करें'}
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-[#232B3E] pt-4">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Firebase Firestore लाइव सिंक</span>
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
              <span>सेटिंग्स सेव करें (Save Profile)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
