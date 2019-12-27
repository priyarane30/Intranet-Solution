import { IMeeting } from '.';

export interface IIntranetUpcomingMeetingsState {
  error: string;
  loading: boolean;
  meetings: IMeeting[];
  renderedDateTime: Date;
}