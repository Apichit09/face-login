import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Face enroll route is not used directly because register page already includes enrollment.",
  });
}