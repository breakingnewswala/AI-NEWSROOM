import React, { useState, useMemo } from 'react';
import {
  Newspaper,
  Radio,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Clapperboard,
  Share2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Flame,
  Clock,
  MapPin,
  Tag,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronDown,
  LayoutGrid,
  List,
  Copy,
  Check,
  X,
  MessageCircle,
  Send,
  Building2,
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  Archive,
  Globe
} from 'lucide-react';

export interface FeedArticleItem {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: 'RSS' | 'WEBSITE' | 'WIRE' | 'GOVT';
  sourceLogo?: string;
  headline: string;
  summary: string;
  bulletPoints?: string[];
  url: string;
  imageUrl?: string;
  publishedAt: string;
  district: string;
  districtHindi: string;
  state: string;
  category: string;
  categoryHindi: string;
  urgency: 'Breaking' | 'Top Story' | 'Normal' | 'Viral';
  viralScore?: number;
  status: 'new' | 'graphic_created' | 'published' | 'archived';
  isBookmarked?: boolean;
}

interface NewsFeedHubProps {
  onShowToast: (title: string, message?: string) => void;
  onGenerateGraphic: (article: FeedArticleItem) => void;
  onSendToVideoStudio: (article: FeedArticleItem) => void;
  userDistrict?: string;
  userRole?: string;
}

