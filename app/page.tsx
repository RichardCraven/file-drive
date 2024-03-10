"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import UploadButton from "./upload-button";
import { FileCard } from "./file-card";


export default function Home() {
  const files = useQuery(api.files.getFiles);

  return (
    <main className=" mx-auto container pt-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <UploadButton></UploadButton>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {files?.map(file => {
          return <FileCard key={file._id} file={file}></FileCard>
        })}
      </div>
    </main>
  );
}
