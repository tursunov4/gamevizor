import { useEffect, useState } from "react";
import useWindowSize from "../../components/state/useWindowSize";
import { Link, useNavigate } from "react-router-dom";
import BaseCenterContainer from "../../components/baseCenterContainer";
import Header from "../../components/header";
import Footer from "../../components/footer";

import Cross4Icon from "/images/backgrounds/elements/cross_4.png"
import Triangle4Icon from "/images/backgrounds/elements/triangle_4.png"
import Triangle3Icon from "/images/backgrounds/elements/triangle_3.png"
import Triangle2Icon from "/images/backgrounds/elements/triangle_2.png"
import Square3Icon from "/images/backgrounds/elements/square_3.png"
import Circle3Icon from "/images/backgrounds/elements/circle_3.png"
import Circle2Icon from "/images/backgrounds/elements/circle_2.png"

import styles from "../../styles/pages/catalogPage.module.css"
import FullFeedbackPanel from "../../components/panels/feedbacks/FullFeedbackPanel";
import feedbackInterface from "../../interfaces/feedbackInterface";
import axios from "axios";
import RatingComponent from "../../components/ratingComponent";
import FlagButton from "../../components/inputs/flagButton";
import e from "express";


interface feedbackInterfacePagination {
    count: number,
    average_rating: number,
    ratings_count: {
        rating: number,
        count: number
    }[]
}

