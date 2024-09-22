import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Banner from '@/components/banner/banner'
import NavBar from '@/components/nav/navbar'
import SectionCards from '@/components/card/section-cards'
import { getPopularVideos, getVideos } from '@/lib/videos'


const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps() {
  const disneyVideos = await getVideos('disney trailer')
  const productivityVideos = await getVideos('productivity')
  const travelVideos = await getVideos('travel videos')
  const popularVideos = await getPopularVideos()
  //const whatchAgain = await getVideos('disney trailer')
  return { props: { disneyVideos, travelVideos, productivityVideos, popularVideos } }
}

export default function Home({ disneyVideos, travelVideos, productivityVideos, popularVideos }) {


  return (
    <div >
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <NavBar/>
        <Banner 
          videoId="4zH5iYM4wJo"
          title='Clifford the red dog'
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp" 
        />

        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards title="Productivity" videos={productivityVideos} size="medium" />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
          <SectionCards title="Watch it again" videos={disneyVideos} size="medium" />
        </div>
      </div>

    </div>
  )
}
