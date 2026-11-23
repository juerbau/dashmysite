"use client";

import {motion} from "motion/react";

export default function StatsBar({label, value, percent}) {

    return (
        <div className="w-full mt-5">
            <div className="flex flex-row justify-between">
                <p>{label}</p>
                <p>{value}</p>
            </div>
            <motion.div
                initial={{width: "0%"}}
                whileInView={{width: `${percent}%`}}
                transition={{duration: 0.8}}
                viewport={{once: true}}
                className="bg-purple-500 h-3 rounded-sm"
            />
        </div>
    );
}