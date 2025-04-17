import React, { useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ageBuckets = [
  { label: '0-10', min: 0, max: 10 },
  { label: '11-20', min: 11, max: 20 },
  { label: '21-30', min: 21, max: 30 },
  { label: '31-40', min: 31, max: 40 },
  { label: '41-50', min: 41, max: 50 },
  { label: '51-60', min: 51, max: 60 },
  { label: '61+', min: 61, max: Infinity },
];

const TOP_CONDITIONS_LIMIT = 5;

const PatientDemographics = ({ patients }) => {
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
    const rows = [
      ['Category', 'Label', 'Count'],
      ...ageData.map((d) => ['Age', d.name, d.count]),
      ...genderData.map((d) => ['Gender', d.name, d.value]),
      ...displayConditions.map((d) => ['Condition', d.name, d.count]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patient_demographics.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Demographics</CardTitle>
        <CardDescription>Analysis of patient population</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Distribution */}
        <div className="w-full h-52 md:h-64 lg:h-80">
          <h4 className="text-lg">Age Distribution</h4>
          <ResponsiveContainer>
            <BarChart data={ageData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Ratio */}
        <div className="w-full h-52 md:h-64 lg:h-80">
          <h4 className="text-lg">Gender Ratio</h4>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" outerRadius="60%" label>
                {genderData.map((entry, idx) => (
                  <Cell key={idx} fill={['#3B82F6', '#EF4444'][idx]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Conditions */}
        <div className="w-full h-52 md:h-64 lg:h-80">
          <h4 className="text-lg">Conditions Distribution</h4>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={displayConditions}
                dataKey="count"
                nameKey="name"
                innerRadius="40%"
                outerRadius="80%"
                label
              >
                {displayConditions.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row justify-between gap-4">
        <Button variant="outline" onClick={handleExport} className="w-full md:w-auto">
          <i className="fas fa-download mr-2"></i> Export Data
        </Button>
        <Button variant="outline" onClick={handlePrint} className="w-full md:w-auto">
          <i className="fas fa-print mr-2"></i> Print Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PatientDemographics;
