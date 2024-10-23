import { FC, useEffect, useState } from "react"
import styles from "../../styles/topWindows/register.module.css"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import ru from 'react-phone-input-2/lang/es.json'
import { isValidPhoneNumber } from "react-phone-number-input"
import axios from "axios"

import CloseIcon from "/icons/bases/close.svg"
import GoogleIcon from "/icons/social/google.svg"
import TelegramIcon from "/icons/social/telegram.svg"
import Input from "../inputs/input"
import MyPhoneInput from "../inputs/MyPhoneInput"
import useWindowSize from "../state/useWindowSize"
import { useUser } from "../../stores/userStore"
import { Link } from "react-router-dom"


interface ChildProps {
    changeVisibleLogin: () => void;
    changeVisibleRegister: () => void;
}


function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
}

const Register: FC<ChildProps> = ({ changeVisibleLogin, changeVisibleRegister }) => {
    const [showPassword, setshowPassword] = useState('password');

    const [Nickname, setNickname] = useState('');
    const [Email, setEmail] = useState('');
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [Phone, setPhone] = useState('')
    const [Error, SetError] = useState('')

    const { LoginCTX } = useUser();

    const VisiblePassword = () => {
        return setshowPassword(showPassword === 'text' ? 'password' : 'text');
    }

    const ExitingRegister = () => {
        return changeVisibleRegister();
    }

    const Register = async () => {
        if (Nickname.length < 5) {
            SetError("Никнейм меньше 5 символов")
            return
        }

        if (Password.length < 8 || !isNaN(Number(Password))) {
            SetError("Пароль должен быть не менее 8 символов и не должен состоять только из чисел")
            return
        }

        if (Password != repeatPassword) {
            SetError("Пароли не совпадают")
            return
        }
        if (isValidPhoneNumber("+" + Phone) === false) {
            SetError("Не правильный формат номера телефона")
            return
        }
        if (Username.length < 2) {
            SetError("Минимальная длина имени равна 2")
            return
        }

        if (!isValidEmail(Email)) {
            SetError("Неверый ввод почты")
            return
        }

        SetError('')

        try {
            const response = await axios.post('/api/v1/auth/registration/', {
                username: Username,
                nickname: Nickname,
                email: Email,
                phone_number: "+" + Phone,
                password1: Password,
                password2: repeatPassword,
            });
            if (response.status === 201) {
                const success = await LoginCTX(Email, Password);

                if (success) {
                    ExitingRegister();
                }
            }


        } catch (err: any) {
            if (typeof err.response.data === 'object') {
                const errData = Object.entries(err.response.data);
                SetError(errData.map(([key, value]) => `${key}: ${value}`).join(', '));
            } else {
                console.log(err.response.data);
                SetError(err.response.data.error || 'Registration failed');
            }
        }

    }

    const OpenLogin = () => {
        changeVisibleLogin();
    }

    const handleClick = (event: any) => {
        // Проверяем, является ли целевой элемент (event.target)
        //  элементом, который вызвал событие (event.currentTarget)
        if (event.target === event.currentTarget) {
            ExitingRegister()
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
                        <img className={styles.close} src={CloseIcon} onClick={ExitingRegister} />
                        <div className={styles.content}>
                            <div className={styles.title}>зарегистрируйтесь, чтобы продолжить</div>

                            <Input label="Никнейм" placeholder="@Pavel3234" value={Nickname} onChange={(value) => { setNickname(value) }}
                                style={{ width: "370px" }} label_style={{ background: "none" }} />
                            <Input placeholder="Иван" label="Имя" style={{ width: "370px" }}
                                value={Username} onChange={(value) => { setUsername(value) }} label_style={{ background: "none" }} />
                            <MyPhoneInput onChange={(event) => setPhone(event)} value={Phone} disabled={false} label="Телефон" style={{ height: "39px", width: "394px" }} />

                            <Input label="Email" placeholder={"example@domain.com"} value={Email} label_style={{ background: "none" }}
                                onChange={(value) => setEmail(value)} style={{ width: "370px", background: "none" }} />

                            <div style={{ position: "relative" }}>
                                <Input label="Password" placeholder={"*****************"} type={showPassword} value={Password} label_style={{ background: "none" }}
                                    onChange={(value) => setPassword(value)} style={{ width: "370px", background: "none" }} maxlenght={32} />
                                <img src={showPassword == "password" ? "/icons/bases/eye.svg" : "/icons/bases/eye_crossed_out.svg"} className={styles.eye} onClick={VisiblePassword} />
                            </div>
                            <Input label="Repeat Password" placeholder={"*****************"} type="password" value={repeatPassword} label_style={{ background: "none" }}
                                onChange={(value) => setRepeatPassword(value)} style={{ width: "370px", background: "none" }} maxlenght={32} />

                            {Error.length > 1 ? <div>{Error}</div> : null}

                            <button className={styles.btn_register} onClick={Register}>зарегистрировать</button>

                            <div className={styles.left}>
                                Уже есть аккаунт? <span className={styles.login} onClick={OpenLogin}>Войти</span>
                            </div>

                            <div style={{ textAlign: 'center', fontFamily: "Unbounded_Light_Base", fontSize: "11px", marginTop: "10px" }}>
                                Нажимая на кнопку «зарегистрироваться» я соглашаюсь с <span style={{ textDecoration: "underline" }}><Link to={"../confidential"}
                                    style={{ color: "var(--color-lightgray-100)", textDecoration: "underline" }}>политикой
                                    конфиденциальности</Link> в отношении <Link to={"../offer"}
                                        style={{ color: "var(--color-lightgray-100)", textDecoration: "underline" }}>обработки персональных данных и политикой оферты</Link></span>
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
                            <img className={styles.close} src={CloseIcon} onClick={ExitingRegister} style={{ alignSelf: "flex-end" }} />
                            <div className={styles.title} style={{ fontSize: "14px" }}>зарегистрируйтесь,<br />чтобы продолжить</div>

                            <Input label="Никнейм" placeholder="@Pavel3234" value={Nickname} onChange={(value) => { setNickname(value) }}
                                style={{ width: "290px" }} label_style={{ background: "none" }} />

                            <Input placeholder="Иван" label="Имя" style={{ width: "290px" }}
                                value={Username} onChange={(value) => { setUsername(value) }} label_style={{ background: "none" }} />

                            <MyPhoneInput onChange={(event) => setPhone(event)} value={Phone} disabled={false} label="Телефон" style={{ height: "39px", width: "310px" }} />

                            <Input label="Email" placeholder={"example@domain.com"} value={Email} label_style={{ background: "none" }}
                                onChange={(value) => setEmail(value)} style={{ width: "290px", background: "none" }} />

                            <div style={{ position: "relative" }}>
                                <Input label="Password" placeholder={"*****************"} type={showPassword} value={Password} label_style={{ background: "none" }}
                                    onChange={(value) => setPassword(value)} style={{ width: "290px", background: "none" }} maxlenght={32} />
                                <img src={showPassword == "password" ? "/icons/bases/eye.svg" : "/icons/bases/eye_crossed_out.svg"} className={styles.eye} onClick={VisiblePassword} />
                            </div>

                            <Input label="Repeat Password" placeholder={"*****************"} type="password" value={repeatPassword} label_style={{ background: "none" }}
                                onChange={(value) => setRepeatPassword(value)} style={{ width: "290px", background: "none" }} maxlenght={32} />

                            {Error.length > 1 ? <div>{Error}</div> : null}

                            <button className={styles.btn_register} onClick={Register}>зарегистрировать</button>

                            <div className={styles.left}>
                                Уже есть аккаунт? <span className={styles.login} onClick={OpenLogin}>Войти</span>
                            </div>

                            <div style={{ textAlign: 'center', fontFamily: "Unbounded_Light_Base", fontSize: "10px", width: "294px" }}>
                                Нажимая на кнопку «зарегистрироваться» я соглашаюсь с <span style={{ textDecoration: "underline" }}><Link to={"../confidential"}
                                    style={{ color: "var(--color-lightgray-100)", textDecoration: "underline" }}>политикой
                                    конфиденциальности</Link> в отношении <Link to={"../offer"}
                                        style={{ color: "var(--color-lightgray-100)", textDecoration: "underline" }}>обработки персональных данных и политикой оферты</Link></span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default Register