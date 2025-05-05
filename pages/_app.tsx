import type { AppProps } from "next/app"
import { DirectAuthProvider } from "@/contexts/direct-auth-context"
import "@/app/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DirectAuthProvider>
      <Component {...pageProps} />
    </DirectAuthProvider>
  )
}
