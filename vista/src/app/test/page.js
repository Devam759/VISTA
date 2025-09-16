import Link from "next/link";

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">✅ Test Page</h1>
        <p className="text-gray-600 mb-8">If you can see this, the routing is working!</p>
        <Link href="/" className="btn btn-primary">Go Home</Link>
      </div>
    </div>
  );
}
