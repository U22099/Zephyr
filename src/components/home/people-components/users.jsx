import { useState, useEffect } from "react";
import { getAllUsers } from "@/utils";
import { useUID, useUserData, usePage } from "@/store";
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

export function Users() {
  const uid = useUID(state => state.uid);
  const setPage = usePage(state => state.setPage)
  const { userData, setUserData } = useUserData();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [people, setPeople] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    setLoading(true);
    getAllUsers(setData);
  });
  useEffect(() => {
    if (data) {
      setLoading(false);
      setPeople(data.filter(x => x.type === "personal") || []);
      setGroups(data.filter(x => x.type === "group"));
    }
  }, [data]);
  if (loading) {
    return <Loading  className="w-full h-full"/>
  }
  return (
    <main className="flex flex-col gap-2 w-full">
      <section className="flex flex-col gap-2 w-full">
        <h2 className="text-xl font-bold">People</h2>
        {people&&people.sort((a, b) => a.username.localeCompare(b.username)).map((doc,i) => <CardList key={i} doc={doc}  action={() => setPage({
          open: true,
          component: "chat",
          data: {
            ...doc
          }
        })}/>)}
      </section>
      <section className="flex flex-col gap-2 w-full">
        <h2 className="text-xl font-bold">Groups</h2>
        {groups&&groups.sort((a, b) => a.name.localeCompare(b.name)).map((doc,i) => <CardList key={i} doc={doc} action={() => setPage({
              open: true,
              component: "chat",
              data: {
                ...doc
              }
          })}/>)}
      </section>
    </main>
  )
}

function CardList({ doc, i, action }) {
  return (
    <Card key={i} className="flex w-full justify-center items-center p-1" onClick={action}>
      <CardContent className="flex gap-2 w-full">
        <Avatar className="w-12 h-12">
          <AvatarImage className="w-12 h-12 object-cover rounded-full" src={doc?.image} alt="profile-image"/>
          <AvatarFallback className="text-3xl text-primary">{
          doc?.name ? doc.name[0] : "Z"
          }</AvatarFallback>
        </Avatar>
        <section className="py-1 h-full flex flex-col justify-center gap-1 w-full">
          <h2 className="text-lg font-bold">{doc?.name}</h2>
          <p className="truncate text-sm text-muted-foreground">{doc?.bio}</p>
        </section>
      </CardContent> 
    </Card>
  )
}