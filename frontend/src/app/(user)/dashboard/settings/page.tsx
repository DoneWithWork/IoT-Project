import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";

import ApiKeys from "@/components/ApiKeys";
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
import { Loader2Icon } from "lucide-react";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const tab = typeof params.tab === "string" ? params.tab : "account";
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
                <CardDescription>
                  Make changes to your account here. Click save when you&apos;re
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-name">Name</Label>
                  <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-username">Username</Label>
                  <Input id="tabs-demo-username" defaultValue="@peduarte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
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
                {/* Table  */}
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
function LoadingCom() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <Loader2Icon className="animate-spin size-10" />
    </div>
  );
}
