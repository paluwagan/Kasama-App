'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#F0FDF4] border-2 border-emerald-600/30 shadow-xl rounded-2xl p-8 text-center space-y-6">
        
        {/* Logo Branding */}
        <div>
          <div className="flex justify-center mb-3">
            <img 
              src="/logo.png" 
              alt="KasamaApp Logo" 
              className="w-20 h-20 object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-4xl font-black text-[#246927] tracking-tight">KasamaApp</h1>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider font-semibold">
            Automated Digital Paluwagan Ledger System
          </p>
        </div>

        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100 text-left">
          <p className="font-bold text-[#246927] mb-1">🔒 Secure Peer-to-Peer Gateway:</p>
          Maligayang pagdating sa KasamaApp Safe Network Portal. Mangyaring piliin ang kaukulang dashboard access point.
      </div>
        {/* Navigation Layer Triggers */}
        <div className="space-y-3 pt-2">
          <Link href="/register" className="block w-full bg-[#246927] hover:bg-[#2A6F4E] text-white font-bold py-3.5 rounded-xl transition duration-200 text-sm shadow-md active:scale-95 text-center">
            📱 Open Member Registration Portal
          </Link>
          
          <Link href="/dashboard" className="block w-full bg-white hover:bg-gray-50 text-[#246927] border-2 border-[#246927] font-bold py-3.5 rounded-xl transition duration-200 text-sm active:scale-95 text-center">
            📊 Open Organizer Terminal Dashboard
          </Link>
        </div>

        <div className="text-[10px] text-gray-400 font-medium">
          KasamaApp Core Framework Layer Engine • Cloud Synchronized via Supabase
        </div>
      </div>
    </div>
  );
}