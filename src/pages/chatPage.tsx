import { FunctionComponent, useEffect, useRef, useState } from "react"
import styles from "../styles/pages/chatPage.module.css"
import axios from "axios";
import BaseCenterContainer from "../components/baseCenterContainer";
import Header from "../components/header";
import Footer from "../components/footer";
import { useUser } from "../stores/userStore";
import { useAuth } from "../stores/JWTTokenStore";
import { BackgroundStatusKeys, OrderPanelProp, StatusKeys } from "../interfaces/orderPanel";
import { BackgroundStatusKeys as SubscriptionBackgroundStatusKeys, StatusKeys as SubscriptionStatusKeys } from "../interfaces/subscriptionData";
import MyTextAreaInput from "../components/inputs/MyTextAreaInput";
import { Link, useSearchParams } from "react-router-dom";
import FilePreview from "../components/filePreview";
import SearchIcon from "/public/icons/bases/search.svg?react"
import Input from "../components/inputs/input";
import { format, parseISO } from "date-fns";
import ChatInterface from "../interfaces/chatInterface";
import useWindowSize from "../components/state/useWindowSize";
import ChatInfoPanel from "../components/panels/chatInfoPanel";

interface Message {
    id: number;
    author: {
        id: number;
        username: string;
        icon: string;
        // Добавьте другие поля автора, если необходимо
    };
    content: string;
    file?: string;
    is_read?: boolean;
    created_on: string; // Формат даты и времени
    updated_on: string; // Формат даты и времени
}


