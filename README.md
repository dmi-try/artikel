# Artikel App

A card game to help learn German articles. The words are from the textbook "Deutsch in Alltag und Beruf" A1 Intensivtrainer.

Online Version: [https://der.dima5.ru/](https://der.dima5.ru/)

## Running

### Docker

To run locally via Docker (e.g., on [http://localhost:3000/](http://localhost:3000/)):
```bash
docker run -d -p 3000:80 dpyzhov/artikel
```

### Build from source

Build and run the project ([http://localhost:4173/](http://localhost:4173/)):
```bash
npm install
npm run build
npm run preview
```

### Development Mode

To run in development mode ([http://localhost:5173/](http://localhost:5173/)):
```bash
npm install
npm run dev
```
