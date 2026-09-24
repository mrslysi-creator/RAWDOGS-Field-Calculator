# RAWDOGS Field Calculator

Free, open-source field calculator for the **WARDOGS** community, created by **RAWDOGS**.

The project provides the same verified calculation engine and weapon calibration data across Windows, desktop web and a phone-friendly Progressive Web App, with the calculator source and data visible in this repository.

## Use / download

### Phone app / PWA

**Open the phone app:**  
https://mrslysi-creator.github.io/RAWDOGS-Field-Calculator/

On a supported phone browser, use **Add to Home Screen** / **Install App**. After the initial successful load the PWA is designed to work offline.

**Download the preserved Phone/PWA Build 0.1 ZIP:**  
https://github.com/mrslysi-creator/RAWDOGS-Field-Calculator/raw/refs/heads/main/downloads/RAWDOGS_Field_Calculator_Phone_PWA_Build_0_1.zip

### Desktop web app

**Open the desktop browser version:**  
https://mrslysi-creator.github.io/RAWDOGS-Field-Calculator/desktop/

### Windows Build 2.4

**Download the full stable Windows Build 2.4 ZIP:**  
https://github.com/mrslysi-creator/RAWDOGS-Field-Calculator/raw/refs/heads/main/downloads/RAWDOGS_Field_Calculator_Build_2_4_Windows.zip

**Download the standalone Build 2.4 EXE:**  
https://github.com/mrslysi-creator/RAWDOGS-Field-Calculator/raw/refs/heads/main/downloads/RAWDOGS%20Field%20Calculator.exe

The files above are the preserved originals, not rebuilt substitutes.

| File | SHA-256 |
|---|---|
| Windows Build 2.4 ZIP | `92935616dd6fe8bd3e928efa8bc82144cf46915ce53ec7b2e4e8a953493d2fb8` |
| Windows Build 2.4 EXE | `aabf819039ef62a2e20051c85f7cbd1d08bb78b7b7997def17f3687be1d3cbe7` |
| Phone/PWA Build 0.1 ZIP | `a66f6835dd7ac68f128cfc1b67c9eb5121cd0facc8a167f82861e0eb446a46be` |

## Current builds

| Build | Platform | Status |
|---|---|---|
| **2.4** | Windows desktop | Current stable reference build |
| **0.1** | Phone / PWA | Published through GitHub Pages |
| **Web** | Desktop browser | Published through GitHub Pages |

The Windows Build 2.4 application was verified to open and populate correctly and to use the RAWDOGS application icon.

## Source in this repository

The preserved Windows Build 2.4 executable contains its HTML/JavaScript calculator application internally. Those embedded calculator files were recovered from the preserved executable and committed under:

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
downloads/          preserved downloadable builds
builds/windows/2.4/ Build 2.4 notes, shortcut scripts and checksums
docs/               installation and calculation documentation
.github/workflows/  GitHub Pages deployment
```

## Phone / PWA notes

The PWA includes the web-app manifest and service worker required for installation/offline use. The live deployment restores the original RAWDOGS PNG icon and camouflage artwork directly from the preserved Phone/PWA Build 0.1 package.

The PWA intentionally does **not** include the later experimental SPH-2 pitch/terrain compensation work; that remains future work after controlled testing.

## Licence

Project code is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See [LICENSE](LICENSE).

The AGPL allows people to study, run, modify and redistribute the code under its terms, and requires corresponding source to remain available when modified versions are distributed or provided as a network service.

The **RAWDOGS** name, logos, badges and original branding are treated separately from the software licence. See [TRADEMARKS.md](TRADEMARKS.md).

## Provenance

See [SOURCE_PROVENANCE.md](SOURCE_PROVENANCE.md) for the recovery/source relationship between Windows Build 2.4 and Phone/PWA Build 0.1.
