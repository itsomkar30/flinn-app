import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../types/database.types"

export const fetchPosts = async (supabase: SupabaseClient<Database>) => {
    const { error, data } = await supabase.from("posts")
        .select(
            "*, group:groups(*), upvotes(value.sum())"
        ).order('created_at', { ascending: false })
    console.log("data", JSON.stringify(data, null, 2))
    console.log("error", error)
    if (error) {
        console.log(error)
        throw error
    } else {
        return data
    }
}


export const fetchPostsById = async (id: string, supabase: SupabaseClient<Database>) => {
    const { error, data } = await supabase.from("posts")
        .select(
            "*, group: groups(*), upvotes(value.sum())"
        ).eq("id", id)
        .single()
    console.log("data", JSON.stringify(data, null, 2))
    console.log("error", error)
    if (error) {
        console.log(error)
        throw error
    } else {
        return data
    }
}

export const deletePostById = async (id: string, supabase: SupabaseClient<Database>) => {
    const { data, error } = await supabase.from("posts").delete().eq("id", id)
    if (error) {
        throw error
    } else {
        return data
    }
}