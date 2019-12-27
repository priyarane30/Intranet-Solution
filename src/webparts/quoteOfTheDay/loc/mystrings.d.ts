declare interface IQuoteOfTheDayWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ListFieldLabel:string;
}

declare module 'QuoteOfTheDayWebPartStrings' {
  const strings: IQuoteOfTheDayWebPartStrings;
  export = strings;
}
