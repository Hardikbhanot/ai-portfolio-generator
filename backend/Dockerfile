# ---- Build Stage ----
FROM eclipse-temurin:24-jdk-alpine AS build


# Set working directory inside container
WORKDIR /app

# Copy Gradle wrapper and config files first (for better caching)
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Make Gradle wrapper executable
RUN chmod +x gradlew

# Copy the rest of the source code
COPY src src

# Build the application without running tests (faster)
RUN ./gradlew clean build -x test

# Rename the executable JAR to a fixed name to simplify copying
# matches any .jar that does not end in -plain.jar
RUN find build/libs -name "*.jar" ! -name "*plain.jar" -exec cp {} build/libs/app.jar \;

# ---- Runtime Stage ----
FROM eclipse-temurin:24-jdk-alpine


# Set working directory
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/build/libs/app.jar app.jar

# Expose port 8080 (Render will map PORT env var)
EXPOSE 8080

# Start the application
CMD ["java", "-jar", "app.jar"]
