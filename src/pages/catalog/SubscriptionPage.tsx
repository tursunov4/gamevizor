import BaseCenterContainer from "../../components/baseCenterContainer"
import Footer from "../../components/footer"
import Header from "../../components/header"
import FifthFrame from "../../components/indexPage/fifthFrane"
import styles from "../../styles/pages/SubscriptionPage.module.css"
import FourthFrame from "../../components/indexPage/fourthFrame"
import OrderComponent from "../../components/OrderComponent"
import Slider from "react-slick"
import { useEffect, useState } from "react"
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ProductInterface } from "../../interfaces/productInterface"
import axios from "axios"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useAuth } from "../../stores/JWTTokenStore"
import useWindowSize from "../../components/state/useWindowSize"
import FeedbackInfoFrame from "../../components/panels/feedbacks/FeedbackInfoFrame"

interface InformationInterface {
    top_games: {
        url: string;
        title: string;
        description: string;
    }[];

    games: {
        url: string;
        title: string;
    }[];
}


function SubscriptionPage() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0); // Сбрасывает скролл в начало страницы
    }, []);

    const { accessToken } = useAuth();

    const [product, setProduct] = useState<ProductInterface>();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return
        axios.get('/api/v1/products/' + id + "/")
            .then(response => {
                setProduct(response.data);

                document.title = "GAMEVIZOR | Купить подписку " + response.data.title
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });
    }, [accessToken])

    const [maxWidth, setMaxWidth] = useState(1600.0)
    const [width, _] = useWindowSize()

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    const settings = {
        infinite: true,
        speed: 500,
        autoplaySpeed: 2000,
        autoplay: true,
        arrows: false,
        slidesToShow: width > maxWidth ? 5 : 8,
        autoplayPauseOnHover: true
    };

    const [information, setInformation] = useState<InformationInterface | null>(null)

    useEffect(() => {
        if (information) return

        axios.get("/api/v1/get_info_for_playstation_mouth/")
            .then(response => {
                setInformation(response.data)
            })
    })

    const [currentMonth, setCurrentMonth] = useState('');

    useEffect(() => {
        const date = new Date();
        const month = date.getMonth(); // Возвращает номер месяца (от 0 до 11)
        const months = [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ];
        setCurrentMonth(months[month]);
    }, []);

    const [searchParams, _setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleRedirectOrder = () => {
        var ordersCreateUrl = `/order/create?type=${"SUBSCRIPTION"}&id=${id}&is_deluxe=${searchParams.get("is_deluxe") ?? false}` + "&platform_id=" + (searchParams.get("platform_id") ?? product?.platforms[0]?.id ?? "");
        navigate(ordersCreateUrl); // Use navigate to change the URL
    }

    const [isFixed, setIsFixed] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY + window.innerHeight < document.body.clientHeight - 497) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });


    if (width > maxWidth) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh", margin: "0 auto", }} className={styles.background}>
                <BaseCenterContainer style={{ zoom: 0.9, position: "relative" }}>
                    <Header style={{ padding: "20px 189px" }} />

                    <img src={"/images/backgrounds/ps_plus_background_left.png"} width={412} style={{
                        position: "absolute", left: "-200px",
                        top: 0, mixBlendMode: "luminosity", opacity: "0.5", pointerEvents: "none"
                    }} />
                    <img src={"/images/backgrounds/ps_plus_background_header_2.png"} style={{ position: "absolute", top: 0, zIndex: "-1" }} />
                    <div className={styles.top_sub}>
                        <div style={{ color: "rgba(255, 255, 255, 0.5)", paddingLeft: "140px" }}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <Link to={"../catalog/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Каталог</Link> /<span style={{ color: "white" }}>Подписка {product?.title?.toLowerCase() == "основной" ? "ОСНОВНАЯ" : product?.title} {product?.subscription_duration_mouth} мес</span></div>

                        <div style={{ display: "flex", justifyContent: "space-around" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div className={styles.tags}>
                                    {product?.is_hit ? <div className={styles.tag}>Хит</div> : null}
                                    {product?.is_novelty ? <div className={styles.tag}>Новинка</div> : null}
                                </div>
                                <div style={{ fontFamily: "Unbounded_Bold", fontSize: "100px" }}>Подписка<br /><span style={{ color: "#FFBB10" }}>{product?.title?.toLowerCase() == "основной" ? "ОСНОВНАЯ" : product?.title}</span></div>
                                <div style={{ maxWidth: "538px", fontSize: "13px" }}>{product?.description}</div>
                            </div>
                            <OrderComponent redirect />
                        </div>
                    </div>

                    <div className={styles.top_Frame}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{
                                textTransform: "uppercase", fontFamily: "Unbounded_Bold",
                                fontSize: "2rem", alignSelf: "center", textAlign: "center"
                            }}>Игры месяца <br /><span style={{ color: "#D4D4D4" }}>{currentMonth}</span></div>
                        </div>

                        {information &&
                            <div style={{ display: "flex", gap: "20px", margin: "0 auto" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "290px", textAlign: "center" }}>
                                    <img src={information?.top_games[0]?.url} style={{ borderRadius: "20px" }} />
                                    <div style={{ alignSelf: "center", fontSize: "16px" }}>{information?.top_games[0]?.title}</div>
                                    <div>{information?.top_games[0]?.description}</div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "340px" }}>
                                    <img src={information?.top_games[1]?.url} className={styles.gradient} />
                                    <div style={{ alignSelf: "center", fontSize: "16px" }}>{information?.top_games[1]?.title}</div>
                                    <div style={{ textAlign: "center" }}>{information?.top_games[1]?.description}</div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "290px", textAlign: "center" }}>
                                    <img src={information?.top_games[2]?.url} style={{ borderRadius: "20px" }} />
                                    <div style={{ alignSelf: "center", fontSize: "16px" }}>{information?.top_games[2]?.title}</div>
                                    <div>{information?.top_games[2]?.description}</div>
                                </div>
                            </div>
                        }
                    </div>

                    <div style={{
                        display: "flex", flexDirection: "column", marginBottom: "100px", paddingLeft: "100px", gap: "40px", position: "relative",
                        marginTop: "100px", maxWidth: "1342px"
                    }}>
                        <img src={"/images/backgrounds/ps_plusBackgrounds.png"} style={{
                            position: "absolute",
                            top: "310px", left: "350px", width: "1260px", zIndex: "1", pointerEvents: "none"
                        }} />
                        <div style={{
                            textTransform: "uppercase", fontFamily: "Unbounded_Bold",
                            fontSize: "2rem", alignSelf: "center"
                        }}>что входит<br /><span style={{ color: "#D4D4D4" }}>в подписку</span></div>
                        <div style={{ display: "flex", gap: "25px" }}>
                            <div className={styles.panel}>
                                <img src={"/images/products/ps_ultra_header.png"} width={400} style={{
                                    position: "absolute", zIndex: -1,
                                    borderRadius: "20px", left: "0", top: "0", pointerEvents: "none"
                                }} />
                                <div style={{ display: "flex", justifyContent: "space-between", position: "relative", top: "-10px" }}>
                                    <div style={{ color: "#FFBB10", fontFamily: "Unbounded_Extra_Bold", fontSize: "28px", alignSelf: "center" }}>ЛЮКС</div>
                                    <img src={"/images/products/ps_plus.png"} width={126} height={97} style={{ transform: "scale(1.1)" }} />
                                </div>
                                <div className={styles.enter_to_sub}>Игры месяца</div>
                                <div className={styles.enter_to_sub}>Сетевая многопользовательская игра</div>
                                <div className={styles.enter_to_sub}>Облачное хранилище</div>
                                <div className={styles.enter_to_sub}>Share Play</div>
                                <div className={styles.enter_to_sub}>Каталог игр</div>
                                <div className={styles.enter_to_sub}>Классика Ubisoft+</div>
                                <div className={styles.enter_to_sub}>Каталог классики</div>
                                <div className={styles.enter_to_sub}>Пробные версии игр</div>
                            </div>

                            <div className={styles.panel}>
                                <img src={"/images/products/ps_extra_header.png"} width={400} style={{ position: "absolute", zIndex: -1, borderRadius: "20px", left: "0", top: "0" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", position: "relative", top: "-10px" }}>
                                    <div style={{ color: "#212229", fontFamily: "Unbounded_Extra_Bold", fontSize: "28px", alignSelf: "center" }}>ЭКСТРА</div>
                                    <img src={"/images/products/ps_plus.png"} width={126} height={97} style={{ transform: "scale(1.1)" }} />
                                </div>
                                <div className={styles.enter_to_sub}>Игры месяца</div>
                                <div className={styles.enter_to_sub}>Сетевая многопользовательская игра</div>
                                <div className={styles.enter_to_sub}>Облачное хранилище</div>
                                <div className={styles.enter_to_sub}>Share Play</div>
                                <div className={styles.enter_to_sub}>Каталог игр</div>
                                <div className={styles.enter_to_sub}>Классика Ubisoft+</div>
                            </div>

                            <div className={styles.panel}>
                                <img src={"/images/products/ps_base_header.png"} width={400} style={{ position: "absolute", zIndex: -1, borderRadius: "20px", left: "0", top: "0" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", position: "relative", top: "-10px" }}>
                                    <div style={{ color: "#212229", fontFamily: "Unbounded_Extra_Bold", fontSize: "28px", alignSelf: "center" }}>ОСНОВНОЙ</div>
                                    <img src={"/images/products/ps_plus.png"} width={126} height={97} style={{ transform: "scale(1.1)" }} />
                                </div>
                                <div className={styles.enter_to_sub}>Игры месяца</div>
                                <div className={styles.enter_to_sub}>Сетевая многопользовательская игра</div>
                                <div className={styles.enter_to_sub}>Облачное хранилище</div>
                                <div className={styles.enter_to_sub}>Share Play</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "50px", maxWidth: "1760px", paddingLeft: "150px" }}>
                        <div style={{ textTransform: "uppercase", fontFamily: "Unbounded_Bold", fontSize: "2rem" }}><span>популярные Игры</span><br /><span style={{ color: "#C2C2C2" }}>в подписке ЭКСТРА ЛЮКС</span></div>
                        <div style={{ width: "1550px", position: "relative", left: "-150px" }}>
                            {isClient && <Slider {...settings} lazyLoad='ondemand'>
                                {information?.games.map((game) => (
                                    <div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "290px", textAlign: "center" }}>
                                            <img src={game?.url} style={{ borderRadius: "20px", width: "290px" }} />
                                            <div style={{ alignSelf: "center" }}>{game?.title}</div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>}
                        </div>
                    </div>


                    <FourthFrame />

                    <div style={{ marginTop: "80px", paddingLeft: "180px", paddingRight: "180px" }}>
                        <FeedbackInfoFrame />
                    </div>

                    <FifthFrame />

                    <div className={styles.background_footer}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ fontFamily: "Unbounded_Bold", fontSize: "30px", textTransform: "uppercase" }}>оформи подписку<br />PS plus<img src={"/images/products/ps_plus.png"} width={50} height={38} /></div>
                            <div style={{ color: "#FFBB10", fontFamily: "Unbounded_Bold", fontSize: "76px" }}>{product?.title}</div>
                            <div style={{ fontFamily: "Unbounded_Light_Base" }}>Присоединяйся к миллионам игроков<br /> по всему миру и получи доступ к<br /> множеству удивительных преимуществ</div>
                        </div>
                        <div>
                            <OrderComponent redirect />
                        </div>
                        <img src="/images/backgrounds/background_sub_footer.png" style={{
                            position: "absolute", zIndex: "-1",
                            maxWidth: "1721", height: "774px", top: "-230px"
                        }} />
                    </div>
                </BaseCenterContainer>
                <div style={{
                    marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: 0.9,
                }}>
                    <Footer style={{ margin: "30px auto auto", maxWidth: "1240px", background: "none", marginBottom: "30px" }} />
                </div>

            </div>
        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflowX: "hidden" }} className={styles.background}>
                <BaseCenterContainer style={{ position: "relative" }}>
                    <Header />

                    <img src={"/images/backgrounds/ps_plus_background_left.png"} width={412} style={{
                        position: "absolute", left: "-200px",
                        top: 0, mixBlendMode: "luminosity", opacity: "0.9", pointerEvents: "none", scale: "0.5",
                    }} />
                    <img src={"/images/backgrounds/background_subscriptions_mobile.png"} style={{ position: "absolute", top: 0, zIndex: "-1", width: "100%" }} />
                    <div className={styles.top_sub} style={{ paddingLeft: "25px", paddingRight: "25px" }}>
                        <div style={{ color: "rgba(255, 255, 255, 0.5)" }}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <Link to={"../catalog/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Каталог</Link> /<span style={{ color: "white" }}>Подписка {product?.title?.toLowerCase() == "основной" ? "ОСНОВНАЯ" : product?.title} {product?.subscription_duration_mouth} мес</span></div>

                        <div style={{ display: "flex" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div className={styles.tags}>
                                    {product?.is_hit ? <div className={styles.tag}>Хит</div> : null}
                                    {product?.is_novelty ? <div className={styles.tag}>Новинка</div> : null}
                                </div>
                                <div style={{ fontFamily: "Unbounded_Bold", fontSize: "32px" }}>Подписка<br /><span style={{ color: "#FFBB10" }}>{product?.title?.toLowerCase() == "основной" ? "ОСНОВНАЯ" : product?.title}</span></div>
                                <div style={{ maxWidth: "288px", fontSize: "13px", minHeight: "91px" }}>{product?.description}</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.top_Frame} style={{ borderRadius: "10px", minHeight: "838px", padding: "20px", height: "fit-content" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "40px" }}>
                            <div style={{
                                textTransform: "uppercase", fontFamily: "Unbounded_Bold",
                                fontSize: "2rem", alignSelf: "center", textAlign: "center"
                            }}>Игры месяца <br /><span style={{ color: "#D4D4D4" }}>{currentMonth}</span></div>
                        </div>

                        <div style={{ display: "flex", gap: "20px", margin: "0 auto", flexDirection: "column" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "320px" }}>
                                <img src={information?.top_games[1]?.url} className={styles.gradient} />
                                <div style={{ alignSelf: "center", fontSize: "16px" }}>{information?.top_games[1]?.title}</div>
                                <div style={{ textAlign: "center" }}>{information?.top_games[1]?.description}</div>
                            </div>
                            <div style={{ display: 'flex', gap: "20px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "152px", textAlign: "center" }}>
                                    <img src={information?.top_games[0]?.url} style={{ borderRadius: "20px" }} />
                                    <div style={{ alignSelf: "center", fontSize: "16px" }}>{information?.top_games[0]?.title}</div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "152px", textAlign: "center" }}>
                                    <img src={information?.top_games[2]?.url} style={{ borderRadius: "20px" }} />
                                    <div style={{ alignSelf: "center", fontSize: "16px" }}>{information?.top_games[2]?.title}</div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div style={{
                        display: "flex", flexDirection: "column", paddingLeft: "25px", gap: "40px", position: "relative",
                        marginTop: "100px", paddingRight: '25px',
                    }}>
                        <img src={"/images/backgrounds/ps_plus_mobile_mini_sub.png"} style={{
                            position: "absolute",
                            top: "550px", left: "200px", width: "152px", zIndex: "1", pointerEvents: "none", height: "181px"
                        }} />
                        <div style={{
                            textTransform: "uppercase", fontFamily: "Unbounded_Bold",
                            fontSize: "2rem", alignSelf: "center"
                        }}>что входит<br /><span style={{ color: "#D4D4D4" }}>в подписку</span></div>
                        <div style={{ display: "flex", gap: "25px", overflowX: "auto", paddingBottom: "30px" }}>
                            <div className={styles.panel}>
                                <img src={"/images/products/ps_ultra_header.png"} width={400} style={{
                                    position: "absolute", zIndex: -1,
                                    borderRadius: "20px", left: "0", top: "0", pointerEvents: "none", width: "100%"
                                }} />
                                <div style={{ display: "flex", justifyContent: "space-between", position: "relative", top: "-10px" }}>
                                    <div style={{ color: "#FFBB10", fontFamily: "Unbounded_Extra_Bold", fontSize: "28px", alignSelf: "center" }}>ЛЮКС</div>
                                    <img src={"/images/products/ps_plus.png"} width={126} height={97} style={{ transform: "scale(1.1)" }} />
                                </div>
                                <div className={styles.enter_to_sub}>Игры месяца</div>
                                <div className={styles.enter_to_sub}>Сетевая многопользовательская игра</div>
                                <div className={styles.enter_to_sub}>Облачное хранилище</div>
                                <div className={styles.enter_to_sub}>Share Play</div>
                                <div className={styles.enter_to_sub}>Каталог игр</div>
                                <div className={styles.enter_to_sub}>Классика Ubisoft+</div>
                                <div className={styles.enter_to_sub}>Каталог классики</div>
                                <div className={styles.enter_to_sub}>Пробные версии игр</div>
                            </div>

                            <div className={styles.panel}>
                                <img src={"/images/products/ps_extra_header.png"} width={400} style={{ position: "absolute", zIndex: -1, borderRadius: "20px", left: "0", top: "0", width: "100%" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", position: "relative", top: "-10px", width: "100%" }}>
                                    <div style={{ color: "#212229", fontFamily: "Unbounded_Extra_Bold", fontSize: "28px", alignSelf: "center" }}>ЭКСТРА</div>
                                    <img src={"/images/products/ps_plus.png"} width={126} height={97} style={{ transform: "scale(1.1)" }} />
                                </div>
                                <div className={styles.enter_to_sub}>Игры месяца</div>
                                <div className={styles.enter_to_sub}>Сетевая многопользовательская игра</div>
                                <div className={styles.enter_to_sub}>Облачное хранилище</div>
                                <div className={styles.enter_to_sub}>Share Play</div>
                                <div className={styles.enter_to_sub}>Каталог игр</div>
                                <div className={styles.enter_to_sub}>Классика Ubisoft+</div>
                            </div>

                            <div className={styles.panel} style={{ marginRight: "25px" }}>
                                <img src={"/images/products/ps_base_header.png"} width={400} style={{ position: "absolute", zIndex: -1, borderRadius: "20px", left: "0", top: "0", width: "100%" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", position: "relative", top: "-10px", width: "100%" }}>
                                    <div style={{ color: "#212229", fontFamily: "Unbounded_Extra_Bold", fontSize: "28px", alignSelf: "center" }}>ОСНОВНОЙ</div>
                                    <img src={"/images/products/ps_plus.png"} width={126} height={97} style={{ transform: "scale(1.1)" }} />
                                </div>
                                <div className={styles.enter_to_sub}>Игры месяца</div>
                                <div className={styles.enter_to_sub}>Сетевая многопользовательская игра</div>
                                <div className={styles.enter_to_sub}>Облачное хранилище</div>
                                <div className={styles.enter_to_sub}>Share Play</div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "50px", maxWidth: "320px" }}>
                            <div style={{ textTransform: "uppercase", fontFamily: "Unbounded_Bold", fontSize: "24px" }}><span>популярные Игры</span><br /><span style={{ color: "#C2C2C2" }}>в подписке ЭКСТРА и ЛЮКС</span></div>
                            <div style={{ width: "1550px", position: "relative", left: "-150px" }}>
                                {isClient && <Slider {...settings} lazyLoad='ondemand'>
                                    {information?.games.map((game) => (
                                        <div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "152px", textAlign: "center" }}>
                                                <img src={game?.url} style={{ borderRadius: "20px", width: "152px" }} />
                                                <div style={{ alignSelf: "center" }}>{game?.title}</div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>}
                            </div>
                        </div>

                        <FourthFrame />
                        <div style={{marginBottom: "-60px"}}>
                            <FeedbackInfoFrame is_mobile />
                        </div>

                        <FifthFrame />

                        <div className={styles.pay_panel_mobile} style={{
                            width: "calc(100% - 40px)",
                            position: 'fixed',
                            bottom: isFixed ? '-20px' : '280px',
                            display: isFixed ? "flex" : "none"
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: "15px" }}>
                                <div style={{ fontFamily: "Unbounded_Medium", fontSize: "17px" }}>
                                    {product?.discount?.discount_cost ? <div style={{ color: "rgb(132, 130, 143)" }}><span style={{ color: "rgb(255, 0, 122)", textDecoration: "none" }}>
                                        {(product?.cost ?? 0) - (product?.discount?.discount_cost ?? 0)} ₽</span> <span style={{ textDecoration: "line-through" }}>{product?.cost} ₽</span></div> : <span>{product?.cost} ₽</span>}
                                </div>
                                <div style={{ fontSize: "10px", fontFamily: "Unbounded_Light_Base" }}>Если у вас есть промокод -<br /> введите его при оформлении</div>
                            </div>
                            <div className={styles.button} style={{ width: "87px" }} onClick={handleRedirectOrder}>Оформить</div>
                        </div>

                        <div className={styles.background_footer} style={{ flexDirection: "column", padding: "0", position: "relative", marginBottom: "0px" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ fontFamily: "Unbounded_Bold", fontSize: "20px", textTransform: "uppercase", textAlign: "center" }}>оформи подписку<br />PS plus<img src={"/images/products/ps_plus.png"} width={50} height={38} /></div>
                                <div style={{ color: "#FFBB10", fontFamily: "Unbounded_Bold", fontSize: "32px", textAlign: "center" }}>{product?.title}</div>
                                <div style={{ fontFamily: "Unbounded_Light_Base", textAlign: "center", fontSize: "10px", marginBottom: "50px" }}>Присоединяйся к миллионам игроков<br /> по всему миру и получи доступ к<br /> множеству удивительных преимуществ</div>
                            </div>
                            <div style={{ margin: "0px auto", position: "relative", left: "50%", transform: 'translateX(-50%)' }}>
                                <OrderComponent redirect is_mobile />
                            </div>
                            <img src="/images/backgrounds/background_subscriptions_mobile.png" style={{
                                position: "absolute", zIndex: "-1",
                                width: "116%", height: "673px", bottom: "0", left: "-25px"
                            }} />
                        </div>
                    </div>
                    <div style={{ marginTop: "-100px" }}>
                        <Footer style={{ height: "150px", display: "flex", justifyContent: "center", marginTop: "0px" }} />
                    </div>
                </BaseCenterContainer >
            </div >
        )
    }
}

export default SubscriptionPage