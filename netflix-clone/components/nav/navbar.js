
import Link from 'next/link'
import styles from './navbar.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { magic } from '@/lib/magic-client'

const NavBar = () => {
    const [username,setUsername ] = useState("")
    const router = useRouter()
    const [showDropdown, setShowDropdown] = useState(false)

    const handleOnclickHome = (e) => {
        e.preventDefault()
        router.push("/")

    }
    const handleOnclickMyList = (e) => {
        e.preventDefault()
        router.push("/browser/my-list")
    }
    const handleShowDropdown = (e) => {
        e.preventDefault()
        setShowDropdown(!showDropdown)
    }

    const handleSignout = async (e) => {
        e.preventDefault()
        try {
            await magic.user.logout()
            router.push("/login")
        }catch (error) {
            router.push("/login")
        }
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const { email, issuer } = await magic.user.getMetadata()
                console.log(await magic.user.getMetadata())
                const didToken = await magic.user.getIdToken()
                if (email) {
                    setUsername(email)

                }
            } catch (error) {

            }
        }
        getUser()
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <a className={styles.logoLink} href='/'>
                    <div className={styles.logoWrapper}>
                        <Image src={"/static/netflixLogo.svg"}
                            alt="Netflix Logo"
                            width={"128"}
                            height={"34"}
                        />
                    </div>
                </a>

                <ul className={styles.navItems}>
                    <li className={styles.navItem} onClick={handleOnclickHome}>Home</li>
                    <li className={styles.navItem2} onClick={handleOnclickMyList}>My List</li>
                </ul>
                <nav className={styles.navContainer}>
                    <div>
                        <button className={styles.usernameBtn}
                            onClick={handleShowDropdown}
                        >
                            <p className={styles.username}>{username}</p>
                            <Image src={"/static/expand_more.svg"}
                                alt='expand more'
                                width={"24"}
                                height={"24"}
                            />

                        </button>
                        {showDropdown &&
                            (<div className={styles.navDropdown}>
                                <div>
                                    <Link className={styles.linkName} 
                                        href=""
                                        onClick={handleSignout}
                                    >
                                        Sing out
                                    </Link>
                                    <div className={styles.lineWrapper}></div>
                                </div>
                            </div>)}
                    </div>

                </nav>
            </div>
        </div >
    )
}

export default NavBar;