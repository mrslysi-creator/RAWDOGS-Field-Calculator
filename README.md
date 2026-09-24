# RAWDOGS Field Calculator

Free, open-source field calculator for the **WARDOGS** community, created by **RAWDOGS**.

The project provides the same verified calculation engine and weapon calibration data across a Windows desktop build and a phone-friendly web/PWA build, with the calculator source and data visible in this repository.

## Current builds

| Build | Platform | Status |
|---|---|---|
| **2.4** | Windows desktop | Current stable reference build |
| **0.1** | Phone / PWA | Source imported; public phone deployment/testing is next |

The Windows Build 2.4 application was verified to open and populate correctly and to use the RAWDOGS application icon.

## Source now in this repository

The preserved Windows Build 2.4 executable contains its HTML/JavaScript calculator application internally. Those embedded files were recovered from the preserved Build 2.4 executable and committed under:

- `src/desktop/index.html`
- `src/desktop/js/app.js`
- `src/shared/engine.js`
- `weapons/l81.js`
- `weapons/sph2.js`

The phone/PWA source from the preserved Phone/PWA Build 0.1 archive is under `pwa/`.

The L81 data, SPH-2 data and shared calculation engine in the PWA archive were verified to be byte-for-byte identical to the corresponding calculator code embedded in Windows Build 2.4.

### Windows launcher source

The preserved Build 2.4 ZIP contains the finished Windows EXE, icon, shortcut scripts, checksums and build notes, but it does **not** contain the original Go source for the small Windows launcher wrapper that embeds/opens the calculator.

For that reason this repository does not pretend that wrapper source was recovered when it was not. The calculator itself is source-visible; the preserved Build 2.4 EXE remains the stable binary reference.

## Repository layout

```text
src/
  desktop/          desktop UI recovered from Build 2.4
  shared/           shared calculator engine

weapons/            verified L81 and SPH-2 calibration data
pwa/                phone/PWA source
builds/windows/2.4/ Build 2.4 notes, shortcut scripts and checksums
docs/               installation and calculation documentation
```

## Downloads

The preserved **Windows Build 2.4 ZIP** is the current stable Windows download reference.

Release-file publication is being completed separately from the source import. The checksums for the preserved EXE/icon are already recorded under `builds/windows/2.4/SHA256.txt`.

## Phone / PWA

The phone version is a Progressive Web App (PWA). Its source includes the web-app manifest and service worker so that, once published over HTTPS, a supported phone browser can install it to the home screen and use it offline after the initial successful load.

The PWA intentionally does **not** include the later experimental SPH-2 pitch/terrain compensation work; that remains future work after controlled testing.

## Licence

Project code is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See [LICENSE](LICENSE).

The AGPL allows people to study, run, modify and redistribute the code under its terms, and requires corresponding source to remain available when modified versions are distributed or provided as a network service.

The **RAWDOGS** name, logos, badges and original branding are treated separately from the software licence. See [TRADEMARKS.md](TRADEMARKS.md).

## Provenance

See [SOURCE_PROVENANCE.md](SOURCE_PROVENANCE.md) for the recovery/source relationship between Windows Build 2.4 and Phone/PWA Build 0.1.
