export interface OtherPool {
  name: string
  location: string
  distance: string
  type: string
  multisport: string
  address: string
  phone: string
  url: string
  characteristics?: {
    sport_pool?: string
    other_pools?: string
  }
}

export const otherPoolsData: OtherPool[] = [
  {
    name: "Termy Maltańskie (Basen Sportowy i Aquapark)",
    location: "Poznań (Maltanka)",
    distance: "19.5 km",
    type: "Kompleks rekreacyjny (Termy/Aquapark)",
    multisport: "Honorowana",
    address: "ul. Termalna 1, 61-028 Poznań",
    phone: "459 595 590",
    url: "https://termymaltanskie.com.pl",
    characteristics: {
      sport_pool: "Olimpijski 51,3m x 25m, 10 torów (dzielony pomostem na 2x 25m), głębokość 2,0m",
      other_pools: "Basen do skoków (25m x 30m, głębokość 5,0m z wieżą 10m), basen rozgrzewkowy (16,67m x 8m)",
    },
  },
  {
    name: "Pływalnia Miejska Atlantis (POSiR)",
    location: "Poznań (Piątkowo)",
    distance: "18.2 km",
    type: "Basen sportowy",
    multisport: "Honorowana",
    address: "os. Stefana Batorego 101, 60-687 Poznań",
    phone: "61 827 60 70",
    url: "https://posir.poznan.pl",
    characteristics: {
      sport_pool: "Długość 25,0m, szerokość 12,5m, 6 torów, głębokość 1,30m - 1,80m, temp. 28°C",
      other_pools:
        "Basen rekreacyjny (głębokość 1,10m, temp. 32°C), brodzik dla dzieci (głębokość 0,25m), zjeżdżalnia 60m",
    },
  },
  {
    name: "Pływalnia Miejska Rataje (POSiR)",
    location: "Poznań (Rataje)",
    distance: "16.1 km",
    type: "Basen sportowy",
    multisport: "Honorowana",
    address: "os. Piastowskie 55A, 61-158 Poznań",
    phone: "61 871 06 40",
    url: "https://posir.poznan.pl",
    characteristics: {
      sport_pool: "Długość 25,0m, szerokość 16,0m, dwie niecki rekreacyjne 5x9m, zespół saun",
    },
  },
  {
    name: "Pływalnia Miejska Winogrady (POSiR)",
    location: "Poznań (Winogrady)",
    distance: "16.9 km",
    type: "Basen sportowy",
    multisport: "Honorowana",
    address: "os. Zwycięstwa 124, 61-646 Poznań",
    phone: "61 646 33 44",
    url: "https://posir.poznan.pl",
    characteristics: {
      sport_pool: "Wymiary 25m x 12,5m, basen rekreacyjny 5x9m, niecka z hydromasażem, zespół saun",
    },
  },
  {
    name: "Oaza Kórnik - Centrum Sportu i Rekreacji",
    location: "Kórnik (25 km)",
    distance: "29.4 km",
    type: "Kompleks rekreacyjny (Termy/Aquapark)",
    multisport: "Honorowana",
    address: "ul. Krasickiego 1, 62-035 Kórnik",
    phone: "61 817 10 00",
    url: "https://kornik.pl",
    characteristics: {
      sport_pool: "Długość 25,0m, szerokość 12,5m, 6 torów, głębokość 1,40m - 2,20m",
      other_pools: "Basen rekreacyjny (głębokość 0,80m - 1,25m), rwąca rzeka, brodzik, zjeżdżalnia 50m",
    },
  },
  {
    name: "Pływalnia Uniwersytecka UAM",
    location: "Poznań (Morasko)",
    distance: "20.1 km",
    type: "Basen sportowy",
    multisport: "Honorowana",
    address: "ul. Strażewicza 21, 61-614 Poznań",
    phone: "61 829 63 00",
    url: "https://uam.pl",
  },
  {
    name: "Pływalnia AWF Poznań",
    location: "Poznań (Centrum)",
    distance: "13.4 km",
    type: "Basen sportowy",
    multisport: "Honorowana",
    address: "Droga Dębińska 10, 61-555 Poznań",
    phone: "61 835 50 00",
    url: "https://awf.poznan.pl",
  },
  {
    name: "Pływalnia POSNANIA",
    location: "Poznań (Winogrady)",
    distance: "15.3 km",
    type: "Basen sportowy",
    multisport: "Brak informacji",
    address: "ul. Słowiańska 78, 61-664 Poznań",
    phone: "61 827 80 02",
    url: "http://posnania.pl",
  },
  {
    name: "Park Wodny Octopus",
    location: "Suchy Las (10 km)",
    distance: "21.6 km",
    type: "Kompleks rekreacyjny (Termy/Aquapark)",
    multisport: "Honorowana",
    address: "ul. Szkolna 18, 62-002 Suchy Las",
    phone: "61 892 65 40",
    url: "https://suchylas.pl",
  },
  {
    name: "Pływalnia Wodny Raj",
    location: "Swarzędz (12 km)",
    distance: "25.7 km",
    type: "Basen sportowy",
    multisport: "Honorowana",
    address: "ul. Kosynierów 1, 62-020 Swarzędz",
    phone: "61 650 95 20",
    url: "https://swarzedz.pl",
  },
  {
    name: "Centrum Sportów Wodnych Delfin",
    location: "Koziegłowy (9 km)",
    distance: "23.9 km",
    type: "Basen sportowy",
    multisport: "Honorowana",
    address: "ul. Piłsudskiego 3, 62-004 Koziegłowy",
    phone: "61 811 11 51",
    url: "https://crwk.pl",
  },
  {
    name: "Centrum Maraton (Kryta Pływalnia)",
    location: "Szamotuły (35 km)",
    distance: "37.5 km",
    type: "Basen sportowy",
    multisport: "Honorowana",
    address: "ul. Sportowa 6, 64-500 Szamotuły",
    phone: "61 292 25 47",
    url: "https://szamotuly.pl",
  },
  {
    name: "Śremski Sport (Kryta Pływalnia)",
    location: "Śrem (45 km)",
    distance: "44.6 km",
    type: "Basen sportowy",
    multisport: "Honorowana",
    address: "ul. Staszica 1a, 63-100 Śrem",
    phone: "61 222 84 10",
    url: "https://sremskisport.pl",
  },
]
