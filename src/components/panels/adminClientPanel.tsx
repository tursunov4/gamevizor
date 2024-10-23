import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/panels/adminTeamPanel.module.css"
import TrashIcon from "/public/icons/bases/trash.svg?react"
import EmployeeInterface from "../../interfaces/employeeInterface";
import BaseImageProfileImage from "/images/bases/base_image_for_profile.png"
import EyeIcon from "/public/icons/bases/eye.svg?react"
import EyeCloseIcon from "/public/icons/bases/eye_crossed_out.svg?react"
import { useAuth } from "../../stores/JWTTokenStore";
import { useUser } from "../../stores/userStore";
import UserInterface from "../../interfaces/userInterface";
import { format, parseISO } from "date-fns";
import Input from "../inputs/input";
import MyPhoneInput from "../inputs/MyPhoneInput";
import MyTextAreaInput from "../inputs/MyTextAreaInput";
import axios from "axios";
import { Link } from "react-router-dom";
import useWindowSize from "../state/useWindowSize";


interface adminTeamPanelProps {
    user: UserInterface;
    employee: EmployeeInterface | null;
    funcDelete?: () => void;
}


const adminClientPanel: FunctionComponent<adminTeamPanelProps> = ({ user, employee, funcDelete }) => {
    const { accessToken } = useAuth();
    const [userPanel, setUserPanel] = useState<UserInterface>(user);

    const { } = useUser();

    const [error, setError] = useState<string>("");

    const [isEdit, setIsEdit] = useState(false);

    const formattedDate = format(parseISO(user.date_joined), 'dd.MM.yy'); // Format date
    const formattedTime = format(parseISO(user.date_joined), 'HH:mm');

    const [isVisibleDeleteWindow, setIsVisibleDeleteWindow] = useState(false)

    const handleIsEdit = () => {
        setIsEdit(true);
    }

    const handleisCanceled = () => {
        setUserPanel(user);
        setIsEdit(false);
    }

    const HandleChangeUsername = (value: string) => {
        setUserPanel({ ...userPanel, username: value })
    }

    const HandleChangePhoneNumber = (value: string) => {
        setUserPanel({ ...userPanel, phone_number: value })
    }

    const HandleChangeEmail = (value: string) => {
        setUserPanel({ ...userPanel, email: value })
    }

    useEffect(() => {
        setUserPanel(user);
        setIsEdit(false);
    }, [user])

    const handleBlockUser = async () => {
        if (!accessToken) return;
        try {
            delete userPanel.profile.image
            userPanel.is_active = !userPanel.is_active
            const response = await axios.put('/api/v1/admin/users/' + userPanel.pk + "/",
                userPanel,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            if (response.status == 200) {
                setUserPanel(response.data);
                setIsEdit(false);
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));
            userPanel.is_active = !userPanel.is_active
        }
    }

    const HandleSave = async () => {

        if (!accessToken) return;

        try {
            delete userPanel.profile.image
            const response = await axios.put('/api/v1/admin/users/' + userPanel.pk + "/",
                userPanel,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            if (response.status == 200) {
                setUserPanel(response.data);
                setIsEdit(false);
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));
        }
    }

    const handleDelete = async () => {
        if (!accessToken) return;

        try {
            delete userPanel.profile.image
            const response = await axios.delete('/api/v1/admin/users/' + userPanel.pk + "/",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            if (response.status == 204) {
                if (funcDelete) funcDelete();
                setIsVisibleDeleteWindow(false)
            }
        } catch (error: any) {
            setError(JSON.stringify(error.response.data));
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
            <div className={styles.container}>
                {isEdit ? (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: 'flex', gap: '30px' }}>
                            <img
                                src={user?.profile?.image ? user?.profile?.image : BaseImageProfileImage}
                                style={{ width: '61px', borderRadius: "50%", height: "61px" }} />
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <Input style={{ width: "578px", height: "42px" }} label="Имя" value={userPanel.username} onChange={HandleChangeUsername} />
                                <div style={{ display: "flex", gap: "20px" }}>
                                    <MyPhoneInput value={userPanel.phone_number} style={{ width: "279px" }} label={"Телефон"} onChange={HandleChangePhoneNumber} disabled={false} />
                                    <Input style={{ width: "279px", height: "42px" }} label={"Телеграм"} />
                                </div>
                                <div style={{ display: "flex", gap: "20px" }}>
                                    <Input value={userPanel.email} style={{ width: "279px" }} label={"Email"} onChange={HandleChangeEmail} />
                                    <select name="console" className={styles.select_console} value={userPanel?.profile?.console_generation} onChange={() => { }}>
                                        <option value={"PS4"}>PS4</option>
                                        <option value={"PS5"}>PS5</option>
                                    </select>
                                </div>
                                <MyTextAreaInput label="Примечание о клиенте (не отображается у клиента)" style={{ resize: "none", height: "82px" }} placeholder={"Впечатления о сделке с клиентом ..."} />
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "30px", alignItems: "flex-end" }}>
                                <div onClick={handleBlockUser}>{userPanel.is_active ? <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>В черный список <EyeCloseIcon /></span>
                                    : <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>Разблокировать <EyeIcon /></span>}</div>
                                <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => setIsVisibleDeleteWindow(true)}>Удалить <TrashIcon fill="#FF6062" /></div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                <div>{error}</div>
                                <div className={styles.button} onClick={HandleSave}>Сохранить</div>
                                <div onClick={handleisCanceled}>Закрыть / Отмена</div>
                            </div>

                        </div>

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
                ) : (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: 'flex', gap: '50px' }}>
                            <img
                                src={userPanel?.profile?.image ? userPanel?.profile?.image : BaseImageProfileImage}
                                style={{ width: '61px', borderRadius: "50%", height: "61px" }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ color: "white", marginBottom: "10px" }}>{userPanel?.username}</div>

                                <div>{userPanel?.phone_number}</div>
                                <div>@{userPanel?.nickname}</div>
                                <div>{userPanel?.email}</div>
                                <div>{userPanel?.profile?.console_generation}</div>
                                <div style={{ color: "white", marginTop: "10px" }}>Примечание о клиенте:</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '100px' }}>
                            <div>
                                <div style={{ color: "white" }}>{formattedDate}</div>
                                <div>{formattedTime}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '30px', flexDirection: "column", justifyContent: "space-between" }}>
                                <Link className={userPanel?.is_active ? styles.button : styles.deactive_button} style={{ width: "145px", padding: "15px", fontFamily: "Unbounded_Medium", fontSize: "10px" }} to={"../admin/chat/?search=" + userPanel?.email}>ЧАТ С КЛИЕНТОМ</Link>
                                <div style={{ display: "flex", gap: "20px", flexDirection: "column", alignItems: "flex-end" }}>
                                    <div onClick={handleIsEdit} style={{ color: 'white', textDecoration: 'underline', cursor: "pointer" }}>Редактировать</div>
                                    <div onClick={handleBlockUser} style={!employee?.permissions.includes("delete_and_block_users") ? { textDecoration: "line-through", cursor: "pointer" } : { cursor: "pointer" }}>{userPanel.is_active === true ? <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>В черный список <EyeCloseIcon /></span>
                                        : <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>Разблокировать <EyeIcon /></span>}</div>
                                    <div style={{ display: "flex", justifyContent: "center", cursor: "pointer", gap: "5px", color: "#FF6062", textDecoration: !employee?.permissions.includes("delete_and_block_users") ? "line-through" : "" }} onClick={() => setIsVisibleDeleteWindow(true)}>Удалить <TrashIcon fill="#FF6062" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                {isEdit ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                <img
                                    src={userPanel?.profile?.image ? userPanel?.profile?.image : BaseImageProfileImage}
                                    style={{ width: '120px', borderRadius: "50%", height: "120px" }} />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-end" }}>
                                <div onClick={handleBlockUser}>{userPanel.is_active ? <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>В черный список <EyeCloseIcon /></span>
                                    : <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>Разблокировать <EyeIcon /></span>}</div>
                                <div style={{ display: "flex", justifyContent: "center", gap: "5px", color: "#FF6062", cursor: "pointer" }} onClick={() => {setIsVisibleDeleteWindow(true)}}>Удалить <TrashIcon fill="#FF6062" /></div>
                            </div>



                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <Input style={{ width: "578px", height: "42px" }} label="Имя" value={userPanel.username} onChange={HandleChangeUsername} />
                            <MyPhoneInput value={userPanel.phone_number} style={{ width: "279px" }} label={"Телефон"} onChange={HandleChangePhoneNumber} disabled={false} />
                            <Input style={{ width: "279px", height: "42px" }} label={"Телеграм"} />
                            <Input value={userPanel.email} style={{ width: "279px" }} label={"Email"} onChange={HandleChangeEmail} />
                            <select name="console" className={styles.select_console} value={userPanel?.profile?.console_generation} onChange={() => { }}>
                                <option value={"PS4"}>PS4</option>
                                <option value={"PS5"}>PS5</option>
                            </select>
                            <MyTextAreaInput label="Примечание о клиенте (не отображается у клиента)" style={{ resize: "none", height: "82px" }} placeholder={"Впечатления о сделке с клиентом ..."} />
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                <img
                                    src={userPanel?.profile?.image ? userPanel?.profile?.image : BaseImageProfileImage}
                                    style={{ width: '40px', borderRadius: "50%", height: "40px" }} />
                                <div style={{ color: "white" }}>{userPanel?.username}</div>
                            </div>
                            <div style={{ color: "rgba(255, 255, 255, 0.4)" }}>(Дата регистрации:<br /> {formattedDate} {formattedTime})
                            </div>
                        </div>

                        <div>{userPanel?.phone_number}</div>
                        <div>@{userPanel?.nickname}</div>
                        <div>{userPanel?.email}</div>
                        <div>{userPanel?.profile?.console_generation}</div>
                        <div style={{ color: "white", marginTop: "10px" }}>Примечание о клиенте:</div>

                        <Link className={userPanel?.is_active ? styles.button : styles.deactive_button} style={{ width: "145px", padding: "15px", fontFamily: "Unbounded_Medium", fontSize: "10px" }} to={"../admin/chat/?search=" + userPanel?.email}>ЧАТ С КЛИЕНТОМ</Link>

                        <div style={{ display: "flex", gap: "20px", flexDirection: "column", alignItems: "flex-end" }}>
                            <div onClick={handleIsEdit} style={{ color: 'white', textDecoration: 'underline', cursor: "pointer" }}>Редактировать</div>
                            <div onClick={handleBlockUser} style={!employee?.permissions.includes("delete_and_block_users") ? { textDecoration: "line-through", cursor: "pointer" } : { cursor: "pointer" }}>{userPanel.is_active === true ? <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>В черный список <EyeCloseIcon /></span>
                                : <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>Разблокировать <EyeIcon /></span>}</div>
                            <div style={{ display: "flex", justifyContent: "center", cursor: "pointer", gap: "5px", color: "#FF6062", textDecoration: !employee?.permissions.includes("delete_and_block_users") ? "line-through" : "" }} onClick={() => setIsVisibleDeleteWindow(true)}>Удалить <TrashIcon fill="#FF6062" /></div>
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

export default adminClientPanel