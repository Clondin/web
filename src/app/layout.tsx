import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "Kayco Benefits Portal | 2025-2026 Health Plan Comparison",
  description: "Your personalized benefits decision hub. Compare health plans, model costs with your real scenarios, and find the perfect plan for you and your family.",
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
        <footer className="bg-gradient-to-r from-slate-900 to-slate-800 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <div>
                  <span className="font-bold text-white text-lg">Kayco</span>
                  <span className="font-light text-slate-300 ml-1">Benefits</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-sm text-slate-400">
                  Open Enrollment 2026
                </p>
                <span className="hidden md:block w-px h-4 bg-slate-600"></span>
                <p className="text-sm text-slate-400">
                  Questions? <span className="text-amber-400 font-medium cursor-pointer hover:text-amber-300">Contact HR</span>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
