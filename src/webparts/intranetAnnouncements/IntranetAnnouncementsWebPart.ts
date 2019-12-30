import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'IntranetAnnouncementsWebPartStrings';
import IntranetAnnouncements from './components/IntranetAnnouncements';
import { IIntranetAnnouncementsProps } from './components/IIntranetAnnouncementsProps';

export interface IIntranetAnnouncementsWebPartProps {
  listName: string;
}


export default class IntranetAnnouncementsWebPart extends BaseClientSideWebPart<IIntranetAnnouncementsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIntranetAnnouncementsProps > = React.createElement(
      IntranetAnnouncements,
      {
        siteurl: this.context.pageContext.web.absoluteUrl,
        listName: this.properties.listName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
