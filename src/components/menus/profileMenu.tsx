import { CSSProperties } from "react"
import styles from "../../styles/profileMenu.module.css"
import { Link } from "react-router-dom";
import { useUser } from "../../stores/userStore";

interface ProfileMenuProps {
    selected: number;
    style?: CSSProperties;
    is_mobile?: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ selected, style, is_mobile }) => {
    const { LogoutCTX } = useUser();

    const { employee } = useUser();

    return (
        <div className={styles.menu} style={style}>
            <Link to={"../profile/"} className={styles.panel} style={selected == 1 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/profile_panel/mdi_account-circle-outline.svg" className={styles.icon} />Аккаунт</Link>
            <Link to={"../profile/orders"} className={styles.panel} style={selected == 2 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/profile_panel/ic_sharp-history.svg" className={styles.icon} />Заказы</Link>
            <Link to={"../profile/subscriptions"} className={styles.panel} style={selected == 3 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/profile_panel/gamepad.svg" className={styles.icon} />Мои подписки</Link>
            <Link to={"../profile/offers"} className={styles.panel} style={selected == 4 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/profile_panel/octicon_gift-24.svg" className={styles.icon} />Предложения</Link>
            <Link to={"../profile/chats"} className={styles.panel} style={selected == 5 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/profile_panel/gear.svg" className={styles.icon} />Чаты</Link>
            <div className={styles.line}  style={{transform: "rotate(180deg)"}}/>
            {employee ? <Link to={"../admin/"} className={styles.panel}><img src="/icons/bases/admin_icon.svg" className={styles.icon} />Админка</Link>: null}
            <Link to={"../profile/supports"} className={styles.panel} style={selected == 6 ? { background: "var(--color-deeppink)" } : {}}><img src="/icons/profile_panel/bx_bx-support.svg" className={styles.icon} />Поддержка</Link>
            <Link to={"../"} className={styles.panel} onClick={LogoutCTX}
                style={selected == 7 ? { background: "var(--color-deeppink)" } : {}}>
                <img src="/icons/profile_panel/ic_round-exit-to-app.svg" className={styles.icon} />Выход</Link>
        </div>
    );
};

export default ProfileMenu;