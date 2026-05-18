import "./globals.css";

export const metadata = {
  title: "Archivo Hermético — Identificación esotérico-política",
  description: "Cuestionario hermético-político que identifica al político español con el que compartes mayor afinidad esotérica. Una logia delirante con humor seco y reverencia exigua.",
  openGraph: {
    title: "Archivo Hermético",
    description: "¿Qué político español eres en clave esotérica? Test delirante de la Logia del Tedio.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=IM+Fell+English:ital@0;1&family=Special+Elite&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
