import Link from "'next/link'"
import { Button } from "@/components/ui/button"
import { SignUpForm } from "'@/components/signup-form'"

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-center">Sign Up for Spartanville</h1>
        <SignUpForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Button variant="link" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

