import { FunctionComponent, useEffect, useState } from "react"
import styles from "../styles/pages/myPromocodePage.module.css"
import ProfileMenu from "../components/menus/profileMenu";
import axios from "axios";
import BaseCenterContainer from "../components/baseCenterContainer";
import Header from "../components/header";
import Footer from "../components/footer";
import Input from "../components/inputs/input";
import PromoCodeData from "../interfaces/promoCodeData";
import { useAuth } from "../stores/JWTTokenStore";
import { useUser } from "../stores/userStore";
import useWindowSize from "../components/state/useWindowSize";
import { Link } from "react-router-dom";


const myPromocodePage: FunctionComponent = () => {
    const { accessToken } = useAuth();
    const { user } = useUser();

    const [promocodes, SetPromocodes] = useState<PromoCodeData[]>([])


    useEffect(() => {
        axios.get('/api/v1/profile/promocodes/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                SetPromocodes(response.data);
            })
            .catch(error => {
                console.error('Ошибка получение промокодов:', error);
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

                        <div className={styles.base_path}><Link to={"../"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Главная</Link> / <Link to={"../profile"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Личный кабинет</Link> / <span style={{ color: " var(--color-white)" }}>Предложения</span></div>
                        <div className={styles.main_panel}>
                            <ProfileMenu selected={4} />
                            <div className={styles.general}>
                                <div style={{ display: "flex" }}>
                                    <div style={{ textWrap: "nowrap", fontSize: "0.85rem" }}>Промокоды и бонусы </div>
                                    <div className={styles.line} />
                                </div>

                                <div className={styles.table_header} style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "10px", maxWidth: "774px" }}>
                                    <div style={{ display: "flex", gap: "70px" }}>
                                        <div>Срок действия до</div>
                                        <div>Описание</div>
                                    </div>
                                    <div>Промокод</div>
                                </div>

                                <div style={{ height: "232px", width: "823px", display: "flex", flexDirection: "column", gap: "25px" }}>
                                    {promocodes.map((promocode, index) => (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }} key={index}>
                                            <div

                                                style={{
                                                    display: 'flex',
                                                    justifyContent: "space-between",
                                                    maxWidth: "790px"
                                                }}
                                            >
                                                <div style={{ display: "flex", gap: "100px", }}>
                                                    <div style={{ width: "81px", textWrap: "nowrap" }}>
                                                        {promocode.expiry_date ? promocode.expiry_date : "Бессрочно"}
                                                    </div>
                                                    <div style={{ width: "455px" }}>
                                                        {promocode.description}
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <div style={{ minWidth: "60px" }}>{promocode.title}</div> <img src="/icons/bases/copy.svg" style={{ cursor: "pointer" }} onClick={() => { navigator.clipboard.writeText(promocode.title) }} />
                                                </div>
                                            </div>
                                            <div className={styles.line_reverse} />
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: "flex", marginTop: "50px" }}>
                                    <div style={{ textWrap: "nowrap", fontSize: "0.85rem" }}>Реферальная система </div>
                                    <div className={styles.line} />
                                </div>

                                <div style={{ fontSize: "0.8rem", maxWidth: "562px", fontFamily: "var(--font-tt-norms)" }}>Пригласите друзей и получите скидку на следующий заказ.<br />
                                    Отправьте друзьям ссылку - после первой оплаты друга вы получите промокод на скидку.
                                </div>
                                <div style={{ maxWidth: "350px", height: "32px" }}>
                                    <Input value={"https://ref.gamevizor.ru/" + user?.pk} style={{ width: "350px", height: "32px" }} suffix="/icons/bases/copy.svg" styles_suffix={{ left: "90%", top: "25%" }} />
                                </div>

                            </div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{ marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: "0.9" }}>
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
                            <div className={styles.base_path}><Link to={"../"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Главная</Link> / <Link to={"../profile"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Личный кабинет</Link> / <span style={{ color: " var(--color-white)" }}>Предложения</span></div>
                            <div style={{ display: "flex", marginTop: "30px" }}>
                                <div style={{ textWrap: "nowrap", fontSize: "0.85rem" }}>Промокоды и бонусы </div>
                                <div className={styles.line} />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                {promocodes.map((promocode, index) => (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }} className={styles.container} key={index}>


                                        <div style={{color: "rgba(255, 255, 255, 0.6)" }}>Срок действия до: <span style={{color: "white"}}>{promocode.expiry_date ? promocode.expiry_date : "Бессрочно"}</span></div>
                                        <div style={{ color: "rgba(255, 255, 255, 0.6)", display: "flex", gap: "10px"}}>Описание: <span style={{color: "white"}}>{promocode.description}</span></div>

                                        <div style={{ display: "flex", gap: "10px", alignItems: 'center', color: "rgba(255, 255, 255, 0.6)" }}>Промокод <span style={{color: "white", display: 'flex', gap: "10px", alignItems: "center"}}>{promocode.title} <img src="/icons/bases/copy.svg" width={18} style={{ cursor: "pointer" }} onClick={() => { navigator.clipboard.writeText(promocode.title) }} /></span></div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: "flex", marginTop: "50px" }}>
                                <div style={{ textWrap: "nowrap", fontSize: "0.85rem" }}>Реферальная система </div>
                                <div className={styles.line} />
                            </div>

                            <div style={{ fontSize: "0.8rem", maxWidth: "246px", fontFamily: "var(--font-tt-norms)" }}>Пригласите друзей и получите скидку на следующий заказ.<br />
                                Отправьте друзьям ссылку - после первой оплаты друга вы получите промокод на скидку.
                            </div>
                            <div style={{ maxWidth: "350px", height: "32px" }}>
                                <Input value={"https://ref.gamevizor.ru/" + user?.pk} style={{ width: "301px", height: "32px" }} suffix="/icons/bases/copy.svg" styles_suffix={{ left: "90%", top: "25%" }} />
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

export default myPromocodePage