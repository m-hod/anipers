import React from 'react';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Text, StyleSheet } from 'react-native';
import { parseTagName, truncateNumber } from '../../utils';
import { Colors } from '../../constants';
import { BooruAPIResponseTag } from '../../types';

function TagTab({
  tag,
  navigate,
}: {
  tag: BooruAPIResponseTag;
  navigate: Function;
}) {
  return (
    <TouchableOpacity
      style={styles.tag}
      activeOpacity={0.5}
      onPress={() => {
        navigate();
      }}>
      <ScrollView style={styles.tagNameContainer} horizontal>
        <Text style={[styles.tagText]}>{parseTagName(tag.name)}</Text>
      </ScrollView>
      <Text style={[styles.tagText, styles.tagTextPostCount]}>
        {truncateNumber(tag.post_count)}
      </Text>
    </TouchableOpacity>
  );
}

export default TagTab;

const styles = StyleSheet.create({
  tag: {
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: Colors.menuColorDark,
    width: 275,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagText: {
    color: 'white',
    fontSize: 20,
  },
  tagNameContainer: {
    flex: 9,
    width: 275 * 0.5,
  },
  tagTextPostCount: {
    maxWidth: 75,
    textAlign: 'right',
  },
});
