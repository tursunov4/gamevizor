import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/pages/admin/AdminClientPage.module.css"
import axios from "axios";
import BaseCenterContainer from "../../components/baseCenterContainer";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useAuth } from "../../stores/JWTTokenStore";
import AdminMenu from "../../components/menus/adminMenu";
import Input from "../../components/inputs/input";
import SearchIcon from "/public/icons/bases/search.svg?react"
import FlagButton from "../../components/inputs/flagButton";
import { useUser } from "../../stores/userStore";
import { feedbackEmployeeInterface } from "../../interfaces/feedbackInterface";
import AdminFeedbackPanel from "../../components/panels/adminFeedbackPanel";
import useWindowSize from "../../components/state/useWindowSize";
import { Link } from "react-router-dom";



const AdminFeedbackPage: FunctionComponent = () => {
    const { employee } = useUser();
    const { accessToken } = useAuth();

    const [feedbacks, setFeedbacks] = useState<feedbackEmployeeInterface[]>([]);

    const [search, setSearch] = useState("");

    const [filterAllFeedback, setFilterAllFeedback] = useState(true);
    const [filterPublicFeedback, setFilterPublicFeedback] = useState(false);
    const [filterHideFeedback, setFilterHideFeedback] = useState(false);

    const [orderingAllFeedback, setOrderingAllFeedback] = useState(false);
    const [orderingPublicFeedback, setOrderingPublicFeedback] = useState(false);
    const [orderingHideFeedback, setOrderingHideFeedback] = useState(false);

    const HandleSearch = () => {
        fetchFeedback(true)
    }

    const fetchFeedback = async (is_search = false) => {
        if (!accessToken) return;

        let url = '/api/v1/admin/feedbacks/?'; // Base URL

        // Add filters to the URL if they are true
        if (filterAllFeedback) {
            url += `&ordering=${orderingAllFeedback ? (orderingAllFeedback ? '-pk' : 'pk') : 'pk'}`;
        }

        if (filterPublicFeedback) {
            url += '&is_public=1';
            url += `&ordering=${orderingPublicFeedback ? (orderingPublicFeedback ? '-pk' : 'pk') : 'pk'}`;
        }
        if (filterHideFeedback) {
            url += '&is_public=0';
            url += `&ordering=${orderingHideFeedback ? (orderingHideFeedback ? '-pk' : 'pk') : '-pk'}`;
        }

        if (is_search) {
            url += "&search=" + search
        }


        try {
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            setFeedbacks(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [accessToken, filterAllFeedback, filterPublicFeedback, filterHideFeedback, orderingAllFeedback, orderingPublicFeedback, orderingHideFeedback]);

    const HandleSelectAllFeedback = (value: boolean) => {
        setFilterAllFeedback(value)
        setFilterPublicFeedback(false);
        setFilterHideFeedback(false);
    }

    const HandleSelectPublicFeedback = (value: boolean) => {
        setFilterAllFeedback(false)
        setFilterPublicFeedback(value);
        setFilterHideFeedback(false);
    }

    const HandleSelectHideFeedback = (value: boolean) => {
        setFilterAllFeedback(false)
        setFilterPublicFeedback(false);
        setFilterHideFeedback(value);
    }

    const DeleteFeedback = async () => {
        fetchFeedback()
    }

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
                    <Header />
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

                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Отзывы</span></div>
                        <div className={styles.main_panel}>
                            <AdminMenu selected={7} />
                            <div className={styles.general}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className={styles.title}>Отзывы</div>
                                    <div style={{ display: "flex", gap: "25px" }}>
                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <Input style={{ width: "271px", height: "29px" }} maxlenght={30} placeholder="Поиск" onEventEnterPressed={HandleSearch} value={search} onChange={setSearch} />
                                            <div onClick={HandleSearch} style={{ position: "absolute", left: "260px", top: "32%" }}><SearchIcon /></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "20px", marginTop: "25px" }}>
                                    <div style={{ fontSize: "0.9rem" }}>Фильтр: </div>
                                    <FlagButton className={styles.flag_button} text="Все отзывы" initialState={filterAllFeedback} onChangeActive={HandleSelectAllFeedback} onChangeDirectionSorting={setOrderingAllFeedback} />
                                    <FlagButton className={styles.flag_button} text="Опубликованные" initialState={filterPublicFeedback} onChangeActive={HandleSelectPublicFeedback} onChangeDirectionSorting={setOrderingPublicFeedback} />
                                    <FlagButton className={styles.flag_button} text="Скрытые" initialState={filterHideFeedback} onChangeActive={HandleSelectHideFeedback} onChangeDirectionSorting={setOrderingHideFeedback} />
                                </div>

                                <div style={{ display: "flex", maxWidth: "850px", justifyContent: "space-between", color: "rgba(255, 255, 255, 0.6)", marginTop: "50px", fontSize: "0.6rem" }}>
                                    <div style={{ display: "flex", gap: "100px" }}>
                                        <div>Фото</div>
                                        <div>Имя / Отзыв</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "220px" }}>
                                        <div>Дата</div>
                                        <div>Действия</div>
                                    </div>
                                </div>

                                <div className={styles.line} />

                                <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "150px", maxHeight: "1600px", overflowY: "auto" }}>
                                    {feedbacks.map((feedback, index) => (
                                        <AdminFeedbackPanel key={index} feedback={feedback} employee={employee} funcDelete={DeleteFeedback} />
                                    ))}
                                </div>
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
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <BaseCenterContainer>
                    <Header is_admin />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", gap: "30px" }}>
                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Отзывы</span></div>
                        <div className={styles.general}>
                            <div className={styles.title}>Отзывы <div className={styles.line} /></div>
                            <div style={{ display: "flex", gap: "25px" }}>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    <Input style={{ width: "300px", height: "29px" }} maxlenght={30} placeholder="Поиск" onEventEnterPressed={HandleSearch} value={search} onChange={setSearch} />
                                    <div onClick={HandleSearch} style={{ position: "absolute", left: "290px", top: "32%" }}><SearchIcon /></div>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>Фильтр:</div>
                                <FlagButton className={styles.flag_button} text="Все отзывы" initialState={filterAllFeedback} onChangeActive={HandleSelectAllFeedback} onChangeDirectionSorting={setOrderingAllFeedback} />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "150px", maxHeight: "1600px", overflowY: "auto", overflowX: "hidden" }}>
                                {feedbacks.map((feedback, index) => (
                                    <AdminFeedbackPanel key={index} feedback={feedback} employee={employee} funcDelete={DeleteFeedback} />
                                ))}
                            </div>
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

export default AdminFeedbackPage;