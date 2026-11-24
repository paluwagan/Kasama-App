'use client';

import { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
// 1. I-initialize ang Supabase Client gamit ang inyong credentials
const supabaseUrl = "https://oeygnvkuapdxlshfcsjb.supabase.co";
const supabaseAnonKey = "sb_publishable_2EwOa8he17bDtYdvbvzi3w_ru9cGEPM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RegisterPage() {
  // Mga state variables para sa form inputs
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [simulatedInsurance, setSimulatedInsurance] = useState(false);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [receiptText, setReceiptText] = useState<string | null>(null);

  const router = useRouter();
  const studentIdRef = useRef<HTMLInputElement>(null);
  // Awtomatikong ginagawang malaking titik ang unahan ng bawat salita
  const formatNameInput = (value: string) => {
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '); 
}      

  // Function para i-handle ang pag-submit ng inyong 26 na kaklase
 const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedName = fullName.trim();
    const cleanedId = studentId.trim();
       
    // 2. Format ng Student ID: Eksaktong 4 na numero, gitling, at 5 numero (Hal. 2026-10345)
    const studentIdPattern = /^\d{4}-\d{4}$/;

    // Pagpapatupad ng Verification Rules:
    if (cleanedName === '' || cleanedId === ''){
      setMessage('❌ Mangyaring sagutan ang lahat ng field.');
      return; 
    }

    if (!studentIdPattern.test(cleanedId)){
      setMessage('❌ Maling Format ng Student ID! Dapat ay sumunod sa eksaktong format na: YYYY-XXXX (Halimbawa: 2026-1034).');
      return; 
    }

    setIsSubmitting(true); // Dito natin sisimulan ang loading indicator
    setMessage('')

    try {
      // Isusulat ang user data direkta sa cloud table sa Supabase Free Tier
      const { error } = await supabase.from('profiles').insert([
        {
          full_name: cleanedName,
          student_id_number: cleanedId,
          id_image_url: 'https://placeholder.com', // Temporary mockup link ng uploaded image
          tiwala_score: 100, // Naka-default sa 100 para sa inyong Tiwala Score logic
          is_verified: true, // Auto-verified sa inyong rapid classroom test simulation
        },
      ]);

      if (error) throw error;
      // === 1. GAGAWA NG MALINIS NA LAYOUT PARA SA DIGITAL RECEIPT ===
      const receiptContent = `
==================================================
        KASAMAAPP DIGITAL PALUWAGAN LEDGER
              REGISTRATION RECEIPT
==================================================
REFERENCE STATUS : [ VERIFIED & CLOUD SYNCED ]
MEMBER NAME      : ${cleanedName}
STUDENT ID NO.   : ${cleanedId}
STARTING BALANCE : 100% Tiwala Score
DAMAYAN PREMIUM  : ${simulatedInsurance ? 'YES (+₱5.00/mo Included)' : 'NO / STANDARD'}
TRANSACTION FEE  : ₱20.00 Paid
TIMESTAMP        : ${new Date().toLocaleString()}
--------------------------------------------------
Pagkatapos magrehistro, awtomatikong lalabas ang 
iyong pangalan sa Organizer Dashboard Terminal.
==================================================
      `.trim();
      setReceiptText(receiptContent);

      // === 2. I-TRIGGER ANG AUTOMATIC FILE DOWNLOADER NG BROWSER ===
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'KasamaApp_Receipt_' + fullName.trim().replace(/\s+/g, '_') + '.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage('🎉 Success, Rehistrado ka na sa system ng KasamaApp.');
      // I-clear ang fields pagkatapos ng successful validation tracking loop
      setFullName('');
      setStudentId('');
      setIdPreview(null);

      setSimulatedInsurance(false);

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setMessage('❌ Error sa database network: ${err.message}');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#F0FDF4] border-2 border-emerald-600/30 shadow-xl rounded-2xl p-8 space-y-6">
        {/* App Title Header Branding */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <img 
              src="/logo.png" 
              alt="KasamaApp Logo" 
              className="w-16 h-16 object-contain drop-shadow-md"
              />
            </div>
          <h1 className="text-3xl font-black text-[#246927] tracking-tight">KasamaApp</h1>
          <p className="text-gray-500 text-xs mt-1 font-medium">Digital Paluwagan Registration Portal</p>
        </div>

        {message && (
        <div className={`mb-4 p-3 border text-xs font-semibold rounded-xl text-center ${
            message.startsWith('❌') 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name input block */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Juan Dela Cruz"
              value={fullName}
              onChange={(e) => setFullName(formatNameInput(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  studentIdRef.current?.focus();
                }
              }} 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>

          {/* Student ID block */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID Number</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="2026-1034"
              maxLength={9}
              ref={studentIdRef}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>

          {/* Interactive ID Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Student ID Photo</label>
            <label className="block border-2 border-dashed border-emerald-600/40 bg-emerald-50/50 rounded-xl p-4 text-center cursor-pointer hover:bg-emerald-100/50 transition">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.item(0)
                  if (file) {
                    setIdPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {idPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={idPreview} alt="ID Preview" className="h-24 object-contain rounded-lg border border-emerald-600/30 shadow-sm" />
                  <span className="text-xs font-bold text-emerald-800">✓ ID Photo Attached (Click to change)</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">📸 Tap to Upload Student ID Photo</p>
                  <span className="inline-block px-3 py-1 bg-[#1B491C] text-white text-[11px] font-bold rounded-full">
                    Tiwala Check Secured
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* Value-added Toggle Hook for the Damayan Microinsurance */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-800">Add Damayan Emergency Insurance Protection</span>
              <span className="text-[10px] text-[#246927] font-medium">Protektado ang Tiwala Score mo sakaling may emergency (+₱5.00/month)</span>
            </div>
            <input
              type="checkbox"
              checked={simulatedInsurance}
              onChange={(e) => setSimulatedInsurance(e.target.checked)}
              className="h-4 w-4 text-[#246927] accent-[#246927] border-gray-300 rounded focus:ring-"
            />
          </div>

          {/* Submit Action Trigger Button Component (₱20 One-time tollgate) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#246927] hover:bg-[#2A6F4E] text-white font-bold py-3.5 rounded-xl transition duration-200 text-sm shadow-md active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing Ledger Sync...' : 'Verify Profile & Unlock Groups (₱20.00)'}
          </button>
        </form>
          {receiptText && (
            <div className="mt-5 p-4 bg-emerald-50 border border-emerald-300 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-[#1B491C] uppercase tracking-wider">
                  ✓ Official Digital Receipt
                </span>
                <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold">
                  Cloud Synced
                </span>
              </div>
              <pre className="text-[11px] font-mono text-gray-800 whitespace-pre-wrap bg-white p-3 rounded-lg border border-emerald-100 overflow-x-auto">
                {receiptText}
              </pre>
              <p className="text-[10px] text-gray-500 mt-2 text-center">
                Screenshot this receipt as proof of your verified registration.
              </p>
            </div>
          )}
        <p className="text-center text-[11px] text-gray-500 mt-4">
          🛡️ <span className="font-semibold text-emerald-800">Zero-Custody Ledger:</span> Cash contributions remain strictly between members and your Circle Organizer.
        </p>
      </div>
    </div>
  );
}