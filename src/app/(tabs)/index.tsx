import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import posts from '../../../assets/data/posts.json'
import { colors } from '../../../constants/colors';
import PostListItem from '../../../components/PostListItem';

export default function HomeScreen() {
  const post = posts[0];


  return (
    <View>
      <PostListItem/>
    </View>
  )
}

