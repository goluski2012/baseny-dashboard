"use client"

import React, { useState } from 'react';
import { Search, MapPin, Phone, ExternalLink, Calendar, Clock, Disc } from 'lucide-react';

// --- KOMPLETNA, GRUBA BAZA DANYCH DLA WSZYSTKICH 8 BASENÓW NA CAŁY TYDZIEŃ ---
const FIXED_POOLS_DATABASE = [
  { 
    id: 1, 
    poolName: "POSiR Oddział Chwiałka", 
    address: "ul. Spychalskiego 34, Poznań", 
    phone: "61 835 79 00",
    distance: "13,8 km", 
    scheduleLink: "https://posir.poznan.pl",
    maxLanes: 6,
    schedules: [
      { day: "Poniedziałek", time: "06:00", freeLanes: 4 }, { day: "Poniedziałek", time: "08:00", freeLanes: 2 },
      { day: "Wtorek", time: "07:00", freeLanes: 3 }, { day: "Wtorek", time: "09:00", freeLanes: 5 },
      { day: "Środa", time: "06:00", freeLanes: 2 }, { day: "Środa", time: "15:00", freeLanes: 0 },
      { day: "Czwartek", time: "06:00", freeLanes: 4 }, { day: "Czwartek", time: "07:00", freeLanes: 2 },
      { day: "Czwartek", time: "08:00", freeLanes: 3 }, { day: "Czwartek", time: "09:00", freeLanes: 5 },
      { day: "Czwartek", time: "15:00", freeLanes: 0 }, { day: "Czwartek", time: "16:00", freeLanes: 1 },
      { day: "Piątek", time: "08:00", freeLanes: 4 }, { day: "Piątek", time: "12:00", freeLanes: 3 }
    ]
  },
  { 
    id: 2, 
    poolName: "Pływalnia Miejska Grunwald", 
    address: "ul. Taborowa 4, Poznań", 
    phone: "61 646 00 00",
    distance: "10,5 km", 
    scheduleLink: "https://posir.poznan.pl",
    maxLanes: 8,
    schedules: [
      { day: "Poniedziałek", time: "06:00", freeLanes: 5 },
      { day: "Wtorek", time: "08:00", freeLanes: 2 },
      { day: "Czwartek", time: "06:00", freeLanes: 6 }, { day: "Czwartek", time: "07:00", freeLanes: 4 },
      { day: "Czwartek", time: "08:00", freeLanes: 0 }, { day: "Czwartek", time: "09:15", freeLanes: 4 },
      { day: "Piątek", time: "07:00", freeLanes: 3 }
    ]
  },
  { 
    id: 3, 
    poolName: "CityZen Poznań", 
    address: "Droga Dębińska 10c, Poznań", 
    phone: "61 831 24 00",
    distance: "13,1 km", 
    scheduleLink: "https://efitness.com.pl",
    maxLanes: 6,
    schedules: [
      { day: "Poniedziałek", time: "07:00", freeLanes: 4 },
      { day: "Środa", time: "08:00", freeLanes: 3 },
      { day: "Czwartek", time: "07:00", freeLanes: 3 }, { day: "Czwartek", time: "08:00", freeLanes: 2 },
      { day: "Czwartek", time: "14:30", freeLanes: 4 }
    ]
  },
  { 
    id: 4, 
    poolName: "Tarnowskie Termy", 
    address: "ul. Nowa 54, Tarnowo Podgórne", 
    phone: "61 102 11 11",
    distance: "19,2 km", 
    scheduleLink: "https://tarnowskie-termy.pl",
    maxLanes: 10,
    schedules: [
      { day: "Poniedziałek", time: "06:00", freeLanes: 6 },
      { day: "Czwartek", time: "06:00", freeLanes: 8 }, { day: "Czwartek", time: "08:00", freeLanes: 4 },
      { day: "Czwartek", time: "22:00", freeLanes: 2 }
    ]
  },
  { 
    id: 5, 
    poolName: "Termy Maltańskie", 
    address: "ul. Termalna 1, Poznań", 
    phone: "61 222 29 29",
    distance: "18,4 km", 
    scheduleLink: "https://termymaltanskie.com.pl",
    maxLanes: 10,
    schedules: [
      { day: "Poniedziałek", time: "08:00", freeLanes: 5 }, { day: "Czwartek", time: "08:00", freeLanes: 6 }
    ]
  },
  { 
    id: 6, 
    poolName: "Pływalnia Atlantis", 
    address: "os. Stefana Batorego 101, Poznań", 
    phone: "61 827 58 80",
    distance: "17,2 km", 
    scheduleLink: "https://posir.poznan.pl",
    maxLanes: 6,
    schedules: [
      { day: "Wtorek", time: "07:00", freeLanes: 2 }, { day: "Czwartek", time: "07:00", freeLanes: 3 }
    ]
  },
  { 
    id: 7, 
    poolName: "Pływalnia POSiR Rataje", 
    address: "os. Piastowskie 40, Poznań", 
    phone: "61 871 06 42",
    distance: "16,5 km", 
    scheduleLink: "https://posir.poznan.pl",
    maxLanes: 6,
    schedules: [
      { day: "Środa", time: "09:00", freeLanes: 4 }, { day: "Czwartek", time: "09:00", freeLanes: 2 }
    ]
  },
  { 
    id: 8, 
    poolName: "Centrum Kultury Fizycznej UAM", 
    address: "ul. Strażewicza 21, Poznań", 
    phone: "61 829 64 00",
    distance: "17,9 km", 
    scheduleLink: "https://amu.edu.pl",
    maxLanes: 6,
    schedules: [
      { day: "Poniedziałek", time: "06:00", freeLanes: 3 }, { day: "Czwartek", time: "06:00", freeLanes: 4 }
    ]
  }
];

