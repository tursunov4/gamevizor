import { FunctionComponent, useEffect, useState } from "react"
import styles from "../../styles/pages/admin/adminTeamPage.module.css"
import axios from "axios";
import BaseCenterContainer from "../../components/baseCenterContainer";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useUser } from "../../stores/userStore";
import { useAuth } from "../../stores/JWTTokenStore";
import AdminMenu from "../../components/menus/adminMenu";
import Input from "../../components/inputs/input";
import SearchIcon from "/public/icons/bases/search.svg?react"
import AdminTeamPanel from "../../components/panels/adminTeamPanel";
import { EmployeeRoleInterface } from "../../interfaces/employeeInterface";
import CreateEmployeeWindow from "../../components/topWindows/CreateEmployeeWindow";
import useWindowSize from "../../components/state/useWindowSize";
import { Link } from "react-router-dom";



const AdminTeamPage: FunctionComponent = () => {
    const { employee } = useUser();

    const { accessToken } = useAuth();

    const [staffs, setStaffs] = useState([]);

    const [staffRoles, setStaffRoles] = useState<EmployeeRoleInterface[]>([]);

    const [isVisibleCreateEmployee, setVisibleCreateEmployee] = useState(false);

    const fetchStaffs = async () => {
        if (!accessToken) return;

        try {
            const response = await axios.get('/api/v1/admin/staffs/',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            setStaffs(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };

    useEffect(() => {

        fetchStaffs();
    }, [accessToken]);

    useEffect(() => {
        const fetchStaffs = async () => {
            if (!accessToken) return;

            try {
                const response = await axios.get('/api/v1/admin/staffs/roles/',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }); // Ваш API-endpoint
                setStaffRoles(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchStaffs();
    }, [accessToken]);

    useEffect(() => {
        if (isVisibleCreateEmployee === false) {
            fetchStaffs();
        }
    }, [isVisibleCreateEmployee])

    const DeleteEmployee = async () => {
        fetchStaffs()
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

                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Команда</span></div>
                        <div className={styles.main_panel}>
                            <AdminMenu selected={5} />
                            <div className={styles.general}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className={styles.title}>Команда</div>
                                    <div style={{ display: "flex", gap: "25px" }}>
                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <Input style={{ width: "271px", height: "29px" }} maxlenght={30} placeholder="Поиск" />
                                            <div style={{ position: "absolute", left: "260px", top: "32%" }}><SearchIcon /></div>
                                        </div>
                                        <div className={styles.button} onClick={() => { setVisibleCreateEmployee(!isVisibleCreateEmployee) }}>Добавить сотрудника</div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", maxWidth: "780px", justifyContent: "space-between", color: "rgba(255, 255, 255, 0.6)", marginTop: "50px", fontSize: "0.6rem" }}>
                                    <div style={{ display: "flex", gap: "100px" }}>
                                        <div>Фото</div>
                                        <div>Имя / Информация</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "100px" }}>
                                        <div>Действия</div>
                                        <div>Роль</div>
                                    </div>
                                </div>

                                <div className={styles.line} />

                                <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "150px", maxHeight: "1600px", overflowY: "auto" }}>
                                    {staffs.map((staff, index) => (
                                        <AdminTeamPanel staff={staff} key={index} employee={employee} roles={staffRoles} funcDelete={DeleteEmployee} />
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

                {isVisibleCreateEmployee ? <CreateEmployeeWindow roles={staffRoles} employee={employee}
                    changeVisibleCreateEmployee={() => { setVisibleCreateEmployee(false) }} /> : null}
            </div>

        )
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <BaseCenterContainer>
                    <Header is_admin />
                    <div className={styles.background} style={{ padding: "0px", paddingLeft: "25px", paddingRight: "25px", gap: "30px" }}>
                        <div className={styles.base_path}><Link style={{ color: "var(--color-gray-1100)", textDecoration: "none" }} to={"../"}>Главная</Link> / <Link to={"../admin/"} style={{ color: "var(--color-gray-1100)", textDecoration: "none" }}>Админка</Link> / <span style={{ color: " var(--color-white)" }}>Команда</span></div>
                        <div className={styles.general}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div className={styles.title}>Команда</div>
                                <div className={styles.button} style={{ width: "190px", textWrap: "nowrap" }} onClick={() => { setVisibleCreateEmployee(!isVisibleCreateEmployee) }}>Добавить сотрудника</div>
                            </div>

                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <Input style={{ width: "300px", height: "29px" }} maxlenght={30} placeholder="Поиск" />
                                <div style={{ position: "absolute", left: "290px", top: "32%" }}><SearchIcon /></div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "150px", maxHeight: "1600px", overflowY: "auto" }}>
                                {staffs.map((staff, index) => (
                                    <AdminTeamPanel staff={staff} key={index} employee={employee} roles={staffRoles} funcDelete={DeleteEmployee} />
                                ))}
                            </div>
                        </div>
                    </div>
                </BaseCenterContainer>
                <div style={{ marginTop: "auto" }}>
                    <Footer style={{ height: "150px", display: "flex", justifyContent: "center" }} />
                </div>

                {isVisibleCreateEmployee ? <CreateEmployeeWindow roles={staffRoles} employee={employee}
                    changeVisibleCreateEmployee={() => { setVisibleCreateEmployee(false) }} /> : null}
            </div>
        )
    }
}

export default AdminTeamPage