import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContactInfo = ({ patient }) => {
  const { phone_number, email, city, address } = patient;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-2">
          <div className="text-sm font-medium">Phone</div>
          <div className="text-sm">{phone_number}</div>
          <div className="text-sm font-medium">Email</div>
          <div className="text-sm">{email}</div>
          <div className="text-sm font-medium">City</div>
          <div className="text-sm">{city}</div>
          <div className="text-sm font-medium">Address</div>
          <div className="text-sm">{address}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
