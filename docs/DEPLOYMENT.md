# Web deployment

The repository contains the preserved calculator source under `src/`, `weapons/` and `pwa/`.

The GitHub Pages workflow publishes:

- the phone/PWA build at the Pages root;
- a desktop browser build at `/desktop/`.

## Temporary deployment artwork

The preserved PWA ZIP includes PNG camouflage and RAWDOGS icon files, but the current ChatGPT-to-GitHub source connector cannot send binary release/assets directly.

To avoid altering the recovered source, the workflow leaves the repository source unchanged and generates small SVG fallback artwork only in the deployed Pages artifact.

When the original PNG assets are added to the repository, the workflow can be changed to publish those exact files instead.

## Calculator integrity

The deployment copies the recovered/shared JavaScript calculator engine and L81/SPH-2 data. The fallback artwork does not change range, bearing or MIL calculations.
