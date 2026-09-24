# Source provenance

This repository was assembled from the preserved RAWDOGS Field Calculator builds.

## Windows Build 2.4

The preserved Windows package contains the finished EXE, RAWDOGS icon, shortcut scripts, build notes and checksums.

The calculator web files embedded in the Build 2.4 EXE were recovered and published as:

- `src/desktop/index.html`
- `src/desktop/js/app.js`
- `src/shared/engine.js`
- `weapons/l81.js`
- `weapons/sph2.js`

The preserved package did not contain the original Go source for the small Windows launcher wrapper, so that wrapper is documented as a compiled reference rather than represented as recovered source.

## Phone/PWA Build 0.1

The editable phone build is published under `pwa/`.

Its copies of `weapons/l81.js`, `weapons/sph2.js` and `js/engine.js` were verified against the corresponding files recovered from Windows Build 2.4 and matched byte-for-byte.

Both interfaces therefore use the same calculation engine and the same L81/SPH-2 calibration data.

## Stable Windows checksums

The preserved Build 2.4 checksum file is retained at:

`builds/windows/2.4/SHA256.txt`

That file is the reference for checking the original stable Windows EXE and icon.
