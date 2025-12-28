import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React from 'react'
import { colors } from '../../../../constants/colors';
import PostListItem from '../../../components/PostListItem';
import { supabase } from '../../../lib/supabase';
import { useEffect, useState } from 'react';
import { Tables } from '../../../types/database.types';
import { useQuery } from '@tanstack/react-query';

type Post = Tables<"posts"> & {
  user: Tables<'users'>;
  group: Tables<'groups'>;
}


const fetchPosts = async () => {
  const { error, data } = await supabase.from("posts")
    .select(
      "*, group: groups(*), user:posts_user_id_fkey(*)"
    )
  console.log("data", JSON.stringify(data, null, 2))
  console.log("error", error)
  if (error) {
    console.log(error)
    throw error
  } else {
    return data
  }
}


export default function HomeScreen() {
  // const [posts, setPosts] = useState<Post[]>([]);
  // const [isLoading, setIsLoading] = useState(false);


  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),

  })


  // useEffect(() => {
  //   fetchPosts()
  // }, [])


  if (isLoading) {
    return <ActivityIndicator />
  }
  if (error) {
    return <Text>Error fetching posts</Text>
  }
  return (
    <View style={{ backgroundColor: 'white' }} >
      {/* <PostListItem post={posts[0]} />
      <PostListItem post={posts[4]} /> */}

      <FlatList
        data={posts}
        renderItem={({ item }) =>
          <PostListItem post={item}
          />}
      />
    </View>
  )
}

