import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { usePage, useUID, getPosts } from "@/store";
import { convertToTimeString } from "@/utils";
import { FaImage, FaVideo, FaFile } from "react-icons/fa6";
import { AiFillAudio } from "react-icons/ai";
import { useEffect, useState } from "react";

export function Posts(){
  const uid = useUID(state => state.uid);
  const setPage = usePage(state => state.setPage);
  const time = convertToTimeString(doc.lastMessage.timestamp);
  
}