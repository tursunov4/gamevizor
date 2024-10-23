import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios'; // Добавьте Axios для API-запросов

// Интерфейсы для токена и данных API

interface AuthJWTContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    fetchToken: (username: string, password: string) => Promise<boolean>; // Return boolean for success/failure
    refreshToken: () => Promise<boolean>; // Return boolean for success/failure
}

const AuthJWTContext = createContext<AuthJWTContextType>({
    accessToken: null,
    setAccessToken: () => { },
    fetchToken: () => Promise.resolve(false), // Default to false for unsuccessful fetch
    refreshToken: () => Promise.resolve(false), // Default to false for unsuccessful refresh
});

export const useAuth = () => useContext(AuthJWTContext);

export const AuthJWTProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshTokenCalled, setRefreshTokenCalled] = useState(false);

    
    const fetchToken = async (username: string, password: string) => {
        try {
            const response = await axios.post('/api/v1/token/', {
                email: username,
                password: password
            });
            // setAccessToken(response.data.token);
            setAccessToken(response.data.access)
            return true;
            
            // localStorage.setItem('token', response.data.token); // Сохраните токен
        } catch (error) {
            console.error('Ошибка при получении токена:', error);
            return false
        }
    };

    
    const refreshToken = async () => {
        try {
            // ... логика обновления токена
            // например, с помощью API-запроса /api/auth/refresh
            const response = await axios.post('/api/v1/token/refresh/', {
            });
            setAccessToken(response.data.access);
            return true;
        } catch (error) {
            console.error('Ошибка при обновлении токена:', error);
            setAccessToken(null)
            return false;
        }
    };

    useEffect(() => {
        // Вызываем refreshToken, если accessToken равен null и refreshTokenCalled еще не true
        if (accessToken === null && !refreshTokenCalled) {
            refreshToken().then(() => {
                setRefreshTokenCalled(true);
            });
        }
    }, [accessToken, refreshTokenCalled]);

    useEffect(() => {
        const intervalId = setInterval(() => {
          refreshToken();
        }, 4 * 60 * 1000); // 4 минуты в миллисекундах
    
        // Очистка интервала при размонтировании компонента
        return () => clearInterval(intervalId);
      }, []); // Пустой массив зависимостей для вызова только один раз

    return (
        <AuthJWTContext.Provider value={{ accessToken, setAccessToken, fetchToken, refreshToken }}>
            {children}
        </AuthJWTContext.Provider>
    );
};