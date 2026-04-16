import { currentUser } from '@clerk/nextjs/server';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function SettingsPage() {
  const user = await currentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account settings</p>
      </div>

      {/* Profile Settings */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">Profile Information</h2>

        <div className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                value={user?.emailAddresses[0]?.emailAddress || ''}
                disabled
                className="bg-muted"
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input
                type="text"
                value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
                disabled
                className="bg-muted"
              />
            </Field>
          </FieldGroup>

          <p className="text-sm text-muted-foreground">
            To update your profile information, please visit your account settings in the top right corner.
          </p>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">Preferences</h2>

        <div className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Default Currency</FieldLabel>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Language</FieldLabel>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </Field>
          </FieldGroup>

          <Button className="mt-6">Save Preferences</Button>
        </div>
      </div>
    </div>
  );
}
