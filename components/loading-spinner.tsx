// Fun loading spinner for the task tracker app

import * as React from "react"
import { cn } from "@/lib/utils"

const messages = [
  "Convincing the internet gremlins to cooperate...",
  "Wrangling pixels and herding bytes...",
  "Teaching AI to juggle ones and zeros...",
  "Untangling the web of infinite possibilities...",
  "Politely asking the server to hurry up...",
  "I swear I am trying my best...",
  "Ahhhh, it's just not working, or is it....!"
]

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, ...props }, ref) => {
    const getRandomMessage = () => messages[Math.floor(Math.random() * messages.length)]
    const [message, setMessage] = React.useState(getRandomMessage())

    React.useEffect(() => {
      const interval = setInterval(() => {
        setMessage(getRandomMessage())
      }, 5000)

      return () => clearInterval(interval)
    }, [])

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center", className)}
        {...props}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4">
          {message}
        </p>
      </div>
    )
  }
)

LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner }