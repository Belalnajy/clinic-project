import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const GenderRatio = ({ genderData }) => {
  return (
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
  );
};

export default GenderRatio;
