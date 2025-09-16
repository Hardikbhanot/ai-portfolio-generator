# Use a build stage with a JDK to compile
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copy only what is needed for build to speed up build
COPY ./backend/gradle ./gradle
COPY ./backend/gradlew ./gradlew
COPY ./backend/build.gradle ./backend/settings.gradle ./backend/gradle.* ./

# If you have settings.gradle in root/backend, adjust path accordingly
RUN chmod +x ./gradlew

COPY ./backend/src ./src
# Copy other needed files
COPY ./backend/src/main/resources ./src/main/resources

# Build the project, skipping tests for speed (optional)
RUN ./gradlew clean build -x test

# Runtime stage
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

# Run the app
ENTRYPOINT ["java","-jar","app.jar"]
