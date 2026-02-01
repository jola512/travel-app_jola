import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const polishToEnglish = {
  // Twoje kraje
  'niemcy': 'germany',
  'francja': 'france',
  'włochy': 'italy',
  'wlochy': 'italy',
  'hiszpania': 'spain',
  'polska': 'poland',
  'usa': 'united states',
  'stany zjednoczone': 'united states',
  'ameryka': 'united states',
  'japonia': 'japan',
  'brazylia': 'brazil',
  'kanada': 'canada',
  'australia': 'australia',
  'grecja': 'greece',
  'turcja': 'turkey',
  'egipt': 'egypt',
  'meksyk': 'mexico',
  'indie': 'india',
  'chiny': 'china',
  'korea południowa': 'south korea',
  'korea poludniowa': 'south korea',
  'tajlandia': 'thailand',
  'szwecja': 'sweden',
  'norwegia': 'norway',
  'holandia': 'netherlands',
  'szwajcaria': 'switzerland',
  'austria': 'austria',
  'portugalia': 'portugal',
  'czechy': 'czechia',
  'czech': 'czechia',
  'wegry': 'hungary',
  'argentyna': 'argentina',
  'chile': 'chile',
  'rpa': 'south africa',
  'republika południowej afryki': 'south africa',
  'republika poludniowej afryki': 'south africa',
  'nowa zelandia': 'new zealand',
}

const regionTranslations = {
  'Europe': 'Europa',
  'Asia': 'Azja',
  'Africa': 'Afryka',
  'Americas': 'Ameryka',
  'Oceania': 'Oceania',
  'Antarctic': 'Antarktyda',
  'North America': 'Ameryka Północna',
  'South America': 'Ameryka Południowa',
  'Central America': 'Ameryka Środkowa',
  'Middle East': 'Bliski Wschód',
  'Southeast Asia': 'Azja Południowo-Wschodnia',
  'Eastern Europe': 'Europa Wschodnia',
  'Western Europe': 'Europa Zachodnia',
  'Northern Europe': 'Europa Północna',
  'Southern Europe': 'Europa Południowa',
};

const translateRegion = (englishRegion) => {
  return regionTranslations[englishRegion] || englishRegion;
};


// Funkcja tłumacząca
const translateToEnglish = (polishName) => {
  const lowerName = polishName.toLowerCase().trim();
  return polishToEnglish[lowerName] || polishName; // Jeśli nie ma tłumaczenia, użyj oryginału
};

// Mapowanie ID na nazwy API
const apiNameMapping = {
  'usa': 'united states',
  'southkorea': 'south korea',
  'southafrica': 'south africa',
  'newzealand': 'new zealand',
};

const getApiName = (countryId) => {
  return apiNameMapping[countryId] || countryId;
};

const countryList = [
  { id: 'germany', name: 'Niemcy'},
  { id: 'france', name: 'Francja'},
  { id: 'italy', name: 'Włochy'},
  { id: 'spain', name: 'Hiszpania'},
  { id: 'poland', name: 'Polska'},
  { id: 'usa', name: 'USA'},
  { id: 'japan', name: 'Japonia'},
  { id: 'brazil', name: 'Brazylia'},
  { id: 'canada', name: 'Kanada'},
  { id: 'australia', name: 'Australia'},
  { id: 'greece', name: 'Grecja'},
  { id: 'turkey', name: 'Turcja'},
  { id: 'egypt', name: 'Egipt'},
  { id: 'mexico', name: 'Meksyk'},
  { id: 'india', name: 'Indie'},
  { id: 'china', name: 'Chiny'},
  { id: 'southkorea', name: 'Korea Południowa'},
  { id: 'thailand', name: 'Tajlandia'},
  { id: 'sweden', name: 'Szwecja'},
  { id: 'norway', name: 'Norwegia'},
  { id: 'netherlands', name: 'Holandia'},
  { id: 'switzerland', name: 'Szwajcaria'},
  { id: 'austria', name: 'Austria'},
  { id: 'portugal', name: 'Portugalia'},
  { id: 'czechia', name: 'Czechy'},
  { id: 'hungary', name: 'Węgry'},
  { id: 'argentina', name: 'Argentyna'},
  { id: 'chile', name: 'Chile'},
  { id: 'southafrica', name: 'RPA'},
  { id: 'newzealand', name: 'Nowa Zelandia'},
];

