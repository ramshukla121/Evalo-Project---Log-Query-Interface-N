
![Screenshot 2025-07-03 224400](https://github.com/user-attachments/assets/e4c7a6d4-0820-4b3e-9b05-52dc05784b97)
![Screenshot 2025-07-03 224628](https://github.com/user-attachments/assets/bd2f5bec-6645-42c3-a3ee-ed4261595ced)
![Screenshot 2025-07-03 224620](https://github.com/user-attachments/assets/1cb860c2-fd39-4ace-936a-85629985e3d0)

# Log Ingestion and Querying System

A full-stack, professional-grade log ingestion and querying platform. Built with Node.js (Express) and React, this tool allows you to ingest, store, search, and filter logs with a beautiful, modern UI. All logs are persisted in a single JSON file for simplicity and transparency.

---

## ✨ Features
- **Log Ingestion API**: Accepts logs in a structured JSON format.
- **Powerful Query UI**: Search, filter, and view logs by message, level, resource ID, and date/time range.
- **Autocomplete**: Suggestions for message and resource ID as you type.
- **Clickable Resource IDs**: Instantly filter logs by clicking any resource ID in the table.
- **Responsive & Modern Design**: Luxury, professional look with smooth animations and full-screen layout.
- **No External Database**: All data is stored in a single `logs.json` file for easy setup and review.

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express
- **Frontend**: React (functional components, hooks)
- **Persistence**: File-based (JSON)

---

## 🚀 Getting Started

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Backend Setup
```sh
cd backend
npm install
node index.js
```
- The backend runs on [http://localhost:4000](http://localhost:4000)

### 3. Frontend Setup
```sh
cd frontend
npm install
npm start
```
- The frontend runs on [http://localhost:3000](http://localhost:3000)

---

## 📦 API Endpoints

### `POST /logs`
- Ingest a log entry.
- **Body:**
```json
{
  "level": "error|warn|info|debug",
  "message": "string",
  "resourceId": "string",
  "timestamp": "ISO 8601 string",
  "traceId": "string",
  "spanId": "string",
  "commit": "string",
  "metadata": { "any": "object" }
}
```
- **Response:** 201 Created, returns the stored log.

### `GET /logs`
- Query logs with filters (all combinable):
  - `level`, `message`, `resourceId`, `timestamp_start`, `timestamp_end`, `traceId`, `spanId`, `commit`
- **Response:** 200 OK, array of matching logs (reverse-chronological)

---

## 🖥️ How to Use the UI
- **Filter Bar**: Search by message, level, resource ID, or date/time range.
- **Autocomplete**: Suggestions appear as you type in message/resource ID fields.
- **Clickable Resource IDs**: Click any resource ID in the table to filter instantly.
- **Clear Filters**: Use the button to reset all filters.
- **Date/Time Range**: Use the labeled pickers to filter logs between two dates/times.

---

## 📝 Design Decisions
- **File-based storage** for transparency and easy review.
- **All filtering and sorting** is done in-memory for performance and simplicity.
- **No external DBs** to keep setup minimal and focus on core logic.
- **Modern, luxury UI** to demonstrate product sense and frontend skills.

---

## 🚦 Future Improvements
- Real-time log updates (WebSockets)
- Analytics dashboard (charts, stats)
- Docker support for one-command startup
- Unit and integration tests
- User authentication and roles

---

## 📬 Contact
For questions or feedback, please contact [Your Name] at [your.email@example.com].

---

**Enjoy using your professional Log Ingestion and Querying System!** 
