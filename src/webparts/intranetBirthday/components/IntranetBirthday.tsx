import * as React from "react";
import { IIntranetBirthdayProps } from "./IIntranetBirthdayProps";
import * as jquery from "jquery";
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
  componentDidMount() {
    this.GetItemsForBirthday();
  }
  componentWillMount() {
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
    var BirthdayHandler = this;
    var anncurl = `${this.props.siteurl}/_api/web/lists/getbytitle('EmployeeContact')/items?$top=1000`;
    jquery.ajax({
      url: anncurl,
      type: "GET",
      headers: { Accept: "application/json; odata=verbose;" },
      success: function(resultData) {
        var dataFiltered = resultData.d.results.filter(
          data =>
            new Date(data.DateOfBirth).getDate() == new Date().getDate() &&
            new Date(data.DateOfBirth).getMonth() == new Date().getMonth() &&
            data.Status == "Active"
        );
        if (
          dataFiltered != undefined &&
          dataFiltered != null &&
          dataFiltered.length > 0
        ) {
          BirthdayHandler.setState({
            items: dataFiltered
          });
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
      }
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

