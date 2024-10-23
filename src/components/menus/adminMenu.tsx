import { CSSProperties } from "react"
import styles from "../../styles/profileMenu.module.css"
import { Link } from "react-router-dom";
import { useUser } from "../../stores/userStore";

interface ProfileMenuProps {
    selected: number;
    style?: CSSProperties;
}

const AdminMenu: React.FC<ProfileMenuProps> = ({ selected, style }) => {

    const { LogoutCTX } = useUser();

    return (
        <div className={styles.menu} style={style}>
            <Link to={"../admin/products"} className={styles.panel} style={selected == 1 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/admin_panel/list.svg" className={styles.icon} />Товары</Link>
            <Link to={"../admin/orders"} className={styles.panel} style={selected == 2 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/admin_panel/ic_sharp-history.svg" className={styles.icon} />Заказы</Link>
            <Link to={"../admin/chats"} className={styles.panel} style={selected == 3 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/admin_panel/dialog.svg" className={styles.icon} />Чаты</Link>
            <Link to={"../admin/stats"} className={styles.panel} style={selected == 4 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/admin_panel/bar chart.svg" className={styles.icon} />Статистика</Link>
            <Link to={"../admin/team"} className={styles.panel} style={selected == 5 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/admin_panel/smile.svg" className={styles.icon} />Команда</Link>
            <Link to={"../admin/clients"} className={styles.panel} style={selected == 6 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/admin_panel/users.svg" className={styles.icon} />Клиенты</Link>
            <Link to={"../admin/feedbacks"} className={styles.panel} style={selected == 7 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/admin_panel/thumbs up.svg" className={styles.icon} />Отзывы</Link>
            <Link to={"../admin/offers"} className={styles.panel} style={selected == 9 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/profile_panel/octicon_gift-24.svg" className={styles.icon} />Предложения</Link>
            <Link to={"../admin/wallet"} className={styles.panel} style={selected == 10 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/profile_panel/octicon_gift-24.svg" className={styles.icon} />Кошелек</Link>
            <div className={styles.line} />
            <Link to={"../"} className={styles.panel} onClick={LogoutCTX}
                style={selected == 8 ? { background: "var(--color-deeppink)" } : {}}>
                <img src="/icons/profile_panel/ic_round-exit-to-app.svg" className={styles.icon} />Выход</Link>
        </div>
    );
};

export default AdminMenu;