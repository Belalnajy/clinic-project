import Papa from 'papaparse';
import { useMemo } from 'react';
export function usePatients(patients, ageBuckets) {
    const { ageData, genderData, displayConditions } = useMemo(() => {
        const now = new Date();
        const ageCounts = ageBuckets.map((bucket) => ({ name: bucket.label, count: 0 }));
        const genderCounts = { male: 0, female: 0 };
        const conditionCounts = {};

        patients.forEach((patient) => {
            const birth = new Date(patient.dateOfBirth);
            const age = Math.floor((now - birth) / (1000 * 60 * 60 * 24 * 365.25));
            const bucket = ageBuckets.find((b) => age >= b.min && age <= b.max);
            if (bucket) ageCounts[ageBuckets.indexOf(bucket)].count += 1;

            const genderKey = (patient.gender || '').toLowerCase();
            if (genderKey === 'male' || genderKey === 'female') {
                genderCounts[genderKey] += 1;
            }

            if (Array.isArray(patient.medicalHistory)) {
                patient.medicalHistory.forEach((entry) => {
                    conditionCounts[entry.condition] = (conditionCounts[entry.condition] || 0) + 1;
                });
            }
        });

        // Prepare condition array without grouping "Others"
        const displayConditions = Object.entries(conditionCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        // Generate unique colors for each condition
        const colors = displayConditions.map((_, index) => {
            const hue = (index * 137.5) % 360; // Use golden angle for color distribution
            return `hsl(${hue}, 70%, 50%)`;
        });

        const coloredConditions = displayConditions.map((d, index) => ({
            ...d,
            color: colors[index],
        }));

        const ageData = ageCounts;
        const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));

        return { ageData, genderData, displayConditions: coloredConditions };
    }, [patients]);
    const handleExport = () => {
        const csvData = [
            { Category: 'Age', ...ageData.map((d) => ({ Label: d.name, Count: d.count })) },
            { Category: 'Gender', ...genderData.map((d) => ({ Label: d.name, Count: d.value })) },
            {
                Category: 'Condition',
                ...displayConditions.map((d) => ({ Label: d.name, Count: d.count })),
            },
        ];

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'patient_demographics.csv');
        link.click();
        URL.revokeObjectURL(url);
    };

    return { ageData, genderData, displayConditions, handleExport };

}