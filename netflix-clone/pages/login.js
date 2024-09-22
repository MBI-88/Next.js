import Head from "next/head"
import styles from '@/styles/Login.module.css'
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { magic } from "@/lib/magic-client"


export default function Login() {
    const [userMsg,setUserMsg] = useState("")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    

    const handleOnChangeEmail = (e) =>{
        setUserMsg("")
        const email = e.target.value
        setEmail(email)
    }
    const handleLoginWithEmail =  async (e) => {
        e.preventDefault()
        setEmail(email)
        if (email.includes("@")) {
            try {
               setIsLoading(true)
               const didToken = await magic.auth.loginWithMagicLink({
                    email,
                })
                if (didToken){
                    const response = await fetch('/api/login',{
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${didToken}`,
                            'Content-Type': 'application/json',
                        }
                    })
                    const loggedInResponse = await response.json()
                    if (loggedInResponse.done) {
                        router.push("/")
                    }else {
                        setIsLoading(false)
                        setUserMsg("Something went wrong logging in")
                    }
                }

            }catch (e) {

            }
        } else {
            setUserMsg("Enter a valid email address")
            setIsLoading(false)
        }

    } 

    useEffect(() => {
        const handleComplete = () => {
            setIsLoading(false)
        }
        router.events.on("routeChangeComplete",handleComplete)
        router.events.on("routeChangeError",handleComplete)
        return () => {
            router.events.off("routeChangeComplete",handleComplete)
            router.events.off("routeChangeComplete",handleComplete)
        }
    },[router])

    return (
        <div className={styles.container}>
            <Head>
                <title>Netflix SignIn</title>
            </Head>

            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <Link className={styles.logoLink} href="/">
                        <div className={styles.logoWrapper}>
                            <Image
                                src="/static/netflixLogo.svg"
                                alt="Netflix logo"
                                width="128"
                                height="34"
                            />
                        </div>
                    </Link>
                </div>
            </header>
                <main className={styles.main}>
                    <div className={styles.mainWrapper}>
                        <h1 className={styles.signinHeader}>Sign In</h1>
                        <input type="text" placeholder="Email address"
                            className={styles.emailInput}
                            onChange={handleOnChangeEmail}
                        />
                        <p className={styles.userMsg}>
                            {userMsg}
                        </p>
                        <button onClick={handleLoginWithEmail}
                            className={styles.loginBtn}
                           
                        >
                           {isLoading ? 'Loading...': "Sign In"} 
                        </button>
                    </div>

                </main>
        </div>
    )
}