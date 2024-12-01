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
import { FaVideo } from "react-icons/fa6";
import { AiFillAudio } from "react-icons/ai";
import { useEffect, useState } from "react";

export function Posts(){
  const [ posts, setPosts ] = useState([]);
  const [ userPost, setUserPost ] = useState();
  const [ postsFilter, setPostsFilter ] = useState([]);
  const uid = useUID(state => state.uid);
  const setPage = usePage(state => state.setPage);
  const time = convertToTimeString(doc.lastMessage.timestamp);
  useEffect(() => {
    if(uid){
      getPosts(uid, setPosts)
    }
  }, []);
  useEffect(() => {
    setUserPost(posts.filter(x => x.uid === uid)[0]);
    setPostsFilter([...posts.filter(x => x.uid != uid).sort((a, b) => a.timestamp - b.timestamp)]);
  }, [posts]);
  return(
    <main className="flex flex-col gap-2 w-full overflow-y-scroll scrollbar">
      <Input placeholder="Search..." onChange={(e) => {
        if(!e.target.value){
          setPostsFilter([...posts.filter(x => x.uid != uid)]);
        }
        setPostsFilter(posts.filter(x => x.uid != uid).filter(x => x.name?.toLowerCase()?.includes(e.target.value.toLowerCase())));
      }}/>
      <section className="flex flex-wrap gap-2 w-full">
        {userData&&<PostCard data={userData} action={} />}
        {postsFilter.map(post => <PostCard data={post} action={}/>)}
      </section>
    </main>
  )
}

function PostCard({ data, action }){
  return(
    <Card className="backdrop-blur-sm flex justify-center items-center w-40 h-60" onClick={action}>
      <CardContent className="flex flex-col items-between justify-start p-2 w-40 h-60 relative">
        <Avatar className="w-10 h-10">
          <AvatarImage className="w-10 h-10 object-cover rounded-full" src={data?.image} alt="profile-image"/>
          <AvatarFallback className="text-md text-primary">{
          data?.name ? data.name[0] : "Z"
          }</AvatarFallback>
        </Avatar>
        <section className="absolute top-0 left-0 w-full h-full z-[-1] flex justify-center items-center">
          {data.lastPost.type === "text" ? 
          <p>{data.lastPost.content}</p> : 
          data.lastPost.type === "image" ? 
          <img className="rounded h-full w-full object-cover" src={data.lastPost.content?.secure_url} /> : 
          data.lastPost.type === "video" ? 
          <div> <FaVideo/> Video</div> : 
          data.lastPost.type === "audio" ? 
          <div> <AiFillAudio/> Audio</div> : null}
        </section>
        <h2 className="text-center self-center text-lg font-semibold w-32 truncate">{data.name}</h2>
      </CardContent>
    </Card>
  )
}