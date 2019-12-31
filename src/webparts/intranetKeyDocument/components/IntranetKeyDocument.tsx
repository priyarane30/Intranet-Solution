import * as React from 'react';
//Styling
import styles from './IntranetKeyDocument.module.scss';
import { Link } from 'office-ui-fabric-react/lib/components/Link';

import { IIntranetKeyDocumentProps } from './IIntranetKeyDocumentProps';
import { IIntranetKeyDocumentState } from './IIntranetKeyDocumentState';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from 'axios';

const logo: string = require('../assets/logo.png');

export default class IntranetKeyDocument extends React.Component<IIntranetKeyDocumentProps, IIntranetKeyDocumentState> {
  public constructor(props: IIntranetKeyDocumentProps, state: IIntranetKeyDocumentState) {
    super(props);
    this.state = {
      items: [
        {
          File: {
            Name: "",
            LinkingUri: "",
            File_x0020_Type: ""
          },
          File_x0020_Type: ""
        }
      ]
    };
  }
  public componentDidMount() {
    this.GetItemsForDocuments();
  }
  public GetItemsForDocuments = () => {
    axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle('Documents')/items?$select=File,File_x0020_Type&$expand=File`)
      .then(res => {
        if (res.data.value.length > 0) {
          const items = res.data.value;
          this.setState({ items });
        }
      }).catch(error => {
        console.log(error);
      });
  }
  public render(): React.ReactElement<IIntranetKeyDocumentProps> {
    return (
      <div className={styles.intranetKeyDocument}>
        <div className={styles.container}>
          <img src={`${logo}`} className={styles.rightalig} />
          <p className={styles.header}>Key Documents</p>
          <div className="ms-Grid" dir="ltr">
            {this.state.items.map((item, key) => {
              return (<div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm2 ms-md2">
                  <img width="35px" src={`https://synoverge.sharepoint.com/sites/leadership-connection/_layouts/images/ic${item.File_x0020_Type}.gif`} alt="Type img"></img>
                </div>
                <div className="ms-Grid-col ms-sm9 ms-md9">
                  <Link href={`${item.File.LinkingUri}`} target='_blank' className={styles.text}>{item.File.Name}</Link>
                </div>
              </div>);
            })}
          </div>
        </div>
      </div>
    );
  }
}
