import { useState, useEffect } from "react";
import { Clock } from "@phosphor-icons/react";

const RealtimeClock = () => {
  const [time, setTime] = useState(new Date());
  const [timeZoneInfo, setTimeZoneInfo] = useState("");

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Get Timezone Info once
    const date = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timeZoneName = new Intl.DateTimeFormat('id-ID', { timeZoneName: 'short' })
      .formatToParts(date)
      .find(part => part.type === 'timeZoneName')?.value || "";
    
    const offset = -date.getTimezoneOffset() / 60;
    const sign = offset >= 0 ? "+" : "-";
    const gmtOffset = `UTC/GMT ${sign}${Math.abs(offset)} hours`;

    // Mapping common ID timezones to user friendly names if possible, or just use detected one
    let friendlyName = timeZoneName;
    if (timeZoneName === "WIB") friendlyName = "WIB (Western Indonesian Time)";
    if (timeZoneName === "WITA") friendlyName = "WITA (Central Indonesian Time)";
    if (timeZoneName === "WIT") friendlyName = "WIT (Eastern Indonesian Time)";

    setTimeZoneInfo(`Time Zone. ${friendlyName} ${gmtOffset}`);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
      <Clock size={14} weight="fill" className="text-primary" />
      <span>
        {time.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        <span className="mx-2">•</span>
        {timeZoneInfo}
      </span>
    </div>
  );
};

export default RealtimeClock;
