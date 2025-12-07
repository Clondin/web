import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "HealthPlan Compare | 2025-2026 Benefits Comparison Tool",
  description: "Compare and model your health insurance costs. Explore all company health plans, adjust personal variables, and find the best plan for your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
                <span className="font-semibold text-slate-700">HealthPlan Compare</span>
              </div>
              <p className="text-sm text-slate-500">
                Open Enrollment 2026 &bull; Questions? Contact HR
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
