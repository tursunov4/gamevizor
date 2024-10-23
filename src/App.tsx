import { Route, Routes } from "react-router-dom"
import { base_routers } from "./routers/base_routers"
import { UserProvider } from "./stores/userStore"
import { AuthJWTProvider } from "./stores/JWTTokenStore"
import { MobileProvider } from "./stores/mobileProvider";

interface AppProps {
  is_404: boolean;
  is_mobile?: boolean;
  products?: any;
}

const App: React.FC<AppProps> = ({ is_404 = false, is_mobile = false, products = [] }) => {
  return (
    <AuthJWTProvider>
      <UserProvider>
        <MobileProvider is_mobile={is_mobile}>
          <Routes>
            {base_routers.map((route: any, index: number) => (
              (is_404 === false || (is_404 === true && (!route.only_admin && !route.only_user && !route.can_404))) ?
                <Route key={index} path={route.path} element={<route.component is_404={is_404} products={products}/>} />
                : null
            ))}
          </Routes>
        </MobileProvider>
      </UserProvider>
    </AuthJWTProvider>
  )
}

export default App
