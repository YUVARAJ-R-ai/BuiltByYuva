#!/usr/bin/env node
// SSH server that serves the interactive 3D ASCII resume.
//
// Anyone can connect with:   ssh -p 2222 <host>
// Authentication is intentionally open (passwordless) — this exposes a
// read-only resume animation and nothing else. Each connection spawns an
// isolated `resume.js` child process whose I/O is piped over the SSH channel.
//
// ESM module (package.json has "type": "module"), so we reconstruct __dirname
// and import ssh2 rather than require() it, unlike the CommonJS plan snippet.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import ssh2 from 'ssh2';

const { Server } = ssh2;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = parseInt(process.env.SSH_RESUME_PORT || '2222', 10);
const HOST = process.env.SSH_RESUME_HOST || '0.0.0.0';
const HOST_KEY_PATH = path.join(__dirname, '../keys/ssh_host_rsa_key');
const RESUME_SCRIPT = path.join(__dirname, 'resume.js');

if (!fs.existsSync(HOST_KEY_PATH)) {
  console.error(
    `Missing host key at ${HOST_KEY_PATH}.\n` +
    `Generate one with:\n` +
    `  mkdir -p keys && ssh-keygen -t rsa -b 2048 -f keys/ssh_host_rsa_key -N ""`
  );
  process.exit(1);
}

const hostKey = fs.readFileSync(HOST_KEY_PATH);

const server = new Server({ hostKeys: [hostKey] }, (client) => {
  client.on('authentication', (ctx) => {
    // Passwordless: accept any username / password / public key.
    ctx.accept();
  });

  client.on('ready', () => {
    client.on('session', (accept) => {
      const session = accept();
      let ptyInfo = null;

      session.once('pty', (accept, reject, info) => {
        ptyInfo = info;
        accept();
      });

      session.once('shell', (accept) => {
        const channel = accept();

        // Spawn the resume renderer. It writes ANSI escape codes and reads
        // keystrokes on stdin — both flow over the SSH channel via pipes.
        const resumeProcess = spawn('node', [RESUME_SCRIPT], {
          env: {
            ...process.env,
            TERM: (ptyInfo && ptyInfo.term) || 'xterm-256color',
          },
        });

        channel.pipe(resumeProcess.stdin);
        resumeProcess.stdout.pipe(channel);
        resumeProcess.stderr.pipe(channel.stderr);

        session.on('window-change', (accept, reject, info) => {
          ptyInfo = info;
          if (accept) accept();
        });

        const cleanup = () => {
          if (!resumeProcess.killed) resumeProcess.kill();
        };

        resumeProcess.on('exit', () => {
          try { channel.close(); } catch {}
          client.end();
        });

        // If the client disconnects or the renderer dies, tear down the other.
        channel.on('close', cleanup);
        resumeProcess.on('error', (err) => {
          try { channel.stderr.write(`resume failed: ${err.message}\n`); } catch {}
          cleanup();
        });
      });
    });
  });

  client.on('error', () => { /* ignore per-connection socket errors */ });
});

server.on('error', (err) => {
  console.error(`SSH server error: ${err.message}`);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`SSH resume server listening on ${HOST}:${PORT}`);
  console.log(`Connect with:  ssh -p ${PORT} localhost`);
});
