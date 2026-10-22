"use client"

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, ExternalLink, Calendar, Clock, Disc } from 'lucide-react';
import { supabase } from './supabase';

// --- PEŁNA STACJONARNA BAZA DANYCH (ODLEGŁOŚCI, ADRESY, LINKI) ---
const STATIONARY_POOLS = [
  { id: 1, poolName: "POSiR Oddział Chwiałka", address: "ul. Spychalskiego 34, Poznań", phone: "61 835 79 00", distance: "13,8 km", scheduleLink: "https://posir.poznan.pl", isSearchable: true },
  { id: 2, poolName: "Pływalnia Miejska Grunwald", address: "ul. Taborowa 4, Poznań", phone: "61 646 00 00", distance: "10,5 km", scheduleLink: "https://posir.poznan.pl", isSearchable: true },
  { id: 3, poolName: "CityZen Poznań", address: "Droga Dębińska 10c, Poznań", phone: "61 831 24 00", distance: "13,1 km", scheduleLink: "https://efitness.com.pl", isSearchable: true },
  { id: 4, poolName: "Tarnowskie Termy", address: "ul. Nowa 54, Tarnowo Podgórne", phone: "61 102 11 11", distance: "19,2 km", scheduleLink: "https://tarnowskie-termy.pl", isSearchable: true },
  { id: 5, poolName: "Termy Maltańskie", address: "ul. Termalna 1, Poznań", phone: "61 222 29 29", distance: "18,4 km", scheduleLink: "https://termymaltanskie.com.pl", isSearchable: false },
  { id: 6, poolName: "Pływalnia Atlantis", address: "os. Stefana Batorego 101, Poznań", phone: "61 827 58 80", distance: "17,2 km", scheduleLink: "https://posir.poznan.pl", isSearchable: false },
  { id: 7, poolName: "Pływalnia POSiR Rataje", address: "os. Piastowskie 40, Poznań", phone: "61 871 06 42", distance: "16,5 km", scheduleLink: "https://posir.poznan.pl", isSearchable: false },
  { id: 8, poolName: "Centrum Kultury Fizycznej UAM", address: "ul. Strażewicza 21, Poznań", phone: "61 829 64 00", distance: "17,9 km", scheduleLink: "https://amu.edu.pl", isSearchable: false }
];

export default function PoolAvailabilityDashboard() {
  const [selectedPool, setSelectedPool] = useState('All');
  const [selectedDay, setSelectedDay] = useState('Thursday');
  const [selectedTime, setSelectedTime] = useState('All');
  const [minLanes, setMinLanes] = useState('0');

  const [dbSchedules, setDbSchedules] = useState<any[]>([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Pobieranie automatycznie zebranych danych z Supabase przy wejściu na stronę
  useEffect(() => {
    async function fetchSchedules() {
      const { data, error } = await supabase
        .from('pool_availability')
        .select('*')
        .order('time_slot', { ascending: true });
      
      if (!error && data) {
        setDbSchedules(data);
      }
    }
    fetchSchedules();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTriggered(true);

    // Przeszukiwanie rekordów pobranych z bazy danych zaktualizowanych przez bota
    const matches = dbSchedules.filter((slot) => {
      const matchPool = selectedPool === 'All' || slot.pool_name.toLowerCase().includes(selectedPool.toLowerCase());
      const matchDay = selectedDay === 'All' || slot.day_of_week === selectedDay;
      const matchTime = selectedTime === 'All' || slot.time_slot === selectedTime;
      const matchLanes = slot.free_lanes >= parseInt(minLanes);

      return matchPool && matchDay && matchTime && matchLanes;
    });

    // Łączenie danych z bazy ze stacjonarnymi linkami i odległościami
    const detailedMatches = matches.map(match => {
      const staticInfo = STATIONARY_POOLS.find(p => p.poolName === match.pool_name);
      return {
        ...match,
        address: staticInfo?.address,
        distance: staticInfo?.distance,
        scheduleLink: staticInfo?.scheduleLink
      };
    });

    setSearchResults(detailedMatches);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center md:text-left space-y-2 border-b border-slate-800 pb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Pływalnie Poznań — Dostępność Torów
          </h1>
          <p className="text-sm text-slate-400">
            Wyszukuj wolne tory z dokładną godziną oraz przeglądaj pełną bazę pływalni w aglomeracji z odległościami z Gołusek.
          </p>
        </div>

        {/* WYSZUKIWARKA */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur shadow-lg">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Basen</label>
            <select value={selectedPool} onChange={(e) => setSelectedPool(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-sm text-slate-100">
              <option value="All">Wszystkie baseny</option>
              <option value="Chwiałka">Chwiałka</option>
              <option value="Grunwald">Miejska Grunwald</option>
              <option value="CityZen">CityZen Poznań</option>
              <option value="Tarnowskie">Tarnowskie Termy</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Dzień</label>
            <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-sm text-slate-100">
              <option value="Thursday">Czwartek</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Dokładna Godzina</label>
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-sm text-slate-100">
              <option value="All">Dowolna Godzina</option>
              <option value="06:00">06:00</option>
              <option value="07:00">07:00</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="09:15">09:15</option>
              <option value="14:30">14:30</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="22:00">22:00</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Min. Wolnych Torów</label>
            <select value={minLanes} onChange={(e) => setMinLanes(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-sm text-slate-100">
              <option value="0">Dowolna ilość</option>
              <option value="1">Minimum 1 wolny tor</option>
              <option value="2">Minimum 2 wolne tory</option>
              <option value="4">Minimum 4 wolne tory</option>
            </select>
          </div>

          <div className="flex items-end sm:col-span-2 md:col-span-1">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-semibold p-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
              <Search size={16} /> Szukaj
            </button>
          </div>
        </form>

        {/* PANEL WYNIKÓW WYSZUKIWANIA */}
        {searchTriggered && (
          <div className="p-5 rounded-xl border border-blue-900/50 bg-blue-950/20 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                <Clock size={18} /> Wyniki z aktualnych grafików (Supabase)
              </h2>
              <button onClick={() => setSearchTriggered(false)} className="text-xs text-slate-400 hover:text-slate-200">Wyczyść filtry ×</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.length > 0 ? (
                searchResults.map((result, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-200">{result.pool_name}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={12}/>{result.address}</p>
                      <div className="flex gap-4 mt-2 text-xs font-semibold text-slate-300">
                        <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-blue-400"><Calendar size={12}/>{result.day_of_week}</span>
                        <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-cyan-400"><Clock size={12}/>Godz: {result.time_slot}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className={`text-lg font-black block ${result.free_lanes > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {result.free_lanes} / {result.total_lanes}
                      </span>
                      <a href={result.scheduleLink} target="_blank" rel="noreferrer" className="text-[11px] text-blue-400 hover:underline flex items-center gap-1">
                        Otwórz grafik <ExternalLink size={10} />
                      </a>
                    </div>
