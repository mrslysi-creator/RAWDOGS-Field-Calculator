# Web deployment

The repository publishes two web applications through GitHub Pages:

- **Phone / PWA** — https://mrslysi-creator.github.io/RAWDOGS-Field-Calculator/
- **Desktop browser** — https://mrslysi-creator.github.io/RAWDOGS-Field-Calculator/desktop/

Deployment is automated by `.github/workflows/pages.yml`, which copies the source from `pwa/` and `src/desktop/`, the shared engine from `src/shared/`, and calibration profiles from `weapons/`.

The original blue, red and green camouflage tiles and RAWDOGS PNG icons are part of the `pwa/assets/` source directory. Both web applications deploy those files directly.

The PWA's `sw.js` service worker supports offline caching on compatible browsers. The desktop web application uses the same verified coordinate and elevation mathematics.
