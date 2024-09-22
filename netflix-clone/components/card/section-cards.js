import Link from "next/link"
import Card from "./card"
import styles from './section-cards.module.css'


const SectionCards = (props) => {
    const {title,videos,size} = props
    return (
        <section className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.cardWrapper}>
                {
                    videos.length > 0 ? (
                        videos.map((video,id) =>{
                            return(
                                <Link href={`/video/${video.id}`}>
                                    <Card imgUrl={video.imgUrl} size={size} id={id} key={id}/>
                                </Link>
                            ) 
                        })
                    ): ("")
                }
                
            </div>
        </section>
    )
}

export default SectionCards