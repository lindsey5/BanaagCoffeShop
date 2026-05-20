import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { WhiteCard } from "./Card";
import { useEffect, useState } from "react";
import { formatToPeso as format } from "../../utils/utils";

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
);

interface ChartProps {
    title: string;
    labels: string[];
    values: number[];
    formatToPeso: boolean;
}

export default function Chart({
    title,
    labels,
    values,
    formatToPeso,
}: ChartProps) {
    const [brown, setBrown] = useState("");

    useEffect(() => {
        const value = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-main")
        .trim();

        setBrown(value);
    }, []);

    const gridColor = "rgba(0,0,0,0.08)";

    const getGradient = (ctx: any, chartArea: any) => {
        const gradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
        );

        gradient.addColorStop(0, "rgba(122, 83, 53, 0.88)");
        gradient.addColorStop(1, "rgba(54, 36, 22, 0)");

        return gradient;
    };

    const data = {
        labels,
        datasets: [
        {
            data: values,
            borderColor: brown,
            backgroundColor: (context: any) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return;
            return getGradient(ctx, chartArea);
            },
            fill: true,
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: brown,
        },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
        mode: "index",
        intersect: false,
        },
        plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: "#ffffff",
            titleColor: brown,
            bodyColor: brown,
            borderColor: brown,
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
            label: function (context: any) {
                return `Value: ${
                formatToPeso ? format(Number(context.raw)) : context.raw
                }`;
            },
            },
        },
        },
        scales: {
        x: {
            ticks: {
            color: brown,
            maxRotation: 0,
            minRotation: 0,
            },
            grid: {
            display: false,
            },
        },
        y: {
            ticks: {
            color: brown,
            },
            grid: {
            color: gridColor,
            },
        },
        },
    };

    return (
        <WhiteCard className="w-full h-[300px] md:h-[500px]">
            <h2 className="font-sans text-brown text-base sm:text-lg font-bold mb-4 sm:mb-8">
                {title}
            </h2>

            <div className="h-[85%] w-full">
                <Line data={data} options={options} />
            </div>
        </WhiteCard>
    );
}

export const ChartSkeleton = () => {
    return (
        <WhiteCard className="flex flex-col gap-5 w-full h-[300px] md:h-[500px] animate-pulse">
            <div className="w-[40%] h-10 bg-loading rounded-md"></div>
            <div className="w-full flex-1 bg-loading rounded-md"></div>
        </WhiteCard>
    );
};