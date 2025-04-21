import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
const AgeDistribution = ({ ageData }) => {
  return (
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
  );
};

export default AgeDistribution;
