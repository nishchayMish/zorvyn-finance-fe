import Link from "next/link";
import { 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  PieChart, 
  Shield, 
  Users, 
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10% ] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 bg-black/50 backdrop-blur-md">
        <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <BarChart3 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Zorvyn
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#security" className="hover:text-white transition-colors">Security</Link>
            <Link href="#analytics" className="hover:text-white transition-colors">Analytics</Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-neutral-300 hover:text-white">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-white text-black hover:bg-neutral-200 shadow-xl shadow-white/5 transition-all active:scale-95">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-32 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-purple-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Platform version 2.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-[1.1]">
            Financial analytics for the <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">next generation.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12">
            Zorvyn provides a powerful, role-based dashboard for tracking expenses, 
            visualizing trends, and managing team access with clinical precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button size="lg" asChild className="h-12 px-8 bg-white text-black hover:bg-neutral-200">
              <Link href="/signup">
                Start for Free <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 border-white/10 hover:bg-white/5">
              Book a Demo
            </Button>
          </div>

          {/* Interactive Mockup Container */}
          <div className="relative max-w-5xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative aspect-[16/10] bg-neutral-900 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
              {/* Fake Browser Top Bar */}
              <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                </div>
              </div>
              
              {/* Fake Dashboard Content */}
              <div className="p-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 rounded-2xl bg-white/5 border border-white/5 p-4 space-y-2">
                       <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                       <div className="h-8 w-3/4 bg-white/20 rounded"></div>
                    </div>
                    <div className="h-32 rounded-2xl bg-white/5 border border-white/5 p-4 space-y-2">
                       <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                       <div className="h-8 w-3/4 bg-white/20 rounded"></div>
                    </div>
                  </div>
                  <div className="h-64 rounded-2xl bg-white/5 border border-white/5 p-6 flex flex-col justify-end gap-2">
                     <div className="flex items-end gap-2 h-full">
                       {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4].map((h, i) => (
                         <div key={i} className="flex-1 bg-purple-500/30 rounded-t-lg transition-all hover:bg-purple-500/50" style={{ height: `${h * 100}%` }}></div>
                       ))}
                     </div>
                  </div>
                </div>
                <div className="space-y-6">
                   <div className="h-full rounded-2xl bg-white/5 border border-white/5 p-6 space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-white/10"></div>
                             <div className="space-y-1">
                                <div className="h-3 w-20 bg-white/10 rounded"></div>
                                <div className="h-2 w-12 bg-white/5 rounded"></div>
                             </div>
                          </div>
                          <div className="h-3 w-10 bg-white/10 rounded"></div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-32 border-t border-white/5">
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Built for scale.</h2>
            <p className="text-neutral-400 max-w-xl">
              From individual tracking to enterprise teams, Zorvyn handles it all 
              with a suite of advanced features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-purple-500" />}
              title="Role-Based Security"
              description="Define Viewers, Analysts, and Admins to control who can manage financial records."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-indigo-500" />}
              title="Real-time Analytics"
              description="Get instant insights into your income, expenses, and net balance with live calculations."
            />
            <FeatureCard 
              icon={<PieChart className="w-6 h-6 text-blue-500" />}
              title="Visual Trends"
              description="Beautifully mapped charts show your spending habits and financial growth over time."
            />
          </div>
        </section>

        {/* Trust/Security Section */}
        <section id="security" className="bg-white/[0.02] border-y border-white/5 py-32">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Enterprise-grade security as standard.</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-purple-500" /></div>
                  <div>
                    <h4 className="font-semibold text-white">Encrypted Data</h4>
                    <p className="text-sm text-neutral-400">All financial details are encrypted at rest and in transit.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-purple-500" /></div>
                  <div>
                    <h4 className="font-semibold text-white">Activity Logs</h4>
                    <p className="text-sm text-neutral-400">Track every change with detailed audit logs for admin oversight.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-purple-500" /></div>
                  <div>
                    <h4 className="font-semibold text-white">OAuth Integration</h4>
                    <p className="text-sm text-neutral-400">Secure sign-in with managed identity providers.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent rounded-3xl border border-white/10 p-12 flex items-center justify-center">
                 <Shield className="w-48 h-48 text-white/10" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-full border border-white/20 flex items-center justify-center animate-pulse">
                        <Lock className="w-12 h-12 text-white" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 py-32 text-center">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
             <StatItem label="Active Users" value="10k+" />
             <StatItem label="Transactions" value="$2.4M" />
             <StatItem label="Uptime" value="99.9%" />
             <StatItem label="Countries" value="45+" />
           </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 mb-32">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-purple-600 to-indigo-900 px-8 py-20 text-center">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Ready to master your finances?</h2>
              <p className="text-purple-100 max-w-xl mx-auto mb-10 text-lg opacity-80">
                Join thousands of users who have streamlined their financial 
                tracking and team management with Zorvyn.
              </p>
              <Button size="lg" asChild className="h-12 px-10 bg-white text-black hover:bg-neutral-100">
                <Link href="/signup">Create Free Account</Link>
              </Button>
            </div>
            {/* Abstract Background for CTA */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
               <div className="absolute top-[-50%] right-[-10%] w-[100%] h-[200%] bg-white/20 rotate-45 blur-3xl"></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 pt-20 pb-10 bg-black">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <BarChart3 className="text-white w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">Zorvyn</span>
            </div>
            <p className="text-neutral-500 max-w-xs text-sm">
              The professional finance dashboard for teams who care about clarity, 
              security, and reliable data visualization.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-sm">Product</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#security" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Solutions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-sm">Company</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5">
          <p className="text-xs text-neutral-600">© 2026 Zorvyn Finance. All rights reserved.</p>
          <div className="flex items-center gap-6">
             <Link href="#" className="text-neutral-600 hover:text-white transition-colors text-xs font-medium uppercase tracking-widest">Twitter</Link>
             <Link href="#" className="text-neutral-600 hover:text-white transition-colors text-xs font-medium uppercase tracking-widest">LinkedIn</Link>
             <Link href="#" className="text-neutral-600 hover:text-white transition-colors text-xs font-medium uppercase tracking-widest">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-all duration-300">
      <div className="mb-6 p-3 rounded-2xl bg-white/5 w-fit border border-white/5 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-2">
      <div className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-xs font-medium text-purple-500 uppercase tracking-widest">{label}</div>
    </div>
  );
}
