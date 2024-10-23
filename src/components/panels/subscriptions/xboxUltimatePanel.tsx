import { FC } from "react";
import styles from "../../../styles/panels/subscriptions/xboxUltimatePanel.module.css"
import xboxLogo from "/icons/bases/xboxLogo.svg"
import { Link } from "react-router-dom";

interface ChildProps {
    id: number;
    title: string;
    duration: string;
    cost: number;
    is_full?: boolean;
    is_mobile?: boolean;
}


const XboxUltimatePanel: FC<ChildProps> = ({ id, title, duration, cost, is_full, is_mobile }) => {

    if (!is_mobile) {
        return (
            <div className={styles.background} style={is_full ? { width: "251px" } : {}}>
                <img src={xboxLogo} width={151} style={{ alignSelf: "center" }} />
                <div style={{ alignSelf: "center", color: "#107B11", border: "2px solid #107B11", padding: "5px", fontWeight: "bold" }}>ULTIMATE</div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className={styles.title} style={{ fontFamily: "Unbounded_Extra_Bold", fontSize: "26px" }}>{title}</div>
                    <div className={styles.duration}>{duration}</div>
                </div>
                <b className={styles.cost} style={{ fontFamily: "Unbounded_Bold" }}>{cost}₽</b>
                <Link to={"/order/create/?type=SUBSCRIPTION&id=" + id} className={styles.btn}>Оформить</Link>
            </div>
        )
    } else {
        return (
            <Link to={"/order/create/?type=SUBSCRIPTION&id=" + id} className={styles.background}
                style={{ textDecoration: "none", width: "calc(320px - 40px)", flexDirection: "row", height: "calc(120px - 40px)", gap: "0px" }}>
                <div style={{display: 'flex', flexDirection: 'column', gap: "5px", marginRight: "25px"}}>
                    <img src={xboxLogo} style={{ pointerEvents: "none", width: "70px", height: "70px" }} />
                    <div style={{ alignSelf: "center", color: "#107B11", border: "2px solid #107B11", padding: "2px", fontWeight: "bold", fontSize: "8px" }}>ULTIMATE</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className={styles.title} style={{ fontFamily: "Unbounded_Extra_Bold", fontSize: "20px", textWrap: "nowrap"}}>{title}</div>
                    <div className={styles.duration}>{duration}</div>
                    <b className={styles.cost} style={{ fontFamily: "Unbounded_Bold", marginTop: "10px" }} >{cost}₽</b>
                </div>
                <img src="/icons/info_panel/ps_plus_arrow_black.svg" width={30} style={{ alignSelf: "flex-end", marginLeft: "auto" }} />
            </Link>
        )
    }

}

export default XboxUltimatePanel