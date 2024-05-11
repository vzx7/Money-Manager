import { useState, useEffect } from "react"
import Form, { PurchaseType } from "components/Form"
import Months from "components/Months"
import Statistics from "components/Statistics"
import ElementCard from "components/ElementCard"
import DeleteModal from "components/DeleteModal"
import { months } from "../../services/scripts"
import { format, getMonth } from "date-fns"
import AuthService from "services/auth.service"
import eventBus from "common/EventBus"
import { ru } from "date-fns/locale"
import TransactionService from "services/transaction.service"

const Income = () => {
    let [income, setIncome] = useState<PurchaseType[] | []>([])

    const [filteredIncome, setFilteredIncome] = useState(income)

    const indexDate = getMonth(new Date()) + 1
    const currentMonth = months[indexDate]
    const [defaultMonth, setDefaultMonth] = useState(currentMonth)
    const [currentUser, setCurrentUser] = useState(undefined);
    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
            TransactionService.getTransactions().then(trs => {
                const incomes: PurchaseType[] = [];
                trs.data.data.forEach((tr: any) => {
                    if(tr.type !== 'credit') return;
                    incomes.push({
                        id: tr.id,
                        type: tr.type,
                        date: format(Date.parse(tr.date), "dd MMMM yyyy", { locale: ru }),
                        price: new Intl.NumberFormat("ru-RU").format(tr.amount) + " ₽",
                        category: tr.reason,
                        isChecked: false
                    });
                })
                incomes.length > 0 && setIncome(incomes);
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
    }, [income, currentMonth])

/*     useEffect(() => {
        localStorage.setItem("income", JSON.stringify(income))
    }, [income]) */

    useEffect(() => {
        setFilteredIncome(income)
    }, [income])

    return (
        <div>
            {currentUser ? (
                <><h1 className="title">Учет доходов</h1>
                    <Form func={setIncome} data={income} type="credit" />
                    <Statistics
                        title="Статистика доходов"
                        copyData={filteredIncome}
                        type="credit" />
                    <div className="flex flex-col py-10">
                        <Months
                            data={income}
                            func={setFilteredIncome}
                            defaultMonth={defaultMonth}
                            setDefaultMonth={setDefaultMonth} />
                        <DeleteModal
                            data={income}
                            func={setIncome}
                            defaultMonth={defaultMonth} />
                        {filteredIncome.length === 0 && (
                            <div className="text-center font-semibold text-xl pt-16 pb-4">
                                Нет внесенных доходов
                            </div>
                        )}
                        {filteredIncome.length > 0 && (
                            <div className="rounded-t-md overflow-hidden">
                                {filteredIncome.map((item: any) => (
                                    <ElementCard
                                        dataElem={item}
                                        key={item.id}
                                        data={income}
                                        func={setIncome} />
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

export default Income
