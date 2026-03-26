export type SFBasic = number | string | boolean | null | undefined;
export type SFValue = SFBasic | SFObject | SFArray;
export interface SFObject {
  [key: string]: SFValue;
}
export type SFArray = SFValue[];
