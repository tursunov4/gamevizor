import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/panels/subscriptionsPanel.module.css"
import { Link } from "react-router-dom"
import { format, parseISO } from 'date-fns';
import { StatusKeys, BackgroundStatusKeys } from "../../interfaces/subscriptionData";
import { OrderPanelProp } from "../../interfaces/orderPanel";
import useWindowSize from "../state/useWindowSize";


interface Props {
    subscription: OrderPanelProp
}


const SubscriptionPanel: FunctionComponent<Props> = ({ subscription }) => {
    const formattedDate = format(parseISO(subscription?.created_on ?? ""), 'dd.MM.yy'); // Format date
    const formattedTime = format(parseISO(subscription?.created_on ?? ""), 'HH:mm'); // Format time

    const formattedStatus = StatusKeys[subscription.subscription_status as keyof typeof StatusKeys];

    const backgroundColorStatus = BackgroundStatusKeys[subscription.subscription_status as keyof typeof BackgroundStatusKeys];

    const [width, _] = useWindowSize()
    const [maxWidth, setMaxWidth] = useState(1600)
    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseInt(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    if (width >= maxWidth) {
        return (
            <div className={styles.container}>
                <div style={{ display: "flex", gap: "30px" }}>
                    <img src={subscription.product.general_image ? subscription.product.general_image : "https://placehold.co/80x80"} style={{ borderRadius: "10px", width: "80px", height: "80px" }} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>{formattedDate}</div>
                        <div style={{ opacity: 0.6 }}>{formattedTime}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                        <div>{subscription.product.title}</div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "70px" }}>

                    <Link to={"../profile/subscription/" + subscription.id} style={{ color: "white" }}>Перейти</Link>

                    <button className={styles.button} style={{ backgroundColor: backgroundColorStatus, fontFamily: "Unbounded_Medium", fontSize: "10px", width: "115px" }}>{formattedStatus}</button>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.container}>
                <div style={{ display: 'flex', flexDirection: "column", gap: "10px" }}>
                    <div style={{ color: "#D4D4D4" }}>Название: <span style={{ color: "white" }}>{subscription.product.title}</span></div>
                    <div style={{ color: "#D4D4D4" }}>Дата: <span style={{ color: "white" }}>{formattedDate}</span> <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>{formattedTime}</span></div>
                    <div style={{ color: "#D4D4D4" }}>Действия: <Link to={"../profile/order/" + subscription.id} style={{ color: "white" }}>Перейти</Link></div>
                    <div style={{color: "#D4D4D4"}}>Статус: <button className={styles.button} style={{ backgroundColor: backgroundColorStatus, fontFamily: "Unbounded_Medium", fontSize: "10px", width: "103px" }}>{formattedStatus}</button></div>
                </div>
                <img src={subscription.product.general_image ? subscription.product.general_image : "https://placehold.co/42"} style={{ borderRadius: "10px", width: "42px", height: "42px" }} />
            </div>
        )
    }
}

export default SubscriptionPanel