import * as React from 'react';
import { IIntranetUpcomingHolidaysProps } from './IIntranetUpcomingHolidaysProps';
import { IIntranetUpcomingHolidaysState } from './IIntranetUpcomingHolidaysState';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from 'axios';
//Styling
import styles from './IntranetUpcomingHolidays.module.scss';
import { Link } from 'office-ui-fabric-react/lib/components/Link';

const logo: string = require('../assets/logo.png');
const arrow: string = require('../assets/arrow.jpg');
export default class IntranetUpcomingHolidays extends React.Component<IIntranetUpcomingHolidaysProps, IIntranetUpcomingHolidaysState> {
  public constructor(props: IIntranetUpcomingHolidaysProps, state: IIntranetUpcomingHolidaysState) {
    super(props);
    this.state = {
      items: [
        {
          "Title": "No Upcoming Holiday",
          "DateOfHolidays": "",
          "TypeOfDate": "Holiday",
          "dayfromdate": ""
        }
      ]
    };
  }

  public componentDidMount() {
    this.GetItemsForHolidays();
  }

  public GetItemsForHolidays = () => {
    axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$Filter=DateOfHolidays ge datetime'${new Date().toISOString()}'&$top=3`)
      .then(res => {
        if (res.data.value.length > 0) {
          const items = res.data.value;
          this.setState({ items });
        }
      }).catch(error => {
        console.log(error);
      });
  }
  public render(): React.ReactElement<IIntranetUpcomingHolidaysProps> {
    return (
      <div className={styles.intranetUpcomingHolidays}>
        <div className={styles.container}>
          <img src={`${logo}`} className={styles.rightalig} />
          <p className={styles.header}>Upcoming Holidays</p>
          <div className="ms-Grid" dir="ltr" >
            <div className={styles.sectionbody}>
              <div className={styles.item}>
                <div className={styles.jobsection}>
                  <div className={styles.jobitem}>
                    {this.state.items.map((item, key) => {
                      return (<div>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-sm4 ms-md4">
                            <div className={styles.dateitem}>
                              <p className={styles.primarytext}>{(new Date(item.DateOfHolidays).toDateString().substring(4, 10))}</p>
                              <p className={styles.secondarytext}>{item.dayfromdate}</p>
                            </div>
                          </div>
                          <div className="ms-Grid-col ms-sm8 ms-md8">
                            <p className={styles.subject}>{item.Title}</p>
                            <p className={styles.floater}>{item.TypeOfDate}</p>
                          </div>
                        </div>
                        <br />
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link href={`${this.props.siteurl}/SitePages/UpcomingHolidays.aspx`} target='_blank' className={styles.viewAll}>
            <img src={`${arrow}`} className={styles.viewAll} />
          </Link>
        </div>
      </div>
    );
  }
}
