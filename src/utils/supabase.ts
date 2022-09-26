import { createClient } from "@supabase/supabase-js";
import { env } from "src/env/client.mjs";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const uploadImage = async (files: FileList) => {
  const file = files[0] as File;
  const name = `${uuidv4().toString()}.${file.type.split("/")[1]}`;
  await supabase.storage.from("dshop-images").upload(name, file);
  return `${supabaseUrl}/storage/v1/object/public/dshop-images/${name}`;
};

export default uploadImage;
