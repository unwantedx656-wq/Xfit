/**
 * XFIT — Root Layout (Server Component)
 */
import './globals.css';

export const metadata = {
  title: 'Xfit — Tu Entrenamiento Inteligente',
  description: 'App de entrenamiento de fuerza offline-first con aprendizaje adaptativo',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6200EE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
