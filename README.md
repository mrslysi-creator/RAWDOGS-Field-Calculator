# RAWDOGS Field Calculator

Free, open-source field calculator for the **WARDOGS** community, created by **RAWDOGS**.

The project is intended to provide the same calculation work across Windows desktop and a phone-friendly web/PWA version, with the source code, calibration data and documentation visible in this repository.

## Current builds

| Build | Platform | Status |
|---|---|---|
| **2.4** | Windows desktop | Current stable build |
| **0.1** | Phone / PWA | Preview build; browser/phone testing still in progress |

The Windows Build 2.4 application has been verified to open, populate correctly and use the RAWDOGS application icon.

## What the project contains

The repository is being organised around:

- the calculator source code
- the desktop user interface
- the phone/PWA user interface
- L81 and SPH-2 weapon/calibration data
- documentation explaining the calculations and calibration process
- Windows release builds
- phone/PWA release files

> **Source import status:** the public repository structure is now being prepared. The original Build 2.4 and PWA archives are being imported without changing the working Build 2.4 application.

## Downloads

Windows and phone/PWA packages will be published through the repository's **Releases** area as release assets.

The source itself will remain browsable in the normal repository folders.

## Planned repository layout

```text
src/
  calculator/
  ui/
  launcher/

weapons/
  l81/
  sph2/

assets/
docs/
builds/
```

## Phone / PWA

The phone version is designed to work as a Progressive Web App (PWA). Once the public web build is enabled, users will be able to open it in a mobile browser and add it to their home screen.

Offline support is intended after the first successful load, subject to final PWA testing.

## Licence

Project code is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See [LICENSE](LICENSE).

That licence allows people to study, run, modify and redistribute the code under the terms of the AGPL-3.0. It does **not** transfer ownership of the RAWDOGS name, logos or original branding. See [TRADEMARKS.md](TRADEMARKS.md).

## Project status

This repository is being prepared for public distribution. Build 2.4 remains the current stable Windows reference build while the repository source import and PWA publication are completed.
