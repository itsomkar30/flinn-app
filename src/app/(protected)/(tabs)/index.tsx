import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React from 'react'
import { colors } from '../../../../constants/colors';
import PostListItem from '../../../components/PostListItem';
import { supabase } from '../../../lib/supabase';
import { useEffect, useState } from 'react';
import { Tables } from '../../../types/database.types';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../../../services/postFetchingService';
import { useSupabase } from '../../../lib/supabase';

type Post = Tables<"posts"> & {
  user: Tables<'users'> | null;
  group: Tables<'groups'> | null;
}





export default function HomeScreen() {
  // const [posts, setPosts] = useState<Post[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabase()


  const { data: posts, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(supabase),
    staleTime: 10_000

  })


  // useEffect(() => {
  //   fetchPosts()
  // }, [])


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'outfit' }}>Failed to load posts</Text>
      </View>
    );
  }
  return (
    <View style={{ backgroundColor: 'white' }} >


      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          <PostListItem post={item}
          />}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </View>
  )
}

