import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Casa Aurora | Reservas",
  description: "Portal minimalista para reservas de habitaciones"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="page">{children}</div>
      </body>
    </html>
  );
}
