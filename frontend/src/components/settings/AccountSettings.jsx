import useSettingsForm from '@/hooks/useSettingsForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
function AccountSettings() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useSettingsForm();

  const newPassword = watch('newPassword');

  const onSubmit = (data) => {
    console.log('Password change:', data);
  };

  return (
    <Card className="shadow-sm border rounded-xl">
      <CardContent className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Account Settings</h2>
          <p className="text-sm text-muted-foreground">Update your account credentials and security</p>
        </div>

        <Separator />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <Label>Username</Label>
            <Input disabled value="doctor" />
            <p className="text-xs text-muted-foreground">Username cannot be changed</p>
          </div>

          <Separator />
          <div className="space-y-4">
            <h3 className="text-md font-semibold">Change Password</h3>

            <div>
              <Label>Current Password</Label>
              <Input type="password" {...register('currentPassword', { required: true })} />
              {errors.currentPassword && <p className="text-red-500 text-sm">Current password is required</p>}
            </div>

            <div>
              <Label>New Password</Label>
              <Input type="password" {...register('newPassword', { required: true })} />
              {errors.newPassword && <p className="text-red-500 text-sm">New password is required</p>}
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                {...register('confirmPassword', {
                  required: true,
                  validate: (value) => value === newPassword || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Update Password</Button>
          </div>
        </form>

        <Separator />
        <div className="pt-4">
          <h3 className="text-md font-semibold text-red-600">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="">Delete Account</Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default AccountSettings;