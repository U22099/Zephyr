import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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

export function SignIn({ setEmail, setPassword, signIn, loading, error }) {
  return (
    <Card className="md:w-[50vw] w-[90vw]">
      <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <img src={image}/>
              <Label htmlFor="image" className="underlined text-violet-800">Edit</Label>
              <Input id="image" accept="image/*" type="file" onChange={(e) => setImage(e.target.file.files[0])}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input id="name" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <Button onClick={async () => await submitProfile()} className="w-full">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Sign In"}</Button>
          </div>
      </CardContent>
    </Card>
  )

}