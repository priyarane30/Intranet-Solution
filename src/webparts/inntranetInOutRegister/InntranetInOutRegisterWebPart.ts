import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'InntranetInOutRegisterWebPartStrings';
import InntranetInOutRegister from './components/InntranetInOutRegister';
import { IInntranetInOutRegisterProps } from './components/IInntranetInOutRegisterProps';

export interface IInntranetInOutRegisterWebPartProps {
  description: string;
}

export default class InntranetInOutRegisterWebPart extends BaseClientSideWebPart<IInntranetInOutRegisterWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IInntranetInOutRegisterProps > = React.createElement(
      InntranetInOutRegister,
      {
        description: this.properties.description,
        siteURL: this.context.pageContext.web.absoluteUrl,
        username: this.context.pageContext.user.loginName
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
