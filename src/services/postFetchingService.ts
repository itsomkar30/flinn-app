import { supabase } from "../lib/supabase"

export const fetchPosts = async () => {
    const { error, data } = await supabase.from("posts")
        .select(
            "*, group:groups(*), user:users!posts_user_id_fkey(*)"
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


export const fetchPostsById = async (id: string) => {
    const { error, data } = await supabase.from("posts")
        .select(
            "*, group: groups(*), user:users!posts_user_id_fkey(*)"
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