import Link from 'next/link'

export default function ErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      
      <div className="card w-full max-w-md p-8 text-center">
        
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white">
          Authentication Error
        </h1>

        {/* Message */}
        <p className="text-muted mt-3 leading-relaxed">
          Something went wrong while processing your request.
          Please check your credentials and try again.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-4 mt-8">
          
          <Link
            href="/login"
            className="primary text-center"
          >
            Back to Login
          </Link>

          <Link
            href="/"
            className="secondary text-center"
          >
            Go Home
          </Link>

        </div>

      </div>
    </main>
  )
}