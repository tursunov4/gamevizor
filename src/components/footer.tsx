import { FunctionComponent, useEffect, useState } from "react"
import styles from "../styles/footer.module.css"
import { Link } from "react-router-dom"
import useWindowSize from "./state/useWindowSize"




const Footer: FunctionComponent<{ style?: React.CSSProperties }> = ({ style }) => {
    const [maxWidth, setMaxWidth] = useState(1600.0)
    const [width, _] = useWindowSize()

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    if (width >= maxWidth) {
        return (
            <div className={styles.background} style={style}>
                <div className={styles.container}>
                    <Link to="/" className={styles.logo}>GAME<br />VIZOR</Link>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <Link style={{ textDecoration: "none", color: "white" }} to={"../confidential/"} className={styles.item}>Политика конфиденциальности</Link>
                        <Link style={{ textDecoration: "none", color: "white" }} to={"../offer/"} className={styles.item}>Публичная оферта</Link>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <Link style={{ textDecoration: "none", color: "white" }} to={"../rules/"} className={styles.item}>Правила сайта</Link>
                        <Link style={{ textDecoration: "none", color: "white" }} to={"../blog/"} className={styles.item}>Блог</Link>
                    </div>
                    {/* <Link to={"../profile/supports/"} style={{ color: "white", textDecoration: "none" }} className={styles.button}>Обратная связь</Link> */}
                    <div style={{ color: "white", textDecoration: "none" }} className={styles.button}>Обратная связь</div>
                </div>
                <div className={styles.footer_rule}>Все права защищены © «GAME VIZOR»,  2024</div>
            </div>
        )
    } else {
        return (
            <div className={styles.background} style={{ margin: "0", marginTop: "100px", display: "flex", gap: "25px", flexDirection: 'column', padding: "25px", background: "#120F25" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Link to="/" className={styles.logo}>GAME<br />VIZOR</Link>
                    {/* <Link to={"../profile/supports/"} className={styles.button} style={{ width: "calc(150px - 24px)", fontFamily: "Unbounded_Medium", textWrap: "nowrap", fontSize: "10px" }}><span>Обратная связь</span></Link> */}
                    <div style={{ width: "calc(150px - 24px)", fontFamily: "Unbounded_Medium", textWrap: "nowrap", fontSize: "10px" }} className={styles.button}>Обратная связь</div>
                </div>
                <div style={{ display: 'flex', flexDirection: "column", gap: "15px" }}>
                    <Link style={{ textDecoration: "none", color: "white" }} to={"../confidential/"} className={styles.item}>Политика конфиденциальности</Link>
                    <Link style={{ textDecoration: "none", color: "white" }} to={"../offer/"} className={styles.item}>Публичная оферта</Link>
                    <Link style={{ textDecoration: "none", color: "white" }} to={"../rules/"} className={styles.item}>Правила сайта</Link>
                    <Link style={{ textDecoration: "none", color: "white" }} to={"../blog/"} className={styles.item}>Блог</Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <div className={styles.border}></div>
                    <div className={styles.footer_rule} style={{ alignSelf: 'center' }}>Все права защищены © «GAME VIZOR»,  2024</div>
                </div>
            </div>
        )
    }
}

export default Footer