import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'IntranetKeyDocumentWebPartStrings';
import IntranetKeyDocument from './components/IntranetKeyDocument';
import { IIntranetKeyDocumentProps } from './components/IIntranetKeyDocumentProps';

export interface IIntranetKeyDocumentWebPartProps {
  description: string;
  listName: string;
}

export default class IntranetKeyDocumentWebPart extends BaseClientSideWebPart<IIntranetKeyDocumentWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIntranetKeyDocumentProps > = React.createElement(
      IntranetKeyDocument,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        listName: this.properties.listName,
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
