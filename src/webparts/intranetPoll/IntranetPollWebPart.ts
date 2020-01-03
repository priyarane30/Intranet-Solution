import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'IntranetPollWebPartStrings';
import IntranetPoll from './components/IntranetPoll';
import { IIntranetPollProps } from './components/IIntranetPollProps';
import { PropertyFieldColorPickerMini } from 'sp-client-custom-fields/lib/PropertyFieldColorPickerMini';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldSPListPicker, PropertyFieldSPListPickerOrderBy } from 'sp-client-custom-fields/lib/PropertyFieldSPListPicker';
export interface IIntranetPollWebPartProps {
  description: string;
  context?: any;
  font: string;
  size: string;
  color: string;
  chartType?: string;
  surveyList: string;
}

export default class IntranetPollWebPart extends BaseClientSideWebPart<IIntranetPollWebPartProps> {
  public constructor(context?: IWebPartContext) {
    super();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
  }
  public render(): void {
    const element: React.ReactElement<IIntranetPollProps > = React.createElement(
      IntranetPoll,
      {
        surveyList: this.properties.surveyList,
        description: this.properties.description,
        context: this.context,
        siteurl: this.context.pageContext.web.absoluteUrl,
        font: this.properties.font,
        size: this.properties.size,
        color: this.properties.color,
        chartType: this.properties.chartType,
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
                PropertyFieldSPListPicker('surveyList', {
                  label: strings.surveyList,
                  selectedList: this.properties.surveyList,
                  includeHidden: false,
                  baseTemplate: 102,
                  orderBy: PropertyFieldSPListPickerOrderBy.Title,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  context: this.context,
                  properties: this.properties,
                  key: 'simplePollListField'
                }),
                PropertyPaneDropdown('chartType', {
                  label: strings.chartType,
                  options: [
                    {key: 'pie', text: 'Pie chart'},
                    {key: 'horizontalBar', text: 'Bar chart'}
                  ]
                }),
                PropertyPaneToggle('forceVoteToViewResults', {
                  label: strings.forceVoteToViewResults
                })
              ]
            },
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldFontPicker('font', {
                  label: strings.FontFieldLabel,
                  useSafeFont: true,
                  previewFonts: true,
                  initialValue: this.properties.font,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'simplePollFontField'
                }),
                PropertyFieldFontSizePicker('size', {
                  label: strings.FontSizeFieldLabel,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.size,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'simplePollSizeField'
                }),
                PropertyFieldColorPickerMini('color', {
                  label: strings.ColorFieldLabel,
                  initialColor: this.properties.color,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  key: 'simplePollColorField'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
