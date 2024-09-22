import styles from './loading.module.css'

const Loading = () => {
    return (
        <>
        <div style={{
            backgroundImage: `url(/static/signin-bg.jpeg)`,
        }} className={styles.bannerImg}>
        </div>
        <div className={styles.loader}>Loading...</div>
        </>
    )
}

export default Loading