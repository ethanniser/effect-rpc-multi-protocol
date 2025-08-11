// server.ts
import { HttpLayerRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Layer } from "effect";
import { OneHandler, TwoHandler } from "./handlers.js";
import { OneRpcs, TwoRpcs } from "./request.js";

const Main = Layer.empty.pipe(
  Layer.provide(
    RpcServer.layerHttpRouter({
      group: OneRpcs,
      path: "/rpc/http",
      protocol: "http",
    })
  ),
  Layer.provide(
    RpcServer.layerHttpRouter({
      group: TwoRpcs,
      path: "/rpc/socket",
      protocol: "websocket",
    })
  ),
  Layer.provide(RpcSerialization.layerJson),
  Layer.provide(OneHandler),
  Layer.provide(TwoHandler),
  HttpLayerRouter.serve,
  Layer.provide(BunHttpServer.layer({ port: 3000 }))
);

BunRuntime.runMain(Layer.launch(Main));
