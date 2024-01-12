import { ViewContainerRef } from "@angular/core";
import { EMPTY, fromEvent, Observable } from "rxjs";

// Turn ionic page events into observables

function fromContainerEvent(ref: ViewContainerRef, eventName: string): Observable<any> {
  const el = ref?.element?.nativeElement;
  return el ? fromEvent(el, eventName) : EMPTY;
}

export function ionViewWillEnter(ref: ViewContainerRef): Observable<any> {
  return fromContainerEvent(ref, 'ionViewWillEnter');
}

export function ionViewDidEnter(ref: ViewContainerRef): Observable<any> {
  return fromContainerEvent(ref, 'ionViewDidEnter');
}

export function ionViewWillLeave(ref: ViewContainerRef): Observable<any> {
  return fromContainerEvent(ref, 'ionViewWillLeave');
}

export function ionViewDidLeave(ref: ViewContainerRef): Observable<any> {
  return fromContainerEvent(ref, 'ionViewDidLeave');
}
