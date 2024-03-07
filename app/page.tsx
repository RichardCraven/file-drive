"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from "react";
import { Loader2 } from "lucide-react";


const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z.instanceof(FileList)
})
 


export default function Home() {
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

    const postUrl = await generateUploadUrl();
    
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    try {
      await createFile({
        name: values.title,
        fileId: storageId
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
  const files = useQuery(api.files.getFiles);
  const createFile = useMutation(api.files.createFile);

  return (
    <main className=" mx-auto max-w-2xl py-8flex min-h-screen flex-col items-center justify-between p-24">
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
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>}
                    Submit
                  </Button>
                </form>
              </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      
      {files?.map(file => {
        return <div key={file._id}>
          {file.name}
        </div>
      })}
    </main>
  );
}
