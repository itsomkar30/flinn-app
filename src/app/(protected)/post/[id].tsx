import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, FlatList, TextInput, Platform, Pressable, Keyboard, Animated, ActivityIndicator, } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import comments from "../../../../assets/data/comments.json";
import PostListItem from "../../../components/PostListItem";
import CommentListItem from "../../../components/CommentListItem";
import { colors } from "../../../../constants/colors";
import { KeyboardAvoidingView } from "react-native";
import { fetchPostsById } from "../../../services/postFetchingService";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export default function DetailedPost() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ["posts", id],
        queryFn: () => fetchPostsById(id),
        staleTime: 10_000
    })

    const detailedPost = data;



    // const detailedPost = posts.find((p) => p.id === id);
    const postComments = comments.filter((c) => c.post_id === id);
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
            textInputRef.current?.focus()
        }, []
    )



    const textInputRef = useRef<TextInput | null>(null)


    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'outfit' }}>Failed to load posts</Text>
            </View>
        );
    }


    return (
        <Wrapper {...wrapperProps}>
            <FlatList
                data={postComments}
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
