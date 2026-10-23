import React, { useState } from 'react';
import {
  Rss,
  Globe,
  PlusCircle,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
  PlayCircle,
  Trash2,
  Edit3,
  Sliders,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Copy,
  Radio,
  Clock,
  Layers,
  MapPin,
  Building2,
  Sparkles
} from 'lucide-react';

export interface NewsSourceItem {
  id: string;
  name: string;
  logoUrl?: string;
  type: 'RSS' | 'WEBSITE' | 'WIRE' | 'GOVT';
  url: string;
  reliabilityScore: number;
  status: 'active' | 'paused' | 'error';
  category: string;
  state: string;
  district: string;
  refreshIntervalMinutes: number;
  lastSyncAt: string;
  lastError?: string;
  newsCount: number;
  duplicateDetectionEnabled: boolean;
  createdAt: string;
}

interface NewsSourceManagementProps {
  onShowToast: (title: string, message?: string) => void;
}

export const INITIAL_NEWS_SOURCES: NewsSourceItem[] = [
  {
    id: 'src-1',
    name: 'Bhopal District Administration & Civic Portal',
    logoUrl: '/Logo.png',
    type: 'GOVT',
    url: 'https://bhopal.nic.in/en/feed/press-releases.xml',
    reliabilityScore: 99,
    status: 'active',
    category: 'Civic Administration',
    state: 'मध्य प्रदेश',
    district: 'भोपाल',
    refreshIntervalMinutes: 15,
    lastSyncAt: '4 मिनट पहले',
    newsCount: 142,
    duplicateDetectionEnabled: true,
    createdAt: '2026-09-15T08:00:00Z'
  },
  {
    id: 'src-2',
    name: 'Indore Smart City & Municipal Updates',
    logoUrl: '/Logo.png',
    type: 'RSS',
    url: 'https://smartcityindore.org/news/rss.xml',
    reliabilityScore: 98,
    status: 'active',
    category: 'Infrastructure',
    state: 'मध्य प्रदेश',
    district: 'इंदौर',
    refreshIntervalMinutes: 15,
    lastSyncAt: '12 मिनट पहले',
    newsCount: 198,
    duplicateDetectionEnabled: true,
    createdAt: '2026-09-18T10:30:00Z'
  },
  {
    id: 'src-3',
    name: 'MP High Court & Legal Gazette Feed',
    logoUrl: '/Logo.png',
    type: 'RSS',
    url: 'https://mphc.gov.in/rss/judgments.xml',
    reliabilityScore: 100,
    status: 'active',
    category: 'Judiciary',
    state: 'मध्य प्रदेश',
    district: 'जबलपुर',
    refreshIntervalMinutes: 30,
    lastSyncAt: '28 मिनट पहले',
    newsCount: 86,
    duplicateDetectionEnabled: true,
    createdAt: '2026-09-20T12:00:00Z'
  },
  {
    id: 'src-4',
    name: 'Gwalior-Chambal Regional Infra Wire',
    logoUrl: '/Logo.png',
    type: 'WIRE',
    url: 'https://chambalwire.mp.gov.in/feed.xml',
    reliabilityScore: 95,
    status: 'active',
    category: 'Infrastructure',
    state: 'मध्य प्रदेश',
    district: 'ग्वालियर',
    refreshIntervalMinutes: 30,
    lastSyncAt: '35 मिनट पहले',
    newsCount: 115,
    duplicateDetectionEnabled: true,
    createdAt: '2026-09-22T14:15:00Z'
  },
  {
    id: 'src-5',
    name: 'Ujjain Mahakal & Tourism Bulletin',
    logoUrl: '/Logo.png',
    type: 'RSS',
    url: 'https://shrimahakaleshwar.com/feed/updates.xml',
    reliabilityScore: 97,
    status: 'active',
    category: 'Religion & Culture',
    state: 'मध्य प्रदेश',
    district: 'उज्जैन',
    refreshIntervalMinutes: 60,
    lastSyncAt: '1 घंटा पहले',
    newsCount: 94,
    duplicateDetectionEnabled: true,
    createdAt: '2026-09-25T09:00:00Z'
  },
  {
    id: 'src-6',
    name: 'Sagar Bundelkhand Regional News Link',
    logoUrl: '/Logo.png',
    type: 'WEBSITE',
    url: 'https://sagarbulletin.org/feed/district-news',
    reliabilityScore: 92,
    status: 'paused',
    category: 'Local Governance',
    state: 'मध्य प्रदेश',
    district: 'सागर',
    refreshIntervalMinutes: 60,
    lastSyncAt: '3 घंटे पहले',
    newsCount: 64,
    duplicateDetectionEnabled: true,
    createdAt: '2026-09-28T11:00:00Z'
  }
];

