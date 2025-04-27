import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const Overview = () => {
  const currentCondition = [];
  const currentMedications = [];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="space-y-4">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-sm font-medium">Age</div>
              <div className="text-sm">N/A years</div>
              <div className="text-sm font-medium">Gender</div>
              <div className="text-sm">N/A</div>
              <div className="text-sm font-medium">Blood Type</div>
              <div className="text-sm">N/A</div>
              <div className="text-sm font-medium">Height</div>
              <div className="text-sm">N/A cm</div>
              <div className="text-sm font-medium">Weight</div>
              <div className="text-sm">N/A kg</div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information  */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-sm font-medium">Phone</div>
              <div className="text-sm">N/A</div>
              <div className="text-sm font-medium">Email</div>
              <div className="text-sm">N/A</div>
              <div className="text-sm font-medium">Address</div>
              <div className="text-sm">N/A</div>
              <div className="text-sm font-medium">Emergency Contact</div>
              <div className="text-sm">N/A(name) - N/A(relation) - N/A(Phone)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {/* Current Condition */}
        <Card>
          <CardHeader>
            <CardTitle>Current Condition</CardTitle>
          </CardHeader>
          <CardContent>
            {currentCondition ? (
              <div className="space-y-1">
                <div className="text-sm font-medium">Diagnosis</div>
                <div className="text-sm">N/A</div>
                <div className="text-sm font-medium">Description</div>
                <div className="text-sm">N/A</div>
                <div className="text-sm font-medium">Notes</div>
                <div className="text-sm">N/A</div>
                <div className="text-sm font-medium">Record Date</div>
                <div className="text-sm">N/A</div>
              </div>
            ) : (
              <div className="text-sm">No current condition found.</div>
            )}
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentMedications?.length > 0 ? (
                currentMedications.map((med, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-sm font-medium">N/A</div>
                    <div className="text-sm">Dosage: N/A</div>
                    <div className="text-sm">Frequency: N/A</div>
                    <div className="text-sm">Duration: N/A</div>
                    <div className="text-sm">Instructions: N/A</div>
                  </div>
                ))
              ) : (
                <div className="text-sm">No current medications found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card>
          <CardHeader>
            <CardTitle>Insurance Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-sm font-medium">Provider</div>
              <div className="text-sm">N/A</div>
              <div className="text-sm font-medium">Policy Number</div>
              <div className="text-sm">N/A</div>
              <div className="text-sm font-medium">Expiry Date</div>
              <div className="text-sm">N/A</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
