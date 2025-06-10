// eslint-disable-next-line @next/next/no-duplicate-head

import Header from "~/components/common/header";
import "./globals.css";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "MuffinCSS",
  description: "My App Description",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme");
  return (
    <html lang="en" className={theme?.value}>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
