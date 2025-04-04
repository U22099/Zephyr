import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ModeToggle } from "@/components/toggle-mode";
import { Textarea } from "@/components/ui/textarea";
import { AiOutlineLoading } from "react-icons/ai";
import { deleteSession } from "@/lib/utility/index";

export function UserProfile({ setGender, gender, username, setUsername, imageUrl, setImage, imageBase64String, updateUserProfile, bio, setBio, loading, error }) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Card className="md:w-[50vw] w-[90vw]">
        <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex justify-between items-start mt-8">
                <div className="flex flex-col gap-1 w-fit self-start items-center justify-center">
                  <Avatar className="mt-8 w-36 h-36">
                    <AvatarImage className="w-36 h-36 object-cover rounded-full" src={imageBase64String || imageUrl} alt="profile-image"/>
                    <AvatarFallback className="text-3xl text-primary">{username ? username[0] : "Z"}</AvatarFallback>
                  </Avatar>
                  <Label htmlFor="image-profile-2" className="underline text-primary text-lg">Edit</Label>
                  <input id="image-profile-2" accept="image/*" type="file"
                  onChange={(e) => setImage(e.target.files[0])} hidden/>
                </div>
                <ModeToggle className="text-lg"/> 
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="name" >Name</Label>
                  <Input id="name" defaultValue={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="gender">Gender</Label>
                  <Select id="gender" defaultValue={gender || "male"} onValueChange={(value) => setGender(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="anonymous">Anonymous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea placeholder="Add your bio" id="bio" defaultValue={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              {error&&<p className="font-bold text-red-700 text-sm text-mono">{error}</p>}
              <Button disabled={!gender&&!username}
              type="submit" onClick={async () => await updateUserProfile()} className="w-full">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Continue"}</Button>
            </div>
        </CardContent>
      </Card>
    </form>
  )

}