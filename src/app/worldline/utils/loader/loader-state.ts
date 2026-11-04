export interface LoaderState<T> {
    loading?: boolean;
    error?: boolean;
    success?: boolean;
    cancel?:boolean;
    value?: T;
}
