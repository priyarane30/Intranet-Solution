import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'IntranetAnniversaryWebPartStrings';
import IntranetAnniversary from './components/IntranetAnniversary';
import { IIntranetAnniversaryProps } from './components/IIntranetAnniversaryProps';

export interface IIntranetAnniversaryWebPartProps {
  description: string;
}

export default class IntranetAnniversaryWebPart extends BaseClientSideWebPart<IIntranetAnniversaryWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIntranetAnniversaryProps > = React.createElement(
      IntranetAnniversary,
      {
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
                PropertyPaneTextField('siteurl', {
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
