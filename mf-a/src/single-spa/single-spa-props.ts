import { signal } from '@angular/core';
import type { AppProps } from 'single-spa';

export type SingleSpaProps = AppProps & {};

export const singleSpaProps = signal<SingleSpaProps | null>(null);
