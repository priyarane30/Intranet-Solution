import * as React from 'react';
import styles from './IntranetPoll.module.scss';
import { IIntranetPollProps } from './IIntranetPollProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from "jquery";
import { IIntranetPollStates } from './IIntranetPollStates';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import { SPSurveyService } from './SPSurveyService';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { Spinner, SpinnerType } from 'office-ui-fabric-react/lib/Spinner';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Button, ButtonType } from 'office-ui-fabric-react/lib/Button';
export interface ISPListItems {
  value: IIntranetPollStates[];
}
export default class IntranetPoll extends React.Component<IIntranetPollProps, IIntranetPollStates> {

  public myPageContext: IWebPartContext;
  public guid: string;

  public constructor(props: IIntranetPollProps, context: IWebPartContext) {
    super(props, context);
    this.myPageContext = this.props.context;
    this.guid = this.getGuid();
    this.state = {
      // ID: "",
      // Title: "",
      // Description: "",
      // StaticName: "",
      // TypeAsString: "",
      // Choices: [],
      // selectedValue: '',
      loaded: false,
      viewResults: false,
      resultsLoaded: false,
      alreadyVote: false,
      choices: [],
      question: '',
      questionInternalName: '',
      existingAnswer: '',
      popupOpened: false,
      popupErrorOpened: false,
      selectedValue: '',
      results: []
    };
    this.onVoteChanged = this.onVoteChanged.bind(this);
    this.vote = this.vote.bind(this);
  }

  public getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  public s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  public componentDidMount() {
    this.loadQuestions(this.props);

  }
  public loadQuestions(props: IIntranetPollProps): void {
    var PollHandler = this;
    if (props.surveyList == null || props.surveyList == '')
      return;

    //Request the survey questions
    const listService: SPSurveyService = new SPSurveyService(props, this.myPageContext);
    listService.getQuestions(props.surveyList).then((response) => {
      var responseVal = response.value;
      if (responseVal == null || responseVal.length == 0)
        return;
      var item = responseVal[0];
      // this.state.choices = item.Choices;
      // this.state.question = item.Title;
      // this.state.questionInternalName = item.StaticName;
      PollHandler.setState({
        choices: item.Choices,
        question: item.Title,
        questionInternalName: item.StaticName
      });
      //Request the existing votes to get current user voting status
      // listService.getVoteForUser(props.surveyList, item.StaticName, this.myPageContext.pageContext.user.loginName).then((responseVote) => {
      //   var responseVoteVal = responseVote.value;

      //   if (responseVoteVal.length > 0) {
      //     // this.state.alreadyVote = true;
      //     // this.state.selectedValue = responseVoteVal[0].Title;
      //     PollHandler.setState({
      //       alreadyVote: true,
      //       selectedValue: responseVoteVal[0].Title
      //     })
      //   }
      //   else
      //     PollHandler.setState({ alreadyVote: false })
      //   //this.state.alreadyVote = false;

      //   //  this.state.loaded = true;
      //   PollHandler.setState({ loaded: true })
      //   this.setState(this.state);
      // });
    });
  }

  public render(): React.ReactElement<IIntranetPollProps> {

    //Display the items list
    return (
      <div className={styles.intranetPoll}>
        <div className={styles.container}>

          <div className={styles.pollquestion}>{this.state.question}</div>

          <div style={{ lineHeight: '28px' }}>
            {this.state.choices.map((answer: string, i: number) => {
              return (
                <div className={styles.radiocolor}><input type='radio' defaultChecked={answer == this.state.selectedValue ? true : false} aria-checked={answer == this.state.selectedValue ? true : false} onChange={this.onVoteChanged} disabled={this.state.alreadyVote} name={this.guid} value={answer} /> {answer}</div>
              );
            })}
          </div>
          <div style={{ paddingTop: '20px' }}>
            {this.state.alreadyVote != true ?
              <input type='button' onClick={this.vote} style={{ color: 'black' }} disabled={this.state.alreadyVote} value="Vote" className='ms-Button ms-Button--primary' />
              : ''}
          </div>
        </div>
      </div>

    );


  }

  public onVoteChanged(elm?: any): void {
    console.log(elm.currentTarget.value);
    this.setState({ selectedValue: elm.currentTarget.value });
  }

  public vote(elm?: any): void {
    //Check if a value has been selected
    if (this.state.selectedValue == null || this.state.selectedValue == '') {
      this.setState(this.state);
    }
    else {
      const listService: SPSurveyService = new SPSurveyService(this.props, this.myPageContext);
      listService.postVote(this.props.surveyList, this.state.questionInternalName, this.state.selectedValue).then((response) => {
        //this.state.ID

        this.setState(this.state);
      });
    }

  }

}
