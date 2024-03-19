"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";


const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z.custom<FileList>((val) => val instanceof FileList, "Required")
  .refine((files) => files.length > 0, `Required`),
})

export default function UploadButton() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })
  
  const fileRef = form.register("file")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values.file)
    const fileType = values.file[0].type;
    const postUrl = await generateUploadUrl();
    
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileType },
      body: values.file[0],
    });
    console.log('file type: ', fileType);
    const { storageId } = await result.json();

    const types = {
        'image/jpeg': 'image',
        'image/png': 'image',
        'application/pdf': 'pdf',
        'text/csv' : 'csv'
    } as Record<string, Doc<"files">["type"]>;
    console.log('mapped file type: ', types[fileType]);
    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        type: types[fileType]
      })
  
      form.reset();
      setIsFileDialogOpen(false)
  
      toast({
        variant: 'success',
        title: "File uploaded",
        description: "ready for consumption",
      })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: "Something went wrong",
        description: "Your file could not be uploaded",
      })
    }
    
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
  const createFile = useMutation(api.files.createFile);

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
    setIsFileDialogOpen(isOpen);
    form.reset();
    }}>
    <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
        <Button onClick={() => {}}>Upload File</Button> 
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                        <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                            <Input 
                            type='file' {...fileRef}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                    className="flex gap-2"
                    >
                    {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin"></Loader2>}
                    Submit
                    </Button>
                </form>
            </Form>
        </DialogHeader>
    </DialogContent>
    </Dialog>
  );
}