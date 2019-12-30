import * as React from 'react';
import styles from './IntranetNewJoinee.module.scss';
import { IIntranetNewJoineeProps } from './IIntranetNewJoineeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";


export default class IntranetNewJoinee extends React.Component<IIntranetNewJoineeProps, {}> {
  public render(): React.ReactElement<IIntranetNewJoineeProps> {
    return (
      <div className={ styles.intranetNewJoinee }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}





export interface INewJoineeState{
  items:[
    {
      Title: string;
      //FirstName: string;
     // LastName:string;
      DateofJoining: string;
      EmploymentStatus:string;

    }
  ],
   "NewJoineeUser":string,
  // "NewJoineeUser1":string,
   "counter":number
}

export default class NewJoinee extends React.Component<INewJoineeProps, INewJoineeState> {
  public constructor(props:INewJoineeProps, state:INewJoineeState) {
    super(props);
    this.state = { 
      items:[
              {
                "Title":"",
                "DateofJoining":"",
                "EmploymentStatus":""
               
              }
            ] ,
            "NewJoineeUser":"",
            //"NewJoineeUser1":"",
            "counter":0
    };
  }
 public componentDidMount() {
    this.GetItemsForNewJoinee();
  
  }
  public componentWillMount(){
    var timer = setInterval(() => {
      this.renderUser()
    },7000)
  }
  
  renderUser(){
    this.setState({
      NewJoineeUser:this.state.items[this.state.counter].Title,
      //NewJoineeUser1:this.state.items[this.state.counter].LastName,
    });
    this.setState({
      counter:this.state.counter == this.state.items.length - 1 ? 0 : this.state.counter + 1
    })
  }

  public GetItemsForNewJoinee() {
       
  //   var BirthdayHandler = this;
  //   var anncurl = `${this.props.siteurl}/_api/web/lists/getbytitle('EmployeeContact')/items?$top=5 &$orderby=ID desc`;
  //   jquery.ajax({ 
         
  //     url: anncurl,
  //     type: "GET", 
  //     headers:{'Accept': 'application/json; odata=verbose;'}, 
  //     success: function(resultData) { 
  //        //filter Data
  //        var dataFiltered = resultData.d.results.filter(data =>

  //         data.Status == 'Active' 
  //       );
  //       if (dataFiltered != undefined && dataFiltered != null && dataFiltered.length > 0) {
  //         //if dataFiltered has values
  //         BirthdayHandler.setState({
  //           items: dataFiltered
  //         });
  //       }
  //     }, 
  //     error : function(jqXHR, textStatus, errorThrown) { 
  //       console.log(jqXHR);
  //     }
    
  // }); 

 axios.get(
`${this.props.siteurl}/_api/web/lists/getbytitle('EmployeeContact')/items?$top=5 &$orderby=ID desc & $Filter=Status eq 'Active'`
      )
      .then(res => {
const items = res.data.value;
this.setState({ items });
      })
      .catch(error => {
        console.log(error);
      });



}  
  public render(): React.ReactElement<INewJoineeProps> {
    return (
      <div className={ styles.newJoinee }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
            <img  src={require('./03.jpg')}alt="test" />
            <div className="ms-Grid-col ms-md12">
                    <div className={styles.BirthdayHeader}>Welcome Aboard</div>
              {this.state.items.length > 1 ? 
              ( <div className={styles.para}>{this.state.NewJoineeUser}</div> )
              :
              ( <div className={styles.para}>{this.state.items[0].Title}</div>)
            }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
