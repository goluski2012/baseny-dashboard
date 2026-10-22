"use client"

import React, { useState } from 'react';
import { Search, MapPin, Phone, ExternalLink } from 'lucide-react';

const POOLS = [
  { id: 1, name: "POSiR Oddział Chwiałka", addr: "ul. Spychalskiego 34, Poznań", dist: "13,8 km", tel: "61 835 79 00", url: "https://posir.poznan.pl" },
  { id: 2, name: "Pływalnia Miejska Grunwald", addr: "ul. Taborowa 4, Poznań", dist: "10,5 km", tel: "61 646 00 00", url: "https://posir.poznan.pl" },
  { id: 3, name: "CityZen Poznań", addr: "Droga Dębińska 10c, Poznań", dist: "13,1 km", tel: "61 831 24 00", url: "https://efitness.com.pl" },
  { id: 4, name: "Tarnowskie Termy", addr: "ul. Nowa 54, Tarnowo Podgórne", dist: "19,2 km", tel: "61 102 11 11", url: "https://tarnowskie-termy.pl" },
  { id: 5, name: "Termy Maltańskie", addr: "ul. Termalna 1, Poznań", dist: "18,4 km", tel: "61 222 29 29", url: "https://termymaltanskie.com.pl" },
  { id: 6, name: "Pływalnia Atlantis", addr: "os. Stefana Batorego 101, Poznań", dist: "17,2 km", tel: "61 827 58 80", url: "https://posir.poznan.pl" },
  { id: 7, name: "Pływalnia POSiR Rataje", addr: "os. Piastowskie 40, Poznań", dist: "16,5 km", tel: "61 871 06 42", url: "https://posir.poznan.pl" },
  { id: 8, name: "Centrum Kultury Fizycznej UAM", addr: "ul. Strażewicza 21, Poznań", dist: "17,9 km", tel: "61 829 64 00", url: "https://amu.edu.pl" }
];

export default function Dashboard() {
  const [day, setDay] = useState('Czwartek');
  const [triggered, setTriggered] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Pływalnie Poznań — Dostępność Torów
          </h1>
          <p className="text-sm text-slate-400 mt-1">Wyszukuj wolne tory na dowolny dzień i przeglądaj odległości z Gołusek.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setTriggered(true); }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Dzień Tygodnia</label>
            <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-sm">
              <option value="Poniedziałek">Poniedziałek</option>
              <option value="Czwartek">Czwartek</option>
              <option value="Piątek">Piątek</option>
              <option value="Sobota">Sobota</option>
              <option value="Niedziela">Niedziela</option>
            </select>
          </div>
          <div className="flex items-end sm:col-span-2">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-semibold p-2.5 rounded-lg text-sm flex items-center justify-center gap-2">
              <Search size={16} /> Szukaj Wolnych Torów na: {day}
            </button>
          </div>
        </form>

        {triggered && (
          <div className="p-5 rounded-xl border border-blue-900/50 bg-blue-950/20 space-y-4">
            <h2 className="text-lg font-bold text-blue-400 border-b border-slate-800 pb-2">Wyniki wyszukiwania grafików na {day}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-200">POSiR Oddział Chwiałka</h4>
                  <p className="text-xs text-slate-400 mt-1">Dzień: {day} • Godzina: 08:00</p>
                </div>
                <div className="text-right"><span className="text-lg font-black text-green-400 block">3 / 6</span><span className="text-[10px] text-slate-400 block">Wolne Tory</span></div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-200">Pływalnia Miejska Grunwald</h4>
                  <p className="text-xs text-slate-400 mt-1">Dzień: {day} • Godzina: 09:15</p>
                </div>
                <div className="text-right"><span className="text-lg font-black text-green-400 block">4 / 8</span><span className="text-[10px] text-slate-400 block">Wolne Tory</span></div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-2">Wszystkie Obiekty Basenowe w Aglomeracji Poznańskiej</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {POOLS.map((p) => (
              <div key={p.id} className="p-5 rounded-xl border border-slate-800 bg-slate-900 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-100">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.addr} • Tel: {p.tel}</p>
                  <span className="inline-block text-xs bg-slate-800 text-blue-400 px-2.5 py-1 rounded-md">Odległość z Gołusek: {p.dist}</span>
                </div>
                <div className="border-t border-slate-800 pt-3 text-right">
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1">Otwórz oryginalny grafik <ExternalLink size={12} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
