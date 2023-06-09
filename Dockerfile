# Step 1
FROM node:18 AS builder
ENV NODE_ENV build
WORKDIR /app
COPY . /app
RUN yarn && yarn build

### BASE
FROM node:18-alpine AS base
LABEL maintainer "Cute_Wisp <sweatpotato13@gmail.com>"
# Set the working directory
WORKDIR /app
# Copy project specification and dependencies lock files
COPY package.json yarn.lock tsconfig.json /tmp/

### RELEASE
FROM base AS development
# Copy app sources
COPY --from=builder /app/dist/ ./dist
COPY ./tsconfig.json .
COPY ./package.json .
# Copy dependencies
COPY --from=builder /app/node_modules ./node_modules

CMD ["yarn", "start"]