function formatNumber(number: number) {
    return number.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function AllFeedbacksPage() {
    const [width, _] = useWindowSize()
    const [maxWidth, setMaxWidth] = useState(1600)

    const [data, setData] = useState<feedbackInterfacePagination>()
    const [feedbacks, setFeedbacks] = useState<feedbackInterface[]>([])

    const [selectPage, setSelectPage] = useState(1)

    const navigate = useNavigate()

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseInt(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [navigate]);

    const GetData = (is_new = false) => {
        var url = '/api/v1/feedbacks/?page=' + (is_new ? 1 : selectPage)
        if (isNewly) {
            url += '&sort_by=created_on'
            if (!isDirectionIsNewly) {
                url += "&sort_order=desc"
            } else {
                url += "&sort_order=asc"
            }
        }

        if (isRatingly) {
            url += '&sort_by=rating'
            if (!isDirectionIsRatingly) {
                url += "&sort_order=desc"
            } else {
                url += "&sort_order=asc"
            }
        }

        axios.get(url, {
        })
            .then(response => {
                if (is_new) {
                    setFeedbacks([...response.data.results])
                    setData(response.data)
                    setSelectPage(1)
                } else {
                    setFeedbacks([...feedbacks, ...response.data.results])
                    setData(response.data)
                    setSelectPage(selectPage + 1)
                }
            })
            .catch(error => {
            });

        return
    }

    useEffect(() => {
        if (feedbacks.length == 0) {
            GetData()
        }
    })

    const [isNewly, setIsNewly] = useState(true)
    const [isDirectionIsNewly, setIsDirectionIsNewLy] = useState(false)

    const [isRatingly, setIsRatingly] = useState(false)
    const [isDirectionIsRatingly, setIsDirectionIsRatingly] = useState(false)

    useEffect(() => {
        if (isNewly) {
            GetData(true)
        }
    }, [isDirectionIsNewly])

    useEffect(() => {
        if (isRatingly) {
            GetData(true)
        }
    }, [isDirectionIsRatingly])

    const handleSetIsNEwly = (value: boolean) => {
        setIsNewly(value)
        setIsRatingly(false)
        if (value) GetData(true)
    }

    const handleSetISRatingly = (value: boolean) => {
        setIsNewly(false)
        setIsRatingly(value)
        if (value) GetData(true)
    }

    if (width >= maxWidth) {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <BaseCenterContainer style={{ zoom: 0.9, flexGrow: 1, flexDirection: "column", display: "flex" }}>
                    <Header />

                    <div className={styles.background} style={{ flexGrow: 1 }}>
                        <div className={styles.ellipce_1} />
                        <div className={styles.ellipce_2} />

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


                        <div className={styles.base_path}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <span style={{ color: " var(--color-white)" }}>Все отзывы</span></div>

                        <div className={styles.general} style={{ flexGrow: "1", marginTop: "50px", gap: "0px" }}>

                            <h1>Отзывы о GAME VIZOR</h1>

                            <div style={{ display: 'flex', gap: "20px", alignItems: "center" }}>
                                <div style={{ fontSize: "48px", fontFamily: "Unbounded_Extra_Bold" }}>{formatNumber(data?.average_rating ?? 0)}</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <RatingComponent initialRating={data?.average_rating} disabled />
                                    <div style={{ color: "#D4D4D4" }}>На основании <span style={{ color: "white" }}>{data?.count}</span> оценок</div>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: 'column', gap: "10px", marginTop: "20px", width: "fit-content" }}>
                                {Array.from({ length: 5 }, (_, i) => 5 - i).map((rating, index) => (
                                    <div key={index} style={{ display: 'flex', gap: "20px", alignItems: 'center' }}>
                                        <RatingComponent initialRating={rating} disabled />
                                        <div key={rating} style={{ position: 'relative' }}>
                                            <div style={{ height: "4px", background: "rgba(255, 255, 255, 0.5)", width: "360px" }} />
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    background: "white",
                                                    height: "4px",
                                                    top: 0,
                                                    width: `${(data?.ratings_count.find((item) => item.rating === rating)
                                                        ?.count ?? 0) *
                                                        100 /
                                                        (data?.count ?? 1)
                                                        }%`,
                                                }} />
                                        </div>
                                        <div style={{ marginLeft: "auto" }}>{new Intl.NumberFormat('ru-RU').format(data?.ratings_count.find((item) => item.rating === rating)?.count ?? 0)}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: "60px", display: "flex", gap: "20px" }}>
                                <FlagButton className={styles.flag_button} text="По новизне" initialState={isNewly} onChangeActive={handleSetIsNEwly} onChangeDirectionSorting={(value) => { setIsDirectionIsNewLy(value) }} />
                                <FlagButton className={styles.flag_button} text="По рейтингу" initialState={isRatingly} onChangeActive={handleSetISRatingly} onChangeDirectionSorting={setIsDirectionIsRatingly} />
                            </div>

                            <div style={{ marginTop: '40px', display: "flex", flexDirection: "column", gap: "40px", marginBottom: "120px" }}>
                                {feedbacks.map((feedback, index) => {
                                    return (
                                        <FullFeedbackPanel key={index} feedback={feedback} />
                                    )
                                })}

                                {feedbacks.length < (data?.count ?? 0) ?
                                    <div className={styles.button} onClick={() => { GetData() }}>Показать еще</div>
                                    : null}
                            </div>
                        </div>

                    </div>

                </BaseCenterContainer>

                <div style={{ width: "auto", height: "150px", zoom: 0.9, background: "#120F25", zIndex: 1 }}>
                    <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px" }} />
                </div>
            </div>
        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <BaseCenterContainer style={{ display: "flex", flexDirection: "column" }}>
                    <Header />

                    <div style={{ margin: "0 auto", fontFamily: "Unbounded", fontSize: "12px", color: "white" }}>
                        <div className={styles.base_path} style={{ fontSize: "12px" }}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <span style={{ color: " var(--color-white)" }}>Все отзывы</span></div>

                        <h1>Отзывы о GAME VIZOR</h1>

                        <div style={{ display: 'flex', gap: "20px", alignItems: "center" }}>
                            <div style={{ fontSize: "48px", fontFamily: "Unbounded_Extra_Bold" }}>{formatNumber(data?.average_rating ?? 0)}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <RatingComponent initialRating={data?.average_rating} disabled />
                                <div style={{ color: "#D4D4D4" }}>На основании <span style={{ color: "white" }}>{data?.count}</span> оценок</div>
                            </div>
                        </div>


                        <div style={{ display: "flex", flexDirection: 'column', gap: "10px", marginTop: "20px", width: "fit-content" }}>
                            {Array.from({ length: 5 }, (_, i) => 5 - i).map((rating, index) => (
                                <div key={index} style={{ display: 'flex', gap: "20px", alignItems: 'center' }}>
                                    <RatingComponent initialRating={rating} disabled />
                                    <div key={rating} style={{ position: 'relative' }}>
                                        <div style={{ height: "4px", background: "rgba(255, 255, 255, 0.5)", width: "150px" }} />
                                        <div
                                            style={{
                                                position: "absolute",
                                                background: "white",
                                                height: "4px",
                                                top: 0,
                                                width: `${(data?.ratings_count.find((item) => item.rating === rating)
                                                    ?.count ?? 0) *
                                                    100 /
                                                    (data?.count ?? 1)
                                                    }%`,
                                            }} />
                                    </div>
                                    <div style={{ marginLeft: "auto" }}>{new Intl.NumberFormat('ru-RU').format(data?.ratings_count.find((item) => item.rating === rating)?.count ?? 0)}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: "60px", display: "flex", gap: "20px" }}>
                            <FlagButton className={styles.flag_button} text="По новизне" initialState={isNewly} onChangeActive={handleSetIsNEwly} onChangeDirectionSorting={(value) => { setIsDirectionIsNewLy(value) }} />
                            <FlagButton className={styles.flag_button} text="По рейтингу" initialState={isRatingly} onChangeActive={handleSetISRatingly} onChangeDirectionSorting={setIsDirectionIsRatingly} />
                        </div>

                        <div style={{ marginTop: '40px', display: "flex", flexDirection: "column", gap: "40px", marginBottom: "120px" }}>
                            {feedbacks.map((feedback, index) => {
                                return (
                                    <FullFeedbackPanel is_mobile key={index} feedback={feedback} />
                                )
                            })}

                            {feedbacks.length < (data?.count ?? 0) ?
                                <div className={styles.button} onClick={() => { GetData() }}>Показать еще</div>
                                : null}
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

export default AllFeedbacksPage