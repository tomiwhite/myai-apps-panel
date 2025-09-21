# Panel AI Apps – Automatyzacja

## Szybki start

1. **Tworzenie nowej aplikacji AI**

  Użyj skryptu:
  ```bash
  python scripts/create_category_and_app.py <kategoria> <nazwa_aplikacji> "Tytuł aplikacji" "Opis aplikacji"
  ```
  Przykład:
  ```bash
  python scripts/create_category_and_app.py narzędzia kalkulator-bmi "Kalkulator BMI" "Prosty kalkulator wskaźnika masy ciała."
  ```
  - Skrypt automatycznie utworzy folder kategorii (jeśli nie istnieje), skopiuje template, zaktualizuje meta.json.

2. **Aktualizacja listy aplikacji w panelu**

  Po dodaniu nowych aplikacji uruchom:
  ```bash
  python scripts/generate_apps_json.py
  ```
  - Skrypt przeskanuje wszystkie aplikacje i wygeneruje aktualny plik `dashboard/apps.json`.

3. **Struktura katalogów**

  - `apps/<kategoria>/<nazwa_aplikacji>/` – foldery aplikacji AI
  - `app_template/` – szablon do kopiowania
  - `dashboard/apps.json` – lista aplikacji ładowana przez panel
  - `scripts/` – narzędzia automatyzujące

4. **Meta-dane aplikacji**

  Każda aplikacja posiada plik `meta.json` z polami:
  - `title`, `description`, `category`, `status`, `version`, `last_modified`, `thumbnail`

5. **Dodawanie nowych kategorii**

  Kategorie tworzą się automatycznie przy dodawaniu aplikacji przez skrypt.

---

## Dalsza automatyzacja
- Możesz rozbudowywać template, skrypty i panel według własnych potrzeb.
- Po każdej zmianie uruchom ponownie `generate_apps_json.py`, by panel widział nowe aplikacje.
# Panel Zarządzania Aplikacjami HTML

✅ **Status struktury: KOMPLETNA** - Wszystkie katalogi utworzone zgodnie z dokumentacją

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
git clone https://github.com/tomiwhite/myai-apps-panel.git
cd myai-apps-panel
# Instalacja zależności
npm install
# Uruchomienie dev serwera
npm run dev
```

### Praca z Dyad
1. Otwórz Dyad i połącz z tym repozytorium
2. Użyj `npm run dev` dla live preview
3. Edytuj przez chat AI i sync z GitHub

## 📁 Struktura projektu (GOTOWA)
✅ **Struktura katalogów jest kompletna i spójna z dokumentacją**

```
myai-apps-panel/
├── package.json              # Konfiguracja Node.js/NPM
├── README.md                 # Dokumentacja (ten plik)
├── .gitignore               # Pliki ignorowane przez Git
├── index.html               # Główny dashboard
├── style.css                # Style aplikacji
├── app.js                   # Logika JavaScript
├── apps/                    # ✅ Katalog aplikacji
│   ├── index.json           # ✅ Indeks wszystkich aplikacji
│   ├── example-app/         # ✅ Przykładowa aplikacja
│   │   └── index.html       # ✅ Demo aplikacja HTML
│   └── ...                  # Inne aplikacje
├── assets/                  # ✅ Zasoby statyczne
│   ├── icons/               # ✅ Ikony SVG (.gitkeep)
│   ├── images/              # ✅ Obrazy i miniatury (.gitkeep)
│   └── data/                # ✅ Pliki JSON z danymi (.gitkeep)
└── docs/                    # Dokumentacja dodatkowa
    ├── API.md               # Dokumentacja API
    ├── DEPLOYMENT.md        # Przewodnik wdrożenia
    └── CONTRIBUTING.md      # Przewodnik kontrybutorów
```

## 📋 Status implementacji
- ✅ Struktura katalogów
- ✅ Pliki .gitkeep dla pustych folderów
- ✅ Przykładowa aplikacja (apps/example-app/)
- ✅ Indeks aplikacji (apps/index.json)
- ✅ Dokumentacja zaktualizowana
- 🔄 Dashboard (index.html) - do implementacji
- 🔄 Style (style.css) - do implementacji
- 🔄 Logika JS (app.js) - do implementacji

---
**Repozytorium jest gotowe do rozbudowy!** 🚀
