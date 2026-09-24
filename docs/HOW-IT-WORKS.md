# How the calculator works

The RAWDOGS Field Calculator converts the firing position and target information supplied by the user into the values needed for supported WARDOGS indirect-fire weapons.

The public source import will separate the project into:

- coordinate and range calculations
- bearing calculations
- weapon-specific calibration data
- user-interface code
- desktop launcher/build code
- phone/PWA code

Weapon-specific calibration notes for the L81 and SPH-2 will be added alongside the imported source so that users can see how the application reaches its results.

This document is intentionally high level until the original Build 2.4 source files have been imported and verified against the working release.
