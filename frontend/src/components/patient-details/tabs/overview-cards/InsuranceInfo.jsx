import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InsuranceInfo = ({ patient }) => {
  const { insurance_provider, insurance_number, insurance_expiration_date } = patient;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-2">
          <div className="text-sm font-medium">Provider</div>
          <div className="text-sm">{insurance_provider}</div>
          <div className="text-sm font-medium">Policy Number</div>
          <div className="text-sm">{insurance_number}</div>
          <div className="text-sm font-medium">Expiry Date</div>
          <div className="text-sm">{insurance_expiration_date}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceInfo;
