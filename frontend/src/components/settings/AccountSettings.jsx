import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useSettingsForm from "@/hooks/useSettingsForm";

function AccountSettings() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
    getValues
  } = useSettingsForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');

  const onSubmit = (data) => {
    // Add your password change logic here
  };

  const handleDeleteAccount = () => {
    // Add your delete account logic here
  };

  const validatePasswords = async () => {
    return await trigger(['currentPassword', 'newPassword', 'confirmPassword']);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Update your account credentials and security</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              disabled
              defaultValue="doctor"
            />
            <p className="text-xs text-slate-500">
              Username cannot be changed
            </p>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register('currentPassword', { 
                  required: {
                    value: true,
                    message: 'Current password is required'
                  },
                  minLength: {
                    value: 8,
                    message: 'Current password must be at least 8 characters'
                  }
                })}
                onChange={(e) => {
                  setValue('currentPassword', e.target.value, { shouldValidate: true });
                }}
              />
              {errors.currentPassword && (
                <div className="text-red-500 text-sm">
                  <p>{errors.currentPassword.message}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register('newPassword', { 
                  required: {
                    value: true,
                    message: 'New password is required'
                  },
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  validate: {
                    notSame: (value) => 
                      value !== watch('currentPassword') || 
                      'New password must be different from current password'
                  }
                })}
                onChange={(e) => {
                  setValue('newPassword', e.target.value, { shouldValidate: true });
                }}
              />
              {errors.newPassword && (
                <div className="text-red-500 text-sm">
                  <p>{errors.newPassword.message}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: {
                    value: true,
                    message: 'Please confirm your password'
                  },
                  validate: {
                    matches: (value) => 
                      value === newPassword || 
                      'Passwords do not match'
                  }
                })}
                onChange={(e) => {
                  setValue('confirmPassword', e.target.value, { shouldValidate: true });
                }}
              />
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm">
                  <p>{errors.confirmPassword.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              onClick={validatePasswords}
            >
              Update Password
            </Button>
          </div>
        </form>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
          <p className="text-sm text-slate-500">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button 
            variant="destructive"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountSettings;