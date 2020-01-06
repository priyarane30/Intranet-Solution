import * as React from 'react';
import styles from './IntranetLeaveBalance.module.scss';
import { IIntranetLeaveBalanceProps } from './IIntranetLeaveBalanceProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";
const logo: string = require("../assets/logo.png");

export default class IntranetLeaveBalance extends React.Component<IIntranetLeaveBalanceProps, any> {
  public constructor(props) {
    super(props);

    this.state = {
      apiUrl: "https://ia-hrms-qa.synovergetech.com/HRMS/GetLeaveBalance",
      employeeCode: "",
      balancePL: "",
      floater: "",
      compOff: "",
      dataloaded: "false"
    };
    this.redirectToApplyLeace = this.redirectToApplyLeace.bind(this);
  }
  public componentDidMount() {
    this.getEmployeeDetail();
  }
  public render(): React.ReactElement<IIntranetLeaveBalanceProps> {
    if (this.state.employeeCode == "" && this.state.dataloaded != "error") {
      this.getEmployeeDetail();
      return (
        <div className={styles.intranetLeaveBalance}>
          <div className={styles.container}>
            <img src={`${logo}`} className={styles.rightalign} />
            <p className={styles.header}>Leave Details</p>
            <div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      );
    } else if (this.state.dataloaded == "false") {
      this.getEmployeeDetail();
      return (
        <div className={styles.intranetLeaveBalance}>
          <div className={styles.container}>
            <img src={`${logo}`} className={styles.rightalign} />
            <p className={styles.header}>Leave Details</p>
            <div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      );
    } else if (this.state.dataloaded == "error") {
      <div className={styles.intranetLeaveBalance}>
        <div className={styles.container}>
          <img src={`${logo}`} className={styles.rightalign} />
          <p className={styles.header}>Leave Details</p>
          <div>
            <p>Error loading data. Please contact administrator</p>
          </div>
        </div>
      </div>;
    } else {
      return (
        <div className={styles.intranetLeaveBalance}>
          <div className={styles.container}>
            <img src={`${logo}`} className={styles.rightalign} />
            <p className={styles.header}>Leave Details</p>
            <div>BalancePLS : {this.state.balancePL}</div>
            <div>Floaters : {this.state.floater}</div>
            <div>Comp-Off : {this.state.compOff}</div>
            <button
              type="submit"
              onClick={this.redirectToApplyLeace}
              className={styles.button}>
              Apply Leave
            </button>
          </div>
        </div>
      );
    }
  }
  public getEmployeeDetail() {
    if (this.state.employeeCode == "") {
      this.fetchEmployeeCode();
    } else {
      this.fetchLeaveDetail();
    }
  }
  public redirectToApplyLeace() {
    window.open("http://portals.synovergetech.com/HRMS/AddLeaveDetail");
  }
  public fetchEmployeeCode() {
    var employeeEmail = this.props.username;
    axios
      .get(
        `${this.props.siteURL}/_api/web/lists/getbytitle('EmployeeContact')/items?$Filter=Email eq '${employeeEmail}'`
      )
      .then(res => {
        const employeeCode = res.data.value[0].EmployeeCode;
        this.setState({ employeeCode: employeeCode });
      })
      .catch(error => {
        this.setState({ dataloaded: "error" });
      });
  }
  public async fetchLeaveDetail() {
    const headers = {
      "Content-Type": "application/json"
    };
    var dataBody = JSON.stringify({
      url: this.state.apiUrl,
      EmployeeCode: this.state.employeeCode
    });
    await axios
      .post(
        "https://prod-16.centralindia.logic.azure.com:443/workflows/35f586c139a6452081502390d62b1d12/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Clpa_MZWtebjZ1GE_QYpA7PEGw_4ouJVfw7-Nbyhyfs",
        dataBody,
        { headers: headers }
      )
      .then(response => {
        this.setState({
          balancePL: response.data[0]["LeaveBalanace"],
          floater: response.data[1]["LeaveBalanace"],
          compOff: response.data[2]["LeaveBalanace"],
          dataloaded: "true"
        });
      })
      .catch(error => {
        this.setState({ dataloaded: "error" });
      });
  }
}
