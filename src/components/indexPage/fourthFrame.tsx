import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/fourthFrame.module.css"
import useWindowSize from "../state/useWindowSize";


const FourthFrame: FunctionComponent = () => {
    const [activeStage, setActiveStage] = useState(1); // Начальный активный блок
    const color = ['#e745f5', "#61C3FF", "#965EEB", "#34977E"] // Массив цветов для каждого блока

    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveStage((prevStage) => (prevStage + 1) % 4); // Переключение через 4 блока
        }, 4000); // 1 секунда для переключения
        console.log(activeStage)
        return () => clearInterval(intervalId);
    }, []);


    const [maxWidth, setMaxWidth] = useState(1600.0)
    const [width, _] = useWindowSize()

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])


    if (width >= maxWidth) {
        return (
            <div className={styles.background} style={{ paddingLeft: "100px", marginTop: "120px", paddingRight: "0px", maxWidth: "1342px", marginLeft: "auto", marginRight: "auto" }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "30px", width: "100%" }}>
                    <b className={styles.title} style={{ fontFamily: "Unbounded_Bold" }}>КАК ПРОИСХОДИТ<br /><span style={{ color: "var(--color-silver-100)" }}>ПОДКЛЮЧЕНИЕ ПОДПИСКИ</span></b>
                    <div style={{ display: "flex", flexDirection: "row", gap: "20px", fontSize: "var(--font-size-21xl)" }}>

                        <div className={styles.stage}>
                            <div style={{
                                color: 1 === activeStage ? color[0] : 'white',
                                textShadow: 1 === activeStage ? "20px -15px 60px rgba(238, 70, 252, 0.5)" : 'none', display: "flex", gap: "30px", width: "293px"
                            }}>01
                                <div className={1 == activeStage ? styles.animate_line_1 : styles.line} /></div>
                            <div className={styles.stage_description_1}><span style={{ color: "white" }}>Выберите нужный</span><br />тариф PS PLUS</div>
                            <div className={styles.stage_description_2}>В меню каждого товара есть описание с преимуществами каждой подписки</div>
                        </div>
                        <div className={styles.stage}>
                            <div style={{
                                color: 2 === activeStage ? color[1] : 'white',
                                textShadow: 2 === activeStage ? "20px -15px 60px rgba(97, 195, 255, 0.5)" : 'none', display: "flex", gap: "30px", width: "293px"
                            }}
                                className={styles.stage_title_row}>02 <div className={2 == activeStage ? styles.animate_line_2 : styles.line} /></div>
                            <div className={styles.stage_description_1}><span style={{ color: "white" }}>Проведите оплату</span><br />удобным способом</div>
                            <div className={styles.stage_description_2}>После оплаты вы автоматически зарегистрируетесь<br />на нашем сайте</div>
                        </div>
                        <div className={styles.stage}>
                            <div style={{
                                color: 3 === activeStage ? color[2] : 'white',
                                textShadow: 3 === activeStage ? "20px -15px 60px rgba(150, 94, 235, 0.5)" : 'none', display: "flex", gap: "30px", width: "293px"
                            }}
                                className={styles.stage_title_row}>03 <div className={3 == activeStage ? styles.animate_line_3 : styles.line} /></div>
                            <div className={styles.stage_description_1}><span style={{ color: "white" }}>Проверьте сообщения</span> <br />в чате <span>заказа</span></div>
                            <div className={styles.stage_description_2}>Оператор через чат подключит подписку на вашу консоль</div>
                        </div>
                        <div className={styles.stage}>
                            <div style={{
                                color: 0 === activeStage ? color[3] : 'white',
                                textShadow: 0 === activeStage ? "20px -15px 60px rgba(52, 151, 126, 0.5)" : 'none', display: "flex", gap: "30px"
                            }}>04</div>
                            <div className={styles.stage_description_1}><span style={{ color: "white" }}>Получайте</span><br />удовольствие от игры</div>
                            <div className={styles.stage_description_2}>Наслаждайтесь всеми преимуществами подписки без ограничений!</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.background} style={{ padding: "0px", margin: "0 auto", marginTop: "50px", display: "flex", flexDirection: "column", gap: "40px", width: "320px" }}>
                <b className={styles.title} style={{ fontSize: "25px", fontFamily: "Unbounded_Bold" }}>КАК ПРОИСХОДИТ<br /><span style={{ color: "var(--color-silver-100)" }}>ПОДКЛЮЧЕНИЕ ПОДПИСКИ</span></b>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontSize: "var(--font-size-21xl)" }}>

                    <div className={styles.stage} style={{ flexDirection: "row", height: "164px" }}>
                        <div style={{
                            color: 1 === activeStage ? color[0] : 'white',
                            textShadow: 1 === activeStage ? "20px -15px 60px rgba(238, 70, 252, 0.5)" : 'none', display: "flex", gap: "30px", width: "40px",
                            flexDirection: "column", fontSize: "32px"
                        }}>01
                            <div className={1 == activeStage ? styles.mobile_animate_line_1 : styles.mobile_line} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div className={styles.stage_description_1} style={{ paddingBottom: "0px", border: "none", fontSize: "16px" }}><span style={{ color: "white" }}>Выберите нужный</span><br />тариф PS PLUS</div>
                            <div style={{ background: "#615568", width: "100%", height: "2px" }}></div>
                            <div className={styles.stage_description_2} style={{ fontSize: "11px" }}>В меню каждого товара есть описание с преимуществами каждой подписки</div>
                        </div>
                    </div>

                    <div className={styles.stage} style={{ flexDirection: "row", height: "164px" }}>
                        <div style={{
                            color: 2 === activeStage ? color[1] : 'white',
                            textShadow: 2 === activeStage ? "20px -15px 60px rgba(97, 195, 255, 0.5)" : 'none', display: "flex", gap: "30px", width: "40px",
                            flexDirection: "column", fontSize: "32px"
                        }}
                            className={styles.stage_title_row}>02 <div className={2 == activeStage ? styles.mobile_animate_line_2 : styles.mobile_line} /></div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div className={styles.stage_description_1} style={{ paddingBottom: "0px", border: "none", fontSize: "16px" }}><span style={{ color: "white" }}>Проведите оплату</span><br />удобным способом</div>
                            <div style={{ background: "#615568", width: "100%", height: "2px" }}></div>
                            <div className={styles.stage_description_2} style={{ fontSize: "11px" }}>После оплаты вы автоматически зарегистрируетесь<br />на нашем сайте</div>
                        </div>
                    </div>

                    <div className={styles.stage} style={{ flexDirection: "row", height: "164px" }}>
                        <div style={{
                            color: 3 === activeStage ? color[2] : 'white',
                            textShadow: 3 === activeStage ? "20px -15px 60px rgba(150, 94, 235, 0.5)" : 'none', display: "flex", gap: "30px", width: "40px",
                            flexDirection: "column", fontSize: "32px"
                        }}
                            className={styles.stage_title_row}>03 <div className={3 == activeStage ? styles.mobile_animate_line_3 : styles.mobile_line} /></div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div className={styles.stage_description_1} style={{ paddingBottom: "0px", border: "none", fontSize: "16px" }}><span style={{ color: "white" }}>Проверьте сообщения</span> <br />в чате <span>заказа</span></div>
                            <div style={{ background: "#615568", width: "100%", height: "2px" }}></div>
                            <div className={styles.stage_description_2} style={{ fontSize: "11px" }}>Оператор через чат подключит подписку на вашу консоль</div>
                        </div>
                    </div>

                    <div className={styles.stage} style={{ flexDirection: "row", height: "164px" }}>
                        <div style={{
                            color: 0 === activeStage ? color[3] : 'white',
                            textShadow: 0 === activeStage ? "20px -15px 60px rgba(52, 151, 126, 0.5)" : 'none', display: "flex", gap: "30px", width: "40px",
                            flexDirection: "column", fontSize: "32px"
                        }}>04</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div className={styles.stage_description_1} style={{ paddingBottom: "0px", border: "none", fontSize: "16px" }}><span style={{ color: "white" }}>Получайте</span><br />удовольствие от игры</div>
                            <div style={{ background: "#615568", width: "100%", height: "2px" }}></div>
                            <div className={styles.stage_description_2} style={{ fontSize: "11px" }}>Наслаждайтесь всеми преимуществами подписки без ограничений!</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FourthFrame