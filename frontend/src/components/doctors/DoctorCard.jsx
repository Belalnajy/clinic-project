import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDoctors } from "@/hooks/useDoctors";

const DoctorCard = ({ doctor }) => {
  const { toggleDoctorStatus } = useDoctors();

  const handleToggleActive = () => {
    toggleDoctorStatus({
      id: doctor.id,
      isActive: !doctor.is_active
    });
  };

  const fullName = `${doctor.first_name} ${doctor.last_name}`;
  const initials = `${doctor.first_name?.[0] || ''}${doctor.last_name?.[0] || ''}`;

  return (
    <Card
      className={`w-full max-w-md shadow-md overflow-hidden rounded-xl p-0 transition ${
        doctor.is_active ? "opacity-100 grayscale-0" : "opacity-50 grayscale"
      }`}
    >
      <div className={`${!doctor.is_active ? "pointer-events-none" : ""}`}>
        <CardHeader className="bg-primary-100 p-4 flex items-center space-x-4">
          <Avatar className="h-14 w-14 border-2 border-white shadow">
            <AvatarImage src={doctor.profile_picture} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{fullName}</p>
            <span className="text-sm">{doctor.specialization?.name}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <p className="text-sm text-muted-foreground">{doctor.user?.email}</p>
          <p className="text-sm text-muted-foreground">License: {doctor.license_number}</p>
          <p className="text-sm text-muted-foreground">Experience: {doctor.years_of_experience} years</p>
          <p className="text-sm text-muted-foreground">Email: {doctor.user}</p>
          <p className="text-sm text-muted-foreground">bio: {doctor.bio }</p>
        </CardContent>
      </div>
      <CardContent className="p-4 pt-0">
        <Button
          variant={doctor.is_active ? "outline" : "secondary"}
          onClick={handleToggleActive}
          className="mt-2"
        >
          {doctor.is_active ? "Deactivate" : "Activate"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
