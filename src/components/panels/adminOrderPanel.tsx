import { FunctionComponent, useEffect, useId, useState } from "react"
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
import { BackgroundStatusKeys, OrderPanelProp, StatusKeys } from "../../interfaces/orderPanel";
import { BackgroundStatusKeys as SubscriptionBackgroundStatusKeys, StatusKeys as SubscriptionStatusKeys } from "../../interfaces/subscriptionData";
import ReactSelect from "react-select";
import { Link } from "react-router-dom";
import useWindowSize from "../state/useWindowSize";


interface adminTeamPanelProps {
    order: OrderPanelProp;
    employee: EmployeeInterface | null;
    funcDelete?: () => void;
}

interface listStatusInterface {
    value: string;
    label: string
}

const AdminOrderPanel: FunctionComponent<adminTeamPanelProps> = ({ order, funcDelete }) => {
    const { accessToken } = useAuth();
    const [orderPanel, setOrderPanel] = useState<OrderPanelProp>(order);

    const [_error, setError] = useState<string>("");

    const formattedDate = format(parseISO(orderPanel.created_on), 'dd.MM.yy'); // Format date
    const formattedTime = format(parseISO(orderPanel.created_on), 'HH:mm');

    const ListStatus: listStatusInterface[] = [{ value: "WAITING", label: "Ожидание" }, { value: "COMPLETED", label: "Выполнен" }, { value: "CANCELED", label: "Отменено" }]

    const ListSubscriptionStatus: listStatusInterface[] = [{ value: "EXPIRES", label: "Истекает" }, { value: "ACTIVE", label: "Активна" }, { value: "COMPLETED", label: "Закончилась" }]

    useEffect(() => {
        setOrderPanel(order);
    }, [order])


    const ChangeStatus = async () => {
        try {
            const response = await axios.put("/api/v1/admin/orders/" + orderPanel.id + "/", orderPanel,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }); // Ваш API-endpoint
            order.status = response.data.status
            order.subscription_status = response.data.subscription_status
            setOrderPanel(response.data);
        } catch (error) {
            setOrderPanel(order)

            console.error('Ошибка при получении данных:', error);
        }
    }

    useEffect(() => {
        if (order.status !== orderPanel.status) {
            ChangeStatus()
        }
        if (order.subscription_status !== orderPanel.subscription_status) {
            ChangeStatus()
        }
    }, [orderPanel])

    const CustomStyle = {

        valueContainer: (base: any, state: any) => ({
            ...base,
            color: BackgroundStatusKeys[orderPanel.status as keyof typeof BackgroundStatusKeys]
        })
    }

    const CustomSubscriptionStyle = {
        valueContainer: (base: any, state: any) => ({
            ...base,
            color: SubscriptionBackgroundStatusKeys[orderPanel.subscription_status as keyof typeof SubscriptionBackgroundStatusKeys]
        })
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
            <div className={styles.container} style={{ minHeight: "90px" }}>

                <div style={{ display: "flex", justifyContent: "space-between", gap: "25px" }}>
                    <div style={{ display: 'flex', gap: '60px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div style={{ color: "white" }}>Заказ №{orderPanel?.id}</div>
                            <div style={{ color: "white" }}>от {formattedDate} <span style={{ color: "#C2C2C2", textDecoration: 'none' }}>{formattedTime}</span></div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", width: "135px", gap: "10px" }}>
                            {orderPanel?.product ? <Link to={"../product/" + orderPanel?.product?.id} style={{ color: "white", textWrap: "wrap" }}>{orderPanel?.product?.product_type === "PRODUCT" ? "Игра" : "Подписка"} {orderPanel?.product?.title}</Link>

                                : <div style={{ color: "white", textWrap: "wrap" }}>Пополнение кошелька на {orderPanel?.wallet?.number} {orderPanel?.wallet?.select_country.tag}</div>}
                            {orderPanel?.product?.product_type === "PRODUCT" && <div style={{ textWrap: "nowrap", color: orderPanel.is_deluxe ? "#FF007A" : "rgba(255, 255, 255, 0.6)" }}>
                                {orderPanel.is_deluxe ? "Deluxe Edition" : "Standart Edition"}, <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>{orderPanel?.platform?.title}</span></div>}
                            <div style={{ color: "#FF007A" }}>{orderPanel.cost} ₽{" "}
                                {order.max_cost && (parseFloat(order.cost) !== order.max_cost ? <span style={{ color: "#c2c2c2", textDecoration: "line-through" }}>{order.max_cost} ₽</span> : null)}</div>
                            {order?.promocode && <div style={{ color: "white", fontSize: "12px" }}>(промокод {order.promocode.title})</div>}
                        </div>
                        <div style={{ color: "white", }}>{orderPanel.user.username}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '25px' }}>
                        <Link className={styles.button} style={{ width: "139px", alignSelf: "flex-start", fontFamily: "Unbounded_Medium", fontSize: "10px" }} to={"../admin/chat/?chat=" + orderPanel.chat.id}>ЧАТ С КЛИЕНТОМ</Link>

                        <ReactSelect
                            className={styles.new_select}
                            unstyled
                            classNamePrefix="my_select"
                            isSearchable={false}
                            options={ListStatus}
                            value={{ value: orderPanel.status, label: ListStatus.find(item => item.value === orderPanel.status)?.label }}
                            defaultValue={{ value: orderPanel.status, label: ListStatus.find(item => item.value === orderPanel.status)?.label }}
                            instanceId={useId()}
                            onChange={(value: any) => { setOrderPanel({ ...orderPanel, status: value.value }); }}
                            styles={CustomStyle}
                        />

                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.container}>
                <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
                    {orderPanel?.product ? <div style={{ color: "white", display: "flex", gap: "10px" }}><span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Название: </span>{order.product?.product_type == "PRODUCT" ? "Игра" : "Подписка"} {order?.product?.title}
                        {" "} {orderPanel.product.product_type === "SUBSCRIPTION" && `${orderPanel.product.subscription_duration_mouth} мес`}</div>
                    : <div style={{ color: "white", textWrap: "wrap" }}>Пополнение кошелька на {orderPanel?.wallet?.number} {orderPanel?.wallet?.select_country.tag}</div>}
                    <div style={{ color: "rgba(255, 255, 255, 0.6)", display: 'flex', gap: "10px" }}>№ заказа:{" "}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div style={{ color: "white" }}>Заказ №{orderPanel?.id}</div>
                            <div style={{ color: "white" }}>от {formattedDate} <span style={{ color: "#C2C2C2", textDecoration: 'none' }}>{formattedTime}</span></div>
                        </div>
                    </div>

                    <div style={{ color: "white", display: "flex", gap: "10px" }}><span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Имя клиента: </span>{order.user.username}</div>

                    <div style={{ color: "rgba(255, 255, 255, 0.6)", display: 'flex', gap: "10px" }}>Цена: <div style={{ color: "#FF007A" }}>{orderPanel.cost} ₽{" "}
                        {order.max_cost && (parseFloat(order.cost) !== order.max_cost ? <span style={{ color: "#c2c2c2", textDecoration: "line-through" }}>{order.max_cost} ₽</span> : null)}</div>
                        {order?.promocode && <div style={{ color: "white", fontSize: "12px" }}>(промокод {order.promocode.title})</div>}
                    </div>

                    <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Статус: </div>

                    <ReactSelect
                        className={styles.new_select}
                        unstyled
                        classNamePrefix="my_select"
                        isSearchable={false}
                        options={ListStatus}
                        value={{ value: orderPanel.status, label: ListStatus.find(item => item.value === orderPanel.status)?.label }}
                        defaultValue={{ value: orderPanel.status, label: ListStatus.find(item => item.value === orderPanel.status)?.label }}
                        instanceId={useId()}
                        onChange={(value: any) => { setOrderPanel({ ...orderPanel, status: value.value }); }}
                        styles={CustomStyle}
                    />

                    <Link className={styles.button} style={{ width: "260px", alignSelf: "flex-start", fontFamily: "Unbounded_Medium", fontSize: "10px" }} to={"../admin/chat/?chat=" + orderPanel.chat.id}>ЧАТ С КЛИЕНТОМ</Link>
                </div>
            </div>
        )
    }
};

export default AdminOrderPanel