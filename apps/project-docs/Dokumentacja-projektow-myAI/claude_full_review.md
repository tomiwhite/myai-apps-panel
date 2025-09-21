# Rekomendacje Claude – Faza 2 i wyżej

## FAZA 2: Przenoszenie plików do odpowiednich kategorii

- Przenieś pliki do nowych folderów tematycznych:
  - `app_1.js` → `tools/`
  - `chart_script.py`, `chart_script_1.py` → `presentations/`
  - `przewodnik-organizacji-aplikacji.md` → `docs/`
  - `chart.png`, `flowchart.png` → `docs/`

Przykład polecenia (z zachowaniem historii git):
```bash
git mv app_1.js tools/app_1.js
git mv chart_script.py presentations/chart_script.py
git mv chart_script_1.py presentations/chart_script_1.py
git mv przewodnik-organizacji-aplikacji.md docs/przewodnik-organizacji-aplikacji.md
git mv chart.png docs/chart.png
git mv flowchart.png docs/flowchart.png
```

## FAZA 3: Aktualizacja dokumentacji i zatwierdzenie zmian

- Zaktualizuj `README.md` oraz inne przewodniki, aby odzwierciedlały nową strukturę katalogów.
- Dodaj sekcję o nowych folderach: `docs/`, `tools/`, `presentations/`, `tests/`.
- Przykład sekcji w README:

```markdown
## Struktura katalogów

- `apps/` – aplikacje AI
- `dashboard/` – panel główny
- `docs/` – dokumentacja, przewodniki, diagramy
- `tools/` – narzędzia, skrypty pomocnicze
- `presentations/` – skrypty i materiały prezentacyjne
- `tests/` – testy automatyczne
```

- Zatwierdź zmiany w repozytorium:
```bash
git add .
git commit -m "Reorganizacja struktury katalogów, aktualizacja dokumentacji"
git push
```

---

## Dalsze rekomendacje automatyzacji i optymalizacji

### 1. Automatyzacja deploymentu (CI/CD)
- Dodaj workflow GitHub Actions `.github/workflows/deploy.yml`:
```yaml
name: Deploy Panel AI
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
```
- Alternatywnie: konfiguracja Netlify lub innego hostingu statycznego.

### 2. Wersjonowanie aplikacji i backupy
- Każda aplikacja powinna mieć pole `version` w `meta.json`.
- Przed każdą modyfikacją aplikacji wykonywać backup folderu (np. do `backups/`).
- Przykładowy skrypt backupu:
```python
import shutil, os, datetime
src = 'apps/narzędzia/kalkulator-bmi'
dst = f'backups/kalkulator-bmi_{datetime.datetime.now().strftime("%Y%m%d_%H%M%S")}'
shutil.copytree(src, dst)
```
- Rozważyć system historii zmian i rollback (np. przez git tagi lub dedykowany folder `history/`).

### 3. Środowisko deweloperskie
- Wdrożenie hot reload (np. `live-server`, `vite`, `webpack-dev-server`).
- Linting i formatowanie kodu (np. ESLint, Prettier, Black dla Pythona).
- Pre-commit hooks (np. Husky, lint-staged):
```bash
npx husky-init && npm install
npx husky add .husky/pre-commit "npm run lint"
```

### 4. Monitoring i analytics
- Dodanie prostego logowania aktywności użytkowników (np. do pliku lub konsoli).
- Śledzenie użycia aplikacji (np. Google Analytics, Matomo, własny backend).
- Dashboard z metrykami (np. liczba uruchomień aplikacji, popularność, błędy).

---

**Wskazówka:** Każdą fazę i rekomendację można wdrażać etapami, testując po drodze stabilność panelu i automatyzacji.
