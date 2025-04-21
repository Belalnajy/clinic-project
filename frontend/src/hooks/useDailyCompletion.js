export function useDailyCompletion(dailyCompletionData) {
    const numberToMonth = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    };

    const mappedMonths = dailyCompletionData.map((item) => {
        const date = new Date(item.date);
        const monthNumber = date.getMonth() + 1; // Extract the month number (1-based)
        const monthName = numberToMonth[monthNumber]; // Map the number to the month name
        const year = date.getFullYear(); // Extract the year
        const day = date.getDate(); // Extract the day
        return {
            ...item,
            date: day, // Replace the date with the day only
            month: monthName, // Add the month name
            year: year, // Add the year
        };
    });

    // Calculate the range of months and year
    const firstDate = new Date(dailyCompletionData[0].date);
    const lastDate = new Date(dailyCompletionData[dailyCompletionData.length - 1].date);

    const firstMonth = numberToMonth[firstDate.getMonth() + 1];
    const lastMonth = numberToMonth[lastDate.getMonth() + 1];
    const year = firstDate.getFullYear(); // Assuming all dates are in the same year

    const dateRange = `${firstMonth} - ${lastMonth} ${year}`;
    return { mappedMonths, dateRange };
}