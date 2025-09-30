"use client";
import { ofetch } from "ofetch";

export const api = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_TEST_API,
  retry: false,

  async onRequest() {},
  async onResponseError({ response }) {
    const { _data } = response;

    return Promise.reject(_data); // default Error from backend
  },
});
