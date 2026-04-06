import { NextResponse } from "next/server";

export function APIResponse(
  success: boolean,
  message: string,
  data?: any,
  status: number = success ? 200 : 400
) {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status }
  );
}
