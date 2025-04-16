import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useSettingsForm from "@/hooks/useSettingsForm";

function ProfileSettings() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useSettingsForm();

  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const name = watch("name") || "John Doe";
  const userRole = watch("role") || "doctor"; // replace with actual auth role logic

  const onSubmit = (data) => console.log("Profile update:", data);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal details and information</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>
                {name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
                <i className="fas fa-upload mr-2"></i> Change Avatar
              </Button>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-slate-500 mt-2">
                JPG, GIF or PNG. Max size of 2MB.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Dr. John Doe"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 890"
                {...register("phone")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="Cardiology, Pediatrics, etc."
                {...register("specialization", { required: "Specialization is required" })}
                disabled={userRole !== "admin"}
              />
              {errors.specialization && <p className="text-red-500 text-sm">{errors.specialization.message}</p>}
              {userRole !== "admin" && (
                <p className="text-xs text-slate-500">
                  Contact administration to update your specialization.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-6">
            <Button variant="outline" type="button">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProfileSettings;
