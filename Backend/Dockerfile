# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/social-network-graph-analyzer-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Render sets the PORT environment variable)
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
