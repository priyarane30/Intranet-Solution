import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'QuoteOfTheDayWebPartStrings';
import QuoteOfTheDay from './components/QuoteOfTheDay';
import { IQuoteOfTheDayProps } from './components/IQuoteOfTheDayProps';

export interface IQuoteOfTheDayWebPartProps {
  description: string;
  listName:string;
}

export default class QuoteOfTheDayWebPart extends BaseClientSideWebPart<IQuoteOfTheDayWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IQuoteOfTheDayProps > = React.createElement(
      QuoteOfTheDay,
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
