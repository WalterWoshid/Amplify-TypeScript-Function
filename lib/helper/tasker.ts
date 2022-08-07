/**
 * The Tasker class is a wrapper around a series of promises.
 *
 * It allows you to run a series of promises in parallel,
 * and then wait for all of them to finish.
 *
 * For the better type safety, use the 'strictNullChecks' flag in your tsconfig.json file.
 */
export class Tasker<
  // Extracted element type
  Element extends string | number | symbol,
  // Task to be executed for each element
  Task extends (element: Element) => Promise<any>,
  // Return type of the task
  TaskResult extends ReturnType<Task>,

  // Options
  Options extends Partial<ITaskerAllOptions<NoError, ThrowOnError, HasDistinctiveResult>>,
  // Inferred option from the 'noError' option
  NoError extends Options['noError'] extends true ? true : false,
  // Inferred option from the 'throwOnError' option
  ThrowOnError extends Options['throwOnError'] extends true ? true : false,
  // Inferred option from the 'distinctiveResults' option
  HasDistinctiveResult extends Options['distinctiveResults'] extends true ? true : false,
> {
  private readonly options: ITaskerAllOptions;

  constructor(
    private readonly elements: Element[],
    private readonly task: Task,
    // Pass options with `as const` to prevent type errors
    options?: Options,
  ) {
    // Merge options
    this.options = {
      ...defaultTaskerOptions,
      ...options,
    };
  };

  /**
   * @description Run the tasker.
   *
   *
   * @example
   * const numbers = [1, 2, 3];
   *
   * function double(x: number): number {
   *   return x * 2;
   * }
   *
   * const task = await new Tasker(
   *   numbers,
   *   double,
   * ).run();
   *
   *
   * To iterate over the result, use the `Object.entries` method:
   *
   * @example
   * Object.entries(task.result).forEach(([key, result]) => {
   *   console.log(`${key}: ${result}`);
   *
   *   // For automatic type resolution, use the 'strictNullChecks' flag in your tsconfig.json file.
   *   if (!result.isError) {
   *     // Handle success
   *     // ...
   *   } else {
   *     // Handle result
   *     // ...
   *   }
   * });
   */
  async run<
    // The result of a successful task
    TaskSuccess extends Awaited<TaskResult>,
    // The result of a failed task
    TaskError extends Awaited<Error>,

    // Typescript automatically infers the result type from a truthy/falsy check
    IsError extends true | false,
    CheckableError extends { isError: IsError },

    HasErrors extends boolean,
    HasErrorsCondition extends NoError extends true
      ? {}
      : ThrowOnError extends true
        ? {}
        : {
          // If the tasker has errors
          hasErrors: HasErrors
        },

    /**
     * @see ITaskerOptions.distinctiveResults
     */
    DistinctiveResult extends IsError extends false
      ? { error: TaskError } & { isError: true }
      : { value: TaskSuccess } & { isError: false },

    /**
     * @see ITaskerOptions.distinctiveResults
     */
    NonDistinctiveResult extends IsError extends false
      ? { value: TaskError } & { isError: true }
      : { value: TaskSuccess } & { isError: false },

    TaskerResult extends Record<
      Element | string | number | symbol,
      NoError extends true
        ? TaskSuccess
        : ThrowOnError extends true
          ? TaskSuccess
          : HasDistinctiveResult extends true
            ? DistinctiveResult
            : NonDistinctiveResult
    >,

    RunResult extends {
      // The result of the tasker
      result: TaskerResult,
    } & HasErrorsCondition
  >(): Promise<RunResult> {
    let hasErrors: boolean = false;
  
    const results = await Promise.all(
      this.elements.map(element => {
        return new Promise(async resolve => {
          try {
            const taskResult = await this.task(element) as TaskSuccess & CheckableError;
            taskResult.isError = false;

            resolve({
              [element]: taskResult,
            });
          } catch (e) {
            e = e as TaskError & CheckableError;

            if (this.options.throwOnError) {
              throw e;
            } else {
              hasErrors = true;
              e.isError = true;

              return resolve({
                [element]: e
              });
            }
          }
        });
      })
    );

    // Squash results into a single object
    const result: TaskerResult = Object.assign({}, ...results);

    return {
      result,
      hasErrors: (this.options.noError || this.options.throwOnError)
        ? undefined
        : hasErrors as HasErrors,
    } as any;
  }
}

const defaultTaskerOptions: ITaskerAllOptions = {
  noError: false,
  throwOnError: false,
  distinctiveResults: false,
};

interface ITaskerAllOptions<
  NoError = boolean,
  ThrowOnError = boolean,
  DistinctiveResults = boolean
> {
  /**
   * Disable error handling.
   *
   * @default false
   */
  noError: NoError;

  /**
   * If true, throw the error instead of adding it to the result.
   *
   *
   * <b>If true:</b>
   *
   * ```
   * result = {
   *   [element]: Result,
   * }
   * ```
   *
   * <b>If false:</b>
   * ```
   * result = {
   *   [element]: {
   *     isError: boolean,
   *     value: Result | Error,
   *   }
   * }
   * ```
   *
   * @default false
   *
   * @constraint If 'noError' is true, this option is ignored.
   */
  throwOnError: NoError extends true ? never : ThrowOnError;

  /**
   * Whether to create the property 'value' and 'error' separately or combine them into a single property 'value'.
   *
   * <b>If true:</b>
   *
   * ```
   * result = {
   *   [elementWithError]: {
   *     isError: true,
   *     error: Error,
   *   },
   *   [elementWithoutError]: {
   *     isError: false,
   *     value: Result,
   *   },
   * }
   * ```
   *
   * <b>If false:</b>
   * ```
   * result = {
   *   [element]: {
   *     isError: false | true,
   *     value: Result | Error,
   *   },
   * }
   * ```
   *
   * @default false
   *
   * @constraint If 'noError' or 'throwOnError' is true, this option is ignored.
   */
  distinctiveResults: NoError extends true
    ? never
    : ThrowOnError extends true
      ? never
      : DistinctiveResults;
}