import { useState, useEffect } from "react";
import { usePeople } from "@/store";
import { getAllUsers } from "@/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/loading";

export function Users(){
  const [ loading, setLoading ] = useState(false);
  const [ query, setQuery ] = useState(0);
  const [ data, setData ] = useState([]);
  const limit = 100;
  useEffect(() => {
    setLoading(true);
    if(!data){
      console.log("called")
      getAllUsers(setData);
    } else if(data && !data.slice(query, query+20)) {
      console.log("called2")
      getAllUsers(setData, data);
    }
    setLoading(false);
  }, [query]);
  if(loading){
    return <Loading />
  }
  return(
    <main className="flex flex-col gap-2 w-full">
      {data&&data.slice(query, query+20)?.sort((a, b) => a.username.localeCompare(b.username)).map((doc,i) => {
        return(
          <Card key={i} className="flex w-full">
            <CardContent className="flex gap-2 w-full">
              <Avatar className="w-16 h-16">
                <AvatarImage className="w-16 h-16 object-cover rounded-full" src={doc?.image} alt="profile-image"/>
                <AvatarFallback className="text-3xl text-primary">{doc?.username ? doc.username[0] : "Z"}</AvatarFallback>
              </Avatar>
              <section className="py-1 h-full flex flex-col justify-center gap-1 w-full">
                <h1 className="text-xl font-bold">{doc?.username}</h1>
                <p className="truncate text-sm">{doc?.bio}</p>
              </section>
              <Button>Add</Button>
            </CardContent>
          </Card>
        )
      })}
      <section className="flex justify-between w-full px-2">
        <Button onClick={() => setQuery(query <= 0 ? 0 : (query-20))}>Previous</Button>
        <Button onClick={() => setQuery(data.length&&data.length < 20 ? 0 : query+20)}>Next</Button>
      </section>
    </main>
  )
}