// UŻYJ BEZPOŚREDNIEGO URL - proxy nie działa
const API_URL = 'http://localhost:5000'

// Współrzędne dla popularnych krajów
const countryCoordinates = {
  germany: '13.404954,52.520008',
  france: '2.352222,48.856613',
  italy: '12.496366,41.902782',
  spain: '-3.703790,40.416775',
  poland: '21.012229,52.229676',
  usa: '-77.036870,38.907192',
  japan: '139.691706,35.689487',
  brazil: '-47.9292,-15.7801',
  canada: '-75.6972,45.4215',
  australia: '149.1286,-35.2820',
  greece: '23.7275,37.9838',
  turkey: '32.8597,39.9334',
  egypt: '31.2357,30.0444',
  mexico: '-99.1332,19.4326',
  india: '77.2090,28.6139',
  china: '116.4074,39.9042',
  southkorea: '126.9780,37.5665',
  thailand: '100.5018,13.7563',
  sweden: '18.0686,59.3293',
  norway: '10.7522,59.9139',
  netherlands: '4.9041,52.3676',
  switzerland: '7.4474,46.9480',
  austria: '16.3738,48.2082',
  portugal: '-9.1393,38.7223',
  czechia: '14.4378,50.0755',
  hungary: '19.0402,47.4979',
  argentina: '-58.4173,-34.6118',
  chile: '-70.6483,-33.4489',
  southafrica: '28.1871,-25.7460',
  newzealand: '174.7762,-41.2865',
};

// Funkcja zwracająca współrzędne
const getCountryCoords = (countryName) => {
  const key = countryName.toLowerCase();
  return countryCoordinates[key] || '0,0';
};

