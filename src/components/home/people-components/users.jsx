import { useState, useEffect } from "react";
import { getAllUsers, createNewGroup } from "@/utils";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/loading";

export function Users() {
  const uid = useUID(state => state.uid);
  const setPage = usePage(state => state.setPage)
  const [ group, setGroup ] = useState();
  const { userData, setUserData } = useUserData();
  const [loading, setLoading] = useState(false);
  const [ groupsFilter, setGroupsFilter ] = useState([]);
  const [ peopleFilter, setPeopleFilter ] = useState([]);
  const [groups, setGroups] = useState([]);
  const [people, setPeople] = useState([]);
  const [data, setData] = useState([]);
  const createGroup = async () => {
    try{
      const groupData = await createNewGroup(uid, group);
      if(groupData){ 
        setPage({
          open: true,
          component: "chat",
          data: {
            ...groupData
          }
        });
      }
    } catch(err) {
      console.log(err.message);
    }
  }
  useEffect(() => {
    setLoading(true);
    getAllUsers(uid, setData);
  }, []);
  useEffect(() => {
    if (data) {
      setLoading(false);
      setPeople(data.filter(x => x.type === "personal") || []);
      setGroups(data.filter(x => x.type === "group"));
    }
  }, [data]);
  useEffect(() => {
    console.log(people,groups);
    setGroupsFilter([...groups]);
    setPeopleFilter([...people]);
  }, [people, groups]);
  if (loading) {
    return <Loading  className="w-full h-full"/>
  }
  return (
    <main className="flex flex-col gap-2 w-full">
      <Input placeholder="Search..." onChange={(e) => {
        if(!e.target.value){
          setPeopleFilter([...people]);
          setGroupsFilter([...groups]);
        }
        setPeopleFilter(people.filter(x => x.name?.toLowerCase()?.includes(e.target.value.toLowerCase())));
        setGroupsFilter(groups.filter(x => x.name?.toLowerCase()?.includes(e.target.value.toLowerCase())));
        
      }}/>
      <Dialog>
        <DialogTrigger>
          <Button variant="outline">Create new group</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Group</DialogTitle>
            <DialogDescription>
              Add two or more participants
            </DialogDescription>
          </DialogHeader>
          <section className="flex flex-col gap-2 max-w-3/4 overflow-y-scroll">
            <GroupProfile setGroup={setGroup}/>
            {peopleFilter&&peopleFilter.sort((a, b) => a.name?.localeCompare(b.name)).map((doc,i) => <CardList key={i} doc={doc}  action={() => setGroup({
              ...group,
              participants: [...group.participants, doc.uid]
            })}/>)}
          </section>
          <DialogFooter>
            <Button onClick={createGroup}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <section className="flex flex-col gap-2 w-full">
        <h2 className="text-xl font-bold">People</h2>
        {peopleFilter&&peopleFilter.sort((a, b) => a.name?.localeCompare(b.name)).map((doc,i) => <CardList key={i} doc={doc}  action={() => setPage({
          open: true,
          component: "chat",
          data: {
            ...doc
          }
        })}/>)}
      </section>
      <section className="flex flex-col gap-2 w-full">
        <h2 className="text-xl font-bold">Groups</h2>
        {groupsFilter&&groupsFilter.sort((a, b) => a.name.localeCompare(b.name)).map((doc,i) => <CardList key={i} doc={doc} action={() => setPage({
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

function CardList({ doc, action }) {
  return (
    <Card className="flex w-full justify-start items-center h-fit" onClick={action}>
      <CardContent className="flex p-1 items-center gap-2">
        <Avatar className="w-12 h-12">
          <AvatarImage className="w-12 h-12 object-cover rounded-full" src={doc?.image} alt="profile-image"/>
          <AvatarFallback className="text-3xl text-primary">{
          doc?.name ? doc.name[0] : "Z"
          }</AvatarFallback>
        </Avatar>
        <section className="flex flex-col justify-center gap-1">
          <h2 className="text-lg font-bold">{doc?.name || "No Name"}</h2>
          <p className="truncate text-sm text-muted-foreground">{doc?.bio || ""}</p>
        </section>
      </CardContent> 
    </Card>
  )
}

function GroupProfile({ setGroup }){
  const [ name, setName ] = useState();
  const [ image, setImage ] = useState();
  useEffect(() => {
    setGroup({
      name,
      image
    });
  }, [ name, image ]);
  return (
    <Card className="backdrop-blur-sm flex justify-center items-center w-full mt-6">
      <CardContent className="flex flex-col justify-center gap-2 p-2 w-full">
          <section className="flex justify-between">
            <div className="flex w-fit justify-center flex-col items-center">
              <Avatar className="w-20 h-20">
              <AvatarImage src={image} className="object-cover rounded-full" />
              <AvatarFallback className="text-2xl text-primary">{name ? name[0] : "Z"}</AvatarFallback>
            </Avatar>
            <Label htmlFor="image" className="underline text-primary text-lg">Edit</Label>
            <input id="image" accept="image/*" type="file" onChange={async (e) => {
              const data = await toBase64(e.target.files[0]);
              setImage(data);
            }} hidden/>
          </div>
        </section>
        <section className="flex items-center gap-2">
          <Input className="font-semibold" defaultValue={name || ""} onChange={(e) => setName(e.target.value)}/>
        </section>
      </CardContent>
    </Card>
  )
}