"use client";

import { useState, useEffect, useRef } from "react";

interface CountdownProps {
  targetDate: Date;
}

export default function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-6">
      <h3 className="text-amber-400 text-sm font-medium mb-4">Next Draw In</h3>
      <div className="grid grid-cols-4 gap-2">
        {timeUnits.map((unit, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl md:text-4xl font-black text-white mb-1">
              {unit.value.toString().padStart(2, "0")}
            </div>
            <div className="text-gray-500 text-xs">{unit.label}</div>
          </div>
        ))}
      </div>
      <p className="text-gray-400 text-sm mt-4 text-center">
        Prize Pool: <span className="text-emerald-400 font-bold">$28,000</span>
      </p>
    </div>
  );
}
