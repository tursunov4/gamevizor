import { FunctionComponent, useEffect, useState } from "react"
import styles from "../styles/notification.module.css"
import { useAuth } from "../stores/JWTTokenStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";


interface NotificationData {
    id: number;
    image: string | null;
    title: string;
    description: string;
    notification_type: string;
    notification_value: string;
    is_checked: boolean;
    is_global: boolean;
    created_on: string;
    updated_on: string;
}


const Notification: FunctionComponent = () => {
    const { accessToken } = useAuth();
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    const fetchNotifications = async () => {
        if (!accessToken) return
        try {
            const response = await fetch('/api/v1/profile/notifications/', { headers: { Authorization: 'Bearer ' + accessToken } }); // Replace with your actual API endpoint
            if (response.status === 200) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {

        // Fetch initial notifications
        fetchNotifications();

        // Set up interval for periodic fetching
        const intervalId = setInterval(fetchNotifications, 5000); // Fetch every 10 seconds

        // Clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, [accessToken]);


    const updateIsChecked = async (id: number) => {
        if (!accessToken) return
        try {
            const response = await axios.post('/api/v1/profile/notifications/' + id + "/", {}, { headers: { Authorization: 'Bearer ' + accessToken } }); // Replace with your actual API endpoint
            if (response.status === 200) {
                fetchNotifications()
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    const HandleOpenNotification = (notification: NotificationData) => {
        if (notification.notification_type === "ORDER_PRODUCT") {

            navigate("../profile/order/" + notification.notification_value)
        }

        if (notification.notification_type === "ORDER_SUBSCRIPTION") {
            navigate("../profile/subscription/" + notification.notification_value)
        }

        if (notification.notification_type === "PROMO_CODE") {
            navigate("../profile/offers/")
        }

        if (notification.notification_type === "CHAT") {
            navigate("../profile/chats/?chat=" + notification.notification_value)
        }

        if (!notification.is_checked) updateIsChecked(notification.id)
    }

    const clearNotification = async () => {
        if (!accessToken) return
        try {
            const response = await axios.post('/api/v1/profile/notifications/clear/', {}, { headers: { Authorization: 'Bearer ' + accessToken } }); // Replace with your actual API endpoint
            if (response.status === 200) {
                setNotifications(response.data)
                setIsOpen(false)
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    const handleClick = (event: any) => {
        if (event.target === event.currentTarget) {
            setIsOpen(false)
        }


    };


    return (
        <div style={{}}>
            <div className={styles.notification} onClick={() => setIsOpen(!isOpen)}>
                <div className={styles.notificationGroup}>
                    <img src="/icons/header/notification.svg" width={24} height={24} style={{ margin: "auto" }} />
                    {notifications.filter(item => item.is_checked === false).length > 0 && <div className={styles.number} style={{ minWidth: "10px", left: "17px" }}>
                        <b>{notifications.filter(item => item.is_checked === false).length}</b>
                    </div>}
                </div>
                <div className={styles.text} style={{ fontFamily: "Unbounded_Light_Base" }}>{notifications.filter(item => item.is_checked === false).length ? "Новое уведомление" : "Уведомления"}</div>
            </div>
            {isOpen &&
                <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex: 999, display: "flex" }} onClick={handleClick}>
                    <div style={{ height: "100%", width: "100%", maxWidth: "1240px", margin: "0 auto", position: "relative", pointerEvents: "none" }}>
                        <div className={styles.notification_panel}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Unbounded_Light_Base" }}>
                                <div>{"Все уведомления"}</div>
                                <div style={{ textDecoration: "underline", cursor: "pointer", color: "#D4D4D4" }} onClick={clearNotification}>Очистить все</div>
                            </div>

                            <div style={{ height: "141px", overflowY: "auto" }} className={styles.list}>
                                {notifications.map((notification, index) => (
                                    <div style={{display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px"}}>
                                        {index > 0 && <div className={styles.line} style={{maxWidth: "345px"}}/>}
                                        <div key={notification.id} onClick={() => HandleOpenNotification(notification)} style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }} className={styles.info_notification}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                                <img src={notification.notification_type === "PROMO_CODE" ? "/images/bases/promocode_icon.png" : notification.image ? notification.image : "https://placehold.co/32"} style={{ width: "48px", height: "48px", borderRadius: "5px" }} />
                                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                    <div style={{ color: "white" }}>{notification?.title}</div>
                                                    <div style={{ color: "#D4D4D4" }}>{notification?.description}</div>
                                                </div>
                                            </div>
                                            {notification?.is_checked ? null : <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FF007A" }}></div>}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>}
        </div>
    )

}

export default Notification