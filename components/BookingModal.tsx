
import React, { useState, useEffect } from 'react';
import { BookingState } from '../types';
import { PACKAGE_DETAILS, ENHANCEMENT_PRICES } from '../constants';

interface BookingModalProps {
  onClose: () => void;
  initialState?: Partial<BookingState>;
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose, initialState }) => {
  const [formData, setFormData] = useState<BookingState>({
    fullName: '',
    email: '',
    phone: '',
    pronouns: '',
    date: '',
    time: '02:00 PM',
    location: 'Studio A, Downtown Arts District',
    packageType: 'standard',
    enhancements: {
      video: false,
      express: false,
      drone: false,
      album: false
    },
    vision: '',
    eventType: 'Fashion',
    ...initialState
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    let price = PACKAGE_DETAILS[formData.packageType].price;
    if (formData.enhancements.video) price += ENHANCEMENT_PRICES.video;
    if (formData.enhancements.express) price += ENHANCEMENT_PRICES.express;
    if (formData.enhancements.drone) price += ENHANCEMENT_PRICES.drone;
    if (formData.enhancements.album) price += ENHANCEMENT_PRICES.album;
    
    // Service fee (3%)
    const fee = price * 0.03;
    setTotal(price + fee);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEnhancement = (key: keyof BookingState['enhancements']) => {
    setFormData(prev => ({
      ...prev,
      enhancements: { ...prev.enhancements, [key]: !prev.enhancements[key] }
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-7xl h-[95vh] md:h-auto md:max-h-[95vh] flex flex-col md:row bg-[#181611] rounded-2xl shadow-2xl border border-border-dark overflow-hidden ring-1 ring-white/10 md:flex-row">
        
        {/* Left Panel: Summary */}
        <div className="w-full md:w-[360px] lg:w-[400px] bg-[#1f1b14] border-b md:border-b-0 md:border-r border-border-dark flex flex-col shrink-0">
          <div className="h-48 md:h-64 w-full bg-cover bg-center relative" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuARx7CDvPTa3OUFfpnHQKYXJN2OInfhoWgsQr15FoJU2WmfQH9K2X5YUS9Io0gRe4W5KOP1KQlBwy7LPhromTKz-gLa9j6FQP78VgvNU61tTkSrn--0YwJdpjno9dexo6VxrpBNMs2YOGricNlwe65Uqyo4zaXi3N8RpXHC_Ug3kdlD_FGbjHKzcganjaCyRLdoNY-8bVqT5K-Tc0p0fL4FkeWc4MtigRGTQ2OCcBIpy_535IL6VXNVUMR9X95NNUPZhi5UN25Xo9w')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1b14] via-[#1f1b14]/40 to-transparent"></div>
            <div className="absolute bottom-4 left-6 right-6">
              <span className="inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/30 uppercase tracking-wide mb-2">
                Event Type
              </span>
              <h3 className="text-white text-2xl font-bold leading-tight">{formData.eventType}</h3>
              <p className="text-gray-300 text-sm mt-1">High-impact imagery for your special moments.</p>
            </div>
          </div>

          <div className="p-6 flex flex-col flex-1 gap-5 overflow-y-auto no-scrollbar">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-[#27231b] text-primary">
                  <span className="material-symbols-outlined text-sm">timer</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Recommended Duration</p>
                  <p className="text-text-secondary text-sm">2 - 4 Hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-[#27231b] text-primary">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Location Type</p>
                  <p className="text-text-secondary text-sm">Studio or Urban Setting</p>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-border-dark"></div>

            <div className="space-y-3">
              <h4 className="text-white text-sm font-semibold mb-2">Order Summary</h4>
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Base Event Price</span>
                <span className="text-white">${PACKAGE_DETAILS[formData.packageType].price}.00</span>
              </div>
              {Object.entries(formData.enhancements).map(([key, active]) => active && (
                <div key={key} className="flex justify-between text-sm text-text-secondary capitalize">
                  <span>{key === 'express' ? 'Express Delivery' : key === 'drone' ? 'Drone Photography' : key === 'video' ? 'BTS Video' : 'Printed Album'}</span>
                  <span className="text-white">+${ENHANCEMENT_PRICES[key as keyof typeof ENHANCEMENT_PRICES]}.00</span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Service Fee (3%)</span>
                <span className="text-white">${(total - (total / 1.03)).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-border-dark">
              <div className="flex justify-between items-end mb-4">
                <span className="text-text-secondary text-sm font-medium">Total Estimate</span>
                <span className="text-primary text-3xl font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-text-secondary justify-center bg-[#27231b] py-2 rounded-lg border border-[#393328]">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">lock</span> Secure SSL</span>
                <div className="w-px h-3 bg-border-dark"></div>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">verified</span> Money Back</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="flex-1 flex flex-col h-full bg-[#181611] relative">
          <div className="px-6 py-5 border-b border-border-dark flex justify-between items-center bg-[#181611] sticky top-0 z-30 shadow-md">
            <div>
              <h2 className="text-white text-2xl font-bold leading-tight">Booking Details</h2>
              <p className="text-text-secondary text-sm mt-1">Customize your session to fit your needs.</p>
            </div>
            <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors p-2 hover:bg-[#27231b] rounded-full">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10 pb-28">
            {/* Step 1: Event Type */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black text-xs font-bold">1</span>
                Select Event Type
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {['Wedding', 'Portrait', 'Corporate', 'Fashion', 'Birthday', 'Custom'].map(type => (
                  <label key={type} className="cursor-pointer group">
                    <input 
                      className="peer sr-only" 
                      name="eventType" 
                      type="radio" 
                      checked={formData.eventType === type}
                      onChange={() => setFormData(prev => ({ ...prev, eventType: type }))}
                    />
                    <div className="h-full p-3 rounded-xl border border-[#393328] bg-[#221c10] hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/10 transition-all flex flex-col items-center text-center gap-2">
                      <span className="material-symbols-outlined text-text-secondary peer-checked:text-primary">
                        {type === 'Wedding' ? 'favorite' : type === 'Portrait' ? 'person' : type === 'Corporate' ? 'business_center' : type === 'Fashion' ? 'styler' : type === 'Birthday' ? 'celebration' : 'edit'}
                      </span>
                      <span className="text-text-secondary text-xs font-medium peer-checked:text-white group-hover:text-white">{type}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2: Client Info */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#393328] text-white text-xs font-bold">2</span>
                Client Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Full Name</span>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full rounded-lg bg-[#27231b] border border-[#544c3b] text-white placeholder:text-[#6b6355] focus:ring-1 focus:ring-primary focus:border-primary p-3 transition-all" placeholder="Jane Doe" type="text"/>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Email Address</span>
                  <input name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg bg-[#27231b] border border-[#544c3b] text-white placeholder:text-[#6b6355] focus:ring-1 focus:ring-primary focus:border-primary p-3 transition-all" placeholder="jane@example.com" type="email"/>
                </label>
              </div>
            </div>

            {/* Step 3: Package */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#393328] text-white text-xs font-bold">3</span>
                Select Package
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.entries(PACKAGE_DETAILS) as [keyof typeof PACKAGE_DETAILS, typeof PACKAGE_DETAILS['basic']][]).map(([key, details]) => (
                  <label key={key} className="cursor-pointer relative group">
                    <input 
                      className="peer sr-only" 
                      name="packageType" 
                      type="radio" 
                      checked={formData.packageType === key}
                      onChange={() => setFormData(prev => ({ ...prev, packageType: key }))}
                    />
                    <div className={`p-5 rounded-xl border ${formData.packageType === key ? 'border-primary bg-primary/5' : 'border-[#393328] bg-[#221c10]'} hover:border-primary/50 transition-all h-full flex flex-col relative`}>
                      {key === 'standard' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">Most Popular</div>}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white font-bold text-lg">{details.label}</span>
                        <div className={`w-4 h-4 rounded-full border ${formData.packageType === key ? 'border-primary bg-primary' : 'border-gray-500'}`}></div>
                      </div>
                      <ul className="text-text-secondary text-xs space-y-2 mb-4 flex-1">
                        {details.features.map(f => (
                          <li key={f} className="flex items-start gap-2"><span className="material-symbols-outlined text-[14px] text-primary">check</span> {f}</li>
                        ))}
                      </ul>
                      <span className="text-white font-semibold text-lg">{key === 'basic' ? 'Included' : `+$${details.price - PACKAGE_DETAILS.basic.price}`}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 4: Enhancements */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#393328] text-white text-xs font-bold">4</span>
                Enhancements
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'express', icon: 'bolt', label: 'Express Delivery (48h)', desc: 'Standard turnaround is 14 days.', price: 100 },
                  { key: 'drone', icon: 'flight', label: 'Drone Photography', desc: 'Aerial shots for unique perspectives.', price: 250 },
                  { key: 'video', icon: 'videocam', label: 'Behind-the-Scenes Video', desc: 'Short 1-min reel for social media', price: 150 },
                  { key: 'album', icon: 'auto_stories', label: 'Printed Album (20pg)', desc: 'Premium hardcover photo book.', price: 350 },
                ].map(opt => (
                  <label key={opt.key} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${formData.enhancements[opt.key as keyof BookingState['enhancements']] ? 'border-primary bg-primary/5' : 'bg-[#221c10] border-[#393328] hover:border-[#544c3b]'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#27231b] rounded-md text-primary shrink-0">
                        <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{opt.label}</p>
                        <p className="text-text-secondary text-xs">{opt.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white text-sm font-medium">+${opt.price}</span>
                      <input 
                        className="sr-only peer" 
                        type="checkbox" 
                        checked={formData.enhancements[opt.key as keyof BookingState['enhancements']]}
                        onChange={() => toggleEnhancement(opt.key as keyof BookingState['enhancements'])}
                      />
                      <div className={`w-11 h-6 rounded-full relative transition-all ${formData.enhancements[opt.key as keyof BookingState['enhancements']] ? 'bg-primary' : 'bg-[#393328]'}`}>
                        <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-all ${formData.enhancements[opt.key as keyof BookingState['enhancements']] ? 'translate-x-full' : ''}`}></div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 5: Vision */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#393328] text-white text-xs font-bold">5</span>
                Vision & Notes
              </h3>
              <label className="flex flex-col gap-2">
                <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Share your vision</span>
                <textarea 
                  name="vision"
                  value={formData.vision}
                  onChange={handleInputChange}
                  className="w-full rounded-lg bg-[#27231b] border border-[#544c3b] text-white placeholder:text-[#6b6355] focus:ring-1 focus:ring-primary focus:border-primary p-3 min-h-[100px] transition-all resize-none" 
                  placeholder="Describe the mood, style, or specific shots you have in mind..."
                ></textarea>
              </label>
            </div>
          </div>

          <div className="p-6 border-t border-border-dark bg-[#1f1b14] flex flex-col-reverse md:flex-row justify-between items-center gap-4 absolute bottom-0 w-full z-20">
            <button onClick={onClose} className="text-text-secondary hover:text-white font-medium text-sm transition-colors py-2 px-4 rounded-lg">
              Cancel
            </button>
            <button onClick={() => { alert('Booking Confirmed! (Mockup)'); onClose(); }} className="bg-primary hover:bg-[#d9940b] text-background-dark font-bold py-3 px-8 rounded-lg w-full md:w-auto shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-1">
              Confirm & Pay
              <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
