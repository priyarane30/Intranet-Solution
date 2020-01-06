import * as React from 'react';
import styles from './InntranetInOutRegister.module.scss';
import { IInntranetInOutRegisterProps } from './IInntranetInOutRegisterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";
import { any } from "prop-types";
export default class InntranetInOutRegister extends React.Component<IInntranetInOutRegisterProps, any> {
  public constructor(props) {
    super(props);

    this.state = {
      employeeCode: "",
      apiUrl: "https://ia-hrms-qa.synovergetech.com/Timesheet/GetPunchValue",
      OfficeHours: any,
      BreakHours: any,
      WorkingHours: any,
      AVGWorkingHours: any,
      TotalWorkingHours: any,
      dataloaded: "false"
    };
  }
  public componentDidMount() {
    this.getEmployeeDetail();
  }
  public getEmployeeDetail() {
    if (this.state.employeeCode == "") {
      this.getEmployeeCode();
    } else {
      this.getInOutData();
    }
  }

  public getEmployeeCode = () => {
    // axios
    //   .get(
    //     `${this.props.siteURL}/_api/web/lists/getbytitle('EmployeeContact')/items?$Filter=Email eq '${this.props.username}'`
    //   )
    //   .then(res => {
    //     const employeeCode = res.data.value[0].EmployeeCode;
    //     this.setState({ employeeCode: employeeCode });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    this.setState({ employeeCode: "0313" });
  };

  public async getInOutData() {
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
          OfficeHours: response.data["OfficeHours"],
          BreakHours: response.data["BreakHours"],
          WorkingHours: response.data["WorkingHours"],
          AVGWorkingHours: response.data["AVGWorkingHours"],
          TotalWorkingHours: response.data["TotalWorkingHours"],
          PresentDays: "11",
          dataloaded: "true"
        });
      })
      .catch(error => {
        this.setState({ dataloaded: "error" });
      });
  }
  public render(): React.ReactElement<IInntranetInOutRegisterProps> {
    if (this.state.employeeCode == "" && this.state.dataloaded != "error") {
      this.getEmployeeDetail();
      return (
        <div className={styles.inntranetInOutRegister}>
          <div className={styles.container}>
            <p className={styles.header}>Today's Swipe</p>
            <p>Loading</p>
          </div>
        </div>
      );
    } else if (this.state.dataloaded == "false") {
      this.getEmployeeDetail();
      return (
        <div className={styles.inntranetInOutRegister}>
          <div className={styles.container}>
            <p className={styles.header}>Today's Swipe</p>
            <p>Loading</p>
          </div>
        </div>
      );
    } else if (this.state.dataloaded == "error") {
      this.getEmployeeDetail();
      return (
        <div className={styles.inntranetInOutRegister}>
          <div className={styles.container}>
            <p className={styles.header}>Today's Swipe</p>
            <p>Error loading data. Please contact administrator</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.inntranetInOutRegister}>
          <div className={styles.container}>
            <p className={styles.header}>Today's Swipe</p>
            <table>
              <tr>
                <th>OfficeHours</th>
                <th>WorkingHours</th>
                <th>BreakHours</th>
              </tr>
              <tr>
                <td>{this.state.OfficeHours}</td>
                {this.state.WorkingHours}
                <td>{this.state.BreakHours}</td>
                <td></td>
              </tr>
            </table>
            <div>
              <h4>Average Working Hours</h4>
              <label>WorkingHours</label>
              <p>{this.state.AVGWorkingHours}</p>
              <label>Total Working Hours</label>
              <p>{this.state.TotalWorkingHours}</p>
              <label>Present days</label>
              <p>{this.state.PresentDays}</p>
            </div>
          </div>
        </div>
      );
    }
  }
}
