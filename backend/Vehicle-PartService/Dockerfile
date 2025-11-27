# --- Stage 1: Build ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml và tải thư viện
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code và build
COPY src ./src
# Skip test để build nhanh
RUN mvn clean package -DskipTests

# --- Stage 2: Run ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy file jar
COPY --from=build /app/target/*.jar app.jar

# Mở cổng 8086 (Vehicle Part Service)
EXPOSE 8086

ENTRYPOINT ["java", "-jar", "app.jar"]