import { FunctionComponent } from "react"
import styles from "../../styles/panels/TicketsPanel.module.css"
import { Link } from "react-router-dom"
import { format, parseISO } from 'date-fns';
import SupportInterface, { SupportBackgroundStatusKeys, SupportStatusKeys } from "../../interfaces/supportInteface";


interface PropsTheme {
    value: string;
    label: string;
}


interface Props {
    support: SupportInterface,
    is_mobile?: boolean;
    themes?: PropsTheme[],
}


const SupportPanel: FunctionComponent<Props> = ({ support, is_mobile, themes }) => {
    const formattedDate = format(parseISO(support?.created_on ?? ""), 'dd.MM.yy'); // Format date
    const formattedTime = format(parseISO(support?.created_on ?? ""), 'HH:mm'); // Format time

    const formattedStatus = SupportStatusKeys[support.status as keyof typeof SupportStatusKeys];

    const backgroundColorStatus = SupportBackgroundStatusKeys[support.status as keyof typeof SupportBackgroundStatusKeys];

    if (!is_mobile) {
        return (
            <div className={styles.container}>
                <div style={{ display: "flex", gap: "70px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>{formattedDate}</div>
                        <div style={{ opacity: 0.6 }}>{formattedTime}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                        <div>{support.title}</div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "85px" }}>
                    <Link to={"../profile/chats/?chat=" + support?.chat?.id} style={{ color: "white" }}>Перейти</Link>

                    <button className={styles.button} style={{ backgroundColor: backgroundColorStatus, fontFamily: "Unbounded_Medium", fontSize: "10px", width: "115px" }}>{formattedStatus}</button>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.container}>
                <div style={{ display: 'flex', flexDirection: "column", gap: "10px" }}>
                    <div style={{ color: "#D4D4D4" }}>Дата: <span style={{ color: "white" }}>{formattedDate}</span></div>
                    <div style={{ color: "#D4D4D4", display: 'flex', gap: "5px" }}>Тема: <span style={{ color: "white" }}>{themes?.filter(item => item.value == support.theme)[0]?.label}</span></div>
                    <div style={{ color: "#D4D4D4" }}>Действия: <Link to={"../profile/chats/?chat=" + support?.chat?.id} style={{ color: "white" }}>Перейти</Link></div>
                    <div style={{ color: "#D4D4D4" }}>Статус: <button className={styles.button} style={{ backgroundColor: backgroundColorStatus, fontFamily: "Unbounded_Medium", fontSize: "10px", width: "103px" }}>{formattedStatus}</button></div>
                </div>
            </div>
        )
    }
}

export default SupportPanel