"use client";
import { NewDeviceActions } from "@/app/actions/NewDevice";
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
import { DeviceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { ProjectType } from "@/lib/types";

const initialState = { errors: {}, success: false };

export default function NewDeviceForm({
  id,
  projects,
}: {
  id: string | null;
  projects: ProjectType[] | null;
}) {
  const [, action, pending] = useActionState(NewDeviceActions, initialState);

  const form = useForm<z.infer<typeof DeviceSchema>>({
    resolver: zodResolver(DeviceSchema),
    defaultValues: {
      name: "",
      description: "",
      deviceType: "ESP32",
      projectId: id || "",
    },
  });

  return (
    <Form {...form}>
      <form action={action} className="space-y-8 max-w-4xl mx-auto">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name..." {...field} name="name" />
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

        <FormField
          control={form.control}
          name="deviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                name="deviceType"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a device type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DeviceSchema.shape.deviceType.options.map(
                    (device, index) => (
                      <SelectItem value={device} key={index}>
                        {device.replace(/_/g, " ")}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        {id && <Input type="hidden" value={id} name="projectId" readOnly />}
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => {
            // is only true if id is non null
            // double negation
            const isReadOnly = !!id;

            return (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || projects?.[0]?.id}
                  name="projectId"
                  disabled={isReadOnly}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select a project"
                        defaultValue={field.value}
                      ></SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects?.map((project, index) => (
                      <SelectItem value={project.id} key={index}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
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
            <span>Create New Device</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
