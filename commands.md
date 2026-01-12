# Commands

## Prisma
`pnpm --filter api exec prisma migrate dev --name init`
`zpnpm --filter api exec prisma generate`

## More
`pnpm --filter api exec prisma studio`
`pnpm exec prisma studio --url="postgresql://app:app@localhost:5432/order_tracking?schema=public"`
`pnpm approve-builds`
`docker compose up -d`

## Run Servers
`pnpm dev`

### Backend only
`pnpm --filter api dev`

### Frontend only
`pnpm --filter web dev`