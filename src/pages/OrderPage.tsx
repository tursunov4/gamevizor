import { FunctionComponent, useEffect, useState } from "react"
import styles from "../styles/orderPage.module.css"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Input from "../components/inputs/input"
import 'react-phone-input-2/lib/style.css'
import Checkbox from "../components/inputs/checkbox"
import axios from "axios"
import BaseCenterContainer from "../components/baseCenterContainer"
import Header from "../components/header"
import Footer from "../components/footer"
import PromoCodeData from "../interfaces/promoCodeData"
import { useUser } from "../stores/userStore"
import { useAuth } from "../stores/JWTTokenStore"
import MyPhoneInput from "../components/inputs/MyPhoneInput"
import useWindowSize from "../components/state/useWindowSize"
import MyTextAreaInput from "../components/inputs/MyTextAreaInput"
import infoAboutOrderInterface from "../interfaces/infoAboutOrderInterface"
import get_price_from_promocode from "../tools/get_price_from_promocode"
import { api_wallet_get_cost } from "../api/api_wallet"



const PriceDisplay: React.FC<({ PromoCode: PromoCodeData | null; infoAboutOrder: infoAboutOrderInterface | null })> = ({ PromoCode, infoAboutOrder }) => {
    if (PromoCode && infoAboutOrder) {
        if (PromoCode.type === "FIXED") {
            return Number(PromoCode.value); // Assuming PromoCode.value is already a number
        } else if (PromoCode.type === "PERCENT") {
            // Make sure OrderData.cost is a number
            if (infoAboutOrder?.product) {
                var cost = Number(infoAboutOrder.product.cost);
            } else {
                var cost = 0
            }
            if (!isNaN(cost)) { // Check if the conversion was successful
                return Number(cost * (Number(PromoCode.value) / 100));
            } else {
                // Handle cases where OrderData.cost is not a valid number
                // You might want to display an error message or use a default value
                return 0;
            }
        }
    }
    return 0;
};


