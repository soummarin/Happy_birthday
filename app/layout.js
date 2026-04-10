import "./globals.css";

export const metadata = {
  title: "BlowWish AI — Birthday Magic",
  description:
    "Create a personalized birthday experience. Send a magic link, play music, and blow out the candles!",
  keywords: "birthday, wishes, candles, interactive, music, confetti",
  openGraph: {
    title: "BlowWish AI — Birthday Magic ✨",
    description: "Create a personalized birthday experience with candle-blowing detection!",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Pacifico&family=Cairo:wght@300;400;600;700;900&display=swap"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎂</text></svg>"
        />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('blowwish-theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
