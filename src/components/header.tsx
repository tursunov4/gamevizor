import { FunctionComponent, useEffect, useRef, useState } from "react"
import styles from "../styles/header.module.css"
import { Link, useLocation } from "react-router-dom"
import Notification from "./notification"
import Login from "./topWindows/login"

import Logo from "/icons/bases/logo.svg"
import ShoppingIcon from "/icons/header/shopping.svg"
import MessagesIcon from "/icons/header/messages.svg"
import ExitIcon from "/icons/bases/exit.svg"
import UserIcon from "/icons/header/user.svg"
import MenuMobileIcon from "/icons/header/Menuj.svg"
import BaseImageProfileImage from "/images/bases/base_image_for_profile.png"
import Register from "./topWindows/register"
import { useUser } from "../stores/userStore"
import useWindowSize from "./state/useWindowSize"
import ProfileMenu from "./menus/profileMenu"
import AdminMenu from "./menus/adminMenu"


const Header: FunctionComponent<{ style?: React.CSSProperties, is_admin?: boolean, is_select_id_menu?: number }> = ({ style, is_admin, is_select_id_menu = 0 }) => {
    const [showLogin, setshowLogin] = useState(false);
    const [showRegister, setshowRegister] = useState(false);

    const [isShowProfile, setIsShowProfile] = useState(false);
    const [isShowAuthMenu, setIsShowAuthMenu] = useState(false);

    const [width, height] = useWindowSize()

    const { user, LogoutCTX, employee } = useUser();

    const menuRef = useRef<HTMLDivElement>(null);

    const [isShowAnimetionClose, setIsShowAnimetionClose] = useState(false)

    const changeVisibleRegister = () => {
        setshowLogin(false);
        setshowRegister(!showRegister);
    };

    const changeVisibleLogin = () => {

        setshowRegister(false);
        setshowLogin(!showLogin);
    };

    const handleLogout = () => {
        LogoutCTX();
        setIsShowAuthMenu(false);
        setIsShowProfile(false);
    };

    const handleShowProfile = () => {
        setIsShowAuthMenu(false);
        setIsShowProfile(!isShowProfile);
    };

    const handleCloseMobileMenu = (event: any) => {
        if (event.target === event.currentTarget) {
            setIsShowAnimetionClose(true)
            setIsShowProfile(false)
            setIsShowAuthMenu(false);
            setIsShowProfile(false);
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (showLogin || showRegister) {
            return;
        }

        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsShowAuthMenu(false);
            setIsShowProfile(false);
        }
    };

    // Add event listener for clicks outside the menu
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showLogin, showRegister]);

    const [maxWidth, setMaxWidth] = useState(1600)

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseInt(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    const location = useLocation();

    const [select_id_menu, set_select_id_menu] = useState(is_select_id_menu)

    useEffect(() => {
        if (location.pathname.includes("profile/orders")) {
            set_select_id_menu(2)
            return
        }

        if (location.pathname.includes("profile/subscriptions")) {
            set_select_id_menu(3)
            return
        }

        if (location.pathname.includes("profile/offers")) {
            set_select_id_menu(4)
            return
        }

        if (location.pathname.includes("profile/chats")) {
            set_select_id_menu(5)
            return
        }

        if (location.pathname.includes("profile/supports")) {
            set_select_id_menu(6)
            return
        }

        if (location.pathname.endsWith("profile/")) {
            set_select_id_menu(1)
            return
        }

        // admin 

        if (location.pathname.includes("admin/products")) {
            set_select_id_menu(1)
            return
        }

        if (location.pathname.includes("admin/orders")) {
            set_select_id_menu(2)
            return
        }

        if (location.pathname.includes("admin/chat")) {
            set_select_id_menu(3)
            return
        }

        if (location.pathname.includes("admin/team")) {
            set_select_id_menu(5)
            return
        }

        if (location.pathname.includes("admin/clients")) {
            set_select_id_menu(6)
            return
        }

        if (location.pathname.includes("admin/feedbacks")) {
            set_select_id_menu(7)
            return
        }
    }, [])


    if (width >= maxWidth) {
        return (

            <>
                <div className={styles.header} style={style}>
                    <div className={styles.info} style={{ alignItems: "center" }}>
                        <Link to="/"><img className={styles.icon} src={Logo} /></Link>
                        <Notification />
                    </div>

                    <div className={styles.icon_buttons}>
                        <Link to="../catalog/"><img className={styles.icon} src={ShoppingIcon} /></Link>
                        <Link to="../profile/chats/"><img className={styles.icon} src={MessagesIcon} /></Link>
                        {user ? (
                            <div className={styles.profileMenu} ref={menuRef}>
                                <div className={styles.icon}>
                                    <img className={styles.profile_icon} onClick={handleShowProfile} src={user?.profile.image ? user?.profile.image.replace("http://server.gamevizor.ru", "") : BaseImageProfileImage} />
                                    <div></div>
                                </div>
                                {isShowProfile ? (
                                    <div className={styles.contentProfileMenu}>
                                        <div className={styles.hrefcontainer} style={{ fontFamily: "Unbounded_Light_Base" }}>
                                            <Link to="/profile/">Личный кабинет</Link>
                                            {employee ? <Link to="/admin/">Админка</Link> : null}
                                            <Link to="/profile/orders/">Заказы</Link>
                                            <Link to={"../profile/subscriptions"}>Мои подписки</Link>
                                            <Link to={"../profile/offers"}>Предложения</Link>

                                            <br />
                                            <a onClick={handleLogout}>Выйти <img src={ExitIcon} /></a>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className={styles.profileMenu} ref={menuRef}>
                                <img className={styles.icon} onClick={() => setIsShowAuthMenu(!isShowAuthMenu)} src={UserIcon} />
                                {isShowAuthMenu ? (
                                    <div className={styles.contentProfileMenu}>
                                        <div className={styles.hrefcontainer}>
                                            <a onClick={changeVisibleLogin}>Вход</a>
                                            <a onClick={changeVisibleRegister}>Регистрация</a>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>

                {showLogin && (<Login changeVisibleLogin={changeVisibleLogin}
                    changeVisibleRegister={changeVisibleRegister} />)}

                {showRegister && (<Register changeVisibleLogin={changeVisibleLogin}
                    changeVisibleRegister={changeVisibleRegister} />)}
            </>
        )
    } else {
        return (
            <>
                <div className={styles.header} style={{ margin: "28px 25px", padding: "0" }}>
                    <div style={{display: "flex", gap: "20px", alignItems: "center"}}>
                        <Link to="/"><img className={styles.icon} src={Logo} style={{ width: "41px", height: "39px" }} /></Link>
                    </div>

                    <div style={{ display: 'flex', gap: "25px", alignItems: 'center' }}>
                        <Link to="../catalog/"><img className={styles.icon} src={ShoppingIcon} /></Link>
                        <img src={MenuMobileIcon} className={styles.icon} style={{ width: "28px", height: "24px" }} onClick={() => { setIsShowProfile(true); setIsShowAnimetionClose(true) }} />
                    </div>

                    {isShowProfile ?

                        user ?
                            (
                                <div className={styles.background_mobile_menu} onClick={handleCloseMobileMenu}>
                                    <div className={styles.mobile_menu}>
                                        <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', paddingLeft: "25px", paddingTop: "25px", paddingRight: "25px" }}>
                                            <div style={{ fontFamily: "Unbounded_Medium", fontSize: '32px' }}>GAME VIZOR</div>
                                            <img src="/icons/bases/close.svg" onClick={handleCloseMobileMenu} />
                                        </div>
                                        {is_admin ? <AdminMenu selected={select_id_menu} style={{ boxShadow: "none", background: "none" }} /> :
                                            <ProfileMenu selected={select_id_menu} is_mobile style={{ boxShadow: "none", background: "none" }} />}

                                    </div>
                                </div>
                            ) :
                            (<div className={styles.background_mobile_menu} onClick={handleCloseMobileMenu}>
                                <div className={styles.mobile_menu}>
                                    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', paddingLeft: "25px", paddingTop: "25px", paddingRight: "25px" }}>
                                        <div style={{ fontFamily: "Unbounded_Medium", fontSize: '32px' }}>GAME VIZOR</div>
                                        <img src="/icons/bases/close.svg" onClick={handleCloseMobileMenu} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: "10px", paddingLeft: "25px", marginTop: "20px" }}>
                                        <div onClick={changeVisibleLogin}>Войти</div>
                                        <div onClick={changeVisibleRegister}>Регистрация</div>
                                    </div>
                                </div>
                            </div>)

                        :
                        user ? isShowAnimetionClose ?
                            (
                                <div className={styles.close_mobile_menu}>
                                    <div className={styles.mobile_menu_flex}>
                                        <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', paddingLeft: "25px", paddingTop: "25px", paddingRight: "25px" }}>
                                            <div style={{ fontFamily: "Unbounded_Medium", fontSize: '32px' }}>GAME VIZOR</div>
                                            <img src="/icons/bases/close.svg" onClick={handleCloseMobileMenu} />
                                        </div>
                                        {is_admin ? <AdminMenu selected={select_id_menu} style={{ boxShadow: "none", background: "none" }} /> :
                                            <ProfileMenu selected={select_id_menu} is_mobile style={{ boxShadow: "none", background: "none" }} />}
                                    </div>
                                </div>
                            ) : null : isShowAnimetionClose ?
                            (
                                <div className={styles.close_mobile_menu}>
                                    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', paddingLeft: "25px", paddingTop: "25px", paddingRight: "25px" }}>
                                        <div style={{ fontFamily: "Unbounded_Medium", fontSize: '32px' }}>GAME VIZOR</div>
                                        <img src="/icons/bases/close.svg" onClick={handleCloseMobileMenu} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: "10px", paddingLeft: "25px", marginTop: "20px" }}>
                                        <div onClick={changeVisibleLogin}>Войти</div>
                                        <div onClick={changeVisibleRegister}>Регистрация</div>
                                    </div>
                                </div>
                            )
                            : null}


                    {showLogin && (<Login changeVisibleLogin={changeVisibleLogin}
                        changeVisibleRegister={changeVisibleRegister} />)}

                    {showRegister && (<Register changeVisibleLogin={changeVisibleLogin}
                        changeVisibleRegister={changeVisibleRegister} />)}
                </div >
            </>
        )
    }
}

export default Header