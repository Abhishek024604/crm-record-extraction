# CRM Record Extraction (AI-Powered)

An intelligent, full-stack CRM data importer that leverages LLM's reasoning to ingest messy, unstructured CSV files and seamlessly normalize them into a strict CRM schema. 


## 🚀 Features

- **Intelligent Data Normalization:** Automatically extracts and maps arbitrary columns to standard CRM fields (`name`, `email`, `company`, etc.).
- **Smart Parsing:** 
  - Splits multiple emails or phone numbers, keeping the primary one in the main field and moving the rest to a `crm_note`.
  - Formats phone numbers by separating country codes.
- **Data Validation & Constraints:** Ensures fields like `crm_status` perfectly match specific enum values (e.g., `GOOD_LEAD_FOLLOW_UP`, `BAD_LEAD`, etc.).
- **Interactive UI:** 
  - Drag-and-drop CSV upload with a modern UI.
  - A real-time preview table to review the AI's extracted results before permanently importing them.

- Uses `responseMimeType: application/json` directly with the Gemini API to stream native JSON structures.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Lucide Icons, Axios, PapaParse, React Dropzone.
- **Backend:** Node.js, Express, Multer (for file handling), Google AI SDK, CSV-Parser.
- **AI Model:** Inferencing using Cerebras.

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+)
- A [Google AI Studio API Key](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Abhishek024604/crm-record-extraction.git
cd crm-record-extraction
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your Google AI API Key:
```env
CEREBRAS_API_KEY="your_cerebras_api_key_here"
```
Start the backend server (runs on port 3001 by default):
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the Next.js development server:
```bash
npm run dev
```

## 🖥️ Usage

1. Open your browser to `http://localhost:3000`.
2. Click **"Import Leads via CSV"**.
3. Upload any CSV file containing leads. You can use the provided `difficult_leads.csv` in the root folder to test the AI's ability to handle highly unstructured data.
4. Review the beautifully formatted, standardized data in the preview table.
5. Click **Confirm Import** to send the leads to your main dashboard!


