import { FC, useContext } from "react"
import styles from "../styles/infoQuestionPanel.module.css"
import InfoQuestionPanelContext from "../context/infoQuestionPanel";


interface ChildProps {
    text: string;
    active: boolean;
    icon: string;
    index: number;

    is_mobile?: boolean;
}


const infoQuestionPanel: FC<ChildProps> = ({ text, active, icon, index, is_mobile }) => {
    const setActiveButtonIndex = useContext(InfoQuestionPanelContext);

    const handleClick = () => {
        if (setActiveButtonIndex) {
            setActiveButtonIndex(index);
        }
    };

    if (!is_mobile) {
        return (
            <div className={active ? styles.background_active : styles.background} onClick={handleClick}>
                <img src={icon} className={active ? styles.icon_left_up_active : styles.icon_left_up} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ zIndex: 2, fontFamily: "Unbounded_Medium" }}>{text}</span>
                    <object
                        data="\icons\info_panel\button_arrow.svg"
                        type="image/svg+xml"
                        className={active ? styles.icon_right_down_active : styles.icon_right_down}
                    />
                </div>
                {active && <img src={icon} className={styles.icon_background} />}
            </div>
        );
    } else {
        return (
            <div className={active ? styles.background_active : styles.background} onClick={handleClick} style={{
                height: "calc(60px - 40px)",
                width: "calc(227px - 40px)", minWidth: "calc(227px - 40px)", padding: "20px", display: 'flex', justifyContent: "space-between", flexDirection: "row", alignItems: "center"
            }}>
                <pre style={{ zIndex: 2, fontFamily: "Unbounded_Medium", fontSize: "16px", textWrap: "wrap" }}>{text}</pre>
                <img src={icon} className={active ? styles.icon_left_up_active : styles.icon_left_up} />
                {active && <img src={icon} className={styles.icon_background} style={{width: "127px", height: "55px"}}/>}
            </div>
        )
    }
};

export default infoQuestionPanel