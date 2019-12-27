import {IIntranetUpcomingMeetingsWebPartProps } from "../IntranetUpcomingMeetingsWebPart";
import { DisplayMode } from "@microsoft/sp-core-library";
import { MSGraphClient } from "@microsoft/sp-http";

export interface IIntranetUpcomingMeetingsProps extends IIntranetUpcomingMeetingsWebPartProps {
  displayMode: DisplayMode;
  graphClient: MSGraphClient;
  updateProperty: (value: string) => void;
}
