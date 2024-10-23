import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../../styles/frames/firstFrame.module.css"
import RatingComponent from "../../ratingComponent";
import axios from "axios";
import feedbackInterface from "../../../interfaces/feedbackInterface";
import FullFeedbackPanel from "./FullFeedbackPanel";
import { Link } from "react-router-dom";
import Feedback from "./Feedback";



interface feedbackInterfacePagination {
    count: number,
    average_rating: number,
    ratings_count: {
        rating: number,
        count: number
    }[]
}

interface childprops {
    is_mobile?: boolean
}

function formatNumber(number: number) {
    return number.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

const FeedbackInfoFrame: FunctionComponent<childprops> = ({is_mobile=false }) => {
    const [Data, setData] = useState<feedbackInterfacePagination>()
    const [Feedbacks, setFeedbacks] = useState<feedbackInterface[]>([])

    useEffect(() => {
        axios.get('/api/v1/feedbacks/?page=' + 1, {
        })
            .then(response => {
                setData(response.data)
            })
    }, [])

    useEffect(() => {
        axios.get('/api/v1/feedbacks/get_random/', {
        })
            .then(response => {
                setFeedbacks(response.data.results)
            })
    }, [])

    if (!is_mobile) {
        return (
            <div>
                <h1>Отзывы о магазине</h1>

                <div style={{ display: 'flex', justifyContent: "space-between", gap: "80px" }}>
                    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%", gap: "30px" }}>
                        {Feedbacks.map((feedback, index) => {
                            return (
                                <FullFeedbackPanel key={index} feedback={feedback} is_info_frame />
                            )
                        })}
                    </div>
                    <div>
                        <div style={{ display: 'flex', gap: "20px", alignItems: "center" }}>
                            <div style={{ fontSize: "48px", fontFamily: "Unbounded_Extra_Bold" }}>{formatNumber(Data?.average_rating ?? 0)}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <RatingComponent initialRating={Data?.average_rating} disabled />
                                <div style={{ color: "#D4D4D4" }}>На основании <span style={{ color: "white" }}>{Data?.count}</span> оценок</div>
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
                                                width: `${(Data?.ratings_count.find((item) => item.rating === rating)
                                                    ?.count ?? 0) *
                                                    100 /
                                                    (Data?.count ?? 1)
                                                    }%`,
                                            }} />
                                    </div>
                                    <div style={{ marginLeft: "auto" }}>{new Intl.NumberFormat('ru-RU').format(Data?.ratings_count.find((item) => item.rating === rating)?.count ?? 0)}</div>
                                </div>
                            ))}
                            <Link to={"../all_feedbacks/"} style={{ textDecoration: "none", pointerEvents: "all", alignSelf: "center", marginTop: "20px" }}><div className={styles.button} style={{
                                width: "280px",
                                fontFamily: "Unbounded_Medium", fontSize: "15px"
                            }}>ВСЕ ОТЗЫВЫ</div></Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "60px" }}>
                <h1>Отзывы о магазине</h1>

                <div style={{ display: 'flex', flexDirection: "column", gap: "40px" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: "20px" }}>
                        <div style={{ display: 'flex', gap: "20px", alignItems: "center" }}>
                            <div style={{ fontSize: "48px", fontFamily: "Unbounded_Extra_Bold" }}>{formatNumber(Data?.average_rating ?? 0)}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <RatingComponent initialRating={Data?.average_rating} disabled />
                                <div style={{ color: "#D4D4D4" }}>На основании <span style={{ color: "white" }}>{Data?.count}</span> оценок</div>
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
                                                width: `${(Data?.ratings_count.find((item) => item.rating === rating)
                                                    ?.count ?? 0) *
                                                    100 /
                                                    (Data?.count ?? 1)
                                                    }%`,
                                            }} />
                                    </div>
                                    <div style={{ marginLeft: "auto" }}>{new Intl.NumberFormat('ru-RU').format(Data?.ratings_count.find((item) => item.rating === rating)?.count ?? 0)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: "column", gap: "20px"}}>
                        <div className={styles.feedbacks} style={{
                            overflowX: "auto", overflowY: "hidden", width: "300px",
                            display: "flex", gap: "20px", paddingBottom: "30px", marginTop: "-10px", alignItems: 'center'
                        }}>
                            {Feedbacks.map((feedback: feedbackInterface, index) => {
                                return (
                                    <Feedback key={index} type_buy={feedback.order.title} username={feedback.order.user} rating={feedback.rating} text={feedback.text} />
                                )
                            })}
                        </div>
                        <Link to={"../all_feedbacks/"} style={{ textDecoration: "none", pointerEvents: "all", alignSelf: "center", marginTop: "20px" }}><div className={styles.button} style={{
                            width: "280px",
                            fontFamily: "Unbounded_Medium", fontSize: "15px"
                        }}>ВСЕ ОТЗЫВЫ</div></Link>
                    </div>
                </div>
            </div>
        )
    }
};


export default FeedbackInfoFrame;