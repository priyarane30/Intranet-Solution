import * as React from "react";
import styles from "./IntranetJobOpening.module.scss";
import { IIntranetJobOpeningProps } from "./IIntranetJobOpeningProps";
import { IIntranetJobOpeningState } from "./IIntranetJobOpeningState";
import { Link } from "office-ui-fabric-react/lib/components/Link";
import axios from "axios";


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
 axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle('OpenPostions')/items?$orderby=RaisedDate desc&$top=3`)
    .then(res => {
      const Jobopeningdata = res.data.value;
      this.setState({ items: Jobopeningdata});
    })
    .catch(error => {
      console.log(error);
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
                            <a href="https://synoverge.sharepoint.com/" data-interception="off" target="_blank" rel="noopener noreferrer">
                            <div className={styles.subject}>{item.Title}</div>
                            </a>
                            
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
