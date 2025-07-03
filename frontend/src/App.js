import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Filter state
  const [filters, setFilters] = useState({
    message: '',
    level: '',
    resourceId: '',
    timestamp_start: '',
    timestamp_end: '',
  });
  // Logs state
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  // ResourceId suggestions
  const [resourceIdSuggestions, setResourceIdSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Message suggestions
  const [messageSuggestions, setMessageSuggestions] = useState([]);
  const [showMsgSuggestions, setShowMsgSuggestions] = useState(false);

  // Fetch logs from backend
  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const res = await fetch(`http://localhost:4000/logs?${params.toString()}`);
      const data = await res.json();
      setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, [filters]);

  // Update suggestions as user types
  useEffect(() => {
    if (filters.resourceId) {
      const ids = Array.from(new Set(logs.map(l => l.resourceId)));
      const filtered = ids.filter(id => id.toLowerCase().includes(filters.resourceId.toLowerCase()));
      setResourceIdSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setResourceIdSuggestions([]);
      setShowSuggestions(false);
    }
  }, [filters.resourceId, logs]);

  useEffect(() => {
    if (filters.message) {
      const msgs = Array.from(new Set(logs.map(l => l.message)));
      const filtered = msgs.filter(msg => msg.toLowerCase().includes(filters.message.toLowerCase()));
      setMessageSuggestions(filtered);
      setShowMsgSuggestions(filtered.length > 0);
    } else {
      setMessageSuggestions([]);
      setShowMsgSuggestions(false);
    }
  }, [filters.message, logs]);

  // Handle filter changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      message: '',
      level: '',
      resourceId: '',
      timestamp_start: '',
      timestamp_end: '',
    });
  };

  return (
    <div className="App">
      <div className="main-content">
        <h1>Log Query Interface</h1>
        {/* Filter Bar */}
        <div className="filter-bar" style={{ justifyContent: 'flex-start' }}>
          <div className="filter-item">
            <input
              type="text"
              name="message"
              placeholder="Search message..."
              value={filters.message}
              onChange={handleChange}
              autoComplete="off"
              onFocus={() => setShowMsgSuggestions(messageSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowMsgSuggestions(false), 120)}
            />
            {showMsgSuggestions && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #e3e8f0',
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(200,210,240,0.13)',
                zIndex: 10,
                maxHeight: 180,
                overflowY: 'auto',
              }}>
                {messageSuggestions.map((msg, idx) => (
                  <div
                    key={msg}
                    style={{
                      padding: '8px 14px',
                      cursor: 'pointer',
                      background: idx === 0 ? '#f7faff' : '#fff',
                      color: '#232946',
                      borderBottom: idx !== messageSuggestions.length - 1 ? '1px solid #f2f4f8' : 'none',
                    }}
                    onMouseDown={() => {
                      setFilters(f => ({ ...f, message: msg }));
                      setShowMsgSuggestions(false);
                    }}
                  >
                    {msg}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="filter-item">
            <select name="level" value={filters.level} onChange={handleChange}>
              <option value="">All Levels</option>
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>
          <div className="filter-item">
            <input
              type="text"
              name="resourceId"
              placeholder="Resource ID..."
              value={filters.resourceId}
              onChange={handleChange}
              autoComplete="off"
              onFocus={() => setShowSuggestions(resourceIdSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
            />
            {showSuggestions && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #e3e8f0',
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(200,210,240,0.13)',
                zIndex: 10,
                maxHeight: 180,
                overflowY: 'auto',
              }}>
                {resourceIdSuggestions.map((id, idx) => (
                  <div
                    key={id}
                    style={{
                      padding: '8px 14px',
                      cursor: 'pointer',
                      background: idx === 0 ? '#f7faff' : '#fff',
                      color: '#232946',
                      borderBottom: idx !== resourceIdSuggestions.length - 1 ? '1px solid #f2f4f8' : 'none',
                    }}
                    onMouseDown={() => {
                      setFilters(f => ({ ...f, resourceId: id }));
                      setShowSuggestions(false);
                    }}
                  >
                    {id}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="filter-item filter-date">
            <label className="filter-label">Start Date/Time</label>
            <input
              type="datetime-local"
              name="timestamp_start"
              value={filters.timestamp_start}
              onChange={handleChange}
            />
          </div>
          <div className="filter-item filter-date">
            <label className="filter-label">End Date/Time</label>
            <input
              type="datetime-local"
              name="timestamp_end"
              value={filters.timestamp_end}
              onChange={handleChange}
            />
          </div>
          <div className="filter-item filter-button">
            <button className="button-primary" onClick={clearFilters} style={{ width: '100%' }}>
              <span style={{ display: 'inline-block', transition: 'transform 0.2s' }}>🧹</span> Clear Filters
            </button>
          </div>
        </div>
        {/* Log List */}
        <div style={{ minHeight: 200, marginTop: 8 }}>
          {loading ? (
            <div style={{ padding: '40px 0', color: '#4f8cff', fontWeight: 500, fontSize: '1.2rem' }}>
              <span className="spinner" style={{ marginRight: 10, verticalAlign: 'middle' }}>⏳</span>Loading logs...
            </div>
          ) : logs.length === 0 ? (
            <p style={{ color: '#888', fontSize: '1.1rem', marginTop: 32 }}>No logs found.</p>
          ) : (
            <table className="log-table" style={{ animation: 'fadein 0.7s' }}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Level</th>
                  <th>Message</th>
                  <th>Resource ID</th>
                  <th>Trace ID</th>
                  <th>Span ID</th>
                  <th>Commit</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx} className={
                    log.level === 'error' ? 'log-error' :
                    log.level === 'warn' ? 'log-warn' :
                    log.level === 'info' ? 'log-info' :
                    log.level === 'debug' ? 'log-debug' : ''
                  }>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{log.level}</td>
                    <td>{log.message}</td>
                    <td>
                      <span
                        style={{
                          color: '#4f8cff',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          fontWeight: 500,
                          letterSpacing: '0.5px',
                        }}
                        onClick={() => setFilters(f => ({ ...f, resourceId: log.resourceId }))}
                      >
                        {log.resourceId}
                      </span>
                    </td>
                    <td>{log.traceId}</td>
                    <td>{log.spanId}</td>
                    <td>{log.commit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
