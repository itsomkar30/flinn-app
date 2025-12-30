import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../types/database.types"

export const fetchGroups = async (search: string, supabase: SupabaseClient<Database>) => {
    const { error, data } = await supabase.from("groups")
        .select("*")
        .ilike("name", `%${search}%`)
    console.log("data", JSON.stringify(data, null, 2))
    console.log("error", error)
    if (error) {
        console.log(error)
        throw error
    } else {
        return data
    }
}
