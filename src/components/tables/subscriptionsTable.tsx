import SubscriptionPanel from "../panels/subscriptionsPanel";
import { OrderPanelProp } from "../../interfaces/orderPanel";


interface SubscriptionsTableProps {
    subscriptions: OrderPanelProp[];
}



const SubscriptionTable: React.FC<SubscriptionsTableProps> = ({ subscriptions }) => {
    return (
        <div>
            {subscriptions.map((subscription, index) => (
                <SubscriptionPanel key={index} subscription={subscription} />
            ))}
        </div>
    );
};

export default SubscriptionTable;