import ApiKeys from "@/components/ApiKeys";
import DeleteAccount from "@/components/DeleteAccount";
import Header from "@/components/Header";
import { LoadingCom } from "@/components/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await currentUser();
  if (!user) return redirect("/");
  const params = await searchParams;
  const role = String(user?.publicMetadata.role).toUpperCase() || "student";

  const tab = typeof params.tab === "string" ? params.tab : "account";
  const username = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`;

  return (
    <div className="py-2 px-3">
      <Header classnames="mb-4">Settings</Header>
      <div className="flex-1 w-full  flex-col gap-6">
        <Tabs defaultValue={tab} className=" h-full">
          <TabsList className="mb-2">
            <TabsTrigger value="account">Profile</TabsTrigger>
            <TabsTrigger value="apikeys">API Keys</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-name">Username</Label>
                  <Input id="tabs-demo-name" disabled defaultValue={username} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-username">Email</Label>
                  <Input
                    type="email"
                    disabled
                    defaultValue={user?.emailAddresses[0].emailAddress}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-username">Role</Label>
                  <Input disabled defaultValue={role || ""} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-username">Created At</Label>
                  <Input
                    disabled
                    defaultValue={new Date(user.createdAt).toDateString()}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <DeleteAccount />
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="apikeys">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Create and manage all API keys here. You need an API key for
                  accessing and integrating with our platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid">
                <Suspense fallback={<LoadingCom />}>
                  <ApiKeys />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
