import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataStreamType, DevicesType, ProjectType } from "@/lib/types";
import { Suspense } from "react";
import Grid from "./Grid";
import { LoadingCom } from "./Loader";
import NewDataStreamBtn from "./NewDataStreamBtn";
import { DataTable } from "./tables/data-table";
import { DataStreamColumn } from "./tables/DataStreamColumn";
import { DeviceColumn } from "./tables/DeviceColumn";

export default async function Project({
  project,
  tab,
  dataStreams,
  devices,
}: {
  project: ProjectType;
  tab: string;
  dataStreams: DataStreamType[];
  devices: DevicesType[];
}) {
  return (
    <div className=" h-full flex flex-col max-w-full">
      <Separator className="mb-3" />
      <div className="flex h-full w-full  flex-col gap-6 ">
        <Tabs defaultValue={tab} className="flex flex-col h-full">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="data_stream">Data Streams</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="flex flex-col min-h-fit  ">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>
                  Create charts and interact with your devices
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 max-w-full">
                <Grid />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Devices</CardTitle>
                <CardDescription>All devices for this project</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <Suspense fallback={<LoadingCom />}>
                  <DataTable
                    columns={DeviceColumn}
                    data={devices}
                    filterName="name"
                  />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="data_stream">
            <Card>
              <CardHeader>
                <CardTitle>Data Streams</CardTitle>
                <CardDescription>
                  To upload data you need to create a data stream
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <Suspense fallback={<LoadingCom />}>
                  <DataTable
                    columns={DataStreamColumn}
                    CreateBtn={<NewDataStreamBtn projectId={project.id} />}
                    data={dataStreams}
                    filterName="title"
                  />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