function App() {
  const [countryName, setCountryName] = useState('germany')
  const [countryData, setCountryData] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [disliked, setDisliked] = useState([])
  const [status, setStatus] = useState('✅ Backend działa!')

const fetchCountry = async () => {
  if (!countryName.trim()) {
    alert('Wpisz nazwę kraju!')
    return
  }
  
  try {
    // Proste tłumaczenie bez sprawdzania listy
    const apiQuery = translateToEnglish(countryName);
    console.log('Wpisano:', countryName, '-> Szukam:', apiQuery);
    
    const response = await axios.get(`${API_URL}/api/country/${encodeURIComponent(apiQuery)}`)
    setCountryData(response.data)
    setStatus(`✅ Znaleziono: ${response.data.name}`)
    
  } catch (error) {
    console.error('Błąd:', error);
    setStatus('❌ Kraj nie znaleziony! Spróbuj: Niemcy, Francja, Włochy, Japonia')
  }
}

const searchCountryByName = async (polishName, countryId) => {
  console.log('Kliknięto przycisk:', polishName, 'ID:', countryId);
  setCountryName(polishName);
  
  try {
    const apiQuery = getApiName(countryId);
    console.log('API Query:', apiQuery);
    console.log('URL:', `${API_URL}/api/country/${encodeURIComponent(apiQuery)}`);
    
    const response = await axios.get(`${API_URL}/api/country/${encodeURIComponent(apiQuery)}`)
    console.log('Odpowiedź:', response.data);
    
    setCountryData(response.data)
    setStatus(`✅ Znaleziono: ${response.data.name}`)
  } catch {
    setStatus(`❌ Błąd dla: ${polishName}`)
  }
}

  // 2. Załaduj zapisane dane
  const loadSaved = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/saved`)
      setWishlist(response.data.wishlist || [])
      setDisliked(response.data.disliked || [])
    } catch (error) {
      console.log('Ładowanie danych...')
    }
  }

  // 3. Dodaj do wishlisty
  const addToWishlist = async () => {
    if (!countryData) return
    try {
      await axios.post(`${API_URL}/api/wishlist`, countryData)
      loadSaved()
      alert(`✅ ${countryData.name} dodano do "Chcę pojechać"!`)
    } catch (error) {
      console.log('Błąd:', error)
    }
  }

  // 4. Dodaj do disliked
  const addToDisliked = async () => {
    if (!countryData) return
    try {
      await axios.post(`${API_URL}/api/disliked`, countryData)
      loadSaved()
      alert(`👎 ${countryData.name} dodano do "Nie podoba mi się"`)
    } catch (error) {
      console.log('Błąd:', error)
    }
  }

  // 5. Usuń kraj
  const removeCountry = async (name) => {
    try {
      await axios.delete(`${API_URL}/api/country/${name}`)
      loadSaved()
    } catch (error) {
      console.log('Błąd:', error)
    }
  }

  // Przy starcie
  useEffect(() => {
    loadSaved()
    fetchCountry() // Automatycznie pokaż Niemcy
  }, [])

  return (
    <div className="app">
      <header>
        <h1>🌍 Travel Wishlist</h1>
        <p>{status}</p>
      </header>

      <main>
{/* WYSZUKIWANIE - NOWY DESIGN */}
<div className="search-container">
  <div className="search-card">
    <div className="search-header">
      <div className="search-icon">🔍</div>
      <h3 className="search-title">Wyszukiwarka krajów</h3>
      <div className="search-icon">🌎</div>
    </div>
    
    <p className="search-subtitle">
      Wpisz nazwę kraju po polsku lub angielsku, aby zobaczyć informacje
    </p>
    
    <div className="search-wrapper">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Przykład: Niemcy, Francja, Japonia, USA..."
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchCountry()}
        />
        <div className="input-decoration"></div>
      </div>
      
      <button className="search-btn" onClick={fetchCountry}>
        <span className="btn-icon">🚀</span>
        <span className="btn-text">Szukaj</span>
      </button>
    </div>
    
    <div className="search-tips">
      <span className="tip-icon">💡</span>
      <span className="tip-text">Możesz też kliknąć na kraj poniżej</span>
    </div>
  </div>
</div>

        {/* PRZYCISKI KRAJÓW */}
{/* PRZYCISKI KRAJÓW Z POLSKIMI NAZWAMI */}
<div className="quick-buttons">
  <div className="section-title">
    <span className="title-icon">🌎</span>
    <h3>Szybki wybór krajów</h3>
    <span className="title-icon">🗺️</span>
  </div>
  
  <div className="country-categories">
    {/* EUROPA */}
    <div className="category">
      <h4 className="category-title">🌏 Europa</h4>
      <div className="category-buttons">
        {countryList.filter(c => 
          ['germany', 'france', 'italy', 'spain', 'poland', 'greece', 
           'sweden', 'norway', 'netherlands', 'switzerland', 'austria', 
           'portugal', 'czechia', 'hungary'].includes(c.id)
        ).map(country => (
          <button
            key={country.id}
            className="country-btn"
            onClick={() => {
              searchCountryByName(country.name, country.id);
            }}
            title={`Kliknij aby zobaczyć ${country.name}`}
          >
            {country.emoji} {country.name}
          </button>
        ))}
      </div>
    </div>

    {/* AZJA */}
    <div className="category">
      <h4 className="category-title">🌏 Azja & Oceania</h4>
      <div className="category-buttons">
        {countryList.filter(c => 
          ['japan', 'china', 'india', 'southkorea', 'thailand', 
           'australia', 'newzealand'].includes(c.id)
        ).map(country => (
          <button
            key={country.id}
            className="country-btn"
            onClick={() => {
              searchCountryByName(country.name, country.id)
            }}
          >
            {country.emoji} {country.name}
          </button>
        ))}
      </div>
    </div>

    {/* AMERYKA */}
    <div className="category">
      <h4 className="category-title">🌎 Ameryka</h4>
      <div className="category-buttons">
        {countryList.filter(c => 
          ['usa', 'canada', 'brazil', 'mexico', 'argentina', 'chile'].includes(c.id)
        ).map(country => (
          <button
            key={country.id}
            className="country-btn"
            onClick={() => {
              searchCountryByName(country.name, country.id)
            }}
          >
            {country.emoji} {country.name}
          </button>
        ))}
      </div>
    </div>

    {/* AFRYKA */}
    <div className="category">
      <h4 className="category-title">🌍 Afryka</h4>
      <div className="category-buttons">
        {countryList.filter(c => 
          ['egypt', 'southafrica', 'turkey'].includes(c.id)
        ).map(country => (
          <button
            key={country.id}
            className="country-btn"
            onClick={() => {
              searchCountryByName(country.name, country.id)
            }}
          >
            {country.emoji} {country.name}
          </button>
        ))}
      </div>
    </div>
  </div>
</div>


        {/* WYNIK WYSZUKIWANIA */}
        {countryData && (
          <div className="country-card">
            <img src={countryData.flag} alt={`Flaga ${countryData.name}`} />
            <h3>{countryData.name}</h3>
            <div className="country-info">
              <p><strong>🏛️ Stolica:</strong> {countryData.capital}</p>
              <p><strong>👥 Populacja:</strong> {countryData.population}</p>
              <p><strong>🗺️ Region:</strong> {countryData.region}</p>
            </div>


          <div className="map-container">
            <h4>🗺️ Lokalizacja na mapie:</h4>
            <div className="google-map">
              <img 
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${getCountryCoords(countryData.name)}&zoom=5&size=400x250&markers=color:red%7Csize:mid%7C${getCountryCoords(countryData.name)}&maptype=roadmap&scale=2&key=AIzaSyCqPwYqCqPwYqCqPwYqCqPwYqCqPwYqCqPw`}
              alt={`Mapa ${countryData.name}`}
              className="static-map"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://maps.googleapis.com/maps/api/staticmap?center=${countryData.name}&zoom=3&size=400x250&maptype=roadmap&scale=1`;
              }}
           />
              <div className="map-info">
                <p>
                  <strong>📍 Stolica:</strong> {countryData.capital}
                </p>
                <p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${countryData.capital}+${countryData.name}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="map-link"
                  >
                    🔍 Otwórz w Google Maps
                  </a>
                </p>
              </div>
            </div>
          </div>
{/* ========== KONIEC GOOGLE MAPS ========== */}
    
            
            <div className="actions">
              <button className="wishlist-btn" onClick={addToWishlist}>
                ❤️ Chcę pojechać
              </button>
              <button className="dislike-btn" onClick={addToDisliked}>
                💔 Nie podoba mi się
              </button>
            </div>
          </div>
        )}

        {/* STATYSTYKI */}
