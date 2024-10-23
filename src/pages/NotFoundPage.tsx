import BaseCenterContainer from "../components/baseCenterContainer";
import Footer from "../components/footer";
import Header from "../components/header";

import styles from "../styles/pages/NotFoundPage.module.css"
import GTALogo from "../assets/GTA1.png"

import Cross4Icon from "/images/backgrounds/elements/cross_4.png"
import Triangle4Icon from "/images/backgrounds/elements/triangle_4.png"
import Triangle3Icon from "/images/backgrounds/elements/triangle_3.png"
import Triangle2Icon from "/images/backgrounds/elements/triangle_2.png"
import Circle2Icon from "/images/backgrounds/elements/circle_2.png"
import Square3Icon from "/images/backgrounds/elements/square_3.png"
import Circle3Icon from "/images/backgrounds/elements/circle_3.png"
import { Link } from "react-router-dom";


function NotFoundPage() {

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div className={styles.container} style={{ zoom: 0.9 }}>

        <img src={Cross4Icon} className={styles.icon_background}
          style={{ left: "80%", top: "15%" }} />
        <img src={Triangle4Icon} className={styles.icon_background}
          style={{ left: "65%", top: "10%" }} />
        <img src={Triangle3Icon} className={styles.icon_background}
          style={{ left: "45%", top: "0%" }} />
        <img src={Circle2Icon} className={styles.icon_background}
          style={{ left: "2%", top: "60%" }} />
        <img src={Triangle2Icon} className={styles.icon_background}
          style={{ left: "8.5%", top: "75%" }} />
        <img src={Square3Icon} className={styles.icon_background}
          style={{ left: "32.5%", top: "50%", opacity: 0.4 }} />
        <img src={Circle3Icon} className={styles.icon_background}
          style={{ left: "51%", top: "75%" }} />

        <BaseCenterContainer style={{ display: "flex", flexDirection: "column" }}>
          <Header />
          <div className={styles.main}>

            <div className={styles.base_path}>Главная<span style={{ color: "white" }}> / Ошибка 404</span></div>
            <div className={styles.errorContainer}>
              <img src={GTALogo} className={styles.image} />
              <div className={styles.errorTitle}>Ошибка</div>
              <div className={styles.errorCode}>4<span style={{ color: "var(--color-deeppink)" }}>0</span>4</div>
            </div>
          </div>
          <Link to={"../"} style={{ alignSelf: "center" }}><button className={styles.button}>На главную</button></Link>
        </BaseCenterContainer>
      </div>
      <div style={{ marginTop: "auto", width: "auto", height: "150px", zoom: 0.9 }}>
        <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px" }} />
      </div>
    </div>
  );
};

export default NotFoundPage