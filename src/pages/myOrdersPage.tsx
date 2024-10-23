import { FunctionComponent, useEffect, useState } from "react"
import styles from "../styles/pages/myOrdersPage.module.css"
import ProfileMenu from "../components/menus/profileMenu";
import { OrderPanelProp } from "../interfaces/orderPanel";
import axios from "axios";
import OrderTable from "../components/order_table";
import BaseCenterContainer from "../components/baseCenterContainer";
import Header from "../components/header";
import Footer from "../components/footer";
import { useAuth } from "../stores/JWTTokenStore";
import useWindowSize from "../components/state/useWindowSize";
import { Link } from "react-router-dom";


const MyOrdersPage: FunctionComponent = () => {
    const { accessToken } = useAuth();

    const [OrderList, SetOrderList] = useState<OrderPanelProp[]>([])

    useEffect(() => {
        // Если токен есть, запрос на получение данных пользователя
        axios.get('/api/v1/profile/orders/PRODUCT/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                SetOrderList(response.data)
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });
    }, [accessToken]);

    const [width, _] = useWindowSize()
    const [maxWidth, setMaxWidth] = useState(1600)

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

                        <div className={styles.base_path}><Link to={"../"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Главная</Link> / <Link to={"../profile/"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Личный кабинет</Link> / <span style={{ color: " var(--color-white)" }}>Заказы</span></div>
                        <div className={styles.main_panel}>
                            <ProfileMenu selected={2} />
                            <div className={styles.general}>
                                <div className={styles.title}>
                                    <div>Заказы</div>
                                    <div style={{ textDecoration: "underline" }}>История заказов</div>
                                </div>

                                <div style={{
                                    color: "#FFFFFF", opacity: 0.6, display: "flex", justifyContent: "space-between",
                                    marginTop: "50px", maxWidth: "885px", fontFamily: "var(--font-tt-norms)"
                                }}>
                                    <div style={{ display: "flex", gap: "110px" }}>
                                        <div>Товар</div>
                                        <div>Дата</div>
                                        <div>Название</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "75px" }}>
                                        <div style={{ textWrap: "nowrap", marginRight: "25px" }}>№ заказа</div>
                                        <div>Стоимость</div>
                                        <div style={{ textWrap: "nowrap", marginRight: "-5px" }}>Действия</div>
                                        <div>Статус</div>
                                    </div>
                                </div>
                                <div className={styles.line} />
                                <OrderTable orders={OrderList} />
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
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px" }}>
                        <div className={styles.general}>
                        <div className={styles.base_path}><Link to={"../"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Главная</Link> / <Link to={"../profile/"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Личный кабинет</Link> / <span style={{ color: " var(--color-white)" }}>Заказы</span></div>
                            <div style={{display: 'flex', justifyContent: "space-between", marginTop: "30px", fontSize: "14px"}}>
                                <div>Заказы</div> 
                                <div style={{color: "rgba(255, 255, 255, 0.5)", textDecoration: "underline"}}>История заказов</div>
                            </div>
                            <OrderTable orders={OrderList}/>
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

export default MyOrdersPage