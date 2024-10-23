import BaseCenterContainer from "../../components/baseCenterContainer";
import Footer from "../../components/footer";
import Header from "../../components/header";

import styles from "../../styles/pages/productPage.module.css"

import Cross4Icon from "/images/backgrounds/elements/cross_4.png"
import Triangle4Icon from "/images/backgrounds/elements/triangle_4.png"
import Triangle3Icon from "/images/backgrounds/elements/triangle_3.png"
import Triangle2Icon from "/images/backgrounds/elements/triangle_2.png"
import Circle2Icon from "/images/backgrounds/elements/circle_2.png"
import Square3Icon from "/images/backgrounds/elements/square_3.png"
import Circle3Icon from "/images/backgrounds/elements/circle_3.png"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import OrderComponent from "../../components/OrderComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductInterface } from "../../interfaces/productInterface";
import { useAuth } from "../../stores/JWTTokenStore";
import useWindowSize from "../../components/state/useWindowSize";
import FeedbackInfoFrame from "../../components/panels/feedbacks/FeedbackInfoFrame";






function ProductPage() {

    const { id } = useParams();

    const { accessToken } = useAuth();

    const [product, setProduct] = useState<ProductInterface>();

    const [searchParams, setSearchParams] = useSearchParams();

    const [selectPlatform, setSelectPlatform] = useState<number>(0)
    const [selectEdition, setSelectEdition] = useState<number>(0)

    useEffect(() => {
        if (!id) return
        axios.get('/api/v1/products/' + id + "/")
            .then(response => {
                setProduct(response.data);

                document.title = "GAMEVIZOR | Купить игру " + response.data.title

                const is_deluxe = searchParams.get("is_deluxe") ?? "false"
                setSelectEdition(is_deluxe === "true" ? 1 : 0)

                if (response.data.platforms.length) {
                    const is_select_platform = parseFloat(searchParams.get("platform_id") ?? String(response.data.platforms[0].id))
                    setSelectPlatform(is_select_platform)
                }
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });
    }, [accessToken])



    const [activeImageIndex, _setActiveImageIndex] = useState(0);
    const [visibleImageIndex, setVisibleImageIndex] = useState(0);
    let imageUrls: any[] = []
    if (product?.images_or_videos) {
        imageUrls = [product.general_image].concat(product?.images_or_videos.sort((a, b) => a.position - b.position).map((item) => item.file))
    }
    const [activeDescriptionIndex, setActiveDescriptionIndex] = useState(0);

    const DescriptionTexts = [
        product?.description,
        <span>
            <h3>Если на игре появился замочек</h3>
            <p>Если у Вас <b>Ps5</b>, то Вам нужно зайти обратно на приобретенный аккаунт и включить функцию общего доступа, после этого замочек пропадет.</p>

            <p>Для этого заходите на наш аккаунт {"->"} <b>настройки</b> {"->"} <b>Пользователи и учетные записи</b> {"->"} <b>Другое (в левой колонке)</b> {"->"} <b>Общий доступ к консоли и автономная игра</b> {"->"} <b>Включить</b>.
                После этого замки с игр на Ваших аккаунтах спадут.</p>

            Если у Вас <b>PS4</b>, то Вам нужно зайти обратно на приобретенный аккаунт и включить функцию "Активировать консоль как основную", после этого замочек пропадет.

            Как это сделать: <b>Переходите в настройки</b> {"->"} <b>Управление учетной записью</b> {"->"} <b>Активировать консоль как основную</b> {"->"} <b>Активировать</b>. После этого замки с игр спадут.</span>,
        `Есть ли русская озвучка: ${product?.is_rus_voice ? "Да" : "Нет"} \nЕсть ли русские субтитры: ${product?.is_rus_subtitle ? "Да" : "Нет"}`
    ]

    const [maxHeight, setMaxHeight] = useState(0)


    const handleDescriptionClick = (index: number) => {
        setActiveDescriptionIndex(index); // Update the active image index
    };
    const [maxWidth, setMaxWidth] = useState(1600.0)
    const [width, _] = useWindowSize()

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseFloat(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    const [isFixed, setIsFixed] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY + window.innerHeight < document.body.clientHeight - 297) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    const navigate = useNavigate();

    const handleRedirectOrder = () => {
        var ordersCreateUrl = `/order/create?type=${"PRODUCT"}&id=${id}&is_deluxe=${searchParams.get("is_deluxe") ?? false}` + "&platform_id=" + (searchParams.get("platform_id") ?? product?.platforms[0]?.id ?? "");
        navigate(ordersCreateUrl); // Use navigate to change the URL
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [navigate])


    if (width >= maxWidth) {
        return (
            <div className={styles.container}>

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

                <div style={{ background: "#120F25" }}>
                    <Header style={{ margin: "auto", maxWidth: "1240px", background: "none", zoom: 0.9 }} />
                </div>
                <div className={styles.image} style={{
                    height: "100%", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center",
                    backgroundImage: `linear-gradient(to bottom right, rgba(27, 32, 43, 0.8), rgba(7, 8, 10, 0.8)), url(${product?.background_image})`,
                    zoom: 0.9, flexGrow: 1, paddingBottom: "150px", backdropFilter: "blur(100px)",
                }}>
                    <BaseCenterContainer style={{ display: "flex", flexDirection: "column" }}>
                        <div className={styles.main}>

                            {
                                product?.product_type == "CURRENCY" ? 
                                <div className={styles.base_path}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <Link to={"../catalog_currency/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Каталог внутренней валюты </Link> / <span style={{ color: "white" }}>Игра {product?.title}</span></div>
                                : <div className={styles.base_path}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <Link to={"../catalog/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Каталог</Link> / <span style={{ color: "white" }}>Игра {product?.title}</span></div>
                            }

                            <div className={styles.product_container}>
                                <div className={styles.product_layer_1}>
                                    <div className={styles.images_container}>
                                        {imageUrls.slice(activeImageIndex, activeImageIndex + 4).map((imageUrl, index) => (
                                            <img
                                                key={index}
                                                src={imageUrl ?? "https://placehold.co/78"}
                                                className={activeImageIndex + index === visibleImageIndex ? styles.img_active : styles.img_inactive} // All images are active within the slider
                                                width={"78px"}
                                                height={"78px"}
                                                onClick={() => setVisibleImageIndex(index)} // Call the handler on click
                                            // Update active index on click
                                            />
                                        ))}
                                    </div>

                                    <img src={imageUrls[visibleImageIndex] ?? "https://placehold.co/292x400"} style={{ borderRadius: "15px", maxHeight: "400px", maxWidth: "292px", objectFit: "contain", alignSelf: "flex-start" }} />

                                    <div className={styles.product_info}>
                                        <div className={styles.flexContainer}>
                                            <div className={styles.tags}>
                                                {product?.is_hit ? <div className={styles.tag}>Хит</div> : null}
                                                {product?.is_novelty ? <div className={styles.tag}>Новинка</div> : null}
                                            </div>
                                            <div className={styles.title} style={{ maxWidth: "450px", textWrap: "wrap", fontFamily: "Unbounded_Bold" }}>{product?.title}</div>
                                        </div>
                                        <div className={styles.flexContainer}>
                                            <div className={styles.platformSelect}>Поколение PS:</div>
                                            <div className={styles.platforms}>
                                                {product?.platforms.map((platform: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className={platform.id === selectPlatform ? styles.platform_active : styles.platform}
                                                        onClick={() => { setSelectPlatform(platform.id); setSearchParams({ is_deluxe: !selectEdition ? "false" : "true", platform_id: String(platform.id) }) }}
                                                    >
                                                        {platform.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={styles.flexContainer}>
                                            <div className={styles.publicationSelect}>Издание:</div>
                                            <div className={styles.publications}>
                                                <div className={selectEdition === 0 ? styles.publication_active : styles.publication}
                                                    onClick={() => { setSelectEdition(0); setSearchParams({ is_deluxe: "false", platform_id: String(selectPlatform) }) }}>Standart Edition</div>
                                                {product?.is_deluxe_or_premium && <div className={selectEdition === 1 ? styles.publication_active : styles.publication}
                                                    onClick={() => { setSelectEdition(1); setSearchParams({ is_deluxe: "true", platform_id: String(selectPlatform) }) }}>Deluxe Edition</div>}
                                            </div>
                                        </div>

                                    </div>
                                    <div style={{ marginLeft: "auto" }}>
                                        <OrderComponent redirect={true} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginTop: "60px" }}>
                                <span style={{ fontSize: "1.4rem", fontFamily: "Unbounded_Medium" }}>Описание:</span>
                                <div style={{ display: "flex", gap: "25px", textTransform: "uppercase" }}>
                                    <div className={styles.description_btn} onClick={() => handleDescriptionClick(0)} style={!(activeDescriptionIndex === 0) ? { filter: "brightness(0.5)" } : {}}>Описание</div>
                                    <div className={styles.description_btn} onClick={() => handleDescriptionClick(1)} style={!(activeDescriptionIndex === 1) ? { filter: "brightness(0.5)" } : {}}>Инструкция по активации</div>
                                    <div className={styles.description_btn} onClick={() => handleDescriptionClick(2)} style={!(activeDescriptionIndex === 2) ? { filter: "brightness(0.5)" } : {}}>Характеристики</div>
                                </div>
                                <pre style={{ maxWidth: "538px", marginBottom: "40px", fontFamily: "Unbounded", textWrap: "wrap", minHeight: maxHeight }}>
                                    {DescriptionTexts[activeDescriptionIndex]}
                                </pre>
                            </div>

                            <FeedbackInfoFrame />

                        </div>
                    </BaseCenterContainer>
                </div>
                {/* <BaseCenterContainer style={{ display: "flex", flexDirection: "column", zoom: 0.9 }}>
                    <div className={styles.main}>
                        <FeedbackInfoFrame />
                    </div>
                </BaseCenterContainer> */}
                <div style={{
                    marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: 0.9,
                }}>
                    <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px" }} />
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.container} style={{ paddingTop: "0" }}>
                <div className={styles.image} style={{
                    height: "100%", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", position: "absolute", width: "100%",
                    backgroundImage: `linear-gradient(to bottom right, rgba(27, 32, 43, 0.8), rgba(7, 8, 10, 0.8)), url(${product?.background_image})`,
                    backdropFilter: "blur(100px)", zIndex: "-1",
                }} />
                <BaseCenterContainer style={{ display: "flex", flexDirection: "column" }}>
                    <Header />
                    <div className={styles.main} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", gap: "30px", marginTop: "20px" }}>

                        <div className={styles.base_path}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <Link to={"../catalog/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Каталог</Link> / <span style={{ color: "white" }}>Игра {product?.title}</span></div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
                            <div className={styles.title} style={{ fontFamily: "Unbounded_Bold", fontSize: "14px", textWrap: "wrap" }}>{product?.title}</div>
                            <div style={{ display: "flex", gap: "30px" }}>
                                <div style={{ position: "relative" }}>
                                    <img src={imageUrls[visibleImageIndex] ?? "https://placehold.co/292x400"} style={{ borderRadius: "15px", maxHeight: "284px", maxWidth: "208px", objectFit: "contain", alignSelf: "flex-start" }} />
                                    <div className={styles.flexContainer}>
                                        <div className={styles.tags} style={{ position: "absolute", top: "5px", right: "5px" }}>
                                            {product?.is_hit ? <div className={styles.tag} style={{ fontSize: "8px", padding: "4px", paddingLeft: "8px", paddingRight: "8px" }}>Хит</div> : null}
                                            {product?.is_novelty ? <div className={styles.tag} style={{ fontSize: "8px", padding: "4px", paddingLeft: "8px", paddingRight: "8px" }}>Новинка</div> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.images_container} style={{ gap: "10px" }}>
                                    {imageUrls.slice(activeImageIndex, activeImageIndex + 4).map((imageUrl, index) => (
                                        <img
                                            key={index}
                                            src={imageUrl ?? "https://placehold.co/78"}
                                            className={activeImageIndex + index === visibleImageIndex ? styles.img_active : styles.img_inactive} // All images are active within the slider
                                            width={"63px"}
                                            height={"63px"}
                                            onClick={() => setVisibleImageIndex(index)} // Call the handler on click
                                        // Update active index on click
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.flexContainer}>
                            <div className={styles.platformSelect}>Поколение PS:</div>
                            <div className={styles.platforms}>
                                {product?.platforms.map((platform: any, index: number) => (
                                    <div
                                        key={index}
                                        className={platform.id === selectPlatform ? styles.platform_active : styles.platform}
                                        onClick={() => { setSelectPlatform(platform.id); setSearchParams({ is_deluxe: !selectEdition ? "false" : "true", platform_id: String(platform.id) }) }}
                                    >
                                        {platform.title}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.flexContainer}>
                            <div className={styles.publicationSelect}>Издание:</div>
                            <div className={styles.publications}>
                                <div className={selectEdition === 0 ? styles.publication_active : styles.publication}
                                    onClick={() => { setSelectEdition(0); setSearchParams({ is_deluxe: "false", platform_id: String(selectPlatform) }) }}>Standart Edition</div>
                                {product?.is_deluxe_or_premium && <div className={selectEdition === 1 ? styles.publication_active : styles.publication}
                                    onClick={() => { setSelectEdition(1); setSearchParams({ is_deluxe: "true", platform_id: String(selectPlatform) }) }}>Deluxe Edition</div>}
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                            <span style={{ fontSize: "1.4rem", fontFamily: "Unbounded_Medium" }}>Описание:</span>
                            <div style={{ display: "flex", gap: "10px", textTransform: "uppercase", flexWrap: "wrap" }}>
                                <div className={styles.description_btn} onClick={() => handleDescriptionClick(0)} style={!(activeDescriptionIndex === 0) ? { filter: "brightness(0.5)" } : {}}>Описание</div>
                                <div className={styles.description_btn} onClick={() => handleDescriptionClick(1)} style={!(activeDescriptionIndex === 1) ? { filter: "brightness(0.5)" } : {}}>Инструкция по активации</div>
                                <div className={styles.description_btn} onClick={() => handleDescriptionClick(2)} style={!(activeDescriptionIndex === 2) ? { filter: "brightness(0.5)" } : {}}>Характеристики</div>

                            </div>
                            <pre style={{ maxWidth: "290px", minHeight: "98px", marginBottom: "40px", fontFamily: "Unbounded", textWrap: "wrap" }}>
                                {DescriptionTexts[activeDescriptionIndex]}
                            </pre>
                        </div>

                        <FeedbackInfoFrame is_mobile />
                    </div>
                    <div style={{ marginTop: "auto", position: "relative" }}>
                        <div className={styles.pay_panel_mobile} style={{
                            width: "calc(100% - 40px)",
                            position: isFixed ? 'fixed' : 'absolute',
                            bottom: isFixed ? '-20px' : '280px',
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: "15px" }}>
                                <div style={{ fontFamily: "Unbounded_Medium", fontSize: "17px" }}>
                                    {selectEdition === 0 ? product?.discount?.discount_cost ? <div style={{ color: "rgb(132, 130, 143)" }}><span style={{ color: "rgb(255, 0, 122)", textDecoration: "none" }}>
                                        {(product?.cost ?? 0) - product?.discount?.discount_cost} ₽</span> <span style={{ textDecoration: "line-through" }}>{product?.cost} ₽</span></div> : <span>{product?.cost} ₽</span> : null}

                                    {selectEdition === 1 ? product?.deluxe_or_premium_discount?.discount_cost ? <div style={{ color: "rgb(132, 130, 143)" }}><span style={{ color: "rgb(255, 0, 122)", textDecoration: "none" }}>
                                        {(product?.deluxe_or_premium_cost ?? 0) - product?.deluxe_or_premium_discount?.discount_cost} ₽</span> <span style={{ textDecoration: "line-through" }}>{product?.deluxe_or_premium_cost} ₽</span></div> : <span>{product?.cost} ₽</span> : null}
                                </div>
                                <div style={{ fontSize: "10px", fontFamily: "Unbounded_Light_Base" }}>Если у вас есть промокод -<br /> введите его при оформлении</div>
                            </div>
                            <div className={styles.button} style={{ width: "87px" }} onClick={handleRedirectOrder}>Оформить</div>
                        </div>
                        <Footer style={{ height: "150px", display: "flex", justifyContent: "center" }} />
                    </div>
                </BaseCenterContainer>
            </div>
        )
    }
};

export default ProductPage