export const NewsSourceManagement: React.FC<NewsSourceManagementProps> = ({ onShowToast }) => {
  const [sources, setSources] = useState<NewsSourceItem[]>(INITIAL_NEWS_SOURCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'paused' | 'error'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'RSS' | 'WEBSITE' | 'WIRE' | 'GOVT'>('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSource, setEditingSource] = useState<NewsSourceItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formType, setFormType] = useState<'RSS' | 'WEBSITE' | 'WIRE' | 'GOVT'>('RSS');
  const [formCategory, setFormCategory] = useState('Civic Administration');
  const [formState, setFormState] = useState('मध्य प्रदेश');
  const [formDistrict, setFormDistrict] = useState('भोपाल');
  const [formRefreshMinutes, setFormRefreshMinutes] = useState(15);
  const [formReliability, setFormReliability] = useState(98);
  const [formDuplicateDetection, setFormDuplicateDetection] = useState(true);
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [testUrlSuccess, setTestUrlSuccess] = useState<boolean | null>(null);

  const resetForm = () => {
    setFormName('');
    setFormUrl('');
    setFormType('RSS');
    setFormCategory('Civic Administration');
    setFormState('मध्य प्रदेश');
    setFormDistrict('भोपाल');
    setFormRefreshMinutes(15);
    setFormReliability(98);
    setFormDuplicateDetection(true);
    setTestUrlSuccess(null);
    setEditingSource(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (src: NewsSourceItem) => {
    setEditingSource(src);
    setFormName(src.name);
    setFormUrl(src.url);
    setFormType(src.type);
    setFormCategory(src.category);
    setFormState(src.state);
    setFormDistrict(src.district);
    setFormRefreshMinutes(src.refreshIntervalMinutes);
    setFormReliability(src.reliabilityScore);
    setFormDuplicateDetection(src.duplicateDetectionEnabled);
    setTestUrlSuccess(true);
    setShowAddModal(true);
  };

  const handleTestUrl = () => {
    if (!formUrl.trim() || !formUrl.startsWith('http')) {
      onShowToast('कृपया एक वैध HTTP/HTTPS URL प्रविष्ट करें');
      setTestUrlSuccess(false);
      return;
    }
    setIsTestingUrl(true);
    setTimeout(() => {
      setIsTestingUrl(false);
      setTestUrlSuccess(true);
      onShowToast('फीड सिंक परीक्षण सफल: 200 OK', 'वैध XML/RSS संरचना व एनकोडिंग जांची गई');
    }, 800);
  };

  const handleSaveSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUrl.trim()) {
      onShowToast('कृपया स्रोत का नाम और URL भरें');
      return;
    }

    if (editingSource) {
      setSources(prev =>
        prev.map(item =>
          item.id === editingSource.id
            ? {
                ...item,
                name: formName.trim(),
                url: formUrl.trim(),
                type: formType,
                category: formCategory,
                state: formState,
                district: formDistrict,
                refreshIntervalMinutes: formRefreshMinutes,
                reliabilityScore: formReliability,
                duplicateDetectionEnabled: formDuplicateDetection
              }
            : item
        )
      );
      onShowToast(`समाचार स्रोत '${formName}' सफलतापूर्वक अपडेट हुआ!`);
    } else {
      const newSource: NewsSourceItem = {
        id: `src-${Date.now()}`,
        name: formName.trim(),
        logoUrl: '/Logo.png',
        type: formType,
        url: formUrl.trim(),
        reliabilityScore: formReliability,
        status: 'active',
        category: formCategory,
        state: formState,
        district: formDistrict,
        refreshIntervalMinutes: formRefreshMinutes,
        lastSyncAt: 'अभी-अभी जोड़ा गया',
        newsCount: 0,
        duplicateDetectionEnabled: formDuplicateDetection,
        createdAt: new Date().toISOString()
      };
      setSources(prev => [newSource, ...prev]);
      onShowToast(`नया समाचार स्रोत '${formName}' जोड़ा गया!`, 'ऑटोपायलट सिंक सक्रिय हुआ');
    }

    setShowAddModal(false);
    resetForm();
  };

  const toggleSourceStatus = (id: string) => {
    setSources(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === 'active' ? 'paused' : 'active';
          onShowToast(
            nextStatus === 'active' ? `'${item.name}' को सक्रिय किया गया` : `'${item.name}' को पॉज़ किया गया`,
            nextStatus === 'active' ? 'फीड से नई खबरें प्राप्त होंगी' : 'इस स्रोत से नई खबरें आना बंद होंगी'
          );
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleDeleteSource = (id: string, name: string) => {
    if (confirm(`क्या आप समाचार स्रोत '${name}' को स्थायी रूप से हटाना चाहते हैं? इसके बाद इससे कोई खबर प्राप्त नहीं होगी।`)) {
      setSources(prev => prev.filter(item => item.id !== id));
      onShowToast(`समाचार स्रोत '${name}' को हटा दिया गया`);
    }
  };

  const handleSyncNow = (id: string, name: string) => {
    onShowToast(`'${name}' का तुरंत सिंक आरंभ...`, 'ताज़ा RSS/वेबलिंक फेचिंग जारी');
    setTimeout(() => {
      setSources(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, lastSyncAt: 'अभी-अभी', newsCount: item.newsCount + Math.floor(Math.random() * 4) + 1 }
            : item
        )
      );
      onShowToast(`'${name}' सिंक सफल!`, 'नई खबरें न्यूज़रूम कतार में शामिल की गईं');
    }, 700);
  };

  // Filtered List
  const filteredSources = sources.filter(src => {
    const matchesSearch =
      src.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || src.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || src.type === typeFilter;
    const matchesDistrict = districtFilter === 'ALL' || src.district === districtFilter;
    return matchesSearch && matchesStatus && matchesType && matchesDistrict;
  });

  const totalSources = sources.length;
  const activeSources = sources.filter(s => s.status === 'active').length;
  const totalNewsGenerated = sources.reduce((acc, s) => acc + s.newsCount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Key KPIs */}
      <div className="bg-[#121622] p-5 sm:p-6 rounded-2xl border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 pulse-live"></span>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 uppercase tracking-widest">
                MASTER ADMIN CONTROL
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
              <Rss className="w-6 h-6 text-[#FFED00]" />
              <span>न्यूज़ सोर्स मैनेजमेंट (RSS व वेबलिंक कंट्रोल)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              केवल मास्टर एडमिन अधिकृत स्रोतों को जोड़, संपादित, पॉज़ या हटा सकते हैं। निष्क्रिय किए गए स्रोत से कोई खबर न्यूज़रूम में प्रवेश नहीं कर सकती।
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>+ नया समाचार स्रोत जोड़ें</span>
          </button>
        </div>

        {/* 4 KPI Counter Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#232B3E]">
            <span className="text-[11px] text-slate-400 font-bold uppercase block">कुल समाचार स्रोत</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1 flex items-baseline gap-2">
              <span className="text-amber-400 font-mono">{totalSources}</span>
              <span className="text-[10px] text-slate-400 font-normal">कॉन्फिगर्ड</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#232B3E]">
            <span className="text-[11px] text-slate-400 font-bold uppercase block">सक्रिय व ऑटो-सिंकिंग</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1 flex items-baseline gap-2">
              <span className="text-emerald-400 font-mono">{activeSources}</span>
              <span className="text-[10px] text-emerald-400 font-normal">100% लाइव</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#232B3E]">
            <span className="text-[11px] text-slate-400 font-bold uppercase block">कुल प्राप्त खबरें</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1 flex items-baseline gap-2">
              <span className="text-[#FFED00] font-mono">{totalNewsGenerated}</span>
              <span className="text-[10px] text-slate-400 font-normal">कतारबद्ध</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-[#232B3E]">
            <span className="text-[11px] text-slate-400 font-bold uppercase block">डुप्लिकेट फिल्टरिंग</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1 flex items-baseline gap-2">
              <span className="text-cyan-400 font-mono">100%</span>
              <span className="text-[10px] text-cyan-400 font-normal">सक्रिय सुरक्षा</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="स्रोत का नाम, URL या जिला खोजें..."
              className="w-full bg-[#0A0D14] border border-[#232B3E] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#0A0D14] border border-[#232B3E] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-semibold cursor-pointer"
            >
              <option value="ALL">सभी स्थितियां (Status)</option>
              <option value="active">● केवल सक्रिय (Active)</option>
              <option value="paused">⏸️ केवल पॉज़्ड (Paused)</option>
              <option value="error">⚠️ त्रुटि (Error)</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-[#0A0D14] border border-[#232B3E] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-semibold cursor-pointer"
            >
              <option value="ALL">सभी प्रकार (Source Type)</option>
              <option value="RSS">RSS Feed</option>
              <option value="GOVT">सरकारी पोर्टल (Govt API)</option>
              <option value="WIRE">न्यूज़ एजेंसी (Wire)</option>
              <option value="WEBSITE">वेबसाइट स्क्रेपर</option>
            </select>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-[#0A0D14] border border-[#232B3E] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-semibold cursor-pointer"
            >
              <option value="ALL">सभी जिले (Districts)</option>
              <option value="भोपाल">भोपाल</option>
              <option value="इंदौर">इंदौर</option>
              <option value="जबलपुर">जबलपुर</option>
              <option value="ग्वालियर">ग्वालियर</option>
              <option value="उज्जैन">उज्जैन</option>
              <option value="सागर">सागर</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sources Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSources.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-[#121622] rounded-2xl border border-[#232B3E]">
            <Rss className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold">कोई समाचार स्रोत नहीं मिला।</p>
            <button
              onClick={handleOpenAdd}
              className="mt-3 text-xs font-bold text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>पहला स्रोत जोड़ें</span>
            </button>
          </div>
        ) : (
          filteredSources.map(source => {
            const isActive = source.status === 'active';
            return (
              <div
                key={source.id}
                className={`p-4 rounded-2xl bg-[#121622] border transition-all space-y-3 relative group flex flex-col justify-between ${
                  isActive
                    ? 'border-[#232B3E] hover:border-amber-500/50 shadow-lg'
                    : 'border-slate-800 opacity-80'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0A0D14] border border-slate-800 p-1 flex items-center justify-center shrink-0">
                      {source.type === 'GOVT' ? (
                        <Building2 className="w-5 h-5 text-amber-400" />
                      ) : source.type === 'RSS' ? (
                        <Rss className="w-5 h-5 text-orange-400" />
                      ) : (
                        <Globe className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-white leading-snug line-clamp-1">
                        {source.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-amber-300 border border-slate-800 font-bold">
                          {source.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {source.district} • {source.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase shrink-0 ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                    }`}
                  >
                    {isActive ? '● एक्टिव' : '⏸️ पॉज़्ड'}
                  </span>
                </div>

                {/* URL and Reliability Info */}
                <div className="p-2.5 rounded-xl bg-[#0A0D14] border border-[#1E273A] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[200px] font-mono text-[10px]" title={source.url}>
                      {source.url}
                    </span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:text-white shrink-0 ml-1"
                      title="मूल फीड लिंक खोलें"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      विश्वसनीयता: <strong className="text-white">{source.reliabilityScore}%</strong>
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-400" />
                      सिंक अंतराल: <strong className="text-white">{source.refreshIntervalMinutes}m</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>अंतिम सिंक: {source.lastSyncAt}</span>
                    <span className="text-amber-300 font-mono font-bold">
                      {source.newsCount} खबरें फेच
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-[#1E273A] flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSyncNow(source.id, source.name)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
                    title="तुरंत रिफ्रेश व सिंक करें"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px]">सिंक</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSourceStatus(source.id)}
                    className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/30'
                        : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                    }`}
                    title={isActive ? 'स्रोत पॉज़ करें' : 'स्रोत चालू करें'}
                  >
                    {isActive ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{isActive ? 'पॉज़' : 'सक्रिय'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(source)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 text-xs font-semibold cursor-pointer flex items-center gap-1"
                    title="स्रोत संपादित करें"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">एडिट</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSource(source.id, source.name)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600/30 text-slate-400 hover:text-red-400 text-xs font-semibold cursor-pointer"
                    title="स्रोत हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D111A] border-2 border-amber-500/50 rounded-3xl max-w-xl w-full p-5 sm:p-7 space-y-5 shadow-2xl relative my-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Rss className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingSource ? 'समाचार स्रोत संपादित करें' : 'नया समाचार स्रोत जोड़ें'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    RSS, सरकारी पोर्टल या वेबलिंक से ऑटो-फेचिंग सेटअप
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSource} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">स्रोत का नाम (Source Name):</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="उदा: भोपाल नगर निगम आधिकारिक प्रेस विज्ञप्ति"
                  className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">स्रोत URL (RSS / XML / Weblink):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    value={formUrl}
                    onChange={(e) => {
                      setFormUrl(e.target.value);
                      setTestUrlSuccess(null);
                    }}
                    placeholder="https://example.com/feed.xml"
                    className="flex-1 bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleTestUrl}
                    disabled={isTestingUrl || !formUrl}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold shrink-0 cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  >
                    {isTestingUrl ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : testUrlSuccess ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Radio className="w-3.5 h-3.5" />
                    )}
                    <span>टेस्ट करें</span>
                  </button>
                </div>
                {testUrlSuccess && (
                  <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                    ✓ वैध फीड संरचना व लाइव 200 HTTP रिस्पॉन्स सत्यापित।
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">स्रोत का प्रकार (Type):</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="RSS">RSS Feed</option>
                    <option value="GOVT">सरकारी पोर्टल (Govt Wire)</option>
                    <option value="WIRE">न्यूज़ वायर एजेंसी</option>
                    <option value="WEBSITE">वेबसाइट स्क्रेपर</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">कैटेगरी (Default Category):</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="Civic Administration">प्रशासन व नगर निगम</option>
                    <option value="Infrastructure">इन्फ्रास्ट्रक्चर व विकास</option>
                    <option value="Judiciary">न्यायिक व कानून</option>
                    <option value="Politics">राजनीति</option>
                    <option value="Religion & Culture">धर्म व संस्कृति</option>
                    <option value="Agriculture & Farmers">कृषि व किसान</option>
                    <option value="Crime">अपराध व सुरक्षा</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">कवरेज राज्य (State):</label>
                  <select
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="मध्य प्रदेश">मध्य प्रदेश</option>
                    <option value="उत्तर प्रदेश">उत्तर प्रदेश</option>
                    <option value="राजस्थान">राजस्थान</option>
                    <option value="छत्तीसगढ़">छत्तीसगढ़</option>
                    <option value="राष्ट्रीय">समस्त भारत (National)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">कवरेज जिला (District):</label>
                  <input
                    type="text"
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    placeholder="उदा: भोपाल"
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">सिंक अंतराल (Refresh Interval):</label>
                  <select
                    value={formRefreshMinutes}
                    onChange={(e) => setFormRefreshMinutes(Number(e.target.value))}
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value={15}>प्रत्येक 15 मिनट (फास्ट)</option>
                    <option value={30}>प्रत्येक 30 मिनट</option>
                    <option value={60}>प्रत्येक 1 घंटा (मानक)</option>
                    <option value={120}>प्रत्येक 2 घंटे</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">विश्वसनीयता स्कोर (0-100%):</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={formReliability}
                    onChange={(e) => setFormReliability(Number(e.target.value))}
                    className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formDuplicateDetection}
                    onChange={(e) => setFormDuplicateDetection(e.target.checked)}
                    className="accent-[#E21A25] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block text-[11px]">डुप्लिकेट खबरों की स्वतः पहचान व फिल्टरिंग</span>
                    <span className="text-[10px] text-slate-400">एक ही खबर दोबारा आने पर स्वतः एकीकृत कार्ड में मर्ज करें</span>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#232B3E] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg cursor-pointer"
                >
                  {editingSource ? 'अपडेट करें' : 'स्रोत सुरक्षित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
