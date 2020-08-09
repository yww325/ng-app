export class Photo {
  id: string; 
  fileName: string;
  path: string;
  dateTaken:Date;
  mediaType : string;
  tags:string[];
  isPrivate: boolean;
  isChecked: boolean; // for multi selection to move
}