<div className="stats-widget">
  <h3>📊 Statystyki podróży</h3>
  <div className="stats-grid">
    <div className="stat-item">
      <span className="stat-number">{wishlist.length}</span>
      <span className="stat-label">Kraje do odwiedzenia</span>
    </div>
    <div className="stat-item">
      <span className="stat-number">{disliked.length}</span>
      <span className="stat-label">Nieinteresujące</span>
    </div>
    <div className="stat-item">
      <span className="stat-number">{countryList.length}</span>
      <span className="stat-label">Dostępnych krajów</span>
    </div>
    <div className="stat-item">
      <span className="stat-number">
        {wishlist.length > 0 ? Math.round((wishlist.length / countryList.length) * 100) : 0}%
      </span>
      <span className="stat-label">Postęp</span>
    </div>
  </div>
</div>

        {/* LISTY */}
        <div className="lists">
          <div className="list wishlist">
            <h2>❤️ Chcę pojechać ({wishlist.length})</h2>
            {wishlist.length === 0 ? (
              <p className="empty">Brak krajów na liście. Dodaj pierwszy!</p>
            ) : (
              wishlist.map(country => (
                <div key={country.name} className="list-item">
                  <span>
                    <strong>{country.name}</strong>
                    <small>{country.capital}</small>
                  </span>
                  <button 
                    className="delete-btn"
                    onClick={() => removeCountry(country.name)}
                    title="Usuń"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="list disliked">
            <h2>💔 Nie podoba mi się ({disliked.length})</h2>
            {disliked.length === 0 ? (
              <p className="empty">Brak krajów na liście</p>
            ) : (
              disliked.map(country => (
                <div key={country.name} className="list-item">
                  <span>
                    <strong>{country.name}</strong>
                    <small>{country.capital}</small>
                  </span>
                  <button 
                    className="delete-btn"
                    onClick={() => removeCountry(country.name)}
                    title="Usuń"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer>
        <p>Dane z: restcountries.com | Backend: http://localhost:5000</p>
      </footer>
    </div>
  )
}

export default App