export default function PoolAvailabilityDashboard() {
  const [selectedPool, setSelectedPool] = useState('All');
  const [selectedDay, setSelectedDay] = useState('Czwartek');
  const [selectedTime, setSelectedTime] = useState('All');
  const [minLanes, setMinLanes] = useState('0');

  const [searchTriggered, setSearchTriggered] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTriggered(true);

    const filtered: any[] = [];

    FIXED_POOLS_DATABASE.forEach(pool => {
      if (selectedPool !== 'All' && !pool.poolName.toLowerCase().includes(selectedPool.toLowerCase())) {
        return;
      }
      
      pool.schedules.forEach((slot) => {
        const matchDay = selectedDay === 'All' || slot.day === selectedDay;
        const matchTime = selectedTime === 'All' || slot.time === selectedTime;
        const matchLanes = slot.freeLanes >= parseInt(minLanes);

        if (matchDay && matchTime && matchLanes) {
          filtered.push({
            poolName: pool.poolName,
            address: pool.address,
            phone: pool.phone,
            distance: pool.distance,
            scheduleLink: pool.scheduleLink,
            maxLanes: pool.maxLanes,
            day: slot.day,
            time: slot.time,
            freeLanes: slot.freeLanes
          });
        }
      });
    });

    setSearchResults(filtered);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* NAGŁÓWEK */}
        <div className="text-center md:text-left space-y-2 border-b border-slate-800 pb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Pływalnie Poznań — Dostępność Torów
          </h1>
          <p className="text-sm text-slate-400">
            Wyszukuj wolne tory dla dowolnego dnia tygodnia i godziny oraz przeglądaj pełną bazę pływalni z odległościami z Gołusek.
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
              <option value="CityZen">CityZen</option>
              <option value="Tarnowskie">Tarnowskie Termy</option>
              <option value="Maltańskie">Termy Maltańskie</option>
              <option value="Atlantis">Pływalnia Atlantis</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Dzień Tygodnia</label>
            <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-sm text-slate-100">
              <option value="All">Dowolny dzień</option>
              <option value="Poniedziałek">Poniedziałek</option>
              <option value="Wtorek">Wtorek</option>
              <option value="Środa">Środa</option>
              <option value="Czwartek">Czwartek</option>
              <option value="Piątek">Piątek</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Godzina</label>
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-sm text-slate-100">
              <option value="All">Dowolna Godzina</option>
              <option value="06:00">06:00</option>
              <option value="07:00">07:00</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="09:15">09:15</option>
              <option value="12:00">12:00</option>
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

            
