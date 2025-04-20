import React from 'react';
import { TabsList, TabsTrigger } from './ui/tabs';

const CustomTabsList = ({ tabsData }) => {
  return (
    <TabsList className="mb-4">
      {tabsData.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default CustomTabsList;
