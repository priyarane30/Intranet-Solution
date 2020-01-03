import * as React from "react";
import { IIntranetBirthdayProps } from "./IIntranetBirthdayProps";
import axios from "axios";
import styles from "./IntranetBirthday.module.scss";
import { IBirthdayState } from './IIntranetBirthdayState';

const logo: string = require('../assets/02.jpg');

export default class Birthday extends React.Component<IIntranetBirthdayProps,IBirthdayState> {
  public constructor(props: IIntranetBirthdayProps, state: IBirthdayState) {
    super(props);

    this.state = {
      items: [
        {
          Title: "No Birthday today",
          DateOfBirth: "",
          Status: ""
        }
      ],
      currentBirthdayuser: "",
      counter: 0,
      currentdate: new Date().getFullYear()
    };
  }
  public componentDidMount() {
    this.GetItemsForBirthday();
  }
  public componentWillMount() {
    var timer = setInterval(() => {
      this.renderUser();
    }, 7000);
  }
  public renderUser() {
    this.setState({
      currentBirthdayuser: this.state.items[this.state.counter].Title
    });
    this.setState({
      counter:
        this.state.counter == this.state.items.length - 1
          ? 0
          : this.state.counter + 1
    });
  }

  public GetItemsForBirthday() {
    axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle('EmployeeContact')/items?$top=1000`)
    .then(res => {
      var dataFiltered = res.data.value.filter(
            data => new Date(data.DateOfBirth).getDate() == new Date().getDate() && new Date(data.DateOfBirth).getMonth() == new Date().getMonth() && data.Status == "Active",
          );
       console.log("Birthday data:", dataFiltered);
      this.setState({ items: dataFiltered });
    })
    .catch(error => {
      console.log(error);
    });
  }
  public render(): React.ReactElement<IIntranetBirthdayProps> {
    return (
      <div className={styles.intranetBirthday}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <img src={`${logo}`} className={styles.rightalig} />
              <div className="ms-Grid-col ms-md12">
                <div className={styles.BirthdayHeader}>
                  May all your wish come true
                </div>
                {this.state.items.length > 1 ? (
                  <div>
                    <div className={styles.para}>
                      {this.state.currentBirthdayuser}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={styles.para}>
                      {this.state.items[0].Title}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

