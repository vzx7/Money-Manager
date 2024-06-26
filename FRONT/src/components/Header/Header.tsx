import { Link } from "react-router-dom"
import "./Header.css"
import AuthService from "services/auth.service";
import { useEffect, useState } from "react";
import EventBus from "common/EventBus";

const Header = () => {
    const icon = require(".//headerLogo.png")
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
        }

        EventBus.on("logout", () => {
            logOut();
        });

        EventBus.on('login', () => {
            const user = AuthService.getCurrentUser();
            setCurrentUser(user);
        })

        return () => {
            EventBus.remove("logout");
            EventBus.remove("login");
        };
    }, []);

    const logOut = (ev?: any) => {
        ev && ev.preventDefault()
        AuthService.logout();
        setCurrentUser(undefined);
        EventBus.dispatch('exit');
    };

    return (
        <header className="bg-sky-300 static max-w-4xl m-auto py-2 shadow-md">
            <div className="flex items-center justify-between px-3">
                <div className="flex items-center relative gap-1">
                    <img src={icon} alt="logo" className="h-9 w-9" />
                    <p className="text-3xl font-semibold pl-1 border-l-4 border-l-neutral-800">
                        Анализ финансов
                    </p>
                </div>
                <div className="flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 text-neutral-800 mr-1 mt-2 cursor-pointer"
                    >
                        <path
                            fillRule="evenodd"
                            d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
            <div className="flex items-center justify-center gap-10 pt-5 pb-2 link-container">
                <Link to="/" className="header-link link">
                    Главная
                </Link>
                <Link to="/income" className="header-link link">
                    Доходы
                </Link>
                <Link to="/expenses" className="header-link link">
                    Расходы
                </Link>
                    {!currentUser ? 
                        (<Link to="/auth" className="header-link link">
                            Авторизация
                        </Link>)
                        : 
                        (<Link to="/logout" className="header-link link" onClick={logOut}>
                            Выйти
                        </Link>)
                    }       
            </div>
        </header>
    )
}

export default Header
