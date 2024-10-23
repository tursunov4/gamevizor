import OrderPanel from './orderPanel';
import { OrderPanelProp } from "../interfaces/orderPanel";


interface OrderTableProps {
    orders: OrderPanelProp[];
}



const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
    return (
        <div>
            {orders.map((order, index) => (
                <OrderPanel key={index} product={order?.product} id={order.id} user={order.user} subscription_status={order.subscription_status}
                chat={order.chat} platform={order.platform}
                created_on={order.created_on} cost={order.cost} status={order.status} info_for_complete={''} 
                max_cost={null} is_deluxe={false} wallet={order?.wallet}/>
            ))}
        </div>
    );
};

export default OrderTable;