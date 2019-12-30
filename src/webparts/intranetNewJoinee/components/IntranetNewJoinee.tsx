import * as React from "react";
import styles from "./IntranetNewJoinee.module.scss";
import { IIntranetNewJoineeProps } from "./IIntranetNewJoineeProps";
import { IIntranetNewJoineeState } from "./IIntranetNewJoineeState";
import { escape } from "@microsoft/sp-lodash-subset";
import axios from "axios";

const logo: string = require("../assets/03.jpg");

export default class IntranetNewJoinee extends React.Component<
  IIntranetNewJoineeProps,
  IIntranetNewJoineeState
> {
  public constructor(
    props: IIntranetNewJoineeProps,
    state: IIntranetNewJoineeState
  ) {
    super(props);
    this.state = {
      items: [
        {
          Title: "",
          DateofJoining: "",
          EmploymentStatus: ""
        }
      ],
      NewJoineeUser: "",
      counter: 0
    };
  }
  public componentDidMount() {
    this.GetItemsForNewJoinee();
  }
  public componentWillMount() {
    var timer = setInterval(() => {
      this.renderUser();
    }, 7000);
  }

  renderUser() {
    this.setState({
      NewJoineeUser: this.state.items[this.state.counter].Title
    });
    this.setState({
      counter:
        this.state.counter == this.state.items.length - 1
          ? 0
          : this.state.counter + 1
    });
  }

  public GetItemsForNewJoinee() {
    axios
      .get(
        `${this.props.siteurl}/_api/web/lists/getbytitle('EmployeeContact')/items?$top=5 &$orderby=ID desc & $Filter=Status eq 'Active'`
      )
      .then(res => {
        const items = res.data.value;
        this.setState({ items });
      })
      .catch(error => {
        console.log(error);
      });
  }

  public render(): React.ReactElement<IIntranetNewJoineeProps> {
    return (
      <div className={styles.intranetNewJoinee}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <img src={`${logo}`} className={styles.rightalig} />
              <div className="ms-Grid-col ms-md12">
                <div className={styles.BirthdayHeader}>Welcome Aboard</div>
                {this.state.items.length > 1 ? (
                  <div className={styles.para}>{this.state.NewJoineeUser}</div>
                ) : (
                  <div className={styles.para}>{this.state.items[0].Title}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
