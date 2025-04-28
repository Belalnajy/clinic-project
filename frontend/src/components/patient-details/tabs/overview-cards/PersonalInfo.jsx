import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAge } from '@/lib/utils';

const PersonalInfo = ({ patient }) => {
  const { birth_date, gender, blood_type, height, weight } = patient;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-2">
          <div className="text-sm font-medium">Age</div>
          <div className="text-sm">{getAge(birth_date)} years</div>
          <div className="text-sm font-medium">Gender</div>
          <div className="text-sm">{gender}</div>
          <div className="text-sm font-medium">Blood Type</div>
          <div className="text-sm">{blood_type}</div>
          <div className="text-sm font-medium">Height</div>
          <div className="text-sm">{height} cm</div>
          <div className="text-sm font-medium">Weight</div>
          <div className="text-sm">{weight} kg</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
