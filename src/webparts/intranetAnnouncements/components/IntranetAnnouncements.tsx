import * as React from "react";
import styles from "./IntranetAnnouncements.module.scss";
import { IIntranetAnnouncementsProps } from "./IIntranetAnnouncementsProps";
import { IIntranetAnnouncementsState } from "./IIntranetAnnouncementsState";
import { escape } from "@microsoft/sp-lodash-subset";
import * as jquery from "jquery";
import { Link } from "office-ui-fabric-react/lib/components/Link";

const icon: string = require("../assets/icon.png");
const arrow: string = require("../assets/arrow.jpg");

export default class IntranetAnnouncements extends React.Component<IIntranetAnnouncementsProps, IIntranetAnnouncementsState> {
  public constructor(props: IIntranetAnnouncementsProps,state: IIntranetAnnouncementsState) {
    super(props);

    this.state = {
      items: [
        {
          Title: "Test",
          Description: "Test description",
          ExpiryDate: new Date()
        }
      ]
    };
  }
  public componentDidMount() {
    this.GetItemsForAnnouncement();
  }

  public GetItemsForAnnouncement() {
    var BirthdayHandler = this;
    var anncurl = `${this.props.siteurl}/_api/web/lists/getbytitle('${this.props.listName}')/items`;
    jquery.ajax({
      url: anncurl,
      type: "GET",
      headers: { Accept: "application/json; odata=verbose;" },
      success: function (resultData) {
        //filter Data
        console.log("Result-data", resultData.d.results);

        var dataFiltered = resultData.d.results.filter(
          data => new Date(data.ExpiryDate) >= new Date()
        );
        if (
          dataFiltered != undefined &&
          dataFiltered != null &&
          dataFiltered.length > 0
        ) {
          //if dataFiltered has values
          BirthdayHandler.setState({
            items: dataFiltered
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
      }
    });
  }

  public render(): React.ReactElement<IIntranetAnnouncementsProps> {
    return (
      <div className={styles.intranetAnnouncements}>
        <div className={styles.container}>
          <img src={`${icon}`} className={styles.rightalig} />

          <p className={styles.header}>Announcement</p>
          <div className="ms-Grid" dir="ltr">
            <div className={styles.sectionbody}>
              <div className={styles.item}>
                <div className={styles.jobsection}>
                  <div className={styles.jobitem}>
                    {this.state.items.map(function (item, key) {
                      return (
                        <div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-md4">
                              <div className={styles.dateitem}>
                                <img src={require("../assets/Ann1.png")} alt="test" />
                              </div>
                            </div>
                            <div className="ms-Grid-col ms-md8">
                              <p className={styles.subject}>{item.Title}</p>
                              <p className={styles.subject1}>
                                {item.Description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link
            href={`${this.props.siteurl}/Lists/${this.props.listName}/AllItems.aspx`}
            target="_blank"
            className={styles.viewAll}
          >
            <img src={`${arrow}`} className={styles.viewAll} />
          </Link>
        </div>
      </div>
    );
  }
}
