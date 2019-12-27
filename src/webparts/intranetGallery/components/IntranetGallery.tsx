import * as React from 'react';
import styles from './IntranetGallery.module.scss';
import { IIntranetGalleryProps } from './IIntranetGalleryProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IIntranetGalleryState } from './IIntranetGalleryState';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import axios from 'axios';

const logo: string = require('../assets/logo.png');
export default class IntranetGallery extends React.Component<IIntranetGalleryProps, IIntranetGalleryState> {
  public constructor(props: IIntranetGalleryProps, state: IIntranetGalleryState) {
    super(props);
    this.state = {
      items: [{
        FileRef: ""
      }]

    };
  }
  public componentDidMount(): void {
    this.getimage();
  }
  public getimage = () => {
    axios.get(`${this.props.siteurl}/_api/web/lists/getbytitle('Quote_Picture')/items?$select=FileRef/FileRef&$top=9`)
      .then(res => {
        const items = res.data.value;
        this.setState({ items });
      }).catch(error => {
        console.log(error);
      });
  }
  public render(): React.ReactElement<IIntranetGalleryProps> {
    return (
      <div className={styles.intranetGallery}>
        <div className={styles.container}>
          <img src={`${logo}`} className={styles.rightalig} />
          <p className={styles.header}>Grid Gallery</p>
          <div className={styles.margin}>
            {this.state.items.map((item, key) => {
              return (
                <Link href={`${item.FileRef}`} target='_blank'>
                  <img src={`${item.FileRef}`} className={styles.image} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
