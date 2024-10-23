import { CSSProperties } from 'react';
import styles from "../../styles/inputs/MyPhoneInput.module.css"
import PhoneInput from 'react-phone-input-2';
import ru from 'react-phone-input-2/lang/es.json'

interface InputProps {
    label?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    value?: any;
    style?: CSSProperties;
    disabled?: boolean
}

const MyPhoneInput: React.FC<InputProps> = ({
    label,
    placeholder,
    onChange,
    value,
    style,
    disabled = true,
}) => {

    const handleChange = (event: any) => {
        if (onChange) {
            onChange(event);
        }
    };

    return (
        <div className={styles.input_container} style={style} >
            {label && <div className={styles.label}>{label}</div>}
            <PhoneInput onChange={handleChange} placeholder={placeholder} value={value} inputClass={styles.phone_input} buttonClass={styles.flag_dropdown}
                buttonStyle={{ background: "none", border: "none" }} containerClass={styles.inputPhone_container}
                dropdownStyle={{ background: "rgba(22, 19, 48, 100%)" }}
                localization={ru} country="ru" disabled={disabled}
                disableDropdown={true} disableSearchIcon={false} disableCountryCode={false}
            />
        </div>
    );
};

export default MyPhoneInput;