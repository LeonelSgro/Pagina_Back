# Base de Node.js
FROM node:18

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluir dependencias de desarrollo para compilar)
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto (si usa TypeScript o alguna herramienta de build)
RUN npm run build

# Exponer el puerto que usa la app
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]