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
  Options extends Partial<ITaskerOptions>,
  // Inferred option from the 'distinctiveResults' option
  HasDistinctiveResult extends Options['distinctiveResults'] extends true ? true : false,
> {
  private readonly options: Options;

  constructor(
    private readonly elements: Element[],
    private readonly task: Task,
    options?: Options,
  ) {
    // Merge options
    this.options = {
      ...defaultTaskerOptions,
      ...options,
    } as Options;
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
      (HasDistinctiveResult extends true
        ? DistinctiveResult
        : NonDistinctiveResult
      )
    >,
  >(): Promise<{
    // The result of the tasker
    result: TaskerResult,
    // If the tasker has errors
    hasErrors: boolean,
  }> {
    let hasErrors = false;
  
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
    const result = Object.assign({}, ...results);
 
    return {
      result,
      hasErrors,
    };
  }
}

const defaultTaskerOptions: ITaskerOptions = {
  throwOnError: false,
  distinctiveResults: false,
};

type ITaskerOptions = {
  /**
   * If true, throw the error instead of adding it to the result.
   *
   * @default false
   */
  throwOnError: boolean;

  /**
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
   */
  distinctiveResults: boolean;
}