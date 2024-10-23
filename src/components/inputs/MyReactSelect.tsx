import { CSSProperties } from "react";
import styles from "../../styles/inputs/MyReactSelect.module.css"
import ReactSelect from 'react-select';

interface InputReactSelectProps {
    onChange?: (value: { value: string | number | undefined, label: string | number | undefined }) => void;
    value?: { value: any, label: any };
    defaultValue?: { value: any, label: any };
    options?: { value: any, label: any }[];
    isSearchable?: boolean;
    isDisabled?: boolean;
    classNamePrefix?: string;
    instanceId?: string;
    label?: string
    style?: CSSProperties,
    getOptionLabel?: any;
    getOptionValue?: any;

}

const MyReactSelect: React.FC<InputReactSelectProps> = ({
    onChange,
    value,
    defaultValue,
    options,
    isSearchable = false,
    isDisabled,
    classNamePrefix = "my_select",
    instanceId,
    style,
    label,
    getOptionLabel,
    getOptionValue
}) => {


    return (
        <div style={style} className={styles.select_container} >
            <div style={{cursor: isDisabled ? "not-allowed" : "pointer"}}>
                <ReactSelect unstyled options={options} isSearchable={isSearchable} className={styles.select} isDisabled={isDisabled}
                    classNamePrefix={classNamePrefix} onChange={(valuee) => onChange && onChange(valuee as { value: string | number, label: string | number })}
                    defaultValue={defaultValue} value={value} instanceId={instanceId} getOptionLabel={getOptionLabel} getOptionValue={getOptionValue} />
                {label && <div className={styles.label}>{label}</div>}
            </div>
        </div>
    );
};

export default MyReactSelect;