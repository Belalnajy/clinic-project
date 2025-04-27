import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const TableFilters = ({ filters, handleFilterChange, doctors = [], specializations = [] }) => {
  const [open, setOpen] = useState(false);
  const [rangeMode, setRangeMode] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);

  const handleDateSelect = (date) => {
    if (!rangeMode) {
      setTempDate(date);
    } else {
      setEndDate(date);
      handleFilterChange('date', { startDate, endDate: date });
      setOpen(false);
      setRangeMode(false);
      setStartDate(null);
      setEndDate(null);
      setTempDate(null);
    }
  };

  const handleConfirmSingleDate = () => {
    handleFilterChange('date', tempDate);
    setOpen(false);
    setTempDate(null);
  };

  const handlePickAnotherDate = () => {
    setRangeMode(true);
    setStartDate(tempDate);
    setTempDate(null);
  };

  const handleResetDate = () => {
    handleFilterChange('date', null);
    setOpen(false);
    setRangeMode(false);
    setStartDate(null);
    setEndDate(null);
    setTempDate(null);
  };

  // Displayed value in the filter button
  let dateLabel = 'Select date';
  if (filters.date) {
    if (typeof filters.date === 'object' && filters.date.startDate && filters.date.endDate) {
      dateLabel = `${format(filters.date.startDate, 'PPP')} - ${format(filters.date.endDate, 'PPP')}`;
    } else if (filters.date instanceof Date) {
      dateLabel = format(filters.date, 'PPP');
    }
  }

  return (
    <div className="mb-4 mt-5 flex flex-wrap gap-4">
      <Select
        value={filters.doctor || 'all'}
        onValueChange={(value) => handleFilterChange('doctor', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select Doctor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Doctors</SelectItem>
          {Array.isArray(doctors) &&
            doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.specialization || 'all'}
        onValueChange={(value) =>
          handleFilterChange('specialization', value === 'all' ? '' : value)
        }
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select Specialization" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Specializations</SelectItem>
          {Array.isArray(specializations) &&
            specializations.map((specialization) => (
              <SelectItem key={specialization.id} value={specialization.id}>
                {specialization.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status || 'all'}
        onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="canceled">Canceled</SelectItem>
          <SelectItem value="in_queue">In Queue</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              'w-full md:w-[180px] justify-start text-left font-normal cursor-pointer inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              !filters.date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateLabel}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="min-w-[280px]">
            <Calendar
              mode="single"
              selected={tempDate || (rangeMode ? endDate : filters.date)}
              onSelect={handleDateSelect}
              initialFocus
            />
            {!rangeMode && tempDate && (
              <div className="p-3 border-t flex flex-col gap-2">
                <Button className="w-full" variant="outline" onClick={handlePickAnotherDate}>
                  Pick Another Date
                </Button>
                <Button className="w-full" onClick={handleConfirmSingleDate}>
                  Use This Date Only
                </Button>
              </div>
            )}
            <div className="p-3 border-t">
              <Button className="w-full" variant="outline" onClick={handleResetDate}>
                Reset
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TableFilters;
