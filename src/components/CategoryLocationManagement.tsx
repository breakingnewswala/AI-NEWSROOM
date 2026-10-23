import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  PlusCircle,
  Edit3,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  Globe,
  Tag,
  Building2,
  Flame,
  Film,
  Trophy,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Cpu,
  ShieldAlert,
  Sun,
  Tv,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  hindiName: string;
  slug: string;
  icon: string;
  description: string;
  subcategories: string[];
  isCustom?: boolean;
  order: number;
}

interface CategoryLocationManagementProps {
  onShowToast: (title: string, message?: string) => void;
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'National News',
    hindiName: 'राष्ट्रीय समाचार',
    slug: 'national',
    icon: 'Globe',
    description: 'भारत सरकार, संसद व देशव्यापी मुख्य घटनाक्रम',
    subcategories: ['केंद्र सरकार', 'सर्वोच्च न्यायालय', 'रक्षा एवं सेना', 'राष्ट्रीय नीतियां'],
    order: 1
  },
  {
    id: 'cat-2',
    name: 'State News',
    hindiName: 'राज्यवार समाचार',
    slug: 'state-news',
    icon: 'Layers',
    description: 'मध्य प्रदेश व अन्य राज्यों के प्रादेशिक फैसले',
    subcategories: ['मंत्रालय व सचिवालय', 'विधानसभा', 'राज्य योजनाएं', 'राजभवन'],
    order: 2
  },
  {
    id: 'cat-3',
    name: 'Madhya Pradesh Focus',
    hindiName: 'मध्य प्रदेश (समस्त 52 जिले)',
    slug: 'mp-all-districts',
    icon: 'MapPin',
    description: 'भोपाल, इंदौर, जबलपुर, ग्वालियर सहित सभी जिलों की स्थानीय खबरें',
    subcategories: ['मालवा-निमाड़', 'महाकोशल', 'बुंदेलखंड', 'ग्वालियर-चंबल', 'विंध्य'],
    order: 3
  },
  {
    id: 'cat-4',
    name: 'Politics',
    hindiName: 'राजनीति (Politics)',
    slug: 'politics',
    icon: 'Building2',
    description: 'चुनाव, राजनीतिक दल, बयानबाजी व सियासी हलचल',
    subcategories: ['चुनावी रैलियां', 'पार्टी संगठन', 'विपक्ष के सवाल', 'नेता बयान'],
    order: 4
  },
  {
    id: 'cat-5',
    name: 'Sports',
    hindiName: 'खेल (Sports)',
    slug: 'sports',
    icon: 'Trophy',
    description: 'क्रिकेट, हॉकी, ओलंपिक, राज्यस्तरीय खेल प्रतियोगिताएं',
    subcategories: ['क्रिकेट व IPL', 'हॉकी व फुटबॉल', 'खेलो इंडिया', 'एथलेटिक्स'],
    order: 5
  },
  {
    id: 'cat-6',
    name: 'Entertainment',
    hindiName: 'मनोरंजन (Bollywood & Hollywood)',
    slug: 'entertainment',
    icon: 'Film',
    description: 'बॉलीवुड, हॉलीवुड, OTT रिलीज, वेब सीरीज व समीक्षा',
    subcategories: ['बॉलीवुड बॉक्स ऑफिस', 'हॉलीवुड अपडेट्स', 'OTT व वेब सीरीज', 'सेलिब्रिटी गॉसिप'],
    order: 6
  },
  {
    id: 'cat-7',
    name: 'Agriculture & Farmers',
    hindiName: 'कृषि एवं किसान (Agriculture)',
    slug: 'agriculture',
    icon: 'Sun',
    description: 'मंडी भाव, फसल बीमा, किसान कल्याण व मौसम पूर्वानुमान',
    subcategories: ['मंडी भाव लाइव', 'समर्थन मूल्य (MSP)', 'सिंचाई व बिजली', 'खाद-बीज वितरण'],
    order: 7
  },
  {
    id: 'cat-8',
    name: 'Business & Economy',
    hindiName: 'व्यापार एवं अर्थव्यवस्था (Business)',
    slug: 'business',
    icon: 'Briefcase',
    description: 'शेयर बाजार, स्थानीय उद्योग, MSME, बजट व बैंकिंग',
    subcategories: ['शेयर बाजार व सेंसेक्स', 'स्थानीय उद्योग व व्यापार', 'स्टार्टअप व लोन', 'जीएसटी व टैक्स'],
    order: 8
  },
  {
    id: 'cat-9',
    name: 'Education',
    hindiName: 'शिक्षा एवं रोजगार (Education)',
    slug: 'education',
    icon: 'GraduationCap',
    description: 'बोर्ड परीक्षाएं, प्रतियोगी परीक्षाएं, सरकारी भर्ती व परिणाम',
    subcategories: ['MPPSC व व्यापम', 'बोर्ड परीक्षा परिणाम', 'शिक्षक भर्ती', 'यूनिवर्सिटी अलर्ट'],
    order: 9
  },
  {
    id: 'cat-10',
    name: 'Health',
    hindiName: 'स्वास्थ्य एवं चिकित्सा (Health)',
    slug: 'health',
    icon: 'HeartPulse',
    description: 'अस्पताल सुविधाएं, मेडिकल कॉलेज, स्वास्थ्य नीतियां व एडवाइजरी',
    subcategories: ['एम्स व मेडिकल कॉलेज', 'आयुष्मान योजना', 'मौसमी बीमारियां', 'हेल्थ अलर्ट'],
    order: 10
  },
  {
    id: 'cat-11',
    name: 'Technology',
    hindiName: 'तकनीक एवं साइबर (Tech & AI)',
    slug: 'technology',
    icon: 'Cpu',
    description: 'आर्टिफिशियल इंटेलिजेंस, मोबाइल गैजेट्स, साइबर सुरक्षा',
    subcategories: ['AI व इनोवेशन', 'साइबर फ्रॉड अलर्ट', 'गैजेट्स रिव्यू', 'ई-गवर्नेंस'],
    order: 11
  },
  {
    id: 'cat-12',
    name: 'Crime & Security',
    hindiName: 'अपराध एवं सुरक्षा (Crime & Law)',
    slug: 'crime',
    icon: 'ShieldAlert',
    description: 'पुलिस कार्रवाई, कोर्ट केस, अपराध अनुसंधान व ट्रैफिक सुरक्षा',
    subcategories: ['पुलिस कार्रवाई', 'विशेष अनुसंधान', 'ट्रैफिक चालान', 'अवैध अतिक्रमण'],
    order: 12
  },
  {
    id: 'cat-13',
    name: 'Religion & Culture',
    hindiName: 'धर्म एवं संस्कृति (Culture & Heritage)',
    slug: 'religion',
    icon: 'Sparkles',
    description: 'महाकाल मंदिर, धार्मिक उत्सव, मेले, पर्यटन व सांस्कृतिक विरासत',
    subcategories: ['श्री महाकाल महालोक', 'धार्मिक पर्व व मेले', 'पुरातत्व व किले', 'तीर्थ दर्शन'],
    order: 13
  },
  {
    id: 'cat-14',
    name: 'International',
    hindiName: 'अंतरराष्ट्रीय समाचार (World News)',
    slug: 'international',
    icon: 'Globe',
    description: 'वैश्विक कूटनीति, भू-राजनीति व विदेशी घटनाक्रम',
    subcategories: ['वैश्विक कूटनीति', 'व्यापार समझौते', 'प्रवासी भारतीय', 'विश्व मंच'],
    order: 14
  },
  {
    id: 'cat-15',
    name: 'Viral & Trending',
    hindiName: 'वायरल एवं ट्रेंडिंग खबरें (Viral Buzz)',
    slug: 'viral-trending',
    icon: 'Flame',
    description: 'सोशल मीडिया पर सर्वाधिक चर्चित और ट्रेंड कर रही खबरें',
    subcategories: ['सोशल मीडिया बज', 'वायरल वीडियो', 'मीम्स व ट्रेंड', 'जनचर्चा'],
    order: 15
  }
];

