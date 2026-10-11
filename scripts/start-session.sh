#!/bin/bash
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE_BIN="$(command -v node)"
SESSION_LABEL="com.intrepion.lantern-below"
SESSION_TARGET="gui/$(id -u)"
SESSION_PLIST="/tmp/${SESSION_LABEL}.$(id -u).plist"
if ! test -f "$PROJECT_DIR/dist/index.html"; then
  echo 'Build first with npm run build.'
  exit 1
fi
if launchctl print "$SESSION_TARGET/$SESSION_LABEL" >/dev/null 2>&1; then
  launchctl kickstart -k "$SESSION_TARGET/$SESSION_LABEL"
else
  cat > "$SESSION_PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>Label</key><string>$SESSION_LABEL</string>
<key>ProgramArguments</key><array><string>$NODE_BIN</string><string>$PROJECT_DIR/node_modules/vite/bin/vite.js</string><string>preview</string><string>--host</string><string>127.0.0.1</string><string>--port</string><string>5179</string><string>--strictPort</string></array>
<key>WorkingDirectory</key><string>$PROJECT_DIR</string>
<key>RunAtLoad</key><true/>
<key>StandardOutPath</key><string>/tmp/lantern-below.stdout.log</string>
<key>StandardErrorPath</key><string>/tmp/lantern-below.stderr.log</string>
</dict></plist>
PLIST
  launchctl bootstrap "$SESSION_TARGET" "$SESSION_PLIST"
fi
curl --fail --silent --retry 5 --retry-connrefused --retry-delay 1 http://127.0.0.1:5179/ >/dev/null
echo 'The Lantern Below: http://127.0.0.1:5179/ (current login session only)'
