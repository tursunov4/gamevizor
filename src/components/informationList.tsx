import { FC, useState } from "react"
import styles from "../styles/informationList.module.css"


interface SubChildProps {
    title: string;
    text: string;
}

interface ChildProps {
    data: SubChildProps[];
    is_mobile?: boolean;
}


const InformationList: FC<ChildProps> = ({ data, is_mobile }) => {
    const [showDescriptions, setShowDescriptions] = useState<Record<string, boolean>>({});

    const toggleShowDescription = (item: SubChildProps) => {
        setShowDescriptions((prev) => {
            const newShowDescriptions = { ...prev };
            newShowDescriptions[item.title] = !prev[item.title];
            return newShowDescriptions;
        });
    };

    if (!is_mobile) {
        return (
            <div style={{ width: "100%" }}>
                <ul className={styles.ul}>
                    {data.map((item) => (
                        <li key={item.title}>
                            <h2 onClick={() => toggleShowDescription(item)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "Unbounded_Bold" }}>{item.title} <img
                                src={showDescriptions[item.title] ? "/icons/info_panel/info_open.svg" : "/icons/info_panel/info_close.svg"} /></h2>
                            {showDescriptions[item.title] && <pre className={styles.text} style={{ fontFamily: "Unbounded_Medium", fontSize: "13px", textWrap: "wrap" }}>{item.text}</pre>}
                        </li>
                    ))}
                </ul>
            </div>
        );
    } else {
        return (
            <div style={{ width: "100%", minHeight: "190px" }}>
                <ul className={styles.ul} style={{padding: "0"}}>
                    {data.map((item) => (
                        <li key={item.title}>
                            <h2 onClick={() => toggleShowDescription(item)} style={{ display: "flex", fontSize: "17px", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "Unbounded_Bold" }}>{item.title} <img
                                src={showDescriptions[item.title] ? "/icons/info_panel/info_open.svg" : "/icons/info_panel/info_close.svg"} /></h2>
                            {showDescriptions[item.title] && <pre className={styles.text} style={{ fontFamily: "Unbounded_Medium", fontSize: "11px", textWrap: "wrap" }}>{item.text}</pre>}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
};

export default InformationList