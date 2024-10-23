import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/panels/adminTeamPanel.module.css"
import EmployeeInterface from "../../interfaces/employeeInterface";
import { useAuth } from "../../stores/JWTTokenStore";
import { format, parseISO } from "date-fns";
import { BackgroundStatusKeys, OrderPanelProp, StatusKeys } from "../../interfaces/orderPanel";
import { Link } from "react-router-dom";
import SupportInterface, { SupportBackgroundStatusKeys, SupportStatusKeys } from "../../interfaces/supportInteface";
import ChatInterface from "../../interfaces/chatInterface";
import useWindowSize from "../state/useWindowSize";


interface adminTeamPanelProps {
    order: ChatInterface;
    employee: EmployeeInterface | null;
    funcDelete?: () => void;
}


const AdminChatPanel: FunctionComponent<adminTeamPanelProps> = ({ order, funcDelete }) => {
    const { accessToken } = useAuth();
    const [infoPanel, setInfoPanel] = useState<ChatInterface>(order);

    const [_error, setError] = useState<string>("");

    var formattedDate = ""
    var formattedTime = ""
    if (infoPanel?.order) {
        formattedDate = format(parseISO(infoPanel?.order.created_on), 'dd.MM.yy'); // Format date
        formattedTime = format(parseISO(infoPanel?.order.created_on), 'HH:mm');
    } else {
        formattedDate = format(parseISO(infoPanel?.ticket.created_on ?? ""), 'dd.MM.yy'); // Format date
        formattedTime = format(parseISO(infoPanel?.ticket.created_on ?? ""), 'HH:mm');
    }


    useEffect(() => {
        setInfoPanel(order);
    }, [order])


    const [maxWidth, setMaxWidth] = useState(1600.0)
    const [width, _] = useWindowSize()

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])


    if (width >= maxWidth) {
        return (
            <div className={styles.container_without_before} style={{
                width: "910px", backgroundImage: "url(/images/backgrounds/Subtract.png)",
                border: "none", backgroundColor: "transparent", backgroundSize: "contain", position: "relative", margin: "5px", padding: "20px",
                backgroundRepeat: "no-repeat"
            }}>
                <div style={{ position: "absolute", left: "420px", top: "-7px", opacity: "0.8" }}>{formattedTime} {formattedDate}</div>
                {infoPanel?.order ?
                    <div style={{ position: "absolute", left: "785px", top: "-7px", opacity: "0.8", width: "140px", textAlign: "center" }}>Заказ №{infoPanel?.order.id}</div>
                    :
                    <div style={{ position: "absolute", left: "785px", top: "-7px", opacity: "0.8", width: "140px", textAlign: "center" }}>Вопрос №{infoPanel?.ticket.id}</div>}


                <div style={{ display: "flex", justifyContent: "space-between", gap: "50px", height: "151px", }}>
                    <div style={{ display: "flex", gap: "25px" }}>
                        <div style={{ position: "relative" }}>
                            <img src={infoPanel?.author?.profile.image ? infoPanel?.author?.profile.image : "/images/bases/base_image_for_profile.png"} width={40} height={40}
                                style={{ borderRadius: "50%", border: infoPanel?.counter_no_read_message ? "4px solid #FF007A" : "none" }} />
                            {infoPanel.counter_no_read_message > 0 && <div style={{
                                position: "absolute", left: "70%", top: "0%",
                                background: "#FF007A", height: "13px", borderRadius: "50%", fontSize: "9px", textAlign: "center", padding: "1px", minWidth: "13px"
                            }}>{infoPanel.counter_no_read_message}</div>}
                        </div>
                        <div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{ color: "white" }}>{infoPanel.author.username} <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>({infoPanel.author.profile.console_generation})</span></div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                                    <div style={{ textDecoration: "underline", color: "white" }}>{infoPanel?.order?.product?.title ?? infoPanel?.ticket?.title ?? `Пополнение кошелька на ${infoPanel?.order?.wallet?.number} ${infoPanel?.order?.wallet?.select_country?.tag}`}{infoPanel?.order && infoPanel?.order?.product?.product_type === "PRODUCT" ? ", " : ""}
                                        <span style={{ color: "#fb3996", textDecoration: "underline", minHeight: "16px" }}>{infoPanel?.order && infoPanel?.order?.product?.product_type === "PRODUCT" ? infoPanel?.order?.is_deluxe ? "Deluxe Edition" : "Standart Edition" : null}</span></div>
                                </div>
                            </div>
                            <div style={{ maxWidth: "582px" }}>{
                                infoPanel?.order ?
                                    (infoPanel.order.info_for_complete && infoPanel.order.info_for_complete.length) ? infoPanel.order.info_for_complete : "Информация для завершения заказа не указана" :
                                    infoPanel?.ticket?.question ?
                                        (<div>
                                            {infoPanel.ticket.question}
                                        </div>) :
                                        "Информация не указана"
                            }</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", alignItems: "flex-end" }}>
                        {infoPanel?.order ?
                            <div style={{
                                background: BackgroundStatusKeys[infoPanel.order.status as keyof typeof BackgroundStatusKeys],
                                padding: "5px", paddingLeft: "20px", paddingRight: "20px", color: "white", borderRadius: "10px", textAlign: "center",
                                maxWidth: "115px", marginTop: "20px", fontFamily: "Unbounded_Medium", fontSize: "10px"
                            }} >{StatusKeys[infoPanel.order.status as keyof typeof StatusKeys]}</div>
                            :
                            <div style={{
                                background: SupportBackgroundStatusKeys[infoPanel.ticket.status as keyof typeof SupportStatusKeys],
                                padding: "5px", paddingLeft: "20px", paddingRight: "20px", color: "white", borderRadius: "10px", textAlign: "center",
                                maxWidth: "115px", marginTop: "20px", fontFamily: "Unbounded_Medium", fontSize: "10px"
                            }} >{SupportStatusKeys[infoPanel.ticket.status as keyof typeof SupportStatusKeys]}</div>}
                        <Link to={"../admin/chat/?chat=" + infoPanel.id} className={styles.button} style={{ width: "136px", fontFamily: "Unbounded_Medium", fontSize: "10px", padding: "15px" }}>Чат с клиентом</Link>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.container_without_before} style={{
                width: "326px", backgroundImage: "url(/images/backgrounds/subsctract_mobile.svg)", height: "247px",
                border: "none", backgroundColor: "transparent", backgroundSize: "cover", position: "relative", margin: "5px", padding: "10px",
                backgroundRepeat: "no-repeat", gap: "20px", flexDirection: "column", display: "flex"
            }}>
                <div style={{ position: "absolute", left: "18px", top: "-7px", opacity: "0.8" }}>{formattedTime} {formattedDate}</div>
                {infoPanel?.order ?
                    <div style={{ position: "absolute", left: "185px", top: "-7px", opacity: "0.8", width: "140px", textAlign: "center" }}>Заказ №{infoPanel?.order.id}</div>
                    :
                    <div style={{ position: "absolute", left: "185px", top: "-7px", opacity: "0.8", width: "140px", textAlign: "center" }}>Вопрос №{infoPanel?.ticket.id}</div>}

                <div style={{ display: "flex", gap: "25px" }}>
                    <div style={{ position: "relative" }}>
                        <img src={infoPanel?.author?.profile.image ? infoPanel?.author?.profile.image : "/images/bases/base_image_for_profile.png"} width={40} height={40}
                            style={{ borderRadius: "50%", border: infoPanel?.counter_no_read_message ? "4px solid #FF007A" : "none" }} />
                        {infoPanel.counter_no_read_message > 0 && <div style={{
                            position: "absolute", left: "70%", top: "0%",
                            background: "#FF007A", height: "13px", borderRadius: "50%", fontSize: "9px", textAlign: "center", padding: "1px", minWidth: "13px"
                        }}>{infoPanel.counter_no_read_message}</div>}

                    </div>
                    <div style={{display: 'flex', justifyContent :"space-between", width: "100%"}}>
                        <div style={{ display: "flex", gap: "25px", flexDirection: "column" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{ color: "white" }}>{infoPanel.author.username} <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>({infoPanel.author.profile.console_generation})</span></div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                                    <div style={{ textDecoration: "underline", color: "white" }}>{infoPanel?.order?.product?.title ?? infoPanel?.ticket?.title ?? `Пополнение кошелька на ${infoPanel?.order?.wallet?.number} ${infoPanel?.order?.wallet?.select_country?.tag}`}{infoPanel?.order && infoPanel?.order?.product?.product_type === "PRODUCT" ? ", " : ""}
                                        <span style={{ color: "#fb3996", textDecoration: "underline", minHeight: "16px" }}>{infoPanel?.order && infoPanel?.order?.product?.product_type === "PRODUCT" ? infoPanel?.order?.is_deluxe ? "Deluxe Edition" : "Standart Edition" : null}</span></div>
                                </div>
                            </div>
                        </div>
                        {infoPanel?.order ?
                            <div style={{
                                background: BackgroundStatusKeys[infoPanel.order.status as keyof typeof BackgroundStatusKeys],
                                padding: "5px", paddingLeft: "20px", paddingRight: "20px", color: "white", borderRadius: "10px", textAlign: "center",
                                maxWidth: "115px", marginTop: "20px", fontFamily: "Unbounded_Medium", fontSize: "10px", height: "fit-content"
                            }} >{StatusKeys[infoPanel.order.status as keyof typeof StatusKeys]}</div>
                            :
                            <div style={{
                                background: SupportBackgroundStatusKeys[infoPanel.ticket.status as keyof typeof SupportStatusKeys],
                                padding: "5px", paddingLeft: "20px", paddingRight: "20px", color: "white", borderRadius: "10px", textAlign: "center",
                                maxWidth: "115px", marginTop: "20px", fontFamily: "Unbounded_Medium", fontSize: "10px", height: "fit-content"
                            }} >{SupportStatusKeys[infoPanel.ticket.status as keyof typeof SupportStatusKeys]}</div>}
                    </div>
                </div>
                <div style={{ maxWidth: "290px", minHeight: "102px" }}>{
                    infoPanel?.order ?
                        (infoPanel.order.info_for_complete && infoPanel.order.info_for_complete.length) ? infoPanel.order.info_for_complete : "Информация для завершения заказа не указана" :
                        infoPanel?.ticket?.question ?
                            (<div>
                                {infoPanel.ticket.question}
                            </div>) :
                            "Информация не указана"
                }</div>

                <Link to={"../admin/chat/?chat=" + infoPanel.id} className={styles.button} style={{ width: "246px", fontFamily: "Unbounded_Medium", fontSize: "10px", padding: "15px" }}>Чат с клиентом</Link>
                <br/>
            </div>
        )
    }
};

export default AdminChatPanel