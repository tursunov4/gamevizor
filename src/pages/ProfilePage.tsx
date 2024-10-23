import { FunctionComponent, useEffect, useId, useState } from "react"
import styles from "../styles/pages/profilePage.module.css"
import BaseSwitch from "../components/inputs/BaseSwitch";
import ProfileMenu from "../components/menus/profileMenu";
import BaseCenterContainer from "../components/baseCenterContainer";
import Header from "../components/header";
import Footer from "../components/footer";
import { useUser } from "../stores/userStore";
import BaseImageProfileImage from "/images/bases/base_image_for_profile.png"
import Input from "../components/inputs/input";
import MyReactSelect from "../components/inputs/MyReactSelect";
import MyPhoneInput from "../components/inputs/MyPhoneInput";
import useWindowSize from "../components/state/useWindowSize";
import { Link } from "react-router-dom";


const ProfilePage: FunctionComponent = () => {
    const { user, setUser, GetUserProfileCTX, ChangeProfileCTX } = useUser();

    const [Error, SetError] = useState('');

    useEffect(() => {
        GetUserProfileCTX();
    }, [])


    const sendChange = () => {
        if (user) {
            if (user.nickname.length < 5) {
                SetError("Никнейм меньше 5 символов");
                return;
            }

            if (user.username.length < 2) {
                SetError("Минимальная длина имени равна 2");
                return;
            }

            delete user.profile.image

            ChangeProfileCTX(user);
        }
        SetError('')



    }



    const handleUsernameChange = (e: string) => {
        if (!user) return;

        setUser({ ...user, username: e })
    };

    const handleNicknameChange = (e: string) => {
        if (!user) return;

        setUser({ ...user, nickname: e })
    };

    const handleDateChange = (e: string) => {
        if (!user) return;

        setUser({
            ...user, profile: {
                ...user.profile,
                date_of_birth: e
            }
        })
    };

    const handleSelectChange = (e: string) => {
        if (!user) return;

        setUser({
            ...user, profile: {
                ...user.profile,
                console_generation: e
            }
        })
    };

    const handleImageUpdate = (e: any) => {
        const file = e.target.files[0];

        if (!file) {
            return; // Нет файла для загрузки
        }
        if (!user?.pk) { return }
        const data = new FormData();
        data.append("pk", user.pk.toString())
        data.append("profile[image]", file)
        ChangeProfileCTX(data)
    }

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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

                        <div className={styles.base_path}><Link to={"../"} style={{color: "var(--color-gray-1100)", textDecoration: "none"}}>Главная</Link> / Личный кабинет / <span style={{ color: " var(--color-white)" }}>Аккаунт</span></div>
                        <div className={styles.main_panel}>
                            <ProfileMenu selected={1} />
                            <div className={styles.general}>
                                <div className={styles.title}>Личные данные<div className={styles.line} /></div>

                                <div className={styles.profile_info}>

                                    <div style={{ maxWidth: "120px", marginRight: "60px" }}>
                                        <label htmlFor="icon" className={styles.change_image} style={{ display: "flex", flexDirection: "column", gap: "20px", pointerEvents: "none" }}>
                                            <img style={{ cursor: "pointer", pointerEvents: "initial" }} src={user?.profile.image ? user?.profile.image : BaseImageProfileImage} className={styles.profile_icon} />
                                            <div style={{ cursor: "pointer", pointerEvents: "initial" }} >Изменить фото</div>
                                        </label>
                                        <input id="icon" style={{ visibility: "hidden" }} type="file" accept="image/*" onChange={handleImageUpdate} />
                                    </div>
                                    <div className={styles.row}>
                                        <div className={styles.column}>
                                            <Input style={{ width: "367px", height: "29px" }} label={"Имя"} value={user?.username} onChange={handleUsernameChange} />
                                            <div style={{ position: "relative" }}>
                                                <Input style={{ width: "367px", height: "29px" }} label={"Телефон"} isDisabled
                                                    value={user?.phone_number ? `${user?.phone_number.slice(0, 2)}(${user?.phone_number.slice(2, 5)}) ${user?.phone_number.slice(5, 8)} ${user?.phone_number.slice(8, 10)} ${user?.phone_number.slice(10, 12)}` : ''} />

                                                <div style={{
                                                    position: "absolute", left: "55%", opacity: 0.5, top: "30%",
                                                    textWrap: "nowrap", fontFamily: "var(--font-tt-norms)"
                                                }}>Изменение через тех. поддержку</div>
                                            </div>
                                            <div style={{ position: "relative" }}>
                                                <Input label={"Email"} style={{ width: "367px", height: "29px" }} value={user?.email} isDisabled />
                                                <div style={{
                                                    position: "absolute", left: "55%", opacity: 0.5, top: "30%",
                                                    textWrap: "nowrap", fontFamily: "var(--font-tt-norms)"
                                                }}>Изменение через тех. поддержку</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.row}>
                                        <div className={styles.column}>
                                            <Input label={"Никнейм"} style={{ width: "291px", height: "29px" }} value={user?.nickname} onChange={handleNicknameChange} />
                                            <Input label={"Дата рождения"} type="date" style={{ width: "291px", height: "29px" }} value={user?.profile.date_of_birth} onChange={handleDateChange} />

                                            <MyReactSelect options={[{ value: "PS4", label: "PS4" }, { value: "PS5", label: "PS5" }]} label={"Поколения приставки"} onChange={(value) => { value?.value && handleSelectChange(String(value?.value)) }}
                                                value={{ value: user?.profile.console_generation, label: user?.profile.console_generation }} style={{ width: "314px" }} instanceId={useId()} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ alignSelf: "flex-end" }}>
                                    <div className={styles.button} style={{ fontFamily: "Unbounded_Medium" }} onClick={sendChange}>Сохранить</div>
                                    <div style={{ textAlign: "center", marginTop: "10px" }}>{Error}</div>
                                </div>

                                <div className={styles.title}>Безопасность<div className={styles.line} /></div>

                                <div className={styles.securety_panel}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>Двухфакторная аунтификация</div>
                                        {isClient ?
                                            <BaseSwitch checked={user?.profile.two_factor_authentication}
                                                onValueChange={(value) => {
                                                    if (user) {
                                                        setUser({ ...user, profile: { ...user.profile, two_factor_authentication: value } });
                                                    }
                                                }} />
                                            : null}
                                    </div>
                                </div>

                                <div className={styles.title}>Уведомление<div className={styles.line} /></div>

                                <div className={styles.column}>
                                    <div>Получение уведомлений</div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>Получать уведомления по электронной почте</div>
                                        {isClient ?
                                            <BaseSwitch checked={user?.profile.receive_notifications_on_email}
                                                onValueChange={(value) => {
                                                    if (user) {
                                                        setUser({ ...user, profile: { ...user.profile, receive_notifications_on_email: value } });
                                                    }
                                                }} />
                                            : null}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>Получать уведомления в Telegram</div>
                                        {isClient ?
                                            <BaseSwitch checked={user?.profile.receive_notifications_on_telegram}
                                                onValueChange={(value) => {
                                                    if (user) {
                                                        setUser({ ...user, profile: { ...user.profile, receive_notifications_on_telegram: value } });
                                                    }
                                                }} />
                                            : null}
                                    </div>
                                </div>

                                <div className={styles.column}>
                                    <div>Персонализация уведомлений</div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>Уведомления о новых сообщения</div>
                                        {isClient ?
                                            <BaseSwitch checked={user?.profile.receive_notifications_on_new_message}
                                                onValueChange={(value) => {
                                                    if (user) {
                                                        setUser({ ...user, profile: { ...user.profile, receive_notifications_on_new_message: value } });
                                                    }
                                                }} />
                                            : null}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>Изменение статуса заказа</div>
                                        {isClient ?
                                            <BaseSwitch checked={user?.profile.receive_notifications_on_change_status_order}
                                                onValueChange={(value) => {
                                                    if (user) {
                                                        setUser({ ...user, profile: { ...user.profile, receive_notifications_on_change_status_order: value } });
                                                    }
                                                }} />
                                            : null}
                                    </div>
                                </div>

                                <div style={{ alignSelf: "flex-end" }}>
                                    <div className={styles.button} style={{ fontFamily: "Unbounded_Medium" }} onClick={sendChange}>Сохранить</div>
                                    <div style={{ textAlign: "center", marginTop: "10px" }}>{Error}</div>
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
            <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflowX: "clip" }}>
                <BaseCenterContainer style={{ margin: "0 auto" }}>
                    <Header />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px" }}>
                        <div className={styles.general}>
                            <div className={styles.base_path}>Главная / Личный кабинет / <span style={{ color: " var(--color-white)" }}>Аккаунт</span></div>
                            <div className={styles.title}>Личные данные<div className={styles.line} /></div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: "20px" }}>
                                <div style={{ maxWidth: "120px", margin: "0 auto" }}>
                                    <label htmlFor="icon" className={styles.change_image} style={{ display: "flex", flexDirection: "column", gap: "20px", pointerEvents: "none" }}>
                                        <img style={{ cursor: "pointer", pointerEvents: "initial" }} src={user?.profile.image ? user?.profile.image : BaseImageProfileImage} className={styles.profile_icon} />
                                        <div style={{ cursor: "pointer", pointerEvents: "initial" }} >Изменить фото</div>
                                    </label>
                                    <input id="icon" style={{ visibility: "hidden" }} type="file" accept="image/*" onChange={handleImageUpdate} />
                                </div>

                                <Input style={{ width: "301px", height: "29px" }} label={"Имя"} value={user?.username} onChange={handleUsernameChange} />
                                {isClient ?
                                    <div style={{ position: "relative" }}>

                                        <MyPhoneInput disabled={true} value={user?.phone_number} label="Телефон" style={{ height: "39px", width: "325px" }} />

                                        <div style={{
                                            position: "absolute", left: "40%", top: "-25%",
                                            textWrap: "nowrap", fontFamily: "var(--font-tt-norms)", background: "#120d2a", padding: "2px", color: "rgba(212, 212, 212, 0.8)"
                                        }}>Изменение через тех. поддержку</div>
                                    </div> : null}
                                <div style={{ position: "relative" }}>
                                    <Input label={"Email"} style={{ width: "301px", height: "29px" }} value={user?.email} isDisabled />
                                    <div style={{
                                        position: "absolute", left: "40%", top: "-25%",
                                        textWrap: "nowrap", fontFamily: "var(--font-tt-norms)", background: "#120d2a", padding: "2px", color: "rgba(212, 212, 212, 0.8)"
                                    }}>Изменение через тех. поддержку</div>
                                </div>

                                <Input label={"Никнейм"} style={{ width: "291px", height: "29px" }} value={user?.nickname} onChange={handleNicknameChange} />
                                <Input label={"Дата рождения"} type="date" style={{ width: "291px", height: "29px" }} value={user?.profile.date_of_birth} onChange={handleDateChange} />

                                <MyReactSelect options={[{ value: "PS4", label: "PS4" }, { value: "PS5", label: "PS5" }]} label={"Поколения приставки"} onChange={(value) => { value?.value && handleSelectChange(String(value?.value)) }}
                                    value={{ value: user?.profile.console_generation, label: user?.profile.console_generation }} style={{ width: "314px" }} instanceId={useId()} />

                                <div style={{ alignSelf: "flex-end" }}>
                                    <div className={styles.button} style={{ fontFamily: "Unbounded_Medium", fontSize: "10px", width: "120px", padding: "12px" }} onClick={sendChange}>Сохранить</div>
                                    <div style={{ textAlign: "center", marginTop: "10px" }}>{Error}</div>
                                </div>

                                <div className={styles.title} style={{ marginTop: "10px", marginBottom: "10px" }}>Безопасность<div className={styles.line} /></div>

                                <div className={styles.securety_panel}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>Двухфакторная аунтификация</div>
                                        {isClient ?
                                            <BaseSwitch checked={user?.profile.two_factor_authentication}
                                                onValueChange={(value) => {
                                                    if (user) {
                                                        setUser({ ...user, profile: { ...user.profile, two_factor_authentication: value } });
                                                    }
                                                }} />
                                            : null}
                                    </div>
                                </div>

                                <div className={styles.title}>Уведомление<div className={styles.line} /></div>

                                <div className={styles.column}>
                                    <div>Получение уведомлений</div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>Получать уведомления по электронной почте</div>
                                        {isClient ?
                                            <BaseSwitch checked={user?.profile.receive_notifications_on_email}
                                                onValueChange={(value) => {
                                                    if (user) {
                                                        setUser({ ...user, profile: { ...user.profile, receive_notifications_on_email: value } });
                                                    }
                                                }} />
                                            : null}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>Получать уведомления в Telegram</div>
                                        {isClient ?
                                            <BaseSwitch checked={user?.profile.receive_notifications_on_telegram}
                                                onValueChange={(value) => {
                                                    if (user) {
                                                        setUser({ ...user, profile: { ...user.profile, receive_notifications_on_telegram: value } });
                                                    }
                                                }} />
                                            : null}
                                    </div>
                                </div>

                                <div className={styles.column}>
                                    <div>Персонализация уведомлений</div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>Уведомления о новых сообщения</div>
                                        {isClient ?
                                            <BaseSwitch checked={user?.profile.receive_notifications_on_new_message}
                                                onValueChange={(value) => {
                                                    if (user) {
                                                        setUser({ ...user, profile: { ...user.profile, receive_notifications_on_new_message: value } });
                                                    }
                                                }} />
                                            : null}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>Изменение статуса заказа</div>
                                        {isClient ?
                                            <BaseSwitch checked={user?.profile.receive_notifications_on_change_status_order}
                                                onValueChange={(value) => {
                                                    if (user) {
                                                        setUser({ ...user, profile: { ...user.profile, receive_notifications_on_change_status_order: value } });
                                                    }
                                                }} />
                                            : null}
                                    </div>
                                </div>

                                <div style={{ alignSelf: "flex-end" }}>
                                    <div className={styles.button} style={{ fontFamily: "Unbounded_Medium", fontSize: "10px", width: "120px", padding: "12px" }} onClick={sendChange}>Сохранить</div>
                                    <div style={{ textAlign: "center", marginTop: "10px" }}>{Error}</div>
                                </div>
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

export default ProfilePage