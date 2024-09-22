import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Banner from '@/components/banner'
import Card from '@/components/card'
import { fetchCoffeeStores } from '@/lib/coffee-store'
import useTracklocation from '@/hooks/use-track-location'
import { useContext, useEffect, useState } from 'react'
import { ACTION_TYPES, StoreContext } from '@/store/store-context'
//import coffeStoresData from '../data/coffee-stores.json'

const inter = Inter({ subsets: ['latin'] })

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores()
  return {
    props: {
      coffeeStores
    }
  }
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg,
    isFindingLocation } = useTracklocation()
  const handleOnBannerClick = () => {
    handleTrackLocation()
  }
  //const [coffeeStores, setCoffeeStores] = useState('')
  const [coffeeStoresError, setcoffeeStoresError] = useState(null)
  const { dispatch, state } = useContext(StoreContext)
  const { coffeeStores, latlong } = state

  useEffect(() => {
    async function setCoffeStoreByLocation() {
      if (latlong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latlong=${latlong}&limit=30`
            )
          //setCoffeeStores(fetchedCoffeeStores)
          const coffeeStores = await response.json()
          setcoffeeStoresError("")
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores }
          })
        } catch (error) {
          setcoffeeStoresError(error.message)
        }
      }
    }
    setCoffeStoreByLocation()
  }, [latlong])

  return (
    <>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Coffe Connoisseur" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner buttonText={!isFindingLocation ? "View stores nearby" : "Locating..."} handleOnClick={handleOnBannerClick} />
        <div className={styles.heroImage} >
          <Image src="/static/hero-image.png" alt='hero-image' width={700} height={400} />
        </div>
        {locationErrorMsg && <p>Someting went wrong:{locationErrorMsg}</p>}
        {coffeeStoresError && <p>Someting went wrong:{coffeeStoresError}</p>}
        {
          coffeeStores.length > 0 && (
            <div>
              <h2 className={styles.heading2}>{coffeeStores[0].region}|{coffeeStores[0].locality} stores</h2>
              <div className={styles.cardLayout}>
                {
                  coffeeStores.map((coffeeStore) => {
                    return (
                      <Card name={coffeeStore.name}
                        imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                        href={`/coffee-shop/${coffeeStore.id}`}
                        className={styles.card}
                        key={coffeeStore.id}
                      />
                    )
                  })
                }

              </div>
            </div>
          )
        }
        <div className={styles.sectionWrapper}>
          {props.coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading2}>Shops near me</h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={
                        coffeeStore.imgUrl ||
                        "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                      }
                      href={`/coffee-store/${coffeeStore.id}`}
                      className={styles.card}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
