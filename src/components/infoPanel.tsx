import { FC } from "react"
import styles from "../styles/infoPanel.module.css"
import ArrowIcon from "/icons/bases/arrows/arrow.svg"


interface ChildProps {
    width?: string;
    title: string;
    description: string;
    image: string;
    type?: number;
    is_mobile?: boolean;
}


const InfoPanel: FC<ChildProps> = ({ width, title, description, image, type, is_mobile }) => {

    if (!is_mobile) {
        if (type == 1) {
            return (
                <div style={{ width: width, backgroundImage: `url(${image})` }} className={styles.background}>
                    <div className={styles.bottom}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className={styles.title} style={{ fontFamily: "Unbounded_Extra_Bold" }}>{title}</div>
                            <div className={styles.subtitle}>{description}</div>
                        </div>
                        <img src={ArrowIcon} style={{ width: "30px" }} />
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{ width: width, backgroundImage: `url(${image})`, height: type == 2 ? "calc(212px - 40px)" : "calc(243px - 40px)" }} className={styles.background}>
                    <img src={ArrowIcon} style={{ width: "30px", alignSelf: "flex-end", marginTop: type == 2 ? "0" : "30px" }} />
                    <div className={styles.bottom}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className={styles.title}>{title}</div>
                            <div className={styles.subtitle}>{description}</div>
                        </div>
                    </div>
                </div>
            )
        }
    } else {
        return (
            <div style={{ width: "calc(152px - 30px)", backgroundImage: `url(${image})`, height: "calc(120px - 30px)", minHeight: "0px", padding: "15px"}} className={styles.background}>
                <div className={styles.bottom} style={{ flexDirection: "column"}}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div className={styles.title} style={{fontSize: "14px", fontFamily: "Unbounded_Extra_Bold"}}>{title}</div>
                        <div className={styles.subtitle} style={{fontSize: "10px"}}>{description}</div>
                    </div>
                    <img src={ArrowIcon} style={{ width: "30px", alignSelf: "flex-end", position: "relative", top: "10px", left: "5px" }} />
                </div>
            </div>
        )
    }

}

export default InfoPanel