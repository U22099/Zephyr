import { useState, useEffect } from "react";
import { getAllUsers } from "@/utils";
import { useUID, useUserData } from "@/store";
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
  const userData = useUserData(state => state.userData);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);
  const [sentRequest, setSentRequest] = useState([]);
  const [people, setPeople] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    setLoading(true);
    getAllUsers(setData);
    setLoading(false);
  });
  useEffect(() => {
    if(data){
      setFriends(data.filter(x => userData.friends.includes(x.uid)));
      setFriendRequest(data.filter(x => userData.friendRequest.includes(x.uid)));
      setSentRequest(data.filter(x => userData.sentRequest.includes(x.uid)));
      setPeople(data.filter(x => !(x.uid === uid)&&!userData.friends.includes(x.uid)&&!userData.friendRequest.includes(x.uid)&&!userData.sentRequest.includes(x.uid)));
    }
  }, [data]);
  if (loading) {
    return <Loading  className="w-full h-full"/>
  }
  return (
    <main className="flex flex-col gap-2 w-full">
      <section className="flex flex-col gap-2 w-full">
        <h2 className="text-xl font-bold">Friends</h2>
        {friends&&friends.sort((a, b) => a.username.localeCompare(b.username)).map((doc,i) => <CardList key={i} doc={doc} disabled={true} variant={"outline"} text={"Added"}/>)}
      </section>
      <section className="flex flex-col gap-2 w-full">
        <h2 className="text-xl font-bold">Recieved Requests</h2>
        {friendRequest&&friendRequest.sort((a, b) => a.username.localeCompare(b.username)).map((doc,i) => <CardList key={i} doc={doc} disabled={false} variant={"default"} text={"Accept"}/>)}
      </section>
      <section className="flex flex-col gap-2 w-full">
        <h2 className="text-xl font-bold">Sent Request</h2>
        {sentRequest&&sentRequest.sort((a, b) => a.username.localeCompare(b.username)).map((doc,i) => <CardList key={i} doc={doc} disabled={false} variant={"outline"} text={"Revoke"}/>)}
      </section>
      <section className="flex flex-col gap-2 w-full">
        <h2 className="text-xl font-bold">New People</h2>
        {people&&people.sort((a, b) => a.username.localeCompare(b.username)).map((doc,i) => <CardList key={i} doc={doc} disabled={false} variant={"default"} text={"Add"}/>)}
      </section>
    </main>
  )
}

function CardList({ doc, i, variant, text, disabled }) {
  return (
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
        <Button variant={variant} disabled={disabled}>{text}</Button>
      </CardContent> 
    </Card>
  )
}