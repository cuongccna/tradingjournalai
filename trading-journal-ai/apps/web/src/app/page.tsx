import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Trading Journal AI</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-gray-200">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Track Your Trading Journey with AI
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Professional trading journal with advanced analytics, automated tracking, 
            and AI-powered insights to help you become a better trader.
          </p>
          <div className="space-x-4">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">
              📊 Advanced Analytics
            </h3>
            <p className="text-gray-400">
              Comprehensive performance metrics, equity curves, and risk analysis
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">
              🤖 AI-Powered Insights
            </h3>
            <p className="text-gray-400">
              Get personalized recommendations and pattern detection with AI
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">
              🔄 Auto-Sync Trading
            </h3>
            <p className="text-gray-400">
              Connect to exchanges and brokers for automatic trade import
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}