import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'IntranetEmployeeSpotlightWebPartStrings';
import IntranetEmployeeSpotlight from './components/IntranetEmployeeSpotlight';
import { IIntranetEmployeeSpotlightProps } from './components/IIntranetEmployeeSpotlightProps';

export interface IIntranetEmployeeSpotlightWebPartProps {
  description: string;
  listName: string;
}

export default class IntranetEmployeeSpotlightWebPart extends BaseClientSideWebPart<IIntranetEmployeeSpotlightWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIntranetEmployeeSpotlightProps > = React.createElement(
      IntranetEmployeeSpotlight,
      {
        description: this.properties.description,
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
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
