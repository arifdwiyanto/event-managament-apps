"use client";

import React, { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { FunnelIcon, ArrowDownTrayIcon, ChevronDownIcon, CalendarDaysIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCategories } from "../../events/hooks/useCategories";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Popover from "@mui/material/Popover";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useThemeStore } from "@/features/theme";

type ReportFiltersProps = {
  interval: 'day' | 'month' | 'year';
  onIntervalChange: (interval: 'day' | 'month' | 'year') => void;
  categoryId: string | undefined;
  onCategoryChange: (categoryId: string | undefined) => void;
  startDate: string | undefined;
  endDate: string | undefined;
  onStartDateChange: (date: string | undefined) => void;
  onEndDateChange: (date: string | undefined) => void;
};

// Custom day renderer — highlights range between start and end
function RangeDay(props: PickersDayProps & { draftStart?: Dayjs | null; draftEnd?: Dayjs | null }) {
  const { draftStart, draftEnd, day, ...other } = props;
  const isStart = draftStart && day.isSame(draftStart, 'day');
  const isEnd = draftEnd && day.isSame(draftEnd, 'day');
  const inRange = draftStart && draftEnd && day.isAfter(draftStart, 'day') && day.isBefore(draftEnd, 'day');

  return (
    <div
      style={{
        position: 'relative',
        ...(inRange ? { backgroundColor: 'rgba(238, 43, 140, 0.1)', borderRadius: 0 } : {}),
        ...(isStart ? { backgroundColor: 'rgba(238, 43, 140, 0.1)', borderRadius: '50% 0 0 50%' } : {}),
        ...(isEnd ? { backgroundColor: 'rgba(238, 43, 140, 0.1)', borderRadius: '0 50% 50% 0' } : {}),
        ...(isStart && isEnd ? { borderRadius: '50%' } : {}),
      }}
    >
      <PickersDay
        {...other}
        day={day}
        selected={!!isStart || !!isEnd}
        sx={{
          '&.Mui-selected': {
            backgroundColor: '#ee2b8c !important',
            color: 'white !important',
            fontWeight: 700,
          },
          '&:hover': {
            backgroundColor: 'rgba(238, 43, 140, 0.15)',
          },
          borderRadius: '8px',
          fontWeight: 500,
        }}
      />
    </div>
  );
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ 
  interval, onIntervalChange, categoryId, onCategoryChange,
  startDate, endDate, onStartDateChange, onEndDateChange
}) => {
  const { categories } = useCategories();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [pickPhase, setPickPhase] = useState<'start' | 'end'>('start');
  const [draftStart, setDraftStart] = useState<Dayjs | null>(startDate ? dayjs(startDate) : null);
  const [draftEnd, setDraftEnd] = useState<Dayjs | null>(endDate ? dayjs(endDate) : null);
  const [displayedMonth, setDisplayedMonth] = useState(dayjs());
  const open = Boolean(anchorEl);

  // Dynamic row height: calculate how many week rows the displayed month needs
  const calendarRowHeight = 40;
  const weeksInMonth = useMemo(() => {
    const firstDay = displayedMonth.startOf('month').day(); // 0=Sun
    const daysInMonth = displayedMonth.daysInMonth();
    return Math.ceil((firstDay + daysInMonth) / 7);
  }, [displayedMonth]);
  const calendarMinHeight = weeksInMonth * calendarRowHeight;

  const handleOpenCalendar = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
    setDraftStart(startDate ? dayjs(startDate) : null);
    setDraftEnd(endDate ? dayjs(endDate) : null);
    setPickPhase('start');
  };

  const handleClose = () => setAnchorEl(null);

  const handleDateClick = (val: Dayjs | null) => {
    if (!val) return;
    if (pickPhase === 'start') {
      setDraftStart(val);
      setDraftEnd(null);
      setPickPhase('end');
    } else {
      if (draftStart && val.isBefore(draftStart, 'day')) {
        setDraftEnd(draftStart);
        setDraftStart(val);
      } else {
        setDraftEnd(val);
      }
    }
  };

  const handleApply = () => {
    onStartDateChange(draftStart?.format('YYYY-MM-DD'));
    onEndDateChange(draftEnd?.format('YYYY-MM-DD'));
    handleClose();
  };

  const handleClearDates = () => {
    setDraftStart(null);
    setDraftEnd(null);
    onStartDateChange(undefined);
    onEndDateChange(undefined);
    setPickPhase('start');
    handleClose();
  };

  const dateLabel = startDate && endDate
    ? `${dayjs(startDate).format('MMM DD, YYYY')} — ${dayjs(endDate).format('MMM DD, YYYY')}`
    : 'Select Date Range';

  const draftLabel = draftStart && draftEnd
    ? `${draftStart.format('MMM DD, YYYY')} — ${draftEnd.format('MMM DD, YYYY')}`
    : draftStart
      ? `${draftStart.format('MMM DD, YYYY')} — pick end date`
      : 'No date selected';

  const calendarValue = pickPhase === 'start' ? draftStart : (draftEnd ?? draftStart);

  // Dark/Light mode colors for popover
  const popoverBg = isDark ? '#221019' : '#ffffff';
  const textColor = isDark ? '#f5f0f2' : '#181114';
  const mutedTextColor = isDark ? '#896175' : '#5f4351';
  const dayTextColor = isDark ? '#e8dce2' : 'inherit';

  return (
    <div className="flex flex-col gap-3 md:gap-4 bg-white dark:bg-[#221019] p-3 md:p-4 rounded-xl md:rounded-2xl border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm">
      {/* Interval Buttons */}
      <div className="flex bg-[#f8f6f7] dark:bg-[#2a1621] p-1 rounded-lg md:rounded-xl w-full">
        <button 
          onClick={() => onIntervalChange('day')}
          className={`flex-1 px-3 md:px-6 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-all ${interval === 'day' ? 'font-bold bg-white dark:bg-[#3a1d2e] shadow-sm text-primary' : 'font-medium text-[#896175] hover:text-[#181114] dark:hover:text-white'}`}>Per Day</button>
        <button 
          onClick={() => onIntervalChange('month')}
          className={`flex-1 px-3 md:px-6 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-all ${interval === 'month' ? 'font-bold bg-white dark:bg-[#3a1d2e] shadow-sm text-primary' : 'font-medium text-[#896175] hover:text-[#181114] dark:hover:text-white'}`}>Per Month</button>
        <button 
          onClick={() => onIntervalChange('year')}
          className={`flex-1 px-3 md:px-6 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-all ${interval === 'year' ? 'font-bold bg-white dark:bg-[#3a1d2e] shadow-sm text-primary' : 'font-medium text-[#896175] hover:text-[#181114] dark:hover:text-white'}`}>Per Year</button>
      </div>

      {/* Right side: Date Range + Category */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full items-stretch sm:items-center">
        {/* Date Range Picker Button */}
        <button
          onClick={handleOpenCalendar}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold border transition-all outline-none w-full sm:w-auto ${
            startDate || endDate 
              ? 'bg-primary/10 border-primary/20 text-primary dark:bg-primary/15 dark:border-primary/30 shadow-sm' 
              : 'bg-white dark:bg-[#2a1621] border-[#f4f0f2] dark:border-[#3a1d2e] text-[#5f4351] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#3a1d2e]'
          }`}
        >
          <CalendarDaysIcon className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
          <span className="truncate max-w-[200px] md:max-w-[260px]">{dateLabel}</span>
          {(startDate || endDate) && (
            <XMarkIcon
              className="w-4 h-4 ml-1 flex-shrink-0 hover:text-red-500 cursor-pointer transition-colors"
              onClick={(e) => { e.stopPropagation(); handleClearDates(); }}
            />
          )}
        </button>

        {/* Calendar Popover */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: '16px',
                boxShadow: isDark 
                  ? '0 20px 60px rgba(0,0,0,0.5)' 
                  : '0 20px 60px rgba(0,0,0,0.15)',
                backgroundColor: popoverBg,
                overflow: 'hidden',
                border: isDark ? '1px solid #3a1d2e' : 'none',
              }
            }
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', padding: '0 8px' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: textColor }}>
                  {pickPhase === 'start' ? '📅 Pick Start Date' : '📅 Pick End Date'}
                </p>
                {(draftStart || draftEnd) && (
                  <button 
                    onClick={handleClearDates}
                    style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Calendar */}
              <DateCalendar
                value={calendarValue}
                onChange={handleDateClick}
                onMonthChange={(month) => setDisplayedMonth(month)}
                slots={{
                  day: (dayProps) => <RangeDay {...dayProps} draftStart={draftStart} draftEnd={draftEnd} />,
                }}
                sx={{
                  '& .MuiPickersCalendarHeader-label': { color: textColor, fontWeight: 600 },
                  '& .MuiDayCalendar-weekDayLabel': { color: mutedTextColor },
                  '& .MuiPickersDay-root': { color: dayTextColor },
                  '& .MuiPickersArrowSwitcher-button': { color: textColor },
                  '& .MuiPickersDay-today': {
                    border: isDark ? '1px solid #896175 !important' : undefined,
                  },
                  '& .MuiPickersYear-yearButton': { color: dayTextColor },
                  '& .MuiPickersYear-yearButton.Mui-selected': {
                    backgroundColor: '#ee2b8c !important',
                    color: 'white !important',
                  },
                  '& .MuiDayCalendar-slideTransition': {
                    minHeight: calendarMinHeight,
                    overflow: 'hidden',
                  },
                  height: 'fit-content',
                  overflow: 'hidden',
                }}
              />

              {/* Summary + Apply — always visible */}
              <div style={{ padding: '0 8px 8px', marginTop: '14px' }}>
                <p style={{ fontSize: '0.75rem', textAlign: 'center', color: mutedTextColor, marginBottom: '8px' }}>
                  {draftLabel}
                </p>
                <button
                  onClick={handleApply}
                  disabled={!draftStart || !draftEnd}
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: (!draftStart || !draftEnd) ? 'not-allowed' : 'pointer',
                    opacity: (!draftStart || !draftEnd) ? 0.4 : 1,
                    backgroundColor: '#ee2b8c',
                    color: 'white',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Apply Date Range
                </button>
              </div>
            </div>
          </LocalizationProvider>
        </Popover>

        {/* Category Filter */}
        <Select
          value={categoryId || ""}
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
          displayEmpty
          size="small"
          startAdornment={<FunnelIcon style={{ width: 16, height: 16, marginRight: 6, color: isDark ? '#896175' : '#9ca3af' }} />}
          sx={{
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            minWidth: 'auto',
            width: '100%',
            '@media (min-width: 640px)': { width: 'auto', minWidth: 160, fontSize: '0.875rem' },
            backgroundColor: isDark ? '#2a1621' : '#fff',
            color: isDark ? '#f5f0f2' : '#181114',
            border: `1px solid ${isDark ? '#3a1d2e' : '#f4f0f2'}`,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiSelect-icon': { color: isDark ? '#896175' : '#9ca3af' },
            '&:hover': { backgroundColor: isDark ? '#3a1d2e' : '#f9fafb' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '12px',
                backgroundColor: isDark ? '#221019' : '#fff',
                border: isDark ? '1px solid #3a1d2e' : '1px solid #f4f0f2',
                boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.1)',
                '& .MuiMenuItem-root': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isDark ? '#e8dce2' : '#181114',
                  '&:hover': { backgroundColor: isDark ? '#3a1d2e' : '#f8f6f7' },
                  '&.Mui-selected': { 
                    backgroundColor: isDark ? '#3a1d2e' : 'rgba(238, 43, 140, 0.08)',
                    fontWeight: 700,
                  },
                },
              }
            }
          }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories?.map(cat => (
            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};
