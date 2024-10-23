import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/frames/secondFrame.module.css"
import PSPlus from "../psPlus"
import InfoPanel from "../infoPanel"
import SubscriptionBackgroundImage from "/images/products/sub_background_image.png"
import DeposistsBackgroundImage from "/images/products/deposits_background.png"
import BuyingGameBackgroundImage from "/images/products/buying_game_background.png"
import BuyInternalBackgroundImage from "/images/products/buy_internal_currency_background.png"
import axios from "axios"
import { Link } from "react-router-dom"
import useWindowSize from "../state/useWindowSize"


interface SUBSCRIPTION_Interface {
  id: number;
  title: string;
  subscription_duration_mouth: number;
  cost: number;
}

const SecondFrame: FunctionComponent = () => {
  const [subscriptions, setSubscriptions] = useState<SUBSCRIPTION_Interface[]>([]);

  const fetchSubscriptions = async (): Promise<void> => {
    try {
      const response = await axios.get('/api/v1/products/', {
        params: {
          type: "SUBSCRIPTION",
          subscription_type: "PS_PLUS"
        },
      });
      setSubscriptions(response.data.results);

    } catch (error) {
      console.error('Ошибка при получении подписок:', error);
      // ... обработайте ошибку, например, выведите сообщение пользователю
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const [maxWidth, setMaxWidth] = useState(1600.0)
  const [width, height] = useWindowSize()

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
  }, [])

  if (width >= maxWidth) {
    return (
      <div className={styles.background} style={{margin: "0 auto"}}>
        <div className={styles.ellipce_1} />
        <div className={styles.ellipce_2} />
        <div className={styles.ellipce_3} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <b className={styles.title} style={{ fontFamily: "Unbounded_Bold", color: "white" }}>Наши услуги</b>
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            <PSPlus type={1} title={subscriptions.length > 0 ? subscriptions.some(item => item.title.includes("ОСНОВНОЙ")) ? "ОСНОВНОЙ" : "ОШИБКА" : "ОШИБКА"}
              duration={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ОСНОВНОЙ"))?.subscription_duration_mouth.toString() + " Мес *" ?? "" : ""}
              cost={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ОСНОВНОЙ"))?.cost ?? 0 : 0}
              id={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ОСНОВНОЙ"))?.id ?? 0 : 0} />


            <PSPlus type={2} title={subscriptions.length > 0 ? subscriptions.some(item => item.title.includes("ЭКСТРА")) ? "ЭКСТРА" : "ОШИБКА" : "ОШИБКА"}
              duration={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЭКСТРА"))?.subscription_duration_mouth.toString() + " Мес *" ?? "" : ""}
              cost={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЭКСТРА"))?.cost ?? 0 : 0}
              id={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЭКСТРА"))?.id ?? 0 : 0} />


            <PSPlus type={3} title={subscriptions.length > 0 ? subscriptions.some(item => item.title.includes("ЛЮКС")) ? "ЛЮКС" : "ОШИБКА" : "ОШИБКА"}
              duration={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЛЮКС"))?.subscription_duration_mouth.toString() + " Мес *" ?? "" : ""}
              cost={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЛЮКС"))?.cost ?? 0 : 0}
              id={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЛЮКС"))?.id ?? 0 : 0} />

            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <Link to={"../catalog_subscriptions/"} style={{ textDecoration: "none" }}><InfoPanel width='307px' title="подписки" description="Playstation" image={SubscriptionBackgroundImage} type={1} /></Link>
              <Link to={"../wallet/"} style={{ textDecoration: "none" }}><InfoPanel width='307px' title="пополнение" description="кошельков" image={DeposistsBackgroundImage} type={2} /></Link>
              {/* <div style={{ filter: "grayscale(1)" }}><InfoPanel width='307px' title="пополнение" description="кошельков" image={DeposistsBackgroundImage} type={2} /></div> */}
            </div>
          </div>
          <div style={{ display: "flex", gap: "30px", alignItems: "flex-end" }}>
            <div style={{ filter: "grayscale(1)" }}><InfoPanel width='524px' title="Покупки игр" description="Бот Playstation" image={BuyingGameBackgroundImage} type={3} /></div>
            <Link to={"../catalog_currency/"} style={{textDecoration: "none"}}><InfoPanel width='609px' title="ВНУТРЕННЯЯ ВАЛЮТА" description="Для ваших игр" image={BuyInternalBackgroundImage} type={2} /></Link>
          </div>
        </div>

      </div>
    )
  } else {
    return (
      <div className={styles.background} style={{ padding: "45px 25px", margin: "0 auto", borderRadius: "20px", width: "calc(100% - 50px)", maxWidth: "calc(375px - 50px)" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <b className={styles.title} style={{ fontFamily: "Unbounded_Bold", color: "white", fontSize: "24px", alignSelf: "center" }}>Наши услуги</b>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <PSPlus type={1} title={subscriptions.length > 0 ? subscriptions.some(item => item.title.includes("ОСНОВНОЙ")) ? "ОСНОВНОЙ" : "ОШИБКА" : "ОШИБКА"}
              duration={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ОСНОВНОЙ"))?.subscription_duration_mouth.toString() + " Мес *" ?? "" : ""}
              cost={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ОСНОВНОЙ"))?.cost ?? 0 : 0}
              id={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ОСНОВНОЙ"))?.id ?? 0 : 0} is_mobile />

            <PSPlus type={2} title={subscriptions.length > 0 ? subscriptions.some(item => item.title.includes("ЭКСТРА")) ? "ЭКСТРА" : "ОШИБКА" : "ОШИБКА"}
              duration={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЭКСТРА"))?.subscription_duration_mouth.toString() + " Мес *" ?? "" : ""}
              cost={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЭКСТРА"))?.cost ?? 0 : 0}
              id={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЭКСТРА"))?.id ?? 0 : 0} is_mobile />

            <PSPlus type={3} title={subscriptions.length > 0 ? subscriptions.some(item => item.title.includes("ЛЮКС")) ? "ЛЮКС" : "ОШИБКА" : "ОШИБКА"}
              duration={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЛЮКС"))?.subscription_duration_mouth.toString() + " Мес *" ?? "" : ""}
              cost={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЛЮКС"))?.cost ?? 0 : 0}
              id={subscriptions.length > 0 ? subscriptions.find(item => item.title.includes("ЛЮКС"))?.id ?? 0 : 0} is_mobile />

            <div style={{ display: "flex", gap: "20px" }}>
              <Link to={"../catalog_subscriptions/"} style={{ textDecoration: "none" }}><InfoPanel title="Подписки" description="Xbox, EA, Playstation" image={"/images/products/mobile/info_panel_sub.png"} is_mobile /></Link>
              <Link to={"../wallet/"} style={{ textDecoration: "none" }}><InfoPanel title="Пополнения" description="Кошельков" image={"/images/products/mobile/info_panel_wallet.png"} is_mobile /></Link>
              {/* <div style={{ filter: "grayscale(1)" }}><InfoPanel is_mobile title="пополнение" description="кошельков" image={DeposistsBackgroundImage} type={2} /></div> */}
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <Link to={"../catalog_currency/"}><InfoPanel title="Внутренняя валюта" description="Для ваших игр" image={"/images/products/mobile/info_panel_internal_currency.png"} is_mobile /></Link>
              <div style={{ filter: "grayscale(1)" }}><InfoPanel title="Покупка игр" description="Бот Playstation" image={"/images/products/mobile/info_panel_buy_games.png"} is_mobile /></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default SecondFrame