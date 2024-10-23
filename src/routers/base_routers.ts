import CatalogPage from "../pages/catalog/catalogPage";
import IndexPage from "../pages/indexPage";
import NotFoundPage from "../pages/NotFoundPage";
import OrderPage from "../pages/OrderPage";
import ProductPage from "../pages/catalog/productPage"; 
import ProfilePage from "../pages/ProfilePage";
import chatPage from "../pages/chatPage";
import { FC, FunctionComponent } from "react";
import MyOrdersPage from "../pages/myOrdersPage";
import OrderInfoPage from "../pages/orderInfoPage";
import MySubscriptionsPage from "../pages/mySubscriptionsPage";
import myPromocodePage from "../pages/myPromocodePage";
import AdminTeamPage from "../pages/admin/adminTeamPage";
import AdminClientPage from "../pages/admin/adminClientPage";
import AdminFeedbackPage from "../pages/admin/adminFeedbackPage";
import AdminIndexPage from "../pages/admin/adminIndexPage";
import AdminProductPage from "../pages/admin/adminProductPage";
import AdminOrderPage from "../pages/admin/adminOrderPage";
import AdminChatsPage from "../pages/admin/adminChatsPage";
import adminChatPage from "../pages/admin/adminChatPage";
import AdminOffersPage from "../pages/admin/adminOffersPage";
import SupportPage from "../pages/supportPage";
import SupportCreatePage from "../pages/supportCreatePage";
import SubscriptiosPage from "../pages/subscriptionsPage";
import SubscriptionPage from "../pages/catalog/SubscriptionPage";
import OfferPage from "../pages/legal_pages/offerPage";
import ConfidentialPage from "../pages/legal_pages/confidentialPage";
import WalletPage from "../pages/WalletPage";
import AdminWalletPage from "../pages/admin/adminWalletPage";
import AllFeedbacksPage from "../pages/bases/allFeedbacksPage";
import catalogCurrencyPage from "../pages/catalog/catalogCurrencyPage";

interface router {
    path: string;
    component: FunctionComponent | FC<any>,
    only_admin?: boolean,
    only_user?: boolean,
    can_404?: boolean,
}


export const base_routers: router[] = [
    { path: '/', component: IndexPage },

    { path: "/all_feedbacks", component: AllFeedbacksPage},

    { path: "/catalog", component: CatalogPage },
    { path: "/catalog_currency", component: catalogCurrencyPage },
    { path: "/catalog_subscriptions", component: SubscriptiosPage },
    { path: "/product/:id", component: ProductPage, can_404: true },
    { path: "/subscription/:id", component: SubscriptionPage, can_404: true },
    { path: "/wallet", component: WalletPage},

    { path: "/order/create", component: OrderPage },

    
    { path: "/profile", component: ProfilePage, only_user: true},
    { path: "/profile/chats", component: chatPage, only_user: true},
    { path: "/profile/orders", component: MyOrdersPage, only_user: true},
    { path: "/profile/order/:id", component: OrderInfoPage, only_user: true},
    { path: "/profile/subscription/:id", component: OrderInfoPage, only_user: true},
    { path: "/profile/subscriptions", component: MySubscriptionsPage, only_user: true},
    { path: "/profile/offers", component: myPromocodePage, only_user: true},
    { path: "/profile/supports", component: SupportPage, only_user: true},
    { path: "/profile/supports/ticket/create", component: SupportCreatePage, only_user: true},

    { path: "/admin", component: AdminIndexPage, only_admin: true},
    { path: "/admin/products", component: AdminProductPage, only_admin: true},
    { path: "/admin/team", component: AdminTeamPage, only_admin: true},
    { path: "/admin/clients", component: AdminClientPage, only_admin: true},
    { path: "/admin/feedbacks", component: AdminFeedbackPage, only_admin: true},
    { path: "/admin/orders", component: AdminOrderPage, only_admin: true},
    { path: "/admin/chats", component: AdminChatsPage, only_admin: true},
    { path: "/admin/chat", component: adminChatPage, only_admin: true},
    { path: "/admin/offers", component: AdminOffersPage, only_admin: true},
    { path: "/admin/wallet", component: AdminWalletPage, only_admin: true},


    { path: "/offer", component: OfferPage},
    { path: "/confidential", component: ConfidentialPage},

    { path: "*", component: NotFoundPage }
]