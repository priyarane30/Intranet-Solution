import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'IntranetUpcomingHolidaysWebPartStrings';
import IntranetUpcomingHolidays from './components/IntranetUpcomingHolidays';
import { IIntranetUpcomingHolidaysProps } from './components/IIntranetUpcomingHolidaysProps';

export interface IIntranetUpcomingHolidaysWebPartProps {
  description: string;
  listName: string;
}

export default class IntranetUpcomingHolidaysWebPart extends BaseClientSideWebPart<IIntranetUpcomingHolidaysWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIntranetUpcomingHolidaysProps > = React.createElement(
      IntranetUpcomingHolidays,
      {
        listName: this.properties.listName,
        siteurl: this.context.pageContext.web.absoluteUrl
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
                PropertyPaneTextField('listName', {
                  label: strings.ListFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
