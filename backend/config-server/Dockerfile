FROM eclipse-temurin:17

# Install curl (optional)
RUN apt-get update && apt-get install -y curl && apt-get clean

WORKDIR /app

COPY target/repo-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
