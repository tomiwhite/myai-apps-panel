# Panel Zarządzania Aplikacjami HTML

## 📋 Opis
Centralny dashboard do organizacji i zarządzania aplikacjami HTML z pełną integracją AI (Dyad) i GitHub.

## ✨ Funkcje
- 🔍 **Wyszukiwarka aplikacji** - szybkie znajdowanie projektów
- 🏷️ **Kategoryzacja** - organizacja według typu aplikacji
- 🎛️ **Filtry zaawansowane** - status, kategoria, data, autor
- ➕ **Dodawanie aplikacji** - prosty formularz z walidacją
- ✏️ **Edycja metadanych** - aktualizacja informacji o aplikacjach
- 📊 **Export/Import** - JSON, CSV, backup danych
- 📱 **Responsywny design** - działa na wszystkich urządzeniach
- 💾 **LocalStorage** - zachowanie stanu między sesjami

## 🚀 Quick Start

### Lokalne uruchomienie
```bash
# Klonowanie repo
git clone https://github.com/your-username/panel-zarzadzania-html.git
cd panel-zarzadzania-html

# Instalacja zależności
npm install

# Uruchomienie dev serwera
npm run dev
```

### Praca z Dyad
1. Otwórz Dyad i połącz z tym repozytorium
2. Użyj `npm run dev` dla live preview
3. Edytuj przez chat AI i sync z GitHub

## 📁 Struktura projektu
```
panel-zarzadzania-html/
├── package.json          # Konfiguracja Node.js/NPM
├── README.md             # Dokumentacja (ten plik)
├── .gitignore           # Pliki ignorowane przez Git
├── index.html           # Główny dashboard
├── style.css            # Style aplikacji
├── app.js               # Logika JavaScript
├── apps/                # Katalog aplikacji
│   ├── index.json       # Indeks wszystkich aplikacji
│   ├── example-app/     # Przykładowa aplikacja
│   └── ...              # Inne aplikacje
├── assets/              # Zasoby statyczne
│   ├── icons/           # Ikony SVG
│   ├── images/          # Obrazy i miniatury
│   └── data/            # Pliki JSON z danymi
└── docs/                # Dokumentacja dodatkowa
    ├── API.md           # Dokumentacja API
    ├── DEPLOYMENT.md    # Przewodnik wdrożenia
    └── CONTRIBUTING.md  # Przewodnik kontrybutorów
```

## 🔧 Konfiguracja dla AI (Dyad)

### Struktura kompatybilna z AI
- **Modularna architektura** - łatwa do analizy i modyfikacji
- **Komentarze AI-friendly** - szczegółowe opisy funkcji
- **Standardowe nazewnictwo** - czytelne dla AI
- **JSON Schema** - ustandaryzowane struktury danych

### Przykłady promptów dla AI
```
"Dodaj funkcję importu aplikacji z pliku ZIP"
"Stwórz widok listy obok siatki"
"Dodaj kategorię 'E-commerce' i przykładową aplikację"
"Zaimplementuj dark mode z przełącznikiem"
```

## 📊 Struktura danych aplikacji
```json
{
  "id": 1,
  "name": "Nazwa Aplikacji",
  "description": "Szczegółowy opis funkcjonalności",
  "category": "produktywność|finanse|gry|narzędzia|biznes|edukacja",
  "tags": ["tag1", "tag2", "tag3"],
  "url": "apps/nazwa-aplikacji/index.html",
  "status": "aktywna|nieaktywna|w-rozwoju|archiwalna",
  "created_date": "2025-01-01",
  "last_modified": "2025-01-01",
  "thumbnail": "nazwa-ikony.svg",
  "author": "Autor aplikacji",
  "version": "1.0.0",
  "technologies": ["HTML", "CSS", "JavaScript"],
  "size": "45KB"
}
```

## 🔄 Workflow z GitHub
1. **Rozwój lokalny** - edytuj pliki lokalnie lub przez Dyad
2. **Commit changes** - zapisz zmiany w Git
3. **Push to GitHub** - synchronizuj z repozytorium
4. **GitHub Pages** - automatyczna publikacja (opcjonalnie)
5. **Pull updates** - pobierz zmiany od innych współtwórców

## 🛠️ Technologie
- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript ES6+
- **Storage**: LocalStorage API, JSON
- **Icons**: Font Awesome 6.4, SVG
- **Dev Tools**: Live Server, HTTP Server
- **Deployment**: GitHub Pages, Netlify, Vercel
- **AI**: Dyad compatible, GPT-friendly prompts

## 📈 Plan rozwoju
- [ ] Integracja z GitHub API (automatyczny import repo)
- [ ] Drag & drop upload aplikacji
- [ ] Live preview aplikacji w modal
- [ ] Collaborative editing
- [ ] Advanced analytics dashboard
- [ ] PWA support (offline mode)
- [ ] Dark/Light theme switcher
- [ ] Multi-language support

## 🤝 Wsparcie AI
Aplikacja została zaprojektowana z myślą o współpracy z AI:
- **Modularna struktura** ułatwia AI rozumienie i modyfikację kodu
- **Szczegółowe komentarze** pomagają AI w kontekście zmian
- **Standardowe wzorce** (MVC, Observer) znane AI
- **JSON schema** dla przewidywalnych struktur danych

## 📄 Licencja
MIT License - możesz swobodnie używać, modyfikować i dystrybuować.

## 🔗 Linki
- [Live Demo](https://your-username.github.io/panel-zarzadzania-html)
- [GitHub Repository](https://github.com/your-username/panel-zarzadzania-html)
- [Dyad Documentation](https://dyad.sh/docs)
- [Issues & Support](https://github.com/your-username/panel-zarzadzania-html/issues)
