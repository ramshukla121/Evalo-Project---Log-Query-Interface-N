const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const LOGS_FILE = path.join(__dirname, '../logs.json');

app.use(cors());
app.use(express.json());

// Helper: Read logs from file
function readLogs() {
  if (!fs.existsSync(LOGS_FILE)) return [];
  const data = fs.readFileSync(LOGS_FILE, 'utf-8');
  try {
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

// Helper: Write logs to file
function writeLogs(logs) {
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
}

// Schema validation
function isValidLog(log) {
  const required = ['level','message','resourceId','timestamp','traceId','spanId','commit','metadata'];
  if (!log || typeof log !== 'object') return false;
  for (const key of required) {
    if (!(key in log)) return false;
  }
  if (!['error','warn','info','debug'].includes(log.level)) return false;
  if (typeof log.message !== 'string') return false;
  if (typeof log.resourceId !== 'string') return false;
  if (typeof log.timestamp !== 'string' || isNaN(Date.parse(log.timestamp))) return false;
  if (typeof log.traceId !== 'string') return false;
  if (typeof log.spanId !== 'string') return false;
  if (typeof log.commit !== 'string') return false;
  if (typeof log.metadata !== 'object' || Array.isArray(log.metadata) || log.metadata === null) return false;
  return true;
}

// POST /logs - Ingest a log
app.post('/logs', (req, res) => {
  const log = req.body;
  if (!isValidLog(log)) {
    return res.status(400).json({ error: 'Invalid log schema.' });
  }
  const logs = readLogs();
  logs.push(log);
  writeLogs(logs);
  res.status(201).json(log);
});

// GET /logs - Query logs with filters
app.get('/logs', (req, res) => {
  let logs = readLogs();
  const { level, message, resourceId, timestamp_start, timestamp_end, traceId, spanId, commit } = req.query;
  if (level) logs = logs.filter(l => l.level === level);
  if (message) logs = logs.filter(l => l.message.toLowerCase().includes(message.toLowerCase()));
  if (resourceId) logs = logs.filter(l => l.resourceId.toLowerCase().includes(resourceId.toLowerCase()));
  if (timestamp_start) logs = logs.filter(l => new Date(l.timestamp) >= new Date(timestamp_start));
  if (timestamp_end) logs = logs.filter(l => new Date(l.timestamp) <= new Date(timestamp_end));
  if (traceId) logs = logs.filter(l => l.traceId === traceId);
  if (spanId) logs = logs.filter(l => l.spanId === spanId);
  if (commit) logs = logs.filter(l => l.commit === commit);
  // Sort reverse-chronological
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(logs);
});

// Health check
app.get('/', (req, res) => res.send('Log Ingestion API running.'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 