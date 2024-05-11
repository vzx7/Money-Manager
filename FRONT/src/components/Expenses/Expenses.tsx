import { useState, useEffect } from "react"
import Form, { PurchaseType } from "components/Form"
import ElementCard from "components/ElementCard"
import Months from "components/Months"
import Statistics from "components/Statistics"
import DeleteModal from "../DeleteModal"
import { months } from "../../services/scripts"
import { getMonth } from "date-fns"
import AuthService from "services/auth.service"
import eventBus from "common/EventBus"
import TransactionService from "services/transaction.service"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

const Expenses = () => {
    let [purchases, setPurchases] = useState<PurchaseType[]>([])

    const [filteredPurchase, setFilteredPurchase] = useState(purchases)
    const options = ["Еда", "Здоровье", "Жилье", "Транспорт", "Досуг", "Прочее"]

    const indexDate = getMonth(new Date()) + 1
    const currentMonth = months[indexDate]
    const [defaultMonth, setDefaultMonth] = useState(currentMonth)
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            
            TransactionService.getTransactions().then(trs => {
                const purchases: PurchaseType[] = [];
                trs.data.data.forEach((tr: any) => {
                    if(tr.type !== 'debet') return;
                    purchases.push({
                        id: tr.id,
                        type: tr.type,
                        date: format(Date.parse(tr.date), "dd MMMM yyyy", { locale: ru }),
                        price: new Intl.NumberFormat("ru-RU").format(tr.amount) + " ₽",
                        category: tr.reason,
                        isChecked: false
                    });
                })
                purchases.length > 0 && setPurchases(purchases);
            })
        }
        eventBus.on('exit', () => {
            setCurrentUser(undefined);
        })
        return () => {
            eventBus.remove("exit");
        };
    }, []);

    useEffect(() => {
        setDefaultMonth(currentMonth)
    }, [purchases, currentMonth])

/*     useEffect(() => {
        localStorage.setItem("purchases", JSON.stringify(purchases))
    }, [purchases]) */

    useEffect(() => {
        setFilteredPurchase(purchases)
    }, [purchases])

    return (
        <div>
            {currentUser ? (
                <><h1 className="title">Учет расходов</h1>
                <Form func={setPurchases} data={purchases} options={options} />
                <Statistics
                    title="Статистика расходов"
                    copyData={filteredPurchase}
                    options={options} /><div className="flex flex-col py-10">
                        <Months
                            data={purchases}
                            func={setFilteredPurchase}
                            defaultMonth={defaultMonth}
                            setDefaultMonth={setDefaultMonth} />
                        <DeleteModal
                            data={purchases}
                            func={setPurchases}
                            defaultMonth={defaultMonth} />
                        {filteredPurchase.length === 0 && (
                            <div className="text-center font-semibold text-xl pt-16 pb-4">
                                Нет внесенных расходов
                            </div>
                        )}
                        {filteredPurchase.length > 0 && (
                            <div className="rounded-t-md overflow-hidden">
                                {filteredPurchase.map((purchase: any) => (
                                    <ElementCard
                                        dataElem={purchase}
                                        key={purchase.id}
                                        data={purchases}
                                        func={setPurchases} />
                                ))}
                            </div>
                        )}
                    </div></>
            ) : (
                <div>
                    <p>Вы не авторизованы...</p>
                    <p>Войдите или зарегистрируйтесь.</p>
                </div>
            )}
        </div>
    )
}

export default Expenses
