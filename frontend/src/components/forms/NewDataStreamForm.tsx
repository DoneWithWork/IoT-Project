"use client";
import { NewDataStreamAction } from "@/app/actions/NewDataStream";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DataStreamSchema } from "@/lib/schema";
import { DevicesType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogClose } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const initialState = { errors: {}, success: false };

export default function NewDataStreamForm({
  devices,
}: {
  devices: DevicesType[];
}) {
  const pathName = usePathname();
  const segments = pathName.split("/");
  const projectId = segments[segments.length - 1];
  const [, action, pending] = useActionState(NewDataStreamAction, initialState);

  const form = useForm<z.infer<typeof DataStreamSchema>>({
    resolver: zodResolver(DataStreamSchema),
    defaultValues: {
      title: "",
      description: "",
      deviceId: "",
    },
  });

  return (
    <Form {...form}>
      <form action={action} className="space-y-8 max-w-4xl mx-auto">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name..." {...field} name="title" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter description..."
                  {...field}
                  name="description"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Input hidden name="projectId" value={projectId} readOnly />
        <FormField
          control={form.control}
          name="deviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || devices[0]?.id}
                name="deviceId"
                disabled={devices.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a device" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {devices &&
                    devices.map((device, index) => (
                      <SelectItem value={device.id} key={index}>
                        {device.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-4 items-center">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={pending}
            type="submit"
            className="bg-green-400 hover:bg-green-500 text-gray-900"
          >
            {pending && <Loader2 className="animate-spin size-6" />}
            <span>Create New Data Stream</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
