RAWDOGS FIELD CALCULATOR — PHONE/PWA BUILD 0.1

Purpose
-------
Compact phone version of the current working RAWDOGS Field Calculator maths/data.

Included in this build
----------------------
- Exact finished BLUE / RED / GREEN camouflage assets from the desktop build.
- Manila/yellow controls; selected team button changes to the real team colour.
- L81 mortar calibration from the verified sight screenshots.
- SPH-2 / SPA LOW ARC and HIGH ARC solutions from the verified sight screenshots.
- Compact phone layout designed to fit the firing workflow on a limited screen.
- Firing-position A/B presets with persistent local storage.
- OLD TARGETS is a separate phone screen, not visible alongside MAIN CALC.
- OLD TARGETS vertical manila folder tab.
- Red vintage lamp = stored target; green lamp = the target currently recalled.
- RETURN TO TARGET loads the target and automatically returns to MAIN CALC.
- BACK TO MAIN applies nothing.
- NEW TARGET clears target fields but preserves firing position.
- Old targets expire after 30 minutes.
- Team choice uses session storage so it must be deliberately chosen again in a new app session.
- PWA manifest + service worker: after first successful online load/install, the calculator can work offline.
- No adverts, tracking, login or subscription.

IMPORTANT
---------
Opening index.html directly from a Windows folder is fine for visual/calculator testing,
but browsers do not allow a Service Worker/PWA install from file:// URLs.

For a real phone-install test it must be served over:
  - HTTPS (GitHub Pages will do this), or
  - localhost during development.

GitHub Pages deployment later
-----------------------------
Put the contents of this folder at the published GitHub Pages root.
The PWA uses relative URLs so it will also work from a repository sub-path.

Current scope
-------------
SPA pitch/roll/terrain compensation is deliberately NOT included yet.
That remains future experimental work for v2.5/v2.6+ after controlled vehicle tests.
