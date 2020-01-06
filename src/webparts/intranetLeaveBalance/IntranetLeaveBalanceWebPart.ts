import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'IntranetLeaveBalanceWebPartStrings';
import IntranetLeaveBalance from './components/IntranetLeaveBalance';
import { IIntranetLeaveBalanceProps } from './components/IIntranetLeaveBalanceProps';

export interface IIntranetLeaveBalanceWebPartProps {
  description: string;
}

export default class IntranetLeaveBalanceWebPart extends BaseClientSideWebPart<IIntranetLeaveBalanceWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IIntranetLeaveBalanceProps > = React.createElement(
      IntranetLeaveBalance,
      {
        description: this.properties.description,
        siteURL: this.context.pageContext.web.absoluteUrl,
        username:this.context.pageContext.user.loginName
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
