import { FC } from "react"
import styles from "../styles/psPlus.module.css"
import PSPlusBackground from "/images/products/ps_plus.png"
import PSPlusIcon from "/images/products/ps_plus_mobile_icon.png"
import { Link } from "react-router-dom";


interface ChildProps {
    id: number;
    type: number;
    title: string;
    duration: string;
    cost: number;
    is_full?: boolean;
    is_mobile?: boolean;
}


const PSPlus: FC<ChildProps> = ({ id, type, title, duration, cost, is_full, is_mobile }) => {
    var class_name;
    var btn = styles.btn_buy_yellow;
    var color_base = "black"
    if (type == 1) {
        class_name = styles.background_1
    }
    if (type == 2) {
        class_name = styles.background_2
        btn = styles.btn_buy_dark;
    }

    if (type == 3) {
        class_name = styles.background_3
        color_base = "#ffbb10"
    }

    if (!is_mobile) {
        return (
            <div className={class_name} style={is_full ? { width: "251px" } : {}}>
                <img src={PSPlusBackground} style={{ transform: "scale(1.5)", pointerEvents: "none" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className={styles.title} style={{ color: color_base, fontFamily: "Unbounded_Extra_Bold" }}>{title}</div>
                    <div className={styles.duration} style={type == 3 ? { color: "var(--color-gray-700)" } : {}}>{duration}</div>
                </div>
                <b className={styles.cost} style={{ color: color_base, fontFamily: "Unbounded_Bold" }} >{cost}₽</b>
                <Link to={"../subscription/" + id} className={btn}>Оформить</Link>
            </div>
        )
    } else {
        return (
            <Link to={"../subscription/" + id} className={class_name} style={{textDecoration: "none", width: "calc(320px - 40px)", flexDirection: "row", height: "calc(120px - 40px)", gap: "10px"}}>
                <img src={PSPlusIcon} style={{ transform: "scale(2)", pointerEvents: "none", width: "90px", height: "82px" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className={styles.title} style={{ color: color_base, fontFamily: "Unbounded_Extra_Bold", fontSize: "20px" }}>{title}</div>
                    <div className={styles.duration} style={type == 3 ? { color: "var(--color-gray-700)" } : {}}>{duration}</div>
                    <b className={styles.cost} style={{ color: color_base, fontFamily: "Unbounded_Bold", marginTop: "10px" }} >{cost}₽</b>
                </div>
                {type == 3 ? <img src="/icons/info_panel/ps_plus_arrow_yellow.svg" width={30} style={{alignSelf: "flex-end", marginLeft: "auto"}}/> :
                 <img src="/icons/info_panel/ps_plus_arrow_black.svg" width={30} style={{alignSelf: "flex-end", marginLeft: "auto"}}/>}
               {/*  <Link to={"../subscription/" + id} className={btn}>Оформить</Link> */}
            </Link>
        )
    }

}

export default PSPlus