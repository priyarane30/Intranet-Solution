import * as React from 'react';
import styles from './QuoteOfTheDay.module.scss';
import { IQuoteOfTheDayProps } from './IQuoteOfTheDayProps';
import { IQuoteOfTheDayState } from './IQuoteOfTheDayState';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from 'axios';

const logo: string = require('../assets/logo.png');

//Start calculate number of day for  daily new quote
var today = new Date();
var dayyear = Number(new Date(today.getFullYear(), 0, 1));
var NumberdayOfYear = Math.ceil((Number(today) - dayyear) / 86400000);
var remainingNumberOFYear = 366 - NumberdayOfYear;
//End calculate number of day for  daily new quote

export default class QuoteOfTheDay extends React.Component<IQuoteOfTheDayProps, IQuoteOfTheDayState> {
  public constructor(props: IQuoteOfTheDayProps, state: IQuoteOfTheDayState) {
    super(props);
    this.state = {
      "ServerRelativeUrl": "",
      "Name": ""
    };
  }
  public componentDidMount() {
    this.GetItemsForQuoteOfTheDay();
  }
  public GetItemsForQuoteOfTheDay = () => {
    axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle('${this.props.listName}')/Items(${remainingNumberOFYear})/File`)
      .then(res => {
        this.setState({
          ServerRelativeUrl: res.data.ServerRelativeUrl,
          Name: res.data.Name
        });
      }).catch(error => {
        console.log(error);
      });
  }

  public render(): React.ReactElement<IQuoteOfTheDayProps> {
    return (
      <div className={styles.quoteOfTheDay}>
        <div className={styles.container}>
          <img src={`${logo}`} className={styles.rightalig} />
          <p className={styles.header}>Quote Of The Day</p>
          <img src={`${this.props.siteurl}/${this.props.listName}/${this.state.Name}`} alt="Quote Of the Day"
            className={styles.image} />
        </div>
      </div>
    );
  }
}
