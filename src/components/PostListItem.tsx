import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import posts from '../../assets/data/posts.json'
import { colors } from '../../constants/colors';
import { formatDistanceToNowStrict } from 'date-fns';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Post } from '../types'

type PostListItemProps = {
    post: Post
}

export default function PostListItem({ post }: PostListItemProps) {
    // const post = posts[0];
    return (
        <View style={{ paddingVertical: 10, paddingHorizontal: 15, borderBottomColor: 'lightgrey', borderBottomWidth: 0.5 }} >

            {/*header */}
            <View style={{ flexDirection: 'row', gap: '10' }}>
                <Image source={{ uri: post.group.image }} style={styles.groupIcon} />
                <Text style={{ fontFamily: "outfit", fontWeight: 'bold', color: colors.textPrimary }} >{post.group.name}</Text>
                <Text style={{ fontFamily: "outfit", color: "grey" }} >{formatDistanceToNowStrict(new Date(post.created_at))}</Text>
                <View style={{ marginLeft: "auto" }}>
                    <Text style={styles.joinBtn}>Join</Text>
                </View>
            </View>

            {/*content */}

            <Text style={styles.postTitle}>{post.title}</Text>

            {post.image && (
                <Image source={{ uri: post.image }} style={styles.postImage} />
            )}

            {!post.image && post.description && (
                <Text numberOfLines={4} style={styles.postDescription}>{post.description}</Text>
            )}


            {/*footer */}

            <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={[{ flexDirection: 'row' }, styles.iconBox]}>
                        <MaterialCommunityIcons name="heart-outline" size={18} color={colors.appSecondary} />
                        <Text style={{
                            fontFamily: "outfit-medium", fontWeight: '500', marginLeft: 5, alignSelf: 'center', color: colors.textPrimary

                        }} >{post.upvotes}</Text>
                        <View style={{ width: 1, backgroundColor: '#D4D4D4', height: 14, marginHorizontal: 7, alignSelf: 'center' }} />
                        <MaterialCommunityIcons name="minus-circle-outline" size={18} color={colors.appSecondary} />
                    </View>

                    <View style={[{ flexDirection: 'row' }, styles.iconBox]}>
                        <MaterialCommunityIcons name="chat-outline" size={18} color={colors.appSecondary} />
                        <Text style={{ fontFamily: "outfit-medium", marginLeft: 5, alignSelf: 'center', color: colors.textPrimary }} >{post.nr_of_comments}</Text>
                    </View>

                </View>

                <View style={{ flexDirection: "row", marginLeft: "auto", gap: 10 }} >
                    <MaterialCommunityIcons name="star-outline" size={18} color={colors.appSecondary} style={styles.iconBox} />
                    <MaterialCommunityIcons name="share-outline" size={18} color={colors.appSecondary} style={styles.iconBox} />
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    joinBtn: {
        backgroundColor: colors.appSecondary,
        color: colors.appPrimary,
        paddingVertical: 2,
        fontFamily: "outfit-medium",
        paddingHorizontal: 8,
        borderRadius: 10
    },
    groupIcon: {
        height: 20,
        width: 20,
        borderRadius: 10
    },
    postImage: {
        width: "100%",
        aspectRatio: 4 / 3,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 15
    },
    postTitle: {
        fontFamily: "outfit-bold",
        fontSize: 18,
        letterSpacing: 0.3,
        color: colors.textPrimary

    },
    postDescription: {
        fontFamily: "outfit",
        fontSize: 14,
        letterSpacing: 0.3,
        marginTop: 10,
        marginBottom: 15,
        color: colors.textPrimary
    },
    iconBox: {
        borderWidth: 0.5,
        borderColor: '#D4D4D4',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20
    },

})