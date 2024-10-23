import { FC } from "react";
import ChatInterface from "../../interfaces/chatInterface";
import { format, parseISO } from "date-fns";
import { BackgroundStatusKeys, StatusKeys } from "../../interfaces/orderPanel";

import styles from "../../styles/pages/chatPage.module.css"


interface Props {
    chat: ChatInterface;
    selectChat: ChatInterface | null | undefined;
    is_mobile?: boolean;
    is_admin?: boolean;
}


const ChatInfoPanel: FC<Props> = ({ chat, selectChat, is_mobile, is_admin }) => {

    if (!is_mobile) {
        return (
            <div className={chat.id === selectChat?.id ? styles.selectedPanel : styles.panel}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", width: "100%", position: "relative", marginTop: "0px", top: "-5px", left: "5px" }}>
                        <div style={{ color: "rgba(255, 255, 255, 0.7)" }}>{chat.last_message_data.length ? format(parseISO(chat.last_message_data ?? ""), "HH:mm") : ""} {chat.last_message_data.length ? format(parseISO(chat.last_message_data ?? ""), 'dd.MM.yy') : ""}</div>
                        <div style={{ width: "125px", textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>
                            {chat.order ? `Заказ № ${chat.order.id}` : `Вопрос № ${chat.ticket.id}`}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                            <div style={{ position: "relative" }}>
                                <img src={chat?.order?.product?.general_image ? chat.order.product.general_image.replace('http', 'https') : chat?.ticket ? "/icons/bases/question.svg" : "https://placehold.co/80x80"} width={40} height={40}
                                    style={{ borderRadius: "50%", border: chat.counter_no_read_message_staff ? "4px solid #FF007A" : "none" }} />
                                {chat.counter_no_read_message_staff > 0 && <div style={{
                                    position: "absolute", left: "70%", top: "0%",
                                    background: "#FF007A", height: "13px", borderRadius: "50%", fontSize: "9px", textAlign: "center", padding: "1px", minWidth: "13px"
                                }}>{chat.counter_no_read_message_staff}</div>}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                                <div style={{ textDecoration: "underline" }}>
                                            {chat?.order?.product && ((chat?.order?.product?.product_type === "PRODUCT" ? "Игра " : chat?.order?.product?.product_type === "SUBSCRIPTION" ? "Подписка " : "") + chat?.order?.product?.title?.slice(0, 14) ?? "") + ((chat?.order?.product?.title?.length ?? 0) > 14 ? "..." : "")}
                                            {chat?.order?.wallet && "Пополнение кошелька"}
                                            {chat?.ticket && (chat?.ticket?.title?.slice(0, 20)) + ((chat?.ticket?.title?.length ?? 0) > 15 ? "..." : "")}
                                            {chat?.order && chat?.order?.product?.product_type ? "," : ""}
                                        </div>
                                        <div style={{ color: chat?.order?.product?.product_type === "PRODUCT" ? "#FF007A" : "white", textDecoration: "underline", minHeight: "16px" }}>
                                            {chat?.order && chat.order?.product?.product_type === "PRODUCT" ? chat?.order?.is_deluxe ? "Deluxe Edition" : "Standart Edition" : null}
                                            {chat?.order && chat.order?.product?.product_type === "SUBSCRIPTION" ? chat?.order?.product?.subscription_duration_mouth + " мес" : null}
                                            {chat?.order?.wallet && `на ${chat?.order?.wallet?.number} ${chat?.order?.wallet?.select_country?.tag}`}
                                        </div>
                                </div>
                            </div>
                        </div>
                        {chat?.order ?
                            <div className={styles.status} style={{ backgroundColor: BackgroundStatusKeys[chat.order.status as keyof typeof BackgroundStatusKeys] }}>{StatusKeys[chat.order.status as keyof typeof StatusKeys]}</div>
                            : null}
                        {chat.ticket ?
                            <div className={styles.status} style={{ border: "3px solid #D4D4D4" }}>ВОПРОС</div> : null}
                    </div>
                    <div style={{ color: "#d4d4d4", minHeight: "15px" }}>
                        {chat?.order?.chat.last_message.slice(0, 50)}{chat?.order?.chat.last_message.length > 50 && "..."}
                        {chat?.ticket?.chat?.last_message?.slice(0, 50)}{(chat?.ticket?.chat?.last_message?.length ?? 0) > 50 && "..."}
                    </div>
                </div>
            </div>
        )
    } else {
        if (!is_admin) {
            return (
                <div className={chat.id === selectChat?.id ? styles.selectedPanel : styles.panel} style={{ width: "284px", backgroundSize: "contain" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", width: "100%", position: "relative", marginTop: "0px", top: "-5px", left: "-2px" }}>
                            <div style={{ color: "rgba(255, 255, 255, 0.7)" }}>{chat.last_message_data.length ? format(parseISO(chat.last_message_data ?? ""), "HH:mm") : ""} {chat.last_message_data.length ? format(parseISO(chat.last_message_data ?? ""), 'dd.MM.yy') : ""}</div>
                            <div style={{ width: "125px", textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>
                                {chat.order ? `Заказ № ${chat.order.id}` : `Вопрос № ${chat.ticket.id}`}</div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                                <div style={{ position: "relative" }}>
                                    <img src={chat?.order?.product?.general_image ? chat.order.product.general_image.replace("http", "https") : chat?.ticket ? "/icons/bases/question.svg" : "https://placehold.co/80x80"} width={40} height={40}
                                        style={{ borderRadius: "50%", border: chat.counter_no_read_message_staff ? "4px solid #FF007A" : "none" }} />
                                    {chat.counter_no_read_message_staff > 0 && <div style={{
                                        position: "absolute", left: "70%", top: "0%",
                                        background: "#FF007A", height: "13px", borderRadius: "50%", fontSize: "9px", textAlign: "center", padding: "1px", minWidth: "13px"
                                    }}>{chat.counter_no_read_message_staff}</div>}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                                        <div style={{ textDecoration: "underline" }}>
                                            {chat?.order?.product && ((chat?.order?.product?.product_type === "PRODUCT" ? "Игра " : chat?.order?.product?.product_type === "SUBSCRIPTION" ? "Подписка " : "") + chat?.order?.product?.title?.slice(0, 14) ?? "") + ((chat?.order?.product?.title?.length ?? 0) > 14 ? "..." : "")}
                                            {chat?.order?.wallet && "Пополнение кошелька"}
                                            {chat?.ticket && (chat?.ticket?.title?.slice(0, 20)) + ((chat?.ticket?.title?.length ?? 0) > 15 ? "..." : "")}
                                            {chat?.order && chat?.order?.product?.product_type ? "," : ""}
                                        </div>
                                        <div style={{ color: chat?.order?.product?.product_type === "PRODUCT" ? "#FF007A" : "white", textDecoration: "underline", minHeight: "16px" }}>
                                            {chat?.order && chat.order?.product?.product_type === "PRODUCT" ? chat?.order?.is_deluxe ? "Deluxe Edition" : "Standart Edition" : null}
                                            {chat?.order && chat.order?.product?.product_type === "SUBSCRIPTION" ? chat?.order?.product?.subscription_duration_mouth + " мес" : null}
                                            {chat?.order?.wallet && `на ${chat?.order?.wallet?.number} ${chat?.order?.wallet?.select_country?.tag}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {chat?.order ?
                                <div className={styles.status} style={{ backgroundColor: BackgroundStatusKeys[chat.order.status as keyof typeof BackgroundStatusKeys] }}>{StatusKeys[chat.order.status as keyof typeof StatusKeys]}</div>
                                : null}
                            {chat.ticket ?
                                <div className={styles.status} style={{ border: "3px solid #D4D4D4" }}>ВОПРОС</div> : null}
                        </div>
                        <div style={{ color: "#d4d4d4", minHeight: "15px" }}>
                            {chat?.order?.chat.last_message.slice(0, 50)}{chat?.order?.chat.last_message.length > 50 && "..."}
                            {chat?.ticket?.chat?.last_message?.slice(0, 50)}{(chat?.ticket?.chat?.last_message?.length ?? 0) > 50 && "..."}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={chat.id === selectChat?.id ? styles.selectedPanel : styles.panel} style={{ width: "284px", backgroundSize: "contain" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%", marginTop: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", width: "100%", position: "relative", marginTop: "0px", top: "-5px", left: "-2px" }}>
                            <div style={{ color: "rgba(255, 255, 255, 0.7)" }}>{chat.last_message_data.length ? format(parseISO(chat.last_message_data ?? ""), "HH:mm") : ""} {chat.last_message_data.length ? format(parseISO(chat.last_message_data ?? ""), 'dd.MM.yy') : ""}</div>
                            <div style={{ width: "125px", textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}>
                                {chat.order ? `Заказ № ${chat.order.id}` : `Вопрос № ${chat.ticket.id}`}</div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                                <div style={{ position: "relative" }}>
                                    <img src={chat?.order?.user?.profile.image ? chat.order.user.profile.image.replace("http", "https") : "https://placehold.co/80x80"} width={40} height={40}
                                        style={{ borderRadius: "50%", border: chat.counter_no_read_message_staff ? "4px solid #FF007A" : "none" }} />
                                    {chat.counter_no_read_message_staff > 0 && <div style={{
                                        position: "absolute", left: "70%", top: "0%",
                                        background: "#FF007A", height: "13px", borderRadius: "50%", fontSize: "9px", textAlign: "center", padding: "1px", minWidth: "13px"
                                    }}>{chat.counter_no_read_message_staff}</div>}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <div>{chat?.order?.user?.username || chat?.ticket.author?.username}</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                                        <div style={{ textDecoration: "underline" }}>
                                            {chat?.order?.product && ((chat?.order?.product?.product_type === "PRODUCT"  ? "Игра " : chat?.order?.product?.product_type === "SUBSCRIPTION" ? "Подписка " : "") + chat?.order?.product?.title?.slice(0, 14) ?? "") + ((chat?.order?.product?.title?.length ?? 0) > 14 ? "..." : "")}
                                            {chat?.order?.wallet && "Пополнение кошелька"}
                                            {chat?.ticket && (chat?.ticket?.title?.slice(0, 20)) + ((chat?.ticket?.title?.length ?? 0) > 15 ? "..." : "")}
                                            {chat?.order && chat?.order?.product?.product_type ? "," : ""}
                                        </div>
                                        <div style={{ color: chat?.order?.product?.product_type === "PRODUCT" ? "#FF007A" : "white", textDecoration: "underline", minHeight: "16px" }}>
                                            {chat?.order && chat.order?.product?.product_type === "PRODUCT" ? chat?.order?.is_deluxe ? "Deluxe Edition" : "Standart Edition" : null}
                                            {chat?.order && chat.order?.product?.product_type === "SUBSCRIPTION" ? chat?.order?.product?.subscription_duration_mouth + " мес" : null}
                                            {chat?.order?.wallet && `на ${chat?.order?.wallet?.number} ${chat?.order?.wallet?.select_country?.tag}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {chat?.order ?
                                <div className={styles.status} style={{ backgroundColor: BackgroundStatusKeys[chat.order.status as keyof typeof BackgroundStatusKeys] }}>{StatusKeys[chat.order.status as keyof typeof StatusKeys]}</div>
                                : null}
                            {chat.ticket ?
                                <div className={styles.status} style={{ border: "3px solid #D4D4D4" }}>ВОПРОС</div> : null}
                        </div>
                        <div style={{ color: "#d4d4d4", minHeight: "15px" }}>
                            {chat?.order?.chat.last_message.slice(0, 50)}{chat?.order?.chat.last_message.length > 50 && "..."}
                            {chat?.ticket?.chat?.last_message?.slice(0, 50)}{(chat?.ticket?.chat?.last_message?.length ?? 0) > 50 && "..."}
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default ChatInfoPanel;