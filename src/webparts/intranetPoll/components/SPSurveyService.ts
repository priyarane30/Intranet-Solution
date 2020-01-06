import { ISPListItems, ISPListItem } from './ISPList';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { IIntranetPollProps } from './IIntranetPollProps';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import * as jquery from 'jquery';
export interface ISPSurveyService {
  /**
   * @function
   * Gets the question from a SharePoint list
   */
  postVote(surveyListId: string, question: string, choice: string);
}
export class SPSurveyService implements ISPSurveyService {
  public context: IWebPartContext;
  public props: IIntranetPollProps;

  /**
   * @function
   * Service constructor
   */
  constructor(_props: IIntranetPollProps, pageContext: IWebPartContext) {
    this.props = _props;
    this.context = pageContext;
  }
  public postVote(surveyListId: string, question: string, choice: string) {
    try {
      var restUrl: string = this.context.pageContext.web.absoluteUrl;
      restUrl += "/_api/Web/lists/GetByTitle('Poll')/fields"
      var item = {
        "__metadata": { "type": "SP.Data.PollListItem" },// this.getItemTypeForListName(listName) },//"SP.FieldChoice" },
        "Title": "newItemTitle"
      };
      item[question] = choice;
      jquery.ajax({
        url: restUrl,
        method: "POST",
        contentType: "application/json;odata=verbose",
        async: false,
        data: JSON.stringify(item),
        headers: {
          "Accept": "application/json; odata=verbose",
        },
        success: function (data) {
          console.log(data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  public getListName(listId: string): Promise<string> {
    var restUrl: string = this.context.pageContext.web.absoluteUrl;
    restUrl += "/_api/Web/Lists(guid'";
    restUrl += listId;
    restUrl += "')?$select=Title";
    var options: ISPHttpClientOptions = {
      headers: {
        "odata-version": "3.0",
        "Accept": "application/json"
      }
    };
    return this.context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1, options).then((response: SPHttpClientResponse) => {
      return response.text().then((responseFormated: string) => {
        var iTitle = responseFormated.indexOf("<d:Title>");
        var newStr = responseFormated.slice(iTitle + 9, responseFormated.length);
        newStr = newStr.slice(0, newStr.indexOf("</d:Title>"));
        return newStr;
      });
    });
  }

  public getItemTypeForListName(name: string): string {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
  }

  public getQuestions(surveyListId: string): Promise<ISPListItems> {

    //Request the SharePoint web service
    var restUrl: string = this.context.pageContext.web.absoluteUrl;
    restUrl += "/_api/Web/Lists(guid'";
    restUrl += surveyListId;
    restUrl += "')/fields?$filter=(CanBeDeleted%20eq%20true)&$top=1";

    return this.context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
      return response.json().then((responseFormated: any) => {
        var formatedResponse: ISPListItems = { value: [] };
        //Fetchs the Json response to construct the final items list
        responseFormated.value.map((object: any, i: number) => {
          //Tests if the result is a file and not a folder
          var spListItem: ISPListItem = {
            'ID': object["ID"],
            'Title': object['Title'],
            'StaticName': object['StaticName'],
            'TypeAsString': object['TypeAsString'],
            'Choices': object['Choices']
          };
          formatedResponse.value.push(spListItem);
        });
        return formatedResponse;
      });
    }) as Promise<ISPListItems>;
  }

  public getVoteForUser(surveyListId: string, question: string, userEmail: string): Promise<ISPListItems> {

    var restUrl: string = this.context.pageContext.web.absoluteUrl;
    restUrl += "/_api/Web/Lists(guid'";
    restUrl += surveyListId;
    restUrl += "')/items?$expand=Author&$select=" + question + ",Author/EMail&$top=999";

    return this.context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
      return response.json().then((responseFormated: any) => {
        var formatedResponse: ISPListItems = { value: [] };
        //Fetchs the Json response to construct the final items list
        responseFormated.value.map((object: any, i: number) => {

          var authorEmail = object['Author'].EMail;
          if (authorEmail == userEmail) {
            var spListItem: ISPListItem = {
              'ID': '',
              'Title': object[question]
            };
            formatedResponse.value.push(spListItem);
          }
        });
        return formatedResponse;
      });
    }) as Promise<ISPListItems>;
  }
}