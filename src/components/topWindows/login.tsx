import { FC, useEffect, useState } from "react"
import styles from "../../styles/topWindows/login.module.css"
import { useUser } from "../../stores/userStore";
import Input from "../inputs/input";
import useWindowSize from "../state/useWindowSize";
import { Link } from "react-router-dom";


interface ChildProps {
    changeVisibleLogin: () => void;
    changeVisibleRegister: () => void;
}


const Login: FC<ChildProps> = ({ changeVisibleLogin, changeVisibleRegister }) => {
    const { LoginCTX } = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setshowPassword] = useState('password');
    const [Error, setError] = useState('')

    const VisiblePassword = () => {
        return setshowPassword(showPassword === 'text' ? 'password' : 'text');
    }

    const ExitingLogin = () => {
        changeVisibleLogin();
    }

    const OpenRegister = () => {
        changeVisibleRegister();
    }

    const Login = async () => {
        try {
            const success = await LoginCTX(email, password);
            console.log(success)
            if (success) {
                ExitingLogin();
                window.location.reload();
            } else {
                setError("Неверный логин или пароль")
            }
        } catch (error) {
            console.log(123)
            setError("Ошибка входа");
        }
    };

    const handleClick = (event: any) => {
        // Проверяем, является ли целевой элемент (event.target)
        //  элементом, который вызвал событие (event.currentTarget)
        if (event.target === event.currentTarget) {
            ExitingLogin()
        }
    };


    const [width, height] = useWindowSize()
    const [maxWidth, setMaxWidth] = useState(1600)

    useEffect(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        setMaxWidth(parseInt(computedStyle.getPropertyValue("--width-for-mobile").replace("px", "")))
    }, [])

    if (width >= maxWidth) {
        return (
            <>
                <div className={styles.background} onClick={handleClick}>
                    <div className={styles.window}>
                        <img className={styles.close} src="/icons/bases/close.svg" onClick={ExitingLogin} />
                        <div className={styles.content}>
                            <div className={styles.title}>Вход в личный кабинет</div>
                            <Input label="Email" placeholder={"example@domain.com"} value={email} label_style={{ background: "none" }}
                                onChange={(value) => setEmail(value)} style={{ width: "370px", background: "none" }} />
                            <div style={{ position: "relative" }}>
                                <Input label="Password" placeholder={"*****************"} type={showPassword} value={password} label_style={{ background: "none" }}
                                    onChange={(value) => setPassword(value)} style={{ width: "370px", background: "none" }} maxlenght={32} />
                                <img src={showPassword == "password" ? "/icons/bases/eye.svg" : "/icons/bases/eye_crossed_out.svg"} className={styles.eye} onClick={VisiblePassword} />
                            </div>

                            <div>{Error}</div>

                            <button className={styles.btn_login} onClick={Login}>войти</button>

                            <div className={styles.information}>
                                <div>Нет аккаута? <span className={styles.register} onClick={OpenRegister}>Регистрация</span></div>
                                <div className={styles.underline}>Забыли пароль?</div>
                            </div>

                            <div className={styles.footer}>
                                {`Нажимая на кнопку «войти» я соглашаюсь с `}
                                <span className={styles.underline}>
                                    политикой конфиденциальности в отношении обработки персональных
                                    данных
                                </span>
                                {` и `}
                                <span className={styles.underline}>политикой оферты</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className={styles.background} onClick={handleClick}>
                    <div className={styles.window} style={{ padding: "15px" }}>
                        <div className={styles.content} style={{ padding: "0px", margin: "0 auto" }}>
                            <img className={styles.close} src="/icons/bases/close.svg" style={{ alignSelf: "flex-end" }} onClick={ExitingLogin} />
                            <div className={styles.title} style={{ fontSize: "14px" }}>Вход в личный кабинет</div>

                            <Input label="Email" placeholder={"example@domain.com"} value={email} label_style={{ background: "none" }}
                                onChange={(value) => setEmail(value)} style={{ width: "290px", background: "none" }} />

                            <div style={{ position: "relative" }}>
                                <Input label="Пароль" placeholder={"*****************"} type={showPassword} value={password} label_style={{ background: "none" }}
                                    onChange={(value) => setPassword(value)} style={{ width: "290px", background: "none" }} maxlenght={32} />
                                <img src={showPassword == "password" ? "/icons/bases/eye.svg" : "/icons/bases/eye_crossed_out.svg"} className={styles.eye} onClick={VisiblePassword} />
                            </div>

                            {Error.length > 1 ? <div>{Error}</div> : null}

                            <button className={styles.btn_login} onClick={Login}>войти</button>

                            <div className={styles.information} style={{flexDirection: "column", gap: '10px'}}>
                                <div>Нет аккаута? <span className={styles.register} onClick={OpenRegister}>Регистрация</span></div>
                                <div className={styles.underline}>Забыли пароль?</div>
                            </div>

                            <div className={styles.footer} style={{width: "294px"}}>
                                {`Нажимая на кнопку «войти» я соглашаюсь с `}
                                <Link to={"../confidential/"} style={{ color: "var(--color-lightgray-100)", textDecoration: "underline" }}><span className={styles.underline}>
                                    политикой конфиденциальности в отношении обработки персональных
                                    данных
                                </span></Link>
                                {` и `}
                                <Link to={"../offer/"} style={{ color: "var(--color-lightgray-100)", textDecoration: "underline" }}><span className={styles.underline}>политикой оферты</span></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default Login