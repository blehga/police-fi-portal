
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model organization_databases
 * 
 */
export type organization_databases = $Result.DefaultSelection<Prisma.$organization_databasesPayload>
/**
 * Model organization_subscriptions
 * 
 */
export type organization_subscriptions = $Result.DefaultSelection<Prisma.$organization_subscriptionsPayload>
/**
 * Model organizations
 * 
 */
export type organizations = $Result.DefaultSelection<Prisma.$organizationsPayload>
/**
 * Model subscription_plans
 * 
 */
export type subscription_plans = $Result.DefaultSelection<Prisma.$subscription_plansPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Organization_databases
 * const organization_databases = await prisma.organization_databases.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Organization_databases
   * const organization_databases = await prisma.organization_databases.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.organization_databases`: Exposes CRUD operations for the **organization_databases** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organization_databases
    * const organization_databases = await prisma.organization_databases.findMany()
    * ```
    */
  get organization_databases(): Prisma.organization_databasesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organization_subscriptions`: Exposes CRUD operations for the **organization_subscriptions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organization_subscriptions
    * const organization_subscriptions = await prisma.organization_subscriptions.findMany()
    * ```
    */
  get organization_subscriptions(): Prisma.organization_subscriptionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organizations`: Exposes CRUD operations for the **organizations** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organizations
    * const organizations = await prisma.organizations.findMany()
    * ```
    */
  get organizations(): Prisma.organizationsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscription_plans`: Exposes CRUD operations for the **subscription_plans** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscription_plans
    * const subscription_plans = await prisma.subscription_plans.findMany()
    * ```
    */
  get subscription_plans(): Prisma.subscription_plansDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.18.0
   * Query Engine version: 34b5a692b7bd79939a9a2c3ef97d816e749cda2f
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    organization_databases: 'organization_databases',
    organization_subscriptions: 'organization_subscriptions',
    organizations: 'organizations',
    subscription_plans: 'subscription_plans'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "organization_databases" | "organization_subscriptions" | "organizations" | "subscription_plans"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      organization_databases: {
        payload: Prisma.$organization_databasesPayload<ExtArgs>
        fields: Prisma.organization_databasesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.organization_databasesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_databasesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.organization_databasesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_databasesPayload>
          }
          findFirst: {
            args: Prisma.organization_databasesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_databasesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.organization_databasesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_databasesPayload>
          }
          findMany: {
            args: Prisma.organization_databasesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_databasesPayload>[]
          }
          create: {
            args: Prisma.organization_databasesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_databasesPayload>
          }
          createMany: {
            args: Prisma.organization_databasesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.organization_databasesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_databasesPayload>
          }
          update: {
            args: Prisma.organization_databasesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_databasesPayload>
          }
          deleteMany: {
            args: Prisma.organization_databasesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.organization_databasesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.organization_databasesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_databasesPayload>
          }
          aggregate: {
            args: Prisma.Organization_databasesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganization_databases>
          }
          groupBy: {
            args: Prisma.organization_databasesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Organization_databasesGroupByOutputType>[]
          }
          count: {
            args: Prisma.organization_databasesCountArgs<ExtArgs>
            result: $Utils.Optional<Organization_databasesCountAggregateOutputType> | number
          }
        }
      }
      organization_subscriptions: {
        payload: Prisma.$organization_subscriptionsPayload<ExtArgs>
        fields: Prisma.organization_subscriptionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.organization_subscriptionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_subscriptionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.organization_subscriptionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_subscriptionsPayload>
          }
          findFirst: {
            args: Prisma.organization_subscriptionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_subscriptionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.organization_subscriptionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_subscriptionsPayload>
          }
          findMany: {
            args: Prisma.organization_subscriptionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_subscriptionsPayload>[]
          }
          create: {
            args: Prisma.organization_subscriptionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_subscriptionsPayload>
          }
          createMany: {
            args: Prisma.organization_subscriptionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.organization_subscriptionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_subscriptionsPayload>
          }
          update: {
            args: Prisma.organization_subscriptionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_subscriptionsPayload>
          }
          deleteMany: {
            args: Prisma.organization_subscriptionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.organization_subscriptionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.organization_subscriptionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organization_subscriptionsPayload>
          }
          aggregate: {
            args: Prisma.Organization_subscriptionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganization_subscriptions>
          }
          groupBy: {
            args: Prisma.organization_subscriptionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Organization_subscriptionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.organization_subscriptionsCountArgs<ExtArgs>
            result: $Utils.Optional<Organization_subscriptionsCountAggregateOutputType> | number
          }
        }
      }
      organizations: {
        payload: Prisma.$organizationsPayload<ExtArgs>
        fields: Prisma.organizationsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.organizationsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.organizationsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          findFirst: {
            args: Prisma.organizationsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.organizationsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          findMany: {
            args: Prisma.organizationsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>[]
          }
          create: {
            args: Prisma.organizationsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          createMany: {
            args: Prisma.organizationsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.organizationsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          update: {
            args: Prisma.organizationsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          deleteMany: {
            args: Prisma.organizationsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.organizationsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.organizationsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          aggregate: {
            args: Prisma.OrganizationsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganizations>
          }
          groupBy: {
            args: Prisma.organizationsGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationsGroupByOutputType>[]
          }
          count: {
            args: Prisma.organizationsCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationsCountAggregateOutputType> | number
          }
        }
      }
      subscription_plans: {
        payload: Prisma.$subscription_plansPayload<ExtArgs>
        fields: Prisma.subscription_plansFieldRefs
        operations: {
          findUnique: {
            args: Prisma.subscription_plansFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscription_plansPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.subscription_plansFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscription_plansPayload>
          }
          findFirst: {
            args: Prisma.subscription_plansFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscription_plansPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.subscription_plansFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscription_plansPayload>
          }
          findMany: {
            args: Prisma.subscription_plansFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscription_plansPayload>[]
          }
          create: {
            args: Prisma.subscription_plansCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscription_plansPayload>
          }
          createMany: {
            args: Prisma.subscription_plansCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.subscription_plansDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscription_plansPayload>
          }
          update: {
            args: Prisma.subscription_plansUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscription_plansPayload>
          }
          deleteMany: {
            args: Prisma.subscription_plansDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.subscription_plansUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.subscription_plansUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscription_plansPayload>
          }
          aggregate: {
            args: Prisma.Subscription_plansAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription_plans>
          }
          groupBy: {
            args: Prisma.subscription_plansGroupByArgs<ExtArgs>
            result: $Utils.Optional<Subscription_plansGroupByOutputType>[]
          }
          count: {
            args: Prisma.subscription_plansCountArgs<ExtArgs>
            result: $Utils.Optional<Subscription_plansCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    organization_databases?: organization_databasesOmit
    organization_subscriptions?: organization_subscriptionsOmit
    organizations?: organizationsOmit
    subscription_plans?: subscription_plansOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OrganizationsCountOutputType
   */

  export type OrganizationsCountOutputType = {
    organization_databases: number
    organization_subscriptions: number
  }

  export type OrganizationsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization_databases?: boolean | OrganizationsCountOutputTypeCountOrganization_databasesArgs
    organization_subscriptions?: boolean | OrganizationsCountOutputTypeCountOrganization_subscriptionsArgs
  }

  // Custom InputTypes
  /**
   * OrganizationsCountOutputType without action
   */
  export type OrganizationsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationsCountOutputType
     */
    select?: OrganizationsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganizationsCountOutputType without action
   */
  export type OrganizationsCountOutputTypeCountOrganization_databasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: organization_databasesWhereInput
  }

  /**
   * OrganizationsCountOutputType without action
   */
  export type OrganizationsCountOutputTypeCountOrganization_subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: organization_subscriptionsWhereInput
  }


  /**
   * Count Type Subscription_plansCountOutputType
   */

  export type Subscription_plansCountOutputType = {
    organization_subscriptions: number
  }

  export type Subscription_plansCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization_subscriptions?: boolean | Subscription_plansCountOutputTypeCountOrganization_subscriptionsArgs
  }

  // Custom InputTypes
  /**
   * Subscription_plansCountOutputType without action
   */
  export type Subscription_plansCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription_plansCountOutputType
     */
    select?: Subscription_plansCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Subscription_plansCountOutputType without action
   */
  export type Subscription_plansCountOutputTypeCountOrganization_subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: organization_subscriptionsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model organization_databases
   */

  export type AggregateOrganization_databases = {
    _count: Organization_databasesCountAggregateOutputType | null
    _avg: Organization_databasesAvgAggregateOutputType | null
    _sum: Organization_databasesSumAggregateOutputType | null
    _min: Organization_databasesMinAggregateOutputType | null
    _max: Organization_databasesMaxAggregateOutputType | null
  }

  export type Organization_databasesAvgAggregateOutputType = {
    id: number | null
    organization_id: number | null
    port: number | null
  }

  export type Organization_databasesSumAggregateOutputType = {
    id: bigint | null
    organization_id: bigint | null
    port: number | null
  }

  export type Organization_databasesMinAggregateOutputType = {
    id: bigint | null
    organization_id: bigint | null
    database_name: string | null
    host: string | null
    port: number | null
    username: string | null
    password: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Organization_databasesMaxAggregateOutputType = {
    id: bigint | null
    organization_id: bigint | null
    database_name: string | null
    host: string | null
    port: number | null
    username: string | null
    password: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Organization_databasesCountAggregateOutputType = {
    id: number
    organization_id: number
    database_name: number
    host: number
    port: number
    username: number
    password: number
    status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Organization_databasesAvgAggregateInputType = {
    id?: true
    organization_id?: true
    port?: true
  }

  export type Organization_databasesSumAggregateInputType = {
    id?: true
    organization_id?: true
    port?: true
  }

  export type Organization_databasesMinAggregateInputType = {
    id?: true
    organization_id?: true
    database_name?: true
    host?: true
    port?: true
    username?: true
    password?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type Organization_databasesMaxAggregateInputType = {
    id?: true
    organization_id?: true
    database_name?: true
    host?: true
    port?: true
    username?: true
    password?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type Organization_databasesCountAggregateInputType = {
    id?: true
    organization_id?: true
    database_name?: true
    host?: true
    port?: true
    username?: true
    password?: true
    status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Organization_databasesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which organization_databases to aggregate.
     */
    where?: organization_databasesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organization_databases to fetch.
     */
    orderBy?: organization_databasesOrderByWithRelationInput | organization_databasesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: organization_databasesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organization_databases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organization_databases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned organization_databases
    **/
    _count?: true | Organization_databasesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Organization_databasesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Organization_databasesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Organization_databasesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Organization_databasesMaxAggregateInputType
  }

  export type GetOrganization_databasesAggregateType<T extends Organization_databasesAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganization_databases]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganization_databases[P]>
      : GetScalarType<T[P], AggregateOrganization_databases[P]>
  }




  export type organization_databasesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: organization_databasesWhereInput
    orderBy?: organization_databasesOrderByWithAggregationInput | organization_databasesOrderByWithAggregationInput[]
    by: Organization_databasesScalarFieldEnum[] | Organization_databasesScalarFieldEnum
    having?: organization_databasesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Organization_databasesCountAggregateInputType | true
    _avg?: Organization_databasesAvgAggregateInputType
    _sum?: Organization_databasesSumAggregateInputType
    _min?: Organization_databasesMinAggregateInputType
    _max?: Organization_databasesMaxAggregateInputType
  }

  export type Organization_databasesGroupByOutputType = {
    id: bigint
    organization_id: bigint
    database_name: string
    host: string
    port: number
    username: string
    password: string
    status: string
    created_at: Date | null
    updated_at: Date | null
    _count: Organization_databasesCountAggregateOutputType | null
    _avg: Organization_databasesAvgAggregateOutputType | null
    _sum: Organization_databasesSumAggregateOutputType | null
    _min: Organization_databasesMinAggregateOutputType | null
    _max: Organization_databasesMaxAggregateOutputType | null
  }

  type GetOrganization_databasesGroupByPayload<T extends organization_databasesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Organization_databasesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Organization_databasesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Organization_databasesGroupByOutputType[P]>
            : GetScalarType<T[P], Organization_databasesGroupByOutputType[P]>
        }
      >
    >


  export type organization_databasesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organization_id?: boolean
    database_name?: boolean
    host?: boolean
    port?: boolean
    username?: boolean
    password?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organization_databases"]>



  export type organization_databasesSelectScalar = {
    id?: boolean
    organization_id?: boolean
    database_name?: boolean
    host?: boolean
    port?: boolean
    username?: boolean
    password?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type organization_databasesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organization_id" | "database_name" | "host" | "port" | "username" | "password" | "status" | "created_at" | "updated_at", ExtArgs["result"]["organization_databases"]>
  export type organization_databasesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }

  export type $organization_databasesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "organization_databases"
    objects: {
      organizations: Prisma.$organizationsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      organization_id: bigint
      database_name: string
      host: string
      port: number
      username: string
      password: string
      status: string
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["organization_databases"]>
    composites: {}
  }

  type organization_databasesGetPayload<S extends boolean | null | undefined | organization_databasesDefaultArgs> = $Result.GetResult<Prisma.$organization_databasesPayload, S>

  type organization_databasesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<organization_databasesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Organization_databasesCountAggregateInputType | true
    }

  export interface organization_databasesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['organization_databases'], meta: { name: 'organization_databases' } }
    /**
     * Find zero or one Organization_databases that matches the filter.
     * @param {organization_databasesFindUniqueArgs} args - Arguments to find a Organization_databases
     * @example
     * // Get one Organization_databases
     * const organization_databases = await prisma.organization_databases.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends organization_databasesFindUniqueArgs>(args: SelectSubset<T, organization_databasesFindUniqueArgs<ExtArgs>>): Prisma__organization_databasesClient<$Result.GetResult<Prisma.$organization_databasesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organization_databases that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {organization_databasesFindUniqueOrThrowArgs} args - Arguments to find a Organization_databases
     * @example
     * // Get one Organization_databases
     * const organization_databases = await prisma.organization_databases.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends organization_databasesFindUniqueOrThrowArgs>(args: SelectSubset<T, organization_databasesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__organization_databasesClient<$Result.GetResult<Prisma.$organization_databasesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization_databases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_databasesFindFirstArgs} args - Arguments to find a Organization_databases
     * @example
     * // Get one Organization_databases
     * const organization_databases = await prisma.organization_databases.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends organization_databasesFindFirstArgs>(args?: SelectSubset<T, organization_databasesFindFirstArgs<ExtArgs>>): Prisma__organization_databasesClient<$Result.GetResult<Prisma.$organization_databasesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization_databases that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_databasesFindFirstOrThrowArgs} args - Arguments to find a Organization_databases
     * @example
     * // Get one Organization_databases
     * const organization_databases = await prisma.organization_databases.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends organization_databasesFindFirstOrThrowArgs>(args?: SelectSubset<T, organization_databasesFindFirstOrThrowArgs<ExtArgs>>): Prisma__organization_databasesClient<$Result.GetResult<Prisma.$organization_databasesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organization_databases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_databasesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organization_databases
     * const organization_databases = await prisma.organization_databases.findMany()
     * 
     * // Get first 10 Organization_databases
     * const organization_databases = await prisma.organization_databases.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organization_databasesWithIdOnly = await prisma.organization_databases.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends organization_databasesFindManyArgs>(args?: SelectSubset<T, organization_databasesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$organization_databasesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organization_databases.
     * @param {organization_databasesCreateArgs} args - Arguments to create a Organization_databases.
     * @example
     * // Create one Organization_databases
     * const Organization_databases = await prisma.organization_databases.create({
     *   data: {
     *     // ... data to create a Organization_databases
     *   }
     * })
     * 
     */
    create<T extends organization_databasesCreateArgs>(args: SelectSubset<T, organization_databasesCreateArgs<ExtArgs>>): Prisma__organization_databasesClient<$Result.GetResult<Prisma.$organization_databasesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organization_databases.
     * @param {organization_databasesCreateManyArgs} args - Arguments to create many Organization_databases.
     * @example
     * // Create many Organization_databases
     * const organization_databases = await prisma.organization_databases.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends organization_databasesCreateManyArgs>(args?: SelectSubset<T, organization_databasesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Organization_databases.
     * @param {organization_databasesDeleteArgs} args - Arguments to delete one Organization_databases.
     * @example
     * // Delete one Organization_databases
     * const Organization_databases = await prisma.organization_databases.delete({
     *   where: {
     *     // ... filter to delete one Organization_databases
     *   }
     * })
     * 
     */
    delete<T extends organization_databasesDeleteArgs>(args: SelectSubset<T, organization_databasesDeleteArgs<ExtArgs>>): Prisma__organization_databasesClient<$Result.GetResult<Prisma.$organization_databasesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organization_databases.
     * @param {organization_databasesUpdateArgs} args - Arguments to update one Organization_databases.
     * @example
     * // Update one Organization_databases
     * const organization_databases = await prisma.organization_databases.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends organization_databasesUpdateArgs>(args: SelectSubset<T, organization_databasesUpdateArgs<ExtArgs>>): Prisma__organization_databasesClient<$Result.GetResult<Prisma.$organization_databasesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organization_databases.
     * @param {organization_databasesDeleteManyArgs} args - Arguments to filter Organization_databases to delete.
     * @example
     * // Delete a few Organization_databases
     * const { count } = await prisma.organization_databases.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends organization_databasesDeleteManyArgs>(args?: SelectSubset<T, organization_databasesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organization_databases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_databasesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organization_databases
     * const organization_databases = await prisma.organization_databases.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends organization_databasesUpdateManyArgs>(args: SelectSubset<T, organization_databasesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Organization_databases.
     * @param {organization_databasesUpsertArgs} args - Arguments to update or create a Organization_databases.
     * @example
     * // Update or create a Organization_databases
     * const organization_databases = await prisma.organization_databases.upsert({
     *   create: {
     *     // ... data to create a Organization_databases
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organization_databases we want to update
     *   }
     * })
     */
    upsert<T extends organization_databasesUpsertArgs>(args: SelectSubset<T, organization_databasesUpsertArgs<ExtArgs>>): Prisma__organization_databasesClient<$Result.GetResult<Prisma.$organization_databasesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organization_databases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_databasesCountArgs} args - Arguments to filter Organization_databases to count.
     * @example
     * // Count the number of Organization_databases
     * const count = await prisma.organization_databases.count({
     *   where: {
     *     // ... the filter for the Organization_databases we want to count
     *   }
     * })
    **/
    count<T extends organization_databasesCountArgs>(
      args?: Subset<T, organization_databasesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Organization_databasesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organization_databases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Organization_databasesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Organization_databasesAggregateArgs>(args: Subset<T, Organization_databasesAggregateArgs>): Prisma.PrismaPromise<GetOrganization_databasesAggregateType<T>>

    /**
     * Group by Organization_databases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_databasesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends organization_databasesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: organization_databasesGroupByArgs['orderBy'] }
        : { orderBy?: organization_databasesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, organization_databasesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganization_databasesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the organization_databases model
   */
  readonly fields: organization_databasesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for organization_databases.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__organization_databasesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organizations<T extends organizationsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, organizationsDefaultArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the organization_databases model
   */
  interface organization_databasesFieldRefs {
    readonly id: FieldRef<"organization_databases", 'BigInt'>
    readonly organization_id: FieldRef<"organization_databases", 'BigInt'>
    readonly database_name: FieldRef<"organization_databases", 'String'>
    readonly host: FieldRef<"organization_databases", 'String'>
    readonly port: FieldRef<"organization_databases", 'Int'>
    readonly username: FieldRef<"organization_databases", 'String'>
    readonly password: FieldRef<"organization_databases", 'String'>
    readonly status: FieldRef<"organization_databases", 'String'>
    readonly created_at: FieldRef<"organization_databases", 'DateTime'>
    readonly updated_at: FieldRef<"organization_databases", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * organization_databases findUnique
   */
  export type organization_databasesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_databases
     */
    select?: organization_databasesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_databases
     */
    omit?: organization_databasesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_databasesInclude<ExtArgs> | null
    /**
     * Filter, which organization_databases to fetch.
     */
    where: organization_databasesWhereUniqueInput
  }

  /**
   * organization_databases findUniqueOrThrow
   */
  export type organization_databasesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_databases
     */
    select?: organization_databasesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_databases
     */
    omit?: organization_databasesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_databasesInclude<ExtArgs> | null
    /**
     * Filter, which organization_databases to fetch.
     */
    where: organization_databasesWhereUniqueInput
  }

  /**
   * organization_databases findFirst
   */
  export type organization_databasesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_databases
     */
    select?: organization_databasesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_databases
     */
    omit?: organization_databasesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_databasesInclude<ExtArgs> | null
    /**
     * Filter, which organization_databases to fetch.
     */
    where?: organization_databasesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organization_databases to fetch.
     */
    orderBy?: organization_databasesOrderByWithRelationInput | organization_databasesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for organization_databases.
     */
    cursor?: organization_databasesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organization_databases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organization_databases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of organization_databases.
     */
    distinct?: Organization_databasesScalarFieldEnum | Organization_databasesScalarFieldEnum[]
  }

  /**
   * organization_databases findFirstOrThrow
   */
  export type organization_databasesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_databases
     */
    select?: organization_databasesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_databases
     */
    omit?: organization_databasesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_databasesInclude<ExtArgs> | null
    /**
     * Filter, which organization_databases to fetch.
     */
    where?: organization_databasesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organization_databases to fetch.
     */
    orderBy?: organization_databasesOrderByWithRelationInput | organization_databasesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for organization_databases.
     */
    cursor?: organization_databasesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organization_databases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organization_databases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of organization_databases.
     */
    distinct?: Organization_databasesScalarFieldEnum | Organization_databasesScalarFieldEnum[]
  }

  /**
   * organization_databases findMany
   */
  export type organization_databasesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_databases
     */
    select?: organization_databasesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_databases
     */
    omit?: organization_databasesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_databasesInclude<ExtArgs> | null
    /**
     * Filter, which organization_databases to fetch.
     */
    where?: organization_databasesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organization_databases to fetch.
     */
    orderBy?: organization_databasesOrderByWithRelationInput | organization_databasesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing organization_databases.
     */
    cursor?: organization_databasesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organization_databases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organization_databases.
     */
    skip?: number
    distinct?: Organization_databasesScalarFieldEnum | Organization_databasesScalarFieldEnum[]
  }

  /**
   * organization_databases create
   */
  export type organization_databasesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_databases
     */
    select?: organization_databasesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_databases
     */
    omit?: organization_databasesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_databasesInclude<ExtArgs> | null
    /**
     * The data needed to create a organization_databases.
     */
    data: XOR<organization_databasesCreateInput, organization_databasesUncheckedCreateInput>
  }

  /**
   * organization_databases createMany
   */
  export type organization_databasesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many organization_databases.
     */
    data: organization_databasesCreateManyInput | organization_databasesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * organization_databases update
   */
  export type organization_databasesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_databases
     */
    select?: organization_databasesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_databases
     */
    omit?: organization_databasesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_databasesInclude<ExtArgs> | null
    /**
     * The data needed to update a organization_databases.
     */
    data: XOR<organization_databasesUpdateInput, organization_databasesUncheckedUpdateInput>
    /**
     * Choose, which organization_databases to update.
     */
    where: organization_databasesWhereUniqueInput
  }

  /**
   * organization_databases updateMany
   */
  export type organization_databasesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update organization_databases.
     */
    data: XOR<organization_databasesUpdateManyMutationInput, organization_databasesUncheckedUpdateManyInput>
    /**
     * Filter which organization_databases to update
     */
    where?: organization_databasesWhereInput
    /**
     * Limit how many organization_databases to update.
     */
    limit?: number
  }

  /**
   * organization_databases upsert
   */
  export type organization_databasesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_databases
     */
    select?: organization_databasesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_databases
     */
    omit?: organization_databasesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_databasesInclude<ExtArgs> | null
    /**
     * The filter to search for the organization_databases to update in case it exists.
     */
    where: organization_databasesWhereUniqueInput
    /**
     * In case the organization_databases found by the `where` argument doesn't exist, create a new organization_databases with this data.
     */
    create: XOR<organization_databasesCreateInput, organization_databasesUncheckedCreateInput>
    /**
     * In case the organization_databases was found with the provided `where` argument, update it with this data.
     */
    update: XOR<organization_databasesUpdateInput, organization_databasesUncheckedUpdateInput>
  }

  /**
   * organization_databases delete
   */
  export type organization_databasesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_databases
     */
    select?: organization_databasesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_databases
     */
    omit?: organization_databasesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_databasesInclude<ExtArgs> | null
    /**
     * Filter which organization_databases to delete.
     */
    where: organization_databasesWhereUniqueInput
  }

  /**
   * organization_databases deleteMany
   */
  export type organization_databasesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which organization_databases to delete
     */
    where?: organization_databasesWhereInput
    /**
     * Limit how many organization_databases to delete.
     */
    limit?: number
  }

  /**
   * organization_databases without action
   */
  export type organization_databasesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_databases
     */
    select?: organization_databasesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_databases
     */
    omit?: organization_databasesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_databasesInclude<ExtArgs> | null
  }


  /**
   * Model organization_subscriptions
   */

  export type AggregateOrganization_subscriptions = {
    _count: Organization_subscriptionsCountAggregateOutputType | null
    _avg: Organization_subscriptionsAvgAggregateOutputType | null
    _sum: Organization_subscriptionsSumAggregateOutputType | null
    _min: Organization_subscriptionsMinAggregateOutputType | null
    _max: Organization_subscriptionsMaxAggregateOutputType | null
  }

  export type Organization_subscriptionsAvgAggregateOutputType = {
    id: number | null
    organization_id: number | null
    subscription_plan_id: number | null
  }

  export type Organization_subscriptionsSumAggregateOutputType = {
    id: bigint | null
    organization_id: bigint | null
    subscription_plan_id: bigint | null
  }

  export type Organization_subscriptionsMinAggregateOutputType = {
    id: bigint | null
    organization_id: bigint | null
    subscription_plan_id: bigint | null
    status: string | null
    start_date: Date | null
    end_date: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Organization_subscriptionsMaxAggregateOutputType = {
    id: bigint | null
    organization_id: bigint | null
    subscription_plan_id: bigint | null
    status: string | null
    start_date: Date | null
    end_date: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Organization_subscriptionsCountAggregateOutputType = {
    id: number
    organization_id: number
    subscription_plan_id: number
    status: number
    start_date: number
    end_date: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Organization_subscriptionsAvgAggregateInputType = {
    id?: true
    organization_id?: true
    subscription_plan_id?: true
  }

  export type Organization_subscriptionsSumAggregateInputType = {
    id?: true
    organization_id?: true
    subscription_plan_id?: true
  }

  export type Organization_subscriptionsMinAggregateInputType = {
    id?: true
    organization_id?: true
    subscription_plan_id?: true
    status?: true
    start_date?: true
    end_date?: true
    created_at?: true
    updated_at?: true
  }

  export type Organization_subscriptionsMaxAggregateInputType = {
    id?: true
    organization_id?: true
    subscription_plan_id?: true
    status?: true
    start_date?: true
    end_date?: true
    created_at?: true
    updated_at?: true
  }

  export type Organization_subscriptionsCountAggregateInputType = {
    id?: true
    organization_id?: true
    subscription_plan_id?: true
    status?: true
    start_date?: true
    end_date?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Organization_subscriptionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which organization_subscriptions to aggregate.
     */
    where?: organization_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organization_subscriptions to fetch.
     */
    orderBy?: organization_subscriptionsOrderByWithRelationInput | organization_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: organization_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organization_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organization_subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned organization_subscriptions
    **/
    _count?: true | Organization_subscriptionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Organization_subscriptionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Organization_subscriptionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Organization_subscriptionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Organization_subscriptionsMaxAggregateInputType
  }

  export type GetOrganization_subscriptionsAggregateType<T extends Organization_subscriptionsAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganization_subscriptions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganization_subscriptions[P]>
      : GetScalarType<T[P], AggregateOrganization_subscriptions[P]>
  }




  export type organization_subscriptionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: organization_subscriptionsWhereInput
    orderBy?: organization_subscriptionsOrderByWithAggregationInput | organization_subscriptionsOrderByWithAggregationInput[]
    by: Organization_subscriptionsScalarFieldEnum[] | Organization_subscriptionsScalarFieldEnum
    having?: organization_subscriptionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Organization_subscriptionsCountAggregateInputType | true
    _avg?: Organization_subscriptionsAvgAggregateInputType
    _sum?: Organization_subscriptionsSumAggregateInputType
    _min?: Organization_subscriptionsMinAggregateInputType
    _max?: Organization_subscriptionsMaxAggregateInputType
  }

  export type Organization_subscriptionsGroupByOutputType = {
    id: bigint
    organization_id: bigint
    subscription_plan_id: bigint
    status: string
    start_date: Date | null
    end_date: Date | null
    created_at: Date | null
    updated_at: Date | null
    _count: Organization_subscriptionsCountAggregateOutputType | null
    _avg: Organization_subscriptionsAvgAggregateOutputType | null
    _sum: Organization_subscriptionsSumAggregateOutputType | null
    _min: Organization_subscriptionsMinAggregateOutputType | null
    _max: Organization_subscriptionsMaxAggregateOutputType | null
  }

  type GetOrganization_subscriptionsGroupByPayload<T extends organization_subscriptionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Organization_subscriptionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Organization_subscriptionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Organization_subscriptionsGroupByOutputType[P]>
            : GetScalarType<T[P], Organization_subscriptionsGroupByOutputType[P]>
        }
      >
    >


  export type organization_subscriptionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organization_id?: boolean
    subscription_plan_id?: boolean
    status?: boolean
    start_date?: boolean
    end_date?: boolean
    created_at?: boolean
    updated_at?: boolean
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
    subscription_plans?: boolean | subscription_plansDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organization_subscriptions"]>



  export type organization_subscriptionsSelectScalar = {
    id?: boolean
    organization_id?: boolean
    subscription_plan_id?: boolean
    status?: boolean
    start_date?: boolean
    end_date?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type organization_subscriptionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organization_id" | "subscription_plan_id" | "status" | "start_date" | "end_date" | "created_at" | "updated_at", ExtArgs["result"]["organization_subscriptions"]>
  export type organization_subscriptionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
    subscription_plans?: boolean | subscription_plansDefaultArgs<ExtArgs>
  }

  export type $organization_subscriptionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "organization_subscriptions"
    objects: {
      organizations: Prisma.$organizationsPayload<ExtArgs>
      subscription_plans: Prisma.$subscription_plansPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      organization_id: bigint
      subscription_plan_id: bigint
      status: string
      start_date: Date | null
      end_date: Date | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["organization_subscriptions"]>
    composites: {}
  }

  type organization_subscriptionsGetPayload<S extends boolean | null | undefined | organization_subscriptionsDefaultArgs> = $Result.GetResult<Prisma.$organization_subscriptionsPayload, S>

  type organization_subscriptionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<organization_subscriptionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Organization_subscriptionsCountAggregateInputType | true
    }

  export interface organization_subscriptionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['organization_subscriptions'], meta: { name: 'organization_subscriptions' } }
    /**
     * Find zero or one Organization_subscriptions that matches the filter.
     * @param {organization_subscriptionsFindUniqueArgs} args - Arguments to find a Organization_subscriptions
     * @example
     * // Get one Organization_subscriptions
     * const organization_subscriptions = await prisma.organization_subscriptions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends organization_subscriptionsFindUniqueArgs>(args: SelectSubset<T, organization_subscriptionsFindUniqueArgs<ExtArgs>>): Prisma__organization_subscriptionsClient<$Result.GetResult<Prisma.$organization_subscriptionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organization_subscriptions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {organization_subscriptionsFindUniqueOrThrowArgs} args - Arguments to find a Organization_subscriptions
     * @example
     * // Get one Organization_subscriptions
     * const organization_subscriptions = await prisma.organization_subscriptions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends organization_subscriptionsFindUniqueOrThrowArgs>(args: SelectSubset<T, organization_subscriptionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__organization_subscriptionsClient<$Result.GetResult<Prisma.$organization_subscriptionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization_subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_subscriptionsFindFirstArgs} args - Arguments to find a Organization_subscriptions
     * @example
     * // Get one Organization_subscriptions
     * const organization_subscriptions = await prisma.organization_subscriptions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends organization_subscriptionsFindFirstArgs>(args?: SelectSubset<T, organization_subscriptionsFindFirstArgs<ExtArgs>>): Prisma__organization_subscriptionsClient<$Result.GetResult<Prisma.$organization_subscriptionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization_subscriptions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_subscriptionsFindFirstOrThrowArgs} args - Arguments to find a Organization_subscriptions
     * @example
     * // Get one Organization_subscriptions
     * const organization_subscriptions = await prisma.organization_subscriptions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends organization_subscriptionsFindFirstOrThrowArgs>(args?: SelectSubset<T, organization_subscriptionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__organization_subscriptionsClient<$Result.GetResult<Prisma.$organization_subscriptionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organization_subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_subscriptionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organization_subscriptions
     * const organization_subscriptions = await prisma.organization_subscriptions.findMany()
     * 
     * // Get first 10 Organization_subscriptions
     * const organization_subscriptions = await prisma.organization_subscriptions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organization_subscriptionsWithIdOnly = await prisma.organization_subscriptions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends organization_subscriptionsFindManyArgs>(args?: SelectSubset<T, organization_subscriptionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$organization_subscriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organization_subscriptions.
     * @param {organization_subscriptionsCreateArgs} args - Arguments to create a Organization_subscriptions.
     * @example
     * // Create one Organization_subscriptions
     * const Organization_subscriptions = await prisma.organization_subscriptions.create({
     *   data: {
     *     // ... data to create a Organization_subscriptions
     *   }
     * })
     * 
     */
    create<T extends organization_subscriptionsCreateArgs>(args: SelectSubset<T, organization_subscriptionsCreateArgs<ExtArgs>>): Prisma__organization_subscriptionsClient<$Result.GetResult<Prisma.$organization_subscriptionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organization_subscriptions.
     * @param {organization_subscriptionsCreateManyArgs} args - Arguments to create many Organization_subscriptions.
     * @example
     * // Create many Organization_subscriptions
     * const organization_subscriptions = await prisma.organization_subscriptions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends organization_subscriptionsCreateManyArgs>(args?: SelectSubset<T, organization_subscriptionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Organization_subscriptions.
     * @param {organization_subscriptionsDeleteArgs} args - Arguments to delete one Organization_subscriptions.
     * @example
     * // Delete one Organization_subscriptions
     * const Organization_subscriptions = await prisma.organization_subscriptions.delete({
     *   where: {
     *     // ... filter to delete one Organization_subscriptions
     *   }
     * })
     * 
     */
    delete<T extends organization_subscriptionsDeleteArgs>(args: SelectSubset<T, organization_subscriptionsDeleteArgs<ExtArgs>>): Prisma__organization_subscriptionsClient<$Result.GetResult<Prisma.$organization_subscriptionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organization_subscriptions.
     * @param {organization_subscriptionsUpdateArgs} args - Arguments to update one Organization_subscriptions.
     * @example
     * // Update one Organization_subscriptions
     * const organization_subscriptions = await prisma.organization_subscriptions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends organization_subscriptionsUpdateArgs>(args: SelectSubset<T, organization_subscriptionsUpdateArgs<ExtArgs>>): Prisma__organization_subscriptionsClient<$Result.GetResult<Prisma.$organization_subscriptionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organization_subscriptions.
     * @param {organization_subscriptionsDeleteManyArgs} args - Arguments to filter Organization_subscriptions to delete.
     * @example
     * // Delete a few Organization_subscriptions
     * const { count } = await prisma.organization_subscriptions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends organization_subscriptionsDeleteManyArgs>(args?: SelectSubset<T, organization_subscriptionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organization_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_subscriptionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organization_subscriptions
     * const organization_subscriptions = await prisma.organization_subscriptions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends organization_subscriptionsUpdateManyArgs>(args: SelectSubset<T, organization_subscriptionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Organization_subscriptions.
     * @param {organization_subscriptionsUpsertArgs} args - Arguments to update or create a Organization_subscriptions.
     * @example
     * // Update or create a Organization_subscriptions
     * const organization_subscriptions = await prisma.organization_subscriptions.upsert({
     *   create: {
     *     // ... data to create a Organization_subscriptions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organization_subscriptions we want to update
     *   }
     * })
     */
    upsert<T extends organization_subscriptionsUpsertArgs>(args: SelectSubset<T, organization_subscriptionsUpsertArgs<ExtArgs>>): Prisma__organization_subscriptionsClient<$Result.GetResult<Prisma.$organization_subscriptionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organization_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_subscriptionsCountArgs} args - Arguments to filter Organization_subscriptions to count.
     * @example
     * // Count the number of Organization_subscriptions
     * const count = await prisma.organization_subscriptions.count({
     *   where: {
     *     // ... the filter for the Organization_subscriptions we want to count
     *   }
     * })
    **/
    count<T extends organization_subscriptionsCountArgs>(
      args?: Subset<T, organization_subscriptionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Organization_subscriptionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organization_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Organization_subscriptionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Organization_subscriptionsAggregateArgs>(args: Subset<T, Organization_subscriptionsAggregateArgs>): Prisma.PrismaPromise<GetOrganization_subscriptionsAggregateType<T>>

    /**
     * Group by Organization_subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organization_subscriptionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends organization_subscriptionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: organization_subscriptionsGroupByArgs['orderBy'] }
        : { orderBy?: organization_subscriptionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, organization_subscriptionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganization_subscriptionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the organization_subscriptions model
   */
  readonly fields: organization_subscriptionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for organization_subscriptions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__organization_subscriptionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organizations<T extends organizationsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, organizationsDefaultArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    subscription_plans<T extends subscription_plansDefaultArgs<ExtArgs> = {}>(args?: Subset<T, subscription_plansDefaultArgs<ExtArgs>>): Prisma__subscription_plansClient<$Result.GetResult<Prisma.$subscription_plansPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the organization_subscriptions model
   */
  interface organization_subscriptionsFieldRefs {
    readonly id: FieldRef<"organization_subscriptions", 'BigInt'>
    readonly organization_id: FieldRef<"organization_subscriptions", 'BigInt'>
    readonly subscription_plan_id: FieldRef<"organization_subscriptions", 'BigInt'>
    readonly status: FieldRef<"organization_subscriptions", 'String'>
    readonly start_date: FieldRef<"organization_subscriptions", 'DateTime'>
    readonly end_date: FieldRef<"organization_subscriptions", 'DateTime'>
    readonly created_at: FieldRef<"organization_subscriptions", 'DateTime'>
    readonly updated_at: FieldRef<"organization_subscriptions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * organization_subscriptions findUnique
   */
  export type organization_subscriptionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which organization_subscriptions to fetch.
     */
    where: organization_subscriptionsWhereUniqueInput
  }

  /**
   * organization_subscriptions findUniqueOrThrow
   */
  export type organization_subscriptionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which organization_subscriptions to fetch.
     */
    where: organization_subscriptionsWhereUniqueInput
  }

  /**
   * organization_subscriptions findFirst
   */
  export type organization_subscriptionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which organization_subscriptions to fetch.
     */
    where?: organization_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organization_subscriptions to fetch.
     */
    orderBy?: organization_subscriptionsOrderByWithRelationInput | organization_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for organization_subscriptions.
     */
    cursor?: organization_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organization_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organization_subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of organization_subscriptions.
     */
    distinct?: Organization_subscriptionsScalarFieldEnum | Organization_subscriptionsScalarFieldEnum[]
  }

  /**
   * organization_subscriptions findFirstOrThrow
   */
  export type organization_subscriptionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which organization_subscriptions to fetch.
     */
    where?: organization_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organization_subscriptions to fetch.
     */
    orderBy?: organization_subscriptionsOrderByWithRelationInput | organization_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for organization_subscriptions.
     */
    cursor?: organization_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organization_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organization_subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of organization_subscriptions.
     */
    distinct?: Organization_subscriptionsScalarFieldEnum | Organization_subscriptionsScalarFieldEnum[]
  }

  /**
   * organization_subscriptions findMany
   */
  export type organization_subscriptionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
    /**
     * Filter, which organization_subscriptions to fetch.
     */
    where?: organization_subscriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organization_subscriptions to fetch.
     */
    orderBy?: organization_subscriptionsOrderByWithRelationInput | organization_subscriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing organization_subscriptions.
     */
    cursor?: organization_subscriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organization_subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organization_subscriptions.
     */
    skip?: number
    distinct?: Organization_subscriptionsScalarFieldEnum | Organization_subscriptionsScalarFieldEnum[]
  }

  /**
   * organization_subscriptions create
   */
  export type organization_subscriptionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
    /**
     * The data needed to create a organization_subscriptions.
     */
    data: XOR<organization_subscriptionsCreateInput, organization_subscriptionsUncheckedCreateInput>
  }

  /**
   * organization_subscriptions createMany
   */
  export type organization_subscriptionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many organization_subscriptions.
     */
    data: organization_subscriptionsCreateManyInput | organization_subscriptionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * organization_subscriptions update
   */
  export type organization_subscriptionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
    /**
     * The data needed to update a organization_subscriptions.
     */
    data: XOR<organization_subscriptionsUpdateInput, organization_subscriptionsUncheckedUpdateInput>
    /**
     * Choose, which organization_subscriptions to update.
     */
    where: organization_subscriptionsWhereUniqueInput
  }

  /**
   * organization_subscriptions updateMany
   */
  export type organization_subscriptionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update organization_subscriptions.
     */
    data: XOR<organization_subscriptionsUpdateManyMutationInput, organization_subscriptionsUncheckedUpdateManyInput>
    /**
     * Filter which organization_subscriptions to update
     */
    where?: organization_subscriptionsWhereInput
    /**
     * Limit how many organization_subscriptions to update.
     */
    limit?: number
  }

  /**
   * organization_subscriptions upsert
   */
  export type organization_subscriptionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
    /**
     * The filter to search for the organization_subscriptions to update in case it exists.
     */
    where: organization_subscriptionsWhereUniqueInput
    /**
     * In case the organization_subscriptions found by the `where` argument doesn't exist, create a new organization_subscriptions with this data.
     */
    create: XOR<organization_subscriptionsCreateInput, organization_subscriptionsUncheckedCreateInput>
    /**
     * In case the organization_subscriptions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<organization_subscriptionsUpdateInput, organization_subscriptionsUncheckedUpdateInput>
  }

  /**
   * organization_subscriptions delete
   */
  export type organization_subscriptionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
    /**
     * Filter which organization_subscriptions to delete.
     */
    where: organization_subscriptionsWhereUniqueInput
  }

  /**
   * organization_subscriptions deleteMany
   */
  export type organization_subscriptionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which organization_subscriptions to delete
     */
    where?: organization_subscriptionsWhereInput
    /**
     * Limit how many organization_subscriptions to delete.
     */
    limit?: number
  }

  /**
   * organization_subscriptions without action
   */
  export type organization_subscriptionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
  }


  /**
   * Model organizations
   */

  export type AggregateOrganizations = {
    _count: OrganizationsCountAggregateOutputType | null
    _avg: OrganizationsAvgAggregateOutputType | null
    _sum: OrganizationsSumAggregateOutputType | null
    _min: OrganizationsMinAggregateOutputType | null
    _max: OrganizationsMaxAggregateOutputType | null
  }

  export type OrganizationsAvgAggregateOutputType = {
    id: number | null
  }

  export type OrganizationsSumAggregateOutputType = {
    id: bigint | null
  }

  export type OrganizationsMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    slug: string | null
    type: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type OrganizationsMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    slug: string | null
    type: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type OrganizationsCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    type: number
    status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type OrganizationsAvgAggregateInputType = {
    id?: true
  }

  export type OrganizationsSumAggregateInputType = {
    id?: true
  }

  export type OrganizationsMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    type?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type OrganizationsMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    type?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type OrganizationsCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    type?: true
    status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type OrganizationsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which organizations to aggregate.
     */
    where?: organizationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organizations to fetch.
     */
    orderBy?: organizationsOrderByWithRelationInput | organizationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: organizationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned organizations
    **/
    _count?: true | OrganizationsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrganizationsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrganizationsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationsMaxAggregateInputType
  }

  export type GetOrganizationsAggregateType<T extends OrganizationsAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganizations]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganizations[P]>
      : GetScalarType<T[P], AggregateOrganizations[P]>
  }




  export type organizationsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: organizationsWhereInput
    orderBy?: organizationsOrderByWithAggregationInput | organizationsOrderByWithAggregationInput[]
    by: OrganizationsScalarFieldEnum[] | OrganizationsScalarFieldEnum
    having?: organizationsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationsCountAggregateInputType | true
    _avg?: OrganizationsAvgAggregateInputType
    _sum?: OrganizationsSumAggregateInputType
    _min?: OrganizationsMinAggregateInputType
    _max?: OrganizationsMaxAggregateInputType
  }

  export type OrganizationsGroupByOutputType = {
    id: bigint
    name: string
    slug: string
    type: string | null
    status: string
    created_at: Date | null
    updated_at: Date | null
    _count: OrganizationsCountAggregateOutputType | null
    _avg: OrganizationsAvgAggregateOutputType | null
    _sum: OrganizationsSumAggregateOutputType | null
    _min: OrganizationsMinAggregateOutputType | null
    _max: OrganizationsMaxAggregateOutputType | null
  }

  type GetOrganizationsGroupByPayload<T extends organizationsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationsGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationsGroupByOutputType[P]>
        }
      >
    >


  export type organizationsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    type?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    organization_databases?: boolean | organizations$organization_databasesArgs<ExtArgs>
    organization_subscriptions?: boolean | organizations$organization_subscriptionsArgs<ExtArgs>
    _count?: boolean | OrganizationsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organizations"]>



  export type organizationsSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    type?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type organizationsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "type" | "status" | "created_at" | "updated_at", ExtArgs["result"]["organizations"]>
  export type organizationsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization_databases?: boolean | organizations$organization_databasesArgs<ExtArgs>
    organization_subscriptions?: boolean | organizations$organization_subscriptionsArgs<ExtArgs>
    _count?: boolean | OrganizationsCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $organizationsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "organizations"
    objects: {
      organization_databases: Prisma.$organization_databasesPayload<ExtArgs>[]
      organization_subscriptions: Prisma.$organization_subscriptionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      slug: string
      type: string | null
      status: string
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["organizations"]>
    composites: {}
  }

  type organizationsGetPayload<S extends boolean | null | undefined | organizationsDefaultArgs> = $Result.GetResult<Prisma.$organizationsPayload, S>

  type organizationsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<organizationsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganizationsCountAggregateInputType | true
    }

  export interface organizationsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['organizations'], meta: { name: 'organizations' } }
    /**
     * Find zero or one Organizations that matches the filter.
     * @param {organizationsFindUniqueArgs} args - Arguments to find a Organizations
     * @example
     * // Get one Organizations
     * const organizations = await prisma.organizations.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends organizationsFindUniqueArgs>(args: SelectSubset<T, organizationsFindUniqueArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organizations that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {organizationsFindUniqueOrThrowArgs} args - Arguments to find a Organizations
     * @example
     * // Get one Organizations
     * const organizations = await prisma.organizations.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends organizationsFindUniqueOrThrowArgs>(args: SelectSubset<T, organizationsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsFindFirstArgs} args - Arguments to find a Organizations
     * @example
     * // Get one Organizations
     * const organizations = await prisma.organizations.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends organizationsFindFirstArgs>(args?: SelectSubset<T, organizationsFindFirstArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organizations that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsFindFirstOrThrowArgs} args - Arguments to find a Organizations
     * @example
     * // Get one Organizations
     * const organizations = await prisma.organizations.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends organizationsFindFirstOrThrowArgs>(args?: SelectSubset<T, organizationsFindFirstOrThrowArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organizations
     * const organizations = await prisma.organizations.findMany()
     * 
     * // Get first 10 Organizations
     * const organizations = await prisma.organizations.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationsWithIdOnly = await prisma.organizations.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends organizationsFindManyArgs>(args?: SelectSubset<T, organizationsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organizations.
     * @param {organizationsCreateArgs} args - Arguments to create a Organizations.
     * @example
     * // Create one Organizations
     * const Organizations = await prisma.organizations.create({
     *   data: {
     *     // ... data to create a Organizations
     *   }
     * })
     * 
     */
    create<T extends organizationsCreateArgs>(args: SelectSubset<T, organizationsCreateArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organizations.
     * @param {organizationsCreateManyArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organizations = await prisma.organizations.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends organizationsCreateManyArgs>(args?: SelectSubset<T, organizationsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Organizations.
     * @param {organizationsDeleteArgs} args - Arguments to delete one Organizations.
     * @example
     * // Delete one Organizations
     * const Organizations = await prisma.organizations.delete({
     *   where: {
     *     // ... filter to delete one Organizations
     *   }
     * })
     * 
     */
    delete<T extends organizationsDeleteArgs>(args: SelectSubset<T, organizationsDeleteArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organizations.
     * @param {organizationsUpdateArgs} args - Arguments to update one Organizations.
     * @example
     * // Update one Organizations
     * const organizations = await prisma.organizations.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends organizationsUpdateArgs>(args: SelectSubset<T, organizationsUpdateArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organizations.
     * @param {organizationsDeleteManyArgs} args - Arguments to filter Organizations to delete.
     * @example
     * // Delete a few Organizations
     * const { count } = await prisma.organizations.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends organizationsDeleteManyArgs>(args?: SelectSubset<T, organizationsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organizations
     * const organizations = await prisma.organizations.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends organizationsUpdateManyArgs>(args: SelectSubset<T, organizationsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Organizations.
     * @param {organizationsUpsertArgs} args - Arguments to update or create a Organizations.
     * @example
     * // Update or create a Organizations
     * const organizations = await prisma.organizations.upsert({
     *   create: {
     *     // ... data to create a Organizations
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organizations we want to update
     *   }
     * })
     */
    upsert<T extends organizationsUpsertArgs>(args: SelectSubset<T, organizationsUpsertArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsCountArgs} args - Arguments to filter Organizations to count.
     * @example
     * // Count the number of Organizations
     * const count = await prisma.organizations.count({
     *   where: {
     *     // ... the filter for the Organizations we want to count
     *   }
     * })
    **/
    count<T extends organizationsCountArgs>(
      args?: Subset<T, organizationsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganizationsAggregateArgs>(args: Subset<T, OrganizationsAggregateArgs>): Prisma.PrismaPromise<GetOrganizationsAggregateType<T>>

    /**
     * Group by Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends organizationsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: organizationsGroupByArgs['orderBy'] }
        : { orderBy?: organizationsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, organizationsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the organizations model
   */
  readonly fields: organizationsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for organizations.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__organizationsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization_databases<T extends organizations$organization_databasesArgs<ExtArgs> = {}>(args?: Subset<T, organizations$organization_databasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$organization_databasesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    organization_subscriptions<T extends organizations$organization_subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, organizations$organization_subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$organization_subscriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the organizations model
   */
  interface organizationsFieldRefs {
    readonly id: FieldRef<"organizations", 'BigInt'>
    readonly name: FieldRef<"organizations", 'String'>
    readonly slug: FieldRef<"organizations", 'String'>
    readonly type: FieldRef<"organizations", 'String'>
    readonly status: FieldRef<"organizations", 'String'>
    readonly created_at: FieldRef<"organizations", 'DateTime'>
    readonly updated_at: FieldRef<"organizations", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * organizations findUnique
   */
  export type organizationsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter, which organizations to fetch.
     */
    where: organizationsWhereUniqueInput
  }

  /**
   * organizations findUniqueOrThrow
   */
  export type organizationsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter, which organizations to fetch.
     */
    where: organizationsWhereUniqueInput
  }

  /**
   * organizations findFirst
   */
  export type organizationsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter, which organizations to fetch.
     */
    where?: organizationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organizations to fetch.
     */
    orderBy?: organizationsOrderByWithRelationInput | organizationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for organizations.
     */
    cursor?: organizationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of organizations.
     */
    distinct?: OrganizationsScalarFieldEnum | OrganizationsScalarFieldEnum[]
  }

  /**
   * organizations findFirstOrThrow
   */
  export type organizationsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter, which organizations to fetch.
     */
    where?: organizationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organizations to fetch.
     */
    orderBy?: organizationsOrderByWithRelationInput | organizationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for organizations.
     */
    cursor?: organizationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of organizations.
     */
    distinct?: OrganizationsScalarFieldEnum | OrganizationsScalarFieldEnum[]
  }

  /**
   * organizations findMany
   */
  export type organizationsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter, which organizations to fetch.
     */
    where?: organizationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organizations to fetch.
     */
    orderBy?: organizationsOrderByWithRelationInput | organizationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing organizations.
     */
    cursor?: organizationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organizations.
     */
    skip?: number
    distinct?: OrganizationsScalarFieldEnum | OrganizationsScalarFieldEnum[]
  }

  /**
   * organizations create
   */
  export type organizationsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * The data needed to create a organizations.
     */
    data: XOR<organizationsCreateInput, organizationsUncheckedCreateInput>
  }

  /**
   * organizations createMany
   */
  export type organizationsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many organizations.
     */
    data: organizationsCreateManyInput | organizationsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * organizations update
   */
  export type organizationsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * The data needed to update a organizations.
     */
    data: XOR<organizationsUpdateInput, organizationsUncheckedUpdateInput>
    /**
     * Choose, which organizations to update.
     */
    where: organizationsWhereUniqueInput
  }

  /**
   * organizations updateMany
   */
  export type organizationsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update organizations.
     */
    data: XOR<organizationsUpdateManyMutationInput, organizationsUncheckedUpdateManyInput>
    /**
     * Filter which organizations to update
     */
    where?: organizationsWhereInput
    /**
     * Limit how many organizations to update.
     */
    limit?: number
  }

  /**
   * organizations upsert
   */
  export type organizationsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * The filter to search for the organizations to update in case it exists.
     */
    where: organizationsWhereUniqueInput
    /**
     * In case the organizations found by the `where` argument doesn't exist, create a new organizations with this data.
     */
    create: XOR<organizationsCreateInput, organizationsUncheckedCreateInput>
    /**
     * In case the organizations was found with the provided `where` argument, update it with this data.
     */
    update: XOR<organizationsUpdateInput, organizationsUncheckedUpdateInput>
  }

  /**
   * organizations delete
   */
  export type organizationsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter which organizations to delete.
     */
    where: organizationsWhereUniqueInput
  }

  /**
   * organizations deleteMany
   */
  export type organizationsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which organizations to delete
     */
    where?: organizationsWhereInput
    /**
     * Limit how many organizations to delete.
     */
    limit?: number
  }

  /**
   * organizations.organization_databases
   */
  export type organizations$organization_databasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_databases
     */
    select?: organization_databasesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_databases
     */
    omit?: organization_databasesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_databasesInclude<ExtArgs> | null
    where?: organization_databasesWhereInput
    orderBy?: organization_databasesOrderByWithRelationInput | organization_databasesOrderByWithRelationInput[]
    cursor?: organization_databasesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Organization_databasesScalarFieldEnum | Organization_databasesScalarFieldEnum[]
  }

  /**
   * organizations.organization_subscriptions
   */
  export type organizations$organization_subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
    where?: organization_subscriptionsWhereInput
    orderBy?: organization_subscriptionsOrderByWithRelationInput | organization_subscriptionsOrderByWithRelationInput[]
    cursor?: organization_subscriptionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Organization_subscriptionsScalarFieldEnum | Organization_subscriptionsScalarFieldEnum[]
  }

  /**
   * organizations without action
   */
  export type organizationsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
  }


  /**
   * Model subscription_plans
   */

  export type AggregateSubscription_plans = {
    _count: Subscription_plansCountAggregateOutputType | null
    _avg: Subscription_plansAvgAggregateOutputType | null
    _sum: Subscription_plansSumAggregateOutputType | null
    _min: Subscription_plansMinAggregateOutputType | null
    _max: Subscription_plansMaxAggregateOutputType | null
  }

  export type Subscription_plansAvgAggregateOutputType = {
    id: number | null
    max_users: number | null
  }

  export type Subscription_plansSumAggregateOutputType = {
    id: bigint | null
    max_users: number | null
  }

  export type Subscription_plansMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    code: string | null
    max_users: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Subscription_plansMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    code: string | null
    max_users: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Subscription_plansCountAggregateOutputType = {
    id: number
    name: number
    code: number
    max_users: number
    features_json: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Subscription_plansAvgAggregateInputType = {
    id?: true
    max_users?: true
  }

  export type Subscription_plansSumAggregateInputType = {
    id?: true
    max_users?: true
  }

  export type Subscription_plansMinAggregateInputType = {
    id?: true
    name?: true
    code?: true
    max_users?: true
    created_at?: true
    updated_at?: true
  }

  export type Subscription_plansMaxAggregateInputType = {
    id?: true
    name?: true
    code?: true
    max_users?: true
    created_at?: true
    updated_at?: true
  }

  export type Subscription_plansCountAggregateInputType = {
    id?: true
    name?: true
    code?: true
    max_users?: true
    features_json?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Subscription_plansAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subscription_plans to aggregate.
     */
    where?: subscription_plansWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscription_plans to fetch.
     */
    orderBy?: subscription_plansOrderByWithRelationInput | subscription_plansOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: subscription_plansWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscription_plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscription_plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned subscription_plans
    **/
    _count?: true | Subscription_plansCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Subscription_plansAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Subscription_plansSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Subscription_plansMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Subscription_plansMaxAggregateInputType
  }

  export type GetSubscription_plansAggregateType<T extends Subscription_plansAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription_plans]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription_plans[P]>
      : GetScalarType<T[P], AggregateSubscription_plans[P]>
  }




  export type subscription_plansGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: subscription_plansWhereInput
    orderBy?: subscription_plansOrderByWithAggregationInput | subscription_plansOrderByWithAggregationInput[]
    by: Subscription_plansScalarFieldEnum[] | Subscription_plansScalarFieldEnum
    having?: subscription_plansScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Subscription_plansCountAggregateInputType | true
    _avg?: Subscription_plansAvgAggregateInputType
    _sum?: Subscription_plansSumAggregateInputType
    _min?: Subscription_plansMinAggregateInputType
    _max?: Subscription_plansMaxAggregateInputType
  }

  export type Subscription_plansGroupByOutputType = {
    id: bigint
    name: string
    code: string
    max_users: number
    features_json: JsonValue | null
    created_at: Date | null
    updated_at: Date | null
    _count: Subscription_plansCountAggregateOutputType | null
    _avg: Subscription_plansAvgAggregateOutputType | null
    _sum: Subscription_plansSumAggregateOutputType | null
    _min: Subscription_plansMinAggregateOutputType | null
    _max: Subscription_plansMaxAggregateOutputType | null
  }

  type GetSubscription_plansGroupByPayload<T extends subscription_plansGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Subscription_plansGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Subscription_plansGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Subscription_plansGroupByOutputType[P]>
            : GetScalarType<T[P], Subscription_plansGroupByOutputType[P]>
        }
      >
    >


  export type subscription_plansSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    max_users?: boolean
    features_json?: boolean
    created_at?: boolean
    updated_at?: boolean
    organization_subscriptions?: boolean | subscription_plans$organization_subscriptionsArgs<ExtArgs>
    _count?: boolean | Subscription_plansCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription_plans"]>



  export type subscription_plansSelectScalar = {
    id?: boolean
    name?: boolean
    code?: boolean
    max_users?: boolean
    features_json?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type subscription_plansOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "code" | "max_users" | "features_json" | "created_at" | "updated_at", ExtArgs["result"]["subscription_plans"]>
  export type subscription_plansInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization_subscriptions?: boolean | subscription_plans$organization_subscriptionsArgs<ExtArgs>
    _count?: boolean | Subscription_plansCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $subscription_plansPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "subscription_plans"
    objects: {
      organization_subscriptions: Prisma.$organization_subscriptionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      code: string
      max_users: number
      features_json: Prisma.JsonValue | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["subscription_plans"]>
    composites: {}
  }

  type subscription_plansGetPayload<S extends boolean | null | undefined | subscription_plansDefaultArgs> = $Result.GetResult<Prisma.$subscription_plansPayload, S>

  type subscription_plansCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<subscription_plansFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Subscription_plansCountAggregateInputType | true
    }

  export interface subscription_plansDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['subscription_plans'], meta: { name: 'subscription_plans' } }
    /**
     * Find zero or one Subscription_plans that matches the filter.
     * @param {subscription_plansFindUniqueArgs} args - Arguments to find a Subscription_plans
     * @example
     * // Get one Subscription_plans
     * const subscription_plans = await prisma.subscription_plans.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends subscription_plansFindUniqueArgs>(args: SelectSubset<T, subscription_plansFindUniqueArgs<ExtArgs>>): Prisma__subscription_plansClient<$Result.GetResult<Prisma.$subscription_plansPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscription_plans that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {subscription_plansFindUniqueOrThrowArgs} args - Arguments to find a Subscription_plans
     * @example
     * // Get one Subscription_plans
     * const subscription_plans = await prisma.subscription_plans.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends subscription_plansFindUniqueOrThrowArgs>(args: SelectSubset<T, subscription_plansFindUniqueOrThrowArgs<ExtArgs>>): Prisma__subscription_plansClient<$Result.GetResult<Prisma.$subscription_plansPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription_plans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscription_plansFindFirstArgs} args - Arguments to find a Subscription_plans
     * @example
     * // Get one Subscription_plans
     * const subscription_plans = await prisma.subscription_plans.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends subscription_plansFindFirstArgs>(args?: SelectSubset<T, subscription_plansFindFirstArgs<ExtArgs>>): Prisma__subscription_plansClient<$Result.GetResult<Prisma.$subscription_plansPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription_plans that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscription_plansFindFirstOrThrowArgs} args - Arguments to find a Subscription_plans
     * @example
     * // Get one Subscription_plans
     * const subscription_plans = await prisma.subscription_plans.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends subscription_plansFindFirstOrThrowArgs>(args?: SelectSubset<T, subscription_plansFindFirstOrThrowArgs<ExtArgs>>): Prisma__subscription_plansClient<$Result.GetResult<Prisma.$subscription_plansPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscription_plans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscription_plansFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscription_plans
     * const subscription_plans = await prisma.subscription_plans.findMany()
     * 
     * // Get first 10 Subscription_plans
     * const subscription_plans = await prisma.subscription_plans.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscription_plansWithIdOnly = await prisma.subscription_plans.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends subscription_plansFindManyArgs>(args?: SelectSubset<T, subscription_plansFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subscription_plansPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscription_plans.
     * @param {subscription_plansCreateArgs} args - Arguments to create a Subscription_plans.
     * @example
     * // Create one Subscription_plans
     * const Subscription_plans = await prisma.subscription_plans.create({
     *   data: {
     *     // ... data to create a Subscription_plans
     *   }
     * })
     * 
     */
    create<T extends subscription_plansCreateArgs>(args: SelectSubset<T, subscription_plansCreateArgs<ExtArgs>>): Prisma__subscription_plansClient<$Result.GetResult<Prisma.$subscription_plansPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscription_plans.
     * @param {subscription_plansCreateManyArgs} args - Arguments to create many Subscription_plans.
     * @example
     * // Create many Subscription_plans
     * const subscription_plans = await prisma.subscription_plans.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends subscription_plansCreateManyArgs>(args?: SelectSubset<T, subscription_plansCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Subscription_plans.
     * @param {subscription_plansDeleteArgs} args - Arguments to delete one Subscription_plans.
     * @example
     * // Delete one Subscription_plans
     * const Subscription_plans = await prisma.subscription_plans.delete({
     *   where: {
     *     // ... filter to delete one Subscription_plans
     *   }
     * })
     * 
     */
    delete<T extends subscription_plansDeleteArgs>(args: SelectSubset<T, subscription_plansDeleteArgs<ExtArgs>>): Prisma__subscription_plansClient<$Result.GetResult<Prisma.$subscription_plansPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscription_plans.
     * @param {subscription_plansUpdateArgs} args - Arguments to update one Subscription_plans.
     * @example
     * // Update one Subscription_plans
     * const subscription_plans = await prisma.subscription_plans.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends subscription_plansUpdateArgs>(args: SelectSubset<T, subscription_plansUpdateArgs<ExtArgs>>): Prisma__subscription_plansClient<$Result.GetResult<Prisma.$subscription_plansPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscription_plans.
     * @param {subscription_plansDeleteManyArgs} args - Arguments to filter Subscription_plans to delete.
     * @example
     * // Delete a few Subscription_plans
     * const { count } = await prisma.subscription_plans.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends subscription_plansDeleteManyArgs>(args?: SelectSubset<T, subscription_plansDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscription_plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscription_plansUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscription_plans
     * const subscription_plans = await prisma.subscription_plans.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends subscription_plansUpdateManyArgs>(args: SelectSubset<T, subscription_plansUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subscription_plans.
     * @param {subscription_plansUpsertArgs} args - Arguments to update or create a Subscription_plans.
     * @example
     * // Update or create a Subscription_plans
     * const subscription_plans = await prisma.subscription_plans.upsert({
     *   create: {
     *     // ... data to create a Subscription_plans
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription_plans we want to update
     *   }
     * })
     */
    upsert<T extends subscription_plansUpsertArgs>(args: SelectSubset<T, subscription_plansUpsertArgs<ExtArgs>>): Prisma__subscription_plansClient<$Result.GetResult<Prisma.$subscription_plansPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscription_plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscription_plansCountArgs} args - Arguments to filter Subscription_plans to count.
     * @example
     * // Count the number of Subscription_plans
     * const count = await prisma.subscription_plans.count({
     *   where: {
     *     // ... the filter for the Subscription_plans we want to count
     *   }
     * })
    **/
    count<T extends subscription_plansCountArgs>(
      args?: Subset<T, subscription_plansCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Subscription_plansCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription_plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Subscription_plansAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Subscription_plansAggregateArgs>(args: Subset<T, Subscription_plansAggregateArgs>): Prisma.PrismaPromise<GetSubscription_plansAggregateType<T>>

    /**
     * Group by Subscription_plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscription_plansGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends subscription_plansGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: subscription_plansGroupByArgs['orderBy'] }
        : { orderBy?: subscription_plansGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, subscription_plansGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscription_plansGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the subscription_plans model
   */
  readonly fields: subscription_plansFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for subscription_plans.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__subscription_plansClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization_subscriptions<T extends subscription_plans$organization_subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, subscription_plans$organization_subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$organization_subscriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the subscription_plans model
   */
  interface subscription_plansFieldRefs {
    readonly id: FieldRef<"subscription_plans", 'BigInt'>
    readonly name: FieldRef<"subscription_plans", 'String'>
    readonly code: FieldRef<"subscription_plans", 'String'>
    readonly max_users: FieldRef<"subscription_plans", 'Int'>
    readonly features_json: FieldRef<"subscription_plans", 'Json'>
    readonly created_at: FieldRef<"subscription_plans", 'DateTime'>
    readonly updated_at: FieldRef<"subscription_plans", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * subscription_plans findUnique
   */
  export type subscription_plansFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscription_plans
     */
    select?: subscription_plansSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscription_plans
     */
    omit?: subscription_plansOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscription_plansInclude<ExtArgs> | null
    /**
     * Filter, which subscription_plans to fetch.
     */
    where: subscription_plansWhereUniqueInput
  }

  /**
   * subscription_plans findUniqueOrThrow
   */
  export type subscription_plansFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscription_plans
     */
    select?: subscription_plansSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscription_plans
     */
    omit?: subscription_plansOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscription_plansInclude<ExtArgs> | null
    /**
     * Filter, which subscription_plans to fetch.
     */
    where: subscription_plansWhereUniqueInput
  }

  /**
   * subscription_plans findFirst
   */
  export type subscription_plansFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscription_plans
     */
    select?: subscription_plansSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscription_plans
     */
    omit?: subscription_plansOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscription_plansInclude<ExtArgs> | null
    /**
     * Filter, which subscription_plans to fetch.
     */
    where?: subscription_plansWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscription_plans to fetch.
     */
    orderBy?: subscription_plansOrderByWithRelationInput | subscription_plansOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subscription_plans.
     */
    cursor?: subscription_plansWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscription_plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscription_plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subscription_plans.
     */
    distinct?: Subscription_plansScalarFieldEnum | Subscription_plansScalarFieldEnum[]
  }

  /**
   * subscription_plans findFirstOrThrow
   */
  export type subscription_plansFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscription_plans
     */
    select?: subscription_plansSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscription_plans
     */
    omit?: subscription_plansOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscription_plansInclude<ExtArgs> | null
    /**
     * Filter, which subscription_plans to fetch.
     */
    where?: subscription_plansWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscription_plans to fetch.
     */
    orderBy?: subscription_plansOrderByWithRelationInput | subscription_plansOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subscription_plans.
     */
    cursor?: subscription_plansWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscription_plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscription_plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subscription_plans.
     */
    distinct?: Subscription_plansScalarFieldEnum | Subscription_plansScalarFieldEnum[]
  }

  /**
   * subscription_plans findMany
   */
  export type subscription_plansFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscription_plans
     */
    select?: subscription_plansSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscription_plans
     */
    omit?: subscription_plansOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscription_plansInclude<ExtArgs> | null
    /**
     * Filter, which subscription_plans to fetch.
     */
    where?: subscription_plansWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscription_plans to fetch.
     */
    orderBy?: subscription_plansOrderByWithRelationInput | subscription_plansOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing subscription_plans.
     */
    cursor?: subscription_plansWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscription_plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscription_plans.
     */
    skip?: number
    distinct?: Subscription_plansScalarFieldEnum | Subscription_plansScalarFieldEnum[]
  }

  /**
   * subscription_plans create
   */
  export type subscription_plansCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscription_plans
     */
    select?: subscription_plansSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscription_plans
     */
    omit?: subscription_plansOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscription_plansInclude<ExtArgs> | null
    /**
     * The data needed to create a subscription_plans.
     */
    data: XOR<subscription_plansCreateInput, subscription_plansUncheckedCreateInput>
  }

  /**
   * subscription_plans createMany
   */
  export type subscription_plansCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many subscription_plans.
     */
    data: subscription_plansCreateManyInput | subscription_plansCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * subscription_plans update
   */
  export type subscription_plansUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscription_plans
     */
    select?: subscription_plansSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscription_plans
     */
    omit?: subscription_plansOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscription_plansInclude<ExtArgs> | null
    /**
     * The data needed to update a subscription_plans.
     */
    data: XOR<subscription_plansUpdateInput, subscription_plansUncheckedUpdateInput>
    /**
     * Choose, which subscription_plans to update.
     */
    where: subscription_plansWhereUniqueInput
  }

  /**
   * subscription_plans updateMany
   */
  export type subscription_plansUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update subscription_plans.
     */
    data: XOR<subscription_plansUpdateManyMutationInput, subscription_plansUncheckedUpdateManyInput>
    /**
     * Filter which subscription_plans to update
     */
    where?: subscription_plansWhereInput
    /**
     * Limit how many subscription_plans to update.
     */
    limit?: number
  }

  /**
   * subscription_plans upsert
   */
  export type subscription_plansUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscription_plans
     */
    select?: subscription_plansSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscription_plans
     */
    omit?: subscription_plansOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscription_plansInclude<ExtArgs> | null
    /**
     * The filter to search for the subscription_plans to update in case it exists.
     */
    where: subscription_plansWhereUniqueInput
    /**
     * In case the subscription_plans found by the `where` argument doesn't exist, create a new subscription_plans with this data.
     */
    create: XOR<subscription_plansCreateInput, subscription_plansUncheckedCreateInput>
    /**
     * In case the subscription_plans was found with the provided `where` argument, update it with this data.
     */
    update: XOR<subscription_plansUpdateInput, subscription_plansUncheckedUpdateInput>
  }

  /**
   * subscription_plans delete
   */
  export type subscription_plansDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscription_plans
     */
    select?: subscription_plansSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscription_plans
     */
    omit?: subscription_plansOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscription_plansInclude<ExtArgs> | null
    /**
     * Filter which subscription_plans to delete.
     */
    where: subscription_plansWhereUniqueInput
  }

  /**
   * subscription_plans deleteMany
   */
  export type subscription_plansDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subscription_plans to delete
     */
    where?: subscription_plansWhereInput
    /**
     * Limit how many subscription_plans to delete.
     */
    limit?: number
  }

  /**
   * subscription_plans.organization_subscriptions
   */
  export type subscription_plans$organization_subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organization_subscriptions
     */
    select?: organization_subscriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organization_subscriptions
     */
    omit?: organization_subscriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organization_subscriptionsInclude<ExtArgs> | null
    where?: organization_subscriptionsWhereInput
    orderBy?: organization_subscriptionsOrderByWithRelationInput | organization_subscriptionsOrderByWithRelationInput[]
    cursor?: organization_subscriptionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Organization_subscriptionsScalarFieldEnum | Organization_subscriptionsScalarFieldEnum[]
  }

  /**
   * subscription_plans without action
   */
  export type subscription_plansDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscription_plans
     */
    select?: subscription_plansSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscription_plans
     */
    omit?: subscription_plansOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: subscription_plansInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Organization_databasesScalarFieldEnum: {
    id: 'id',
    organization_id: 'organization_id',
    database_name: 'database_name',
    host: 'host',
    port: 'port',
    username: 'username',
    password: 'password',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Organization_databasesScalarFieldEnum = (typeof Organization_databasesScalarFieldEnum)[keyof typeof Organization_databasesScalarFieldEnum]


  export const Organization_subscriptionsScalarFieldEnum: {
    id: 'id',
    organization_id: 'organization_id',
    subscription_plan_id: 'subscription_plan_id',
    status: 'status',
    start_date: 'start_date',
    end_date: 'end_date',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Organization_subscriptionsScalarFieldEnum = (typeof Organization_subscriptionsScalarFieldEnum)[keyof typeof Organization_subscriptionsScalarFieldEnum]


  export const OrganizationsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    type: 'type',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type OrganizationsScalarFieldEnum = (typeof OrganizationsScalarFieldEnum)[keyof typeof OrganizationsScalarFieldEnum]


  export const Subscription_plansScalarFieldEnum: {
    id: 'id',
    name: 'name',
    code: 'code',
    max_users: 'max_users',
    features_json: 'features_json',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Subscription_plansScalarFieldEnum = (typeof Subscription_plansScalarFieldEnum)[keyof typeof Subscription_plansScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const organization_databasesOrderByRelevanceFieldEnum: {
    database_name: 'database_name',
    host: 'host',
    username: 'username',
    password: 'password',
    status: 'status'
  };

  export type organization_databasesOrderByRelevanceFieldEnum = (typeof organization_databasesOrderByRelevanceFieldEnum)[keyof typeof organization_databasesOrderByRelevanceFieldEnum]


  export const organization_subscriptionsOrderByRelevanceFieldEnum: {
    status: 'status'
  };

  export type organization_subscriptionsOrderByRelevanceFieldEnum = (typeof organization_subscriptionsOrderByRelevanceFieldEnum)[keyof typeof organization_subscriptionsOrderByRelevanceFieldEnum]


  export const organizationsOrderByRelevanceFieldEnum: {
    name: 'name',
    slug: 'slug',
    type: 'type',
    status: 'status'
  };

  export type organizationsOrderByRelevanceFieldEnum = (typeof organizationsOrderByRelevanceFieldEnum)[keyof typeof organizationsOrderByRelevanceFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const subscription_plansOrderByRelevanceFieldEnum: {
    name: 'name',
    code: 'code'
  };

  export type subscription_plansOrderByRelevanceFieldEnum = (typeof subscription_plansOrderByRelevanceFieldEnum)[keyof typeof subscription_plansOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type organization_databasesWhereInput = {
    AND?: organization_databasesWhereInput | organization_databasesWhereInput[]
    OR?: organization_databasesWhereInput[]
    NOT?: organization_databasesWhereInput | organization_databasesWhereInput[]
    id?: BigIntFilter<"organization_databases"> | bigint | number
    organization_id?: BigIntFilter<"organization_databases"> | bigint | number
    database_name?: StringFilter<"organization_databases"> | string
    host?: StringFilter<"organization_databases"> | string
    port?: IntFilter<"organization_databases"> | number
    username?: StringFilter<"organization_databases"> | string
    password?: StringFilter<"organization_databases"> | string
    status?: StringFilter<"organization_databases"> | string
    created_at?: DateTimeNullableFilter<"organization_databases"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"organization_databases"> | Date | string | null
    organizations?: XOR<OrganizationsScalarRelationFilter, organizationsWhereInput>
  }

  export type organization_databasesOrderByWithRelationInput = {
    id?: SortOrder
    organization_id?: SortOrder
    database_name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    password?: SortOrder
    status?: SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    organizations?: organizationsOrderByWithRelationInput
    _relevance?: organization_databasesOrderByRelevanceInput
  }

  export type organization_databasesWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: organization_databasesWhereInput | organization_databasesWhereInput[]
    OR?: organization_databasesWhereInput[]
    NOT?: organization_databasesWhereInput | organization_databasesWhereInput[]
    organization_id?: BigIntFilter<"organization_databases"> | bigint | number
    database_name?: StringFilter<"organization_databases"> | string
    host?: StringFilter<"organization_databases"> | string
    port?: IntFilter<"organization_databases"> | number
    username?: StringFilter<"organization_databases"> | string
    password?: StringFilter<"organization_databases"> | string
    status?: StringFilter<"organization_databases"> | string
    created_at?: DateTimeNullableFilter<"organization_databases"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"organization_databases"> | Date | string | null
    organizations?: XOR<OrganizationsScalarRelationFilter, organizationsWhereInput>
  }, "id">

  export type organization_databasesOrderByWithAggregationInput = {
    id?: SortOrder
    organization_id?: SortOrder
    database_name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    password?: SortOrder
    status?: SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: organization_databasesCountOrderByAggregateInput
    _avg?: organization_databasesAvgOrderByAggregateInput
    _max?: organization_databasesMaxOrderByAggregateInput
    _min?: organization_databasesMinOrderByAggregateInput
    _sum?: organization_databasesSumOrderByAggregateInput
  }

  export type organization_databasesScalarWhereWithAggregatesInput = {
    AND?: organization_databasesScalarWhereWithAggregatesInput | organization_databasesScalarWhereWithAggregatesInput[]
    OR?: organization_databasesScalarWhereWithAggregatesInput[]
    NOT?: organization_databasesScalarWhereWithAggregatesInput | organization_databasesScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"organization_databases"> | bigint | number
    organization_id?: BigIntWithAggregatesFilter<"organization_databases"> | bigint | number
    database_name?: StringWithAggregatesFilter<"organization_databases"> | string
    host?: StringWithAggregatesFilter<"organization_databases"> | string
    port?: IntWithAggregatesFilter<"organization_databases"> | number
    username?: StringWithAggregatesFilter<"organization_databases"> | string
    password?: StringWithAggregatesFilter<"organization_databases"> | string
    status?: StringWithAggregatesFilter<"organization_databases"> | string
    created_at?: DateTimeNullableWithAggregatesFilter<"organization_databases"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"organization_databases"> | Date | string | null
  }

  export type organization_subscriptionsWhereInput = {
    AND?: organization_subscriptionsWhereInput | organization_subscriptionsWhereInput[]
    OR?: organization_subscriptionsWhereInput[]
    NOT?: organization_subscriptionsWhereInput | organization_subscriptionsWhereInput[]
    id?: BigIntFilter<"organization_subscriptions"> | bigint | number
    organization_id?: BigIntFilter<"organization_subscriptions"> | bigint | number
    subscription_plan_id?: BigIntFilter<"organization_subscriptions"> | bigint | number
    status?: StringFilter<"organization_subscriptions"> | string
    start_date?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
    end_date?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
    created_at?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
    organizations?: XOR<OrganizationsScalarRelationFilter, organizationsWhereInput>
    subscription_plans?: XOR<Subscription_plansScalarRelationFilter, subscription_plansWhereInput>
  }

  export type organization_subscriptionsOrderByWithRelationInput = {
    id?: SortOrder
    organization_id?: SortOrder
    subscription_plan_id?: SortOrder
    status?: SortOrder
    start_date?: SortOrderInput | SortOrder
    end_date?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    organizations?: organizationsOrderByWithRelationInput
    subscription_plans?: subscription_plansOrderByWithRelationInput
    _relevance?: organization_subscriptionsOrderByRelevanceInput
  }

  export type organization_subscriptionsWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: organization_subscriptionsWhereInput | organization_subscriptionsWhereInput[]
    OR?: organization_subscriptionsWhereInput[]
    NOT?: organization_subscriptionsWhereInput | organization_subscriptionsWhereInput[]
    organization_id?: BigIntFilter<"organization_subscriptions"> | bigint | number
    subscription_plan_id?: BigIntFilter<"organization_subscriptions"> | bigint | number
    status?: StringFilter<"organization_subscriptions"> | string
    start_date?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
    end_date?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
    created_at?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
    organizations?: XOR<OrganizationsScalarRelationFilter, organizationsWhereInput>
    subscription_plans?: XOR<Subscription_plansScalarRelationFilter, subscription_plansWhereInput>
  }, "id">

  export type organization_subscriptionsOrderByWithAggregationInput = {
    id?: SortOrder
    organization_id?: SortOrder
    subscription_plan_id?: SortOrder
    status?: SortOrder
    start_date?: SortOrderInput | SortOrder
    end_date?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: organization_subscriptionsCountOrderByAggregateInput
    _avg?: organization_subscriptionsAvgOrderByAggregateInput
    _max?: organization_subscriptionsMaxOrderByAggregateInput
    _min?: organization_subscriptionsMinOrderByAggregateInput
    _sum?: organization_subscriptionsSumOrderByAggregateInput
  }

  export type organization_subscriptionsScalarWhereWithAggregatesInput = {
    AND?: organization_subscriptionsScalarWhereWithAggregatesInput | organization_subscriptionsScalarWhereWithAggregatesInput[]
    OR?: organization_subscriptionsScalarWhereWithAggregatesInput[]
    NOT?: organization_subscriptionsScalarWhereWithAggregatesInput | organization_subscriptionsScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"organization_subscriptions"> | bigint | number
    organization_id?: BigIntWithAggregatesFilter<"organization_subscriptions"> | bigint | number
    subscription_plan_id?: BigIntWithAggregatesFilter<"organization_subscriptions"> | bigint | number
    status?: StringWithAggregatesFilter<"organization_subscriptions"> | string
    start_date?: DateTimeNullableWithAggregatesFilter<"organization_subscriptions"> | Date | string | null
    end_date?: DateTimeNullableWithAggregatesFilter<"organization_subscriptions"> | Date | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"organization_subscriptions"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"organization_subscriptions"> | Date | string | null
  }

  export type organizationsWhereInput = {
    AND?: organizationsWhereInput | organizationsWhereInput[]
    OR?: organizationsWhereInput[]
    NOT?: organizationsWhereInput | organizationsWhereInput[]
    id?: BigIntFilter<"organizations"> | bigint | number
    name?: StringFilter<"organizations"> | string
    slug?: StringFilter<"organizations"> | string
    type?: StringNullableFilter<"organizations"> | string | null
    status?: StringFilter<"organizations"> | string
    created_at?: DateTimeNullableFilter<"organizations"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"organizations"> | Date | string | null
    organization_databases?: Organization_databasesListRelationFilter
    organization_subscriptions?: Organization_subscriptionsListRelationFilter
  }

  export type organizationsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    type?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    organization_databases?: organization_databasesOrderByRelationAggregateInput
    organization_subscriptions?: organization_subscriptionsOrderByRelationAggregateInput
    _relevance?: organizationsOrderByRelevanceInput
  }

  export type organizationsWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    slug?: string
    AND?: organizationsWhereInput | organizationsWhereInput[]
    OR?: organizationsWhereInput[]
    NOT?: organizationsWhereInput | organizationsWhereInput[]
    name?: StringFilter<"organizations"> | string
    type?: StringNullableFilter<"organizations"> | string | null
    status?: StringFilter<"organizations"> | string
    created_at?: DateTimeNullableFilter<"organizations"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"organizations"> | Date | string | null
    organization_databases?: Organization_databasesListRelationFilter
    organization_subscriptions?: Organization_subscriptionsListRelationFilter
  }, "id" | "slug">

  export type organizationsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    type?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: organizationsCountOrderByAggregateInput
    _avg?: organizationsAvgOrderByAggregateInput
    _max?: organizationsMaxOrderByAggregateInput
    _min?: organizationsMinOrderByAggregateInput
    _sum?: organizationsSumOrderByAggregateInput
  }

  export type organizationsScalarWhereWithAggregatesInput = {
    AND?: organizationsScalarWhereWithAggregatesInput | organizationsScalarWhereWithAggregatesInput[]
    OR?: organizationsScalarWhereWithAggregatesInput[]
    NOT?: organizationsScalarWhereWithAggregatesInput | organizationsScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"organizations"> | bigint | number
    name?: StringWithAggregatesFilter<"organizations"> | string
    slug?: StringWithAggregatesFilter<"organizations"> | string
    type?: StringNullableWithAggregatesFilter<"organizations"> | string | null
    status?: StringWithAggregatesFilter<"organizations"> | string
    created_at?: DateTimeNullableWithAggregatesFilter<"organizations"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"organizations"> | Date | string | null
  }

  export type subscription_plansWhereInput = {
    AND?: subscription_plansWhereInput | subscription_plansWhereInput[]
    OR?: subscription_plansWhereInput[]
    NOT?: subscription_plansWhereInput | subscription_plansWhereInput[]
    id?: BigIntFilter<"subscription_plans"> | bigint | number
    name?: StringFilter<"subscription_plans"> | string
    code?: StringFilter<"subscription_plans"> | string
    max_users?: IntFilter<"subscription_plans"> | number
    features_json?: JsonNullableFilter<"subscription_plans">
    created_at?: DateTimeNullableFilter<"subscription_plans"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"subscription_plans"> | Date | string | null
    organization_subscriptions?: Organization_subscriptionsListRelationFilter
  }

  export type subscription_plansOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    max_users?: SortOrder
    features_json?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    organization_subscriptions?: organization_subscriptionsOrderByRelationAggregateInput
    _relevance?: subscription_plansOrderByRelevanceInput
  }

  export type subscription_plansWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    code?: string
    AND?: subscription_plansWhereInput | subscription_plansWhereInput[]
    OR?: subscription_plansWhereInput[]
    NOT?: subscription_plansWhereInput | subscription_plansWhereInput[]
    name?: StringFilter<"subscription_plans"> | string
    max_users?: IntFilter<"subscription_plans"> | number
    features_json?: JsonNullableFilter<"subscription_plans">
    created_at?: DateTimeNullableFilter<"subscription_plans"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"subscription_plans"> | Date | string | null
    organization_subscriptions?: Organization_subscriptionsListRelationFilter
  }, "id" | "code">

  export type subscription_plansOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    max_users?: SortOrder
    features_json?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: subscription_plansCountOrderByAggregateInput
    _avg?: subscription_plansAvgOrderByAggregateInput
    _max?: subscription_plansMaxOrderByAggregateInput
    _min?: subscription_plansMinOrderByAggregateInput
    _sum?: subscription_plansSumOrderByAggregateInput
  }

  export type subscription_plansScalarWhereWithAggregatesInput = {
    AND?: subscription_plansScalarWhereWithAggregatesInput | subscription_plansScalarWhereWithAggregatesInput[]
    OR?: subscription_plansScalarWhereWithAggregatesInput[]
    NOT?: subscription_plansScalarWhereWithAggregatesInput | subscription_plansScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"subscription_plans"> | bigint | number
    name?: StringWithAggregatesFilter<"subscription_plans"> | string
    code?: StringWithAggregatesFilter<"subscription_plans"> | string
    max_users?: IntWithAggregatesFilter<"subscription_plans"> | number
    features_json?: JsonNullableWithAggregatesFilter<"subscription_plans">
    created_at?: DateTimeNullableWithAggregatesFilter<"subscription_plans"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"subscription_plans"> | Date | string | null
  }

  export type organization_databasesCreateInput = {
    id?: bigint | number
    database_name: string
    host: string
    port?: number
    username: string
    password: string
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    organizations: organizationsCreateNestedOneWithoutOrganization_databasesInput
  }

  export type organization_databasesUncheckedCreateInput = {
    id?: bigint | number
    organization_id: bigint | number
    database_name: string
    host: string
    port?: number
    username: string
    password: string
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organization_databasesUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    database_name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizations?: organizationsUpdateOneRequiredWithoutOrganization_databasesNestedInput
  }

  export type organization_databasesUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    organization_id?: BigIntFieldUpdateOperationsInput | bigint | number
    database_name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_databasesCreateManyInput = {
    id?: bigint | number
    organization_id: bigint | number
    database_name: string
    host: string
    port?: number
    username: string
    password: string
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organization_databasesUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    database_name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_databasesUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    organization_id?: BigIntFieldUpdateOperationsInput | bigint | number
    database_name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_subscriptionsCreateInput = {
    id?: bigint | number
    status?: string
    start_date?: Date | string | null
    end_date?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    organizations: organizationsCreateNestedOneWithoutOrganization_subscriptionsInput
    subscription_plans: subscription_plansCreateNestedOneWithoutOrganization_subscriptionsInput
  }

  export type organization_subscriptionsUncheckedCreateInput = {
    id?: bigint | number
    organization_id: bigint | number
    subscription_plan_id: bigint | number
    status?: string
    start_date?: Date | string | null
    end_date?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organization_subscriptionsUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizations?: organizationsUpdateOneRequiredWithoutOrganization_subscriptionsNestedInput
    subscription_plans?: subscription_plansUpdateOneRequiredWithoutOrganization_subscriptionsNestedInput
  }

  export type organization_subscriptionsUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    organization_id?: BigIntFieldUpdateOperationsInput | bigint | number
    subscription_plan_id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_subscriptionsCreateManyInput = {
    id?: bigint | number
    organization_id: bigint | number
    subscription_plan_id: bigint | number
    status?: string
    start_date?: Date | string | null
    end_date?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organization_subscriptionsUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_subscriptionsUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    organization_id?: BigIntFieldUpdateOperationsInput | bigint | number
    subscription_plan_id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organizationsCreateInput = {
    id?: bigint | number
    name: string
    slug: string
    type?: string | null
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    organization_databases?: organization_databasesCreateNestedManyWithoutOrganizationsInput
    organization_subscriptions?: organization_subscriptionsCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsUncheckedCreateInput = {
    id?: bigint | number
    name: string
    slug: string
    type?: string | null
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    organization_databases?: organization_databasesUncheckedCreateNestedManyWithoutOrganizationsInput
    organization_subscriptions?: organization_subscriptionsUncheckedCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization_databases?: organization_databasesUpdateManyWithoutOrganizationsNestedInput
    organization_subscriptions?: organization_subscriptionsUpdateManyWithoutOrganizationsNestedInput
  }

  export type organizationsUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization_databases?: organization_databasesUncheckedUpdateManyWithoutOrganizationsNestedInput
    organization_subscriptions?: organization_subscriptionsUncheckedUpdateManyWithoutOrganizationsNestedInput
  }

  export type organizationsCreateManyInput = {
    id?: bigint | number
    name: string
    slug: string
    type?: string | null
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organizationsUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organizationsUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscription_plansCreateInput = {
    id?: bigint | number
    name: string
    code: string
    max_users?: number
    features_json?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    organization_subscriptions?: organization_subscriptionsCreateNestedManyWithoutSubscription_plansInput
  }

  export type subscription_plansUncheckedCreateInput = {
    id?: bigint | number
    name: string
    code: string
    max_users?: number
    features_json?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    organization_subscriptions?: organization_subscriptionsUncheckedCreateNestedManyWithoutSubscription_plansInput
  }

  export type subscription_plansUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    max_users?: IntFieldUpdateOperationsInput | number
    features_json?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization_subscriptions?: organization_subscriptionsUpdateManyWithoutSubscription_plansNestedInput
  }

  export type subscription_plansUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    max_users?: IntFieldUpdateOperationsInput | number
    features_json?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization_subscriptions?: organization_subscriptionsUncheckedUpdateManyWithoutSubscription_plansNestedInput
  }

  export type subscription_plansCreateManyInput = {
    id?: bigint | number
    name: string
    code: string
    max_users?: number
    features_json?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type subscription_plansUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    max_users?: IntFieldUpdateOperationsInput | number
    features_json?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscription_plansUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    max_users?: IntFieldUpdateOperationsInput | number
    features_json?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type OrganizationsScalarRelationFilter = {
    is?: organizationsWhereInput
    isNot?: organizationsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type organization_databasesOrderByRelevanceInput = {
    fields: organization_databasesOrderByRelevanceFieldEnum | organization_databasesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type organization_databasesCountOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    database_name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    password?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type organization_databasesAvgOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    port?: SortOrder
  }

  export type organization_databasesMaxOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    database_name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    password?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type organization_databasesMinOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    database_name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    password?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type organization_databasesSumOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    port?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type Subscription_plansScalarRelationFilter = {
    is?: subscription_plansWhereInput
    isNot?: subscription_plansWhereInput
  }

  export type organization_subscriptionsOrderByRelevanceInput = {
    fields: organization_subscriptionsOrderByRelevanceFieldEnum | organization_subscriptionsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type organization_subscriptionsCountOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    subscription_plan_id?: SortOrder
    status?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type organization_subscriptionsAvgOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    subscription_plan_id?: SortOrder
  }

  export type organization_subscriptionsMaxOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    subscription_plan_id?: SortOrder
    status?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type organization_subscriptionsMinOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    subscription_plan_id?: SortOrder
    status?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type organization_subscriptionsSumOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    subscription_plan_id?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type Organization_databasesListRelationFilter = {
    every?: organization_databasesWhereInput
    some?: organization_databasesWhereInput
    none?: organization_databasesWhereInput
  }

  export type Organization_subscriptionsListRelationFilter = {
    every?: organization_subscriptionsWhereInput
    some?: organization_subscriptionsWhereInput
    none?: organization_subscriptionsWhereInput
  }

  export type organization_databasesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type organization_subscriptionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type organizationsOrderByRelevanceInput = {
    fields: organizationsOrderByRelevanceFieldEnum | organizationsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type organizationsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    type?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type organizationsAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type organizationsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    type?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type organizationsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    type?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type organizationsSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type subscription_plansOrderByRelevanceInput = {
    fields: subscription_plansOrderByRelevanceFieldEnum | subscription_plansOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type subscription_plansCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    max_users?: SortOrder
    features_json?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type subscription_plansAvgOrderByAggregateInput = {
    id?: SortOrder
    max_users?: SortOrder
  }

  export type subscription_plansMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    max_users?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type subscription_plansMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    max_users?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type subscription_plansSumOrderByAggregateInput = {
    id?: SortOrder
    max_users?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type organizationsCreateNestedOneWithoutOrganization_databasesInput = {
    create?: XOR<organizationsCreateWithoutOrganization_databasesInput, organizationsUncheckedCreateWithoutOrganization_databasesInput>
    connectOrCreate?: organizationsCreateOrConnectWithoutOrganization_databasesInput
    connect?: organizationsWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type organizationsUpdateOneRequiredWithoutOrganization_databasesNestedInput = {
    create?: XOR<organizationsCreateWithoutOrganization_databasesInput, organizationsUncheckedCreateWithoutOrganization_databasesInput>
    connectOrCreate?: organizationsCreateOrConnectWithoutOrganization_databasesInput
    upsert?: organizationsUpsertWithoutOrganization_databasesInput
    connect?: organizationsWhereUniqueInput
    update?: XOR<XOR<organizationsUpdateToOneWithWhereWithoutOrganization_databasesInput, organizationsUpdateWithoutOrganization_databasesInput>, organizationsUncheckedUpdateWithoutOrganization_databasesInput>
  }

  export type organizationsCreateNestedOneWithoutOrganization_subscriptionsInput = {
    create?: XOR<organizationsCreateWithoutOrganization_subscriptionsInput, organizationsUncheckedCreateWithoutOrganization_subscriptionsInput>
    connectOrCreate?: organizationsCreateOrConnectWithoutOrganization_subscriptionsInput
    connect?: organizationsWhereUniqueInput
  }

  export type subscription_plansCreateNestedOneWithoutOrganization_subscriptionsInput = {
    create?: XOR<subscription_plansCreateWithoutOrganization_subscriptionsInput, subscription_plansUncheckedCreateWithoutOrganization_subscriptionsInput>
    connectOrCreate?: subscription_plansCreateOrConnectWithoutOrganization_subscriptionsInput
    connect?: subscription_plansWhereUniqueInput
  }

  export type organizationsUpdateOneRequiredWithoutOrganization_subscriptionsNestedInput = {
    create?: XOR<organizationsCreateWithoutOrganization_subscriptionsInput, organizationsUncheckedCreateWithoutOrganization_subscriptionsInput>
    connectOrCreate?: organizationsCreateOrConnectWithoutOrganization_subscriptionsInput
    upsert?: organizationsUpsertWithoutOrganization_subscriptionsInput
    connect?: organizationsWhereUniqueInput
    update?: XOR<XOR<organizationsUpdateToOneWithWhereWithoutOrganization_subscriptionsInput, organizationsUpdateWithoutOrganization_subscriptionsInput>, organizationsUncheckedUpdateWithoutOrganization_subscriptionsInput>
  }

  export type subscription_plansUpdateOneRequiredWithoutOrganization_subscriptionsNestedInput = {
    create?: XOR<subscription_plansCreateWithoutOrganization_subscriptionsInput, subscription_plansUncheckedCreateWithoutOrganization_subscriptionsInput>
    connectOrCreate?: subscription_plansCreateOrConnectWithoutOrganization_subscriptionsInput
    upsert?: subscription_plansUpsertWithoutOrganization_subscriptionsInput
    connect?: subscription_plansWhereUniqueInput
    update?: XOR<XOR<subscription_plansUpdateToOneWithWhereWithoutOrganization_subscriptionsInput, subscription_plansUpdateWithoutOrganization_subscriptionsInput>, subscription_plansUncheckedUpdateWithoutOrganization_subscriptionsInput>
  }

  export type organization_databasesCreateNestedManyWithoutOrganizationsInput = {
    create?: XOR<organization_databasesCreateWithoutOrganizationsInput, organization_databasesUncheckedCreateWithoutOrganizationsInput> | organization_databasesCreateWithoutOrganizationsInput[] | organization_databasesUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: organization_databasesCreateOrConnectWithoutOrganizationsInput | organization_databasesCreateOrConnectWithoutOrganizationsInput[]
    createMany?: organization_databasesCreateManyOrganizationsInputEnvelope
    connect?: organization_databasesWhereUniqueInput | organization_databasesWhereUniqueInput[]
  }

  export type organization_subscriptionsCreateNestedManyWithoutOrganizationsInput = {
    create?: XOR<organization_subscriptionsCreateWithoutOrganizationsInput, organization_subscriptionsUncheckedCreateWithoutOrganizationsInput> | organization_subscriptionsCreateWithoutOrganizationsInput[] | organization_subscriptionsUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: organization_subscriptionsCreateOrConnectWithoutOrganizationsInput | organization_subscriptionsCreateOrConnectWithoutOrganizationsInput[]
    createMany?: organization_subscriptionsCreateManyOrganizationsInputEnvelope
    connect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
  }

  export type organization_databasesUncheckedCreateNestedManyWithoutOrganizationsInput = {
    create?: XOR<organization_databasesCreateWithoutOrganizationsInput, organization_databasesUncheckedCreateWithoutOrganizationsInput> | organization_databasesCreateWithoutOrganizationsInput[] | organization_databasesUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: organization_databasesCreateOrConnectWithoutOrganizationsInput | organization_databasesCreateOrConnectWithoutOrganizationsInput[]
    createMany?: organization_databasesCreateManyOrganizationsInputEnvelope
    connect?: organization_databasesWhereUniqueInput | organization_databasesWhereUniqueInput[]
  }

  export type organization_subscriptionsUncheckedCreateNestedManyWithoutOrganizationsInput = {
    create?: XOR<organization_subscriptionsCreateWithoutOrganizationsInput, organization_subscriptionsUncheckedCreateWithoutOrganizationsInput> | organization_subscriptionsCreateWithoutOrganizationsInput[] | organization_subscriptionsUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: organization_subscriptionsCreateOrConnectWithoutOrganizationsInput | organization_subscriptionsCreateOrConnectWithoutOrganizationsInput[]
    createMany?: organization_subscriptionsCreateManyOrganizationsInputEnvelope
    connect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type organization_databasesUpdateManyWithoutOrganizationsNestedInput = {
    create?: XOR<organization_databasesCreateWithoutOrganizationsInput, organization_databasesUncheckedCreateWithoutOrganizationsInput> | organization_databasesCreateWithoutOrganizationsInput[] | organization_databasesUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: organization_databasesCreateOrConnectWithoutOrganizationsInput | organization_databasesCreateOrConnectWithoutOrganizationsInput[]
    upsert?: organization_databasesUpsertWithWhereUniqueWithoutOrganizationsInput | organization_databasesUpsertWithWhereUniqueWithoutOrganizationsInput[]
    createMany?: organization_databasesCreateManyOrganizationsInputEnvelope
    set?: organization_databasesWhereUniqueInput | organization_databasesWhereUniqueInput[]
    disconnect?: organization_databasesWhereUniqueInput | organization_databasesWhereUniqueInput[]
    delete?: organization_databasesWhereUniqueInput | organization_databasesWhereUniqueInput[]
    connect?: organization_databasesWhereUniqueInput | organization_databasesWhereUniqueInput[]
    update?: organization_databasesUpdateWithWhereUniqueWithoutOrganizationsInput | organization_databasesUpdateWithWhereUniqueWithoutOrganizationsInput[]
    updateMany?: organization_databasesUpdateManyWithWhereWithoutOrganizationsInput | organization_databasesUpdateManyWithWhereWithoutOrganizationsInput[]
    deleteMany?: organization_databasesScalarWhereInput | organization_databasesScalarWhereInput[]
  }

  export type organization_subscriptionsUpdateManyWithoutOrganizationsNestedInput = {
    create?: XOR<organization_subscriptionsCreateWithoutOrganizationsInput, organization_subscriptionsUncheckedCreateWithoutOrganizationsInput> | organization_subscriptionsCreateWithoutOrganizationsInput[] | organization_subscriptionsUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: organization_subscriptionsCreateOrConnectWithoutOrganizationsInput | organization_subscriptionsCreateOrConnectWithoutOrganizationsInput[]
    upsert?: organization_subscriptionsUpsertWithWhereUniqueWithoutOrganizationsInput | organization_subscriptionsUpsertWithWhereUniqueWithoutOrganizationsInput[]
    createMany?: organization_subscriptionsCreateManyOrganizationsInputEnvelope
    set?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    disconnect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    delete?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    connect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    update?: organization_subscriptionsUpdateWithWhereUniqueWithoutOrganizationsInput | organization_subscriptionsUpdateWithWhereUniqueWithoutOrganizationsInput[]
    updateMany?: organization_subscriptionsUpdateManyWithWhereWithoutOrganizationsInput | organization_subscriptionsUpdateManyWithWhereWithoutOrganizationsInput[]
    deleteMany?: organization_subscriptionsScalarWhereInput | organization_subscriptionsScalarWhereInput[]
  }

  export type organization_databasesUncheckedUpdateManyWithoutOrganizationsNestedInput = {
    create?: XOR<organization_databasesCreateWithoutOrganizationsInput, organization_databasesUncheckedCreateWithoutOrganizationsInput> | organization_databasesCreateWithoutOrganizationsInput[] | organization_databasesUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: organization_databasesCreateOrConnectWithoutOrganizationsInput | organization_databasesCreateOrConnectWithoutOrganizationsInput[]
    upsert?: organization_databasesUpsertWithWhereUniqueWithoutOrganizationsInput | organization_databasesUpsertWithWhereUniqueWithoutOrganizationsInput[]
    createMany?: organization_databasesCreateManyOrganizationsInputEnvelope
    set?: organization_databasesWhereUniqueInput | organization_databasesWhereUniqueInput[]
    disconnect?: organization_databasesWhereUniqueInput | organization_databasesWhereUniqueInput[]
    delete?: organization_databasesWhereUniqueInput | organization_databasesWhereUniqueInput[]
    connect?: organization_databasesWhereUniqueInput | organization_databasesWhereUniqueInput[]
    update?: organization_databasesUpdateWithWhereUniqueWithoutOrganizationsInput | organization_databasesUpdateWithWhereUniqueWithoutOrganizationsInput[]
    updateMany?: organization_databasesUpdateManyWithWhereWithoutOrganizationsInput | organization_databasesUpdateManyWithWhereWithoutOrganizationsInput[]
    deleteMany?: organization_databasesScalarWhereInput | organization_databasesScalarWhereInput[]
  }

  export type organization_subscriptionsUncheckedUpdateManyWithoutOrganizationsNestedInput = {
    create?: XOR<organization_subscriptionsCreateWithoutOrganizationsInput, organization_subscriptionsUncheckedCreateWithoutOrganizationsInput> | organization_subscriptionsCreateWithoutOrganizationsInput[] | organization_subscriptionsUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: organization_subscriptionsCreateOrConnectWithoutOrganizationsInput | organization_subscriptionsCreateOrConnectWithoutOrganizationsInput[]
    upsert?: organization_subscriptionsUpsertWithWhereUniqueWithoutOrganizationsInput | organization_subscriptionsUpsertWithWhereUniqueWithoutOrganizationsInput[]
    createMany?: organization_subscriptionsCreateManyOrganizationsInputEnvelope
    set?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    disconnect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    delete?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    connect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    update?: organization_subscriptionsUpdateWithWhereUniqueWithoutOrganizationsInput | organization_subscriptionsUpdateWithWhereUniqueWithoutOrganizationsInput[]
    updateMany?: organization_subscriptionsUpdateManyWithWhereWithoutOrganizationsInput | organization_subscriptionsUpdateManyWithWhereWithoutOrganizationsInput[]
    deleteMany?: organization_subscriptionsScalarWhereInput | organization_subscriptionsScalarWhereInput[]
  }

  export type organization_subscriptionsCreateNestedManyWithoutSubscription_plansInput = {
    create?: XOR<organization_subscriptionsCreateWithoutSubscription_plansInput, organization_subscriptionsUncheckedCreateWithoutSubscription_plansInput> | organization_subscriptionsCreateWithoutSubscription_plansInput[] | organization_subscriptionsUncheckedCreateWithoutSubscription_plansInput[]
    connectOrCreate?: organization_subscriptionsCreateOrConnectWithoutSubscription_plansInput | organization_subscriptionsCreateOrConnectWithoutSubscription_plansInput[]
    createMany?: organization_subscriptionsCreateManySubscription_plansInputEnvelope
    connect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
  }

  export type organization_subscriptionsUncheckedCreateNestedManyWithoutSubscription_plansInput = {
    create?: XOR<organization_subscriptionsCreateWithoutSubscription_plansInput, organization_subscriptionsUncheckedCreateWithoutSubscription_plansInput> | organization_subscriptionsCreateWithoutSubscription_plansInput[] | organization_subscriptionsUncheckedCreateWithoutSubscription_plansInput[]
    connectOrCreate?: organization_subscriptionsCreateOrConnectWithoutSubscription_plansInput | organization_subscriptionsCreateOrConnectWithoutSubscription_plansInput[]
    createMany?: organization_subscriptionsCreateManySubscription_plansInputEnvelope
    connect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
  }

  export type organization_subscriptionsUpdateManyWithoutSubscription_plansNestedInput = {
    create?: XOR<organization_subscriptionsCreateWithoutSubscription_plansInput, organization_subscriptionsUncheckedCreateWithoutSubscription_plansInput> | organization_subscriptionsCreateWithoutSubscription_plansInput[] | organization_subscriptionsUncheckedCreateWithoutSubscription_plansInput[]
    connectOrCreate?: organization_subscriptionsCreateOrConnectWithoutSubscription_plansInput | organization_subscriptionsCreateOrConnectWithoutSubscription_plansInput[]
    upsert?: organization_subscriptionsUpsertWithWhereUniqueWithoutSubscription_plansInput | organization_subscriptionsUpsertWithWhereUniqueWithoutSubscription_plansInput[]
    createMany?: organization_subscriptionsCreateManySubscription_plansInputEnvelope
    set?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    disconnect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    delete?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    connect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    update?: organization_subscriptionsUpdateWithWhereUniqueWithoutSubscription_plansInput | organization_subscriptionsUpdateWithWhereUniqueWithoutSubscription_plansInput[]
    updateMany?: organization_subscriptionsUpdateManyWithWhereWithoutSubscription_plansInput | organization_subscriptionsUpdateManyWithWhereWithoutSubscription_plansInput[]
    deleteMany?: organization_subscriptionsScalarWhereInput | organization_subscriptionsScalarWhereInput[]
  }

  export type organization_subscriptionsUncheckedUpdateManyWithoutSubscription_plansNestedInput = {
    create?: XOR<organization_subscriptionsCreateWithoutSubscription_plansInput, organization_subscriptionsUncheckedCreateWithoutSubscription_plansInput> | organization_subscriptionsCreateWithoutSubscription_plansInput[] | organization_subscriptionsUncheckedCreateWithoutSubscription_plansInput[]
    connectOrCreate?: organization_subscriptionsCreateOrConnectWithoutSubscription_plansInput | organization_subscriptionsCreateOrConnectWithoutSubscription_plansInput[]
    upsert?: organization_subscriptionsUpsertWithWhereUniqueWithoutSubscription_plansInput | organization_subscriptionsUpsertWithWhereUniqueWithoutSubscription_plansInput[]
    createMany?: organization_subscriptionsCreateManySubscription_plansInputEnvelope
    set?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    disconnect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    delete?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    connect?: organization_subscriptionsWhereUniqueInput | organization_subscriptionsWhereUniqueInput[]
    update?: organization_subscriptionsUpdateWithWhereUniqueWithoutSubscription_plansInput | organization_subscriptionsUpdateWithWhereUniqueWithoutSubscription_plansInput[]
    updateMany?: organization_subscriptionsUpdateManyWithWhereWithoutSubscription_plansInput | organization_subscriptionsUpdateManyWithWhereWithoutSubscription_plansInput[]
    deleteMany?: organization_subscriptionsScalarWhereInput | organization_subscriptionsScalarWhereInput[]
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type organizationsCreateWithoutOrganization_databasesInput = {
    id?: bigint | number
    name: string
    slug: string
    type?: string | null
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    organization_subscriptions?: organization_subscriptionsCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsUncheckedCreateWithoutOrganization_databasesInput = {
    id?: bigint | number
    name: string
    slug: string
    type?: string | null
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    organization_subscriptions?: organization_subscriptionsUncheckedCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsCreateOrConnectWithoutOrganization_databasesInput = {
    where: organizationsWhereUniqueInput
    create: XOR<organizationsCreateWithoutOrganization_databasesInput, organizationsUncheckedCreateWithoutOrganization_databasesInput>
  }

  export type organizationsUpsertWithoutOrganization_databasesInput = {
    update: XOR<organizationsUpdateWithoutOrganization_databasesInput, organizationsUncheckedUpdateWithoutOrganization_databasesInput>
    create: XOR<organizationsCreateWithoutOrganization_databasesInput, organizationsUncheckedCreateWithoutOrganization_databasesInput>
    where?: organizationsWhereInput
  }

  export type organizationsUpdateToOneWithWhereWithoutOrganization_databasesInput = {
    where?: organizationsWhereInput
    data: XOR<organizationsUpdateWithoutOrganization_databasesInput, organizationsUncheckedUpdateWithoutOrganization_databasesInput>
  }

  export type organizationsUpdateWithoutOrganization_databasesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization_subscriptions?: organization_subscriptionsUpdateManyWithoutOrganizationsNestedInput
  }

  export type organizationsUncheckedUpdateWithoutOrganization_databasesInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization_subscriptions?: organization_subscriptionsUncheckedUpdateManyWithoutOrganizationsNestedInput
  }

  export type organizationsCreateWithoutOrganization_subscriptionsInput = {
    id?: bigint | number
    name: string
    slug: string
    type?: string | null
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    organization_databases?: organization_databasesCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsUncheckedCreateWithoutOrganization_subscriptionsInput = {
    id?: bigint | number
    name: string
    slug: string
    type?: string | null
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
    organization_databases?: organization_databasesUncheckedCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsCreateOrConnectWithoutOrganization_subscriptionsInput = {
    where: organizationsWhereUniqueInput
    create: XOR<organizationsCreateWithoutOrganization_subscriptionsInput, organizationsUncheckedCreateWithoutOrganization_subscriptionsInput>
  }

  export type subscription_plansCreateWithoutOrganization_subscriptionsInput = {
    id?: bigint | number
    name: string
    code: string
    max_users?: number
    features_json?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type subscription_plansUncheckedCreateWithoutOrganization_subscriptionsInput = {
    id?: bigint | number
    name: string
    code: string
    max_users?: number
    features_json?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type subscription_plansCreateOrConnectWithoutOrganization_subscriptionsInput = {
    where: subscription_plansWhereUniqueInput
    create: XOR<subscription_plansCreateWithoutOrganization_subscriptionsInput, subscription_plansUncheckedCreateWithoutOrganization_subscriptionsInput>
  }

  export type organizationsUpsertWithoutOrganization_subscriptionsInput = {
    update: XOR<organizationsUpdateWithoutOrganization_subscriptionsInput, organizationsUncheckedUpdateWithoutOrganization_subscriptionsInput>
    create: XOR<organizationsCreateWithoutOrganization_subscriptionsInput, organizationsUncheckedCreateWithoutOrganization_subscriptionsInput>
    where?: organizationsWhereInput
  }

  export type organizationsUpdateToOneWithWhereWithoutOrganization_subscriptionsInput = {
    where?: organizationsWhereInput
    data: XOR<organizationsUpdateWithoutOrganization_subscriptionsInput, organizationsUncheckedUpdateWithoutOrganization_subscriptionsInput>
  }

  export type organizationsUpdateWithoutOrganization_subscriptionsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization_databases?: organization_databasesUpdateManyWithoutOrganizationsNestedInput
  }

  export type organizationsUncheckedUpdateWithoutOrganization_subscriptionsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization_databases?: organization_databasesUncheckedUpdateManyWithoutOrganizationsNestedInput
  }

  export type subscription_plansUpsertWithoutOrganization_subscriptionsInput = {
    update: XOR<subscription_plansUpdateWithoutOrganization_subscriptionsInput, subscription_plansUncheckedUpdateWithoutOrganization_subscriptionsInput>
    create: XOR<subscription_plansCreateWithoutOrganization_subscriptionsInput, subscription_plansUncheckedCreateWithoutOrganization_subscriptionsInput>
    where?: subscription_plansWhereInput
  }

  export type subscription_plansUpdateToOneWithWhereWithoutOrganization_subscriptionsInput = {
    where?: subscription_plansWhereInput
    data: XOR<subscription_plansUpdateWithoutOrganization_subscriptionsInput, subscription_plansUncheckedUpdateWithoutOrganization_subscriptionsInput>
  }

  export type subscription_plansUpdateWithoutOrganization_subscriptionsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    max_users?: IntFieldUpdateOperationsInput | number
    features_json?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscription_plansUncheckedUpdateWithoutOrganization_subscriptionsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    max_users?: IntFieldUpdateOperationsInput | number
    features_json?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_databasesCreateWithoutOrganizationsInput = {
    id?: bigint | number
    database_name: string
    host: string
    port?: number
    username: string
    password: string
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organization_databasesUncheckedCreateWithoutOrganizationsInput = {
    id?: bigint | number
    database_name: string
    host: string
    port?: number
    username: string
    password: string
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organization_databasesCreateOrConnectWithoutOrganizationsInput = {
    where: organization_databasesWhereUniqueInput
    create: XOR<organization_databasesCreateWithoutOrganizationsInput, organization_databasesUncheckedCreateWithoutOrganizationsInput>
  }

  export type organization_databasesCreateManyOrganizationsInputEnvelope = {
    data: organization_databasesCreateManyOrganizationsInput | organization_databasesCreateManyOrganizationsInput[]
    skipDuplicates?: boolean
  }

  export type organization_subscriptionsCreateWithoutOrganizationsInput = {
    id?: bigint | number
    status?: string
    start_date?: Date | string | null
    end_date?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    subscription_plans: subscription_plansCreateNestedOneWithoutOrganization_subscriptionsInput
  }

  export type organization_subscriptionsUncheckedCreateWithoutOrganizationsInput = {
    id?: bigint | number
    subscription_plan_id: bigint | number
    status?: string
    start_date?: Date | string | null
    end_date?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organization_subscriptionsCreateOrConnectWithoutOrganizationsInput = {
    where: organization_subscriptionsWhereUniqueInput
    create: XOR<organization_subscriptionsCreateWithoutOrganizationsInput, organization_subscriptionsUncheckedCreateWithoutOrganizationsInput>
  }

  export type organization_subscriptionsCreateManyOrganizationsInputEnvelope = {
    data: organization_subscriptionsCreateManyOrganizationsInput | organization_subscriptionsCreateManyOrganizationsInput[]
    skipDuplicates?: boolean
  }

  export type organization_databasesUpsertWithWhereUniqueWithoutOrganizationsInput = {
    where: organization_databasesWhereUniqueInput
    update: XOR<organization_databasesUpdateWithoutOrganizationsInput, organization_databasesUncheckedUpdateWithoutOrganizationsInput>
    create: XOR<organization_databasesCreateWithoutOrganizationsInput, organization_databasesUncheckedCreateWithoutOrganizationsInput>
  }

  export type organization_databasesUpdateWithWhereUniqueWithoutOrganizationsInput = {
    where: organization_databasesWhereUniqueInput
    data: XOR<organization_databasesUpdateWithoutOrganizationsInput, organization_databasesUncheckedUpdateWithoutOrganizationsInput>
  }

  export type organization_databasesUpdateManyWithWhereWithoutOrganizationsInput = {
    where: organization_databasesScalarWhereInput
    data: XOR<organization_databasesUpdateManyMutationInput, organization_databasesUncheckedUpdateManyWithoutOrganizationsInput>
  }

  export type organization_databasesScalarWhereInput = {
    AND?: organization_databasesScalarWhereInput | organization_databasesScalarWhereInput[]
    OR?: organization_databasesScalarWhereInput[]
    NOT?: organization_databasesScalarWhereInput | organization_databasesScalarWhereInput[]
    id?: BigIntFilter<"organization_databases"> | bigint | number
    organization_id?: BigIntFilter<"organization_databases"> | bigint | number
    database_name?: StringFilter<"organization_databases"> | string
    host?: StringFilter<"organization_databases"> | string
    port?: IntFilter<"organization_databases"> | number
    username?: StringFilter<"organization_databases"> | string
    password?: StringFilter<"organization_databases"> | string
    status?: StringFilter<"organization_databases"> | string
    created_at?: DateTimeNullableFilter<"organization_databases"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"organization_databases"> | Date | string | null
  }

  export type organization_subscriptionsUpsertWithWhereUniqueWithoutOrganizationsInput = {
    where: organization_subscriptionsWhereUniqueInput
    update: XOR<organization_subscriptionsUpdateWithoutOrganizationsInput, organization_subscriptionsUncheckedUpdateWithoutOrganizationsInput>
    create: XOR<organization_subscriptionsCreateWithoutOrganizationsInput, organization_subscriptionsUncheckedCreateWithoutOrganizationsInput>
  }

  export type organization_subscriptionsUpdateWithWhereUniqueWithoutOrganizationsInput = {
    where: organization_subscriptionsWhereUniqueInput
    data: XOR<organization_subscriptionsUpdateWithoutOrganizationsInput, organization_subscriptionsUncheckedUpdateWithoutOrganizationsInput>
  }

  export type organization_subscriptionsUpdateManyWithWhereWithoutOrganizationsInput = {
    where: organization_subscriptionsScalarWhereInput
    data: XOR<organization_subscriptionsUpdateManyMutationInput, organization_subscriptionsUncheckedUpdateManyWithoutOrganizationsInput>
  }

  export type organization_subscriptionsScalarWhereInput = {
    AND?: organization_subscriptionsScalarWhereInput | organization_subscriptionsScalarWhereInput[]
    OR?: organization_subscriptionsScalarWhereInput[]
    NOT?: organization_subscriptionsScalarWhereInput | organization_subscriptionsScalarWhereInput[]
    id?: BigIntFilter<"organization_subscriptions"> | bigint | number
    organization_id?: BigIntFilter<"organization_subscriptions"> | bigint | number
    subscription_plan_id?: BigIntFilter<"organization_subscriptions"> | bigint | number
    status?: StringFilter<"organization_subscriptions"> | string
    start_date?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
    end_date?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
    created_at?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"organization_subscriptions"> | Date | string | null
  }

  export type organization_subscriptionsCreateWithoutSubscription_plansInput = {
    id?: bigint | number
    status?: string
    start_date?: Date | string | null
    end_date?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    organizations: organizationsCreateNestedOneWithoutOrganization_subscriptionsInput
  }

  export type organization_subscriptionsUncheckedCreateWithoutSubscription_plansInput = {
    id?: bigint | number
    organization_id: bigint | number
    status?: string
    start_date?: Date | string | null
    end_date?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organization_subscriptionsCreateOrConnectWithoutSubscription_plansInput = {
    where: organization_subscriptionsWhereUniqueInput
    create: XOR<organization_subscriptionsCreateWithoutSubscription_plansInput, organization_subscriptionsUncheckedCreateWithoutSubscription_plansInput>
  }

  export type organization_subscriptionsCreateManySubscription_plansInputEnvelope = {
    data: organization_subscriptionsCreateManySubscription_plansInput | organization_subscriptionsCreateManySubscription_plansInput[]
    skipDuplicates?: boolean
  }

  export type organization_subscriptionsUpsertWithWhereUniqueWithoutSubscription_plansInput = {
    where: organization_subscriptionsWhereUniqueInput
    update: XOR<organization_subscriptionsUpdateWithoutSubscription_plansInput, organization_subscriptionsUncheckedUpdateWithoutSubscription_plansInput>
    create: XOR<organization_subscriptionsCreateWithoutSubscription_plansInput, organization_subscriptionsUncheckedCreateWithoutSubscription_plansInput>
  }

  export type organization_subscriptionsUpdateWithWhereUniqueWithoutSubscription_plansInput = {
    where: organization_subscriptionsWhereUniqueInput
    data: XOR<organization_subscriptionsUpdateWithoutSubscription_plansInput, organization_subscriptionsUncheckedUpdateWithoutSubscription_plansInput>
  }

  export type organization_subscriptionsUpdateManyWithWhereWithoutSubscription_plansInput = {
    where: organization_subscriptionsScalarWhereInput
    data: XOR<organization_subscriptionsUpdateManyMutationInput, organization_subscriptionsUncheckedUpdateManyWithoutSubscription_plansInput>
  }

  export type organization_databasesCreateManyOrganizationsInput = {
    id?: bigint | number
    database_name: string
    host: string
    port?: number
    username: string
    password: string
    status?: string
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organization_subscriptionsCreateManyOrganizationsInput = {
    id?: bigint | number
    subscription_plan_id: bigint | number
    status?: string
    start_date?: Date | string | null
    end_date?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organization_databasesUpdateWithoutOrganizationsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    database_name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_databasesUncheckedUpdateWithoutOrganizationsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    database_name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_databasesUncheckedUpdateManyWithoutOrganizationsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    database_name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_subscriptionsUpdateWithoutOrganizationsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscription_plans?: subscription_plansUpdateOneRequiredWithoutOrganization_subscriptionsNestedInput
  }

  export type organization_subscriptionsUncheckedUpdateWithoutOrganizationsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    subscription_plan_id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_subscriptionsUncheckedUpdateManyWithoutOrganizationsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    subscription_plan_id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_subscriptionsCreateManySubscription_plansInput = {
    id?: bigint | number
    organization_id: bigint | number
    status?: string
    start_date?: Date | string | null
    end_date?: Date | string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type organization_subscriptionsUpdateWithoutSubscription_plansInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organizations?: organizationsUpdateOneRequiredWithoutOrganization_subscriptionsNestedInput
  }

  export type organization_subscriptionsUncheckedUpdateWithoutSubscription_plansInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    organization_id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type organization_subscriptionsUncheckedUpdateManyWithoutSubscription_plansInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    organization_id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}