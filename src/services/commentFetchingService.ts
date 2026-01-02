import { SupabaseClient } from "@supabase/supabase-js";
import { Database, TablesInsert } from "../types/database.types";

export const fetchComments = async (
    postId: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from("comments")
        .select("*, replies: comments(*)")
        .eq("post_id", postId)
        .is("parent_id", null)

    if (error) {
        throw error;
    } else {
        return data;
    }
}

export const fetchCommentsById = async (
    parent_id: string,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from("comments")
        .select("*, replies: comments(*)")
        .eq("parent_id", parent_id)

    if (error) {
        throw error;
    } else {
        return data;
    }
}

export const insertComment = async (
    newComment: TablesInsert<"comments">,
    supabase: SupabaseClient<Database>,
) => {
    const { data, error } = await supabase
        .from("comments")
        .insert(newComment)
        .select()
        .single()

    if (error) {
        throw error;
    } else {
        return data;
    }
}
