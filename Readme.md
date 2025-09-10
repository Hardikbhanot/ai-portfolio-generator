# 🤖 AI Portfolio Generator

A full-stack web application that allows users to register, upload their resume, and automatically generate a personalized portfolio website using AI. Users can select from various professional templates to customize the look and feel of their final portfolio.



---
## ✨ Key Features

- **User Authentication:** Secure user registration and login system using Spring Security and JWT.
- **Resume Parsing:** Supports `.pdf` and `.docx` resume uploads, extracting key information like bio, skills, and project details.
- **AI-Powered Content Generation:** Leverages an AI model to intelligently structure and summarize the parsed resume data into a professional portfolio format.
- **Template Selection:** Users can choose from multiple modern templates to style their generated portfolio.
- **Dynamic HTML Rendering:** The backend uses Thymeleaf to generate fully styled, server-rendered HTML based on the user's choice.
- **Secure & Protected Routes:** Frontend routes are protected to ensure only authenticated users can access the portfolio generation features.

---
## 🛠️ Tech Stack

### Backend
* **Framework:** Spring Boot 3
* **Language:** Java
* **Security:** Spring Security (JWT Authentication)
* **Database:** PostgreSQL
* **API:** RESTful API
* **Templating:** Thymeleaf
* **File Parsing:** Apache PDFBox & POI

### Frontend
* **Framework:** React
* **Routing:** React Router
* **State Management:** React Context API
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **API Client:** Axios

---
## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Java 17+
* Node.js and npm
* PostgreSQL
* Git

### Installation & Setup

1.  **Clone the repository**
    ```sh
    git clone https://github.com/Hardikbhanot/ai-portfolio-generator.git
    cd ai-portfolio-generator
    ```

2.  **Backend Setup**
    * Navigate to the `backend` directory:
        ```sh
        cd backend
        ```
    * Open `src/main/resources/application.properties`.
    * Update the PostgreSQL database URL, username, and password to match your local setup.
    * Update the `application.security.jwt.secret-key` with a long, secure, Base64-encoded string.
    * Run the Spring Boot application using your IDE or the command line.

3.  **Frontend Setup**
    * Navigate to the `frontend` directory:
        ```sh
        cd ../frontend
        ```
    * Install NPM packages:
        ```sh
        npm install
        ```
    * Start the development server:
        ```sh
        npm start
        ```
    * Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
