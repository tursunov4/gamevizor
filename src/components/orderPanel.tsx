import { FunctionComponent, useEffect, useState } from "react"
import styles from "../styles/orderPanel.module.css"
import { Link } from "react-router-dom"
import { format, parseISO } from 'date-fns';
import { OrderPanelProp, StatusKeys, BackgroundStatusKeys } from "../interfaces/orderPanel";
import useWindowSize from "./state/useWindowSize";



const OrderPanel: FunctionComponent<OrderPanelProp> = ({ id, product, wallet, created_on, cost, status, platform }) => {
    const formattedDate = format(parseISO(created_on), 'dd.MM.yy'); // Format date
    const formattedTime = format(parseISO(created_on), 'HH:mm'); // Format time

    const formattedStatus = StatusKeys[status as keyof typeof StatusKeys];

    const backgroundColorStatus = BackgroundStatusKeys[status as keyof typeof BackgroundStatusKeys];

    const [width, height] = useWindowSize()
    const [maxWidth, setMaxWidth] = useState(1600)
    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseInt(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    if (width >= maxWidth) {
    return (
        <div className={styles.container} style={{gap: "10px"}}>
            <div style={{ display: "flex", gap: "30px" }}>
                <img src={product?.general_image ? product?.general_image : "https://placehold.co/80x80"} style={{ borderRadius: "10px", width: "80px", height: "80px" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>{formattedDate}</div>
                    <div style={{ opacity: 0.6 }}>{formattedTime}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginLeft: "40px" }}>
                    <div style={{width: "144px", textWrap: "wrap", display: "flex", flexDirection: "column", gap: "15px"}}>
                        <div style={{textWrap: "wrap"}}>{product?.title ?? `Пополнение кошелька на ${wallet?.number} ${wallet?.select_country?.tag}`}</div>
                        {product?.product_type === "PRODUCT" && 
                        <div style={{color: "rgba(255, 255, 255, 0.4)", textWrap: "nowrap"}}>
                            {product?.is_deluxe_or_premium ? "Deluxe Edition" : "Standart Edition"}, {platform?.title}</div>}
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", gap: "55px" }}>
                <div  style={{width: "97px"}}>№{id}</div>
                <div  style={{width: "53px", marginRight: "30px", textWrap: "nowrap"}}>{cost} ₽</div>
                <Link to={"../profile/order/" + id} style={{ color: "white" }}>Перейти</Link>

                <button className={styles.button} style={{ backgroundColor: backgroundColorStatus, fontFamily: "Unbounded_Medium", fontSize: "10px" }}>{formattedStatus}</button>
            </div>
        </div>
    )
} else {
    return (
        <div className={styles.container} style={{gap: "10px", justifyContent: "space-between", flexDirection: "row"}}>
            <div style={{display: 'flex', flexDirection: "column", gap: "10px"}}>
                <div style={{color: "#D4D4D4"}}>Название: <span style={{color: "white"}}>{product?.title ?? `Пополнение кошелька на ${wallet?.number} ${wallet?.select_country?.tag}`}</span></div>
                <div style={{color: "#D4D4D4"}}>№ заказа: <span style={{color: "white"}}>{id}</span></div>
                <div style={{color: "#D4D4D4"}}>Дата: <span style={{color: "white"}}>{formattedDate}</span> <span style={{color: "rgba(255, 255, 255, 0.4)"}}>{formattedTime}</span></div>
                <div style={{color: "#D4D4D4"}}>Стоимость: <span style={{color: "white"}}>{cost} ₽</span></div>
                <div style={{color: "#D4D4D4"}}>Действия: <Link to={"../profile/order/" + id} style={{color: "white"}}>Перейти</Link></div>
                <div style={{color: "#D4D4D4"}}>Статус: <button className={styles.button} style={{ backgroundColor: backgroundColorStatus, fontFamily: "Unbounded_Medium", fontSize: "10px" }}>{formattedStatus}</button></div>
            </div>
            <img src={product?.general_image ? product?.general_image : "https://placehold.co/42"} style={{ borderRadius: "10px", width: "42px", height: "42px" }} />
        </div>
    )
}
}

export default OrderPanel
