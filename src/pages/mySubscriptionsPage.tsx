import { FunctionComponent, useEffect, useState } from "react"
import styles from "../styles/pages/MySubscriptionsPage.module.css"
import axios from "axios";
import ProfileMenu from "../components/menus/profileMenu";
import BaseCenterContainer from "../components/baseCenterContainer";
import Header from "../components/header";
import Footer from "../components/footer";
import SubscriptionTable from "../components/tables/subscriptionsTable";
import { useAuth } from "../stores/JWTTokenStore";
import { OrderPanelProp } from "../interfaces/orderPanel";
import useWindowSize from "../components/state/useWindowSize";
import { Link } from "react-router-dom";


const MySubscriptionsPage: FunctionComponent = () => {
    const [subscriptionsList, SetSubscriptionsList] = useState<OrderPanelProp[]>([]);

    const { accessToken } = useAuth();


    useEffect(() => {
        // Если токен есть, запрос на получение данных пользователя
        axios.get('/api/v1/profile/orders/SUBSCRIPTION/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                SetSubscriptionsList(response.data);
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });
    }, [accessToken]);

    useEffect(() => {
        console.log(subscriptionsList)
    }, [subscriptionsList]);

    const [width, _] = useWindowSize()
    const [maxWidth, setMaxWidth] = useState(1600)

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseInt(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    if (width >= maxWidth) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <BaseCenterContainer style={{ zoom: 0.9 }}>
                    <Header />
                    <div className={styles.background}>
                        <div className={styles.ellipce_1} />
                        <div className={styles.ellipce_2} />
                        <div className={styles.ellipce_3} />

                        <img src="/images/backgrounds/elements/cross_4.png" className={styles.icon_background}
                            style={{ left: "80%", top: "15%" }} />
                        <img src="/images/backgrounds/elements/triangle_4.png" className={styles.icon_background}
                            style={{ left: "65%", top: "10%" }} />
                        <img src="/images/backgrounds/elements/triangle_3.png" className={styles.icon_background}
                            style={{ left: "45%", top: "0%" }} />
                        <img src="/images/backgrounds/elements/circle_2.png" className={styles.icon_background}
                            style={{ left: "2%", top: "60%" }} />
                        <img src="/images/backgrounds/elements/triangle_2.png" className={styles.icon_background}
                            style={{ left: "8.5%", top: "75%" }} />
                        <img src="/images/backgrounds/elements/square_3.png" className={styles.icon_background}
                            style={{ left: "32.5%", top: "50%", opacity: 0.4 }} />
                        <img src="/images/backgrounds/elements/circle_3.png" className={styles.icon_background}
                            style={{ left: "51%", top: "75%" }} />

                        <div className={styles.base_path}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <Link to={"../profile"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Личный кабинет</Link> / <span style={{ color: " var(--color-white)" }}>Мои подписки</span></div>
                        <div className={styles.main_panel}>
                            <ProfileMenu selected={3} />
                            <div className={styles.general}>
                                <div className={styles.general_header}>
                                    <div>Список активных подписок</div>
                                    <div className={styles.button}>Продлить подписку</div>
                                </div>

                                <div className={styles.table_header} style={{ maxWidth: "875px", }}>
                                    <div style={{ display: "flex", gap: "100px" }}>
                                        <div>Товар</div>
                                        <div>Дата</div>
                                        <div>Название</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "75px" }}>
                                        <div>Действия</div>
                                        <div>Статус</div>
                                    </div>
                                </div>

                                <div className={styles.line} />

                                <SubscriptionTable subscriptions={subscriptionsList} />

                            </div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{
                    marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: 0.9,
                }}>
                    <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px" }} />
                </div>
            </div>

        )
    } else {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <BaseCenterContainer>
                    <Header />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px" }}>
                        <div className={styles.general}>
                            <div className={styles.base_path}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <Link to={"../profile"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Личный кабинет</Link> / <span style={{ color: " var(--color-white)" }}>Мои подписки</span></div>
                            <div style={{ display: 'flex', justifyContent: "space-between", marginTop: "20px", fontSize: "14px", alignItems: 'center' }}>
                                <div>Мои подписки</div>
                                <div className={styles.button} style={{ width: "150px", fontSize: "10px", fontFamily: "Unbounded_Medium" }}>Продлить подписку</div>
                            </div>

                            <SubscriptionTable subscriptions={subscriptionsList} />
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{ marginTop: "auto", maxWidth }}>
                    <Footer style={{ height: "150px", display: "flex", justifyContent: "center" }} />
                </div>
            </div>
        )
    }
}

export default MySubscriptionsPage