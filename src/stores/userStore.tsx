import React, { createContext, useContext, useState, useEffect } from 'react';
import UserInterface from '../interfaces/userInterface';
import { useAuth } from './JWTTokenStore';
import axios from 'axios';
import EmployeeInterface from '../interfaces/employeeInterface';



const UserContext = createContext<
    {
        user: UserInterface | null;
        employee: EmployeeInterface | null;
        setUser: (user: UserInterface | null) => void;
        LoginCTX: (username: string, password: string) => Promise<boolean>;
        GetUserProfileCTX: () => void;
        LogoutCTX: () => void;
        ChangeProfileCTX: (data: any) => void;
    } | null
>(null);


const useUser = () => useContext(UserContext) as {
    user: UserInterface | null;
    employee: EmployeeInterface | null;
    setUser: (user: UserInterface | null) => void;
    LoginCTX: (username: string, password: string) => Promise<boolean>;
    GetUserProfileCTX: () => void;
    LogoutCTX: () => void;
    ChangeProfileCTX: (data: any) => void;
};


const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInterface | null>(null);
    const [employee, setEmployee] = useState<EmployeeInterface | null>(null);
    const { accessToken, fetchToken, setAccessToken } = useAuth()

    const LoginCTX = async (username: string, password: string) => {
        return fetchToken(username, password)
    }

    useEffect(() => {
        if (accessToken === null ) setUser(null)
    }, [accessToken])

    const GetUserProfileCTX = async () => {
        if (!accessToken) { return }
        // Если токен есть, запрос на получение данных пользователя
        axios.get('/api/v1/auth/user/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setUser(response.data);

                if (response.data.is_staff) {
                    GetEmployeeProfileCTX(response.data.pk);
                }
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });
    }

    const GetEmployeeProfileCTX = async (pk: number) => {
        if (!accessToken) { return }

        axios.get('/api/v1/admin/staffs/' + pk + "/", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setEmployee(response.data);

            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });
    }

    const LogoutCTX = async () => {
        if (!accessToken) { return }
        axios.post('/api/v1/logout/', {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(() => {
                setAccessToken(null);
                setUser(null);
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });
    }

    const ChangeProfileCTX = async (data: any) => {
        if (!accessToken) { return }
        axios.put('/api/v1/profile/edit/', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Ошибка проверки токена:', error);
            });
    }

    useEffect(() => {
        GetUserProfileCTX();
    }, [accessToken])
    /* useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/user');
            const data = await response.json();
            setUser(data);
        };
        fetchData();
    }, []); */


    return (
        <UserContext.Provider value={{ user, setUser, LoginCTX, GetUserProfileCTX, LogoutCTX, ChangeProfileCTX, employee }}>
            {children}
        </UserContext.Provider>
    );
};



export { UserProvider, useUser };