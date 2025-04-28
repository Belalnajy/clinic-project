import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const useAppointmentFilters = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        doctor: searchParams.get('doctor') || '',
        specialization: searchParams.get('specialization') || '',
        status: searchParams.get('status') || '',
        date: searchParams.get('date') ? new Date(searchParams.get('date')) : null,
    });

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);

        // Update URL search params
        const newSearchParams = new URLSearchParams(searchParams);
        if (value) {
            if (filterName === 'date') {
                if (value instanceof Date) {
                    // Single date
                    const year = value.getFullYear();
                    const month = String(value.getMonth() + 1).padStart(2, '0');
                    const day = String(value.getDate()).padStart(2, '0');
                    newSearchParams.set('date', `${year}-${month}-${day}`);
                    newSearchParams.delete('startDate');
                    newSearchParams.delete('endDate');
                } else if (typeof value === 'object' && value.startDate && value.endDate) {
                    // Date range
                    const start = value.startDate;
                    const end = value.endDate;
                    const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
                    const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
                    newSearchParams.set('startDate', startStr);
                    newSearchParams.set('endDate', endStr);
                    newSearchParams.delete('date');
                }
            } else {
                newSearchParams.set(filterName, value);
            }
        } else {
            newSearchParams.delete(filterName);
            newSearchParams.delete('startDate');
            newSearchParams.delete('endDate');
        }
        // Reset to page 1 when filters change
        newSearchParams.set('page', '1');
        setSearchParams(newSearchParams);
    };

    return {
        filters,
        handleFilterChange,
    };
};

export default useAppointmentFilters; 