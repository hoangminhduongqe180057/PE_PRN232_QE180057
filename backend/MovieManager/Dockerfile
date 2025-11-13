# ----- Giai đoạn 1: Build -----
# Sử dụng image .NET SDK (Software Development Kit) để build ứng dụng
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Sao chép file solution và project để restore dependencies
# Điều này tận dụng Docker cache. Nếu code không thay đổi, bước restore sẽ không chạy lại.
COPY ["MovieManager.sln", "."]
COPY ["MovieManager/MovieManager.csproj", "MovieManager/"]

# Chạy restore dependencies cho solution
RUN dotnet restore "MovieManager.sln"

# Sao chép toàn bộ source code còn lại
COPY . .

# Build và publish ứng dụng với cấu hình Release
WORKDIR "/src/MovieManager"
RUN dotnet publish "MovieManager.csproj" -c Release -o /app/publish

# ----- Giai đoạn 2: Final -----
# Sử dụng image ASP.NET runtime nhỏ gọn hơn để chạy ứng dụng
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Thiết lập biến môi trường để app lắng nghe trên port 8080
# Đây là port mặc định mới cho .NET trong container
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Entry point để chạy ứng dụng của bạn
ENTRYPOINT ["dotnet", "MovieManager.dll"]