export const ALL_INDIA_STATES_DISTRICTS: Record<string, string[]> = {
  'मध्य प्रदेश (52 जिले)': [
    'भोपाल', 'इंदौर', 'जबलपुर', 'ग्वालियर', 'उज्जैन', 'सागर', 'रीवा', 'सतना',
    'छिंदवाड़ा', 'रतलाम', 'मुरैना', 'भिंड', 'शिवपुरी', 'विदिशा', 'सीहोर', 'देवास',
    'खंडवा', 'खरगोन', 'नीमच', 'मंदसौर', 'धार', 'होशंगाबाद (नर्मदापुरम)', 'बैतूल',
    'बालाघाट', 'सिवनी', 'मंडला', 'डिंडौरी', 'कटनी', 'दमोह', 'पन्ना', 'छतरपुर',
    'टीकमगढ़', 'निवाड़ी', 'शहडोल', 'उमरिया', 'अनूपपुर', 'सीधी', 'सिंगरौली',
    'राजगढ़', 'शाजापुर', 'आगर मालवा', 'गुना', 'अशोकनगर', 'श्योपुर', 'बड़वानी',
    'बुरहानपुर', 'अलीराजपुर', 'झाबुआ', 'हरदा', 'रायसेन'
  ],
  'उत्तर प्रदेश (75 जिले)': [
    'लखनऊ', 'वाराणसी', 'कानपुर नगर', 'प्रयागराज', 'आगरा', 'नोएडा (गौतम बुद्ध नगर)',
    'गाजियाबाद', 'गोरखपुर', 'मेरठ', 'झांसी', 'मथुरा', 'अयोध्या', 'बरेली', 'अलीगढ़'
  ],
  'राजस्थान (50 जिले)': [
    'जयपुर', 'जोधपुर', 'उदयपुर', 'कोटा', 'अजमेर', 'बीकानेर', 'अलवर', 'भरतपुर',
    'भीलवाड़ा', 'सीकर', 'पाली', 'बाड़मेर', 'चित्तौड़गढ़'
  ],
  'बिहार (38 जिले)': [
    'पटना', 'गया', 'मुजफ्फरपुर', 'भागलपुर', 'दरभंगा', 'पूर्णिया', 'आरा (भोजपुर)',
    'बेगूसराय', 'मोतिहारी', 'नालंदा (बिहारशरीफ)'
  ],
  'दिल्ली एनसीटी (11 जिले)': [
    'नई दिल्ली', 'उत्तर दिल्ली', 'दक्षिण दिल्ली', 'पूर्वी दिल्ली', 'पश्चिम दिल्ली',
    'मध्य दिल्ली', 'दक्षिण-पश्चिम दिल्ली', 'शाहदरा'
  ],
  'छत्तीसगढ़ (33 जिले)': [
    'रायपुर', 'बिलासपुर', 'दुर्ग', 'भिलाई', 'कोरबा', 'राजनांदगांव', 'जगदलपुर (बस्तर)',
    'रायगढ़', 'अंबिकापुर (सरगुजा)'
  ],
  'महाराष्ट्र (36 जिले)': [
    'मुंबई शहर', 'मुंबई उपनगर', 'पुणे', 'नागपुर', 'ठाणे', 'नासिक', 'छत्रपति संभाजीनगर (औरंगाबाद)',
    'कोल्हापुर', 'सोलापुर', 'अमरावती'
  ],
  'गुजरात (33 जिले)': [
    'अहमदाबाद', 'सूरत', 'वडोदरा', 'राजकोट', 'गांधीनगर', 'भावनगर', 'जामनगर'
  ],
  'हरियाणा (22 जिले)': [
    'गुरुग्राम', 'फरीदाबाद', 'रोहतक', 'पानीपत', 'अंबाला', 'करनाल', 'हिसार'
  ],
  'पंजाब (23 जिले)': [
    'चंडीगढ़', 'अमृतसर', 'लुधियाना', 'जालंधर', 'पटियाला', 'बठिंडा'
  ]
};

