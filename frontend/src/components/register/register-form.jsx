import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorRegisterForm } from "./doctor-register-form";
import { SecretaryRegisterForm } from "./secretary-register-form";
import { User, Stethoscope } from "lucide-react";

export function RegisterForm({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0">
          <div className="flex flex-col items-center text-center p-6 border-b">
            <h1 className="text-2xl font-bold">Add User</h1>
            <p className="text-balance text-muted-foreground">
              Register a new doctor or secretary
            </p>
          </div>

          <Tabs defaultValue="doctor" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 rounded-none border-b">
              <TabsTrigger
                value="doctor"
                className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">
                <Stethoscope className="h-4 w-4" />
                Doctor
              </TabsTrigger>
              <TabsTrigger
                value="secretary"
                className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">
                <User className="h-4 w-4" />
                Secretary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="doctor" className="p-6">
              <DoctorRegisterForm />
            </TabsContent>

            <TabsContent value="secretary" className="p-6">
              <SecretaryRegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