export const INITIAL_FEED_ARTICLES: FeedArticleItem[] = [
  {
    id: 'feed-bhopal-kolar',
    sourceId: 'src-1',
    sourceName: 'भोपाल नगर निगम व NIC',
    sourceType: 'GOVT',
    sourceLogo: '/Logo.png',
    headline: 'भोपाल: कोलार सिक्स लेन का काम अंतिम चरण में, 15 मई तक पूरा होगा डामरीकरण',
    summary: 'कोलार के 5 लाख से अधिक नागरिकों को ट्रैफिक जाम से मिलेगी मुक्ति। नगर निगम व PWD ने 15 मई की डेडलाइन तय की है। डिवाइडर ब्यूटीफिकेशन और लाइटिंग का कार्य भी तेजी पर।',
    bulletPoints: [
      '15 मई तक डामरीकरण और डिवाइडर ब्यूटीफिकेशन की डेडलाइन तय',
      'कोलार रूट के 5 लाख नागरिकों को रोजाना ट्रैफिक जाम से मिलेगी मुक्ति',
      'स्थानीय विधायक व प्रशासनिक टीम ने ग्राउंड जीरो पर किया निरीक्षण'
    ],
    url: 'https://bhopal.nic.in/en/feed/press-releases.xml',
    imageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
    publishedAt: '8 मिनट पहले',
    district: 'Bhopal',
    districtHindi: 'भोपाल',
    state: 'मध्य प्रदेश',
    category: 'Development',
    categoryHindi: 'इन्फ्रास्ट्रक्चर व विकास',
    urgency: 'Breaking',
    viralScore: 96,
    status: 'new',
    isBookmarked: true
  },
  {
    id: 'feed-indore-metro',
    sourceId: 'src-2',
    sourceName: 'दैनिक भास्कर RSS',
    sourceType: 'RSS',
    sourceLogo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&auto=format&fit=crop&q=80',
    headline: 'इंदौर: सुपर कॉरिडोर से रोबोट चौराहे तक मेट्रो का सफल हाई-स्पीड ट्रायल, अगले माह से आम जनता के लिए शुरुआत',
    summary: 'इंदौर मेट्रो रेल कॉर्पोरेशन ने 80 किमी/घंटा की गति पर दूसरा सफल ट्रायल पूरा किया। गांधीनगर से सुपर कॉरिडोर के बीच सभी स्टेशन तैयार हो चुके हैं।',
    bulletPoints: [
      '80 किमी प्रति घंटे की गति से मेट्रो का सफल परीक्षण संपन्न',
      'सुपर कॉरिडोर से रोबोट चौराहे तक 6 स्टेशन पूर्ण रूप से तैयार',
      'मुख्यमंत्री अगले माह हरी झंडी दिखाकर लोकार्पण कर सकते हैं'
    ],
    url: 'https://bhaskar.com/madhya-pradesh/indore/news/indore-metro-high-speed-trial-update',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
    publishedAt: '22 मिनट पहले',
    district: 'Indore',
    districtHindi: 'इंदौर',
    state: 'मध्य प्रदेश',
    category: 'Development',
    categoryHindi: 'इन्फ्रास्ट्रक्चर व विकास',
    urgency: 'Top Story',
    viralScore: 91,
    status: 'new',
    isBookmarked: false
  },
  {
    id: 'feed-jabalpur-hc',
    sourceId: 'src-3',
    sourceName: 'पत्रिका समाचार वायर',
    sourceType: 'WIRE',
    sourceLogo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80',
    headline: 'जबलपुर: हाई कोर्ट का सख्त निर्देश, सरकारी कर्मचारियों के विवादित तबादला आदेशों पर रोक, 4 सप्ताह में जवाब तलब',
    summary: 'मध्य प्रदेश उच्च न्यायालय की युगलपीठ ने बिना प्रशासनिक आधार के किए गए तबादलों की सूची पर अंतरिम स्थगन आदेश जारी किया है।',
    bulletPoints: [
      'शिक्षकों व कर्मचारियों के ट्रांसफर पर हाईकोर्ट का स्थगन आदेश',
      'राज्य शासन को 4 सप्ताह में विस्तृत शपथपत्र दाखिल करने का निर्देश',
      'हजारों कर्मचारियों और परिवारों को सीधे तौर पर बड़ी राहत'
    ],
    url: 'https://patrika.com/jabalpur-news/mp-high-court-transfer-stay-order',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    publishedAt: '45 मिनट पहले',
    district: 'Jabalpur',
    districtHindi: 'जबलपुर',
    state: 'मध्य प्रदेश',
    category: 'Judiciary',
    categoryHindi: 'अपराध व कानून',
    urgency: 'Breaking',
    viralScore: 88,
    status: 'new',
    isBookmarked: true
  },
  {
    id: 'feed-ujjain-mahakal',
    sourceId: 'src-4',
    sourceName: 'मध्य प्रदेश जनसंपर्क (DPR)',
    sourceType: 'GOVT',
    sourceLogo: '/Logo.png',
    headline: 'उज्जैन: श्री महाकाल महालोक और क्षिप्रा रिवरफ्रंट के दूसरे चरण का टेंडर जारी, ₹450 करोड़ की योजना',
    summary: 'उज्जैन सिंहस्थ 2028 की तैयारियों को लेकर महाकालेश्वर मंदिर प्रबंध समिति और जिला प्रशासन ने नया मास्टरप्लान स्वीकृत किया।',
    bulletPoints: [
      'सिंहस्थ 2028 हेतु 450 करोड़ रुपये की विस्तृत कार्ययोजना मंजूर',
      'क्षिप्रा नदी के दोनों तटों पर 5 किलोमीटर लंबा पक्का रिवरफ्रंट बनेगा',
      'श्रद्धालुओं के लिए आधुनिक सुगम दर्शन कॉरिडोर और इलेक्ट्रिक शटल सेवा'
    ],
    url: 'https://mpinfo.org/Home/PressReleaseDetail?PRid=UjjainMahakalPhase2',
    imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80',
    publishedAt: '1 घंटा पहले',
    district: 'Ujjain',
    districtHindi: 'उज्जैन',
    state: 'मध्य प्रदेश',
    category: 'Culture',
    categoryHindi: 'धर्म व संस्कृति',
    urgency: 'Top Story',
    viralScore: 84,
    status: 'new',
    isBookmarked: false
  },
  {
    id: 'feed-gwalior-chambal',
    sourceId: 'src-2',
    sourceName: 'दैनिक भास्कर RSS',
    sourceType: 'RSS',
    sourceLogo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&auto=format&fit=crop&q=80',
    headline: 'ग्वालियर: चंबल एक्सप्रेसवे के नए लिंक रूट को केंद्र से हरी झंडी, दिल्ली-ग्वालियर दूरी 3 घंटे घटेगी',
    summary: 'केंद्रीय सड़क परिवहन मंत्रालय ने मध्य प्रदेश और राजस्थान को जोड़ने वाले अटल प्रगति पथ (चंबल एक्सप्रेसवे) के संशोधित डीपीआर को मंजूरी दे दी है।',
    bulletPoints: [
      'ग्वालियर से दिल्ली का सफर 3 घंटे कम होकर मात्र 4 घंटे रह जाएगा',
      'मुरैना, भिंड और श्योपुर के 120 गांवों को सीधा एक्सप्रेसवे कनेक्ट मिलेगा',
      'किसानों के भूमि अधिग्रहण हेतु विशेष राहत पैकेज का प्रावधान'
    ],
    url: 'https://bhaskar.com/madhya-pradesh/gwalior/news/chambal-expressway-new-route-approval',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    publishedAt: '1.5 घंटे पहले',
    district: 'Gwalior',
    districtHindi: 'ग्वालियर',
    state: 'मध्य प्रदेश',
    category: 'Development',
    categoryHindi: 'इन्फ्रास्ट्रक्चर व विकास',
    urgency: 'Normal',
    viralScore: 78,
    status: 'new',
    isBookmarked: false
  },
  {
    id: 'feed-sagar-medical',
    sourceId: 'src-3',
    sourceName: 'पत्रिका समाचार वायर',
    sourceType: 'WIRE',
    sourceLogo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80',
    headline: 'सागर: बुंदेलखंड मेडिकल कॉलेज में 150 नई आईसीयू बेड्स और रोबोटिक सर्जरी सेंटर की स्थापना',
    summary: 'सागर संभाग के 6 जिलों के मरीजों को अब बड़े शहरों के चक्कर नहीं लगाने होंगे। स्वास्थ्य विभाग ने ₹85 करोड़ की अत्याधुनिक मशीनरी स्वीकृत की।',
    bulletPoints: [
      'बुंदेलखंड मेडिकल कॉलेज में 150 नए वेंटिलेटर आईसीयू बेड्स की व्यवस्था',
      'रोबोटिक कैथलैब और न्यूरोसर्जरी विंग का निर्माण अगले तीन माह में',
      'बीपीएल व आयुष्मान कार्डधारकों को शत-प्रतिशत निःशुल्क उपचार'
    ],
    url: 'https://patrika.com/sagar-news/bundelkhand-medical-college-new-icu-beds',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    publishedAt: '2 घंटे पहले',
    district: 'Sagar',
    districtHindi: 'सागर',
    state: 'मध्य प्रदेश',
    category: 'Health',
    categoryHindi: 'स्वास्थ्य व चिकित्सा',
    urgency: 'Top Story',
    viralScore: 74,
    status: 'new',
    isBookmarked: false
  },
  {
    id: 'feed-rewa-solar',
    sourceId: 'src-4',
    sourceName: 'मध्य प्रदेश ऊर्जा विभाग',
    sourceType: 'GOVT',
    sourceLogo: '/Logo.png',
    headline: 'रीवा: एशिया के सबसे बड़े 750MW सोलर प्लांट से नया रिकॉर्ड, दिल्ली मेट्रो को 34% ग्रीन पावर सप्लाई',
    summary: 'रीवा अल्ट्रा मेगा सोलर प्रोजेक्ट ने लगातार तीसरे वर्ष राष्ट्रीय स्तर पर अधिकतम ऊर्जा उत्पादन का रिकॉर्ड बनाया। नए सब-स्टेशन का विस्तार कार्य प्रारंभ।',
    bulletPoints: [
      '750 मेगावाट क्षमता वाले प्लांट से प्रतिदिन 38 लाख यूनिट बिजली उत्पादन',
      'दिल्ली मेट्रो रेल कॉर्पोरेशन को कुल ऊर्जा का 34% हिस्सा नियमित आपूर्ति',
      'कार्बन उत्सर्जन में 15.4 लाख टन प्रति वर्ष की भारी कमी दर्ज'
    ],
    url: 'https://rewa.nic.in/en/rewa-ultra-mega-solar-plant-record',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    publishedAt: '3 घंटे पहले',
    district: 'Rewa',
    districtHindi: 'रीवा',
    state: 'मध्य प्रदेश',
    category: 'Environment',
    categoryHindi: 'मौसम व कृषि',
    urgency: 'Normal',
    viralScore: 71,
    status: 'new',
    isBookmarked: false
  },
  {
    id: 'feed-bhopal-cabinet',
    sourceId: 'src-1',
    sourceName: 'मध्य प्रदेश जनसंपर्क (DPR)',
    sourceType: 'GOVT',
    sourceLogo: '/Logo.png',
    headline: 'मध्य प्रदेश: कैबिनेट बैठक में 12 ऐतिहासिक प्रस्ताव पास, लाड़ली बहना आवास योजना की नई किस्त जारी',
    summary: 'मंत्रालय भोपाल में मुख्यमंत्री डॉ. मोहन यादव की अध्यक्षता में संपन्न कैबिनेट बैठक में राज्य के कर्मचारियों और किसानों के हित में कई बड़े फैसले लिए गए।',
    bulletPoints: [
      'लाड़ली बहना आवास योजना के तहत 4.5 लाख परिवारों को पहली किस्त',
      'गेहूं खरीदी पर ₹125 प्रति क्विंटल अतिरिक्त बोनस राशि का अनुमोदन',
      'प्रदेश के 55 जिलों में नए साइबर पुलिस थानों के गठन को स्वीकृति'
    ],
    url: 'https://mpinfo.org/cabinet-decisions-mp-bhopal',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    publishedAt: '4 घंटे पहले',
    district: 'Bhopal',
    districtHindi: 'भोपाल',
    state: 'मध्य प्रदेश',
    category: 'Politics',
    categoryHindi: 'राजनीति व शासन',
    urgency: 'Viral',
    viralScore: 98,
    status: 'new',
    isBookmarked: true
  }
];

