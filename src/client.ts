import { FetchHttpClient, Socket } from "@effect/platform";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Console, Effect, Layer } from "effect";
import { FooGroup } from "./request.js";
import { NodeRuntime } from "@effect/platform-node";

const makeOne = RpcClient.make(FooGroup).pipe(
  Effect.provide(
    RpcClient.layerProtocolHttp({
      url: `http://localhost:3000/rpc/http`,
    }).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerJson]))
  )
);

const makeTwoHttp = RpcClient.make(FooGroup).pipe(
  Effect.provide(
    RpcClient.layerProtocolHttp({
      url: `http://localhost:3000/rpc/http2`,
    }).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerJson]))
  )
);

const makeTwoSocket = RpcClient.make(FooGroup).pipe(
  Effect.provide(
    RpcClient.layerProtocolSocket({
      retryTransientErrors: true,
    }).pipe(
      Layer.provide([
        RpcSerialization.layerJson,
        Socket.layerWebSocket(`ws://localhost:3000/rpc/socket`).pipe(
          Layer.provide(Socket.layerWebSocketConstructorGlobal)
        ),
      ])
    )
  )
);

const program = Effect.gen(function* () {
  const one = yield* makeOne;
  const twoHttp = yield* makeTwoHttp;
  const twoSocket = yield* makeTwoSocket;
  const client = {
    one,
    twoHttp,
    twoSocket,
  } as const;
  console.log("one");
  yield* client.one
    .Foo()
    .pipe(Effect.andThen(Console.log), Effect.ignoreLogged);
  console.log("twoHttp");
  yield* client.twoHttp
    .Foo()
    .pipe(Effect.andThen(Console.log), Effect.ignoreLogged);
  console.log("twoSocket");
  yield* client.twoSocket
    .Foo()
    .pipe(Effect.andThen(Console.log), Effect.ignoreLogged);
}).pipe(Effect.scoped);

NodeRuntime.runMain(program);