export const CategoryLocationManagement: React.FC<CategoryLocationManagementProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'geography'>('categories');
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [selectedState, setSelectedState] = useState<string>('मध्य प्रदेश (52 जिले)');
  const [districtSearch, setDistrictSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // Add / Edit Category Modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [catName, setCatName] = useState('');
  const [catHindiName, setCatHindiName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [subcatString, setSubcatString] = useState('');

  // Custom District addition
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [newDistrictName, setNewDistrictName] = useState('');

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatHindiName('');
    setCatSlug('');
    setCatDescription('');
    setSubcatString('');
    setShowCatModal(true);
  };

  const handleOpenEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatHindiName(cat.hindiName);
    setCatSlug(cat.slug);
    setCatDescription(cat.description);
    setSubcatString(cat.subcategories.join(', '));
    setShowCatModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catHindiName.trim() || !catSlug.trim()) {
      onShowToast('कृपया कैटेगरी का हिंदी नाम और स्लग भरें');
      return;
    }

    const subcats = subcatString
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (editingCategory) {
      setCategories(prev =>
        prev.map(c =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: catName.trim() || catHindiName.trim(),
                hindiName: catHindiName.trim(),
                slug: catSlug.trim().toLowerCase(),
                description: catDescription.trim(),
                subcategories: subcats
              }
            : c
        )
      );
      onShowToast(`कैटेगरी '${catHindiName}' सफलतापूर्वक अपडेट हुई!`);
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: catName.trim() || catHindiName.trim(),
        hindiName: catHindiName.trim(),
        slug: catSlug.trim().toLowerCase(),
        icon: 'Tag',
        description: catDescription.trim() || 'कस्टम समाचार श्रेणी',
        subcategories: subcats.length > 0 ? subcats : ['सामान्य अपडेट्स'],
        isCustom: true,
        order: categories.length + 1
      };
      setCategories(prev => [...prev, newCat]);
      onShowToast(`नई कैटेगरी '${catHindiName}' जोड़ी गई!`);
    }

    setShowCatModal(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`क्या आप '${name}' कैटेगरी को हटाना चाहते हैं?`)) {
      setCategories(prev => prev.filter(c => c.id !== id));
      onShowToast(`कैटेगरी '${name}' हटा दी गई`);
    }
  };

  const handleAddDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrictName.trim()) return;

    if (!ALL_INDIA_STATES_DISTRICTS[selectedState]) {
      ALL_INDIA_STATES_DISTRICTS[selectedState] = [];
    }
    ALL_INDIA_STATES_DISTRICTS[selectedState].push(newDistrictName.trim());
    onShowToast(`'${selectedState}' में नया जिला/बीट '${newDistrictName}' जोड़ा गया!`);
    setNewDistrictName('');
    setShowDistrictModal(false);
  };

  const filteredCategories = categories.filter(c =>
    c.hindiName.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.description.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const activeDistricts = (ALL_INDIA_STATES_DISTRICTS[selectedState] || []).filter(d =>
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
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
              <Layers className="w-6 h-6 text-[#FFED00]" />
              <span>कैटेगरी एवं लोकेशन पदानुक्रम मैनेजमेंट</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              राष्ट्रीय, राज्यवार, मध्य प्रदेश के सभी 52 जिले, और भारत के समस्त राज्यों की भौगोलिक बीट्स व न्यूज़ कैटेगरी को एक सुव्यवस्थित आर्किटेक्चर में प्रबंधित करें।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTab === 'categories' ? (
              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>+ नई कैटेगरी जोड़ें</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowDistrictModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>+ नया जिला/बीट जोड़ें</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 mt-6 border-b border-[#232B3E] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>1. न्यूज़ कैटेगरी व सब-कैटेगरी ({categories.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('geography')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'geography'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>2. भारत राज्य व जिला पदानुक्रम ({Object.keys(ALL_INDIA_STATES_DISTRICTS).length} राज्य)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Categories Management */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="bg-[#121622] p-3.5 rounded-2xl border border-[#232B3E] flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="कैटेगरी या विषय खोजें..."
                className="w-full bg-[#0A0D14] border border-[#232B3E] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-semibold"
              />
            </div>
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">
              कुल {filteredCategories.length} श्रेणियां सक्रिय
            </span>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map(cat => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-white">{cat.hindiName}</h3>
                        <span className="text-[10px] text-slate-400 font-mono">#{cat.slug}</span>
                      </div>
                    </div>
                    {cat.isCustom && (
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.2 rounded border border-purple-500/40">
                        कस्टम
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Subcategories Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {cat.subcategories.map(sub => (
                      <span
                        key={sub}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#0A0D14] text-slate-300 border border-slate-800"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1E273A] flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500">क्रम: #{cat.order}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCategory(cat)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="संपादित करें"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {cat.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id, cat.hindiName)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600/30 text-slate-400 hover:text-red-400 cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Geography & Location Management */}
      {activeTab === 'geography' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left 1 Col: States List */}
            <div className="bg-[#121622] p-4 rounded-2xl border border-[#232B3E] space-y-3">
              <h3 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>राज्य व केंद्रशासित प्रदेश</span>
              </h3>
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto no-scrollbar">
                {Object.keys(ALL_INDIA_STATES_DISTRICTS).map(stateName => {
                  const isSelected = selectedState === stateName;
                  const count = ALL_INDIA_STATES_DISTRICTS[stateName].length;
                  return (
                    <button
                      key={stateName}
                      type="button"
                      onClick={() => setSelectedState(stateName)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                          : 'bg-[#0A0D14] text-slate-300 hover:bg-slate-800 hover:text-white border border-[#1E273A]'
                      }`}
                    >
                      <span>{stateName}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {count} जिले
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 2 Cols: Districts of Selected State */}
            <div className="md:col-span-2 bg-[#121622] p-4 sm:p-5 rounded-2xl border border-[#232B3E] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232B3E] pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>{selectedState} के जिले एवं स्थानीय बीट्स</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    प्रत्येक जिले की खबरों को एडमिन द्वारा अलग-अलग फ़िल्टर किया जा सकता है
                  </p>
                </div>

                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    placeholder="जिला खोजें..."
                    className="w-full bg-[#0A0D14] border border-[#232B3E] rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Districts Badge Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[440px] overflow-y-auto no-scrollbar">
                {activeDistricts.map(dist => (
                  <div
                    key={dist}
                    className="p-2.5 rounded-xl bg-[#0A0D14] border border-[#1E273A] hover:border-amber-500/40 flex items-center justify-between gap-2 text-xs font-semibold text-slate-200 transition-all"
                  >
                    <span className="truncate">{dist}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  </div>
                ))}
                {activeDistricts.length === 0 && (
                  <div className="col-span-full py-8 text-center text-xs text-slate-500">
                    कोई जिला नहीं मिला।
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D111A] border-2 border-amber-500/50 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
              <h3 className="text-sm font-black text-white">
                {editingCategory ? 'कैटेगरी संपादित करें' : 'नई कस्टम कैटेगरी जोड़ें'}
              </h3>
              <button
                onClick={() => setShowCatModal(false)}
                className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">कैटेगरी का हिंदी नाम:</label>
                <input
                  type="text"
                  required
                  value={catHindiName}
                  onChange={(e) => setCatHindiName(e.target.value)}
                  placeholder="उदा: प्रादेशिक विकास एवं पंचायत"
                  className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">अंग्रेजी नाम / स्लग (URL Slug):</label>
                <input
                  type="text"
                  required
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="उदा: rural-development"
                  className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">संक्षिप्त विवरण (Description):</label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="इस कैटेगरी में आने वाली खबरों का विवरण..."
                  className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">सब-कैटेगरी टैग्स (कॉमा से अलग करें):</label>
                <input
                  type="text"
                  value={subcatString}
                  onChange={(e) => setSubcatString(e.target.value)}
                  placeholder="उदा: ग्राम पंचायत, मनरेगा, प्रधानमंत्री आवास, सड़क निर्माण"
                  className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 border-t border-[#232B3E] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black"
                >
                  सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add District Modal */}
      {showDistrictModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D111A] border-2 border-amber-500/50 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
              <h3 className="text-sm font-black text-white">
                '{selectedState}' में नया जिला या क्षेत्रीय बीट जोड़ें
              </h3>
              <button
                onClick={() => setShowDistrictModal(false)}
                className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDistrict} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">जिले या क्षेत्रीय बीट का नाम:</label>
                <input
                  type="text"
                  required
                  value={newDistrictName}
                  onChange={(e) => setNewDistrictName(e.target.value)}
                  placeholder="उदा: मऊगंज / मैहर / पांढुर्णा / चाचौड़ा"
                  className="w-full bg-[#121622] border border-[#232B3E] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 border-t border-[#232B3E] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDistrictModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black"
                >
                  जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
