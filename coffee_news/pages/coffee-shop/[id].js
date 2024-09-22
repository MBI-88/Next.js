import { useRouter } from "next/router"
import styles from "@/styles/coffee-store.module.css"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"
//import coffeeStoresData from '../../data/coffee-stores.json'
import cls from "classname"
import { fetchCoffeeStores } from "@/lib/coffee-store"
import { useContext, useEffect, useState } from "react"
import { StoreContext } from "@/store/store-context"
import { fetcher, isEmpty } from "@/utils"
import useSWR from 'swr'


export async function getStaticProps(staticProps) {
    const params = staticProps.params
    const coffeeStores = await fetchCoffeeStores()
    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id; //dynamic id
    })
    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
        },
    }
}

export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores()
    const paths = coffeeStores.map(coffeeStore => {
        return {
            params: {
                id: coffeeStore.id.toString(),
            }
        }
    })
    return {
        paths,
        fallback: true,
    }
}

const CoffeShop = (initialProps) => {
    const router = useRouter()
    const id = router.query.id
    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {})
    const { state: { coffeeStores }, } = useContext(StoreContext)
    const [votecount, setVote] = useState(0)
    const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)



    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.lenght > 0) {
                const coffeeStoreFromContext = coffeeStores.find(
                    (coffeeStore) => {
                        return coffeeStore.id.toString() == id
                    }

                )
                if (coffeeStoreFromContext) {
                    setCoffeeStore(coffeeStoreFromContext)
                    handleCreateCoffeeStore(coffeeStoreFromContext)
                }

            }
        } else {
            //SSG
            handleCreateCoffeeStore(initialProps.coffeeStore)
        }
    }, [id, initialProps, initialProps.coffeeStore])

    useEffect(() => {
        if (data && data.lenght > 0) {
            setCoffeeStore(data[0])
            setVote(data[0].vote)
        }
    }, [data])

    if (router.isFallback) {
        return <div><h6 className={styles.heading2}>Loading...</h6></div>
    }
    const { key, name, address, neighbourhood, imgUrl } = coffeeStore
    const handleUpvoteButton = async () => {
        try {
            const response = await fetch(
                "/api/favouriteCoffeeStoreById", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                }),
            })
            const dbCoffeeStore = await response.json()
            if (dbCoffeeStore && dbCoffeeStore.length > 0) {
                let count = votecount + 1
                setVote(count)
            }
        } catch (err) {

        }

    }
    const handleCreateCoffeeStore = async (coffeeStore) => {
        try {
            const {
                id, region, locality, name, address, neighbourhood, imgUrl
            } = coffeeStore
            const response = await fetch(
                "/api/createCoffeeStore", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    name: name,
                    address: address || "",
                    neighbourhood: neighbourhood || "",
                    vote: 0,
                    imgUrl,
                })
            }
            )
            const dbCoffeeStore = await response.json()
        } catch (err) {
            console.error("Error creating coffee store", err)
        }
    }
    
    if (error) {
        return <div>Something went wrong retrieving coffee store page</div>
    }

    return <div className={styles.layout}>
        <Head>
            <title>{name}</title>
            <meta name="description" content={`${name} coffe store`} />
        </Head>

        <main className={styles.container} key={key}>
            <div className={styles.col1}>
                <Link href="/" className={styles.backToHomeLink}>
                    ← Back to home
                </Link>
                <div className={styles.nameWrapper}>
                    <h1 className={styles.name}>{name}</h1>
                </div>
                <Image
                    src={
                        imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    width={300}
                    height={160}
                    className={styles.storeImg}
                    alt={name} />
            </div>

            <div className={cls("glass", styles.col2)}>
                {
                    address && (
                        <div className={styles.iconWrapper} >
                            <Image
                                src="/static/icons/location.svg" width="48" height="48" alt=".." />
                            <p className={styles.text}>{address}</p>
                        </div>

                    )
                }
                {
                    neighbourhood && (
                        <div className={styles.iconWrapper} >
                            <Image
                                src="/static/icons/nearMe.svg" width="48" height="48" alt=".." />
                            <p className={styles.text}>{neighbourhood}</p>
                        </div>
                    )
                }

                <div className={styles.iconWrapper} >
                    <Image
                        src="/static/icons/vote.svg" width="48" height="48" alt=".." />
                    <p className={styles.text}>{votecount}</p>
                </div>
                <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
                    Up vote!
                </button>
            </div>

        </main>
    </div>
}

export default CoffeShop