const chatPage: FunctionComponent = () => {
    const { user } = useUser();
    const { accessToken } = useAuth();

    const [textareaValue, setTextareaValue] = useState('')

    const [messages, setMessages] = useState<Message[]>([]);

    const [chats, setChats] = useState<ChatInterface[]>([]);

    const [selectChat, setSelectChat] = useState<ChatInterface | null>();

    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState("")

    const [SelectChatWebsocket, setSelectChatWebsocket] = useState(0)

    const [UseSearch, setUseSearch] = useState(false)

    useEffect(() => {
        if (!selectChat?.id) return
        if (searchParams.get("chat") === String(selectChat.id)) return
        setSearchParams({ chat: selectChat.id.toString() })
    }, [selectChat])


    useEffect(() => {
        if (selectChat) return
        if (!chats) return

        const chatId = searchParams.get('chat')
        if (!chatId) return

        chats.forEach((chat) => {
            if (chat.id === parseFloat(chatId)) setSelectChat(chat)
        })

    }, [searchParams, chats])

    const get_orders = async (is_search: String | undefined = undefined) => {
        if (!accessToken) return
        var url = '/api/v1/profile/chats/?'
        if (UseSearch) {
            url += "search=" + ((!is_search) ? search : is_search)
        }
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setChats(response.data);

            /*  if (selectChat?.id) {
                 var chatId = searchParams.get('chat') ?? "-1"
             } else {
                 var chatId = String(selectChat?.id)
             }
             response.data.forEach((chat: ChatInterface) => {
                 if (chat?.id === parseFloat(chatId)) setSelectChat(chat)
             }) */
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    useEffect(() => {
        let timerId: string | number | NodeJS.Timeout | undefined; // Декларируем timerId здесь, чтобы он был доступен в области действия useEffect

        // Очищаем предыдущий таймер, если он существует
        if (timerId) {
            clearInterval(timerId);
        }

        // Если accessToken существует, запускаем новый таймер
        if (accessToken) {
            timerId = setInterval(get_orders, 1000);
        }

        // Очищаем таймер при размонтировании компонента
        return () => clearInterval(timerId);

    }, [accessToken, searchParams, UseSearch]);


    useEffect(() => {
        if (!accessToken) return

        get_order();
        get_orders();
    }, [accessToken])


    function parseDateTimeToHoursMinutes(dateTimeString: string) {
        const date = new Date(dateTimeString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    const connection = useRef<WebSocket | null>(null)

    const myDivRef = useRef<HTMLDivElement>(null);

    const connectWebSocket = () => {
        if (!accessToken) return;
        if (!selectChat) return;

        const newWs = new WebSocket('wss://server.gamevizor.ru/ws/chat/' + selectChat.id + '/?token=' + accessToken);
        //const newWs = new WebSocket('ws://127.0.0.1:8000/ws/chat/' + selectChat.id + '/?token=' + accessToken);

        var data_messages: any[] = []
        // Event Handlers
        newWs.onopen = () => {
            console.log('WebSocket connection opened');
        };

        newWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data?.messages) {
                setMessages(data.messages);
                data_messages = data.messages
            } else if (data?.message) {
                setMessages([...data_messages, data.message]);
                data_messages = [...data_messages, data.message]
            }
        };

        newWs.onclose = () => {
            console.log('WebSocket connection closed.');
        };

        newWs.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        connection.current = newWs;
    };

    useEffect(() => {
        if (messages.length === 0) {
            window.scrollTo(0, 0);
            if (SelectChatWebsocket === selectChat?.id) return
            if (accessToken && selectChat?.id) {
                setSelectChatWebsocket(selectChat?.id)
                connectWebSocket();
                return
            }
        }
    }, [messages, selectChat])


    const sendNewMessage = (() => {
        if (!connection.current) return
        if (textareaValue.replace(/\s|\n/g, '').length === 0) return
        connection.current.send(JSON.stringify({ message: textareaValue }))
        setTextareaValue("")
    })

    const get_order = (async () => {
        if (!accessToken) return
        try {
            const response = await axios.get('/api/v1/profile/chats/' + selectChat?.id + "/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (selectChat?.order && selectChat?.order?.status === response.data.order.status) return
            if (selectChat?.ticket && selectChat?.ticket?.status === response.data.ticket.status) return

            setSelectChat(response.data);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    })

    useEffect(() => {

        if (myDivRef.current) myDivRef.current.scrollTop = myDivRef.current.scrollHeight;
        get_order();
    }, [messages]);


    useEffect(() => {
        if (UseSearch) {
            get_orders()
        }
    }, [UseSearch])

    const sendFileMessage = (async (e: any) => {
        if (!e.target.files) return
        if (!selectChat) return
        if (!connection.current) return


        const data = new FormData();

        data.append("file", e.target.files[0])


        try {
            const response = await axios.put("/api/v1/profile/chats/" + selectChat.id + "/load_file/",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            if (response.status == 200) {
                connection.current.send(JSON.stringify({ type: "file_send", id: response.data.message_id }))
            }
        } catch (error: any) {
            console.error(error)
        }

    })
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
                <div style={{ background: "#120F25" }}>
                    <Header style={{ margin: "auto", maxWidth: "1240px", background: "none", zoom: 0.9 }} />
                </div>
                <BaseCenterContainer style={{ zoom: 0.9 }}>
                    <div className={styles.background}>

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

                        <div className={styles.base_path}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <Link to={"../profile/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Личный кабинет</Link> / <span style={{ color: " var(--color-white)" }}>Чаты</span></div>
                        <div className={styles.main_panel}>
                            <div className={styles.general}>
                                <div className={styles.title}>Чаты<div className={styles.line} /></div>
                                <div className={styles.chat_container}>
                                    <div className={styles.chats_list}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <Link to={"../profile"} className={styles.back} style={{ display: "flex", gap: "20px", alignItems: "center", cursor: "pointer", color: "white", textDecoration: "none" }}>
                                                <img src={"/icons/bases/arrows/arrow_right.svg"} />
                                                <div>Назад</div>
                                            </Link>
                                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                                <Input style={{ width: "216px", height: "29px" }} placeholder="Поиск" maxlenght={30} value={search} onChange={(value) => { setSearch(value); setUseSearch(false) }} onEventEnterPressed={() => { setUseSearch(true); }} />
                                                <div style={{ position: "absolute", left: "210px", top: "32%" }}><SearchIcon width={13} height={13} onClick={() => { setUseSearch(true); }} /></div>
                                            </div>
                                        </div>
                                        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }} className={styles.list_orders}>

                                            {chats.map((chat: ChatInterface) => (
                                                <div key={chat.id} onClick={() => { if (selectChat !== chat) { if (selectChat !== chat) { setSelectChat(chat); setMessages([]) } } }}>
                                                    <ChatInfoPanel chat={chat} selectChat={selectChat} is_mobile />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.chat}>
                                        {selectChat ? (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "25px", height: "100%" }}>
                                                <div style={{ display: "flex", gap: "25px", fontSize: "0.9rem" }}>
                                                    {selectChat?.order ?
                                                        <img src={selectChat?.order?.product?.general_image ? selectChat?.order?.product.general_image : "https://placehold.co/80x80"} style={{ borderRadius: "15px", width: "60px", height: "60px" }} />
                                                        : <img src={"/icons/bases/question.svg"} style={{ borderRadius: "15px", width: "60px", height: "60px" }} />}
                                                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                                                        <div>{selectChat?.order?.product?.title ?? selectChat?.ticket?.title ?? `Пополнение кошелька на ${selectChat?.order?.wallet?.number} ${selectChat?.order?.wallet?.select_country?.tag}`}{selectChat?.order?.product?.product_type == "PRODUCT" && <><span style={{ color: selectChat?.order?.is_deluxe ? "#FF007A" : "white" }}>,{" "}{selectChat?.order?.is_deluxe ? "Deluxe Edition" : "Standart Edition"}</span><span style={{ color: "#C2C2C2" }}>{", "}({selectChat?.order?.platform?.title})</span></>}</div>
                                                        {selectChat?.order ?
                                                            <div className={styles.status} style={{ backgroundColor: BackgroundStatusKeys[selectChat?.order?.status as keyof typeof BackgroundStatusKeys] }}>{StatusKeys[selectChat?.order?.status as keyof typeof StatusKeys]}</div>
                                                            : null
                                                        }
                                                        {selectChat.ticket ?
                                                            <div className={styles.status} style={{ border: "3px solid #D4D4D4" }}>ВОПРОС</div> : null}
                                                    </div>
                                                    <div style={{ marginLeft: "auto" }}>{selectChat?.order ? `Заказ № ${selectChat.order.id}` : `Вопрос № ${selectChat.ticket.id}`}</div>
                                                </div>
                                                <div className={styles.chat_window} ref={myDivRef}>
                                                    {messages.length > 0 ? (messages.map((message, index) => (message.author.id == user?.pk ?
                                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} key={message.id}>
                                                            {index > 0 ? format(parseISO(messages[index - 1]?.created_on), 'dd.MM.yy') !== format(parseISO(message.created_on), 'dd.MM.yy') ? <div style={{ margin: "30px auto 20px", color: "#D4D4D4" }}>{format(parseISO(message.created_on), 'dd.MM.yy')}</div> : "" : ""}
                                                            {index > 0 ? (message.is_read === false && messages[index - 1]?.is_read === true && message.author.id !== user?.pk) ? <div style={{
                                                                margin: "30px 0 20px", color:
                                                                    "#D4D4D4", display: "flex", textWrap: "nowrap", alignItems: "center", gap: "10px"
                                                            }}><div className={styles.line_in_chat} />Непрочитанные сообщения<div className={styles.line_in_chat_swap} /></div> : null : null}
                                                            <div className={styles.your_message}>
                                                                <div className={!message?.file ? styles.container_content : styles.container_content_file}>
                                                                    <div className={styles.content}>
                                                                        {message?.file ? <FilePreview fileUrl={message.file} /> : <pre style={{ fontFamily: "var(--font-unbounded)", textWrap: "wrap" }}>{message.content}</pre>}
                                                                    </div>
                                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "15px" }}>
                                                                        <div style={{ color: "#C2C2C2" }}>{message.author.username}</div>
                                                                        <div style={{ marginLeft: "auto", alignSelf: "flex-end" }}>{parseDateTimeToHoursMinutes(message.created_on)}</div>
                                                                    </div>
                                                                </div>
                                                                <img src={message.author?.icon ? message.author.icon : "/images/bases/base_image_for_profile.png"} width={35} height={35} style={{ borderRadius: "50%" }} />
                                                            </div>
                                                        </div>

                                                        : <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} key={message.id}>
                                                            {index > 0 ? format(parseISO(messages[index - 1]?.created_on), 'dd.MM.yy') !== format(parseISO(message.created_on), 'dd.MM.yy') ? <div style={{ margin: "30px auto 20px", color: "#D4D4D4" }}>{format(parseISO(message.created_on), 'dd.MM.yy')}</div> : "" : ""}
                                                            {index > 0 ? (message.is_read === false && messages[index - 1]?.is_read === true && message.author.id !== user?.pk) ? <div style={{
                                                                margin: "30px 0 20px", color:
                                                                    "#D4D4D4", display: "flex", textWrap: "nowrap", alignItems: "center", gap: "10px"
                                                            }}><div className={styles.line_in_chat} />Непрочитанные сообщения<div className={styles.line_in_chat_swap} /></div> : null : null}
                                                            <div key={message.id} className={styles.my_message}>
                                                                <img src={message.author?.icon ? message.author.icon : "/images/bases/base_image_for_profile.png"} width={35} height={35} style={{ borderRadius: "50%" }} />
                                                                <div className={!message?.file ? styles.container_content : styles.container_content_file}>
                                                                    <div className={styles.content}>
                                                                        {message?.file ? <FilePreview fileUrl={message.file} /> : <pre style={{ fontFamily: "var(--font-unbounded)", textWrap: "wrap" }}>{message.content}</pre>}
                                                                    </div>
                                                                    <div style={{ marginLeft: "auto", alignSelf: "flex-end", padding: "15px" }}>{parseDateTimeToHoursMinutes(message.created_on)}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                    ) : (
                                                        null
                                                    )}

                                                </div>
                                                <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                                                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", flexGrow: "1" }} className={styles.input_chat}>
                                                        <img src={user?.profile?.image ? user?.profile?.image : "/images/bases/base_image_for_profile.png"} width={35} height={35} style={{ alignSelf: "flex-start", borderRadius: "50%" }} />
                                                        <MyTextAreaInput value={textareaValue} placeholder="Напишите сообщение" onChange={setTextareaValue} style={{ height: "117px", resize: "none", border: "none", fontSize: "15px", background: "#19162F", borderRadius: "14px", color: "#D4D4D4" }} onEnter={sendNewMessage} />
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "35PX" }}>
                                                        <div>
                                                            <label htmlFor="files"><img src="/icons/bases/paperclip.svg" width={24} height={24} style={{ padding: "5px", cursor: "pointer" }} /></label>
                                                            <input id="files" style={{ display: "none" }} multiple={false} accept="*" type="file" onChange={(e) => { sendFileMessage(e) }} />
                                                        </div>
                                                        <button className={styles.button} style={{ cursor: "pointer" }} onClick={sendNewMessage}>ОТПРАВИТЬ</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : <div style={{ margin: "auto", fontSize: "2rem", color: "#C2C2C2" }}>Выберите чат</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BaseCenterContainer >
                <div style={{ marginTop: "auto", width: "auto", background: "#120F25", height: "150px", zoom: 0.9, zIndex: 1 }}>
                    <Footer style={{ margin: "auto", maxWidth: "1240px", background: "none", marginTop: "30px" }} />
                </div>
            </div >

        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <BaseCenterContainer>
                    <Header />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", display: 'flex', flexDirection: "column", gap: "20px" }}>



                        <div className={styles.base_path}><Link to={"../"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Главная</Link> / <Link to={"../profile/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Личный кабинет</Link> / <span style={{ color: " var(--color-white)" }}>Чаты</span></div>
                        {!selectChat ?
                            <div className={styles.main_panel} style={{ marginTop: "15px" }}>
                                <div className={styles.general} style={{ gap: "30px" }}>
                                    <div className={styles.title}>Чаты<div className={styles.line} /></div>

                                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                        <Input style={{ width: "300px", height: "29px" }} placeholder="Поиск" maxlenght={30} value={search} onChange={(value) => { setSearch(value); setUseSearch(false) }} onEventEnterPressed={() => { setUseSearch(true); }} />
                                        <div style={{ position: "absolute", left: "290px", top: "32%" }}><SearchIcon width={13} height={13} onClick={() => { setUseSearch(true); }} /></div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: "column", gap: "5px" }}>
                                        {chats.map((chat: ChatInterface) => (
                                            <div key={chat.id} onClick={() => { setSelectChat(chat); setMessages([]) }}>
                                                <ChatInfoPanel chat={chat} selectChat={selectChat} is_mobile />
                                            </div>
                                        ))
                                        }
                                    </div>
                                </div>
                            </div> :

                            <div style={{ display: "flex", flexDirection: "column", gap: "25px", height: "100%" }}>
                                <div onClick={() => { setSelectChat(null); searchParams.delete("chat") }}>{"<<"}Назад</div>
                                <div style={{ display: "flex", gap: "25px", fontSize: "0.9rem" }}>
                                    {selectChat?.order ?
                                        <img src={selectChat?.order?.product?.general_image ? selectChat?.order?.product.general_image : "https://placehold.co/80x80"} style={{ borderRadius: "15px", width: "60px", height: "60px" }} />
                                        : <img src={"/icons/bases/question.svg"} style={{ borderRadius: "15px", width: "60px", height: "60px" }} />}
                                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                                        <div>{selectChat?.order?.product?.title ?? selectChat?.ticket?.title ?? `Пополнение кошелька на ${selectChat?.order?.wallet?.number} ${selectChat?.order?.wallet?.select_country?.tag}`}{selectChat?.order?.product?.product_type == "PRODUCT" && <><span style={{ color: selectChat?.order?.is_deluxe ? "#FF007A" : "white" }}>,{" "}{selectChat?.order?.is_deluxe ? "Deluxe Edition" : "Standart Edition"}</span><span style={{ color: "#C2C2C2" }}>{", "}({selectChat?.order?.platform?.title})</span></>}</div>
                                        {selectChat?.order ?
                                            <div className={styles.status} style={{ backgroundColor: BackgroundStatusKeys[selectChat?.order?.status as keyof typeof BackgroundStatusKeys] }}>{StatusKeys[selectChat?.order?.status as keyof typeof StatusKeys]}</div>
                                            : null
                                        }
                                        {selectChat.ticket ?
                                            <div className={styles.status} style={{ border: "3px solid #D4D4D4" }}>ВОПРОС</div> : null}
                                    </div>
                                    <div style={{ marginLeft: "auto" }}>{selectChat?.order ? `Заказ № ${selectChat.order.id}` : `Вопрос № ${selectChat.ticket.id}`}</div>
                                </div>
                                <div className={styles.chat_window} style={{ height: "580px" }} ref={myDivRef}>
                                    {messages.length > 0 ? (messages.map((message, index) => (message.author.id == user?.pk ?
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} key={message.id}>
                                            {index > 0 ? format(parseISO(messages[index - 1]?.created_on), 'dd.MM.yy') !== format(parseISO(message.created_on), 'dd.MM.yy') ? <div style={{ margin: "30px auto 20px", color: "#D4D4D4" }}>{format(parseISO(message.created_on), 'dd.MM.yy')}</div> : "" : ""}
                                            {index > 0 ? (message.is_read === false && messages[index - 1]?.is_read === true && message.author.id !== user?.pk) ? <div style={{
                                                margin: "30px 0 20px", color:
                                                    "#D4D4D4", display: "flex", textWrap: "nowrap", alignItems: "center", gap: "10px"
                                            }}><div className={styles.line_in_chat} />Непрочитанные сообщения<div className={styles.line_in_chat_swap} /></div> : null : null}
                                            <div className={styles.your_message}>
                                                <div className={!message?.file ? styles.container_content : styles.container_content_file}>
                                                    <div className={styles.content}>
                                                        {message?.file ? <FilePreview fileUrl={message.file} /> : <pre style={{ fontFamily: "var(--font-unbounded)", textWrap: "wrap" }}>{message.content}</pre>}
                                                    </div>
                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "15px" }}>
                                                        <div style={{ color: "#C2C2C2" }}>{message.author.username}</div>
                                                        <div style={{ marginLeft: "auto", alignSelf: "flex-end" }}>{parseDateTimeToHoursMinutes(message.created_on)}</div>
                                                    </div>
                                                </div>
                                                <img src={message.author?.icon ? message.author.icon : "/images/bases/base_image_for_profile.png"} width={35} height={35} style={{ borderRadius: "50%" }} />
                                            </div>
                                        </div>

                                        : <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} key={message.id}>
                                            {index > 0 ? format(parseISO(messages[index - 1]?.created_on), 'dd.MM.yy') !== format(parseISO(message.created_on), 'dd.MM.yy') ? <div style={{ margin: "30px auto 20px", color: "#D4D4D4" }}>{format(parseISO(message.created_on), 'dd.MM.yy')}</div> : "" : ""}
                                            {index > 0 ? (message.is_read === false && messages[index - 1]?.is_read === true && message.author.id !== user?.pk) ? <div style={{
                                                margin: "30px 0 20px", color:
                                                    "#D4D4D4", display: "flex", textWrap: "nowrap", alignItems: "center", gap: "10px"
                                            }}><div className={styles.line_in_chat} />Непрочитанные сообщения<div className={styles.line_in_chat_swap} /></div> : null : null}
                                            <div key={message.id} className={styles.my_message}>
                                                <img src={message.author?.icon ? message.author.icon : "/images/bases/base_image_for_profile.png"} width={35} height={35} style={{ borderRadius: "50%" }} />
                                                <div className={!message?.file ? styles.container_content : styles.container_content_file}>
                                                    <div className={styles.content}>
                                                        {message?.file ? <FilePreview fileUrl={message.file} /> : <pre style={{ fontFamily: "var(--font-unbounded)", textWrap: "wrap" }}>{message.content}</pre>}
                                                    </div>
                                                    <div style={{ marginLeft: "auto", alignSelf: "flex-end", padding: "15px" }}>{parseDateTimeToHoursMinutes(message.created_on)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    ) : (
                                        null
                                    )}

                                </div>
                                <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", flexGrow: "1" }} className={styles.input_chat}>
                                        <img src={user?.profile?.image ? user?.profile?.image : "/images/bases/base_image_for_profile.png"} width={35} height={35} style={{ alignSelf: "flex-start", borderRadius: "50%" }} />
                                        <MyTextAreaInput value={textareaValue} placeholder="Напишите сообщение" onChange={setTextareaValue} style={{ height: "117px", width: "100%", resize: "none", border: "none", fontSize: "15px", background: "#19162F", borderRadius: "14px", color: "#D4D4D4" }} onEnter={sendNewMessage} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "35PX" }}>
                                        <div>
                                            <label htmlFor="files"><img src="/icons/bases/paperclip.svg" width={24} height={24} style={{ padding: "5px", cursor: "pointer" }} /></label>
                                            <input id="files" style={{ display: "none" }} multiple={false} accept="*" type="file" onChange={(e) => { sendFileMessage(e) }} />
                                        </div>
                                        <button className={styles.button} style={{ cursor: "pointer", width: "130px", fontSize: "10px", fontFamily: "Unbounded_Medium" }} onClick={sendNewMessage}>ОТПРАВИТЬ</button>
                                    </div>
                                </div>
                            </div>}
                    </div>
                </BaseCenterContainer>
                <div style={{ marginTop: "auto" }}>
                    <Footer style={{ height: "150px", display: "flex", justifyContent: "center" }} />
                </div>
            </div>
        )
    }
}

export default chatPage