# garage database

Web application for managing vehicle records, This is made for Job Application Test in Software Developer Position.

# Another version of the application Built with the assistance of AI tools here's the link  https://fleet-car-records.protongarage.workers.dev/
 

1. **Full-Featured Version (`main` branch):**
   - Includes all core CRUD operations, **server-side pagination** (6 items/page), **debounced search & brand filtering**, **multi-criteria sorting** (newest, oldest, brand A–Z, license plate, year, odometer), **validated photo uploads** (JPG/PNG/WebP up to 2 MB with server-side magic-byte verification and automatic cleanup), and **filtered CSV export**.

2. **Core + Pagination Version (`core-pagination` branch):**
   - A streamlined, lightweight build focusing strictly on the **4 core CRUD requirements** (Add, View, Edit, Delete) paired with **server-side pagination** (6 cars per page with item range display). Ideal for verifying the foundational React + Node.js + PostgreSQL architecture without extra dependencies.

- **Frontend:** React.js , Ant Design
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (`pg`)
- **Version Control:** GitHub


### Functional Requirements:

- **Add New Car Information:** Add record of vehicle entries like registration number, brand, model, year, odometer, notes
- **View All Car Information:** Responsive card-based grid of vehicle details
- **Edit Car Information:** Edit the existing vehicle details
- **Delete Car Information:** Confirmation prompt (`Popconfirm`) to prevent accidental deletion

### Additional Improvements
- **Server-Side Pagination:** (included in Test version) Displays 6 cars per page with page.
- **Server-Side Search & Brand Filtering:** (AI Version) Case-insensitive search across registration number, brand, model, and notes with input debouncing to reduce unnecessary API requests, paired with a brand filter dropdown.
- **Validated Photo Uploads:** Supports JPG, PNG, and WebP files up to 2 MB with live preview, replace, and remove controls. Validates actual file magic bytes on the backend rather than trusting file extensions.
- **Filtered CSV Export:** Exports all records matching the active search, filter, and sort parameters into a downloadable `.csv` file.

## Project Structure

```text
car-inventory-system/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx         # Main UI, modals, pagination, and API integration
│   │   └── main.jsx        # React entry point
│   └── package.json
├── server/                 # Node.js + Express REST API
│   ├── uploads/            # Local storage for uploaded car photos
│   ├── db.js               # PostgreSQL connection pool
│   ├── index.js            # Express routes & middleware
│   ├── .env.example        # Environment variable template
│   └── package.json
└── README.md
```


## Setup & Installation Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Gallaxz-lab/tech-car-garage.git
cd tech-car-garage-main
```

### 2. Set Up the PostgreSQL Database
Open your PostgreSQL client (e.g., `psql`, pgAdmin, or VS Code PostgreSQL extension), create a database named `car_inventory`, and run the following SQL schema:

```sql
CREATE DATABASE car_inventory;

-- Connect to car_inventory, then run:
CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  registration_number VARCHAR(20) UNIQUE NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER,
  odometer INTEGER DEFAULT 0,
  notes TEXT,
  photo_filename VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

*(Optional)*  8 sample records to test multi-page pagination:
```sql
INSERT INTO cars (registration_number, brand, model, year, odometer, notes) VALUES
('1กข-1234', 'Toyota', 'Camry', 2022, 34500, 'Executive fleet sedan, serviced last month'),
('2คง-5678', 'Honda', 'Civic', 2021, 48200, 'Sales team vehicle'),
('3จฉ-9012', 'Mazda', 'CX-5', 2023, 15800, 'SUV for client site visits'),
('4ชซ-3456', 'Ford', 'Ranger', 2020, 89100, 'Pickup truck for equipment transport'),
('5ญฎ-7890', 'Toyota', 'Fortuner', 2022, 41000, 'Long-distance regional travel'),
('6ฐฑ-2345', 'Honda', 'HR-V', 2023, 12300, 'Hybrid compact SUV'),
('7ณด-6789', 'Isuzu', 'D-Max', 2021, 76400, 'Warehouse delivery truck'),
('8ตถ-1122', 'BYD', 'Atto 3', 2024, 5400, 'Electric city commuter');
```

### 3. Run the Application (One Command)
From the root project folder:
```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

