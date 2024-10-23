import { FunctionComponent, useEffect, useId, useState } from "react"
import styles from "../styles/pages/MySubscriptionsPage.module.css"
import ProfileMenu from "../components/menus/profileMenu";
import axios from "axios";
import BaseCenterContainer from "../components/baseCenterContainer";
import Header from "../components/header";
import Footer from "../components/footer";
import { useAuth } from "../stores/JWTTokenStore";
import Input from "../components/inputs/input";
import MyTextAreaInput from "../components/inputs/MyTextAreaInput";
import ReactSelect from "react-select";
import TrashIcon from "/public/icons/bases/trash.svg?react"
import SupportInterface from "../interfaces/supportInteface";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../components/state/useWindowSize";
import e from "express";


interface PropsTheme {
    value: string;
    label: string;
}


const SupportCreatePage: FunctionComponent = () => {
    const { accessToken } = useAuth();

    const [ticket, setTicket] = useState<SupportInterface>({});

    const [files, setFiles] = useState<null | File[]>(null)

    const [Error, setError] = useState<string>("")

    const [Theme, setTheme] = useState<PropsTheme[]>([])

    const navigate = useNavigate();
    // profile/tickets/get_themes/

    useEffect(() => {
        if (!accessToken) return

        axios.get('/api/v1/profile/tickets/get_themes/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setTheme(response.data)
            })
            .catch(error => {
                setError(error.message);
            });
    }, [accessToken])



    const CreateTicket = () => {
        const data = new FormData();

        if (ticket.title) data.append("title", ticket.title)
        if (ticket.theme) data.append("theme", ticket.theme)
        if (ticket.question) data.append("question", ticket.question)
        // Если токен есть, запрос на получение данных пользователя
        axios.post('/api/v1/profile/tickets/create/', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                navigate('../profile/supports')
            })
            .catch(error => {
                setError(error.message);
            });
    };

    const removeFile = (index: number) => {
        if (!files) return
        // Create a new array with the removed file
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
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

                        <div className={styles.base_path}>Главная / Личный кабинет / Поддержка / <span style={{ color: " var(--color-white)" }}>Новый тикет</span></div>
                        <div className={styles.main_panel}>
                            <ProfileMenu selected={6} />
                            <div className={styles.general}>
                                <div className={styles.title} style={{ marginBottom: "25px" }}>
                                    <div>Написать новый тикет в поддержку</div>
                                    <div className={styles.line} />
                                </div>

                                <div style={{ width: "100%" }}>
                                    <Input style={{ height: "32px", backgroundColor: "#19162F", width: "100%" }} placeholder={"Тема обращения"} value={ticket?.title} onChange={(value) => { setTicket({ ...ticket, title: value }) }} />
                                </div>
                                <ReactSelect
                                    className={styles.select}
                                    unstyled
                                    classNamePrefix="select"
                                    options={Theme}
                                    defaultValue={{ value: "DEFAULT", label: "Выберите тему" }}
                                    isSearchable={false}
                                    onChange={(value) => { setTicket({ ...ticket, theme: value?.value }) }}
                                    instanceId={useId()} />
                                <MyTextAreaInput style={{ resize: "none", height: "210px", backgroundColor: "#19162F" }} placeholder={"Задать вопрос"} value={ticket.question} onChange={(value) => { setTicket({ ...ticket, question: value }) }} />
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "5px", width: "100%" }}>
                                    <div style={{ display: "flex", flexDirection: "column", maxWidth: "80px" }}>
                                        <label htmlFor="files" className={styles.change_image} style={{ width: "20px", textAlign: "center", color: "#C2C2C2", cursor: "pointer" }}><img src="/icons/chat/paperclip.svg" width={20} height={20} /></label>
                                        <input id="files" style={{ display: "none" }} multiple accept="image/*" type="file" onChange={(e) => { setFiles(Array.from(e.target.files ?? []).slice(0, 5)); e.target.value = "" }} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignSelf: "flex-end" }}>
                                    {files ? Array.from(files).map((file, index) => (
                                        <div key={index} style={{ display: "flex", color: "#C2C2C2", gap: "15px" }}>
                                            <div>{file.name}</div>
                                            <TrashIcon fill="var(--color-deeppink)" width={15} height={15} onClick={() => { removeFile(index) }} />
                                        </div>
                                    )) : null}
                                </div>
                                <div>{Error}</div>
                                <div className={styles.button} style={{ alignSelf: "flex-start" }} onClick={CreateTicket}>Отправить</div>
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
                    <Header />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", display: 'flex', flexDirection: "column", gap: "40px" }}>

                        <div className={styles.base_path} style={{ fontSize: "12px" }}>Главная / Личный кабинет / Поддержка / <span style={{ color: " var(--color-white)" }}>Новый тикет</span></div>
                        <div className={styles.general}>
                            <div className={styles.title} style={{ marginBottom: "25px", textWrap: 'wrap' }}>
                                <div style={{ fontSize: '14px', minWidth: "176px" }}>Написать новый тикет в поддержку</div>
                                <div className={styles.line} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: "10px" }}>
                                <Input style={{ height: "32px", backgroundColor: "#19162F" }} placeholder={"Тема обращения"} value={ticket?.title} onChange={(value) => { setTicket({ ...ticket, title: value }) }} />
                                <ReactSelect
                                    className={styles.select}
                                    unstyled
                                    classNamePrefix="select"
                                    options={Theme}
                                    defaultValue={{ value: "DEFAULT", label: "Выберите тему" }}
                                    isSearchable={false}
                                    onChange={(value) => { setTicket({ ...ticket, theme: value?.value }) }}
                                    instanceId={useId()} />
                                <MyTextAreaInput style={{ resize: "none", height: "210px", backgroundColor: "#19162F" }} placeholder={"Задать вопрос"} value={ticket.question} onChange={(value) => { setTicket({ ...ticket, question: value }) }} />

                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "5px", width: "100%" }}>
                                    <div style={{ display: "flex", flexDirection: "column", maxWidth: "80px" }}>
                                        <label htmlFor="files" className={styles.change_image} style={{ width: "20px", textAlign: "center", color: "#C2C2C2", cursor: "pointer" }}><img src="/icons/chat/paperclip.svg" width={20} height={20} /></label>
                                        <input id="files" style={{ display: "none" }} multiple accept="image/*" type="file" onChange={(e) => { setFiles(Array.from(e.target.files ?? []).slice(0, 5)); e.target.value = "" }} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignSelf: "flex-end" }}>
                                    {files ? Array.from(files).map((file, index) => (
                                        <div key={index} style={{ display: "flex", color: "#C2C2C2", gap: "15px" }}>
                                            <div>{file.name}</div>
                                            <TrashIcon fill="var(--color-deeppink)" width={15} height={15} onClick={() => { removeFile(index) }} />
                                        </div>
                                    )) : null}
                                </div>
                                <div>{Error}</div>
                                <div className={styles.button} style={{ alignSelf: "flex-start", width: "108px" }} onClick={CreateTicket}>Отправить</div>
                            </div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{ marginTop: "auto", maxWidth }}>
                    <Footer style={{ height: "150px", display: "flex", justifyContent: "center" }} />
                </div>
            </div>
        )
    }
}

export default SupportCreatePage