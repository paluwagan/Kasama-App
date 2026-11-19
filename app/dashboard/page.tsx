'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. I-initialize ang Supabase Client gamit ang inyong active credentials cluster
const supabaseUrl = "https://oeygnvkuapdxlshfcsjb.supabase.co";
const supabaseAnonKey = "sb_publishable_2EwOa8he17bDtYdvbvzi3w_ru9cGEPM"; // Naka-hardcode na rito ang inyong official project public anon key bundle
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Profile {
  id: string;
  full_name: string;
  student_id_number: string;
  tiwala_score: number;
  is_verified: boolean;
}

export default function OrganizerDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');

  // 2. Huhugutin ang listahan ng mga kaklaseng nagrehistro mula sa inyong cloud Supabase tables
  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      console.error('Error fetching data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // 3. Function para sa "Dual-Verification" - i-co-confirm ni Organizer ang weekly payment ng user
  const handleConfirmPayment = async (id: string, currentScore: number) => {
    setSuccessMessage('');
    try {
      // Kapag kinumpirma ni Organizer, tataas o mananatiling ligtas ang Tiwala Score ng kaklase niyo (Max: 100)
      const { error } = await supabase
        .from('profiles')
        .update({ tiwala_score: Math.min(currentScore + 2, 100) })
        .eq('id', id);

      if (error) throw error;

      setSuccessMessage('✅ Ledger updated live! Rotation payment confirmed and Tiwala Score synchronized.');
      fetchProfiles(); // I-refresh ang listahan matapos ang system database updates
    } catch (err: any) {
      alert('❌ Sync Error: ${err.message}');
    }
  };

  // Ito ang buong function na idinagdag sa itaas ng return statement:
  // Line 65
  const handleMarkAsLate = async (id: string, currentScore: number) => {
    setSuccessMessage(''); // Pinalitan mula setSystemMessage
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tiwala_score: Math.max(Number(currentScore) - 5, 0) })
        .eq('id', id);

      if (error) throw error;

      // Pinalitan at ginawang simpleng text para mag-match sa gamit mo
      setSuccessMessage('⚠️ Ledger updated! Member marked as late (-5 points).'); 
      fetchProfiles(); 
    } catch (err: any) {
      // Pinalitan din dito
      alert('❌ Sync Error: ${err.message}'); 
    }
  }; 

  const handleMarkAsUnpaid = async (id: string, currentScore: number) => {
    setSuccessMessage(''); // Pinalitan mula setSystemMessage
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tiwala_score: Math.max(Number(currentScore) - 15, 0) })
        .eq('id', id);

      if (error) throw error;

      // Pinalitan at ginawang simpleng text para mag-match sa gamit mo
      setSuccessMessage('🚨 Critical Default! Member marked as Unpaid (-15 points).');
      fetchProfiles(); 
    } catch (err: any) {
      // Pinalitan din dito
      alert('❌ Sync Error: ${err.message}'); 
    }
  }; 

  if (!isUnlocked) {
  return (
    <div className="min-h-screen bg-[#DCFCE7] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center border border-emerald-100">
        <img src="/logo.png" alt="KasamaApp Logo" className="w-16 h-16 mx-auto mb-3 object-contain" />
        <h2 className="text-xl font-black text-[#1B491C]">Organizer Security Lock</h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">Enter 4-digit Circle Organizer PIN to manage ledger</p>
        <input
          type="password"
          maxLength={4}
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          placeholder="••••"
          className="w-full text-center text-2xl tracking-[0.5em] py-2 border border-gray-300 rounded-xl mb-3 focus:outline-none focus:border-emerald-600"
        />
        <button
          onClick={() => {
            if (pinInput === '2026') {
              setIsUnlocked(true);
            } else {
              alert('Incorrect Organizer PIN');
            }
          }}
          className="w-full py-2.5 bg-[#1B491C] hover:bg-emerald-800 text-white font-bold rounded-xl transition"
        >
          Unlock Terminal
        </button>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-5xl mx-auto bg-[#F0FDF4] border-2 border-emerald-600/30 shadow-xl rounded-2xl p-8 space-y-6">
        
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="KasamaApp Logo" 
              className="w-12 h-12 object-contain drop-shadow-sm"
            />
          <div>
            <h1 className="text-2xl font-bold text-[#246927] tracking-tight">KasamaApp: Circle Organizer Terminal</h1>
            <p className="text-gray-500 text-[11px] font-medium mt-0.5 uppercase tracking-wider">Automated Paluwagan Ledger Sheet</p>
          </div>
        </div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#2A6F4E]/10 text-[#163A17] font-semibold text-xs px-3 py-1.5 rounded-full border border-[#2A6F4E]/30 whitespace-nowrap">
            Active Rotation Loop
          </span>

          <span className="bg-gray-100 text-gray-700 font-bold text-xs px-3 py-1.5 rounded-full border border-gray-200 whitespace-nowrap">
              👥 Total Members: {profiles.length}
            </span>
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg text-center animate-pulse">
            {successMessage}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500 text-sm py-10">Syncing with cloud ledger data streams...</p>
        ) : profiles.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-10">Walang rehistradong miyembro sa database. Mangyaring ipa-scan ang Registration QR code sa mga miyembro upang magsimula.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Member Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">ID Reference</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Mock Contribution Due</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Tiwala Score Metric</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600 text-gray-500 uppercase tracking-wider min-w-[280px]">Verification Ledger Action Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-gray-800">{profile.full_name}</td>
                    <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">{profile.student_id_number}</td>
                    <td className="px-4 py-3.5 text-center text-gray-700 font-semibold">₱50.00 Play-money</td>
                    <td className="px-4 py-3.5 text-center justify-center gap-2 whitespace-nowrap min-w-[280px]">
                      <span className={`inline-block font-bold text-xs px-2.5 py-1 rounded border ${
                        profile.tiwala_score >= 90 
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : profile.tiwala_score >= 75
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        ⭐ {profile.tiwala_score}% Reliability Badge
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center space-x-2 whitespace-nowrap">
                     {/* 1. Paid Button */}
                    <button
                        onClick={() => handleConfirmPayment(profile.id, profile.tiwala_score)}
                        className="bg-[#246927] hover:bg-[#1E561F] text-white font-semibold text-xs px-3 py-2 rounded-lg transition-all shadow-sm active:scale-95"
                    >
                        ✓ Paid
                    </button>

                     {/* 2. BAGO: Late Button (Kulay Dilaw/Amber para sa warning) */}
                     <button
                        onClick={() => handleMarkAsLate(profile.id, profile.tiwala_score)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold text-xs px-3 py-2 rounded-lg transition-all shadow-sm active:scale-95"
                    >
                        ⏳ Late
                    </button>

                     {/* 3. BAGO: Unpaid Button (Kulay Pula para sa critical risk failure) */}
                    <button
                        onClick={() => handleMarkAsUnpaid(profile.id, profile.tiwala_score)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold text-xs px-3 py-2 rounded-lg transition-all shadow-sm active:scale-95"
                    >
                        ✕ Unpaid
                     </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}