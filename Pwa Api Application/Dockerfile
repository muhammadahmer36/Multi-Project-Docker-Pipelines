#Updated docker file with necessaries libraries


# Set a .NET version argument for flexibility
ARG VERSION=6.0-alpine

# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:$VERSION AS build-env

WORKDIR /app

# Copy source files and restore dependencies
COPY ["EcotimeMobileAPI.csproj", "."]
RUN dotnet restore "./EcotimeMobileAPI.csproj"

# Copy the rest of the application and build it
COPY . .
RUN dotnet build "EcotimeMobileAPI.csproj" -c Release -o /app/build

# Stage 2: Publish the application (self-contained, Alpine runtime, single file, ready-to-run)
RUN dotnet publish "EcotimeMobileAPI.csproj" -c Release -o /app/output \
    --self-contained true \
    -r alpine-x64 \
    /p:PublishReadyToRun=true \
    /p:PublishSingleFile=true

# Stage 3: Create a minimal runtime image
FROM mcr.microsoft.com/dotnet/runtime-deps:$VERSION

# Install necessary libraries and packages for Alpine
RUN apk add --no-cache icu-libs krb5-libs libgcc libintl libstdc++ zlib libssl3 \
    && apk add --no-cache libgdiplus --repository https://dl-cdn.alpinelinux.org/alpine/v3.17/community/ \
    && apk add --no-cache font-noto-cjk font-terminus font-noto font-misc-misc font-ipa font-jis-misc fontconfig \
    && fc-cache -f -v

# Set application directory and copy application files from the build stage
WORKDIR /app
COPY --from=build-env /app/output .  
# Make sure /app/output is the correct path after build

# Expose the desired port and set app to run as a non-root user
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80
USER nobody

# Set entry point
ENTRYPOINT ["./EcotimeMobileAPI"]
