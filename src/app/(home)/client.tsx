"use client";
import React from "react";
import { trpc } from "@/trpc/client";

const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "Stuart",
  });
  return <div>Page client says: {data.greeting}</div>;
};

export default PageClient;
