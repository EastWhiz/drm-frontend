"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface PatientReviewsProps {
    positiveComments?: {
        first?: { date?: string }
        second?: { date?: string }
    }
    negativeComment?: { date?: string }
    yearlyData?: Array<{
        year: string
        positive: number
        negative: number
        total?: number
    }>
    totalReviews?: number
}

const chartConfig = {
    positive: {
        label: "Positive Reviews",
        color: "#ADD8FF",
    },
    negative: {
        label: "Negative Reviews",
        color: "#F4A79D",
    },
} satisfies ChartConfig

export function PatientReviews({ yearlyData, totalReviews }: PatientReviewsProps) {

    const chartData = yearlyData?.map(item => ({
        year: item.year,
        positive: item.positive,
        negative: item.negative
    })) || []

    const hasData = chartData.some(item => item.positive > 0 || item.negative > 0)

    return (
        <main>

            <div className="flex items-center space-x-4">
                <h2 className="reports_heading">Patient Reviews Timeline</h2>
                <span className="mb-3 bg-[#4da6ff] text-white text-[0.75rem] sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-full flex items-center justify-center leading-none whitespace-nowrap max-w-full">
                    {totalReviews} reviews
                </span>

            </div>

            <Card className="w-auto !h-1/2">
                <CardContent className="p-4">
                    {hasData ? (
                        <div style={{ height: '300px' }}>
                            <ChartContainer className={"!h-full"} config={chartConfig}>
                                <AreaChart
                                    data={chartData}
                                    style={{ width: '100%', height: '300px' }}
                                    // width={150}
                                    // height={500}
                                    margin={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                >
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="year"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        fontSize={12}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent />}
                                    />
                                    <defs>
                                        <linearGradient id="fillPositive" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ADD8FF" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ADD8FF" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="fillNegative" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F4A79D" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#F4A79D" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        dataKey="negative"
                                        type="natural"
                                        fill="url(#fillNegative)"
                                        fillOpacity={0.4}
                                        stroke="#F4A79D"
                                        strokeWidth={1.5}
                                    />
                                    <Area
                                        dataKey="positive"
                                        type="natural"
                                        fill="url(#fillPositive)"
                                        fillOpacity={0.4}
                                        stroke="#ADD8FF"
                                        strokeWidth={1.5}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-4">
                            No review data available
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}
