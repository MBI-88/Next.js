import Loading from '@/components/loading/loading'
import {  magic } from '@/lib/magic-client'
import '@/styles/globals.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [isLoading, setIsloading] = useState(true)
  useEffect(() => {
    const getLogin = async () => {
      const isLoggedIn = await magic.user.isLoggedIn()
      if (isLoggedIn) {
        router.push("/")
      }else {
        router.push("/login")
      }
    }
    getLogin()
  },[])
  useEffect(() => {
    const handleComplete = () => {
      setIsloading(false)
    }
    router.events.on("routeChangeComplete", handleComplete)
    router.events.on("routeChangeError", handleComplete)
    return () => {
      router.events.off("routeChangeComplete", handleComplete)
      router.events.off("routeChangeComplete", handleComplete)
    }
  }, [router])

  return isLoading ? <Loading/>: <Component {...pageProps} />
}
