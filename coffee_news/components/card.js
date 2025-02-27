import Link from "next/link";
import Image from "next/image";
import cls from 'classname'
import styles from "./card.module.css"


const Card = (props) => {
    return (
        <Link href={props.href} className={styles.cardLink}>
            <div className={cls("glass",styles.container)}>
                <div className={styles.cardHeaderWrapper}>
                    <h2 className={styles.cardHeader}>{props.name}</h2>
                </div>
                <Image
                    className={styles.cardImage}
                    src={props.imgUrl}
                    width={260}
                    height={160}
                    alt="..."
                />
            </div>

        </Link >
    )

}

export default Card;