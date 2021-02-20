# Stage 1
# Install dependencies
# Transpile TyepScript code to JavaScript 
FROM node:14.15.5 AS builder

WORKDIR /usr/app

COPY package.json .

COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

RUN npm run build


# Stage 2
# Install dependencies
# Copy transpiled JavaScript code from stage 1 
FROM node:14.15.5-alpine3.10

USER node

RUN mkdir /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json .

COPY --chown=node:node yarn.lock .

RUN yarn install --frozen-lockfile --production

COPY --from=builder --chown=node:node /usr/app/dist ./src

EXPOSE 5000

CMD ["npm", "run", "start"]
