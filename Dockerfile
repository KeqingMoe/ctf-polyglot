FROM nikolaik/python-nodejs:python3.13-nodejs22-alpine AS base

FROM base AS builder
WORKDIR /app

COPY ./polyglot ./
RUN npm i

COPY . /app
RUN npx nuxt build


FROM base AS runner
WORKDIR /app

COPY --from=builder /app/.output ./

ENV CTF_FLAG=flag{KeqingMoe_thinks_you_are_really_a_nice_person}
EXPOSE 3000

CMD ["node", "server/index.mjs"]
