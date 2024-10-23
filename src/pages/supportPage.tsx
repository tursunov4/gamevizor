import { FunctionComponent, useEffect, useState } from "react"
import styles from "../styles/pages/MySubscriptionsPage.module.css"
import ProfileMenu from "../components/menus/profileMenu";
import { OrderPanelProp } from "../interfaces/orderPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import OrderTable from "../components/order_table";
import BaseCenterContainer from "../components/baseCenterContainer";
import Header from "../components/header";
import Footer from "../components/footer";
import { useAuth } from "../stores/JWTTokenStore";
import SupportPanel from "../components/panels/supportPanel";
import useWindowSize from "../components/state/useWindowSize";


interface PropsTheme {
    value: string;
    label: string;
}


const SupportPage: FunctionComponent = () => {
    const { accessToken } = useAuth();

    const [TicketsList, SetTicketsList] = useState<OrderPanelProp[]>([])

    useEffect(() => {
        if (!accessToken) return
        // Если токен есть, запрос на получение данных пользователя
        axios.get('/api/v1/profile/tickets/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                if (response.status === 200)
                    SetTicketsList(response.data)
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) return

        axios.get('/api/v1/profile/tickets/get_themes/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setThemes(response.data)
            })
    }, [accessToken])

    const [width, _] = useWindowSize()
    const [maxWidth, setMaxWidth] = useState(1600)

    const [Themes, setThemes] = useState<PropsTheme[]>([])

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseInt(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    if (width >= maxWidth) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
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

                        <div className={styles.base_path}>Главная / Личный кабинет / <span style={{ color: " var(--color-white)" }}>Поддержка</span></div>
                        <div className={styles.main_panel}>
                            <ProfileMenu selected={6} />
                            <div className={styles.general}>
                                <div className={styles.title}>
                                    <div>Обратная связь и контакты поддержки</div>
                                    <Link to={"/profile/supports/ticket/create"} className={styles.button} style={{ width: "160px", padding: "13px", textDecoration: "none" }}>новый тикет</Link>
                                </div>

                                <div style={{
                                    color: "#FFFFFF", opacity: 0.6, display: "flex", justifyContent: "space-between",
                                    marginTop: "50px", maxWidth: "880px", fontFamily: "var(--font-tt-norms)"
                                }}>
                                    <div style={{ display: "flex", gap: "150px" }}>
                                        <div>Дата</div>
                                        <div>Тема</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "100px" }}>
                                        <div>Действия</div>
                                        <div>Статус</div>
                                    </div>
                                </div>
                                <div className={styles.line} />
                                <div>
                                    {TicketsList ? TicketsList.map((ticket, index) => (
                                        <SupportPanel support={{
                                            ...ticket, author: {
                                                username: "",
                                                pk: 0,
                                                email: "",
                                                phone_number: "",
                                                nickname: "",
                                                profile: {
                                                    date_of_birth: "",
                                                    console_generation: "",
                                                    two_factor_authentication: false,
                                                    receive_notifications_on_email: false,
                                                    receive_notifications_on_telegram: false,
                                                    receive_notifications_on_new_message: false,
                                                    receive_notifications_on_change_status_order: false,
                                                    image: undefined
                                                },
                                                date_joined: "",
                                                is_active: false
                                            }
                                        }} key={index} />
                                    )) : null}
                                </div>
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
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <BaseCenterContainer>
                    <Header />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", display: 'flex', flexDirection: "column", gap: "40px" }}>
                        <div className={styles.base_path}>Главная / Личный кабинет / <span style={{ color: " var(--color-white)", fontSize: "10px" }}>Поддержка</span></div>
                        <div className={styles.general} style={{ display: 'flex', flexDirection: "column", gap: "40px" }}>
                            <div className={styles.title} style={{ textWrap: "wrap" }}>
                                <div>Обратная связь и контакты поддержки</div>
                                <Link to={"/profile/supports/ticket/create"} className={styles.button} style={{
                                    width: "208px", padding: "13px",
                                    textDecoration: "none", fontFamily: "Unbounded_Medium"
                                }}>новый тикет</Link>
                            </div>

                            <div style={{ display: 'flex', flexDirection: "column", gap: "15px" }}>
                                {TicketsList ? TicketsList.map((ticket, index) => (
                                    <SupportPanel is_mobile themes={Themes} support={{
                                        ...ticket, author: {
                                            username: "",
                                            pk: 0,
                                            email: "",
                                            phone_number: "",
                                            nickname: "",
                                            profile: {
                                                date_of_birth: "",
                                                console_generation: "",
                                                two_factor_authentication: false,
                                                receive_notifications_on_email: false,
                                                receive_notifications_on_telegram: false,
                                                receive_notifications_on_new_message: false,
                                                receive_notifications_on_change_status_order: false,
                                                image: undefined
                                            },
                                            date_joined: "",
                                            is_active: false
                                        }
                                    }} key={index} />
                                )) : null}
                            </div>
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

export default SupportPage