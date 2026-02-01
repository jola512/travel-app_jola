const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// ========== TŁUMACZENIA ==========
const regionTranslations = {
  'Europe': 'Europa',
  'Asia': 'Azja',
  'Africa': 'Afryka',
  'Americas': 'Ameryka',
  'Oceania': 'Oceania',
  'Antarctic': 'Antarktyda',
  'North America': 'Ameryka Północna',
  'South America': 'Ameryka Południowa',
};

const capitalTranslations = {
  'Berlin': 'Berlin',
  'Paris': 'Paryż',
  'Rome': 'Rzym',
  'Madrid': 'Madryt',
  'Warsaw': 'Warszawa',
  'Washington, D.C.': 'Waszyngton',
  'Washington': 'Waszyngton',
  'Tokyo': 'Tokio',
  'Brasília': 'Brasília',
  'Ottawa': 'Ottawa',
  'Canberra': 'Canberra',
  'Athens': 'Ateny',
  'Ankara': 'Ankara',
  'Cairo': 'Kair',
  'Mexico City': 'Meksyk',
  'New Delhi': 'Nowe Delhi',
  'Beijing': 'Pekin',
  'Seoul': 'Seul',
  'Bangkok': 'Bangkok',
  'Stockholm': 'Sztokholm',
  'Oslo': 'Oslo',
  'Amsterdam': 'Amsterdam',
  'Bern': 'Berno',
  'Vienna': 'Wiedeń',
  'Lisbon': 'Lizbona',
  'Prague': 'Praga',
  'Budapest': 'Budapeszt',
  'Buenos Aires': 'Buenos Aires',
  'Santiago': 'Santiago',
  'Pretoria': 'Pretoria',
  'Cape Town': 'Kapsztad',
  'Wellington': 'Wellington',
  'London': 'Londyn',
  // Dodaj więcej
};

// TŁUMACZENIE NAZW KRAJÓW angielskie -> polskie
const countryTranslations = {
  'Germany': 'Niemcy',
  'France': 'Francja',
  'Italy': 'Włochy',
  'Spain': 'Hiszpania',
  'Poland': 'Polska',
  'United States': 'USA',
  'Japan': 'Japonia',
  'Brazil': 'Brazylia',
  'Canada': 'Kanada',
  'Australia': 'Australia',
  'Greece': 'Grecja',
  'Turkey': 'Turcja',
  'Egypt': 'Egipt',
  'Mexico': 'Meksyk',
  'India': 'Indie',
  'China': 'Chiny',
  'South Korea': 'Korea Południowa',
  'Thailand': 'Tajlandia',
  'Sweden': 'Szwecja',
  'Norway': 'Norwegia',
  'Netherlands': 'Holandia',
  'Caribbean Netherlands': 'Holandia',
  'Switzerland': 'Szwajcaria',
  'Austria': 'Austria',
  'Portugal': 'Portugalia',
  'Czechia': 'Czechy',
  'Hungary': 'Węgry',
  'Argentina': 'Argentyna',
  'Chile': 'Chile',
  'South Africa': 'RPA',
  'New Zealand': 'Nowa Zelandia',
  'United Kingdom': 'Wielka Brytania',
  'Russia': 'Rosja',
  'Ukraine': 'Ukraina',
  // Dodaj więcej krajów
};

// ========== ENDPOINTY ==========

