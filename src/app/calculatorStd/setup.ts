// const TYPEBUTTON = ["data-digit", "data-op", "data-action"] as const; // Типы кнопок: цифры, бинарные операции, унарные операции
// type availableButton = (typeof TYPEBUTTON)[number]; // Новый тип данных "TYPEBUTTON[]"

import { event } from "@tauri-apps/api";

const keypad = document.querySelector<HTMLDivElement>('.keypad');

export function loadKey() : void {

if (!keypad) throw new Error('.keypad не найден'); // Защита, как в C

keypad.addEventListener("click", (event: MouseEvent) => {
  if (!(event.target instanceof HTMLButtonElement)) return;// Если клик между кнопками

  const d = event.target.dataset;

  if (d.digit !== undefined) {
    
    console.log("Цифра:", d.digit);
    return;
  }
  
  if (d.op !== undefined) {
    console.log("Операция:", d.op);
    return;
  }

  if (d.action !== undefined) {
    console.log("Действие:", d.action);
    // здесь позже будет switch
    return;
  }
})
};
