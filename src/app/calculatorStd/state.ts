const OPERATION = ["+", "-", "*", "/", null]  as const;// Константный массив операций с двумя операндами
type ActOperation = (typeof OPERATION)[number]; // Новый тип данных  "OPERATION[]"

export type CalcState = {
   display : string
   previous : number | null
   pendingOp : ActOperation
   overwrite : boolean
   error : boolean
   lastAnswer : number
};
// Переменная состояния калькулятора
export const state : CalcState = {
     display    : "0",
     previous   : null,
     pendingOp  : null,
     overwrite  : true,
     error      : false,
     lastAnswer : 0
};