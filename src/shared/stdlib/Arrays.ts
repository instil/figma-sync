export const filterUndefined = <Input>(array: (Input | undefined)[]): Input[] =>
  array.filter(element => element !== undefined) as Input[];
