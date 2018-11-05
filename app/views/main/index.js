import React from 'react';
import PropTypes from 'prop-types';
import { Linking, ListView, Platform, Text, TouchableHighlight, StyleSheet, View, RefreshControl } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StockActions from '../../actions/stock-action';
import StockStore from '../../stores/stock-store';
import StockCell from './elements/stock-cell';
import DetailsPage from './elements/details-page';
import NewsPage from './elements/news-page';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  statusBar: {
    height: 20,
  },
  stocksBlock: {
    flexDirection: 'column',
    flex: 9,
  },
  detailedBlock: {
    flex: 5,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  footerBlock: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'grey',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  loadingText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
    marginRight: 10,
    color: 'white',
  },
  yahoo: {
    flex: 1,
  },
  yahooText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
  },
  footerMiddle: {
    flex: 1,
  },
  marketTimeText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  settings: {
    flex: 1,
    alignItems: 'flex-end',
  },
  icon: {
    color: 'white',
    width: 20,
    height: 20,
  },
});

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      loaded: false,
      refreshing: false,
      key: Math.random(),
    }, StockStore.getState());
  }

  componentDidMount() {
    StockStore.listen(state => this.onStockStoreChange(state));
    StockActions.updateStocks();
  }

  componentWillUnmount() {
    StockStore.unlisten(state => this.onStockStoreChange(state));
  }

  onStockStoreChange(state) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(state.watchlist),
      watchlistResult: state.watchlistResult,
      selectedProperty: state.selectedProperty,
      selectedStock: state.selectedStock,
      key: Math.random(),
    });
  }

  onRefresh() {
    this.setState({ refreshing: true });
    StockActions.updateStocks();
    this.setState({ refreshing: false });
  }

  renderDotIndicator() {
    return (
      <PagerDotIndicator pageCount={2} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <View style={styles.statusBar} />}
        <View style={styles.stocksBlock}>
          <ListView
            key={this.state.key}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.onRefresh()}
              />
            }
            dataSource={this.state.dataSource}
            renderRow={stock => <StockCell stock={stock} watchlistResult={this.state.watchlistResult} />}
          />
        </View>
        <View style={styles.detailedBlock}>
          <IndicatorViewPager
            style={{ flex: 1 }}
            indicator={this.renderDotIndicator()}
          >
            <View>
              <DetailsPage stock={this.state.selectedStock} watchlistResult={this.state.watchlistResult} />
            </View>
            <View>
              <NewsPage key={this.state.key} stock={this.state.selectedStock} />
            </View>
          </IndicatorViewPager>
        </View>
        <View style={styles.footerBlock}>
          <TouchableHighlight
            style={styles.yahoo}
            onPress={() => Linking.openURL(
              `http://finance.yahoo.com/q?s=${this.state.selectedStock.symbol}`,
            )
            .catch(err => console.error('An error occurred', err))}
            underlayColor="#202020"
          >
            <Text style={styles.yahooText}>
              More Stock Data
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.settings}
            onPress={Actions.settings}
            underlayColor="#202020"
          >
            <Icon name="menu" color="white" size={22} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
