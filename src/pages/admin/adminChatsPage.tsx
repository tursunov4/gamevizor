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
import AdminChatPanel from "../../components/panels/adminChatPanel";
import ChatInterface from "../../interfaces/chatInterface";
import useWindowSize from "../../components/state/useWindowSize";
import { Link } from "react-router-dom";



const AdminChatsPage: FunctionComponent = () => {
    const { employee } = useUser();
    const { accessToken } = useAuth();

    const [chats, setChats] = useState<ChatInterface[]>([]);

    const [filterAllChats, setFilterAllChats] = useState(true);
    const [filterAcceptedChats, setFilterAcceptedChats] = useState(false);
    const [filterProcessingChats, setFilterProcessingChats] = useState(false);
    const [filterCompleteChats, setFilterCompleteChats] = useState(false);
    const [filterQuestionChats, setFilterQuestionChats] = useState(false);

    const [orderingAllChats, setOrderingAllChats] = useState(false);
    const [orderingAcceptedChats, setOrderingAcceptedChats] = useState(false);
    const [orderingProcessingChats, setOrderingProcessingChats] = useState(false);
    const [orderingCompleteChats, setOrderingCompleteChats] = useState(false);
    const [orderingQuestionChats, setOrderingQuestionChats] = useState(false);

    const [search, setSearch] = useState("");

    const fetchUsers = async (is_search = false) => {
        if (!accessToken) return;

        try {
            let url = '/api/v1/admin/chats/?'; // Base URL

            if (filterAllChats) {
                url += "&has_order=true" + "&ordering=" + (orderingAllChats ? "" : "-") + "created_on"
            }


            if (filterQuestionChats) {
                url += "&has_ticket=true" + "&ordering=" + (orderingQuestionChats ? "" : "-") + "created_on"
            }

            if (filterCompleteChats) {
                url += "&status=completed" + "&ordering=" + (orderingCompleteChats ? "" : "-") + "created_on"
            }

            if (filterProcessingChats) {
                url += "&status=processing" + "&ordering=" + (orderingProcessingChats ? "" : "-") + "created_on"
            }
            if (is_search) {
                url += "&search=" + search
            }
            // Add filters to the URL if they are true
            /* if (filterAllClient) {
                url += `&ordering=${orderingAllClient ? (orderingAllClient ? '-pk' : 'pk') : 'pk'}`;
            }

            if (filterClient) {
                url += '&is_active=1';
                url += `&ordering=${orderingClient ? (orderingClient ? '-pk' : 'pk') : 'pk'}`;
            }
            if (filterBlockClient) {
                url += '&is_active=0';
                url += `&ordering=${orderingBlockClient ? (orderingBlockClient ? '-pk' : 'pk') : '-pk'}`;
            }

            if (is_search) {
                url += "&search=" + search
            } */

            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            if (response.status === 200) {
                setChats(response.data);
            }
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };

    useEffect(() => {

        fetchUsers();
    }, [accessToken, filterAllChats, filterAcceptedChats, filterProcessingChats, filterCompleteChats, filterQuestionChats,
        orderingAllChats, orderingAcceptedChats, orderingProcessingChats, orderingCompleteChats, orderingQuestionChats]);
    const HandleSelectAllChats = (value: boolean) => {
        setFilterAllChats(value);
        setFilterAcceptedChats(false);
        setFilterProcessingChats(false);
        setFilterCompleteChats(false);
        setFilterQuestionChats(false);
    }

    const HandleSelectAcceptedChats = (value: boolean) => {
        setFilterAllChats(false);
        setFilterAcceptedChats(value);
        setFilterProcessingChats(false);
        setFilterCompleteChats(false);
        setFilterQuestionChats(false);
    }

    const HandleSelectProcessingChats = (value: boolean) => {
        setFilterAllChats(false);
        setFilterAcceptedChats(false);
        setFilterProcessingChats(value);
        setFilterCompleteChats(false);
        setFilterQuestionChats(false);
    }

    const HandleSelectCompleteChats = (value: boolean) => {
        setFilterAllChats(false);
        setFilterAcceptedChats(false);
        setFilterProcessingChats(false);
        setFilterCompleteChats(value);
        setFilterQuestionChats(false);
    }

    const HandleSelectQuestionChats = (value: boolean) => {
        setFilterAllChats(false);
        setFilterAcceptedChats(false);
        setFilterProcessingChats(false);
        setFilterCompleteChats(false);
        setFilterQuestionChats(value);
    }

    const DeleteEmployee = async () => {

    }

    const HandleSearch = () => {
        fetchUsers(true)
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

<div className={styles.base_path}><Link style={{color: "var(--color-gray-1100)", textDecoration: "none"}} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Чаты</span></div>
                        <div className={styles.main_panel}>
                            <AdminMenu selected={3} />
                            <div className={styles.general}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className={styles.title}>Чаты</div>
                                    <div style={{ display: "flex", gap: "25px" }}>
                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <Input style={{ width: "271px", height: "29px" }} maxlenght={30} placeholder="Поиск" onEventEnterPressed={HandleSearch} value={search} onChange={setSearch} />
                                            <div onClick={HandleSearch} style={{ position: "absolute", left: "260px", top: "32%" }}><SearchIcon /></div>
                                        </div>
                                        <div className={styles.button} style={{ textWrap: "nowrap", width: "223px", fontFamily: "Unbounded_Medium", fontSize: "10px" }} onClick={() => { }}>Создать чат с сотрудником</div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "20px", marginTop: "25px" }}>
                                    <div style={{ fontSize: "0.9rem" }}>Статус: </div>
                                    <FlagButton className={styles.flag_button} text="Все заказы" initialState={filterAllChats} onChangeActive={HandleSelectAllChats} onChangeDirectionSorting={setOrderingAllChats} />
                                    {//<FlagButton className={styles.flag_button} text="Принятые" initialState={filterAcceptedChats} onChangeActive={HandleSelectAcceptedChats} onChangeDirectionSorting={setOrderingAcceptedChats} />
                                    }
                                    <FlagButton className={styles.flag_button} text="В обработке" initialState={filterProcessingChats} onChangeActive={HandleSelectProcessingChats} onChangeDirectionSorting={setOrderingProcessingChats} />
                                    <FlagButton className={styles.flag_button} text="Выполненные" initialState={filterCompleteChats} onChangeActive={HandleSelectCompleteChats} onChangeDirectionSorting={setOrderingCompleteChats} />
                                    <FlagButton className={styles.flag_button} text="Вопрос" initialState={filterQuestionChats} onChangeActive={HandleSelectQuestionChats} onChangeDirectionSorting={setOrderingQuestionChats} />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "150px", maxHeight: "1600px", overflowY: "auto", marginTop: "50px" }}>
                                    {chats.map((chat) => (
                                        <AdminChatPanel key={chat.id} order={chat} employee={employee} funcDelete={DeleteEmployee} />

                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{
                    marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: 0.9,
                }}>
                    <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px", marginBottom: "30px" }} />
                </div>
            </div>

        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <BaseCenterContainer>
                    <Header is_admin />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", gap: "30px" }}>
                    <div className={styles.base_path}><Link style={{color: "var(--color-gray-1100)", textDecoration: "none"}} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Чаты</span></div>
                        <div className={styles.general}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div className={styles.title}>Чаты</div>
                                <div className={styles.button} style={{ textWrap: "nowrap", width: "223px", fontFamily: "Unbounded_Medium", fontSize: "10px" }} onClick={() => { }}>Создать чат с сотрудником</div>
                            </div>
                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <Input style={{ width: "300px", height: "29px" }} maxlenght={30} placeholder="Поиск" onEventEnterPressed={HandleSearch} value={search} onChange={setSearch} />
                                <div onClick={HandleSearch} style={{ position: "absolute", left: "290px", top: "32%" }}><SearchIcon /></div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>Статус:</div>
                                <FlagButton className={styles.flag_button} text="Все заказы" initialState={filterAllChats} onChangeActive={HandleSelectAllChats} onChangeDirectionSorting={setOrderingAllChats} />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "150px", maxHeight: "1600px", overflowY: "auto", marginTop: "50px" }}>
                                {chats.map((chat) => (
                                    <AdminChatPanel key={chat.id} order={chat} employee={employee} funcDelete={DeleteEmployee} />

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

export default AdminChatsPage