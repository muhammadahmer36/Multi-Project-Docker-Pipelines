#with more additional publish command 

# Set a .NET version argument for flexibility
ARG VERSION=6.0-alpine

# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:$VERSION AS build-env

WORKDIR /app

# Copy source files and restore dependencies
COPY . .
RUN dotnet restore

# Publish as a self-contained application (optional for simplicity)
RUN dotnet publish -c Release -o /app/output \
    --self-contained true \
    -r alpine-x64 \
    /p:PublishReadyToRun=false \
    /p:PublishSingleFile=true

# Stage 2: Create a minimal runtime image
FROM mcr.microsoft.com/dotnet/runtime-deps:$VERSION
ENV COMPlus_EnableDiagnostics=0
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1

# # Install necessary libraries and packages
# RUN apk add --no-cache icu-libs krb5-libs libgcc libintl libssl1.1 libstdc++ zlib \
#     && apk add --no-cache libgdiplus --repository https://dl-cdn.alpinelinux.org/alpine/v3.17/community/ \
#     && apk add --no-cache font-noto-cjk font-terminus font-noto font-misc-misc font-ipa font-jis-misc fontconfig \
#     && fc-cache -f -v

# Install necessary libraries and packages
  RUN apk add --no-cache icu-libs krb5-libs libgcc libintl libstdc++ zlib libssl3 \
    && apk add --no-cache libgdiplus --repository https://dl-cdn.alpinelinux.org/alpine/v3.17/community/ \
    && apk add --no-cache font-noto-cjk font-terminus font-noto font-misc-misc font-ipa font-jis-misc fontconfig \
    && fc-cache -f -v


# Set application directory and add application files from the build stage
ENV APP_DIR="/app/DockerNetExample"
WORKDIR $APP_DIR
COPY --from=build-env /app/output .

# Expose the desired port and set app to run as a non-root user
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80
USER nobody

# Set entry point
ENTRYPOINT ["./DockerNetExample"]
