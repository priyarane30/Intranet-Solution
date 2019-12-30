import * as React from "react";
import styles from "./IntranetJobOpening.module.scss";
import { IIntranetJobOpeningProps } from "./IIntranetJobOpeningProps";
import { IIntranetJobOpeningState } from "./IIntranetJobOpeningState";
import { escape } from "@microsoft/sp-lodash-subset";
import * as jquery from "jquery";
import { Link } from "office-ui-fabric-react/lib/components/Link";

//const icon: string = require('../assets/icon.png');
const arrow: string = require("../assets/arrow.jpg");

export default class IntranetJobOpening extends React.Component<
  IIntranetJobOpeningProps,
  IIntranetJobOpeningState
> {
  public constructor(props: IIntranetJobOpeningProps) {
    super(props);

    this.state = {
      items: [
        {
          Title: "",
          Technology: "Test",
          Experience: "Test description"
        }
      ],
      currentopening: "",
      counter: 0
    };
  }

  public componentDidMount() {
    this.GetItemsForJobOpening();
  }

  public GetItemsForJobOpening() {
    var JobOpeningHandler = this;
    var anncurl = `${this.props.siteurl}/_api/web/lists/getbytitle('OpenPostions')/items?$orderby=RaisedDate desc&$top=3`;
    jquery.ajax({
      url: anncurl,
      type: "GET",
      headers: { Accept: "application/json; odata=verbose;" },
      success: function(resultData) {
        JobOpeningHandler.setState({
          //  items: dataFiltered
          items: resultData.d.results
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
      }
    });
  }

  public render(): React.ReactElement<IIntranetJobOpeningProps> {
    var redirectLink = `${this.props.siteurl}/SitePages/Open-Job-Positions.aspx`;
    return (
      <div className={styles.intranetJobOpening}>
        <div className={styles.container}>
          <p className={styles.header}>Job Openings</p>
          <div className="ms-Grid" dir="ltr">
            <div className={styles.sectionbody}>
              <div className={styles.item}>
                <div className={styles.jobsection}>
                  <div className={styles.jobitem}>
                    {this.state.items.map(function(item, key) {
                      return (
                        <div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-md4">
                              <div className={styles.dot}>
                                {item.Technology}
                              </div>
                            </div>
                            <div className="ms-Grid-col  ms-md8 ">
                              <div className={styles.subject}>{item.Title}</div>
                              <div className={styles.subject1}>
                                {item.Experience} Years
                              </div>
                              <div className={styles.subject2}>
                                <Link
                                  href={redirectLink}
                                  target="_blank"
                                  className={styles.subject2}
                                >
                                  More Details &rarr;
                                </Link>
                              </div>
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
        </div>
      </div>
    );
  }
}
