import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'IntranetNewJoineeWebPartStrings';
import IntranetNewJoinee from './components/IntranetNewJoinee';
import { IIntranetNewJoineeProps } from './components/IIntranetNewJoineeProps';

export interface IIntranetNewJoineeWebPartProps {
  description: string;
}

export default class IntranetNewJoineeWebPart extends BaseClientSideWebPart<IIntranetNewJoineeWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIntranetNewJoineeProps > = React.createElement(
      IntranetNewJoinee,
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
