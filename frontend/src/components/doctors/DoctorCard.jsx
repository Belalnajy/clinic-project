import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DoctorCard = ({ doctor }) => {
  const [active, setActive] = useState(true);

  const toggleActive = () => {
    setActive(!active);
  };

  return (
    <Card
      className={`w-full max-w-md shadow-md overflow-hidden rounded-xl p-0 transition ${
        active ? "opacity-100 grayscale-0" : "opacity-50 grayscale"
      }`}
    >
      <div className={`${!active ? "pointer-events-none" : ""}`}>
        <CardHeader className="bg-primary-100 p-4 flex items-center space-x-4">
          <Avatar className="h-14 w-14 border-2 border-white shadow">
            <AvatarImage src={doctor.avatar} />
            <AvatarFallback>
              {doctor.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{doctor.name}</p>
            <span className="text-sm">{doctor.specialization}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <p className="text-sm text-muted-foreground">{doctor.email}</p>
          <p className="text-sm text-muted-foreground">{doctor.phone}</p>
          <p className="text-sm text-muted-foreground">{doctor.role}</p>
        </CardContent>
      </div>
      <CardContent className="p-4 pt-0">
        <Button
          variant="outline"
          onClick={toggleActive}
          className="mt-2"
        >
          {active ? "Deactivate" : "Activate"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
