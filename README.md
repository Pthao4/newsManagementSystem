
# News Management System (NMS)

NMS is an application crafted to manage news content efficiently. This software empowers administrators and users to create, update, delete, and view news articles while ensuring secure access control. By combining a robust backend and modern frontend, NMS provides a streamlined solution for managing news operations.

---

## Features

### User Management
- Admins can manage users and assign roles.
- Supports secure login and authentication via Spring Security.

### News Management
- Create, read, update, and delete news articles.
- Each news article contains:
  - Title
  - Content
  - Author
  - Creation date
  - Category and other metadata

### Security
- Role-based access control for admins and regular users.
- JWT-based authentication for secure API access.

### Frontend
- React Vite interface for smooth, responsive UI.
- Consume RESTful APIs provided by the backend.
- Dynamic rendering of news content and user actions.

---

## Project Dependencies and Technologies

### Core Frameworks
- **Spring Boot:** Java-based framework for building backend applications.
- **spring-boot-starter-data-jpa:** Database operations using JPA.
- **spring-boot-starter-security:** Authentication and authorization.
- **spring-boot-starter-web:** REST API development.
- **spring-boot-starter-validation:** Input validation support.
- **spring-boot-devtools:** Live reload and enhanced development experience.

### Security Enhancements
- **JWT:** JSON Web Token for authentication.
- **Spring Security Integration:** Secure access control for endpoints.

### Database
- **Microsoft SQL Server**
- **mssql-jdbc:** JDBC driver for SQL Server.

### Development Utilities
- **Lombok:** Auto-generates getters, setters, constructors.
- **Maven Plugins:** Spring Boot Maven Plugin, Maven Compiler Plugin.

### Testing
- **spring-boot-starter-test:** Unit testing tools for Spring Boot.

### Frontend
- **React + Vite:** Modern frontend framework with fast development build.

---

## Installation and Setup

### 1. Prerequisites
Ensure the following tools are installed:

- **Java Development Kit (JDK) 21+**  
- **Apache Maven 3.6+**  
- **Microsoft SQL Server**  
- **Node.js & npm / Yarn**  
- **Git**  
- **IDE:** IntelliJ IDEA, Eclipse, or Visual Studio Code recommended

---

### 2. Clone the Repository
```bash
git clone https://github.com/Pthao4/newsManagementSystem.git
````

Open the project with your IDE.

---

### 3. Backend Configuration

Create a file named `application.properties` in `src/main/resources` with the following content:

```properties
spring.application.name=backend

# Database configuration
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=db_name;encrypt=true;trustServerCertificate=true
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA / Hibernate configuration
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

# JWT configuration
jwt.secret=your_secret_key
jwt.expiration=86400000
```

Run the backend:

```bash
./mvnw spring-boot:run
```

Backend runs on **[http://localhost:8080](http://localhost:8080)** by default.

---

### 4. Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Run the frontend:

```bash
npm run dev
# or
yarn dev
```

Frontend runs on **[http://localhost:5173](http://localhost:5173)** by default.

---

## Testing

Backend unit tests can be run with:

```bash
./mvnw test
```

---

## License

This project is free to use and modify for learning and personal development purposes.

