import { FC, useEffect, useState } from "react";
import styles from "../../styles/topWindows/createEmployee.module.css"
import ReactSelect from "react-select";
import axios from "axios";
import { useAuth } from "../../stores/JWTTokenStore";
import UserInterface from "../../interfaces/userInterface";
import EmployeeInterface, { EmployeeRoleInterface } from "../../interfaces/employeeInterface";
import Checkbox from "../inputs/checkbox";
import useWindowSize from "../state/useWindowSize";

interface ChildProps {
    changeVisibleCreateEmployee: () => void;
    roles: EmployeeRoleInterface[];
    employee: EmployeeInterface | null;

}

interface ReactSelectEmail {
    value: number;
    label: string;
}


const CreateEmployeeWindow: FC<ChildProps> = ({ changeVisibleCreateEmployee, roles, employee }) => {
    const { accessToken } = useAuth();
    const [reactSelectEmail, setreactSelectEmail] = useState<ReactSelectEmail[]>([])

    const [error, setError] = useState('');

    const [isSave, setIsSave] = useState(false);

    const [newEmployee, setNewEmployee] = useState<EmployeeInterface>({
        id: 0,
        permissions: [],
        role: 999,
        about_me: "",
        telegram: "",
        user: {
            pk: 0,
            email: "",
            username: "",

            phone_number: "",
            nickname: "",

            profile: {
                date_of_birth: "",
                console_generation: "",

                two_factor_authentication: false,

                receive_notifications_on_email: false,
                receive_notifications_on_telegram: false,

                receive_notifications_on_new_message: false,
                receive_notifications_on_change_status_order: false,


            }
        },
    })

    useEffect(() => {
        const fetchStaffs = async () => {
            if (!accessToken) return;

            try {
                const response = await axios.get('/api/v1/admin/users/',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }); // Ваш API-endpoint


                const emailOptions: ReactSelectEmail[] = response.data.map((user: UserInterface) => ({
                    value: user.pk,
                    label: user.email
                }));

                setreactSelectEmail(emailOptions);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchStaffs();
        setIsSave(false)
    }, [accessToken]);

    const handleClick = (event: any) => {
        // Проверяем, является ли целевой элемент (event.target)
        //  элементом, который вызвал событие (event.currentTarget)
        if (event.target === event.currentTarget) {
            changeVisibleCreateEmployee()
        }
    };

    const handleCheckboxChange = (permission: string) => {
        setIsSave(false)
        if (newEmployee.permissions.includes(permission)) {
            setNewEmployee({ ...newEmployee, permissions: newEmployee.permissions.filter((item) => item !== permission) });
        } else {
            setNewEmployee({ ...newEmployee, permissions: [...newEmployee.permissions, permission] });
        }
    };

    useEffect(() => {
        const update = async () => {
            if (isSave) {
                delete newEmployee.user.profile.image

                if (newEmployee.role === 999) return

                try {
                    const response = await axios.put('/api/v1/admin/staffs/', newEmployee,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }); // Ваш API-endpoint

                    if (response.status === 201) {
                        changeVisibleCreateEmployee();
                    }
                } catch (error: any) {
                    setError(JSON.stringify(error.response.data))
                    setIsSave(false)
                    return
                }
            }
        }
        update()
    }, [newEmployee])

    const HandleSave = async () => {
        setIsSave(true)
        try {
            const response = await axios.get('/api/v1/admin/users/' + newEmployee.user.pk + "/",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint


            await Promise.resolve(setNewEmployee({ ...newEmployee, user: response.data }));
        } catch (error: any) {
            setError(JSON.stringify(error.response.data))
            setIsSave(false)
            return
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
            <div className={styles.background} onClick={handleClick}>
                <div className={styles.window}>
                    <img src="/icons/bases/close.svg" width={"19px"} style={{ alignSelf: "flex-end" }} onClick={() => { changeVisibleCreateEmployee() }} />
                    <div style={{ fontSize: "1.2rem", margin: "0 auto" }}>Создание пользователя</div>

                    <div style={{ width: "100%", display: "flex", gap: "25px" }}>
                        <div style={{ position: "relative", display: "flex" }}>
                            <div style={{ position: "absolute", top: "-8px", left: "15px" }}>Email</div>
                            <ReactSelect
                                className={styles.select}
                                unstyled
                                options={reactSelectEmail}
                                classNamePrefix="select"
                                onChange={(value: any) => { setIsSave(false); setNewEmployee({ ...newEmployee, user: { ...newEmployee.user, pk: value.value } }) }} />
                        </div>
                        <div style={{ position: "relative", display: "flex" }}>
                            <div style={{ position: "absolute", top: "-8px", left: "15px" }}>Роль</div>
                            <ReactSelect className={styles.select}
                                unstyled classNamePrefix="select"
                                options={roles.filter((role) => role.value > (employee?.role || 0))}
                                isSearchable={false}
                                onChange={(value: any) => { setIsSave(false); setNewEmployee({ ...newEmployee, role: value.value }) }} />
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                        <div>Выберите доступные сотруднику права:</div>

                        <div style={{ display: "flex", gap: "25px" }}>
                            <div style={{ width: "69px" }}>Команда:</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <Checkbox label={"Добавление новых сотрудников"} checked={newEmployee?.permissions.includes("create_employee")}
                                    disabled={!employee?.permissions.includes("create_employee")}
                                    onChange={() => { handleCheckboxChange("create_employee") }} />

                                <Checkbox label={"Выдача прав сотрудникам"} checked={newEmployee?.permissions.includes("add_permissions_for_employee")}
                                    disabled={!employee?.permissions.includes("add_permissions_for_employee")}
                                    onChange={() => { handleCheckboxChange("add_permissions_for_employee") }} />

                                <Checkbox label={"Право на просмотр статистики"} checked={newEmployee?.permissions.includes("view_stats")}
                                    disabled={!employee?.permissions.includes("view_stats")}
                                    onChange={() => { handleCheckboxChange("view_stats") }} />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "25px" }}>
                            <div style={{ width: "69px" }}>Товары:</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <Checkbox label={"Добавление новых товаров"} checked={newEmployee?.permissions.includes("add_products")}
                                    disabled={!employee?.permissions.includes("add_products")}
                                    onChange={() => { handleCheckboxChange("add_products") }} />

                                <Checkbox label={"Редактирование стоимости"} checked={newEmployee?.permissions.includes("edit_prices")}
                                    disabled={!employee?.permissions.includes("edit_prices")}
                                    onChange={() => { handleCheckboxChange("edit_prices") }} />

                                <Checkbox label={"Удаление товаров"} checked={newEmployee?.permissions.includes("delete_products")}
                                    disabled={!employee?.permissions.includes("delete_products")}
                                    onChange={() => { handleCheckboxChange("delete_products") }} />

                                <Checkbox label={"Скрытие товаров"} checked={newEmployee?.permissions.includes("hide_products")}
                                    disabled={!employee?.permissions.includes("hide_products")}
                                    onChange={() => { handleCheckboxChange("hide_products") }} />

                                <Checkbox label={"Редактирование информации товара"} checked={newEmployee?.permissions.includes("edit_product_info")}
                                    disabled={!employee?.permissions.includes("edit_product_info")}
                                    onChange={() => { handleCheckboxChange("edit_product_info") }} />

                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "25px" }}>
                            <div style={{ width: "69px" }}>Клиенты::</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <Checkbox label={"Блокировка и удаление пользователей"} checked={newEmployee?.permissions.includes("delete_and_block_users")}
                                    disabled={!employee?.permissions.includes("delete_and_block_users")}
                                    onChange={() => { handleCheckboxChange("delete_and_block_users") }} />

                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "25px" }}>
                            <div style={{ width: "69px" }}>Промо:</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <Checkbox label={"Создание промокодов"} checked={newEmployee?.permissions.includes("create_promocodes")}
                                    disabled={!employee?.permissions.includes("create_promocodes")}
                                    onChange={() => { handleCheckboxChange("create_promocodes") }} />
                                <Checkbox label={"Создание скидок и акций"} checked={newEmployee?.permissions.includes("create_discounts")}
                                    disabled={!employee?.permissions.includes("create_discounts")}
                                    onChange={() => { handleCheckboxChange("create_discounts") }} />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "25px" }}>
                            <div style={{ width: "69px" }}>Чаты:</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <Checkbox label={"Создание чатов с командой"} checked={newEmployee?.permissions.includes("create_chats")}
                                    disabled={!employee?.permissions.includes("create_chats")}
                                    onChange={() => { handleCheckboxChange("create_chats") }} />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "25px" }}>
                            <div style={{ width: "69px" }}>Форум:</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <Checkbox label={"Управление форумом"} checked={newEmployee?.permissions.includes("manage_forum")}
                                    disabled={!employee?.permissions.includes("manage_forum")}
                                    onChange={() => { handleCheckboxChange("manage_forum") }} />

                            </div>
                        </div>

                    </div>
                    <div style={{ alignSelf: "flex-end" }}>{error}</div>
                    <div className={styles.button} style={{ alignSelf: "flex-end" }} onClick={HandleSave}>Сохранить</div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.background} onClick={handleClick}>
                <div className={styles.window} style={{ height: "630px", overflowY: "auto" }}>
                    <img src="/icons/bases/close.svg" width={"19px"} style={{ alignSelf: "flex-end" }} onClick={() => { changeVisibleCreateEmployee() }} />
                    <div style={{ fontSize: "1.2rem", margin: "0 auto" }}>Создание пользователя</div>

                    <div style={{ width: "100%", display: "flex", gap: "25px", flexDirection: "column" }}>
                        <div style={{ position: "relative", display: "flex" }}>
                            <div style={{ position: "absolute", top: "-8px", left: "15px" }}>Email</div>
                            <ReactSelect
                                className={styles.select}
                                unstyled
                                options={reactSelectEmail}
                                classNamePrefix="select"
                                onChange={(value: any) => { setIsSave(false); setNewEmployee({ ...newEmployee, user: { ...newEmployee.user, pk: value.value } }) }} />
                        </div>
                        <div style={{ position: "relative", display: "flex" }}>
                            <div style={{ position: "absolute", top: "-8px", left: "15px" }}>Роль</div>
                            <ReactSelect className={styles.select}
                                unstyled classNamePrefix="select"
                                options={roles.filter((role) => role.value > (employee?.role || 0))}
                                isSearchable={false}
                                onChange={(value: any) => { setIsSave(false); setNewEmployee({ ...newEmployee, role: value.value }) }} />
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                        <div>Выберите доступные сотруднику права:</div>


                        <div style={{ width: "69px" }}>Команда:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Добавление новых сотрудников"} checked={newEmployee?.permissions.includes("create_employee")}
                                disabled={!employee?.permissions.includes("create_employee")}
                                onChange={() => { handleCheckboxChange("create_employee") }} />

                            <Checkbox label={"Выдача прав сотрудникам"} checked={newEmployee?.permissions.includes("add_permissions_for_employee")}
                                disabled={!employee?.permissions.includes("add_permissions_for_employee")}
                                onChange={() => { handleCheckboxChange("add_permissions_for_employee") }} />

                            <Checkbox label={"Право на просмотр статистики"} checked={newEmployee?.permissions.includes("view_stats")}
                                disabled={!employee?.permissions.includes("view_stats")}
                                onChange={() => { handleCheckboxChange("view_stats") }} />
                        </div>


                        <div style={{ width: "69px" }}>Товары:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Добавление новых товаров"} checked={newEmployee?.permissions.includes("add_products")}
                                disabled={!employee?.permissions.includes("add_products")}
                                onChange={() => { handleCheckboxChange("add_products") }} />

                            <Checkbox label={"Редактирование стоимости"} checked={newEmployee?.permissions.includes("edit_prices")}
                                disabled={!employee?.permissions.includes("edit_prices")}
                                onChange={() => { handleCheckboxChange("edit_prices") }} />

                            <Checkbox label={"Удаление товаров"} checked={newEmployee?.permissions.includes("delete_products")}
                                disabled={!employee?.permissions.includes("delete_products")}
                                onChange={() => { handleCheckboxChange("delete_products") }} />

                            <Checkbox label={"Скрытие товаров"} checked={newEmployee?.permissions.includes("hide_products")}
                                disabled={!employee?.permissions.includes("hide_products")}
                                onChange={() => { handleCheckboxChange("hide_products") }} />

                            <Checkbox label={"Редактирование информации товара"} checked={newEmployee?.permissions.includes("edit_product_info")}
                                disabled={!employee?.permissions.includes("edit_product_info")}
                                onChange={() => { handleCheckboxChange("edit_product_info") }} />

                        </div>

                        <div style={{ width: "69px" }}>Клиенты::</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Блокировка и удаление пользователей"} checked={newEmployee?.permissions.includes("delete_and_block_users")}
                                disabled={!employee?.permissions.includes("delete_and_block_users")}
                                onChange={() => { handleCheckboxChange("delete_and_block_users") }} />

                        </div>


                        <div style={{ width: "69px" }}>Промо:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Создание промокодов"} checked={newEmployee?.permissions.includes("create_promocodes")}
                                disabled={!employee?.permissions.includes("create_promocodes")}
                                onChange={() => { handleCheckboxChange("create_promocodes") }} />
                            <Checkbox label={"Создание скидок и акций"} checked={newEmployee?.permissions.includes("create_discounts")}
                                disabled={!employee?.permissions.includes("create_discounts")}
                                onChange={() => { handleCheckboxChange("create_discounts") }} />
                        </div>

                        <div style={{ width: "69px" }}>Чаты:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Создание чатов с командой"} checked={newEmployee?.permissions.includes("create_chats")}
                                disabled={!employee?.permissions.includes("create_chats")}
                                onChange={() => { handleCheckboxChange("create_chats") }} />
                        </div>

                        <div style={{ width: "69px" }}>Форум:</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <Checkbox label={"Управление форумом"} checked={newEmployee?.permissions.includes("manage_forum")}
                                disabled={!employee?.permissions.includes("manage_forum")}
                                onChange={() => { handleCheckboxChange("manage_forum") }} />

                        </div>
                    </div>

                    <div style={{ alignSelf: "flex-end" }}>{error}</div>
                    <div className={styles.button} style={{ alignSelf: "center" }} onClick={HandleSave}>Сохранить</div>

                </div>
            </div>
        )
    }
}

export default CreateEmployeeWindow;