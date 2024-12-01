import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { usePage, useUID } from "@/store";
import { convertToTimeString, getPosts } from "@/utils";
import { FaPlus } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { AiFillAudio } from "react-icons/ai";
import { useEffect, useState } from "react";

export function Posts() {
  const [posts, setPosts] = useState([]);
  const [userPost, setUserPost] = useState();
  const [postsFilter, setPostsFilter] = useState([]);
  const uid = useUID(state => state.uid);
  const setPage = usePage(state => state.setPage);
  useEffect(() => {
    if (uid) {
      getPosts(uid, setPosts)
    }
  }, [uid]);
  useEffect(() => {
    if(posts){
      setUserPost(posts.find(x => x.uid === uid));
      setPostsFilter([...posts.filter(x => (x.uid != uid) || (x.uid != uid && x.lastPost != {})).sort((a, b) => a.lastPost?.timestamp - b.lastPost?.timestamp)]);
    }
  }, [posts]);
  return (
    <main className="flex flex-col gap-2 w-full overflow-y-scroll scrollbar">
      <Input placeholder="Search..." onChange={(e) => {
        if(!e.target.value){
          setPostsFilter([...posts.filter(x => (x.uid != uid) || (x.uid != uid && x.lastPost != {})).sort((a, b) => a.lastPost?.timestamp - b.lastPost?.timestamp)]);
        }
        setPostsFilter(posts.filter(x => (x.uid != uid) || (x.uid != uid && x.lastPost != {})).filter(x => x.name?.toLowerCase()?.includes(e.target.value.toLowerCase())));
      }}/>
      <section className="flex flex-wrap gap-2 w-full">
        {userPost&&<PostCard data={{
          ...userPost,
          name: "Add Status"
        }} action={() => setPage({
          open: true,
          component: "add-status"
        })} />}
        {userPost?.lastPost?.content&&<PostCard data={userPost} action={() => setPage({
          open: true,
          component: "view-status",
          data: {
            ...userPost,
          }
        })} />}
        {postsFilter.map((post,i) => <PostCard key={i} data={post} action={() => setPage({
          open: true,
          component: "view-status",
          data: {
            ...post,
          }
        })}/>)}
      </section>
    </main>
  )
}

function PostCard({ data, action }) {
  return (
    <Card className="backdrop-blur-sm flex justify-center items-center w-24 h-40 overflow-hidden" onClick={action}>
      <CardContent className="flex flex-col items-start justify-between p-2 w-24 h-40 relative">
        {data.name === "Add Status" ? 
         <div className="p-2 rounded-full bg-primary flex justify-center items-center w-12 h-12">
          <FaPlus className="text-xl fill-black dark:fill-white"/>
        </div> : <Avatar className="w-10 h-10">
          <AvatarImage className="w-10 h-10 object-cover rounded-full" src={data?.image} alt="profile-image"/>
          <AvatarFallback className="text-md text-primary">{
          data?.name ? data.name[0] : "Z"
          }</AvatarFallback>
        </Avatar>}
        <section className="absolute top-0 left-0 w-full h-full z-[-1] flex justify-center items-center p-1 break-words text-center bg-primary">
          {data.lastPost.type === "text" ? 
          <p className="text-sm truncate">{data.lastPost.content}</p> : 
          data.lastPost.type === "image" ? 
          <img className="rounded h-full w-full object-cover" src={data.lastPost.content?.secure_url} /> : 
          data.lastPost.type === "video" ? 
          <div> <FaVideo/> Video</div> : 
          data.lastPost.type === "audio" ? 
          <div> <AiFillAudio/> Audio</div> : null}
        </section>
        <h2 className="text-center self-end text-md font-semibold w-20 truncate">{data.name}</h2>
      </CardContent>
    </Card>
  )
}