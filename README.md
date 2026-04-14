# HFiles — Mini Medical Record Dashboard

A full-stack web application for managing patient medical records, built as a job assignment for **HFiles** (healthcare technology company).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TailwindCSS |
| Backend | ASP.NET Core (.NET 10), C# |
| ORM | Entity Framework Core 10 |
| Database | SQL Server 2019 |
| Auth | JWT (JSON Web Tokens) |
| IDE | Visual Studio 2022 |
| Password Hashing | BCrypt.Net |
| API Docs | Swagger (Swashbuckle) |

---

## Features

- **User Registration & Login** — Secure authentication with JWT tokens
- **Profile Management** — Update user details and upload profile photo
- **Medical File Upload** — Upload `.jpg`, `.jpeg`, `.png`, `.pdf` files
- **Medical File View** — List all uploaded files for logged-in user
- **Medical File Delete** — Remove files from storage and database
- **Protected Routes** — All file and profile endpoints require valid JWT

---

## Project Structure

```
HFiles.API/
├── Controllers/
│   ├── AuthController.cs       # Register, Login, Me
│   ├── FileController.cs       # Upload, GetFiles, Delete
│   └── UserController.cs       # Profile management
├── Data/
│   └── AppDbContext.cs         # EF Core DB context
├── DTOs/
│   ├── RegisterDto.cs
│   └── LoginDto.cs
├── Models/
│   ├── User.cs
│   └── MedicalFile.cs
├── Services/
│   └── AuthService.cs          # Password hash & verify
├── wwwroot/
│   └── uploads/                # Uploaded files stored here
├── appsettings.json
└── Program.cs
```

---

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [SQL Server 2019](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [Node.js 18+](https://nodejs.org/) (for frontend)
- [Visual Studio 2022](https://visualstudio.microsoft.com/)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/hfiles-medical.git
cd hfiles-medical
```

### 2. Configure the backend

Open `appsettings.json` and update the following:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=HFilesDB;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "your-super-secret-key-minimum-32-characters",
    "Issuer": "HFiles.API",
    "Audience": "HFiles.Client",
    "ExpiryMinutes": "60"
  }
}
```

### 3. Run database migrations

In Visual Studio → Package Manager Console:

```
Add-Migration InitialCreate
Update-Database
```

Or via CLI:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4. Run the backend

```bash
cd HFiles.API
dotnet run
```

Backend runs at: `https://localhost:7163` and `http://localhost:5000`

Swagger UI: `https://localhost:7163/swagger`

### 5. Run the frontend

```bash
cd hfiles-frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and get JWT token |
| GET | `/api/auth/me` | Yes | Get logged-in user info |

### Files

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/files` | Yes | Upload a medical file |
| GET | `/api/files` | Yes | Get all files for user |
| DELETE | `/api/files/{id}` | Yes | Delete a file by ID |

---

## Testing the API

### Using Postman (Recommended)

1. **Login** — `POST http://localhost:7163/api/auth/login` with JSON body:
   ```json
   { "email": "test@example.com", "password": "yourpassword" }
   ```
2. **Copy the token** from the response
3. For protected requests — go to **Authorization** tab → **Bearer Token** → paste token

---

## NuGet Packages

```xml
<PackageReference Include="BCrypt.Net-Next" Version="4.1.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="10.0.5" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.5" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="10.0.5" />
<PackageReference Include="Microsoft.OpenApi" Version="2.4.1" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="10.1.7" />
```

---

## Environment Notes

- Allowed file types: `.jpg`, `.jpeg`, `.png`, `.pdf`
- Uploaded files are stored in `wwwroot/uploads/`
- JWT tokens expire after 60 minutes by default
- CORS is configured for `http://localhost:3001` (update if frontend port differs)

---
