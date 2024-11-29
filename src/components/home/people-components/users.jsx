import { useState, useEffect } from "react";
import { getAllUsers, createNewGroup, toBase64 } from "@/utils";
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
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/loading";

export function Users() {
  const uid = useUID(state => state.uid);
  const setPage = usePage(state => state.setPage)
  const [ group, setGroup ] = useState({
    name: "my-group",
    image: "",
    participants: [uid]
  });
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
      <Drawer>
        <DrawerTrigger>
          <Button variant="outline">Create new group</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Group</DrawerTitle>
            <DrawerDescription>
              Add two or more participants
            </DrawerDescription>
          </DrawerHeader>
          <section className="flex flex-col gap-2 max-h-3/4 overflow-y-scroll">
            <GroupProfile setGroup={setGroup}/>
            <section className="flex flex-col gap-2">
              <h3 className="text-lg">Members</h3>
              {peopleFilter&&peopleFilter.sort((a, b) => a.name?.localeCompare(b.name)).filter(x => group?.participants?.includes(x.uid)).map((doc,i) => <CardList key={i} doc={doc} action={() => {}}/>)}
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="text-lg">Add Members</h3>
              {peopleFilter&&peopleFilter.sort((a, b) => a.name?.localeCompare(b.name)).filter(x => !group?.participants?.includes(x.uid)).map((doc,i) => <CardList key={i} doc={doc}  action={() => setGroup({
                ...group,
                participants: [...group?.participants, doc.uid]
              })}/>)}
            </section>
          </section>
          <DrawerFooter>
            <Button disabled={!(group.name&&group.participants.length > 2)} onClick={createGroup}>Create</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
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
    setGroup(group => ({
      ...group,
      name,
      image
    }));
  }, [ name, image ]);
  return (
    <Card className="backdrop-blur-sm flex justify-center items-center w-full mt-6">
      <CardContent className="flex flex-col justify-center gap-2 p-2 w-full">
          <section className="flex justify-between">
          <div className="flex w-fit justify-center flex-col items-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src={image} className="object-cover rounded-full" />
              <AvatarFallback className="text-xl text-primary">{name ? name[0] : "Z"}</AvatarFallback>
            </Avatar>
            <Label htmlFor="image" className="underline text-primary text-md">Edit</Label>
            <input id="image" accept="image/*" type="file" onChange={async (e) => {
              const data = await toBase64(e.target.files[0]);
              setImage(data);
            }} hidden/>
          </div>
        </section>
        <section className="flex items-center gap-2">
          <Input className="font-semibold" onChange={(e) => setName(e.target.value)}/>
        </section>
      </CardContent>
    </Card>
  )
}