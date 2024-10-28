import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const sendMessage = async (messageData: any) => {
  try {
    const values = {
      user_id: messageData.userId,
      room_id: messageData.roomId,
      content: messageData.content,
      type: messageData.type || "TEXT",
    };

    const { data: insertData, error: insertError } = await supabase
      .from("messages")
      .insert(values)
      .select("*")
      .single();

    if (!insertData) {
      throw new Error("message insert 오류");
    }

    const { data: fetchData, error: fetchError } = await supabase
      .from("messages")
      .select("*, user:users(*)")
      .eq("id", insertData.id)
      .single();

    if (!fetchData) {
      throw new Error("message fetch 오류");
    }

    return { success: true, msg: "sendMessage 성공", data: fetchData };
  } catch (error) {
    return { success: false, msg: "sendMessage 오류", data: [] };
  }
};
