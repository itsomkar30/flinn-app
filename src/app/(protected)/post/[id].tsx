import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, FlatList, TextInput, Platform, Pressable, Keyboard, Animated, ActivityIndicator, Alert, } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PostListItem from "../../../components/PostListItem";
import CommentListItem from "../../../components/CommentListItem";
import { colors } from "../../../../constants/colors";
import { KeyboardAvoidingView } from "react-native";
import { deletePostById, fetchPostsById } from "../../../services/postFetchingService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "../../../lib/supabase";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSession, useUser } from "@clerk/clerk-expo";
import { fetchComments, insertComment } from "../../../services/commentFetchingService";

export default function DetailedPost() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const supabase = useSupabase();
    const queryClient = useQueryClient()
    const { user } = useUser();
    const currentUserId = user?.id;
    const [replyToParentId, setReplyToParentId] = useState<string | null>(null)
    const { session } = useSession()




    const { data: detailedPost, isLoading, error } = useQuery({
        queryKey: ["posts", id],
        queryFn: () => fetchPostsById(id, supabase),
        staleTime: 10_000
    })

    console.log(JSON.stringify(detailedPost, null, 3))

    const { data: comments } = useQuery({
        queryKey: ["comments", { postId: id }],
        queryFn: () => fetchComments(id, supabase)
    })

    console.log(JSON.stringify(comments, null, 3))


    const { mutate: deletePost } = useMutation({
        mutationFn: () => deletePostById(id, supabase),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
            Alert.alert("Post deleted successfully")
            router.back()
        },
        onError: (error) => {
            Alert.alert("Error", error.message)
        }
    })

    // const detailedPost = data;



    // const detailedPost = posts.find((p) => p.id === id);
    // const postComments = comments.filter((c) => c.post_id === id);
    const [comment, setComment] = useState<string>("");

    const insets = useSafeAreaInsets();
    // if (!detailedPost) return <Text>Post not found</Text>;

    const INPUT_BAR_HEIGHT = 80;

    // animated translate for bottom bar
    const translateY = useRef(new Animated.Value(0)).current;
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const onShow = (e: any) => {
            const h = e?.endCoordinates?.height ?? 0;
            setKeyboardHeight(h);

            // move bar up by keyboard height (subtract small bottom inset on iOS if needed)
            const offset = Platform.OS === "ios" ? 0 : 0;
            Animated.timing(translateY, {
                toValue: -h + offset,
                duration: 200,
                useNativeDriver: true,
            }).start();
        };

        const onHide = () => {
            setKeyboardHeight(0);
            Animated.timing(translateY, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }).start();
        };

        const showSub = Keyboard.addListener("keyboardDidShow", onShow);
        const hideSub = Keyboard.addListener("keyboardDidHide", onHide);

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [translateY]);

    const Wrapper: any = Platform.OS === "ios" ? KeyboardAvoidingView : View;
    const wrapperProps =
        Platform.OS === "ios"
            ? { behavior: "padding" as const, keyboardVerticalOffset: insets.top, style: { flex: 1 } }
            : { style: { flex: 1 } };

    const replyCommentButton = useCallback(
        (comment: string) => {
            console.log(comment)
            setReplyToParentId(comment)
            textInputRef.current?.focus()
        }, []
    )


    const { mutate: createComment } = useMutation({
        mutationFn: () => insertComment({ comment, post_id: id, parent_id: replyToParentId }, supabase),

        onSuccess: (data) => {
            setComment("")
            setReplyToParentId(null)
            Keyboard.dismiss();
            textInputRef.current?.blur();
            queryClient.invalidateQueries({ queryKey: ["comments", { postId: id }] })
            queryClient.invalidateQueries({ queryKey: ["comments", { parentId: replyToParentId }] })
        }
    })



    const textInputRef = useRef<TextInput | null>(null)


    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (error || !detailedPost) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'outfit' }}>Failed to load posts</Text>
            </View>
        );
    }

    const isOwnerToDeletePost = true // Temporary: show for all posts until user_id is fixed

    console.log('Current User ID:', currentUserId)
    console.log('Post User ID:', detailedPost?.user_id)
    console.log('Full Post Data:', detailedPost)
    console.log('Is Owner:', isOwnerToDeletePost)

    return (
        <Wrapper {...wrapperProps}>
            <Stack.Screen
                options={{
                    headerRight: () =>
                    (
                        <Pressable onPress={() =>
                            Alert.alert(
                                "Delete post",
                                "Are you sure?",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    { text: "Delete", style: "destructive", onPress: () => deletePost() },
                                ]
                            )
                        }>
                            {session?.user.id === detailedPost.user_id &&
                                < FontAwesome name="trash-o"
                                    size={20}
                                    color={colors.textSecondary}
                                />}
                        </Pressable>
                    ),

                    headerBackButtonDisplayMode: 'minimal'


                }} />
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <CommentListItem comment={item} depth={0} replyCommentButton={replyCommentButton} />
                }
                ListHeaderComponent={
                    <PostListItem post={detailedPost}
                        isDetailedPost />
                }
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingBottom: INPUT_BAR_HEIGHT + (keyboardHeight || 0) + (Platform.OS === "ios" ? insets.bottom : 8),
                }}
                style={{ flex: 1 }}
            />

            {/* Animated bottom bar */}
            <Animated.View
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: INPUT_BAR_HEIGHT,
                    transform: [{ translateY }],
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    paddingBottom: Platform.OS === "ios" ? insets.bottom : 25,
                    backgroundColor: colors.appPrimary,
                    zIndex: 20,
                    elevation: 20,
                }}
            >
                <TextInput
                    ref={textInputRef}
                    placeholder="Join the conversation..."
                    placeholderTextColor="grey"
                    style={{
                        flex: 1,
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: "#F3F4F6",
                        fontFamily: "outfit",
                        color: colors.textPrimary,
                        fontSize: 14,
                    }}
                    value={comment}
                    onChangeText={setComment}
                    multiline
                />

                <Pressable
                    onPress={() => createComment()}
                    style={{
                        marginLeft: 8,
                        borderRadius: 99,
                        backgroundColor: colors.appTheme,
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: comment?.trim().length ? 1 : 0.5,
                    }}
                    disabled={!comment?.trim().length}
                >
                    <Text style={{ fontFamily: "outfit-bold", color: colors.textSecondary, fontSize: 13 }}>
                        Reply
                    </Text>
                </Pressable>
            </Animated.View>
        </Wrapper>
    );
}
