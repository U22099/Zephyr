import { motion } from "framer-motion";
import { FaAngleLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ModeToggle } from "@/components/toggle-mode";
import { Textarea } from "@/components/ui/textarea";
import { AiOutlineLoading } from "react-icons/ai";
import { useUserData, usePage, useUID } from "@/store";
import { useState, useEffect } from "react";
import { updateUserData } from "@/utils";

export function Profile() {
  const { userData, setUserData } = useUserData();
  const setPage = usePage(state => state.setPage);
  const uid = useUID(state => state.uid);
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState(userData.imageURL);
  const [imageBase64String, setImageBase64String] = useState();
  const [imagePublicId, setImagePublicId] = useState(userData.imagePublicId);

  const [username, setUsername] = useState(userData.username);

  const [gender, setGender] = useState(userData.gender);

  const [bio, setBio] = useState(userData.bio);

  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const updateUserProfile = async () => {
    setLoading(true);
    setError("");
    let newImageUrl;
    if (!username || !gender) {
      setError("username and gender must be specified");
      setLoading(false);
      return;
    }
    if (imageBase64String) {
      try {
        const deleted = await axios.delete("/api/file", { publicId: imagePublicId });
        if (deleted.status === 200) {
          newImageUrl = await uploadFileAndGetURL(imageBase64String, "images", "image");
        }
      } catch (err) {
        setError(err?.code || err?.message || "try again, an error occured");
        console.log(err, "image url");
        setLoading("false");
        return;
      }
    }
    try {
      await updateUserData(uid, {
        username,
        imageURL: newImageUrl?.secure_url || imageUrl,
        imagePublicId: newImageUrl?.public_id || imagePublicId,
        gender,
        bio,
        theme,
      });
    } catch (err) {
      setError(err?.code || err?.message || "try again, an error occured");
      console.log(err, "updateProfile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (image) {
      updateImage(setImageBase64String, image);
    }
  }, [image]);
  return (
    <motion.main initial={{x: 300}} animate={{x: 0}} className="flex flex-col gap-3">
      <header className="fixed top-8 flex justify-center text-center items-center">
        <FaAngleLeft className="self-start dark:fill-white fill-black text-lg" onClick={() => setPage({open: false, component: 'default'})}/>
        <h3 className="font-bold text-xl">Edit Profile</h3>
      </header>
      <Card className="backdrop-blur-sm flex justify-center items-center w-full">
        <CardContent className="flex flex-col justify-center gap-2 p-2 w-full">
            <section className="flex justify-between">
              <div>
                <Avatar className="w-20 h-20">
                <AvatarImage src={imageBase64String || userData?.imageURL} className="object-cover rounded-full" />
                <AvatarFallback className="text-2xl text-violet-800">{userData.username ? userData.username[0] : "Z"}</AvatarFallback>
              </Avatar>
              <Label htmlFor="image" className="underline text-violet-800 text-lg">Edit</Label>
              <input id="image" accept="image/*" type="file" onChange={(e) => setImage(e.target.files[0])} hidden/>
            </div>
            <ModeToggle className="text-lg"/>
          </section>
          <section className="flex items-center gap-2">
            <Input className="font-semibold" defaultValue={userData?.username || ""}/>
            <div className="flex flex-col gap-1">
              <Label htmlFor="gender">Gender</Label>
              <Select id="gender" defaultValue={userData?.gender || "male"} onValueChange={(value) => setGender(value)}>
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
          </section>
        </CardContent>
      </Card>
      <Card className="backdrop-blur-sm flex justify-center items-center w-full">
        <CardContent className="flex flex-col justify-center gap-2 p-2 w-full">
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea placeholder="Add your bio" id="bio" defaultValue={userData?.bio || ""} onChange={(e) => setBio(e.target.value)} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardFooter>
          { error && <p className="font-bold text-red-700 text-sm text-mono">{error}</p> }
          <Button disabled={!gender&&!username} type="submit" onClick={async () => await updateUserProfile()} className="w-full">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Save"}</Button>
        </CardFooter>
      </Card>
    </motion.main>
  )
}

const updateImage = async (setImageBase64String, image) => {
  const data = await toBase64(image);
  setImageBase64String(data);
}