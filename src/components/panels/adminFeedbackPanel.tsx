import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/panels/adminTeamPanel.module.css"
import TrashIcon from "/public/icons/bases/trash.svg?react"
import EmployeeInterface from "../../interfaces/employeeInterface";
import BaseImageProfileImage from "/images/bases/base_image_for_profile.png"
import EyeIcon from "/public/icons/bases/eye.svg?react"
import EyeCloseIcon from "/public/icons/bases/eye_crossed_out.svg?react"
import { useAuth } from "../../stores/JWTTokenStore";
import { format, parseISO } from "date-fns";
import axios from "axios";
import { feedbackEmployeeInterface } from "../../interfaces/feedbackInterface";
import RatingComponent from "../ratingComponent";
import MyTextAreaInput from "../inputs/MyTextAreaInput";
import useWindowSize from "../state/useWindowSize";


interface adminTeamPanelProps {
    feedback: feedbackEmployeeInterface;
    employee: EmployeeInterface | null;
    funcDelete?: () => void;
}


const AdminFeedbackPanel: FunctionComponent<adminTeamPanelProps> = ({ feedback, funcDelete }) => {
    const { accessToken } = useAuth();
    const [feedbackPanel, setFeedbackPanel] = useState<feedbackEmployeeInterface>(feedback);

    const [error, setError] = useState<string>("");

    const formattedDate = format(parseISO(feedbackPanel.created_on), 'dd.MM.yy'); // Format date
    const formattedTime = format(parseISO(feedbackPanel.created_on), 'HH:mm');

    const [isVisibleDeleteWindow, setIsVisibleDeleteWindow] = useState(false)

    const [isEdit, setIsEdit] = useState(false);

    const handleChangeStatus = async () => {
        if (!accessToken) return;

        try {
            feedbackPanel.is_public = !feedbackPanel.is_public
            const response = await axios.put('/api/v1/admin/feedbacks/' + feedback.id + "/",
                feedbackPanel,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            if (response.status == 200) {
                setFeedbackPanel({ ...response.data, user: { ...feedbackPanel.user } })
                if (funcDelete) funcDelete()
            }
        } catch (error: any) {
            setError(JSON.stringify)
        }
    }

    useEffect(() => {
        setFeedbackPanel(feedback);
    }, [feedback])

    const handleDelete = async () => {
        if (!accessToken) return;

        try {
            const response = await axios.delete('/api/v1/admin/feedbacks/' + feedback.id + "/",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            if (response.status == 204) {
                if (funcDelete) funcDelete();
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));
        }
    }
    const handleisCanceled = () => {
        setFeedbackPanel(feedback)
        setIsEdit(false)
    }

    const HandleSave = async () => {
        if (!accessToken) return;

        try {

            const response = await axios.put('/api/v1/admin/feedbacks/' + feedback.id + "/",
                feedbackPanel,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            if (response.status == 200) {
                setFeedbackPanel({ ...response.data, user: { ...feedbackPanel.user } })
                setIsEdit(false)
            }
        } catch (error: any) {
            setError(JSON.stringify)
        }
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
            <div className={styles.container} style={{}}>
                {isEdit ?
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: 'flex', gap: '50px' }}>
                            <img
                                src={feedbackPanel?.user.profile?.image ? feedbackPanel?.user.profile?.image : BaseImageProfileImage}
                                style={{ width: '61px', borderRadius: "50%", height: "61px" }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <RatingComponent initialRating={feedbackPanel.rating} disabled={true} />
                                <div style={{ color: "white", marginBottom: "10px" }}>{feedbackPanel?.user.username}</div>

                                <div>{feedbackPanel?.text}</div>
                                <MyTextAreaInput value={feedbackPanel.answer} onChange={(value) => setFeedbackPanel({ ...feedbackPanel, answer: value })} label="Ответ представителя" style={{ resize: "none", width: "350px", height: "100px" }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '100px' }}>
                            <div>
                                <div style={{ color: "white" }}>{formattedDate}</div>
                                <div>{formattedTime}</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: "column", alignItems: "flex-start", width: "92px" }}>
                                    <div onClick={handleChangeStatus}>{feedbackPanel.is_public === false ? <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Показать <EyeCloseIcon width={16} height={16} /></span>
                                        : <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Скрыть <EyeIcon width={16} height={16} /></span>}</div>
                                    <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => { setIsEdit(true) }}>Изменить</div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={handleDelete}>Удалить <TrashIcon fill="#FF6062" /></div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                    <div>{error}</div>
                                    <div className={styles.button} onClick={HandleSave}>Сохранить</div>
                                    <div onClick={handleisCanceled}>Закрыть / Отмена</div>
                                </div>

                            </div>

                        </div>
                    </div>
                    :
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: 'flex', gap: '50px' }}>
                            <img
                                src={feedbackPanel?.user.profile?.image ? feedbackPanel?.user.profile?.image : BaseImageProfileImage}
                                style={{ width: '61px', borderRadius: "50%", height: "61px" }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <RatingComponent initialRating={feedbackPanel.rating} disabled={true} />
                                <div style={{ color: "white", marginBottom: "10px" }}>{feedbackPanel?.user.username}</div>

                                <div>{feedbackPanel?.text}</div>

                                <div>Ответ представителя: {feedbackPanel?.answer?.slice(0, 50)}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '90px' }}>
                            <div>
                                <div style={{ color: "white" }}>{formattedDate}</div>
                                <div>{formattedTime}</div>
                            </div>
                            <div style={{ width: "193.98px" }}>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: "column", alignItems: "flex-start", width: "92px", marginLeft: "auto" }}>
                                    <div onClick={handleChangeStatus}>{feedbackPanel.is_public === false ? <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Показать <EyeCloseIcon width={16} height={16} /></span>
                                        : <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Скрыть <EyeIcon width={16} height={16} /></span>}</div>
                                    <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => { setIsEdit(true) }}>Изменить</div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => { setIsVisibleDeleteWindow(true) }}>Удалить <TrashIcon fill="#FF6062" /></div>
                                </div>

                            </div>
                        </div>
                    </div>}

                {isVisibleDeleteWindow && (
                    <div className={styles.background_delete} onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsVisibleDeleteWindow(false);
                        }
                    }}>
                        <div className={styles.container_delete}>
                            <img src="/icons/bases/trash_delete.svg" width={200} />
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                <h1>Удалить?</h1>
                                <div className={styles.button} onClick={handleDelete}>Да</div>
                                <div className={styles.button} onClick={() => setIsVisibleDeleteWindow(false)} style={{ backgroundColor: "rgba(194, 194, 194, 0.14)" }}>Нет</div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        )
    } else {
        return (
            <div className={styles.container}>
                {isEdit ?
                    (
                        <div style={{ display: "flex", flexDirection: 'column', gap: "20px" }}>
                            <div style={{ display: "flex", justifyContent: 'space-between' }}>
                                <div style={{ display: "flex", gap: "20px" }}>
                                    <img
                                        src={feedbackPanel?.user.profile?.image ? feedbackPanel?.user.profile?.image : BaseImageProfileImage}
                                        style={{ width: '40px', borderRadius: "50%", height: "40px" }} />
                                    <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                                        <RatingComponent initialRating={feedbackPanel.rating} disabled={true} />
                                        <div style={{ color: "white" }}>{feedbackPanel?.user.username}</div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: "white" }}>{formattedDate}</div>
                                    <div>{formattedTime}</div>
                                </div>

                            </div>

                            <div>{feedbackPanel?.text}</div>

                            <div>Ответ представителя:</div>

                            <MyTextAreaInput value={feedbackPanel.answer} onChange={(value) => setFeedbackPanel({ ...feedbackPanel, answer: value })} label="Ответ представителя" style={{ resize: "none", width: "350px", height: "100px" }} />

                            <div style={{ alignSelf: "flex-end" }}>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: "column", alignItems: "flex-end" }}>
                                    <div onClick={handleChangeStatus}>{feedbackPanel.is_public === false ? <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Показать <EyeCloseIcon width={16} height={16} /></span>
                                        : <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Скрыть <EyeIcon width={16} height={16} /></span>}</div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => { setIsVisibleDeleteWindow(true) }}>Удалить <TrashIcon fill="#FF6062" /></div>
                                </div>

                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                    <div>{error}</div>
                                    <div className={styles.button} onClick={HandleSave}>Сохранить</div>
                                    <div onClick={handleisCanceled}>Закрыть / Отмена</div>
                                </div>

                            {isVisibleDeleteWindow && (
                                <div className={styles.background_delete} onClick={(event) => {
                                    if (event.target === event.currentTarget) {
                                        setIsVisibleDeleteWindow(false);
                                    }
                                }}>
                                    <div className={styles.container_delete} style={{ width: "280px", left: "6%", top: "15%" }}>
                                        <img src="/icons/bases/trash_delete.svg" width={200} />
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                            <h1>Удалить?</h1>
                                            <div className={styles.button} onClick={handleDelete}>Да</div>
                                            <div className={styles.button} onClick={() => setIsVisibleDeleteWindow(false)} style={{ backgroundColor: "rgba(194, 194, 194, 0.14)" }}>Нет</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: 'column', gap: "20px" }}>
                            <div style={{ display: "flex", justifyContent: 'space-between' }}>
                                <div style={{ display: "flex", gap: "20px" }}>
                                    <img
                                        src={feedbackPanel?.user.profile?.image ? feedbackPanel?.user.profile?.image : BaseImageProfileImage}
                                        style={{ width: '40px', borderRadius: "50%", height: "40px" }} />
                                    <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                                        <RatingComponent initialRating={feedbackPanel.rating} disabled={true} />
                                        <div style={{ color: "white" }}>{feedbackPanel?.user.username}</div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: "white" }}>{formattedDate}</div>
                                    <div>{formattedTime}</div>
                                </div>

                            </div>

                            <div>{feedbackPanel?.text}</div>

                            <div>Ответ представителя: {feedbackPanel?.answer?.slice(0, 50)}</div>

                            <div style={{ alignSelf: "flex-end" }}>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: "column", alignItems: "flex-end" }}>
                                    <div onClick={handleChangeStatus}>{feedbackPanel.is_public === false ? <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Показать <EyeCloseIcon width={16} height={16} /></span>
                                        : <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>Скрыть <EyeIcon width={16} height={16} /></span>}</div>
                                    <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => { setIsEdit(true) }}>Изменить</div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => { setIsVisibleDeleteWindow(true) }}>Удалить <TrashIcon fill="#FF6062" /></div>
                                </div>

                            </div>

                            {isVisibleDeleteWindow && (
                                <div className={styles.background_delete} onClick={(event) => {
                                    if (event.target === event.currentTarget) {
                                        setIsVisibleDeleteWindow(false);
                                    }
                                }}>
                                    <div className={styles.container_delete} style={{ width: "280px", left: "6%", top: "15%" }}>
                                        <img src="/icons/bases/trash_delete.svg" width={200} />
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                            <h1>Удалить?</h1>
                                            <div className={styles.button} onClick={handleDelete}>Да</div>
                                            <div className={styles.button} onClick={() => setIsVisibleDeleteWindow(false)} style={{ backgroundColor: "rgba(194, 194, 194, 0.14)" }}>Нет</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
            </div>
        )
    }

};

export default AdminFeedbackPanel