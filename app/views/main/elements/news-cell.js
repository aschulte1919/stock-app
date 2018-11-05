import React from 'react';
import PropTypes from 'prop-types';
import { Linking, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    backgroundColor: 'white',
  },
  titleText: {
    fontSize: 12,
    color: 'black',
    textAlign: 'left',
  },
  timeText: {
    fontSize: 12,
    color: '#A6A6A6',
    textAlign: 'left',
  },
});

export default class NewsCell extends React.Component {
  render() {
    return (
      <TouchableHighlight
        onPress={() => Linking.openURL(
          this.props.news.link,
        ).catch(err => console.error('An error occurred', err))}
        underlayColor="white"
      >
        <View style={styles.container}>
          <Text style={styles.titleText}>
            {this.props.news.title}
          </Text>
          <Text style={styles.timeText}>
            {`${moment(new Date(this.props.news.pubDate)).format('D/M/YYYY')} at ${moment(new Date(this.props.news.pubDate)).format('LT')}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

NewsCell.propTypes = {
  news: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
    pubDate: PropTypes.string,
  }),
};

NewsCell.defaultProps = {
  news: {},
};
