import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Doc, Id } from "@/convex/_generated/dataModel"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, TrashIcon } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { ReactNode, useState } from "react"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

function FileCardActions({file}: {file: Doc<"files">}){
    const deleteFile = useMutation(api.files.deleteFile)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const {toast} = useToast();
    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={async () => {
                        // TODO: Actually delete
                        console.log('okay deleting for ', file._id);
                        await deleteFile({
                            fileId: file._id
                        })

                        toast({
                            variant: 'default',
                            title: "File deleted",
                            description: "File has been deleted from the system",
                          })
                    }}>
                        Continue
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={()=>{setIsConfirmOpen(true)}} className="flex gap-1 text-red-600 items-center cursor-pointer">
                        <TrashIcon className="w-4 h-4"></TrashIcon>
                        Delete
                    </DropdownMenuItem>
                    {/* <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

function getFileUrl(fileId: Id<"_storage">): string{
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}

import type { ImageLoaderProps } from 'next/image';

// const myLoader=({src}: ImageLoaderProps)=>{
//     return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
//   }

export function FileCard({file}: {file: Doc<"files">}){
    const typeIcons = {
        'image': <ImageIcon/>,
        'pdf': <FileTextIcon/>,
        'csv' : <GanttChartIcon/>
    } as Record<Doc<"files">["type"], ReactNode>;

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex justify-start gap-4">
                    <div>{typeIcons[file.type]} </div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file}/>
                </div>
                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent className="text-center h-[200px] flex justify-center items-center">
                {
                    file.type === 'image' && 
                    <Image
                        // loader={getFileUrl(file.fileId)}
                        alt={file.name}
                        src={getFileUrl(file.fileId)}
                        width="250" 
                        height="150"
                    />
                    // <Image
                    //     alt={file.name}
                    //     src={file.url}
                    //     width="100%" height="100%"
                    // />
                }
            </CardContent>
            <CardFooter>
                <Button
                    onClick={()=>{
                        window.open(getFileUrl(file.fileId), "_blank")
                    }}
                >Download</Button>
            </CardFooter>
        </Card>
    )
}

