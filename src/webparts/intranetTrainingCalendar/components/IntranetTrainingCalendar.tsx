import * as React from 'react';
import styles from './IntranetTrainingCalendar.module.scss';
import { IIntranetTrainingCalendarProps } from './IIntranetTrainingCalendarProps';
import { IIntranetTrainingCalendarState } from './IIntranetTrainingCalendarState';
import { escape } from '@microsoft/sp-lodash-subset';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import axios from 'axios';

const logo: string = require('../assets/logo.png');
const arrow: string = require('../assets/arrow.jpg');

var date = new Date().toDateString();

export default class IntranetTrainingCalendar extends React.Component<IIntranetTrainingCalendarProps, IIntranetTrainingCalendarState> {
  public constructor(props: IIntranetTrainingCalendarProps, state: IIntranetTrainingCalendarState) {
    super(props);
    this.state = {
      items: [
        {
          "Title": "No Upcoming Training",
          "TrainingDate": date
        }
      ]
    };
  }

  public componentDidMount() {
    this.GetItemsForTraining();
  }

  public GetItemsForTraining = () => {
    axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$Filter=IsCompleted eq 'False' and TrainingDate ge datetime'${new Date().toISOString()}'&$top=3`)
      .then(res => {
        const items = res.data.value;
        this.setState({ items });
      }).catch(error => {
        console.log(error);
      });

  }
  public render(): React.ReactElement<IIntranetTrainingCalendarProps> {
    return (
      <div className={styles.intranetTrainingCalendar}>
        <div className={styles.container}>
          <img src={`${logo}`} className={styles.rightalig} />
          <p className={styles.header}>Training Calendar</p>
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
                              <p className={styles.primarytext}>{(new Date(item.TrainingDate).toDateString().substring(4,10))}</p>
                              {/* <hr />
                              <p className={styles.secondarytext}>{(new Date(item.EndDate).toLocaleDateString())}</p> */}
                            </div>
                          </div>
                          <div className="ms-Grid-col ms-sm8 ms-md8">
                            <p className={styles.subject}>{item.Title}</p>
                            <p className={styles.trainingDate}>{(new Date(item.TrainingDate).toDateString())} {(new Date(item.TrainingDate).toLocaleTimeString())}</p>
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
          <Link href={`${this.props.siteurl}/Lists/${this.props.listName}/AllItems.aspx`} target='_blank' className={styles.viewAll}>
            <img src={`${arrow}`} className={styles.viewAll} />
          </Link>
        </div>
      </div>
    );
  }
}
