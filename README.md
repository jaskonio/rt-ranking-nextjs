This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Init

exmaple .env file:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
```

```bash
docker run --name develop -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password  -d postgres

docker start develop
docker stop develop
docker rm develop
```

Run Prisma:

```bash
npx prisma migrate dev --name "NAME"
npx prisma db pull
npx prisma studio

npx prisma db seed
```

## TODO

Funcionalidades:
    - permitir diferentes criterios de puntuación en la liga.
    - mostrar estadísticas adicionales en la clasificación. Por ejemplo, tiempos promedio en todas las carreras, consistencia en posiciones (mejores, peores), o gráficas de progreso
    - implementar una función para comparar dos o más corredores en su desempeño
    - personalizar los puntos que cada posición otorga en la liga
    - incluir resúmenes visuales o gráficos de resultados
    - los resultados se actualicen automáticamente y bajo demanda
    - roles de usuario en la app
    - permitir la importación automática de resultados desde otras plataformas
