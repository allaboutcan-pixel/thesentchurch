import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Info, Image as ImageIcon } from 'lucide-react';
import { dbService } from '../services/dbService';
import clsx from 'clsx';

import { useTranslation } from 'react-i18next';

const CalendarWidget = () => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.language === 'en';
    // Force calendar to Canada/Vancouver time for consistent display
    const getVancouverDate = () => {
        try {
            return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Vancouver" }));
        } catch (e) {
            return new Date();
        }
    };

    const [currentDate, setCurrentDate] = useState(getVancouverDate());
    const [selectedDate, setSelectedDate] = useState(getVancouverDate());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredEvent, setHoveredEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await dbService.getCalendarEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to load calendar events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [i18n.language]);

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const isSameDay = (d1, d2) => {
        if (!d1 || !d2) return false;
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    // Parse "YYYY-MM-DD" manually to avoid UTC offset issues
    const parseDateLocal = (dateStr) => {
        if (!dateStr) return null;
        if (dateStr instanceof Date) return dateStr;
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    };

    const isDateInEventRange = (date, event) => {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const start = parseDateLocal(event.startDate);
        const end = parseDateLocal(event.endDate || event.startDate);

        if (!start || !end) return false;

        const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        return d >= s && d <= e;
    };

    // Events for the selected day
    const selectedEvents = events.filter(e => isDateInEventRange(selectedDate, e));
    const mainEvent = selectedEvents[0] || null;

    const monthNames = [
        t('calendar.jan'), t('calendar.feb'), t('calendar.mar'), t('calendar.apr'),
        t('calendar.may'), t('calendar.jun'), t('calendar.jul'), t('calendar.aug'),
        t('calendar.sep'), t('calendar.oct'), t('calendar.nov'), t('calendar.dec')
    ];

    // Grid rendering logic
    const totalSlots = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const gridDays = [];

    // Fill from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        gridDays.push({ date: new Date(year, month - 1, prevMonthLastDay - i), currentMonth: false });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
        gridDays.push({ date: new Date(year, month, i), currentMonth: true });
    }
    // Next month
    const remaining = totalSlots - gridDays.length;
    for (let i = 1; i <= remaining; i++) {
        gridDays.push({ date: new Date(year, month + 1, i), currentMonth: false });
    }

    const rows = [];
    for (let i = 0; i < gridDays.length; i += 7) {
        rows.push(gridDays.slice(i, i + 7));
    }

    return (
        <div className="bg-white rounded-[32px] p-4 lg:p-6 shadow-2xl shadow-primary/5 border border-gray-50">
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-primary leading-none uppercase tracking-tight">
                                {monthNames[month]}
                            </h3>
                            <p className="text-sm font-bold text-gray-300 mt-1">{year}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition-all border border-transparent hover:border-gray-100">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition-all border border-transparent hover:border-gray-100">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 border-b border-gray-100 mb-4 pb-4">
                    {[t('calendar.sun'), t('calendar.mon'), t('calendar.tue'), t('calendar.wed'), t('calendar.thu'), t('calendar.fri'), t('calendar.sat')].map((d, i) => (
                        <div key={i} className={clsx(
                            "text-xs font-black uppercase tracking-widest text-center",
                            i === 0 ? "text-red-400" : "text-gray-400"
                        )}>
                            {d}
                        </div>
                    ))}
                </div>

                <div className="flex-grow flex flex-col gap-1">
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-7 gap-1 min-h-[6rem] group/row">
                            {row.map((day, dayIndex) => {
                                const dayEvents = events.filter(e => isDateInEventRange(day.date, e));
                                const isSelected = isSameDay(day.date, selectedDate);
                                const isToday = isSameDay(day.date, new Date());

                                return (
                                    <div
                                        key={dayIndex}
                                        onClick={() => setSelectedDate(day.date)}
                                        className={clsx(
                                            "relative p-2 rounded-2xl transition-all cursor-pointer flex flex-col border border-transparent h-full",
                                            day.currentMonth ? "bg-white" : "bg-gray-50/30 opacity-40",
                                            isSelected ? "ring-2 ring-primary/20 shadow-lg border-primary/10 bg-primary/5" : "hover:bg-gray-50 hover:border-gray-100"
                                        )}
                                    >
                                        <span className={clsx(
                                            "text-sm font-bold self-start mt-0.5 ml-1",
                                            isToday ? "text-accent" : day.date.getDay() === 0 ? "text-red-400" : "text-gray-400",
                                            isSelected && "text-primary scale-110"
                                        )}>
                                            {day.date.getDate()}
                                        </span>

                                        <div className="mt-2 space-y-1 overflow-visible">
                                            {dayEvents.map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={clsx(
                                                        "px-2 py-0.5 rounded-md text-[10px] font-bold truncate transition-colors",
                                                        event.type === 'special' ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary",
                                                        isSelected ? "bg-white/50" : ""
                                                    )}
                                                    title={event.title}
                                                >
                                                    {isEn && event.titleEn ? event.titleEn : event.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Selected Day Info (Simple Overlay/Line Instead of Sidebar) */}
                {mainEvent && (
                    <div className="mt-8 p-6 bg-slate-50/50 rounded-3xl border border-gray-100 animate-fade-in flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                                <Info size={24} className="text-accent" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-primary">{isEn && mainEvent.titleEn ? mainEvent.titleEn : mainEvent.title}</h4>
                                <p className="text-sm text-gray-500 font-bold">
                                    {(() => {
                                        const d = parseDateLocal(mainEvent.startDate);
                                        return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
                                    })()}
                                    {mainEvent.endDate && mainEvent.endDate !== mainEvent.startDate && (() => {
                                        const d = parseDateLocal(mainEvent.endDate);
                                        return ` - ${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
                                    })()}
                                </p>
                            </div>
                        </div>
                        {mainEvent.note && (
                            <div className="max-w-md border-l-2 border-accent/20 pl-4">
                                <p className="text-sm text-gray-500 leading-relaxed italic font-medium">
                                    {isEn && mainEvent.noteEn ? mainEvent.noteEn : mainEvent.note}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarWidget;
