import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const TopConditions = ({ displayConditions }) => {
  return (
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
  );
};

export default TopConditions;
