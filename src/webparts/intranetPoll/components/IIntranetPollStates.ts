export interface IIntranetPollStates {
    // ID: string;
    // Title?: string;
    // Description?: string;
    // StaticName?: string;
    // TypeAsString?: string;
    // Choices?: string[];
    // selectedValue?: string;
    loaded: boolean;
    alreadyVote?: boolean;
    existingAnswer?: string;
    question?: string;
    questionInternalName?: string;
    choices?: string[];
    viewResults?: boolean;
    resultsLoaded?: boolean;
    popupOpened?: boolean;
    popupErrorOpened?: boolean;
    selectedValue?: string;
    results?: number[];
  }