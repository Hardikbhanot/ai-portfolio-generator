# AI Portfolio Generator 🚀

**Turn your resume into a stunning, deployed personal website in minutes using AI.**

<img width="2888" height="1640" alt="image" src="https://github.com/user-attachments/assets/b94476ad-02b7-43ed-a107-636801cb1e76" />



## Overview
This full-stack application allows users to upload their resume (PDF/DOCX), automatically extracts key information using **Llama 3 AI**, and generates a customizable portfolio website. Users can edit their site using a drag-and-drop builder and publish it instantly to a unique **custom subdomain** (e.g., `john.portfolio-generator.tech`).

## ✨ Key Features

### 🤖 AI-Powered Generation
- **Resume Parsing**: Extracts Bio, Skills, Experience, and Projects from uploaded files.
- **Llama 3 Integration**: Uses Groq API for ultra-fast content generation.
- **Granular Regeneration**: Ask AI to rewrite specific sections (e.g., "Make my bio more professional").

### 🎨 Modern Frontend
- **Glassmorphism UI**: Beautiful, translucent design using Tailwind CSS and Framer Motion.
- **Drag & Drop Editor**: Integrated **GrapesJS** editor for pixel-perfect customization.
- **Mesh Gradients**: Dynamic, animated backgrounds.
- **Responsive Themes**: Multiple pre-built templates (Modern Dark, Classic Light, Creative).

### 🌐 Custom Subdomains
- **Wildcard DNS**: Users get their own public URL: `https://[username].yourdomain.com`.
- **Instant Publishing**: Changes go live immediately upon saving.
- **Smart Redirects**: Auto-redirects to the live site after publishing.

### 📊 Analytics & Auth
- **Dashboard**: Track views and engagement on your portfolio.
- **Secure Auth**: JWT-based authentication with email verification and forgot password flow.
- **Session Persistence**: User subdomain and state persist across reloads.

---

## 🛠️ Tech Stack

### Backend
- **Java 17 & Spring Boot 3**: Robust REST API.
- **Spring Security + JWT**: Stateless authentication.
- **PostgreSQL**: Relational database for Users, Portfolios, and Analytics.
- **LangChain4j (Optional)**: Abstraction for AI interactions.
- **Groq API**: High-speed inference for Llama 3 models.

### Frontend
- **React 18**: Component-based UI.
- **Tailwind CSS**: Utility-first styling.
- **Framer Motion**: Animations and transitions.
- **GrapesJS**: Visual website builder.
- **Axios**: API integration.

### Infrastructure
- **Docker**: Containerized deployment.
- **Vercel**: Frontend hosting (supports Wildcard Domains).
- **Heroku/DigitalOcean**: Backend hosting.

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker container)
- Groq API Key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-portfolio-generator.git
cd ai-portfolio-generator
```

### 2. Backend Setup
1.  Navigate to `backend/`.
2.  Configure `application.properties` (or use Env Vars):
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/portfolio_db
    spring.datasource.username=postgres
    spring.datasource.password=password
    application.security.jwt.secret-key=YOUR_SUPER_SECRET_KEY_HERE
    groq.api.key=YOUR_GROQ_API_KEY
    ```
3.  Run the application:
    ```bash
    ./gradlew bootRun
    ```

### 3. Frontend Setup
1.  Navigate to `frontend/portfolio-frontend/`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run development server:
    ```bash
    npm start
    ```
---

## 🤝 Contributing
1.  Fork the repo.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit changes.
4.  Push to branch and open a PR.

## 📄 License
MIT License.
