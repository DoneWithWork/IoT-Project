"use client";
import { NewApiKeyAction } from "@/app/actions/NewApiKey";
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
import { ApiKeySchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
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

export default function NewApiKeyForm() {
  const [state, action, pending] = useActionState(
    NewApiKeyAction,
    initialState
  );

  const form = useForm<z.infer<typeof ApiKeySchema>>({
    resolver: zodResolver(ApiKeySchema),
    defaultValues: {
      name: "",
      type: "READ",
    },
  });
  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([fieldName, errors]) => {
        if (fieldName in ApiKeySchema.shape) {
          form.setError(
            fieldName as keyof z.infer<typeof ApiKeySchema>,
            {
              message: errors.join(", "),
            },
            {
              shouldFocus: true,
            }
          );
        }
      });
    }
  }, [state, form]);
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                name="type"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="READ">READ</SelectItem>
                  <SelectItem value="READ_WRITE">READ_WRITE</SelectItem>
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
            <span>Create New Key</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
