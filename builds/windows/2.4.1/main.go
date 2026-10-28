// RAWDOGS Field Calculator Build 2.4.1 — Windows offline launcher
// Preserves the original Build 2.4 approach: embedded files, file:// URL,
// Chromium app window, no local server, and icon embedded at link time.
// Build with the original RAWDOGS .ico via rsrc into icon_amd64.syso.
package main

import (
 "embed"
 "errors"
 "fmt"
 "io/fs"
 "net/url"
 "os"
 "os/exec"
 "path/filepath"
 "strings"
 "syscall"
 "unsafe"
)

//go:embed app
var files embed.FS

func main() {
 if err := launch(); err != nil {
  notify("RAWDOGS Field Calculator", "Could not start Build 2.4.1: "+err.Error())
 }
}

func launch() error {
 local := os.Getenv("LOCALAPPDATA")
 if local == "" {
  var err error
  local, err = os.UserConfigDir()
  if err != nil { return err }
 }
 base := filepath.Join(local, "RAWDOGS Field Calculator")
 // A new folder prevents preview testing from altering Build 2.4.
 appDir := filepath.Join(base, "Build2_4_1")
 err := fs.WalkDir(files, "app", func(p string, info fs.DirEntry, walkErr error) error {
  if walkErr != nil { return walkErr }
  rel := strings.TrimPrefix(filepath.FromSlash(p), "app")
  rel = strings.TrimLeft(rel, `\/`)
  dest := filepath.Join(appDir, rel)
  if info.IsDir() { return os.MkdirAll(dest, 0755) }
  data, err := files.ReadFile(p)
  if err != nil { return err }
  return os.WriteFile(dest, data, 0644)
 })
 if err != nil { return err }
 index := filepath.Join(appDir, "index.html")
 if _, err := os.Stat(index); err != nil { return err }
 path := filepath.ToSlash(index)
 if !strings.HasPrefix(path, "/") { path = "/" + path }
 appURL := (&url.URL{Scheme: "file", Path: path}).String()
 browser, err := locateBrowser()
 if err == nil {
  profile := filepath.Join(base, "BrowserProfile_2_4_1")
  if err = os.MkdirAll(profile, 0755); err != nil { return err }
  cmd := exec.Command(browser, "--app="+appURL, "--user-data-dir="+profile, "--no-first-run", "--new-window")
  if err = cmd.Start(); err == nil { return cmd.Process.Release() }
 }
 cmd := exec.Command("rundll32.exe", "url.dll,FileProtocolHandler", appURL)
 if fallbackErr := cmd.Start(); fallbackErr != nil {
  return fmt.Errorf("browser startup failed: %w; default browser fallback: %v", err, fallbackErr)
 }
 return cmd.Process.Release()
}

func locateBrowser() (string, error) {
 candidates := []string{
  filepath.Join(os.Getenv("ProgramFiles(x86)"),"Microsoft","Edge","Application","msedge.exe"),
  filepath.Join(os.Getenv("ProgramFiles"),"Microsoft","Edge","Application","msedge.exe"),
  filepath.Join(os.Getenv("ProgramFiles"),"Google","Chrome","Application","chrome.exe"),
  filepath.Join(os.Getenv("ProgramFiles(x86)"),"Google","Chrome","Application","chrome.exe"),
  filepath.Join(os.Getenv("LOCALAPPDATA"),"Google","Chrome","Application","chrome.exe"),
  filepath.Join(os.Getenv("ProgramFiles"),"BraveSoftware","Brave-Browser","Application","brave.exe"),
  filepath.Join(os.Getenv("ProgramFiles(x86)"),"BraveSoftware","Brave-Browser","Application","brave.exe"),
 }
 for _, p := range candidates {
  if p != "" { if st,err:=os.Stat(p);err==nil&&!st.IsDir(){return p,nil} }
 }
 for _, name := range []string{"msedge.exe","chrome.exe","brave.exe"} {
  if p,err:=exec.LookPath(name);err==nil{return p,nil}
 }
 return "", errors.New("Microsoft Edge, Chrome or Brave not found")
}

func notify(title, message string) {
 user32 := syscall.NewLazyDLL("user32.dll")
 box := user32.NewProc("MessageBoxW")
 tp, _ := syscall.UTF16PtrFromString(title)
 mp, _ := syscall.UTF16PtrFromString(message)
 box.Call(0, uintptr(unsafe.Pointer(mp)), uintptr(unsafe.Pointer(tp)), 0x10)
}
