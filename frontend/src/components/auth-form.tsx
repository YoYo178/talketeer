import { useState } from "react"
import { MessagesSquare, ArrowLeft } from "lucide-react"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLoginMutation } from "@/hooks/network/auth/useLoginMutation"
import { useSignupMutation } from "@/hooks/network/auth/useSignupMutation"
import { useCheckEmailMutation } from "@/hooks/network/auth/useCheckEmailMutation"
import { AxiosError } from "axios"

// Validation schemas
const emailSchema = z.object({
  email: z.email("Please enter a valid email address")
})

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
})

const signupSchema = z.object({
  email: z.email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().min(1, "Display name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters")
})

type FormState = "email" | "login" | "signup"

export function AuthForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formState, setFormState] = useState<FormState>("email")
  const [email, setEmail] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    displayName: "",
    username: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loginMutation = useLoginMutation({ queryKey: ["auth", "login"] })
  const signupMutation = useSignupMutation({ queryKey: ["auth", "signup"] })
  const checkEmailMutation = useCheckEmailMutation({ queryKey: ["auth", "check-email"] })

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const validatedData = emailSchema.parse({ email })
      setEmail(validatedData.email)
      setFormData(prev => ({ ...prev, email: validatedData.email }))

      // Use the actual API to check if user exists
      const response = await checkEmailMutation.mutateAsync({
        payload: { email: validatedData.email }
      })

      if (response?.success) {
        // If the User exists, show login form
        setFormState("login")
      } else {
        // Otherwise display the signup form
        setFormState("signup")
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      } else if (error instanceof AxiosError) {
        // Here, we expect a 404 from the backend
        if (!error.response?.data?.success) {
          if (error.response?.status === 404) {
            // User does not exist, show signup form
            setFormState("signup")
          } else {
            // We have an unexpected error
            const response = error.response?.data;
            const errorMessage = response?.message || "Something went wrong. Please try again."
            setErrors({ email: errorMessage })
          }
        }
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' })
      }
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    try {
      const validatedData = loginSchema.parse({
        email: formData.email,
        password: formData.password
      })

      await loginMutation.mutateAsync({
        payload: validatedData
      })
      // Handle successful login (redirect, etc.)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      } else if (error instanceof AxiosError) {
        // Here, we expect 2 errors from the backend:
        // - A '404 Not Found' signifies that there is no user associated with this email (highly unlikely with the current flow of the application)
        // - A '400 Bad Request' signifies that the user entered invalid password or the fields are malformed
        if (!error.response?.data?.success) {
          const response = error.response?.data;
          const errorMessage = response?.message || "Invalid email or password"

          // Check if it's a user not found or invalid password error
          if (error.response?.status === 404) {
            setErrors({ email: errorMessage })
          } else if (error.response?.status === 400) {
            setErrors({ password: errorMessage })
          } else {
            setErrors({ general: errorMessage })
          }
        }
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' })
      }
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const validatedData = signupSchema.parse(formData)

      await signupMutation.mutateAsync({
        payload: {
          name: `${validatedData.firstName} ${validatedData.lastName}`,
          displayName: validatedData.displayName,
          username: validatedData.username,
          email: validatedData.email,
          password: validatedData.password
        }
      })
      // Handle successful signup (redirect, etc.)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      } else if (error instanceof AxiosError) {
        // Here, we expect a 409 Conflict, in case the email (unlikely) or username already exists
        if (!error.response?.data?.success) {
          const response = error.response?.data;
          const errorMessage = response?.message || "Registration failed. Please try again."

          // Check if it's a username or email conflict error
          if (error.response?.status === 409) {
            if (errorMessage.toLowerCase().includes('username')) {
              setErrors({ username: errorMessage })
            } else if (errorMessage.toLowerCase().includes('email')) {
              setErrors({ email: errorMessage })
            } else {
              setErrors({ general: errorMessage })
            }
          } else {
            setErrors({ general: errorMessage })
          }
        }
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const resetToEmail = () => {
    setFormState("email")
    setErrors({})
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      displayName: "",
      username: ""
    })
  }

  const renderEmailForm = () => (
    <form onSubmit={handleEmailSubmit}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-red-500" : ""}
            required
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </div>
    </form>
  )

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetToEmail}
            className="p-1 h-auto"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Welcome back! Please enter your password.
          </span>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={errors.password ? "border-red-500" : ""}
            required
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  )

  const renderSignupForm = () => (
    <form onSubmit={handleSignupSubmit}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetToEmail}
            className="p-1 h-auto"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Create your account
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={errors.firstName ? "border-red-500" : ""}
              required
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={errors.lastName ? "border-red-500" : ""}
              required
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="John Doe"
            value={formData.displayName}
            onChange={(e) => handleInputChange("displayName", e.target.value)}
            className={errors.displayName ? "border-red-500" : ""}
            required
          />
          {errors.displayName && (
            <p className="text-sm text-red-500">{errors.displayName}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            className={errors.username ? "border-red-500" : ""}
            required
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={errors.password ? "border-red-500" : ""}
            required
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <p className="text-sm text-red-500 text-center">{errors.general}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? "Creating account..." : "Create Account"}
        </Button>
      </div>
    </form>
  )

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a
            href="#"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex size-8 items-center justify-center rounded-md">
              <MessagesSquare className="size-6" />
            </div>
            <span className="sr-only">Talketeer</span>
          </a>
          <h1 className="text-xl font-bold">Welcome to Talketeer</h1>
          {formState === "email" && (
            <div className="text-center text-sm">
              Enter your email to get started
            </div>
          )}
        </div>

        {formState === "email" && renderEmailForm()}
        {formState === "login" && renderLoginForm()}
        {formState === "signup" && renderSignupForm()}

        {formState === "email" && (
          <>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
            <Button variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </>
        )}
      </div>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
