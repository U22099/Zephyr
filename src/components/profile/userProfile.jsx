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
import { AiOutlineLoading } from "react-icons/ai";

export function UserProfile({ setGender, gender, username, setUsername, imageUrl, setImage, updateUserInfo, loading, error }) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Card className="md:w-[50vw] w-[90vw]">
        <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <img className="w-26 h-26 object-cover rounded-full" src={imageUrl} alt=""/>
                <Label htmlFor="image" className="underlined text-violet-800">Edit</Label>
                <Input id="image" accept="image/*" type="file"
                onChange={(e) => setImage(e.target.files[0])} hidden/>
              </div>
              <div className="flex items-center gap-2">
                <Input id="name" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <Select onValueChange={(value) => setGender(value)}>
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
              {error&&<p className="font-bold text-red-700 text-sm text-mono">{error}</p>}
              <Button disabled={!gender} onClick={async () => await updateUserInfo()} className="w-full">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Continue"}</Button>
            </div>
        </CardContent>
      </Card>
    </form>
  )

}