const OrderPage: FunctionComponent = () => {
    const [Phone, setPhone] = useState('');

    const [isAcceptRule, SetIsAcceptRule] = useState(false);

    const [infoAboutOrder, SetInfoAboutOrder] = useState<infoAboutOrderInterface | null>(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const [PromoCode, setPromoCode] = useState<PromoCodeData | null>(null);

    const [isDone, setIsDone] = useState(false);


    const promocode = searchParams.get("promocode")
    const [inputPromoCode, setInputPromoCode] = useState(promocode ? promocode : "");
    const { setAccessToken, accessToken } = useAuth();

    useEffect(() => {
        handleEnterPromoCode()
    }, [promocode])

    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const platform_id = parseFloat(searchParams.get('platform_id') ?? "0") ?? 0
    const country_id = parseInt(searchParams.get("country") ?? "-1")

    const value = parseInt(searchParams.get("value") ?? "-1")


    const handleEnterPromoCode = () => {
        if (inputPromoCode === "") return
        // Если токен есть, запрос на получение данных пользователя
        axios.get('/api/v1/get_promo_code/', {
            headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`
            } : {},
            params: {
                title: inputPromoCode,
                type: type,
                id: id ?? country_id,
            }
        })
            .then(response => {
                setPromoCode(response.data);
                return
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });




    }

    // const [platforms, setPlatforms] = useState<{ id: number, title: string }[]>([]);

    const { user } = useUser();



    const [Username, SetUsername] = useState('');

    const [Email, SetEmail] = useState('');

    const [commentsForOrder, setCommentsForOrder] = useState();

    const navigate = useNavigate();

    const [IsTimeForCreateOrder, setIsTimeForCreateOrder] = useState(false);

    var [resultChatId, setResultChatId] = useState(0)

    const [Error, setError] = useState("")

    useEffect(() => {
        // Проверка на наличие токена
        const token = localStorage.getItem('token');
        const config = {
            params: {
                type: type,
                id: id,
                country: country_id
            },
            headers: {}
        };

        if (token) {
            // Если токен есть, добавьте его в заголовок Authorization
            config.headers = {
                Authorization: `Token ${token}`
            };
        }

        axios.get('/api/v1/get_info_for_order/', config)
            .then(response => {
                if (type == "PRODUCT" || type == "SUBSCRIPTION" || type == "CURRENCY") {
                    SetInfoAboutOrder({ ...infoAboutOrder, product: response.data });
                }

                if (type == "WALLET") {
                    SetInfoAboutOrder({ ...infoAboutOrder, wallet: response.data })
                }
                //setPlatforms(response.data.platforms)
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
                // Handle the error (e.g., redirect to login, show an error message)
                if (error.response && error.response.status === 401) {
                    navigate('/login'); // Redirect to login if unauthorized
                }
            });
    }, [type, id]); // Include 'type' and 'id' in dependencies


    const handleCreateOrder = () => {
        if (!isAcceptRule) {
            return;
        }

        if (user == null) {
            axios.post('/api/v1/auth/registration/fast_register/', {
                username: Username,
                phone_number: "+" + Phone,
                email: Email,
            }, {
                headers: {
                },
            })
                .then((response) => {
                    setAccessToken(response.data.token);
                    setIsTimeForCreateOrder(true)
                    setError("")

                })
                .catch(error => {
                    console.error('Ошибка создание пользователя:', error);
                    setError("Ошибка создание пользователя")
                    setIsTimeForCreateOrder(false)
                    return
                });
        } else {
            setIsTimeForCreateOrder(true)
        }
    }


    useEffect(() => {
        if (!accessToken) return
        if (OrderId) return

        const order_id = searchParams.get("order_id")
        if (order_id) {
            setOrderId(parseFloat(order_id))
            axios.get('/api/v1/payment/check/' + order_id + '/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            ).then((response) => {
                console.log(response.data)
                setOrderId(parseFloat(order_id))
                if (response.data.status === "WAITING") {
                    setPaymentUrl(response.data.url)
                    setWaitingForPayment(true)
                    setIsDone(false)
                }
                if (response.data.status === "ACCEPT") {
                    setWaitingForPayment(false)
                    setIsDone(true)
                    setResultChatId(response.data.chat)
                }

                if (response.data.status === "ERROR") {
                    setWaitingForPayment(false)
                    setIsDone(false)
                    setErrorPayment(true)
                }
            })
                .catch(_error => {
                })
        }
    }, [accessToken])

    const [OrderId, setOrderId] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                if (!OrderId) return
                axios.get('/api/v1/payment/check/' + OrderId + '/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }

                ).then((response) => {
                    console.log(response.data)
                    if (response.data.status === "WAITING") {
                        setPaymentUrl(response.data.url)
                        setWaitingForPayment(true)
                        setIsDone(false)
                    }
                    if (response.data.status === "ACCEPT") {
                        setWaitingForPayment(false)
                        setIsDone(true)
                        setResultChatId(response.data.chat)
                    }

                    if (response.data.status === "ERROR") {
                        setWaitingForPayment(false)
                        setIsDone(false)
                        setErrorPayment(true)
                    }
                })
            } catch (error) {
                console.error('Ошибка при вызове API:', error);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [OrderId]);


    useEffect(() => {
        if (!accessToken) return
        if (!IsTimeForCreateOrder) return
        if (WaitingForPayment) return
        if (!user) return


        axios.post('/api/v1/create_payload/', {
            id: id ?? searchParams.get("country"),
            promocode: inputPromoCode,
            comments_for_order: commentsForOrder,
            platform_id: platform_id,
            is_deluxe: searchParams.get("is_deluxe") ?? "false",
            type: type,
            value: searchParams.get("value")
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        })
            .then((response) => {
                window.open(response.data.url);
                setPaymentUrl(response.data.url)
                setWaitingForPayment(true);
                setOrderId(response.data.order_id)

                setSearchParams({ ...searchParams, "order_id": response.data.order_id })

                setError("")

                //setIsDone(true);
                //setResultChatId(response.data.chat)
            })
            .catch(error => {
                console.error('Ошибка создание order:', error);
                setIsTimeForCreateOrder(false)
                setError("Ошибка создание заказа")
            });
    }, [accessToken, IsTimeForCreateOrder, user])

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [finalPrice, setFinalPrice] = useState(0)
    const [promoPrice, setPromoPrice] = useState(0)

    const [WalletPrice, setWalletPrice] = useState(0)

    useEffect(() => {
        const GetCost = async () => {
            if (type === "WALLET") {
                const price = await api_wallet_get_cost(value, country_id)
                const data = get_price_from_promocode(price?.cost, PromoCode)

                setWalletPrice(price?.cost)

                if (data?.discount) setPromoPrice(data.discount)
                setFinalPrice(data.cost)
            } else {
                if (searchParams.get("is_deluxe") === "true") {
                    var cost = infoAboutOrder?.product?.deluxe_or_premium_cost || 0; // значение по умолчанию 0, если cost  undefined
                } else {
                    var cost = infoAboutOrder?.product?.cost || 0; // значение по умолчанию 0, если cost  undefined
                }
                setPromoPrice(PriceDisplay({ PromoCode, infoAboutOrder }) as number);
                const data = get_price_from_promocode(cost, PromoCode)
                setFinalPrice(data.cost);
            }
        }

        GetCost()
    }, [infoAboutOrder])

    useEffect(() => {
        const GetCost = async () => {
            if (type === "WALLET") {
                const price = await api_wallet_get_cost(value, country_id)
                const data = get_price_from_promocode(price?.cost, PromoCode)

                if (data?.discount) setPromoPrice(data.discount)
                setFinalPrice(data.cost)
            } else {
                if (searchParams.get("is_deluxe") === "true") {
                    var cost = infoAboutOrder?.product?.deluxe_or_premium_cost || 0; // значение по умолчанию 0, если cost  undefined
                } else {
                    var cost = infoAboutOrder?.product?.cost || 0; // значение по умолчанию 0, если cost  undefined
                }
                setPromoPrice(PriceDisplay({ PromoCode, infoAboutOrder }) as number);
                const data = get_price_from_promocode(cost, PromoCode)
                setFinalPrice(data.cost);
            }
        }

        GetCost()
    }, [PromoCode])

    const [WaitingForPayment, setWaitingForPayment] = useState(false)
    const [isErrorPayment, setErrorPayment] = useState(false)
    const [PaymentUrl, setPaymentUrl] = useState("")


    const [maxWidth, setMaxWidth] = useState(1600.0)
    const [width, _] = useWindowSize()

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [navigate]);

    useEffect(() => {
        console.log(infoAboutOrder?.product?.title)
    }, [infoAboutOrder])

    if (width >= maxWidth) {
        return (
            <div className={styles.main_container} >
                <BaseCenterContainer style={{ zoom: 0.9 }}>
                    <Header style={(isDone || WaitingForPayment) ? { filter: "blur(22px)" } : {}} />
                    <div className={styles.background} style={(isDone || WaitingForPayment) ? { filter: "blur(22px)" } : {}}>
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

                        <div className={styles.container}>

                            <div style={{
                                display: "flex", justifyContent: "space-between",
                                fontWeight: 700, fontSize: "var(--font-size-13xl)", textTransform: "uppercase"
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", fontFamily: "Unbounded_Bold" }}>
                                    <span>ОФОРМЛЕНИЕ</span>
                                    <span style={{ color: "var(--color-silver-100)" }}>ЗАКАЗА</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "end" }}>
                                    <span style={{ fontFamily: "Unbounded_Bold" }}>{infoAboutOrder?.product?.title || infoAboutOrder?.wallet?.title} <span style={{ color: "var(--color-silver-100)" }}>{infoAboutOrder?.product?.product_type === "SUBSCRIPTION" ? `${infoAboutOrder?.product?.subscription_duration_mouth} МЕС *` : ""}</span></span>
                                    {infoAboutOrder?.product?.product_type ? <span style={{
                                        textAlign: "end", maxWidth: "200px",
                                        fontSize: "var(--font-size-3xs)", fontWeight: "300", color: "var(--color-silver-100)", lineHeight: "130%",
                                        fontFamily: "Unbounded_Light_Base"
                                    }}>
                                        {(infoAboutOrder?.product?.product_type === "SUBSCRIPTION" && infoAboutOrder?.product?.subscription_type == "PS_PLUS") ? "* Срок подписки может быть меньше до 2 недель" : ""}
                                    </span>
                                        : null}
                                    {infoAboutOrder?.wallet ? <span style={{ fontFamily: "Unbounded_Bold", color: "var(--color-silver-100)" }}>{infoAboutOrder?.wallet?.country} на {value} {infoAboutOrder?.wallet.tag}</span> : null}
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "20px" }}>
                                <div className={styles.container_order_info}>
                                    <div style={{ fontSize: "var(--font-size-xl)" }}>Покупатель</div>
                                    <div className={styles.line}></div>

                                    <div style={{ display: "Flex", flexDirection: "column", gap: "10px" }}>
                                        <div style={{ display: "Flex", gap: "20px" }}>
                                            <Input style={{ width: "339px" }} placeholder="Ваше имя *" isDisabled={user != null} value={user?.username}
                                                onChange={(event) => SetUsername(event)} />

                                            {isClient ?
                                                <MyPhoneInput disabled={user != null} onChange={(value) => { setPhone(value) }} placeholder="+7 (999) 999 99 99 *" value={user?.phone_number ?? Phone} style={{ width: "369px" }} />
                                                : null}


                                        </div>
                                        <div style={{ display: "Flex", gap: "20px" }}>
                                            <Input style={{ width: "339px" }} placeholder="Email *" isDisabled={user != null} value={user?.email ?? Email}
                                                onChange={(event) => SetEmail(event)} />
                                            <Input
                                                value={infoAboutOrder?.product?.platforms.filter(item => item.id === platform_id)[0]?.title ?? "У данного товара отсутствуют платформы"}
                                                style={{ width: "344px" }}
                                                isDisabled
                                            />
                                        </div>
                                    </div>
                                    <textarea placeholder="Комментарии к заказу" className={styles.text_area} value={commentsForOrder} onChange={(e: any) => { setCommentsForOrder(e.target.value) }} />

                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Checkbox label="" style={{ padding: "-12px" }} onChange={(event) => SetIsAcceptRule(event)} checked={isAcceptRule} />
                                        <span style={{
                                            fontSize: "var(--font-size-3xs)", fontWeight: "300",
                                            color: "var(--color-lightgray-100)", fontFamily: "Unbounded_Light_Base"
                                        }}>
                                            Я соглашаюсь с <Link to={""} style={{ color: "var(--color-lightgray-100)" }}>политикой конфиденциальности в отношении обработки персональных данных</Link> и <Link to={""} style={{ color: "var(--color-lightgray-100)" }}>политикой оферты</Link>
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "20px" }}>
                                    <div className={styles.container_pay} style={{ gap: "14px" }}>
                                        <div style={{
                                            display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xl)",
                                            fontFamily: "Unbounded_Medium"
                                        }}>
                                            <span>Итого:</span>
                                            <span>{Math.max(0, finalPrice - (infoAboutOrder?.product?.discount?.discount_cost ?? 0))} ₽</span>
                                        </div>

                                        <div className={styles.line} />

                                        <div style={{
                                            display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)",
                                            fontWeight: 300, color: "var(--color-lightgray-100)"
                                        }}>
                                            <span style={{ fontFamily: "Unbounded_Light_Base" }}>Товаров на сумму:</span>
                                            <span>{infoAboutOrder?.product?.cost ?? WalletPrice} ₽</span>
                                        </div>

                                        <div style={{
                                            display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)",
                                            fontWeight: 300, color: "var(--color-lightgray-100)"
                                        }}>
                                            <span style={{ fontFamily: "Unbounded_Light_Base" }}>Ваша скидка:</span>
                                            <span style={PromoCode ? { color: "#04E061" } : {}}>{promoPrice + (infoAboutOrder?.product?.discount?.discount_cost ?? 0)} ₽</span>
                                        </div>



                                        {PromoCode ?
                                            <div style={{ display: "flex", position: "relative", justifyContent: "center", }}>
                                                <Input placeholder="Есть промокод?" style={{ width: "337px" }}
                                                    maxlenght={50} isDisabled={true} />
                                                <div style={{ position: "absolute", left: "170px", top: "10px", color: "#D4D4D4", opacity: "0.3" }}>Промокод применен</div>
                                            </div>
                                            : <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                                                <Input placeholder="Есть промокод?" style={{ width: "337px" }} onChange={(event) => setInputPromoCode(event)}
                                                    maxlenght={50} onEventEnterPressed={handleEnterPromoCode} />
                                                <div style={{ width: "32px", height: "39px", position: "absolute", left: "92.5%", cursor: "pointer", zIndex: 1, display: "flex" }} onClick={handleEnterPromoCode} >
                                                    <img src={"/icons/bases/arrows/arrow_left.svg"} style={{ cursor: "pointer", scale: "1.5", margin: "auto" }} />
                                                </div>
                                            </div>}

                                        <button className={isAcceptRule ? styles.button : styles.button_disable} style={{ fontFamily: "Unbounded_Medium", fontSize: "10px" }} onClick={handleCreateOrder}><span>ОФОРМИТЬ ЗАКАЗ</span></button>
                                        
                                        <div style={{color: "#D4D4D4", alignSelf: "center"}}>{Error}</div>

                                        <div style={{
                                            fontSize: "var(--font-size-3xs)", fontWeight: "300",
                                            color: "var(--color-lightgray-100)", fontFamily: "Unbounded_Light_Base"
                                        }}>
                                            Нажимая на кнопку “Оформить заказ” - вы соглашаетесь
                                            с политикой конфиденциальности в отношении обработки персональных данных и политикой оферты
                                        </div>
                                    </div>

                                    {/* {isAcceptRule ?
                                        <div className={styles.container_pay_icons}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase" }}><img src={"/icons/bank/t_bank.png"} className={styles.icon_bank} />Тинькофф</div>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase" }}><img src={"/icons/bank/sberbank.png"} className={styles.icon_bank} />СБЕР БАНК</div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "space-between" }}>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase" }}><img src={"/icons/bank/vtb.svg"} className={styles.icon_bank} />ВТБ</div>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><img src={"/icons/bank/alpha_bank.svg"} className={styles.icon_bank} />Альфа·банк</div>
                                                </div>
                                            </div>

                                            <img src="/icons/bank/sbp.svg" className={styles.icon_bank} />
                                        </div>
                                        : null} */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isDone ? <div className={styles.complete_order}>
                        <Link to={"../"} style={{ alignSelf: "end" }}><img src="/icons/bases/close.svg" style={{ width: "24px" }} /></Link>
                        <img src="/icons/backgrounds/like.png" style={{ width: "110px", height: "110px" }} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" }}>
                            <div style={{ fontSize: "var(--font-size-xl)", textAlign: "center", textTransform: "uppercase" }}>Спасибо, ваш<br /> заказ оформлен</div>
                            <div style={{ color: "#D4D4D4", fontSize: "var(--font-size-3xs)", textAlign: "center", maxWidth: "290px" }}>Перейдите в чат для дальнейшего оформления подписки</div>
                        </div>

                        <Link to={"../profile/chats/?chat=" + resultChatId} className={styles.button} style={{ marginTop: "20px", maxWidth: "218px", textTransform: "uppercase", textDecoration: "none" }}>Перейти в чат</Link>
                    </div> : null}

                    {WaitingForPayment ? <div className={styles.complete_order}>
                        <Link to={"../"} style={{ alignSelf: "end" }}><img src="/icons/bases/close.svg" style={{ width: "24px" }} /></Link>
                        <img src="/icons/bases/payment.svg" style={{ width: "110px", height: "110px" }} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" }}>
                            <div style={{ fontSize: "var(--font-size-xl)", textAlign: "center", textTransform: "uppercase" }}>Спасибо, ваш<br /> заказ ждет оплаты</div>
                            <div style={{ color: "#D4D4D4", fontSize: "var(--font-size-3xs)", textAlign: "center", maxWidth: "290px" }}>Дождитесь автоматического перехода на страницу оплаты или нажмите на кнопку </div>
                        </div>

                        <div className={styles.button} onClick={() => { window.open(PaymentUrl) }} style={{ marginTop: "20px", maxWidth: "218px", textTransform: "uppercase", textDecoration: "none" }}>Оплатить</div>
                    </div> : null}

                    {isErrorPayment ? <div className={styles.complete_order}>
                        <Link to={"../"} style={{ alignSelf: "end" }}><img src="/icons/bases/close.svg" style={{ width: "24px" }} /></Link>
                        <img src="/icons/bases/error.svg" style={{ width: "110px", height: "110px" }} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" }}>
                            <div style={{ fontSize: "var(--font-size-xl)", textAlign: "center", textTransform: "uppercase" }}>Ой, произошла<br /> ошибка оплаты</div>
                            <div style={{ color: "#D4D4D4", fontSize: "var(--font-size-3xs)", textAlign: "center", maxWidth: "290px" }}>Произошла ошибка, при оплате попробуйте еще раз</div>
                        </div>

                        <Link to={"../"} className={styles.button} style={{ marginTop: "20px", maxWidth: "218px", textTransform: "uppercase", textDecoration: "none" }}>Вернуться на главную</Link>
                    </div> : null}

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
            <div className={styles.main_container}>
                <BaseCenterContainer style={isDone || WaitingForPayment ? { filter: "blur(22px)" } : {}}>
                    <Header />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                            <div className={styles.base_path} style={{ fontSize: "10px" }}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <Link to={"../catalog/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Каталог</Link> / <span style={{ color: "white" }}>Оформление заказа</span></div>

                            <div style={{ textTransform: "uppercase", fontSize: "14px" }}>Оформление <span style={{ color: "#C2C2C2" }}>заказа:</span></div>

                            <div style={{ display: "flex", flexDirection: "column", "gap": "10px" }}>
                                <span style={{ fontFamily: "Unbounded_Bold" }}>{infoAboutOrder?.product?.title}  <span style={{ color: "var(--color-silver-100)" }}>{infoAboutOrder?.product?.product_type === "SUBSCRIPTION" ? `${infoAboutOrder?.product?.subscription_duration_mouth} МЕС *` : ""}</span></span>
                                <span style={{

                                    fontSize: "var(--font-size-3xs)", fontWeight: "300", color: "var(--color-silver-100)", lineHeight: "130%",
                                    fontFamily: "Unbounded_Light_Base"
                                }}>
                                    {(infoAboutOrder?.product?.product_type === "SUBSCRIPTION" && infoAboutOrder?.product?.subscription_type == "PS_PLUS") ? "* Срок подписки может быть меньше до 2 недель" : ""}
                                </span>
                            </div>
                            {!user ?
                                <div className={styles.container_order_info} style={{ maxWidth: "320px", height: "100%", width: "auto" }}>
                                    <div style={{ fontFamily: "Unbounded_Medium", fontSize: "14px" }}>Покупатель</div>
                                    <div className={styles.line} />

                                    <Input placeholder="Ваше имя *" value={Username}
                                        onChange={(event) => SetUsername(event)} label="Имя" />

                                    {isClient ?
                                        <MyPhoneInput placeholder="+7 (999) 999 99 99 *" value={Phone} disabled={false} onChange={(value) => { setPhone(value) }} style={{ height: "39px" }} label="Телефон" />
                                        : null}

                                    <Input placeholder="Email *" isDisabled={user != null} value={Email}
                                        onChange={(event) => SetEmail(event)} label="Email" />
                                    <Input isDisabled label="Поколение консоли"
                                        value={infoAboutOrder?.product?.platforms.filter(item => item.id === platform_id)[0]?.title ?? "У данного товара отсутствуют платформы"} />

                                    <textarea placeholder="Комментарии к заказу" className={styles.text_area} value={commentsForOrder} onChange={(e: any) => { setCommentsForOrder(e.target.value) }} />

                                    <div style={{ display: "flex" }}>
                                        <Checkbox label="" style={{ padding: "-12px" }} onChange={(event) => SetIsAcceptRule(event)} checked={isAcceptRule} />
                                        <span style={{
                                            fontSize: "var(--font-size-3xs)", fontWeight: "300",
                                            color: "var(--color-lightgray-100)", fontFamily: "Unbounded_Light_Base"
                                        }}>
                                            Я соглашаюсь с <Link to={""} style={{ color: "var(--color-lightgray-100)" }}>политикой конфиденциальности в отношении обработки персональных данных</Link> и <Link to={""} style={{ color: "var(--color-lightgray-100)" }}>политикой оферты</Link>
                                        </span>
                                    </div>
                                </div>
                                : null}

                            <div style={{ display: "flex", flexDirection: "column", width: "fit-content", gap: "20px", position: "relative", left: "50%", transform: "translateX(-50%)" }}>
                                <div className={styles.container_pay} style={{ gap: "14px", maxWidth: "calc(375px - 50px)", height: "fit-content" }}>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xl)",
                                        fontFamily: "Unbounded_Medium"
                                    }}>
                                        <span>Итого:</span>
                                        <span>{Math.max(0, finalPrice - (infoAboutOrder?.product?.discount?.discount_cost ?? 0))} ₽</span>
                                    </div>

                                    <div className={styles.line} />

                                    <div style={{
                                        display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)",
                                        fontWeight: 300, color: "var(--color-lightgray-100)"
                                    }}>
                                        <span style={{ fontFamily: "Unbounded_Light_Base" }}>Товаров на сумму:</span>
                                        <span>{infoAboutOrder?.product?.cost} ₽</span>
                                    </div>

                                    <div style={{
                                        display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)",
                                        fontWeight: 300, color: "var(--color-lightgray-100)"
                                    }}>
                                        <span style={{ fontFamily: "Unbounded_Light_Base" }}>Ваша скидка:</span>
                                        <span style={PromoCode ? { color: "#04E061" } : {}}>{promoPrice + (infoAboutOrder?.product?.discount?.discount_cost ?? 0)} ₽</span>
                                    </div>



                                    {PromoCode ?
                                        <div style={{ display: "flex", position: "relative", justifyContent: "center", }}>
                                            <Input placeholder="Есть промокод?" style={{ width: "300px" }}
                                                maxlenght={50} isDisabled={true} />
                                            <div style={{ position: "absolute", left: "150px", top: "10px", color: "#D4D4D4", opacity: "0.3" }}>Промокод применен</div>
                                        </div>
                                        : <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                                            <Input placeholder="Есть промокод?" style={{ width: "300px" }} onChange={(event) => setInputPromoCode(event)}
                                                maxlenght={50} onEventEnterPressed={handleEnterPromoCode} />
                                            <div style={{ width: "32px", height: "39px", position: "absolute", left: "88.5%", cursor: "pointer", zIndex: 1, display: "flex" }} onClick={handleEnterPromoCode} >
                                                <img src={"/icons/bases/arrows/arrow_left.svg"} style={{ cursor: "pointer", scale: "1.5", margin: "auto" }} />
                                            </div>
                                        </div>}

                                    {user ?
                                        <MyTextAreaInput label="Комментарий к заказу" placeholder="Комментарий к заказу" style={{ resize: "none" }} value={commentsForOrder} onChange={(value: any) => { setCommentsForOrder(value) }} />
                                        : null}


                                    <button className={isAcceptRule ? styles.button : styles.button_disable} style={{ fontFamily: "Unbounded_Medium", fontSize: "10px", width: "330px" }} onClick={handleCreateOrder}><span>ОФОРМИТЬ ЗАКАЗ</span></button>
                                    
                                    <div style={{color: "#D4D4D4", alignSelf: "center"}}>{Error}</div>

                                    <div style={{
                                        fontSize: "var(--font-size-3xs)", fontWeight: "300",
                                        color: "var(--color-lightgray-100)", fontFamily: "Unbounded_Light_Base", display: "flex"
                                    }}>
                                        {user ? <Checkbox label="" style={{ padding: "-12px" }} onChange={(event) => SetIsAcceptRule(event)} checked={isAcceptRule} /> : null}
                                        Нажимая на кнопку “Оформить заказ” - вы соглашаетесь
                                        с политикой конфиденциальности в отношении обработки персональных данных и политикой оферты
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </BaseCenterContainer>
                {isDone ? <div className={styles.complete_order} style={{ maxWidth: "calc(320px - 50px)", left: "8%" }}>
                    <Link to={"../"} style={{ alignSelf: "end" }}><img src="/icons/bases/close.svg" style={{ width: "24px" }} /></Link>
                    <img src="/icons/backgrounds/like.png" style={{ width: "110px", height: "110px" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" }}>
                        <div style={{ fontSize: "var(--font-size-xl)", textAlign: "center", textTransform: "uppercase" }}>Спасибо, ваш<br /> заказ оформлен</div>
                        <div style={{ color: "#D4D4D4", fontSize: "var(--font-size-3xs)", textAlign: "center", maxWidth: "290px" }}>Перейдите в чат для дальнейшего оформления подписки</div>
                    </div>

                    <Link to={"../profile/chats/?chat=" + resultChatId} className={styles.button} style={{ marginTop: "20px", maxWidth: "218px", textTransform: "uppercase", textDecoration: "none" }}>Перейти в чат</Link>
                </div> : null}

                {WaitingForPayment ? <div className={styles.complete_order} style={{ maxWidth: "calc(320px - 50px)", left: "8%" }}>
                    <Link to={"../"} style={{ alignSelf: "end" }}><img src="/icons/bases/close.svg" style={{ width: "24px" }} /></Link>
                    <img src="/icons/bases/payment.svg" style={{ width: "110px", height: "110px" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" }}>
                        <div style={{ fontSize: "var(--font-size-xl)", textAlign: "center", textTransform: "uppercase" }}>Спасибо, ваш<br /> заказ ждет оплаты</div>
                        <div style={{ color: "#D4D4D4", fontSize: "var(--font-size-3xs)", textAlign: "center", maxWidth: "290px" }}>Дождитесь автоматического перехода на страницу оплаты или нажмите на кнопку </div>
                    </div>

                    <div className={styles.button} onClick={() => { window.open(PaymentUrl) }} style={{ marginTop: "20px", maxWidth: "218px", textTransform: "uppercase", textDecoration: "none" }}>Оплатить</div>
                </div> : null}

                {isErrorPayment ? <div className={styles.complete_order} style={{ maxWidth: "calc(320px - 50px)", left: "8%" }}>
                    <Link to={"../"} style={{ alignSelf: "end" }}><img src="/icons/bases/close.svg" style={{ width: "24px" }} /></Link>
                    <img src="/icons/bases/error.svg" style={{ width: "110px", height: "110px" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" }}>
                        <div style={{ fontSize: "var(--font-size-xl)", textAlign: "center", textTransform: "uppercase" }}>Ой, произошла<br /> ошибка оплаты</div>
                        <div style={{ color: "#D4D4D4", fontSize: "var(--font-size-3xs)", textAlign: "center", maxWidth: "290px" }}>Произошла ошибка, при оплате попробуйте еще раз</div>
                    </div>

                    <Link to={"../"} className={styles.button} style={{ marginTop: "20px", maxWidth: "218px", textTransform: "uppercase", textDecoration: "none" }}>Вернуться на главную</Link>
                </div> : null}
                <div style={{ marginTop: "auto", filter: isDone || WaitingForPayment ? "blur(22px)" : "" }}>
                    <Footer style={{ height: "150px", display: "flex", justifyContent: "center" }} />
                </div>
            </div>
        )
    }
}

export default OrderPage