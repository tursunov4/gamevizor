import { FC } from "react";
import styles from "../../../styles/panels/subscriptions/eaPlayPanel.module.css"
import eaPlayLogo from "/images/products/eaPlayLogo.png"
import { Link } from "react-router-dom";

interface ChildProps {
    id: number;
    title: string;
    duration: string;
    cost: number;
    is_full?: boolean;
    is_mobile?: boolean;
}


const EaPlayPanel: FC<ChildProps> = ({ id, title, duration, cost, is_full, is_mobile }) => {

    if (!is_mobile) {
        return (
            <div className={styles.background} style={is_full ? { width: "251px" } : {}}>
                <img src={eaPlayLogo} width={151} style={{ alignSelf: "center" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className={styles.title} style={{ fontFamily: "Unbounded_Extra_Bold" }}>{title}</div>
                    <div className={styles.duration}>{duration}</div>
                </div>
                <b className={styles.cost} style={{ fontFamily: "Unbounded_Bold" }}>{cost}₽</b>
                <Link to={"/order/create/?type=SUBSCRIPTION&id=" + id} className={styles.btn}>Оформить</Link>
            </div>
        )
    } else {
        return (
            <Link to={"/order/create/?type=SUBSCRIPTION&id=" + id} className={styles.background_mobile}
                style={{ textDecoration: "none", width: "calc(320px - 40px)", flexDirection: "row", height: "calc(120px - 40px)"}}>
                <img src={eaPlayLogo} style={{ pointerEvents: "none", width: "70px", height: "70px" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className={styles.title} style={{fontFamily: "Unbounded_Extra_Bold", fontSize: "20px" }}>{title}</div>
                    <div className={styles.duration}>{duration}</div>
                    <b className={styles.cost} style={{ fontFamily: "Unbounded_Bold", marginTop: "10px" }} >{cost}₽</b>
                </div>
                 <img src="/icons/info_panel/ea_play_arrow_mobile.svg" width={30} style={{alignSelf: "flex-end", marginLeft: "auto"}}/>
            </Link>
        )
    }

}

export default EaPlayPanel