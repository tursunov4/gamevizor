import { FunctionComponent, useEffect, useState } from "react"
import styles from "../styles/pages/orderInfoPage.module.css"
import ProfileMenu from "../components/menus/profileMenu";
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import BaseCenterContainer from "../components/baseCenterContainer";
import Header from "../components/header";
import Footer from "../components/footer";
import { OrderPanelProp, StatusKeys, BackgroundStatusKeys } from "../interfaces/orderPanel";
import { format, parseISO } from "date-fns";
import RatingComponent from "../components/ratingComponent";
import { useUser } from "../stores/userStore";
import { useAuth } from "../stores/JWTTokenStore";
import useWindowSize from "../components/state/useWindowSize";


const OrderInfoPage: FunctionComponent = () => {
    const { user } = useUser();
    const { accessToken } = useAuth();

    const [Order, SetOrder] = useState<OrderPanelProp | null>(null)

    const { id } = useParams();

    const [formattedDate, setFormattedDate] = useState('');
    const [formattedTime, setFormattedTime] = useState('');
    const [formattedStatus, setFormattedStatus] = useState('');
    const [backgroundColorStatus, setBackgroundColorStatus] = useState('');

    const [feedBackInput, setFeedBackInput] = useState('');

    const [raitingFeedback, setRaitingFeedback] = useState(5);



    useEffect(() => {
        if (Order) {
            setFormattedDate(format(parseISO(Order.created_on), 'dd.MM.yy')); // Format date
            setFormattedTime(format(parseISO(Order.created_on), 'HH:mm')); // Format time

            setFormattedStatus(StatusKeys[Order?.status as keyof typeof StatusKeys]);

            setBackgroundColorStatus(BackgroundStatusKeys[Order?.status as keyof typeof BackgroundStatusKeys]);
        }
    }, [Order])

    const getOrder = () => {
        // Если токен есть, запрос на получение данных пользователя
        axios.get('/api/v1/profile/order/' + id, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                SetOrder(response.data)
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });
    }

    useEffect(() => {
        if (!accessToken) return
        getOrder();
    }, [accessToken]);

    const SendFeedback = async () => {
        try {
            const response = await axios.post('/api/v1/order/feedback/' + Order?.id + "/", {
                text: feedBackInput,
                rating: raitingFeedback,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.status == 201) {
                getOrder();
            }


        } catch (error) {
        }
    };


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
                    <Header/>
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

                        <div className={styles.base_path}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> /{" "}
                            <Link to={"../profile/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Личный кабинет</Link> /{" "}
                            <Link to={"../profile/orders/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Заказы</Link> / <span style={{ color: " var(--color-white)" }}>{Order?.product?.title ?? `Пополнение кошелька на ${Order?.wallet?.number} ${Order?.wallet?.select_country?.tag}`}</span></div>
                        <div className={styles.main_panel}>
                            <ProfileMenu selected={window.location.href.includes("order") ? 2 : 3} />
                            <div className={styles.general}>
                                <div className={styles.title} style={{ display: "flex", gap: "10px" }}>
                                    <div style={{ textWrap: "nowrap" }} >{Order?.product?.title ?? `Пополнение кошелька на ${Order?.wallet?.number} ${Order?.wallet?.select_country?.tag}`}</div>
                                    <div className={styles.line} />
                                </div>

                                <div className={styles.container_product}>
                                    <div style={{ display: "flex", gap: "25px" }}>
                                        <img src={Order?.product?.general_image ? Order?.product.general_image : "https://placehold.co/160x160"} width={160} height={160} style={{ borderRadius: "10px" }} />
                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "144px", alignSelf: "center" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                                <div style={{ fontSize: "0.85rem" }}>{Order?.product?.title ?? `Пополнение кошелька на ${Order?.wallet?.number} ${Order?.wallet?.select_country?.tag}`}</div>
                                                <div style={{ fontSize: "1rem" }}>{Number(Order?.cost)} ₽</div>
                                            </div>

                                        </div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                                        <div style={{ display: "flex", gap: "25px", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                                            <div className={styles.button} style={{ backgroundColor: backgroundColorStatus }}>{formattedStatus}</div>
                                            <div>№ заказа: {Order?.id}</div>
                                            <div style={{ opacity: 0.6 }}>{formattedDate} {formattedTime}</div>
                                        </div>
                                        <Link to={"../profile/chats/?chat=" + Order?.chat.id} className={styles.button} style={{ width: "186px", padding: "12px", textDecoration: "none" }}>Перейти в чат</Link>
                                    </div>
                                </div>
                                {/*<div className={styles.title}>
                                <div>Ваш заказ</div>
                                <div className={styles.line} />
                            </div>
                            <div className={styles.container_info}>
                                {Order?.info_for_complete ? Order?.info_for_complete :
                                    <div style={{ margin: "auto" }}>
                                        Здесь будет информация после выполнение заказа {Order?.info_for_complete}
                                    </div>}

                            </div>*/}
                                <div className={styles.title}>
                                    <div>Ваш отзыв о покупке</div>
                                    <div className={styles.line} />
                                </div>



                                {Order?.status === "COMPLETED" ? (
                                    <div>
                                        {Order?.feedback ? (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                                    <div style={{ alignSelf: "center" }}>{format(parseISO(Order?.feedback.created_on), 'dd.MM.yy')}</div>
                                                    <div className={styles.container_feedback}>
                                                        <div style={{ display: "flex", gap: "25px" }}>
                                                            <img className={styles.user_icon} src={"/images/bases/base_image_for_profile.png"} />
                                                            <div style={{ display: "flex", flexDirection: "column", margin: "auto 0", gap: "25px" }}>
                                                                <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>{user?.username}</div>
                                                                <div>{Order?.feedback.text}</div>
                                                                <div style={{ display: "flex", gap: "10px" }}> Ваша оценка: <RatingComponent initialRating={Order?.feedback.rating} disabled={true} /></div>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
                                                            <div>{Order?.product?.title ?? `Пополнение кошелька на ${Order?.wallet?.number} ${Order?.wallet?.select_country?.tag}`}</div>
                                                            <div>{format(parseISO(Order?.feedback.created_on), 'HH:mm')}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {Order?.feedback.answer ? (
                                                    <div className={styles.answer_container}>
                                                        <div style={{ display: "flex", gap: "25px" }}>
                                                            <img className={styles.user_icon} src={"/images/bases/gameVizorLogo.png"} />
                                                            <div style={{ display: "flex", flexDirection: "column", margin: "auto 0", gap: "25px" }}>
                                                                <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>GAME VIZOR</div>
                                                                <div>{Order?.feedback.answer}</div>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
                                                            <div>Ответ представителя</div>
                                                            <div>{format(parseISO(Order?.feedback.updated_on), 'HH:mm')}</div>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : (
                                            <div className={styles.container_input_feedback}>
                                                <textarea
                                                    className={styles.input_feedback}
                                                    placeholder="Здесь вы можете оставить отзыва к заказу"
                                                    onChange={(event) => { setFeedBackInput(event.target.value) }}
                                                    value={feedBackInput}
                                                />
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div style={{ display: "flex", gap: "25px" }}>
                                                        <div>Ваша оценка: </div>
                                                        <RatingComponent initialRating={5} onChange={(newRating) => setRaitingFeedback(newRating)} />
                                                    </div>
                                                    <button className={styles.button_feedback} onClick={SendFeedback}>Отправить</button>
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>Отзыв возможно оставить только после выполнения заказа</div>
                                )}

                            </div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{ marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: 0.9 }}>
                    <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px" }} />
                </div>
            </div>
        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <BaseCenterContainer>
                    <Header is_select_id_menu={Order?.product?.product_type === "PRODUCT" ? 2 : 3}/>
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px" }}>
                        <div className={styles.general}>
                            <div className={styles.base_path}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> /{" "}
                                <Link to={"../profile/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Личный кабинет</Link> /{" "}
                                <Link to={"../profile/orders/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Заказы</Link> / <span style={{ color: " var(--color-white)" }}>{Order?.product?.title ?? `Пополнение кошелька на ${Order?.wallet?.number} ${Order?.wallet?.select_country?.tag}`}</span>
                            </div>

                            <div className={styles.title} style={{ display: "flex", gap: "10px" }}>
                                <div style={{ textWrap: "nowrap" }} >{Order?.product?.title ?? `Пополнение кошелька на ${Order?.wallet?.number} ${Order?.wallet?.select_country?.tag}`}</div>
                                <div className={styles.line} />
                            </div>

                            <div className={styles.container_product} style={{ height: "fit-content" }}>
                                <div className={styles.container} style={{ width: "100%", display: "flex", gap: "10px", justifyContent: "space-between", flexDirection: "row" }}>
                                    <div style={{ display: 'flex', flexDirection: "column", gap: "15px" }}>
                                        <div style={{ color: "#D4D4D4" }}>Название: <span style={{ color: "white" }}>{Order?.product?.title ?? `Пополнение кошелька на ${Order?.wallet?.number} ${Order?.wallet?.select_country?.tag}`}</span></div>
                                        <div style={{ color: "#D4D4D4" }}>№ заказа: <span style={{ color: "white" }}>{id}</span></div>
                                        <div style={{ color: "#D4D4D4" }}>Дата: <span style={{ color: "white" }}>{formattedDate}</span> <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>{formattedTime}</span></div>
                                        <div style={{ color: "#D4D4D4" }}>Стоимость: <span style={{ color: "white" }}>{Order?.cost} ₽</span></div>
                                        <div style={{ color: "#D4D4D4" }}>Статус: <button className={styles.button} style={{ backgroundColor: backgroundColorStatus, fontFamily: "Unbounded_Medium", fontSize: "10px" }}>{formattedStatus}</button></div>

                                        <div style={{ display: 'flex', flexDirection: "column", gap: "15px", marginTop: "15px" }}>
                                            <Link to={"../profile/chats/?chat=" + Order?.chat.id} className={styles.button} style={{ width: "132px", padding: "12px", textDecoration: "none", borderRadius: "12px" }}>Перейти в чат</Link>
                                        </div>
                                    </div>
                                    <img src={Order?.product?.general_image ? Order.product.general_image : "https://placehold.co/42"} style={{ borderRadius: "10px", width: "42px", height: "42px" }} />
                                </div>
                            </div>

                            <div className={styles.title}>
                                <div>Ваш отзыв о покупке</div>
                                <div className={styles.line} />
                            </div>



                            {Order?.status === "COMPLETED" ? (
                                <div>
                                    {Order?.feedback ? (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                                <div style={{ alignSelf: "center" }}>{format(parseISO(Order?.feedback.created_on), 'dd.MM.yy')}</div>
                                                <div className={styles.container_feedback} style={{flexDirection: "column"}}>
                                                    <div style={{ display: "flex", gap: "25px" }}>
                                                        <img className={styles.user_icon} src={"/images/bases/base_image_for_profile.png"} />
                                                        <div style={{ display: "flex", flexDirection: "column", margin: "auto 0", gap: "25px" }}>
                                                            <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>{user?.username}</div>
                                                            <div>{Order?.feedback.text}</div>
                                                            <div style={{ display: "flex", gap: "10px" }}> Ваша оценка: <RatingComponent initialRating={Order?.feedback.rating} disabled={true} /></div>
                                                        </div>
                                                    </div>
                                                    <div style={{alignSelf: "flex-end"}}>{format(parseISO(Order?.feedback.created_on), 'HH:mm')}</div>
                                                </div>
                                            </div>

                                            {Order?.feedback.answer ? (
                                                <div className={styles.answer_container} style={{flexDirection: "column"}}>
                                                    <div style={{ display: "flex", gap: "25px" }}>
                                                        <img className={styles.user_icon} src={"/images/bases/gameVizorLogo.png"} />
                                                        <div style={{ display: "flex", flexDirection: "column", margin: "auto 0", gap: "25px" }}>
                                                            <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>GAME VIZOR</div>
                                                            <div>{Order?.feedback.answer}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{alignSelf: "flex-end"}}>{format(parseISO(Order?.feedback.updated_on), 'HH:mm')}</div>
                                                </div>
                                            ) : null}
                                        </div>
                                    ) : (
                                        <div className={styles.container_input_feedback}>
                                            <textarea
                                                className={styles.input_feedback}
                                                placeholder="Здесь вы можете оставить отзыва к заказу"
                                                onChange={(event) => { setFeedBackInput(event.target.value) }}
                                                value={feedBackInput}
                                            />
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <div style={{ display: "flex", gap: "25px" }}>
                                                    <div>Ваша оценка: </div>
                                                    <RatingComponent initialRating={5} onChange={(newRating) => setRaitingFeedback(newRating)} />
                                                </div>
                                                <button className={styles.button_feedback} onClick={SendFeedback}>Отправить</button>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>Отзыв возможно оставить только после выполнения заказа</div>
                            )}

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

export default OrderInfoPage