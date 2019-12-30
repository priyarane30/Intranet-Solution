export interface IBirthdayState {
    items: [
      {
        Title: string;
        DateOfBirth: string;
        Status: string;
      }
    ];
    currentBirthdayuser: string;
    counter: number;
    currentdate: number;
  }