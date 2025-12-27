import { View, Text, Image, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { colors } from '../../../../constants/colors';
import PostListItem from '../../../components/PostListItem';
import { supabase } from '../../../lib/supabase';
import { useEffect, useState } from 'react';
import { Tables } from '../../../types/database.types';

type Post = Tables<"posts"> & {
  user: Tables<'users'>;
  group: Tables<'groups'>;
}


export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const { error, data } = await supabase.from("posts").select("*, group: groups(*), user:posts_user_id_fkey(*)")
    console.log("data", JSON.stringify(data, null, 2))
    console.log("error", error)
    if (error) {
      console.log(error)
    } else {
      setPosts(data)
    }
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

