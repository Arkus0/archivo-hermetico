# Archivo Hermético

Cuestionario hermético-político delirante que identifica al político español con el que el sujeto comparte mayor afinidad esotérica. Una logia inventada con humor seco y reverencia exigua.

## Cómo funciona

1. El sujeto elige profundidad: breve (30), estándar (50) o exhaustivo (80) preguntas.
2. El banco completo tiene 90 preguntas — se barajan en cada partida.
3. El matcher determinista calcula afinidades con un pool de 30 políticos españoles (de Olivares y Godoy a Sánchez, Ayuso y Puigdemont, pasando por Pasionaria, Carrero o Franco).
4. Algoritmo: cada respuesta del usuario se compara contra el perfil precompilado de cada político, con pesado IDF — las opciones raras pesan más que las comunes. Se devuelve un top 3 con porcentaje, justificación pre-escrita y coincidencias específicas.

Sin LLM. Todo precomputado. 100% client-side.

## Stack

- Next.js 14 (App Router)
- React 18
- Sin dependencias adicionales
- Deploy: Vercel

## Desarrollo

```bash
npm install
npm run dev
```

## Estructura

```
app/
  layout.js
  page.js
  globals.css
components/
  IntroScreen.jsx
  QuizScreen.jsx
  LoadingScreen.jsx
  ResultScreen.jsx
  Seal.jsx
lib/
  constants.js     # colores, fuentes
  questions.js     # 90 preguntas
  politicians.js   # 30 políticos con bio + afinidades
  matcher.js       # algoritmo de match con pesado IDF
```

## Aviso

Las "justificaciones" mezclan hechos verificables con detalles míticos completamente inventados, en un registro de archivero delirante. Cualquier coincidencia con la realidad esotérica de la política española es deliberada pero indemostrable.
