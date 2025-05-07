import { writeFileSync } from 'fs';
import { join } from 'path';
import { homedir, platform } from 'os';

const projectPath = process.cwd();
const desktopPath = join(homedir(), 'Desktop');

// Create launchers
if (platform() === 'win32') {
  // Windows .vbs script
  const vbsContent = `
Set oShell = CreateObject("WScript.Shell")
oShell.CurrentDirectory = "${projectPath.replace(/\\/g, '\\\\')}"
oShell.Run "cmd /k npm start", 1, 0
  `.trim();
  
  writeFileSync(join(desktopPath, 'NBA Fan Journal.vbs'), vbsContent);
} else {
  // Unix shell script
  const shContent = `
#!/bin/bash
cd "${projectPath}"
npm start
  `.trim();
  
  const desktopEntry = `
[Desktop Entry]
Name=NBA Fan Journal
Exec=bash -c 'cd "${projectPath}" && npm start'
Type=Application
Terminal=true
  `.trim();
  
  writeFileSync(join(desktopPath, 'NBA Fan Journal.desktop'), desktopEntry);
  
  const { chmodSync } = await import('fs');
  chmodSync(join(desktopPath, 'NBA Fan Journal.desktop'), '755');
}

console.log('Desktop shortcut created successfully');