export const MP_DISTRICTS = [
  'सभी जिले',
  'भोपाल',
  'इंदौर',
  'जबलपुर',
  'ग्वालियर',
  'उज्जैन',
  'सागर',
  'रीवा',
  'छिंदवाड़ा',
  'रतलाम',
  'मुरैना',
  'देवास',
  'सतना',
  'विदिशा',
  'सीहोर',
  'होशंगाबाद (नर्मदापुरम)',
  'खंडवा',
  'खरगोन',
  'मंदसौर',
  'नीमच',
  'शिवपुरी',
  'गुना',
  'दमोह',
  'छतरपुर',
  'टीकमगढ़',
  'पन्ना',
  'शहडोल',
  'अनूपपुर',
  'उमरिया',
  'बैतूल',
  'हरदा',
  'धार',
  'झाबुआ',
  'बड़वानी',
  'राजगढ़',
  'शाजापुर',
  'आगर मालवा',
  'भिंड',
  'श्योपुर',
  'दतिया',
  'कटनी',
  'डिंडोरी',
  'मंडला',
  'बालाघाट',
  'सिवनी',
  'नरसिंहपुर',
  'रायसेन',
  'अशोकनगर',
  'बुरहानपुर',
  'अलीराजपुर',
  'सिंगरौली',
  'सीधी',
  'मऊगंज'
];

