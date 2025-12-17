import { View, Text, Image, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import posts from '../../../assets/data/posts.json'
import { colors } from '../../../constants/colors';
import PostListItem from '../../components/PostListItem';

export default function HomeScreen() {

  return (
    <View>
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

