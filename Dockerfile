# 1. Start with a blank Linux computer that already has Node 20 installed
FROM node:20

# 2. Create a folder inside this new computer called /app and move into it
WORKDIR /app

# 3. Copy ONLY your package.json files first (this is a speed trick for Docker)
COPY package*.json ./

# 4. Tell the new computer to install all your dependencies (Express, CORS, etc.)
RUN npm install

# 5. Copy the Prisma schema separately and generate the database client 
COPY prisma ./prisma/
RUN npx prisma generate

# 6. Copy the rest of your code (index.js, etc.) into the /app folder
COPY . .

# 7. Open port 3001 on the container so traffic can get in
EXPOSE 3001

# 8. The command to run when the container finally wakes up!
CMD ["node", "index.js"]