export const FEED_CATEGORIES = [
  'सभी श्रेणियां',
  'इन्फ्रास्ट्रक्चर व विकास',
  'राजनीति व शासन',
  'अपराध व कानून',
  'धर्म व संस्कृति',
  'स्वास्थ्य व चिकित्सा',
  'मौसम व कृषि',
  'शिक्षा व रोजगार',
  'खेल कूद',
  'व्यापार व अर्थव्यवस्था',
  'मनोरंजन व सिनेमा'
];

export function NewsFeedHub({
  onShowToast,
  onGenerateGraphic,
  onSendToVideoStudio,
  userDistrict,
  userRole
}: NewsFeedHubProps) {
  const [articles, setArticles] = useState<FeedArticleItem[]>(INITIAL_FEED_ARTICLES);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('सभी जिले');
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी श्रेणियां');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBookmarkOnly, setFilterBookmarkOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshActive, setAutoRefreshActive] = useState(true);

  // Quick Broadcast Modal State
  const [broadcastArticle, setBroadcastArticle] = useState<FeedArticleItem | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Add Custom News Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHeadline, setNewHeadline] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newDistrict, setNewDistrict] = useState(userDistrict || 'भोपाल');
  const [newCategory, setNewCategory] = useState('इन्फ्रास्ट्रक्चर व विकास');
  const [newUrgency, setNewUrgency] = useState<'Breaking' | 'Top Story' | 'Normal' | 'Viral'>('Breaking');
  const [newSourceName, setNewSourceName] = useState('ग्राउंड रिपोर्टर डेस्क');

  // Trigger Feed Sync
  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    onShowToast('फीड रिफ्रेश हो रही है...', 'सभी 12 RSS व सरकारी सोर्सेज से ताज़ा खबरें जांची जा रही हैं');

    setTimeout(() => {
      setIsRefreshing(false);
      onShowToast('फीड सिंक संपन्न!', '3 नई खबरें प्राप्त हुईं और डुप्लिकेट्स फिल्टर किए गए।');
    }, 900);
  };

  // Toggle Bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticles(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
    const item = articles.find(a => a.id === id);
    if (item?.isBookmarked) {
      onShowToast('बुकमार्क हटाया गया');
    } else {
      onShowToast('⭐ खबर बुकमार्क में सहेजी गई!');
    }
  };

  // Archive Article
  const handleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticles(prev => prev.filter(item => item.id !== id));
    onShowToast('खबर को फीड से हटा दिया गया');
  };

  // Add Manual News Handler
  const handleAddManualNews = () => {
    if (!newHeadline.trim() || !newSummary.trim()) {
      onShowToast('कृपया हेडलाइन और समरी दोनों भरें');
      return;
    }

    const newItem: FeedArticleItem = {
      id: 'feed-custom-' + Date.now(),
      sourceId: 'src-custom',
      sourceName: newSourceName || 'ब्यूरो रिपोर्टर',
      sourceType: 'WIRE',
      sourceLogo: '/Logo.png',
      headline: `${newDistrict}: ${newHeadline}`,
      summary: newSummary,
      bulletPoints: [
        `${newDistrict} जिला प्रशासन व ग्राउंड टीम द्वारा त्वरित निगरानी`,
        `स्थानीय नागरिकों के लिए प्राथमिकता पर कार्रवाई जारी`,
        `संबंधित विभाग द्वारा आगामी 24 घंटे में समीक्षा रिपोर्ट तलब`
      ],
      url: 'https://breakingnewswala.in',
      imageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
      publishedAt: 'अभी-अभी',
      district: newDistrict,
      districtHindi: newDistrict,
      state: 'मध्य प्रदेश',
      category: 'General',
      categoryHindi: newCategory,
      urgency: newUrgency,
      viralScore: newUrgency === 'Breaking' ? 95 : 82,
      status: 'new',
      isBookmarked: true
    };

    setArticles([newItem, ...articles]);
    setShowAddModal(false);
    setNewHeadline('');
    setNewSummary('');
    onShowToast('✅ नई खबर फीड में जोड़ी गई!', 'अब सीधे "खबर से ग्राफिक बनाएं" पर टैप करें');
  };

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // District Filter
      if (selectedDistrict !== 'सभी जिले' && article.districtHindi !== selectedDistrict && article.district !== selectedDistrict) {
        return false;
      }
      // Category Filter
      if (selectedCategory !== 'सभी श्रेणियां' && article.categoryHindi !== selectedCategory) {
        return false;
      }
      // Urgency Filter
      if (selectedUrgency !== 'ALL' && article.urgency !== selectedUrgency) {
        return false;
      }
      // Source Type Filter
      if (selectedSourceType !== 'ALL' && article.sourceType !== selectedSourceType) {
        return false;
      }
      // Bookmark Only
      if (filterBookmarkOnly && !article.isBookmarked) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchH = article.headline.toLowerCase().includes(q);
        const matchS = article.summary.toLowerCase().includes(q);
        const matchD = article.districtHindi.toLowerCase().includes(q);
        const matchSrc = article.sourceName.toLowerCase().includes(q);
        if (!matchH && !matchS && !matchD && !matchSrc) return false;
      }
      return true;
    });
  }, [articles, selectedDistrict, selectedCategory, selectedUrgency, selectedSourceType, filterBookmarkOnly, searchQuery]);

  // KPIs
  const totalCount = articles.length;
  const breakingCount = articles.filter(a => a.urgency === 'Breaking').length;
  const viralCount = articles.filter(a => a.urgency === 'Viral' || (a.viralScore && a.viralScore > 85)).length;
  const bookmarkedCount = articles.filter(a => a.isBookmarked).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Newsroom Feed Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E0608] via-[#120D1A] to-[#0A1324] border-2 border-red-500/40 p-5 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E21A25]/20 text-[#FFED00] border border-[#E21A25]/40 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FFED00] pulse-live"></span>
              <span>लाइव न्यूज फीड हब • Real-Time Ingest Stream</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Newspaper className="w-7 h-7 text-[#FFED00]" />
              <span>स्मार्ट न्यूज़ फीड व डिस्ट्रिक्ट रडार</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              सरकारी पोर्टल्स, वायर एजेंसीज एवं 18+ RSS फीड्स से रीयल-टाइम खबरें। किसी भी खबर से 1-क्लिक में 4:5 सोशल मीडिया ग्राफिक तैयार करें या वीडियो स्टूडियो में AI SEO पैकेज बनाएं।
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFED00] hover:bg-yellow-400 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>+ नई खबर दर्ज करें</span>
            </button>

            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-[#FFED00] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'सिंक जारी...' : 'फीड रिफ्रेश'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="text-slate-400">ऑटो-रिफ्रेश:</span>
              <button
                onClick={() => setAutoRefreshActive(!autoRefreshActive)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                  autoRefreshActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {autoRefreshActive ? 'चालू (30s)' : 'बंद'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Feed KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-slate-800/80 text-xs">
          <div className="bg-[#0A0D15]/80 rounded-2xl p-3 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">आज प्राप्त कुल खबरें</span>
            <div className="text-2xl font-black text-white mt-1 flex items-center justify-between">
              <span>{totalCount}</span>
              <Newspaper className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-[10px] text-emerald-400 mt-0.5 block font-medium">12 जिलों से एक्टिव स्ट्रीम</span>
          </div>

          <div className="bg-[#0A0D15]/80 rounded-2xl p-3 border border-red-500/30">
            <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider block">🔴 ब्रेकिंग अलर्ट्स</span>
            <div className="text-2xl font-black text-red-400 mt-1 flex items-center justify-between">
              <span>{breakingCount}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 pulse-live"></span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">तत्काल पब्लिश हेतु प्राथमिकता</span>
          </div>

          <div className="bg-[#0A0D15]/80 rounded-2xl p-3 border border-amber-500/30">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">🔥 वायरल वेलोसिटी</span>
            <div className="text-2xl font-black text-[#FFED00] mt-1 flex items-center justify-between">
              <span>{viralCount}</span>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-[10px] text-amber-300/80 mt-0.5 block">85+ स्कोर (हाई रीच)</span>
          </div>

          <div className="bg-[#0A0D15]/80 rounded-2xl p-3 border border-blue-500/30">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">⭐ बुकमार्क व सेव्ड</span>
            <div className="text-2xl font-black text-cyan-400 mt-1 flex items-center justify-between">
              <span>{bookmarkedCount}</span>
              <Bookmark className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">स्पेशल रिपोर्टिंग सूची</span>
          </div>
        </div>
      </div>

      {/* ================= FILTER AND SEARCH CONTROL TOOLBAR ================= */}
      <div className="bg-[#121622] rounded-2xl border border-[#232B3E] p-4 space-y-3.5 shadow-xl">
        {/* Search & Layout Toggle Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="हेडलाइन, जिला, कीवर्ड या समाचार स्रोत खोजें..."
              className="w-full bg-[#0A0D15] border border-slate-700/80 focus:border-[#E21A25] focus:ring-1 focus:ring-[#E21A25] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Urgency / Bookmark Filters */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedUrgency(selectedUrgency === 'Breaking' ? 'ALL' : 'Breaking')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                selectedUrgency === 'Breaking'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400 pulse-live"></span>
              <span>ब्रेकिंग</span>
            </button>

            <button
              onClick={() => setSelectedUrgency(selectedUrgency === 'Top Story' ? 'ALL' : 'Top Story')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                selectedUrgency === 'Top Story'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-900/40'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <span>⭐ टॉप स्टोरी</span>
            </button>

            <button
              onClick={() => setSelectedUrgency(selectedUrgency === 'Viral' ? 'ALL' : 'Viral')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                selectedUrgency === 'Viral'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>वायरल</span>
            </button>

            <button
              onClick={() => setFilterBookmarkOnly(!filterBookmarkOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                filterBookmarkOnly
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>बुकमार्क</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-slate-900/90 rounded-xl border border-slate-800 ml-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#E21A25] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="मैगजीन ग्रिड व्यू"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'compact' ? 'bg-[#E21A25] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="कॉम्पैक्ट लिस्ट व्यू"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Multi-tier Dropdown Filter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
          {/* District Selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#FFED00]" />
              <span>जिला फिल्टर (District):</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full bg-[#0A0D15] border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-[#E21A25] cursor-pointer"
            >
              {MP_DISTRICTS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase flex items-center gap-1">
              <Tag className="w-3 h-3 text-purple-400" />
              <span>समाचार श्रेणी (Category):</span>
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0A0D15] border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-[#E21A25] cursor-pointer"
            >
              {FEED_CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Source Type Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 mb-1 block uppercase flex items-center gap-1">
              <Radio className="w-3 h-3 text-orange-400" />
              <span>स्रोत का प्रकार (Source Feed):</span>
            </label>
            <select
              value={selectedSourceType}
              onChange={e => setSelectedSourceType(e.target.value)}
              className="w-full bg-[#0A0D15] border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-[#E21A25] cursor-pointer"
            >
              <option value="ALL">सभी स्रोत (All Sources)</option>
              <option value="GOVT">सरकारी पोर्टल / NIC / DPR</option>
              <option value="RSS">RSS फीड्स (दैनिक भास्कर, आदि)</option>
              <option value="WIRE">समाचार वायर एजेंसीज</option>
              <option value="WEBSITE">वेबसाइट लिंक्स</option>
            </select>
          </div>
        </div>

        {/* Filter Status Feedback Bar */}
        {(selectedDistrict !== 'सभी जिले' || selectedCategory !== 'सभी श्रेणियां' || selectedUrgency !== 'ALL' || selectedSourceType !== 'ALL' || filterBookmarkOnly || searchQuery) && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>फिल्टर्स सक्रिय:</span>
              {selectedDistrict !== 'सभी जिले' && (
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  जिला: {selectedDistrict}
                </span>
              )}
              {selectedCategory !== 'सभी श्रेणियां' && (
                <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                  श्रेणी: {selectedCategory}
                </span>
              )}
              {selectedUrgency !== 'ALL' && (
                <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30">
                  {selectedUrgency}
                </span>
              )}
              {filterBookmarkOnly && (
                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  ⭐ केवल बुकमार्क
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedDistrict('सभी जिले');
                setSelectedCategory('सभी श्रेणियां');
                setSelectedUrgency('ALL');
                setSelectedSourceType('ALL');
                setFilterBookmarkOnly(false);
                setSearchQuery('');
              }}
              className="text-[#FFED00] hover:underline cursor-pointer font-bold"
            >
              सभी फिल्टर हटाएं (Reset Filters)
            </button>
          </div>
        )}
      </div>

      {/* ================= ARTICLES FEED LISTING ================= */}
      {filteredArticles.length === 0 ? (
        <div className="bg-[#121622] rounded-3xl border border-[#232B3E] p-12 text-center space-y-3">
          <Newspaper className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">चयनित फिल्टर के अनुरूप कोई खबर नहीं मिली</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            कृपया अपने जिला या श्रेणी फिल्टर को बदलें, या ऊपर '+ नई खबर दर्ज करें' बटन दबाकर सीधे खबर दर्ज करें।
          </p>
          <button
            onClick={() => {
              setSelectedDistrict('सभी जिले');
              setSelectedCategory('सभी श्रेणियां');
              setSelectedUrgency('ALL');
              setSelectedSourceType('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#E21A25] text-white text-xs font-bold cursor-pointer"
          >
            सभी खबरें देखें
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ================= 1. MAGAZINE GRID VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              className="bg-[#121622] rounded-2xl border-2 border-[#232B3E] hover:border-red-500/60 transition-all duration-200 overflow-hidden shadow-xl flex flex-col justify-between group hover:shadow-2xl hover:shadow-red-950/20"
            >
              <div>
                {/* Image & Source Header Banner */}
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={article.imageUrl || 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80'}
                    alt={article.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121622] via-[#121622]/40 to-black/60"></div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                    <span className="bg-[#E21A25] text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 uppercase tracking-wide border border-red-400/40">
                      {article.urgency === 'Breaking' && <span className="w-1.5 h-1.5 rounded-full bg-[#FFED00] pulse-live"></span>}
                      {article.urgency}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {article.viralScore && article.viralScore > 80 && (
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 fill-current" />
                          <span>{article.viralScore}%</span>
                        </span>
                      )}

                      <button
                        onClick={e => toggleBookmark(article.id, e)}
                        className={`p-1.5 rounded-lg backdrop-blur-md cursor-pointer transition-colors ${
                          article.isBookmarked
                            ? 'bg-[#FFED00] text-slate-950 shadow'
                            : 'bg-black/60 text-slate-300 hover:text-white'
                        }`}
                        title={article.isBookmarked ? 'बुकमार्क हटाएं' : 'बुकमार्क करें'}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Image Info: Source & Location */}
                  <div className="absolute bottom-2 inset-x-2.5 flex items-center justify-between text-[10px] z-10">
                    <span className="bg-black/75 backdrop-blur-sm text-[#FFED00] font-black px-2 py-0.5 rounded border border-yellow-500/30 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FFED00]" />
                      <span>{article.districtHindi}</span>
                    </span>

                    <span className="bg-black/75 backdrop-blur-sm text-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{article.publishedAt}</span>
                    </span>
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300 truncate max-w-[170px] flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>{article.sourceName}</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-purple-300 border border-slate-700 text-[9px]">
                      {article.categoryHindi}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {article.headline}
                  </h3>

                  <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>

                  {/* Bullet Highlights if available */}
                  {article.bulletPoints && article.bulletPoints.length > 0 && (
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 space-y-1 text-[11px] text-slate-300">
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                        प्रमुख बिंदु (Key Facts):
                      </span>
                      {article.bulletPoints.slice(0, 2).map((bp, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-slate-300 leading-tight">
                          <span className="text-red-400 font-bold shrink-0">•</span>
                          <span className="line-clamp-1">{bp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-slate-900/90 border-t border-[#232B3E] space-y-2">
                {/* Primary Action Button: 4:5 Graphic Generator */}
                <button
                  onClick={() => onGenerateGraphic(article)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#E21A25] to-[#B70F18] hover:from-red-600 hover:to-red-700 text-white font-black text-xs shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] border border-red-400/40"
                  title="इस खबर से सीधे 3 सेकंड में 4:5 ग्राफिक कार्ड बनाएं"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FFED00] fill-current" />
                  <span>⚡ खबर से 4:5 ग्राफिक बनाएं</span>
                  <span className="text-[9px] bg-[#FFED00] text-slate-950 px-1.5 py-0.2 rounded font-black">
                    3-Sec
                  </span>
                </button>

                {/* Secondary Actions: Video Studio + Quick Social Broadcast */}
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    onClick={() => onSendToVideoStudio(article)}
                    className="py-1.5 px-2 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 hover:text-white border border-purple-500/40 flex items-center justify-center gap-1 font-bold text-[10px] cursor-pointer"
                    title="वीडियो स्टूडियो में भेजें (AI SEO + 16:9 थंबनेल)"
                  >
                    <Clapperboard className="w-3 h-3 text-purple-300" />
                    <span>वीडियो</span>
                  </button>

                  <button
                    onClick={() => setBroadcastArticle(article)}
                    className="py-1.5 px-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-500/40 flex items-center justify-center gap-1 font-bold text-[10px] cursor-pointer"
                    title="WhatsApp / Telegram पर तुरंत शेयर करें"
                  >
                    <Share2 className="w-3 h-3 text-emerald-400" />
                    <span>शेयर</span>
                  </button>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center gap-1 font-medium text-[10px] cursor-pointer"
                    title="मूल स्रोत पर पूरी खबर पढ़ें"
                  >
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                    <span>मूल लिंक</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= 2. HIGH-DENSITY COMPACT LIST VIEW ================= */
        <div className="bg-[#121622] rounded-2xl border border-[#232B3E] divide-y divide-slate-800/80 overflow-hidden shadow-xl">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              className="p-3.5 sm:p-4 hover:bg-slate-900/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <img
                  src={article.imageUrl || '/Logo.png'}
                  alt="thumb"
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700 bg-black/60 hidden sm:block"
                />

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#E21A25] text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                      {article.urgency}
                    </span>
                    <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.2 rounded border border-amber-500/30 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{article.districtHindi}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{article.sourceName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">• {article.publishedAt}</span>
                  </div>

                  <h3 className="text-white font-bold text-xs sm:text-sm truncate">
                    {article.headline}
                  </h3>
                  <p className="text-slate-400 text-[11px] line-clamp-1 leading-normal">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons in List row */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => onGenerateGraphic(article)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E21A25] to-[#B70F18] hover:from-red-600 text-white font-black text-xs flex items-center gap-1.5 shadow cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FFED00] fill-current" />
                  <span>ग्राफिक बनाएं</span>
                </button>

                <button
                  onClick={() => onSendToVideoStudio(article)}
                  className="p-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/40 cursor-pointer"
                  title="वीडियो स्टूडियो"
                >
                  <Clapperboard className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setBroadcastArticle(article)}
                  className="p-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 cursor-pointer"
                  title="शेयर करें"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={e => toggleBookmark(article.id, e)}
                  className={`p-1.5 rounded-xl border cursor-pointer ${
                    article.isBookmarked
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                  }`}
                  title="बुकमार्क"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: QUICK SOCIAL BROADCAST (WHATSAPP / TELEGRAM) ================= */}
      {broadcastArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#121622] w-full max-w-xl rounded-2xl border-2 border-emerald-500/50 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">त्वरित सोशल मीडिया ब्रॉडकास्ट (Quick Share)</h3>
                  <p className="text-[10px] text-slate-400">WhatsApp, Telegram और Facebook ग्रुप्स हेतु तैयार संदेश</p>
                </div>
              </div>
              <button
                onClick={() => setBroadcastArticle(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 block">
                फॉर्मेटेड ब्रॉडकास्ट मैसेज:
              </label>
              <textarea
                readOnly
                rows={9}
                value={`🔴 *ब्रेकिंग न्यूज वाला - ${broadcastArticle.districtHindi} अपडेट* 🔴

*${broadcastArticle.headline}*

${broadcastArticle.summary}

${broadcastArticle.bulletPoints ? broadcastArticle.bulletPoints.map(b => `• ${b}`).join('\n') : ''}

👉 *पूरी रिपोर्ट विस्तार से पढ़ें:*
${broadcastArticle.url}

📲 *ताज़ा खबरों के लिए हमारे WhatsApp चैनल से जुड़ें:*
https://whatsapp.com/channel/breakingnewswala`}
                className="w-full bg-[#0A0D15] border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  const text = `🔴 *ब्रेकिंग न्यूज वाला - ${broadcastArticle.districtHindi} अपडेट* 🔴\n\n*${broadcastArticle.headline}*\n\n${broadcastArticle.summary}\n\n👉 *पूरी रिपोर्ट:* ${broadcastArticle.url}`;
                  navigator.clipboard.writeText(text);
                  setCopiedText(true);
                  setTimeout(() => setCopiedText(false), 2000);
                  onShowToast('📋 ब्रॉडकास्ट टेक्स्ट क्लिपबोर्ड पर कॉपी हुआ!');
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? 'कॉपी हो गया ✓' : 'टेक्स्ट कॉपी करें'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const text = encodeURIComponent(`🔴 *ब्रेकिंग न्यूज वाला - ${broadcastArticle.districtHindi}*\n\n*${broadcastArticle.headline}*\n\n${broadcastArticle.summary}\n\n👉 ${broadcastArticle.url}`);
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                    onShowToast('WhatsApp शेयर खोला गया');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp शेयर</span>
                </button>

                <button
                  onClick={() => {
                    const text = encodeURIComponent(`🔴 ${broadcastArticle.headline}\n\n${broadcastArticle.summary}`);
                    window.open(`https://t.me/share/url?url=${encodeURIComponent(broadcastArticle.url)}&text=${text}`, '_blank');
                    onShowToast('Telegram शेयर खोला गया');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD MANUAL RAW NEWS ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#121622] w-full max-w-xl rounded-2xl border-2 border-red-500/50 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-600/20 text-[#FFED00]">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">कस्टम खबर दर्ज करें (Add News to Feed)</h3>
                  <p className="text-[10px] text-slate-400">ग्राउंड रिपोर्ट या सूत्र से मिली खबर को फीड में जोड़ें</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">जिला चुनें:</label>
                  <select
                    value={newDistrict}
                    onChange={e => setNewDistrict(e.target.value)}
                    className="w-full bg-[#0A0D15] border border-slate-700 rounded-xl p-2 text-white"
                  >
                    {MP_DISTRICTS.filter(d => d !== 'सभी जिले').map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">समाचार श्रेणी:</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-[#0A0D15] border border-slate-700 rounded-xl p-2 text-white"
                  >
                    {FEED_CATEGORIES.filter(c => c !== 'सभी श्रेणियां').map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">प्राथमिकता (Urgency):</label>
                  <select
                    value={newUrgency}
                    onChange={e => setNewUrgency(e.target.value as any)}
                    className="w-full bg-[#0A0D15] border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Breaking">🔴 Breaking News</option>
                    <option value="Top Story">⭐ Top Story</option>
                    <option value="Viral">🔥 Viral Trend</option>
                    <option value="Normal">📋 Normal</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">रिपोर्टर / स्रोत नाम:</label>
                  <input
                    type="text"
                    value={newSourceName}
                    onChange={e => setNewSourceName(e.target.value)}
                    placeholder="उदा. विशेष संवाददाता"
                    className="w-full bg-[#0A0D15] border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">मुख्य हेडलाइन:</label>
                <input
                  type="text"
                  value={newHeadline}
                  onChange={e => setNewHeadline(e.target.value)}
                  placeholder="खबर की आकर्षक मुख्य हेडलाइन दर्ज करें..."
                  className="w-full bg-[#0A0D15] border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">खबर का विवरण / समरी:</label>
                <textarea
                  rows={4}
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="खबर की पूरी जानकारी, ग्राउंड फैक्ट्स और मुख्य बिंदु लिखें..."
                  className="w-full bg-[#0A0D15] border border-slate-700 rounded-xl p-2.5 text-white leading-relaxed"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer font-medium"
              >
                रद्द करें
              </button>
              <button
                onClick={handleAddManualNews}
                className="px-5 py-2 rounded-xl bg-[#E21A25] hover:bg-[#B70F18] text-white font-bold cursor-pointer shadow-lg shadow-red-900/40"
              >
                + फीड में जोड़ें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
