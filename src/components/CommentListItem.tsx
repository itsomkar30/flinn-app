import { View, Text, Image, Pressable, FlatList, Alert } from "react-native";
import { Entypo, Octicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNowStrict } from 'date-fns';
import React, { useState, useRef, memo } from "react";
import { colors } from "../../constants/colors";
import { useSupabase } from "../lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tables } from "../types/database.types";
import { deleteComment, fetchCommentsById } from "../services/commentFetchingService";
import { useSession } from "@clerk/clerk-expo";

type Comment = Tables<"comments">

type CommentListItemProps = {
    comment: Comment;
    depth: number;
    replyCommentButton: (commentId: string) => void
}

let a = 0
const CommentListItem = ({ comment, depth, replyCommentButton }: CommentListItemProps) => {
    console.log(`rendered ${a += 1}`)
    const supabase = useSupabase()
    const queryClient = useQueryClient()
    const { session } = useSession()

    const { data: replies } = useQuery({
        queryKey: ["comments", { parentId: comment.id }],
        queryFn: () => fetchCommentsById(comment.id, supabase)
    })

    const { mutate: removeComment } = useMutation({
        mutationFn: () => deleteComment(comment.id, supabase),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] })
        }
    })

    const [shouldShowReplies, setShouldShowReplies] = useState<boolean>(false)
    return (
        <View
            style={{
                backgroundColor: "white",
                marginTop: 10,
                paddingHorizontal: 10,
                paddingVertical: 5,
                gap: 10,
                borderLeftColor: "#E5E7EB",
                borderLeftWidth: depth > 0 ? 1 : 0
            }}
        >
            {/* User Info */}
            {/* <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Image
                    source={{
                        uri: comment.user.image || "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/3.jpg",
                    }}
                    style={{ width: 20, height: 20, borderRadius: 15, marginRight: 4 }}
                />
                <Text style={{ fontFamily: 'outfit-medium', fontWeight: "600", color: "#737373", fontSize: 13 }}>{comment.user.name}</Text>
                <Text style={{ fontFamily: 'outfit', color: "#737373", fontSize: 13 }}>&#x2022;</Text>
                <Text style={{ fontFamily: 'outfit', color: "#737373", fontSize: 13 }}>
                    {formatDistanceToNowStrict(new Date(comment.created_at))}
                </Text>
            </View> */}

            {/* Comment Content */}
            <Text style={{ fontFamily: 'outfit' }}>{comment.comment}</Text>

            {/* Comment Actions */}
            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 14 }}>
                {session?.user.id === comment.user_id &&
                    <FontAwesome name="trash-o"
                        size={15}
                        color="#737373"
                        onPress={() =>
                            Alert.alert(
                                "Delete Comment",
                                "Are you sure you want to delete this comment?",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    { text: "Delete", style: "destructive", onPress: () => removeComment() }
                                ]
                            )
                        }
                    />
                }
                <Octicons name="reply"
                    size={16}
                    color="#737373"
                    onPress={() => replyCommentButton(comment.id)}
                />

                <MaterialCommunityIcons name="trophy-outline" size={16} color="#737373" />
                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                    <MaterialCommunityIcons name="heart-outline" size={18} color="#737373" />
                    <Text style={{ fontWeight: "500", color: "#737373" }}>{comment.upvotes}</Text>
                    <MaterialCommunityIcons name="minus-circle-outline" size={18} color="#737373" />
                </View>
            </View>


            {!!replies?.length && !shouldShowReplies && (
                <Pressable
                    onPress={() => setShouldShowReplies(true)}
                    style={{
                        backgroundColor: colors.appPrimary,
                        paddingVertical: 5,
                        borderRadius: 3,
                        alignItems: 'center'
                    }}>
                    <Text style={{ fontFamily: 'outfit', letterSpacing: 0.5 }}>Show Replies</Text>
                </Pressable>

            )}


            {/* Reply Comments List */}
            {/* {shouldShowReplies && (<FlatList
                data={comment.replies}
                renderItem={({ item }) =>
                    <CommentListItem comment={item} depth={depth + 1} replyCommentButton={replyCommentButton}
                    />}
            />
            )} */}

            {shouldShowReplies && !!replies?.length && replies.map((item) => (

                <CommentListItem comment={item}
                    key={comment.id}
                    depth={depth + 1}
                    replyCommentButton={replyCommentButton}
                />

            ))}




        </View>

    )
};

export default memo(CommentListItem);