RAWDOGS FIELD CALCULATOR — BUILD 2.4 WINDOWS

This build starts from the known-good Build 2.2 launcher approach.

WHAT CHANGED
- The approved RAWDOGS icon is now embedded at COMPILE/LINK TIME.
- The finished EXE is NOT patched after compilation.
- No Windows manifest was added.
- No localhost / 127.0.0.1 server is used.

The calculator is still completely local/offline. The EXE contains the calculator
files and writes them to:
  %LOCALAPPDATA%\RAWDOGS Field Calculator\Build2_4

It then opens index.html directly in Microsoft Edge, Brave or Chrome app mode.
There is no normal browser address bar and no local web server to keep alive.

The browser profile is kept at:
  %LOCALAPPDATA%\RAWDOGS Field Calculator\BrowserProfile

The separate .ico remains in the folder for shortcut compatibility, although the
same icon is now compiled into the EXE itself.

TEST THIS BUILD
1. Extract the ZIP fully.
2. Double-click RAWDOGS Field Calculator.exe.
3. Confirm the calculator populates normally.
4. Close the app window and confirm it closes normally.
5. Check that File Explorer/Desktop shows the approved RAWDOGS icon on the EXE.

If all five pass, Build 2.4 replaces the failed post-patched Build 2.3.
