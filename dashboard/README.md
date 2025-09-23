To jest główny panel (dashboard) do zarządzania i uruchamiania aplikacji AI. Pliki: app.js, index.html, style.css.

# Dashboard publikacja na GitHub Pages

## Publikacja

1. Upewnij się, że wszystkie pliki aplikacji oraz dashboardu znajdują się w repozytorium.
2. Po każdym commicie do gałęzi `main` dashboard zostanie automatycznie opublikowany na GitHub Pages dzięki workflow w `.github/workflows/deploy.yml`.
3. Strona będzie dostępna pod adresem:
   - `https://<twoj-login-github>.github.io/<repozytorium>/` (np. https://tomiwhite.github.io/myai-apps-panel/)

## Struktura
- Pliki dashboardu: `dashboard/`
- Aplikacje: `apps/`

## Dodawanie aplikacji
- Dodaj pliki aplikacji do odpowiedniego folderu w `apps/`.
- Zaktualizuj `dashboard/apps.json` jeśli dodajesz nową aplikację lub kategorię.

## Uwaga
- Wszystkie ścieżki w `apps.json` muszą być względne względem katalogu głównego repozytorium.
- Jeśli aplikacja nie wyświetla się poprawnie, sprawdź czy jej folder i plik `index.html` istnieją.