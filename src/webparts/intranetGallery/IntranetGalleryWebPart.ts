import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'IntranetGalleryWebPartStrings';
import IntranetGallery from './components/IntranetGallery';
import { IIntranetGalleryProps } from './components/IIntranetGalleryProps';

export interface IIntranetGalleryWebPartProps {
  description: string;
  listName: string;
}

export default class IntranetGalleryWebPart extends BaseClientSideWebPart<IIntranetGalleryWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIntranetGalleryProps > = React.createElement(
      IntranetGallery,
      {
        description: this.properties.description,
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
