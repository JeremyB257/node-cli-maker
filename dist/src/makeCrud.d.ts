interface CrudOptions {
    withTimestamps?: boolean;
    additionnalFiels?: Record<string, string>;
}
export declare function makeCrud(entity: string, options?: CrudOptions): void;
export {};
