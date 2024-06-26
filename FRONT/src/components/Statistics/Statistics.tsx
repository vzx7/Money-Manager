import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { PurchaseType } from "../Form"
import "./Statistics.css"
import { COLORS, categories, colorsForClassName, getAmount, Type } from "../../services/scripts"

type Props = {
    title: string
    copyData: PurchaseType[]
    type: Type
}

type renderCustomizedLabelType = {
    cx: number
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    percent: number
    index: number
}

const Statistics = ({ title, copyData, type }: Props) => {
    const options = categories[type];
    const filterCategories = (i: number) => {
        const categoryArr = copyData.filter(
            (purchase: PurchaseType) => purchase.category === options[i]
        )
        const categoriesPriceArr = categoryArr.map((c) => c.price.replace(' ₽', '').split("."))

        let result = categoriesPriceArr.map((c) =>
            // @ts-ignore
            Number(c[0].match(/\S/g).join(""))
        )
        return result.reduce((a, b) => a + b, 0)
    }

    const data = [
        { name: options[0], value: filterCategories(0) },
        { name: options[1], value: filterCategories(1) },
        { name: options[2], value: filterCategories(2) },
        { name: options[3], value: filterCategories(3) },
        { name: options[4], value: filterCategories(4) },
        { name: options[5], value: filterCategories(5) },
        { name: options[6], value: filterCategories(6) }
    ]

    const RADIAN = Math.PI / 180
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index
    }: renderCustomizedLabelType) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return (
            <text
                x={x}
                y={y}
                fill="gray"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="opacity-0"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <div className="pt-10">
            <p className="text-center font-semibold text-2xl text-gray-800">
                {title}
            </p>
            <div className="flex justify-between items-center statistic">
                <div className="diagram">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={100}
                                fill="#262626"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="pt-8 flex flex-col">
                    <ul className="flex flex-col gap-3 statistic-list pb-2">
                        {options.map((option, index) => {
                            return (
                                <li
                                    className={
                                        colorsForClassName[index] +
                                        " rounded-md px-5 py-0.5 font-medium border border-gray-800"
                                    }
                                    key={option}
                                >
                                    {option} -{" "}
                                    {filterCategories(index).toLocaleString(
                                        "ru-RU"
                                    )}
                                    .00 ₽
                                </li>
                            )
                        })}
                    </ul>
                    <p className="font-medium text-center text-lg">
                        Итого - {getAmount(copyData)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Statistics
