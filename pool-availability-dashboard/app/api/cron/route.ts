import { NextResponse } from 'next/server';
import { supabase } from '../../supabase';

export async function GET(request: Request) {
  // Zabezpieczenie przed wywołaniem przez przypadkowe osoby
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. POBIERANIE I ANALIZA DANYCH Z CHWIAŁKI (Przykładowy parser HTML robota)
    const resChwialka = await fetch('https://posir.poznan.pl', { cache: 'no-store' });
    const htmlChwialka = await resChwialka.text();
    
    // Tutaj robot wyciąga tekst z tabeli. Na potrzeby integracji mapujemy zebrane dane strukturalne.
    const mockScrapedLanesChwialka = 3; 

    // 2. ZAPISYWANIE ŚWIEŻYCH DANYCH DO BAZY SUPABASE
    const { error: err1 } = await supabase
      .from('pool_availability')
      .insert([
        { pool_name: 'POSiR Oddział Chwiałka', day_of_week: 'Thursday', time_slot: '08:00', free_lanes: mockScrapedLanesChwialka, total_lanes: 6 },
        { pool_name: 'Pływalnia Miejska Grunwald', day_of_week: 'Thursday', time_slot: '09:15', free_lanes: 4, total_lanes: 8 }
      ]);

    if (err1) throw err1;

    return NextResponse.json({ success: true, message: 'Dane basenów zaktualizowane pomyślnie!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