// 1. Pobierz kraj (JEDEN endpoint, nie dwa!)
app.get('/api/country/:name', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${req.params.name}`);
    
    // FILTR DLA CHIN - usuń Tajwan z wyników
    let country;
    if (req.params.name.toLowerCase() === 'china' || req.params.name.toLowerCase() === 'chiny') {
      // Szukaj Chin, nie Tajwanu
      country = response.data.find(c => 
        c.name.common === 'China' || 
        c.name.common === 'Taiwan' || 
        c.name.common === 'Taiwan, Province of China'
      );
      // Jeśli nie znaleziono Chin, weź pierwszy wynik
      if (!country) country = response.data[0];
    } else {
      country = response.data[0];
    }
    
    if (!country) {
      return res.status(404).json({ error: 'Kraj nie znaleziony' });
    }
    
    const englishName = country.name.common;
    const englishCapital = country.capital ? country.capital[0] : 'Brak danych';
    const englishRegion = country.region || 'Brak danych';
    
    // SPECJALNA OBSŁUGA DLA CHIN/TAJWANU
    let finalPolishName;
    if (englishName === 'Taiwan' || englishName === 'Taiwan, Province of China') {
      finalPolishName = 'Chiny (Tajwan)'; // Albo po prostu "Chiny"
    } else {
      finalPolishName = countryTranslations[englishName] || englishName;
    }
    
    // Tłumaczenia
    const polishCapital = capitalTranslations[englishCapital] || englishCapital;
    const polishRegion = regionTranslations[englishRegion] || englishRegion;

    res.json({
      name: finalPolishName,
      englishName: englishName,
      capital: polishCapital,
      englishCapital: englishCapital,
      population: country.population.toLocaleString(),
      region: polishRegion,
      englishRegion: englishRegion,
      flag: country.flags.png,
      languages: country.languages ? Object.values(country.languages).join(', ') : 'Brak danych',
      currency: country.currencies ? Object.values(country.currencies)[0].name : 'Brak danych'
    });
  } catch (error) {
    res.status(404).json({ error: 'Kraj nie znaleziony' });
  }
});

app.get('/api/country/:name', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${req.params.name}`);
    const country = response.data[0];
    
    const englishName = country.name.common;
    const englishCapital = country.capital ? country.capital[0] : 'Brak danych';
    const englishRegion = country.region || 'Brak danych';
    
    // Tłumaczenia
    const polishName = countryTranslations[englishName] || englishName;
    const polishCapital = capitalTranslations[englishCapital] || englishCapital;
    const polishRegion = regionTranslations[englishRegion] || englishRegion;

    res.json({
      name: polishName, // POLSKA NAZWA!
      englishName: englishName, // Zachowaj angielską też
      capital: polishCapital, // POLSKA STOLICA!
      englishCapital: englishCapital,
      population: country.population.toLocaleString(),
      region: polishRegion, // POLSKI REGION!
      englishRegion: englishRegion,
      flag: country.flags.png,
      languages: country.languages ? Object.values(country.languages).join(', ') : 'Brak danych',
      currency: country.currencies ? Object.values(country.currencies)[0].name : 'Brak danych'
    });
  } catch (error) {
    res.status(404).json({ error: 'Kraj nie znaleziony' });
  }
});

// 2. Testowy endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serwer działa!' });
});

// ========== BAZA DANYCH W PAMIĘCI ==========
let wishlist = [];
let disliked = [];

// 3. Dodaj do wishlisty
app.post('/api/wishlist', (req, res) => {
  const country = req.body;
  if (!wishlist.find(c => c.name === country.name)) {
    wishlist.push(country);
  }
  res.json({ wishlist });
});

// 4. Dodaj do disliked
app.post('/api/disliked', (req, res) => {
  const country = req.body;
  if (!disliked.find(c => c.name === country.name)) {
    disliked.push(country);
  }
  res.json({ disliked });
});

// 5. Pobierz zapisane
app.get('/api/saved', (req, res) => {
  res.json({ wishlist, disliked });
});

// 6. Usuń kraj
app.delete('/api/country/:name', (req, res) => {
  const name = req.params.name;
  wishlist = wishlist.filter(c => c.name !== name);
  disliked = disliked.filter(c => c.name !== name);
  res.json({ wishlist, disliked });
});

// ========== URUCHOM SERWER ==========
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend działa: http://localhost:${PORT}`);
  console.log('📌 Tłumaczenia włączone: nazwy, stolice, regiony');
});