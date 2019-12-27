import * as React from 'react';
import { IIntranetOutlookProps } from './IIntranetOutlookProps';
import { IPersonalEmailState, IMessage, IMessages } from '.';
import { escape } from '@microsoft/sp-lodash-subset';
//Import Graph 
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
//Import styling 
import styles from './IntranetOutlook.module.scss';
import { List } from 'office-ui-fabric-react/lib/components/List';
import {
  Persona,
  PersonaSize
} from 'office-ui-fabric-react/lib/components/Persona';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { string } from 'prop-types';

const arrow: string = require('../assets/arrow.jpg');
const logo: string = require('../assets/logo.png');

export default class IntranetOutlook extends React.Component<IIntranetOutlookProps, IPersonalEmailState> {

  constructor(props: IIntranetOutlookProps) {
    super(props);
    this.state = {
      messages: [],
      loading: false,
      error: undefined
    };
  }

  public componentDidMount(): void {

    this.setState({
      error: null,
      loading: true,
      messages: []
    });
    // get information about the current user from the Microsoft Graph
    this.props.graphClient
      .api('/me/mailFolders/Inbox/messages')
      .filter("isDraft eq false")
      .orderby("receivedDateTime DESC")
      .top(5)
      .get((error: any, response: IMessages, rawResponse?: any) => {
        //Add response to state

        if (error) {

          // Something failed calling the MS Graph
          this.setState({
            error: error.message ? error.message : 'error',
            loading: false
          });
          return;
        }

        // Check if a response was retrieved
        if (response && response.value && response.value.length > 0) {
          this.setState({
            messages: response.value,
            loading: false
          });
        }
        else {
          // No messages found
          this.setState({
            loading: false
          });
        }

      });

  }

  public render(): React.ReactElement<IIntranetOutlookProps> {
    return (
      <div className={styles.intranetOutlook}>
        <div className={styles.container}>
          <img src={`${logo}`} className={styles.rightalig} />
          <p className={styles.header}>Outlook</p>
          <List items={this.state.messages}
            onRenderCell={this._onRenderCell} className={styles.list} />
          <Link href='https://outlook.office.com/owa/' target='_blank' className={styles.viewAll}>
            <img src={`${arrow}`} className={styles.viewAll} />
          </Link>
        </div>
      </div>
    );
  }
  private _onRenderCell = (item: IMessage, index: number | undefined): JSX.Element => {
    if (item.isRead) {
      styles.message = styles.message + " " + styles.isRead;
    }

    return <Link href={item.webLink} className={styles.message} target='_blank'>
      <div className={styles.date}>{(new Date(item.receivedDateTime).toLocaleDateString())}</div>
      <Persona primaryText={item.from.emailAddress.name}    //Set user's Mail and subject
        secondaryText={item.subject}
        imageUrl={item.image}
        className={styles.description} />
    </Link>;
  }
}
