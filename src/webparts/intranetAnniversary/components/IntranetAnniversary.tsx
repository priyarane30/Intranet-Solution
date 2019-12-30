import * as React from "react";
import { IIntranetAnniversaryProps } from "./IIntranetAnniversaryProps";
import { IIntranetAnniversaryState } from "./IIntranetAnniversaryState";
import styles from "./IntranetAnniversary.module.scss";
import * as jquery from "jquery";
import { escape } from "@microsoft/sp-lodash-subset";

const logo: string = require('../assets/01.jpg');

export default class IntranetAnniversary extends React.Component<
  IIntranetAnniversaryProps,
  IIntranetAnniversaryState
> {
  public constructor(
    props: IIntranetAnniversaryProps,
    state: IIntranetAnniversaryState
  ) {
    super(props);
    this.state = {
      items: [
        {
          Title: "No Anniversary Today",
          DateofJoining: "",
          EmploymentStatus: ""
        }
      ],
      AnniversaryUser: "",
      Counter: 0
    };
  }

  public componentDidMount() {
    this.GetItemsForAnniversary();
  }
  public componentWillMount() {
    var timer = setInterval(() => {
      this.renderUser();
    }, 7000);
  }
  renderUser() {
    this.setState({
      AnniversaryUser: this.state.items[this.state.Counter].Title
      //AnniversaryUser1:this.state.items[this.state.Counter].LastName
    });
    this.setState({
      Counter:
        this.state.Counter == this.state.items.length - 1
          ? 0
          : this.state.Counter + 1
    });
  }

  public GetItemsForAnniversary() {
    var AnniversaryHandler = this;
    var anncurl = `${this.props.siteurl}/_api/web/lists/getbytitle('EmployeeContact')/items?$top=1000`;
    jquery.ajax({
      url: anncurl,
      type: "GET",
      headers: { Accept: "application/json; odata=verbose;" },
      success: function(resultData) {
        //filter Data
        var dataFiltered = resultData.d.results.filter(
          data =>
            data.Status == "Active" &&
            new Date(data.DateofJoining).getDate() == new Date().getDate() &&
            new Date(data.DateofJoining).getMonth() == new Date().getMonth() &&
            new Date(data.DateOfJoining).getFullYear() !=
              new Date().getFullYear()
        );
        console.log(dataFiltered);
        if (
          dataFiltered != undefined &&
          dataFiltered != null &&
          dataFiltered.length > 0
        ) {
          //if dataFiltered has values
          AnniversaryHandler.setState({
            items: dataFiltered
          });
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
      }
    });
  }
  public render(): React.ReactElement<IIntranetAnniversaryProps> {
    return (
      <div className={styles.intranetAnniversary}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <img src={`${logo}`} className={styles.rightalig} />
              <div className="ms-Grid-col ms-md12">
                <div className={styles.BirthdayHeader}>Congratulations</div>

                {this.state.items.length > 1 ? (
                  <div>
                    <div className={styles.para}>
                      {this.state.AnniversaryUser}{" "}
                    </div>
                  </div>
                ) : (
                  <div className={styles.para}>
                    {this.state.items[0].Title}{" "}
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
