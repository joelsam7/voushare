import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, User, Ticket, Tag, Film, Calendar, MapPin, 
  CreditCard, Wallet, QrCode, ChevronRight, CheckCircle2, Lock, 
  ShieldCheck, ShoppingBag, Utensils, Music, Plane, Gamepad2, 
  TrendingUp, Clock, AlertCircle, Upload, ArrowLeft, Image as ImageIcon,
  Check, Info
} from 'lucide-react';

const NeumorphicStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    :root {
      --bg-color: #EAE6DF;
      --shadow-light: #ffffff;
      --shadow-dark: #cfc8bb;
      --primary: #008080;
      --text-main: #2D3748;
      --text-muted: #718096;
      --error: #E53E3E;
      --warning: #DD6B20;
    }
    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .neu-bg { background-color: var(--bg-color); }
    .neu-raised {
      background-color: var(--bg-color);
      box-shadow: 8px 8px 16px var(--shadow-dark), -8px -8px 16px var(--shadow-light);
    }
    .neu-pressed {
      background-color: var(--bg-color);
      box-shadow: inset 6px 6px 12px var(--shadow-dark), inset -6px -6px 12px var(--shadow-light);
    }
    .neu-btn {
      background-color: var(--bg-color);
      box-shadow: 8px 8px 16px var(--shadow-dark), -8px -8px 16px var(--shadow-light);
      transition: all 0.2s ease;
    }
    .neu-btn:active {
      box-shadow: inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light);
    }
    .neu-btn-primary {
      background-color: var(--primary);
      color: white;
      box-shadow: 6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light);
      transition: all 0.2s ease;
    }
    .neu-btn-primary:active {
      box-shadow: inset 4px 4px 8px rgba(0,0,0,0.2);
    }
    .neu-input {
      background-color: var(--bg-color);
      box-shadow: inset 6px 6px 12px var(--shadow-dark), inset -6px -6px 12px var(--shadow-light);
      border: 2px solid transparent;
      outline: none;
      transition: all 0.2s ease;
    }
    .neu-input:focus {
      border-color: rgba(0, 128, 128, 0.3);
    }
    .neu-input-error {
      border: 2px solid var(--error) !important;
    }
    /* Hide scrollbar for clean UI */
    ::-webkit-scrollbar { width: 0px; background: transparent; }
  `}} />
);

const initialListings = [
  { id: '1', type: 'voucher', brand: 'Amazon', title: 'Amazon Gift Voucher', original: 1000, price: 850, expiry: '2026-10-15', verified: true, status: 'available', sellerId: 'other', category: 'Shopping' },
  { id: '2', type: 'voucher', brand: 'Swiggy', title: 'Swiggy Voucher', original: 500, price: 425, expiry: '2026-10-10', verified: true, status: 'available', sellerId: 'other', category: 'Food' },
  { id: '3', type: 'movie', brand: 'PVR', title: 'Inception (Re-release)', original: 300, price: 240, date: '2026-09-28', time: '19:30', seat: 'B12', cinema: 'PVR Cinemas', verified: true, status: 'available', sellerId: 'other', category: 'Movies' },
  { id: '4', type: 'voucher', brand: 'BookMyShow', title: 'BookMyShow Voucher', original: 1000, price: 850, expiry: '2026-10-12', verified: true, status: 'available', sellerId: 'other', category: 'Movies' },
  { id: '5', type: 'event', brand: 'Sunburn', title: 'Sunburn Festival Pass', original: 1500, price: 1200, date: '2026-10-05', time: '16:00', location: 'Open Grounds', verified: true, status: 'available', sellerId: 'other', category: 'Events' },
  { id: '6', type: 'voucher', brand: 'Myntra', title: 'Myntra Shopping Voucher', original: 2000, price: 1600, expiry: '2026-10-30', verified: true, status: 'available', sellerId: 'me', category: 'Fashion' }
];

const categories = [
  { name: 'Shopping', icon: ShoppingBag },
  { name: 'Food', icon: Utensils },
  { name: 'Movies', icon: Film },
  { name: 'Events', icon: Music },
  { name: 'Travel', icon: Plane },
  { name: 'Gift Cards', icon: Tag },
  { name: 'Gaming', icon: Gamepad2 }
];

export default function App() {
  const [view, setView] = useState('home');
  const [viewParams, setViewParams] = useState(null);
  const [listings, setListings] = useState(initialListings);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to VouShare! Turn unused value into cash.', read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const navigate = (newView, params = null) => {
    setView(newView);
    setViewParams(params);
    if (newView === 'browse' && params?.query) {
      setSearchQuery(params.query);
    } else if (newView !== 'browse') {
      setSearchQuery('');
    }
  };

  const addNotification = (text) => {
    setNotifications([{ id: Date.now(), text, read: false }, ...notifications]);
  };

  const markNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Platform Fee Logic
  const calculateFee = (type, price) => {
    if (type === 'movie') return price * 0.05;
    if (type === 'event') return price * 0.08;
    return price * 0.12; // vouchers/coupons
  };

  const Navbar = () => (
    <nav className="sticky top-0 z-50 py-4 px-4 sm:px-6 lg:px-8 bg-[#EAE6DF]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-16 rounded-full flex items-center justify-between px-6 neu-raised">
        <div className="flex items-center gap-8">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-[#008080] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)] text-white">
              <Tag size={20} className="transform rotate-45" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-[#2D3748] tracking-tight">Vou<span className="text-[#008080]">Share</span></span>
          </div>
          
          <div className="hidden md:flex space-x-6 text-sm font-bold text-[#718096]">
            <button onClick={() => navigate('home')} className={view === 'home' ? 'text-[#008080]' : 'hover:text-[#008080] transition-colors'}>Home</button>
            <button onClick={() => navigate('browse')} className={view === 'browse' ? 'text-[#008080]' : 'hover:text-[#008080] transition-colors'}>Browse</button>
            <button onClick={() => navigate('sell')} className={view === 'sell' ? 'text-[#008080]' : 'hover:text-[#008080] transition-colors'}>Sell</button>
            <button onClick={() => navigate('my-orders')} className={view === 'my-orders' ? 'text-[#008080]' : 'hover:text-[#008080] transition-colors'}>My Orders</button>
            <button onClick={() => navigate('my-listings')} className={view === 'my-listings' ? 'text-[#008080]' : 'hover:text-[#008080] transition-colors'}>My Listings</button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-48 text-sm neu-pressed rounded-full text-[#2D3748] placeholder-[#718096]/60"
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate('browse', { query: e.target.value });
              }}
            />
            <Search className="absolute left-4 top-2.5 text-[#718096]" size={16} />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if(!showNotifications) markNotificationsRead();
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#718096] neu-btn"
            >
              <Bell size={18} strokeWidth={2.5} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E53E3E] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-4 w-80 rounded-3xl z-50 p-4 neu-raised border border-white/40">
                <div className="font-bold text-[#2D3748] mb-3 pb-2 border-b border-[#cfc8bb]/30">Notifications</div>
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 rounded-2xl text-sm ${n.read ? 'neu-raised text-[#718096]' : 'neu-pressed text-[#008080] font-medium'}`}>
                      {n.text}
                    </div>
                  ))}
                  {notifications.length === 0 && <div className="text-sm text-[#718096] text-center p-2">No new notifications</div>}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => navigate('profile')} className="w-10 h-10 rounded-full flex items-center justify-center text-[#718096] neu-btn">
            <User size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </nav>
  );

  const ListingCard = ({ item, isOwnerView = false }) => {
    const isLocked = item.status === 'locked';
    const isExpired = item.status === 'expired';
    const savings = item.original - item.price;
    const percentOff = Math.round((savings / item.original) * 100);

    return (
      <div 
        onClick={() => {
          if (isOwnerView) return; // Maybe open a manage modal in a real app
          if (!isLocked && !isExpired) navigate('details', { id: item.id });
        }}
        className={`rounded-3xl p-6 flex flex-col transition-all neu-raised ${(!isLocked && !isExpired && !isOwnerView) ? 'hover:-translate-y-1 cursor-pointer' : ''} ${(isLocked || isExpired) ? 'opacity-70' : ''}`}
      >
        <div className="flex-grow relative">
          {item.verified && !isLocked && !isExpired && (
            <div className="absolute top-0 right-0 flex items-center text-[#008080] neu-raised rounded-full px-3 py-1 text-xs font-bold">
              <ShieldCheck size={14} className="mr-1" /> Verified
            </div>
          )}
          {isLocked && (
            <div className="absolute top-0 right-0 flex items-center text-[#E53E3E] neu-raised rounded-full px-3 py-1 text-xs font-bold">
              <Lock size={14} className="mr-1" /> Sold / Locked
            </div>
          )}
          {isExpired && (
            <div className="absolute top-0 right-0 flex items-center text-[#718096] neu-raised rounded-full px-3 py-1 text-xs font-bold">
              <Clock size={14} className="mr-1" /> Expired
            </div>
          )}
          
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-[#008080] neu-pressed">
            {item.type === 'voucher' ? <Tag size={24} /> : item.type === 'movie' ? <Film size={24} /> : <Music size={24} />}
          </div>
          
          <div className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">{item.brand}</div>
          <h3 className="text-xl font-bold text-[#2D3748] leading-tight mb-4">{item.title}</h3>
          
          {item.type === 'movie' || item.type === 'event' ? (
            <div className="space-y-2 mb-6 text-sm font-medium text-[#718096]">
              <div className="flex items-center"><Calendar size={16} className="mr-3" /> {item.date} • {item.time}</div>
              <div className="flex items-center"><MapPin size={16} className="mr-3" /> {item.type === 'movie' ? item.cinema : item.location}</div>
            </div>
          ) : (
            <div className="flex items-center mb-6 text-sm font-medium text-[#718096]">
              <Clock size={16} className="mr-3" /> Expires: {item.expiry}
            </div>
          )}
        </div>
        
        <div className="p-4 rounded-[24px] flex justify-between items-end neu-pressed">
          <div>
            <div className="text-xs font-bold text-[#718096] line-through mb-1">₹{item.original}</div>
            <div className="text-2xl font-black text-[#008080]">₹{item.price}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-[#DD6B20]">{percentOff}% OFF</div>
            <div className="text-xs font-bold text-[#718096]">Save ₹{savings}</div>
          </div>
        </div>
      </div>
    );
  };

  const HomeView = () => (
    <div className="pb-24">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
        <div className="rounded-[40px] p-10 md:p-16 text-center flex flex-col items-center justify-center neu-raised">
          <h1 className="text-4xl md:text-5xl font-black text-[#2D3748] tracking-tight mb-6 leading-tight">
            Don't Let Your <br className="hidden md:block" />
            <span className="text-[#008080]">Unused Value</span> Go to Waste
          </h1>
          <p className="text-lg text-[#718096] max-w-2xl mx-auto mb-10 font-medium">
            Buy discounted vouchers and eligible movie & event tickets, or turn your unused benefits into value securely.
          </p>
          
          <div className="max-w-2xl w-full rounded-full p-2 flex mb-10 neu-pressed">
            <div className="flex-grow flex items-center pl-6">
              <Search className="text-[#718096] mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Search vouchers, tickets, brands..." 
                className="w-full text-[#2D3748] font-medium bg-transparent outline-none placeholder-[#718096]/60"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate('browse', { query: e.target.value });
                }}
              />
            </div>
            <button onClick={() => navigate('browse')} className="px-8 py-3 rounded-full font-bold neu-btn-primary">
              Search
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-md">
            <button onClick={() => navigate('browse')} className="flex-1 py-4 rounded-full font-bold text-[#2D3748] neu-btn">
              Browse Offers
            </button>
            <button onClick={() => navigate('sell')} className="flex-1 py-4 rounded-full font-bold neu-btn-primary">
              Sell Something
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        <h2 className="text-2xl font-black text-[#2D3748] mb-8 flex items-center">
          <TrendingUp className="mr-3 text-[#008080]" size={24} /> Browse Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-20">
          {categories.map((cat, i) => (
            <div key={i} onClick={() => navigate('browse', { query: cat.name })} className="rounded-[24px] p-6 flex flex-col items-center justify-center cursor-pointer group neu-raised hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-[#718096] group-hover:text-[#008080] neu-pressed">
                <cat.icon size={28} strokeWidth={2} />
              </div>
              <span className="text-sm font-bold text-[#2D3748] text-center">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Popular Offers */}
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-black text-[#2D3748]">Popular Offers</h2>
          <button onClick={() => navigate('browse')} className="px-6 py-2 rounded-full font-bold text-sm text-[#2D3748] neu-btn">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {listings.filter(l => l.status === 'available').slice(0, 4).map(item => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );

  const BrowseView = () => {
    const [tab, setTab] = useState('all');
    
    let filteredListings = listings.filter(l => l.status === 'available');
    
    if (tab === 'vouchers') filteredListings = filteredListings.filter(l => l.type === 'voucher');
    if (tab === 'tickets') filteredListings = filteredListings.filter(l => l.type === 'movie' || l.type === 'event');
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredListings = filteredListings.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.brand.toLowerCase().includes(q) || 
        (l.category && l.category.toLowerCase().includes(q))
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#2D3748] mb-3">Browse Offers</h1>
            <p className="text-lg text-[#718096] font-medium">Find verified vouchers and tickets at better prices.</p>
          </div>
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full neu-pressed text-[#2D3748]"
            />
            <Search className="absolute left-4 top-3.5 text-[#718096]" size={18} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <div className="w-full lg:w-72 space-y-8 flex-shrink-0">
            <div className="p-6 rounded-[32px] neu-raised">
              <h3 className="font-black text-[#2D3748] mb-6 text-lg">Filters</h3>
              
              <div className="mb-8">
                <h4 className="font-bold text-[#718096] mb-4 uppercase text-xs tracking-wider">Categories</h4>
                <div className="space-y-4">
                  {categories.slice(0,5).map((c, i) => (
                    <label key={i} className="flex items-center cursor-pointer font-bold text-[#2D3748]">
                      <div className="w-6 h-6 rounded-md mr-4 flex items-center justify-center neu-pressed"></div>
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-[#718096] mb-4 uppercase text-xs tracking-wider">Price Range</h4>
                <div className="h-2 rounded-full mb-4 relative neu-pressed">
                  <div className="absolute left-0 top-0 h-full w-2/3 bg-[#008080] rounded-full"></div>
                  <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#EAE6DF] rounded-full neu-raised"></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-[#718096]">
                  <span>₹0</span>
                  <span>₹5000+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
              <div className="flex space-x-2 p-2 rounded-full neu-pressed">
                <button onClick={() => setTab('all')} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${tab === 'all' ? 'neu-btn-primary' : 'text-[#718096]'}`}>All</button>
                <button onClick={() => setTab('vouchers')} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${tab === 'vouchers' ? 'neu-btn-primary' : 'text-[#718096]'}`}>Vouchers</button>
                <button onClick={() => setTab('tickets')} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${tab === 'tickets' ? 'neu-btn-primary' : 'text-[#718096]'}`}>Tickets</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredListings.map(item => (
                <ListingCard key={item.id} item={item} />
              ))}
              {filteredListings.length === 0 && (
                <div className="col-span-full text-center py-16 rounded-[32px] neu-pressed">
                  <p className="text-[#718096] font-bold text-lg">No offers found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DetailsView = () => {
    const item = listings.find(l => l.id === viewParams?.id);
    if (!item) return <div className="p-10 text-center font-bold text-[#2D3748]">Item not found</div>;

    const savings = item.original - item.price;
    const percentOff = Math.round((savings / item.original) * 100);

    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <button onClick={() => navigate('browse')} className="mb-8 px-6 py-2 flex items-center rounded-full font-bold text-sm text-[#2D3748] neu-btn w-max">
          <ArrowLeft size={16} className="mr-2" /> Back to Browse
        </button>

        <div className="rounded-[40px] flex flex-col md:flex-row overflow-hidden p-4 md:p-8 gap-8 neu-raised">
          {/* Left Visual Area */}
          <div className="md:w-2/5 rounded-[32px] p-8 flex flex-col items-center justify-center relative neu-pressed">
            <div className="w-28 h-28 rounded-full flex items-center justify-center text-[#008080] mb-8 neu-raised">
              {item.type === 'voucher' ? <Tag size={48} /> : item.type === 'movie' ? <Film size={48} /> : <Music size={48} />}
            </div>
            <h2 className="text-3xl font-black text-[#2D3748] text-center mb-3">{item.brand}</h2>
            <p className="text-[#718096] font-bold mb-8 text-center">{item.title}</p>
            
            <div className="text-[#008080] px-6 py-3 flex items-center w-full justify-center rounded-full neu-raised">
              <ShieldCheck size={20} className="mr-2" />
              <span className="font-black text-sm">Verified by VouShare</span>
            </div>
          </div>

          {/* Right Details Area */}
          <div className="md:w-3/5 flex flex-col justify-between py-4 px-2">
            <div>
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="text-sm font-bold text-[#718096] uppercase tracking-wider mb-2">Selling Price</div>
                  <div className="text-5xl font-black text-[#008080]">₹{item.price}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#718096] line-through mb-2">Original: ₹{item.original}</div>
                  <div className="text-[#DD6B20] px-4 py-2 rounded-full text-sm font-bold neu-raised">
                    Save ₹{savings} ({percentOff}% OFF)
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] p-6 mb-10 neu-pressed">
                {item.type === 'movie' || item.type === 'event' ? (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#2D3748] mr-4 neu-raised">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <div className="text-base font-black text-[#2D3748]">{item.date} at {item.time}</div>
                        <div className="text-xs font-bold text-[#718096]">Show/Event Timing</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#2D3748] mr-4 neu-raised">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <div className="text-base font-black text-[#2D3748]">{item.type === 'movie' ? item.cinema : item.location}</div>
                        <div className="text-xs font-bold text-[#718096]">Venue</div>
                      </div>
                    </div>
                    {item.seat && (
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#2D3748] mr-4 neu-raised">
                          <Ticket size={20} />
                        </div>
                        <div>
                          <div className="text-base font-black text-[#2D3748]">Seat: {item.seat}</div>
                          <div className="text-xs font-bold text-[#718096]">Confirmed Allocation</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#2D3748] mr-4 neu-raised">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-base font-black text-[#2D3748]">Valid until {item.expiry}</div>
                      <div className="text-xs font-bold text-[#718096]">Expiry Date</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-8 space-y-4">
                <h4 className="text-sm font-black text-[#2D3748] uppercase tracking-wider">Trust & Security</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm font-bold text-[#718096]">
                    <CheckCircle2 size={18} className="text-[#008080] mr-3" /> Seller Verified
                  </div>
                  <div className="flex items-center text-sm font-bold text-[#718096]">
                    <CheckCircle2 size={18} className="text-[#008080] mr-3" /> Transfer Eligible
                  </div>
                  {item.type === 'movie' && (
                    <div className="flex items-center text-sm font-bold text-[#E53E3E] sm:col-span-2">
                      <Lock size={18} className="mr-3" /> Ticket Locked from Seller After Purchase
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('checkout', { id: item.id })}
              className="w-full py-5 text-lg rounded-full font-bold neu-btn-primary"
            >
              Buy {item.type === 'voucher' ? 'Voucher' : 'Ticket'} Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CheckoutView = () => {
    const item = listings.find(l => l.id === viewParams?.id);
    const [isProcessing, setIsProcessing] = useState(false);
    const [method, setMethod] = useState('upi');

    if (!item) return null;

    const platformFee = calculateFee(item.type, item.price);
    const total = item.price + platformFee;

    const handlePayment = () => {
      setIsProcessing(true);
      setTimeout(() => {
        // Lock the listing
        setListings(prev => prev.map(l => l.id === item.id ? { ...l, status: 'locked' } : l));
        // Add to orders
        const newOrder = { ...item, orderId: 'VS' + Math.floor(Math.random()*100000), purchaseDate: new Date().toLocaleDateString() };
        setOrders([newOrder, ...orders]);
        addNotification(`Successfully purchased ${item.title}!`);
        setIsProcessing(false);
        navigate('success', { order: newOrder });
      }, 1500);
    };

    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-[#2D3748] mb-8 text-center">Checkout</h1>
        
        <div className="rounded-[40px] p-8 neu-raised mb-8">
          <h3 className="font-bold text-[#718096] uppercase text-sm tracking-wider mb-6">Order Summary</h3>
          <div className="flex items-center mb-6 pb-6 border-b border-[#cfc8bb]/50">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-[#008080] neu-pressed mr-4">
              {item.type === 'voucher' ? <Tag size={24} /> : item.type === 'movie' ? <Film size={24} /> : <Music size={24} />}
            </div>
            <div>
              <div className="font-bold text-[#2D3748] text-lg">{item.title}</div>
              <div className="text-sm font-medium text-[#718096]">{item.brand}</div>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between font-medium text-[#2D3748]">
              <span>Selling Price</span>
              <span>₹{item.price}</span>
            </div>
            <div className="flex justify-between font-medium text-[#718096] text-sm">
              <span className="flex items-center">
                Platform Fee ({item.type === 'movie' ? '5%' : item.type === 'event' ? '8%' : '12%'})
                <Info size={14} className="ml-2" />
              </span>
              <span>₹{platformFee.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-6 border-t border-[#cfc8bb]/50">
            <span className="font-black text-xl text-[#2D3748]">Total Amount</span>
            <span className="font-black text-3xl text-[#008080]">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-[40px] p-8 neu-raised mb-8">
          <h3 className="font-bold text-[#718096] uppercase text-sm tracking-wider mb-6">Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setMethod('upi')}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all ${method === 'upi' ? 'neu-pressed border-2 border-[#008080]/50 text-[#008080]' : 'neu-raised text-[#718096]'}`}
            >
              <Smartphone size={24} className="mb-2" />
              <span className="font-bold text-sm">UPI</span>
            </button>
            <button 
              onClick={() => setMethod('card')}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all ${method === 'card' ? 'neu-pressed border-2 border-[#008080]/50 text-[#008080]' : 'neu-raised text-[#718096]'}`}
            >
              <CreditCard size={24} className="mb-2" />
              <span className="font-bold text-sm">Card</span>
            </button>
          </div>
        </div>

        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-5 text-lg rounded-full font-bold neu-btn-primary disabled:opacity-50 flex items-center justify-center"
        >
          {isProcessing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
        </button>
      </div>
    );
  };

  const SuccessView = () => {
    const order = viewParams?.order;
    if (!order) return null;

    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-white bg-[#008080] mb-8 shadow-[0_10px_20px_rgba(0,128,128,0.3)]">
          <Check size={48} strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-black text-[#2D3748] mb-4">Purchase Successful!</h1>
        <p className="text-lg text-[#718096] font-medium mb-2">Your payment was completed securely.</p>
        <p className="text-md text-[#2D3748] font-bold mb-10">Order ID: {order.orderId}</p>
        
        <div className="bg-[#EAE6DF] p-6 rounded-[32px] w-full max-w-md neu-pressed mb-10">
          <p className="text-[#008080] font-bold flex items-center justify-center">
            <Lock size={18} className="mr-2" />
            Ticket transferred & locked from previous owner.
          </p>
        </div>

        <button 
          onClick={() => navigate('my-ticket', { order })}
          className="px-10 py-4 text-lg rounded-full font-bold neu-btn-primary"
        >
          View My {order.type === 'voucher' ? 'Voucher' : 'Ticket'}
        </button>
      </div>
    );
  };

  const MyTicketView = () => {
    const order = viewParams?.order;
    if (!order) return null;

    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <button onClick={() => navigate('my-orders')} className="mb-8 px-6 py-2 flex items-center rounded-full font-bold text-sm text-[#2D3748] neu-btn w-max">
          <ArrowLeft size={16} className="mr-2" /> Back to Orders
        </button>

        <div className="rounded-[40px] p-8 neu-raised flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-[#008080] rounded-t-[40px] opacity-10"></div>
          
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-[#008080] neu-raised mb-6 z-10">
            {order.type === 'voucher' ? <Tag size={32} /> : order.type === 'movie' ? <Film size={32} /> : <Music size={32} />}
          </div>
          
          <h2 className="text-2xl font-black text-[#2D3748] text-center z-10">{order.title}</h2>
          <p className="text-[#718096] font-bold mb-8 z-10">{order.brand}</p>
          
          {/* Details */}
          <div className="w-full rounded-[24px] p-6 neu-pressed mb-8 space-y-4 text-sm font-medium text-[#2D3748]">
            <div className="flex justify-between">
              <span className="text-[#718096]">Order ID</span>
              <span className="font-bold">{order.orderId}</span>
            </div>
            {order.type === 'movie' || order.type === 'event' ? (
              <>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Date & Time</span>
                  <span className="font-bold">{order.date} • {order.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Venue</span>
                  <span className="font-bold">{order.type === 'movie' ? order.cinema : order.location}</span>
                </div>
                {order.seat && (
                  <div className="flex justify-between">
                    <span className="text-[#718096]">Seat</span>
                    <span className="font-bold">{order.seat}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-between">
                <span className="text-[#718096]">Expiry</span>
                <span className="font-bold">{order.expiry}</span>
              </div>
            )}
          </div>
          
          {/* QR Area */}
          <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-inner relative">
            <QrCode size={120} className="text-[#2D3748]" />
            <div className="absolute inset-0 border-4 border-[#008080]/20 rounded-2xl"></div>
          </div>
          <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-8">Scan for Entry / Redemption</p>
          
          <div className="w-full space-y-3">
            <div className="flex items-center justify-center text-sm font-bold text-[#008080]">
              <CheckCircle2 size={16} className="mr-2" /> Transfer completed
            </div>
            <div className="flex items-center justify-center text-sm font-bold text-[#E53E3E]">
              <Lock size={16} className="mr-2" /> Ticket locked from previous owner
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SellView = () => {
    const [sellStep, setSellStep] = useState(1);
    const [sellType, setSellType] = useState(null);
    const [formData, setFormData] = useState({});
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyStage, setVerifyStage] = useState(0);

    const handleTypeSelect = (type) => {
      setSellType(type);
      setSellStep(2);
    };

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // Date Validation for Voucher
      if (sellType === 'voucher' && formData.expiry) {
        const today = new Date();
        const expDate = new Date(formData.expiry);
        if (expDate < today) {
          addNotification("Expired vouchers cannot be listed.");
          return;
        }
      }
      setSellStep(3);
      setIsVerifying(true);
      
      // Simulate Verification steps
      setTimeout(() => setVerifyStage(1), 1000);
      setTimeout(() => setVerifyStage(2), 2500);
      setTimeout(() => {
        setIsVerifying(false);
      }, 4000);
    };

    const handlePublish = () => {
      const newItem = {
        id: Date.now().toString(),
        type: sellType,
        ...formData,
        original: parseFloat(formData.original),
        price: parseFloat(formData.price),
        verified: true,
        status: 'available',
        sellerId: 'me',
        brand: formData.brand || 'User Listing',
        title: formData.title || `${sellType} Listing`
      };
      setListings([newItem, ...listings]);
      addNotification("Listing published successfully!");
      navigate('my-listings');
    };

    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-[#2D3748] mb-3">Sell Your Unused Benefit</h1>
          <p className="text-lg text-[#718096] font-medium">Turn unused vouchers and eligible tickets into value.</p>
        </div>

        {sellStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => handleTypeSelect('voucher')} className="p-8 rounded-[32px] flex flex-col items-center cursor-pointer neu-raised hover:scale-105 transition-transform text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-[#008080] neu-pressed mb-4"><Tag size={28} /></div>
              <h3 className="font-bold text-[#2D3748]">Voucher / Coupon</h3>
            </div>
            <div onClick={() => handleTypeSelect('movie')} className="p-8 rounded-[32px] flex flex-col items-center cursor-pointer neu-raised hover:scale-105 transition-transform text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-[#008080] neu-pressed mb-4"><Film size={28} /></div>
              <h3 className="font-bold text-[#2D3748]">Movie Ticket</h3>
            </div>
            <div onClick={() => handleTypeSelect('event')} className="p-8 rounded-[32px] flex flex-col items-center cursor-pointer neu-raised hover:scale-105 transition-transform text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-[#008080] neu-pressed mb-4"><Music size={28} /></div>
              <h3 className="font-bold text-[#2D3748]">Event Ticket</h3>
            </div>
          </div>
        )}

        {sellStep === 2 && (
          <form onSubmit={handleSubmit} className="p-8 rounded-[40px] neu-raised">
            <button type="button" onClick={() => setSellStep(1)} className="mb-6 flex items-center text-sm font-bold text-[#718096] hover:text-[#2D3748]">
              <ArrowLeft size={16} className="mr-2" /> Change Type
            </button>
            <h3 className="text-2xl font-black text-[#2D3748] mb-8 capitalize">{sellType} Details</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#718096] mb-2 pl-2">Brand / Provider</label>
                  <input required name="brand" onChange={handleInputChange} className="w-full px-5 py-3 rounded-2xl neu-input text-[#2D3748]" placeholder="e.g. Amazon, PVR" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#718096] mb-2 pl-2">Title</label>
                  <input required name="title" onChange={handleInputChange} className="w-full px-5 py-3 rounded-2xl neu-input text-[#2D3748]" placeholder="e.g. Gift Card, Avatar 2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#718096] mb-2 pl-2">Original Value (₹)</label>
                  <input required type="number" name="original" onChange={handleInputChange} className="w-full px-5 py-3 rounded-2xl neu-input text-[#2D3748]" placeholder="1000" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#718096] mb-2 pl-2">Selling Price (₹)</label>
                  <input required type="number" name="price" onChange={handleInputChange} className="w-full px-5 py-3 rounded-2xl neu-input text-[#2D3748]" placeholder="800" />
                </div>
              </div>

              {sellType === 'voucher' ? (
                <div>
                  <label className="block text-sm font-bold text-[#718096] mb-2 pl-2">Expiry Date</label>
                  <input required type="date" name="expiry" onChange={handleInputChange} className="w-full px-5 py-3 rounded-2xl neu-input text-[#2D3748]" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#718096] mb-2 pl-2">Date</label>
                    <input required type="date" name="date" onChange={handleInputChange} className="w-full px-5 py-3 rounded-2xl neu-input text-[#2D3748]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#718096] mb-2 pl-2">Time</label>
                    <input required type="time" name="time" onChange={handleInputChange} className="w-full px-5 py-3 rounded-2xl neu-input text-[#2D3748]" />
                  </div>
                  {sellType === 'movie' && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-[#718096] mb-2 pl-2">Cinema / Venue</label>
                        <input required name="cinema" onChange={handleInputChange} className="w-full px-5 py-3 rounded-2xl neu-input text-[#2D3748]" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#718096] mb-2 pl-2">Seat Number</label>
                        <input required name="seat" onChange={handleInputChange} className="w-full px-5 py-3 rounded-2xl neu-input text-[#2D3748]" />
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="pt-4">
                <label className="block text-sm font-bold text-[#718096] mb-2 pl-2">Upload Proof (Required)</label>
                <div className="w-full p-8 border-2 border-dashed border-[#008080]/40 rounded-[32px] neu-pressed flex flex-col items-center justify-center text-center cursor-pointer">
                  <Upload size={32} className="text-[#008080] mb-4" />
                  <p className="text-sm font-bold text-[#2D3748] mb-1">Click to upload photo/screenshot</p>
                  <p className="text-xs text-[#718096]">Your proof is used for verification and won't be public.</p>
                </div>
              </div>

              {(sellType === 'movie' || sellType === 'event') && (
                <div className="flex items-center pt-4">
                  <input required type="checkbox" className="mr-3 w-5 h-5" />
                  <label className="text-sm font-bold text-[#2D3748]">I confirm that this ticket is eligible for transfer.</label>
                </div>
              )}

              <button type="submit" className="w-full mt-6 py-4 text-lg rounded-full font-bold neu-btn-primary">
                Submit for Verification
              </button>
            </div>
          </form>
        )}

        {sellStep === 3 && (
          <div className="p-10 rounded-[40px] neu-raised text-center flex flex-col items-center">
            <h2 className="text-3xl font-black text-[#2D3748] mb-8">Verification Process</h2>
            
            <div className="w-full max-w-sm space-y-6 text-left mb-10">
              <div className={`flex items-center p-4 rounded-2xl ${verifyStage >= 0 ? 'neu-pressed' : 'opacity-50'}`}>
                {verifyStage > 0 ? <CheckCircle2 size={24} className="text-[#008080] mr-4" /> : <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#008080] animate-spin mr-4"></div>}
                <span className="font-bold text-[#2D3748]">Analyzing Proof Upload</span>
              </div>
              <div className={`flex items-center p-4 rounded-2xl ${verifyStage >= 1 ? 'neu-pressed' : 'opacity-50'}`}>
                {verifyStage > 1 ? <CheckCircle2 size={24} className="text-[#008080] mr-4" /> : <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#008080] animate-spin mr-4" style={{display: verifyStage===1?'block':'none'}}></div>}
                <span className="font-bold text-[#2D3748]">Checking Validity & Dates</span>
              </div>
              <div className={`flex items-center p-4 rounded-2xl ${verifyStage >= 2 ? 'neu-pressed' : 'opacity-50'}`}>
                {!isVerifying && verifyStage === 2 ? <CheckCircle2 size={24} className="text-[#008080] mr-4" /> : <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#008080] animate-spin mr-4" style={{display: verifyStage===2 && isVerifying?'block':'none'}}></div>}
                <span className="font-bold text-[#2D3748]">Transfer Eligibility Check</span>
              </div>
            </div>

            {!isVerifying ? (
              <div className="animate-fade-in">
                <div className="inline-block px-6 py-3 rounded-full text-[#008080] font-black neu-pressed mb-8 flex items-center">
                  <ShieldCheck size={24} className="mr-2" /> Verified & Approved
                </div>
                <button onClick={handlePublish} className="w-full py-4 px-10 text-lg rounded-full font-bold neu-btn-primary">
                  Publish Listing
                </button>
              </div>
            ) : (
              <p className="text-[#718096] font-bold animate-pulse">Please wait while our system verifies your item...</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const MyListingsView = () => {
    const myListings = listings.filter(l => l.sellerId === 'me');

    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-[#2D3748] mb-8">My Listings</h1>
        
        <div className="flex gap-6 mb-10 overflow-x-auto pb-4">
          <div className="min-w-[150px] p-6 rounded-3xl neu-pressed text-center">
            <div className="text-3xl font-black text-[#008080] mb-1">{myListings.filter(l=>l.status==='available').length}</div>
            <div className="text-xs font-bold text-[#718096] uppercase">Active</div>
          </div>
          <div className="min-w-[150px] p-6 rounded-3xl neu-pressed text-center">
            <div className="text-3xl font-black text-[#E53E3E] mb-1">{myListings.filter(l=>l.status==='locked').length}</div>
            <div className="text-xs font-bold text-[#718096] uppercase">Sold</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myListings.map(item => (
            <ListingCard key={item.id} item={item} isOwnerView={true} />
          ))}
          {myListings.length === 0 && (
            <div className="col-span-full py-16 text-center neu-pressed rounded-[32px]">
              <p className="text-[#718096] font-bold mb-4">You haven't listed anything yet.</p>
              <button onClick={() => navigate('sell')} className="px-8 py-3 rounded-full font-bold neu-btn-primary">Start Selling</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MyOrdersView = () => (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-[#2D3748] mb-8">My Orders</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {orders.map((order, i) => (
          <div key={i} className="p-6 rounded-[32px] neu-raised flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-20 h-20 flex-shrink-0 rounded-full flex items-center justify-center text-[#008080] neu-pressed">
              {order.type === 'voucher' ? <Tag size={32} /> : order.type === 'movie' ? <Film size={32} /> : <Music size={32} />}
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h3 className="text-xl font-bold text-[#2D3748] mb-1">{order.title}</h3>
              <p className="text-sm font-medium text-[#718096] mb-3">Purchased: {order.purchaseDate} • ₹{(order.price + calculateFee(order.type, order.price)).toFixed(2)}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-[#008080] neu-pressed">
                <CheckCircle2 size={14} className="mr-1" /> Completed
              </div>
            </div>
            <button 
              onClick={() => navigate('my-ticket', { order })}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-bold neu-btn flex-shrink-0"
            >
              View Ticket
            </button>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="col-span-full py-16 text-center neu-pressed rounded-[32px]">
            <p className="text-[#718096] font-bold mb-4">You have no orders yet.</p>
            <button onClick={() => navigate('browse')} className="px-8 py-3 rounded-full font-bold neu-btn-primary">Browse Offers</button>
          </div>
        )}
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="p-8 rounded-[40px] neu-raised flex flex-col sm:flex-row items-center gap-8 mb-10">
        <div className="w-32 h-32 rounded-full neu-pressed border-4 border-[#EAE6DF] flex items-center justify-center text-[#008080]">
          <User size={64} />
        </div>
        <div className="text-center sm:text-left flex-grow">
          <h1 className="text-3xl font-black text-[#2D3748] mb-2">Alex Doe</h1>
          <div className="inline-flex items-center text-sm font-bold text-[#008080] neu-pressed px-4 py-1.5 rounded-full mb-4">
            <ShieldCheck size={16} className="mr-2" /> Verified Member
          </div>
          <p className="text-[#718096] font-medium text-sm">Joined Sep 2026</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {['Personal Details', 'Payment Methods', 'Transaction History', 'Help & Support'].map((item, i) => (
          <div key={i} className="p-6 rounded-[24px] neu-btn flex justify-between items-center cursor-pointer">
            <span className="font-bold text-[#2D3748]">{item}</span>
            <ChevronRight className="text-[#718096]" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EAE6DF] selection:bg-[#008080] selection:text-white pb-20">
      <NeumorphicStyles />
      <Navbar />
      
      <main className="animate-fade-in transition-opacity duration-300">
        {view === 'home' && <HomeView />}
        {view === 'browse' && <BrowseView />}
        {view === 'details' && <DetailsView />}
        {view === 'checkout' && <CheckoutView />}
        {view === 'success' && <SuccessView />}
        {view === 'my-ticket' && <MyTicketView />}
        {view === 'sell' && <SellView />}
        {view === 'my-listings' && <MyListingsView />}
        {view === 'my-orders' && <MyOrdersView />}
        {view === 'profile' && <ProfileView />}
      </main>
    </div>
  );
}