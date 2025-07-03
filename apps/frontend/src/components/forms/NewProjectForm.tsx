"use client";
import { NewProjectAction } from "@/app/actions/NewProject";
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
import { NewProjectSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const initialState = { errors: {}, success: false, formErrors: [] };
type NewProjectActionReturn = {
  success: boolean;
  errors: Record<string, string[]>;
  formErrors: string[];
};
export default function NewProjectForm() {
  const form = useForm<z.infer<typeof NewProjectSchema>>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const [state, action, pending] = useActionState<
    NewProjectActionReturn,
    FormData
  >(NewProjectAction, initialState);
  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([fieldName, errors]) => {
        if (fieldName in NewProjectSchema.shape) {
          form.setError(
            fieldName as keyof z.infer<typeof NewProjectSchema>,
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
    if (state?.formErrors && state.formErrors.length > 0) {
      toast(state.formErrors[0]);
    }
  }, [state, form]);
  return (
    <Form {...form}>
      <form action={action} className="space-y-8 max-w-4xl mx-auto">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
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
                <Input placeholder="Description" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={pending} type="submit">
          {pending && <Loader2 className="animate-spin size-6" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
