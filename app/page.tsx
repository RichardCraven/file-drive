"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SearchBar } from "./search-bar";


export default function Home() {
  const files = useQuery(api.files.getFiles);
  const isLoading = files === undefined

  return (
    <main className=" mx-auto container pt-12">
      <SearchBar/>
      {isLoading && <div className="flex flex-col gap-8 w-full items-center mt-24">
        <Loader2 className="h-20 w-20  text-grey-500 animate-spin"></Loader2>
        <div className="text-2xl text-gray-700">Loading...</div>
      </div>}

      {!isLoading && files.length === 0 && (
        <div className="flex flex-col gap-8 mx-auto items-center mt-12">
          <Image
          alt="an image of a file directory"
          width="300"
          height="300"
          src="/empty.svg"
          />
          <div className="text-2xl">You have no files, upload one now</div>
          <UploadButton></UploadButton>
        </div>
      )}
      {!isLoading && files.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Your Files</h1>
              <UploadButton></UploadButton>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {files?.map(file => {
                return <FileCard key={file._id} file={file}></FileCard>
              })}
            </div>
          </>
      )}
    </main>
  );
}
