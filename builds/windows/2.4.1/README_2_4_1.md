# RAWDOGS Field Calculator — 2.4.1 Windows Preview

This preview differs from stable Build 2.4 in **only the optional Buy Me a Coffee footer link and a separately rebuilt Windows launcher with the original RAWDOGS icon embedded at link time**. Calculation logic, weapon data, and core UI behaviour were not edited.

## Run
1. Extract all ZIP contents into a new folder.
2. Run `RAWDOGS_Field_Calculator_Build_2_4_1_Preview.exe` (the EXE has its own RAWDOGS icon).
3. Confirm calculator, results, team colours, old targets and shortcut icon work normally.
4. Click **BUY ME A COFFEE** once; confirm it opens https://buymeacoffee.com/silvesta and there is no other side effect.
5. Keep original Build 2.4 installed for comparison.

This launcher extracts its embedded app to `%LOCALAPPDATA%\RAWDOGS Field Calculator\Build2_4_1` and opens in Edge, Chrome or Brave application mode. It doesn't run a local web server, and no network connection is needed to calculate. The optional coffee link needs internet access to open.

## Integrity
See `SHA256SUMS.txt` in this ZIP. The icon resource is compiled into the EXE before linking, not patched afterward.

## Status
Build is automated and checks the EXE contains both RT_ICON and RT_GROUP_ICON. Windows owner acceptance testing remains outstanding. This preview never overwrites Build 2.4.

## Licence
GNU AGPL-3.0 — same as the original. RAWDOGS branding is covered separately by TRADEMARKS.md in the repository.
