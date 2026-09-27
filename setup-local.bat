@echo off
echo ==============================================
echo   RazWeb - Setup Local en C:\RAZ\razweb
echo ==============================================

IF NOT EXIST "C:\RAZ" (
    echo Creando directorio C:\RAZ...
    mkdir C:\RAZ
)

echo Sincronizando dependencias...
call npm install

echo Generando base de datos SQLite y Prisma Client...
call npx prisma db push
call npx prisma generate

echo Iniciando RazWeb en http://localhost:3000...
call npm run dev
