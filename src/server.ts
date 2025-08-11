// server.ts
import { HttpLayerRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Layer } from "effect";
import { FooHandler } from "./handlers.js";
import { FooGroup } from "./request.js";

const Main = Layer.empty.pipe(
  Layer.provide(
    RpcServer.layerHttpRouter({
      group: FooGroup,
      path: "/rpc/http",
      protocol: "http",
    })
  ),
  Layer.provide(
    RpcServer.layerHttpRouter({
      group: FooGroup,
      path: "/rpc/http2",
      protocol: "http",
    })
  ),
  Layer.provide(
    RpcServer.layerHttpRouter({
      group: FooGroup,
      path: "/rpc/socket",
      protocol: "websocket",
    })
  ),
  Layer.provide(RpcSerialization.layerJson),
  Layer.provide(FooHandler),
  HttpLayerRouter.serve,
  Layer.provide(BunHttpServer.layer({ port: 3000 }))
);

BunRuntime.runMain(Layer.launch(Main));
