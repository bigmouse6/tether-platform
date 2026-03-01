import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TronixWallet - Secure Tron Cryptocurrency Wallet",
  description: "TronixWallet is a secure and user-friendly cryptocurrency wallet for Tron (TRX) and TRC-20 tokens. Send, receive, and manage your digital assets with ease.",
  keywords: "tron wallet, trx wallet, cryptocurrency wallet, trc-20 wallet, blockchain wallet, secure crypto wallet",
  authors: [{ name: "TronixWallet", url: "https://tronixwallet.com" }],
  openGraph: {
    title: "TronixWallet - Secure Tron Cryptocurrency Wallet",
    description: "The most secure and easy-to-use Tron wallet for managing your TRX and TRC-20 tokens",
    url: "https://tronixwallet.com",
    siteName: "TronixWallet",
    images: [
      {
        url: "https://tronixwallet.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "TronixWallet - Secure Tron Wallet",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TronixWallet - Secure Tron Cryptocurrency Wallet",
    description: "The most secure and easy-to-use Tron wallet",
    images: ["https://tronixwallet.com/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Google Search Console təsdiqləmə kodu
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to TronixWallet</h1>
        <p className="text-xl text-center mb-8">
          The most secure and user-friendly Tron cryptocurrency wallet
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Secure</h2>
            <p>Your assets are protected with enterprise-grade security</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Fast</h2>
            <p>Instant transactions on the Tron network</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Easy to Use</h2>
            <p>Simple interface for beginners and experts alike</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link 
            href="/dashboard" 
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}