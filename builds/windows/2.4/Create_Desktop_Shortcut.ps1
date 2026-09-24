$ErrorActionPreference = 'Stop'
$AppDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Exe = Join-Path $AppDir 'RAWDOGS Field Calculator.exe'
$Icon = Join-Path $AppDir 'RAWDOGS_Field_Calculator.ico'
if (-not (Test-Path $Exe)) { throw "Could not find $Exe" }
$Desktop = [Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $Desktop 'RAWDOGS Field Calculator.lnk'
$Shell = New-Object -ComObject WScript.Shell
$Shortcut = $Shell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $Exe
$Shortcut.WorkingDirectory = $AppDir
# The EXE now has the same icon embedded at link time. Keeping the explicit icon
# here also avoids Windows shortcut-cache oddities on systems that saw older builds.
if (Test-Path $Icon) { $Shortcut.IconLocation = "$Icon,0" }
$Shortcut.Description = 'RAWDOGS Field Calculator'
$Shortcut.Save()
Write-Host "Created desktop shortcut: $ShortcutPath"
