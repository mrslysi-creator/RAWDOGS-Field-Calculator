# RAWDOGS Field Calculator

**Free, open-source field calculator for the WARDOGS community.**

RAWDOGS Field Calculator provides fast manual fire-control calculations for in-game L81 mortar and SPH-2 artillery. Enter your firing position and target coordinates to calculate bearing, range and the available MIL elevation solution. All calculations use the project's game-specific calibration data.

## Open the calculator

| Version | Launch or download |
| --- | --- |
| **Phone / PWA** | [Open mobile calculator](https://mrslysi-creator.github.io/RAWDOGS-Field-Calculator/) |
| **Desktop web** | [Open desktop calculator](https://mrslysi-creator.github.io/RAWDOGS-Field-Calculator/desktop/) |
| **Windows 64-bit** | [Download Windows application](https://github.com/mrslysi-creator/RAWDOGS-Field-Calculator/releases/download/v2.4.1-preview/RAWDOGS_Field_Calculator_Windows_2.4.1.zip) |
| **Phone / PWA package** | [Download phone application files](https://github.com/mrslysi-creator/RAWDOGS-Field-Calculator/releases/download/v2.4.1-preview/RAWDOGS_Field_Calculator_Phone_0.2.zip) |

**[All downloads and release details](https://github.com/mrslysi-creator/RAWDOGS-Field-Calculator/releases/tag/v2.4.1-preview)**

The web apps open directly in a browser. You can install the phone version using **Add to Home Screen** / **Install App** in a supported mobile browser. Once installed and fully loaded, the PWA is designed to work without an internet connection. The Windows application runs locally and does not operate a localhost web server.

## Features

- **L81 mortar** — range, bearing and calibrated elevation (MIL).
- **SPH-2 / SPA** — game-calibrated elevation solutions, including low and high arcs where applicable.
- **Team colours** — blue, red and green camouflage themes.
- **A/B firing positions** — save and switch between two mortar-position presets.
- **Target history** — recall recent targets while maintaining your firing-position coordinates.
- **Manual coordinate entry** — reference name, X and Y for position and target.
- **Offline-capable** — local Windows operation and installable phone PWA.
- **No adverts, accounts or tracking.**

### Quick start

1. Choose your team colour and the weapon.
2. Set your firing position using **A** or **B**, then enter its coordinates.
3. Enter the target X/Y coordinates and optionally a reference name.
4. Select **CALCULATE** to obtain bearing, range and MIL.
5. Use **NEW TARGET** to clear the target while keeping the saved firing position.

The calculator is intended for the **WARDOGS game**. It is not a real-world navigation or artillery fire-control system.

## Windows installation

Download the Windows ZIP above and extract it completely into a folder. Run **`RAWDOGS Field Calculator.exe`**. The executable contains the RAWDOGS application icon and opens in a browser application window using Edge, Chrome or Brave when available. Windows may display a SmartScreen prompt because this community application is not code-signed.

**Windows build 2.4.1** is currently provided as a public testing release. See [Windows installation notes](docs/INSTALL-WINDOWS.md).

## Phone installation

Open the [mobile app](https://mrslysi-creator.github.io/RAWDOGS-Field-Calculator/) in a supported phone browser, then select **Add to Home Screen** or **Install App**. See [phone installation notes](docs/INSTALL-PWA.md).

## Source code

The repository includes the browser applications, the shared calculator engine, weapon calibration profiles, and the Windows launcher build files.

| Directory | Contents |
| --- | --- |
| `pwa/` | Phone/PWA source, offline service worker, and artwork |
| `src/desktop/` | Desktop browser interface |
| `src/shared/` | Shared calculator engine |
| `weapons/` | L81 and SPH-2 calibration data |
| `builds/windows/2.4.1/` | Windows launcher source and packaging notes |
| `.github/workflows/` | Web deployment and Windows build automation |
| `docs/` | Installation and technical documentation |

The underlying calculator mathematics and calibration data are shared between the published interfaces. For more details, see [How it works](docs/HOW-IT-WORKS.md) and [Source provenance](SOURCE_PROVENANCE.md).

## Licence

The source code is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See [LICENSE](LICENSE).

RAWDOGS names, badges, logos and original artwork have separate branding provisions; see [TRADEMARKS.md](TRADEMARKS.md).

*Created for the WARDOGS community by sly / RAWDOGS.*
