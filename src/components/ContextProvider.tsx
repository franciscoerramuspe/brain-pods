"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookIcon, FileIcon, TextIcon } from "@/components/Icons";
import { useState, useRef } from "react";
import { TextContext } from "@/interfaces/types";

export default function ContextProvider() {
  const [contextList, setContextList] = useState<[TextContext | File][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLButtonElement>(null);

  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");

  const handleTextClick = () => {
    setTitle("");
    setText("");

    if (textInputRef.current) {
      textInputRef.current.click();
    }
  };

  const handleTextUpload = () => {
    setContextList((prevList) => [...prevList, [{ title: title, text: text }]]);
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      const file = fileInputRef.current.files?.[0];
      // Validate file type (only pdf or txt) and size (max 10mb)
      if (
        file &&
        (file.type === "application/pdf" || file.type === "text/plain") &&
        file.size <= 10 * 1024 * 1024
      ) {
        setContextList((prevList) => [...prevList, [file]]);
      } else {
        alert("Invalid file type or size");
      }
    }
  };

  return (
    <div className="bg-[#2C2B27] border border-[#3B3A36] p-3 rounded-md min-w-[25rem] min-h-[20rem]">
      <Dialog>
        <DialogTrigger className="hidden" ref={textInputRef}>
          Open
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Text Context</DialogTitle>
            <DialogDescription>
              Describe what you want your AI to ask or know about the context of
              the pod.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-2">
              <Input
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-2">
              <Textarea
                id="text"
                placeholder="Context"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={handleTextUpload}>
                Add Context
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <BookIcon className="w-6 h-6 text-gray-200" />
          <h2 className="text-gray-200 font-bold font-adversecase-regular text-lg">
            Pod Knowledge
          </h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-[#3B3A36] border border-[#4A4945] p-1 rounded-md text-blue-500">
              Add Context
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Context Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              className="cursor-pointer"
              onCheckedChange={handleTextClick}
            >
              Text
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="cursor-pointer"
              onCheckedChange={handleFileClick}
            >
              File
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* division line */}
      <div className="border-b border-[#4A4945] my-2"></div>

      <div className="flex flex-col gap-2">
        {contextList.map((context, index) => (
          <div className="flex flex-row gap-2" key={index}>
            <div className="flex flex-row gap-2 items-center bg-[#3B3A36] border border-[#4A4945] p-1 rounded-md">
              {context[0] instanceof File ? (
                <div className="flex flex-row gap-2 items-center">
                  <FileIcon className="w-6 h-6 text-gray-200" />
                  <p className="text-gray-400">{context[0].name}</p>
                </div>
              ) : (
                <div className="flex flex-row gap-2 items-center">
                  <TextIcon className="w-6 h-6 text-gray-200" />
                  <p className="text-gray-400">{context[0].title}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* no context added */}
      {contextList.length === 0 && (
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-gray-400 text-center">No context added</p>
        </div>
      )}
    </div>
  );
}
