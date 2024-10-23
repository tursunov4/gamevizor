import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/pages/admin/AdminClientPage.module.css"
import BaseCenterContainer from "../../components/baseCenterContainer";
import Header from "../../components/header";
import Footer from "../../components/footer";
import AdminMenu from "../../components/menus/adminMenu";
import { useUser } from "../../stores/userStore";
import useWindowSize from "../../components/state/useWindowSize";
import { Link } from "react-router-dom";




const AdminIndexPage: FunctionComponent = () => {
    const { user } = useUser();

    const [maxWidth, setMaxWidth] = useState(1600.0)
    const [width, _] = useWindowSize()

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])


    if (width >= maxWidth) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <BaseCenterContainer style={{ zoom: 0.9 }}>
                    <Header is_admin />
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

                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Главная</span></div>
                        <div className={styles.main_panel}>
                            <AdminMenu selected={-1} />
                            <div className={styles.general}>
                                <div style={{ color: "#C2C2C2", fontSize: "3rem", margin: "auto" }}>Добро пожаловать, <span style={{ color: "white" }}>{user?.username}</span></div>
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
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <BaseCenterContainer>
                    <Header is_admin />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", gap: "30px" }}>
                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Главная</span></div>

                        <div className={styles.general} style={{ marginTop: "100px" }}>
                            <div style={{ color: "#C2C2C2", fontSize: "32px", margin: "0 auto", textAlign: "center" }}>Добро пожаловать, <span style={{ color: "white" }}>{user?.username}</span></div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{ marginTop: "auto" }}>
                    <Footer style={{ height: "150px", display: "flex", justifyContent: "center" }} />
                </div>
            </div>
        )
    }
}

export default AdminIndexPage;