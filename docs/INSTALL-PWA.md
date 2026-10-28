# RAWDOGS Field Calculator — phone installation

Open the phone calculator:

**https://mrslysi-creator.github.io/RAWDOGS-Field-Calculator/**

In a compatible Android or iPhone browser, select **Add to Home Screen** or **Install App**, then launch it using the RAWDOGS icon.

The phone/PWA version is designed to calculate offline after its first successful load and installation. Its service worker caches the calculator's JavaScript, verified calibration data and original RAWDOGS graphics. An internet connection is needed for the first install and for visiting any external website.

The [phone application ZIP](https://github.com/mrslysi-creator/RAWDOGS-Field-Calculator/releases/download/v2.4.1-preview/RAWDOGS_Field_Calculator_Phone_0.2.zip) contains the source files for hosting or inspection. Opening the ZIP's `index.html` locally is sufficient for some browser testing, but service-worker installation requires HTTPS or localhost.
