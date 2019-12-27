import { MSGraphClient } from '@microsoft/sp-http';
import { DisplayMode } from "@microsoft/sp-core-library";


export interface IIntranetOutlookProps {
 displayMode: DisplayMode;
 graphClient: MSGraphClient;

}
