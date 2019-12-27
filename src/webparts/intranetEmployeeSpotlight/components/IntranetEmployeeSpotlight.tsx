import * as React from 'react';
import styles from './IntranetEmployeeSpotlight.module.scss';
import {
  Persona,
  PersonaSize
} from 'office-ui-fabric-react/lib/components/Persona';
import { IIntranetEmployeeSpotlightProps } from './IIntranetEmployeeSpotlightProps';
import { IIntranetEmployeeSpotlightState } from './IIntranetEmployeeSpotlightState';

import { escape } from '@microsoft/sp-lodash-subset';
import axios from 'axios';

const logo: string = require('../assets/logo.png');

export default class IntranetEmployeeSpotlight extends React.Component<IIntranetEmployeeSpotlightProps, IIntranetEmployeeSpotlightState> {
 
  public constructor(props: IIntranetEmployeeSpotlightProps, state: IIntranetEmployeeSpotlightState) {
    super(props);
    this.state = {
      items: [
        {
          NameOf_x0020_Employee: {
            "EMail": "",
            "FirstName": "",
            "LastName": ""
          },
          AwardName: "No award to Display",
          Expiry_x0020_Date: ""
        }
      ]
    };
  }
  public componentDidMount() {
    this.GetItemsForEmployeeAward();
  }
  public GetItemsForEmployeeAward=()=> {
    axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$select=NameOf_x0020_Employee/EMail,NameOf_x0020_Employee/FirstName,NameOf_x0020_Employee/LastName,NameOf_x0020_Employee/EMail,AwardName,Expiry_x0020_Date&$expand=NameOf_x0020_Employee/Id&$Filter=Expiry_x0020_Date ge datetime'${new Date().toISOString()}'`)
      .then(res => {
        const items = res.data.value;
        this.setState({ items });
      }).catch(error => {
        console.log(error);
      });
  
  }
 
  public render(): React.ReactElement<IIntranetEmployeeSpotlightProps> {
    return (
      <div className={ styles.intranetEmployeeSpotlight }>
        <div className={ styles.container }>
        <img src={`${logo}`} className={styles.rightalig} />
          <p className={styles.header}>Employee Spotlight</p>
          <div className={styles.paddin}>
            {this.state.items.map((item, key)=> {
              return (<div>
                <Persona primaryText={`${item.NameOf_x0020_Employee.FirstName} ${item.NameOf_x0020_Employee.LastName}`}   //Set user's Mail and subject
                  secondaryText={item.AwardName}
                  imageUrl={`https://synoverge.sharepoint.com/sites/leadership-connection/_layouts/15/userphoto.aspx?size=L&accountname=${item.NameOf_x0020_Employee.EMail}`}
                />
                <br />
              </div>);
            })}
          </div>
        </div>
      </div>
    );
  }
}
