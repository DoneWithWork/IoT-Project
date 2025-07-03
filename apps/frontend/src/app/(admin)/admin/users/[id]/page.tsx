import RoleChange from "@/components/admin/RoleChange";
import Header from "@/components/Header";
import { LoadingCom } from "@/components/Loader";
import { Button } from "@/components/ui/button";
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
import { getCachedUser } from "@/lib/data";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCachedUser(id);
  if (!user) return redirect("/admin/users");
  return (
    <div className="px-3 py-4">
      <div className="flex flex-row items-center gap-3">
        <Header>User: {user?.username}</Header>
        <Image
          src={user?.profile || ""}
          alt="user profile image"
          width={100}
          height={100}
          className="rounded-full size-14"
        />
      </div>
      <Tabs defaultValue="account" className=" h-full">
        <TabsList className="mb-2">
          <TabsTrigger value="account">Profile</TabsTrigger>
          <TabsTrigger value="apikeys">API Keys</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Account details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input id="username" disabled defaultValue={user?.username} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">Email</Label>
                <Input type="email" disabled defaultValue={user?.email} />
              </div>
              <div className="grid gap-3">
                <RoleChange user={user} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">Created At</Label>
                <Input
                  disabled
                  defaultValue={new Date(user.createdAt).toDateString()}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center gap-5">
              <Button className="hover:cursor-pointer" variant={"destructive"}>
                Delete User
              </Button>
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
              <Suspense fallback={<LoadingCom />}></Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
